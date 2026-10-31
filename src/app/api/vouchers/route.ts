import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { controlPrisma } from "@/lib/control";
import { can } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "expenses.view"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status") || "ALL";
  const projectId = url.searchParams.get("projectId") || "";
  const channel = url.searchParams.get("channel") || "";
  const postedBy = url.searchParams.get("postedBy") || "";
  const paidBy = url.searchParams.get("paidBy") || "";
  const reviewedBy = url.searchParams.get("reviewedBy") || "";
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const prisma: any = await getTenantClientFromSession();

  // Query base expenses
  const where: any = {};
  if (statusParam && statusParam !== "ALL") {
    where.status = statusParam.toUpperCase();
  }
  if (projectId) {
    where.projectId = projectId;
  }
  if (channel) {
    where.paymentChannel = channel;
  }
  if (postedBy) {
    where.createdBy = postedBy;
  }
  if (paidBy) {
    if (paidBy === "CASH") {
      where.paymentChannel = "CASH";
    } else if (paidBy.startsWith("PARTNER:")) {
      where.paidByPartnerId = paidBy.replace("PARTNER:", "");
    } else if (paidBy.startsWith("BANK:")) {
      where.bankAccountId = paidBy.replace("BANK:", "");
    }
  }
  if (from || to) {
    where.expenseDate = {};
    if (from) where.expenseDate.gte = new Date(from);
    if (to) where.expenseDate.lte = new Date(to);
  }

  const [expenses, allStatusExpenses, allExpensesMeta, projects, banks, partners] = await Promise.all([
    prisma.projectExpense.findMany({
      where,
      include: {
        project: true,
        bankAccount: true,
        paidByPartner: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.projectExpense.findMany({
      select: { id: true, status: true, amount: true },
    }),
    prisma.projectExpense.findMany({
      select: { id: true, createdBy: true, approvedBy: true, paidByPartnerId: true, bankAccountId: true, paymentChannel: true },
    }),
    prisma.landProject.findMany({ select: { id: true, projectName: true } }),
    prisma.bankAccount.findMany({ select: { id: true, bankName: true, accountNumber: true } }),
    prisma.partner.findMany({ select: { id: true, name: true, phone: true } }),
  ]);

  // Overall counts and amounts across all vouchers for dashboard summary
  const summary = {
    totalCount: allStatusExpenses.length,
    totalAmount: allStatusExpenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0),
    pendingCount: allStatusExpenses.filter((e: any) => e.status === "PENDING").length,
    pendingAmount: allStatusExpenses.filter((e: any) => e.status === "PENDING").reduce((s: number, e: any) => s + Number(e.amount || 0), 0),
    approvedCount: allStatusExpenses.filter((e: any) => e.status === "APPROVED").length,
    approvedAmount: allStatusExpenses.filter((e: any) => e.status === "APPROVED").reduce((s: number, e: any) => s + Number(e.amount || 0), 0),
    rejectedCount: allStatusExpenses.filter((e: any) => e.status === "REJECTED").length,
    rejectedAmount: allStatusExpenses.filter((e: any) => e.status === "REJECTED").reduce((s: number, e: any) => s + Number(e.amount || 0), 0),
    cancelledCount: allStatusExpenses.filter((e: any) => e.status === "CANCELLED").length,
    cancelledAmount: allStatusExpenses.filter((e: any) => e.status === "CANCELLED").reduce((s: number, e: any) => s + Number(e.amount || 0), 0),
  };

  // Fetch audit logs for the fetched expenses to resolve rejectors and cancellers accurately
  const expenseIds = expenses.map((e: any) => e.id);
  const auditLogs: any[] = expenseIds.length > 0
    ? await prisma.auditLog.findMany({
        where: {
          tableName: "project_expenses",
          recordId: { in: expenseIds },
        },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const auditByRecord = new Map<string, any[]>();
  for (const log of auditLogs) {
    const list = auditByRecord.get(log.recordId) || [];
    list.push(log);
    auditByRecord.set(log.recordId, list);
  }

  // Collect all unique user IDs across all expenses + audit logs
  const userIds = new Set<string>();
  for (const e of allExpensesMeta) {
    if (e.createdBy) userIds.add(e.createdBy);
    if (e.approvedBy) userIds.add(e.approvedBy);
  }
  for (const log of auditLogs) {
    if (log.changedBy) userIds.add(log.changedBy);
  }

  // Resolve user details from control plane
  const users: any[] = userIds.size > 0
    ? await (controlPrisma as any).globalUser.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, fullName: true, email: true },
      })
    : [];

  const userMap = new Map<string, { id: string; fullName: string; email: string }>(
    users.map((u: any) => [u.id, u])
  );

  const resolveUser = (uid?: string | null) => {
    if (!uid) return null;
    const found = userMap.get(uid);
    if (found) {
      return { id: found.id, name: found.fullName || found.email, email: found.email };
    }
    return { id: uid, name: `User (${uid.slice(0, 6)})`, email: "" };
  };

  // Distinct posters (who created/posted vouchers)
  const posterIds = new Set<string>();
  for (const e of allExpensesMeta) {
    if (e.createdBy) posterIds.add(e.createdBy);
  }
  const posters = Array.from(posterIds)
    .map((uid) => resolveUser(uid))
    .filter(Boolean) as Array<{ id: string; name: string; email: string }>;

  // Distinct reviewers (who approved / rejected vouchers)
  const reviewerIds = new Set<string>();
  for (const e of allExpensesMeta) {
    if (e.approvedBy) reviewerIds.add(e.approvedBy);
  }
  for (const log of auditLogs) {
    if (log.changedBy) reviewerIds.add(log.changedBy);
  }
  const reviewers = Array.from(reviewerIds)
    .map((uid) => resolveUser(uid))
    .filter(Boolean) as Array<{ id: string; name: string; email: string }>;

  // Map each expense to enriched voucher object
  const vouchers = expenses.map((e: any) => {
    const voucherNo = `VCH-${e.id.slice(0, 8).toUpperCase()}`;
    const logs = auditByRecord.get(e.id) || [];

    // Find who approved
    let approvedUser: { id: string; name: string; email: string } | null = null;
    let approvedAt: Date | null = null;
    if (e.status === "APPROVED") {
      approvedUser = resolveUser(e.approvedBy);
      const approveLog = [...logs].reverse().find((l) => (l.newValues as any)?.status === "APPROVED");
      if (approveLog) {
        if (!approvedUser) approvedUser = resolveUser(approveLog.changedBy);
        approvedAt = approveLog.createdAt;
      }
    }

    // Find who rejected
    let rejectedUser: { id: string; name: string; email: string } | null = null;
    let rejectedAt: Date | null = null;
    if (e.status === "REJECTED") {
      const rejectLog = [...logs].reverse().find((l) => (l.newValues as any)?.status === "REJECTED");
      if (rejectLog) {
        rejectedUser = resolveUser(rejectLog.changedBy);
        rejectedAt = rejectLog.createdAt;
      } else if (e.approvedBy) {
        rejectedUser = resolveUser(e.approvedBy);
      }
    }

    // Find who cancelled
    let cancelledUser: { id: string; name: string; email: string } | null = null;
    let cancelledAt: Date | null = null;
    if (e.status === "CANCELLED") {
      const cancelLog = [...logs].reverse().find((l) => (l.newValues as any)?.status === "CANCELLED");
      if (cancelLog) {
        cancelledUser = resolveUser(cancelLog.changedBy);
        cancelledAt = cancelLog.createdAt;
      } else if (e.approvedBy) {
        cancelledUser = resolveUser(e.approvedBy);
      }
    }

    // Paid by display
    let paidByDisplay = "Cash Treasury";
    let paidByDetails: any = null;
    if (e.paymentChannel === "PAID_BY_PARTNER" && e.paidByPartner) {
      paidByDisplay = `${e.paidByPartner.name} (Partner)`;
      paidByDetails = {
        type: "PARTNER",
        id: e.paidByPartner.id,
        name: e.paidByPartner.name,
        phone: e.paidByPartner.phone,
      };
    } else if (e.paymentChannel === "BANK" && e.bankAccount) {
      paidByDisplay = `${e.bankAccount.bankName} - ${e.bankAccount.accountNumber}`;
      paidByDetails = {
        type: "BANK",
        id: e.bankAccount.id,
        bankName: e.bankAccount.bankName,
        accountNumber: e.bankAccount.accountNumber,
      };
    } else {
      paidByDetails = {
        type: "CASH",
        label: "Cash Treasury",
      };
    }

    const createdUser = resolveUser(e.createdBy);

    const auditTrail = logs.map((l: any) => {
      const user = resolveUser(l.changedBy);
      const newStatus = (l.newValues as any)?.status;
      return {
        id: l.id,
        action: l.action,
        statusChangedTo: newStatus ?? null,
        user,
        timestamp: l.createdAt,
      };
    });

    return {
      id: e.id,
      voucherNo,
      date: e.expenseDate,
      createdAt: e.createdAt,
      category: e.expenseCategory,
      amount: Number(e.amount),
      description: e.description || "",
      paymentChannel: e.paymentChannel,
      status: e.status, // PENDING, APPROVED, REJECTED, CANCELLED
      voucherImageUrl: e.voucherImageUrl,
      projectId: e.projectId,
      projectName: e.project?.projectName || "General",
      project: e.project ? { id: e.project.id, projectName: e.project.projectName, mouza: e.project.mouza } : null,
      paidByDisplay,
      paidByDetails,
      created: {
        user: createdUser,
        at: e.createdAt,
      },
      approved: approvedUser ? { user: approvedUser, at: approvedAt } : null,
      rejected: rejectedUser ? { user: rejectedUser, at: rejectedAt } : null,
      cancelled: cancelledUser ? { user: cancelledUser, at: cancelledAt } : null,
      auditTrail,
    };
  });

  // Filter by reviewedBy if requested
  let filteredVouchers = vouchers;
  if (reviewedBy) {
    filteredVouchers = filteredVouchers.filter((v: any) => {
      return (
        v.approved?.user?.id === reviewedBy ||
        v.rejected?.user?.id === reviewedBy ||
        v.cancelled?.user?.id === reviewedBy
      );
    });
  }

  // Client search filtering if provided
  if (search) {
    filteredVouchers = filteredVouchers.filter((v: any) => {
      return (
        v.voucherNo.toLowerCase().includes(search) ||
        v.category.toLowerCase().includes(search) ||
        v.description.toLowerCase().includes(search) ||
        v.projectName.toLowerCase().includes(search) ||
        v.paidByDisplay.toLowerCase().includes(search) ||
        (v.created.user?.name && v.created.user.name.toLowerCase().includes(search)) ||
        (v.approved?.user?.name && v.approved.user.name.toLowerCase().includes(search)) ||
        (v.rejected?.user?.name && v.rejected.user.name.toLowerCase().includes(search)) ||
        (v.cancelled?.user?.name && v.cancelled.user.name.toLowerCase().includes(search)) ||
        String(v.amount).includes(search)
      );
    });
  }

  return NextResponse.json({
    vouchers: filteredVouchers,
    summary,
    filters: {
      projects,
      banks,
      partners,
      posters,
      reviewers,
    },
  });
}
