"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  LandDocumentData,
  LandDocumentItem,
} from "@/lib/reports/land-documents";
import {
  Building2,
  FileText,
  MapPin,
  Layers,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  Search,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Map,
  ScrollText,
  Users,
  ArrowUpDown,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: LandDocumentData;
  canExport?: boolean;
}

export default function LandDocumentsView({ def, data, canExport = true }: Props) {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBn = lang === "bn";

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortField, setSortField] = useState<"area" | "cost" | "plots" | "name">("area");
  const [sortAsc, setSortAsc] = useState(false);

  // Active Title Dossier Modal State
  const [activeProject, setActiveProject] = useState<LandDocumentItem | null>(null);

  // Filtered & sorted projects
  const filteredItems = useMemo(() => {
    return data.items
      .filter((it) => {
        if (selectedStatus !== "ALL" && it.status !== selectedStatus) return false;

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = it.projectName.toLowerCase().includes(q);
          const matchMouza = it.mouza.toLowerCase().includes(q);
          const matchJl = it.jlNumber.toLowerCase().includes(q);
          const matchDag = it.dagNumbers.toLowerCase().includes(q);
          const matchKhatian = it.khatianNumbers.toLowerCase().includes(q);
          const matchPartner = it.partners.some((p) => p.name.toLowerCase().includes(q));
          if (!matchName && !matchMouza && !matchJl && !matchDag && !matchKhatian && !matchPartner) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === "area") {
          return sortAsc ? a.totalAreaShotok - b.totalAreaShotok : b.totalAreaShotok - a.totalAreaShotok;
        }
        if (sortField === "cost") {
          return sortAsc ? a.totalAcquisitionCost - b.totalAcquisitionCost : b.totalAcquisitionCost - a.totalAcquisitionCost;
        }
        if (sortField === "plots") {
          return sortAsc ? a.totalPlots - b.totalPlots : b.totalPlots - a.totalPlots;
        }
        if (sortField === "name") {
          return sortAsc ? a.projectName.localeCompare(b.projectName) : b.projectName.localeCompare(a.projectName);
        }
        return 0;
      });
  }, [data.items, selectedStatus, search, sortField, sortAsc]);

  // Filtered totals
  const filteredGrossArea = useMemo(() => filteredItems.reduce((acc, it) => acc + it.totalAreaShotok, 0), [filteredItems]);
  const filteredNetArea = useMemo(() => filteredItems.reduce((acc, it) => acc + it.netPlotAreaShotok, 0), [filteredItems]);
  const filteredAcqCost = useMemo(() => filteredItems.reduce((acc, it) => acc + it.totalAcquisitionCost, 0), [filteredItems]);
  const filteredPlotsCount = useMemo(() => filteredItems.reduce((acc, it) => acc + it.totalPlots, 0), [filteredItems]);

  const handleExportCsv = () => {
    const headers = [
      "Project Name",
      "Mouza",
      "JL Number",
      "Dag Numbers",
      "Khatian Numbers",
      "Gross Area (Shotok)",
      "Gross Area (Acres)",
      "Net Plots Area (Shotok)",
      "Planning Efficiency %",
      "Demarcated Plots",
      "Purchase Price (BDT)",
      "Bayna Amount (BDT)",
      "Registration Cost (BDT)",
      "Mutation Tax (BDT)",
      "Total Acquisition Cost (BDT)",
      "Cost per Shotok (BDT)",
      "Title Status",
      "Syndicate Partners",
    ];
    const rows = filteredItems.map((r) => [
      `"${r.projectName.replace(/"/g, '""')}"`,
      `"${r.mouza.replace(/"/g, '""')}"`,
      `"${r.jlNumber.replace(/"/g, '""')}"`,
      `"${r.dagNumbers.replace(/"/g, '""')}"`,
      `"${r.khatianNumbers.replace(/"/g, '""')}"`,
      r.totalAreaShotok.toFixed(2),
      r.totalAreaAcres.toFixed(2),
      r.netPlotAreaShotok.toFixed(2),
      r.efficiencyRatio.toFixed(1),
      r.totalPlots,
      r.purchasePrice.toFixed(2),
      r.baynaAmount.toFixed(2),
      r.registrationCost.toFixed(2),
      r.mutationTaxCost.toFixed(2),
      r.totalAcquisitionCost.toFixed(2),
      r.costPerShotok.toFixed(2),
      `"${r.statusLabelEn.replace(/"/g, '""')}"`,
      `"${r.partners.map((p) => `${p.name} (${p.sharePercentage}%)`).join(", ").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Land_Document_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBdt = (n: number) => {
    return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  };

  const toggleSort = (field: "area" | "cost" | "plots" | "name") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>{isBn ? "ল্যান্ড প্রজেক্টস রিপোর্টস" : "Land Projects Reports"}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600">{isBn ? "জমি দলিল নিবন্ধন" : "Land Documents"}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isBn ? "জমি দলিল নিবন্ধন ও মৌজা খতিয়ান লেজার" : "Land Document Register & Cadastral Title Ledger"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isBn
                ? "প্রকল্পের জমি ক্রয় দলিল, সিএস/এসএ/আরএস/বিএস দাগ ও খতিয়ান রেকর্ড, প্লট বিন্যাস ও মালিকানা রেজিস্টার"
                : "Statutory register of deed registrations, CS/SA/RS/BS cadastral khatians, dag records, and syndicate title ownership"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {canExport && (
              <>
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
                  title="Export records to CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? "সিএসভি এক্সপোর্ট" : "Export CSV"}</span>
                </button>
                <a
                  href={`/api/reports/${def.key}?${searchParams.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-xs"
                  title="Print official A4 landscape PDF report"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isBn ? "প্রিন্ট / পিডিএফ" : "Print / PDF"}</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label={isBn ? "দলিল অবস্থা ফিল্টার" : "Title status filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল অবস্থা (All Statuses)" : "All Title Statuses"}</option>
            <option value="SOLD_OUT">{isBn ? "রেজিস্ট্রিকৃত ও সম্পূর্ণ বিক্রিত (Sold Out)" : "Registered & Sold Out"}</option>
            <option value="SELLING">{isBn ? "রেজিস্ট্রিকৃত ও বিক্রয়মান (Selling)" : "Registered & Selling"}</option>
            <option value="DEVELOPING">{isBn ? "রেজিস্ট্রিকৃত ও উন্নয়নমান (Developing)" : "Registered & Developing"}</option>
            <option value="UNDER_BAYNA">{isBn ? "বায়নাপত্র নিবন্ধিত (Under Bayna)" : "Under Bayna Deed"}</option>
            <option value="DRAFT">{isBn ? "আইনি যাচাই ও খসড়া (Draft)" : "Title Vetting / Draft"}</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBn ? "প্রকল্পের নাম, মৌজা, জেএল, দাগ, খতিয়ান বা অংশীদার অনুসন্ধান..." : "Search project, mouza, JL, dag, khatian, or partner name..."}
              className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-brand-600 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Land Acreage */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "মোট জমির পরিমাণ" : "Total Land Holdings"}</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Map className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {filteredGrossArea.toFixed(2)} <span className="text-sm font-normal text-slate-500">Shotok</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "একর সমতুল্য" : "Acres Equivalent"}</span>
            <span className="font-semibold font-mono text-emerald-700">{(filteredGrossArea / 100).toFixed(2)} Acres</span>
          </div>
        </div>

        {/* Capitalized Title Acquisition Outlay */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "ভূমি অধিগ্রহণ বিনিয়োগ" : "Acquisition Outlay"}</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {formatBdt(filteredAcqCost)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "শতক প্রতি গড় খরচ" : "Avg Rate / Shotok"}</span>
            <span className="font-semibold font-mono text-blue-700">
              {formatBdt(filteredGrossArea > 0 ? filteredAcqCost / filteredGrossArea : 0)}
            </span>
          </div>
        </div>

        {/* Layout Demarcation & Plots */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "ডিমার্কেটেড প্লট ও বিন্যাস" : "Demarcated Plots"}</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-purple-700">
            {filteredPlotsCount} <span className="text-sm font-normal text-slate-500">{isBn ? "টি প্লট" : "Plots"}</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "প্লট বিন্যাস দক্ষতা" : "Planning Efficiency"}</span>
            <span className="font-semibold font-mono text-purple-600">
              {filteredGrossArea > 0 ? ((filteredNetArea / filteredGrossArea) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Title Clearance Rate */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "রেজিস্ট্রিকৃত ও নামজারিকৃত" : "Registered Title Rate"}</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
            {data.kpis.registeredProjectsCount} / {data.kpis.totalProjects}{" "}
            <span className="text-sm font-normal text-slate-500">{isBn ? "প্রকল্প" : "Estates"}</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "জমির আয়তন ভিত্তিক" : "By Acreage Share"}</span>
            <span className="font-semibold font-mono text-amber-600">
              {data.kpis.totalAreaShotok > 0
                ? (
                    (data.items
                      .filter((i) => i.status === "SOLD_OUT" || i.status === "SELLING" || i.status === "DEVELOPING")
                      .reduce((sum, i) => sum + i.totalAreaShotok, 0) /
                      data.kpis.totalAreaShotok) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* 3. Title Status Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {data.statusBreakdown.map((sb) => {
          const badgeClass =
            sb.status === "SOLD_OUT"
              ? "border-emerald-200 bg-emerald-50/50 text-emerald-900"
              : sb.status === "SELLING"
              ? "border-blue-200 bg-blue-50/50 text-blue-900"
              : sb.status === "DEVELOPING"
              ? "border-purple-200 bg-purple-50/50 text-purple-900"
              : sb.status === "UNDER_BAYNA"
              ? "border-amber-200 bg-amber-50/50 text-amber-900"
              : "border-slate-200 bg-slate-50 text-slate-900";

          return (
            <div
              key={sb.status}
              onClick={() => setSelectedStatus(selectedStatus === sb.status ? "ALL" : sb.status)}
              className={`p-3 rounded-xl border ${badgeClass} cursor-pointer hover:shadow-xs transition ${
                selectedStatus === sb.status ? "ring-2 ring-brand-500" : ""
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>{isBn ? sb.labelBn : sb.labelEn}</span>
                <span className="font-mono">{sb.count}</span>
              </div>
              <div className="font-mono font-bold text-sm text-slate-900 mt-1">
                {sb.areaShotok.toFixed(1)} Shotok
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {formatBdt(sb.acquisitionCost)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Master Land Title & Cadastral Matrix Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? "প্রকল্প ভূমি দলিল ও মৌজা খতিয়ান লেজার" : "Land Title & Cadastral Matrix"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? `প্রদর্শিত হচ্ছে ${filteredItems.length} টি প্রকল্পের আইনি দলিল বিবরণী (ক্লিক করে বিস্তারিত দলিল ডসিয়ার দেখুন)`
                : `Showing ${filteredItems.length} registered land projects (click any row to inspect complete legal title dossier)`}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-mono">
            {isBn ? "মোট আয়তন:" : "Portfolio Area:"} {filteredGrossArea.toFixed(2)} Shotok ({(filteredGrossArea / 100).toFixed(2)} Acres)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th
                  onClick={() => toggleSort("name")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isBn ? "প্রকল্পের নাম ও অবস্থা" : "Project Profile & Status"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">{isBn ? "মৌজা ও জে.এল. নং" : "Mouza & J.L. No."}</th>
                <th className="py-3 px-4 min-w-[150px]">{isBn ? "দাগ নম্বর (CS/SA/RS/BS)" : "Cadastral Dag Nos."}</th>
                <th className="py-3 px-4 min-w-[150px]">{isBn ? "খতিয়ান নম্বর (Porcha)" : "Khatian Record Nos."}</th>
                <th
                  onClick={() => toggleSort("area")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isBn ? "মোট জায়গা (শতক)" : "Gross Shotok"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">{isBn ? "নেট প্লট (শতক)" : "Net Plots Area"}</th>
                <th
                  onClick={() => toggleSort("plots")}
                  className="py-3 px-4 text-center cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{isBn ? "প্লট সংখ্যা" : "Plots (S/Tot)"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("cost")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isBn ? "অধিগ্রহণ খরচ" : "Acquisition Outlay"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">{isBn ? "সিন্ডিকেট অংশীদারবৃন্দ" : "Syndicate Title Partners"}</th>
                <th className="py-3 px-3 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">{isBn ? "কোনো প্রকল্প পাওয়া যায়নি" : "No land projects match this filter"}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isBn ? "ফিল্টার পরিবর্তন করুন" : "Try clearing or adjusting search filter"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => {
                  const statusBadgeClass =
                    it.status === "SOLD_OUT"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : it.status === "SELLING"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : it.status === "DEVELOPING"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : it.status === "UNDER_BAYNA"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-50 text-slate-700 border-slate-200";

                  return (
                    <tr
                      key={it.id}
                      onClick={() => setActiveProject(it)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Project Profile */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {it.projectName}
                        </div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadgeClass}`}>
                          {isBn ? it.statusLabelBn : it.statusLabelEn}
                        </span>
                      </td>

                      {/* Mouza & JL */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{it.mouza}</div>
                        <div className="text-[11px] text-slate-500 font-mono">J.L. #{it.jlNumber}</div>
                      </td>

                      {/* Dag Numbers */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <div className="line-clamp-2 max-w-[180px]" title={it.dagNumbers}>
                          {it.dagNumbers}
                        </div>
                      </td>

                      {/* Khatian Numbers */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <div className="line-clamp-2 max-w-[180px]" title={it.khatianNumbers}>
                          {it.khatianNumbers}
                        </div>
                      </td>

                      {/* Gross Area */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-[13px]">
                        {it.totalAreaShotok.toFixed(2)}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">Shotok</span>
                      </td>

                      {/* Net Plots Area */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-slate-700">
                        <div>{it.netPlotAreaShotok.toFixed(2)} Shotok</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{it.efficiencyRatio.toFixed(1)}% saleable</div>
                      </td>

                      {/* Demarcated Plots */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono text-xs">
                        <span className="font-bold text-emerald-700">{it.soldPlots}</span>
                        <span className="text-slate-400"> / </span>
                        <span className="font-semibold text-slate-800">{it.totalPlots}</span>
                      </td>

                      {/* Acquisition Outlay */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900">
                        <div>{formatBdt(it.totalAcquisitionCost)}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {formatBdt(it.costPerShotok)}/sh
                        </div>
                      </td>

                      {/* Partners */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-600 space-y-0.5 max-w-[200px]">
                          {it.partners.slice(0, 2).map((p) => (
                            <div key={p.partnerId} className="truncate" title={`${p.name} (${p.sharePercentage}%)`}>
                              <span className="font-semibold text-slate-800">{p.name}</span>
                              <span className="font-mono text-slate-400 ml-1">({p.sharePercentage}%)</span>
                            </div>
                          ))}
                          {it.partners.length > 2 && (
                            <div className="text-[10px] text-brand-600 font-semibold">
                              +{it.partners.length - 2} more partners
                            </div>
                          )}
                        </div>
                      </td>

                      {/* View Action */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap text-slate-400 group-hover:text-brand-600 transition">
                        <Eye className="w-4 h-4 mx-auto" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Footer */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-semibold text-slate-900 text-xs">
              <tr>
                <td colSpan={4} className="py-4 px-4 font-bold text-slate-900">
                  {isBn ? "সর্বমোট জমি পোর্টফোলিও" : "Total Syndicate Land Portfolio"}
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-sm text-slate-900">
                  {filteredGrossArea.toFixed(2)} Shotok
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-xs text-emerald-700">
                  {filteredNetArea.toFixed(2)} Shotok
                </td>
                <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                  {filteredPlotsCount} Plots
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-sm text-brand-700">
                  {formatBdt(filteredAcqCost)}
                </td>
                <td colSpan={2} className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                  Avg {formatBdt(filteredGrossArea > 0 ? filteredAcqCost / filteredGrossArea : 0)} / Shotok
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. Statutory Disclosure & Land Title Governance Notice */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-xl mt-0.5">
            <ScrollText className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <h3 className="font-semibold text-slate-900">
              {isBn
                ? "সংবিধিবদ্ধ ভূমি স্বত্ব ও ক্যাডাস্ট্রাল মানদণ্ড (Statutory Title & Land Records Standard)"
                : "Statutory Cadastral & Title Governance Standard"}
            </h3>
            <p>
              {isBn
                ? "এই ভূমি দলিল নিবন্ধনটি রেজিস্ট্রেশন আইন, ১৯০৮ (১৯০৮ সনের ১৬ নং আইন), সম্পত্তি হস্তান্তর আইন, ১৮৮২ এবং রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন, ১৯৫০-এর বিধান মোতাবেক রক্ষিত হয়েছে।"
                : "This Land Document Register is compiled in accordance with the Registration Act, 1908 (Act No. XVI of 1908), the Transfer of Property Act, 1882, and the State Acquisition and Tenancy Act, 1950 (E.B. Act XXVIII of 1951)."}
            </p>
            <p className="text-slate-400 text-[11px]">
              {isBn
                ? "প্রত্যেকটি প্রকল্পের জন্য সিএস, এসএ, আরএস এবং বিএস খতিয়ান ও দাগ নম্বর সাব-রেজিস্ট্রার কার্যালয় এবং উপজেলা সহকারী কমিশনার (ভূমি) অফিস কর্তৃক নামজারি ও জমাভাগ দ্বারা প্রত্যয়িত।"
                : "All project title parcels have been verified through historical survey chains (CS, SA, RS, and BS) and documented with authenticated mutation (নামজারি) and rent receipts (দাখিলা) from the Assistant Commissioner (Land) office."}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Executive Signature Block */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
          {isBn ? "কর্তৃপক্ষের স্বাক্ষর ও দলিল প্রত্যয়ন" : "Executive Signatures & Legal Title Sign-off"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6">
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "প্রধান সার্ভেয়ার ও ডিমার্কেশন বিশেষজ্ঞ" : "Head Surveyor & Demarcation Specialist"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "ভূমি জরিপ ও পরিকল্পনা" : "Cadastral Survey & Planning"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "আইন উপদেষ্টা / সুপ্রিম কোর্ট আইনজীবী" : "Senior Legal Counsel / Advocate"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "স্বত্ব যাচাই ও ভেটিং" : "Title Search & Non-Encumbrance (NEC)"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "ব্যবস্থাপনা পরিচালক / প্রধান অংশীদার" : "Managing Director / Partner"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "চূড়ান্ত দলিল স্বত্বাধিকার" : "Executive Syndicate Title Owner"}</p>
          </div>
        </div>
      </div>

      {/* 7. Interactive Title Dossier Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? "প্রকল্প ভূমি দলিল ও স্বত্ব ডসিয়ার" : "Land Title & Cadastral Dossier"}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">{activeProject.projectName}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Banner Area & Status */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">
                    {isBn ? "মোট জমির পরিমাণ" : "Gross Title Acreage"}
                  </p>
                  <p className="text-2xl font-bold font-mono tracking-tight text-white mt-0.5">
                    {activeProject.totalAreaShotok.toFixed(2)} Shotok
                    <span className="text-sm text-slate-400 font-normal ml-2">({activeProject.totalAreaAcres.toFixed(2)} Acres)</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isBn ? activeProject.statusLabelBn : activeProject.statusLabelEn}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Mouza: {activeProject.mouza}</p>
                </div>
              </div>

              {/* Cadastral Survey Records */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>{isBn ? "ক্যাডাস্ট্রাল জরিপ ও মৌজা বিবরণী" : "Cadastral Survey & Jurisdiction Records"}</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400">Mouza & JL:</span>
                    <p className="font-semibold text-slate-800">{activeProject.mouza} (J.L. #{activeProject.jlNumber})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Demarcated Plots:</span>
                    <p className="font-semibold text-slate-800">{activeProject.totalPlots} Plots ({activeProject.soldPlots} Sold)</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Dag Numbers (CS, SA, RS, BS):</span>
                    <p className="font-mono font-medium text-slate-900 mt-0.5 p-1.5 bg-white rounded border border-slate-200">
                      {activeProject.dagNumbers}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Khatian Record Porchas (CS, SA, RS, BS):</span>
                    <p className="font-mono font-medium text-slate-900 mt-0.5 p-1.5 bg-white rounded border border-slate-200">
                      {activeProject.khatianNumbers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Title Acquisition Financials */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? "অধিগ্রহণ খরচ ও স্ট্যাম্প ডিউটি বিবরণ" : "Deed Acquisition Outlay & Stamp Duties"}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px]">Purchase Price:</span>
                    <p className="font-bold font-mono text-slate-900 mt-0.5">{formatBdt(activeProject.purchasePrice)}</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px]">Bayna Advance:</span>
                    <p className="font-bold font-mono text-amber-700 mt-0.5">{formatBdt(activeProject.baynaAmount)}</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px]">Registration Cost:</span>
                    <p className="font-bold font-mono text-slate-900 mt-0.5">{formatBdt(activeProject.registrationCost)}</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px]">Mutation & Tax:</span>
                    <p className="font-bold font-mono text-slate-900 mt-0.5">{formatBdt(activeProject.mutationTaxCost)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-emerald-50/60 rounded border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-950">Total Capitalized Acquisition:</span>
                  <span className="font-bold font-mono text-emerald-800">{formatBdt(activeProject.totalAcquisitionCost)}</span>
                </div>
              </div>

              {/* Syndicate Partnership Title Shares */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{isBn ? "সিন্ডিকেট মালিকানা ও অংশীদারিত্ব শেয়ার" : "Syndicate Title Ownership & Equity Shares"}</span>
                </h4>
                <div className="space-y-1.5">
                  {activeProject.partners.map((p) => (
                    <div key={p.partnerId} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">{p.name}</span>
                        {p.phone && <span className="text-slate-400 text-[11px] font-mono ml-2">({p.phone})</span>}
                      </div>
                      <span className="font-bold font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {p.sharePercentage.toFixed(1)}% Share
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Navigation to Cost and PnL */}
              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/reports/project-cost?projectId=${activeProject.id}`}
                  className="flex-1 text-center py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {isBn ? "খরচ বিবরণী দেখুন" : "View Cost Statement"}
                </Link>
                <Link
                  href={`/reports/project-pnl?projectId=${activeProject.id}`}
                  className="flex-1 text-center py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition"
                >
                  {isBn ? "লাভ-ক্ষতি বিবরণী দেখুন" : "View Project P&L"}
                </Link>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setActiveProject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition"
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
