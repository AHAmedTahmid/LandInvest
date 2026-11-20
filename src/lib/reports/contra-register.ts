import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const contraColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "voucherNo", labelEn: "Voucher #", labelBn: "ভাউচার নং" },
  { key: "from", labelEn: "Source (From)", labelBn: "উৎস (হতে)" },
  { key: "to", labelEn: "Destination (To)", labelBn: "গন্তব্য (প্রতি)" },
  { key: "amount", labelEn: "Amount (BDT)", labelBn: "পরিমাণ (টাকা)", type: "number", align: "right" },
  { key: "purpose", labelEn: "Narration / Purpose", labelBn: "উদ্দেশ্য / বিবরণ" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
];

export type ContraTransferType =
  | "CASH_TO_BANK"
  | "BANK_TO_CASH"
  | "BANK_TO_BANK"
  | "CASH_TO_MFS"
  | "MFS_TO_BANK"
  | "MFS_TO_CASH"
  | "MFS_TO_MFS";

export interface ContraChannel {
  type: "CASH" | "BANK" | "MFS";
  label: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string | null;
  id?: string | null;
}

export interface ContraTransferItem {
  id: string;
  voucherNo: string;
  date: string;
  amount: number;
  purpose: string;
  transferType: ContraTransferType;
  from: ContraChannel;
  to: ContraChannel;
  status: "APPROVED" | "POSTED";
  createdBy: string;
  createdAt: string;
  outLedgerId: string;
  inLedgerId: string;
}

export interface ContraPendingRequest {
  id: string;
  date: string;
  amount: number;
  purpose: string;
  fromType: string;
  toType: string;
  bankAccountId?: string | null;
  bankName?: string;
  accountNumber?: string;
  requestedBy: string;
  status: "PENDING";
}

export interface ContraRegisterData extends ReportData {
  transfers: ContraTransferItem[];
  pendingRequests: ContraPendingRequest[];
  kpis: {
    totalTransferred: number;
    transferCount: number;
    cashToBankAmount: number;
    cashToBankCount: number;
    bankToCashAmount: number;
    bankToCashCount: number;
    interAccountAmount: number;
    interAccountCount: number;
    pendingCount: number;
    pendingAmount: number;
  };
  accounts: {
    id: string;
    bankName: string;
    accountNumber: string;
    branchName: string | null;
    accountType: string;
    currentBalance: number;
  }[];
}

export async function queryContraRegister(prisma: any, filters: ReportFilters): Promise<ContraRegisterData> {
  // Fetch all accounts to accurately classify Bank vs MFS vs Cash
  const rawAccounts: any[] = await prisma.bankAccount.findMany({
    orderBy: { bankName: "asc" },
  });
  const accMap = new Map<string, any>(rawAccounts.map((a: any) => [a.id, a]));

  const formatChannel = (accountType: string, bankAccountId: string | null): ContraChannel => {
    if (accountType === "CASH" || !bankAccountId) {
      return {
        type: "CASH",
        label: "Cash in Hand (Physical Vault)",
      };
    }
    const acc = accMap.get(bankAccountId);
    const isMfs = acc?.accountType === "MFS";
    return {
      type: isMfs ? "MFS" : "BANK",
      label: acc ? `${acc.bankName} (${acc.accountNumber})` : "Commercial Bank",
      bankName: acc?.bankName ?? "Bank Account",
      accountNumber: acc?.accountNumber ?? "",
      branchName: acc?.branchName ?? null,
      id: bankAccountId,
    };
  };

  // Fetch all CONTRA rows (both OUT and IN)
  const allContraRows: any[] = await prisma.treasuryLedger.findMany({
    where: { referenceType: "CONTRA" },
    orderBy: [{ txnDate: "desc" }, { createdAt: "desc" }],
  });

  const ledgerMap = new Map<string, any>(allContraRows.map((r: any) => [r.id, r]));

  // Date boundaries
  const fromDate = filters.from ? new Date(filters.from) : null;
  const toDate = filters.to ? new Date(filters.to) : null;
  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
  }

  const outRows = allContraRows.filter((r: any) => r.flowType === "OUT");
  const transfers: ContraTransferItem[] = [];

  for (const outRow of outRows) {
    const txnDateObj = new Date(outRow.txnDate);

    // Filter by date range
    if (fromDate && txnDateObj < fromDate) continue;
    if (toDate && txnDateObj > toDate) continue;

    const inRow = outRow.referenceId ? ledgerMap.get(outRow.referenceId) : null;

    // Filter by bank account if requested (either source or destination matches)
    if (filters.bankAccountId) {
      const matchOut = outRow.bankAccountId === filters.bankAccountId;
      const matchIn = inRow?.bankAccountId === filters.bankAccountId;
      if (!matchOut && !matchIn) continue;
    }

    const fromChannel = formatChannel(outRow.accountType, outRow.bankAccountId);
    const toChannel = inRow
      ? formatChannel(inRow.accountType, inRow.bankAccountId)
      : formatChannel(outRow.accountType === "CASH" ? "BANK" : "CASH", outRow.bankAccountId);

    let transferType: ContraTransferType = "BANK_TO_BANK";
    if (fromChannel.type === "CASH" && toChannel.type === "BANK") {
      transferType = "CASH_TO_BANK";
    } else if (fromChannel.type === "CASH" && toChannel.type === "MFS") {
      transferType = "CASH_TO_MFS";
    } else if (fromChannel.type === "BANK" && toChannel.type === "CASH") {
      transferType = "BANK_TO_CASH";
    } else if (fromChannel.type === "MFS" && toChannel.type === "CASH") {
      transferType = "MFS_TO_CASH";
    } else if (fromChannel.type === "BANK" && toChannel.type === "MFS") {
      transferType = "BANK_TO_BANK"; // inter-account
    } else if (fromChannel.type === "MFS" && toChannel.type === "BANK") {
      transferType = "MFS_TO_BANK";
    } else if (fromChannel.type === "MFS" && toChannel.type === "MFS") {
      transferType = "MFS_TO_MFS";
    }

    // Generate formatted contra voucher number
    const dateStr = outRow.txnDate instanceof Date ? outRow.txnDate.toISOString().slice(0, 10) : String(outRow.txnDate).slice(0, 10);
    const yearMonth = dateStr.replace(/-/g, "").slice(0, 6);
    const shortId = outRow.id.replace(/-/g, "").slice(0, 4).toUpperCase();
    const voucherNo = `CV-${yearMonth}-${shortId}`;

    transfers.push({
      id: outRow.id,
      voucherNo,
      date: dateStr,
      amount: toNum(outRow.amount),
      purpose: outRow.purpose || "Internal fund transfer",
      transferType,
      from: fromChannel,
      to: toChannel,
      status: "POSTED",
      createdBy: outRow.createdBy,
      createdAt: outRow.createdAt ? new Date(outRow.createdAt).toISOString() : dateStr,
      outLedgerId: outRow.id,
      inLedgerId: inRow?.id || outRow.referenceId || outRow.id,
    });
  }

  // Query pending contra transfer requests from auditLog
  let pendingRequests: ContraPendingRequest[] = [];
  try {
    const auditRows: any[] = await prisma.auditLog.findMany({
      where: { tableName: "treasury_transfer_requests" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const byId = new Map<string, any>();
    for (const r of [...auditRows].reverse()) {
      const cur = byId.get(r.recordId) ?? {
        recordId: r.recordId,
        createdAt: r.createdAt,
        action: "PENDING",
        newValues: typeof r.newValues === "string" ? JSON.parse(r.newValues) : r.newValues,
      };
      if (r.action === "CREATE") cur.newValues = typeof r.newValues === "string" ? JSON.parse(r.newValues) : r.newValues;
      if (r.action === "UPDATE") cur.action = "APPROVED";
      byId.set(r.recordId, cur);
    }

    const pendingOnly = Array.from(byId.values()).filter((item: any) => item.action === "PENDING");
    pendingRequests = pendingOnly.map((p: any) => {
      const val = p.newValues || {};
      const bankAcc = val.bankAccountId ? accMap.get(val.bankAccountId) : null;
      return {
        id: p.recordId,
        date: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        amount: toNum(val.amount),
        purpose: val.purpose || "Internal fund transfer request",
        fromType: val.fromType || "BANK",
        toType: val.toType || "CASH",
        bankAccountId: val.bankAccountId || null,
        bankName: bankAcc?.bankName,
        accountNumber: bankAcc?.accountNumber,
        requestedBy: val.requestedBy || "Officer",
        status: "PENDING",
      };
    });
  } catch {
    // Graceful fallback if auditLog query fails
  }

  // Calculate high-fidelity KPIs
  let totalTransferred = 0;
  let cashToBankAmount = 0;
  let cashToBankCount = 0;
  let bankToCashAmount = 0;
  let bankToCashCount = 0;
  let interAccountAmount = 0;
  let interAccountCount = 0;

  for (const t of transfers) {
    totalTransferred += t.amount;
    if (t.transferType === "CASH_TO_BANK" || t.transferType === "CASH_TO_MFS") {
      cashToBankAmount += t.amount;
      cashToBankCount++;
    } else if (t.transferType === "BANK_TO_CASH" || t.transferType === "MFS_TO_CASH") {
      bankToCashAmount += t.amount;
      bankToCashCount++;
    } else {
      interAccountAmount += t.amount;
      interAccountCount++;
    }
  }

  const pendingAmount = pendingRequests.reduce((sum, r) => sum + r.amount, 0);

  // Standard legacy tabular rows for excel/generic export
  const legacyRows = transfers.map((t) => ({
    date: t.date,
    voucherNo: t.voucherNo,
    from: t.from.label,
    to: t.to.label,
    amount: t.amount,
    purpose: t.purpose,
    status: t.status,
  }));

  return {
    columns: contraColumns,
    rows: legacyRows,
    totals: { amount: totalTransferred },
    transfers,
    pendingRequests,
    kpis: {
      totalTransferred,
      transferCount: transfers.length,
      cashToBankAmount,
      cashToBankCount,
      bankToCashAmount,
      bankToCashCount,
      interAccountAmount,
      interAccountCount,
      pendingCount: pendingRequests.length,
      pendingAmount,
    },
    accounts: rawAccounts.map((a: any) => ({
      id: a.id,
      bankName: a.bankName,
      accountNumber: a.accountNumber,
      branchName: a.branchName,
      accountType: a.accountType || "BANK",
      currentBalance: toNum(a.currentBalance),
    })),
  };
}
