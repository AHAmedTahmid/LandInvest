import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum } from "@/lib/format";
import DashboardCharts from "./Charts";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role: any = (session?.user as any)?.role;
  if (!can(role, "viewDashboard")) return <div className="p-8 text-red-600">Forbidden: viewDashboard</div>;
  const prisma: any = await getTenantClientFromSession();

  const [partners, projects, expenses, payments, ledger] = await Promise.all([
    prisma.partnerTransaction.findMany(),
    prisma.landProject.findMany(),
    prisma.projectExpense.findMany({ where: { status: "APPROVED" } }),
    prisma.customerPayment.findMany(),
    prisma.treasuryLedger.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { bankAccount: true } }),
  ]);

  // partner balance calc for total capital: SUM DEPOSIT+DIRECT_EXPENSE+PROFIT_CREDIT - WITHDRAWAL + openingBalance
  const allPartners = await prisma.partner.findMany();
  let totalCapital = 0;
  for (const p of allPartners) {
    totalCapital += toNum(p.openingBalance);
    const txs = partners.filter((t: any) => t.partnerId === p.id);
    for (const t of txs) {
      const a = toNum(t.amount);
      if (["DEPOSIT","DIRECT_EXPENSE","PROFIT_CREDIT"].includes(t.txnType)) totalCapital += a;
      else if (t.txnType === "WITHDRAWAL") totalCapital -= a;
    }
  }
  const totalLandCost = projects.reduce((s: number, p: any) => s + toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost), 0);
  const totalExpenses = expenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);
  const totalSales = payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
  const netPnL = totalSales - totalLandCost - totalExpenses;

  // project-wise cost for chart
  const costByProject = projects.map((p: any) => ({
    name: p.projectName.slice(0,12),
    cost: toNum(p.purchasePrice)+toNum(p.registrationCost)+toNum(p.mutationTaxCost) + expenses.filter((e:any)=>e.projectId===p.id).reduce((s:number,e:any)=>s+toNum(e.amount),0)
  }));

  const tiles = [
    { label: "Total Capital", value: totalCapital },
    { label: "Total Land Cost", value: totalLandCost },
    { label: "Total Expenses", value: totalExpenses },
    { label: "Total Sales Collected", value: totalSales },
    { label: "Net P&L", value: netPnL },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {tiles.map(t=>(
          <div key={t.label} className="bg-white rounded-xl shadow p-4 border">
            <div className="text-sm text-gray-500">{t.label}</div>
            <div className="text-lg font-bold">{formatBDT(t.value)}</div>
          </div>
        ))}
      </div>
      <DashboardCharts costByProject={costByProject} />
      <div className="bg-white rounded-xl shadow border p-4">
        <h2 className="font-semibold mb-2">Recent Treasury Ledger (5)</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th>Date</th><th>Purpose</th><th>Flow</th><th>Amount</th></tr></thead>
          <tbody>{ledger.map((l:any)=><tr key={l.id} className="border-b"><td>{new Date(l.txnDate).toLocaleDateString()}</td><td>{l.purpose}</td><td>{l.flowType}</td><td>{formatBDT(toNum(l.amount))}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
