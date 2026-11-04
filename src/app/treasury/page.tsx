import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum, formatDate } from "@/lib/format";
import { createContra, listContraRequests, approveContra } from "@/lib/treasury";
import Link from "next/link";
import {
  Wallet,
  Building2,
  Smartphone,
  ArrowRight,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
  Layers,
} from "lucide-react";
import ContraTransferForm from "./ContraTransferForm";

export default async function TreasuryPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "treasury.view"))) return <div className="p-8 text-red-600">Forbidden: treasury.view</div>;

  const prisma: any = await getTenantClientFromSession();
  const [cashLedger, banks, pendingAudit, recentContras] = await Promise.all([
    prisma.treasuryLedger.findMany({ where: { accountType: "CASH" }, orderBy: { txnDate: "desc" }, take: 15 }),
    prisma.bankAccount.findMany({ orderBy: { bankName: "asc" } }),
    listContraRequests(prisma),
    prisma.treasuryLedger.findMany({
      where: { referenceType: "CONTRA" },
      orderBy: { txnDate: "desc" },
      take: 10,
      include: {
        bankAccount: { select: { bankName: true, accountNumber: true, accountType: true } },
      },
    }),
  ]);

  const pending = pendingAudit.filter((r: any) => r.action === "PENDING");
  const canApprove = await can(session, "treasury.contra.approve");
  const canCreateContra = await can(session, "treasury.contra.create");

  // Calculate physical cash balance
  const allCash = await prisma.treasuryLedger.findMany({ where: { accountType: "CASH" }, select: { flowType: true, amount: true } });
  let cashBalance = 0;
  for (const r of allCash) {
    const a = toNum(r.amount);
    if (r.flowType === "IN") cashBalance += a;
    else if (r.flowType === "OUT") cashBalance -= a;
  }

  const totalBankBalance = banks.reduce((s: number, b: any) => (b.isActive ? s + toNum(b.currentBalance) : s), 0);
  const totalLiquidity = cashBalance + totalBankBalance;

  async function submitContra(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!(await canFn(s, "treasury.contra.create"))) throw new Error("Forbidden: treasury.contra.create");
    const canApprove = await canFn(s, "treasury.contra.approve");
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
      role: canApprove ? "super_admin" : "accountant",
    });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/treasury");
    revalidatePath("/treasury/dashboard");
    revalidatePath("/treasury/transactions");
    revalidatePath("/treasury/approvals");
  }

  async function approveContraAction(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!(await canFn(s, "treasury.contra.approve"))) throw new Error("Forbidden: treasury.contra.approve");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { approveContra: ap } = await import("@/lib/treasury");
    const p: any = await gc();
    await ap(p, { requestId: formData.get("requestId") as string, approverId: (s!.user as any).id, approverRole: "super_admin" });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/treasury");
    revalidatePath("/treasury/dashboard");
    revalidatePath("/treasury/transactions");
    revalidatePath("/treasury/approvals");
  }

  async function createBankAccount(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!(await canFn(s, "treasury.bank.manage"))) throw new Error("Forbidden: treasury.bank.manage");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { writeAudit } = await import("@/lib/tenantRules");
    const { randomUUID } = await import("crypto");
    const p: any = await gc();
    const id = randomUUID();
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const branchName = (formData.get("branchName") as string) || null;
    const accountType = (formData.get("accountType") as string) || "BANK";
    const openingBalance = parseFloat(formData.get("openingBalance") as string) || 0;
    const dup = await p.bankAccount.findFirst({ where: { accountNumber } });
    if (dup) throw new Error("Account number already exists");
    await p.$transaction(async (tx: any) => {
      const b = await tx.bankAccount.create({
        data: {
          id,
          accountType,
          bankName,
          accountNumber,
          branchName,
          openingBalance,
          currentBalance: openingBalance,
          isActive: true,
        },
      });
      await writeAudit(tx, "bank_accounts", id, "CREATE", (s!.user as any).id, null, b);
    });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/treasury");
    revalidatePath("/treasury/accounts");
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Treasury (Cash & Contra)</h1>
          <p className="text-sm text-slate-500">
            Manage physical vault cash, execute contra fund movements, and reconcile accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/treasury/dashboard"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-2xs transition"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" /> Analytics Dashboard
          </Link>
          <Link
            href="/treasury/accounts"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Building2 className="w-4 h-4" /> Bank & MFS Accounts
          </Link>
        </div>
      </div>

      {/* Module Sub-features Shortcuts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/treasury/dashboard"
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Overview & Analytics</span>
            <span className="text-[11px] text-slate-400">Charts & Trends</span>
          </div>
        </Link>

        <Link
          href="/treasury/accounts"
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Bank & MFS Accounts</span>
            <span className="text-[11px] text-slate-400">{banks.length} Accounts Opened</span>
          </div>
        </Link>

        <Link
          href="/treasury/transactions"
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <History className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Ledger Transactions</span>
            <span className="text-[11px] text-slate-400">Full Audit History</span>
          </div>
        </Link>

        <Link
          href="/treasury/approvals"
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Transfer Approvals</span>
            <span className="text-[11px] text-amber-700 font-semibold">{pending.length} Pending</span>
          </div>
        </Link>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Physical Cash in Hand</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-700">{formatBDT(cashBalance)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Ready cash vault reserves</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Bank & MFS Balances</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-blue-900">{formatBDT(totalBankBalance)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across all active accounts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Net Syndicate Liquidity</span>
            <span className="p-1.5 bg-teal-50 text-teal-700 rounded-md">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{formatBDT(totalLiquidity)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Immediate available capital</p>
        </div>
      </div>

      {/* Contra Transfer Execution Section */}
      <ContraTransferForm
        banks={banks.filter((b: any) => b.isActive).map((b: any) => ({
          id: b.id,
          bankName: b.bankName,
          accountNumber: b.accountNumber,
          accountType: b.accountType,
          currentBalance: toNum(b.currentBalance),
        }))}
        cashBalance={cashBalance}
        canApprove={canApprove}
        submitAction={submitContra}
      />

      {/* Pending Approvals Section (if any) */}
      {pending.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Contra Transfer Approvals ({pending.length})
            </h2>
            <Link href="/treasury/approvals" className="text-xs font-semibold text-amber-700 hover:underline">
              View Approvals Hub →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-amber-50 text-amber-900 border-b border-amber-100 text-xs uppercase">
                <tr>
                  <th className="p-3">Requested</th>
                  <th>Route</th>
                  <th>Purpose</th>
                  <th className="text-right">Amount</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {pending.map((r: any) => (
                  <tr key={r.recordId} className="hover:bg-amber-50/40">
                    <td className="p-3 text-xs font-mono text-slate-500">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="text-xs font-semibold text-slate-800">
                      {r.newValues?.fromType} → {r.newValues?.toType}
                    </td>
                    <td className="text-xs text-slate-700">{r.newValues?.purpose}</td>
                    <td className="text-right font-mono font-bold text-xs text-slate-900">
                      {formatBDT(Number(r.newValues?.amount || 0))}
                    </td>
                    <td className="p-3 text-right">
                      {canApprove ? (
                        <form action={approveContraAction} className="inline">
                          <input type="hidden" name="requestId" value={r.recordId} />
                          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold shadow-2xs transition">
                            Approve
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-amber-700 font-medium">Awaiting approval</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Cash in Hand Activity Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Cash in Hand Movements</h2>
            <p className="text-xs text-slate-500">Latest physical cash inflows and outflows</p>
          </div>
          <Link href="/treasury/transactions?accountId=CASH" className="text-xs font-semibold text-blue-600 hover:underline">
            View All Cash Transactions →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Date</th>
                <th>Flow</th>
                <th>Purpose / Description</th>
                <th>Reference</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cashLedger.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No cash in hand transactions recorded yet.
                  </td>
                </tr>
              )}
              {cashLedger.map((r: any) => {
                const isInflow = r.flowType === "IN";
                return (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-xs font-mono text-slate-500 whitespace-nowrap">{formatDate(r.txnDate)}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isInflow ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {isInflow ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {isInflow ? "INFLOW" : "OUTFLOW"}
                      </span>
                    </td>
                    <td className="text-xs text-slate-700 font-medium">{r.purpose}</td>
                    <td className="text-xs font-mono text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                        {r.referenceType}
                      </span>
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-bold text-xs ${
                        isInflow ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {isInflow ? "+" : "-"}
                      {formatBDT(toNum(r.amount))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
