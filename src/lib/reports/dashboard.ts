import { toNum } from "@/lib/format";

export interface TreasuryEntry {
  id: string;
  txnDate: Date;
  accountType: string;
  bankAccountId?: string | null;
  bankAccount?: { bankName: string; accountNumber: string } | null;
  flowType: string;
  amount: number;
  purpose: string;
  referenceType: string;
  referenceId?: string | null;
  isFutureDated: boolean;
}

/**
 * Audit receivables: total agreed price minus collected payment for non-cancelled sales.
 */
export async function getReceivables(prisma: any): Promise<number> {
  const sales = await prisma.landSale.findMany({
    where: {
      status: { not: "CANCELLED" },
    },
    select: {
      id: true,
      totalAgreedPrice: true,
      currentDueAmount: true,
    },
  });

  if (sales.length === 0) return 0;
  const saleIds = sales.map((s: any) => s.id);

  const payments = await prisma.customerPayment.findMany({
    where: { saleId: { in: saleIds } },
    select: { saleId: true, amountPaid: true },
  });

  const paidBySale = new Map<string, number>();
  for (const p of payments) {
    const cur = paidBySale.get(p.saleId) || 0;
    paidBySale.set(p.saleId, cur + toNum(p.amountPaid));
  }

  let total = 0;
  for (const s of sales) {
    const paid = paidBySale.get(s.id) || 0;
    const due = Math.max(0, toNum(s.totalAgreedPrice) - paid);
    total += due;
  }
  return total;
}

/**
 * Current cash in hand, excluding future-dated entries.
 */
export async function getCashBalance(prisma: any): Promise<number> {
  const now = new Date();
  const rows = await prisma.treasuryLedger.findMany({
    where: {
      accountType: "CASH",
      txnDate: { lte: now },
    },
  });
  return rows.reduce(
    (s: number, r: any) => s + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)),
    0
  );
}

/**
 * Bank balances per active account, excluding future-dated entries.
 */
export async function getBankBalances(
  prisma: any
): Promise<{ id: string; bankName: string; accountNumber: string; balance: number }[]> {
  const now = new Date();
  const accounts = await prisma.bankAccount.findMany({ where: { isActive: true } });
  const ledgers = await prisma.treasuryLedger.findMany({
    where: {
      accountType: "BANK",
      txnDate: { lte: now },
    },
  });

  return accounts.map((a: any) => {
    const rows = ledgers.filter((l: any) => l.bankAccountId === a.id);
    const balance = rows.reduce(
      (s: number, l: any) => s + (l.flowType === "IN" ? toNum(l.amount) : -toNum(l.amount)),
      0
    );
    return { id: a.id, bankName: a.bankName, accountNumber: a.accountNumber, balance };
  });
}

/**
 * Unsold inventory value at asking price.
 */
export async function getUnsoldInventoryValue(prisma: any): Promise<number> {
  const plots = await prisma.projectPlot.findMany({ where: { status: "AVAILABLE" } });
  return plots.reduce((s: number, p: any) => s + toNum(p.askingPrice), 0);
}

/**
 * Sales collected this month.
 */
export async function getSalesThisMonth(prisma: any): Promise<number> {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const payments = await prisma.customerPayment.findMany({
    where: { paymentDate: { gte: from, lte: now } },
  });
  return payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
}

/**
 * Sales collected this fiscal year.
 */
export async function getSalesThisYear(prisma: any): Promise<number> {
  const now = new Date();
  // BD Fiscal year: July 1 to June 30
  const curYear = now.getFullYear();
  const curMonth = now.getMonth(); // 0-indexed: 6 is July
  const fyStartYear = curMonth >= 6 ? curYear : curYear - 1;
  const fyStart = new Date(fyStartYear, 6, 1);

  const payments = await prisma.customerPayment.findMany({
    where: { paymentDate: { gte: fyStart, lte: now } },
  });
  return payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
}

/**
 * Recent treasury transactions with future-dated flag.
 */
export async function getRecentTreasuryLedger(prisma: any, limit: number = 5): Promise<TreasuryEntry[]> {
  const rows = await prisma.treasuryLedger.findMany({
    orderBy: { txnDate: "desc" },
    take: limit,
    include: { bankAccount: true },
  });
  const now = new Date();

  return rows.map((r: any) => ({
    id: r.id,
    txnDate: r.txnDate,
    accountType: r.accountType,
    bankAccountId: r.bankAccountId,
    bankAccount: r.bankAccount ? { bankName: r.bankAccount.bankName, accountNumber: r.bankAccount.accountNumber } : null,
    flowType: r.flowType,
    amount: toNum(r.amount),
    purpose: r.purpose,
    referenceType: r.referenceType,
    referenceId: r.referenceId,
    isFutureDated: new Date(r.txnDate) > now,
  }));
}
