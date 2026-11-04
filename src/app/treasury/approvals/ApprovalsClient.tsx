"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Wallet,
  Building2,
  AlertCircle,
  Loader2,
  ArrowLeftRight,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";

export type TransferRequest = {
  recordId: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  fromType: string;
  toType: string;
  amount: number;
  bankAccountId?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  purpose: string;
  requestedBy: string;
  approvedBy?: string | null;
};

export default function ApprovalsClient({
  requests,
  canApprove,
  approveAction,
  rejectAction,
}: {
  requests: TransferRequest[];
  canApprove: boolean;
  approveAction: (requestId: string) => Promise<{ success?: boolean; error?: string }>;
  rejectAction: (requestId: string) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [activeTab, setActiveTab] = useState<"PENDING" | "HISTORY">("PENDING");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 4000);
  };

  const pending = requests.filter((r) => r.status === "PENDING");
  const history = requests.filter((r) => r.status !== "PENDING");

  const handleApprove = async (id: string) => {
    setBusyId(id);
    const res = await approveAction(id);
    setBusyId(null);
    if (res.error) {
      showToast(res.error, true);
    } else {
      showToast("✓ Contra transfer approved and executed!");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this transfer request?")) return;
    setBusyId(id);
    const res = await rejectAction(id);
    setBusyId(null);
    if (res.error) {
      showToast(res.error, true);
    } else {
      showToast("✓ Transfer request has been rejected.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-in ${
            toast.error ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          {toast.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transfer Approvals Queue</h1>
          <p className="text-sm text-slate-500">
            Review, authorize, or decline contra transfer requests between Cash in Hand and Bank accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/treasury"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <ArrowLeftRight className="w-4 h-4" /> New Transfer
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            activeTab === "PENDING"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" /> Pending Approvals
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-mono">
            {pending.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            activeTab === "HISTORY"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> History Log
          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-mono">
            {history.length}
          </span>
        </button>
      </div>

      {/* Non-approver alert */}
      {!canApprove && activeTab === "PENDING" && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>You have view-only access. Only Super Admin and Managing Partner roles can execute approvals.</span>
        </div>
      )}

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Requested Date</th>
                <th>Transfer Route</th>
                <th>Account</th>
                <th>Purpose</th>
                <th className="text-right">Amount</th>
                <th className="p-3 text-right">Action / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === "PENDING" ? (
                pending.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No pending transfer requests at this time.
                    </td>
                  </tr>
                ) : (
                  pending.map((r) => (
                    <tr key={r.recordId} className="hover:bg-slate-50/50">
                      <td className="p-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {r.fromType}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {r.toType}
                          </span>
                        </div>
                      </td>
                      <td className="text-xs">
                        {r.bankName ? (
                          <div>
                            <span className="font-semibold text-slate-900 block">{r.bankName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">..{(r.accountNumber || "").slice(-4)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">Physical Cash</span>
                        )}
                      </td>
                      <td className="text-xs text-slate-700 font-medium">{r.purpose}</td>
                      <td className="text-right font-mono font-bold text-xs text-slate-900">
                        {formatBDT(r.amount)}
                      </td>
                      <td className="p-3 text-right">
                        {canApprove ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(r.recordId)}
                              disabled={busyId === r.recordId}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-semibold transition shadow-2xs"
                            >
                              {busyId === r.recordId && <Loader2 className="w-3 h-3 animate-spin" />}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(r.recordId)}
                              disabled={busyId === r.recordId}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-semibold transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Awaiting Authorization
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No completed transfer history recorded.
                  </td>
                </tr>
              ) : (
                history.map((r) => {
                  const isApproved = r.status === "APPROVED";
                  return (
                    <tr key={r.recordId} className="hover:bg-slate-50/50">
                      <td className="p-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {r.fromType}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {r.toType}
                          </span>
                        </div>
                      </td>
                      <td className="text-xs">
                        {r.bankName ? (
                          <div>
                            <span className="font-semibold text-slate-900 block">{r.bankName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">..{(r.accountNumber || "").slice(-4)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">Physical Cash</span>
                        )}
                      </td>
                      <td className="text-xs text-slate-700">{r.purpose}</td>
                      <td className="text-right font-mono font-bold text-xs text-slate-900">
                        {formatBDT(r.amount)}
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

