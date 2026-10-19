import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const allocationColumns: ReportColumn[] = [
  { key: "partner", labelEn: "Partner", labelBn: "অংশীদার" },
  { key: "sharePct", labelEn: "Share %", labelBn: "শেয়ার %", type: "number", align: "right" },
  { key: "payout", labelEn: "Payout Amount", labelBn: "প্রদানের পরিমাণ", type: "number", align: "right" },
];

export async function queryProfitAllocation(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const project = filters.projectId
    ? await prisma.landProject.findUnique({ where: { id: filters.projectId } })
    : await prisma.landProject.findFirst();
  if (!project) return { columns: allocationColumns, rows: [], summary: [] };

  const allocations = await prisma.profitDistribution.findMany({ where: { projectId: project.id } });
  const partners = await prisma.partner.findMany();
  const partnerMap = new Map(partners.map((p: any) => [p.id, p.name]));

  const netProfit = allocations.length > 0 ? toNum(allocations[0].totalProjectNetProfit) : 0;
  const basis = allocations.length > 0 ? allocations[0].realizationBasis : "CASH_BASIS";

  const data = allocations.map((a: any) => ({
    partner: partnerMap.get(a.partnerId) ?? "-",
    sharePct: toNum(a.partnerSharePercent),
    payout: toNum(a.payoutAmount),
  }));

  const totalPayout = data.reduce((s: number, r: any) => s + r.payout, 0);

  return {
    columns: allocationColumns,
    rows: data,
    totals: { payout: totalPayout },
    summary: [
      { labelEn: "Project", labelBn: "প্রকল্প", value: project.projectName },
      { labelEn: "Net Profit", labelBn: "নিট লাভ", value: fmt(netProfit) },
      { labelEn: "Basis", labelBn: "ভিত্তি", value: basis === "CASH_BASIS" ? "Cash Basis" : "Completion Basis" },
      { labelEn: "Total Payout", labelBn: "মোট প্রদান", value: fmt(totalPayout) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
