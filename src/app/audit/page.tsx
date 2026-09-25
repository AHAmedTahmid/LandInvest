import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";

const TABLES = [
  "project_expenses",
  "treasury_ledger",
  "land_sales",
  "customer_payments",
  "profit_distributions",
  "installment_schedule",
  "project_plots",
  "land_projects",
  "partner_transactions",
  "audit_log",
  "treasury_transfer_requests",
] as const;

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; q?: string; page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!can(role, "viewDashboard")) return <div className="p-8 text-red-600">Forbidden: viewDashboard</div>;

  const params = await searchParams;
  const table = (params.table || "").trim();
  const q = (params.q || "").trim();
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const take = 30;
  const skip = (page - 1) * take;

  const prisma: any = await getTenantClientFromSession();
  const where: any = {};
  if (table) where.tableName = table;
  if (q) where.OR = [{ recordId: { contains: q } }, { changedBy: { contains: q } }];

  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.auditLog.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / take));

  // resolve changed_by names (global_users)
  const { controlPrisma } = await import("@/lib/control");
  const userIds = [...new Set(rows.map((r: any) => r.changedBy).filter(Boolean))];
  const users: any[] = userIds.length ? await (controlPrisma as any).globalUser.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true, fullName: true } }) : [];
  const nameById = new Map(users.map((u) => [u.id, `${u.fullName} <${u.email}>`]));

  const qs = (over: Record<string, string>) => {
    const sp = new URLSearchParams();
    if ((over.table ?? table)) sp.set("table", over.table ?? table);
    if ((over.q ?? q)) sp.set("q", over.q ?? q);
    if ((over.page ?? String(page)) !== "1") sp.set("page", over.page ?? String(page));
    const s = sp.toString();
    return s ? `?${s}` : "/audit";
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Audit Trail</h1>
      <p className="text-sm text-gray-500">{total} entries — every write to the 5 financial tables is logged with who/what/when. Use filters to narrow.</p>

      <form className="flex flex-wrap gap-2 bg-white p-3 rounded-xl shadow border">
        <select name="table" defaultValue={table} className="border rounded px-3 py-2">
          <option value="">All tables</option>
          {TABLES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="q" defaultValue={q} placeholder="recordId or changedBy" className="border rounded px-3 py-2 w-64" />
        <button className="bg-blue-600 text-white px-4 rounded">Filter</button>
        {(table || q) && <a href="/audit" className="border px-4 py-2 rounded">Clear</a>}
        <span className="ml-auto text-sm text-gray-500 self-center">Page {page} / {pages}</span>
      </form>

      <div className="bg-white rounded-xl shadow border overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="p-2">Time</th><th>Table</th><th>Action</th><th>Record</th><th>By</th><th>Diff</th></tr></thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-b align-top">
                <td className="p-2 whitespace-nowrap text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2 font-mono text-xs">{r.tableName}</td>
                <td className="p-2"><span className={r.action === "CREATE" ? "bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs" : r.action === "UPDATE" ? "bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs" : "bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs"}>{r.action}</span></td>
                <td className="p-2 font-mono text-xs truncate max-w-[140px]" title={r.recordId}>{r.recordId.slice(0, 8)}…</td>
                <td className="p-2 text-xs truncate max-w-[160px]" title={r.changedBy}>{nameById.get(r.changedBy) ?? r.changedBy.slice(0, 8)}</td>
                <td className="p-2 max-w-[380px]">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600">view</summary>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div><div className="font-semibold text-gray-500">old</div><pre className="bg-gray-50 p-1 rounded overflow-auto max-h-32 text-[11px]">{JSON.stringify(r.oldValues, null, 2) ?? "—"}</pre></div>
                      <div><div className="font-semibold text-gray-500">new</div><pre className="bg-gray-50 p-1 rounded overflow-auto max-h-32 text-[11px]">{JSON.stringify(r.newValues, null, 2) ?? "—"}</pre></div>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-400">No entries</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        {page > 1 && <a href={qs({ page: String(page - 1) })} className="border px-3 py-1 rounded bg-white">← Prev</a>}
        {page < pages && <a href={qs({ page: String(page + 1) })} className="ml-auto border px-3 py-1 rounded bg-white">Next →</a>}
      </div>
    </div>
  );
}
