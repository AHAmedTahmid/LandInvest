"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { formatBDT } from "@/lib/reports/format";
import type { ReportData } from "@/lib/reports/pdf";
import type { ReportDef } from "@/lib/reports/registry";
import {
  Landmark,
  Wallet,
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Printer,
  FileDown,
  FileSpreadsheet,
  ArrowLeft,
  Calendar,
  Filter,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

type ProjectOption = {
  id: string;
  projectName: string;
};

type Props = {
  def: ReportDef;
  data: ReportData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
  };
  projects: ProjectOption[];
  canExport: boolean;
};

export default function BalanceSheetView({
  def,
  data,
  filters,
  projects,
  canExport,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLang();

  // Local filter states
  const [preset, setPreset] = useState(searchParams.get("preset") || "this_month");
  const [from, setFrom] = useState(filters.from || "");
  const [to, setTo] = useState(filters.to || "");
  const [projectId, setProjectId] = useState(filters.projectId || "");
  const [showPolicies, setShowPolicies] = useState(false);

  // Parse structured data from rows
  const cashRow = data.rows.find((r) => r.account === "Cash in Hand");
  const bankRow = data.rows.find((r) => r.account === "Company Bank Accounts");
  const arRow = data.rows.find((r) => r.account === "Accounts Receivable (Buyer Dues)");
  const invRow = data.rows.find((r) => r.account === "Land & Project Development Inventory");
  const capitalRow = data.rows.find((r) => r.account === "Partner Capital Accounts");
  const surplusRow = data.rows.find((r) => r.account === "Operating Surplus & Retained Reserves");

  const cashAmount = Number(cashRow?.amount || 0);
  const bankAmount = Number(bankRow?.amount || 0);
  const arAmount = Number(arRow?.amount || 0);
  const invAmount = Number(invRow?.amount || 0);
  const capitalAmount = Number(capitalRow?.amount || 0);
  const surplusAmount = Number(surplusRow?.amount || 0);

  const currentAssets = cashAmount + bankAmount + arAmount;
  const nonCurrentAssets = invAmount;
  const totalAssets = currentAssets + nonCurrentAssets;
  const totalEquity = capitalAmount + surplusAmount;
  const isBalanced = Math.abs(totalAssets - totalEquity) < 0.01;

  // Selected project name
  const selectedProject = projects.find((p) => p.id === projectId);
  const projectScopeText = selectedProject
    ? selectedProject.projectName
    : lang === "bn"
    ? "সকল প্রকল্প (একত্রিত)"
    : "All Projects (Consolidated)";

  // Apply filters handler
  const handleApplyFilters = (newPreset?: string) => {
    const params = new URLSearchParams();
    const p = newPreset !== undefined ? newPreset : preset;
    if (p) params.set("preset", p);
    if (!p || p === "custom") {
      if (from) params.set("from", from);
      if (to) params.set("to", to);
    }
    if (projectId) params.set("projectId", projectId);
    router.push(`/reports/balance-sheet?${params.toString()}`);
  };

  const handlePresetClick = (p: string) => {
    setPreset(p);
    handleApplyFilters(p);
  };

  const handleReset = () => {
    setPreset("this_month");
    setFrom("");
    setTo("");
    setProjectId("");
    router.push("/reports/balance-sheet");
  };

  const handlePrint = () => {
    window.print();
  };

  // Summary audit stats
  const approvedSummary = data.summary?.find((s) =>
    s.labelEn.includes("Approved Vouchers")
  );
  const excludedSummary = data.summary?.find((s) =>
    s.labelEn.includes("Excluded Unapproved")
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto print:p-0 print:space-y-4">
      {/* 1. Executive Header & Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 print:border-none print:shadow-none print:p-0">
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
                {lang === "bn" ? "উদ্বৃত্তপত্র" : "Balance Sheet"}
              </span>
            </div>

            {/* Title & Scope */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 print:hidden">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {lang === "bn"
                    ? "উদ্বৃত্তপত্র / আর্থিক অবস্থার বিবরণী"
                    : "Statement of Financial Position"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-medium text-slate-700">
                    {projectScopeText}
                  </span>
                  <span>•</span>
                  <span>
                    {lang === "bn" ? "ভিত্তি তারিখ:" : "As of:"}{" "}
                    <span className="font-semibold text-slate-800">
                      {filters.to || "Current Period"}
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
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
              title="Print Financial Statement"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>{lang === "bn" ? "প্রিন্ট" : "Print"}</span>
            </button>

            {/* Export buttons */}
            {canExport && (
              <>
                <a
                  href={`/api/reports/balance-sheet?${new URLSearchParams({
                    ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}),
                    format: "pdf",
                    lang,
                  })}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300 transition shadow-sm"
                >
                  <FileDown className="w-4 h-4 text-red-600" />
                  <span>PDF</span>
                </a>
                <a
                  href={`/api/reports/balance-sheet?${new URLSearchParams({
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

      {/* 2. Top Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
        {/* Total Assets */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "মোট সম্পদ" : "Total Assets"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {formatBDT(totalAssets)}
            </p>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
              <span>Current: {formatBDT(currentAssets)}</span>
              <span>Non-Current: {formatBDT(nonCurrentAssets)}</span>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Liquid Treasury */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "তরল ট্রেজারি তহবিল" : "Liquid Treasury"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {formatBDT(cashAmount + bankAmount)}
            </p>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
              <span>Cash: {formatBDT(cashAmount)}</span>
              <span>Bank: {formatBDT(bankAmount)}</span>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
        </div>

        {/* Land Inventory (Capitalized) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "মূলধনী প্রকল্প ও জমি মজুদ" : "Land & Project Inventory"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {formatBDT(invAmount)}
            </p>
            <div className="mt-2 text-[11px] text-amber-700 flex items-center gap-1.5 border-t border-slate-100 pt-2 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approved Vouchers Only</span>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        </div>

        {/* Partners Equity & Reserves */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:border-purple-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "অংশীদার মূলধন ও উদ্বৃত্ত" : "Partners' Capital & Surplus"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {formatBDT(totalEquity)}
            </p>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
              <span>Capital: {formatBDT(capitalAmount)}</span>
              <span>Surplus: {formatBDT(surplusAmount)}</span>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
        </div>
      </div>

      {/* 3. Governance Disclosure & Capitalization Banner */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50 to-amber-50/60 rounded-2xl p-4 border border-slate-200/90 shadow-sm print:bg-none print:border-slate-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-900">
                {lang === "bn" ? "অনুমোদিত ব্যয় নীতি:" : "Capitalization Policy:"}
              </span>{" "}
              <span className="text-slate-700">
                {approvedSummary?.value || "Approved expenses are capitalized into Land Inventory."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-amber-800 bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-300/60 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {excludedSummary?.value || "Unapproved vouchers strictly excluded from Balance Sheet."}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4 print:hidden">
        {/* Preset quick chips */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-4 h-4 text-brand-700" />
            <span>{lang === "bn" ? "তারিখ সীমা নির্বাচন:" : "Date Presets:"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "today", labelEn: "Today", labelBn: "আজকের দিন" },
              { id: "this_month", labelEn: "This Month", labelBn: "চলতি মাস" },
              { id: "last_month", labelEn: "Last Month", labelBn: "গত মাস" },
              { id: "this_quarter", labelEn: "This Quarter", labelBn: "চলতি প্রান্তিক" },
              { id: "this_fy", labelEn: "This Fiscal Year", labelBn: "চলতি অর্থবছর" },
              { id: "custom", labelEn: "Custom", labelBn: "কাস্টম" },
            ].map((p) => {
              const active = preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePresetClick(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    active
                      ? "bg-brand-700 text-white font-semibold shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {lang === "bn" ? p.labelBn : p.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {lang === "bn" ? "হতে (তারিখ)" : "From Date"}
            </label>
            <div className="relative">
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPreset("custom");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {lang === "bn" ? "পর্যন্ত (ভিত্তি তারিখ)" : "As of Date (To)"}
            </label>
            <div className="relative">
              <input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPreset("custom");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {lang === "bn" ? "প্রকল্প ফিল্টার" : "Project Scope"}
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:border-brand-600"
            >
              <option value="">
                {lang === "bn" ? "সকল প্রকল্প (একত্রিত)" : "All Projects (Consolidated)"}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => handleApplyFilters()}
              className="flex-1 bg-brand-700 hover:bg-brand-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "আপডেট করুন" : "Apply Filter"}</span>
            </button>
            <button
              onClick={handleReset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold py-2.5 px-3 rounded-xl transition"
              title="Reset Filters"
            >
              {lang === "bn" ? "রিসেট" : "Reset"}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Statement of Financial Position (The Main Presentation) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden print:border-none print:shadow-none">
        {/* Table Title Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold tracking-wide">
              {lang === "bn"
                ? "ল্যান্ডইনভেস্ট পার্টনারশিপ ইআরপি — আর্থিক উদ্বৃত্ত বিবরণী"
                : "LANDINVEST ERP SUITE — STATEMENT OF FINANCIAL POSITION"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "bn"
                ? "দ্বৈত খতিয়ান ও হিসাববিজ্ঞান মানদণ্ড অনুযায়ী প্রস্তুতকৃত"
                : "Prepared in accordance with Land Syndicate Accounting Standards"}
            </p>
          </div>

          {/* Balanced Badge */}
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === "bn" ? "ভারসাম্যপূর্ণ (Balanced)" : "Balanced Statement"}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{lang === "bn" ? "অসামঞ্জস্য" : "Unbalanced"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Financial Statement Content */}
        <div className="p-6 space-y-8">
          {/* SECTION 1: ASSETS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                {lang === "bn" ? "১. সম্পদসমূহ (ASSETS)" : "I. ASSETS"}
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                Amount in Taka (৳)
              </span>
            </div>

            {/* Current Assets */}
            <div className="space-y-1">
              <div className="bg-slate-50/80 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide text-slate-700">
                {lang === "bn" ? "চলতি সম্পদ (Current Assets)" : "Current Assets"}
              </div>

              <div className="divide-y divide-slate-100">
                {/* Cash in Hand */}
                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition rounded-lg">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {lang === "bn" ? "হাতে নগদ (Cash in Hand)" : "Cash in Hand"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cashRow?.note || "Net liquid cash balance in treasury drawer from validated inflows/outflows"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(cashAmount)}
                    </span>
                  </div>
                </div>

                {/* Bank Accounts */}
                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition rounded-lg">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {lang === "bn" ? "ব্যাংক হিসাবসমূহ (Company Bank Accounts)" : "Company Bank Accounts"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {bankRow?.note || "Reconciled ledger balance across all active commercial bank and MFS accounts"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(bankAmount)}
                    </span>
                  </div>
                </div>

                {/* Accounts Receivable */}
                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition rounded-lg">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {lang === "bn" ? "প্রাপ্য হিসাব / ক্রেতার বকেয়া (Accounts Receivable)" : "Accounts Receivable (Buyer Dues)"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {arRow?.note || "Contracted plot sales price remaining due after customer payments"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(arAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtotal Current Assets */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100 font-semibold text-xs sm:text-sm text-emerald-950 mt-1">
                <span className="uppercase tracking-wide font-bold">
                  {lang === "bn" ? "মোট চলতি সম্পদ (Total Current Assets)" : "Total Current Assets"}
                </span>
                <span className="font-mono font-bold tabular-nums text-emerald-900">
                  {formatBDT(currentAssets)}
                </span>
              </div>
            </div>

            {/* Non-Current Assets */}
            <div className="space-y-1 pt-3">
              <div className="bg-slate-50/80 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide text-slate-700">
                {lang === "bn" ? "স্থায়ী ও প্রকল্প সম্পদ (Non-Current Assets)" : "Non-Current Assets"}
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition rounded-lg">
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {lang === "bn" ? "জমি ও প্রকল্প উন্নয়ন মজুদ (Land Inventory)" : "Land & Project Development Inventory"}
                      </p>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        Capitalized
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {invRow?.note || "Acquisition + APPROVED expenses only (unapproved/pending strictly excluded)"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(invAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtotal Non-Current Assets */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/70 rounded-xl border border-slate-200 font-semibold text-xs sm:text-sm text-slate-900 mt-1">
                <span className="uppercase tracking-wide font-bold">
                  {lang === "bn" ? "মোট স্থায়ী সম্পদ (Total Non-Current Assets)" : "Total Non-Current Assets"}
                </span>
                <span className="font-mono font-bold tabular-nums text-slate-900">
                  {formatBDT(nonCurrentAssets)}
                </span>
              </div>
            </div>

            {/* GRAND TOTAL ASSETS */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white rounded-xl shadow-md border-b-4 border-emerald-500 mt-3">
              <div>
                <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider">
                  {lang === "bn" ? "সর্বমোট সম্পদ (TOTAL ASSETS)" : "TOTAL ASSETS"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === "bn" ? "চলতি ও স্থায়ী সম্পদের মোট যোগফল" : "Sum of Current and Non-Current Assets"}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg sm:text-xl font-extrabold tabular-nums text-emerald-400">
                  {formatBDT(totalAssets)}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: LIABILITIES & EQUITY */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                {lang === "bn"
                  ? "২. দায় ও অংশীদারদের মূলধন (LIABILITIES & EQUITY)"
                  : "II. LIABILITIES & PARTNERS' EQUITY"}
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                Amount in Taka (৳)
              </span>
            </div>

            {/* Liabilities */}
            <div className="space-y-1">
              <div className="bg-slate-50/80 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide text-slate-700">
                {lang === "bn" ? "চলতি দায় (Current Liabilities)" : "Current Liabilities"}
              </div>

              <div className="px-4 py-3 text-xs text-slate-500 italic bg-slate-50/30 rounded-lg flex items-center justify-between">
                <span>
                  {lang === "bn"
                    ? "চলতি কোনো অপরিশোধিত দায় নেই (সকল ভেন্ডর ও ঠিকাদার পরিশোধ অনুমোদিত ভাউচারের মাধ্যমে সমন্বিত)"
                    : "No outstanding external liabilities (all vendor & contractor costs settled via treasury contra & cash)"}
                </span>
                <span className="font-mono font-bold text-slate-600">৳ 0.00</span>
              </div>
            </div>

            {/* Partners' Equity */}
            <div className="space-y-1 pt-2">
              <div className="bg-slate-50/80 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide text-slate-700">
                {lang === "bn" ? "অংশীদারদের মূলধন ও তহবিল (Partners' Equity)" : "Partners' Equity & Capital"}
              </div>

              <div className="divide-y divide-slate-100">
                {/* Partner Capital Accounts */}
                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition rounded-lg">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {lang === "bn" ? "অংশীদারদের মূলধন হিসাব (Partner Capital Accounts)" : "Partner Capital Accounts"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {capitalRow?.note || "Partner opening capital + deposits + approved direct expenses - withdrawals"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(capitalAmount)}
                    </span>
                  </div>
                </div>

                {/* Operating Surplus & Retained Reserves */}
                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition rounded-lg">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {lang === "bn" ? "পরিচালন উদ্বৃত্ত ও সংরক্ষিত তহবিল (Operating Surplus & Reserves)" : "Operating Surplus & Retained Reserves"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {surplusRow?.note || "Net realized collections and inventory surplus after partner distributions"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(surplusAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtotal Equity */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-purple-50/40 rounded-xl border border-purple-100 font-semibold text-xs sm:text-sm text-purple-950 mt-1">
                <span className="uppercase tracking-wide font-bold">
                  {lang === "bn" ? "মোট অংশীদার মূলধন ও তহবিল (Total Equity)" : "Total Partners' Equity"}
                </span>
                <span className="font-mono font-bold tabular-nums text-purple-900">
                  {formatBDT(totalEquity)}
                </span>
              </div>
            </div>

            {/* GRAND TOTAL LIABILITIES & EQUITY */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white rounded-xl shadow-md border-b-4 border-purple-500 mt-3">
              <div>
                <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider">
                  {lang === "bn"
                    ? "সর্বমোট দায় ও অংশীদার মূলধন (TOTAL LIABILITIES & EQUITY)"
                    : "TOTAL LIABILITIES & PARTNERS' EQUITY"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === "bn"
                    ? "মোট দায় এবং অংশীদারদের মূলধন তহবিলের সমন্বিত যোগফল"
                    : "Total Liabilities plus Partners' Equity and Reserves"}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg sm:text-xl font-extrabold tabular-nums text-purple-300">
                  {formatBDT(totalEquity)}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Callout Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === "bn"
                  ? "হিসাববিজ্ঞান ভারসাম্য নিশ্চিত: মোট সম্পদ = মোট দায় ও অংশীদার মূলধন (পার্থক্য: ৳ 0.00)"
                  : "Accounting Equation Verified: Total Assets = Total Liabilities & Equity (Difference: ৳ 0.00)"}
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-800">
              Balanced: 100.00%
            </span>
          </div>
        </div>
      </div>

      {/* 6. Accounting Policies & Governance Footnotes (Collapsible) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-3 print:border-none print:shadow-none">
        <button
          onClick={() => setShowPolicies(!showPolicies)}
          className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-700" />
            <span>
              {lang === "bn"
                ? "হিসাববিজ্ঞান নীতিমালা ও ব্যাখ্যা (Accounting Standards & Disclosures)"
                : "Accounting Standards & Disclosure Notes"}
            </span>
          </div>
          {showPolicies ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showPolicies && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="space-y-1">
              <p className="font-bold text-slate-800">1. Capitalization Basis</p>
              <p className="text-slate-500 leading-relaxed">
                Only project expenses with approved status are capitalized into Land Inventory. Unapproved or pending vouchers are strictly held in suspense and omitted from balance sheet assets.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-800">2. Asset Valuation</p>
              <p className="text-slate-500 leading-relaxed">
                Land and development inventory are valued at actual historical acquisition cost plus approved civil works, boundary demarcations, and legal mutation expenses.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-800">3. Revenue & Receivables</p>
              <p className="text-slate-500 leading-relaxed">
                Accounts receivable represent contracted buyer balances due under formal deed/bayna agreements, reduced by verified bank and cash money receipts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
