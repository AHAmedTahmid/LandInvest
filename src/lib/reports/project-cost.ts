import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const costColumns: ReportColumn[] = [
  { key: "category", labelEn: "Category", labelBn: "বিভাগ" },
  { key: "description", labelEn: "Description", labelBn: "বিবরণ" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
];

export async function queryProjectCost(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const project = filters.projectId
    ? await prisma.landProject.findUnique({ where: { id: filters.projectId } })
    : await prisma.landProject.findFirst();
  if (!project) return { columns: costColumns, rows: [], summary: [] };

  const expenses = await prisma.projectExpense.findMany({ where: { projectId: project.id, status: "APPROVED" } });

  const acquisition = [
    { category: "Purchase Price", description: "Land purchase", amount: toNum(project.purchasePrice) },
    { category: "Bayna", description: "Bayna amount", amount: toNum(project.baynaAmount) },
    { category: "Registration", description: "Registration cost", amount: toNum(project.registrationCost) },
    { category: "Mutation", description: "Mutation tax", amount: toNum(project.mutationTaxCost) },
  ];

  const byCategory = new Map<string, number>();
  for (const e of expenses) {
    byCategory.set(e.expenseCategory, (byCategory.get(e.expenseCategory) ?? 0) + toNum(e.amount));
  }
  const development = [...byCategory.entries()].map(([cat, amt]) => ({ category: cat, description: "", amount: amt }));

  const totalAcquisition = acquisition.reduce((s, r) => s + r.amount, 0);
  const totalDevelopment = development.reduce((s, r) => s + r.amount, 0);
  const totalCost = totalAcquisition + totalDevelopment;
  const costPerShotok = toNum(project.totalAreaShotok) > 0 ? totalCost / toNum(project.totalAreaShotok) : 0;

  return {
    columns: costColumns,
    rows: [...acquisition, ...development],
    totals: { amount: totalCost },
    summary: [
      { labelEn: "Project", labelBn: "প্রকল্প", value: project.projectName },
      { labelEn: "Total Acquisition", labelBn: "মোট অধিগ্রহণ", value: fmt(totalAcquisition) },
      { labelEn: "Total Development", labelBn: "মোট উন্নয়ন", value: fmt(totalDevelopment) },
      { labelEn: "Total Investment", labelBn: "মোট বিনিয়োগ", value: fmt(totalCost) },
      { labelEn: "Cost per Shotok", labelBn: "প্রতি শতক খরচ", value: fmt(costPerShotok) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
