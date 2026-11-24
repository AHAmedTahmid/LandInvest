"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { CollectionReportData, CollectionReceiptDetail } from "@/lib/reports/collection-report";
import {
  DollarSign,
  Building2,
  Landmark,
  Coins,
  Search,
  Filter,
  FileDown,
  Printer,
  ChevronRight,
  X,
  User,
  Phone,
  Copy,
  Check,
  TrendingUp,
  Receipt,
  CreditCard,
  Wallet,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

interface CollectionReportViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: CollectionReportData;
  filters: {
    projectId?: string;
    from?: string;
    to?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function CollectionReportView({
  def,
  data,
  filters,
  projects,
  canExport = true,
}: CollectionReportViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(filters.projectId || "ALL");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeReceipt, setActiveReceipt] = useState<CollectionReceiptDetail | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  const summary = {
    totalCollected: data?.kpis?.totalCollected ?? (data as any)?.summary?.totalCollected ?? 0,
    transactionCount: data?.kpis?.transactionCount ?? (data as any)?.summary?.transactionCount ?? 0,
    averageTicket: data?.kpis?.averageTicket ?? (data as any)?.summary?.averageTicket ?? 0,
    bankCollected: data?.kpis?.bankCollected ?? (data as any)?.summary?.bankCollected ?? 0,
    bankPercent: data?.kpis?.bankPercent ?? (data as any)?.summary?.bankPercent ?? 0,
    cashCollected: data?.kpis?.cashCollected ?? (data as any)?.summary?.cashCollected ?? 0,
    cashPercent: data?.kpis?.cashPercent ?? (data as any)?.summary?.cashPercent ?? 0,
    contractedBookValue: data?.kpis?.contractedBookValue ?? (data as any)?.summary?.contractedBookValue ?? 0,
    totalOutstandingDue: data?.kpis?.totalOutstandingDue ?? (data as any)?.summary?.totalOutstandingDue ?? 0,
    portfolioRealizationRate: data?.kpis?.portfolioRealizationRate ?? (data as any)?.summary?.portfolioRealizationRate ?? 0,
    projectBreakdown: data?.projectBreakdown ?? (data as any)?.summary?.projectBreakdown ?? [],
    channelBreakdown: data?.channelBreakdown ?? (data as any)?.summary?.channelBreakdown ?? [],
  };

  const receipts = data?.receipts || [];

  // Filter receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      // Project filter
      if (selectedProjectId !== "ALL" && r.projectId !== selectedProjectId) {
        return false;
      }
      // Method filter
      if (selectedMethod === "BANK" && r.paymentMethod !== "BANK") {
        return false;
      }
      if (selectedMethod === "CASH" && r.paymentMethod !== "CASH") {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesBuyer = r.buyerName.toLowerCase().includes(q);
        const matchesPhone = r.buyerPhone.toLowerCase().includes(q);
        const matchesReceipt = r.receiptNo.toLowerCase().includes(q);
        const matchesPlot = r.plotNo.toLowerCase().includes(q);
        const matchesProject = r.projectName.toLowerCase().includes(q);
        const matchesBank = r.bankAccountName.toLowerCase().includes(q);
        const matchesRemarks = (r.remarks || "").toLowerCase().includes(q);
        return matchesBuyer || matchesPhone || matchesReceipt || matchesPlot || matchesProject || matchesBank || matchesRemarks;
      }
      return true;
    });
  }, [receipts, selectedProjectId, selectedMethod, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredReceipts.length / pageSize) || 1;
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReceipts.slice(start, start + pageSize);
  }, [filteredReceipts, currentPage]);

  // Aggregate stats for filtered receipts
  const filteredTotal = useMemo(() => {
    return filteredReceipts.reduce((sum, r) => sum + r.amountPaid, 0);
  }, [filteredReceipts]);

  const handleCopyReceipt = (r: CollectionReceiptDetail) => {
    const text = `LandInvest Official Money Receipt\nReceipt No: ${r.receiptNo}\nDate: ${formatDate(r.paymentDate)}\nCustomer: ${r.buyerName} (${r.buyerPhone})\nProject: ${r.projectName} - Plot ${r.plotNo}\nAmount Received: ৳ ${r.amountPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}\nPayment Method: ${r.paymentMethod === "CASH" ? "Cash Treasury" : r.bankAccountName}\nRemarks: ${r.remarks}`;
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              COMMERCIAL TREASURY & REALIZATION DIVISION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {def.titleEn} <span className="font-normal text-slate-500 text-lg">({def.titleBn})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive audit trail of customer payments, bank clearing, petty cash receipts, and estate-wise collection efficiency metrics.
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
                href={`/api/reports/${def.key}?format=pdf${filters.projectId ? `&projectId=${filters.projectId}` : ""}${filters.from ? `&from=${filters.from}` : ""}${filters.to ? `&to=${filters.to}` : ""}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                Export Landscape PDF
              </a>
              <a
                href={`/api/reports/${def.key}?format=excel${filters.projectId ? `&projectId=${filters.projectId}` : ""}${filters.from ? `&from=${filters.from}` : ""}${filters.to ? `&to=${filters.to}` : ""}`}
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
        {/* KPI 1: Total Realized Collections */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Realized Inflow
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
              {formatBDT(summary.totalCollected)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>{summary.transactionCount} Money Receipts</span>
              <span className="font-mono text-slate-700">Avg ৳ {Math.round(summary.averageTicket).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Bank & Wire Clearing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bank & MFS Clearing
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-blue-700">
              {formatBDT(summary.bankCollected)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Institutional Clearing</span>
              <span className="font-semibold text-blue-600">{summary.bankPercent.toFixed(1)}% of Inflows</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Petty Cash Treasury */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Petty Cash Treasury
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
              {formatBDT(summary.cashCollected)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Vault Counter Receipts</span>
              <span className="font-semibold text-amber-600">{summary.cashPercent.toFixed(1)}% of Inflows</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Portfolio Realization Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Portfolio Realization
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-purple-700">
                {summary.portfolioRealizationRate.toFixed(1)}%
              </span>
              <span className="text-xs font-medium text-slate-500">Realized</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Outstanding Due</span>
              <span className="font-mono font-semibold text-rose-600">{formatBDT(summary.totalOutstandingDue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Estate-wise Collection Realization Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Estate-Wise Collection Realization & Recovery Health
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of total contracted booking value, actual realized collections, and recovery efficiency across active land developments.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {summary.projectBreakdown.length} Projects Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {summary.projectBreakdown.map((prj) => (
            <div
              key={prj.projectId}
              className={`p-4 rounded-xl border transition-all ${
                selectedProjectId === prj.projectId
                  ? "border-emerald-500 bg-emerald-50/20 shadow-sm ring-1 ring-emerald-500"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{prj.projectName}</h3>
                  <p className="text-xs text-slate-500">{prj.projectLocation}</p>
                </div>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {prj.contractCount} Sales
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Collection Realization</span>
                  <span className="font-bold text-emerald-700 font-mono">{prj.realizationRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, prj.realizationRate))}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Realized Inflow</span>
                  <span className="font-mono font-bold text-emerald-700">{formatBDT(prj.totalCollected)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Remaining Due</span>
                  <span className="font-mono font-bold text-rose-600">{formatBDT(prj.currentDue)}</span>
                </div>
              </div>

              <div className="mt-2 text-right">
                <button
                  onClick={() => setSelectedProjectId(selectedProjectId === prj.projectId ? "ALL" : prj.projectId)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
                >
                  {selectedProjectId === prj.projectId ? "Clear Filter" : "Filter Receipts"} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Payment Clearing Channels */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-slate-500" />
            Treasury Destination & Clearing Channels
          </span>
          <span className="text-xs text-slate-500">Filtered Inflow: <strong className="text-slate-800 font-mono">{formatBDT(filteredTotal)}</strong></span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {summary.channelBreakdown.map((ch, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <span className={`w-2 h-2 rounded-full ${ch.channel === "Cash" ? "bg-amber-500" : "bg-blue-500"}`} />
              <span className="font-medium text-slate-800">{ch.accountName}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-emerald-700 font-bold">{formatBDT(ch.totalAmount)}</span>
              <span className="text-slate-500 text-[11px]">({ch.percentage.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Master Money Receipt Register Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Method Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => { setSelectedMethod("ALL"); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedMethod === "ALL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Channels ({receipts.length})
            </button>
            <button
              onClick={() => { setSelectedMethod("BANK"); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedMethod === "BANK"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bank & MFS ({receipts.filter(r => r.paymentMethod === "BANK").length})
            </button>
            <button
              onClick={() => { setSelectedMethod("CASH"); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedMethod === "CASH"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Petty Cash ({receipts.filter(r => r.paymentMethod === "CASH").length})
            </button>
          </div>

          {/* Search & Project Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search receipt #, buyer, phone, plot..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-64"
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
              onChange={(e) => { setSelectedProjectId(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Estates (All Projects)</option>
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
                <th className="py-3 px-3">Receipt No</th>
                <th className="py-3 px-3">Payment Date</th>
                <th className="py-3 px-3">Debtor / Customer</th>
                <th className="py-3 px-3">Property Demarcation</th>
                <th className="py-3 px-3">Clearing Channel</th>
                <th className="py-3 px-3">Remarks / Memo</th>
                <th className="py-3 px-3 text-right">Amount (৳)</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    No money receipts match the selected filters or search query.
                  </td>
                </tr>
              ) : (
                paginatedReceipts.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setActiveReceipt(r)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                  >
                    {/* Receipt No */}
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-emerald-700 underline decoration-slate-300 group-hover:decoration-emerald-500">
                        {r.receiptNo}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-mono">
                      {formatDate(r.paymentDate)}
                    </td>

                    {/* Customer */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{r.buyerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{r.buyerPhone}</div>
                    </td>

                    {/* Property */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">Plot {r.plotNo}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{r.projectName}</div>
                    </td>

                    {/* Channel */}
                    <td className="py-2.5 px-3">
                      {r.paymentMethod === "CASH" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Coins className="w-3 h-3 text-amber-600" />
                          Petty Cash Vault
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          <Landmark className="w-3 h-3 text-blue-600" />
                          {r.bankAccountName}
                        </span>
                      )}
                    </td>

                    {/* Remarks */}
                    <td className="py-2.5 px-3 max-w-[200px] truncate text-slate-600">
                      {r.remarks}
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 text-sm whitespace-nowrap">
                      {formatBDT(r.amountPaid)}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveReceipt(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                      >
                        <Receipt className="w-3 h-3" />
                        Preview
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer */}
            {filteredReceipts.length > 0 && (
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td colSpan={6} className="py-3 px-3 uppercase tracking-wider">
                    Total Filtered Collections ({filteredReceipts.length} Receipts)
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                    {formatBDT(filteredTotal)}
                  </td>
                  <td className="py-3 px-3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing <strong className="font-semibold text-slate-900">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
              <strong className="font-semibold text-slate-900">
                {Math.min(currentPage * pageSize, filteredReceipts.length)}
              </strong>{" "}
              of <strong className="font-semibold text-slate-900">{filteredReceipts.length}</strong> receipts
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-slate-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 border border-slate-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Interactive Official Money Receipt Dossier Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Official Money Receipt
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activeReceipt.receiptNo}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">LandInvest Commercial Treasury Realization Voucher</p>
                </div>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Receipt Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Receipt Visual Container */}
              <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-amber-50/20 relative">
                <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                  <div>
                    <div className="text-base font-black tracking-tight text-slate-900">LANDINVEST ERP</div>
                    <div className="text-[11px] text-slate-500">Commercial Treasury Division · Dhaka, Bangladesh</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      PAID & CLEARED
                    </span>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">
                      {formatDate(activeReceipt.paymentDate)}
                    </div>
                  </div>
                </div>

                {/* Amount Highlight */}
                <div className="my-4 p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Amount Received In Full
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">
                    {formatBDT(activeReceipt.amountPaid)}
                  </div>
                  <div className="text-[11px] text-slate-500 italic mt-0.5">
                    Official Money Receipt Voucher · Land Realization
                  </div>
                </div>

                {/* Debtor & Property Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase">Received From:</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{activeReceipt.buyerName}</div>
                    <div className="text-slate-600 font-mono">{activeReceipt.buyerPhone}</div>
                    <div className="text-slate-500 text-[11px]">NID: {activeReceipt.buyerNid}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase">Allotted Property:</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">Plot {activeReceipt.plotNo}</div>
                    <div className="text-slate-600">{activeReceipt.projectName}</div>
                    <div className="text-slate-500 text-[11px]">{activeReceipt.projectLocation}</div>
                  </div>
                </div>

                {/* Instrument / Payment Details */}
                <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase">Clearing Channel:</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {activeReceipt.paymentMethod === "CASH" ? "Petty Cash Treasury Vault" : activeReceipt.bankAccountName}
                    </div>
                    {activeReceipt.bankAccountNumber !== "-" && (
                      <div className="text-slate-500 font-mono text-[11px]">A/C: {activeReceipt.bankAccountNumber}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase">Instrument Ref / Note:</span>
                    <div className="text-slate-700 mt-0.5">{activeReceipt.remarks}</div>
                  </div>
                </div>

                {/* Ledger Context Summary */}
                <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 p-3 rounded-lg text-xs">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contract Amortization Context
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Contract</span>
                      <span className="font-mono font-bold text-slate-800">{formatBDT(activeReceipt.totalAgreedPrice)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cumulative Realized</span>
                      <span className="font-mono font-bold text-emerald-700">{formatBDT(activeReceipt.totalPaidOnSale)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Current Active Due</span>
                      <span className="font-mono font-bold text-rose-600">{formatBDT(activeReceipt.currentDueOnSale)}</span>
                    </div>
                  </div>
                </div>

                {/* Digital Verification & Stamp */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Digitally Authenticated Receipt</span>
                  </div>
                  <div className="font-mono text-slate-500">Authorized Accounts Sign-off</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleCopyReceipt(activeReceipt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
              >
                {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedReceipt ? "Copied!" : "Copy Receipt Details"}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/reports/buyer-statement?saleId=${activeReceipt.saleId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors"
                >
                  Buyer Statement →
                </Link>
                <button
                  onClick={() => setActiveReceipt(null)}
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
