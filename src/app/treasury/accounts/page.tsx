import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import AccountsClient, { AccountRow } from "./AccountsClient";

export default async function TreasuryAccountsPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "treasury.bank.manage")) && !(await can(session, "treasury.view"))) {
    return <div className="p-8 text-red-600">Forbidden: treasury.view</div>;
  }

  const prisma: any = await getTenantClientFromSession();
  const accountsRaw = await prisma.bankAccount.findMany({
    include: {
      treasuryLedgers: {
        orderBy: { txnDate: "desc" },
        take: 30,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const accountRows: AccountRow[] = accountsRaw.map((a: any) => ({
    id: a.id,
    accountType: (a.accountType || "BANK") as "BANK" | "MBANKING",
    bankName: a.bankName,
    accountName: a.accountName,
    accountNumber: a.accountNumber,
    branchName: a.branchName,
    routingNumber: a.routingNumber,
    openingBalance: toNum(a.openingBalance),
    currentBalance: toNum(a.currentBalance),
    isActive: a.isActive ?? true,
    transactions: (a.treasuryLedgers || []).map((t: any) => ({
      id: t.id,
      flowType: t.flowType as "IN" | "OUT",
      amount: toNum(t.amount),
      purpose: t.purpose,
      referenceType: t.referenceType,
      txnDate: new Date(t.txnDate).toISOString(),
    })),
  }));

  async function createAccountAction(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "treasury.bank.manage"))) {
      return { error: "Forbidden: treasury.bank.manage" };
    }

    const accountType = (formData.get("accountType") as string) || "BANK";
    const bankName = ((formData.get("bankName") as string) || "").trim();
    const accountName = ((formData.get("accountName") as string) || "").trim() || null;
    const accountNumber = ((formData.get("accountNumber") as string) || "").trim();
    const branchName = ((formData.get("branchName") as string) || "").trim() || null;
    const routingNumber = ((formData.get("routingNumber") as string) || "").trim() || null;
    const openingBalance = parseFloat(formData.get("openingBalance") as string) || 0;

    if (!bankName || !accountNumber) {
      return { error: "Bank/Provider name and account number are required." };
    }

    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const userId = (s!.user as any).id;
    const accountId = randomUUID();

    try {
      await prisma2.$transaction(async (tx: any) => {
        const dup = await tx.bankAccount.findFirst({ where: { accountNumber } });
        if (dup) throw new Error(`Account number "${accountNumber}" is already registered.`);

        const created = await tx.bankAccount.create({
          data: {
            id: accountId,
            accountType,
            bankName,
            accountName,
            accountNumber,
            branchName,
            routingNumber,
            openingBalance,
            currentBalance: openingBalance,
            isActive: true,
          },
        });
        await writeAudit(tx, "bank_accounts", accountId, "CREATE", userId, null, created);

        // If opening balance > 0, log an initial OPENING_BALANCE treasury ledger entry
        if (openingBalance > 0) {
          const ledgerId = randomUUID();
          const ledgerEntry = await tx.treasuryLedger.create({
            data: {
              id: ledgerId,
              txnDate: new Date(),
              accountType: "BANK",
              bankAccountId: accountId,
              flowType: "IN",
              amount: openingBalance,
              purpose: `Initial opening balance for ${bankName} (${accountNumber})`,
              referenceType: "OPENING_BALANCE",
              referenceId: accountId,
              createdBy: userId,
            },
          });
          await writeAudit(tx, "treasury_ledger", ledgerId, "CREATE", userId, null, ledgerEntry);
        }
      });
    } catch (e: any) {
      return { error: e.message || "Failed to create account" };
    }

    revalidatePath("/treasury");
    revalidatePath("/treasury/accounts");
    revalidatePath("/treasury/dashboard");
    revalidatePath("/treasury/transactions");
    return { success: true };
  }

  async function updateAccountAction(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "treasury.bank.manage"))) {
      return { error: "Forbidden: treasury.bank.manage" };
    }

    const id = ((formData.get("id") as string) || "").trim();
    const accountType = (formData.get("accountType") as string) || "BANK";
    const bankName = ((formData.get("bankName") as string) || "").trim();
    const accountName = ((formData.get("accountName") as string) || "").trim() || null;
    const accountNumber = ((formData.get("accountNumber") as string) || "").trim();
    const branchName = ((formData.get("branchName") as string) || "").trim() || null;
    const routingNumber = ((formData.get("routingNumber") as string) || "").trim() || null;
    const isActiveRaw = formData.get("isActive");
    const isActive = isActiveRaw !== null ? isActiveRaw === "true" || isActiveRaw === "on" : true;

    if (!id || !bankName || !accountNumber) {
      return { error: "ID, bank name, and account number are required." };
    }

    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const userId = (s!.user as any).id;

    try {
      await prisma2.$transaction(async (tx: any) => {
        const prev = await tx.bankAccount.findUnique({ where: { id } });
        if (!prev) throw new Error("Account not found");

        // CRITICAL: Opening balance is NOT modified to preserve ledger integrity!
        const updated = await tx.bankAccount.update({
          where: { id },
          data: {
            accountType,
            bankName,
            accountName,
            accountNumber,
            branchName,
            routingNumber,
            isActive,
          },
        });
        await writeAudit(tx, "bank_accounts", id, "UPDATE", userId, prev, updated);
      });
    } catch (e: any) {
      return { error: e.message || "Failed to update account" };
    }

    revalidatePath("/treasury");
    revalidatePath("/treasury/accounts");
    revalidatePath("/treasury/dashboard");
    revalidatePath("/treasury/transactions");
    return { success: true };
  }

  async function toggleStatusAction(id: string, nextStatus: boolean) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "treasury.bank.manage"))) {
      return { error: "Forbidden: treasury.bank.manage" };
    }

    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const userId = (s!.user as any).id;

    try {
      await prisma2.$transaction(async (tx: any) => {
        const prev = await tx.bankAccount.findUnique({ where: { id } });
        if (!prev) throw new Error("Account not found");

        const updated = await tx.bankAccount.update({
          where: { id },
          data: { isActive: nextStatus },
        });
        await writeAudit(tx, "bank_accounts", id, "UPDATE", userId, prev, updated);
      });
    } catch (e: any) {
      return { error: e.message || "Failed to update status" };
    }

    revalidatePath("/treasury");
    revalidatePath("/treasury/accounts");
    revalidatePath("/treasury/dashboard");
    revalidatePath("/treasury/transactions");
    return { success: true };
  }

  return (
    <div className="p-6">
      <AccountsClient
        accounts={accountRows}
        createAction={createAccountAction}
        updateAction={updateAccountAction}
        toggleStatusAction={toggleStatusAction}
      />
    </div>
  );
}

