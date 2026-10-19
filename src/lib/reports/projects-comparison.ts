import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";

const comparisonColumns: ReportColumn[] = [
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "area", labelEn: "Area (Shotok)", labelBn: "জায়গা (শতক)", type: "number", align: "right" },
  { key: "totalCost", labelEn: "Total Cost", labelBn: "মোট খরচ", type: "number", align: "right" },
  { key: "salesValue", labelEn: "Sales Value", labelBn: "বিক্রয় মূল্য", type: "number", align: "right" },
  { key: "collected", labelEn: "Collected", labelBn: "আদায়", type: "number", align: "right" },
  { key: "receivable", labelEn: "Receivable", labelBn: "বকেয়া", type: "number", align: "right" },
  { key: "profit", labelEn: "Profit", labelBn: "লাভ", type: "number", align: "right" },
  { key: "roi", labelEn: "ROI %", labelBn: "ROI %", type: "number", align: "right" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
];

export async function queryProjectsComparison(prisma: any): Promise<ReportData> {
  const projects = await prisma.landProject.findMany();
  const sales = await prisma.landSale.findMany();
  const payments = await prisma.customerPayment.findMany();
  const expenses = await prisma.projectExpense.findMany({ where: { status: "APPROVED" } });

  const data = projects.map((p: any) => {
    const projSales = sales.filter((s: any) => s.projectId === p.id);
    const saleIds = projSales.map((s: any) => s.id);
    const projPayments = payments.filter((pay: any) => saleIds.includes(pay.saleId));
    const projExpenses = expenses.filter((e: any) => e.projectId === p.id);

    const totalCost = toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost) + projExpenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);
    const salesValue = projSales.reduce((s: number, r: any) => s + toNum(r.totalAgreedPrice), 0);
    const collected = projPayments.reduce((s: number, r: any) => s + toNum(r.amountPaid), 0);
    const receivable = salesValue - collected;
    const profit = salesValue - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return { project: p.projectName, area: toNum(p.totalAreaShotok), totalCost, salesValue, collected, receivable, profit, roi, status: p.status };
  });

  return {
    columns: comparisonColumns,
    rows: data,
    totals: {
      area: data.reduce((s: number, r: any) => s + r.area, 0),
      totalCost: data.reduce((s: number, r: any) => s + r.totalCost, 0),
      salesValue: data.reduce((s: number, r: any) => s + r.salesValue, 0),
      collected: data.reduce((s: number, r: any) => s + r.collected, 0),
      receivable: data.reduce((s: number, r: any) => s + r.receivable, 0),
      profit: data.reduce((s: number, r: any) => s + r.profit, 0),
    },
  };
}
