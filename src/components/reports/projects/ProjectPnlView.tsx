"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatBDT } from "@/lib/format";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  ProjectPnlReportData,
  ProjectPnlSummary,
  ProjectPartnerProfitItem,
} from "@/lib/reports/project-pnl";
import {
  TrendingUp,
  Building2,
  DollarSign,
  Wallet,
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
  ArrowDownLeft,
  Users,
  PieChart,
  Coins,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: ProjectPnlReportData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
  };
  projects?: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function ProjectPnlView({
  def,
  data,
  filters,
  projects = [],
  canExport = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { selectedProject, allProjectsList = [], portfolioKpis } = data;
  const [activeTab, setActiveTab] = useState<"statement" | "partners" | "sales">("statement");
  const [salesSearch, setSalesSearch] = useState("");

  const handleProjectChange = (projId: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("projectId", projId);
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSales = selectedProject.recentSales.filter(
    (s) =>
      !salesSearch.trim() ||
      s.buyerName.toLowerCase().includes(salesSearch.toLowerCase()) ||
      s.plotNumber.toLowerCase().includes(salesSearch.toLowerCase())
  );

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
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {def.titleEn}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {def.titleBn} · Dual Invoiced / Accrual vs Realised Cash Basis Profit & Loss, Collection Ratio & Partner Distributions.
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

      {/* 2. Project Selection Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2 pr-1">
            Projects:
          </span>
          {allProjectsList.map((proj) => {
            const isSelected = selectedProject.projectId === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => handleProjectChange(proj.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{proj.projectName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : proj.invoicedProfit >= 0
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {proj.invoicedProfit >= 0
                    ? `+${formatBDT(proj.invoicedProfit)}`
                    : formatBDT(proj.invoicedProfit)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Booked Sales & Collections */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Booked Sales
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {formatBDT(selectedProject.totalBookedSales)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Collected: {formatBDT(selectedProject.totalCashCollected)}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {selectedProject.collectionRate.toFixed(1)}% Realised
            </span>
          </div>
        </div>

        {/* KPI 2: Invoiced Gross Profit */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Invoiced Gross Profit
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              className={`text-xl font-bold font-mono tracking-tight ${
                selectedProject.invoicedGrossProfit >= 0
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatBDT(selectedProject.invoicedGrossProfit)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Booked Margin</span>
            <span className="font-mono font-semibold text-emerald-600">
              {selectedProject.invoicedMargin.toFixed(1)}% on Revenue
            </span>
          </div>
        </div>

        {/* KPI 3: Realised Cash Profit */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Realised Cash Profit
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              className={`text-xl font-bold font-mono tracking-tight ${
                selectedProject.realisedCashProfit >= 0
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {formatBDT(selectedProject.realisedCashProfit)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Capital Payback</span>
            <span
              className={`font-semibold ${
                selectedProject.isPaybackAchieved ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {selectedProject.paybackRate.toFixed(1)}% Payback
            </span>
          </div>
        </div>

        {/* KPI 4: Active Customer Receivables */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Customer Receivables
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg text-amber-600 dark:text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-amber-700 dark:text-amber-400">
              {formatBDT(selectedProject.activeReceivables)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Distributed: {formatBDT(selectedProject.profitDistributedToDate)}</span>
            <span className="font-semibold text-purple-600">
              Retained: {formatBDT(selectedProject.retainedProjectSurplus)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Capital Payback & Cost Breakeven Progress Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              Capital Payback & Breakeven Status ({selectedProject.projectName})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cumulative cash collections ({formatBDT(selectedProject.totalCashCollected)}) vs total capitalized project investment ({formatBDT(selectedProject.totalProjectCost)}).
            </p>
          </div>
          <div className="text-right">
            {selectedProject.isPaybackAchieved ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Breakeven Achieved (+{selectedProject.paybackRate.toFixed(1)}%)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <AlertCircle className="w-3.5 h-3.5" />
                {selectedProject.paybackRate.toFixed(1)}% of Capital Recovered
              </span>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner relative">
          <div
            style={{ width: `${Math.min(selectedProject.paybackRate, 100)}%` }}
            className={`h-full transition-all ${
              selectedProject.isPaybackAchieved ? "bg-emerald-600" : "bg-amber-500"
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1.5">
          <span>৳ 0.00</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Breakeven Point: {formatBDT(selectedProject.totalProjectCost)}
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            Collections: {formatBDT(selectedProject.totalCashCollected)}
          </span>
        </div>
      </div>

      {/* 5. Switcher Tabs (Statement vs Partners vs Sales) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <button
          onClick={() => setActiveTab("statement")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "statement"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Comparative P&L Statement
        </button>
        <button
          onClick={() => setActiveTab("partners")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "partners"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Partner Profit Allocation ({selectedProject.partnerAllocations.length})
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "sales"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          Customer Sales Contracts ({selectedProject.recentSales.length})
        </button>
      </div>

      {/* VIEW TAB 1: COMPARATIVE P&L STATEMENT */}
      {activeTab === "statement" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Comparative Statement of Project Profit & Loss: {selectedProject.projectName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Invoiced (Accrual) Basis vs. Realised (Cash) Basis with Customer Receivables Reconciliation.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              {selectedProject.status}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16">Code</th>
                  <th className="py-3 px-4">Financial Head / Description</th>
                  <th className="py-3 px-4 text-right">Invoiced / Accrual Basis</th>
                  <th className="py-3 px-4 text-right">Realised / Cash Basis</th>
                  <th className="py-3 px-4 text-right">Variance / Receivables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {selectedProject.lineItems.map((li, idx) => {
                  if (li.isHeader) {
                    return (
                      <tr key={idx} className="bg-slate-50/80 dark:bg-slate-800/50 font-bold text-slate-900 dark:text-white">
                        <td className="py-2.5 px-4 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{li.code}</td>
                        <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                          {li.labelEn}
                        </td>
                      </tr>
                    );
                  }

                  if (li.isTotal) {
                    const isProfit = li.code === "3.0";
                    return (
                      <tr
                        key={idx}
                        className={`font-bold border-t-2 ${
                          isProfit
                            ? "bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-white border-indigo-300 dark:border-indigo-800"
                            : "bg-slate-100/60 dark:bg-slate-800/60 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{li.code}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs">{li.labelEn}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                          {li.invoiced !== null ? formatBDT(li.invoiced) : "-"}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                          {li.realised !== null ? formatBDT(li.realised) : "-"}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
                          {li.variance !== null && li.variance !== 0 ? formatBDT(li.variance) : "৳ 0.00"}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{li.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{li.labelEn}</div>
                        <div className="text-[11px] text-slate-400">{li.labelBn}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                        {li.invoiced !== null ? (
                          <span className={li.invoiced < 0 ? "text-rose-600 dark:text-rose-400" : ""}>
                            {formatBDT(li.invoiced)}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                        {li.realised !== null ? (
                          <span className={li.realised < 0 ? "text-rose-600 dark:text-rose-400" : ""}>
                            {formatBDT(li.realised)}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-amber-700 dark:text-amber-400">
                        {li.variance !== null && li.variance !== 0 ? (
                          formatBDT(li.variance)
                        ) : (
                          <span className="text-slate-400">৳ 0.00</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW TAB 2: PARTNER PROFIT ALLOCATION */}
      {activeTab === "partners" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Partner Equity Profit Allocation: {selectedProject.projectName}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Contractual equity share allocation of invoiced profit, cash profit, and distributions disbursed.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Partner Name</th>
                  <th className="py-3 px-3 text-center">Share %</th>
                  <th className="py-3 px-4 text-right">Allocated Invoiced Profit</th>
                  <th className="py-3 px-4 text-right">Allocated Realised Cash</th>
                  <th className="py-3 px-4 text-right">Actual Distributed</th>
                  <th className="py-3 px-3 text-center">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {selectedProject.partnerAllocations.map((p) => (
                  <tr key={p.partnerId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {p.partnerName}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {p.sharePercentage.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatBDT(p.allocatedInvoicedProfit)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-blue-700 dark:text-blue-400">
                      {formatBDT(p.allocatedRealisedProfit)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-purple-700 dark:text-purple-400">
                      {p.actualProfitReceived > 0 ? (
                        formatBDT(p.actualProfitReceived)
                      ) : (
                        <span className="text-slate-400">৳ 0.00</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Link
                        href={`/reports/partner-capital?partnerId=${p.partnerId}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
                      >
                        Ledger
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100/90 dark:bg-slate-800/90 font-bold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <tr>
                  <td className="py-3 px-4">Total Syndicate Allocation</td>
                  <td className="py-3 px-3 text-center font-mono">100.00%</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400">
                    {formatBDT(selectedProject.invoicedGrossProfit)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-400">
                    {formatBDT(selectedProject.realisedCashProfit)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-purple-700 dark:text-purple-400">
                    {formatBDT(selectedProject.profitDistributedToDate)}
                  </td>
                  <td className="py-3 px-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* VIEW TAB 3: CUSTOMER SALES CONTRACTS */}
      {activeTab === "sales" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" />
                Customer Sales Contracts: {selectedProject.projectName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {filteredSales.length} contracts registered ({selectedProject.soldPlotsCount} plots sold).
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search buyer name or plot..."
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Buyer Name</th>
                  <th className="py-3 px-3 text-center">Plot No</th>
                  <th className="py-3 px-3 text-right">Plot Shotok</th>
                  <th className="py-3 px-4 text-right">Agreed Value</th>
                  <th className="py-3 px-4 text-right">Collected</th>
                  <th className="py-3 px-4 text-right">Remaining Due</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No sales contracts match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((s) => (
                    <tr key={s.saleId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {s.saleDate}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {s.buyerName}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {s.plotNumber}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {s.plotAreaShotok.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatBDT(s.agreedPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        {formatBDT(s.collectedAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                        {s.currentDueAmount > 0 ? formatBDT(s.currentDueAmount) : "৳ 0.00"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Statutory Standard & Revenue Recognition Note */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Revenue Recognition & Dual P&L Statutory Standard
            </h4>
            <p className="leading-relaxed">
              In accordance with International Financial Reporting Standards (IFRS 15 - Revenue from Contracts with Customers) and Partnership Financial Management Standards:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Invoiced / Accrual Basis:</strong> Recognizes revenue upon execution of binding registered sale contracts ({formatBDT(selectedProject.totalBookedSales)}). Invoiced profit matches net equity additions on the official Statement of Financial Position.
              </li>
              <li>
                <strong>Realised / Cash Basis:</strong> Recognizes revenue strictly upon cash settlement and bank clearance ({formatBDT(selectedProject.totalCashCollected)}). Only realised cash surplus is available for capital dividend distributions to partners.
              </li>
              <li>
                <strong>Capital Payback Threshold:</strong> Cash distributions to partners are certified only after achieving 100% capital payback of all capitalized land acquisition and development outlays.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7. Official 3-Tier Signature Block */}
      <div className="hidden print:grid grid-cols-3 gap-8 pt-10 text-center text-xs text-slate-600 border-t border-slate-300">
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Prepared By (Treasury)</p>
          <p className="text-[10px] text-slate-500">Senior Project Accountant</p>
        </div>
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Verified By (Internal Audit)</p>
          <p className="text-[10px] text-slate-500">Head of Audit & Quality Assurance</p>
        </div>
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Approved By (Managing Partner)</p>
          <p className="text-[10px] text-slate-500">Syndicate Board of Management</p>
        </div>
      </div>
    </div>
  );
}
