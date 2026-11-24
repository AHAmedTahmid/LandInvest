"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { ProfitAllocationResult, PartnerAllocationDetail } from "@/lib/reports/profit-allocation";
import {
  PieChart,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building2,
  FileDown,
  Printer,
  Coins,
  ChevronRight,
  X,
  User,
  Phone,
  Mail,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  ExternalLink,
  Award,
  Scale,
  CheckCircle2,
} from "lucide-react";

interface ProfitAllocationViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: ProfitAllocationResult;
  filters: {
    projectId?: string;
    from?: string;
    to?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function ProfitAllocationView({
  def,
  data,
  filters,
  projects,
  canExport = true,
}: ProfitAllocationViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    filters.projectId || data?.projectSummary?.projectId || (projects[0]?.id ?? "")
  );
  const [activePartner, setActivePartner] = useState<PartnerAllocationDetail | null>(null);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const kpis = data?.kpis || {
    totalProjectRevenue: 0,
    totalProjectCost: 0,
    grossProjectProfit: 0,
    statutoryReserveAmount: 0,
    netDistributableProfit: 0,
    totalDisbursedToDate: 0,
    totalPendingSurplus: 0,
    partnersCount: 0,
    effectiveRealizationRate: 0,
    basis: "INVOICED_BASIS",
  };

  const projectSummary = data?.projectSummary || {
    projectId: "",
    projectName: "Select a Project",
    projectLocation: "-",
    mouza: "-",
    status: "ACTIVE",
    grossAreaShotok: 0,
    totalAgreedSales: 0,
    totalCashCollected: 0,
    totalApprovedExpenses: 0,
    netProfitInvoiced: 0,
    netProfitCash: 0,
  };

  const partnerAllocations = data?.partnerAllocations || [];

  const handleCopyNotice = (partner: PartnerAllocationDetail) => {
    const text = `LANDINVEST PROFIT ALLOCATION ADVICE\nProject: ${projectSummary.projectName}\nPartner: ${partner.partnerName}\nSyndicate Equity Share: ${partner.sharePercentage}%\nGross Entitlement: ${formatBDT(partner.grossEntitlement)}\nStatutory Contingency Reserve (5%): ${formatBDT(partner.statutoryReserve)}\nNet Distributable Dividend: ${formatBDT(partner.netAllocated)}\nDisbursed to Date: ${formatBDT(partner.historicallyPaid)}\nRemaining Pending Surplus: ${formatBDT(partner.pendingSurplus)}\nStatus: ${partner.statusLabelEn}\nOfficial Commercial Treasury Distribution Record.`;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              <PieChart className="w-3.5 h-3.5 text-purple-600" />
              SYNDICATE CAPITAL & PROFIT ALLOCATION DIVISION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {def.titleEn} <span className="font-normal text-slate-500 text-lg">({def.titleBn})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Project equity syndication model, statutory contingency reserves, partner dividend entitlement, and historical disbursement tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            ← Back to Reports
          </Link>
          {canExport && (
            <>
              <a
                href={`/api/reports/${def.key}?format=pdf&projectId=${selectedProjectId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                Export Landscape PDF
              </a>
              <a
                href={`/api/reports/${def.key}?format=excel&projectId=${selectedProjectId}`}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                Excel (XLS)
              </a>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* 2. Project Selector & Syndication Scope Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-slate-400" />
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Active Project Syndicate
            </label>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {projectSummary.projectName} <span className="text-slate-400 font-normal">({projectSummary.projectLocation})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              window.location.href = `/reports/profit-allocation?projectId=${e.target.value}`;
            }}
            className="px-3.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-sm"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName}
              </option>
            ))}
          </select>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            {kpis.basis === "CASH_BASIS" ? "Cash Realized Basis" : "Invoiced Accrual Basis"}
          </span>
        </div>
      </div>

      {/* 3. Top 4 Macro KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Audited Net Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Audited Net Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
              {formatBDT(kpis.grossProjectProfit)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Revenue: {formatBDT(kpis.totalProjectRevenue)}</span>
              <span>Cost: {formatBDT(kpis.totalProjectCost)}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Statutory Reserve Retained */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contingency Reserve (5%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
              {formatBDT(kpis.statutoryReserveAmount)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Retained in Treasury</span>
              <span className="font-semibold text-amber-600">5.0% Statutory Buffer</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Net Distributable Pool */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Distributable Pool (95%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-purple-700">
              {formatBDT(kpis.netDistributableProfit)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Allocable to Syndicate</span>
              <span className="font-semibold text-purple-600">{kpis.partnersCount} Equity Partners</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Disbursed to Date & Realization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Disbursed Dividend Payout
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-blue-700">
              {formatBDT(kpis.totalDisbursedToDate)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Pending Surplus</span>
              <span className="font-mono font-bold text-slate-800">{formatBDT(kpis.totalPendingSurplus)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Financial Distributable Pool Waterfall */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Project Profit Waterfall & Allocation Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited conversion of gross development proceeds into net equity distributions after statutory retention.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {projectSummary.grossAreaShotok} Shotok Total Area
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">1. Contracted Book Value</span>
            <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
              {formatBDT(projectSummary.totalAgreedSales)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">2. Capitalized Expenses</span>
            <span className="text-sm font-bold font-mono text-rose-700 mt-1 block">
              - {formatBDT(projectSummary.totalApprovedExpenses)}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 block text-[11px] font-semibold">3. Net Project Profit</span>
            <span className="text-sm font-bold font-mono text-emerald-800 mt-1 block">
              {formatBDT(kpis.grossProjectProfit)}
            </span>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
            <span className="text-amber-700 block text-[11px] font-semibold">4. Statutory Reserve (5%)</span>
            <span className="text-sm font-bold font-mono text-amber-800 mt-1 block">
              - {formatBDT(kpis.statutoryReserveAmount)}
            </span>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200">
            <span className="text-purple-700 block text-[11px] font-semibold">5. Distributable Dividend</span>
            <span className="text-sm font-bold font-mono text-purple-800 mt-1 block">
              {formatBDT(kpis.netDistributableProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Master Partner Equity & Allocation Ledger */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Partner Equity Shares & Allocation Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual partner entitlement based on signed syndicate equity ratios and audited profit disbursals.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
            {partnerAllocations.length} Syndicate Partners
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Equity Partner</th>
                <th className="py-3 px-3 text-center">Share %</th>
                <th className="py-3 px-3 text-right">Gross Entitlement (৳)</th>
                <th className="py-3 px-3 text-right">Reserve Share (৳)</th>
                <th className="py-3 px-3 text-right">Net Distributable (৳)</th>
                <th className="py-3 px-3 text-right">Disbursed to Date (৳)</th>
                <th className="py-3 px-3 text-right">Pending Surplus (৳)</th>
                <th className="py-3 px-3 text-center">Payout Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {partnerAllocations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No partner equity allocations registered for this project.
                  </td>
                </tr>
              ) : (
                partnerAllocations.map((pa) => (
                  <tr
                    key={pa.partnerId}
                    onClick={() => setActivePartner(pa)}
                    className="hover:bg-purple-50/30 cursor-pointer transition-colors group"
                  >
                    {/* Partner Name & Phone */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 group-hover:text-purple-700">
                        {pa.partnerName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{pa.partnerPhone}</div>
                    </td>

                    {/* Share % */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                        {pa.sharePercentage.toFixed(1)}%
                      </span>
                    </td>

                    {/* Gross Entitlement */}
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                      {formatBDT(pa.grossEntitlement)}
                    </td>

                    {/* Reserve Share */}
                    <td className="py-3 px-3 text-right font-mono text-amber-700">
                      {formatBDT(pa.statutoryReserve)}
                    </td>

                    {/* Net Distributable */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-purple-700 bg-purple-50/20">
                      {formatBDT(pa.netAllocated)}
                    </td>

                    {/* Disbursed to Date */}
                    <td className="py-3 px-3 text-right font-mono font-semibold text-blue-700">
                      {formatBDT(pa.historicallyPaid)}
                    </td>

                    {/* Pending Surplus */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                      {formatBDT(pa.pendingSurplus)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      {pa.status === "FULLY_PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Fully Disbursed
                        </span>
                      ) : pa.status === "PARTIALLY_PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <Coins className="w-3 h-3 text-blue-600" />
                          Partially Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Pending Payout
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActivePartner(pa)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                      >
                        <Award className="w-3 h-3" />
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer */}
            {partnerAllocations.length > 0 && (
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td className="py-3 px-3 uppercase tracking-wider">Total Syndicate (100.0%)</td>
                  <td className="py-3 px-3 text-center font-mono">100.0%</td>
                  <td className="py-3 px-3 text-right font-mono">{formatBDT(kpis.grossProjectProfit)}</td>
                  <td className="py-3 px-3 text-right font-mono text-amber-400">{formatBDT(kpis.statutoryReserveAmount)}</td>
                  <td className="py-3 px-3 text-right font-mono text-purple-300">{formatBDT(kpis.netDistributableProfit)}</td>
                  <td className="py-3 px-3 text-right font-mono text-blue-300">{formatBDT(kpis.totalDisbursedToDate)}</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400">{formatBDT(kpis.totalPendingSurplus)}</td>
                  <td colSpan={2} className="py-3 px-3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* 6. Interactive Partner Dividend Dossier Modal */}
      {activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 font-bold text-sm">
                  {activePartner.partnerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {activePartner.partnerName}
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {activePartner.sharePercentage}% Share
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {projectSummary.projectName} · Equity Syndicate Partner Dossier
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePartner(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Partner Profile Strip */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Phone</span>
                  <span className="font-semibold text-slate-800 font-mono">{activePartner.partnerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-800">{activePartner.partnerEmail}</span>
                </div>
              </div>

              {/* Financial Allocation Box */}
              <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-200 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-900 pb-1.5 border-b border-purple-200">
                  Dividend Entitlement Calculation
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Gross Profit Entitlement ({activePartner.sharePercentage}% of {formatBDT(kpis.grossProjectProfit)}):</span>
                  <span className="font-mono font-bold text-slate-900">{formatBDT(activePartner.grossEntitlement)}</span>
                </div>
                <div className="flex justify-between items-center text-amber-700">
                  <span>Less: 5% Statutory Contingency Retention:</span>
                  <span className="font-mono font-semibold">- {formatBDT(activePartner.statutoryReserve)}</span>
                </div>
                <div className="flex justify-between items-center text-purple-800 font-bold pt-2 border-t border-purple-200 text-sm">
                  <span>Net Distributable Dividend Pool:</span>
                  <span className="font-mono">{formatBDT(activePartner.netAllocated)}</span>
                </div>
              </div>

              {/* Disbursement History */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center justify-between">
                  <span>Audited Disbursement History</span>
                  <span className="font-mono font-semibold text-blue-700">
                    Paid: {formatBDT(activePartner.historicallyPaid)}
                  </span>
                </div>
                {activePartner.distributionHistory.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 text-center">
                    No disbursement transactions executed to date for this partner.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {activePartner.distributionHistory.map((h, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between bg-white text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-slate-700">{formatDate(h.date)}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {h.basis}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-emerald-700">
                          {formatBDT(h.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remaining Surplus Notice */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
                    Remaining Distributable Surplus
                  </span>
                  <span className="text-xs text-emerald-600">Available for next scheduled tranche</span>
                </div>
                <div className="text-lg font-bold font-mono text-emerald-700">
                  {formatBDT(activePartner.pendingSurplus)}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleCopyNotice(activePartner)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
              >
                {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedNotice ? "Copied Advice!" : "Copy Dividend Advice"}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/reports/partner-capital?partnerId=${activePartner.partnerId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-300 transition-colors"
                >
                  Capital Ledger →
                </Link>
                <button
                  onClick={() => setActivePartner(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
