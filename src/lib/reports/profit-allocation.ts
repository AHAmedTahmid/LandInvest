import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const allocationColumns: ReportColumn[] = [
  { key: "partnerName", labelEn: "Equity Partner", labelBn: "অংশীদার" },
  { key: "sharePercentage", labelEn: "Syndicate Share %", labelBn: "শেয়ার %", type: "number", align: "right" },
  { key: "grossEntitlement", labelEn: "Gross Entitlement (৳)", labelBn: "মোট প্রাপ্য লাভ (৳)", type: "number", align: "right" },
  { key: "statutoryReserve", labelEn: "Reserve Retained (৳)", labelBn: "সংরক্ষিত তহবিল (৳)", type: "number", align: "right" },
  { key: "netAllocated", labelEn: "Net Distributable (৳)", labelBn: "নিট বণ্টনযোগ্য (৳)", type: "number", align: "right" },
  { key: "historicallyPaid", labelEn: "Disbursed to Date (৳)", labelBn: "পরিশোধিত লভ্যাংশ (৳)", type: "number", align: "right" },
  { key: "pendingSurplus", labelEn: "Pending Surplus (৳)", labelBn: "অবশিষ্ট উদ্বৃত্ত (৳)", type: "number", align: "right" },
  { key: "status", labelEn: "Payout Status", labelBn: "অবস্থা" },
];

export interface PartnerAllocationDetail {
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  partnerEmail: string;
  partnerNid: string;
  sharePercentage: number;
  initialCapitalContribution: number;
  grossEntitlement: number;
  statutoryReserve: number;
  netAllocated: number;
  historicallyPaid: number;
  pendingSurplus: number;
  status: "FULLY_PAID" | "PARTIALLY_PAID" | "PENDING_DISBURSEMENT" | "NO_SURPLUS";
  statusLabelEn: string;
  statusLabelBn: string;
  distributionHistory: {
    id: string;
    date: string;
    amount: number;
    basis: string;
  }[];
}

export interface ProfitAllocationKpis {
  totalProjectRevenue: number;
  totalProjectCost: number;
  grossProjectProfit: number;
  statutoryReserveAmount: number;
  netDistributableProfit: number;
  totalDisbursedToDate: number;
  totalPendingSurplus: number;
  partnersCount: number;
  effectiveRealizationRate: number;
  basis: "INVOICED_BASIS" | "CASH_BASIS" | "HISTORICAL_AUDIT";
}

export interface ProfitAllocationProjectSummary {
  projectId: string;
  projectName: string;
  projectLocation: string;
  mouza: string;
  status: string;
  grossAreaShotok: number;
  totalAgreedSales: number;
  totalCashCollected: number;
  totalApprovedExpenses: number;
  netProfitInvoiced: number;
  netProfitCash: number;
}

export interface ProfitAllocationResult extends ReportData {
  kpis: ProfitAllocationKpis;
  projectSummary: ProfitAllocationProjectSummary;
  partnerAllocations: PartnerAllocationDetail[];
  availableProjects: { id: string; projectName: string }[];
}

export async function queryProfitAllocation(prisma: any, filters: ReportFilters): Promise<ProfitAllocationResult> {
  // 1. Fetch available projects
  const allProjects = await prisma.landProject.findMany({
    select: {
      id: true,
      projectName: true,
      mouza: true,
      jlNumber: true,
      status: true,
      totalAreaShotok: true,
    },
    orderBy: { projectName: "asc" },
  });

  const selectedProjectId = filters.projectId && filters.projectId !== "ALL"
    ? filters.projectId
    : allProjects[0]?.id;

  const currentProject = allProjects.find((p: any) => p.id === selectedProjectId) || allProjects[0];

  if (!currentProject) {
    const emptyKpis: ProfitAllocationKpis = {
      totalProjectRevenue: 0,
      totalProjectCost: 0,
      grossProjectProfit: 0,
      statutoryReserveAmount: 0,
      netDistributableProfit: 0,
      totalDisbursedToDate: 0,
      totalPendingSurplus: 0,
      partnersCount: 0,
      effectiveRealizationRate: 0,
      basis: "CASH_BASIS",
    };
    return {
      columns: allocationColumns,
      rows: [],
      totals: {},
      kpis: emptyKpis,
      projectSummary: {
        projectId: "",
        projectName: "No Project",
        projectLocation: "",
        mouza: "",
        status: "",
        grossAreaShotok: 0,
        totalAgreedSales: 0,
        totalCashCollected: 0,
        totalApprovedExpenses: 0,
        netProfitInvoiced: 0,
        netProfitCash: 0,
      },
      partnerAllocations: [],
      availableProjects: [],
    };
  }

  // 2. Fetch project sales and customer payments
  const projectSales = await prisma.landSale.findMany({
    where: { projectId: currentProject.id },
    include: {
      customerPayments: {
        select: { amountPaid: true },
      },
    },
  });

  let totalAgreedSales = 0;
  let totalCashCollected = 0;
  for (const s of projectSales) {
    totalAgreedSales += toNum(s.totalAgreedPrice);
    for (const cp of s.customerPayments) {
      totalCashCollected += toNum(cp.amountPaid);
    }
  }

  // 3. Fetch project expenses (Approved vouchers)
  const projectExpenses = await prisma.projectExpense.findMany({
    where: {
      projectId: currentProject.id,
      status: "APPROVED",
    },
    select: { amount: true },
  });

  const totalApprovedExpenses = projectExpenses.reduce((sum: number, e: any) => sum + toNum(e.amount), 0);

  const netProfitInvoiced = Math.max(0, totalAgreedSales - totalApprovedExpenses);
  const netProfitCash = Math.max(0, totalCashCollected - totalApprovedExpenses);

  // 4. Fetch project partners
  const projectPartners = await prisma.projectPartner.findMany({
    where: { projectId: currentProject.id },
    include: {
      partner: true,
    },
    orderBy: { sharePercentage: "desc" },
  });

  // 5. Fetch all executed profit distributions for this project
  const profitDistributions = await prisma.profitDistribution.findMany({
    where: { projectId: currentProject.id },
    orderBy: { distributionDate: "desc" },
  });

  const distributionsByPartner = new Map<string, any[]>();
  for (const pd of profitDistributions) {
    const list = distributionsByPartner.get(pd.partnerId) || [];
    list.push(pd);
    distributionsByPartner.set(pd.partnerId, list);
  }

  // Determine profit distribution basis and total base profit
  // If there are recorded distributions in the database, use the audited net profit benchmark
  let baseNetProfit = netProfitInvoiced > 0 ? netProfitInvoiced : (netProfitCash > 0 ? netProfitCash : 0);
  let basis: "INVOICED_BASIS" | "CASH_BASIS" | "HISTORICAL_AUDIT" = "INVOICED_BASIS";

  if (profitDistributions.length > 0) {
    const benchmark = toNum(profitDistributions[0].totalProjectNetProfit);
    if (benchmark > 0) {
      baseNetProfit = benchmark;
      basis = profitDistributions[0].realizationBasis === "CASH_BASIS" ? "CASH_BASIS" : "HISTORICAL_AUDIT";
    }
  } else if (netProfitCash > 0 && netProfitInvoiced <= 0) {
    baseNetProfit = netProfitCash;
    basis = "CASH_BASIS";
  }

  // Statutory reserve policy: 5% contingency retained before allocation
  const reserveRate = 0.05;
  const statutoryReserveAmount = baseNetProfit * reserveRate;
  const netDistributableProfit = baseNetProfit - statutoryReserveAmount;

  // 6. Build partner allocations
  let totalDisbursedToDate = 0;
  const partnerAllocations: PartnerAllocationDetail[] = projectPartners.map((pp: any) => {
    const sharePct = toNum(pp.sharePercentage);
    const partnerId = pp.partnerId;
    const partnerName = pp.partner.name;
    const partnerPhone = pp.partner.phone || "01700-000000";
    const partnerEmail = pp.partner.email || `${partnerName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;
    const partnerNid = pp.partner.nid || "N/A";

    // Pro-rata shares
    const grossEntitlement = (baseNetProfit * sharePct) / 100;
    const statutoryReserve = (statutoryReserveAmount * sharePct) / 100;
    const netAllocated = (netDistributableProfit * sharePct) / 100;

    // Actual disbursements from profit_distributions table
    const pastDistributions = distributionsByPartner.get(partnerId) || [];
    const historicallyPaid = pastDistributions.reduce((acc, d) => acc + toNum(d.payoutAmount), 0);
    totalDisbursedToDate += historicallyPaid;

    const pendingSurplus = Math.max(0, netAllocated - historicallyPaid);

    let status: "FULLY_PAID" | "PARTIALLY_PAID" | "PENDING_DISBURSEMENT" | "NO_SURPLUS" = "PENDING_DISBURSEMENT";
    let statusLabelEn = "Pending Disbursement";
    let statusLabelBn = "বণ্টন অপেক্ষমাণ";

    if (netAllocated <= 0) {
      status = "NO_SURPLUS";
      statusLabelEn = "No Surplus";
      statusLabelBn = "উদ্বৃত্ত নেই";
    } else if (historicallyPaid >= netAllocated) {
      status = "FULLY_PAID";
      statusLabelEn = "Fully Disbursed";
      statusLabelBn = "সম্পূর্ণ পরিশোধিত";
    } else if (historicallyPaid > 0) {
      status = "PARTIALLY_PAID";
      statusLabelEn = "Partially Disbursed";
      statusLabelBn = "আংশিক পরিশোধিত";
    }

    return {
      partnerId,
      partnerName,
      partnerPhone,
      partnerEmail,
      partnerNid,
      sharePercentage: sharePct,
      initialCapitalContribution: toNum(pp.capitalContributed ?? 0),
      grossEntitlement,
      statutoryReserve,
      netAllocated,
      historicallyPaid,
      pendingSurplus,
      status,
      statusLabelEn,
      statusLabelBn,
      distributionHistory: pastDistributions.map((pd) => ({
        id: pd.id,
        date: pd.distributionDate instanceof Date ? pd.distributionDate.toISOString().slice(0, 10) : String(pd.distributionDate).slice(0, 10),
        amount: toNum(pd.payoutAmount),
        basis: pd.realizationBasis,
      })),
    };
  });

  const totalPendingSurplus = Math.max(0, netDistributableProfit - totalDisbursedToDate);
  const effectiveRealizationRate = baseNetProfit > 0 ? (totalDisbursedToDate / netDistributableProfit) * 100 : 0;

  const kpis: ProfitAllocationKpis = {
    totalProjectRevenue: totalAgreedSales,
    totalProjectCost: totalApprovedExpenses,
    grossProjectProfit: baseNetProfit,
    statutoryReserveAmount,
    netDistributableProfit,
    totalDisbursedToDate,
    totalPendingSurplus,
    partnersCount: projectPartners.length,
    effectiveRealizationRate,
    basis,
  };

  const projectSummary: ProfitAllocationProjectSummary = {
    projectId: currentProject.id,
    projectName: currentProject.projectName,
    projectLocation: currentProject.mouza ? `Mouza: ${currentProject.mouza}` : "Dhaka Division",
    mouza: currentProject.mouza || "-",
    status: currentProject.status || "ACTIVE",
    grossAreaShotok: toNum((currentProject as any).totalAreaShotok || 0),
    totalAgreedSales,
    totalCashCollected,
    totalApprovedExpenses,
    netProfitInvoiced,
    netProfitCash,
  };

  const rows = partnerAllocations.map((pa) => ({
    partnerName: pa.partnerName,
    sharePercentage: pa.sharePercentage,
    grossEntitlement: pa.grossEntitlement,
    statutoryReserve: pa.statutoryReserve,
    netAllocated: pa.netAllocated,
    historicallyPaid: pa.historicallyPaid,
    pendingSurplus: pa.pendingSurplus,
    status: pa.statusLabelEn,
  }));

  return {
    columns: allocationColumns,
    rows,
    totals: {
      grossEntitlement: baseNetProfit,
      statutoryReserve: statutoryReserveAmount,
      netAllocated: netDistributableProfit,
      historicallyPaid: totalDisbursedToDate,
      pendingSurplus: totalPendingSurplus,
    },
    kpis,
    projectSummary,
    partnerAllocations,
    availableProjects: allProjects.map((p: any) => ({ id: p.id, projectName: p.projectName })),
  };
}
