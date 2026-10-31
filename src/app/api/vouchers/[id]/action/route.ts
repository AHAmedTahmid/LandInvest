import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { isPaidByPartner, writeAudit } from "@/lib/tenantRules";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: recordId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, reason } = await req.json(); // APPROVED | REJECTED | CANCELLED
  if (!["APPROVED", "REJECTED", "CANCELLED"].includes(action)) {
    return NextResponse.json({ error: "Invalid action. Must be APPROVED, REJECTED, or CANCELLED." }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const prisma: any = await getTenantClientFromSession();

  const exp = await prisma.projectExpense.findUnique({ where: { id: recordId } });
  if (!exp) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });

  // Status check: Only PENDING vouchers can be approved, rejected, or cancelled
  if (exp.status !== "PENDING") {
    return NextResponse.json({ error: `Cannot modify a voucher that is already ${exp.status}` }, { status: 400 });
  }

  // Permission check:
  // Approving or rejecting requires expenses.approve
  // Cancelling requires either expenses.approve or being the creator of the voucher
  const canApprove = await can(session, "expenses.approve");
  if (action === "CANCELLED") {
    const isCreator = exp.createdBy === userId;
    if (!canApprove && !isCreator) {
      return NextResponse.json({ error: "Forbidden: You can only cancel your own pending vouchers." }, { status: 403 });
    }
  } else {
    if (!canApprove) {
      return NextResponse.json({ error: "Forbidden: expenses.approve required." }, { status: 403 });
    }
  }

  const result = await prisma.$transaction(async (tx: any) => {
    const updated = await tx.projectExpense.update({
      where: { id: recordId },
      data: {
        status: action,
        approvedBy: userId,
      },
    });

    const auditData = {
      ...updated,
      ...(reason ? { actionReason: reason } : {}),
    };

    await writeAudit(tx, "project_expenses", recordId, "UPDATE", userId, exp, auditData);

    if (action === "APPROVED") {
      if (isPaidByPartner(exp.paymentChannel)) {
        const pt = await tx.partnerTransaction.create({
          data: {
            id: randomUUID(),
            partnerId: exp.paidByPartnerId,
            txnType: "DIRECT_EXPENSE",
            amount: exp.amount,
            txnDate: new Date(),
            referenceId: recordId,
            notes: exp.description,
          },
        });
        await writeAudit(tx, "partner_transactions", pt.id, "CREATE", userId, null, pt);
      } else {
        const accType = exp.paymentChannel === "BANK" ? "BANK" : "CASH";
        const tl = await tx.treasuryLedger.create({
          data: {
            id: randomUUID(),
            txnDate: new Date(),
            accountType: accType,
            bankAccountId: exp.bankAccountId,
            flowType: "OUT",
            amount: exp.amount,
            purpose: exp.expenseCategory,
            referenceType: "EXPENSE",
            referenceId: recordId,
            createdBy: userId,
          },
        });
        await writeAudit(tx, "treasury_ledger", tl.id, "CREATE", userId, null, tl);
      }
    }

    return updated;
  });

  return NextResponse.json({ success: true, voucher: result });
}

