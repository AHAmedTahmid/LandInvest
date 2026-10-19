import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const dailyColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "cashIn", labelEn: "Cash In", labelBn: "নগদ আদায়", type: "number", align: "right" },
  { key: "cashOut", labelEn: "Cash Out", labelBn: "নগদ পরিশোধ", type: "number", align: "right" },
  { key: "bankIn", labelEn: "Bank In", labelBn: "ব্যাংক আদায়", type: "number", align: "right" },
  { key: "bankOut", labelEn: "Bank Out", labelBn: "ব্যাংক পরিশোধ", type: "number", align: "right" },
  { key: "net", labelEn: "Net Movement", labelBn: "নেট চলাচল", type: "number", align: "right" },
  { key: "cashBalance", labelEn: "Cash Balance", labelBn: "নগদ ব্যালেন্স", type: "number", align: "right" },
  { key: "bankBalance", labelEn: "Bank Balance", labelBn: "ব্যাংক ব্যালেন্স", type: "number", align: "right" },
];

export async function queryDailySummary(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const from = filters.from ? new Date(filters.from) : new Date();
  const to = filters.to ? new Date(filters.to) : from;
  const where: any = { txnDate: { gte: from, lte: to } };
  const rows = await prisma.treasuryLedger.findMany({ where, orderBy: [{ txnDate: "asc" }] });

  const byDate = new Map<string, { cashIn: number; cashOut: number; bankIn: number; bankOut: number }>();
  for (const r of rows) {
    const d = r.txnDate.toISOString().slice(0, 10);
    const e = byDate.get(d) ?? { cashIn: 0, cashOut: 0, bankIn: 0, bankOut: 0 };
    const amt = toNum(r.amount);
    if (r.accountType === "CASH") { if (r.flowType === "IN") e.cashIn += amt; else e.cashOut += amt; }
    else { if (r.flowType === "IN") e.bankIn += amt; else e.bankOut += amt; }
    byDate.set(d, e);
  }

  let cashBal = 0, bankBal = 0;
  const data = [...byDate.entries()].map(([date, v]) => {
    cashBal += v.cashIn - v.cashOut;
    bankBal += v.bankIn - v.bankOut;
    return { date, ...v, net: (v.cashIn + v.bankIn) - (v.cashOut + v.bankOut), cashBalance: cashBal, bankBalance: bankBal };
  });

  return {
    columns: dailyColumns,
    rows: data,
    totals: {
      cashIn: data.reduce((s: number, r: any) => s + r.cashIn, 0),
      cashOut: data.reduce((s: number, r: any) => s + r.cashOut, 0),
      bankIn: data.reduce((s: number, r: any) => s + r.bankIn, 0),
      bankOut: data.reduce((s: number, r: any) => s + r.bankOut, 0),
    },
  };
}
