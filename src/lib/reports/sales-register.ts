import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const salesColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "buyer", labelEn: "Buyer", labelBn: "ক্রেতা" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "plot", labelEn: "Plot", labelBn: "প্লট" },
  { key: "agreedPrice", labelEn: "Agreed Price", labelBn: "সম্মত মূল্য", type: "number", align: "right" },
  { key: "paid", labelEn: "Paid", labelBn: "পরিশোধিত", type: "number", align: "right" },
  { key: "due", labelEn: "Due", labelBn: "বকেয়া", type: "number", align: "right" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
];

export async function querySalesRegister(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.status) where.status = filters.status;
  if (filters.from || filters.to) {
    where.saleDate = {};
    if (filters.from) where.saleDate.gte = new Date(filters.from);
    if (filters.to) where.saleDate.lte = new Date(filters.to);
  }
  const sales = await prisma.landSale.findMany({ where, orderBy: [{ saleDate: "desc" }] });
  const payments = await prisma.customerPayment.findMany();
  const projects = await prisma.landProject.findMany();
  const plots = await prisma.projectPlot.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));
  const plotMap = new Map(plots.map((p: any) => [p.id, p.plotNumber]));

  const data = sales.map((s: any) => {
    const paid = payments.filter((p: any) => p.saleId === s.id).reduce((sum: number, p: any) => sum + toNum(p.amountPaid), 0);
    return {
      date: s.saleDate,
      buyer: s.buyerName,
      project: projMap.get(s.projectId) ?? "-",
      plot: s.plotId ? plotMap.get(s.plotId) ?? "-" : "-",
      agreedPrice: toNum(s.totalAgreedPrice),
      paid,
      due: toNum(s.totalAgreedPrice) - paid,
      status: s.status,
    };
  });

  return {
    columns: salesColumns,
    rows: data,
    totals: {
      agreedPrice: data.reduce((s: number, r: any) => s + r.agreedPrice, 0),
      paid: data.reduce((s: number, r: any) => s + r.paid, 0),
      due: data.reduce((s: number, r: any) => s + r.due, 0),
    },
  };
}
