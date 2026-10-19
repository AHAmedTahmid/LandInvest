import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { getReportDef } from "@/lib/reports/registry";
import { getPresetRange, filterSummary } from "@/lib/reports/format";
import { REPORT_QUERIES } from "@/lib/reports";
import ReportTable from "@/components/reports/ReportTable";
import ReportFilters from "@/components/reports/ReportFilters";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ReportDetailPage({ params, searchParams }: { params: Promise<{ key: string }>; searchParams: Promise<Record<string, string>> }) {
  const { key } = await params;
  const sp = await searchParams;
  const def = getReportDef(key);
  if (!def) notFound();

  const session = await getServerSession(authOptions);
  if (!(await can(session, def.permission as any))) {
    return <div className="p-8 text-red-600">Forbidden: {def.permission}</div>;
  }

  const canExport = await can(session, "reports.export");
  const preset = (sp.preset as any) || "this_month";
  const { from, to } = getPresetRange(preset, sp.from, sp.to);
  const filters = {
    from: sp.from || from.toISOString().slice(0, 10),
    to: sp.to || to.toISOString().slice(0, 10),
    projectId: sp.projectId || undefined,
    partnerId: sp.partnerId || undefined,
    bankAccountId: sp.bankAccountId || undefined,
    status: sp.status || undefined,
    saleId: sp.saleId || undefined,
    userId: sp.userId || undefined,
    tableName: sp.tableName || undefined,
    action: sp.action || undefined,
  };

  const prisma: any = await getTenantClientFromSession();
  const queryFn = REPORT_QUERIES[key];
  if (!queryFn) notFound();
  const data = await queryFn(prisma, filters);

  const fSummary = filterSummary(filters);
  const lang = "en";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{def.titleEn}</h1>
          <p className="text-sm text-slate-500">{def.descriptionEn}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports" className="border px-3 py-2 rounded text-sm">← Back</Link>
          {canExport && (
            <>
              <a href={`/api/reports/${key}/pdf?${new URLSearchParams(sp as any)}`} className="bg-red-600 text-white px-3 py-2 rounded text-sm">PDF</a>
              <a href={`/api/reports/${key}/excel?${new URLSearchParams(sp as any)}`} className="bg-green-600 text-white px-3 py-2 rounded text-sm">Excel</a>
            </>
          )}
        </div>
      </div>

      <ReportFilters def={def} current={sp} />

      <div className="bg-white rounded-xl shadow border p-4">
        <p className="text-sm text-slate-500 mb-3">Filters: {fSummary}</p>
        <ReportTable data={data} lang={lang} />
      </div>
    </div>
  );
}
