"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatBDT } from "@/lib/format";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  PartnerContributionData,
  ProjectContributionGroup,
  ProjectPartnerContributionItem,
} from "@/lib/reports/partner-contribution";
import {
  Building2,
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
  AlertCircle,
  Phone,
  Briefcase,
  ChevronRight,
  Layers,
  MapPin,
  ExternalLink,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: PartnerContributionData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
    partnerId?: string;
  };
  projects?: { id: string; projectName: string }[];
  canExport?: boolean;
}

const PARTNER_COLORS = [
  { bg: "bg-indigo-600", text: "text-indigo-700", border: "border-indigo-200", light: "bg-indigo-50", hex: "#4f46e5" },
  { bg: "bg-emerald-600", text: "text-emerald-700", border: "border-emerald-200", light: "bg-emerald-50", hex: "#059669" },
  { bg: "bg-amber-600", text: "text-amber-700", border: "border-amber-200", light: "bg-amber-50", hex: "#d97706" },
  { bg: "bg-blue-600", text: "text-blue-700", border: "border-blue-200", light: "bg-blue-50", hex: "#2563eb" },
  { bg: "bg-purple-600", text: "text-purple-700", border: "border-purple-200", light: "bg-purple-50", hex: "#9333ea" },
  { bg: "bg-rose-600", text: "text-rose-700", border: "border-rose-200", light: "bg-rose-50", hex: "#e11d48" },
];

export default function PartnerContributionView({
  def,
  data,
  filters,
  projects = [],
  canExport = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeProjectTab, setActiveProjectTab] = useState<string>(filters.projectId || "ALL");
  const [varianceFilter, setVarianceFilter] = useState<string>("ALL");

  const { projects: projectGroups = [], kpis } = data;

  const handleProjectTabChange = (projId: string) => {
    setActiveProjectTab(projId);
    const sp = new URLSearchParams(searchParams.toString());
    if (projId === "ALL") {
      sp.delete("projectId");
    } else {
      sp.set("projectId", projId);
    }
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  // Filter projects by active tab and search query
  const displayedProjects = useMemo(() => {
    return projectGroups
      .filter((pg) => {
        if (activeProjectTab !== "ALL" && pg.projectId !== activeProjectTab) {
          return false;
        }
        return true;
      })
      .map((pg) => {
        let partners = pg.partners;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          partners = partners.filter(
            (p) =>
              p.partnerName.toLowerCase().includes(q) ||
              p.partnerPhone.toLowerCase().includes(q)
          );
        }
        if (varianceFilter === "SURPLUS") {
          partners = partners.filter((p) => p.varianceStatus === "SURPLUS");
        } else if (varianceFilter === "DEFICIT") {
          partners = partners.filter((p) => p.varianceStatus === "DEFICIT");
        }
        return {
          ...pg,
          partners,
        };
      })
      .filter((pg) => pg.partners.length > 0 || !searchQuery.trim());
  }, [projectGroups, activeProjectTab, searchQuery, varianceFilter]);

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
              Partners & Capital
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {def.titleEn}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {def.titleBn} · Project-by-project equity commitments, out-of-pocket development funding, and variance equalizations.
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

      {/* 2. Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Syndicate Project Cost */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Syndicate Project Assets
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {formatBDT(kpis.totalSyndicateProjectCost)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{kpis.activeProjectsCount} Total Projects</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">100% Capitalized</span>
          </div>
        </div>

        {/* KPI 2: Land Acquisition Capital */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Land Acquisition
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400">
              {formatBDT(kpis.totalAcquisitionCost)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Registered Deeds & Taxes</span>
            <span className="font-mono font-medium text-emerald-600">
              {((kpis.totalAcquisitionCost / (kpis.totalSyndicateProjectCost || 1)) * 100).toFixed(1)}% of Assets
            </span>
          </div>
        </div>

        {/* KPI 3: Site Development & Civil Works */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Site Dev & Expenses
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-blue-700 dark:text-blue-400">
              {formatBDT(kpis.totalDevelopmentCost)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Civil Works, Earthwork & Survey</span>
            <span className="font-mono font-medium text-blue-600">
              {((kpis.totalDevelopmentCost / (kpis.totalSyndicateProjectCost || 1)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* KPI 4: Direct Out-of-Pocket Partner Funding */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Direct Partner Paid
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg text-amber-600 dark:text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-amber-700 dark:text-amber-400">
              {formatBDT(kpis.totalDirectPartnerFunded)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Treasury: {formatBDT(kpis.totalTreasuryFunded)}</span>
            <span className="font-semibold text-amber-600">
              {kpis.participatingPartnersCount} Partners Active
            </span>
          </div>
        </div>
      </div>

      {/* 3. Project Selector Tabs Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => handleProjectTabChange("ALL")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeProjectTab === "ALL"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            All Projects ({projectGroups.length})
          </button>
          {projectGroups.map((pg) => {
            const isSelected = activeProjectTab === pg.projectId;
            return (
              <button
                key={pg.projectId}
                onClick={() => handleProjectTabChange(pg.projectId)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{pg.projectName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {pg.partners.length} partners
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Search and Secondary Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm print:hidden">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partner name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Variance Standing:</span>
          <select
            value={varianceFilter}
            onChange={(e) => setVarianceFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Standings</option>
            <option value="SURPLUS">Surplus (Direct Paid &gt; Share)</option>
            <option value="DEFICIT">Deficit (Under-contributed)</option>
          </select>
        </div>
      </div>

      {/* 5. Project Cards with Detailed Contributions */}
      <div className="space-y-6">
        {displayedProjects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No project contributions match your search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your project selection, search query, or variance filters.
            </p>
          </div>
        ) : (
          displayedProjects.map((proj) => {
            return (
              <div
                key={proj.projectId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Project Header Banner */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          {proj.status}
                        </span>
                        {proj.totalAreaShotok > 0 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {proj.totalAreaShotok.toFixed(2)} Shotok Land Area
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {proj.projectName}
                      </h2>
                    </div>

                    {/* Quick Financial Snapshot Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Cost</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {formatBDT(proj.totalProjectCost)}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Land Acquisition</span>
                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatBDT(proj.acquisitionCost)}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Site Dev Vouchers</span>
                        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {formatBDT(proj.developmentExpenses)}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Direct Partner Paid</span>
                        <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                          {formatBDT(proj.directPartnerFunding)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Equity Ownership Distribution Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        Equity Ownership Ratio (Deed Allocation):
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {proj.partners.length} Partner Staking
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      {proj.partners.map((partner, idx) => {
                        const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
                        return (
                          <div
                            key={partner.partnerId}
                            style={{ width: `${partner.sharePercentage}%`, backgroundColor: color.hex }}
                            className="h-full transition-all relative group"
                            title={`${partner.partnerName}: ${partner.sharePercentage.toFixed(2)}%`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap text-xs">
                      {proj.partners.map((partner, idx) => {
                        const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
                        return (
                          <div key={partner.partnerId} className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {partner.partnerName}
                            </span>
                            <span className="font-mono text-slate-500 text-[11px]">
                              {partner.sharePercentage.toFixed(2)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Table of Partners in this Project */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Partner Details</th>
                        <th className="py-3 px-3 text-center">Share %</th>
                        <th className="py-3 px-4 text-right">Required Commitment</th>
                        <th className="py-3 px-4 text-right">Direct Expense Paid</th>
                        <th className="py-3 px-4 text-right">Treasury Allocated</th>
                        <th className="py-3 px-4 text-right">Total Contributed</th>
                        <th className="py-3 px-4 text-center">Settlement Status</th>
                        <th className="py-3 px-4 text-right">Profit Distributed</th>
                        <th className="py-3 px-3 text-center print:hidden">Ledger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {proj.partners.map((partner, pIdx) => {
                        const color = PARTNER_COLORS[pIdx % PARTNER_COLORS.length];
                        return (
                          <tr
                            key={partner.partnerId}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color.hex }}
                                />
                                {partner.partnerName}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {partner.partnerPhone}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                              {partner.sharePercentage.toFixed(2)}%
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-slate-900 dark:text-white font-medium">
                              {formatBDT(partner.budgetedShare)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-semibold text-amber-700 dark:text-amber-400">
                              {partner.directExpensesPaid > 0 ? (
                                <span>{formatBDT(partner.directExpensesPaid)}</span>
                              ) : (
                                <span className="text-slate-400">৳ 0.00</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                              {formatBDT(partner.treasuryCapitalShare)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                              {formatBDT(partner.totalContribution)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {partner.varianceStatus === "SURPLUS" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Surplus (+{formatBDT(partner.variance)})
                                </span>
                              ) : partner.varianceStatus === "DEFICIT" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                  <AlertCircle className="w-3 h-3" />
                                  Deficit ({formatBDT(partner.variance)})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  Balanced
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-medium text-purple-700 dark:text-purple-400">
                              {partner.profitReceived > 0 ? (
                                formatBDT(partner.profitReceived)
                              ) : (
                                <span className="text-slate-400">৳ 0.00</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center print:hidden">
                              <Link
                                href={`/reports/partner-capital?partnerId=${partner.partnerId}`}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                                title="View Partner Capital Ledger"
                              >
                                View <ExternalLink className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-100/90 dark:bg-slate-800/90 font-bold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                      <tr>
                        <td className="py-3 px-4">
                          Project Subtotal ({proj.projectName})
                        </td>
                        <td className="py-3 px-3 text-center font-mono">100.00%</td>
                        <td className="py-3 px-4 text-right font-mono">
                          {formatBDT(proj.totalProjectCost)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-amber-700 dark:text-amber-400">
                          {formatBDT(proj.directPartnerFunding)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                          {formatBDT(proj.treasuryFunding)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          {formatBDT(proj.totalProjectCost)}
                        </td>
                        <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 text-[11px]">
                          ✔ Balanced
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-purple-700 dark:text-purple-400">
                          {formatBDT(proj.totalProfitDistributed)}
                        </td>
                        <td className="py-3 px-3 print:hidden"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Statutory Partnership Accounting & Variance Equalization Card */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Statutory Partnership Accounting & Cost Equalization Standard
            </h4>
            <p className="leading-relaxed">
              In accordance with Section 13(b) of the Partnership Act, 1932, and the Syndicate Project Joint Venture Agreements, each partner is bound to contribute towards losses and capital commitments in proportion to their registered equity percentage.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Direct Project Expenditure:</strong> Any approved vendor invoice or development cost settled directly by a partner from personal funds is credited directly to their capital equity, reducing their net cash-call obligations.
              </li>
              <li>
                <strong>Surplus / Deficit Standing:</strong> A partner in <em>Surplus</em> has over-contributed out-of-pocket development funding relative to their agreed percentage, entitling them to first-lien equalization from future land sales proceeds or inter-partner adjustments.
              </li>
              <li>
                <strong>Treasury Capital Allocation:</strong> Centralized land acquisition disbursements from the syndicate bank and cash accounts are apportioned strictly according to equity shares.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7. Official 3-Tier Signature Block */}
      <div className="hidden print:grid grid-cols-3 gap-8 pt-10 text-center text-xs text-slate-600 border-t border-slate-300">
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Prepared By (Project Accounts)</p>
          <p className="text-[10px] text-slate-500">Project Accountant / Cost Controller</p>
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
