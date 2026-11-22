import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const comparisonColumns: ReportColumn[] = [
  { key: "project", labelEn: "Project Name", labelBn: "প্রকল্পের নাম" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা", align: "center" },
  { key: "grossArea", labelEn: "Gross Area (Shotok)", labelBn: "মোট জমি (শতক)", type: "number", align: "right" },
  { key: "plotsCount", labelEn: "Plots (Sold / Total)", labelBn: "প্লট (বিক্রিত / মোট)", align: "center" },
  { key: "totalCost", labelEn: "Capitalized Cost (BDT)", labelBn: "মূলধনী ব্যয় (টাকা)", type: "number", align: "right" },
  { key: "salesValue", labelEn: "Booked Sales (BDT)", labelBn: "চুক্তিবদ্ধ বিক্রয় (টাকা)", type: "number", align: "right" },
  { key: "collected", labelEn: "Cash Collected (BDT)", labelBn: "নগদ আদায় (টাকা)", type: "number", align: "right" },
  { key: "receivable", labelEn: "Receivables (BDT)", labelBn: "বকেয়া (টাকা)", type: "number", align: "right" },
  { key: "invoicedProfit", labelEn: "Invoiced Profit (BDT)", labelBn: "ইনভয়েসভিত্তিক লাভ (টাকা)", type: "number", align: "right" },
  { key: "paybackRate", labelEn: "Payback %", labelBn: "পে-ব্যাক %", type: "number", align: "right" },
  { key: "projectedRoi", labelEn: "Projected ROI %", labelBn: "প্রত্যাশিত ROI %", type: "number", align: "right" },
];

export interface ProjectComparisonItem {
  projectId: string;
  projectName: string;
  status: string;
  mouza: string;
  grossAreaShotok: number;
  saleableAreaShotok: number;
  efficiencyRatio: number;
  totalPlotsCount: number;
  soldPlotsCount: number;
  availablePlotsCount: number;
  plotAbsorptionRate: number;
  acquisitionCost: number;
  developmentCost: number;
  totalProjectCost: number;
  grossCostPerShotok: number;
  saleableCostPerShotok: number;
  bookedSalesValue: number;
  cashCollected: number;
  collectionRate: number;
  activeReceivables: number;
  invoicedProfit: number;
  invoicedMargin: number;
  realisedCashProfit: number;
  paybackRate: number;
  isPaybackAchieved: boolean;
  unsoldAskingValue: number;
  projectedFullyDilutedProfit: number;
  projectedFullyDilutedRoi: number;
  partnersCount: number;
}

export interface ProjectsComparisonReportData extends ReportData {
  projects: ProjectComparisonItem[];
  portfolioTotals: {
    totalProjects: number;
    totalGrossArea: number;
    totalSaleableArea: number;
    overallEfficiencyRatio: number;
    totalPlots: number;
    totalSoldPlots: number;
    totalAvailablePlots: number;
    overallAbsorptionRate: number;
    totalAcquisitionCost: number;
    totalDevelopmentCost: number;
    totalCapitalizedCost: number;
    averageGrossCostPerShotok: number;
    averageSaleableCostPerShotok: number;
    totalBookedSales: number;
    totalCashCollected: number;
    overallCollectionRate: number;
    totalActiveReceivables: number;
    totalInvoicedProfit: number;
    overallInvoicedMargin: number;
    totalRealisedCashProfit: number;
    overallPaybackRate: number;
    totalUnsoldAskingValue: number;
    totalProjectedDilutedProfit: number;
    overallProjectedRoi: number;
  };
}

const ACQUISITION_CATEGORIES = new Set([
  "Land Purchase",
  "Bayna Advance",
  "Registration",
  "Stamp Duty",
  "Mutation",
]);

export async function queryProjectsComparison(
  prisma: any,
  filters?: ReportFilters
): Promise<ProjectsComparisonReportData> {
  const [rawProjects, allExpenses] = await Promise.all([
    prisma.landProject.findMany({
      include: {
        projectPartners: {
          select: { partnerId: true },
        },
        projectPlots: {
          select: {
            id: true,
            plotSizeShotok: true,
            askingPrice: true,
            status: true,
          },
        },
        landSales: {
          include: {
            customerPayments: {
              select: { amountPaid: true },
            },
          },
        },
      },
      orderBy: { projectName: "asc" },
    }),
    prisma.projectExpense.findMany({
      where: { status: "APPROVED" },
      select: {
        projectId: true,
        amount: true,
        expenseCategory: true,
      },
    }),
  ]);

  if (!rawProjects || rawProjects.length === 0) {
    return {
      columns: comparisonColumns,
      rows: [],
      totals: {},
      summary: [],
      projects: [],
      portfolioTotals: {
        totalProjects: 0,
        totalGrossArea: 0,
        totalSaleableArea: 0,
        overallEfficiencyRatio: 0,
        totalPlots: 0,
        totalSoldPlots: 0,
        totalAvailablePlots: 0,
        overallAbsorptionRate: 0,
        totalAcquisitionCost: 0,
        totalDevelopmentCost: 0,
        totalCapitalizedCost: 0,
        averageGrossCostPerShotok: 0,
        averageSaleableCostPerShotok: 0,
        totalBookedSales: 0,
        totalCashCollected: 0,
        overallCollectionRate: 0,
        totalActiveReceivables: 0,
        totalInvoicedProfit: 0,
        overallInvoicedMargin: 0,
        totalRealisedCashProfit: 0,
        overallPaybackRate: 0,
        totalUnsoldAskingValue: 0,
        totalProjectedDilutedProfit: 0,
        overallProjectedRoi: 0,
      },
    };
  }

  let portGrossArea = 0;
  let portSaleableArea = 0;
  let portPlots = 0;
  let portSoldPlots = 0;
  let portAcqCost = 0;
  let portDevCost = 0;
  let portTotalCost = 0;
  let portBookedSales = 0;
  let portCashCollected = 0;
  let portUnsoldAsking = 0;

  const projectItems: ProjectComparisonItem[] = [];
  const legacyRows: any[] = [];

  for (const proj of rawProjects) {
    const grossArea = toNum(proj.totalAreaShotok);
    const saleableArea = proj.projectPlots.reduce(
      (s: number, p: any) => s + toNum(p.plotSizeShotok),
      0
    );
    const efficiencyRatio = grossArea > 0 ? (saleableArea / grossArea) * 100 : 0;

    const totalPlots = proj.projectPlots.length;
    const soldPlots = proj.landSales.length;
    const availablePlots = Math.max(totalPlots - soldPlots, 0);
    const absorptionRate = totalPlots > 0 ? (soldPlots / totalPlots) * 100 : 0;

    // Costs
    const acqCost =
      toNum(proj.purchasePrice) +
      toNum(proj.registrationCost) +
      toNum(proj.mutationTaxCost);

    const projExps = allExpenses.filter((e: any) => e.projectId === proj.id);
    const devCost = projExps
      .filter((e: any) => !ACQUISITION_CATEGORIES.has(e.expenseCategory))
      .reduce((s: number, e: any) => s + toNum(e.amount), 0);
    const totalProjCost = acqCost + devCost;

    const grossCostPerShotok = grossArea > 0 ? totalProjCost / grossArea : 0;
    const saleableCostPerShotok = saleableArea > 0 ? totalProjCost / saleableArea : 0;

    // Sales & Collections
    const bookedSales = proj.landSales.reduce(
      (s: number, sale: any) => s + toNum(sale.totalAgreedPrice),
      0
    );

    let cashCollected = 0;
    for (const sale of proj.landSales) {
      for (const cp of sale.customerPayments) {
        cashCollected += toNum(cp.amountPaid);
      }
    }

    const collectionRate = bookedSales > 0 ? (cashCollected / bookedSales) * 100 : 0;
    const activeReceivables = Math.max(bookedSales - cashCollected, 0);

    // Profits & Payback
    const invoicedProfit = bookedSales - totalProjCost;
    const invoicedMargin = bookedSales > 0 ? (invoicedProfit / bookedSales) * 100 : 0;
    const realisedCashProfit = cashCollected - totalProjCost;
    const paybackRate = totalProjCost > 0 ? (cashCollected / totalProjCost) * 100 : 0;
    const isPaybackAchieved = cashCollected >= totalProjCost;

    // Unsold inventory & fully diluted projection
    const unsoldAsking = proj.projectPlots
      .filter((p: any) => p.status === "AVAILABLE")
      .reduce((s: number, p: any) => s + toNum(p.askingPrice), 0);

    const projectedDilutedProfit = bookedSales + unsoldAsking - totalProjCost;
    const projectedDilutedRoi =
      totalProjCost > 0 ? (projectedDilutedProfit / totalProjCost) * 100 : 0;

    // Portfolio accumulators
    portGrossArea += grossArea;
    portSaleableArea += saleableArea;
    portPlots += totalPlots;
    portSoldPlots += soldPlots;
    portAcqCost += acqCost;
    portDevCost += devCost;
    portTotalCost += totalProjCost;
    portBookedSales += bookedSales;
    portCashCollected += cashCollected;
    portUnsoldAsking += unsoldAsking;

    const item: ProjectComparisonItem = {
      projectId: proj.id,
      projectName: proj.projectName,
      status: proj.status,
      mouza: proj.mouza,
      grossAreaShotok: grossArea,
      saleableAreaShotok: saleableArea,
      efficiencyRatio,
      totalPlotsCount: totalPlots,
      soldPlotsCount: soldPlots,
      availablePlotsCount: availablePlots,
      plotAbsorptionRate: absorptionRate,
      acquisitionCost: acqCost,
      developmentCost: devCost,
      totalProjectCost: totalProjCost,
      grossCostPerShotok,
      saleableCostPerShotok,
      bookedSalesValue: bookedSales,
      cashCollected,
      collectionRate,
      activeReceivables,
      invoicedProfit,
      invoicedMargin,
      realisedCashProfit,
      paybackRate,
      isPaybackAchieved,
      unsoldAskingValue: unsoldAsking,
      projectedFullyDilutedProfit: projectedDilutedProfit,
      projectedFullyDilutedRoi: projectedDilutedRoi,
      partnersCount: proj.projectPartners.length,
    };

    projectItems.push(item);

    legacyRows.push({
      project: proj.projectName,
      status: proj.status,
      grossArea,
      plotsCount: `${soldPlots} / ${totalPlots}`,
      totalCost: totalProjCost,
      salesValue: bookedSales,
      collected: cashCollected,
      receivable: activeReceivables,
      invoicedProfit,
      paybackRate: `${paybackRate.toFixed(1)}%`,
      projectedRoi: `${projectedDilutedRoi.toFixed(1)}%`,
    });
  }

  const portAvailablePlots = Math.max(portPlots - portSoldPlots, 0);
  const portEfficiency = portGrossArea > 0 ? (portSaleableArea / portGrossArea) * 100 : 0;
  const portAbsorption = portPlots > 0 ? (portSoldPlots / portPlots) * 100 : 0;
  const portCollectionRate = portBookedSales > 0 ? (portCashCollected / portBookedSales) * 100 : 0;
  const portReceivables = Math.max(portBookedSales - portCashCollected, 0);
  const portInvoicedProfit = portBookedSales - portTotalCost;
  const portInvoicedMargin = portBookedSales > 0 ? (portInvoicedProfit / portBookedSales) * 100 : 0;
  const portCashProfit = portCashCollected - portTotalCost;
  const portPaybackRate = portTotalCost > 0 ? (portCashCollected / portTotalCost) * 100 : 0;
  const portProjectedDilutedProfit = portBookedSales + portUnsoldAsking - portTotalCost;
  const portProjectedRoi = portTotalCost > 0 ? (portProjectedDilutedProfit / portTotalCost) * 100 : 0;

  const portfolioTotals = {
    totalProjects: rawProjects.length,
    totalGrossArea: portGrossArea,
    totalSaleableArea: portSaleableArea,
    overallEfficiencyRatio: portEfficiency,
    totalPlots: portPlots,
    totalSoldPlots: portSoldPlots,
    totalAvailablePlots: portAvailablePlots,
    overallAbsorptionRate: portAbsorption,
    totalAcquisitionCost: portAcqCost,
    totalDevelopmentCost: portDevCost,
    totalCapitalizedCost: portTotalCost,
    averageGrossCostPerShotok: portGrossArea > 0 ? portTotalCost / portGrossArea : 0,
    averageSaleableCostPerShotok: portSaleableArea > 0 ? portTotalCost / portSaleableArea : 0,
    totalBookedSales: portBookedSales,
    totalCashCollected: portCashCollected,
    overallCollectionRate: portCollectionRate,
    totalActiveReceivables: portReceivables,
    totalInvoicedProfit: portInvoicedProfit,
    overallInvoicedMargin: portInvoicedMargin,
    totalRealisedCashProfit: portCashProfit,
    overallPaybackRate: portPaybackRate,
    totalUnsoldAskingValue: portUnsoldAsking,
    totalProjectedDilutedProfit: portProjectedDilutedProfit,
    overallProjectedRoi: portProjectedRoi,
  };

  return {
    columns: comparisonColumns,
    rows: legacyRows,
    totals: {
      grossArea: portGrossArea,
      totalCost: portTotalCost,
      salesValue: portBookedSales,
      collected: portCashCollected,
      receivable: portReceivables,
      invoicedProfit: portInvoicedProfit,
    },
    summary: [
      { labelEn: "Total Projects", labelBn: "মোট প্রকল্প", value: `${rawProjects.length} Projects` },
      { labelEn: "Total Gross Area", labelBn: "মোট জমি", value: `${portGrossArea.toFixed(2)} Shotok` },
      { labelEn: "Total Capitalized Cost", labelBn: "মোট মূলধনী ব্যয়", value: `৳ ${portTotalCost.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Total Booked Sales", labelBn: "মোট চুক্তিবদ্ধ বিক্রয়", value: `৳ ${portBookedSales.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Total Cash Collected", labelBn: "মোট নগদ আদায়", value: `৳ ${portCashCollected.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Active Receivables", labelBn: "মোট বকেয়া", value: `৳ ${portReceivables.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Overall Projected ROI", labelBn: "সামগ্রিক প্রত্যাশিত ROI", value: `${portProjectedRoi.toFixed(1)}%` },
    ],
    projects: projectItems,
    portfolioTotals,
  };
}
