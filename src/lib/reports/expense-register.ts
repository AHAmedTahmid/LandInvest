import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const expenseColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "category", labelEn: "Category", labelBn: "বিভাগ" },
  { key: "payee", labelEn: "Payee", labelBn: "প্রাপক" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
  { key: "channel", labelEn: "Channel", labelBn: "মাধ্যম" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
  { key: "approver", labelEn: "Approver", labelBn: "অনুমোদক" },
];

export async function queryExpenseRegister(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.status) where.status = filters.status;
  if (filters.from || filters.to) {
    where.expenseDate = {};
    if (filters.from) where.expenseDate.gte = new Date(filters.from);
    if (filters.to) where.expenseDate.lte = new Date(filters.to);
  }
  const expenses = await prisma.projectExpense.findMany({ where, orderBy: [{ expenseDate: "desc" }] });
  const projects = await prisma.landProject.findMany();
  const partners = await prisma.partner.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));
  const partnerMap = new Map(partners.map((p: any) => [p.id, p.name]));

  const data = expenses.map((e: any) => ({
    date: e.expenseDate,
    project: e.projectId ? projMap.get(e.projectId) ?? "-" : "General",
    category: e.expenseCategory,
    payee: e.paidByPartnerId ? partnerMap.get(e.paidByPartnerId) ?? "-" : "-",
    amount: toNum(e.amount),
    channel: e.paymentChannel,
    status: e.status,
    approver: e.approvedBy?.slice(0, 8) ?? "-",
  }));

  const subtotals = new Map<string, number>();
  for (const r of data) subtotals.set(r.category, (subtotals.get(r.category) ?? 0) + r.amount);

  return {
    columns: expenseColumns,
    rows: data,
    totals: { amount: data.reduce((s: number, r: any) => s + r.amount, 0) },
    summary: [...subtotals.entries()].map(([cat, amt]) => ({
      labelEn: cat,
      labelBn: cat,
      value: fmt(amt),
    })),
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
