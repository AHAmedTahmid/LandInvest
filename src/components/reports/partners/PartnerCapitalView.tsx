"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatBDT } from "@/lib/format";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  PartnerCapitalData,
  PartnerTransactionItem,
} from "@/lib/reports/partner-capital";
import {
  User,
  Building2,
  Wallet,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  ShieldCheck,
  Printer,
  FileDown,
  ArrowLeft,
  Search,
  CheckCircle2,
  Phone,
  CreditCard,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: PartnerCapitalData;
  filters: {
    from?: string;
    to?: string;
    partnerId?: string;
  };
  canExport?: boolean;
}

export default function PartnerCapitalView({
  def,
  data,
  filters,
  canExport = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const { partner, allPartners = [], transactions = [], kpis } = data;

  const currentPreset = searchParams.get("preset") || "all_time";

  const handlePresetChange = (preset: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("preset", preset);
    sp.delete("from");
    sp.delete("to");
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  const handlePartnerChange = (partnerId: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("partnerId", partnerId);
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  // Filtered transactions for quick interactive discovery
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Type filter
      if (typeFilter !== "ALL" && t.txnType !== typeFilter) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesType = t.typeLabelEn.toLowerCase().includes(q);
        const matchesProject = (t.projectName || "").toLowerCase().includes(q);
        const matchesAmt =
          (t.deposit?.toString() || "").includes(q) ||
          (t.withdrawal?.toString() || "").includes(q) ||
          t.balance.toString().includes(q);

        if (!matchesDesc && !matchesType && !matchesProject && !matchesAmt) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, typeFilter, searchQuery]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      deposits: transactions.filter((t) => t.txnType === "DEPOSIT").length,
      directExpenses: transactions.filter((t) => t.txnType === "DIRECT_EXPENSE").length,
      profitCredits: transactions.filter((t) => t.txnType === "PROFIT_CREDIT").length,
      withdrawals: transactions.filter((t) => t.txnType === "WITHDRAWAL").length,
    };
  }, [transactions]);

  // Badge renderer
  const renderTxnBadge = (type: PartnerTransactionItem["txnType"]) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Wallet className="w-3 h-3 text-emerald-600" />
            Capital Deposit
          </span>
        );
      case "DIRECT_EXPENSE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Receipt className="w-3 h-3 text-indigo-600" />
            Direct Expense
          </span>
        );
      case "PROFIT_CREDIT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <TrendingUp className="w-3 h-3 text-purple-600" />
            Profit Distribution
          </span>
        );
      case "WITHDRAWAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ArrowUpRight className="w-3 h-3 text-amber-600" />
            Drawings
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto print:p-0 print:space-y-4 print:max-w-none">
      {/* Top Breadcrumb & Document Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link
              href="/reports"
              className="hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Reports Catalog
            </Link>
            <span>/</span>
            <span className="text-slate-400">Partners & Capital</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              Partner Capital Statement
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Partner Capital Statement</span>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium border border-slate-200">
                  Equity Ledger
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive Capital Account Ledger, Project Contributions & Profit Distributions
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print
          </button>
          {canExport && (
            <>
              <a
                href={`/api/reports/${def.key}?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  format: "pdf",
                })}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition"
              >
                <FileDown className="w-3.5 h-3.5" />
                Official PDF
              </a>
              <a
                href={`/api/reports/${def.key}?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  format: "excel",
                })}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition"
              >
                Excel
              </a>
            </>
          )}
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              LandInvest Syndicate Group
            </h1>
            <h2 className="text-base font-semibold text-slate-800 mt-0.5">
              Partner Capital Statement (অংশীদার মূলধন বিবরণী)
            </h2>
            <p className="text-xs text-slate-500">
              Partner: <strong className="text-slate-900">{partner.name}</strong> • Phone: {partner.phone}
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>
              Period:{" "}
              <span className="font-mono font-semibold text-slate-900">
                {filters.from || "Genesis"} to {filters.to || "Present"}
              </span>
            </div>
            <div>
              Currency: <span className="font-semibold">BDT (৳)</span>
            </div>
            <div>
              Accounting Basis:{" "}
              <span className="font-semibold">Cumulative Partner Equity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Selector Ribbon */}
      <div className="space-y-2 print:hidden">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Select Syndicate Partner:</span>
          <span className="text-[11px] text-slate-400">
            {allPartners.length} Active Partners
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {allPartners.map((p) => {
            const isSelected = p.id === partner.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePartnerChange(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-white border-purple-600 shadow-sm ring-2 ring-purple-600/20"
                    : "bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                    }`}
                  >
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{p.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Equity:</span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    {formatBDT(p.currentBalance)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Partner Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {partner.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {partner.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Syndicate Partner
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {partner.phone}
                </span>
                {partner.nidNumber && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="text-slate-400 font-sans">NID:</span>
                    {partner.nidNumber}
                  </span>
                )}
                {partner.bankName && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{partner.bankName}</span>
                    {partner.bankAccountNumber && (
                      <span className="font-mono text-slate-600">
                        ({partner.bankAccountNumber})
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-xs text-slate-400">Total Net Equity Standing:</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {formatBDT(kpis.closingBalance)}
            </div>
          </div>
        </div>

        {/* Invested Projects Pills */}
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>Participating Land Projects & Agreed Equity Share Percentages:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {partner.projects && partner.projects.length > 0 ? (
              partner.projects.map((pr) => (
                <div
                  key={pr.projectId}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800"
                >
                  <span className="font-semibold">{pr.projectName}</span>
                  <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[11px] bg-purple-100 text-purple-800">
                    {pr.sharePercentage}% Share
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                No active project allocations recorded.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {/* KPI 1: Opening Capital B/F */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Opening Capital (B/F)</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <History className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {formatBDT(kpis.openingBalance)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Brought forward balance prior to period
          </div>
        </div>

        {/* KPI 2: Fresh Capital & Direct Expenses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-blue-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Capital Injected & Paid</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tracking-tight">
            {formatBDT(kpis.totalDeposits + kpis.totalDirectExpenses)}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
            <span>Bank: {formatBDT(kpis.totalDeposits)}</span>
            <span>Direct: {formatBDT(kpis.totalDirectExpenses)}</span>
          </div>
        </div>

        {/* KPI 3: Realized Profits Credited */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-purple-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Profit Share Credited</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-800 tracking-tight">
            {formatBDT(kpis.totalProfitCredits)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Allocated from completed land sales
          </div>
        </div>

        {/* KPI 4: Closing Partner Equity */}
        <div className="bg-white p-4 rounded-xl border border-purple-200/80 shadow-2xs relative overflow-hidden bg-gradient-to-br from-white to-purple-50/20">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-1">
            <span>Net Closing Equity (C/D)</span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-950 tracking-tight">
            {formatBDT(kpis.closingBalance)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-700 font-medium">
            <span>Drawings debited:</span>
            <span className="font-mono font-bold text-amber-800">
              {formatBDT(kpis.totalWithdrawals)}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 space-y-4 print:hidden">
        {/* Preset Period Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Period:
            </span>
            {[
              { key: "all_time", label: "All Time (Complete Ledger)" },
              { key: "this_fy", label: "This FY" },
              { key: "this_year", label: "This Year" },
              { key: "this_quarter", label: "This Quarter" },
              { key: "this_month", label: "This Month" },
              { key: "last_month", label: "Last Month" },
            ].map((p) => {
              const active = currentPreset === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => handlePresetChange(p.key)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    active
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {filters.from && filters.to ? (
              <span>
                {filters.from} <span className="text-slate-400">➔</span> {filters.to}
              </span>
            ) : (
              <span>All Historical Records</span>
            )}
          </div>
        </div>

        {/* Transaction Type Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Movement Type Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                typeFilter === "ALL"
                  ? "bg-purple-700 text-white shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
              }`}
            >
              All Transactions ({counts.all})
            </button>
            <button
              onClick={() => setTypeFilter("DEPOSIT")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                typeFilter === "DEPOSIT"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60"
              }`}
            >
              <Wallet className="w-3 h-3" />
              Capital Deposits ({counts.deposits})
            </button>
            <button
              onClick={() => setTypeFilter("DIRECT_EXPENSE")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                typeFilter === "DIRECT_EXPENSE"
                  ? "bg-indigo-700 text-white shadow-2xs"
                  : "bg-indigo-50/60 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60"
              }`}
            >
              <Receipt className="w-3 h-3" />
              Direct Expenses ({counts.directExpenses})
            </button>
            <button
              onClick={() => setTypeFilter("PROFIT_CREDIT")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                typeFilter === "PROFIT_CREDIT"
                  ? "bg-purple-700 text-white shadow-2xs"
                  : "bg-purple-50/60 hover:bg-purple-100 text-purple-800 border border-purple-200/60"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              Profit Credits ({counts.profitCredits})
            </button>
            <button
              onClick={() => setTypeFilter("WITHDRAWAL")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                typeFilter === "WITHDRAWAL"
                  ? "bg-amber-700 text-white shadow-2xs"
                  : "bg-amber-50/60 hover:bg-amber-100 text-amber-800 border border-amber-200/60"
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              Drawings ({counts.withdrawals})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description, project, amount..."
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Main Partner Capital Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Capital Ledger Transactions</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-purple-50 text-purple-800 border border-purple-200">
                {filteredTransactions.length} items
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Chronological equity additions, out-of-pocket project payments, profit credits, and withdrawals
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 mr-2">Closing Equity (C/D):</span>
            <span className="text-sm font-bold font-mono text-purple-950">
              {formatBDT(kpis.closingBalance)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 text-slate-700 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="py-3 px-4 w-28">Date</th>
                <th className="py-3 px-3 w-44">Transaction Type</th>
                <th className="py-3 px-4">Particulars / Project Reference</th>
                <th className="py-3 px-4 text-right w-40 text-emerald-800">
                  Credit / Additions (BDT)
                </th>
                <th className="py-3 px-4 text-right w-40 text-amber-800">
                  Debit / Drawings (BDT)
                </th>
                <th className="py-3 px-4 text-right w-44 text-slate-900">
                  Running Equity (BDT)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Opening Balance Row */}
              <tr className="bg-slate-50/80 font-semibold text-slate-700">
                <td className="py-3 px-4 font-mono text-xs">
                  {filters.from || "Genesis"}
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                    <History className="w-3 h-3" />
                    B/F Reserve
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-900">
                    Opening Capital Balance Brought Forward
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Accumulated partner equity balance at period start
                  </p>
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-400">-</td>
                <td className="py-3 px-4 text-right font-mono text-slate-400">-</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                  {formatBDT(kpis.openingBalance)}
                </td>
              </tr>

              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <User className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-slate-600">
                        No transactions found for this period
                      </p>
                      <p className="text-xs text-slate-400">
                        Try selecting &ldquo;All Time&rdquo; or clearing search filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-900">
                      {t.date}
                    </td>

                    {/* Transaction Type Badge */}
                    <td className="py-3 px-3">
                      {renderTxnBadge(t.txnType)}
                    </td>

                    {/* Particulars & Project Tag */}
                    <td className="py-3 px-4">
                      <p className="text-slate-800 text-xs font-medium leading-relaxed">
                        {t.description}
                      </p>
                      {t.projectName && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                            Project: {t.projectName}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Credit (Additions) */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {t.deposit ? `+${formatBDT(t.deposit)}` : "-"}
                    </td>

                    {/* Debit (Drawings) */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                      {t.withdrawal ? `-${formatBDT(t.withdrawal)}` : "-"}
                    </td>

                    {/* Cumulative Running Equity */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatBDT(t.balance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer */}
            <tfoot>
              <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300 text-xs">
                <td colSpan={3} className="py-3.5 px-4">
                  <span className="uppercase tracking-wider text-[11px] text-slate-600">
                    Period Totals & Net Movement:
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-800 text-sm">
                  +{formatBDT(kpis.totalCapitalAdditions)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-amber-800 text-sm">
                  -{formatBDT(kpis.totalWithdrawals)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-purple-950 text-base">
                  {formatBDT(kpis.closingBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Statutory Partnership Equity Reconciliation Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>Statutory Partner Equity Basis & Governance Notes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              1. Equity Capital Equation
            </span>
            <p className="leading-relaxed text-slate-600">
              Partner capital stands at:
              <br />
              <code className="text-[11px] text-purple-900 font-semibold font-mono block mt-1">
                Closing = Opening + Deposits + Expenses + Profits - Drawings
              </code>
              Reconciles with the Balance Sheet partner equity accounts.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              2. Direct Out-of-Pocket Expenses
            </span>
            <p className="leading-relaxed text-slate-600">
              When a partner directly finances land registry drafting, boundary walls, earth filling, or cadastral surveys, the audited amount is credited to their capital account upon voucher approval.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              3. Profit Distributions Basis
            </span>
            <p className="leading-relaxed text-slate-600">
              Profit distributions are credited strictly in accordance with registered partnership deed share percentages, derived either from Cash-Basis collections or Completion-Basis audited accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Official Signatures Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 print:border-none print:shadow-none print:p-0 print:pt-6">
        <div className="grid grid-cols-3 gap-8 text-center pt-8">
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Prepared By</p>
            <p className="text-[10px] text-slate-500">Accounts & Treasury Officer</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">
              Partner Acknowledgment
            </p>
            <p className="text-[10px] text-slate-600 font-semibold">{partner.name}</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Approved By</p>
            <p className="text-[10px] text-slate-500">Managing Partner / Board</p>
          </div>
        </div>
      </div>
    </div>
  );
}
