import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import ExpensesClient, { ExpenseDirectoryData } from "./ExpensesClient";

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="p-8 text-red-600">Unauthorized</div>;
  }
  if (!(await can(session, "expenses.view"))) {
    return <div className="p-8 text-red-600">Forbidden: expenses.view</div>;
  }

  const canApprove = await can(session, "expenses.approve");
  const canCreate = await can(session, "expenses.create");
  const prisma: any = await getTenantClientFromSession();

  const [rawExpenses, rawProjects, rawPartners, rawBanks] = await Promise.all([
    prisma.projectExpense.findMany({
      orderBy: { expenseDate: "desc" },
      include: {
        project: {
          select: { id: true, projectName: true, mouza: true, totalAreaShotok: true },
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
      select: { id: true, projectName: true, mouza: true, totalAreaShotok: true, status: true },
      orderBy: { projectName: "asc" },
    }),
    prisma.partner.findMany({
      select: { id: true, name: true, phone: true },
      orderBy: { name: "asc" },
    }),
    prisma.bankAccount.findMany({
      select: { id: true, bankName: true, accountNumber: true },
      orderBy: { bankName: "asc" },
    }),
  ]);

  const expenses = rawExpenses.map((e: any) => ({
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
    voucherImageUrl: e.voucherImageUrl || null,
    status: e.status,
    createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : "",
  }));

  const projects = rawProjects.map((p: any) => ({
    id: p.id,
    projectName: p.projectName,
    mouza: p.mouza || "",
    totalAreaShotok: toNum(p.totalAreaShotok),
    status: p.status,
  }));

  const data: ExpenseDirectoryData = {
    expenses,
    projects,
    partners: rawPartners,
    banks: rawBanks,
    canApprove,
    canCreate,
  };

  return <ExpensesClient data={data} />;
}
