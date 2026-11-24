"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatBDT, formatDate } from "@/lib/reports/format";
import type { BuyerStatementResult } from "@/lib/reports/buyer-statement";
import {
  User,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileDown,
  Printer,
  Search,
  ChevronDown,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  Receipt,
  X,
} from "lucide-react";

interface BuyerStatementViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: BuyerStatementResult;
  filters: {
    saleId?: string;
    from?: string;
    to?: string;
  };
  canExport?: boolean;
}

export default function BuyerStatementView({
  def,
  data,
  filters,
  canExport = true,
}: BuyerStatementViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ledger" | "installments" | "receipts">("ledger");
  const [searchSaleTerm, setSearchSaleTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const sale = data.sale;
  const kpis = data.kpis;
  const ledgerEntries = data.ledgerEntries || [];
  const schedules = data.schedules || [];
  const payments = data.payments || [];
  const allSales = data.allSales || [];

  // Filter sales for selector dropdown
  const filteredSalesList = useMemo(() => {
    if (!searchSaleTerm.trim()) return allSales;
    const q = searchSaleTerm.toLowerCase();
    return allSales.filter(
      (s) =>
        s.buyerName.toLowerCase().includes(q) ||
        s.buyerPhone.toLowerCase().includes(q) ||
        s.plotNumber.toLowerCase().includes(q) ||
        s.projectName.toLowerCase().includes(q) ||
        s.contractNo.toLowerCase().includes(q)
    );
  }, [allSales, searchSaleTerm]);

  const handleSelectSale = (saleId: string) => {
    setIsDropdownOpen(false);
    setSearchSaleTerm("");
    router.push(`/reports/buyer-statement?saleId=${saleId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      {/* Top Header & Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Customer Accounts & Credit Portfolio Division</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {def.titleEn}
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({def.titleBn})
              </span>
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl">
              Official buyer account ledger, chronological purchase consideration debits and credit realisations, and active installment schedule tracking.
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
            {canExport && sale && (
              <>
                <a
                  href={`/api/reports/buyer-statement?saleId=${sale.id}&format=pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Export Landscape PDF
                </a>
                <a
                  href={`/api/reports/buyer-statement?saleId=${sale.id}&format=excel`}
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

      {/* Interactive Buyer Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Customer Account:
            </span>
            {sale ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {sale.buyerName}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {sale.contractNo}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    sale.status === "SOLD"
                      ? "bg-slate-100 text-slate-700 border border-slate-300"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {sale.statusLabelEn}
                </span>
              </div>
            ) : (
              <span className="text-sm text-slate-500 italic">No buyer selected</span>
            )}
          </div>

          {/* Dropdown Toggle / Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors w-full md:w-80"
            >
              <span className="truncate">
                {sale ? `Switch Buyer: ${sale.buyerName}` : "Select Customer Account"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3 border-b border-slate-200 bg-slate-50">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search buyer, phone, plot #, or project..."
                      value={searchSaleTerm}
                      onChange={(e) => setSearchSaleTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {filteredSalesList.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      No matching contracts found.
                    </div>
                  ) : (
                    filteredSalesList.map((s) => {
                      const isSelected = sale?.id === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSelectSale(s.id)}
                          className={`p-3 hover:bg-emerald-50/60 cursor-pointer transition-colors ${
                            isSelected ? "bg-emerald-50/40 border-l-4 border-emerald-600" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              {s.buyerName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                s.status === "SOLD"
                                  ? "bg-slate-100 text-slate-600"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {s.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                            <span>
                              {s.projectName} · Plot {s.plotNumber} ({s.plotSizeShotok.toFixed(1)} Sh)
                            </span>
                            <span className="font-mono text-slate-700 font-semibold">
                              {formatBDT(s.totalAgreedPrice)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                            <span>Phone: {s.buyerPhone}</span>
                            <span>Due: <strong className={s.currentDue > 0 ? "text-red-600" : "text-emerald-600"}>{formatBDT(s.currentDue)}</strong></span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Close Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {sale ? (
        <>
          {/* Top 4 Macro KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Agreed Price */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Agreed Purchase Price
                </span>
                <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <Building2 className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black tracking-tight text-slate-900 font-mono">
                  {formatBDT(kpis.totalAgreedPrice)}
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
                  <span>Plot {sale.plotNumber}</span>
                  <span className="font-semibold text-slate-700">
                    {sale.plotSizeShotok.toFixed(2)} Shotok ({sale.plotSizeKatha.toFixed(2)} Katha)
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Rate per Shotok</span>
                <span className="font-semibold font-mono text-slate-800">
                  {formatBDT(sale.ratePerShotok)}/sh
                </span>
              </div>
            </div>

            {/* Card 2: Total Realized Cash */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Cash Realized / Paid
                </span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black tracking-tight text-emerald-700 font-mono">
                  {formatBDT(kpis.totalPaid)}
                </div>
                <div className="text-xs text-emerald-800 mt-1 flex items-center justify-between">
                  <span>Settlement Progress</span>
                  <span className="font-bold">{kpis.collectionRate.toFixed(1)}% Settled</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Receipts Issued</span>
                <span className="font-semibold text-emerald-700">
                  {payments.length} Money Receipts
                </span>
              </div>
            </div>

            {/* Card 3: Outstanding Due Amount */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Outstanding Due Balance
                </span>
                <span className="p-2 rounded-lg bg-red-50 text-red-600">
                  <CreditCard className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-2">
                <div className={`text-2xl font-black tracking-tight font-mono ${kpis.currentDue > 0 ? "text-red-600" : "text-emerald-700"}`}>
                  {kpis.currentDue > 0 ? formatBDT(kpis.currentDue) : "৳ 0.00"}
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
                  <span>Balance Financed</span>
                  <span className="font-semibold">
                    {kpis.upcomingInstallmentsCount + kpis.overdueInstallmentsCount} Remaining Due
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Overdue Risk</span>
                <span className={`font-semibold ${kpis.overdueInstallmentsCount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {kpis.overdueInstallmentsCount > 0 ? `${kpis.overdueInstallmentsCount} Schedules Overdue` : "Zero Overdue"}
                </span>
              </div>
            </div>

            {/* Card 4: Installment Schedule Progress */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Installment Amortization
                </span>
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Clock className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black tracking-tight text-blue-700 font-mono">
                  {kpis.paidInstallmentsCount} / {kpis.installmentsCount || 1} Paid
                </div>
                <div className="text-xs text-blue-800 mt-1 flex items-center justify-between">
                  <span>Schedule Timeline</span>
                  <span className="font-semibold">
                    {sale.status === "SOLD" ? "100% Completed" : `${kpis.upcomingInstallmentsCount} Upcoming`}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Next Scheduled Due</span>
                <span className="font-semibold font-mono text-slate-800">
                  {kpis.nextDueDate ? `${formatDate(kpis.nextDueDate)} (${formatBDT(kpis.nextDueAmount)})` : "None"}
                </span>
              </div>
            </div>
          </div>

          {/* Buyer & Property Specification Dossier Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* Buyer Profile */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Buyer Profile & Identity
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Full Name:</span>
                    <strong className="text-slate-900 text-sm">{sale.buyerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone Contact:</span>
                    <strong className="text-slate-900">{sale.buyerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">National ID (NID):</span>
                    <span className="font-mono text-slate-700">{sale.buyerNid || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contract Reference:</span>
                    <span className="font-mono font-bold text-slate-900">{sale.contractNo}</span>
                  </div>
                </div>
              </div>

              {/* Property Specification */}
              <div className="space-y-3 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Demarcated Property Specification
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Project Estate:</span>
                    <strong className="text-slate-900 text-sm">{sale.projectName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cadastral Mouza:</span>
                    <span className="text-slate-700">{sale.mouza || "Registered Cadastral Area"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Demarcated Plot:</span>
                    <strong className="text-slate-900">Plot {sale.plotNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Land Dimensions:</span>
                    <strong className="text-slate-900">
                      {sale.plotSizeShotok.toFixed(2)} Sh ({sale.plotSizeKatha.toFixed(2)} Katha · {sale.plotSizeSqFt.toFixed(0)} sq ft)
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statement Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "ledger"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              Running Financial Ledger ({ledgerEntries.length} Entries)
            </button>
            <button
              onClick={() => setActiveTab("installments")}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "installments"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Clock className="w-4 h-4" />
              Installment Schedule ({schedules.length} Schedules)
            </button>
            <button
              onClick={() => setActiveTab("receipts")}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "receipts"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Receipt className="w-4 h-4" />
              Money Receipts Archive ({payments.length} Receipts)
            </button>
          </div>

          {/* Tab 1: Running Financial Ledger */}
          {activeTab === "ledger" && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Chronological Running Account Ledger
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Debit contract covenants and credit payments showing instantaneous running balance due.
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  All monetary values formatted in BDT (৳)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 w-28">Date</th>
                      <th className="py-3 px-4 w-36">Reference No</th>
                      <th className="py-3 px-4">Transaction Particulars</th>
                      <th className="py-3 px-4 text-right w-36">Debit (+Due)</th>
                      <th className="py-3 px-4 text-right w-36">Credit (-Paid)</th>
                      <th className="py-3 px-4 text-right w-40">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {ledgerEntries.map((entry, idx) => {
                      const isOpening = entry.type === "CONTRACT_OPENING";
                      return (
                        <tr
                          key={entry.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
                        >
                          <td className="py-3 px-4 font-mono whitespace-nowrap text-slate-600">
                            {formatDate(entry.date)}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                            {entry.reference}
                          </td>
                          <td className="py-3 px-4">
                            <div className={`font-medium ${isOpening ? "text-slate-900 font-semibold" : "text-slate-700"}`}>
                              {entry.description}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isOpening ? "Initial Contract Obligation" : "Cash Collection Realization"}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            {entry.debit > 0 ? formatBDT(entry.debit) : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                            {entry.credit > 0 ? formatBDT(entry.credit) : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            {formatBDT(entry.balance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900 text-white font-bold text-xs">
                      <td colSpan={3} className="py-3.5 px-4 uppercase tracking-wider">
                        Account Statement Totals
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-sm text-slate-200">
                        {formatBDT(kpis.totalAgreedPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-sm text-emerald-400">
                        {formatBDT(kpis.totalPaid)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-sm text-amber-300">
                        {formatBDT(kpis.currentDue)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Installment Amortization Schedule */}
          {activeTab === "installments" && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Installment Amortization Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-agreed installment schedules, due dates, and settlement tracking.
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  {kpis.paidInstallmentsCount} of {schedules.length} Settled
                </div>
              </div>

              {schedules.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No installment schedules registered for this contract (Settled via one-time full payment).
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4 w-28 text-center">Installment #</th>
                        <th className="py-3 px-4 w-36">Due Date</th>
                        <th className="py-3 px-4 text-right w-44">Due Amount (৳)</th>
                        <th className="py-3 px-4 text-center w-40">Status</th>
                        <th className="py-3 px-4">Notes & Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                      {schedules.map((sch) => {
                        const isPaid = sch.status === "PAID";
                        const isOverdue = sch.status === "OVERDUE";
                        return (
                          <tr
                            key={sch.id}
                            className={`hover:bg-slate-50 transition-colors ${
                              isOverdue ? "bg-red-50/40" : ""
                            }`}
                          >
                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                              #{sch.installmentNo}
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                              {formatDate(sch.dueDate)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                              {formatBDT(sch.dueAmount)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Paid / Settled
                                </span>
                              ) : isOverdue ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                  Overdue
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                                  Upcoming
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {isPaid
                                ? "Settled via customer money receipt"
                                : isOverdue
                                ? "Past due date - grace period notice applicable"
                                : "Scheduled regular monthly payment"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-900 text-white font-bold text-xs">
                        <td colSpan={2} className="py-3.5 px-4 uppercase tracking-wider">
                          Installment Schedule Total ({schedules.length} Installments)
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-sm text-emerald-400">
                          {formatBDT(schedules.reduce((sum, s) => sum + s.dueAmount, 0))}
                        </td>
                        <td colSpan={2} className="py-3.5 px-4 text-right text-slate-300">
                          {kpis.paidInstallmentsCount} Settled · {kpis.upcomingInstallmentsCount} Remaining
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Official Money Receipts Archive */}
          {activeTab === "receipts" && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Official Money Receipts Archive
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official company money receipts issued against this purchase covenant.
                  </p>
                </div>
                <div className="text-xs font-semibold text-emerald-700">
                  Total Realized: {formatBDT(kpis.totalPaid)}
                </div>
              </div>

              {payments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No payment receipts recorded yet for this customer.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4 w-36">Receipt No</th>
                        <th className="py-3 px-4 w-32">Payment Date</th>
                        <th className="py-3 px-4 w-32">Payment Channel</th>
                        <th className="py-3 px-4">Deposited Bank Account</th>
                        <th className="py-3 px-4">Remarks</th>
                        <th className="py-3 px-4 text-right w-40">Amount Realized (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                      {payments.map((p, idx) => (
                        <tr
                          key={p.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {p.receiptNo}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {formatDate(p.paymentDate)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                              {p.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {p.bankName ? (
                              <div>
                                <div className="font-semibold text-slate-900">{p.bankName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{p.accountNumber || ""}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Cash Treasury</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {p.remarks || "Regular installment realization"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                            {formatBDT(p.amountPaid)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-900 text-white font-bold text-xs">
                        <td colSpan={5} className="py-3.5 px-4 uppercase tracking-wider">
                          Total Realized Through {payments.length} Money Receipts
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-sm text-emerald-400">
                          {formatBDT(kpis.totalPaid)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Statutory Real Estate Act 2010 Notice */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-xs text-slate-600 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold mb-0.5">
                Statutory Statement & Handover Notice (Real Estate Development & Management Act, 2010 - Sections 13, 14 & 16):
              </strong>
              This statement constitutes an authentic and binding record of financial consideration received from the allottee. Final possession demarcation, mutation certificates, and registered Sub-Kabala execution shall be delivered immediately upon settlement of the outstanding contractual balance due.
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Buyer Contract Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Please select a buyer from the customer accounts list above to view their running ledger, payment history, and installment schedule.
          </p>
        </div>
      )}
    </div>
  );
}
