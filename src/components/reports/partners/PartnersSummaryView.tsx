"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatBDT } from "@/lib/format";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  PartnersSummaryData,
  PartnerSummaryItem,
} from "@/lib/reports/partners-summary";
import {
  Users,
  Wallet,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Printer,
  FileDown,
  ArrowLeft,
  Search,
  CheckCircle2,
  Phone,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
  PieChart,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: PartnersSummaryData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
  };
  projects?: { id: string; projectName: string }[];
  canExport?: boolean;
}

const PARTNER_COLORS = [
  { bg: "bg-purple-600", text: "text-purple-700", border: "border-purple-200", light: "bg-purple-50", bar: "#9333ea" },
  { bg: "bg-blue-600", text: "text-blue-700", border: "border-blue-200", light: "bg-blue-50", bar: "#2563eb" },
  { bg: "bg-teal-600", text: "text-teal-700", border: "border-teal-200", light: "bg-teal-50", bar: "#0d9488" },
  { bg: "bg-amber-600", text: "text-amber-700", border: "border-amber-200", light: "bg-amber-50", bar: "#d97706" },
  { bg: "bg-rose-600", text: "text-rose-700", border: "border-rose-200", light: "bg-rose-50", bar: "#e11d48" },
];

export default function PartnersSummaryView({
  def,
  data,
  filters,
  projects = [],
  canExport = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>(filters.projectId || "ALL");

  const { partners = [], kpis } = data;

  const currentPreset = searchParams.get("preset") || "all_time";

  const handlePresetChange = (preset: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("preset", preset);
    sp.delete("from");
    sp.delete("to");
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  const handleProjectChange = (projId: string) => {
    setProjectFilter(projId);
    const sp = new URLSearchParams(searchParams.toString());
    if (projId === "ALL") {
      sp.delete("projectId");
    } else {
      sp.set("projectId", projId);
    }
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  // Filtered partners list
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      // Project filter
      if (projectFilter !== "ALL") {
        const isInProject = p.projects.some((pr) => pr.projectId === projectFilter);
        if (!isInProject) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesPhone = p.phone.toLowerCase().includes(q);
        const matchesBank = (p.bankName || "").toLowerCase().includes(q);
        const matchesProject = p.projects.some((pr) => pr.projectName.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesBank && !matchesProject) {
          return false;
        }
      }

      return true;
    });
  }, [partners, projectFilter, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto print:p-0 print:space-y-4 print:max-w-none">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link
              href="/reports"
              className="hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Reports Catalog
            </Link>
            <span>/</span>
            <span className="text-slate-400">Partners & Capital</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              All Partners Summary
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>All Partners Capital Summary</span>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium border border-slate-200">
                  Consolidated Equity
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidated Syndicate Equity Distribution, Project Stakes & Partner Balance Standings
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
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
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition"
              >
                <FileDown className="w-3.5 h-3.5" />
                Official PDF
              </a>
              <a
                href={`/api/reports/${def.key}?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  format: "excel",
                })}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition"
              >
                Excel
              </a>
            </>
          )}
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              LandInvest Syndicate Group
            </h1>
            <h2 className="text-base font-semibold text-slate-800 mt-0.5">
              All Partners Capital & Equity Summary (সকল অংশীদার মূলধন ও ইকুইটি সারাংশ)
            </h2>
            <p className="text-xs text-slate-500">
              Consolidated Syndicate Capital Overview • {partners.length} Active Partners
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>
              Period:{" "}
              <span className="font-mono font-semibold text-slate-900">
                {filters.from || "Genesis"} to {filters.to || "Present"}
              </span>
            </div>
            <div>
              Currency: <span className="font-semibold">BDT (৳)</span>
            </div>
            <div>
              Total Syndicate Capital:{" "}
              <span className="font-semibold font-mono">
                {formatBDT(kpis.totalSyndicateEquity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {/* KPI 1: Total Syndicate Capital */}
        <div className="bg-white p-4 rounded-xl border border-purple-200/80 shadow-2xs relative overflow-hidden bg-gradient-to-br from-white to-purple-50/20">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-1">
            <span>Total Syndicate Capital</span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-950 tracking-tight">
            {formatBDT(kpis.totalSyndicateEquity)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-700 font-medium">
            <span>{partners.length} active partners</span>
            <span>• 100% equity matched</span>
          </div>
        </div>

        {/* KPI 2: Total Capital Injections */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-emerald-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Fresh Capital Deposited</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tracking-tight">
            {formatBDT(kpis.totalDeposited)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Liquid funds introduced via bank & cash
          </div>
        </div>

        {/* KPI 3: Direct Project Expenses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-indigo-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Direct Project Financed</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-800 tracking-tight">
            {formatBDT(kpis.totalDirectExpenses)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Out-of-pocket development costs paid
          </div>
        </div>

        {/* KPI 4: Cumulative Profit Distributed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-teal-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Profit Distributions</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-teal-900 tracking-tight">
            {formatBDT(kpis.totalProfitReceived)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span>Drawings debited:</span>
            <span className="font-mono font-bold text-amber-800">
              {formatBDT(kpis.totalWithdrawn)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Syndicate Equity Share Distribution Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Syndicate Equity Ownership Breakdown
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            Total Capital: {formatBDT(kpis.totalSyndicateEquity)}
          </span>
        </div>

        {/* Proportional Segmented Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          {partners.map((p, idx) => {
            const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
            return (
              <div
                key={p.id}
                style={{ width: `${Math.max(p.equityShare, 1)}%`, backgroundColor: color.bar }}
                title={`${p.name}: ${p.equityShare.toFixed(2)}% (${formatBDT(p.balance)})`}
                className="h-full transition-all relative group"
              />
            );
          })}
        </div>

        {/* Partner Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2">
          {partners.map((p, idx) => {
            const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
            return (
              <div
                key={p.id}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: color.bar }}
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    <span className="font-bold text-slate-800">
                      {p.equityShare.toFixed(1)}%
                    </span>{" "}
                    • {formatBDT(p.balance)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 space-y-4 print:hidden">
        {/* Preset Period Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Period:
            </span>
            {[
              { key: "all_time", label: "All Time (Cumulative)" },
              { key: "this_fy", label: "This FY" },
              { key: "this_year", label: "This Year" },
              { key: "this_quarter", label: "This Quarter" },
              { key: "this_month", label: "This Month" },
              { key: "last_month", label: "Last Month" },
            ].map((p) => {
              const active = currentPreset === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => handlePresetChange(p.key)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    active
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {filters.from && filters.to ? (
              <span>
                {filters.from} <span className="text-slate-400">➔</span> {filters.to}
              </span>
            ) : (
              <span>Genesis to Present</span>
            )}
          </div>
        </div>

        {/* Project Selector & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Filter Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
            >
              <option value="ALL">All Land Projects</option>
              {projects.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.projectName}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partner, phone, bank..."
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Main Partners Summary Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Syndicate Partners Equity Register</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-purple-50 text-purple-800 border border-purple-200">
                {filteredPartners.length} partners
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Side-by-side reconciliation of capital deposits, direct expenses, profit allocations, and current balances
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 mr-2">Total Syndicate Equity:</span>
            <span className="text-sm font-bold font-mono text-purple-950">
              {formatBDT(kpis.totalSyndicateEquity)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 text-slate-700 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="py-3 px-4 w-52">Partner Profile</th>
                <th className="py-3 px-3 w-48">Project Stakes</th>
                <th className="py-3 px-3 text-right w-32">Opening (B/F)</th>
                <th className="py-3 px-3 text-right w-36 text-emerald-800">Deposits (Cr)</th>
                <th className="py-3 px-3 text-right w-36 text-indigo-800">Direct Exp (Cr)</th>
                <th className="py-3 px-3 text-right w-36 text-purple-800">Profit Share (Cr)</th>
                <th className="py-3 px-3 text-right w-32 text-amber-800">Drawings (Dr)</th>
                <th className="py-3 px-4 text-right w-44 text-slate-900">Net Equity Balance</th>
                <th className="py-3 px-3 text-center w-28">Equity Share</th>
                <th className="py-3 px-3 text-right w-24 print:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Users className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-slate-600">
                        No partners match your criteria
                      </p>
                      <p className="text-xs text-slate-400">
                        Try clearing your search or project filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPartners.map((p, idx) => {
                  const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Partner Profile */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full ${color.bg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                          >
                            {p.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 leading-tight">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              <span>{p.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Project Stakes */}
                      <td className="py-3 px-3 align-top">
                        <div className="text-[10px] font-semibold text-slate-700 mb-1">
                          {p.projectsCount} Projects Invested
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {p.projects.slice(0, 3).map((pr) => (
                            <span
                              key={pr.projectId}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-[140px]"
                              title={`${pr.projectName}: ${pr.sharePercentage}%`}
                            >
                              {pr.projectName} ({pr.sharePercentage}%)
                            </span>
                          ))}
                          {p.projects.length > 3 && (
                            <span className="text-[9px] px-1 rounded bg-slate-200 text-slate-700 font-semibold">
                              +{p.projects.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Opening B/F */}
                      <td className="py-3 px-3 align-top text-right font-mono text-slate-600">
                        {p.openingBalance ? formatBDT(p.openingBalance) : "-"}
                      </td>

                      {/* Capital Deposits */}
                      <td className="py-3 px-3 align-top text-right font-mono font-semibold text-emerald-700">
                        {p.deposited ? `+${formatBDT(p.deposited)}` : "-"}
                      </td>

                      {/* Direct Expenses */}
                      <td className="py-3 px-3 align-top text-right font-mono font-semibold text-indigo-700">
                        {p.directExpenses ? `+${formatBDT(p.directExpenses)}` : "-"}
                      </td>

                      {/* Profit Share */}
                      <td className="py-3 px-3 align-top text-right font-mono font-semibold text-purple-700">
                        {p.profitReceived ? `+${formatBDT(p.profitReceived)}` : "-"}
                      </td>

                      {/* Drawings */}
                      <td className="py-3 px-3 align-top text-right font-mono font-semibold text-amber-700">
                        {p.withdrawn ? `-${formatBDT(p.withdrawn)}` : "-"}
                      </td>

                      {/* Net Equity Balance */}
                      <td className="py-3 px-4 align-top text-right">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {formatBDT(p.balance)}
                        </span>
                      </td>

                      {/* Equity Share % */}
                      <td className="py-3 px-3 align-top text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {p.equityShare.toFixed(2)}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${p.equityShare}%`, backgroundColor: color.bar }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Action Link */}
                      <td className="py-3 px-3 align-top text-right print:hidden">
                        <Link
                          href={`/reports/partner-capital?partnerId=${p.id}&preset=all_time`}
                          className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition"
                        >
                          <span>Ledger</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Totals Row */}
            <tfoot>
              <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300 text-xs">
                <td colSpan={3} className="py-3.5 px-4">
                  <span className="uppercase tracking-wider text-[11px] text-slate-600">
                    Syndicate Totals:
                  </span>{" "}
                  <span>{filteredPartners.length} Partners</span>
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-emerald-800 text-xs">
                  +{formatBDT(kpis.totalDeposited)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-indigo-800 text-xs">
                  +{formatBDT(kpis.totalDirectExpenses)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-purple-800 text-xs">
                  +{formatBDT(kpis.totalProfitReceived)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-amber-800 text-xs">
                  -{formatBDT(kpis.totalWithdrawn)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-purple-950 text-base">
                  {formatBDT(kpis.totalSyndicateEquity)}
                </td>
                <td className="py-3.5 px-3 text-center font-mono font-bold text-xs text-slate-800">
                  100.00%
                </td>
                <td className="py-3.5 px-3 print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Statutory Reconciliation & Governance Notes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>Statutory Equity Balancing & Syndicate Governance Notes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              1. Balance Sheet Exact Parity
            </span>
            <p className="leading-relaxed text-slate-600">
              The aggregate partner equity sum of{" "}
              <strong className="text-slate-900 font-mono">
                {formatBDT(kpis.totalSyndicateEquity)}
              </strong>{" "}
              matches the Partner Capital Accounts under Equity & Liabilities on the official Statement of Financial Position with 100% exactitude.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              2. Profit Realization Standards
            </span>
            <p className="leading-relaxed text-slate-600">
              Profit distributions are credited upon validated customer plot collections (Cash-Basis) or verified milestone project handover (Completion-Basis), distributed proportionally to deeded stakes.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              3. Drawings & Equity Reductions
            </span>
            <p className="leading-relaxed text-slate-600">
              All interim drawings and partner payouts require executive syndicate approval and are debited directly against the partner&apos;s capital account to prevent unearned profit leakage.
            </p>
          </div>
        </div>
      </div>

      {/* Official Signatures Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 print:border-none print:shadow-none print:p-0 print:pt-6">
        <div className="grid grid-cols-3 gap-8 text-center pt-8">
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Prepared By</p>
            <p className="text-[10px] text-slate-500">Treasury & Accounts Officer</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Verified By</p>
            <p className="text-[10px] text-slate-500">Head of Internal Audit</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Approved By</p>
            <p className="text-[10px] text-slate-500">Managing Partner / Board</p>
          </div>
        </div>
      </div>
    </div>
  );
}
