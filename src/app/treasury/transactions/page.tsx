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

  const transactions: LedgerTransaction[] = ledgerRows.map((r: any) => ({
    id: r.id,
    txnDate: new Date(r.txnDate).toISOString(),
    accountType: r.accountType,
    bankAccountId: r.bankAccountId,
    bankName: r.bankAccount?.bankName || null,
    accountNumber: r.bankAccount?.accountNumber || null,
    mfsType: r.bankAccount?.accountType || null,
    flowType: r.flowType as "IN" | "OUT",
    amount: toNum(r.amount),
    purpose: r.purpose,
    referenceType: r.referenceType,
    referenceId: r.referenceId,
    createdBy: r.createdBy,
  }));

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

