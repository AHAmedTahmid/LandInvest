import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const pendingColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "category", labelEn: "Category", labelBn: "বিভাগ" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
  { key: "channel", labelEn: "Channel", labelBn: "মাধ্যম" },
  { key: "age", labelEn: "Age (days)", labelBn: "বয়স (দিন)", type: "number", align: "right" },
];

export async function queryPendingApproval(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = { status: "PENDING" };
  if (filters.projectId) where.projectId = filters.projectId;
  const expenses = await prisma.projectExpense.findMany({ where, orderBy: [{ expenseDate: "asc" }] });
  const projects = await prisma.landProject.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));

  const now = new Date();
  const data = expenses.map((e: any) => {
    const days = Math.floor((now.getTime() - new Date(e.expenseDate).getTime()) / 86400000);
    return {
      date: e.expenseDate,
      project: e.projectId ? projMap.get(e.projectId) ?? "-" : "General",
      category: e.expenseCategory,
      amount: toNum(e.amount),
      channel: e.paymentChannel,
      age: Math.max(0, days),
    };
  });

  return {
    columns: pendingColumns,
    rows: data,
    totals: { amount: data.reduce((s: number, r: any) => s + r.amount, 0), age: data.length > 0 ? Math.round(data.reduce((s: number, r: any) => s + r.age, 0) / data.length) : 0 },
  };
}
