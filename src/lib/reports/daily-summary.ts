import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const dailyColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "cashIn", labelEn: "Cash In", labelBn: "নগদ আদায়", type: "number", align: "right" },
  { key: "cashOut", labelEn: "Cash Out", labelBn: "নগদ পরিশোধ", type: "number", align: "right" },
  { key: "bankIn", labelEn: "Bank In", labelBn: "ব্যাংক আদায়", type: "number", align: "right" },
  { key: "bankOut", labelEn: "Bank Out", labelBn: "ব্যাংক পরিশোধ", type: "number", align: "right" },
  { key: "totalIn", labelEn: "Total Inflow", labelBn: "মোট আদায়", type: "number", align: "right" },
  { key: "totalOut", labelEn: "Total Outflow", labelBn: "মোট পরিশোধ", type: "number", align: "right" },
  { key: "net", labelEn: "Net Movement", labelBn: "নেট চলাচল", type: "number", align: "right" },
  { key: "cashBalance", labelEn: "Cash Balance", labelBn: "নগদ ব্যালেন্স", type: "number", align: "right" },
  { key: "bankBalance", labelEn: "Bank Balance", labelBn: "ব্যাংক ব্যালেন্স", type: "number", align: "right" },
  { key: "totalBalance", labelEn: "Total Treasury", labelBn: "মোট তহবিল", type: "number", align: "right" },
];

export async function queryDailySummary(prisma: any, filters: ReportFilters): Promise<ReportData> {
  // 1. Calculate true Opening Balances (Cash and Bank) prior to filters.from
  let openingCash = 0;
  let openingBank = 0;

  if (filters.from) {
    const fromDate = new Date(filters.from);
    const priorRows = await prisma.treasuryLedger.findMany({
      where: {
        txnDate: { lt: fromDate },
      },
      select: {
        accountType: true,
        flowType: true,
        amount: true,
      },
    });

    for (const r of priorRows) {
      const amt = toNum(r.amount);
      if (r.accountType === "CASH") {
        openingCash += r.flowType === "IN" ? amt : -amt;
      } else {
        openingBank += r.flowType === "IN" ? amt : -amt;
      }
    }
  }

  // 2. Query transactions within the specified date range
  const where: any = {};
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) {
      const toDate = new Date(filters.to);
      if (filters.to.length <= 10) {
        toDate.setHours(23, 59, 59, 999);
      }
      where.txnDate.lte = toDate;
    }
  }

  const rows = await prisma.treasuryLedger.findMany({
    where,
    orderBy: [{ txnDate: "asc" }],
    select: {
      txnDate: true,
      accountType: true,
      flowType: true,
      amount: true,
    },
  });

  // 3. Group by date string (YYYY-MM-DD)
  const byDate = new Map<
    string,
    { cashIn: number; cashOut: number; bankIn: number; bankOut: number; txnCount: number }
  >();

  for (const r of rows) {
    const d = r.txnDate.toISOString().slice(0, 10);
    const e = byDate.get(d) ?? { cashIn: 0, cashOut: 0, bankIn: 0, bankOut: 0, txnCount: 0 };
    const amt = toNum(r.amount);
    e.txnCount += 1;
    if (r.accountType === "CASH") {
      if (r.flowType === "IN") e.cashIn += amt;
      else e.cashOut += amt;
    } else {
      if (r.flowType === "IN") e.bankIn += amt;
      else e.bankOut += amt;
    }
    byDate.set(d, e);
  }

  // 4. Compute running balances from opening balances
  let cashBal = openingCash;
  let bankBal = openingBank;

  const data = [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => {
      cashBal += v.cashIn - v.cashOut;
      bankBal += v.bankIn - v.bankOut;
      const totalIn = v.cashIn + v.bankIn;
      const totalOut = v.cashOut + v.bankOut;
      const net = totalIn - totalOut;
      const totalBalance = cashBal + bankBal;

      return {
        date,
        cashIn: v.cashIn,
        cashOut: v.cashOut,
        bankIn: v.bankIn,
        bankOut: v.bankOut,
        totalIn,
        totalOut,
        net,
        cashBalance: cashBal,
        bankBalance: bankBal,
        totalBalance,
        txnCount: v.txnCount,
      };
    });

  const totalCashIn = data.reduce((s, r) => s + r.cashIn, 0);
  const totalCashOut = data.reduce((s, r) => s + r.cashOut, 0);
  const totalBankIn = data.reduce((s, r) => s + r.bankIn, 0);
  const totalBankOut = data.reduce((s, r) => s + r.bankOut, 0);
  const totalIn = totalCashIn + totalBankIn;
  const totalOut = totalCashOut + totalBankOut;
  const netMovement = totalIn - totalOut;

  const openingTreasury = openingCash + openingBank;
  const closingTreasury = cashBal + bankBal;

  return {
    columns: dailyColumns,
    rows: data,
    totals: {
      openingCash,
      openingBank,
      openingTreasury,
      cashIn: totalCashIn,
      cashOut: totalCashOut,
      bankIn: totalBankIn,
      bankOut: totalBankOut,
      totalIn,
      totalOut,
      net: netMovement,
      cashBalance: cashBal,
      bankBalance: bankBal,
      totalBalance: closingTreasury,
      closingCash: cashBal,
      closingBank: bankBal,
      closingTreasury,
      totalTxns: rows.length,
      activeDays: byDate.size,
    },
    summary: [
      {
        labelEn: "Opening Treasury Balance (B/F)",
        labelBn: "প্রারম্ভিক মোট তহবিল (পূর্বানীত)",
        value: openingTreasury.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Total Period Inflow",
        labelBn: "মোট সময়কালীন আদায়",
        value: totalIn.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Total Period Outflow",
        labelBn: "মোট সময়কালীন পরিশোধ",
        value: totalOut.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Net Treasury Movement",
        labelBn: "নেট তহবিল চলাচল",
        value: netMovement.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Closing Treasury Balance (C/D)",
        labelBn: "সমাপনী মোট তহবিল (স্থানান্তরিত)",
        value: closingTreasury.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
    ],
  };
}
