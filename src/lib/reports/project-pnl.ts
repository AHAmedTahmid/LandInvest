import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const pnlColumns: ReportColumn[] = [
  { key: "code", labelEn: "Code", labelBn: "কোড", width: "10%" },
  { key: "label", labelEn: "Financial Head / Line Item", labelBn: "আর্থিক খাত / বিবরণ" },
  { key: "invoiced", labelEn: "Invoiced / Accrual Basis (BDT)", labelBn: "ইনভয়েসভিত্তিক (টাকা)", type: "number", align: "right" },
  { key: "realised", labelEn: "Realised / Cash Basis (BDT)", labelBn: "প্রকৃত নগদভিত্তিক (টাকা)", type: "number", align: "right" },
  { key: "variance", labelEn: "Receivable / Variance (BDT)", labelBn: "বকেয়া / পার্থক্য (টাকা)", type: "number", align: "right" },
];

export interface ProjectPartnerProfitItem {
  partnerId: string;
  partnerName: string;
  sharePercentage: number;
  allocatedInvoicedProfit: number;
  allocatedRealisedProfit: number;
  actualProfitReceived: number;
}

export interface ProjectSaleDetailItem {
  saleId: string;
  buyerName: string;
  plotNumber: string;
  plotAreaShotok: number;
  agreedPrice: number;
  advanceBooking: number;
  collectedAmount: number;
  currentDueAmount: number;
  saleDate: string;
  status: string;
}

export interface PnlLineItem {
  code: string;
  labelEn: string;
  labelBn: string;
  invoiced: number | null;
  realised: number | null;
  variance: number | null;
  isTotal?: boolean;
  isHeader?: boolean;
}

export interface ProjectPnlSummary {
  projectId: string;
  projectName: string;
  status: string;
  mouza: string;
  grossAreaShotok: number;
  totalPlotsCount: number;
  soldPlotsCount: number;
  availablePlotsCount: number;
  soldAreaShotok: number;
  availableAreaShotok: number;
  totalBookedSales: number;
  totalCashCollected: number;
  activeReceivables: number;
  unsoldInventoryAskingValue: number;
  totalAcquisitionCost: number;
  totalDevelopmentCost: number;
  totalProjectCost: number;
  invoicedGrossProfit: number;
  invoicedMargin: number;
  realisedCashProfit: number;
  collectionRate: number;
  paybackRate: number;
  isPaybackAchieved: boolean;
  profitDistributedToDate: number;
  retainedProjectSurplus: number;
  projectedFullyDilutedProfit: number;
  lineItems: PnlLineItem[];
  partnerAllocations: ProjectPartnerProfitItem[];
  recentSales: ProjectSaleDetailItem[];
}

export interface ProjectPnlReportData extends ReportData {
  selectedProject: ProjectPnlSummary;
  allProjectsList: {
    id: string;
    projectName: string;
    status: string;
    totalSales: number;
    totalCost: number;
    invoicedProfit: number;
    cashProfit: number;
  }[];
  portfolioKpis: {
    totalSyndicateSales: number;
    totalSyndicateCollected: number;
    totalSyndicateCost: number;
    totalSyndicateReceivables: number;
    totalSyndicateInvoicedProfit: number;
    totalSyndicateCashProfit: number;
    totalSyndicateDistributed: number;
  };
}

export async function queryProjectPnl(
  prisma: any,
  filters: ReportFilters
): Promise<ProjectPnlReportData> {
  // Fetch all land projects with partners, plots, sales, and distributions
  const [rawProjects, allExpenses, allDistributions] = await Promise.all([
    prisma.landProject.findMany({
      include: {
        projectPartners: {
          include: {
            partner: {
              select: { id: true, name: true, phone: true },
            },
          },
          orderBy: { sharePercentage: "desc" },
        },
        projectPlots: {
          select: {
            id: true,
            plotNumber: true,
            plotSizeShotok: true,
            askingPrice: true,
            status: true,
          },
        },
        landSales: {
          include: {
            plot: {
              select: { plotNumber: true, plotSizeShotok: true },
            },
            customerPayments: {
              select: { amountPaid: true, paymentDate: true },
            },
          },
          orderBy: { saleDate: "desc" },
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
    prisma.profitDistribution.findMany({
      select: {
        projectId: true,
        partnerId: true,
        payoutAmount: true,
      },
    }),
  ]);

  if (!rawProjects || rawProjects.length === 0) {
    return {
      columns: pnlColumns,
      rows: [],
      totals: { invoiced: 0, realised: 0, variance: 0 },
      summary: [],
      selectedProject: {
        projectId: "",
        projectName: "No Project",
        status: "N/A",
        mouza: "-",
        grossAreaShotok: 0,
        totalPlotsCount: 0,
        soldPlotsCount: 0,
        availablePlotsCount: 0,
        soldAreaShotok: 0,
        availableAreaShotok: 0,
        totalBookedSales: 0,
        totalCashCollected: 0,
        activeReceivables: 0,
        unsoldInventoryAskingValue: 0,
        totalAcquisitionCost: 0,
        totalDevelopmentCost: 0,
        totalProjectCost: 0,
        invoicedGrossProfit: 0,
        invoicedMargin: 0,
        realisedCashProfit: 0,
        collectionRate: 0,
        paybackRate: 0,
        isPaybackAchieved: false,
        profitDistributedToDate: 0,
        retainedProjectSurplus: 0,
        projectedFullyDilutedProfit: 0,
        lineItems: [],
        partnerAllocations: [],
        recentSales: [],
      },
      allProjectsList: [],
      portfolioKpis: {
        totalSyndicateSales: 0,
        totalSyndicateCollected: 0,
        totalSyndicateCost: 0,
        totalSyndicateReceivables: 0,
        totalSyndicateInvoicedProfit: 0,
        totalSyndicateCashProfit: 0,
        totalSyndicateDistributed: 0,
      },
    };
  }

  const ACQUISITION_CATEGORIES = new Set([
    "Land Purchase",
    "Bayna Advance",
    "Registration",
    "Stamp Duty",
    "Mutation",
  ]);

  // Portfolio level aggregations
  let portSales = 0;
  let portCollected = 0;
  let portCost = 0;
  let portDistributed = 0;

  const allProjectsList: {
    id: string;
    projectName: string;
    status: string;
    totalSales: number;
    totalCost: number;
    invoicedProfit: number;
    cashProfit: number;
  }[] = [];

  for (const proj of rawProjects) {
    const acqCost =
      toNum(proj.purchasePrice) +
      toNum(proj.registrationCost) +
      toNum(proj.mutationTaxCost);

    const projExps = allExpenses.filter((e: any) => e.projectId === proj.id);
    const devCost = projExps
      .filter((e: any) => !ACQUISITION_CATEGORIES.has(e.expenseCategory))
      .reduce((s: number, e: any) => s + toNum(e.amount), 0);

    const projTotalCost = acqCost + devCost;

    const projSales = proj.landSales.reduce(
      (s: number, sale: any) => s + toNum(sale.totalAgreedPrice),
      0
    );

    let projCollected = 0;
    for (const sale of proj.landSales) {
      for (const p of sale.customerPayments) {
        projCollected += toNum(p.amountPaid);
      }
    }

    const projDist = allDistributions
      .filter((d: any) => d.projectId === proj.id)
      .reduce((s: number, d: any) => s + toNum(d.payoutAmount), 0);

    portSales += projSales;
    portCollected += projCollected;
    portCost += projTotalCost;
    portDistributed += projDist;

    allProjectsList.push({
      id: proj.id,
      projectName: proj.projectName,
      status: proj.status,
      totalSales: projSales,
      totalCost: projTotalCost,
      invoicedProfit: projSales - projTotalCost,
      cashProfit: projCollected - projTotalCost,
    });
  }

  // Selected project resolution
  const targetProject = filters.projectId
    ? rawProjects.find((p: any) => p.id === filters.projectId) || rawProjects[0]
    : rawProjects[0];

  const grossArea = toNum(targetProject.totalAreaShotok);
  const acqCost =
    toNum(targetProject.purchasePrice) +
    toNum(targetProject.registrationCost) +
    toNum(targetProject.mutationTaxCost);

  const projExps = allExpenses.filter((e: any) => e.projectId === targetProject.id);
  const devCost = projExps
    .filter((e: any) => !ACQUISITION_CATEGORIES.has(e.expenseCategory))
    .reduce((s: number, e: any) => s + toNum(e.amount), 0);
  const totalCost = acqCost + devCost;

  // Sales metrics
  let totalBookedSales = 0;
  let totalCashCollected = 0;
  let soldAreaShotok = 0;
  const recentSales: ProjectSaleDetailItem[] = [];

  for (const sale of targetProject.landSales) {
    const agreed = toNum(sale.totalAgreedPrice);
    const advance = toNum(sale.advanceBookingAmount);
    let collected = 0;
    for (const cp of sale.customerPayments) {
      collected += toNum(cp.amountPaid);
    }
    const due = Math.max(agreed - collected, 0);
    const area = sale.plot ? toNum(sale.plot.plotSizeShotok) : 0;

    totalBookedSales += agreed;
    totalCashCollected += collected;
    soldAreaShotok += area;

    recentSales.push({
      saleId: sale.id,
      buyerName: sale.buyerName,
      plotNumber: sale.plot ? sale.plot.plotNumber : "-",
      plotAreaShotok: area,
      agreedPrice: agreed,
      advanceBooking: advance,
      collectedAmount: collected,
      currentDueAmount: due,
      saleDate: sale.saleDate instanceof Date ? sale.saleDate.toISOString().slice(0, 10) : String(sale.saleDate),
      status: sale.status,
    });
  }

  const activeReceivables = Math.max(totalBookedSales - totalCashCollected, 0);

  // Plot inventory metrics
  const totalPlotsCount = targetProject.projectPlots.length;
  const soldPlotsCount = targetProject.landSales.length;
  const availablePlotsCount = Math.max(totalPlotsCount - soldPlotsCount, 0);

  const totalSaleableArea = targetProject.projectPlots.reduce(
    (s: number, p: any) => s + toNum(p.plotSizeShotok),
    0
  );
  const availableAreaShotok = Math.max(totalSaleableArea - soldAreaShotok, 0);

  const unsoldInventoryAskingValue = targetProject.projectPlots
    .filter((p: any) => p.status === "AVAILABLE")
    .reduce((s: number, p: any) => s + toNum(p.askingPrice), 0);

  // Profit calculations
  const invoicedGrossProfit = totalBookedSales - totalCost;
  const invoicedMargin = totalBookedSales > 0 ? (invoicedGrossProfit / totalBookedSales) * 100 : 0;
  const realisedCashProfit = totalCashCollected - totalCost;
  const collectionRate = totalBookedSales > 0 ? (totalCashCollected / totalBookedSales) * 100 : 0;
  const paybackRate = totalCost > 0 ? (totalCashCollected / totalCost) * 100 : 0;
  const isPaybackAchieved = totalCashCollected >= totalCost;

  // Profit distributions for this project
  const projDistributions = allDistributions.filter(
    (d: any) => d.projectId === targetProject.id
  );
  const profitDistributedToDate = projDistributions.reduce(
    (s: number, d: any) => s + toNum(d.payoutAmount),
    0
  );
  const retainedProjectSurplus = realisedCashProfit - profitDistributedToDate;
  const projectedFullyDilutedProfit = totalBookedSales + unsoldInventoryAskingValue - totalCost;

  // Partner Profit Allocations
  const partnerAllocations: ProjectPartnerProfitItem[] = targetProject.projectPartners.map(
    (pp: any) => {
      const sharePct = toNum(pp.sharePercentage);
      const allocatedInvoiced = invoicedGrossProfit * (sharePct / 100);
      const allocatedRealised = realisedCashProfit * (sharePct / 100);
      const partnerDist = projDistributions
        .filter((d: any) => d.partnerId === pp.partnerId)
        .reduce((s: number, d: any) => s + toNum(d.payoutAmount), 0);

      return {
        partnerId: pp.partnerId,
        partnerName: pp.partner?.name || "Partner",
        sharePercentage: sharePct,
        allocatedInvoicedProfit: allocatedInvoiced,
        allocatedRealisedProfit: allocatedRealised,
        actualProfitReceived: partnerDist,
      };
    }
  );

  // Line Items for the Dual Statement
  const lineItems: PnlLineItem[] = [
    // 1. REVENUE SECTION
    {
      code: "1.0",
      labelEn: "I. PROJECT REVENUE & COLLECTIONS",
      labelBn: "১. প্রকল্প রাজস্ব ও ক্রেতা আদায়",
      invoiced: null,
      realised: null,
      variance: null,
      isHeader: true,
    },
    {
      code: "1.1",
      labelEn: "Gross Plot Sales Contracts (Signed Deeds)",
      labelBn: "প্লট বিক্রয় চুক্তি মূল্য (স্বাক্ষরিত দলিল)",
      invoiced: totalBookedSales,
      realised: totalCashCollected,
      variance: activeReceivables,
    },
    {
      code: "1.2",
      labelEn: "Total Project Inflows Recognized",
      labelBn: "মোট প্রকল্প রাজস্ব স্বীকৃতি",
      invoiced: totalBookedSales,
      realised: totalCashCollected,
      variance: activeReceivables,
      isTotal: true,
    },

    // 2. PROJECT COST SECTION
    {
      code: "2.0",
      labelEn: "II. CAPITALIZED PROJECT COST OF SALES (COGS)",
      labelBn: "২. মূলধনী প্রকল্প ব্যয় ও অধিগ্রহণ খরচ",
      invoiced: null,
      realised: null,
      variance: null,
      isHeader: true,
    },
    {
      code: "2.1",
      labelEn: "Land Acquisition Capital (Purchase, Deeds & Taxes)",
      labelBn: "জমি অধিগ্রহণ মূলধন (ক্রয়, সাব-রেজিস্ট্রি ও কর)",
      invoiced: -acqCost,
      realised: -acqCost,
      variance: 0,
    },
    {
      code: "2.2",
      labelEn: "Civil Infrastructure & Site Development Vouchers",
      labelBn: "অনুমোদিত সাইট অবকাঠামো ও উন্নয়ন ব্যয়",
      invoiced: -devCost,
      realised: -devCost,
      variance: 0,
    },
    {
      code: "2.3",
      labelEn: "Total Capitalized Project Cost",
      labelBn: "মোট মূলধনী প্রকল্প ব্যয়",
      invoiced: -totalCost,
      realised: -totalCost,
      variance: 0,
      isTotal: true,
    },

    // 3. NET OPERATING PROFIT / (LOSS)
    {
      code: "3.0",
      labelEn: "III. NET OPERATING PROFIT / (DEFICIT)",
      labelBn: "৩. নিট পরিচালন লাভ / (ঘাটতি)",
      invoiced: invoicedGrossProfit,
      realised: realisedCashProfit,
      variance: activeReceivables,
      isTotal: true,
    },

    // 4. DISTRIBUTIONS & SURPLUS
    {
      code: "4.0",
      labelEn: "IV. PARTNER EQUITY APPROPRIATION",
      labelBn: "৪. অংশীদার মুনাফা বণ্টন ও সংরক্ষিত তহবিল",
      invoiced: null,
      realised: null,
      variance: null,
      isHeader: true,
    },
    {
      code: "4.1",
      labelEn: "Less: Dividends / Profit Distributed to Partners",
      labelBn: "বাদ: অংশীদারদের বণ্টনকৃত মুনাফা",
      invoiced: -profitDistributedToDate,
      realised: -profitDistributedToDate,
      variance: 0,
    },
    {
      code: "4.2",
      labelEn: "Net Retained Project Treasury Surplus",
      labelBn: "নিট সংরক্ষিত প্রকল্প ট্রেজারি উদ্বৃত্ত",
      invoiced: invoicedGrossProfit - profitDistributedToDate,
      realised: retainedProjectSurplus,
      variance: activeReceivables,
      isTotal: true,
    },
  ];

  // Flattened legacy rows for default fallback table
  const legacyRows: any[] = lineItems.map((li) => ({
    code: li.code,
    label: li.labelEn,
    invoiced: li.invoiced,
    realised: li.realised,
    variance: li.variance,
  }));

  return {
    columns: pnlColumns,
    rows: legacyRows,
    totals: {
      invoiced: invoicedGrossProfit,
      realised: realisedCashProfit,
      variance: activeReceivables,
    },
    summary: [
      { labelEn: "Project", labelBn: "প্রকল্প", value: targetProject.projectName },
      { labelEn: "Total Sales", labelBn: "মোট বিক্রয়", value: `৳ ${totalBookedSales.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Total Cash Collected", labelBn: "মোট নগদ আদায়", value: `৳ ${totalCashCollected.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Invoiced Profit", labelBn: "ইনভয়েসভিত্তিক লাভ", value: `৳ ${invoicedGrossProfit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Realised Cash Profit", labelBn: "প্রকৃত নগদ লাভ", value: `৳ ${realisedCashProfit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Active Receivables", labelBn: "চলতি বকেয়া", value: `৳ ${activeReceivables.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
    ],
    selectedProject: {
      projectId: targetProject.id,
      projectName: targetProject.projectName,
      status: targetProject.status,
      mouza: targetProject.mouza,
      grossAreaShotok: grossArea,
      totalPlotsCount,
      soldPlotsCount,
      availablePlotsCount,
      soldAreaShotok,
      availableAreaShotok,
      totalBookedSales,
      totalCashCollected,
      activeReceivables,
      unsoldInventoryAskingValue,
      totalAcquisitionCost: acqCost,
      totalDevelopmentCost: devCost,
      totalProjectCost: totalCost,
      invoicedGrossProfit,
      invoicedMargin,
      realisedCashProfit,
      collectionRate,
      paybackRate,
      isPaybackAchieved,
      profitDistributedToDate,
      retainedProjectSurplus,
      projectedFullyDilutedProfit,
      lineItems,
      partnerAllocations,
      recentSales,
    },
    allProjectsList,
    portfolioKpis: {
      totalSyndicateSales: portSales,
      totalSyndicateCollected: portCollected,
      totalSyndicateCost: portCost,
      totalSyndicateReceivables: portSales - portCollected,
      totalSyndicateInvoicedProfit: portSales - portCost,
      totalSyndicateCashProfit: portCollected - portCost,
      totalSyndicateDistributed: portDistributed,
    },
  };
}
