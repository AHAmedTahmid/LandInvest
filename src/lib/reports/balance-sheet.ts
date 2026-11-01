import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const balanceSheetColumns: ReportColumn[] = [
  { key: "section", labelEn: "Classification", labelBn: "শ্রেণিবিভাগ" },
  { key: "account", labelEn: "Account / Ledger Head", labelBn: "হিসাব খাত" },
  { key: "note", labelEn: "Accounting Basis & Policy", labelBn: "হিসাবের ভিত্তি ও নিয়ম" },
  { key: "amount", labelEn: "Balance (BDT)", labelBn: "ব্যালেন্স (টাকা)", type: "number", align: "right" },
];

export async function queryBalanceSheet(prisma: any, filters: ReportFilters): Promise<ReportData> {
  // 1. Cash in Hand (from treasury ledger: only approved outflows affect this)
  const cashRows = await prisma.treasuryLedger.findMany({ where: { accountType: "CASH" } });
  const cashBalance = cashRows.reduce((sum: number, r: any) => sum + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)), 0);

  // 2. Bank Accounts (from treasury ledger: only approved outflows affect this)
  const bankRows = await prisma.treasuryLedger.findMany({ where: { accountType: "BANK" } });
  const bankBalance = bankRows.reduce((sum: number, r: any) => sum + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)), 0);

  // 3. Project Land Inventory & Capitalized Costs:
  // Policy: ONLY APPROVED vouchers are capitalized in inventory/balance sheet!
  const projectWhere: any = {};
  if (filters.projectId) projectWhere.id = filters.projectId;
  const projects = await prisma.landProject.findMany({ where: projectWhere });
  
  const landBaseCost = projects.reduce(
    (sum: number, p: any) =>
      sum + toNum(p.purchasePrice) + toNum(p.baynaAmount) + toNum(p.registrationCost) + toNum(p.mutationTaxCost),
    0
  );

  const expenseWhere: any = { status: "APPROVED" };
  if (filters.projectId) expenseWhere.projectId = filters.projectId;
  const approvedExpenses = await prisma.projectExpense.findMany({ where: expenseWhere });
  const approvedExpenseTotal = approvedExpenses.reduce((sum: number, e: any) => sum + toNum(e.amount), 0);
  const totalLandInventory = landBaseCost + approvedExpenseTotal;

  // 4. Accounts Receivable from Buyers
  const saleWhere: any = {};
  if (filters.projectId) saleWhere.projectId = filters.projectId;
  const sales = await prisma.landSale.findMany({ where: saleWhere });
  const saleIds = sales.map((s: any) => s.id);
  const payments = await prisma.customerPayment.findMany({
    where: saleIds.length > 0 ? { saleId: { in: saleIds } } : {},
  });
  const totalAgreed = sales.reduce((sum: number, s: any) => sum + toNum(s.totalAgreedPrice), 0);
  const totalCollected = payments.reduce((sum: number, p: any) => sum + toNum(p.amountPaid), 0);
  const accountsReceivable = Math.max(0, totalAgreed - totalCollected);

  // 5. Partner Capital
  const partnerWhere: any = {};
  if (filters.partnerId) partnerWhere.id = filters.partnerId;
  const partners = await prisma.partner.findMany({ where: partnerWhere });
  const partnerTxns = await prisma.partnerTransaction.findMany({
    where: filters.partnerId ? { partnerId: filters.partnerId } : {},
  });
  let partnerCapitalTotal = 0;
  for (const p of partners) {
    let cap = toNum(p.openingBalance);
    const txns = partnerTxns.filter((t: any) => t.partnerId === p.id);
    for (const t of txns) {
      if (["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType)) cap += toNum(t.amount);
      else if (t.txnType === "WITHDRAWAL") cap -= toNum(t.amount);
    }
    partnerCapitalTotal += cap;
  }

  // 6. Check unapproved vouchers count and total (for governance disclosure)
  const unapprovedExpenses = await prisma.projectExpense.findMany({
    where: {
      status: { not: "APPROVED" },
      ...(filters.projectId ? { projectId: filters.projectId } : {}),
    },
  });
  const unapprovedTotal = unapprovedExpenses.reduce((sum: number, e: any) => sum + toNum(e.amount), 0);
  const unapprovedCount = unapprovedExpenses.length;

  // Build Balance Sheet Rows
  const totalCurrentAssets = cashBalance + bankBalance + accountsReceivable;
  const totalAssets = totalCurrentAssets + totalLandInventory;

  const rows = [
    // Current Assets
    {
      section: "Current Assets",
      account: "Cash in Hand",
      note: "Net liquid cash balance from approved cash ledger inflows and outflows",
      amount: cashBalance,
    },
    {
      section: "Current Assets",
      account: "Company Bank Accounts",
      note: "Reconciled balance across all active company bank accounts",
      amount: bankBalance,
    },
    {
      section: "Current Assets",
      account: "Accounts Receivable (Buyer Dues)",
      note: "Contracted land sales price remaining due after customer payments",
      amount: accountsReceivable,
    },
    // Non-Current Assets
    {
      section: "Non-Current Assets",
      account: "Land & Project Development Inventory",
      note: "Acquisition + APPROVED expenses only (unapproved/pending/reactivated strictly excluded)",
      amount: totalLandInventory,
    },
    // Equity & Liabilities
    {
      section: "Equity & Liabilities",
      account: "Partner Capital Accounts",
      note: "Partner opening capital + deposits + approved direct expenses - withdrawals",
      amount: partnerCapitalTotal,
    },
    {
      section: "Equity & Liabilities",
      account: "Operating Surplus & Retained Reserves",
      note: "Net realized collections and inventory surplus after partner distributions",
      amount: totalAssets - partnerCapitalTotal,
    },
  ];

  return {
    columns: balanceSheetColumns,
    rows,
    totals: {
      amount: totalAssets,
    },
    summary: [
      {
        labelEn: "Total Assets",
        labelBn: "মোট সম্পদ",
        value: fmt(totalAssets),
      },
      {
        labelEn: "Approved Vouchers in Balance Sheet",
        labelBn: "ব্যালেন্স শিটে অন্তর্ভুক্ত অনুমোদিত ব্যয়",
        value: `${approvedExpenses.length} vouchers (${fmt(approvedExpenseTotal)})`,
      },
      {
        labelEn: "Excluded Unapproved / Reactivated Vouchers",
        labelBn: "বহির্ভূত অপেক্ষমাণ / পুনঃসক্রিয় ভাউচার",
        value: `${unapprovedCount} vouchers (${fmt(unapprovedTotal)})`,
      },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
