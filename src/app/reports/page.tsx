import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT } from "@/lib/format";
import { computePnl, distributeProject } from "@/lib/pnl";
import ReportsCharts from "./Charts";
import { revalidatePath } from "next/cache";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!can(role, "viewDashboard")) return <div className="p-8 text-red-600">Forbidden: viewDashboard</div>;

  const prisma: any = await getTenantClientFromSession();
  const pnl = await computePnl(prisma);

  async function distribute(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!canFn((s!.user as any).role, "distributeProfits")) throw new Error("Forbidden");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { distributeProject: dp } = await import("@/lib/pnl");
    const p: any = await gc();
    await dp(p, {
      projectId: formData.get("projectId") as string,
      basis: String(formData.get("basis") || "CASH_BASIS"),
      userId: (s!.user as any).id,
    });
    revalidatePath("/reports");
  }

  const canDistribute = can(role, "distributeProfits");
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">PnL Reports</h1>
      <div className="flex gap-2">
        <a href="/api/reports/pnl/excel" className="bg-green-600 text-white px-4 py-2 rounded">Export CSV</a>
        <a href="/api/reports/pnl/pdf" className="bg-red-600 text-white px-4 py-2 rounded">Export PDF</a>
      </div>
      <ReportsCharts data={pnl as any} />
      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Project</th>
            <th className="text-left">Revenue</th>
            <th className="text-left">Total Cost</th>
            <th className="text-left">Net Profit</th>
            <th className="text-left">Distribute</th>
          </tr>
        </thead>
        <tbody>
          {pnl.map((r) => (
            <tr key={r.projectId} className="border-b">
              <td className="p-2">{r.projectName}</td>
              <td>{formatBDT(r.revenue)}</td>
              <td>{formatBDT(r.totalCost)}</td>
              <td className={r.netProfit >= 0 ? "text-green-600" : "text-red-600"}>{formatBDT(r.netProfit)}</td>
              <td>
                {canDistribute && r.netProfit > 0 ? (
                  <form action={distribute} className="flex gap-1 items-center">
                    <input type="hidden" name="projectId" value={r.projectId} />
                    <select name="basis" className="border rounded text-xs">
                      <option value="CASH_BASIS">Cash basis</option>
                      <option value="COMPLETION_BASIS">Completion basis</option>
                    </select>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                      Distribute {r.partners.map((p: any) => `${p.partner.name} ${p.sharePercentage}%`).join(", ")}
                    </button>
                  </form>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
