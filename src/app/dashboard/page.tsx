import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum, formatDate } from "@/lib/format";
import {
  getCashBalance,
  getBankBalances,
  getUnsoldInventoryValue,
  getReceivables,
  getSalesThisMonth,
  getSalesThisYear,
  getRecentTreasuryLedger,
} from "@/lib/reports/dashboard";
import DashboardCharts from "./Charts";
import Tiles from "./Tiles";
import T from "@/components/T";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "dashboard.view"))) {
    return <div className="p-8 text-red-600 font-semibold">Forbidden: You do not have permission to view the dashboard.</div>;
  }
  const prisma: any = await getTenantClientFromSession();

  const [cashBalance, bankBalances, unsoldValue, receivables, salesMonth, salesYear, projects, expenses, ledger] = await Promise.all([
    getCashBalance(prisma),
    getBankBalances(prisma),
    getUnsoldInventoryValue(prisma),
    getReceivables(prisma),
    getSalesThisMonth(prisma),
    getSalesThisYear(prisma),
    prisma.landProject.findMany(),
    prisma.projectExpense.findMany({ where: { status: "APPROVED" } }),
    getRecentTreasuryLedger(prisma, 5),
  ]);

  const totalBankBalance = bankBalances.reduce((s: number, b: any) => s + b.balance, 0);

  const costByProject = projects.map((p: any) => {
    const directCost = toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost);
    const projExpenses = expenses
      .filter((e: any) => e.projectId === p.id)
      .reduce((s: number, e: any) => s + toNum(e.amount), 0);
    return {
      name: p.projectName.length > 15 ? p.projectName.slice(0, 15) + "..." : p.projectName,
      cost: directCost + projExpenses,
    };
  });

  const tiles = [
    { key: "cashBalance", value: cashBalance },
    { key: "bankBalance", value: totalBankBalance },
    { key: "unsoldInventory", value: unsoldValue },
    { key: "receivables", value: receivables },
    { key: "salesMonth", value: salesMonth },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            <T k="dashboard" />
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time syndicate overview & financial metrics
          </p>
        </div>
        <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
          Live Data
        </div>
      </div>

      <Tiles tiles={tiles} />
      <DashboardCharts costByProject={costByProject} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 text-base">
            Recent Treasury Ledger ({ledger.length})
          </h2>
          <span className="text-xs text-gray-400">Latest recorded transactions</span>
        </div>
        {ledger.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No treasury entries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Purpose</th>
                  <th className="pb-3 font-medium">Flow</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ledger.map((l: any) => (
                  <tr key={l.id} className="hover:bg-gray-50/75 transition-colors">
                    <td className="py-3 font-mono text-gray-600 whitespace-nowrap">
                      <span>{formatDate(l.txnDate)}</span>
                      {l.isFutureDated && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                          Future Dated
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-gray-900 font-medium">{l.purpose}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          l.flowType === "IN"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {l.flowType}
                      </span>
                    </td>
                    <td
                      className={`py-3 font-mono font-semibold text-right tabular-nums ${
                        l.flowType === "IN" ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {l.flowType === "OUT" ? "-" : "+"}
                      {formatBDT(toNum(l.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
