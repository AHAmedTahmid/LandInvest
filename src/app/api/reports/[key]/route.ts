import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { getReportDef } from "@/lib/reports/registry";
import { getPresetRange, filterSummary } from "@/lib/reports/format";
import { getFiscalYears } from "@/lib/fiscalYear";
import { buildReportHtml, buildBalanceSheetPdfHtml, buildCashBookPdfHtml, buildBankBookPdfHtml, buildDailySummaryPdfHtml, buildReceiptsPaymentsPdfHtml, buildContraRegisterPdfHtml, buildPartnerCapitalPdfHtml, buildPartnersSummaryPdfHtml, buildPartnerContributionPdfHtml, buildProjectCostPdfHtml, buildProjectPnlPdfHtml, buildProjectsComparisonPdfHtml, buildExpenseRegisterPdfHtml, buildPendingApprovalPdfHtml, buildLandDocumentsPdfHtml, buildSalesRegisterPdfHtml, buildPlotInventoryPdfHtml, buildBuyerStatementPdfHtml, buildReceivablesAgingPdfHtml, buildInstallmentReportPdfHtml, buildCollectionReportPdfHtml, buildProfitAllocationPdfHtml, buildProfitHistoryPdfHtml, buildAuditTrailPdfHtml, generatePdf } from "@/lib/reports/pdf";
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
  const prisma: any = await getTenantClientFromSession();
  const preset = (sp.get("preset") as any) || "this_month";
  const { from, to } = getPresetRange(preset, sp.get("from") ?? undefined, sp.get("to") ?? undefined);
  let fyFrom = sp.get("from") || from.toISOString().slice(0, 10);
  let fyTo = sp.get("to") || to.toISOString().slice(0, 10);
  if (preset === "this_fy" && !sp.get("from") && !sp.get("to")) {
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
    projectId: sp.get("projectId") || undefined,
    partnerId: sp.get("partnerId") || undefined,
    bankAccountId: sp.get("bankAccountId") || undefined,
    status: sp.get("status") || undefined,
    saleId: sp.get("saleId") || undefined,
    userId: sp.get("userId") || undefined,
    tableName: sp.get("tableName") || undefined,
    action: sp.get("action") || undefined,
  };

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

  const lang = (sp.get("lang") as "en" | "bn") || "en";
  let html: string;
  let landscape = true;

  if (key === "balance-sheet") {
    let projectName: string | undefined;
    if (filters.projectId) {
      try {
        const p = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        projectName = p?.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildBalanceSheetPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = false; // Official A4 portrait statement of financial position
  } else if (key === "cash-book") {
    html = buildCashBookPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // High-readability A4 landscape cash register
  } else if (key === "bank-book") {
    let bankAccountName: string | undefined;
    if (filters.bankAccountId) {
      try {
        const acc = await prisma.bankAccount.findUnique({
          where: { id: filters.bankAccountId },
          select: { bankName: true, accountNumber: true },
        });
        if (acc) bankAccountName = `${acc.bankName} (${acc.accountNumber})`;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildBankBookPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      bankAccountName,
    });
    landscape = true; // High-readability A4 landscape bank register
  } else if (key === "daily-summary") {
    html = buildDailySummaryPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // High-readability A4 landscape daily register
  } else if (key === "receipts-payments") {
    html = buildReceiptsPaymentsPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // High-readability A4 landscape dual statement
  } else if (key === "contra-register") {
    html = buildContraRegisterPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // High-readability A4 landscape contra register
  } else if (key === "partner-capital") {
    html = buildPartnerCapitalPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = false; // Executive A4 portrait partner capital statement
  } else if (key === "partners-summary") {
    html = buildPartnersSummaryPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape all partners summary
  } else if (key === "partner-contribution") {
    html = buildPartnerContributionPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape project contribution
  } else if (key === "project-cost") {
    html = buildProjectCostPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape project cost statement
  } else if (key === "project-pnl") {
    html = buildProjectPnlPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape project pnl statement
  } else if (key === "projects-comparison") {
    html = buildProjectsComparisonPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape all projects comparison
  } else if (key === "expense-register") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildExpenseRegisterPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape project expense register
  } else if (key === "pending-approval") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildPendingApprovalPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape pending approval queue
  } else if (key === "land-documents") {
    html = buildLandDocumentsPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape land document register
  } else if (key === "sales-register") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildSalesRegisterPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape master sales register
  } else if (key === "plot-inventory") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildPlotInventoryPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape plot inventory & stock register
  } else if (key === "buyer-statement") {
    html = buildBuyerStatementPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape buyer statement & customer ledger
  } else if (key === "receivables-aging") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildReceivablesAgingPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape receivables aging & recovery report
  } else if (key === "installment-report") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildInstallmentReportPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape installment due & overdue schedule
  } else if (key === "collection-report") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildCollectionReportPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape master collection report
  } else if (key === "profit-allocation") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildProfitAllocationPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape syndicate profit allocation sheet
  } else if (key === "profit-history") {
    let projectName: string | undefined;
    if (filters.projectId && filters.projectId !== "ALL") {
      try {
        const proj = await prisma.landProject.findUnique({
          where: { id: filters.projectId },
          select: { projectName: true },
        });
        if (proj) projectName = proj.projectName;
      } catch {
        // Fallback if query fails
      }
    }
    html = buildProfitHistoryPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
      projectName,
    });
    landscape = true; // Executive A4 landscape master profit distribution history
  } else if (key === "audit-trail") {
    html = buildAuditTrailPdfHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true; // Executive A4 landscape forensic audit trail & compliance register
  } else {
    html = buildReportHtml({
      titleEn: def.titleEn,
      titleBn: def.titleBn,
      companyName,
      filterSummary: fSummary,
      generatedBy,
      lang,
      data,
    });
    landscape = true;
  }

  try {
    const pdf = await generatePdf(html, { landscape });
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${key}.pdf"`,
      },
    });
  } catch {
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }
}
