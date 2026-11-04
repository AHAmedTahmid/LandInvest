"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Download,
  Building2,
  Wallet,
  Smartphone,
  Calendar,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";

export type LedgerTransaction = {
  id: string;
  txnDate: string;
  accountType: string;
  bankAccountId?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  mfsType?: string | null;
  flowType: "IN" | "OUT";
  amount: number;
  purpose: string;
  referenceType: string;
  referenceId?: string | null;
  createdBy: string;
};

export default function TransactionsClient({
  transactions,
  bankOptions,
  initialAccountId,
}: {
  transactions: LedgerTransaction[];
  bankOptions: Array<{ id: string; name: string; type: string }>;
  initialAccountId?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState<string>(initialAccountId || "ALL");
  const [flowFilter, setFlowFilter] = useState<"ALL" | "IN" | "OUT">("ALL");

  const filtered = transactions.filter((t) => {
    // Flow filter
    if (flowFilter !== "ALL" && t.flowType !== flowFilter) return false;

    // Account filter
    if (accountFilter === "CASH" && t.accountType !== "CASH") return false;
    if (accountFilter !== "ALL" && accountFilter !== "CASH" && t.bankAccountId !== accountFilter) return false;

    // Search query
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      t.purpose.toLowerCase().includes(q) ||
      t.referenceType.toLowerCase().includes(q) ||
      (t.bankName && t.bankName.toLowerCase().includes(q)) ||
      (t.accountNumber && t.accountNumber.toLowerCase().includes(q)) ||
      (t.referenceId && t.referenceId.toLowerCase().includes(q))
    );
  });

  const totalInflow = filtered
    .filter((t) => t.flowType === "IN")
    .reduce((s, t) => s + t.amount, 0);

  const totalOutflow = filtered
    .filter((t) => t.flowType === "OUT")
    .reduce((s, t) => s + t.amount, 0);

  const netMovement = totalInflow - totalOutflow;

  const handleExportCSV = () => {
    const headers = ["Date", "Account", "Flow", "Amount", "Purpose", "Reference Type", "Reference ID"];
    const rows = filtered.map((t) => [
      t.txnDate,
      t.accountType === "CASH" ? "Cash in Hand" : `${t.bankName || "Bank"} (${t.accountNumber || ""})`,
      t.flowType,
      t.amount,
      `"${t.purpose.replace(/"/g, '""')}"`,
      t.referenceType,
      t.referenceId || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `treasury-ledger-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ledger Transactions</h1>
          <p className="text-sm text-slate-500">
            Comprehensive audit record of all cash, bank, and mobile banking inflows and outflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-2xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <Link
            href="/treasury"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Wallet className="w-4 h-4" /> Contra Transfer
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Filtered Total Inflow</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-emerald-700">{formatBDT(totalInflow)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Filtered Total Outflow</span>
            <span className="p-1.5 bg-rose-50 text-rose-700 rounded-md">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-rose-700">{formatBDT(totalOutflow)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Net Liquidity Flow</span>
            <span className={`p-1.5 rounded-md ${netMovement >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {netMovement >= 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </span>
          </div>
          <p className={`text-xl font-bold font-mono ${netMovement >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            {netMovement >= 0 ? "+" : ""}
            {formatBDT(netMovement)}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by purpose, reference, bank, or ID..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Account Filter */}
          <div className="sm:col-span-4">
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">All Accounts (Cash, Banks & MFS)</option>
              <option value="CASH">Physical Cash in Hand</option>
              {bankOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.type === "MBANKING" ? "MFS" : "Bank"})
                </option>
              ))}
            </select>
          </div>

          {/* Flow Filter */}
          <div className="sm:col-span-3">
            <select
              value={flowFilter}
              onChange={(e) => setFlowFilter(e.target.value as any)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">All Flow Types (IN & OUT)</option>
              <option value="IN">Inflows (Receipts / Deposits)</option>
              <option value="OUT">Outflows (Payments / Expenses)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Date</th>
                <th>Account</th>
                <th>Flow</th>
                <th>Purpose / Description</th>
                <th>Reference</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
              {filtered.map((t) => {
                const isInflow = t.flowType === "IN";
                const isCash = t.accountType === "CASH";
                const isMfs = t.mfsType === "MBANKING";

                return (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {formatDate(t.txnDate)}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs ${
                            isCash
                              ? "bg-emerald-100 text-emerald-800"
                              : isMfs
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isCash ? <Wallet className="w-3.5 h-3.5" /> : isMfs ? <Smartphone className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block text-xs">
                            {isCash ? "Cash in Hand" : t.bankName}
                          </span>
                          {!isCash && t.accountNumber && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              ..{t.accountNumber.slice(-4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isInflow
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {isInflow ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {isInflow ? "INFLOW" : "OUTFLOW"}
                      </span>
                    </td>
                    <td className="text-xs text-slate-700 font-medium">
                      <p className="line-clamp-2">{t.purpose}</p>
                    </td>
                    <td className="text-xs font-mono text-slate-500 whitespace-nowrap">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700 border border-slate-200">
                        {t.referenceType}
                      </span>
                      {t.referenceId && (
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                          ID: {t.referenceId.slice(0, 8)}...
                        </span>
                      )}
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-bold text-xs whitespace-nowrap ${
                        isInflow ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {isInflow ? "+" : "-"}
                      {formatBDT(t.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

