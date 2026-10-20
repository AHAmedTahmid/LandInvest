import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { computePnl, distributeProject } from "@/lib/pnl";
import { formatBDT } from "@/lib/format";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function PnlPage() {
  const session = await getServerSession(authOptions);
  const allowed = (await can(session, "profit.view")) || (await can(session, "reports.view"));
  if (!allowed) return <div className="p-8 text-red-600">Forbidden: profit.view</div>;
  const canDistribute = await can(session, "profit.distribute");
  const canExport = await can(session, "reports.export");

  const prisma: any = await getTenantClientFromSession();
  const raw = await computePnl(prisma);
  const pnl = raw.map((r: any) => ({
    projectId: r.projectId,
    projectName: r.projectName,
    revenue: Number(r.revenue),
    landCost: Number(r.landCost),
    expCost: Number(r.expCost),
    totalCost: Number(r.totalCost),
    netProfit: Number(r.netProfit),
    partners: r.partners.map((pp: any) => ({ name: pp.partner.name, share: Number(pp.sharePercentage) })),
  }));

  async function distribute(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!(await canFn(s, "profit.distribute"))) throw new Error("Forbidden");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { distributeProject: dp } = await import("@/lib/pnl");
    const p: any = await gc();
    await dp(p, {
      projectId: formData.get("projectId") as string,
      basis: String(formData.get("basis") || "CASH_BASIS"),
      userId: (s!.user as any).id,
    });
    revalidatePath("/reports/project-pnl");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profit &amp; Loss</h1>
          <p className="text-sm text-slate-500">Revenue, cost and net profit per project — from the ledgers, approved expenses only</p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports" className="border px-3 py-2 rounded text-sm">← All reports</Link>
          {canExport && (
            <>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/api/reports/pnl/pdf" className="bg-red-600 text-white px-3 py-2 rounded text-sm">PDF</a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/api/reports/pnl/excel" className="bg-green-600 text-white px-3 py-2 rounded text-sm">Excel</a>
            </>
          )}
        </div>
      </div>

      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Project</th>
            <th className="text-left">Revenue</th>
            <th className="text-left">Land Cost</th>
            <th className="text-left">Expenses</th>
            <th className="text-left">Total Cost</th>
            <th className="text-left">Net Profit</th>
            {canDistribute && <th className="text-left">Distribute</th>}
          </tr>
        </thead>
        <tbody>
          {pnl.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate-400">No projects yet</td></tr>}
          {pnl.map((r) => (
            <tr key={r.projectId} className="border-b">
              <td className="p-2 font-medium">{r.projectName}</td>
              <td>{formatBDT(r.revenue)}</td>
              <td>{formatBDT(r.landCost)}</td>
              <td>{formatBDT(r.expCost)}</td>
              <td>{formatBDT(r.totalCost)}</td>
              <td className={r.netProfit >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{formatBDT(r.netProfit)}</td>
              {canDistribute && (
                <td>
                  {r.netProfit > 0 ? (
                    <form action={distribute} className="flex gap-1 items-center">
                      <input type="hidden" name="projectId" value={r.projectId} />
                      <select name="basis" className="border rounded text-xs">
                        <option value="CASH_BASIS">Cash basis</option>
                        <option value="COMPLETION_BASIS">Completion basis</option>
                      </select>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                        Distribute {r.partners.map((p: any) => `${p.name} ${p.share}%`).join(", ")}
                      </button>
                    </form>
                  ) : "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
