import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const projectCostColumns: ReportColumn[] = [
  { key: "category", labelEn: "Cost Category", labelBn: "ব্যয়ের বিভাগ" },
  { key: "classification", labelEn: "Classification", labelBn: "শ্রেণীবিভাগ" },
  { key: "voucherCount", labelEn: "Vouchers", labelBn: "ভাউচার সংখ্যা", type: "number", align: "center" },
  { key: "amount", labelEn: "Total Amount (BDT)", labelBn: "মোট পরিমাণ (টাকা)", type: "number", align: "right" },
  { key: "pctOfTotal", labelEn: "% of Budget", labelBn: "বাজেটের %", type: "number", align: "right" },
  { key: "costPerGrossShotok", labelEn: "Cost / Gross Shotok", labelBn: "প্রতি মোট শতক খরচ", type: "number", align: "right" },
  { key: "costPerSaleableShotok", labelEn: "Cost / Net Saleable Shotok", labelBn: "প্রতি বিক্রয়যোগ্য শতক খরচ", type: "number", align: "right" },
];

export interface ProjectCostItem {
  category: string;
  categoryBn: string;
  classification: "ACQUISITION" | "DEVELOPMENT";
  voucherCount: number;
  amount: number;
  pctOfTotal: number;
  pctOfClassification: number;
  costPerGrossShotok: number;
  costPerSaleableShotok: number;
}

export interface ProjectVoucherItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentChannel: string;
  paidByPartnerName: string | null;
  status: string;
}

export interface ProjectCostSummary {
  projectId: string;
  projectName: string;
  status: string;
  mouza: string;
  jlNumber: string | null;
  dagNumbers: string;
  khatianNumbers: string;
  totalGrossAreaShotok: number;
  totalSaleableAreaShotok: number;
  infrastructureAreaShotok: number;
  efficiencyRatio: number;
  totalPlotsCount: number;
  targetSalesValue: number;
  totalAcquisitionCost: number;
  totalDevelopmentCost: number;
  totalProjectCost: number;
  grossCostPerShotok: number;
  saleableCostPerShotok: number;
  projectedProfit: number;
  projectedMargin: number;
  acquisitionItems: ProjectCostItem[];
  developmentItems: ProjectCostItem[];
  vouchers: ProjectVoucherItem[];
}

export interface ProjectCostReportData extends ReportData {
  selectedProject: ProjectCostSummary;
  allProjectsList: {
    id: string;
    projectName: string;
    status: string;
    totalCost: number;
    grossArea: number;
    plotCount: number;
  }[];
  portfolioKpis: {
    totalSyndicateCost: number;
    totalAcquisitionCost: number;
    totalDevelopmentCost: number;
    totalGrossAreaShotok: number;
    totalSaleableAreaShotok: number;
    averageGrossCostPerShotok: number;
    averageSaleableCostPerShotok: number;
    totalPlotsCount: number;
    totalTargetSalesValue: number;
  };
}

const CATEGORY_BN_MAP: Record<string, string> = {
  "Land Purchase": "জমি ক্রয় চুক্তি মূল্য",
  "Bayna Advance": "বায়না অগ্রিম প্রদান",
  "Registration": "সাব-রেজিস্ট্রি দলিল রেজিস্ট্রেশন",
  "Stamp Duty": "স্ট্যাম্প ডিউটি ও সরকারি ফি",
  "Mutation": "নামজারি ও ডি.সি.আর কর",
  "Earth Filling": "মাটি ভরাট ও সাইট লেভেলিং",
  "Access Road": "প্রকল্প সংযোগ ও অভ্যন্তরীণ রাস্তা",
  "Drainage": "বৃষ্টির পানি নিষ্কাশন ও ড্রেনেজ লাইন",
  "Boundary Wall": "সীমানা প্রাচীর ও আরসিসি পিলার",
  "Cadastral Survey": "মৌজা নকশা ডিজিটাল সার্ভে ও সীমানা নির্ধারণ",
  "Marketing Signboard": "প্রকল্প বিলবোর্ড ও দিকনির্দেশক সাইনবোর্ড",
  "Security Honorarium": "সাইট নিরাপত্তা ও প্রহরীদের সম্মানী",
  "Sub-Registry Drafting": "দলিল ড্রাফটিং ও লিগ্যাল ভেটিং",
  "Site Utilities": "বিদ্যুৎ সংযোগ ও সাইট অবকাঠামো",
};

export async function queryProjectCost(
  prisma: any,
  filters: ReportFilters
): Promise<ProjectCostReportData> {
  // Fetch all land projects
  const rawProjects = await prisma.landProject.findMany({
    include: {
      projectPlots: {
        select: {
          id: true,
          plotNumber: true,
          plotSizeShotok: true,
          askingPrice: true,
          status: true,
        },
      },
    },
    orderBy: { projectName: "asc" },
  });

  if (!rawProjects || rawProjects.length === 0) {
    return {
      columns: projectCostColumns,
      rows: [],
      totals: { amount: 0 },
      summary: [],
      selectedProject: {
        projectId: "",
        projectName: "No Project Found",
        status: "N/A",
        mouza: "-",
        jlNumber: null,
        dagNumbers: "-",
        khatianNumbers: "-",
        totalGrossAreaShotok: 0,
        totalSaleableAreaShotok: 0,
        infrastructureAreaShotok: 0,
        efficiencyRatio: 0,
        totalPlotsCount: 0,
        targetSalesValue: 0,
        totalAcquisitionCost: 0,
        totalDevelopmentCost: 0,
        totalProjectCost: 0,
        grossCostPerShotok: 0,
        saleableCostPerShotok: 0,
        projectedProfit: 0,
        projectedMargin: 0,
        acquisitionItems: [],
        developmentItems: [],
        vouchers: [],
      },
      allProjectsList: [],
      portfolioKpis: {
        totalSyndicateCost: 0,
        totalAcquisitionCost: 0,
        totalDevelopmentCost: 0,
        totalGrossAreaShotok: 0,
        totalSaleableAreaShotok: 0,
        averageGrossCostPerShotok: 0,
        averageSaleableCostPerShotok: 0,
        totalPlotsCount: 0,
        totalTargetSalesValue: 0,
      },
    };
  }

  // Fetch all approved expenses
  const allExpenses = await prisma.projectExpense.findMany({
    where: { status: "APPROVED" },
    include: {
      paidByPartner: {
        select: { id: true, name: true },
      },
    },
    orderBy: { expenseDate: "desc" },
  });

  // Calculate portfolio totals across all projects
  let portSyndicateCost = 0;
  let portAcqCost = 0;
  let portDevCost = 0;
  let portGrossArea = 0;
  let portSaleableArea = 0;
  let portPlotsCount = 0;
  let portTargetSalesValue = 0;

  const allProjectsList: {
    id: string;
    projectName: string;
    status: string;
    totalCost: number;
    grossArea: number;
    plotCount: number;
  }[] = [];

  const ACQUISITION_CATEGORIES = new Set([
    "Land Purchase",
    "Bayna Advance",
    "Registration",
    "Stamp Duty",
    "Mutation",
  ]);

  for (const proj of rawProjects) {
    const grossArea = toNum(proj.totalAreaShotok);
    const acqCost =
      toNum(proj.purchasePrice) +
      toNum(proj.registrationCost) +
      toNum(proj.mutationTaxCost);

    const projExps = allExpenses.filter((e: any) => e.projectId === proj.id);
    const devCost = projExps
      .filter((e: any) => !ACQUISITION_CATEGORIES.has(e.expenseCategory))
      .reduce((s: number, e: any) => s + toNum(e.amount), 0);

    const projTotalCost = acqCost + devCost;
    const saleableArea = proj.projectPlots.reduce(
      (s: number, p: any) => s + toNum(p.plotSizeShotok),
      0
    );
    const targetSales = proj.projectPlots.reduce(
      (s: number, p: any) => s + toNum(p.askingPrice),
      0
    );

    portSyndicateCost += projTotalCost;
    portAcqCost += acqCost;
    portDevCost += devCost;
    portGrossArea += grossArea;
    portSaleableArea += saleableArea;
    portPlotsCount += proj.projectPlots.length;
    portTargetSalesValue += targetSales;

    allProjectsList.push({
      id: proj.id,
      projectName: proj.projectName,
      status: proj.status,
      totalCost: projTotalCost,
      grossArea,
      plotCount: proj.projectPlots.length,
    });
  }

  // Identify target selected project (from filter or default to first project)
  const targetProject = filters.projectId
    ? rawProjects.find((p: any) => p.id === filters.projectId) || rawProjects[0]
    : rawProjects[0];

  const grossArea = toNum(targetProject.totalAreaShotok);
  const saleableArea = targetProject.projectPlots.reduce(
    (s: number, p: any) => s + toNum(p.plotSizeShotok),
    0
  );
  const infraArea = Math.max(grossArea - saleableArea, 0);
  const efficiencyRatio = grossArea > 0 ? (saleableArea / grossArea) * 100 : 0;
  const targetSales = targetProject.projectPlots.reduce(
    (s: number, p: any) => s + toNum(p.askingPrice),
    0
  );

  // Filter vouchers for this project
  const projectVouchers = allExpenses.filter(
    (e: any) => e.projectId === targetProject.id
  );

  // Group vouchers by category
  const vouchersByCategory = new Map<
    string,
    { count: number; total: number; isAcq: boolean }
  >();

  for (const v of projectVouchers) {
    const cat = v.expenseCategory;
    const amt = toNum(v.amount);
    const isAcq = ACQUISITION_CATEGORIES.has(cat);
    const existing = vouchersByCategory.get(cat) || { count: 0, total: 0, isAcq };
    existing.count += 1;
    existing.total += amt;
    vouchersByCategory.set(cat, existing);
  }

  // Base Acquisition figures from LandProject master record
  const purchasePrice = toNum(targetProject.purchasePrice);
  const registrationCost = toNum(targetProject.registrationCost);
  const mutationTaxCost = toNum(targetProject.mutationTaxCost);
  const baynaAmount = toNum(targetProject.baynaAmount);
  const totalAcqCost = purchasePrice + registrationCost + mutationTaxCost;

  // Development expenses from vouchers
  let totalDevCost = 0;
  const devItemsMap = new Map<string, { count: number; total: number }>();
  for (const [cat, data] of vouchersByCategory.entries()) {
    if (!ACQUISITION_CATEGORIES.has(cat)) {
      devItemsMap.set(cat, { count: data.count, total: data.total });
      totalDevCost += data.total;
    }
  }

  const totalProjCost = totalAcqCost + totalDevCost;
  const grossCostPerShotok = grossArea > 0 ? totalProjCost / grossArea : 0;
  const saleableCostPerShotok = saleableArea > 0 ? totalProjCost / saleableArea : 0;
  const projectedProfit = targetSales - totalProjCost;
  const projectedMargin = targetSales > 0 ? (projectedProfit / targetSales) * 100 : 0;

  // Build Acquisition Cost Items
  const acqVouchers = projectVouchers.filter((v: any) =>
    ACQUISITION_CATEGORIES.has(v.expenseCategory)
  );
  const regVoucherCount = acqVouchers.filter(
    (v: any) => v.expenseCategory === "Registration" || v.expenseCategory === "Stamp Duty"
  ).length;
  const mutVoucherCount = acqVouchers.filter(
    (v: any) => v.expenseCategory === "Mutation"
  ).length;
  const baynaVoucherCount = acqVouchers.filter(
    (v: any) => v.expenseCategory === "Bayna Advance"
  ).length;

  const acquisitionItems: ProjectCostItem[] = [
    {
      category: "Land Purchase Deed Value",
      categoryBn: "জমি ক্রয় চুক্তি মূল্য",
      classification: "ACQUISITION",
      voucherCount: baynaVoucherCount || 1,
      amount: purchasePrice,
      pctOfTotal: totalProjCost > 0 ? (purchasePrice / totalProjCost) * 100 : 0,
      pctOfClassification: totalAcqCost > 0 ? (purchasePrice / totalAcqCost) * 100 : 0,
      costPerGrossShotok: grossArea > 0 ? purchasePrice / grossArea : 0,
      costPerSaleableShotok: saleableArea > 0 ? purchasePrice / saleableArea : 0,
    },
    {
      category: "Stamp Duty & Registration Fee",
      categoryBn: "স্ট্যাম্প ডিউটি ও সরকারি নিবন্ধন ফি",
      classification: "ACQUISITION",
      voucherCount: regVoucherCount || 1,
      amount: registrationCost,
      pctOfTotal: totalProjCost > 0 ? (registrationCost / totalProjCost) * 100 : 0,
      pctOfClassification: totalAcqCost > 0 ? (registrationCost / totalAcqCost) * 100 : 0,
      costPerGrossShotok: grossArea > 0 ? registrationCost / grossArea : 0,
      costPerSaleableShotok: saleableArea > 0 ? registrationCost / saleableArea : 0,
    },
    {
      category: "Mutation Tax & Namzari Fee",
      categoryBn: "নামজারি ও ডি.সি.আর খারিজ কর",
      classification: "ACQUISITION",
      voucherCount: mutVoucherCount || 1,
      amount: mutationTaxCost,
      pctOfTotal: totalProjCost > 0 ? (mutationTaxCost / totalProjCost) * 100 : 0,
      pctOfClassification: totalAcqCost > 0 ? (mutationTaxCost / totalAcqCost) * 100 : 0,
      costPerGrossShotok: grossArea > 0 ? mutationTaxCost / grossArea : 0,
      costPerSaleableShotok: saleableArea > 0 ? mutationTaxCost / saleableArea : 0,
    },
  ];

  // Build Development Cost Items
  const developmentItems: ProjectCostItem[] = [];
  for (const [cat, data] of devItemsMap.entries()) {
    developmentItems.push({
      category: cat,
      categoryBn: CATEGORY_BN_MAP[cat] || cat,
      classification: "DEVELOPMENT",
      voucherCount: data.count,
      amount: data.total,
      pctOfTotal: totalProjCost > 0 ? (data.total / totalProjCost) * 100 : 0,
      pctOfClassification: totalDevCost > 0 ? (data.total / totalDevCost) * 100 : 0,
      costPerGrossShotok: grossArea > 0 ? data.total / grossArea : 0,
      costPerSaleableShotok: saleableArea > 0 ? data.total / saleableArea : 0,
    });
  }

  // Sort development items by amount descending
  developmentItems.sort((a, b) => b.amount - a.amount);

  // Vouchers list for detail view
  const vouchersList: ProjectVoucherItem[] = projectVouchers.map((v: any) => ({
    id: v.id,
    category: v.expenseCategory,
    description: v.description || "-",
    amount: toNum(v.amount),
    expenseDate: v.expenseDate instanceof Date ? v.expenseDate.toISOString().slice(0, 10) : String(v.expenseDate),
    paymentChannel: v.paymentChannel || "CASH",
    paidByPartnerName: v.paidByPartner?.name || null,
    status: v.status,
  }));

  // Flattened legacy rows for default fallback table
  const legacyRows: any[] = [
    ...acquisitionItems.map((item) => ({
      category: item.category,
      classification: "Acquisition Capital",
      voucherCount: item.voucherCount,
      amount: item.amount,
      pctOfTotal: `${item.pctOfTotal.toFixed(2)}%`,
      costPerGrossShotok: item.costPerGrossShotok,
      costPerSaleableShotok: item.costPerSaleableShotok,
    })),
    ...developmentItems.map((item) => ({
      category: item.category,
      classification: "Civil Development",
      voucherCount: item.voucherCount,
      amount: item.amount,
      pctOfTotal: `${item.pctOfTotal.toFixed(2)}%`,
      costPerGrossShotok: item.costPerGrossShotok,
      costPerSaleableShotok: item.costPerSaleableShotok,
    })),
  ];

  return {
    columns: projectCostColumns,
    rows: legacyRows,
    totals: {
      amount: totalProjCost,
    },
    summary: [
      { labelEn: "Project Name", labelBn: "প্রকল্পের নাম", value: targetProject.projectName },
      { labelEn: "Status", labelBn: "অবস্থা", value: targetProject.status },
      { labelEn: "Gross Land Area", labelBn: "মোট জমি", value: `${grossArea.toFixed(2)} Shotok` },
      { labelEn: "Net Saleable Area", labelBn: "বিক্রয়যোগ্য জমি", value: `${saleableArea.toFixed(2)} Shotok (${efficiencyRatio.toFixed(1)}%)` },
      { labelEn: "Total Project Cost", labelBn: "মোট প্রকল্প ব্যয়", value: `৳ ${totalProjCost.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Gross Cost / Shotok", labelBn: "প্রতি শতক মোট খরচ", value: `৳ ${grossCostPerShotok.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
      { labelEn: "Net Saleable Cost / Shotok", labelBn: "প্রতি শতক বিক্রয়যোগ্য খরচ", value: `৳ ${saleableCostPerShotok.toLocaleString("en-BD", { minimumFractionDigits: 2 })}` },
    ],
    selectedProject: {
      projectId: targetProject.id,
      projectName: targetProject.projectName,
      status: targetProject.status,
      mouza: targetProject.mouza,
      jlNumber: targetProject.jlNumber,
      dagNumbers: targetProject.dagNumbers,
      khatianNumbers: targetProject.khatianNumbers,
      totalGrossAreaShotok: grossArea,
      totalSaleableAreaShotok: saleableArea,
      infrastructureAreaShotok: infraArea,
      efficiencyRatio,
      totalPlotsCount: targetProject.projectPlots.length,
      targetSalesValue: targetSales,
      totalAcquisitionCost: totalAcqCost,
      totalDevelopmentCost: totalDevCost,
      totalProjectCost: totalProjCost,
      grossCostPerShotok,
      saleableCostPerShotok,
      projectedProfit,
      projectedMargin,
      acquisitionItems,
      developmentItems,
      vouchers: vouchersList,
    },
    allProjectsList,
    portfolioKpis: {
      totalSyndicateCost: portSyndicateCost,
      totalAcquisitionCost: portAcqCost,
      totalDevelopmentCost: portDevCost,
      totalGrossAreaShotok: portGrossArea,
      totalSaleableAreaShotok: portSaleableArea,
      averageGrossCostPerShotok: portGrossArea > 0 ? portSyndicateCost / portGrossArea : 0,
      averageSaleableCostPerShotok: portSaleableArea > 0 ? portSyndicateCost / portSaleableArea : 0,
      totalPlotsCount: portPlotsCount,
      totalTargetSalesValue: portTargetSalesValue,
    },
  };
}
