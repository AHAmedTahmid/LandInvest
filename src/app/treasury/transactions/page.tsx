import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import TransactionsClient, { LedgerTransaction } from "./TransactionsClient";

export default async function TreasuryTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "treasury.view"))) {
    return <div className="p-8 text-red-600">Forbidden: treasury.view</div>;
  }

  const { accountId } = await searchParams;
  const prisma: any = await getTenantClientFromSession();

  const [ledgerRows, banks] = await Promise.all([
    prisma.treasuryLedger.findMany({
      orderBy: { txnDate: "desc" },
      take: 200,
      include: {
        bankAccount: {
          select: { id: true, bankName: true, accountNumber: true, accountType: true },
        },
      },
    }),
    prisma.bankAccount.findMany({
      orderBy: { bankName: "asc" },
      select: { id: true, bankName: true, accountNumber: true, accountType: true },
    }),
  ]);

  // Resolve buyer and plot details for SALE_PAYMENT transactions so raw UUIDs are not shown
  const saleIds: string[] = Array.from(
    new Set(
      ledgerRows
        .filter((r: any) => r.referenceType === "SALE_PAYMENT" && r.referenceId)
        .map((r: any) => r.referenceId as string)
    )
  );
  const salesMap = new Map<string, any>();
  if (saleIds.length > 0) {
    const sales = await prisma.landSale.findMany({
      where: { id: { in: saleIds } },
      select: {
        id: true,
        buyerName: true,
        buyerPhone: true,
        totalAgreedPrice: true,
        currentDueAmount: true,
        status: true,
        plot: {
          select: {
            plotNumber: true,
            project: { select: { projectName: true } },
          },
        },
      },
    });
    for (const s of sales) {
      salesMap.set(s.id, {
        id: s.id,
        buyerName: s.buyerName,
        buyerPhone: s.buyerPhone,
        plotNumber: s.plot?.plotNumber ?? null,
        projectName: s.plot?.project?.projectName ?? null,
        totalAgreedPrice: toNum(s.totalAgreedPrice),
        currentDueAmount: toNum(s.currentDueAmount),
        status: s.status,
      });
    }
  }

  // Resolve expense details if referenceType === "EXPENSE"
  const expenseIds: string[] = Array.from(
    new Set(
      ledgerRows
        .filter((r: any) => r.referenceType === "EXPENSE" && r.referenceId)
        .map((r: any) => r.referenceId as string)
    )
  );
  const expensesMap = new Map<string, any>();
  if (expenseIds.length > 0) {
    const expenses = await prisma.projectExpense.findMany({
      where: { id: { in: expenseIds } },
      select: {
        id: true,
        expenseCategory: true,
        description: true,
        project: { select: { projectName: true } },
      },
    });
    for (const exp of expenses) {
      expensesMap.set(exp.id, {
        id: exp.id,
        expenseCategory: exp.expenseCategory,
        description: exp.description,
        projectName: exp.project?.projectName ?? null,
      });
    }
  }

  const transactions: LedgerTransaction[] = ledgerRows.map((r: any) => {
    const saleInfo = r.referenceType === "SALE_PAYMENT" && r.referenceId ? salesMap.get(r.referenceId) : null;
    const expenseInfo = r.referenceType === "EXPENSE" && r.referenceId ? expensesMap.get(r.referenceId) : null;
    let purpose = r.purpose;
    if (saleInfo) {
      const isAdvance = purpose?.toLowerCase().includes("advance");
      const plotSuffix = saleInfo.plotNumber ? ` (Plot ${saleInfo.plotNumber})` : "";
      purpose = isAdvance
        ? `Plot Advance: ${saleInfo.buyerName}${plotSuffix}`
        : `Installment: ${saleInfo.buyerName}${plotSuffix}`;
    } else if (expenseInfo) {
      purpose = `${expenseInfo.expenseCategory}${expenseInfo.projectName ? ` - ${expenseInfo.projectName}` : ""}`;
    }
    return {
      id: r.id,
      txnDate: new Date(r.txnDate).toISOString(),
      accountType: r.accountType,
      bankAccountId: r.bankAccountId,
      bankName: r.bankAccount?.bankName || null,
      accountNumber: r.bankAccount?.accountNumber || null,
      mfsType: r.bankAccount?.accountType || null,
      flowType: r.flowType as "IN" | "OUT",
      amount: toNum(r.amount),
      purpose,
      referenceType: r.referenceType,
      referenceId: r.referenceId,
      createdBy: r.createdBy,
      saleDetails: saleInfo || null,
      expenseDetails: expenseInfo || null,
    };
  });

  const bankOptions = banks.map((b: any) => ({
    id: b.id,
    name: `${b.bankName} (${b.accountNumber})`,
    type: b.accountType || "BANK",
  }));

  return (
    <div className="p-6">
      <TransactionsClient
        transactions={transactions}
        bankOptions={bankOptions}
        initialAccountId={accountId}
      />
    </div>
  );
}

