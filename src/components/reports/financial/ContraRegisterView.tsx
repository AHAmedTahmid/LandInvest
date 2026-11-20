"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatBDT } from "@/lib/format";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  ContraRegisterData,
  ContraTransferItem,
  ContraTransferType,
} from "@/lib/reports/contra-register";
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Smartphone,
  Wallet,
  Printer,
  FileDown,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: ContraRegisterData;
  filters: {
    from?: string;
    to?: string;
    bankAccountId?: string;
  };
  canExport?: boolean;
}

export default function ContraRegisterView({
  def,
  data,
  filters,
  canExport = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [directionFilter, setDirectionFilter] = useState<string>("ALL");
  const [accountFilter, setAccountFilter] = useState<string>(
    filters.bankAccountId || "ALL"
  );

  const { transfers = [], pendingRequests = [], kpis, accounts = [] } = data;

  const currentPreset = searchParams.get("preset") || "this_month";

  const handlePresetChange = (preset: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("preset", preset);
    sp.delete("from");
    sp.delete("to");
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  const handleAccountChange = (accId: string) => {
    setAccountFilter(accId);
    const sp = new URLSearchParams(searchParams.toString());
    if (accId === "ALL") {
      sp.delete("bankAccountId");
    } else {
      sp.set("bankAccountId", accId);
    }
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  // Client-side filtering for fast interactive discovery
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      // Direction filter
      if (directionFilter === "CASH_TO_BANK") {
        if (t.transferType !== "CASH_TO_BANK" && t.transferType !== "CASH_TO_MFS") {
          return false;
        }
      } else if (directionFilter === "BANK_TO_CASH") {
        if (t.transferType !== "BANK_TO_CASH" && t.transferType !== "MFS_TO_CASH") {
          return false;
        }
      } else if (directionFilter === "INTER_ACCOUNT") {
        if (
          t.transferType === "CASH_TO_BANK" ||
          t.transferType === "CASH_TO_MFS" ||
          t.transferType === "BANK_TO_CASH" ||
          t.transferType === "MFS_TO_CASH"
        ) {
          return false;
        }
      }

      // Account filter (client-side backup)
      if (accountFilter !== "ALL") {
        const matchesFrom = t.from.id === accountFilter;
        const matchesTo = t.to.id === accountFilter;
        if (!matchesFrom && !matchesTo) return false;
      }

      // Text search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesVoucher = t.voucherNo.toLowerCase().includes(q);
        const matchesPurpose = t.purpose.toLowerCase().includes(q);
        const matchesFrom = t.from.label.toLowerCase().includes(q);
        const matchesTo = t.to.label.toLowerCase().includes(q);
        const matchesAmount = t.amount.toString().includes(q);
        if (
          !matchesVoucher &&
          !matchesPurpose &&
          !matchesFrom &&
          !matchesTo &&
          !matchesAmount
        ) {
          return false;
        }
      }

      return true;
    });
  }, [transfers, directionFilter, accountFilter, searchQuery]);

  const filteredTotal = useMemo(() => {
    return filteredTransfers.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransfers]);

  // Channel badge styling helper
  const renderChannelPill = (channel: ContraTransferItem["from"]) => {
    if (channel.type === "CASH") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              Cash in Hand
            </div>
            <div className="text-[10px] text-emerald-700 font-mono font-medium">
              Physical Vault
            </div>
          </div>
        </div>
      );
    }

    const isMfs = channel.type === "MFS";
    const isBkash = channel.bankName?.toLowerCase().includes("bkash");
    const isNagad = channel.bankName?.toLowerCase().includes("nagad");

    let badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
    let iconBg = "bg-blue-100 text-blue-800";
    let providerLabel = "Bank Account";

    if (isBkash) {
      badgeColor = "bg-pink-50 text-pink-700 border-pink-200";
      iconBg = "bg-pink-100 text-pink-700";
      providerLabel = "bKash MFS";
    } else if (isNagad) {
      badgeColor = "bg-orange-50 text-orange-700 border-orange-200";
      iconBg = "bg-orange-100 text-orange-700";
      providerLabel = "Nagad MFS";
    } else if (isMfs) {
      badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
      iconBg = "bg-purple-100 text-purple-700";
      providerLabel = "MFS Wallet";
    }

    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0 border border-slate-200/60`}
        >
          {isMfs ? (
            <Smartphone className="w-3.5 h-3.5" />
          ) : (
            <Building2 className="w-3.5 h-3.5" />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-900 truncate leading-tight">
            {channel.bankName || "Commercial Bank"}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[9px] font-semibold px-1 py-0.2 rounded border ${badgeColor}`}
            >
              {providerLabel}
            </span>
            {channel.accountNumber && (
              <span className="text-[10px] font-mono text-slate-500 truncate">
                {channel.accountNumber}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Transfer direction badge helper
  const renderDirectionBadge = (type: ContraTransferType) => {
    switch (type) {
      case "CASH_TO_BANK":
      case "CASH_TO_MFS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ArrowUpRight className="w-3 h-3" />
            Cash Deposit
          </span>
        );
      case "BANK_TO_CASH":
      case "MFS_TO_CASH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ArrowDownLeft className="w-3 h-3" />
            Float Withdrawal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <ArrowLeftRight className="w-3 h-3" />
            Inter-Account Move
          </span>
        );
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
            <span className="text-slate-400">Financial / Treasury</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              Contra / Fund Transfer Register
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shadow-2xs">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Contra / Fund Transfer Register</span>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium border border-slate-200">
                  Dual-Entry Neutral
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidated Bank, Cash & MFS Internal Liquidity Movements • Zero
                Net Impact Audit Trail
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
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
              Contra / Fund Transfer Register (কন্ট্রা ও তহবিল স্থানান্তর রেজিস্টার)
            </h2>
            <p className="text-xs text-slate-500">
              Internal Liquidity Movements across Cash Vaults, Banks & MFS Wallets
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
              Accounting Standard:{" "}
              <span className="font-semibold">Zero Net Impact (Dr ≡ Cr)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive 4-Metric KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {/* KPI 1: Total Transferred */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Transferred</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {formatBDT(kpis.totalTransferred)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="font-semibold text-teal-800">
              {kpis.transferCount}
            </span>
            <span>executed transfers in period</span>
          </div>
        </div>

        {/* KPI 2: Cash to Bank Deposits */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-blue-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Cash ➔ Bank Deposits</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-800 tracking-tight">
            {formatBDT(kpis.cashToBankAmount)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="font-semibold text-blue-700">
              {kpis.cashToBankCount}
            </span>
            <span>cash banked into corporate accounts</span>
          </div>
        </div>

        {/* KPI 3: Bank to Cash Withdrawals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-amber-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Bank ➔ Cash Float</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 tracking-tight">
            {formatBDT(kpis.bankToCashAmount)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="font-semibold text-amber-700">
              {kpis.bankToCashCount}
            </span>
            <span>cheque / ATM float withdrawals</span>
          </div>
        </div>

        {/* KPI 4: Inter-Bank & MFS Transfers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-purple-200 transition">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Inter-Bank & MFS</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-900 tracking-tight">
            {formatBDT(kpis.interAccountAmount)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="font-semibold text-purple-700">
              {kpis.interAccountCount}
            </span>
            <span>wallet & inter-account moves</span>
          </div>
        </div>
      </div>

      {/* Pending Transfer Requests Banner (if any) */}
      {kpis.pendingCount > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-2">
                <span>Pending Dual-Authorization Transfers</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200/70 text-amber-900">
                  {kpis.pendingCount} Pending
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                There are{" "}
                <span className="font-semibold font-mono">
                  {formatBDT(kpis.pendingAmount)}
                </span>{" "}
                in requested fund movements awaiting secondary approval before
                treasury ledger posting.
              </p>
            </div>
          </div>
          <Link
            href="/treasury/approvals"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition self-start sm:self-center shrink-0"
          >
            <span>Open Approvals Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

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
              { key: "today", label: "Today" },
              { key: "this_week", label: "This Week" },
              { key: "this_month", label: "This Month" },
              { key: "last_month", label: "Last Month" },
              { key: "this_quarter", label: "This Quarter" },
              { key: "this_fy", label: "This FY" },
              { key: "all_time", label: "All Time" },
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

        {/* Direction Tabs & Search Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Movement Type Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setDirectionFilter("ALL")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                directionFilter === "ALL"
                  ? "bg-teal-700 text-white shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
              }`}
            >
              All Movements ({transfers.length})
            </button>
            <button
              onClick={() => setDirectionFilter("CASH_TO_BANK")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                directionFilter === "CASH_TO_BANK"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "bg-blue-50/60 hover:bg-blue-100 text-blue-800 border border-blue-200/60"
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              Cash ➔ Bank ({kpis.cashToBankCount})
            </button>
            <button
              onClick={() => setDirectionFilter("BANK_TO_CASH")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                directionFilter === "BANK_TO_CASH"
                  ? "bg-amber-700 text-white shadow-2xs"
                  : "bg-amber-50/60 hover:bg-amber-100 text-amber-800 border border-amber-200/60"
              }`}
            >
              <ArrowDownLeft className="w-3 h-3" />
              Bank ➔ Cash ({kpis.bankToCashCount})
            </button>
            <button
              onClick={() => setDirectionFilter("INTER_ACCOUNT")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                directionFilter === "INTER_ACCOUNT"
                  ? "bg-purple-700 text-white shadow-2xs"
                  : "bg-purple-50/60 hover:bg-purple-100 text-purple-800 border border-purple-200/60"
              }`}
            >
              <Building2 className="w-3 h-3" />
              Inter-Account / MFS ({kpis.interAccountCount})
            </button>
          </div>

          {/* Account Selector & Live Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <select
              value={accountFilter}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="ALL">All Bank & MFS Accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.accountType === "MFS" ? "📱 " : "🏦 "}
                  {a.bankName} ({a.accountNumber})
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memo, voucher, bank..."
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 w-full sm:w-56 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Contra Transfers Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Executed Contra Transfer Transactions</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200">
                {filteredTransfers.length} records
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simultaneous matching debit & credit entries posted across physical vault and corporate bank accounts
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 mr-2">Total in View:</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {formatBDT(filteredTotal)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 text-slate-700 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="py-3 px-4 w-32">Date & Voucher</th>
                <th className="py-3 px-4 w-56">Source Account (From)</th>
                <th className="py-3 px-3 text-center w-36">Movement Route</th>
                <th className="py-3 px-4 w-56">Destination Account (To)</th>
                <th className="py-3 px-4">Narration / Transfer Purpose</th>
                <th className="py-3 px-3 text-center w-28">Audit Verification</th>
                <th className="py-3 px-4 text-right w-36">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <ArrowLeftRight className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-slate-600">
                        No contra transfers found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your period presets, direction tabs, or search terms.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((t, idx) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Date & Voucher */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-mono text-xs font-semibold text-slate-900">
                        {t.date}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 mt-0.5 tracking-tight">
                        {t.voucherNo}
                      </div>
                    </td>

                    {/* Source Channel (From) */}
                    <td className="py-3 px-4 align-top">
                      {renderChannelPill(t.from)}
                    </td>

                    {/* Movement Route Badge */}
                    <td className="py-3 px-3 align-top text-center">
                      <div className="inline-flex flex-col items-center">
                        {renderDirectionBadge(t.transferType)}
                        <span className="text-[10px] text-slate-400 font-mono mt-1">
                          Dr ➔ Cr
                        </span>
                      </div>
                    </td>

                    {/* Destination Channel (To) */}
                    <td className="py-3 px-4 align-top">
                      {renderChannelPill(t.to)}
                    </td>

                    {/* Narration & Memo */}
                    <td className="py-3 px-4 align-top">
                      <p className="text-slate-800 text-xs leading-relaxed font-normal">
                        {t.purpose}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <span>Ledger ID:</span>
                        <span className="font-mono text-slate-500">
                          {t.id.slice(0, 8)}...{t.id.slice(-4)}
                        </span>
                      </div>
                    </td>

                    {/* Status & Verification */}
                    <td className="py-3 px-3 align-top text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Posted</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1">
                        Dual Balanced
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 align-top text-right">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {formatBDT(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Grand Totals Footer */}
            <tfoot>
              <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300 text-xs">
                <td colSpan={2} className="py-3.5 px-4">
                  <span className="uppercase tracking-wider text-[11px] text-slate-600">
                    Register Total:
                  </span>{" "}
                  <span>{filteredTransfers.length} Transfers</span>
                </td>
                <td colSpan={4} className="py-3.5 px-4 text-center text-slate-600 text-[11px]">
                  Net Liquid Treasury Impact:{" "}
                  <span className="font-mono font-bold text-emerald-700">
                    ৳ 0.00 (Zero Leakage Parity)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-base text-slate-900">
                  {formatBDT(filteredTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Statutory & Internal Audit Reconciliation Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Accounting Basis & Internal Treasury Audit Notes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              1. Zero Net Leakage Principle
            </span>
            <p className="leading-relaxed text-slate-600">
              Contra transfers strictly alter the holding location of liquid funds (Vault ↔ Bank ↔ MFS). Every Outflow (Credit) is matched with an identical Inflow (Debit), yielding exactly zero net effect on aggregate corporate liquidity.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              2. Physical & Banking Verification
            </span>
            <p className="leading-relaxed text-slate-600">
              Cash deposits to bank accounts must match authenticated bank deposit slips. Cash float withdrawals must be verified against endorsed cheque leaves and physical vault replenishment logs.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block">
              3. Dual-Control Authorization
            </span>
            <p className="leading-relaxed text-slate-600">
              In compliance with financial governance controls, transfers above policy thresholds mandate dual-authorization in the Treasury Approvals Hub before ledger posting.
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
            <p className="text-[10px] text-slate-500">Treasury & Accounts Officer</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Verified By</p>
            <p className="text-[10px] text-slate-500">Head of Internal Audit</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-300 pt-2 w-48 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Approved By</p>
            <p className="text-[10px] text-slate-500">Managing Director / Partner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
