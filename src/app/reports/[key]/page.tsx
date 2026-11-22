
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { getReportDef } from "@/lib/reports/registry";
import { getPresetRange, filterSummary } from "@/lib/reports/format";
import { getFiscalYears } from "@/lib/fiscalYear";
import { REPORT_QUERIES } from "@/lib/reports";
import ReportTable from "@/components/reports/ReportTable";
import ReportFilters from "@/components/reports/ReportFilters";
import BalanceSheetView from "@/components/reports/financial/BalanceSheetView";
import CashBookView from "@/components/reports/financial/CashBookView";
import BankBookView from "@/components/reports/financial/BankBookView";
import DailySummaryView from "@/components/reports/financial/DailySummaryView";
import ReceiptsPaymentsView from "@/components/reports/financial/ReceiptsPaymentsView";
import ContraRegisterView from "@/components/reports/financial/ContraRegisterView";

import PartnerCapitalView from "@/components/reports/partners/PartnerCapitalView";
import PartnersSummaryView from "@/components/reports/partners/PartnersSummaryView";
import PartnerContributionView from "@/components/reports/partners/PartnerContributionView";
import ProjectCostView from "@/components/reports/projects/ProjectCostView";
import ProjectPnlView from "@/components/reports/projects/ProjectPnlView";
import ProjectsComparisonView from "@/components/reports/projects/ProjectsComparisonView";
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
  const prisma: any = await getTenantClientFromSession();
  const preset = (sp.preset as any) || "this_month";
  const { from, to } = getPresetRange(preset, sp.from, sp.to);
  let fyFrom = sp.from || from.toISOString().slice(0, 10);
  let fyTo = sp.to || to.toISOString().slice(0, 10);
  if (preset === "this_fy" && !sp.from && !sp.to) {
    try {
      const { currentFiscalYear } = await getFiscalYears(prisma);
      if (currentFiscalYear) {
        fyFrom = currentFiscalYear.startDate;
        fyTo = currentFiscalYear.endDate;
      }
    } catch {
      // Fallback to default preset dates if FY setting read fails
    }
  }
  const filters = {
    from: fyFrom,
    to: fyTo,
    projectId: sp.projectId || undefined,
    partnerId: sp.partnerId || undefined,
    bankAccountId: sp.bankAccountId || undefined,
    status: sp.status || undefined,
    saleId: sp.saleId || undefined,
    userId: sp.userId || undefined,
    tableName: sp.tableName || undefined,
    action: sp.action || undefined,
  };
  const queryFn = REPORT_QUERIES[key];
  if (!queryFn) notFound();
  const data = await queryFn(prisma, filters);

  // Fetch projects list for contextual dropdown filters across reports
  let projects: { id: string; projectName: string }[] = [];
  try {
    projects = await prisma.landProject.findMany({
      select: { id: true, projectName: true },
      orderBy: { projectName: "asc" },
    });
  } catch {
    // Graceful fallback if landProject table is empty or inaccessible
  }

  // Fetch bank accounts list for contextual account selector
  let bankAccounts: { id: string; bankName: string; accountNumber: string; branchName: string | null; currentBalance: number; accountType?: string }[] = [];
  try {
    const rawBankAccounts = await prisma.bankAccount.findMany({
      select: { id: true, bankName: true, accountNumber: true, branchName: true, currentBalance: true, accountType: true },
      orderBy: { bankName: "asc" },
    });
    bankAccounts = rawBankAccounts.map((b: any) => ({
      id: b.id,
      accountType: b.accountType || "BANK",
      bankName: b.bankName,
      accountNumber: b.accountNumber,
      branchName: b.branchName,
      currentBalance: Number(b.currentBalance || 0),
    }));
  } catch {
    // Graceful fallback if bankAccount table is empty or inaccessible
  }

  // Specialized High-Elegance Financial Views
  if (key === "balance-sheet") {
    return (
      <BalanceSheetView
        def={def}
        data={data}
        filters={filters}
        projects={projects}
        canExport={canExport}
      />
    );
  }

  if (key === "cash-book") {
    return (
      <CashBookView
        def={def}
        data={data}
        filters={filters}
        canExport={canExport}
      />
    );
  }

  if (key === "bank-book") {
    return (
      <BankBookView
        def={def}
        data={data}
        filters={filters}
        bankAccounts={bankAccounts}
        canExport={canExport}
      />
    );
  }

  if (key === "daily-summary") {
    return (
      <DailySummaryView
        def={def}
        data={data}
        filters={filters}
        canExport={canExport}
      />
    );
  }

  if (key === "receipts-payments") {
    return (
      <ReceiptsPaymentsView
        def={def}
        data={data}
        filters={filters}
        canExport={canExport}
      />
    );
  }

  if (key === "contra-register") {
    return (
      <ContraRegisterView
        def={def}
        data={data as any}
        filters={filters}
        canExport={canExport}
      />
    );
  }

  if (key === "partner-capital") {
    return (
      <PartnerCapitalView
        def={def}
        data={data as any}
        filters={filters}
        canExport={canExport}
      />
    );
  }

  if (key === "partners-summary") {
    return (
      <PartnersSummaryView
        def={def}
        data={data as any}
        filters={filters}
        projects={projects}
        canExport={canExport}
      />
    );
  }

  if (key === "partner-contribution") {
    return (
      <PartnerContributionView
        def={def}
        data={data as any}
        filters={filters}
        projects={projects}
        canExport={canExport}
      />
    );
  }

  if (key === "project-cost") {
    return (
      <ProjectCostView
        def={def}
        data={data as any}
        filters={filters}
        projects={projects}
        canExport={canExport}
      />
    );
  }

  if (key === "project-pnl") {
    return (
      <ProjectPnlView
        def={def}
        data={data as any}
        filters={filters}
        projects={projects}
        canExport={canExport}
      />
    );
  }

  if (key === "projects-comparison") {
    return (
      <ProjectsComparisonView
        def={def}
        data={data as any}
        canExport={canExport}
      />
    );
  }

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
              <a href={`/api/reports/${key}?${new URLSearchParams({ ...sp, format: "pdf" })}`} className="bg-red-600 text-white px-3 py-2 rounded text-sm">PDF</a>
              <a href={`/api/reports/${key}?${new URLSearchParams({ ...sp, format: "excel" })}`} className="bg-green-600 text-white px-3 py-2 rounded text-sm">Excel</a>
            </>
          )}
        </div>
      </div>

      <ReportFilters def={def} current={{ ...sp, from: filters.from, to: filters.to }} />

      <div className="bg-white rounded-xl shadow border p-4">
        <p className="text-sm text-slate-500 mb-3">Filters: {fSummary}</p>
        <ReportTable data={data} lang={lang} />
      </div>
    </div>
  );
}
