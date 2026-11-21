import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const summaryColumns: ReportColumn[] = [
  { key: "name", labelEn: "Partner Name", labelBn: "অংশীদারের নাম" },
  { key: "phone", labelEn: "Phone / Contact", labelBn: "ফোন / যোগাযোগ" },
  { key: "projectsCount", labelEn: "Active Projects", labelBn: "সক্রিয় প্রকল্প", type: "number", align: "center" },
  { key: "openingBalance", labelEn: "Opening (B/F)", labelBn: "প্রারম্ভিক (টাকা)", type: "number", align: "right" },
  { key: "deposited", labelEn: "Capital Deposits (Cr)", labelBn: "মূলধন জমা (টাকা)", type: "number", align: "right" },
  { key: "directExpenses", labelEn: "Direct Expenses (Cr)", labelBn: "সরাসরি ব্যয় (টাকা)", type: "number", align: "right" },
  { key: "profitReceived", labelEn: "Profit Share (Cr)", labelBn: "মুনাফা বণ্টন (টাকা)", type: "number", align: "right" },
  { key: "withdrawn", labelEn: "Drawings (Dr)", labelBn: "উত্তোলন (টাকা)", type: "number", align: "right" },
  { key: "balance", labelEn: "Net Equity Balance (BDT)", labelBn: "চলতি ব্যালেন্স (টাকা)", type: "number", align: "right" },
  { key: "equityShare", labelEn: "Syndicate Share %", labelBn: "ইকুইটি শেয়ার %", type: "number", align: "right" },
];

export interface PartnerSummaryItem {
  id: string;
  name: string;
  phone: string;
  nidNumber?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  projectsCount: number;
  projects: {
    projectId: string;
    projectName: string;
    sharePercentage: number;
  }[];
  openingBalance: number;
  deposited: number;
  directExpenses: number;
  profitReceived: number;
  totalAdditions: number;
  withdrawn: number;
  balance: number;
  equityShare: number; // percentage of total syndicate equity
}

export interface PartnersSummaryData extends ReportData {
  partners: PartnerSummaryItem[];
  kpis: {
    totalSyndicateEquity: number;
    totalDeposited: number;
    totalDirectExpenses: number;
    totalProfitReceived: number;
    totalCapitalAdditions: number;
    totalWithdrawn: number;
    activePartnerCount: number;
  };
}

export async function queryPartnersSummary(prisma: any, filters?: ReportFilters): Promise<PartnersSummaryData> {
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
        orderBy: [{ txnDate: "asc" }, { createdAt: "asc" }],
      },
    },
    orderBy: { name: "asc" },
  });

  const fromDate = filters?.from ? new Date(filters.from) : null;
  const toDate = filters?.to ? new Date(filters.to) : null;
  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
  }

  // First pass: compute balances
  const calculatedPartners = rawPartners.map((p: any) => {
    let opening = toNum(p.openingBalance);
    let deposited = 0;
    let directExpenses = 0;
    let profitReceived = 0;
    let withdrawn = 0;

    for (const t of p.partnerTransactions || []) {
      const amt = toNum(t.amount);
      const isCredit = ["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType);
      const txnDate = new Date(t.txnDate);

      if (fromDate && txnDate < fromDate) {
        opening += isCredit ? amt : -amt;
      } else if (!toDate || txnDate <= toDate) {
        if (t.txnType === "DEPOSIT") deposited += amt;
        else if (t.txnType === "DIRECT_EXPENSE") directExpenses += amt;
        else if (t.txnType === "PROFIT_CREDIT") profitReceived += amt;
        else if (t.txnType === "WITHDRAWAL") withdrawn += amt;
      }
    }

    const totalAdditions = deposited + directExpenses + profitReceived;
    const balance = opening + totalAdditions - withdrawn;

    const projects = (p.projectPartners || []).map((pp: any) => ({
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
      bankAccountNumber: p.bankAccountNumber,
      projectsCount: projects.length,
      projects,
      openingBalance: opening,
      deposited,
      directExpenses,
      profitReceived,
      totalAdditions,
      withdrawn,
      balance,
      equityShare: 0, // will compute after sum
    };
  });

  // Calculate syndicate totals
  const totalSyndicateEquity = calculatedPartners.reduce((s, p) => s + p.balance, 0);
  const totalDeposited = calculatedPartners.reduce((s, p) => s + p.deposited, 0);
  const totalDirectExpenses = calculatedPartners.reduce((s, p) => s + p.directExpenses, 0);
  const totalProfitReceived = calculatedPartners.reduce((s, p) => s + p.profitReceived, 0);
  const totalWithdrawn = calculatedPartners.reduce((s, p) => s + p.withdrawn, 0);
  const totalCapitalAdditions = totalDeposited + totalDirectExpenses + totalProfitReceived;

  // Second pass: compute equity share %
  const partners: PartnerSummaryItem[] = calculatedPartners.map((p) => ({
    ...p,
    equityShare: totalSyndicateEquity > 0 ? (p.balance / totalSyndicateEquity) * 100 : 0,
  }));

  // Standard legacy rows for Excel/fallback
  const legacyRows = partners.map((p) => ({
    name: p.name,
    phone: p.phone,
    projectsCount: p.projectsCount,
    openingBalance: p.openingBalance,
    deposited: p.deposited,
    directExpenses: p.directExpenses,
    profitReceived: p.profitReceived,
    withdrawn: p.withdrawn,
    balance: p.balance,
    equityShare: p.equityShare.toFixed(2) + "%",
  }));

  return {
    columns: summaryColumns,
    rows: legacyRows,
    totals: {
      deposited: totalDeposited,
      directExpenses: totalDirectExpenses,
      profitReceived: totalProfitReceived,
      withdrawn: totalWithdrawn,
      balance: totalSyndicateEquity,
    },
    partners,
    kpis: {
      totalSyndicateEquity,
      totalDeposited,
      totalDirectExpenses,
      totalProfitReceived,
      totalCapitalAdditions,
      totalWithdrawn,
      activePartnerCount: partners.length,
    },
  };
}
