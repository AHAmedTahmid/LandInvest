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
  const where: any = { accountType: "CASH" };
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) where.txnDate.lte = new Date(filters.to);
  }
  const rows = await prisma.treasuryLedger.findMany({ where, orderBy: [{ txnDate: "asc" }, { createdAt: "asc" }] });

  let balance = 0;
  const data = rows.map((r: any) => {
    const amt = toNum(r.amount);
    const isIn = r.flowType === "IN";
    balance += isIn ? amt : -amt;
    return {
      date: r.txnDate,
      purpose: r.purpose,
      reference: r.referenceType,
      voucher: r.referenceId?.slice(0, 8) ?? "-",
      in: isIn ? amt : null,
      out: !isIn ? amt : null,
      balance,
    };
  });

  const totalIn = data.reduce((s: number, r: any) => s + (r.in || 0), 0);
  const totalOut = data.reduce((s: number, r: any) => s + (r.out || 0), 0);

  return {
    columns: cashBookColumns,
    rows: data,
    totals: { in: totalIn, out: totalOut, balance },
    summary: [
      { labelEn: "Opening Balance", labelBn: "প্রারম্ভিক ব্যালেন্স", value: formatBDT(0) },
      { labelEn: "Closing Balance", labelBn: "সমাপনী ব্যালেন্স", value: formatBDT(balance) },
    ],
  };
}

function formatBDT(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
