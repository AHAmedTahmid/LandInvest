import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const bankBookColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "purpose", labelEn: "Purpose", labelBn: "উদ্দেশ্য" },
  { key: "reference", labelEn: "Reference", labelBn: "রেফারেন্স" },
  { key: "in", labelEn: "Bank In", labelBn: "ব্যাংক আদায়", type: "number", align: "right" },
  { key: "out", labelEn: "Bank Out", labelBn: "ব্যাংক পরিশোধ", type: "number", align: "right" },
  { key: "balance", labelEn: "Running Balance", labelBn: "চলতি ব্যালেন্স", type: "number", align: "right" },
];

export async function queryBankBook(prisma: any, filters: ReportFilters): Promise<ReportData> {
  // 1. Calculate true Opening Balance prior to filters.from
  let openingBalance = 0;
  if (filters.from) {
    const priorWhere: any = {
      accountType: "BANK",
      txnDate: { lt: new Date(filters.from) },
    };
    if (filters.bankAccountId) priorWhere.bankAccountId = filters.bankAccountId;
    const priorRows = await prisma.treasuryLedger.findMany({
      where: priorWhere,
      select: { flowType: true, amount: true },
    });
    for (const r of priorRows) {
      const amt = toNum(r.amount);
      openingBalance += r.flowType === "IN" ? amt : -amt;
    }
  }

  // 2. Fetch Bank transactions within selected date range
  const where: any = { accountType: "BANK" };
  if (filters.bankAccountId) where.bankAccountId = filters.bankAccountId;
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) where.txnDate.lte = new Date(filters.to);
  }
  const rows = await prisma.treasuryLedger.findMany({ where, orderBy: [{ txnDate: "asc" }, { createdAt: "asc" }] });
  const accounts = await prisma.bankAccount.findMany({ orderBy: { bankName: "asc" } });
  const accMap = new Map<string, any>(accounts.map((a: any) => [a.id, a]));

  let balance = openingBalance;
  const data = rows.map((r: any) => {
    const amt = toNum(r.amount);
    const isIn = r.flowType === "IN";
    balance += isIn ? amt : -amt;
    const acc = accMap.get(r.bankAccountId);
    return {
      id: r.id,
      date: r.txnDate,
      purpose: r.purpose,
      reference: r.referenceType,
      referenceType: r.referenceType,
      voucher: r.referenceId?.slice(0, 8) ?? "-",
      bankAccountId: r.bankAccountId,
      bankName: acc?.bankName ?? "Bank Account",
      accountNumber: acc?.accountNumber ?? "",
      branchName: acc?.branchName ?? "",
      amount: amt,
      flowType: r.flowType,
      in: isIn ? amt : null,
      out: !isIn ? amt : null,
      balance,
    };
  });

  const totalIn = data.reduce((s: number, r: any) => s + (r.in || 0), 0);
  const totalOut = data.reduce((s: number, r: any) => s + (r.out || 0), 0);
  const netMovement = totalIn - totalOut;
  const closingBalance = balance;

  const acc: any = filters.bankAccountId ? accMap.get(filters.bankAccountId) : null;
  const accName = acc ? `${acc.bankName} (${acc.accountNumber})` : "All Bank Accounts (Consolidated)";
  const accBalance = acc ? toNum(acc.currentBalance) : accounts.reduce((s: number, a: any) => s + toNum(a.currentBalance), 0);

  return {
    columns: bankBookColumns,
    rows: data,
    totals: { in: totalIn, out: totalOut, balance: closingBalance },
    summary: [
      { labelEn: "Selected Account Scope", labelBn: "নির্বাচিত ব্যাংক অ্যাকাউন্ট", value: accName },
      { labelEn: "Opening Balance (B/F)", labelBn: "প্রারম্ভিক ব্যাংক জের (B/F)", value: fmt(openingBalance) },
      { labelEn: "Total Deposits (Cr)", labelBn: "মোট ব্যাংক জমা / আদায়", value: fmt(totalIn) },
      { labelEn: "Total Withdrawals (Dr)", labelBn: "মোট ব্যাংক উত্তোলন / পরিশোধ", value: fmt(totalOut) },
      { labelEn: "Net Bank Movement", labelBn: "চলতি সময়ের নিট পরিবর্তন", value: `${netMovement >= 0 ? "+" : ""}${fmt(netMovement)}` },
      { labelEn: "Closing Balance (C/D)", labelBn: "সমাপনী ব্যাংক ব্যালেন্স (C/D)", value: fmt(closingBalance) },
      { labelEn: "Live Account Balance", labelBn: "অ্যাকাউন্টের বর্তমান সরাসরি ব্যালেন্স", value: fmt(accBalance) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
