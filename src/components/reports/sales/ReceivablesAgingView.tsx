"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { ReceivablesAgingResult, DebtorAgingItem } from "@/lib/reports/receivables-aging";
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Coins,
  TrendingDown,
  Building2,
  Search,
  Filter,
  FileDown,
  Printer,
  ChevronRight,
  X,
  User,
  Phone,
  Calendar,
  AlertCircle,
  ArrowUpDown,
  Mail,
  Scale,
} from "lucide-react";

interface ReceivablesAgingViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: ReceivablesAgingResult;
  filters: {
    projectId?: string;
    from?: string;
    to?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function ReceivablesAgingView({
  def,
  data,
  filters,
  projects,
  canExport = true,
}: ReceivablesAgingViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(filters.projectId || "ALL");
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeDebtor, setActiveDebtor] = useState<DebtorAgingItem | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<"totalDue" | "totalOverdue" | "over90" | "buyerName">("totalOverdue");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const items = data.items || [];
  const kpis = data.kpis;
  const projectBreakdown = data.projectBreakdown || [];
  const bucketPct = data.bucketPercentages;

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((d) => {
      // Project filter
      if (selectedProjectId !== "ALL" && d.projectId !== selectedProjectId) {
        return false;
      }
      // Risk tier filter
      if (selectedRiskTier === "OVERDUE_ONLY" && d.totalOverdue <= 0) return false;
      if (selectedRiskTier === "HEALTHY_ONLY" && d.totalOverdue > 0) return false;
      if (selectedRiskTier === "CRITICAL_ONLY" && d.over90 <= 0) return false;
      if (["LOW_RISK", "MEDIUM_RISK", "HIGH_RISK", "CRITICAL_DEFAULT", "HEALTHY"].includes(selectedRiskTier)) {
        if (d.riskTier !== selectedRiskTier) return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchBuyer = d.buyerName.toLowerCase().includes(q);
        const matchPhone = d.buyerPhone.toLowerCase().includes(q);
        const matchPlot = d.plotNumber.toLowerCase().includes(q);
        const matchProject = d.projectName.toLowerCase().includes(q);
        const matchContract = d.contractNo.toLowerCase().includes(q);
        if (!matchBuyer && !matchPhone && !matchPlot && !matchProject && !matchContract) return false;
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === "totalDue") comparison = a.totalDue - b.totalDue;
      else if (sortField === "totalOverdue") comparison = a.totalOverdue - b.totalOverdue;
      else if (sortField === "over90") comparison = a.over90 - b.over90;
      else if (sortField === "buyerName") comparison = a.buyerName.localeCompare(b.buyerName);
      return sortAsc ? comparison : -comparison;
    });
  }, [items, selectedProjectId, selectedRiskTier, searchTerm, sortField, sortAsc]);

  // Aggregate stats for filtered subset
  const filteredTotalDue = useMemo(() => filteredItems.reduce((s, r) => s + r.totalDue, 0), [filteredItems]);
  const filteredNotDue = useMemo(() => filteredItems.reduce((s, r) => s + r.notYetDue, 0), [filteredItems]);
  const filteredOverdue = useMemo(() => filteredItems.reduce((s, r) => s + r.totalOverdue, 0), [filteredItems]);
  const filteredOver90 = useMemo(() => filteredItems.reduce((s, r) => s + r.over90, 0), [filteredItems]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for financial exposure
    }
  };

  const getRiskBadge = (tier: DebtorAgingItem["riskTier"], labelEn: string) => {
    switch (tier) {
      case "HEALTHY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Performing (Current)
          </span>
        );
      case "LOW_RISK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            1-30 Days Overdue
          </span>
        );
      case "MEDIUM_RISK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            31-60 Days Overdue
          </span>
        );
      case "HIGH_RISK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            61-90 Days Overdue
          </span>
        );
      case "CRITICAL_DEFAULT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-rose-700" />
            Critical (90+ Days)
          </span>
        );
      default:
        return <span>{labelEn}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      {/* Top Header & Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Credit Management & Receivables Recovery Department</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {def.titleEn}
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({def.titleBn})
              </span>
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl">
              Installment amortization aging breakdown across 5 statutory credit buckets, delinquency risk modeling, and legal notice escalation tracking.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/reports"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              ← Back to Reports
            </Link>
            {canExport && (
              <>
                <a
                  href={`/api/reports/receivables-aging?${new URLSearchParams({
                    ...(selectedProjectId !== "ALL" ? { projectId: selectedProjectId } : {}),
                    format: "pdf",
                  })}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Export Landscape PDF
                </a>
                <a
                  href={`/api/reports/receivables-aging?${new URLSearchParams({
                    ...(selectedProjectId !== "ALL" ? { projectId: selectedProjectId } : {}),
                    format: "excel",
                  })}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Excel (XLS)
                </a>
              </>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Receivables */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Receivables Portfolio
            </span>
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Coins className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              {formatBDT(kpis.totalReceivables)}
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>{kpis.debtorsCount} Active Debtor Accounts</span>
              <span className="font-semibold text-slate-700">100% Portfolio</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Portfolio Quality</span>
            <span className="font-semibold text-emerald-700">
              {(100 - kpis.overdueRatio).toFixed(1)}% Performing
            </span>
          </div>
        </div>

        {/* Card 2: Current / Not Yet Due */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Current (Not Yet Due)
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-emerald-700 font-mono">
              {formatBDT(kpis.totalCurrentDue)}
            </div>
            <div className="text-xs text-emerald-800 mt-1 flex items-center justify-between">
              <span>Performing Installments</span>
              <span className="font-bold">{bucketPct.notYetDue.toFixed(1)}% of Portfolio</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Healthy Debtors</span>
            <span className="font-semibold text-emerald-700">
              {kpis.healthyDebtorsCount} Accounts Zero Overdue
            </span>
          </div>
        </div>

        {/* Card 3: Total Overdue Delinquency */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Total Overdue Exposure
            </span>
            <span className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-red-600 font-mono">
              {formatBDT(kpis.totalOverdue)}
            </div>
            <div className="text-xs text-red-800 mt-1 flex items-center justify-between">
              <span>Past Contractual Due Date</span>
              <span className="font-bold">{kpis.overdueRatio.toFixed(1)}% Delinquent</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Delinquent Accounts</span>
            <span className="font-semibold text-red-600">
              {kpis.overdueDebtorsCount} Debtors Require Action
            </span>
          </div>
        </div>

        {/* Card 4: Critical Default (90+ Days) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Critical Default (90+ Days)
            </span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-rose-700 font-mono">
              {formatBDT(kpis.over90Total)}
            </div>
            <div className="text-xs text-rose-800 mt-1 flex items-center justify-between">
              <span>Section 14 Forfeiture Warning</span>
              <span className="font-bold">{kpis.criticalRatio.toFixed(1)}% High Risk</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Statutory Notice Required</span>
            <span className="font-semibold text-rose-700">
              30-Day Cure Notice
            </span>
          </div>
        </div>
      </div>

      {/* Aging Distribution Horizontal Stacked Visualization */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Portfolio Aging Credit Risk Distribution
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {formatBDT(kpis.totalReceivables)} Total Book
          </span>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
          <div
            style={{ width: `${bucketPct.notYetDue}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`Not Yet Due: ${formatBDT(kpis.totalCurrentDue)} (${bucketPct.notYetDue.toFixed(1)}%)`}
          />
          <div
            style={{ width: `${bucketPct.days1to30}%` }}
            className="bg-amber-400 h-full transition-all"
            title={`1-30 Days: ${formatBDT(kpis.days1to30Total)} (${bucketPct.days1to30.toFixed(1)}%)`}
          />
          <div
            style={{ width: `${bucketPct.days31to60}%` }}
            className="bg-orange-500 h-full transition-all"
            title={`31-60 Days: ${formatBDT(kpis.days31to60Total)} (${bucketPct.days31to60.toFixed(1)}%)`}
          />
          <div
            style={{ width: `${bucketPct.days61to90}%` }}
            className="bg-red-500 h-full transition-all"
            title={`61-90 Days: ${formatBDT(kpis.days61to90Total)} (${bucketPct.days61to90.toFixed(1)}%)`}
          />
          <div
            style={{ width: `${bucketPct.over90}%` }}
            className="bg-rose-700 h-full transition-all"
            title={`90+ Days: ${formatBDT(kpis.over90Total)} (${bucketPct.over90.toFixed(1)}%)`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-600 truncate">
              Current: <strong>{formatBDT(kpis.totalCurrentDue)}</strong> ({bucketPct.notYetDue.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-slate-600 truncate">
              1-30d: <strong>{formatBDT(kpis.days1to30Total)}</strong> ({bucketPct.days1to30.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-slate-600 truncate">
              31-60d: <strong>{formatBDT(kpis.days31to60Total)}</strong> ({bucketPct.days31to60.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
            <span className="text-slate-600 truncate">
              61-90d: <strong>{formatBDT(kpis.days61to90Total)}</strong> ({bucketPct.days61to90.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-700 flex-shrink-0" />
            <span className="text-slate-600 truncate">
              90+d: <strong>{formatBDT(kpis.over90Total)}</strong> ({bucketPct.over90.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        {/* Risk Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedRiskTier("ALL")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedRiskTier === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Accounts ({items.length})
          </button>
          <button
            onClick={() => setSelectedRiskTier("OVERDUE_ONLY")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedRiskTier === "OVERDUE_ONLY"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200"
            }`}
          >
            Delinquent / Overdue ({kpis.overdueDebtorsCount})
          </button>
          <button
            onClick={() => setSelectedRiskTier("CRITICAL_ONLY")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedRiskTier === "CRITICAL_ONLY"
                ? "bg-rose-700 text-white shadow-sm"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
            }`}
          >
            Critical 90+ Days ({items.filter((i) => i.over90 > 0).length})
          </button>
          <button
            onClick={() => setSelectedRiskTier("HEALTHY_ONLY")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedRiskTier === "HEALTHY_ONLY"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            Performing ({kpis.healthyDebtorsCount})
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by buyer name, phone, plot number, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Land Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          {(selectedProjectId !== "ALL" || selectedRiskTier !== "ALL" || searchTerm) && (
            <button
              onClick={() => {
                setSelectedProjectId("ALL");
                setSelectedRiskTier("ALL");
                setSearchTerm("");
              }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Master Receivables Aging Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Debtor Receivables Aging Matrix
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Showing <strong>{filteredItems.length}</strong> debtor accounts &nbsp;·&nbsp;
              Filtered Total Due: <strong className="text-slate-900">{formatBDT(filteredTotalDue)}</strong> &nbsp;·&nbsp;
              Filtered Overdue: <strong className="text-red-600">{formatBDT(filteredOverdue)}</strong>
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Click any debtor row to view Recovery Dossier
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <th
                  onClick={() => handleSort("buyerName")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Debtor / Buyer</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  Contract & Plot
                </th>
                <th
                  onClick={() => handleSort("totalDue")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Due</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">
                  Current (Not Due)
                </th>
                <th className="py-3 px-4 text-right">
                  1-30 Days
                </th>
                <th className="py-3 px-4 text-right">
                  31-60 Days
                </th>
                <th className="py-3 px-4 text-right">
                  61-90 Days
                </th>
                <th
                  onClick={() => handleSort("over90")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>90+ Days</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("totalOverdue")}
                  className="py-3 px-4 text-center cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Risk Severity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No debtor accounts found matching the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setActiveDebtor(d)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700">
                        {d.buyerName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />
                        {d.buyerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        Plot {d.plotNumber}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {d.projectName} ({d.plotSizeShotok.toFixed(1)} Sh)
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatBDT(d.totalDue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">
                      {d.notYetDue > 0 ? formatBDT(d.notYetDue) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-700">
                      {d.days1to30 > 0 ? formatBDT(d.days1to30) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-orange-700">
                      {d.days31to60 > 0 ? formatBDT(d.days31to60) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-red-600 font-semibold">
                      {d.days61to90 > 0 ? formatBDT(d.days61to90) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-700 font-black">
                      {d.over90 > 0 ? (
                        <span className="text-rose-700 font-bold">{formatBDT(d.over90)}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getRiskBadge(d.riskTier, d.riskLabelEn)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDebtor(d);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                      >
                        Recovery
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td colSpan={2} className="py-3.5 px-4 uppercase tracking-wider">
                    Total Filtered Aging ({filteredItems.length} Debtors)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 text-sm">
                    {formatBDT(filteredTotalDue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-300 text-sm">
                    {formatBDT(filteredNotDue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-amber-300 text-sm">
                    {formatBDT(filteredItems.reduce((s, r) => s + r.days1to30, 0))}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-orange-300 text-sm">
                    {formatBDT(filteredItems.reduce((s, r) => s + r.days31to60, 0))}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-red-300 text-sm">
                    {formatBDT(filteredItems.reduce((s, r) => s + r.days61to90, 0))}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-300 text-sm">
                    {formatBDT(filteredOver90)}
                  </td>
                  <td colSpan={2} className="py-3.5 px-4 text-center text-slate-300 text-[11px]">
                    Total Overdue: {formatBDT(filteredOverdue)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Interactive Debtor Recovery Dossier Modal */}
      {activeDebtor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setActiveDebtor(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Credit Recovery Dossier
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeDebtor.contractNo}
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-1 text-white">
                  {activeDebtor.buyerName}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Phone: {activeDebtor.buyerPhone}</span>
                  <span>·</span>
                  <span>Plot {activeDebtor.plotNumber} ({activeDebtor.projectName})</span>
                </div>
              </div>
              <button
                onClick={() => setActiveDebtor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Financial Balance Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Total Contract Value
                  </span>
                  <strong className="text-sm font-mono text-slate-900 mt-1 block">
                    {formatBDT(activeDebtor.totalAgreedPrice)}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Cash Realized / Paid
                  </span>
                  <strong className="text-sm font-mono text-emerald-700 mt-1 block">
                    {formatBDT(activeDebtor.totalPaid)}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Total Outstanding Due
                  </span>
                  <strong className="text-sm font-mono text-red-600 mt-1 block">
                    {formatBDT(activeDebtor.totalDue)}
                  </strong>
                </div>
              </div>

              {/* Aging Breakdown for this Debtor */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Aging Exposure Analysis
                  </h4>
                  {getRiskBadge(activeDebtor.riskTier, activeDebtor.riskLabelEn)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 block">Current (Not Due)</span>
                    <strong className="font-mono text-emerald-800 font-bold">{formatBDT(activeDebtor.notYetDue)}</strong>
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                    <span className="text-[10px] text-amber-700 block">1-30 Days</span>
                    <strong className="font-mono text-amber-800 font-bold">{formatBDT(activeDebtor.days1to30)}</strong>
                  </div>
                  <div className="p-2 bg-orange-50 rounded border border-orange-200">
                    <span className="text-[10px] text-orange-700 block">31-60 Days</span>
                    <strong className="font-mono text-orange-800 font-bold">{formatBDT(activeDebtor.days31to60)}</strong>
                  </div>
                  <div className="p-2 bg-red-50 rounded border border-red-200">
                    <span className="text-[10px] text-red-700 block">61-90 Days</span>
                    <strong className="font-mono text-red-800 font-bold">{formatBDT(activeDebtor.days61to90)}</strong>
                  </div>
                  <div className="p-2 bg-rose-50 rounded border border-rose-200">
                    <span className="text-[10px] text-rose-700 block">90+ Days</span>
                    <strong className="font-mono text-rose-800 font-bold">{formatBDT(activeDebtor.over90)}</strong>
                  </div>
                </div>
              </div>

              {/* Installments List */}
              {activeDebtor.installments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Installment Schedules ({activeDebtor.installments.length} Active / Pending)
                  </h4>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                    {activeDebtor.installments.map((sch) => (
                      <div key={sch.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700">#{sch.installmentNo}</span>
                          <span className="text-slate-600">Due: {formatDate(sch.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900">{formatBDT(sch.dueAmount)}</span>
                          {sch.daysOverdue > 0 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                              {sch.daysOverdue} Days Overdue
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                              Scheduled
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recovery Action Protocol */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  Statutory Recovery & Escalation Protocol
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {activeDebtor.over90 > 0 ? (
                    <strong className="text-red-700">
                      Tier 3 Action Required: Issue formal 30-day registered statutory notice prior to cancellation of allotment under Section 14 of the Real Estate Development & Management Act, 2010.
                    </strong>
                  ) : activeDebtor.days31to60 > 0 || activeDebtor.days61to90 > 0 ? (
                    <span className="text-orange-800">
                      Tier 2 Action: Issue formal Demand Letter and telephone conference with debtor regarding overdue installments.
                    </span>
                  ) : (
                    <span className="text-slate-600">
                      Standard Credit Protocol: Friendly SMS and automated email reminder for scheduled installment settlement.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Link
                href={`/reports/buyer-statement?saleId=${activeDebtor.id}`}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Open Full Customer Account Ledger →
              </Link>
              <button
                onClick={() => setActiveDebtor(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
