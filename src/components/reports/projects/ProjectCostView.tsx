"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatBDT } from "@/lib/format";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  ProjectCostReportData,
  ProjectCostSummary,
  ProjectCostItem,
} from "@/lib/reports/project-cost";
import {
  Building2,
  Layers,
  MapPin,
  TrendingUp,
  Receipt,
  FileDown,
  Printer,
  ArrowLeft,
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  Grid3X3,
  Coins,
  Percent,
  SlidersHorizontal,
  FolderKanban,
  FileText,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: ProjectCostReportData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
  };
  projects?: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function ProjectCostView({
  def,
  data,
  filters,
  projects = [],
  canExport = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { selectedProject, allProjectsList = [], portfolioKpis } = data;
  const [activeTab, setActiveTab] = useState<"cost_statement" | "vouchers">("cost_statement");
  const [voucherSearch, setVoucherSearch] = useState("");

  const handleProjectChange = (projId: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("projectId", projId);
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter vouchers by search
  const filteredVouchers = useMemo(() => {
    if (!voucherSearch.trim()) return selectedProject.vouchers;
    const q = voucherSearch.toLowerCase();
    return selectedProject.vouchers.filter(
      (v) =>
        v.category.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        (v.paidByPartnerName && v.paidByPartnerName.toLowerCase().includes(q))
    );
  }, [selectedProject.vouchers, voucherSearch]);

  const acqPct = selectedProject.totalProjectCost > 0
    ? (selectedProject.totalAcquisitionCost / selectedProject.totalProjectCost) * 100
    : 0;
  const devPct = selectedProject.totalProjectCost > 0
    ? (selectedProject.totalDevelopmentCost / selectedProject.totalProjectCost) * 100
    : 0;

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
            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {def.titleEn}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {def.titleBn} · Capitalized acquisition deed costs, civil development infrastructure, and gross/net shotok unit economics.
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
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {formatBDT(proj.totalCost)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Project Cost */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Capitalized Cost
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {formatBDT(selectedProject.totalProjectCost)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Acq: {formatBDT(selectedProject.totalAcquisitionCost)}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Dev: {formatBDT(selectedProject.totalDevelopmentCost)}
            </span>
          </div>
        </div>

        {/* KPI 2: Gross Cost per Shotok */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Gross Cost / Shotok
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400">
              {formatBDT(selectedProject.grossCostPerShotok)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Across Gross Land Area</span>
            <span className="font-mono font-medium text-emerald-600">
              {selectedProject.totalGrossAreaShotok.toFixed(2)} Shotok
            </span>
          </div>
        </div>

        {/* KPI 3: Net Saleable Cost per Shotok */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Saleable Cost / Shotok
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-blue-700 dark:text-blue-400">
              {formatBDT(selectedProject.saleableCostPerShotok)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Road & Infra Loaded</span>
            <span className="font-mono font-medium text-blue-600">
              {selectedProject.totalSaleableAreaShotok.toFixed(2)} Net Shotok
            </span>
          </div>
        </div>

        {/* KPI 4: Land Efficiency & Plot Capacity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Efficiency & Inventory
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg text-amber-600 dark:text-amber-400">
              <Grid3X3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono tracking-tight text-amber-700 dark:text-amber-400">
              {selectedProject.efficiencyRatio.toFixed(1)}% Saleable
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{selectedProject.totalPlotsCount} Plots Demarcated</span>
            <span className="font-semibold text-amber-600">
              {selectedProject.infrastructureAreaShotok.toFixed(1)} Shotok Roads
            </span>
          </div>
        </div>
      </div>

      {/* 4. Project Cadastral & Legal Identity Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {selectedProject.status}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Mouza: <strong>{selectedProject.mouza}</strong>
                {selectedProject.jlNumber && ` (JL #${selectedProject.jlNumber})`}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {selectedProject.projectName}
            </h2>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
              <span><strong>Dag Numbers:</strong> {selectedProject.dagNumbers || "N/A"}</span>
              <span><strong>Khatian Numbers:</strong> {selectedProject.khatianNumbers || "N/A"}</span>
            </div>
          </div>

          {/* Allocation Split Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Capital Allocation</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Acq: {acqPct.toFixed(1)}% · Dev: {devPct.toFixed(1)}%
              </span>
            </div>
            <div className="w-36 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${acqPct}%` }}
                className="bg-emerald-600 h-full"
                title={`Acquisition: ${acqPct.toFixed(1)}%`}
              />
              <div
                style={{ width: `${devPct}%` }}
                className="bg-blue-600 h-full"
                title={`Development: ${devPct.toFixed(1)}%`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. View Switcher Tabs (Cost Statement vs Vouchers) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <button
          onClick={() => setActiveTab("cost_statement")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "cost_statement"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Cost Statement & Breakdown
        </button>
        <button
          onClick={() => setActiveTab("vouchers")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "vouchers"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          Expense Vouchers ({selectedProject.vouchers.length})
        </button>
      </div>

      {activeTab === "cost_statement" ? (
        <div className="space-y-6">
          {/* SECTION A: LAND ACQUISITION CAPITAL */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Section A: Land Acquisition Capital Cost
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Deed consideration, sub-registry registration, government stamp duty, and mutation taxes.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Section Subtotal</span>
                <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {formatBDT(selectedProject.totalAcquisitionCost)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Cost Category</th>
                    <th className="py-3 px-3 text-center">Vouchers</th>
                    <th className="py-3 px-4 text-right">Amount (BDT)</th>
                    <th className="py-3 px-3 text-right">% of Total</th>
                    <th className="py-3 px-4 text-right">Cost / Gross Shotok</th>
                    <th className="py-3 px-4 text-right">Cost / Net Shotok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedProject.acquisitionItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.category}</div>
                        <div className="text-[11px] text-slate-400">{item.categoryBn}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                        {item.voucherCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatBDT(item.amount)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {item.pctOfTotal.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                        {formatBDT(item.costPerGrossShotok)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-400 font-medium">
                        {formatBDT(item.costPerSaleableShotok)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50/30 dark:bg-emerald-950/10 font-bold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <tr>
                    <td className="py-3 px-4">Subtotal Land Acquisition</td>
                    <td className="py-3 px-3 text-center font-mono">
                      {selectedProject.acquisitionItems.reduce((s, r) => s + r.voucherCount, 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400">
                      {formatBDT(selectedProject.totalAcquisitionCost)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {acqPct.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400">
                      {formatBDT(selectedProject.totalGrossAreaShotok > 0 ? selectedProject.totalAcquisitionCost / selectedProject.totalGrossAreaShotok : 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-400">
                      {formatBDT(selectedProject.totalSaleableAreaShotok > 0 ? selectedProject.totalAcquisitionCost / selectedProject.totalSaleableAreaShotok : 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* SECTION B: CIVIL INFRASTRUCTURE & SITE DEVELOPMENT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Section B: Site Infrastructure & Civil Development Expenses
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Earth filling, internal roads, boundary walls, drainage, surveys, and project signage.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Section Subtotal</span>
                <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">
                  {formatBDT(selectedProject.totalDevelopmentCost)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Development Work Category</th>
                    <th className="py-3 px-3 text-center">Vouchers</th>
                    <th className="py-3 px-4 text-right">Amount (BDT)</th>
                    <th className="py-3 px-3 text-right">% of Total</th>
                    <th className="py-3 px-4 text-right">Cost / Gross Shotok</th>
                    <th className="py-3 px-4 text-right">Cost / Net Shotok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedProject.developmentItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No development vouchers recorded yet for this project.
                      </td>
                    </tr>
                  ) : (
                    selectedProject.developmentItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{item.category}</div>
                          <div className="text-[11px] text-slate-400">{item.categoryBn}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {item.voucherCount}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {formatBDT(item.amount)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                          {item.pctOfTotal.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                          {formatBDT(item.costPerGrossShotok)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-400 font-medium">
                          {formatBDT(item.costPerSaleableShotok)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-blue-50/30 dark:bg-blue-950/10 font-bold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <tr>
                    <td className="py-3 px-4">Subtotal Site Development</td>
                    <td className="py-3 px-3 text-center font-mono">
                      {selectedProject.developmentItems.reduce((s, r) => s + r.voucherCount, 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-400">
                      {formatBDT(selectedProject.totalDevelopmentCost)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {devPct.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400">
                      {formatBDT(selectedProject.totalGrossAreaShotok > 0 ? selectedProject.totalDevelopmentCost / selectedProject.totalGrossAreaShotok : 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-400">
                      {formatBDT(selectedProject.totalSaleableAreaShotok > 0 ? selectedProject.totalDevelopmentCost / selectedProject.totalSaleableAreaShotok : 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* GRAND TOTAL CAPITALIZED PROJECT COST */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                Total Capitalized Project Investment
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {selectedProject.projectName} (100.00% Capitalized)
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Gross Cost / Shotok</span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {formatBDT(selectedProject.grossCostPerShotok)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Saleable Cost / Shotok</span>
                <span className="font-mono text-sm font-bold text-blue-400">
                  {formatBDT(selectedProject.saleableCostPerShotok)}
                </span>
              </div>
              <div className="text-right pl-4 border-l border-slate-700">
                <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Total Cost</span>
                <span className="font-mono text-xl font-extrabold text-white">
                  {formatBDT(selectedProject.totalProjectCost)}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION C: PLOT INVENTORY & PROFITABILITY ECONOMICS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Plot Demarcation & Capital Recovery Economics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Plots Demarcated</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {selectedProject.totalPlotsCount} Plots
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {selectedProject.totalSaleableAreaShotok.toFixed(2)} Shotok Saleable
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Infrastructure Loss</span>
                <span className="font-mono text-base font-bold text-slate-700 dark:text-slate-300">
                  {selectedProject.infrastructureAreaShotok.toFixed(2)} Shotok
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {(100 - selectedProject.efficiencyRatio).toFixed(1)}% Road & Green Space
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Target Gross Revenue</span>
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {formatBDT(selectedProject.targetSalesValue)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Asking Price Inventory Total
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Projected Profit & ROI</span>
                <span className={`font-mono text-base font-bold ${selectedProject.projectedProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {formatBDT(selectedProject.projectedProfit)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {selectedProject.projectedMargin.toFixed(1)}% Projected Margin
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VOUCHERS LEDGER TAB */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Approved Vouchers Register: {selectedProject.projectName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Showing {filteredVouchers.length} verified site development vouchers.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search category, description..."
                value={voucherSearch}
                onChange={(e) => setVoucherSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-3 text-center">Channel</th>
                  <th className="py-3 px-4">Paid By Partner</th>
                  <th className="py-3 px-4 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No vouchers match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {v.expenseDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white">{v.category}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {v.description}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {v.paymentChannel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {v.paidByPartnerName ? (
                          <span className="text-amber-700 dark:text-amber-400 font-medium">
                            {v.paidByPartnerName}
                          </span>
                        ) : (
                          <span className="text-slate-400">Treasury / Bank</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatBDT(v.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Statutory Standard & Quantity Surveyor Note */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Real Estate Development & Quantity Surveying Compliance Standard
            </h4>
            <p className="leading-relaxed">
              In compliance with the Real Estate Development and Management Act, 2010 (Act No. 20 of 2010), and International Financial Reporting Standard IAS 2 (Inventories - Capitalization of Land Acquisition and Development Costs):
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Gross vs. Net Saleable Unit Economics:</strong> Land acquisition deeds and initial earthwork are measured across gross mouza acreage ({selectedProject.totalGrossAreaShotok.toFixed(2)} Shotok). Infrastructure spaces dedicated to internal access roads, surface drains, and green verges ({selectedProject.infrastructureAreaShotok.toFixed(2)} Shotok) are loaded directly into the cost basis of net saleable plot inventory ({selectedProject.totalSaleableAreaShotok.toFixed(2)} Shotok), reflecting an actual efficiency ratio of {selectedProject.efficiencyRatio.toFixed(1)}%.
              </li>
              <li>
                <strong>Voucher Corroboration:</strong> Every development expense is substantiated by an approved field measurement sheet, civil contractor bill, and formal payment voucher certified by the site engineer.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7. Official 3-Tier Signature Block */}
      <div className="hidden print:grid grid-cols-3 gap-8 pt-10 text-center text-xs text-slate-600 border-t border-slate-300">
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Prepared By (Cost Accounts)</p>
          <p className="text-[10px] text-slate-500">Project Quantity Surveyor</p>
        </div>
        <div>
          <div className="border-t border-slate-400 w-40 mx-auto mb-1.5"></div>
          <p className="font-semibold text-slate-900">Verified By (Internal Audit)</p>
          <p className="text-[10px] text-slate-500">Head of Audit & Compliance</p>
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
