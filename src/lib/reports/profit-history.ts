import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const historyColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "partner", labelEn: "Partner", labelBn: "অংশীদার" },
  { key: "sharePct", labelEn: "Share %", labelBn: "শেয়ার %", type: "number", align: "right" },
  { key: "payout", labelEn: "Payout", labelBn: "প্রদান", type: "number", align: "right" },
];

export async function queryProfitHistory(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.from || filters.to) {
    where.distributionDate = {};
    if (filters.from) where.distributionDate.gte = new Date(filters.from);
    if (filters.to) where.distributionDate.lte = new Date(filters.to);
  }
  const distributions = await prisma.profitDistribution.findMany({ where, orderBy: [{ distributionDate: "desc" }] });
  const projects = await prisma.landProject.findMany();
  const partners = await prisma.partner.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));
  const partnerMap = new Map(partners.map((p: any) => [p.id, p.name]));

  const data = distributions.map((d: any) => ({
    date: d.distributionDate,
    project: projMap.get(d.projectId) ?? "-",
    partner: partnerMap.get(d.partnerId) ?? "-",
    sharePct: toNum(d.partnerSharePercent),
    payout: toNum(d.payoutAmount),
  }));

  return {
    columns: historyColumns,
    rows: data,
    totals: { payout: data.reduce((s: number, r: any) => s + r.payout, 0) },
  };
}
