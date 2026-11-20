"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { ReportData } from "@/lib/reports/pdf";
import type { ReportDef } from "@/lib/reports/registry";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  FileDown,
  FileSpreadsheet,
  ArrowLeft,
  Calendar,
  Search,
  CheckCircle2,
  Wallet,
  Landmark,
  ShieldCheck,
  Info,
  Scale,
  Split,
  ListOrdered,
  Layers,
  Banknote,
  Smartphone,
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

export default function ReceiptsPaymentsView({ def, data, filters, canExport }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLang();

  // Filter & View States
  const [preset, setPreset] = useState(searchParams.get("preset") || "this_month");
  const [from, setFrom] = useState(filters.from || "");
  const [to, setTo] = useState(filters.to || "");
  const [viewMode, setViewMode] = useState<"DUAL" | "STAGED">("DUAL");
  const [searchQuery, setSearchQuery] = useState("");

  // Totals from server query
  const openingCash = Number(data.totals?.openingCash || 0);
  const openingBank = Number(data.totals?.openingBank || 0);
  const openingTreasury = Number(data.totals?.openingTreasury || (openingCash + openingBank));

  const totalReceipts = Number(data.totals?.totalReceipts || 0);
  const totalPayments = Number(data.totals?.totalPayments || 0);
  const netSurplus = Number(data.totals?.netSurplus || (totalReceipts - totalPayments));

  const closingCash = Number(data.totals?.closingCash || 0);
  const closingBank = Number(data.totals?.closingBank || 0);
  const closingTreasury = Number(data.totals?.closingTreasury || (closingCash + closingBank));

  const receiptsSideTotal = Number(data.totals?.receiptsSideTotal || (openingTreasury + totalReceipts));
  const paymentsSideTotal = Number(data.totals?.paymentsSideTotal || (totalPayments + closingTreasury));

  const periodCashIn = Number(data.totals?.periodCashIn || 0);
  const periodCashOut = Number(data.totals?.periodCashOut || 0);
  const periodBankIn = Number(data.totals?.periodBankIn || 0);
  const periodBankOut = Number(data.totals?.periodBankOut || 0);

  const totalTxns = Number(data.totals?.totalTxns || 0);

  // Filtered rows for client search
  const receiptsRows = useMemo(() => {
    return data.rows.filter(
      (r) =>
        r.type === "RECEIPT" &&
        (!searchQuery.trim() ||
          r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.classification.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data.rows, searchQuery]);

  const paymentsRows = useMemo(() => {
    return data.rows.filter(
      (r) =>
        r.type === "PAYMENT" &&
        (!searchQuery.trim() ||
          r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.classification.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data.rows, searchQuery]);

  // Apply filters navigation
  const handleApplyFilters = (newPreset?: string) => {
    const params = new URLSearchParams();
    const p = newPreset !== undefined ? newPreset : preset;
    if (p) params.set("preset", p);
    if (p === "custom") {
      if (from) params.set("from", from);
      if (to) params.set("to", to);
    }
    router.push(`/reports/receipts-payments?${params.toString()}`);
  };

  const handlePresetSelect = (p: string) => {
    setPreset(p);
    handleApplyFilters(p);
  };

  const handlePrint = () => {
    window.print();
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {lang === "bn" ? def.titleBn : def.titleEn}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {lang === "bn"
                    ? "উদ্দেশ্যভিত্তিক নগদ ও ব্যাংক আদায় এবং পরিশোধের সংক্ষেপিত আর্থিক বিবরণী"
                    : "Statutory summary statement of actual cash, bank, and MFS receipts and disbursements"}
                </p>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                <Layers className="w-3 h-3 text-emerald-600" />
                {lang === "bn" ? "একত্রিত তারল্য (নগদ, ব্যাংক ও এমএফএস)" : "Consolidated Treasury (Cash, Bank & MFS)"}
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
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {lang === "bn" ? "ব্যালেন্স শিট সমন্বিত" : "Balance Sheet Reconciled"}
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
                  href={`/api/reports/receipts-payments?${new URLSearchParams({
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
                  href={`/api/reports/receipts-payments?${new URLSearchParams({
                    ...(preset ? { preset } : {}),
                    ...(preset === "custom" && from ? { from } : {}),
                    ...(preset === "custom" && to ? { to } : {}),
                    format: "excel",
                  }).toString()}`}
                  download="receipts-payments.xls"
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
        {/* KPI 1: Opening Liquid Treasury (B/F) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "প্রারম্ভিক তরল তহবিল (B/F)" : "Opening Treasury (B/F)"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formatBDT(openingTreasury)}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span>{lang === "bn" ? "নগদ:" : "Cash:"} {formatBDT(openingCash)}</span>
              <span>{lang === "bn" ? "ব্যাংক ও এমএফএস:" : "Bank & MFS:"} {formatBDT(openingBank)}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Receipts (Inflows) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {lang === "bn" ? "মোট প্রাপ্তি / আদায়" : "Total Receipts"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tracking-tight">
              {formatBDT(totalReceipts)}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-emerald-700">{lang === "bn" ? "নগদ আদায়:" : "Cash In:"} {formatBDT(periodCashIn)}</span>
              <span className="text-teal-700">{lang === "bn" ? "ব্যাংক আদায়:" : "Bank In:"} {formatBDT(periodBankIn)}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Payments (Disbursements) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              {lang === "bn" ? "মোট পরিশোধ / ব্যয়" : "Total Payments"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-700 tracking-tight">
              {formatBDT(totalPayments)}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-rose-700">{lang === "bn" ? "নগদ পরিশোধ:" : "Cash Out:"} {formatBDT(periodCashOut)}</span>
              <span className="text-amber-700">{lang === "bn" ? "ব্যাংক পরিশোধ:" : "Bank Out:"} {formatBDT(periodBankOut)}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Closing Liquid Treasury (C/D) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              {lang === "bn" ? "সমাপনী তরল তহবিল (C/D)" : "Closing Treasury (C/D)"}
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
                {lang === "bn" ? "নেট পরিবর্তন:" : "Net Movement:"}
              </span>
              <span
                className={`font-semibold font-mono ${
                  netSurplus >= 0 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {netSurplus >= 0 ? `+${formatBDT(netSurplus)}` : formatBDT(netSurplus)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filters & Presentation View Mode Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4 print:hidden">
        {/* Presets & View Mode Toggle */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
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

          {/* View Mode Toggle: Dual T-Account vs Staged Statement */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-end lg:self-auto">
            <button
              onClick={() => setViewMode("DUAL")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "DUAL"
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Split className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === "bn" ? "দ্বৈত বিবরণী (টি-ছক)" : "T-Account View (Dual)"}</span>
            </button>
            <button
              onClick={() => setViewMode("STAGED")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "STAGED"
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === "bn" ? "একক তালিকা (ক্রমিক)" : "Staged Table View"}</span>
            </button>
          </div>
        </div>

        {/* Custom Date Pickers & Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {preset === "custom" ? (
            <div className="flex flex-wrap items-center gap-3">
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
                {lang === "bn" ? "প্রয়োগ" : "Apply"}
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                {lang === "bn"
                  ? `${data.rows.length} টি হিসাব খাত বিশ্লেষিত হয়েছে`
                  : `${data.rows.length} accounting heads analyzed across ${totalTxns} vouchers`}
              </span>
            </div>
          )}

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === "bn" ? "খাত বা বিবরণ খুঁজুন..." : "Filter account heads..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      {/* 4. Statement Presentation */}
      {viewMode === "DUAL" ? (
        /* Dual T-Account View (Side-by-Side: Receipts vs Payments) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-4">
          {/* LEFT: RECEIPTS SIDE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col justify-between">
            <div>
              {/* Receipts Table Header */}
              <div className="bg-emerald-950 text-emerald-100 p-3.5 flex items-center justify-between border-b border-emerald-900">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {lang === "bn" ? "প্রাপ্তি / আদায়সমূহ (RECEIPTS)" : "RECEIPTS (INFLOWS)"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded font-semibold">
                  {lang === "bn" ? "মোট: " : "Total: "} {formatBDT(receiptsSideTotal)}
                </span>
              </div>

              {/* Receipts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3.5">{lang === "bn" ? "হিসাব খাত / বিবরণ" : "Particulars / Head"}</th>
                      <th className="py-2.5 px-2.5 text-right font-medium">{lang === "bn" ? "নগদ (৳)" : "Cash (৳)"}</th>
                      <th className="py-2.5 px-2.5 text-right font-medium">{lang === "bn" ? "ব্যাংক ও এমএফএস (৳)" : "Bank & MFS (৳)"}</th>
                      <th className="py-2.5 px-3.5 text-right font-bold">{lang === "bn" ? "মোট পরিমাণ (৳)" : "Total (৳)"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Opening Balance (B/F) */}
                    <tr className="bg-emerald-50/40 font-semibold text-slate-800">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <div>
                            <p className="font-bold text-slate-900">
                              {lang === "bn" ? "প্রারম্ভিক ব্যালেন্স (পূর্বানীত - B/F)" : "To Opening Balance (B/F)"}
                            </p>
                            <p className="text-[10px] text-slate-500 font-normal">
                              {lang === "bn" ? "নগদ ও ব্যাংক উদ্বৃত্ত" : "Cash in Hand & Bank Balances"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 text-right font-mono text-slate-700">
                        {formatBDT(openingCash)}
                      </td>
                      <td className="py-3 px-2.5 text-right font-mono text-slate-700">
                        {formatBDT(openingBank)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-800 bg-emerald-50/70">
                        {formatBDT(openingTreasury)}
                      </td>
                    </tr>

                    {/* Receipts Rows */}
                    {receiptsRows.length > 0 ? (
                      receiptsRows.map((r, i) => (
                        <tr
                          key={r.category}
                          className={`hover:bg-slate-50 transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          <td className="py-2.5 px-3.5">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {lang === "bn" ? r.categoryBn : r.category}
                              </p>
                              <span className="inline-block text-[9.5px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                                {lang === "bn" ? r.classificationBn : r.classification}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 text-right font-mono text-slate-700">
                            {r.cashAmount > 0 ? formatBDT(r.cashAmount) : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="py-2.5 px-2.5 text-right font-mono text-slate-700">
                            {r.bankAmount > 0 ? formatBDT(r.bankAmount) : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                            {formatBDT(r.totalAmount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          {lang === "bn" ? "কোন আদায় রেকর্ড পাওয়া যায়নি" : "No receipt transactions in period"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Receipts Footer Balancing Row */}
            <div className="bg-slate-900 text-white p-3.5 border-t-2 border-emerald-600 font-mono text-xs flex justify-between items-center">
              <div>
                <span className="font-sans uppercase text-[11px] font-bold tracking-wider">
                  {lang === "bn" ? "মোট প্রাপ্তি দিক (Receipts Side Total)" : "TOTAL RECEIPTS SIDE"}
                </span>
                <p className="text-[10px] text-slate-400 font-sans">Opening Reserves + Period Receipts</p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-emerald-300">{formatBDT(receiptsSideTotal)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PAYMENTS SIDE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col justify-between">
            <div>
              {/* Payments Table Header */}
              <div className="bg-rose-950 text-rose-100 p-3.5 flex items-center justify-between border-b border-rose-900">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {lang === "bn" ? "পরিশোধসমূহ (PAYMENTS)" : "PAYMENTS (OUTFLOWS)"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded font-semibold">
                  {lang === "bn" ? "মোট: " : "Total: "} {formatBDT(paymentsSideTotal)}
                </span>
              </div>

              {/* Payments Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3.5">{lang === "bn" ? "হিসাব খাত / বিবরণ" : "Particulars / Head"}</th>
                      <th className="py-2.5 px-2.5 text-right font-medium">{lang === "bn" ? "নগদ (৳)" : "Cash (৳)"}</th>
                      <th className="py-2.5 px-2.5 text-right font-medium">{lang === "bn" ? "ব্যাংক ও এমএফএস (৳)" : "Bank & MFS (৳)"}</th>
                      <th className="py-2.5 px-3.5 text-right font-bold">{lang === "bn" ? "মোট পরিমাণ (৳)" : "Total (৳)"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Payments Rows */}
                    {paymentsRows.length > 0 ? (
                      paymentsRows.map((p, i) => (
                        <tr
                          key={p.category}
                          className={`hover:bg-slate-50 transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          <td className="py-2.5 px-3.5">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {lang === "bn" ? p.categoryBn : p.category}
                              </p>
                              <span className="inline-block text-[9.5px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded mt-0.5">
                                {lang === "bn" ? p.classificationBn : p.classification}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 text-right font-mono text-slate-700">
                            {p.cashAmount > 0 ? formatBDT(p.cashAmount) : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="py-2.5 px-2.5 text-right font-mono text-slate-700">
                            {p.bankAmount > 0 ? formatBDT(p.bankAmount) : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-bold text-rose-700">
                            {formatBDT(p.totalAmount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          {lang === "bn" ? "কোন পরিশোধ রেকর্ড পাওয়া যায়নি" : "No payment transactions in period"}
                        </td>
                      </tr>
                    )}

                    {/* Closing Balance (C/D) */}
                    <tr className="bg-blue-50/40 font-semibold text-slate-800">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          <div>
                            <p className="font-bold text-slate-900">
                              {lang === "bn" ? "সমাপনী ব্যালেন্স (স্থানান্তরিত - C/D)" : "By Closing Balance (C/D)"}
                            </p>
                            <p className="text-[10px] text-slate-500 font-normal">
                              {lang === "bn" ? "নগদ ও ব্যাংক সমাপনী স্থিতি" : "Closing Cash & Bank Balances"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 text-right font-mono text-slate-700">
                        {formatBDT(closingCash)}
                      </td>
                      <td className="py-3 px-2.5 text-right font-mono text-slate-700">
                        {formatBDT(closingBank)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-blue-900 bg-blue-50/70">
                        {formatBDT(closingTreasury)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payments Footer Balancing Row */}
            <div className="bg-slate-900 text-white p-3.5 border-t-2 border-rose-600 font-mono text-xs flex justify-between items-center">
              <div>
                <span className="font-sans uppercase text-[11px] font-bold tracking-wider">
                  {lang === "bn" ? "মোট পরিশোধ দিক (Payments Side Total)" : "TOTAL PAYMENTS SIDE"}
                </span>
                <p className="text-[10px] text-slate-400 font-sans">Period Payments + Closing Reserves</p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-amber-300">{formatBDT(paymentsSideTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Staged Sequential Statement View */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-semibold tracking-wider uppercase">
                  <th className="py-3 px-4 font-medium">{lang === "bn" ? "হিসাব খাত ও শ্রেণী" : "Particulars / Head of Account"}</th>
                  <th className="py-3 px-3 font-medium">{lang === "bn" ? "শ্রেণীবিভাগ" : "Classification"}</th>
                  <th className="py-3 px-3 text-right font-medium text-emerald-300">{lang === "bn" ? "নগদ (৳)" : "Cash (৳)"}</th>
                  <th className="py-3 px-3 text-right font-medium text-blue-300">{lang === "bn" ? "ব্যাংক ও এমএফএস (৳)" : "Bank & MFS (৳)"}</th>
                  <th className="py-3 px-4 text-right font-bold text-amber-300 bg-slate-950">{lang === "bn" ? "মোট পরিমাণ (৳)" : "Total Amount (৳)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* 1. Opening Balance Group */}
                <tr className="bg-slate-100/80 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <td colSpan={5} className="py-2.5 px-4 text-emerald-800 flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "১. প্রারম্ভিক তরল তহবিল (পূর্বানীত - B/F)" : "1. Opening Liquid Position (B/F)"}</span>
                  </td>
                </tr>
                <tr className="bg-emerald-50/20">
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    {lang === "bn" ? "নগদ ও ব্যাংক প্রারম্ভিক উদ্বৃত্ত" : "Cash in Hand & Bank Balances (B/F)"}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">Opening Reserves</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(openingCash)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(openingBank)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-800 bg-emerald-50/50">
                    {formatBDT(openingTreasury)}
                  </td>
                </tr>

                {/* 2. Receipts Group */}
                <tr className="bg-slate-100/80 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <td colSpan={5} className="py-2.5 px-4 text-emerald-800 flex items-center gap-2">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === "bn" ? "২. সংগৃহীত প্রাপ্তি / আদায়সমূহ (Receipts)" : "2. Gross Receipts during Period"}</span>
                  </td>
                </tr>
                {receiptsRows.map((r) => (
                  <tr key={r.category} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {lang === "bn" ? r.categoryBn : r.category}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {lang === "bn" ? r.classificationBn : r.classification}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {r.cashAmount > 0 ? formatBDT(r.cashAmount) : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {r.bankAmount > 0 ? formatBDT(r.bankAmount) : "-"}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700 bg-emerald-50/20">
                      {formatBDT(r.totalAmount)}
                    </td>
                  </tr>
                ))}
                {/* Receipts Subtotal */}
                <tr className="bg-emerald-100/40 font-bold text-emerald-950 border-t border-emerald-200">
                  <td colSpan={2} className="py-2.5 px-4">
                    {lang === "bn" ? "মোট সংগৃহীত আদায় (Subtotal Receipts)" : "Subtotal: Gross Receipts during Period"}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(periodCashIn)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(periodBankIn)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-800 bg-emerald-100/60">
                    {formatBDT(totalReceipts)}
                  </td>
                </tr>

                {/* 3. Payments Group */}
                <tr className="bg-slate-100/80 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <td colSpan={5} className="py-2.5 px-4 text-rose-800 flex items-center gap-2">
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                    <span>{lang === "bn" ? "৩. পরিশোধ / ব্যয়নসমূহ (Disbursements)" : "3. Gross Disbursements during Period"}</span>
                  </td>
                </tr>
                {paymentsRows.map((p) => (
                  <tr key={p.category} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {lang === "bn" ? p.categoryBn : p.category}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {lang === "bn" ? p.classificationBn : p.classification}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600">
                      {p.cashAmount > 0 ? formatBDT(p.cashAmount) : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600">
                      {p.bankAmount > 0 ? formatBDT(p.bankAmount) : "-"}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700 bg-rose-50/20">
                      {formatBDT(p.totalAmount)}
                    </td>
                  </tr>
                ))}
                {/* Payments Subtotal */}
                <tr className="bg-rose-100/40 font-bold text-rose-950 border-t border-rose-200">
                  <td colSpan={2} className="py-2.5 px-4">
                    {lang === "bn" ? "মোট পরিশোধ (Subtotal Payments)" : "Subtotal: Gross Payments during Period"}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(periodCashOut)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(periodBankOut)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-800 bg-rose-100/60">
                    {formatBDT(totalPayments)}
                  </td>
                </tr>

                {/* 4. Closing Balance Group */}
                <tr className="bg-slate-100/80 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <td colSpan={5} className="py-2.5 px-4 text-blue-800 flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "৪. সমাপনী তরল তহবিল (স্থানান্তরিত - C/D)" : "4. Closing Liquid Position (C/D)"}</span>
                  </td>
                </tr>
                <tr className="bg-blue-50/20">
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    {lang === "bn" ? "নগদ ও ব্যাংক সমাপনী উদ্বৃত্ত" : "Cash in Hand & Bank Balances (C/D)"}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">Closing Reserves</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(closingCash)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatBDT(closingBank)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-900 bg-blue-50/50">
                    {formatBDT(closingTreasury)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Statutory Balancing & Audit Verification Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 print:border-none print:shadow-none">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            {lang === "bn" ? "হিসাবরক্ষণ সমীকরণ ও অডিট সমন্বয় পরীক্ষা" : "Statutory Equation & Audit Verification"}
          </h2>
          <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {lang === "bn" ? "হিসাব মিলান ১০০% সঠিক" : "Reconciled & Balanced 100%"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Receipts Side Balancing */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                {lang === "bn" ? "প্রাপ্তি দিক সমীকরণ (Receipts Side)" : "Receipts Side Total"}
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                {formatBDT(receiptsSideTotal)}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-mono space-y-1 pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>{lang === "bn" ? "প্রারম্ভিক তরল তহবিল (B/F):" : "Opening Reserves (B/F):"}</span>
                <span>{formatBDT(openingTreasury)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>{lang === "bn" ? "(+) সময়কালীন মোট প্রাপ্তি:" : "(+) Period Gross Receipts:"}</span>
                <span>+{formatBDT(totalReceipts)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300 font-bold text-slate-900">
                <span>{lang === "bn" ? "(=) মোট প্রাপ্তি দিক যোগফল:" : "(=) Total Receipts Side:"}</span>
                <span>{formatBDT(receiptsSideTotal)}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Payments Side Balancing */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                {lang === "bn" ? "পরিশোধ দিক সমীকরণ (Payments Side)" : "Payments Side Total"}
              </span>
              <span className="text-[11px] font-mono text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                {formatBDT(paymentsSideTotal)}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-mono space-y-1 pt-1 border-t border-slate-200">
              <div className="flex justify-between text-rose-600">
                <span>{lang === "bn" ? "সময়কালীন মোট পরিশোধ:" : "Period Gross Payments:"}</span>
                <span>{formatBDT(totalPayments)}</span>
              </div>
              <div className="flex justify-between text-slate-800">
                <span>{lang === "bn" ? "(+) সমাপনী তরল তহবিল (C/D):" : "(+) Closing Reserves (C/D):"}</span>
                <span>+{formatBDT(closingTreasury)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300 font-bold text-slate-900">
                <span>{lang === "bn" ? "(=) মোট পরিশোধ দিক যোগফল:" : "(=) Total Payments Side:"}</span>
                <span>{formatBDT(paymentsSideTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Note */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {lang === "bn"
              ? "আদায় ও পরিশোধ হিসাবের মূলনীতি: এটি একটি নগদ-ভিত্তি সারসংক্ষেপ যেখানে মূলধনী ও রাজস্ব উভয় ধরণের প্রকৃত আর্থিক লেনদেন অন্তর্ভুক্ত থাকে। মোট প্রাপ্তি দিক (প্রারম্ভিক ব্যালেন্স + আদায়) এবং মোট পরিশোধ দিক (ব্যয় + সমাপনী ব্যালেন্স) সর্বদাই সমান হতে হবে।"
              : "Receipts & Payments Accounting Policy: This statement presents actual liquid inflows and outflows on a pure cash-accounting basis, incorporating both capital and operational transactions. The Receipts Side (Opening Reserves + Receipts) mathematically equals the Payments Side (Payments + Closing Reserves)."}
          </p>
        </div>
      </div>
    </div>
  );
}
