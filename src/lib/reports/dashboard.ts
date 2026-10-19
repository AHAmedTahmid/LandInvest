import { toNum } from "@/lib/format";

export async function getCashBalance(prisma: any): Promise<number> {
  const rows = await prisma.treasuryLedger.findMany({ where: { accountType: "CASH" } });
  return rows.reduce((s: number, r: any) => s + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)), 0);
}

export async function getBankBalances(prisma: any): Promise<{ id: string; bankName: string; accountNumber: string; balance: number }[]> {
  const accounts = await prisma.bankAccount.findMany();
  const ledgers = await prisma.treasuryLedger.findMany({ where: { accountType: "BANK" } });
  return accounts.map((a: any) => {
    const rows = ledgers.filter((l: any) => l.bankAccountId === a.id);
    const balance = rows.reduce((s: number, l: any) => s + (l.flowType === "IN" ? toNum(l.amount) : -toNum(l.amount)), 0);
    return { id: a.id, bankName: a.bankName, accountNumber: a.accountNumber, balance };
  });
}

export async function getUnsoldInventoryValue(prisma: any): Promise<number> {
  const plots = await prisma.projectPlot.findMany({ where: { status: "AVAILABLE" } });
  return plots.reduce((s: number, p: any) => s + toNum(p.askingPrice), 0);
}

export async function getReceivables(prisma: any): Promise<number> {
  const sales = await prisma.landSale.findMany();
  const payments = await prisma.customerPayment.findMany();
  let total = 0;
  for (const s of sales) {
    const paid = payments.filter((p: any) => p.saleId === s.id).reduce((sum: number, p: any) => sum + toNum(p.amountPaid), 0);
    total += toNum(s.totalAgreedPrice) - paid;
  }
  return total;
}

export async function getSalesThisMonth(prisma: any): Promise<number> {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const payments = await prisma.customerPayment.findMany({ where: { paymentDate: { gte: from } } });
  return payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
}

export async function getSalesThisYear(prisma: any): Promise<number> {
  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1);
  const payments = await prisma.customerPayment.findMany({ where: { paymentDate: { gte: from } } });
  return payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
}
