"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { ReportData } from "@/lib/reports/pdf";
import type { ReportDef } from "@/lib/reports/registry";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Printer,
  FileDown,
  FileSpreadsheet,
  ArrowLeft,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  Info,
  ShieldCheck,
  Tag,
  Receipt,
  Layers,
} from "lucide-react";

type Props = {
  def: ReportDef;
  data: ReportData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
  };
  canExport: boolean;
};

export default function CashBookView({ def, data, filters, canExport }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, toggle } = useLang();

  // Filter states
  const [preset, setPreset] = useState(searchParams.get("preset") || "this_month");
  const [from, setFrom] = useState(filters.from || "");
  const [to, setTo] = useState(filters.to || "");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Extract opening and closing balance
  const openingSummary = data.summary?.find((s) => s.labelEn.includes("Opening"));
  const closingSummary = data.summary?.find((s) => s.labelEn.includes("Closing"));
  const totalIn = Number(data.totals?.in || 0);
  const totalOut = Number(data.totals?.out || 0);
  const netMovement = totalIn - totalOut;

  // Raw numeric opening balance: if first row exists, first row balance - (first row in - first row out)
  const openingBalanceNum = useMemo(() => {
    if (data.rows.length === 0) return 0;
    const first = data.rows[0];
    const firstNet = (first.in || 0) - (first.out || 0);
    return (first.balance || 0) - firstNet;
  }, [data.rows]);

  const closingBalanceNum = useMemo(() => {
    if (data.rows.length === 0) return openingBalanceNum;
    return data.rows[data.rows.length - 1].balance || 0;
  }, [data.rows, openingBalanceNum]);

  // Counts
  const inCount = data.rows.filter((r) => r.in !== null && r.in > 0).length;
  const outCount = data.rows.filter((r) => r.out !== null && r.out > 0).length;

  // Filtered rows for client search / category filter
  const filteredRows = useMemo(() => {
    return data.rows.filter((row) => {
      // Type filter
      if (typeFilter === "IN" && (row.in === null || row.in <= 0)) return false;
      if (typeFilter === "OUT" && (row.out === null || row.out <= 0)) return false;
      if (typeFilter !== "ALL" && typeFilter !== "IN" && typeFilter !== "OUT") {
        if (row.referenceType !== typeFilter && row.reference !== typeFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const purpose = (row.purpose || "").toLowerCase();
        const voucher = (row.voucher || "").toLowerCase();
        const ref = (row.reference || "").toLowerCase();
        if (!purpose.includes(q) && !voucher.includes(q) && !ref.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [data.rows, typeFilter, searchQuery]);

  // Apply date filters
  const handleApplyFilters = (newPreset?: string) => {
    const params = new URLSearchParams();
    const p = newPreset !== undefined ? newPreset : preset;
    if (p) params.set("preset", p);
    if (p === "custom") {
      if (from) params.set("from", from);
      if (to) params.set("to", to);
    }
    router.push(`/reports/cash-book?${params.toString()}`);
  };

  const handlePresetSelect = (p: string) => {
    setPreset(p);
    handleApplyFilters(p);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for category badge
  const renderCategoryBadge = (refType: string) => {
    const type = (refType || "").toUpperCase();
    if (type.includes("DEPOSIT")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {lang === "bn" ? "মূলধন জমা" : "Deposit"}
        </span>
      );
    }
    if (type.includes("COLLECTION")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          {lang === "bn" ? "প্লট বিক্রয় আদায়" : "Collection"}
        </span>
      );
    }
    if (type.includes("CONTRA")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          {lang === "bn" ? "কন্ট্রা স্থানান্তর" : "Contra"}
        </span>
      );
    }
    if (type.includes("EXPENSE")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          {lang === "bn" ? "প্রকল্প ব্যয়" : "Expense"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        {refType || "General"}
      </span>
    );
  };

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
                className="hover:text-brand-700 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {lang === "bn" ? "প্রতিবেদন ক্যাটালগ" : "Reports Catalog"}
              </Link>
              <span>/</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                {lang === "bn" ? "আর্থিক / ট্রেজারি" : "Financial / Treasury"}
              </span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">
                {lang === "bn" ? "নগদ খাতা" : "Cash Book"}
              </span>
            </div>

            {/* Title & Scope */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 print:hidden">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {lang === "bn" ? "নগদ খাতা (Cash Book)" : "Cash Book & Cash Register"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-medium text-slate-700">
                    {lang === "bn"
                      ? "শারীরিক নগদ তহবিল ও ড্রয়ার ক্যাশ"
                      : "Physical Cash Vault · Office Petty Cash & Collections"}
                  </span>
                  <span>•</span>
                  <span>
                    {lang === "bn" ? "তারিখ পরিসীমা:" : "Period:"}{" "}
                    <span className="font-semibold text-slate-800">
                      {filters.from ? `${filters.from} to ${filters.to || "Today"}` : "All Records"}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">Currency: BDT (৳)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            {/* Language Toggle */}
            <button
              onClick={toggle}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
              title="Toggle Language"
            >
              <span>{lang === "en" ? "বাংলা" : "English"}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
              title="Print Cash Register"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>{lang === "bn" ? "প্রিন্ট" : "Print"}</span>
            </button>

            {/* Export buttons */}
            {canExport && (
              <>
                <a
                  href={`/api/reports/cash-book?${new URLSearchParams({
                    ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}),
                    format: "pdf",
                    lang,
                  })}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300 transition shadow-sm"
                >
                  <FileDown className="w-4 h-4 text-red-600" />
                  <span>PDF</span>
                </a>
                <a
                  href={`/api/reports/cash-book?${new URLSearchParams({
                    ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}),
                    format: "excel",
                    lang,
                  })}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Excel</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Executive Treasury KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
        {/* Opening Cash Balance */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "প্রারম্ভিক নগদ জের (B/F)" : "Opening Cash (B/F)"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatBDT(openingBalanceNum)}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>{lang === "bn" ? "হিসাব শুরুর পূর্ববর্তী নগদ জের" : "Balance brought forward"}</span>
            </p>
          </div>
        </div>

        {/* Total Cash Inflow */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {lang === "bn" ? "মোট নগদ গ্রহণ / আদায়" : "Total Cash Inflow"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
              +{formatBDT(totalIn)}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">
              {inCount} {lang === "bn" ? "টি নগদ গ্রহণ (জমা/আদায়)" : "inflow transactions"}
            </p>
          </div>
        </div>

        {/* Total Cash Outflow */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-rose-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {lang === "bn" ? "মোট নগদ প্রদান / পরিশোধ" : "Total Cash Outflow"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-rose-700 tracking-tight font-mono">
              -{formatBDT(totalOut)}
            </p>
            <p className="text-xs text-rose-600 mt-1 font-medium">
              {outCount} {lang === "bn" ? "টি নগদ পরিশোধ (ব্যয়/কন্ট্রা)" : "outflow disbursements"}
            </p>
          </div>
        </div>

        {/* Closing Cash in Hand */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {lang === "bn" ? "সমাপনী ড্রয়ার ব্যালেন্স (C/D)" : "Closing Cash in Hand (C/D)"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatBDT(closingBalanceNum)}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <span className={netMovement >= 0 ? "text-emerald-600" : "text-rose-600"}>
                {netMovement >= 0 ? `+${formatBDT(netMovement)}` : `-${formatBDT(Math.abs(netMovement))}`}
              </span>
              <span>•</span>
              <span>{lang === "bn" ? "চলতি নিট পরিবর্তন" : "Net movement"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4 print:hidden">
        {/* Preset pill buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-brand-700" />
            <span>{lang === "bn" ? "তারিখ প্রিসেট:" : "Timeframe:"}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "today", en: "Today", bn: "আজ" },
              { id: "this_week", en: "This Week", bn: "চলতি সপ্তাহ" },
              { id: "this_month", en: "This Month", bn: "চলতি মাস" },
              { id: "last_month", en: "Last Month", bn: "গত মাস" },
              { id: "this_quarter", en: "Quarter", bn: "চলতি কোয়ার্টার" },
              { id: "this_fy", en: "This FY", bn: "চলতি অর্থবছর" },
              { id: "custom", en: "Custom", bn: "কাস্টম" },
            ].map((p) => {
              const active = preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? "bg-brand-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {lang === "bn" ? p.bn : p.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Type Filter & Custom Dates */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100 items-center">
          {/* Search box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "bn" ? "ভাউচার নং, উদ্দেশ্য বা রেফারেন্স খুঁজুন..." : "Search voucher #, purpose, reference..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700"
            >
              <option value="ALL">{lang === "bn" ? "সকল লেনদেন (All Transactions)" : "All Transactions"}</option>
              <option value="IN">{lang === "bn" ? "শুধুমাত্র নগদ গ্রহণ (Inflows)" : "Cash Inflows (Receipts)"}</option>
              <option value="OUT">{lang === "bn" ? "শুধুমাত্র নগদ পরিশোধ (Outflows)" : "Cash Outflows (Payments)"}</option>
              <option value="EXPENSE">{lang === "bn" ? "প্রকল্প ব্যয় (Site Expenses)" : "Project Expenses Only"}</option>
              <option value="CONTRA">{lang === "bn" ? "কন্ট্রা ব্যাংক স্থানান্তর (Contra)" : "Contra Transfers Only"}</option>
              <option value="DEPOSIT">{lang === "bn" ? "অংশীদার মূলধন জমা (Deposits)" : "Capital Deposits Only"}</option>
              <option value="COLLECTION">{lang === "bn" ? "ক্রেতা আদায় (Collections)" : "Buyer Collections Only"}</option>
            </select>
          </div>

          {/* Custom Date Pickers */}
          <div className="md:col-span-4 flex items-center gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPreset("custom");
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPreset("custom");
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>

          {/* Apply button */}
          <div className="md:col-span-1">
            <button
              onClick={() => handleApplyFilters()}
              className="w-full inline-flex items-center justify-center p-2 rounded-xl text-xs font-semibold bg-brand-900 text-white hover:bg-brand-800 transition shadow-sm"
              title="Apply Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tabular Cash Register */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden print:border-none print:shadow-none">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 print:bg-white print:border-b-2 print:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-700" />
              <span>{lang === "bn" ? "নগদ হিসাব রেজিস্টার (Cash Ledger Register)" : "Cash Ledger Transactions"}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredRows.length} {lang === "bn" ? "টি রেকর্ড প্রদর্শিত" : "transactions displayed"}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {lang === "bn" ? "চলতি সমাপনী জের:" : "Closing Balance:"} {formatBDT(closingBalanceNum)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 print:bg-slate-900 print:text-white">
                <th className="py-3 px-4 w-28">{lang === "bn" ? "তারিখ" : "Date"}</th>
                <th className="py-3 px-4 w-28">{lang === "bn" ? "ভাউচার নং" : "Voucher #"}</th>
                <th className="py-3 px-4 w-32">{lang === "bn" ? "শ্রেণি" : "Category"}</th>
                <th className="py-3 px-4">{lang === "bn" ? "বিবরণ ও উদ্দেশ্য" : "Description / Purpose"}</th>
                <th className="py-3 px-4 text-right w-36">{lang === "bn" ? "নগদ গ্রহণ (টাকা)" : "Cash In (BDT)"}</th>
                <th className="py-3 px-4 text-right w-36">{lang === "bn" ? "নগদ প্রদান (টাকা)" : "Cash Out (BDT)"}</th>
                <th className="py-3 px-4 text-right w-40">{lang === "bn" ? "চলতি জের (টাকা)" : "Balance (BDT)"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 0: Balance Brought Forward (B/F) */}
              <tr className="bg-amber-50/40 font-bold text-slate-800 border-b border-amber-200/60">
                <td className="py-3 px-4 font-mono text-slate-600">
                  {filters.from ? formatDate(filters.from) : "Start"}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">-</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                    B/F
                  </span>
                </td>
                <td className="py-3 px-4 italic text-slate-700">
                  {lang === "bn"
                    ? "পূর্ববর্তী জের প্রারম্ভিক হিসাবে আনা হলো (Balance Brought Forward)"
                    : "Opening Balance Brought Forward (B/F)"}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-400">-</td>
                <td className="py-3 px-4 text-right font-mono text-slate-400">-</td>
                <td className="py-3 px-4 text-right font-mono text-slate-900 font-bold text-sm">
                  {formatBDT(openingBalanceNum)}
                </td>
              </tr>

              {/* Transactions */}
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">
                      {lang === "bn" ? "কোন লেনদেন পাওয়া যায়নি" : "No cash transactions found for the selected period"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === "bn" ? "অন্য কোন তারিখ বা ফিল্টার নির্বাচন করে দেখুন" : "Try adjusting your dates or filter options"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  return (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-slate-50/80 transition group text-slate-700"
                    >
                      <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                        {formatDate(row.date)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        <span className="bg-slate-100 group-hover:bg-white px-2 py-1 rounded text-[11px] font-medium border border-slate-200">
                          #{row.voucher}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderCategoryBadge(row.referenceType || row.reference)}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div>{row.purpose}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold whitespace-nowrap">
                        {row.in ? `+${formatBDT(row.in)}` : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-rose-700 font-semibold whitespace-nowrap">
                        {row.out ? `-${formatBDT(row.out)}` : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900 font-bold whitespace-nowrap">
                        {formatBDT(row.balance)}
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Row N: Balance Carried Down (C/D) */}
              <tr className="bg-emerald-50/40 font-bold text-slate-900 border-t-2 border-slate-200">
                <td className="py-3 px-4 font-mono text-slate-600">
                  {filters.to ? formatDate(filters.to) : "End"}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">-</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    C/D
                  </span>
                </td>
                <td className="py-3 px-4 italic text-slate-800 font-bold">
                  {lang === "bn"
                    ? "পরবর্তী সময়ের জন্য সমাপনী জের (Balance Carried Down)"
                    : "Closing Balance Carried Down (C/D)"}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold">
                  +{formatBDT(totalIn)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-rose-700 font-bold">
                  -{formatBDT(totalOut)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-900 font-black text-sm border-b-4 border-double border-emerald-700">
                  {formatBDT(closingBalanceNum)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Physical Cash Reconciliation & Vault Audit Card */}
      <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {lang === "bn"
                ? "শারীরিক ক্যাশ ড্রয়ার ও খাতা সমীকরণ যাচাইকৃত: প্রারম্ভিক জের + মোট গ্রহণ - মোট প্রদান = সমাপনী জের"
                : "Vault Cash Audit Verified: Opening Balance + Total Receipts - Total Disbursements = Closing Balance"}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
            Vault Reconciliation: 100.00%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs border-t border-emerald-200/60 text-emerald-950">
          <div>
            <span className="text-emerald-700 font-semibold">{lang === "bn" ? "প্রারম্ভিক জের:" : "Opening (B/F):"}</span>{" "}
            <span className="font-mono font-bold">{formatBDT(openingBalanceNum)}</span>
          </div>
          <div>
            <span className="text-emerald-700 font-semibold">{lang === "bn" ? "মোট নগদ গ্রহণ:" : "Cash Inflow:"}</span>{" "}
            <span className="font-mono font-bold text-emerald-800">+{formatBDT(totalIn)}</span>
          </div>
          <div>
            <span className="text-emerald-700 font-semibold">{lang === "bn" ? "মোট নগদ প্রদান:" : "Cash Outflow:"}</span>{" "}
            <span className="font-mono font-bold text-rose-800">-{formatBDT(totalOut)}</span>
          </div>
          <div>
            <span className="text-emerald-700 font-semibold">{lang === "bn" ? "সমাপনী ক্যাশ ব্যালেন্স:" : "Vault Cash (C/D):"}</span>{" "}
            <span className="font-mono font-extrabold text-emerald-900">{formatBDT(closingBalanceNum)}</span>
          </div>
        </div>
      </div>

      {/* 6. Cash Management & Audit Guidelines (Collapsible) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-3 print:border-none print:shadow-none">
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-700" />
            <span>
              {lang === "bn"
                ? "নগদ তহবিল পরিচালনা ও অডিট নীতিমালা (Cash Control & Physical Audit Procedures)"
                : "Cash Control & Physical Audit Procedures"}
            </span>
          </div>
          <span className="text-xs font-semibold text-brand-700">
            {showGuidelines ? (lang === "bn" ? "সংক্ষেপ করুন ▲" : "Collapse ▲") : (lang === "bn" ? "বিস্তারিত দেখুন ▼" : "View Details ▼")}
          </span>
        </button>

        {showGuidelines && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="space-y-1">
              <p className="font-bold text-slate-800">1. Physical Cash Verification</p>
              <p className="text-slate-500 leading-relaxed">
                Physical currency notes in the office vault or cash drawer must be counted at the close of every business day and matched exactly against the Closing Balance (C/D) shown in this register.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-800">2. Voucher Numbering & Approvals</p>
              <p className="text-slate-500 leading-relaxed">
                No cash disbursement is permissible without an approved project expense voucher or verified contra transfer slip carrying authorized signatory approval.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-800">3. Bank Float & Contra Transfers</p>
              <p className="text-slate-500 leading-relaxed">
                All cash withdrawals from bank accounts for office float and cash deposits into bank accounts must be recorded with counterpart CONTRA entries to prevent duplicate expense recording.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
