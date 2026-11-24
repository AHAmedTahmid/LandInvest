"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatBDT } from "@/lib/reports/format";
import type { PlotInventoryResult, PlotInventoryItem } from "@/lib/reports/plot-inventory";
import {
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  Building2,
  Search,
  Filter,
  FileDown,
  Printer,
  ChevronRight,
  X,
  UserCheck,
  Phone,
  Calendar,
  AlertCircle,
  TrendingUp,
  Tag,
  ArrowUpDown,
} from "lucide-react";

interface PlotInventoryViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: PlotInventoryResult;
  filters: {
    projectId?: string;
    status?: string;
    from?: string;
    to?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function PlotInventoryView({
  def,
  data,
  filters,
  projects,
  canExport = true,
}: PlotInventoryViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(filters.projectId || "ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || "ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activePlot, setActivePlot] = useState<PlotInventoryItem | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<"plotNumber" | "projectName" | "plotSizeShotok" | "askingPrice" | "status">("plotNumber");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const items = data.items || [];
  const kpis = data.kpis;
  const projectBreakdown = data.projectBreakdown || [];

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((p) => {
      // Project filter
      if (selectedProjectId !== "ALL" && p.projectId !== selectedProjectId) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "ALL") {
        if (selectedStatus === "RESERVED_HELD") {
          if (!["RESERVED", "HELD", "NOT_FOR_SALE"].includes(p.status)) return false;
        } else if (p.status !== selectedStatus) {
          return false;
        }
      }
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchPlot = p.plotNumber.toLowerCase().includes(q);
        const matchProject = p.projectName.toLowerCase().includes(q);
        const matchBuyer = (p.buyerName || "").toLowerCase().includes(q);
        const matchPhone = (p.buyerPhone || "").toLowerCase().includes(q);
        if (!matchPlot && !matchProject && !matchBuyer && !matchPhone) return false;
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === "plotNumber") {
        comparison = a.plotNumber.localeCompare(b.plotNumber, undefined, { numeric: true });
      } else if (sortField === "projectName") {
        comparison = a.projectName.localeCompare(b.projectName);
      } else if (sortField === "plotSizeShotok") {
        comparison = a.plotSizeShotok - b.plotSizeShotok;
      } else if (sortField === "askingPrice") {
        comparison = a.askingPrice - b.askingPrice;
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [items, selectedProjectId, selectedStatus, searchTerm, sortField, sortAsc]);

  // Aggregate stats for filtered set
  const filteredArea = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.plotSizeShotok, 0);
  }, [filteredItems]);

  const filteredValuation = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.askingPrice, 0);
  }, [filteredItems]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status: string, labelEn: string) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available
          </span>
        );
      case "BOOKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            Booked (Active)
          </span>
        );
      case "SOLD":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 text-slate-600" />
            Sold & Settled
          </span>
        );
      case "RESERVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Tag className="w-3 h-3 text-amber-500" />
            Reserved
          </span>
        );
      case "HELD":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <AlertCircle className="w-3 h-3 text-purple-500" />
            Held / Blocked
          </span>
        );
      case "UNPRICED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
            Development Phase
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            {labelEn}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      {/* Top Header & Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Real Estate Stock & Inventory Asset Division</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {def.titleEn}
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({def.titleBn})
              </span>
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl">
              Comprehensive stock ledger across all demarcated land parcels, live sales allotment status, benchmark asking valuations, and real estate inventory absorption rates.
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
                  href={`/api/reports/plot-inventory?${new URLSearchParams({
                    ...(selectedProjectId !== "ALL" ? { projectId: selectedProjectId } : {}),
                    ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
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
                  href={`/api/reports/plot-inventory?${new URLSearchParams({
                    ...(selectedProjectId !== "ALL" ? { projectId: selectedProjectId } : {}),
                    ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
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
        {/* Card 1: Total Demarcated Inventory */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Demarcated Stock
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Layers className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              {kpis.totalPlots} Plots
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>{kpis.totalAreaShotok.toFixed(2)} Shotok Total</span>
              <span className="font-semibold text-slate-700">({kpis.totalAreaAcres.toFixed(2)} Acres)</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Portfolio Valuation</span>
            <span className="font-semibold font-mono text-slate-900">{formatBDT(kpis.totalAskingValuation)}</span>
          </div>
        </div>

        {/* Card 2: Available For Sale */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Available For Sale
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Coins className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-emerald-700 font-mono">
              {kpis.availableCount} Plots
            </div>
            <div className="text-xs text-emerald-800 mt-1 flex items-center justify-between">
              <span>{kpis.availableAreaShotok.toFixed(2)} Shotok</span>
              <span className="font-semibold">{((kpis.availableCount / (kpis.totalPlots || 1)) * 100).toFixed(1)}% of Stock</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Asking Stock Value</span>
            <span className="font-semibold font-mono text-emerald-700">{formatBDT(kpis.availableValuation)}</span>
          </div>
        </div>

        {/* Card 3: Disposed / Contracted */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Contracted / Disposed
            </span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-blue-700 font-mono">
              {kpis.soldCount + kpis.bookedCount} Plots
            </div>
            <div className="text-xs text-blue-800 mt-1 flex items-center justify-between">
              <span>{kpis.soldCount} Sold · {kpis.bookedCount} Booked</span>
              <span className="font-semibold">{kpis.disposalRate.toFixed(1)}% Absorbed</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Realized Value</span>
            <span className="font-semibold font-mono text-blue-700">{formatBDT(kpis.soldValuation + kpis.bookedValuation)}</span>
          </div>
        </div>

        {/* Card 4: Development Pipeline & Reserved */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Pipeline & Reserved
            </span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-purple-700 font-mono">
              {kpis.unpricedCount + kpis.reservedHeldCount} Plots
            </div>
            <div className="text-xs text-purple-800 mt-1 flex items-center justify-between">
              <span>{kpis.unpricedCount} In Dev · {kpis.reservedHeldCount} Held</span>
              <span className="font-semibold">{(kpis.unpricedAreaShotok + kpis.reservedHeldAreaShotok).toFixed(1)} Shotok</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Avg Benchmark Rate</span>
            <span className="font-semibold font-mono text-slate-800">{formatBDT(kpis.avgAskingRatePerShotok)}/sh</span>
          </div>
        </div>
      </div>

      {/* Project Inventory Absorption Summary Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Estate-Wise Inventory Absorption & Stock Health
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live breakdown of demarcated acreage, sales absorption, and available stock across 6 estates.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {projectBreakdown.length} Estates Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectBreakdown.map((proj) => {
            const soldPct = proj.totalPlots > 0 ? (proj.soldCount / proj.totalPlots) * 100 : 0;
            const bookedPct = proj.totalPlots > 0 ? (proj.bookedCount / proj.totalPlots) * 100 : 0;
            const availPct = proj.totalPlots > 0 ? (proj.availableCount / proj.totalPlots) * 100 : 0;

            return (
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
                  <div className="font-bold text-slate-900 text-sm truncate max-w-[180px]">
                    {proj.projectName}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {proj.totalPlots} Plots
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">{proj.totalAreaShotok.toFixed(1)} Shotok Demarcated</span>
                  <span className="font-mono font-semibold text-emerald-700">{formatBDT(proj.askingValuation)}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                  <div
                    style={{ width: `${soldPct}%` }}
                    className="bg-slate-700 h-full"
                    title={`Sold: ${proj.soldCount} (${soldPct.toFixed(0)}%)`}
                  />
                  <div
                    style={{ width: `${bookedPct}%` }}
                    className="bg-blue-600 h-full"
                    title={`Booked: ${proj.bookedCount} (${bookedPct.toFixed(0)}%)`}
                  />
                  <div
                    style={{ width: `${availPct}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Available: ${proj.availableCount} (${availPct.toFixed(0)}%)`}
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Avail: <strong>{proj.availableCount}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    Booked: <strong>{proj.bookedCount}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                    Sold: <strong>{proj.soldCount}</strong>
                  </span>
                  <span className="font-bold text-slate-900">
                    {proj.disposalRate.toFixed(0)}% Disposed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedStatus("ALL")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Inventory ({kpis.totalPlots})
          </button>
          <button
            onClick={() => setSelectedStatus("AVAILABLE")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === "AVAILABLE"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            Available ({kpis.availableCount})
          </button>
          <button
            onClick={() => setSelectedStatus("BOOKED")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === "BOOKED"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            Booked ({kpis.bookedCount})
          </button>
          <button
            onClick={() => setSelectedStatus("SOLD")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === "SOLD"
                ? "bg-slate-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Sold ({kpis.soldCount})
          </button>
          <button
            onClick={() => setSelectedStatus("RESERVED_HELD")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === "RESERVED_HELD"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Reserved & Held ({kpis.reservedHeldCount})
          </button>
          <button
            onClick={() => setSelectedStatus("UNPRICED")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === "UNPRICED"
                ? "bg-gray-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Development ({kpis.unpricedCount})
          </button>
        </div>

        {/* Inputs Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by plot number (e.g. A-12), project estate, or buyer name..."
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

          {/* Project Dropdown */}
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

          {/* Reset button */}
          {(selectedProjectId !== "ALL" || selectedStatus !== "ALL" || searchTerm) && (
            <button
              onClick={() => {
                setSelectedProjectId("ALL");
                setSelectedStatus("ALL");
                setSearchTerm("");
              }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Master Plot Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Demarcated Plot Inventory Ledger
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Showing <strong>{filteredItems.length}</strong> of {items.length} plots &nbsp;·&nbsp;
              Filtered Area: <strong className="text-slate-800">{filteredArea.toFixed(2)} Shotok</strong> &nbsp;·&nbsp;
              Filtered Valuation: <strong className="text-emerald-700">{formatBDT(filteredValuation)}</strong>
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Click any row to open Plot Dossier
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <th
                  onClick={() => handleSort("plotNumber")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Plot Number</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("projectName")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Project Estate & Mouza</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("plotSizeShotok")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Area (Shotok)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("askingPrice")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Asking Valuation</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">
                  Rate / Shotok
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="py-3 px-4 text-center cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Stock Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  Customer Allotment
                </th>
                <th className="py-3 px-4 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No plots found matching the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((plot) => (
                  <tr
                    key={plot.id}
                    onClick={() => setActivePlot(plot)}
                    className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 group-hover:text-emerald-700">
                        {plot.plotNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Cadastral Parcel
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {plot.projectName}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {plot.mouza || "Registered Cadastral Area"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      <div>{plot.plotSizeShotok.toFixed(2)} Sh</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        ({plot.plotSizeKatha.toFixed(2)} Katha)
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {plot.askingPrice > 0 ? (
                        formatBDT(plot.askingPrice)
                      ) : (
                        <span className="text-slate-400 font-normal italic">Unpriced</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {plot.ratePerShotok > 0 ? (
                        formatBDT(plot.ratePerShotok)
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(plot.status, plot.statusLabelEn)}
                    </td>
                    <td className="py-3 px-4">
                      {plot.buyerName ? (
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            {plot.buyerName}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" />
                            {plot.buyerPhone || "No phone"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unallocated Stock</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlot(plot);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                      >
                        Dossier
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
                    Total Filtered Stock ({filteredItems.length} Plots)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 text-sm">
                    {filteredArea.toFixed(2)} Sh
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-300 text-sm">
                    {formatBDT(filteredValuation)}
                  </td>
                  <td colSpan={4} className="py-3.5 px-4 text-right text-slate-300 text-[11px]">
                    Available Valuation: {formatBDT(kpis.availableValuation)} ({kpis.availableCount} plots)
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Interactive Plot Dossier Modal */}
      {activePlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setActivePlot(null)}
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
                    Cadastral Plot Dossier
                  </span>
                  <span className="text-xs text-slate-400">
                    ID: {activePlot.id.slice(0, 8)}...
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-1 text-white">
                  Plot {activePlot.plotNumber} &nbsp;·&nbsp; {activePlot.projectName}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activePlot.mouza || "Registered Cadastral Mouza"}
                </div>
              </div>
              <button
                onClick={() => setActivePlot(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Plot Area
                  </span>
                  <div className="text-base font-black font-mono text-slate-900 mt-1">
                    {activePlot.plotSizeShotok.toFixed(2)} Sh
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {activePlot.plotSizeKatha.toFixed(2)} Katha
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Square Feet
                  </span>
                  <div className="text-base font-black font-mono text-slate-900 mt-1">
                    {(activePlot.plotSizeShotok * 435.6).toLocaleString("en-BD", { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    1 Sh = 435.6 sq ft
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Asking Price
                  </span>
                  <div className="text-base font-black font-mono text-emerald-700 mt-1">
                    {activePlot.askingPrice > 0 ? formatBDT(activePlot.askingPrice) : "Unpriced"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    List Valuation
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Benchmark Rate
                  </span>
                  <div className="text-base font-black font-mono text-slate-900 mt-1">
                    {activePlot.ratePerShotok > 0 ? formatBDT(activePlot.ratePerShotok) : "-"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Per Shotok
                  </div>
                </div>
              </div>

              {/* Status & Allotment Information */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Inventory Status & Allotment
                  </h4>
                  {getStatusBadge(activePlot.status, activePlot.statusLabelEn)}
                </div>

                {activePlot.buyerName ? (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Allottee / Buyer:</span>
                        <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          {activePlot.buyerName}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Contact Number:</span>
                        <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {activePlot.buyerPhone || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Agreed Sale Price</span>
                        <strong className="font-mono text-slate-900">{formatBDT(activePlot.totalAgreedPrice || 0)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Cash Realised</span>
                        <strong className="font-mono text-emerald-700">{formatBDT(activePlot.totalPaid || 0)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Current Due</span>
                        <strong className="font-mono text-red-600">{formatBDT(activePlot.currentDueAmount || 0)}</strong>
                      </div>
                    </div>

                    {activePlot.saleDate && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Contract execution date: {new Date(activePlot.saleDate).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    This plot is unallocated and immediately available for commercial sales booking.
                  </div>
                )}
              </div>

              {/* Statutory Footnote */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <strong>Statutory Demarcation Covenants:</strong> All plot boundary coordinates and layout dimensions conform to certified engineering layout masterplans in accordance with the Town Improvement Act and Real Estate Development & Management Act 2010.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setActivePlot(null)}
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
