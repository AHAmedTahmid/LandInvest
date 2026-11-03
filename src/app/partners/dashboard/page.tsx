import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { formatBDT, toNum, formatDate } from "@/lib/format";
import Link from "next/link";
import { Users, TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, PlusCircle } from "lucide-react";
import { PartnerEquityDonut, CapitalHistoryBarChart } from "@/components/partners/PartnersDashboardCharts";

export default async function PartnersDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "partners.view")) && !(await can(session, "partners.manage"))) {
    return <div className="p-8 text-red-600">Forbidden: partners.view</div>;
  }

  const prisma: any = await getTenantClientFromSession();
  const [partners, projects, recentTxs, allDeposits] = await Promise.all([
    prisma.partner.findMany({
      include: {
        partnerTransactions: true,
        projectPartners: {
          include: { project: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.landProject.findMany({
      select: { id: true, projectName: true, purchasePrice: true, status: true },
    }),
    prisma.partnerTransaction.findMany({
      take: 10,
      orderBy: { txnDate: "desc" },
      include: { partner: { select: { id: true, name: true, phone: true } } },
    }),
    prisma.partnerTransaction.findMany({
      where: { txnType: "DEPOSIT" },
      orderBy: { txnDate: "asc" },
      select: { amount: true, txnDate: true },
    }),
  ]);

  // Aggregate metrics
  let totalOpening = 0;
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let totalProfitCredits = 0;
  let totalDirectExpenses = 0;

  const partnerSummaries = partners.map((p: any) => {
    const opening = toNum(p.openingBalance);
    totalOpening += opening;

    let pDeposits = 0;
    let pWithdrawals = 0;
    let pProfits = 0;
    let pDirectExpenses = 0;

    for (const t of p.partnerTransactions || []) {
      const amt = toNum(t.amount);
      if (t.txnType === "DEPOSIT") pDeposits += amt;
      else if (t.txnType === "WITHDRAWAL") pWithdrawals += amt;
      else if (t.txnType === "PROFIT_CREDIT") pProfits += amt;
      else if (t.txnType === "DIRECT_EXPENSE") pDirectExpenses += amt;
    }

    totalDeposits += pDeposits;
    totalWithdrawals += pWithdrawals;
    totalProfitCredits += pProfits;
    totalDirectExpenses += pDirectExpenses;

    const totalInjected = opening + pDeposits + pDirectExpenses;
    const liveBalance = totalInjected + pProfits - pWithdrawals;

    return {
      id: p.id,
      name: p.name,
      phone: p.phone,
      nidNumber: p.nidNumber,
      opening,
      totalInjected,
      liveBalance,
      profitsEarned: pProfits,
      projectsCount: p.projectPartners?.length || 0,
    };
  });

  const totalInjectedEquity = totalOpening + totalDeposits + totalDirectExpenses;
  const totalLiveCapital = totalInjectedEquity + totalProfitCredits - totalWithdrawals;
  const totalCapitalDeployed = projects.reduce((sum: number, pr: any) => sum + toNum(pr.purchasePrice), 0);

  // Partner equity donut data
  const equityDonutData = partnerSummaries.map((p: any) => ({
    name: p.name,
    value: p.totalInjected,
  }));

  // Monthly deposit trend (group by YYYY-MM)
  const monthlyMap = new Map<string, number>();
  for (const dep of allDeposits) {
    const d = new Date(dep.txnDate);
    const m = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthlyMap.set(m, (monthlyMap.get(m) || 0) + toNum(dep.amount));
  }
  const monthlyTrendData = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
    month,
    amount,
  }));

  // Top partners sorted by live balance
  const topPartners = [...partnerSummaries].sort((a, b) => b.liveBalance - a.liveBalance);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partners & Capital Overview</h1>
          <p className="text-sm text-slate-500">
            Real-time equity analytics, capital injections, and live partner balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/partners/capital"
            className="flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> Add Capital / Investment
          </Link>
          <Link
            href="/partners"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Users className="w-4 h-4 text-slate-500" /> Manage Partners
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Partners</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{partners.length}</p>
          <p className="text-xs text-slate-400 mt-1">Registered syndicate partners</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Equity Injected</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{formatBDT(totalInjectedEquity)}</p>
          <p className="text-xs text-slate-400 mt-1">Opening balances + new funds</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Capital Deployed</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">{formatBDT(totalCapitalDeployed)}</p>
          <p className="text-xs text-slate-400 mt-1">Invested across land projects</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Live Balance</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatBDT(totalLiveCapital)}</p>
          <p className="text-xs text-slate-400 mt-1">Current combined partner equity</p>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
            Partner Equity Share Distribution
          </h2>
          <PartnerEquityDonut data={equityDonutData} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
            Capital Injections Trend (Monthly)
          </h2>
          <CapitalHistoryBarChart data={monthlyTrendData} />
        </div>
      </div>

      {/* Partners Standing & Balances Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Partners Directory & Live Balances
          </h2>
          <Link href="/partners" className="text-xs text-blue-600 hover:underline font-medium">
            View All & Edit →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Partner Name</th>
                <th>Phone</th>
                <th className="text-right">Opening Balance</th>
                <th className="text-right">Total Injected</th>
                <th className="text-right">Profits Credited</th>
                <th className="text-right">Live Current Balance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topPartners.map((p) => {
                const sharePct = totalInjectedEquity > 0 ? (p.totalInjected / totalInjectedEquity) * 100 : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-400">Equity Share: {sharePct.toFixed(1)}%</div>
                    </td>
                    <td className="text-slate-600 text-xs">{p.phone}</td>
                    <td className="text-right text-slate-600 text-xs font-mono">{formatBDT(p.opening)}</td>
                    <td className="text-right text-emerald-700 font-semibold font-mono text-xs">
                      {formatBDT(p.totalInjected)}
                    </td>
                    <td className="text-right text-blue-600 text-xs font-mono">
                      {p.profitsEarned > 0 ? formatBDT(p.profitsEarned) : "-"}
                    </td>
                    <td className="text-right">
                      <span className="font-bold font-mono text-slate-900 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-xs">
                        {formatBDT(p.liveBalance)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/partners/capital?partnerId=${p.id}`}
                        className="text-xs font-semibold text-emerald-700 hover:underline bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200"
                      >
                        + Add Fund
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Capital Movements */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Recent Capital Transactions
          </h2>
          <Link href="/reports/partner-capital" className="text-xs text-blue-600 hover:underline font-medium">
            Full Statement Report →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Date</th>
                <th>Partner</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th>Notes / Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTxs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No capital transactions recorded yet.
                  </td>
                </tr>
              )}
              {recentTxs.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-3 text-xs text-slate-500 font-mono">{formatDate(t.txnDate)}</td>
                  <td className="font-medium text-slate-900">{t.partner?.name || "Partner"}</td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        t.txnType === "DEPOSIT"
                          ? "bg-emerald-100 text-emerald-800"
                          : t.txnType === "PROFIT_CREDIT"
                          ? "bg-blue-100 text-blue-800"
                          : t.txnType === "DIRECT_EXPENSE"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {t.txnType === "DEPOSIT" && <ArrowDownLeft className="w-3 h-3" />}
                      {t.txnType === "WITHDRAWAL" && <ArrowUpRight className="w-3 h-3" />}
                      {t.txnType}
                    </span>
                  </td>
                  <td className="text-right font-mono font-semibold text-slate-900 text-xs">
                    {formatBDT(toNum(t.amount))}
                  </td>
                  <td className="text-xs text-slate-500">{t.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
