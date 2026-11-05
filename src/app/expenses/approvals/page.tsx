import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import ApprovalsClient, { ApprovalsData } from "./ApprovalsClient";

export default async function ExpenseApprovalsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="p-8 text-red-600">Unauthorized</div>;
  }
  if (!(await can(session, "expenses.view"))) {
    return <div className="p-8 text-red-600">Forbidden: expenses.view</div>;
  }

  const canApprove = await can(session, "expenses.approve");
  const prisma: any = await getTenantClientFromSession();

  const [rawExpenses, rawProjects] = await Promise.all([
    prisma.projectExpense.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { id: true, projectName: true, mouza: true },
        },
        bankAccount: {
          select: { id: true, bankName: true, accountNumber: true },
        },
        paidByPartner: {
          select: { id: true, name: true, phone: true },
        },
      },
    }),
    prisma.landProject.findMany({
      select: { id: true, projectName: true, mouza: true },
      orderBy: { projectName: "asc" },
    }),
  ]);

  const pendingExpenses = rawExpenses.map((e: any) => ({
    id: e.id,
    projectId: e.projectId || null,
    projectName: e.project?.projectName || (e.projectId ? "Specific Project" : "General Overhead"),
    mouza: e.project?.mouza || null,
    expenseCategory: e.expenseCategory,
    amount: toNum(e.amount),
    expenseDate: e.expenseDate ? new Date(e.expenseDate).toISOString().split("T")[0] : "",
    description: e.description || "",
    paymentChannel: e.paymentChannel,
    bankName: e.bankAccount ? `${e.bankAccount.bankName} (${e.bankAccount.accountNumber})` : null,
    paidByPartnerName: e.paidByPartner?.name || null,
    paidByPartnerPhone: e.paidByPartner?.phone || null,
    voucherImageUrl: e.voucherImageUrl || null,
    status: e.status,
    createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : "",
  }));

  const data: ApprovalsData = {
    pendingExpenses,
    projects: rawProjects,
    canApprove,
  };

  return <ApprovalsClient data={data} />;
}
