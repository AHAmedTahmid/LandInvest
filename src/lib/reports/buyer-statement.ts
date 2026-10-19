import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const buyerColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "receipt", labelEn: "Receipt No", labelBn: "রসিদ নং" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
  { key: "method", labelEn: "Method", labelBn: "মাধ্যম" },
  { key: "remarks", labelEn: "Remarks", labelBn: "মন্তব্য" },
];

export async function queryBuyerStatement(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const sale: any = filters.saleId
    ? await prisma.landSale.findUnique({ where: { id: filters.saleId } })
    : await prisma.landSale.findFirst({ orderBy: { saleDate: "desc" } });
  if (!sale) return { columns: buyerColumns, rows: [], summary: [] };

  const payments = await prisma.customerPayment.findMany({ where: { saleId: sale.id }, orderBy: [{ paymentDate: "asc" }] });
  const installments = await prisma.installmentSchedule.findMany({ where: { saleId: sale.id }, orderBy: [{ dueDate: "asc" }] });
  const project = await prisma.landProject.findUnique({ where: { id: sale.projectId } });

  const totalPaid = payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
  const remaining = toNum(sale.totalAgreedPrice) - totalPaid;

  const data = payments.map((p: any) => ({
    date: p.paymentDate,
    receipt: p.receiptNo,
    amount: toNum(p.amountPaid),
    method: p.paymentMethod,
    remarks: p.remarks ?? "",
  }));

  return {
    columns: buyerColumns,
    rows: data,
    totals: { amount: totalPaid },
    summary: [
      { labelEn: "Buyer", labelBn: "ক্রেতা", value: sale.buyerName },
      { labelEn: "Project", labelBn: "প্রকল্প", value: project?.projectName ?? "-" },
      { labelEn: "Agreed Price", labelBn: "সম্মত মূল্য", value: fmt(toNum(sale.totalAgreedPrice)) },
      { labelEn: "Total Paid", labelBn: "মোট পরিশোধ", value: fmt(totalPaid) },
      { labelEn: "Remaining Due", labelBn: "অবশিষ্ট বকেয়া", value: fmt(remaining) },
      { labelEn: "Installments", labelBn: "কিস্তি", value: String(installments.length) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
