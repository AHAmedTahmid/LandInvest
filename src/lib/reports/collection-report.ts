import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const collectionColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "buyer", labelEn: "Buyer", labelBn: "ক্রেতা" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "method", labelEn: "Method", labelBn: "মাধ্যম" },
  { key: "receipt", labelEn: "Receipt No", labelBn: "রসিদ নং" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
];

export async function queryCollectionReport(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.projectId) {
    const sales = await prisma.landSale.findMany({ where: { projectId: filters.projectId } });
    where.saleId = { in: sales.map((s: any) => s.id) };
  }
  if (filters.from || filters.to) {
    where.paymentDate = {};
    if (filters.from) where.paymentDate.gte = new Date(filters.from);
    if (filters.to) where.paymentDate.lte = new Date(filters.to);
  }
  const payments = await prisma.customerPayment.findMany({ where, orderBy: [{ paymentDate: "desc" }] });
  const sales = await prisma.landSale.findMany();
  const projects = await prisma.landProject.findMany();
  const saleMap = new Map(sales.map((s: any) => [s.id, s]));
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));

  const data = payments.map((p: any) => {
    const sale: any = saleMap.get(p.saleId);
    return {
      date: p.paymentDate,
      buyer: sale?.buyerName ?? "-",
      project: sale ? projMap.get(sale.projectId) ?? "-" : "-",
      method: p.paymentMethod,
      receipt: p.receiptNo,
      amount: toNum(p.amountPaid),
    };
  });

  return {
    columns: collectionColumns,
    rows: data,
    totals: { amount: data.reduce((s: number, r: any) => s + r.amount, 0) },
  };
}
