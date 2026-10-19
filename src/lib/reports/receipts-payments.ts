import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const rpColumns: ReportColumn[] = [
  { key: "group", labelEn: "Group", labelBn: "গ্রুপ" },
  { key: "purpose", labelEn: "Purpose", labelBn: "উদ্দেশ্য" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
];

export async function queryReceiptsPayments(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) where.txnDate.lte = new Date(filters.to);
  }
  const rows = await prisma.treasuryLedger.findMany({ where, orderBy: [{ txnDate: "asc" }] });

  const groups = new Map<string, Map<string, number>>();
  for (const r of rows) {
    const isIn = r.flowType === "IN";
    const group = isIn ? "Receipts" : "Payments";
    const purpose = r.purpose || r.referenceType;
    if (!groups.has(group)) groups.set(group, new Map());
    const g = groups.get(group)!;
    g.set(purpose, (g.get(purpose) ?? 0) + toNum(r.amount));
  }

  const data: any[] = [];
  let totalIn = 0, totalOut = 0;
  for (const [group, purposes] of groups) {
    for (const [purpose, amount] of purposes) {
      data.push({ group, purpose, amount });
      if (group === "Receipts") totalIn += amount; else totalOut += amount;
    }
  }

  return {
    columns: rpColumns,
    rows: data,
    totals: { amount: totalIn - totalOut },
    summary: [
      { labelEn: "Total Receipts", labelBn: "মোট আদায়", value: fmt(totalIn) },
      { labelEn: "Total Payments", labelBn: "মোট পরিশোধ", value: fmt(totalOut) },
      { labelEn: "Net Change", labelBn: "নেট পরিবর্তন", value: fmt(totalIn - totalOut) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
