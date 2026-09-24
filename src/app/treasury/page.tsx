import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT } from "@/lib/format";
import { createContra, listContraRequests } from "@/lib/treasury";

export default async function TreasuryPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!can(role, "bankTransfer")) return <div className="p-8 text-red-600">Forbidden: bankTransfer</div>;

  const prisma: any = await getTenantClientFromSession();
  const cashLedger = await prisma.treasuryLedger.findMany({ where: { accountType: "CASH" }, orderBy: { txnDate: "desc" } });
  const banks = await prisma.bankAccount.findMany();
  const bankLedger = await prisma.treasuryLedger.findMany({ where: { accountType: "BANK" }, orderBy: { txnDate: "desc" } });
  const pending = (await listContraRequests(prisma)).filter((r: any) => r.action === "PENDING");
  const canApprove = can(role, "approveExpense");

  async function submitContra(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    const r = (s!.user as any).role;
    if (!canFn(r, "bankTransfer")) throw new Error("Forbidden: bankTransfer");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { createContra: cc } = await import("@/lib/treasury");
    const p: any = await gc();
    await cc(p, {
      fromType: formData.get("fromType") as any,
      toType: formData.get("toType") as any,
      amount: parseFloat(formData.get("amount") as string),
      bankAccountId: (formData.get("bankAccountId") as string) || null,
      purpose: (formData.get("purpose") as string) || "Contra",
      userId: (s!.user as any).id,
      role: r,
    });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/treasury");
  }

  async function approveContraAction(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    const r = (s!.user as any).role;
    if (!canFn(r, "approveExpense")) throw new Error("Forbidden: approval requires super_admin / managing_partner");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { approveContra: ap } = await import("@/lib/treasury");
    const p: any = await gc();
    await ap(p, { requestId: formData.get("requestId") as string, approverId: (s!.user as any).id, approverRole: r });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/treasury");
  }

  async function createBankAccount(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    const r = (s!.user as any).role;
    if (!canFn(r, "bankTransfer")) throw new Error("Forbidden: bankTransfer");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { writeAudit } = await import("@/lib/tenantRules");
    const { randomUUID } = await import("crypto");
    const p: any = await gc();
    const id = randomUUID();
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const branchName = (formData.get("branchName") as string) || null;
    const dup = await p.bankAccount.findFirst({ where: { accountNumber } });
    if (dup) throw new Error("Account number already exists");
    await p.$transaction(async (tx: any) => {
      const b = await tx.bankAccount.create({ data: { id, bankName, accountNumber, branchName } });
      await writeAudit(tx, "bank_accounts", id, "CREATE", (s!.user as any).id, null, b);
    });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/treasury");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Treasury</h1>
      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold">Cash Ledger (CASH)</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="p-1 text-left">Date</th><th className="text-left">Purpose</th><th className="text-left">Flow</th><th className="text-left">Amount</th></tr></thead>
          <tbody>{cashLedger.map((r: any) => <tr key={r.id} className="border-b"><td className="p-1">{new Date(r.txnDate).toLocaleDateString()}</td><td>{r.purpose}</td><td>{r.flowType}</td><td>{formatBDT(Number(r.amount))}</td></tr>)}</tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold">Bank Accounts</h2>
        <form action={createBankAccount} className="flex gap-2 mb-2">
          <input name="bankName" placeholder="Bank Name" required className="border rounded px-2 py-1" />
          <input name="accountNumber" placeholder="Account No" required className="border rounded px-2 py-1" />
          <input name="branchName" placeholder="Branch" className="border rounded px-2 py-1" />
          <button className="bg-blue-600 text-white px-3 rounded">Create</button>
        </form>
        <ul>{banks.map((b: any) => <li key={b.id}>{b.bankName} - {b.accountNumber} : {formatBDT(Number(b.currentBalance))}</li>)}</ul>
        <h3 className="font-semibold mt-4">Bank Ledger</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left">Purpose</th><th className="text-left">Flow</th><th className="text-left">Amount</th></tr></thead>
          <tbody>{bankLedger.map((r: any) => <tr key={r.id} className="border-b"><td>{r.purpose}</td><td>{r.flowType}</td><td>{formatBDT(Number(r.amount))}</td></tr>)}</tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold">Contra Transfer CASH&lt;-&gt;BANK</h2>
        <form action={submitContra} className="grid grid-cols-4 gap-2">
          <select name="fromType" className="border rounded px-2 py-1"><option>CASH</option><option>BANK</option></select>
          <select name="toType" className="border rounded px-2 py-1"><option>BANK</option><option>CASH</option></select>
          <select name="bankAccountId" className="border rounded px-2 py-1"><option value="">Bank</option>{banks.map((b: any) => <option key={b.id} value={b.id}>{b.bankName}</option>)}</select>
          <input name="amount" type="number" step="0.01" placeholder="Amount" required className="border rounded px-2 py-1" />
          <input name="purpose" placeholder="Purpose" className="border rounded px-2 py-1 col-span-3" />
          <button className="bg-emerald-600 text-white rounded px-4 py-2">Transfer</button>
        </form>
        {role === "accountant" && <p className="text-xs text-amber-600 mt-2">Note: accountant transfers are submitted for approval.</p>}
      </div>

      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold">Pending Transfer Approvals</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-500">None</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left">Requested</th><th className="text-left">Details</th><th className="text-left">Action</th></tr></thead>
            <tbody>
              {pending.map((r: any) => (
                <tr key={r.recordId} className="border-b">
                  <td className="p-1">{new Date(r.createdAt).toLocaleString()}</td>
                  <td>{r.newValues?.fromType} -&gt; {r.newValues?.toType} {formatBDT(Number(r.newValues?.amount || 0))} ({r.newValues?.purpose})</td>
                  <td>{canApprove ? <form action={approveContraAction}><input type="hidden" name="requestId" value={r.recordId} /><button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Approve</button></form> : "Awaiting approval"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
