import { randomUUID } from "crypto";
import { writeAudit } from "@/lib/tenantRules";

type ContraArgs = {
  fromType: "CASH" | "BANK";
  toType: "CASH" | "BANK";
  amount: number;
  bankAccountId: string | null;
  purpose: string;
  userId: string;
  role: string;
};

const EXECUTABLE_ROLES = ["super_admin", "managing_partner"];

/**
 * Spec: Bank Transfers / Contra — Accountant = "Approval required".
 * Accountant submits a PENDING request (recorded in audit_log), which an
 * approver (super_admin / managing_partner) must execute.
 * Executable roles write the real double-entry straight away.
 */
export async function createContra(prisma: any, args: ContraArgs) {
  const amt = Number(args.amount);
  if (!(amt > 0)) throw new Error("Amount must be positive");
  if (args.fromType === args.toType) throw new Error("Contra must move between CASH and BANK");
  if (args.fromType === "BANK" && !args.bankAccountId) throw new Error("Bank account required for BANK leg");

  if (args.role !== "accountant" && EXECUTABLE_ROLES.includes(args.role)) {
    return executeContra(prisma, { ...args, requestId: null });
  }
  if (!["super_admin", "managing_partner", "accountant"].includes(args.role)) throw new Error("Forbidden: bankTransfer");

  // accountant (or any other allowed-but-non-executing role) -> pending approval.
  // audit_log.action is spec-restricted to CREATE/UPDATE/DELETE, so the request is
  // recorded as CREATE under table_name 'treasury_transfer_requests' with status in newValues.
  const requestId = randomUUID();
  const record = {
    id: requestId,
    fromType: args.fromType,
    toType: args.toType,
    amount: amt,
    bankAccountId: args.bankAccountId,
    purpose: args.purpose || "Contra",
    requestedBy: args.userId,
    status: "PENDING",
  };
  await writeAudit(prisma, "treasury_transfer_requests", requestId, "CREATE", args.userId, null, record);
  return { pending: true, requestId, message: "Transfer submitted for approval" };
}

export async function approveContra(prisma: any, opts: { requestId: string; approverId: string; approverRole: string }) {
  if (!EXECUTABLE_ROLES.includes(opts.approverRole)) throw new Error("Only super_admin / managing_partner can approve");
  const rows: any = await (prisma as any).auditLog.findMany({
    where: { tableName: "treasury_transfer_requests", recordId: opts.requestId },
    orderBy: { createdAt: "asc" },
  });
  const created = rows.find((r: any) => r.action === "CREATE");
  if (!created) throw new Error("Pending transfer not found");
  const payload: any = created.newValues;
  if (payload?.status !== "PENDING") throw new Error("Transfer is not pending");
  if (rows.some((r: any) => r.action === "UPDATE")) throw new Error("Transfer already approved");

  const result = await executeContra(prisma, {
    fromType: payload.fromType,
    toType: payload.toType,
    amount: Number(payload.amount),
    bankAccountId: payload.bankAccountId ?? null,
    purpose: payload.purpose,
    userId: opts.approverId,
    role: opts.approverRole,
    requestId: opts.requestId,
  });
  await writeAudit(prisma, "treasury_transfer_requests", opts.requestId, "UPDATE", opts.approverId, payload, {
    status: "APPROVED",
    approvedBy: opts.approverId,
    outId: result.outId,
    inId: result.inId,
  });
  return { approved: true, ...result };
}

async function executeContra(prisma: any, args: ContraArgs & { requestId: string | null }) {
  return prisma.$transaction(async (tx: any) => {
    const outId = randomUUID();
    const inId = randomUUID();
    const out = await tx.treasuryLedger.create({
      data: {
        id: outId,
        txnDate: new Date(),
        accountType: args.fromType,
        bankAccountId: args.fromType === "BANK" ? args.bankAccountId : null,
        flowType: "OUT",
        amount: args.amount,
        purpose: args.purpose,
        referenceType: "CONTRA",
        referenceId: inId,
        createdBy: args.userId,
      },
    });
    await writeAudit(tx, "treasury_ledger", outId, "CREATE", args.userId, null, out);
    const inn = await tx.treasuryLedger.create({
      data: {
        id: inId,
        txnDate: new Date(),
        accountType: args.toType,
        bankAccountId: args.toType === "BANK" ? args.bankAccountId : null,
        flowType: "IN",
        amount: args.amount,
        purpose: args.purpose,
        referenceType: "CONTRA",
        referenceId: outId,
        createdBy: args.userId,
      },
    });
    await writeAudit(tx, "treasury_ledger", inId, "CREATE", args.userId, null, inn);
    return { outId, inId, amount: args.amount };
  });
}

/** PENDING / APPROVED contra requests (from audit_log). */
export async function listContraRequests(prisma: any) {
  const rows: any = await (prisma as any).auditLog.findMany({
    where: { tableName: "treasury_transfer_requests", action: { in: ["CREATE", "UPDATE"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  // pair CREATE + UPDATE so approved requests show as APPROVED
  const byId = new Map<string, any>();
  for (const r of rows.reverse()) {
    const cur = byId.get(r.recordId) ?? { recordId: r.recordId, createdAt: r.createdAt, action: "PENDING", newValues: r.newValues };
    if (r.action === "CREATE") cur.newValues = r.newValues;
    if (r.action === "UPDATE") { cur.action = "APPROVED"; cur.newValues = { ...cur.newValues, ...r.newValues }; }
    byId.set(r.recordId, cur);
  }
  return Array.from(byId.values()).reverse();
}
