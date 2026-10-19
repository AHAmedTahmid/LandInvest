import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const agingColumns: ReportColumn[] = [
  { key: "buyer", labelEn: "Buyer", labelBn: "ক্রেতা" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "totalDue", labelEn: "Total Due", labelBn: "মোট বকেয়া", type: "number", align: "right" },
  { key: "notYetDue", labelEn: "Not Yet Due", labelBn: "এখনো বকেয়া নয়", type: "number", align: "right" },
  { key: "days1to30", labelEn: "1-30 Days", labelBn: "১-৩০ দিন", type: "number", align: "right" },
  { key: "days31to60", labelEn: "31-60 Days", labelBn: "৩১-৬০ দিন", type: "number", align: "right" },
  { key: "days61to90", labelEn: "61-90 Days", labelBn: "৬১-৯০ দিন", type: "number", align: "right" },
  { key: "over90", labelEn: "90+ Days", labelBn: "৯০+ দিন", type: "number", align: "right" },
];

export async function queryReceivablesAging(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const sales = await prisma.landSale.findMany({ where: filters.projectId ? { projectId: filters.projectId } : {} });
  const payments = await prisma.customerPayment.findMany();
  const projects = await prisma.landProject.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));

  const now = new Date();
  const data = sales.map((s: any) => {
    const paid = payments.filter((p: any) => p.saleId === s.id).reduce((sum: number, p: any) => sum + toNum(p.amountPaid), 0);
    const due = toNum(s.totalAgreedPrice) - paid;
    if (due <= 0) return null;

    const saleDate = new Date(s.saleDate);
    const daysSinceSale = Math.floor((now.getTime() - saleDate.getTime()) / 86400000);

    let notYetDue = 0, d1to30 = 0, d31to60 = 0, d61to90 = 0, over90 = 0;
    if (daysSinceSale <= 0) notYetDue = due;
    else if (daysSinceSale <= 30) d1to30 = due;
    else if (daysSinceSale <= 60) d31to60 = due;
    else if (daysSinceSale <= 90) d61to90 = due;
    else over90 = due;

    return { buyer: s.buyerName, project: projMap.get(s.projectId) ?? "-", totalDue: due, notYetDue, days1to30: d1to30, days31to60: d31to60, days61to90: d61to90, over90 };
  }).filter(Boolean);

  return {
    columns: agingColumns,
    rows: data,
    totals: {
      totalDue: data.reduce((s: number, r: any) => s + r.totalDue, 0),
      notYetDue: data.reduce((s: number, r: any) => s + r.notYetDue, 0),
      days1to30: data.reduce((s: number, r: any) => s + r.days1to30, 0),
      days31to60: data.reduce((s: number, r: any) => s + r.days31to60, 0),
      days61to90: data.reduce((s: number, r: any) => s + r.days61to90, 0),
      over90: data.reduce((s: number, r: any) => s + r.over90, 0),
    },
  };
}
