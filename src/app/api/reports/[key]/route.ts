import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { getReportDef } from "@/lib/reports/registry";
import { getPresetRange, filterSummary } from "@/lib/reports/format";
import { buildReportHtml, generatePdf } from "@/lib/reports/pdf";
import { buildXlsxHtml } from "@/lib/reports/excel";
import { REPORT_QUERIES } from "@/lib/reports";

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const def = getReportDef(key);
  if (!def) return NextResponse.json({ error: "Unknown report" }, { status: 404 });

  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!(await can(session, def.permission as any))) return new Response("Forbidden", { status: 403 });
  if (!(await can(session, "reports.export"))) return new Response("Forbidden: reports.export", { status: 403 });

  const sp = req.nextUrl.searchParams;
  const preset = (sp.get("preset") as any) || "this_month";
  const { from, to } = getPresetRange(preset, sp.get("from") ?? undefined, sp.get("to") ?? undefined);
  const filters = {
    from: sp.get("from") || from.toISOString().slice(0, 10),
    to: sp.get("to") || to.toISOString().slice(0, 10),
    projectId: sp.get("projectId") || undefined,
    partnerId: sp.get("partnerId") || undefined,
    bankAccountId: sp.get("bankAccountId") || undefined,
    status: sp.get("status") || undefined,
    saleId: sp.get("saleId") || undefined,
    userId: sp.get("userId") || undefined,
    tableName: sp.get("tableName") || undefined,
    action: sp.get("action") || undefined,
  };

  const prisma: any = await getTenantClientFromSession();
  const queryFn = REPORT_QUERIES[key];
  if (!queryFn) return NextResponse.json({ error: "Unknown report" }, { status: 404 });
  const data = await queryFn(prisma, filters);

  const fSummary = filterSummary(filters);
  const companyName = "LandInvest";
  const generatedBy = (session.user as any).fullName || (session.user as any).email || "System";

  const format = sp.get("format") || "pdf";
  if (format === "excel") {
    const html = buildXlsxHtml(data, "en");
    return new Response(html, { headers: { "Content-Type": "application/vnd.ms-excel", "Content-Disposition": `attachment; filename="${key}.xls"` } });
  }

  const html = buildReportHtml({ titleEn: def.titleEn, titleBn: def.titleBn, companyName, filterSummary: fSummary, generatedBy, lang: "en", data });
  try {
    const pdf = await generatePdf(html);
    return new Response(Buffer.from(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${key}.pdf"` } });
  } catch {
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }
}
