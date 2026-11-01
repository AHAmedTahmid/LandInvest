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

  const { action, reason } = await req.json(); // APPROVED | REJECTED | CANCELLED | REACTIVATED
  if (!["APPROVED", "REJECTED", "CANCELLED", "REACTIVATED"].includes(action)) {
    return NextResponse.json({ error: "Invalid action. Must be APPROVED, REJECTED, CANCELLED, or REACTIVATED." }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const prisma: any = await getTenantClientFromSession();

  const exp = await prisma.projectExpense.findUnique({ where: { id: recordId } });
  if (!exp) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });

  // Status check:
  // REACTIVATED is for non-pending vouchers (APPROVED, REJECTED, CANCELLED)
  // APPROVED, REJECTED, CANCELLED are for PENDING vouchers
  if (action === "REACTIVATED") {
    if (exp.status === "PENDING") {
      return NextResponse.json({ error: "Voucher is already PENDING." }, { status: 400 });
    }
  } else {
    if (exp.status !== "PENDING") {
      return NextResponse.json({ error: `Cannot modify a voucher that is already ${exp.status}` }, { status: 400 });
    }
  }

  // Permission check:
  // Approving or rejecting requires expenses.approve
  // Cancelling requires either expenses.approve or being the creator of the voucher
  // Reactivating an APPROVED voucher requires expenses.approve (reverses financial ledgers)
  // Reactivating a REJECTED or CANCELLED voucher requires expenses.approve or being the creator
  const canApprove = await can(session, "expenses.approve");
  if (action === "CANCELLED") {
    const isCreator = exp.createdBy === userId;
    if (!canApprove && !isCreator) {
      return NextResponse.json({ error: "Forbidden: You can only cancel your own pending vouchers." }, { status: 403 });
    }
  } else if (action === "REACTIVATED") {
    if (exp.status === "APPROVED") {
      if (!canApprove) {
        return NextResponse.json({ error: "Forbidden: expenses.approve required to reactivate an approved voucher and reverse ledgers." }, { status: 403 });
      }
    } else {
      const isCreator = exp.createdBy === userId;
      if (!canApprove && !isCreator) {
        return NextResponse.json({ error: "Forbidden: You can only reactivate your own vouchers." }, { status: 403 });
      }
    }
  } else {
    if (!canApprove) {
      return NextResponse.json({ error: "Forbidden: expenses.approve required." }, { status: 403 });
    }
  }

  const result = await prisma.$transaction(async (tx: any) => {
    if (action === "REACTIVATED") {
      // Revert status to PENDING and clear approver
      const updated = await tx.projectExpense.update({
        where: { id: recordId },
        data: {
          status: "PENDING",
          approvedBy: null,
        },
      });

      // If the voucher was previously APPROVED, reduce/revert its financial amounts from all ledgers
      if (exp.status === "APPROVED") {
        // 1. Delete associated treasury ledger entries (restores Cash/Bank account balance)
        const ledgers = await tx.treasuryLedger.findMany({
          where: { referenceType: "EXPENSE", referenceId: recordId },
        });
        for (const tl of ledgers) {
          await tx.treasuryLedger.delete({ where: { id: tl.id } });
          await writeAudit(tx, "treasury_ledger", tl.id, "DELETE", userId, tl, null);
        }

        // 2. Delete associated partner transactions (restores Partner capital/balance)
        const partnerTxns = await tx.partnerTransaction.findMany({
          where: { referenceId: recordId },
        });
        for (const pt of partnerTxns) {
          await tx.partnerTransaction.delete({ where: { id: pt.id } });
          await writeAudit(tx, "partner_transactions", pt.id, "DELETE", userId, pt, null);
        }
      }

      const auditData = {
        ...updated,
        reactivatedFrom: exp.status,
        reactivatedBy: userId,
        ...(reason ? { actionReason: reason } : {}),
      };

      await writeAudit(tx, "project_expenses", recordId, "UPDATE", userId, exp, auditData);
      return updated;
    }

    // Otherwise APPROVED, REJECTED, or CANCELLED
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
        if (!exp.paidByPartnerId) {
          throw new Error("Cannot approve: Paid by Partner is selected, but no partner was assigned to this voucher. Please edit the voucher and assign a partner first.");
        }
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
            bankAccountId: exp.bankAccountId || null,
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

