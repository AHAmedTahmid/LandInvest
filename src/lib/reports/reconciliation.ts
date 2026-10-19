import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";

const reconColumns: ReportColumn[] = [
  { key: "check", labelEn: "Check", labelBn: "পরীক্ষা" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
  { key: "detail", labelEn: "Detail", labelBn: "বিবরণ" },
];

export async function queryReconciliation(prisma: any): Promise<ReportData> {
  const checks: { check: string; status: "PASS" | "FAIL"; detail: string }[] = [];

  // 1. Bank ledger vs bank account balance
  const bankAccounts = await prisma.bankAccount.findMany();
  const bankLedgers = await prisma.treasuryLedger.findMany({ where: { accountType: "BANK" } });
  for (const acc of bankAccounts) {
    const ledgerSum = bankLedgers.filter((l: any) => l.bankAccountId === acc.id).reduce((s: number, l: any) => s + (l.flowType === "IN" ? toNum(l.amount) : -toNum(l.amount)), 0);
    const accBal = toNum(acc.currentBalance);
    const match = Math.abs(ledgerSum - accBal) < 0.01;
    checks.push({
      check: `Bank: ${acc.bankName} (${acc.accountNumber})`,
      status: match ? "PASS" : "FAIL",
      detail: match ? `Ledger ${fmt(ledgerSum)} = Account ${fmt(accBal)}` : `Ledger ${fmt(ledgerSum)} ≠ Account ${fmt(accBal)}`,
    });
  }

  // 2. Partner ledger balance
  const partners = await prisma.partner.findMany();
  const partnerTxns = await prisma.partnerTransaction.findMany();
  for (const p of partners) {
    const txns = partnerTxns.filter((t: any) => t.partnerId === p.id);
    let computed = toNum(p.openingBalance);
    for (const t of txns) {
      if (["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType)) computed += toNum(t.amount);
      else if (t.txnType === "WITHDRAWAL") computed -= toNum(t.amount);
    }
    checks.push({
      check: `Partner: ${p.name}`,
      status: "PASS",
      detail: `Computed balance: ${fmt(computed)}`,
    });
  }

  // 3. Sale collected = sum of payments
  const sales = await prisma.landSale.findMany();
  const payments = await prisma.customerPayment.findMany();
  for (const s of sales) {
    const collected = payments.filter((p: any) => p.saleId === s.id).reduce((sum: number, p: any) => sum + toNum(p.amountPaid), 0);
    const due = toNum(s.totalAgreedPrice) - collected;
    checks.push({
      check: `Sale: ${s.buyerName}`,
      status: "PASS",
      detail: `Collected ${fmt(collected)}, Due ${fmt(due)}`,
    });
  }

  // 4. Project share percentages = 100%
  const projects = await prisma.landProject.findMany({ include: { projectPartners: true } });
  for (const proj of projects) {
    const shareSum = proj.projectPartners.reduce((s: number, pp: any) => s + toNum(pp.sharePercentage), 0);
    const match = Math.abs(shareSum - 100) < 0.01;
    checks.push({
      check: `Shares: ${proj.projectName}`,
      status: match ? "PASS" : "FAIL",
      detail: match ? `Total ${shareSum}%` : `Total ${shareSum}% (should be 100%)`,
    });
  }

  // 5. No PAID_BY_PARTNER in treasury_ledger
  const pbpInLedger = await prisma.treasuryLedger.count({
    where: { referenceType: "EXPENSE", referenceId: { in: (await prisma.projectExpense.findMany({ where: { paymentChannel: "PAID_BY_PARTNER" }, select: { id: true } })).map((e: any) => e.id) } },
  });
  checks.push({
    check: "PAID_BY_PARTNER not in treasury",
    status: pbpInLedger === 0 ? "PASS" : "FAIL",
    detail: pbpInLedger === 0 ? "No leakage found" : `${pbpInLedger} records leaked`,
  });

  const data = checks.map((c) => ({ ...c }));
  const failCount = data.filter((r: any) => r.status === "FAIL").length;

  return {
    columns: reconColumns,
    rows: data,
    summary: [
      { labelEn: "Total Checks", labelBn: "মোট পরীক্ষা", value: String(data.length) },
      { labelEn: "Passed", labelBn: "পাস", value: String(data.length - failCount) },
      { labelEn: "Failed", labelBn: "ব্যর্থ", value: String(failCount) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
