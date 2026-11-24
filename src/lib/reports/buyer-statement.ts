import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export interface BuyerStatementPayment {
  id: string;
  paymentDate: string | Date;
  amountPaid: number;
  paymentMethod: string;
  receiptNo: string;
  bankName?: string | null;
  accountNumber?: string | null;
  remarks?: string | null;
}

export interface BuyerStatementSchedule {
  id: string;
  installmentNo: number;
  dueDate: string | Date;
  dueAmount: number;
  status: "PAID" | "UPCOMING" | "OVERDUE" | string;
  statusLabelEn: string;
  statusLabelBn: string;
  isOverdue: boolean;
}

export interface BuyerStatementLedgerEntry {
  id: string;
  date: string | Date;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  type: "CONTRACT_OPENING" | "PAYMENT_RECEIPT";
}

export interface BuyerStatementSaleOption {
  id: string;
  contractNo: string;
  buyerName: string;
  buyerPhone: string;
  buyerNid?: string | null;
  projectName: string;
  plotNumber: string;
  plotSizeShotok: number;
  totalAgreedPrice: number;
  totalPaid: number;
  currentDue: number;
  status: string;
  saleDate: string | Date;
}

export interface BuyerStatementResult extends ReportData {
  sale: {
    id: string;
    contractNo: string;
    saleDate: string | Date;
    buyerName: string;
    buyerPhone: string;
    buyerNid?: string | null;
    status: string;
    statusLabelEn: string;
    statusLabelBn: string;
    projectId: string;
    projectName: string;
    mouza?: string | null;
    plotId?: string | null;
    plotNumber: string;
    plotSizeShotok: number;
    plotSizeKatha: number;
    plotSizeSqFt: number;
    ratePerShotok: number;
    totalAgreedPrice: number;
    advanceBookingAmount: number;
    totalPaid: number;
    currentDue: number;
    collectionRate: number;
  } | null;
  ledgerEntries: BuyerStatementLedgerEntry[];
  payments: BuyerStatementPayment[];
  schedules: BuyerStatementSchedule[];
  allSales: BuyerStatementSaleOption[];
  kpis: {
    totalAgreedPrice: number;
    totalPaid: number;
    currentDue: number;
    collectionRate: number;
    installmentsCount: number;
    paidInstallmentsCount: number;
    upcomingInstallmentsCount: number;
    overdueInstallmentsCount: number;
    nextDueDate?: string | Date | null;
    nextDueAmount: number;
  };
}

const buyerColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "reference", labelEn: "Ref / Receipt No", labelBn: "রসিদ / সূত্র" },
  { key: "description", labelEn: "Transaction Particulars", labelBn: "বিবরণ" },
  { key: "debit", labelEn: "Contract Debit (৳)", labelBn: "ডেবিট (টাকা)", type: "number", align: "right" },
  { key: "credit", labelEn: "Cash Realized (৳)", labelBn: "ক্রেডিট / পরিশোধ", type: "number", align: "right" },
  { key: "balance", labelEn: "Balance Due (৳)", labelBn: "অবশিষ্ট জের", type: "number", align: "right" },
];

export async function queryBuyerStatement(prisma: any, filters: ReportFilters): Promise<BuyerStatementResult> {
  // Fetch all sales for the buyer selector dropdown & search
  const allRawSales = await prisma.landSale.findMany({
    include: {
      project: { select: { id: true, projectName: true, mouza: true } },
      plot: { select: { id: true, plotNumber: true, plotSizeShotok: true, askingPrice: true } },
      customerPayments: { select: { amountPaid: true } },
    },
    orderBy: { saleDate: "desc" },
  });

  const allSales: BuyerStatementSaleOption[] = allRawSales.map((s: any) => {
    const totalAgreed = toNum(s.totalAgreedPrice);
    const paid = (s.customerPayments || []).reduce((acc: number, p: any) => acc + toNum(p.amountPaid), 0);
    const due = Math.max(0, totalAgreed - paid);
    return {
      id: s.id,
      contractNo: `CNT-${s.id.slice(0, 8).toUpperCase()}`,
      buyerName: s.buyerName,
      buyerPhone: s.buyerPhone,
      buyerNid: s.buyerNid,
      projectName: s.project?.projectName || "Unknown Project",
      plotNumber: s.plot?.plotNumber || "Unassigned",
      plotSizeShotok: s.plot ? toNum(s.plot.plotSizeShotok) : 0,
      totalAgreedPrice: totalAgreed,
      totalPaid: paid,
      currentDue: due,
      status: s.status,
      saleDate: s.saleDate,
    };
  });

  // Determine active sale:
  // 1. If filters.saleId matches, use that.
  // 2. Otherwise prefer first BOOKED sale (active installment plan).
  // 3. Fallback to first sale.
  let targetSaleId = filters.saleId;
  if (!targetSaleId) {
    const activeBooked = allSales.find((s) => s.status === "BOOKED" && s.currentDue > 0);
    targetSaleId = activeBooked ? activeBooked.id : allSales[0]?.id;
  }

  if (!targetSaleId) {
    return {
      columns: buyerColumns,
      rows: [],
      totals: { debit: 0, credit: 0, balance: 0 },
      summary: [],
      sale: null,
      ledgerEntries: [],
      payments: [],
      schedules: [],
      allSales: [],
      kpis: {
        totalAgreedPrice: 0,
        totalPaid: 0,
        currentDue: 0,
        collectionRate: 0,
        installmentsCount: 0,
        paidInstallmentsCount: 0,
        upcomingInstallmentsCount: 0,
        overdueInstallmentsCount: 0,
        nextDueAmount: 0,
      },
    };
  }

  const sale = await prisma.landSale.findUnique({
    where: { id: targetSaleId },
    include: {
      project: { select: { id: true, projectName: true, mouza: true } },
      plot: { select: { id: true, plotNumber: true, plotSizeShotok: true, askingPrice: true } },
      customerPayments: {
        include: {
          bankAccount: { select: { bankName: true, accountNumber: true } },
        },
        orderBy: { paymentDate: "asc" },
      },
      installmentSchedules: {
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!sale) {
    return {
      columns: buyerColumns,
      rows: [],
      totals: { debit: 0, credit: 0, balance: 0 },
      summary: [],
      sale: null,
      ledgerEntries: [],
      payments: [],
      schedules: [],
      allSales,
      kpis: {
        totalAgreedPrice: 0,
        totalPaid: 0,
        currentDue: 0,
        collectionRate: 0,
        installmentsCount: 0,
        paidInstallmentsCount: 0,
        upcomingInstallmentsCount: 0,
        overdueInstallmentsCount: 0,
        nextDueAmount: 0,
      },
    };
  }

  const contractNo = `CNT-${sale.id.slice(0, 8).toUpperCase()}`;
  const totalAgreedPrice = toNum(sale.totalAgreedPrice);
  const advanceBookingAmount = toNum(sale.advanceBookingAmount);
  const plotSizeShotok = sale.plot ? toNum(sale.plot.plotSizeShotok) : 0;
  const plotSizeKatha = plotSizeShotok / 1.65;
  const plotSizeSqFt = plotSizeShotok * 435.6;
  const ratePerShotok = plotSizeShotok > 0 ? totalAgreedPrice / plotSizeShotok : 0;

  // Process Payments
  const rawPayments = sale.customerPayments || [];
  const payments: BuyerStatementPayment[] = rawPayments.map((p: any) => ({
    id: p.id,
    paymentDate: p.paymentDate,
    amountPaid: toNum(p.amountPaid),
    paymentMethod: p.paymentMethod || "CASH",
    receiptNo: p.receiptNo || "N/A",
    bankName: p.bankAccount?.bankName,
    accountNumber: p.bankAccount?.accountNumber,
    remarks: p.remarks,
  }));

  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const currentDue = Math.max(0, totalAgreedPrice - totalPaid);
  const collectionRate = totalAgreedPrice > 0 ? (totalPaid / totalAgreedPrice) * 100 : 0;

  // Build Chronological Running Ledger
  const ledgerEntries: BuyerStatementLedgerEntry[] = [];
  let runningBalance = totalAgreedPrice;

  // 1. Opening Contract Covenant
  ledgerEntries.push({
    id: `contract-open-${sale.id}`,
    date: sale.saleDate,
    reference: contractNo,
    description: `Allotment & Sale Covenant for Plot ${sale.plot?.plotNumber || "Demarcated Parcel"} (${sale.project?.projectName || ""})`,
    debit: totalAgreedPrice,
    credit: 0,
    balance: runningBalance,
    type: "CONTRACT_OPENING",
  });

  // 2. Each Payment Entry
  for (const p of payments) {
    runningBalance = Math.max(0, runningBalance - p.amountPaid);
    const bankDesc = p.bankName ? ` (${p.bankName})` : "";
    ledgerEntries.push({
      id: p.id,
      date: p.paymentDate,
      reference: p.receiptNo,
      description: `Customer Cash Realization via ${p.paymentMethod}${bankDesc}${p.remarks ? ` - ${p.remarks}` : ""}`,
      debit: 0,
      credit: p.amountPaid,
      balance: runningBalance,
      type: "PAYMENT_RECEIPT",
    });
  }

  // Process Installment Schedules
  const rawSchedules = sale.installmentSchedules || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let paidInstallmentsCount = 0;
  let upcomingInstallmentsCount = 0;
  let overdueInstallmentsCount = 0;
  let nextDueDate: Date | null = null;
  let nextDueAmount = 0;

  const schedules: BuyerStatementSchedule[] = rawSchedules.map((sch: any, idx: number) => {
    const dueAmount = toNum(sch.dueAmount);
    const dueDate = new Date(sch.dueDate);
    const isPastDue = dueDate < today && sch.status !== "PAID";
    let status = sch.status.toUpperCase();
    if (isPastDue) status = "OVERDUE";

    if (status === "PAID") {
      paidInstallmentsCount++;
    } else if (status === "OVERDUE") {
      overdueInstallmentsCount++;
    } else {
      upcomingInstallmentsCount++;
      if (!nextDueDate || dueDate < nextDueDate) {
        nextDueDate = dueDate;
        nextDueAmount = dueAmount;
      }
    }

    const labelEn = status === "PAID" ? "Settled / Paid" : status === "OVERDUE" ? "Overdue" : "Scheduled";
    const labelBn = status === "PAID" ? "পরিশোধিত" : status === "OVERDUE" ? "মেয়াদোত্তীর্ণ" : "চলমান কিস্তি";

    return {
      id: sch.id,
      installmentNo: idx + 1,
      dueDate: sch.dueDate,
      dueAmount,
      status,
      statusLabelEn: labelEn,
      statusLabelBn: labelBn,
      isOverdue: isPastDue,
    };
  });

  const isSold = sale.status === "SOLD";
  const statusLabelEn = isSold ? "Fully Settled / Registered" : "Active Installment Covenant";
  const statusLabelBn = isSold ? "সম্পূর্ণ পরিশোধিত ও রেজিস্ট্রিকৃত" : "চলমান কিস্তি চুক্তি";

  const saleData = {
    id: sale.id,
    contractNo,
    saleDate: sale.saleDate,
    buyerName: sale.buyerName,
    buyerPhone: sale.buyerPhone,
    buyerNid: sale.buyerNid,
    status: sale.status,
    statusLabelEn,
    statusLabelBn,
    projectId: sale.projectId,
    projectName: sale.project?.projectName || "Unknown Project",
    mouza: sale.project?.mouza,
    plotId: sale.plotId,
    plotNumber: sale.plot?.plotNumber || "Unassigned",
    plotSizeShotok,
    plotSizeKatha,
    plotSizeSqFt,
    ratePerShotok,
    totalAgreedPrice,
    advanceBookingAmount,
    totalPaid,
    currentDue,
    collectionRate,
  };

  const rows = ledgerEntries.map((l) => ({
    date: l.date,
    reference: l.reference,
    description: l.description,
    debit: l.debit,
    credit: l.credit,
    balance: l.balance,
  }));

  return {
    columns: buyerColumns,
    rows,
    totals: {
      debit: totalAgreedPrice,
      credit: totalPaid,
      balance: currentDue,
    },
    summary: [
      { labelEn: "Allottee / Buyer", labelBn: "ক্রেতার নাম", value: `${sale.buyerName} (${sale.buyerPhone})` },
      { labelEn: "Contract & Plot", labelBn: "চুক্তি ও প্লট", value: `${contractNo} · Plot ${sale.plot?.plotNumber || "N/A"}` },
      { labelEn: "Total Agreed Price", labelBn: "মোট বিক্রয় মূল্য", value: fmt(totalAgreedPrice) },
      { labelEn: "Realized Cash to Date", labelBn: "মোট পরিশোধিত অর্থ", value: `${fmt(totalPaid)} (${collectionRate.toFixed(1)}%)` },
      { labelEn: "Current Outstanding Due", labelBn: "অবশিষ্ট বকেয়া", value: fmt(currentDue) },
      { labelEn: "Installments Progress", labelBn: "কিস্তির অগ্রগতি", value: `${paidInstallmentsCount} of ${schedules.length} Paid` },
    ],
    sale: saleData,
    ledgerEntries,
    payments,
    schedules,
    allSales,
    kpis: {
      totalAgreedPrice,
      totalPaid,
      currentDue,
      collectionRate,
      installmentsCount: schedules.length,
      paidInstallmentsCount,
      upcomingInstallmentsCount,
      overdueInstallmentsCount,
      nextDueDate,
      nextDueAmount,
    },
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
