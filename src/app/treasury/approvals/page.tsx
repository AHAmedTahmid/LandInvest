import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { listContraRequests, approveContra } from "@/lib/treasury";
import { writeAudit } from "@/lib/tenantRules";
import { toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import ApprovalsClient, { TransferRequest } from "./ApprovalsClient";

export default async function TreasuryApprovalsPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "treasury.view")) && !(await can(session, "treasury.contra.approve"))) {
    return <div className="p-8 text-red-600">Forbidden: treasury.view</div>;
  }

  const canApprove = await can(session, "treasury.contra.approve");
  const prisma: any = await getTenantClientFromSession();

  const [rawRequests, banks] = await Promise.all([
    listContraRequests(prisma),
    prisma.bankAccount.findMany({
      select: { id: true, bankName: true, accountNumber: true },
    }),
  ]);

  const bankMap = new Map<string, { bankName: string; accountNumber: string }>();
  for (const b of banks) {
    bankMap.set(b.id, { bankName: b.bankName, accountNumber: b.accountNumber });
  }

  const requests: TransferRequest[] = rawRequests.map((r: any) => {
    const payload = r.newValues || {};
    const bankInfo = payload.bankAccountId ? bankMap.get(payload.bankAccountId) : null;
    return {
      recordId: r.recordId,
      createdAt: new Date(r.createdAt).toISOString(),
      status: (r.action === "APPROVED" ? "APPROVED" : r.action === "REJECTED" ? "REJECTED" : "PENDING") as any,
      fromType: payload.fromType || "CASH",
      toType: payload.toType || "BANK",
      amount: toNum(payload.amount),
      bankAccountId: payload.bankAccountId || null,
      bankName: bankInfo?.bankName || null,
      accountNumber: bankInfo?.accountNumber || null,
      purpose: payload.purpose || "Contra",
      requestedBy: payload.requestedBy || "User",
      approvedBy: payload.approvedBy || null,
    };
  });

  async function approveAction(requestId: string) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "treasury.contra.approve"))) {
      return { error: "Forbidden: treasury.contra.approve" };
    }

    const prisma2: any = await getTenantClientFromSession();
    const userId = (s!.user as any).id;

    try {
      await approveContra(prisma2, {
        requestId,
        approverId: userId,
        approverRole: "super_admin",
      });
    } catch (e: any) {
      return { error: e.message || "Failed to approve transfer" };
    }

    revalidatePath("/treasury");
    revalidatePath("/treasury/approvals");
    revalidatePath("/treasury/dashboard");
    revalidatePath("/treasury/transactions");
    return { success: true };
  }

  async function rejectAction(requestId: string) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "treasury.contra.approve"))) {
      return { error: "Forbidden: treasury.contra.approve" };
    }

    const prisma2: any = await getTenantClientFromSession();
    const userId = (s!.user as any).id;

    try {
      const rows: any = await prisma2.auditLog.findMany({
        where: { tableName: "treasury_transfer_requests", recordId: requestId },
      });
      const created = rows.find((r: any) => r.action === "CREATE");
      if (!created) throw new Error("Transfer request not found");
      const payload: any = created.newValues;

      await writeAudit(prisma2, "treasury_transfer_requests", requestId, "UPDATE", userId, payload, {
        ...payload,
        status: "REJECTED",
        rejectedBy: userId,
      });
    } catch (e: any) {
      return { error: e.message || "Failed to reject transfer" };
    }

    revalidatePath("/treasury");
    revalidatePath("/treasury/approvals");
    revalidatePath("/treasury/dashboard");
    revalidatePath("/treasury/transactions");
    return { success: true };
  }

  return (
    <div className="p-6">
      <ApprovalsClient
        requests={requests}
        canApprove={canApprove}
        approveAction={approveAction}
        rejectAction={rejectAction}
      />
    </div>
  );
}

