"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  SalesRegisterData,
  SalesRegisterItem,
} from "@/lib/reports/sales-register";
import {
  FileText,
  Building2,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Coins,
  CreditCard,
  Layers,
  Phone,
  User,
  ShieldCheck,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  ArrowUpDown,
  BadgeCheck,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: SalesRegisterData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
    status?: string;
    paymentStatus?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function SalesRegisterView({ def, data, filters, projects, canExport = true }: Props) {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBn = lang === "bn";

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(filters.projectId || "ALL");
  const [selectedStatus, setSelectedStatus] = useState(filters.status || "ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(filters.paymentStatus || "ALL");
  const [sortField, setSortField] = useState<"date" | "agreed" | "paid" | "due" | "buyer">("date");
  const [sortAsc, setSortAsc] = useState(false);

  // Active Contract Modal State
  const [activeSale, setActiveSale] = useState<SalesRegisterItem | null>(null);

  // Filtered & sorted sales
  const filteredItems = useMemo(() => {
    return data.items
      .filter((it) => {
        if (selectedProject !== "ALL" && it.projectId !== selectedProject) return false;
        if (selectedStatus !== "ALL" && it.status !== selectedStatus) return false;
        if (selectedPaymentStatus === "FULLY_PAID" && it.currentDue > 0) return false;
        if (selectedPaymentStatus === "PARTIAL_PAID" && it.currentDue <= 0) return false;

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchContract = it.contractNo.toLowerCase().includes(q);
          const matchBuyer = it.buyerName.toLowerCase().includes(q);
          const matchPhone = it.buyerPhone.toLowerCase().includes(q);
          const matchNid = it.buyerNid?.toLowerCase().includes(q);
          const matchProject = it.projectName.toLowerCase().includes(q);
          const matchPlot = it.plotNumber.toLowerCase().includes(q);
          const matchReceipt = it.payments.some((p) => p.receiptNo.toLowerCase().includes(q));
          if (
            !matchContract &&
            !matchBuyer &&
            !matchPhone &&
            !matchNid &&
            !matchProject &&
            !matchPlot &&
            !matchReceipt
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === "date") {
          const diff = new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
          return sortAsc ? diff : -diff;
        }
        if (sortField === "agreed") {
          return sortAsc ? a.totalAgreedPrice - b.totalAgreedPrice : b.totalAgreedPrice - a.totalAgreedPrice;
        }
        if (sortField === "paid") {
          return sortAsc ? a.totalPaid - b.totalPaid : b.totalPaid - a.totalPaid;
        }
        if (sortField === "due") {
          return sortAsc ? a.currentDue - b.currentDue : b.currentDue - a.currentDue;
        }
        if (sortField === "buyer") {
          return sortAsc ? a.buyerName.localeCompare(b.buyerName) : b.buyerName.localeCompare(a.buyerName);
        }
        return 0;
      });
  }, [data.items, selectedProject, selectedStatus, selectedPaymentStatus, search, sortField, sortAsc]);

  // Filtered Totals
  const filteredAgreed = useMemo(() => filteredItems.reduce((acc, it) => acc + it.totalAgreedPrice, 0), [filteredItems]);
  const filteredPaid = useMemo(() => filteredItems.reduce((acc, it) => acc + it.totalPaid, 0), [filteredItems]);
  const filteredDue = useMemo(() => filteredItems.reduce((acc, it) => acc + it.currentDue, 0), [filteredItems]);
  const filteredArea = useMemo(() => filteredItems.reduce((acc, it) => acc + it.plotSizeShotok, 0), [filteredItems]);
  const filteredCollectionRate = filteredAgreed > 0 ? (filteredPaid / filteredAgreed) * 100 : 0;

  const applyUrlFilters = (newParams: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === undefined || v === "ALL" || v === "") {
        sp.delete(k);
      } else {
        sp.set(k, v);
      }
    });
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  const handlePresetChange = (preset: string) => {
    applyUrlFilters({ preset, from: undefined, to: undefined });
  };

  const handleExportCsv = () => {
    const headers = [
      "Contract No",
      "Sale Date",
      "Buyer Name",
      "Buyer Phone",
      "Buyer NID",
      "Project",
      "Mouza",
      "Plot Number",
      "Plot Size (Shotok)",
      "Agreed Price (BDT)",
      "Advance Booking (BDT)",
      "Total Collected (BDT)",
      "Current Due (BDT)",
      "Collection %",
      "Rate per Shotok (BDT)",
      "Status",
      "Payments Count",
    ];
    const rows = filteredItems.map((r) => [
      `"${r.contractNo.replace(/"/g, '""')}"`,
      new Date(r.saleDate).toISOString().slice(0, 10),
      `"${r.buyerName.replace(/"/g, '""')}"`,
      `"${r.buyerPhone.replace(/"/g, '""')}"`,
      `"${(r.buyerNid || "").replace(/"/g, '""')}"`,
      `"${r.projectName.replace(/"/g, '""')}"`,
      `"${(r.mouza || "").replace(/"/g, '""')}"`,
      `"${r.plotNumber.replace(/"/g, '""')}"`,
      r.plotSizeShotok.toFixed(2),
      r.totalAgreedPrice.toFixed(2),
      r.advanceBookingAmount.toFixed(2),
      r.totalPaid.toFixed(2),
      r.currentDue.toFixed(2),
      r.collectionRate.toFixed(1),
      r.ratePerShotok.toFixed(2),
      `"${r.statusLabelEn.replace(/"/g, '""')}"`,
      r.paymentsCount,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sales_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBdt = (n: number) => {
    return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  };

  const formatDate = (d: string | Date) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return String(d);
    }
  };

  const toggleSort = (field: "date" | "agreed" | "paid" | "due" | "buyer") => {
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
              <span>{isBn ? "বিক্রয় ও বকেয়া রিপোর্টস" : "Sales & Receivables Reports"}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600">{isBn ? "বিক্রয় নিবন্ধন" : "Sales Register"}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isBn ? "বিক্রয় নিবন্ধন ও গ্রাহক চুক্তি লেজার" : "Sales Register & Customer Contract Ledger"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isBn
                ? "প্লট বিক্রয় চুক্তি, বুকিং শর্তাবলী, আদায়কৃত অর্থ এবং বকেয়া প্রাপ্যতার পূর্ণাঙ্গ অডিট বিবরণী"
                : "Comprehensive audit register of plot sales contracts, customer booking terms, realized collections, and outstanding receivables"}
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
          {/* Preset Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => handlePresetChange("this_month")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "this_month" || (!searchParams.get("preset") && !filters.from)
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              {isBn ? "চলতি মাস" : "This Month"}
            </button>
            <button
              onClick={() => handlePresetChange("last_month")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "last_month" ? "bg-white text-slate-900 font-semibold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              {isBn ? "গত মাস" : "Last Month"}
            </button>
            <button
              onClick={() => handlePresetChange("this_fy")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "this_fy" ? "bg-white text-slate-900 font-semibold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              {isBn ? "চলতি অর্থবছর" : "This FY"}
            </button>
            <button
              onClick={() => handlePresetChange("all_time")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "all_time" || searchParams.get("preset") === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              {isBn ? "সকল সময়" : "All Time"}
            </button>
          </div>

          {/* Project Selector */}
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              applyUrlFilters({ projectId: e.target.value });
            }}
            aria-label={isBn ? "প্রকল্প ফিল্টার" : "Project filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল প্রকল্প (All Projects)" : "All Projects"}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName}
              </option>
            ))}
          </select>

          {/* Contract Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              applyUrlFilters({ status: e.target.value });
            }}
            aria-label={isBn ? "চুক্তি অবস্থা ফিল্টার" : "Contract status filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল চুক্তি অবস্থা (All Statuses)" : "All Statuses"}</option>
            <option value="SOLD">{isBn ? "বিক্রিত ও পরিশোধিত (Sold / Settled)" : "Fully Sold / Settled"}</option>
            <option value="BOOKED">{isBn ? "চলমান কিস্তি চুক্তি (Active Plan)" : "Active Installment Plan"}</option>
          </select>

          {/* Payment Status Selector */}
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            aria-label={isBn ? "পরিশোধ অবস্থা ফিল্টার" : "Payment status filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল পরিশোধ অবস্থা (All Payments)" : "All Payment Statuses"}</option>
            <option value="FULLY_PAID">{isBn ? "সম্পূর্ণ পরিশোধিত (Fully Paid)" : "Fully Paid"}</option>
            <option value="PARTIAL_PAID">{isBn ? "বকেয়া বিদ্যমান (Partial / Due)" : "Has Outstanding Due"}</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBn ? "চুক্তি নং, ক্রেতার নাম, ফোন, এনআইডি, প্লট নং..." : "Search contract #, buyer name, phone, NID, plot..."}
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
        {/* Total Booked Sales */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "মোট বিক্রিত চুক্তি মূল্য" : "Total Booked Sales"}</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {formatBdt(filteredAgreed)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "চুক্তি ও হস্তান্তরিত জমি" : "Contracts & Acreage"}</span>
            <span className="font-semibold font-mono text-slate-700">
              {filteredItems.length} contracts · {filteredArea.toFixed(1)} Sh
            </span>
          </div>
        </div>

        {/* Realised Cash Collections */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "নগদ আদায়কৃত অর্থ" : "Realised Collections"}</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
            {formatBdt(filteredPaid)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "আদায় দক্ষতা হার" : "Collection Efficiency"}</span>
            <span className="font-semibold font-mono text-emerald-600">{filteredCollectionRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Active Customer Receivables */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "চলমান গ্রাহক বকেয়া" : "Active Receivables"}</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
            {formatBdt(filteredDue)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "বকেয়া অনুপাত" : "Receivable Ratio"}</span>
            <span className="font-semibold font-mono text-amber-600">
              {filteredAgreed > 0 ? ((filteredDue / filteredAgreed) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Contract Completion Ratio */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "চুক্তি নিষ্পত্তি হার" : "Contract Settlement"}</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <BadgeCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-purple-700">
            {filteredItems.filter((i) => i.currentDue <= 0).length} / {filteredItems.length}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "চলমান কিস্তি চুক্তি" : "Active Installments"}</span>
            <span className="font-semibold font-mono text-purple-600">
              {filteredItems.filter((i) => i.currentDue > 0).length} plans
            </span>
          </div>
        </div>
      </div>

      {/* 3. Project Sales & Collection Progress Overview */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-1">
          {isBn ? "প্রকল্পভিত্তিক বিক্রয় ও নগদ আদায় তুলনা" : "Project Sales & Realised Collections Breakdown"}
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          {isBn ? "বিক্রিত চুক্তির পরিমাণ, নগদ আদায় দক্ষতা এবং অবশিষ্ট বকেয়া" : "Contracted value vs cash collected vs active receivables across estates"}
        </p>

        <div className="space-y-3">
          {data.projectSalesBreakdown.map((pb) => (
            <div key={pb.projectId} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 mb-1.5">
                <span className="font-bold text-slate-900">
                  {pb.projectName}
                  <span className="ml-2 font-normal text-slate-400 font-mono">
                    ({pb.salesCount} contracts · {pb.areaSoldShotok.toFixed(1)} Shotok)
                  </span>
                </span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-600">Agreed: {formatBdt(pb.agreedPrice)}</span>
                  <span className="text-emerald-700 font-bold">Paid: {formatBdt(pb.cashCollected)}</span>
                  <span className="text-amber-700">Due: {formatBdt(pb.activeReceivables)}</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${pb.collectionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>Collection Progress: {pb.collectionRate.toFixed(1)}%</span>
                <span>Outstanding: {formatBdt(pb.activeReceivables)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Master Sales Register Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? "গ্রাহক বিক্রয় চুক্তি লেজার" : "Master Customer Sales Register"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? `প্রদর্শিত হচ্ছে ${filteredItems.length} টি বিক্রয় চুক্তি (ক্লিক করে বিস্তারিত কিস্তি ও রসিদ বিবরণী দেখুন)`
                : `Showing ${filteredItems.length} sales contracts (click any row to inspect buyer statement & payment receipts)`}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-mono">
            {isBn ? "ফিল্টারকৃত মোট বিক্রয়:" : "Subtotal Agreed:"} {formatBdt(filteredAgreed)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th
                  onClick={() => toggleSort("date")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isBn ? "চুক্তি নং ও তারিখ" : "Contract # & Date"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("buyer")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isBn ? "ক্রেতার তথ্য" : "Buyer Profile"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">{isBn ? "প্রকল্প ও মৌজা" : "Project & Mouza"}</th>
                <th className="py-3 px-4">{isBn ? "প্লট ও সাইজ" : "Plot & Size"}</th>
                <th
                  onClick={() => toggleSort("agreed")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isBn ? "সম্মত মূল্য" : "Agreed Price"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("paid")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isBn ? "আদায়কৃত অর্থ" : "Realised Paid"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("due")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isBn ? "অবশিষ্ট বকেয়া" : "Current Due"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">{isBn ? "অবস্থা" : "Status"}</th>
                <th className="py-3 px-3 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">{isBn ? "কোনো বিক্রয় চুক্তি পাওয়া যায়নি" : "No sales contracts found"}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isBn ? "নির্বাচিত ফিল্টারের আওতায় কোনো রেকর্ড নেই" : "Try adjusting your filter or search query"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => {
                  const isFullyPaid = it.currentDue <= 0;
                  const statusBadgeClass =
                    it.status === "SOLD"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-blue-700 border-blue-200";

                  return (
                    <tr
                      key={it.id}
                      onClick={() => setActiveSale(it)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Contract & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {it.contractNo}
                        </div>
                        <div className="text-[11px] text-slate-500">{formatDate(it.saleDate)}</div>
                      </td>

                      {/* Buyer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{it.buyerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{it.buyerPhone}</span>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{it.projectName}</div>
                        {it.mouza && <div className="text-[11px] text-slate-400">{it.mouza}</div>}
                      </td>

                      {/* Plot */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {it.plotNumber}
                        </span>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {it.plotSizeShotok.toFixed(1)} Shotok
                        </div>
                      </td>

                      {/* Agreed Price */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-[13px]">
                        {formatBdt(it.totalAgreedPrice)}
                      </td>

                      {/* Collected */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-semibold text-emerald-700">
                        <div>{formatBdt(it.totalPaid)}</div>
                        <div className="text-[10px] text-emerald-600 font-normal">
                          {it.collectionRate.toFixed(1)}% collected
                        </div>
                      </td>

                      {/* Due */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-[13px]">
                        {isFullyPaid ? (
                          <span className="text-slate-400 text-xs font-normal">Cleared (৳ 0.00)</span>
                        ) : (
                          <span className="text-amber-700">{formatBdt(it.currentDue)}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadgeClass}`}>
                          {it.status === "SOLD" ? (isBn ? "বিক্রিত" : "Sold") : (isBn ? "কিস্তিতে বুকড" : "Booked")}
                        </span>
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
                  {isBn ? "সর্বমোট বিক্রয় চুক্তি ও আদায়" : "Grand Total Sales & Realizations"}
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-sm text-slate-900">
                  {formatBdt(filteredAgreed)}
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-sm text-emerald-700">
                  {formatBdt(filteredPaid)}
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-sm text-amber-700">
                  {formatBdt(filteredDue)}
                </td>
                <td colSpan={2} className="py-4 px-4 text-center text-slate-500 font-mono text-[11px]">
                  Efficiency: {filteredCollectionRate.toFixed(1)}% | Area: {filteredArea.toFixed(1)} Sh
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. Statutory Disclosure & Real Estate Compliance Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-xl mt-0.5">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <h3 className="font-semibold text-slate-900">
              {isBn
                ? "সংবিধিবদ্ধ বিক্রয় চুক্তি ও গ্রাহক অধিকার মানদণ্ড (Act No. 20 of 2010)"
                : "Statutory Plot Sales & Customer Rights Compliance"}
            </h3>
            <p>
              {isBn
                ? "এই বিক্রয় রেজিস্টারটি রিয়েল এস্টেট উন্নয়ন ও ব্যবস্থাপনা আইন, ২০১০ (২০১০ সনের ২০ নং আইন)-এর ধারা ১৪ (চুক্তি সম্পাদন ও হস্তান্তর) এবং ধারা ১৯ (কিস্তি পরিশোধ ও বিলম্ব ফি)-এর শর্তাবলী অনুসরণে তৈরি হয়েছে।"
                : "This Sales Register is maintained pursuant to Section 14 (Sales Agreements and Terms of Demarcated Handover) and Section 19 (Installment Terms & Cancellation Procedure) of the Real Estate Development and Management Act, 2010 (Act No. 20 of 2010)."}
            </p>
            <p className="text-slate-400 text-[11px]">
              {isBn
                ? "সকল অর্থ আদায় ব্যাংক রসিদ ও মানি রিসিপ্ট (MR) নম্বর দ্বারা সরাসরি ট্রেজারি একাউন্টে সংরক্ষিত এবং রেজিস্ট্রিকৃত বিক্রয় চুক্তি দলিল দ্বারা সুরক্ষিত।"
                : "All realized collections are tied to serial numbered Money Receipts (MR) credited to syndicate treasury bank accounts, and supported by registered agreement deeds (বায়নাপত্র/বিক্রয় দলিল)."}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Executive Signature Block */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
          {isBn ? "কর্তৃপক্ষের স্বাক্ষর ও প্রত্যয়ন" : "Executive Signatures & Commercial Sign-off"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6">
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "প্রধান বিক্রয় কর্মকর্তা" : "Head of Sales & CRM"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "গ্রাহক সম্পর্ক ও বুকিং" : "Customer Contract Division"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "প্রধান হিসাব কর্মকর্তা" : "Chief Financial Officer"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "আদায় ও হিসাবরক্ষণ" : "Treasury & Receivables Control"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "ব্যবস্থাপনা পরিচালক / প্রধান অংশীদার" : "Managing Director / Partner"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "চূড়ান্ত দলিল অনুমোদন" : "Executive Sales Authorization"}</p>
          </div>
        </div>
      </div>

      {/* 7. Interactive Contract Dossier Modal */}
      {activeSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? "গ্রাহক বিক্রয় চুক্তি ও কিস্তি বিবরণী" : "Customer Contract & Payment Statement"}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">{activeSale.contractNo} · {activeSale.buyerName}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSale(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Financial Banner */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">
                    {isBn ? "চুক্তি মূল্য ও পরিশোধ" : "Contract Value & Progress"}
                  </p>
                  <p className="text-2xl font-bold font-mono tracking-tight text-white mt-0.5">
                    {formatBdt(activeSale.totalAgreedPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      activeSale.currentDue <= 0
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {activeSale.statusLabelEn}
                  </span>
                  <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                    Paid: {formatBdt(activeSale.totalPaid)} ({activeSale.collectionRate.toFixed(1)}%)
                  </p>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 font-medium">Buyer:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{activeSale.buyerName}</p>
                  <p className="text-slate-500 font-mono">{activeSale.buyerPhone}</p>
                  {activeSale.buyerNid && <p className="text-slate-400 font-mono text-[10px]">NID: {activeSale.buyerNid}</p>}
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Plot & Project:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{activeSale.projectName}</p>
                  <p className="text-brand-700 font-bold font-mono">Plot #{activeSale.plotNumber} ({activeSale.plotSizeShotok} Shotok)</p>
                  <p className="text-slate-400 font-mono text-[10px]">Rate: {formatBdt(activeSale.ratePerShotok)}/sh</p>
                </div>
              </div>

              {/* Money Receipts Ledger */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? "জমা মানি রসিদ লেজার" : "Money Receipts & Payment Records"}</span>
                  </h4>
                  <span className="font-mono text-slate-500 text-[11px]">{activeSale.paymentsCount} receipts</span>
                </div>

                <div className="space-y-1.5">
                  {activeSale.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-[11px]">
                      <div>
                        <span className="font-bold font-mono text-slate-800">{p.receiptNo}</span>
                        <span className="text-slate-400 font-mono ml-2">({formatDate(p.paymentDate)})</span>
                        {p.remarks && <p className="text-[10px] text-slate-500">{p.remarks}</p>}
                      </div>
                      <span className="font-bold font-mono text-emerald-700">{formatBdt(p.amountPaid)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installment Schedules (if active) */}
              {activeSale.schedules.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? "কিস্তি সময়সূচি" : "Installment Schedule Timeline"}</span>
                    </h4>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {activeSale.paidInstallmentsCount} / {activeSale.installmentsCount} Paid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {activeSale.schedules.slice(0, 6).map((sc, i) => (
                      <div key={sc.id} className="p-1.5 bg-white rounded border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 font-mono">#{i + 1}:</span>{" "}
                          <span className="font-mono">{formatDate(sc.dueDate)}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sc.status === "PAID" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {sc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation to Buyer Statement */}
              <div className="pt-2">
                <Link
                  href={`/reports/buyer-statement?saleId=${activeSale.id}`}
                  className="w-full block text-center py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  {isBn ? "পূর্ণাঙ্গ ক্রেতা বিবরণী ও কিস্তি চার্ট খুলুন" : "Open Full Buyer Statement & Installment Chart"}
                </Link>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setActiveSale(null)}
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
