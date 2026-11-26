import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { isPaidByPartner, writeAudit } from "@/lib/tenantRules";
import { randomUUID } from "crypto";
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id:recordId}=await params;
  const session=await getServerSession(authOptions);
  if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const role=(session.user as any).role;
  if (!(await can(session, "expenses.approve"))) return NextResponse.json({error:"Forbidden"},{status:403});
  const { action } = await req.json(); // APPROVED | REJECTED | CANCELLED | REACTIVATED
  if (!["APPROVED", "REJECTED", "CANCELLED", "REACTIVATED"].includes(action)) {
    return NextResponse.json({ error: "Invalid action. Must be APPROVED, REJECTED, CANCELLED, or REACTIVATED." }, { status: 400 });
  }
  const userId = (session.user as any).id;
  const prisma: any = await getTenantClientFromSession();
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const exp = await tx.projectExpense.findUnique({ where: { id: recordId } });
      if (!exp) throw new Error("Not found");
      if (action === "REACTIVATED") {
        if (exp.status === "PENDING") throw new Error("Voucher is already PENDING.");
        const updated = await tx.projectExpense.update({
          where: { id: recordId },
          data: { status: "PENDING", approvedBy: null },
        });
        if (exp.status === "APPROVED") {
          const ledgers = await tx.treasuryLedger.findMany({
            where: { referenceType: "EXPENSE", referenceId: recordId },
          });
          for (const tl of ledgers) {
            if (tl.bankAccountId) {
              const prevBank = await tx.bankAccount.findUnique({ where: { id: tl.bankAccountId } });
              if (prevBank) {
                const delta = tl.flowType === "OUT" ? Number(tl.amount) : -Number(tl.amount);
                const updBank = await tx.bankAccount.update({
                  where: { id: tl.bankAccountId },
                  data: { currentBalance: { increment: delta } },
                });
                await writeAudit(tx, "bank_accounts", tl.bankAccountId, "UPDATE", userId, prevBank, updBank);
              }
            }
            await tx.treasuryLedger.delete({ where: { id: tl.id } });
            await writeAudit(tx, "treasury_ledger", tl.id, "DELETE", userId, tl, null);
          }
          const partnerTxns = await tx.partnerTransaction.findMany({
            where: { referenceId: recordId },
          });
          for (const pt of partnerTxns) {
            await tx.partnerTransaction.delete({ where: { id: pt.id } });
            await writeAudit(tx, "partner_transactions", pt.id, "DELETE", userId, pt, null);
          }
        }
        await writeAudit(tx, "project_expenses", recordId, "UPDATE", userId, exp, { ...updated, reactivatedFrom: exp.status });
        return updated;
      }

      if (exp.status !== "PENDING") {
        throw new Error(`Cannot modify a voucher that is already ${exp.status}`);
      }

      const targetStatus = action === "APPROVED" ? "APPROVED" : action === "CANCELLED" ? "CANCELLED" : "REJECTED";
      const updated = await tx.projectExpense.update({ where: { id: recordId }, data: { status: targetStatus, approvedBy: userId } });
      await writeAudit(tx, "project_expenses", recordId, "UPDATE", userId, exp, updated);
      if (action === "APPROVED") {
        if (isPaidByPartner(exp.paymentChannel)) {
          if (!exp.paidByPartnerId) {
            throw new Error("Cannot approve: Paid by Partner is selected, but no partner was assigned to this voucher.");
          }
          const pt = await tx.partnerTransaction.create({ data: { id: randomUUID(), partnerId: exp.paidByPartnerId, txnType: "DIRECT_EXPENSE", amount: exp.amount, txnDate: new Date(), referenceId: recordId, notes: exp.description } });
          await writeAudit(tx, "partner_transactions", pt.id, "CREATE", userId, null, pt);
        } else {
          const accType = exp.paymentChannel === "BANK" ? "BANK" : "CASH";
          const tl = await tx.treasuryLedger.create({ data: { id: randomUUID(), txnDate: new Date(), accountType: accType, bankAccountId: exp.bankAccountId, flowType: "OUT", amount: exp.amount, purpose: exp.expenseCategory, referenceType: "EXPENSE", referenceId: recordId, createdBy: userId } });
          await writeAudit(tx, "treasury_ledger", tl.id, "CREATE", userId, null, tl);
          if (accType === "BANK" && exp.bankAccountId) {
            const prevBank = await tx.bankAccount.findUnique({ where: { id: exp.bankAccountId } });
            if (prevBank) {
              const updBank = await tx.bankAccount.update({
                where: { id: exp.bankAccountId },
                data: { currentBalance: { decrement: Number(exp.amount) } },
              });
              await writeAudit(tx, "bank_accounts", exp.bankAccountId, "UPDATE", userId, prevBank, updBank);
            }
          }
        }
      }
      return updated;
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
