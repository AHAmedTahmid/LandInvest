import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export interface DebtorAgingItem {
  id: string;
  contractNo: string;
  saleDate: string | Date;
  buyerName: string;
  buyerPhone: string;
  buyerNid?: string | null;
  projectId: string;
  projectName: string;
  plotId?: string | null;
  plotNumber: string;
  plotSizeShotok: number;
  totalAgreedPrice: number;
  totalPaid: number;
  totalDue: number;
  notYetDue: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  totalOverdue: number;
  overduePercentage: number;
  riskTier: "HEALTHY" | "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK" | "CRITICAL_DEFAULT";
  riskLabelEn: string;
  riskLabelBn: string;
  installments: {
    id: string;
    installmentNo: number;
    dueDate: string | Date;
    dueAmount: number;
    status: string;
    daysOverdue: number;
  }[];
}

export interface ReceivablesAgingKpis {
  totalReceivables: number;
  totalCurrentDue: number;
  totalOverdue: number;
  days1to30Total: number;
  days31to60Total: number;
  days61to90Total: number;
  over90Total: number;
  debtorsCount: number;
  overdueDebtorsCount: number;
  healthyDebtorsCount: number;
  overdueRatio: number;
  criticalRatio: number;
}

export interface ProjectAgingBreakdown {
  projectId: string;
  projectName: string;
  debtorsCount: number;
  totalDue: number;
  notYetDue: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  totalOverdue: number;
  overdueRatio: number;
}

export interface ReceivablesAgingResult extends ReportData {
  items: DebtorAgingItem[];
  kpis: ReceivablesAgingKpis;
  projectBreakdown: ProjectAgingBreakdown[];
  bucketPercentages: {
    notYetDue: number;
    days1to30: number;
    days31to60: number;
    days61to90: number;
    over90: number;
  };
}

const agingColumns: ReportColumn[] = [
  { key: "buyer", labelEn: "Debtor / Buyer", labelBn: "ক্রেতা / দেনাদার" },
  { key: "project", labelEn: "Project & Plot", labelBn: "প্রকল্প ও প্লট" },
  { key: "totalDue", labelEn: "Total Receivables", labelBn: "মোট বকেয়া", type: "number", align: "right" },
  { key: "notYetDue", labelEn: "Current (Not Due)", labelBn: "চলমান (মেয়াদহীন)", type: "number", align: "right" },
  { key: "days1to30", labelEn: "1-30 Days", labelBn: "১-৩০ দিন", type: "number", align: "right" },
  { key: "days31to60", labelEn: "31-60 Days", labelBn: "৩১-৬০ দিন", type: "number", align: "right" },
  { key: "days61to90", labelEn: "61-90 Days", labelBn: "৬১-৯০ দিন", type: "number", align: "right" },
  { key: "over90", labelEn: "90+ Days (Critical)", labelBn: "৯০+ দিন (ঝুঁকি)", type: "number", align: "right" },
  { key: "riskTier", labelEn: "Risk Category", labelBn: "ঝুঁকি শ্রেণী" },
];

export async function queryReceivablesAging(prisma: any, filters: ReportFilters): Promise<ReceivablesAgingResult> {
  const where: any = {};
  if (filters.projectId && filters.projectId !== "ALL") {
    where.projectId = filters.projectId;
  }

  const rawSales = await prisma.landSale.findMany({
    where,
    include: {
      project: { select: { id: true, projectName: true, mouza: true } },
      plot: { select: { id: true, plotNumber: true, plotSizeShotok: true } },
      customerPayments: { select: { amountPaid: true, paymentDate: true } },
      installmentSchedules: {
        select: {
          id: true,
          dueDate: true,
          dueAmount: true,
          status: true,
        },
        orderBy: { dueDate: "asc" },
      },
    },
    orderBy: { saleDate: "desc" },
  });

  const asOfDate = filters.to ? new Date(filters.to) : new Date();
  asOfDate.setHours(0, 0, 0, 0);

  const items: DebtorAgingItem[] = [];
  let totalReceivables = 0;
  let totalCurrentDue = 0;
  let totalOverdue = 0;
  let days1to30Total = 0;
  let days31to60Total = 0;
  let days61to90Total = 0;
  let over90Total = 0;
  let overdueDebtorsCount = 0;
  let healthyDebtorsCount = 0;

  // Project map for breakdown
  const projMap = new Map<string, {
    projectName: string;
    debtorsCount: number;
    totalDue: number;
    notYetDue: number;
    days1to30: number;
    days31to60: number;
    days61to90: number;
    over90: number;
    totalOverdue: number;
  }>();

  for (const s of rawSales) {
    const agreed = toNum(s.totalAgreedPrice);
    const paid = (s.customerPayments || []).reduce((sum: number, p: any) => sum + toNum(p.amountPaid), 0);
    const due = Math.max(0, agreed - paid);

    // Skip fully settled contracts with zero balance
    if (due <= 1) continue;

    let notYetDue = 0;
    let d1to30 = 0;
    let d31to60 = 0;
    let d61to90 = 0;
    let over90 = 0;

    const installmentDetails: any[] = [];

    if (s.installmentSchedules && s.installmentSchedules.length > 0) {
      s.installmentSchedules.forEach((sch: any, idx: number) => {
        if (sch.status === "PAID") return;
        const schAmount = toNum(sch.dueAmount);
        const schDueDate = new Date(sch.dueDate);
        schDueDate.setHours(0, 0, 0, 0);

        let daysOverdue = 0;
        if (schDueDate >= asOfDate) {
          notYetDue += schAmount;
        } else {
          daysOverdue = Math.floor((asOfDate.getTime() - schDueDate.getTime()) / 86400000);
          if (daysOverdue <= 30) d1to30 += schAmount;
          else if (daysOverdue <= 60) d31to60 += schAmount;
          else if (daysOverdue <= 90) d61to90 += schAmount;
          else over90 += schAmount;
        }

        installmentDetails.push({
          id: sch.id,
          installmentNo: idx + 1,
          dueDate: sch.dueDate,
          dueAmount: schAmount,
          status: schDueDate >= asOfDate ? "UPCOMING" : "OVERDUE",
          daysOverdue: Math.max(0, daysOverdue),
        });
      });
    } else {
      // Lump sum contract without formal installment schedule
      const saleDate = new Date(s.saleDate);
      saleDate.setHours(0, 0, 0, 0);
      const daysSince = Math.floor((asOfDate.getTime() - saleDate.getTime()) / 86400000);
      if (daysSince <= 0) notYetDue = due;
      else if (daysSince <= 30) d1to30 = due;
      else if (daysSince <= 60) d31to60 = due;
      else if (daysSince <= 90) d61to90 = due;
      else over90 = due;
    }

    const debtorOverdue = d1to30 + d31to60 + d61to90 + over90;
    const overduePct = due > 0 ? (debtorOverdue / due) * 100 : 0;

    let riskTier: DebtorAgingItem["riskTier"] = "HEALTHY";
    let riskLabelEn = "Current / Healthy";
    let riskLabelBn = "নিয়মিত / স্বাভাবিক";

    if (over90 > 0) {
      riskTier = "CRITICAL_DEFAULT";
      riskLabelEn = "Critical (90+ Days)";
      riskLabelBn = "উচ্চ ঝুঁকি (৯০+ দিন)";
    } else if (d61to90 > 0) {
      riskTier = "HIGH_RISK";
      riskLabelEn = "High Risk (61-90 Days)";
      riskLabelBn = "ঝুঁকিপূর্ণ (৬১-৯০ দিন)";
    } else if (d31to60 > 0) {
      riskTier = "MEDIUM_RISK";
      riskLabelEn = "Moderate (31-60 Days)";
      riskLabelBn = "মধ্যম বকেয়া (৩১-৬০ দিন)";
    } else if (d1to30 > 0) {
      riskTier = "LOW_RISK";
      riskLabelEn = "Minor Due (1-30 Days)";
      riskLabelBn = "স্বল্প বকেয়া (১-৩০ দিন)";
    }

    if (debtorOverdue > 0) {
      overdueDebtorsCount++;
    } else {
      healthyDebtorsCount++;
    }

    totalReceivables += due;
    totalCurrentDue += notYetDue;
    totalOverdue += debtorOverdue;
    days1to30Total += d1to30;
    days31to60Total += d31to60;
    days61to90Total += d61to90;
    over90Total += over90;

    const projId = s.projectId;
    const projName = s.project?.projectName || "Unknown Project";
    if (!projMap.has(projId)) {
      projMap.set(projId, {
        projectName: projName,
        debtorsCount: 0,
        totalDue: 0,
        notYetDue: 0,
        days1to30: 0,
        days31to60: 0,
        days61to90: 0,
        over90: 0,
        totalOverdue: 0,
      });
    }
    const pEntry = projMap.get(projId)!;
    pEntry.debtorsCount++;
    pEntry.totalDue += due;
    pEntry.notYetDue += notYetDue;
    pEntry.days1to30 += d1to30;
    pEntry.days31to60 += d31to60;
    pEntry.days61to90 += d61to90;
    pEntry.over90 += over90;
    pEntry.totalOverdue += debtorOverdue;

    items.push({
      id: s.id,
      contractNo: `CNT-${s.id.slice(0, 8).toUpperCase()}`,
      saleDate: s.saleDate,
      buyerName: s.buyerName,
      buyerPhone: s.buyerPhone,
      buyerNid: s.buyerNid,
      projectId: s.projectId,
      projectName: projName,
      plotId: s.plotId,
      plotNumber: s.plot?.plotNumber || "Unassigned",
      plotSizeShotok: s.plot ? toNum(s.plot.plotSizeShotok) : 0,
      totalAgreedPrice: agreed,
      totalPaid: paid,
      totalDue: due,
      notYetDue,
      days1to30: d1to30,
      days31to60: d31to60,
      days61to90: d61to90,
      over90,
      totalOverdue: debtorOverdue,
      overduePercentage: overduePct,
      riskTier,
      riskLabelEn,
      riskLabelBn,
      installments: installmentDetails,
    });
  }

  // Sort by highest overdue first
  items.sort((a, b) => b.totalOverdue - a.totalOverdue || b.totalDue - a.totalDue);

  const kpis: ReceivablesAgingKpis = {
    totalReceivables,
    totalCurrentDue,
    totalOverdue,
    days1to30Total,
    days31to60Total,
    days61to90Total,
    over90Total,
    debtorsCount: items.length,
    overdueDebtorsCount,
    healthyDebtorsCount,
    overdueRatio: totalReceivables > 0 ? (totalOverdue / totalReceivables) * 100 : 0,
    criticalRatio: totalReceivables > 0 ? (over90Total / totalReceivables) * 100 : 0,
  };

  const projectBreakdown: ProjectAgingBreakdown[] = Array.from(projMap.entries()).map(([pId, val]) => ({
    projectId: pId,
    projectName: val.projectName,
    debtorsCount: val.debtorsCount,
    totalDue: val.totalDue,
    notYetDue: val.notYetDue,
    days1to30: val.days1to30,
    days31to60: val.days31to60,
    days61to90: val.days61to90,
    over90: val.over90,
    totalOverdue: val.totalOverdue,
    overdueRatio: val.totalDue > 0 ? (val.totalOverdue / val.totalDue) * 100 : 0,
  })).sort((a, b) => b.totalOverdue - a.totalOverdue);

  const bucketPercentages = {
    notYetDue: totalReceivables > 0 ? (totalCurrentDue / totalReceivables) * 100 : 0,
    days1to30: totalReceivables > 0 ? (days1to30Total / totalReceivables) * 100 : 0,
    days31to60: totalReceivables > 0 ? (days31to60Total / totalReceivables) * 100 : 0,
    days61to90: totalReceivables > 0 ? (days61to90Total / totalReceivables) * 100 : 0,
    over90: totalReceivables > 0 ? (over90Total / totalReceivables) * 100 : 0,
  };

  // Backwards compatible rows
  const rows = items.map((r) => ({
    buyer: `${r.buyerName} (${r.buyerPhone})`,
    project: `${r.projectName} · Plot ${r.plotNumber}`,
    totalDue: r.totalDue,
    notYetDue: r.notYetDue,
    days1to30: r.days1to30,
    days31to60: r.days31to60,
    days61to90: r.days61to90,
    over90: r.over90,
    riskTier: r.riskLabelEn,
  }));

  return {
    columns: agingColumns,
    rows,
    totals: {
      totalDue: totalReceivables,
      notYetDue: totalCurrentDue,
      days1to30: days1to30Total,
      days31to60: days31to60Total,
      days61to90: days61to90Total,
      over90: over90Total,
    },
    summary: [
      { labelEn: "Total Receivables Portfolio", labelBn: "মোট গ্রাহক বকেয়া", value: fmt(totalReceivables) },
      { labelEn: "Performing (Current / Not Due)", labelBn: "মেয়াদহীন নিয়মিত বকেয়া", value: `${fmt(totalCurrentDue)} (${bucketPercentages.notYetDue.toFixed(1)}%)` },
      { labelEn: "Total Overdue Exposure", labelBn: "মোট মেয়াদোত্তীর্ণ ঝুঁকি", value: `${fmt(totalOverdue)} (${kpis.overdueRatio.toFixed(1)}%)` },
      { labelEn: "Critical Default (90+ Days)", labelBn: "উচ্চ ঝুঁকিপূর্ণ (৯০+ দিন)", value: `${fmt(over90Total)} (${kpis.criticalRatio.toFixed(1)}%)` },
    ],
    items,
    kpis,
    projectBreakdown,
    bucketPercentages,
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
