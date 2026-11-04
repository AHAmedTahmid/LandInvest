import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { formatBDT, toNum, formatDate } from "@/lib/format";
import Link from "next/link";
import {
  Wallet,
  Building2,
  Smartphone,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  History,
  CheckCircle2,
  Clock,
  Plus,
  ArrowLeftRight,
} from "lucide-react";
import {
  AccountDistributionDonut,
  CashFlowTrendBarChart,
} from "@/components/treasury/TreasuryDashboardCharts";

export default async function TreasuryDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "treasury.view"))) {
    return <div className="p-8 text-red-600">Forbidden: treasury.view</div>;
  }

  const prisma: any = await getTenantClientFromSession();

  const [cashLedger, banks, recentLedger, pendingAuditRows] = await Promise.all([
    prisma.treasuryLedger.findMany({
      where: { accountType: "CASH" },
      select: { flowType: true, amount: true },
    }),
    prisma.bankAccount.findMany({
      orderBy: { currentBalance: "desc" },
    }),
    prisma.treasuryLedger.findMany({
      take: 10,
      orderBy: { txnDate: "desc" },
      include: {
        bankAccount: {
          select: { bankName: true, accountNumber: true, accountType: true },
        },
      },
    }),
    prisma.auditLog.findMany({
      where: {
        tableName: "treasury_transfer_requests",
        action: { in: ["CREATE", "UPDATE"] },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  // Compute Cash in Hand balance
  let cashBalance = 0;
  for (const row of cashLedger) {
    const amt = toNum(row.amount);
    if (row.flowType === "IN") cashBalance += amt;
    else if (row.flowType === "OUT") cashBalance -= amt;
  }

  // Compute Total Bank Balances
  let totalBankBalance = 0;
  let totalMfsBalance = 0;
  for (const b of banks) {
    if (!b.isActive) continue;
    const bal = toNum(b.currentBalance);
    if (b.accountType === "MBANKING") {
      totalMfsBalance += bal;
    } else {
      totalBankBalance += bal;
    }
  }

  const totalLiquidity = cashBalance + totalBankBalance + totalMfsBalance;

  // Compute pending contra transfers count
  const byId = new Map<string, any>();
  for (const r of [...pendingAuditRows].reverse()) {
    const cur = byId.get(r.recordId) ?? { action: "PENDING" };
    if (r.action === "CREATE") cur.action = "PENDING";
    if (r.action === "UPDATE") cur.action = "APPROVED";
    byId.set(r.recordId, cur);
  }
  const pendingCount = Array.from(byId.values()).filter((r) => r.action === "PENDING").length;

  // Account Distribution Data for Donut Chart
  const accountShares = [
    { name: "Cash in Hand", type: "CASH", balance: Math.max(0, cashBalance) },
    ...banks
      .filter((b: any) => b.isActive)
      .map((b: any) => ({
        name: `${b.bankName} (${b.accountNumber.slice(-4)})`,
        type: b.accountType || "BANK",
        balance: toNum(b.currentBalance),
      })),
  ];

  // Monthly flow trends (last 6 months)
  const monthMap = new Map<string, { inflow: number; outflow: number }>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthMap.set(key, { inflow: 0, outflow: 0 });
  }

  const allTxnsForTrend = await prisma.treasuryLedger.findMany({
    select: { txnDate: true, flowType: true, amount: true },
    where: {
      txnDate: {
        gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
      },
    },
  });

  for (const t of allTxnsForTrend) {
    const d = new Date(t.txnDate);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    if (monthMap.has(key)) {
      const entry = monthMap.get(key)!;
      const amt = toNum(t.amount);
      if (t.flowType === "IN") entry.inflow += amt;
      else entry.outflow += amt;
    }
  }

  const monthlyFlows = Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    inflow: data.inflow,
    outflow: data.outflow,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cash & Bank Ledger — Overview</h1>
          <p className="text-sm text-slate-500">
            Real-time liquidity monitoring, physical cash in hand, bank accounts, and mobile banking balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/treasury"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <ArrowLeftRight className="w-4 h-4" /> Contra Transfer
          </Link>
          <Link
            href="/treasury/accounts"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Account
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Liquidity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Liquidity</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 tracking-tight">{formatBDT(totalLiquidity)}</p>
          <p className="text-xs text-slate-500 mt-1">Cash in hand + all bank & MFS balances</p>
        </div>

        {/* Physical Cash in Hand */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full -mr-8 -mt-8 -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cash in Hand</span>
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-teal-800 tracking-tight">{formatBDT(cashBalance)}</p>
          <p className="text-xs text-slate-500 mt-1">Physical syndicate treasury cash</p>
        </div>

        {/* Commercial Bank Accounts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commercial Banks</span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-blue-900 tracking-tight">{formatBDT(totalBankBalance)}</p>
          <p className="text-xs text-slate-500 mt-1">
            {banks.filter((b: any) => b.accountType !== "MBANKING" && b.isActive).length} Active bank accounts
          </p>
        </div>

        {/* Mobile Banking (MFS) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-8 -mt-8 -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Banking (MFS)</span>
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-purple-900 tracking-tight">{formatBDT(totalMfsBalance)}</p>
          <p className="text-xs text-slate-500 mt-1">
            {banks.filter((b: any) => b.accountType === "MBANKING" && b.isActive).length} MFS accounts (bKash/Nagad)
          </p>
        </div>
      </div>

      {/* Pending Approvals Notice Banner (if any) */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                {pendingCount} Contra Transfer Request{pendingCount > 1 ? "s" : ""} Pending Approval
              </p>
              <p className="text-xs text-amber-700">
                Transfers submitted by accountants require approval before funds are settled into the destination account.
              </p>
            </div>
          </div>
          <Link
            href="/treasury/approvals"
            className="text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition shrink-0"
          >
            Review Approvals →
          </Link>
        </div>
      )}

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Account Liquidity Share Donut */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Account Distribution</h2>
              <p className="text-xs text-slate-500">Liquidity share across cash and designated accounts</p>
            </div>
          </div>
          <AccountDistributionDonut data={accountShares} />
        </div>

        {/* Monthly Cash Flows Bar Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cash Flow Trends</h2>
              <p className="text-xs text-slate-500">Monthly gross inflows vs outflows (last 6 months)</p>
            </div>
          </div>
          <CashFlowTrendBarChart data={monthlyFlows} />
        </div>
      </div>

      {/* Accounts Summary Cards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Treasury Accounts Summary</h2>
            <p className="text-xs text-slate-500">All registered bank accounts, MFS wallets, and physical cash</p>
          </div>
          <Link href="/treasury/accounts" className="text-xs font-semibold text-blue-600 hover:underline">
            Manage All Accounts →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Physical Cash Card */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-700" /> Physical Cash
              </span>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xl font-bold font-mono text-emerald-800">{formatBDT(cashBalance)}</p>
            <p className="text-[11px] text-slate-500">Vault & On-hand cash</p>
            <div className="pt-2 border-t border-emerald-100">
              <Link href="/treasury" className="text-xs font-semibold text-emerald-700 hover:underline">
                Transfer via Contra →
              </Link>
            </div>
          </div>

          {/* Bank & MFS Account Cards */}
          {banks.map((b: any) => {
            const isMfs = b.accountType === "MBANKING";
            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border space-y-2 ${
                  !b.isActive
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : isMfs
                    ? "bg-purple-50/40 border-purple-200"
                    : "bg-blue-50/40 border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isMfs ? "text-purple-900" : "text-blue-900"
                    }`}
                  >
                    {isMfs ? <Smartphone className="w-4 h-4 text-purple-600" /> : <Building2 className="w-4 h-4 text-blue-600" />}
                    {b.bankName}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      !b.isActive
                        ? "bg-slate-200 text-slate-700"
                        : isMfs
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {isMfs ? "MFS" : "Bank"}
                  </span>
                </div>
                <p
                  className={`text-xl font-bold font-mono ${
                    isMfs ? "text-purple-900" : "text-blue-900"
                  }`}
                >
                  {formatBDT(toNum(b.currentBalance))}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Acct: {b.accountNumber} {b.branchName ? `(${b.branchName})` : ""}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <Link
                    href={`/treasury/transactions?accountId=${b.id}`}
                    className="text-slate-600 hover:text-blue-600"
                  >
                    View Ledger
                  </Link>
                  <Link href="/treasury" className="text-blue-600 hover:underline">
                    Transfer
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Ledger Transactions Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Treasury Movements</h2>
            <p className="text-xs text-slate-500">Latest inflows, outflows, and transfers across all accounts</p>
          </div>
          <Link href="/treasury/transactions" className="text-xs font-semibold text-blue-600 hover:underline">
            View Full Transaction History →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Date</th>
                <th>Account</th>
                <th>Flow</th>
                <th>Purpose / Description</th>
                <th>Reference</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLedger.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
              {recentLedger.map((r: any) => {
                const isInflow = r.flowType === "IN";
                const acctLabel =
                  r.accountType === "CASH"
                    ? "Cash in Hand"
                    : `${r.bankAccount?.bankName || "Bank"} (..${(r.bankAccount?.accountNumber || "").slice(-4)})`;

                return (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-xs font-mono text-slate-500">{formatDate(r.txnDate)}</td>
                    <td className="text-xs font-medium text-slate-800">{acctLabel}</td>
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
                    <td className="text-xs text-slate-500 font-mono">{r.referenceType}</td>
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

