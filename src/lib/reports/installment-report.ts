import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export interface InstallmentReportItem {
  id: string;
  installmentNo: number;
  dueDate: string | Date;
  dueAmount: number;
  saleId: string;
  contractNo: string;
  saleDate: string | Date;
  buyerName: string;
  buyerPhone: string;
  buyerNid?: string | null;
  projectId: string;
  projectName: string;
  mouza?: string | null;
  plotId?: string | null;
  plotNumber: string;
  plotSizeShotok: number;
  status: "OVERDUE" | "DUE_7D" | "DUE_30D" | "FUTURE" | "PAID" | string;
  statusLabelEn: string;
  statusLabelBn: string;
  diffDays: number;
  daysText: string;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "NORMAL" | "SETTLED";
}

export interface InstallmentReportKpis {
  totalInstallmentsCount: number;
  totalUnsettledCount: number;
  totalUnsettledAmount: number;
  overdueCount: number;
  overdueAmount: number;
  dueNext7DaysCount: number;
  dueNext7DaysAmount: number;
  dueNext30DaysCount: number;
  dueNext30DaysAmount: number;
  futureCount: number;
  futureAmount: number;
  paidCount: number;
  paidAmount: number;
  activeDebtorsCount: number;
  overdueDebtorsCount: number;
  overdueRatio: number;
}

export interface ProjectInstallmentBreakdown {
  projectId: string;
  projectName: string;
  totalSchedules: number;
  unsettledCount: number;
  unsettledAmount: number;
  overdueCount: number;
  overdueAmount: number;
  dueNext30DaysCount: number;
  dueNext30DaysAmount: number;
  overdueRatio: number;
}

export interface InstallmentReportResult extends ReportData {
  items: InstallmentReportItem[];
  kpis: InstallmentReportKpis;
  projectBreakdown: ProjectInstallmentBreakdown[];
}

const installmentColumns: ReportColumn[] = [
  { key: "dueDate", labelEn: "Due Date", labelBn: "নির্ধারিত তারিখ", type: "date" },
  { key: "buyer", labelEn: "Debtor / Buyer", labelBn: "ক্রেতা" },
  { key: "phone", labelEn: "Contact Phone", labelBn: "ফোন" },
  { key: "project", labelEn: "Project & Plot", labelBn: "প্রকল্প ও প্লট" },
  { key: "amount", labelEn: "Installment Amount", labelBn: "কিস্তির পরিমাণ", type: "number", align: "right" },
  { key: "status", labelEn: "Due Status", labelBn: "অবস্থা" },
  { key: "latency", labelEn: "Timeline Latency", labelBn: "বাকি / মেয়াদোত্তীর্ণ দিন" },
];

export async function queryInstallmentReport(prisma: any, filters: ReportFilters): Promise<InstallmentReportResult> {
  const where: any = {};
  if (filters.projectId && filters.projectId !== "ALL") {
    where.sale = { projectId: filters.projectId };
  }

  // Filter by date range if provided
  if (filters.from || filters.to) {
    where.dueDate = {};
    if (filters.from) where.dueDate.gte = new Date(filters.from);
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      where.dueDate.lte = toDate;
    }
  }

  const rawInstallments = await prisma.installmentSchedule.findMany({
    where,
    include: {
      sale: {
        include: {
          project: { select: { id: true, projectName: true, mouza: true } },
          plot: { select: { id: true, plotNumber: true, plotSizeShotok: true } },
        },
      },
    },
    orderBy: [{ dueDate: "asc" }],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const items: InstallmentReportItem[] = [];
  let totalInstallmentsCount = rawInstallments.length;
  let totalUnsettledCount = 0;
  let totalUnsettledAmount = 0;
  let overdueCount = 0;
  let overdueAmount = 0;
  let dueNext7DaysCount = 0;
  let dueNext7DaysAmount = 0;
  let dueNext30DaysCount = 0;
  let dueNext30DaysAmount = 0;
  let futureCount = 0;
  let futureAmount = 0;
  let paidCount = 0;
  let paidAmount = 0;

  const activeDebtorIds = new Set<string>();
  const overdueDebtorIds = new Set<string>();

  // Project Aggregations
  const projMap = new Map<string, {
    projectName: string;
    totalSchedules: number;
    unsettledCount: number;
    unsettledAmount: number;
    overdueCount: number;
    overdueAmount: number;
    dueNext30DaysCount: number;
    dueNext30DaysAmount: number;
  }>();

  for (let i = 0; i < rawInstallments.length; i++) {
    const item = rawInstallments[i];
    const amount = toNum(item.dueAmount);
    const dueDate = new Date(item.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDate.getTime() - today.getTime()) / 86400000);
    const isPaid = item.status === "PAID";

    let status = item.status;
    let statusLabelEn = "Scheduled";
    let statusLabelBn = "চলমান কিস্তি";
    let daysText = "";
    let urgency: InstallmentReportItem["urgency"] = "NORMAL";

    if (isPaid) {
      paidCount++;
      paidAmount += amount;
      status = "PAID";
      statusLabelEn = "Paid & Settled";
      statusLabelBn = "পরিশোধিত";
      daysText = "Settled";
      urgency = "SETTLED";
    } else {
      totalUnsettledCount++;
      totalUnsettledAmount += amount;
      if (item.saleId) activeDebtorIds.add(item.saleId);

      if (diffDays < 0) {
        overdueCount++;
        overdueAmount += amount;
        status = "OVERDUE";
        const absDays = Math.abs(diffDays);
        daysText = `${absDays} days overdue`;
        if (item.saleId) overdueDebtorIds.add(item.saleId);

        if (absDays >= 60) {
          statusLabelEn = "Critical Overdue (60+d)";
          statusLabelBn = "উচ্চ মেয়াদোত্তীর্ণ (৬০+ দিন)";
          urgency = "CRITICAL";
        } else {
          statusLabelEn = `Overdue (${absDays}d)`;
          statusLabelBn = `মেয়াদোত্তীর্ণ (${absDays} দিন)`;
          urgency = "HIGH";
        }
      } else if (diffDays <= 7) {
        dueNext7DaysCount++;
        dueNext7DaysAmount += amount;
        status = "DUE_7D";
        daysText = diffDays === 0 ? "Due Today" : `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
        statusLabelEn = "Due in 7 Days";
        statusLabelBn = "৭ দিনের মধ্যে প্রদেয়";
        urgency = "MEDIUM";
      } else if (diffDays <= 30) {
        dueNext30DaysCount++;
        dueNext30DaysAmount += amount;
        status = "DUE_30D";
        daysText = `Due in ${diffDays} days`;
        statusLabelEn = "Due in 8-30 Days";
        statusLabelBn = "৮-৩০ দিনের মধ্যে প্রদেয়";
        urgency = "NORMAL";
      } else {
        futureCount++;
        futureAmount += amount;
        status = "FUTURE";
        daysText = `Due in ${diffDays} days`;
        statusLabelEn = "Future Installment";
        statusLabelBn = "ভবিষ্যৎ কিস্তি";
        urgency = "NORMAL";
      }
    }

    // Project breakdown tracking
    const projId = item.sale?.projectId || "unknown";
    const projName = item.sale?.project?.projectName || "Unknown Project";
    if (!projMap.has(projId)) {
      projMap.set(projId, {
        projectName: projName,
        totalSchedules: 0,
        unsettledCount: 0,
        unsettledAmount: 0,
        overdueCount: 0,
        overdueAmount: 0,
        dueNext30DaysCount: 0,
        dueNext30DaysAmount: 0,
      });
    }
    const pEntry = projMap.get(projId)!;
    pEntry.totalSchedules++;
    if (!isPaid) {
      pEntry.unsettledCount++;
      pEntry.unsettledAmount += amount;
      if (diffDays < 0) {
        pEntry.overdueCount++;
        pEntry.overdueAmount += amount;
      } else if (diffDays <= 30) {
        pEntry.dueNext30DaysCount++;
        pEntry.dueNext30DaysAmount += amount;
      }
    }

    const sale = item.sale;
    items.push({
      id: item.id,
      installmentNo: i + 1,
      dueDate: item.dueDate,
      dueAmount: amount,
      saleId: item.saleId,
      contractNo: sale ? `CNT-${sale.id.slice(0, 8).toUpperCase()}` : "N/A",
      saleDate: sale?.saleDate || item.dueDate,
      buyerName: sale?.buyerName || "Unassigned",
      buyerPhone: sale?.buyerPhone || "N/A",
      buyerNid: sale?.buyerNid,
      projectId: sale?.projectId || "",
      projectName: projName,
      mouza: sale?.project?.mouza,
      plotId: sale?.plotId,
      plotNumber: sale?.plot?.plotNumber || "Unassigned",
      plotSizeShotok: sale?.plot ? toNum(sale.plot.plotSizeShotok) : 0,
      status,
      statusLabelEn,
      statusLabelBn,
      diffDays,
      daysText,
      urgency,
    });
  }

  const overdueRatio = totalUnsettledAmount > 0 ? (overdueAmount / totalUnsettledAmount) * 100 : 0;

  const kpis: InstallmentReportKpis = {
    totalInstallmentsCount,
    totalUnsettledCount,
    totalUnsettledAmount,
    overdueCount,
    overdueAmount,
    dueNext7DaysCount,
    dueNext7DaysAmount,
    dueNext30DaysCount,
    dueNext30DaysAmount,
    futureCount,
    futureAmount,
    paidCount,
    paidAmount,
    activeDebtorsCount: activeDebtorIds.size,
    overdueDebtorsCount: overdueDebtorIds.size,
    overdueRatio,
  };

  const projectBreakdown: ProjectInstallmentBreakdown[] = Array.from(projMap.entries()).map(([pId, val]) => ({
    projectId: pId,
    projectName: val.projectName,
    totalSchedules: val.totalSchedules,
    unsettledCount: val.unsettledCount,
    unsettledAmount: val.unsettledAmount,
    overdueCount: val.overdueCount,
    overdueAmount: val.overdueAmount,
    dueNext30DaysCount: val.dueNext30DaysCount,
    dueNext30DaysAmount: val.dueNext30DaysAmount,
    overdueRatio: val.unsettledAmount > 0 ? (val.overdueAmount / val.unsettledAmount) * 100 : 0,
  })).sort((a, b) => b.overdueAmount - a.overdueAmount);

  // Backwards compatible rows
  const rows = items.map((r) => ({
    dueDate: r.dueDate,
    buyer: r.buyerName,
    phone: r.buyerPhone,
    project: `${r.projectName} · Plot ${r.plotNumber}`,
    amount: r.dueAmount,
    status: r.statusLabelEn,
    daysUntilDue: r.diffDays,
    latency: r.daysText,
  }));

  return {
    columns: installmentColumns,
    rows,
    totals: {
      amount: totalUnsettledAmount,
    },
    summary: [
      { labelEn: "Total Active Schedules", labelBn: "চলমান কিস্তি সংখ্যা", value: `${totalUnsettledCount} Installments (${fmt(totalUnsettledAmount)})` },
      { labelEn: "Overdue Arrears", labelBn: "মেয়াদোত্তীর্ণ বকেয়া", value: `${fmt(overdueAmount)} (${overdueCount} Schedules · ${overdueRatio.toFixed(1)}%)` },
      { labelEn: "Due in Next 7 Days", labelBn: "আসন্ন ৭ দিনের মধ্যে প্রদেয়", value: `${fmt(dueNext7DaysAmount)} (${dueNext7DaysCount} Schedules)` },
      { labelEn: "Due in Next 30 Days", labelBn: "আসন্ন ৩০ দিনের মধ্যে প্রদেয়", value: `${fmt(dueNext30DaysAmount)} (${dueNext30DaysCount} Schedules)` },
    ],
    items,
    kpis,
    projectBreakdown,
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
