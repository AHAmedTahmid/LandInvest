import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum } from "@/lib/format";
import { getCashBalance, getBankBalances, getUnsoldInventoryValue, getReceivables, getSalesThisMonth, getSalesThisYear } from "@/lib/reports/dashboard";
import DashboardCharts from "./Charts";
import Tiles from "./Tiles";
import T from "@/components/T";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "dashboard.view"))) return <div className="p-8 text-red-600">Forbidden: viewDashboard</div>;
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
    prisma.treasuryLedger.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { bankAccount: true } }),
  ]);

  const totalBankBalance = bankBalances.reduce((s: number, b: any) => s + b.balance, 0);
  const totalLandCost = projects.reduce((s: number, p: any) => s + toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost), 0);
  const totalExpenses = expenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);
  const netPnL = salesYear - totalLandCost - totalExpenses;

  const costByProject = projects.map((p: any) => ({
    name: p.projectName.slice(0, 12),
    cost: toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost) + expenses.filter((e: any) => e.projectId === p.id).reduce((s: number, e: any) => s + toNum(e.amount), 0),
  }));

  const tiles = [
    { key: "cashBalance", value: cashBalance },
    { key: "bankBalance", value: totalBankBalance },
    { key: "unsoldInventory", value: unsoldValue },
    { key: "receivables", value: receivables },
    { key: "salesMonth", value: salesMonth },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold"><T k="dashboard" /></h1>
      <Tiles tiles={tiles} />
      <DashboardCharts costByProject={costByProject} />
      <div className="bg-white rounded-xl shadow border p-4">
        <h2 className="font-semibold mb-2">Recent Treasury Ledger (5)</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th>Date</th><th>Purpose</th><th>Flow</th><th>Amount</th></tr></thead>
          <tbody>{ledger.map((l: any) => <tr key={l.id} className="border-b"><td>{new Date(l.txnDate).toLocaleDateString()}</td><td>{l.purpose}</td><td>{l.flowType}</td><td>{formatBDT(toNum(l.amount))}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
