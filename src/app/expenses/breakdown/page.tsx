import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import BreakdownClient, { ProjectCostBreakdownData } from "./BreakdownClient";

export default async function ExpenseBreakdownPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="p-8 text-red-600">Unauthorized</div>;
  }
  if (!(await can(session, "expenses.view"))) {
    return <div className="p-8 text-red-600">Forbidden: expenses.view</div>;
  }

  const prisma: any = await getTenantClientFromSession();

  const [rawProjects, rawAllExpenses] = await Promise.all([
    prisma.landProject.findMany({
      orderBy: { projectName: "asc" },
      include: {
        projectPlots: {
          select: { id: true, plotSizeShotok: true, askingPrice: true, status: true },
        },
      },
    }),
    prisma.projectExpense.findMany({
      where: { status: "APPROVED" },
      orderBy: { expenseDate: "desc" },
      include: {
        bankAccount: { select: { bankName: true, accountNumber: true } },
        paidByPartner: { select: { name: true, phone: true } },
      },
    }),
  ]);

  const projects = rawProjects.map((p: any) => ({
    id: p.id,
    projectName: p.projectName,
    mouza: p.mouza,
    jlNumber: p.jlNumber || null,
    totalAreaShotok: toNum(p.totalAreaShotok),
    purchasePrice: toNum(p.purchasePrice),
    baynaAmount: toNum(p.baynaAmount),
    registrationCost: toNum(p.registrationCost),
    mutationTaxCost: toNum(p.mutationTaxCost),
    status: p.status,
    totalPlots: p.projectPlots?.length || 0,
  }));

  const expenses = rawAllExpenses.map((e: any) => ({
    id: e.id,
    projectId: e.projectId || null,
    expenseCategory: e.expenseCategory,
    amount: toNum(e.amount),
    expenseDate: e.expenseDate ? new Date(e.expenseDate).toISOString().split("T")[0] : "",
    description: e.description || "",
    paymentChannel: e.paymentChannel,
    bankName: e.bankAccount ? `${e.bankAccount.bankName} (${e.bankAccount.accountNumber})` : null,
    paidByPartnerName: e.paidByPartner?.name || null,
    voucherImageUrl: e.voucherImageUrl || null,
  }));

  const data: ProjectCostBreakdownData = {
    projects,
    expenses,
  };

  return <BreakdownClient data={data} />;
}
