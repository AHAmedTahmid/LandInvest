"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { ProfitHistoryResult, ProfitHistoryItem, TrancheRunSummary } from "@/lib/reports/profit-history";
import {
  History,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Search,
  Filter,
  FileDown,
  Printer,
  ChevronRight,
  X,
  User,
  Phone,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  Scale,
  Award,
  Layers,
  Coins,
} from "lucide-react";

interface ProfitHistoryViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: ProfitHistoryResult;
  filters: {
    projectId?: string;
    from?: string;
    to?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function ProfitHistoryView({
  def,
  data,
  filters,
  projects,
  canExport = true,
}: ProfitHistoryViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(filters.projectId || "ALL");
  const [selectedBasis, setSelectedBasis] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeItem, setActiveItem] = useState<ProfitHistoryItem | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false);

  const kpis = data?.kpis || {
    totalDistributed: 0,
    tranchesCount: 0,
    averageTranchePayout: 0,
    uniquePartnersCount: 0,
    cashBasisTotal: 0,
    completionBasisTotal: 0,
  };

  const items = data?.items || [];
  const partnerTotals = data?.partnerTotals || [];
  const tranches = data?.tranches || [];

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Project filter
      if (selectedProjectId !== "ALL" && item.projectId !== selectedProjectId) {
        return false;
      }
      // Basis filter
      if (selectedBasis === "CASH" && item.realizationBasis !== "CASH_BASIS") {
        return false;
      }
      if (selectedBasis === "COMPLETION" && item.realizationBasis !== "COMPLETION_BASIS") {
        return false;
      }
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesPartner = item.partnerName.toLowerCase().includes(q);
        const matchesPhone = item.partnerPhone.toLowerCase().includes(q);
        const matchesProject = item.projectName.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        return matchesPartner || matchesPhone || matchesProject || matchesId;
      }
      return true;
    });
  }, [items, selectedProjectId, selectedBasis, searchTerm]);

  const filteredTotalPayout = useMemo(() => {
    return filteredItems.reduce((acc, i) => acc + i.payoutAmount, 0);
  }, [filteredItems]);

  const handleCopyVoucher = (item: ProfitHistoryItem) => {
    const text = `LANDINVEST COMMERCIAL TREASURY DIVIDEND VOUCHER\nVoucher Ref: ${item.id}\nDate: ${formatDate(item.distributionDate)}\nProject Syndicate: ${item.projectName}\nEquity Partner: ${item.partnerName} (${item.partnerPhone})\nEquity Share: ${item.partnerSharePercent}%\nProject Net Profit Benchmark: ${formatBDT(item.totalProjectNetProfit)}\nDividend Payout Disbursed: ${formatBDT(item.payoutAmount)}\nAccounting Basis: ${item.realizationBasis === "CASH_BASIS" ? "Cash Realized Basis" : "Completion / Invoiced Basis"}\nAuthorized Commercial Treasury Disbursement.`;
    navigator.clipboard.writeText(text);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              <History className="w-3.5 h-3.5 text-purple-600" />
              COMMERCIAL TREASURY & DIVIDEND DISBURSEMENT DIVISION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {def.titleEn} <span className="font-normal text-slate-500 text-lg">({def.titleBn})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive audit log of all profit dividend dispatches, project tranche runs, accounting realization bases, and partner payouts.
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
                href={`/api/reports/${def.key}?format=pdf${selectedProjectId !== "ALL" ? `&projectId=${selectedProjectId}` : ""}${filters.from ? `&from=${filters.from}` : ""}${filters.to ? `&to=${filters.to}` : ""}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                Export Landscape PDF
              </a>
              <a
                href={`/api/reports/${def.key}?format=excel${selectedProjectId !== "ALL" ? `&projectId=${selectedProjectId}` : ""}${filters.from ? `&from=${filters.from}` : ""}${filters.to ? `&to=${filters.to}` : ""}`}
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

      {/* 2. Top 4 Macro KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Distributed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Disbursed Dividends
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
              {formatBDT(kpis.totalDistributed)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>{items.length} Payment Vouchers</span>
              <span className="font-semibold text-purple-700">{kpis.uniquePartnersCount} Partners Reached</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Tranches Count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Disbursement Tranches
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-purple-700">
              {kpis.tranchesCount} Tranche Runs
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Average Payout / Tranche</span>
              <span className="font-mono font-semibold text-slate-800">{formatBDT(kpis.averageTranchePayout)}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Cash Realized Basis */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cash Realized Basis
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-blue-700">
              {formatBDT(kpis.cashBasisTotal)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Collections Inflow Basis</span>
              <span className="font-semibold text-blue-600">
                {kpis.totalDistributed > 0 ? ((kpis.cashBasisTotal / kpis.totalDistributed) * 100).toFixed(1) : 0}% of Total
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Completion Basis */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completion / Accrual Basis
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
              {formatBDT(kpis.completionBasisTotal)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Final Milestone Tranche</span>
              <span className="font-semibold text-amber-600">
                {kpis.totalDistributed > 0 ? ((kpis.completionBasisTotal / kpis.totalDistributed) * 100).toFixed(1) : 0}% of Total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Partner Cumulative Dividend Summary Cards */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Partner Cumulative Dividend Receipts & Syndicate Share
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative profit distributions received by each partner across all project disbursement cycles.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {partnerTotals.length} Active Syndicate Partners
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {partnerTotals.map((pt) => {
            const shareOfTotal = kpis.totalDistributed > 0 ? (pt.totalPayout / kpis.totalDistributed) * 100 : 0;
            return (
              <div
                key={pt.partnerId}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{pt.partnerName}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{pt.partnerPhone}</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {pt.sharePercentage}%
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-slate-400 block">Total Profit Received</span>
                  <div className="text-lg font-bold font-mono text-emerald-700">
                    {formatBDT(pt.totalPayout)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, shareOfTotal))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{pt.tranchesCount} Payout Tranches</span>
                    <span className="font-mono font-semibold">{shareOfTotal.toFixed(1)}% Share</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Master Dividend Payout Register Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Basis Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedBasis("ALL")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedBasis === "ALL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Bases ({items.length})
            </button>
            <button
              onClick={() => setSelectedBasis("CASH")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedBasis === "CASH"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cash Basis ({items.filter((i) => i.realizationBasis === "CASH_BASIS").length})
            </button>
            <button
              onClick={() => setSelectedBasis("COMPLETION")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedBasis === "COMPLETION"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Completion Basis ({items.filter((i) => i.realizationBasis === "COMPLETION_BASIS").length})
            </button>
          </div>

          {/* Search & Project Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search partner, project, voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 w-full sm:w-60"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="ALL">All Project Syndicates</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Disbursement Date</th>
                <th className="py-3 px-3">Project Syndicate</th>
                <th className="py-3 px-3">Equity Partner</th>
                <th className="py-3 px-3">Accounting Basis</th>
                <th className="py-3 px-3 text-center">Share %</th>
                <th className="py-3 px-3 text-right">Project Net Profit (৳)</th>
                <th className="py-3 px-3 text-right">Dividend Payout (৳)</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No profit distribution records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className="hover:bg-purple-50/30 cursor-pointer transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-800 font-semibold">
                      {formatDate(item.distributionDate)}
                    </td>

                    {/* Project */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{item.projectName}</div>
                      <div className="text-[11px] text-slate-500">{item.projectLocation}</div>
                    </td>

                    {/* Partner */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 group-hover:text-purple-700">
                        {item.partnerName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.partnerPhone}</div>
                    </td>

                    {/* Basis */}
                    <td className="py-2.5 px-3">
                      {item.realizationBasis === "CASH_BASIS" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          <Coins className="w-3 h-3 text-blue-600" />
                          Cash Realized
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Scale className="w-3 h-3 text-amber-600" />
                          Completion / Invoiced
                        </span>
                      )}
                    </td>

                    {/* Share % */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.partnerSharePercent.toFixed(1)}%
                      </span>
                    </td>

                    {/* Project Net Profit */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatBDT(item.totalProjectNetProfit)}
                    </td>

                    {/* Dividend Payout */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 text-sm whitespace-nowrap">
                      {formatBDT(item.payoutAmount)}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveItem(item)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                      >
                        <Award className="w-3 h-3" />
                        Voucher
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer */}
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td colSpan={6} className="py-3 px-3 uppercase tracking-wider">
                    Total Filtered Disbursements ({filteredItems.length} Transactions)
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                    {formatBDT(filteredTotalPayout)}
                  </td>
                  <td className="py-3 px-3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* 5. Interactive Dividend Payout Voucher Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Dividend Payment Voucher
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      DISB-{activeItem.id.slice(0, 8).toUpperCase()}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Commercial Treasury Syndicate Payout Advice</p>
                </div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Amount Highlight Box */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 block font-semibold">
                  Net Disbursed Dividend Payout
                </span>
                <div className="text-3xl font-bold font-mono text-emerald-700 mt-1">
                  {formatBDT(activeItem.payoutAmount)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Disbursement Executed on {formatDate(activeItem.distributionDate)}
                </div>
              </div>

              {/* Partner & Project Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Beneficiary Partner</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{activeItem.partnerName}</div>
                  <div className="text-slate-600 font-mono">{activeItem.partnerPhone}</div>
                  <div className="text-slate-500 text-[11px]">NID: {activeItem.partnerNid}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Project Syndicate</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{activeItem.projectName}</div>
                  <div className="text-slate-600">{activeItem.projectLocation}</div>
                  <div className="text-slate-500 text-[11px]">Syndicate Equity: {activeItem.partnerSharePercent}%</div>
                </div>
              </div>

              {/* Calculation Breakdown Formula */}
              <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-200 space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Tranche Allocation Formula
                </span>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Project Net Profit Pool:</span>
                  <span className="font-mono font-semibold text-slate-800">{formatBDT(activeItem.totalProjectNetProfit)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Partner Equity Multiplier:</span>
                  <span className="font-mono font-semibold text-purple-700">{activeItem.partnerSharePercent}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Accounting Basis:</span>
                  <span className="font-semibold text-slate-800">
                    {activeItem.realizationBasis === "CASH_BASIS" ? "Cash Realized Inflow" : "Completion / Invoiced"}
                  </span>
                </div>
              </div>

              {/* Digital Authentication */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorized Commercial Treasury Voucher</span>
                </div>
                <div className="font-mono text-slate-500">Board Approved</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleCopyVoucher(activeItem)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
              >
                {copiedVoucher ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedVoucher ? "Copied!" : "Copy Voucher Text"}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/reports/partner-capital?partnerId=${activeItem.partnerId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-300 transition-colors"
                >
                  Partner Capital →
                </Link>
                <button
                  onClick={() => setActiveItem(null)}
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
