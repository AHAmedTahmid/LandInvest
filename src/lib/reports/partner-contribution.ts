import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const contributionColumns: ReportColumn[] = [
  { key: "project", labelEn: "Project Name", labelBn: "প্রকল্পের নাম" },
  { key: "partner", labelEn: "Partner", labelBn: "অংশীদার" },
  { key: "sharePct", labelEn: "Share %", labelBn: "শেয়ার %", type: "number", align: "center" },
  { key: "budgetedShare", labelEn: "Required Commitment (BDT)", labelBn: "চুক্তিবদ্ধ মূলধন অংশ (টাকা)", type: "number", align: "right" },
  { key: "directExpense", labelEn: "Direct Expense Paid (BDT)", labelBn: "সরাসরি ব্যয় প্রদান (টাকা)", type: "number", align: "right" },
  { key: "treasuryCapital", labelEn: "Treasury Capital Allocated (BDT)", labelBn: "ট্রেজারি মূলধন বরাদ্দ (টাকা)", type: "number", align: "right" },
  { key: "totalContribution", labelEn: "Total Contribution (BDT)", labelBn: "মোট অবদান (টাকা)", type: "number", align: "right" },
  { key: "variance", labelEn: "Variance / Standing (BDT)", labelBn: "পার্থক্য / অবস্থা (টাকা)", type: "number", align: "right" },
  { key: "profitReceived", labelEn: "Profit Distributed (BDT)", labelBn: "বণ্টনকৃত মুনাফা (টাকা)", type: "number", align: "right" },
];

export interface ProjectPartnerContributionItem {
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  sharePercentage: number;
  budgetedShare: number;
  directExpensesPaid: number;
  treasuryCapitalShare: number;
  totalContribution: number;
  variance: number;
  varianceStatus: "SURPLUS" | "DEFICIT" | "BALANCED";
  profitReceived: number;
}

export interface ProjectContributionGroup {
  projectId: string;
  projectName: string;
  status: string;
  totalAreaShotok: number;
  acquisitionCost: number;
  developmentExpenses: number;
  totalProjectCost: number;
  directPartnerFunding: number;
  treasuryFunding: number;
  totalProfitDistributed: number;
  partners: ProjectPartnerContributionItem[];
}

export interface PartnerContributionData extends ReportData {
  projects: ProjectContributionGroup[];
  kpis: {
    totalSyndicateProjectCost: number;
    totalAcquisitionCost: number;
    totalDevelopmentCost: number;
    totalDirectPartnerFunded: number;
    totalTreasuryFunded: number;
    totalProfitDistributed: number;
    activeProjectsCount: number;
    participatingPartnersCount: number;
  };
}

export async function queryPartnerContribution(prisma: any, filters?: ReportFilters): Promise<PartnerContributionData> {
  const [rawProjects, rawExpenses, rawDistributions] = await Promise.all([
    prisma.landProject.findMany({
      include: {
        projectPartners: {
          include: {
            partner: {
              select: { id: true, name: true, phone: true, bankName: true },
            },
          },
          orderBy: { sharePercentage: "desc" },
        },
      },
      orderBy: { projectName: "asc" },
    }),
    prisma.projectExpense.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        projectId: true,
        amount: true,
        paidByPartnerId: true,
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

  const targetProjects = filters?.projectId
    ? rawProjects.filter((p: any) => p.id === filters.projectId)
    : rawProjects;

  let totalSyndicateProjectCost = 0;
  let totalAcquisitionCost = 0;
  let totalDevelopmentCost = 0;
  let totalDirectPartnerFunded = 0;
  let totalTreasuryFunded = 0;
  let totalProfitDistributed = 0;
  const uniquePartnerIds = new Set<string>();

  const projectGroups: ProjectContributionGroup[] = [];
  const legacyRows: any[] = [];

  for (const proj of targetProjects) {
    const acqCost =
      toNum(proj.purchasePrice) +
      toNum(proj.registrationCost) +
      toNum(proj.mutationTaxCost);

    // Development expenses for this project
    const projExpenses = rawExpenses.filter((e: any) => e.projectId === proj.id);
    const devCost = projExpenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);
    const totalProjCost = acqCost + devCost;

    // Total direct expenses paid by partners for this project
    const directExpensesByPartner = new Map<string, number>();
    let totalDirectPaidForProject = 0;

    for (const e of projExpenses) {
      if (e.paidByPartnerId) {
        const amt = toNum(e.amount);
        directExpensesByPartner.set(
          e.paidByPartnerId,
          (directExpensesByPartner.get(e.paidByPartnerId) || 0) + amt
        );
        totalDirectPaidForProject += amt;
      }
    }

    // Profit distributions for this project
    const profitByPartner = new Map<string, number>();
    let totalProfitForProject = 0;
    const projDistributions = rawDistributions.filter((d: any) => d.projectId === proj.id);
    for (const d of projDistributions) {
      const amt = toNum(d.payoutAmount);
      profitByPartner.set(d.partnerId, (profitByPartner.get(d.partnerId) || 0) + amt);
      totalProfitForProject += amt;
    }

    // Remaining cost funded from syndicate corporate treasury
    const treasuryFundedForProject = Math.max(totalProjCost - totalDirectPaidForProject, 0);

    totalSyndicateProjectCost += totalProjCost;
    totalAcquisitionCost += acqCost;
    totalDevelopmentCost += devCost;
    totalDirectPartnerFunded += totalDirectPaidForProject;
    totalTreasuryFunded += treasuryFundedForProject;
    totalProfitDistributed += totalProfitForProject;

    const partnerItems: ProjectPartnerContributionItem[] = [];

    for (const pp of proj.projectPartners) {
      if (filters?.partnerId && pp.partnerId !== filters.partnerId) continue;

      uniquePartnerIds.add(pp.partnerId);
      const sharePct = toNum(pp.sharePercentage);
      const budgetedShare = totalProjCost * (sharePct / 100);
      const directPaid = directExpensesByPartner.get(pp.partnerId) || 0;
      const treasuryShare = treasuryFundedForProject * (sharePct / 100);
      const totalContributed = directPaid + treasuryShare;
      const variance = totalContributed - budgetedShare;

      let varianceStatus: "SURPLUS" | "DEFICIT" | "BALANCED" = "BALANCED";
      if (variance > 1) varianceStatus = "SURPLUS";
      else if (variance < -1) varianceStatus = "DEFICIT";

      const profitReceived = profitByPartner.get(pp.partnerId) || 0;

      partnerItems.push({
        partnerId: pp.partnerId,
        partnerName: pp.partner?.name || "Partner",
        partnerPhone: pp.partner?.phone || "-",
        sharePercentage: sharePct,
        budgetedShare,
        directExpensesPaid: directPaid,
        treasuryCapitalShare: treasuryShare,
        totalContribution: totalContributed,
        variance,
        varianceStatus,
        profitReceived,
      });

      legacyRows.push({
        project: proj.projectName,
        partner: pp.partner?.name || "Partner",
        sharePct: `${sharePct.toFixed(2)}%`,
        budgetedShare,
        directExpense: directPaid,
        treasuryCapital: treasuryShare,
        totalContribution: totalContributed,
        variance,
        profitReceived,
      });
    }

    projectGroups.push({
      projectId: proj.id,
      projectName: proj.projectName,
      status: proj.status,
      totalAreaShotok: toNum(proj.totalAreaShotok),
      acquisitionCost: acqCost,
      developmentExpenses: devCost,
      totalProjectCost: totalProjCost,
      directPartnerFunding: totalDirectPaidForProject,
      treasuryFunding: treasuryFundedForProject,
      totalProfitDistributed: totalProfitForProject,
      partners: partnerItems,
    });
  }

  return {
    columns: contributionColumns,
    rows: legacyRows,
    totals: {
      budgetedShare: totalSyndicateProjectCost,
      directExpense: totalDirectPartnerFunded,
      treasuryCapital: totalTreasuryFunded,
      totalContribution: totalSyndicateProjectCost,
      variance: 0,
      profitReceived: totalProfitDistributed,
    },
    projects: projectGroups,
    kpis: {
      totalSyndicateProjectCost,
      totalAcquisitionCost,
      totalDevelopmentCost,
      totalDirectPartnerFunded,
      totalTreasuryFunded,
      totalProfitDistributed,
      activeProjectsCount: projectGroups.length,
      participatingPartnersCount: uniquePartnerIds.size,
    },
  };
}
