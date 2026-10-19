import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const installmentColumns: ReportColumn[] = [
  { key: "dueDate", labelEn: "Due Date", labelBn: "নির্ধারিত তারিখ", type: "date" },
  { key: "buyer", labelEn: "Buyer", labelBn: "ক্রেতা" },
  { key: "phone", labelEn: "Phone", labelBn: "ফোন" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
  { key: "daysUntilDue", labelEn: "Days Until Due", labelBn: "বাকি দিন", type: "number", align: "right" },
];

export async function queryInstallmentReport(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 86400000);
  const in15 = new Date(now.getTime() + 15 * 86400000);
  const in30 = new Date(now.getTime() + 30 * 86400000);

  const installments = await prisma.installmentSchedule.findMany({ where: { status: { in: ["UPCOMING", "OVERDUE"] } }, orderBy: [{ dueDate: "asc" }] });
  const sales = await prisma.landSale.findMany();
  const projects = await prisma.landProject.findMany();
  const saleMap = new Map(sales.map((s: any) => [s.id, s]));
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));

  const data = installments.map((i: any) => {
    const sale: any = saleMap.get(i.saleId);
    const dueDate = new Date(i.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000);
    return {
      dueDate: i.dueDate,
      buyer: sale?.buyerName ?? "-",
      phone: sale?.buyerPhone ?? "-",
      project: sale ? projMap.get(sale.projectId) ?? "-" : "-",
      amount: toNum(i.dueAmount),
      status: i.status,
      daysUntilDue,
    };
  });

  return { columns: installmentColumns, rows: data };
}
