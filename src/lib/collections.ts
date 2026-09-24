import { randomUUID } from "crypto";
import { writeAudit } from "@/lib/tenantRules";

export type CollectArgs = {
  saleId: string;
  amount: number;
  paymentMethod: string;
  bankAccountId: string | null;
  userId: string;
  remarks?: string;
};

/**
 * Single source of truth for collecting money against a land sale.
 * Runs inside a caller-provided transaction and audits every write:
 *   customer_payments -> land_sales -> treasury_ledger -> installment_schedule
 * and flips project_plots to SOLD once the sale is PAID_IN_FULL.
 */
export async function collectPayment(tx: any, args: CollectArgs) {
  const amt = Number(args.amount);
  const sale = await tx.landSale.findUnique({ where: { id: args.saleId } });
  if (!sale) throw new Error("Sale not found");
  if (!(amt > 0)) throw new Error("Amount must be positive");
  if (amt > Number(sale.currentDueAmount)) throw new Error(`Amount exceeds outstanding due of ${sale.currentDueAmount}`);

  const paymentId = randomUUID();
  const cp = await tx.customerPayment.create({
    data: {
      id: paymentId,
      saleId: args.saleId,
      paymentDate: new Date(),
      amountPaid: amt,
      paymentMethod: args.paymentMethod,
      bankAccountId: args.bankAccountId,
      receiptNo: `R-${Date.now()}`,
      remarks: args.remarks || "Installment",
    },
  });
  await writeAudit(tx, "customer_payments", paymentId, "CREATE", args.userId, null, cp);

  const newDue = Number(sale.currentDueAmount) - amt;
  const paidTotal = Number(sale.totalAgreedPrice) - newDue;
  const saleStatus = newDue <= 0 ? "PAID_IN_FULL" : paidTotal > 0 ? "PARTIAL" : "BOOKED";
  const upd = await tx.landSale.update({ where: { id: args.saleId }, data: { currentDueAmount: newDue, status: saleStatus } });
  await writeAudit(tx, "land_sales", args.saleId, "UPDATE", args.userId, sale, upd);

  const tl = await tx.treasuryLedger.create({
    data: {
      id: randomUUID(),
      txnDate: new Date(),
      accountType: args.bankAccountId ? "BANK" : "CASH",
      bankAccountId: args.bankAccountId,
      flowType: "IN",
      amount: amt,
      purpose: `Payment sale ${args.saleId}`,
      referenceType: "SALE_PAYMENT",
      referenceId: args.saleId,
      createdBy: args.userId,
    },
  });
  await writeAudit(tx, "treasury_ledger", tl.id, "CREATE", args.userId, null, tl);

  // FIFO settlement of the installment schedule
  let remaining = amt;
  const schedule = await tx.installmentSchedule.findMany({ where: { saleId: args.saleId, status: "UPCOMING" }, orderBy: { dueDate: "asc" } });
  for (const inst of schedule) {
    if (remaining <= 0) break;
    const instAmt = Number(inst.dueAmount);
    const applied = Math.min(instAmt, remaining);
    remaining -= applied;
    if (applied >= instAmt) {
      await tx.installmentSchedule.update({ where: { id: inst.id }, data: { status: "PAID" } });
      await writeAudit(tx, "installment_schedule", inst.id, "UPDATE", args.userId, { status: "UPCOMING" }, { status: "PAID" });
    }
  }

  // mark OVERDUE for scheduled rows already past due
  const now = new Date();
  const overdue = await tx.installmentSchedule.findMany({ where: { saleId: args.saleId, status: "UPCOMING", dueDate: { lt: now } } });
  for (const inst of overdue) {
    await tx.installmentSchedule.update({ where: { id: inst.id }, data: { status: "OVERDUE" } });
    await writeAudit(tx, "installment_schedule", inst.id, "UPDATE", args.userId, { status: "UPCOMING" }, { status: "OVERDUE" });
  }

  // plot becomes SOLD only when the sale is settled in full
  if (saleStatus === "PAID_IN_FULL" && sale.plotId) {
    const plot = await tx.projectPlot.findUnique({ where: { id: sale.plotId } });
    if (plot && plot.status !== "SOLD") {
      await tx.projectPlot.update({ where: { id: plot.id }, data: { status: "SOLD" } });
      await writeAudit(tx, "project_plots", plot.id, "UPDATE", args.userId, { status: plot.status }, { status: "SOLD" });
    }
  }

  return { payment: cp, sale: upd, ledger: tl, saleStatus };
}
