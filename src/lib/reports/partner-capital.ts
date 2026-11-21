import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const capitalColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "type", labelEn: "Transaction Type", labelBn: "লেনদেনের ধরন" },
  { key: "description", labelEn: "Particulars / Description", labelBn: "বিবরণ / খাত" },
  { key: "deposit", labelEn: "Credit / Addition (BDT)", labelBn: "জমা / মূলধন বৃদ্ধি (টাকা)", type: "number", align: "right" },
  { key: "withdrawal", labelEn: "Debit / Drawing (BDT)", labelBn: "উত্তোলন / হ্রাস (টাকা)", type: "number", align: "right" },
  { key: "balance", labelEn: "Cumulative Equity Balance (BDT)", labelBn: "চলতি ব্যালেন্স (টাকা)", type: "number", align: "right" },
];

export interface PartnerProjectInfo {
  projectId: string;
  projectName: string;
  sharePercentage: number;
}

export interface PartnerBasicInfo {
  id: string;
  name: string;
  phone: string;
  nidNumber?: string | null;
  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankBranch?: string | null;
  bankRoutingNumber?: string | null;
  openingBalance: number;
  currentBalance: number;
  projects: PartnerProjectInfo[];
}

export interface PartnerTransactionItem {
  id: string;
  date: string;
  txnType: "DEPOSIT" | "DIRECT_EXPENSE" | "PROFIT_CREDIT" | "WITHDRAWAL";
  typeLabelEn: string;
  typeLabelBn: string;
  description: string;
  projectName?: string | null;
  referenceId?: string | null;
  deposit: number | null;
  withdrawal: number | null;
  balance: number;
}

export interface PartnerCapitalData extends ReportData {
  partner: PartnerBasicInfo;
  allPartners: PartnerBasicInfo[];
  transactions: PartnerTransactionItem[];
  kpis: {
    openingBalance: number;
    totalDeposits: number;
    totalDirectExpenses: number;
    totalProfitCredits: number;
    totalCapitalAdditions: number;
    totalWithdrawals: number;
    netPeriodChange: number;
    closingBalance: number;
  };
}

export async function queryPartnerCapital(prisma: any, filters: ReportFilters): Promise<PartnerCapitalData> {
  // Fetch all active partners with their project associations
  const rawPartners: any[] = await prisma.partner.findMany({
    where: { isActive: true },
    include: {
      projectPartners: {
        include: {
          project: {
            select: { id: true, projectName: true },
          },
        },
      },
      partnerTransactions: {
        select: {
          txnType: true,
          amount: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // Calculate lifetime balance for each partner to display on partner selector cards
  const allPartners: PartnerBasicInfo[] = rawPartners.map((p: any) => {
    let bal = toNum(p.openingBalance);
    for (const t of p.partnerTransactions || []) {
      const amt = toNum(t.amount);
      const isCredit = ["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType);
      bal += isCredit ? amt : -amt;
    }
    const projects: PartnerProjectInfo[] = (p.projectPartners || []).map((pp: any) => ({
      projectId: pp.projectId,
      projectName: pp.project?.projectName || "Land Project",
      sharePercentage: toNum(pp.sharePercentage),
    }));

    return {
      id: p.id,
      name: p.name,
      phone: p.phone,
      nidNumber: p.nidNumber,
      bankName: p.bankName,
      bankAccountName: p.bankAccountName,
      bankAccountNumber: p.bankAccountNumber,
      bankBranch: p.bankBranch,
      bankRoutingNumber: p.bankRoutingNumber,
      openingBalance: toNum(p.openingBalance),
      currentBalance: bal,
      projects,
    };
  });

  // Identify target partner
  const selectedPartner = filters.partnerId
    ? allPartners.find((p) => p.id === filters.partnerId) || allPartners[0]
    : allPartners[0];

  if (!selectedPartner) {
    return {
      columns: capitalColumns,
      rows: [],
      totals: { deposit: 0, withdrawal: 0, balance: 0 },
      summary: [],
      partner: {
        id: "",
        name: "No Partner Found",
        phone: "",
        openingBalance: 0,
        currentBalance: 0,
        projects: [],
      },
      allPartners: [],
      transactions: [],
      kpis: {
        openingBalance: 0,
        totalDeposits: 0,
        totalDirectExpenses: 0,
        totalProfitCredits: 0,
        totalCapitalAdditions: 0,
        totalWithdrawals: 0,
        netPeriodChange: 0,
        closingBalance: 0,
      },
    };
  }

  // Fetch all transactions for this partner chronologically
  const allTxns: any[] = await prisma.partnerTransaction.findMany({
    where: { partnerId: selectedPartner.id },
    orderBy: [{ txnDate: "asc" }, { createdAt: "asc" }],
  });

  // Date boundaries
  const fromDate = filters.from ? new Date(filters.from) : null;
  const toDate = filters.to ? new Date(filters.to) : null;
  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
  }

  // Calculate opening balance prior to fromDate
  let runningBalance = selectedPartner.openingBalance;
  for (const t of allTxns) {
    const txnDateObj = new Date(t.txnDate);
    if (fromDate && txnDateObj < fromDate) {
      const amt = toNum(t.amount);
      const isCredit = ["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType);
      runningBalance += isCredit ? amt : -amt;
    }
  }

  const openingBalance = runningBalance;

  // Filter in-period transactions
  const inPeriodTxns = allTxns.filter((t: any) => {
    const txnDateObj = new Date(t.txnDate);
    if (fromDate && txnDateObj < fromDate) return false;
    if (toDate && txnDateObj > toDate) return false;
    return true;
  });

  let totalDeposits = 0;
  let totalDirectExpenses = 0;
  let totalProfitCredits = 0;
  let totalWithdrawals = 0;

  const transactions: PartnerTransactionItem[] = [];

  for (const t of inPeriodTxns) {
    const amt = toNum(t.amount);
    const isCredit = ["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType);

    if (t.txnType === "DEPOSIT") {
      totalDeposits += amt;
    } else if (t.txnType === "DIRECT_EXPENSE") {
      totalDirectExpenses += amt;
    } else if (t.txnType === "PROFIT_CREDIT") {
      totalProfitCredits += amt;
    } else if (t.txnType === "WITHDRAWAL") {
      totalWithdrawals += amt;
    }

    runningBalance += isCredit ? amt : -amt;

    let typeLabelEn = "Capital Addition";
    let typeLabelBn = "মূলধন জমা";
    if (t.txnType === "DEPOSIT") {
      typeLabelEn = "Capital Deposit";
      typeLabelBn = "নগদ/ব্যাংক মূলধন জমা";
    } else if (t.txnType === "DIRECT_EXPENSE") {
      typeLabelEn = "Direct Project Expense";
      typeLabelBn = "সরাসরি প্রকল্প ব্যয় প্রদান";
    } else if (t.txnType === "PROFIT_CREDIT") {
      typeLabelEn = "Realized Profit Distribution";
      typeLabelBn = "বণ্টনকৃত প্রকৃত মুনাফা জমা";
    } else if (t.txnType === "WITHDRAWAL") {
      typeLabelEn = "Drawings / Capital Withdrawal";
      typeLabelBn = "অংশীদার তহবিল উত্তোলন";
    }

    const dateStr = t.txnDate instanceof Date ? t.txnDate.toISOString().slice(0, 10) : String(t.txnDate).slice(0, 10);

    // Extract project name if available in notes
    let projectName: string | null = null;
    const match = (t.notes || "").match(/\(([^)]+)\)/);
    if (match) {
      projectName = match[1];
    }

    transactions.push({
      id: t.id,
      date: dateStr,
      txnType: t.txnType,
      typeLabelEn,
      typeLabelBn,
      description: t.notes || typeLabelEn,
      projectName,
      referenceId: t.referenceId,
      deposit: isCredit ? amt : null,
      withdrawal: !isCredit ? amt : null,
      balance: runningBalance,
    });
  }

  const totalCapitalAdditions = totalDeposits + totalDirectExpenses + totalProfitCredits;
  const netPeriodChange = totalCapitalAdditions - totalWithdrawals;
  const closingBalance = openingBalance + netPeriodChange;

  // Standard legacy rows for Excel / generic fallback
  const legacyRows = transactions.map((t) => ({
    date: t.date,
    type: t.typeLabelEn,
    description: t.description,
    deposit: t.deposit,
    withdrawal: t.withdrawal,
    balance: t.balance,
  }));

  return {
    columns: capitalColumns,
    rows: legacyRows,
    totals: {
      deposit: totalCapitalAdditions,
      withdrawal: totalWithdrawals,
      balance: closingBalance,
    },
    summary: [
      { labelEn: "Partner", labelBn: "অংশীদার", value: selectedPartner.name },
      { labelEn: "Opening Capital (B/F)", labelBn: "প্রারম্ভিক মূলধন", value: `৳ ${openingBalance.toLocaleString()}` },
      { labelEn: "Capital Additions", labelBn: "মোট মূলধন বৃদ্ধি", value: `৳ ${totalCapitalAdditions.toLocaleString()}` },
      { labelEn: "Capital Drawings", labelBn: "মোট তহবিল উত্তোলন", value: `৳ ${totalWithdrawals.toLocaleString()}` },
      { labelEn: "Closing Equity (C/D)", labelBn: "সমাপনী মূলধন ব্যালেন্স", value: `৳ ${closingBalance.toLocaleString()}` },
    ],
    partner: selectedPartner,
    allPartners,
    transactions,
    kpis: {
      openingBalance,
      totalDeposits,
      totalDirectExpenses,
      totalProfitCredits,
      totalCapitalAdditions,
      totalWithdrawals,
      netPeriodChange,
      closingBalance,
    },
  };
}
