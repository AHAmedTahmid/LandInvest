"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatBDT } from "@/lib/format";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  ProjectsComparisonReportData,
  ProjectComparisonItem,
} from "@/lib/reports/projects-comparison";
import {
  Building2,
  TrendingUp,
  Coins,
  Receipt,
  FileDown,
  Printer,
  ArrowLeft,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Percent,
  Layers,
  ArrowUpRight,
  ExternalLink,
  SlidersHorizontal,
  MapPin,
  Grid3X3,
  Award,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: ProjectsComparisonReportData;
  canExport?: boolean;
}

export default function ProjectsComparisonView({
  def,
  data,
  canExport = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { projects = [], portfolioTotals } = data;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"cost" | "sales" | "profit" | "payback" | "name">("cost");

  const filteredProjects = useMemo(() => {
    let list = projects.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.projectName.toLowerCase().includes(q) ||
          p.mouza.toLowerCase().includes(q)
        );
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "cost") return b.totalProjectCost - a.totalProjectCost;
      if (sortBy === "sales") return b.bookedSalesValue - a.bookedSalesValue;
      if (sortBy === "profit") return b.invoicedProfit - a.invoicedProfit;
      if (sortBy === "payback") return b.paybackRate - a.paybackRate;
      if (sortBy === "name") return a.projectName.localeCompare(b.projectName);
      return 0;
    });

    return list;
  }, [projects, statusFilter, searchQuery, sortBy]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto print:p-0 print:space-y-4">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Reports
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Land Projects
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {def.titleEn}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {def.titleBn} · Portfolio-wide cross-comparison of capitalized investment, layout efficiency, booked sales, collection rate, and project ROI.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
            title="Print Report"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print
          </button>
          {canExport && (
            <>
              <a
                href={`/api/reports/${def.key}?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  format: "pdf",
                })}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
              >
                <FileDown className="w-4 h-4" />
                PDF Download
              </a>
              <a
                href={`/api/reports/${def.key}?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  format: "excel",
                })}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-all"
              >
                <FileDown className="w-4 h-4 text-emerald-600" />
                Excel
              </a>
            </>
          )}
        </div>
      </div>

      {/* 2. Top 4 Portfolio Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Syndicate Capitalized Assets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Syndicate Project Assets
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {formatBDT(portfolioTotals.totalCapitalizedCost)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Acq: {formatBDT(portfolioTotals.totalAcquisitionCost)}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Dev: {formatBDT(portfolioTotals.totalDevelopmentCost)}
            </span>
          </div>
        </div>

        {/* KPI 2: Total Booked Sales & Realised Cash */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Booked Sales & Cash
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400">
              {formatBDT(portfolioTotals.totalBookedSales)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Collected: {formatBDT(portfolioTotals.totalCashCollected)}</span>
            <span className="font-mono font-semibold text-emerald-600">
              {portfolioTotals.overallCollectionRate.toFixed(1)}% Realised
            </span>
          </div>
        </div>

        {/* KPI 3: Customer Receivables & Available Inventory */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Receivables & Inventory
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg text-amber-600 dark:text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-amber-700 dark:text-amber-400">
              {formatBDT(portfolioTotals.totalActiveReceivables)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Available Asking</span>
            <span className="font-semibold text-purple-600">
              {formatBDT(portfolioTotals.totalUnsoldAskingValue)}
            </span>
          </div>
        </div>

        {/* KPI 4: Land Acreage & Demarcated Plots */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Portfolio Land Acreage
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
              <Grid3X3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-blue-700 dark:text-blue-400">
              {portfolioTotals.totalGrossArea.toFixed(1)} Shotok
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{portfolioTotals.totalPlots} Total Plots</span>
            <span className="font-semibold text-blue-600">
              {portfolioTotals.totalSoldPlots} Sold ({portfolioTotals.overallAbsorptionRate.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search, Status Filter & Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm print:hidden">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name or mouza..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="UNDER_BAYNA">UNDER_BAYNA</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="PLANNED">PLANNED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="cost">Highest Capitalized Cost</option>
              <option value="sales">Highest Booked Sales</option>
              <option value="profit">Highest Invoiced Profit</option>
              <option value="payback">Capital Payback %</option>
              <option value="name">Project Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Comparative Matrix Master Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Syndicate Project Benchmark & Comparative Matrix
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Showing {filteredProjects.length} of {portfolioTotals.totalProjects} land development projects.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            {portfolioTotals.overallEfficiencyRatio.toFixed(1)}% Portfolio Layout Efficiency
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Project Profile</th>
                <th className="py-3 px-3 text-right">Gross Area</th>
                <th className="py-3 px-3 text-center">Plots (Sold/Total)</th>
                <th className="py-3 px-4 text-right">Capitalized Cost</th>
                <th className="py-3 px-4 text-right">Booked Sales</th>
                <th className="py-3 px-4 text-right">Cash Collected</th>
                <th className="py-3 px-4 text-right">Active Dues</th>
                <th className="py-3 px-4 text-right">Invoiced Profit</th>
                <th className="py-3 px-3 text-center">Payback Status</th>
                <th className="py-3 px-3 text-right">Projected ROI</th>
                <th className="py-3 px-3 text-center print:hidden">Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredProjects.map((p) => (
                <tr key={p.projectId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {p.projectName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {p.status}
                      </span>
                      <span>Mouza: {p.mouza}</span>
                      <span>({p.partnersCount} partners)</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    <div>{p.grossAreaShotok.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400">{p.efficiencyRatio.toFixed(0)}% saleable</div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{p.soldPlotsCount}</span>
                    <span className="text-slate-400"> / {p.totalPlotsCount}</span>
                    <div className="text-[10px] text-emerald-600 font-semibold">{p.plotAbsorptionRate.toFixed(0)}% sold</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                    <div>{formatBDT(p.totalProjectCost)}</div>
                    <div className="text-[10px] text-slate-400">{formatBDT(p.grossCostPerShotok)}/sh</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {p.bookedSalesValue > 0 ? (
                      formatBDT(p.bookedSalesValue)
                    ) : (
                      <span className="text-slate-400">৳ 0.00</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    {p.cashCollected > 0 ? (
                      <div>{formatBDT(p.cashCollected)}</div>
                    ) : (
                      <span className="text-slate-400">৳ 0.00</span>
                    )}
                    {p.collectionRate > 0 && (
                      <div className="text-[10px] text-slate-400 font-normal">{p.collectionRate.toFixed(0)}% realised</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-700 dark:text-amber-400">
                    {p.activeReceivables > 0 ? formatBDT(p.activeReceivables) : <span className="text-slate-400">৳ 0.00</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span className={p.invoicedProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                      {formatBDT(p.invoicedProfit)}
                    </span>
                    {p.bookedSalesValue > 0 && (
                      <div className="text-[10px] text-slate-400 font-normal">{p.invoicedMargin.toFixed(1)}% margin</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.isPaybackAchieved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> {p.paybackRate.toFixed(0)}% Payback
                      </span>
                    ) : p.paybackRate > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {p.paybackRate.toFixed(1)}% Payback
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Development</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {p.projectedFullyDilutedRoi.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center print:hidden">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/reports/project-cost?projectId=${p.projectId}`}
                        className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100"
                        title="View Project Cost Statement"
                      >
                        Cost
                      </Link>
                      <Link
                        href={`/reports/project-pnl?projectId=${p.projectId}`}
                        className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100"
                        title="View Project Profit & Loss"
                      >
                        P&L
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
              <tr>
                <td className="py-3.5 px-4">
                  TOTAL PORTFOLIO: {portfolioTotals.totalProjects} PROJECTS
                </td>
                <td className="py-3.5 px-3 text-right font-mono">
                  {portfolioTotals.totalGrossArea.toFixed(2)}
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  {portfolioTotals.totalSoldPlots} / {portfolioTotals.totalPlots} ({portfolioTotals.overallAbsorptionRate.toFixed(0)}%)
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm font-extrabold text-white">
                  {formatBDT(portfolioTotals.totalCapitalizedCost)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm font-extrabold text-white">
                  {formatBDT(portfolioTotals.totalBookedSales)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm font-extrabold text-emerald-400">
                  {formatBDT(portfolioTotals.totalCashCollected)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm text-amber-400">
                  {formatBDT(portfolioTotals.totalActiveReceivables)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm font-extrabold text-emerald-400">
                  {formatBDT(portfolioTotals.totalInvoicedProfit)}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-300">
                  {portfolioTotals.overallPaybackRate.toFixed(1)}% Payback
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-sm text-indigo-300">
                  {portfolioTotals.overallProjectedRoi.toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. Statutory Standard & Corporate Governance Note */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Portfolio Governance & Cross-Project Capital Benchmark Standard
            </h4>
            <p className="leading-relaxed">
              This consolidated comparative statement provides aggregate oversight across all syndicate land developments in compliance with the Partnership Act, 1932, and the Real Estate Development and Management Act, 2010 (Act No. 20 of 2010):
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Capital Allocation & Liquidity:</strong> Total capitalized outlays of {formatBDT(portfolioTotals.totalCapitalizedCost)} are reconciled against registered mouza acquisition deeds and verified civil contractor vouchers.
              </li>
              <li>
                <strong>Payback & Capital Recycling:</strong> Projects with 100%+ capital payback (e.g. Green Valley City) have fully repatriated equity capital, generating surplus cash flows to fund ongoing site civil infrastructure in newer pipeline developments.
              </li>
              <li>
                <strong>Audit Trail Parity:</strong> Every project metric links directly to individual cost statements and profit & loss registers.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Official 3-Tier Signature Block */}
      <div className="hidden print:grid grid-cols-3 gap-8 pt-10 text-center text-xs text-slate-600 border-t border-slate-300">
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Prepared By (Portfolio Analyst)</p>
          <p className="text-[10px] text-slate-500">Corporate Development & Analytics</p>
        </div>
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Verified By (Internal Audit)</p>
          <p className="text-[10px] text-slate-500">Head of Audit & Quality Assurance</p>
        </div>
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Approved By (Managing Partner)</p>
          <p className="text-[10px] text-slate-500">Syndicate Board of Directors</p>
        </div>
      </div>
    </div>
  );
}
