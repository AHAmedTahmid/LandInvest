import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";

export type ReportFilters = {
  from?: string;
  to?: string;
  projectId?: string;
  partnerId?: string;
  bankAccountId?: string;
  status?: string;
  saleId?: string;
  userId?: string;
  tableName?: string;
  action?: string;
};

const cashBookColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "purpose", labelEn: "Purpose", labelBn: "উদ্দেশ্য" },
  { key: "reference", labelEn: "Reference", labelBn: "রেফারেন্স" },
  { key: "voucher", labelEn: "Voucher No", labelBn: "ভাউচার নং" },
  { key: "in", labelEn: "Cash In", labelBn: "নগদ আদায়", type: "number", align: "right" },
  { key: "out", labelEn: "Cash Out", labelBn: "নগদ পরিশোধ", type: "number", align: "right" },
  { key: "balance", labelEn: "Running Balance", labelBn: "চলতি ব্যালেন্স", type: "number", align: "right" },
];

export async function queryCashBook(prisma: any, filters: ReportFilters): Promise<ReportData> {
  // 1. Calculate true Opening Balance prior to filters.from
  let openingBalance = 0;
  if (filters.from) {
    const priorRows = await prisma.treasuryLedger.findMany({
      where: {
        accountType: "CASH",
        txnDate: { lt: new Date(filters.from) },
      },
      select: { flowType: true, amount: true },
    });
    for (const r of priorRows) {
      const amt = toNum(r.amount);
      openingBalance += r.flowType === "IN" ? amt : -amt;
    }
  }

  // 2. Fetch cash transactions within selected date range
  const where: any = { accountType: "CASH" };
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) where.txnDate.lte = new Date(filters.to);
  }
  const rows = await prisma.treasuryLedger.findMany({ where, orderBy: [{ txnDate: "asc" }, { createdAt: "asc" }] });

  let balance = openingBalance;
  const data = rows.map((r: any) => {
    const amt = toNum(r.amount);
    const isIn = r.flowType === "IN";
    balance += isIn ? amt : -amt;
    return {
      id: r.id,
      date: r.txnDate,
      purpose: r.purpose,
      reference: r.referenceType,
      referenceType: r.referenceType,
      voucher: r.referenceId?.slice(0, 8) ?? "-",
      amount: amt,
      flowType: r.flowType,
      in: isIn ? amt : null,
      out: !isIn ? amt : null,
      balance,
    };
  });

  const totalIn = data.reduce((s: number, r: any) => s + (r.in || 0), 0);
  const totalOut = data.reduce((s: number, r: any) => s + (r.out || 0), 0);
  const netChange = totalIn - totalOut;
  const closingBalance = balance;

  return {
    columns: cashBookColumns,
    rows: data,
    totals: { in: totalIn, out: totalOut, balance: closingBalance },
    summary: [
      { labelEn: "Opening Balance (B/F)", labelBn: "প্রারম্ভিক ব্যালেন্স (পূর্বের জের)", value: formatBDT(openingBalance) },
      { labelEn: "Total Cash Received", labelBn: "মোট নগদ গ্রহণ / আদায়", value: formatBDT(totalIn) },
      { labelEn: "Total Cash Disbursed", labelBn: "মোট নগদ প্রদান / পরিশোধ", value: formatBDT(totalOut) },
      { labelEn: "Net Cash Movement", labelBn: "চলতি সময়ের নগদ পরিবর্তন", value: `${netChange >= 0 ? "+" : ""}${formatBDT(netChange)}` },
      { labelEn: "Closing Balance (C/D)", labelBn: "সমাপনী ব্যালেন্স (পরের জের)", value: formatBDT(closingBalance) },
    ],
  };
}

function formatBDT(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
