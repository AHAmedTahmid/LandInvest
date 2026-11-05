"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  ArrowDownLeft,
  ArrowUpRight,
  X,
  Printer,
  Wallet,
  ExternalLink,
  Receipt,
  Building2,
  Calendar,
  Layers,
  FileText,
  User,
  Phone,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";

export type CashMovementItem = {
  id: string;
  txnDate: string;
  flowType: "IN" | "OUT";
  amount: number;
  purpose: string;
  displayPurpose: string;
  referenceType: string;
  referenceId?: string | null;
  saleDetails?: {
    id: string;
    buyerName: string;
    buyerPhone?: string | null;
    plotNumber?: string | null;
    projectName?: string | null;
    totalAgreedPrice?: number | null;
    currentDueAmount?: number | null;
    status?: string | null;
  } | null;
  expenseDetails?: {
    id: string;
    expenseCategory: string;
    description?: string | null;
    projectName?: string | null;
  } | null;
};

export default function RecentCashMovements({
  movements,
}: {
  movements: CashMovementItem[];
}) {
  const [selectedTxn, setSelectedTxn] = useState<CashMovementItem | null>(null);

  // Keyboard shortcut: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedTxn(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
      {/* Table Header / View Option */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md">
              <Wallet className="w-4 h-4" />
            </span>
            Recent Cash in Hand Movements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical cash inflows and outflows with one-click voucher inspection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/treasury/transactions?accountId=CASH"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            View All Cash Transactions →
          </Link>
        </div>
      </div>

      {/* Movements Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
            <tr>
              <th className="p-3">Date</th>
              <th>Flow</th>
              <th>Purpose / Description</th>
              <th>Reference</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No cash in hand transactions recorded yet.
                </td>
              </tr>
            )}
            {movements.map((r) => {
              const isInflow = r.flowType === "IN";
              return (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                    {formatDate(r.txnDate)}
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isInflow
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {isInflow ? (
                        <ArrowDownLeft className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {isInflow ? "INFLOW" : "OUTFLOW"}
                    </span>
                  </td>
                  <td className="text-xs text-slate-800 font-medium max-w-xs truncate">
                    {r.displayPurpose}
                  </td>
                  <td className="text-xs font-mono text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                      {r.referenceType}
                    </span>
                  </td>
                  <td
                    className={`p-3 text-right font-mono font-bold text-xs ${
                      isInflow ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isInflow ? "+" : "-"}
                    {formatBDT(r.amount)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTxn(r)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-md transition shadow-2xs"
                      title="View Voucher Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cash Voucher Detail Modal */}
      {selectedTxn && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTxn(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Receipt className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cash Transaction Voucher
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {selectedTxn.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Amount Highlight */}
              <div
                className={`p-4 rounded-xl border text-center ${
                  selectedTxn.flowType === "IN"
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    : "bg-rose-50/60 border-rose-200 text-rose-900"
                }`}
              >
                <span className="text-[11px] uppercase tracking-wider font-bold block mb-1">
                  Physical Vault Cash {selectedTxn.flowType === "IN" ? "Received (Inflow)" : "Paid Out (Outflow)"}
                </span>
                <p className="text-3xl font-extrabold font-mono">
                  {selectedTxn.flowType === "IN" ? "+" : "-"}
                  {formatBDT(selectedTxn.amount)}
                </p>
              </div>

              {/* Transaction Key Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                    Transaction Date
                  </span>
                  <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(selectedTxn.txnDate)}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                    Account Type
                  </span>
                  <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    Cash in Hand (Vault)
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                    Reference Type
                  </span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] font-mono">
                      {selectedTxn.referenceType}
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                    Reference ID
                  </span>
                  <p className="font-mono text-slate-700 mt-0.5 text-[11px] truncate" title={selectedTxn.referenceId || "N/A"}>
                    {selectedTxn.referenceId || "Direct Cash"}
                  </p>
                </div>
              </div>

              {/* Purpose & Description */}
              <div className="text-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Particulars / Description
                </span>
                <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 font-medium">
                  {selectedTxn.displayPurpose}
                </p>
              </div>

              {/* Linked Sale Details Card (if SALE_PAYMENT) */}
              {selectedTxn.saleDetails && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-blue-700" />
                      Linked Plot Sale Record
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedTxn.saleDetails.status === "PAID_IN_FULL"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedTxn.saleDetails.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Buyer Name</span>
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {selectedTxn.saleDetails.buyerName}
                      </p>
                    </div>

                    {selectedTxn.saleDetails.buyerPhone && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Phone</span>
                        <p className="font-medium text-slate-800 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {selectedTxn.saleDetails.buyerPhone}
                        </p>
                      </div>
                    )}

                    {selectedTxn.saleDetails.plotNumber && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Plot No.</span>
                        <p className="font-bold text-slate-900">
                          Plot {selectedTxn.saleDetails.plotNumber}
                        </p>
                      </div>
                    )}

                    {selectedTxn.saleDetails.projectName && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Land Project</span>
                        <p className="font-medium text-slate-800">
                          {selectedTxn.saleDetails.projectName}
                        </p>
                      </div>
                    )}

                    {selectedTxn.saleDetails.totalAgreedPrice != null && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Price</span>
                        <p className="font-mono font-bold text-slate-900">
                          {formatBDT(selectedTxn.saleDetails.totalAgreedPrice)}
                        </p>
                      </div>
                    )}

                    {selectedTxn.saleDetails.currentDueAmount != null && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Outstanding Due</span>
                        <p className="font-mono font-bold text-rose-700">
                          {formatBDT(selectedTxn.saleDetails.currentDueAmount)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-blue-100 flex justify-end">
                    <Link
                      href={`/sales/${selectedTxn.saleDetails.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      Open Full Sale File & Schedule →
                    </Link>
                  </div>
                </div>
              )}

              {/* Linked Expense Details Card (if EXPENSE) */}
              {selectedTxn.expenseDetails && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    Linked Expense Entry
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Category</span>
                      <p className="font-bold text-slate-900">
                        {selectedTxn.expenseDetails.expenseCategory}
                      </p>
                    </div>
                    {selectedTxn.expenseDetails.projectName && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Project</span>
                        <p className="font-medium text-slate-800">
                          {selectedTxn.expenseDetails.projectName}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedTxn.expenseDetails.description && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Description</span>
                      <p className="font-medium text-slate-800">
                        {selectedTxn.expenseDetails.description}
                      </p>
                    </div>
                  )}
                  <div className="pt-1 flex justify-end">
                    <Link
                      href="/expenses"
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline"
                    >
                      View in Project Expenses →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Voucher
              </button>

              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
