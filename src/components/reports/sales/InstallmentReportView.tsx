"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { InstallmentReportResult, InstallmentReportItem } from "@/lib/reports/installment-report";
import {
  Calendar,
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
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
  Building2,
  TrendingDown,
  ArrowUpDown,
  MessageSquare,
  Scale,
  DollarSign,
} from "lucide-react";

interface InstallmentReportViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: InstallmentReportResult;
  filters: {
    projectId?: string;
    from?: string;
    to?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function InstallmentReportView({
  def,
  data,
  filters,
  projects,
  canExport = true,
}: InstallmentReportViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(filters.projectId || "ALL");
  const [selectedTimeline, setSelectedTimeline] = useState<string>("ALL_ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeInstallment, setActiveInstallment] = useState<InstallmentReportItem | null>(null);
  const [copiedSms, setCopiedSms] = useState<boolean>(false);

  // Sorting
  const [sortField, setSortField] = useState<"dueDate" | "dueAmount" | "diffDays" | "buyerName">("dueDate");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const items = data.items || [];
  const kpis = data.kpis;
  const projectBreakdown = data.projectBreakdown || [];

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      // Project filter
      if (selectedProjectId !== "ALL" && i.projectId !== selectedProjectId) {
        return false;
      }

      // Timeline / status filter
      if (selectedTimeline === "ALL_ACTIVE" && i.status === "PAID") return false;
      if (selectedTimeline === "OVERDUE" && i.status !== "OVERDUE") return false;
      if (selectedTimeline === "DUE_7D" && i.status !== "DUE_7D") return false;
      if (selectedTimeline === "DUE_30D" && i.status !== "DUE_30D") return false;
      if (selectedTimeline === "FUTURE" && i.status !== "FUTURE") return false;
      if (selectedTimeline === "PAID" && i.status !== "PAID") return false;

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchBuyer = i.buyerName.toLowerCase().includes(q);
        const matchPhone = i.buyerPhone.toLowerCase().includes(q);
        const matchPlot = i.plotNumber.toLowerCase().includes(q);
        const matchProject = i.projectName.toLowerCase().includes(q);
        const matchContract = i.contractNo.toLowerCase().includes(q);
        if (!matchBuyer && !matchPhone && !matchPlot && !matchProject && !matchContract) return false;
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === "dueDate") {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortField === "dueAmount") {
        comparison = a.dueAmount - b.dueAmount;
      } else if (sortField === "diffDays") {
        comparison = a.diffDays - b.diffDays;
      } else if (sortField === "buyerName") {
        comparison = a.buyerName.localeCompare(b.buyerName);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [items, selectedProjectId, selectedTimeline, searchTerm, sortField, sortAsc]);

  const filteredTotalAmount = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.dueAmount, 0);
  }, [filteredItems]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "dueDate" || field === "buyerName");
    }
  };

  const copySmsTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2000);
  };

  const getStatusBadge = (item: InstallmentReportItem) => {
    switch (item.status) {
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            {item.statusLabelEn}
          </span>
        );
      case "DUE_7D":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            {item.statusLabelEn}
          </span>
        );
      case "DUE_30D":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Calendar className="w-3 h-3 text-blue-600" />
            Due in 8-30 Days
          </span>
        );
      case "FUTURE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            Future Scheduled
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Paid & Settled
          </span>
        );
      default:
        return <span>{item.statusLabelEn}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      {/* Top Header & Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Credit Management & Installment Collection Division</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {def.titleEn}
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({def.titleBn})
              </span>
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl">
              Live schedule tracking across all customer installment covenants, immediate 7-day payment inflows, overdue arrears aging, and SMS escalation protocols.
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
                  href={`/api/reports/installment-report?${new URLSearchParams({
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
                  href={`/api/reports/installment-report?${new URLSearchParams({
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
        {/* Card 1: Overdue Arrears */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Overdue Arrears
            </span>
            <span className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-red-600 font-mono">
              {formatBDT(kpis.overdueAmount)}
            </div>
            <div className="text-xs text-red-800 mt-1 flex items-center justify-between">
              <span>{kpis.overdueCount} Overdue Schedules</span>
              <span className="font-semibold">{kpis.overdueDebtorsCount} Delinquent Debtors</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Delinquency Rate</span>
            <span className="font-semibold text-red-600">
              {kpis.overdueRatio.toFixed(1)}% of Portfolio
            </span>
          </div>
        </div>

        {/* Card 2: Due in Next 7 Days */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Imminent (Next 7 Days)
            </span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-amber-700 font-mono">
              {formatBDT(kpis.dueNext7DaysAmount)}
            </div>
            <div className="text-xs text-amber-800 mt-1 flex items-center justify-between">
              <span>{kpis.dueNext7DaysCount} Upcoming Schedules</span>
              <span className="font-semibold">Immediate Follow-Up</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>SMS Alerts</span>
            <span className="font-semibold text-amber-700">
              Reminder Protocol Active
            </span>
          </div>
        </div>

        {/* Card 3: Monthly Inflow Target (8-30 Days) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Monthly Inflow (8-30 Days)
            </span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-blue-700 font-mono">
              {formatBDT(kpis.dueNext30DaysAmount)}
            </div>
            <div className="text-xs text-blue-800 mt-1 flex items-center justify-between">
              <span>{kpis.dueNext30DaysCount} Schedules Scheduled</span>
              <span className="font-semibold">30-Day Pipeline</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Total 30-Day Target</span>
            <span className="font-semibold font-mono text-blue-700">
              {formatBDT(kpis.dueNext7DaysAmount + kpis.dueNext30DaysAmount)}
            </span>
          </div>
        </div>

        {/* Card 4: Total Active Portfolio */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Active Portfolio
            </span>
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Coins className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              {formatBDT(kpis.totalUnsettledAmount)}
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>{kpis.totalUnsettledCount} Total Schedules</span>
              <span className="font-semibold">{kpis.activeDebtorsCount} Active Debtors</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Settled Historical Receipts</span>
            <span className="font-semibold text-emerald-700">
              {formatBDT(kpis.paidAmount)} ({kpis.paidCount} Paid)
            </span>
          </div>
        </div>
      </div>

      {/* Project Overdue Arrears Summary Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Estate-Wise Installment Arrears & Health
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of overdue exposure and upcoming 30-day payment inflows across land projects.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {projectBreakdown.length} Estates Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectBreakdown.map((proj) => (
            <div
              key={proj.projectId}
              onClick={() => setSelectedProjectId(proj.projectId === selectedProjectId ? "ALL" : proj.projectId)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedProjectId === proj.projectId
                  ? "border-emerald-600 bg-emerald-50/20 shadow-md ring-1 ring-emerald-600"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm truncate max-w-[190px]">
                  {proj.projectName}
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {proj.unsettledCount} Active
                </span>
              </div>

              <div className="mt-2.5 flex items-baseline justify-between text-xs">
                <span className="text-slate-500">Overdue Arrears:</span>
                <strong className={`font-mono ${proj.overdueAmount > 0 ? "text-red-600" : "text-emerald-700"}`}>
                  {formatBDT(proj.overdueAmount)}
                </strong>
              </div>

              <div className="mt-1 flex items-baseline justify-between text-xs">
                <span className="text-slate-500">Upcoming 30 Days:</span>
                <span className="font-mono font-semibold text-blue-700">
                  {formatBDT(proj.dueNext30DaysAmount)}
                </span>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
                <span>Delinquency Rate:</span>
                <strong className={proj.overdueRatio > 20 ? "text-red-600" : "text-slate-700"}>
                  {proj.overdueRatio.toFixed(1)}% ({proj.overdueCount} Overdue)
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        {/* Timeline Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedTimeline("ALL_ACTIVE")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTimeline === "ALL_ACTIVE"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Active Schedules ({kpis.totalUnsettledCount})
          </button>
          <button
            onClick={() => setSelectedTimeline("OVERDUE")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTimeline === "OVERDUE"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200"
            }`}
          >
            Overdue Arrears ({kpis.overdueCount})
          </button>
          <button
            onClick={() => setSelectedTimeline("DUE_7D")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTimeline === "DUE_7D"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Due in 7 Days ({kpis.dueNext7DaysCount})
          </button>
          <button
            onClick={() => setSelectedTimeline("DUE_30D")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTimeline === "DUE_30D"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            Due in 8-30 Days ({kpis.dueNext30DaysCount})
          </button>
          <button
            onClick={() => setSelectedTimeline("FUTURE")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTimeline === "FUTURE"
                ? "bg-slate-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Future Schedules ({kpis.futureCount})
          </button>
          <button
            onClick={() => setSelectedTimeline("PAID")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedTimeline === "PAID"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            Settled History ({kpis.paidCount})
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by debtor name, phone, plot number, or project..."
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

          {(selectedProjectId !== "ALL" || selectedTimeline !== "ALL_ACTIVE" || searchTerm) && (
            <button
              onClick={() => {
                setSelectedProjectId("ALL");
                setSelectedTimeline("ALL_ACTIVE");
                setSearchTerm("");
              }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Master Installment Schedules Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Installment Schedule Ledger
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Showing <strong>{filteredItems.length}</strong> schedules &nbsp;·&nbsp;
              Filtered Total Amount: <strong className="text-emerald-700">{formatBDT(filteredTotalAmount)}</strong>
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Click any row to view Recovery SMS & Notice Dossier
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <th
                  onClick={() => handleSort("dueDate")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Due Date & Latency</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("buyerName")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Debtor / Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  Contract & Plot
                </th>
                <th
                  onClick={() => handleSort("dueAmount")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Due Amount (৳)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">
                  Due Status
                </th>
                <th className="py-3 px-4 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No installment schedules found matching the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveInstallment(item)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {formatDate(item.dueDate)}
                      </div>
                      <div
                        className={`text-[10px] font-semibold ${
                          item.diffDays < 0
                            ? "text-red-600"
                            : item.diffDays <= 7
                            ? "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {item.daysText}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700">
                        {item.buyerName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />
                        {item.buyerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        Plot {item.plotNumber}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.projectName} · {item.contractNo}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatBDT(item.dueAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(item)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInstallment(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                      >
                        Notice
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
                  <td colSpan={3} className="py-3.5 px-4 uppercase tracking-wider">
                    Total Filtered Installments ({filteredItems.length} Schedules)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 text-sm">
                    {formatBDT(filteredTotalAmount)}
                  </td>
                  <td colSpan={2} className="py-3.5 px-4 text-right text-slate-300 text-[11px]">
                    Overdue: {formatBDT(kpis.overdueAmount)} ({kpis.overdueCount} schedules)
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Interactive Installment Recovery Dossier Modal */}
      {activeInstallment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setActiveInstallment(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Installment Recovery Dossier
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeInstallment.contractNo}
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-1 text-white">
                  {activeInstallment.buyerName}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Phone: {activeInstallment.buyerPhone}</span>
                  <span>·</span>
                  <span>Plot {activeInstallment.plotNumber} ({activeInstallment.projectName})</span>
                </div>
              </div>
              <button
                onClick={() => setActiveInstallment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Due Specification */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Scheduled Due Date</span>
                  <strong className="text-base font-bold text-slate-900">
                    {formatDate(activeInstallment.dueDate)}
                  </strong>
                  <div className="text-xs text-red-600 font-semibold mt-0.5">
                    {activeInstallment.daysText}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Installment Due Amount</span>
                  <strong className="text-2xl font-black font-mono text-emerald-700">
                    {formatBDT(activeInstallment.dueAmount)}
                  </strong>
                </div>
              </div>

              {/* Ready-to-Send SMS Templates */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Customer Payment SMS Notification Template
                  </span>
                  <button
                    onClick={() =>
                      copySmsTemplate(
                        `Dear ${activeInstallment.buyerName}, your installment of ${formatBDT(
                          activeInstallment.dueAmount
                        )} for Plot ${activeInstallment.plotNumber} (${activeInstallment.projectName}) is ${
                          activeInstallment.diffDays < 0
                            ? `overdue by ${Math.abs(activeInstallment.diffDays)} days`
                            : `due on ${formatDate(activeInstallment.dueDate)}`
                        }. Kindly deposit to LandInvest treasury. Hotline: 01700-000000.`
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                  >
                    {copiedSms ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy SMS
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed">
                  &ldquo;Dear {activeInstallment.buyerName}, your installment of {formatBDT(activeInstallment.dueAmount)} for Plot {activeInstallment.plotNumber} ({activeInstallment.projectName}) is {activeInstallment.diffDays < 0 ? `overdue by ${Math.abs(activeInstallment.diffDays)} days` : `due on ${formatDate(activeInstallment.dueDate)}`}. Kindly deposit to LandInvest treasury. Hotline: 01700-000000.&rdquo;
                </div>
              </div>

              {/* Statutory Legal Escalation Notice */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <Scale className="w-4 h-4 text-amber-700" />
                  Statutory Escalation Protocol (Real Estate Act 2010 - Section 14)
                </div>
                <p>
                  For overdues exceeding contractual grace periods, developers are required to issue a registered 30-day written notice before cancellation of allotment or charging statutory late payment penalties.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Link
                href={`/reports/buyer-statement?saleId=${activeInstallment.saleId}`}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Open Full Customer Account Ledger →
              </Link>
              <button
                onClick={() => setActiveInstallment(null)}
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
