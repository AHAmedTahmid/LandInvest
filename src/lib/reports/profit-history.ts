import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const historyColumns: ReportColumn[] = [
  { key: "distributionDate", labelEn: "Disbursement Date", labelBn: "বিতরণ তারিখ", type: "date" },
  { key: "projectName", labelEn: "Project Syndicate", labelBn: "প্রকল্প" },
  { key: "partnerName", labelEn: "Equity Partner", labelBn: "অংশীদার" },
  { key: "realizationBasis", labelEn: "Accounting Basis", labelBn: "হিসাবের ভিত্তি" },
  { key: "partnerSharePercent", labelEn: "Share %", labelBn: "শেয়ার %", type: "number", align: "right" },
  { key: "totalProjectNetProfit", labelEn: "Project Net Profit (৳)", labelBn: "প্রকল্প নিট লাভ (৳)", type: "number", align: "right" },
  { key: "payoutAmount", labelEn: "Dividend Payout (৳)", labelBn: "প্রদেয় লভ্যাংশ (৳)", type: "number", align: "right" },
];

export interface ProfitHistoryItem {
  id: string;
  distributionDate: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  partnerEmail: string;
  partnerNid: string;
  realizationBasis: "CASH_BASIS" | "COMPLETION_BASIS" | string;
  partnerSharePercent: number;
  totalProjectNetProfit: number;
  payoutAmount: number;
}

export interface TrancheRunSummary {
  runKey: string;
  date: string;
  projectId: string;
  projectName: string;
  realizationBasis: string;
  totalNetProfit: number;
  totalPayout: number;
  partnersCount: number;
  partners: {
    partnerName: string;
    sharePercent: number;
    payout: number;
  }[];
}

export interface PartnerPayoutTotal {
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  totalPayout: number;
  tranchesCount: number;
  sharePercentage: number;
}

export interface ProfitHistoryKpis {
  totalDistributed: number;
  tranchesCount: number;
  averageTranchePayout: number;
  uniquePartnersCount: number;
  cashBasisTotal: number;
  completionBasisTotal: number;
}

export interface ProfitHistoryResult extends ReportData {
  kpis: ProfitHistoryKpis;
  items: ProfitHistoryItem[];
  tranches: TrancheRunSummary[];
  partnerTotals: PartnerPayoutTotal[];
  availableProjects: { id: string; projectName: string }[];
}

export async function queryProfitHistory(prisma: any, filters: ReportFilters): Promise<ProfitHistoryResult> {
  const where: any = {};
  if (filters.projectId && filters.projectId !== "ALL") {
    where.projectId = filters.projectId;
  }
  if (filters.from || filters.to) {
    where.distributionDate = {};
    if (filters.from) where.distributionDate.gte = new Date(filters.from);
    if (filters.to) where.distributionDate.lte = new Date(filters.to);
  }

  // 1. Fetch all profit distributions with project & partner info
  const distributions = await prisma.profitDistribution.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
          mouza: true,
        },
      },
      partner: {
        select: {
          id: true,
          name: true,
          phone: true,
          nidNumber: true,
        },
      },
    },
    orderBy: [{ distributionDate: "desc" }, { id: "desc" }],
  });

  const allProjects = await prisma.landProject.findMany({
    select: { id: true, projectName: true },
    orderBy: { projectName: "asc" },
  });

  // 2. Map detailed items
  const items: ProfitHistoryItem[] = distributions.map((d: any) => ({
    id: d.id,
    distributionDate: d.distributionDate instanceof Date ? d.distributionDate.toISOString().slice(0, 10) : String(d.distributionDate).slice(0, 10),
    projectId: d.projectId,
    projectName: d.project?.projectName ?? "Unknown Project",
    projectLocation: d.project?.mouza ? `Mouza: ${d.project.mouza}` : "Dhaka Division",
    partnerId: d.partnerId,
    partnerName: d.partner?.name ?? "Syndicate Partner",
    partnerPhone: d.partner?.phone ?? "01700-000000",
    partnerEmail: d.partner?.email ?? `${(d.partner?.name || "partner").toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
    partnerNid: d.partner?.nidNumber ?? "-",
    realizationBasis: d.realizationBasis,
    partnerSharePercent: toNum(d.partnerSharePercent),
    totalProjectNetProfit: toNum(d.totalProjectNetProfit),
    payoutAmount: toNum(d.payoutAmount),
  }));

  // 3. Group by Tranche Run (projectId + distributionDate + realizationBasis)
  const trancheMap = new Map<string, TrancheRunSummary>();
  for (const item of items) {
    const key = `${item.projectId}_${item.distributionDate}_${item.realizationBasis}`;
    let tr = trancheMap.get(key);
    if (!tr) {
      tr = {
        runKey: key,
        date: item.distributionDate,
        projectId: item.projectId,
        projectName: item.projectName,
        realizationBasis: item.realizationBasis,
        totalNetProfit: item.totalProjectNetProfit,
        totalPayout: 0,
        partnersCount: 0,
        partners: [],
      };
      trancheMap.set(key, tr);
    }
    tr.totalPayout += item.payoutAmount;
    tr.partnersCount += 1;
    tr.partners.push({
      partnerName: item.partnerName,
      sharePercent: item.partnerSharePercent,
      payout: item.payoutAmount,
    });
  }
  const tranches = Array.from(trancheMap.values());

  // 4. Partner Cumulative Totals
  const partnerMap = new Map<string, PartnerPayoutTotal>();
  let cashBasisTotal = 0;
  let completionBasisTotal = 0;
  let totalDistributed = 0;

  for (const item of items) {
    totalDistributed += item.payoutAmount;
    if (item.realizationBasis === "CASH_BASIS") {
      cashBasisTotal += item.payoutAmount;
    } else {
      completionBasisTotal += item.payoutAmount;
    }

    let pTot = partnerMap.get(item.partnerId);
    if (!pTot) {
      pTot = {
        partnerId: item.partnerId,
        partnerName: item.partnerName,
        partnerPhone: item.partnerPhone,
        totalPayout: 0,
        tranchesCount: 0,
        sharePercentage: item.partnerSharePercent,
      };
      partnerMap.set(item.partnerId, pTot);
    }
    pTot.totalPayout += item.payoutAmount;
    pTot.tranchesCount += 1;
  }
  const partnerTotals = Array.from(partnerMap.values()).sort((a, b) => b.totalPayout - a.totalPayout);

  const averageTranchePayout = tranches.length > 0 ? totalDistributed / tranches.length : 0;

  const kpis: ProfitHistoryKpis = {
    totalDistributed,
    tranchesCount: tranches.length,
    averageTranchePayout,
    uniquePartnersCount: partnerTotals.length,
    cashBasisTotal,
    completionBasisTotal,
  };

  const rows = items.map((i) => ({
    distributionDate: i.distributionDate,
    projectName: i.projectName,
    partnerName: i.partnerName,
    realizationBasis: i.realizationBasis === "CASH_BASIS" ? "Cash Realized" : "Completion / Invoiced",
    partnerSharePercent: i.partnerSharePercent,
    totalProjectNetProfit: i.totalProjectNetProfit,
    payoutAmount: i.payoutAmount,
  }));

  return {
    columns: historyColumns,
    rows,
    totals: {
      payoutAmount: totalDistributed,
    },
    kpis,
    items,
    tranches,
    partnerTotals,
    availableProjects: allProjects,
  };
}
