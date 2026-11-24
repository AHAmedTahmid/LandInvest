import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export interface SalesRegisterItem {
  id: string;
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
  askingPrice: number;
  totalAgreedPrice: number;
  advanceBookingAmount: number;
  totalPaid: number;
  currentDue: number;
  collectionRate: number;
  ratePerShotok: number;
  status: "SOLD" | "BOOKED" | "CANCELLED" | string;
  statusLabelEn: string;
  statusLabelBn: string;
  paymentsCount: number;
  latestReceiptNo?: string | null;
  installmentsCount: number;
  paidInstallmentsCount: number;
  nextDueDate?: string | Date | null;
  payments: {
    id: string;
    paymentDate: string | Date;
    amountPaid: number;
    paymentMethod: string;
    receiptNo: string;
    remarks?: string | null;
  }[];
  schedules: {
    id: string;
    dueDate: string | Date;
    dueAmount: number;
    status: string;
  }[];
}

export interface SalesRegisterKpis {
  totalSalesCount: number;
  totalAgreedPrice: number;
  totalCashCollected: number;
  totalActiveReceivables: number;
  overallCollectionRate: number;
  totalAreaSoldShotok: number;
  avgRatePerShotok: number;
  fullyPaidContractsCount: number;
  activeInstallmentPlansCount: number;
}

export interface ProjectSalesBreakdown {
  projectId: string;
  projectName: string;
  salesCount: number;
  areaSoldShotok: number;
  agreedPrice: number;
  cashCollected: number;
  activeReceivables: number;
  collectionRate: number;
}

export interface SalesRegisterData extends ReportData {
  items: SalesRegisterItem[];
  kpis: SalesRegisterKpis;
  projectSalesBreakdown: ProjectSalesBreakdown[];
  statusBreakdown: {
    status: string;
    labelEn: string;
    labelBn: string;
    count: number;
    agreedPrice: number;
    cashCollected: number;
    activeReceivables: number;
    percentage: number;
  }[];
}

const salesColumns: ReportColumn[] = [
  { key: "contractNo", labelEn: "Contract #", labelBn: "চুক্তি নং", width: "10%" },
  { key: "date", labelEn: "Sale Date", labelBn: "বিক্রির তারিখ", type: "date", width: "9%" },
  { key: "buyer", labelEn: "Buyer Profile", labelBn: "ক্রেতার তথ্য", width: "15%" },
  { key: "project", labelEn: "Project & Mouza", labelBn: "প্রকল্প ও মৌজা", width: "14%" },
  { key: "plot", labelEn: "Plot & Size", labelBn: "প্লট ও পরিমাপ", width: "10%" },
  { key: "agreedPrice", labelEn: "Agreed Price (BDT)", labelBn: "সম্মত মূল্য (টাকা)", type: "number", align: "right", width: "12%" },
  { key: "paid", labelEn: "Collected (BDT)", labelBn: "আদায়কৃত (টাকা)", type: "number", align: "right", width: "11%" },
  { key: "due", labelEn: "Receivable (BDT)", labelBn: "বকেয়া (টাকা)", type: "number", align: "right", width: "11%" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা", width: "8%" },
];

export type SalesRegisterFilters = ReportFilters & {
  paymentStatus?: string;
};

export async function querySalesRegister(prisma: any, filters: SalesRegisterFilters): Promise<SalesRegisterData> {
  const where: any = {};
  if (filters.projectId && filters.projectId !== "ALL") where.projectId = filters.projectId;
  if (filters.status && filters.status !== "ALL") where.status = filters.status;

  if (filters.from || filters.to) {
    where.saleDate = {};
    if (filters.from) where.saleDate.gte = new Date(filters.from);
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      where.saleDate.lte = toDate;
    }
  }

  const sales = await prisma.landSale.findMany({
    where,
    include: {
      project: { select: { id: true, projectName: true, mouza: true } },
      plot: { select: { id: true, plotNumber: true, plotSizeShotok: true, askingPrice: true, status: true } },
      customerPayments: {
        select: { id: true, paymentDate: true, amountPaid: true, paymentMethod: true, receiptNo: true, remarks: true },
        orderBy: { paymentDate: "asc" },
      },
      installmentSchedules: {
        select: { id: true, dueDate: true, dueAmount: true, status: true },
        orderBy: { dueDate: "asc" },
      },
    },
    orderBy: [{ saleDate: "desc" }, { id: "desc" }],
  });

  let totalAgreedPrice = 0;
  let totalCashCollected = 0;
  let totalActiveReceivables = 0;
  let totalAreaSoldShotok = 0;
  let fullyPaidContractsCount = 0;
  let activeInstallmentPlansCount = 0;

  const projMap = new Map<string, { projectName: string; salesCount: number; areaSoldShotok: number; agreedPrice: number; cashCollected: number; activeReceivables: number }>();
  const statusMap = new Map<string, { count: number; agreedPrice: number; cashCollected: number; activeReceivables: number }>();

  const items: SalesRegisterItem[] = sales.map((s: any, idx: number) => {
    const agreed = toNum(s.totalAgreedPrice);
    const advance = toNum(s.advanceBookingAmount);
    const payments = s.customerPayments || [];
    const paid = payments.reduce((sum: number, p: any) => sum + toNum(p.amountPaid), 0);
    const due = Math.max(0, agreed - paid);
    const plot = s.plot;
    const plotSize = plot ? toNum(plot.plotSizeShotok) : 0;
    const collectionRate = agreed > 0 ? (paid / agreed) * 100 : 0;
    const ratePerShotok = plotSize > 0 ? agreed / plotSize : 0;

    totalAgreedPrice += agreed;
    totalCashCollected += paid;
    totalActiveReceivables += due;
    totalAreaSoldShotok += plotSize;

    if (due <= 0 || s.status === "SOLD") {
      fullyPaidContractsCount++;
    } else {
      activeInstallmentPlansCount++;
    }

    const schedules = s.installmentSchedules || [];
    const paidSchedulesCount = schedules.filter((sc: any) => sc.status === "PAID").length;
    const upcomingSchedule = schedules.find((sc: any) => sc.status === "UPCOMING" || sc.status === "OVERDUE");

    // Project aggregation
    const pKey = s.projectId;
    const curP = projMap.get(pKey) || {
      projectName: s.project?.projectName || "Unknown Project",
      salesCount: 0,
      areaSoldShotok: 0,
      agreedPrice: 0,
      cashCollected: 0,
      activeReceivables: 0,
    };
    curP.salesCount++;
    curP.areaSoldShotok += plotSize;
    curP.agreedPrice += agreed;
    curP.cashCollected += paid;
    curP.activeReceivables += due;
    projMap.set(pKey, curP);

    // Status aggregation
    const stKey = s.status;
    const curSt = statusMap.get(stKey) || { count: 0, agreedPrice: 0, cashCollected: 0, activeReceivables: 0 };
    curSt.count++;
    curSt.agreedPrice += agreed;
    curSt.cashCollected += paid;
    curSt.activeReceivables += due;
    statusMap.set(stKey, curSt);

    const contractNo = `CTR-${s.id.slice(0, 8).toUpperCase()}`;

    let statusLabelEn = s.status === "SOLD" ? "Fully Sold / Settled" : s.status === "BOOKED" ? "Active Installment Plan" : s.status;
    let statusLabelBn = s.status === "SOLD" ? "সম্পূর্ণ বিক্রয় ও পরিশোধিত" : s.status === "BOOKED" ? "চলমান কিস্তি চুক্তি" : s.status;

    return {
      id: s.id,
      contractNo,
      saleDate: s.saleDate,
      buyerName: s.buyerName,
      buyerPhone: s.buyerPhone,
      buyerNid: s.buyerNid || null,
      projectId: s.projectId,
      projectName: s.project?.projectName || "Unknown Project",
      mouza: s.project?.mouza || null,
      plotId: s.plotId || null,
      plotNumber: plot?.plotNumber || "Unspecified",
      plotSizeShotok: plotSize,
      askingPrice: plot ? toNum(plot.askingPrice) : 0,
      totalAgreedPrice: agreed,
      advanceBookingAmount: advance,
      totalPaid: paid,
      currentDue: due,
      collectionRate,
      ratePerShotok,
      status: s.status,
      statusLabelEn,
      statusLabelBn,
      paymentsCount: payments.length,
      latestReceiptNo: payments.length > 0 ? payments[payments.length - 1].receiptNo : null,
      installmentsCount: schedules.length,
      paidInstallmentsCount: paidSchedulesCount,
      nextDueDate: upcomingSchedule ? upcomingSchedule.dueDate : null,
      payments: payments.map((p: any) => ({
        id: p.id,
        paymentDate: p.paymentDate,
        amountPaid: toNum(p.amountPaid),
        paymentMethod: p.paymentMethod,
        receiptNo: p.receiptNo,
        remarks: p.remarks || null,
      })),
      schedules: schedules.map((sc: any) => ({
        id: sc.id,
        dueDate: sc.dueDate,
        dueAmount: toNum(sc.dueAmount),
        status: sc.status,
      })),
    };
  });

  const overallCollectionRate = totalAgreedPrice > 0 ? (totalCashCollected / totalAgreedPrice) * 100 : 0;
  const avgRatePerShotok = totalAreaSoldShotok > 0 ? totalAgreedPrice / totalAreaSoldShotok : 0;

  const kpis: SalesRegisterKpis = {
    totalSalesCount: items.length,
    totalAgreedPrice,
    totalCashCollected,
    totalActiveReceivables,
    overallCollectionRate,
    totalAreaSoldShotok,
    avgRatePerShotok,
    fullyPaidContractsCount,
    activeInstallmentPlansCount,
  };

  const projectSalesBreakdown: ProjectSalesBreakdown[] = Array.from(projMap.entries()).map(([pId, val]) => ({
    projectId: pId,
    projectName: val.projectName,
    salesCount: val.salesCount,
    areaSoldShotok: val.areaSoldShotok,
    agreedPrice: val.agreedPrice,
    cashCollected: val.cashCollected,
    activeReceivables: val.activeReceivables,
    collectionRate: val.agreedPrice > 0 ? (val.cashCollected / val.agreedPrice) * 100 : 0,
  })).sort((a, b) => b.agreedPrice - a.agreedPrice);

  const statusBreakdown = Array.from(statusMap.entries()).map(([st, val]) => ({
    status: st,
    labelEn: st === "SOLD" ? "Fully Sold / Settled" : st === "BOOKED" ? "Active Installment Plan" : st,
    labelBn: st === "SOLD" ? "সম্পূর্ণ বিক্রয় ও পরিশোধিত" : st === "BOOKED" ? "চলমান কিস্তি চুক্তি" : st,
    count: val.count,
    agreedPrice: val.agreedPrice,
    cashCollected: val.cashCollected,
    activeReceivables: val.activeReceivables,
    percentage: totalAgreedPrice > 0 ? (val.agreedPrice / totalAgreedPrice) * 100 : 0,
  }));

  // Backwards compatible rows
  const rows = items.map((r) => ({
    contractNo: r.contractNo,
    date: r.saleDate,
    buyer: `${r.buyerName} (${r.buyerPhone})`,
    project: r.projectName,
    plot: `${r.plotNumber} (${r.plotSizeShotok.toFixed(1)} Sh)`,
    agreedPrice: r.totalAgreedPrice,
    paid: r.totalPaid,
    due: r.currentDue,
    status: r.statusLabelEn,
  }));

  return {
    columns: salesColumns,
    rows,
    totals: {
      agreedPrice: totalAgreedPrice,
      paid: totalCashCollected,
      due: totalActiveReceivables,
    },
    summary: [
      { labelEn: "Total Booked Sales", labelBn: "মোট বিক্রিত চুক্তি", value: fmt(totalAgreedPrice) },
      { labelEn: "Realized Cash Collections", labelBn: "আদায়কৃত নগদ অর্থ", value: `${fmt(totalCashCollected)} (${overallCollectionRate.toFixed(1)}%)` },
      { labelEn: "Active Receivables Portfolio", labelBn: "চলমান গ্রাহক বকেয়া", value: fmt(totalActiveReceivables) },
      { labelEn: "Total Land Demarcated & Sold", labelBn: "মোট হস্তান্তরিত জমি", value: `${totalAreaSoldShotok.toFixed(2)} Shotok (${items.length} Contracts)` },
    ],
    items,
    kpis,
    projectSalesBreakdown,
    statusBreakdown,
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
