import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const collectionColumns: ReportColumn[] = [
  { key: "receiptNo", labelEn: "Receipt No", labelBn: "রসিদ নং" },
  { key: "paymentDate", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "buyerName", labelEn: "Debtor / Customer", labelBn: "ক্রেতা" },
  { key: "projectName", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "plotNo", labelEn: "Plot Demarcation", labelBn: "প্লট নম্বর" },
  { key: "paymentMethod", labelEn: "Method / Destination", labelBn: "মাধ্যম / হিসাব" },
  { key: "remarks", labelEn: "Remarks / Ref", labelBn: "মন্তব্য / বিবরণ" },
  { key: "amountPaid", labelEn: "Amount (৳)", labelBn: "পরিমাণ (৳)", type: "number", align: "right" },
];

export interface ProjectCollectionSummary {
  projectId: string;
  projectName: string;
  projectLocation: string;
  contractCount: number;
  totalAgreedPrice: number;
  totalCollected: number;
  currentDue: number;
  realizationRate: number;
  transactionCount: number;
}

export interface ChannelCollectionSummary {
  channel: string;
  accountName: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface CollectionReceiptDetail {
  id: string;
  receiptNo: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod: string;
  bankAccountId: string | null;
  bankAccountName: string;
  bankAccountNumber: string;
  remarks: string;
  saleId: string;
  buyerName: string;
  buyerPhone: string;
  buyerNid: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  plotId: string | null;
  plotNo: string;
  plotSizeShotok: number;
  totalAgreedPrice: number;
  totalPaidOnSale: number;
  currentDueOnSale: number;
}

export interface CollectionReportKpis {
  totalCollected: number;
  transactionCount: number;
  averageTicket: number;
  bankCollected: number;
  bankPercent: number;
  cashCollected: number;
  cashPercent: number;
  contractedBookValue: number;
  totalOutstandingDue: number;
  portfolioRealizationRate: number;
}

export interface CollectionReportResult extends ReportData {
  kpis: CollectionReportKpis;
  projectBreakdown: ProjectCollectionSummary[];
  channelBreakdown: ChannelCollectionSummary[];
  receipts: CollectionReceiptDetail[];
  collectionSummary?: CollectionReportKpis;
}

export type CollectionReportData = CollectionReportResult;

export async function queryCollectionReport(prisma: any, filters: ReportFilters): Promise<CollectionReportResult> {
  const where: any = {};
  
  if (filters.projectId && filters.projectId !== "ALL") {
    const projectSales = await prisma.landSale.findMany({
      where: { projectId: filters.projectId },
      select: { id: true },
    });
    where.saleId = { in: projectSales.map((s: any) => s.id) };
  }

  if (filters.from || filters.to) {
    where.paymentDate = {};
    if (filters.from) where.paymentDate.gte = new Date(filters.from);
    if (filters.to) where.paymentDate.lte = new Date(filters.to);
  }

  // 1. Fetch all matching payments with related sale, plot, project, and bank account
  const payments = await prisma.customerPayment.findMany({
    where,
    include: {
      sale: {
        include: {
          project: true,
          plot: true,
          customerPayments: {
            select: { amountPaid: true },
          },
        },
      },
      bankAccount: true,
    },
    orderBy: [{ paymentDate: "desc" }, { id: "desc" }],
  });

  // 2. Fetch all sales & projects to compute overall portfolio realization
  const salesWhere: any = {};
  if (filters.projectId && filters.projectId !== "ALL") {
    salesWhere.projectId = filters.projectId;
  }

  const allSales = await prisma.landSale.findMany({
    where: salesWhere,
    include: {
      project: true,
      customerPayments: {
        select: { amountPaid: true },
      },
    },
  });

  const allProjects = await prisma.landProject.findMany({
    orderBy: { projectName: "asc" },
  });

  // 3. Compute portfolio figures
  let contractedBookValue = 0;
  let totalContractDue = 0;
  let totalContractPaid = 0;

  for (const s of allSales) {
    contractedBookValue += toNum(s.totalAgreedPrice);
    totalContractDue += toNum(s.currentDueAmount);
    const salePaid = s.customerPayments.reduce((acc: number, p: any) => acc + toNum(p.amountPaid), 0);
    totalContractPaid += salePaid;
  }

  const portfolioRealizationRate = contractedBookValue > 0 ? (totalContractPaid / contractedBookValue) * 100 : 0;

  // 4. Project-wise breakdown
  const projectStatsMap = new Map<string, ProjectCollectionSummary>();

  for (const p of allProjects) {
    if (filters.projectId && filters.projectId !== "ALL" && p.id !== filters.projectId) continue;
    projectStatsMap.set(p.id, {
      projectId: p.id,
      projectName: p.projectName,
      projectLocation: p.location ?? "Dhaka Division",
      contractCount: 0,
      totalAgreedPrice: 0,
      totalCollected: 0,
      currentDue: 0,
      realizationRate: 0,
      transactionCount: 0,
    });
  }

  for (const s of allSales) {
    let stat = projectStatsMap.get(s.projectId);
    if (!stat && s.project) {
      stat = {
        projectId: s.project.id,
        projectName: s.project.projectName,
        projectLocation: s.project.location ?? "Dhaka Division",
        contractCount: 0,
        totalAgreedPrice: 0,
        totalCollected: 0,
        currentDue: 0,
        realizationRate: 0,
        transactionCount: 0,
      };
      projectStatsMap.set(s.projectId, stat);
    }
    if (stat) {
      stat.contractCount += 1;
      stat.totalAgreedPrice += toNum(s.totalAgreedPrice);
      stat.currentDue += toNum(s.currentDueAmount);
      stat.totalCollected += s.customerPayments.reduce((acc: number, p: any) => acc + toNum(p.amountPaid), 0);
    }
  }

  // Count transactions in filtered scope per project
  for (const p of payments) {
    const prjId = p.sale?.projectId;
    if (prjId && projectStatsMap.has(prjId)) {
      projectStatsMap.get(prjId)!.transactionCount += 1;
    }
  }

  for (const stat of projectStatsMap.values()) {
    stat.realizationRate = stat.totalAgreedPrice > 0 ? (stat.totalCollected / stat.totalAgreedPrice) * 100 : 0;
  }

  const projectBreakdown = Array.from(projectStatsMap.values()).filter(
    (st) => st.contractCount > 0 || st.totalCollected > 0
  );

  // 5. Channel & Payment Method Breakdown
  let totalPeriodCollected = 0;
  let bankCollected = 0;
  let cashCollected = 0;
  const channelMap = new Map<string, { channel: string; accountName: string; count: number; totalAmount: number }>();

  for (const p of payments) {
    const amt = toNum(p.amountPaid);
    totalPeriodCollected += amt;

    if (p.paymentMethod === "CASH") {
      cashCollected += amt;
      const key = "CASH:Petty Cash Treasury";
      const existing = channelMap.get(key) || { channel: "Cash", accountName: "Petty Cash Treasury Vault", count: 0, totalAmount: 0 };
      existing.count += 1;
      existing.totalAmount += amt;
      channelMap.set(key, existing);
    } else {
      bankCollected += amt;
      const accName = p.bankAccount ? `${p.bankAccount.bankName} (${p.bankAccount.accountNumber})` : "Direct Bank Deposit";
      const key = `BANK:${accName}`;
      const existing = channelMap.get(key) || { channel: "Bank / Wire", accountName: accName, count: 0, totalAmount: 0 };
      existing.count += 1;
      existing.totalAmount += amt;
      channelMap.set(key, existing);
    }
  }

  const channelBreakdown: ChannelCollectionSummary[] = Array.from(channelMap.values()).map((ch) => ({
    ...ch,
    percentage: totalPeriodCollected > 0 ? (ch.totalAmount / totalPeriodCollected) * 100 : 0,
  }));

  const bankPercent = totalPeriodCollected > 0 ? (bankCollected / totalPeriodCollected) * 100 : 0;
  const cashPercent = totalPeriodCollected > 0 ? (cashCollected / totalPeriodCollected) * 100 : 0;
  const averageTicket = payments.length > 0 ? totalPeriodCollected / payments.length : 0;

  // 6. Map detailed receipts
  const receipts: CollectionReceiptDetail[] = payments.map((p: any) => {
    const sale = p.sale;
    const saleTotalPaid = sale ? sale.customerPayments.reduce((sum: number, cp: any) => sum + toNum(cp.amountPaid), 0) : 0;

    return {
      id: p.id,
      receiptNo: p.receiptNo,
      paymentDate: p.paymentDate instanceof Date ? p.paymentDate.toISOString().slice(0, 10) : String(p.paymentDate).slice(0, 10),
      amountPaid: toNum(p.amountPaid),
      paymentMethod: p.paymentMethod,
      bankAccountId: p.bankAccountId,
      bankAccountName: p.bankAccount?.bankName ?? (p.paymentMethod === "CASH" ? "Petty Cash Treasury" : "Direct Bank Wire"),
      bankAccountNumber: p.bankAccount?.accountNumber ?? "-",
      remarks: p.remarks || "Installment / Realization Inflow",
      saleId: p.saleId,
      buyerName: sale?.buyerName ?? "Individual Buyer",
      buyerPhone: sale?.buyerPhone ?? "01700-000000",
      buyerNid: sale?.buyerNid ?? "-",
      projectId: sale?.projectId ?? "-",
      projectName: sale?.project?.projectName ?? "-",
      projectLocation: sale?.project?.location ?? "Dhaka Division",
      plotId: sale?.plotId ?? null,
      plotNo: sale?.plot?.plotNumber ?? "Unassigned",
      plotSizeShotok: sale?.plot?.areaShotok ? toNum(sale.plot.areaShotok) : 0,
      totalAgreedPrice: sale ? toNum(sale.totalAgreedPrice) : 0,
      totalPaidOnSale: saleTotalPaid,
      currentDueOnSale: sale ? toNum(sale.currentDueAmount) : 0,
    };
  });

  // Table rows for legacy/standard ReportTable compatibility
  const rows = receipts.map((r) => ({
    receiptNo: r.receiptNo,
    paymentDate: r.paymentDate,
    buyerName: r.buyerName,
    projectName: r.projectName,
    plotNo: r.plotNo,
    paymentMethod: r.paymentMethod === "CASH" ? "Cash Vault" : `${r.bankAccountName}`,
    remarks: r.remarks,
    amountPaid: r.amountPaid,
  }));

  const kpis: CollectionReportKpis = {
    totalCollected: totalPeriodCollected,
    transactionCount: payments.length,
    averageTicket,
    bankCollected,
    bankPercent,
    cashCollected,
    cashPercent,
    contractedBookValue,
    totalOutstandingDue: totalContractDue,
    portfolioRealizationRate,
  };

  return {
    columns: collectionColumns,
    rows,
    totals: {
      amountPaid: totalPeriodCollected,
    },
    kpis,
    projectBreakdown,
    channelBreakdown,
    receipts,
    collectionSummary: kpis,
  };
}
