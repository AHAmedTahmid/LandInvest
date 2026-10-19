import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const pnlColumns: ReportColumn[] = [
  { key: "label", labelEn: "Item", labelBn: "আইটেম" },
  { key: "invoiced", labelEn: "Invoiced Basis", labelBn: "ইনভয়েসভিত্তিক", type: "number", align: "right" },
  { key: "realised", labelEn: "Cash Basis", labelBn: "প্রকৃত (নগদ)", type: "number", align: "right" },
];

export async function queryProjectPnl(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const project = filters.projectId
    ? await prisma.landProject.findUnique({ where: { id: filters.projectId } })
    : await prisma.landProject.findFirst();
  if (!project) return { columns: pnlColumns, rows: [], summary: [] };

  const sales = await prisma.landSale.findMany({ where: { projectId: project.id } });
  const payments = await prisma.customerPayment.findMany({ where: { saleId: { in: sales.map((s: any) => s.id) } } });
  const expenses = await prisma.projectExpense.findMany({ where: { projectId: project.id, status: "APPROVED" } });

  const totalSalesValue = sales.reduce((s: number, r: any) => s + toNum(r.totalAgreedPrice), 0);
  const totalCollected = payments.reduce((s: number, r: any) => s + toNum(r.amountPaid), 0);
  const outstanding = totalSalesValue - totalCollected;
  const landCost = toNum(project.purchasePrice) + toNum(project.registrationCost) + toNum(project.mutationTaxCost);
  const devCost = expenses.reduce((s: number, r: any) => s + toNum(r.amount), 0);
  const totalCost = landCost + devCost;
  const invoicedProfit = totalSalesValue - totalCost;
  const realisedProfit = totalCollected - totalCost;

  const data = [
    { label: "Total Sales Value", invoiced: totalSalesValue, realised: null },
    { label: "Total Collected", invoiced: null, realised: totalCollected },
    { label: "Outstanding", invoiced: outstanding, realised: null },
    { label: "Land Cost", invoiced: -landCost, realised: -landCost },
    { label: "Development Cost", invoiced: -devCost, realised: -devCost },
    { label: "Net Profit", invoiced: invoicedProfit, realised: realisedProfit },
  ];

  return {
    columns: pnlColumns,
    rows: data,
    summary: [
      { labelEn: "Project", labelBn: "প্রকল্প", value: project.projectName },
      { labelEn: "Invoiced Profit", labelBn: "ইনভয়েসভিত্তিক লাভ", value: fmt(invoicedProfit) },
      { labelEn: "Realised Profit", labelBn: "প্রকৃত লাভ", value: fmt(realisedProfit) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
