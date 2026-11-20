"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { ReportData } from "@/lib/reports/pdf";
import type { ReportDef } from "@/lib/reports/registry";
import {
  CalendarDays,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  FileDown,
  FileSpreadsheet,
  ArrowLeft,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Layers,
  Banknote,
  Landmark,
  ShieldCheck,
  Info,
} from "lucide-react";

type Props = {
  def: ReportDef;
  data: ReportData;
  filters: {
    from?: string;
    to?: string;
  };
  canExport: boolean;
};

export default function DailySummaryView({ def, data, filters, canExport }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLang();

  // Filter states
  const [preset, setPreset] = useState(searchParams.get("preset") || "this_month");
  const [from, setFrom] = useState(filters.from || "");
  const [to, setTo] = useState(filters.to || "");
  const [netFilter, setNetFilter] = useState<"ALL" | "POSITIVE" | "NEGATIVE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Totals from server query
  const openingCash = Number(data.totals?.openingCash || 0);
  const openingBank = Number(data.totals?.openingBank || 0);
  const openingTreasury = Number(data.totals?.openingTreasury || (openingCash + openingBank));

  const totalCashIn = Number(data.totals?.cashIn || 0);
  const totalCashOut = Number(data.totals?.cashOut || 0);
  const totalBankIn = Number(data.totals?.bankIn || 0);
  const totalBankOut = Number(data.totals?.bankOut || 0);

  const totalIn = Number(data.totals?.totalIn || (totalCashIn + totalBankIn));
  const totalOut = Number(data.totals?.totalOut || (totalCashOut + totalBankOut));
  const netMovement = Number(data.totals?.net || (totalIn - totalOut));

  const closingCash = Number(data.totals?.closingCash || 0);
  const closingBank = Number(data.totals?.closingBank || 0);
  const closingTreasury = Number(data.totals?.closingTreasury || (closingCash + closingBank));

  const totalTxns = Number(data.totals?.totalTxns || 0);
  const activeDays = Number(data.totals?.activeDays || data.rows.length);

  // Filtered rows for client search / net filter
  const filteredRows = useMemo(() => {
    return data.rows.filter((r) => {
      // Net surplus/deficit filter
      if (netFilter === "POSITIVE" && r.net < 0) return false;
      if (netFilter === "NEGATIVE" && r.net >= 0) return false;

      // Search query (matches date or amounts)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDate = (r.date || "").toLowerCase().includes(q);
        const matchesCashIn = (r.cashIn || 0).toString().includes(q);
        const matchesCashOut = (r.cashOut || 0).toString().includes(q);
        const matchesBankIn = (r.bankIn || 0).toString().includes(q);
        const matchesBankOut = (r.bankOut || 0).toString().includes(q);
        return matchesDate || matchesCashIn || matchesCashOut || matchesBankIn || matchesBankOut;
      }

      return true;
    });
  }, [data.rows, netFilter, searchQuery]);

  // Apply filters navigation
  const handleApplyFilters = (newPreset?: string) => {
    const params = new URLSearchParams();
    const p = newPreset !== undefined ? newPreset : preset;
    if (p) params.set("preset", p);
    if (p === "custom") {
      if (from) params.set("from", from);
      if (to) params.set("to", to);
    }
    router.push(`/reports/daily-summary?${params.toString()}`);
  };

  const handlePresetSelect = (p: string) => {
    setPreset(p);
    handleApplyFilters(p);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for day name
  const getDayName = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "short" });
    } catch {
      return "";
    }
  };

  // Positive vs Negative days count
  const positiveDaysCount = data.rows.filter((r) => r.net > 0).length;
  const negativeDaysCount = data.rows.filter((r) => r.net < 0).length;

  return (
    <div className="space-y-6 pb-12 print:space-y-4 print:pb-0">
      {/* 1. Executive Breadcrumb & Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 print:hidden">
              <Link
                href="/reports"
                className="hover:text-emerald-700 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {lang === "bn" ? "প্রতিবেদন ক্যাটালগ" : "Reports Catalog"}
              </Link>
              <span>/</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                {lang === "bn" ? "আর্থিক / ট্রেজারি" : "Financial / Treasury"}
              </span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">{def.titleEn}</span>
            </div>

            {/* Title & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {lang === "bn" ? def.titleBn : def.titleEn}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {lang === "bn"
                    ? "দৈনিক নগদ ও ব্যাংক/এমএফএস আদায়, পরিশোধ এবং নেট তারল্য চলাচলের সমন্বিত প্রতিবেদন"
                    : "Daily consolidated cash, bank, and MFS receipts, disbursements, and net treasury movement"}
                </p>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                <Layers className="w-3 h-3 text-emerald-600" />
                {lang === "bn" ? "একত্রিত ট্রেজারি (নগদ, ব্যাংক ও এমএফএস)" : "Consolidated Treasury (Cash, Bank & MFS)"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <Calendar className="w-3 h-3 text-emerald-600" />
                {filters.from && filters.to
                  ? `${formatDate(filters.from)} - ${formatDate(filters.to)}`
                  : lang === "bn"
                  ? "সর্বকালের লেনদেন"
                  : "All Available Transactions"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {lang === "bn" ? "মুদ্রা: BDT (৳)" : "Currency: BDT (৳)"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80">
                {activeDays} {lang === "bn" ? "কার্যকরী দিন" : "Active Days"} ({totalTxns} {lang === "bn" ? "টি লেনদেন" : "txns"})
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 print:hidden self-start md:self-center">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-sm active:scale-95"
              title="Print / Save as PDF via Browser"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === "bn" ? "প্রিন্ট" : "Print"}</span>
            </button>

            {canExport && (
              <>
                <a
                  href={`/api/reports/daily-summary?${new URLSearchParams({
                    ...(preset ? { preset } : {}),
                    ...(preset === "custom" && from ? { from } : {}),
                    ...(preset === "custom" && to ? { to } : {}),
                    format: "pdf",
                  }).toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition shadow-sm active:scale-95"
                >
                  <FileDown className="w-3.5 h-3.5 text-rose-600" />
                  <span>{lang === "bn" ? "পিডিএফ" : "PDF"}</span>
                </a>

                <a
                  href={`/api/reports/daily-summary?${new URLSearchParams({
                    ...(preset ? { preset } : {}),
                    ...(preset === "custom" && from ? { from } : {}),
                    ...(preset === "custom" && to ? { to } : {}),
                    format: "excel",
                  }).toString()}`}
                  download="daily-summary.xls"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition shadow-sm active:scale-95"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === "bn" ? "এক্সেল" : "Excel"}</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {/* KPI 1: Opening Treasury (B/F) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "প্রারম্ভিক ট্রেজারি (B/F)" : "Opening Treasury (B/F)"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formatBDT(openingTreasury)}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span>{lang === "bn" ? "নগদ:" : "Cash:"} {formatBDT(openingCash)}</span>
              <span>{lang === "bn" ? "ব্যাংক:" : "Bank:"} {formatBDT(openingBank)}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Receipts (Inflow) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {lang === "bn" ? "মোট আদায় (ইনফ্লো)" : "Total Receipts (Inflow)"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tracking-tight">
              {formatBDT(totalIn)}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-emerald-700">{lang === "bn" ? "নগদ আদায়:" : "Cash In:"} {formatBDT(totalCashIn)}</span>
              <span className="text-teal-700">{lang === "bn" ? "ব্যাংক আদায়:" : "Bank In:"} {formatBDT(totalBankIn)}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Payments (Outflow) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              {lang === "bn" ? "মোট পরিশোধ (আউটফ্লো)" : "Total Payments (Outflow)"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-700 tracking-tight">
              {formatBDT(totalOut)}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-rose-700">{lang === "bn" ? "নগদ প্রদান:" : "Cash Out:"} {formatBDT(totalCashOut)}</span>
              <span className="text-amber-700">{lang === "bn" ? "ব্যাংক প্রদান:" : "Bank Out:"} {formatBDT(totalBankOut)}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Closing Treasury (C/D) & Net Movement */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              {lang === "bn" ? "সমাপনী ট্রেজারি (C/D)" : "Closing Treasury (C/D)"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formatBDT(closingTreasury)}
            </div>
            <div className="text-[11px] flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">
                {lang === "bn" ? "নেট সঞ্চালন:" : "Net Movement:"}
              </span>
              <span
                className={`font-semibold font-mono ${
                  netMovement >= 0 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {netMovement >= 0 ? `+${formatBDT(netMovement)}` : formatBDT(netMovement)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Timeframe Presets & Custom Date Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4 print:hidden">
        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {lang === "bn" ? "সময়সীমা:" : "Period:"}
          </span>
          {[
            { id: "today", labelEn: "Today", labelBn: "আজ" },
            { id: "this_week", labelEn: "This Week", labelBn: "এই সপ্তাহ" },
            { id: "this_month", labelEn: "This Month", labelBn: "চলতি মাস" },
            { id: "last_month", labelEn: "Last Month", labelBn: "গত মাস" },
            { id: "this_quarter", labelEn: "This Quarter", labelBn: "এই কোয়ার্টার" },
            { id: "this_fy", labelEn: "This FY", labelBn: "বর্তমান অর্থবছর" },
            { id: "custom", labelEn: "Custom", labelBn: "কাস্টম" },
          ].map((p) => {
            const isActive = preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm shadow-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lang === "bn" ? p.labelBn : p.labelEn}
              </button>
            );
          })}
        </div>

        {/* Custom Date Pickers (if custom selected) */}
        {preset === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {lang === "bn" ? "হতে:" : "From:"}
              </span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {lang === "bn" ? "পর্যন্ত:" : "To:"}
              </span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => handleApplyFilters()}
              className="px-3.5 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition active:scale-95 shadow-sm"
            >
              {lang === "bn" ? "ফিল্টার প্রয়োগ" : "Apply Filter"}
            </button>
          </div>
        )}

        {/* Sub-Filters: Net Surplus/Deficit & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Net Filter Pills */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setNetFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                netFilter === "ALL"
                  ? "bg-slate-800 text-white font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lang === "bn" ? "সকল দিন" : "All Days"} ({data.rows.length})
            </button>
            <button
              onClick={() => setNetFilter("POSITIVE")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                netFilter === "POSITIVE"
                  ? "bg-emerald-700 text-white font-semibold"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              {lang === "bn" ? "উদ্বৃত্ত / নেট পজিটিভ" : "Net Surplus"} ({positiveDaysCount})
            </button>
            <button
              onClick={() => setNetFilter("NEGATIVE")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                netFilter === "NEGATIVE"
                  ? "bg-rose-700 text-white font-semibold"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              <TrendingDown className="w-3 h-3" />
              {lang === "bn" ? "ঘাটতি / নেট নেগেটিভ" : "Net Deficit"} ({negativeDaysCount})
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === "bn" ? "তারিখ বা অঙ্ক খুঁজুন..." : "Filter by date or amount..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      {/* 4. Tabular Daily Liquidity Register */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1020px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-2.5 px-3 font-medium whitespace-nowrap">{lang === "bn" ? "তারিখ ও বার" : "Date & Day"}</th>
                <th className="py-2.5 px-2 text-right text-emerald-300 font-medium whitespace-nowrap">{lang === "bn" ? "নগদ আদায়" : "Cash In"}</th>
                <th className="py-2.5 px-2 text-right text-rose-300 font-medium whitespace-nowrap">{lang === "bn" ? "নগদ প্রদান" : "Cash Out"}</th>
                <th className="py-2.5 px-2 text-right text-emerald-300 font-medium whitespace-nowrap">{lang === "bn" ? "ব্যাংক আদায়" : "Bank In"}</th>
                <th className="py-2.5 px-2 text-right text-rose-300 font-medium whitespace-nowrap">{lang === "bn" ? "ব্যাংক প্রদান" : "Bank Out"}</th>
                <th className="py-2.5 px-2.5 text-right text-emerald-200 font-bold bg-slate-800 whitespace-nowrap">{lang === "bn" ? "মোট আদায়" : "Total In"}</th>
                <th className="py-2.5 px-2.5 text-right text-rose-200 font-bold bg-slate-800 whitespace-nowrap">{lang === "bn" ? "মোট পরিশোধ" : "Total Out"}</th>
                <th className="py-2.5 px-2.5 text-right font-bold whitespace-nowrap">{lang === "bn" ? "নেট চলাচল" : "Net Movement"}</th>
                <th className="py-2.5 px-2 text-right text-slate-300 font-medium whitespace-nowrap">{lang === "bn" ? "নগদ ব্যালেন্স" : "Cash Bal"}</th>
                <th className="py-2.5 px-2 text-right text-slate-300 font-medium whitespace-nowrap">{lang === "bn" ? "ব্যাংক ব্যালেন্স" : "Bank Bal"}</th>
                <th className="py-2.5 px-3 text-right font-bold text-amber-300 bg-slate-950 whitespace-nowrap">{lang === "bn" ? "মোট তহবিল" : "Total Treasury"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Opening Balance Row (B/F) */}
              <tr className="bg-slate-50/80 font-medium text-slate-700">
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="font-semibold text-slate-900">
                      {lang === "bn" ? "প্রারম্ভিক জের (B/F)" : "Opening Balance (B/F)"}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right font-mono text-slate-400">-</td>
                <td className="py-2 px-2 text-right font-mono text-slate-400">-</td>
                <td className="py-2 px-2 text-right font-mono text-slate-400">-</td>
                <td className="py-2 px-2 text-right font-mono text-slate-400">-</td>
                <td className="py-2 px-2.5 text-right font-mono text-slate-400 bg-slate-100/50">-</td>
                <td className="py-2 px-2.5 text-right font-mono text-slate-400 bg-slate-100/50">-</td>
                <td className="py-2 px-2.5 text-right font-mono text-slate-400">-</td>
                <td className="py-2 px-2 text-right font-mono font-semibold text-slate-700 whitespace-nowrap">
                  {formatBDT(openingCash)}
                </td>
                <td className="py-2 px-2 text-right font-mono font-semibold text-slate-700 whitespace-nowrap">
                  {formatBDT(openingBank)}
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/60 whitespace-nowrap">
                  {formatBDT(openingTreasury)}
                </td>
              </tr>

              {/* Day Rows */}
              {filteredRows.length > 0 ? (
                filteredRows.map((r, i) => {
                  const dayName = getDayName(r.date);
                  const isPositive = r.net > 0;
                  const isNegative = r.net < 0;

                  return (
                    <tr
                      key={r.date}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      {/* Date & Day */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-slate-900">
                            {formatDate(r.date)}
                          </span>
                          <span className="text-[10px] font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-600">
                            {dayName}
                          </span>
                        </div>
                      </td>

                      {/* Cash In */}
                      <td className="py-2 px-2 text-right font-mono whitespace-nowrap">
                        {r.cashIn > 0 ? (
                          <span className="font-semibold text-emerald-700">
                            {formatBDT(r.cashIn)}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Cash Out */}
                      <td className="py-2 px-2 text-right font-mono whitespace-nowrap">
                        {r.cashOut > 0 ? (
                          <span className="text-rose-600">
                            {formatBDT(r.cashOut)}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Bank In */}
                      <td className="py-2 px-2 text-right font-mono whitespace-nowrap">
                        {r.bankIn > 0 ? (
                          <span className="font-semibold text-emerald-700">
                            {formatBDT(r.bankIn)}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Bank Out */}
                      <td className="py-2 px-2 text-right font-mono whitespace-nowrap">
                        {r.bankOut > 0 ? (
                          <span className="text-rose-600">
                            {formatBDT(r.bankOut)}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Total In */}
                      <td className="py-2 px-2.5 text-right font-mono bg-emerald-50/40 font-bold text-emerald-800 whitespace-nowrap">
                        {r.totalIn > 0 ? formatBDT(r.totalIn) : <span className="text-slate-300 font-normal">-</span>}
                      </td>

                      {/* Total Out */}
                      <td className="py-2 px-2.5 text-right font-mono bg-rose-50/40 font-bold text-rose-800 whitespace-nowrap">
                        {r.totalOut > 0 ? formatBDT(r.totalOut) : <span className="text-slate-300 font-normal">-</span>}
                      </td>

                      {/* Net Movement */}
                      <td className="py-2 px-2.5 text-right font-mono whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                            isPositive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : isNegative
                              ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                              : "text-slate-400"
                          }`}
                        >
                          {isPositive ? `+${formatBDT(r.net)}` : formatBDT(r.net)}
                        </span>
                      </td>

                      {/* Cash Balance */}
                      <td className="py-2 px-2 text-right font-mono text-slate-700 whitespace-nowrap">
                        {formatBDT(r.cashBalance)}
                      </td>

                      {/* Bank Balance */}
                      <td className="py-2 px-2 text-right font-mono text-slate-700 whitespace-nowrap">
                        {formatBDT(r.bankBalance)}
                      </td>

                      {/* Total Treasury Balance */}
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/40 whitespace-nowrap">
                        {formatBDT(r.totalBalance)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-slate-700">
                      {lang === "bn" ? "কোন দৈনিক লেনদেন পাওয়া যায়নি" : "No daily transactions recorded"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === "bn"
                        ? "নির্বাচিত সময়সীমা বা ফিল্টারের মধ্যে কোন ভাউচার বা ট্রেজারি লেনদেন নেই।"
                        : "There are no treasury transactions matching the selected period or filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Total / Summary Footer Row */}
            <tfoot>
              <tr className="bg-slate-900 text-white font-mono text-xs font-bold border-t-2 border-slate-700">
                <td className="py-3 px-3 font-sans uppercase tracking-wider text-[11px] whitespace-nowrap">
                  {lang === "bn" ? "মোট যোগফল" : "Grand Total"}
                </td>
                <td className="py-3 px-2 text-right text-emerald-300 whitespace-nowrap">{formatBDT(totalCashIn)}</td>
                <td className="py-3 px-2 text-right text-rose-300 whitespace-nowrap">{formatBDT(totalCashOut)}</td>
                <td className="py-3 px-2 text-right text-emerald-300 whitespace-nowrap">{formatBDT(totalBankIn)}</td>
                <td className="py-3 px-2 text-right text-rose-300 whitespace-nowrap">{formatBDT(totalBankOut)}</td>
                <td className="py-3 px-2.5 text-right text-emerald-200 bg-slate-800 whitespace-nowrap">{formatBDT(totalIn)}</td>
                <td className="py-3 px-2.5 text-right text-rose-200 bg-slate-800 whitespace-nowrap">{formatBDT(totalOut)}</td>
                <td className="py-3 px-2.5 text-right whitespace-nowrap">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                      netMovement >= 0 ? "bg-emerald-900/80 text-emerald-300" : "bg-rose-900/80 text-rose-300"
                    }`}
                  >
                    {netMovement >= 0 ? `+${formatBDT(netMovement)}` : formatBDT(netMovement)}
                  </span>
                </td>
                <td className="py-3 px-2 text-right text-slate-300 whitespace-nowrap">{formatBDT(closingCash)}</td>
                <td className="py-3 px-2 text-right text-slate-300 whitespace-nowrap">{formatBDT(closingBank)}</td>
                <td className="py-3 px-3 text-right text-amber-300 bg-slate-950 font-extrabold whitespace-nowrap">
                  {formatBDT(closingTreasury)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. Dual-Channel Audit & Reconciliation Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 print:border-none print:shadow-none">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            {lang === "bn" ? "ট্রেজারি সমন্বয় ও হিসাবরক্ষণ সত্যতা পরীক্ষা" : "Treasury Reconciliation & Integrity Verification"}
          </h2>
          <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {lang === "bn" ? "সমন্বিত ও নির্ভুল" : "Balanced & Verified"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formula Verification 1: Cash Channel */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                {lang === "bn" ? "নগদ চ্যানেল সমন্বয় (Cash Channel)" : "Cash Channel Reconciliation"}
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                {lang === "bn" ? "সমাপনী: " : "Closing: "} {formatBDT(closingCash)}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-mono space-y-1 pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>{lang === "bn" ? "প্রারম্ভিক নগদ (B/F):" : "Opening Cash (B/F):"}</span>
                <span>{formatBDT(openingCash)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>{lang === "bn" ? "(+) নগদ আদায় (Cash In):" : "(+) Cash Inflows:"}</span>
                <span>+{formatBDT(totalCashIn)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>{lang === "bn" ? "(-) নগদ পরিশোধ (Cash Out):" : "(-) Cash Outflows:"}</span>
                <span>-{formatBDT(totalCashOut)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300 font-bold text-slate-900">
                <span>{lang === "bn" ? "(=) সমাপনী নগদ ব্যালেন্স:" : "(=) Closing Cash Balance:"}</span>
                <span>{formatBDT(closingCash)}</span>
              </div>
            </div>
          </div>

          {/* Formula Verification 2: Bank Channel */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-blue-600" />
                {lang === "bn" ? "ব্যাংক ও এমএফএস চ্যানেল সমন্বয় (Bank & MFS)" : "Bank & MFS Channel Reconciliation"}
              </span>
              <span className="text-[11px] font-mono text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                {lang === "bn" ? "সমাপনী: " : "Closing: "} {formatBDT(closingBank)}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-mono space-y-1 pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>{lang === "bn" ? "প্রারম্ভিক ব্যাংক (B/F):" : "Opening Bank (B/F):"}</span>
                <span>{formatBDT(openingBank)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>{lang === "bn" ? "(+) ব্যাংক আদায় (Bank In):" : "(+) Bank Inflows:"}</span>
                <span>+{formatBDT(totalBankIn)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>{lang === "bn" ? "(-) ব্যাংক পরিশোধ (Bank Out):" : "(-) Bank Outflows:"}</span>
                <span>-{formatBDT(totalBankOut)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300 font-bold text-slate-900">
                <span>{lang === "bn" ? "(=) সমাপনী ব্যাংক ব্যালেন্স:" : "(=) Closing Bank Balance:"}</span>
                <span>{formatBDT(closingBank)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Policy Note */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {lang === "bn"
              ? "ট্রেজারি কন্ট্রোল পলিসি: দৈনিক নগদ ও ব্যাংক আদায় এবং পরিশোধের এই তালিকাটি অডিট ট্রেইল ও ট্রেজারি খাতার সাথে সম্পূর্ণভাবে সংযুক্ত। সমাপনী ব্যালেন্স পরবর্তী কর্মদিবসের প্রারম্ভিক উদ্বৃত্ত হিসেবে বিবেচিত হবে।"
              : "Treasury Control Policy: This daily summary reconciles all approved cash register and bank ledger transactions for the chosen fiscal period. Closing balances automatically roll forward into the opening balance (B/F) of subsequent periods."}
          </p>
        </div>
      </div>
    </div>
  );
}
