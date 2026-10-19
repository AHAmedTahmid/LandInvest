import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const inventoryColumns: ReportColumn[] = [
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "plot", labelEn: "Plot", labelBn: "প্লট" },
  { key: "size", labelEn: "Size (Shotok)", labelBn: "আকার (শতক)", type: "number", align: "right" },
  { key: "askingPrice", labelEn: "Asking Price", labelBn: "জিজ্ঞাসা মূল্য", type: "number", align: "right" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
];

export async function queryPlotInventory(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.projectId) where.projectId = filters.projectId;
  const plots = await prisma.projectPlot.findMany({ where, orderBy: [{ plotNumber: "asc" }] });
  const projects = await prisma.landProject.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));

  const data = plots.map((p: any) => ({
    project: projMap.get(p.projectId) ?? "-",
    plot: p.plotNumber,
    size: toNum(p.plotSizeShotok),
    askingPrice: toNum(p.askingPrice),
    status: p.status,
  }));

  const available = data.filter((r: any) => r.status === "AVAILABLE");
  const totalAskingValue = available.reduce((s: number, r: any) => s + r.askingPrice, 0);

  return {
    columns: inventoryColumns,
    rows: data,
    totals: { askingPrice: data.reduce((s: number, r: any) => s + r.askingPrice, 0) },
    summary: [
      { labelEn: "Available Plots", labelBn: "বিক্রিত প্লট", value: String(available.length) },
      { labelEn: "Total Asking Value (Available)", labelBn: "মোট জিজ্ঞাসা মূল্য (বিক্রিত)", value: fmt(totalAskingValue) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
