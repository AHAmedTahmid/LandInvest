"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Wallet,
  Users,
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  Receipt,
  Check,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";
import { useLang } from "@/lib/i18n";

export interface PendingExpenseItem {
  id: string;
  projectId: string | null;
  projectName: string;
  mouza: string | null;
  expenseCategory: string;
  amount: number;
  expenseDate: string;
  description: string;
  paymentChannel: string;
  bankName: string | null;
  paidByPartnerName: string | null;
  paidByPartnerPhone: string | null;
  voucherImageUrl: string | null;
  status: string;
  createdAt: string;
}

export interface ApprovalsData {
  pendingExpenses: PendingExpenseItem[];
  projects: { id: string; projectName: string; mouza?: string | null }[];
  canApprove: boolean;
}

export default function ApprovalsClient({ data }: { data: ApprovalsData }) {
  const { t } = useLang();
  const router = useRouter();
  const { pendingExpenses: initialList, projects, canApprove } = data;

  const [items, setItems] = useState<PendingExpenseItem[]>(initialList);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [selectedChannel, setSelectedChannel] = useState("ALL");

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewVoucher, setPreviewVoucher] = useState<PendingExpenseItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialList);
  }, [initialList]);

  // Escape key handler for preview modal
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPreviewVoucher(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Filtered queue
  const filtered = useMemo(() => {
    return items.filter((e) => {
      if (selectedProject !== "ALL") {
        if (selectedProject === "GENERAL" && e.projectId) return false;
        if (selectedProject !== "GENERAL" && e.projectId !== selectedProject) return false;
      }
      if (selectedChannel !== "ALL" && e.paymentChannel !== selectedChannel) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchCategory = e.expenseCategory.toLowerCase().includes(query);
        const matchDesc = e.description.toLowerCase().includes(query);
        const matchProject = e.projectName.toLowerCase().includes(query);
        const matchMouza = e.mouza?.toLowerCase().includes(query);
        if (!matchCategory && !matchDesc && !matchProject && !matchMouza) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedProject, selectedChannel, search]);

  const totalPendingAmount = useMemo(() => items.reduce((s, e) => s + e.amount, 0), [items]);
  const filteredAmount = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);

  // Actions
  async function handleApprove(id: string) {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/expenses/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVED" }),
      });
      if (res.ok) {
        setToast("Expense approved successfully!");
        setItems((prev) => prev.filter((e) => e.id !== id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Approval failed");
      }
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Are you sure you want to reject this expense?")) return;
    setProcessingId(id);
    try {
      const res = await fetch(`/api/expenses/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECTED" }),
      });
      if (res.ok) {
        setToast("Expense rejected.");
        setItems((prev) => prev.filter((e) => e.id !== id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Rejection failed");
      }
    } finally {
      setProcessingId(null);
    }
  }

  // Batch approve selected
  async function handleBatchApprove() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Approve all ${selectedIds.length} selected expenses?`)) return;

    setBatchProcessing(true);
    let successCount = 0;
    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/expenses/${id}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "APPROVED" }),
        });
        if (res.ok) successCount++;
      }
      setToast(`Approved ${successCount} expenses successfully!`);
      setItems((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
      setSelectedIds([]);
      router.refresh();
    } finally {
      setBatchProcessing(false);
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((e) => e.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-in">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-amber-900/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Dual-Decision Review Queue</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Expense Approval Queue</h1>
          <p className="text-sm text-slate-300 mt-1">
            Review site manager expenditures, vendor invoices, and partner direct payments before ledger posting.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            href="/expenses"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-[0.98]"
          >
            <Receipt className="w-4 h-4" />
            <span>All Expenses Directory</span>
          </Link>

          {canApprove && selectedIds.length > 0 && (
            <button
              onClick={handleBatchApprove}
              disabled={batchProcessing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {batchProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Approve Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Warning for Read-only Users */}
      {!canApprove && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">View-Only Mode</p>
            <p className="text-amber-700 mt-0.5">
              You have read permissions for the approval queue. Final expense approval and rejection requires Executive Sign-off privileges (Super Admin or Managing Partner).
            </p>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{items.length} Vouchers</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Pending Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatBDT(totalPendingAmount)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Current Filter Selection</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatBDT(filteredAmount)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pending by category, description, project..."
              className="w-full pl-10 pr-10 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-brand-600 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="w-full md:w-60">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-brand-600"
            >
              <option value="ALL">All Projects</option>
              <option value="GENERAL">General Overhead</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName} {p.mouza ? `(${p.mouza})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-brand-600"
            >
              <option value="ALL">All Payment Channels</option>
              <option value="CASH">Cash in Hand</option>
              <option value="BANK">Bank Transfer</option>
              <option value="PAID_BY_PARTNER">Paid by Partner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pending Vouchers List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">All Caught Up!</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {items.length === 0
              ? "There are no expense vouchers awaiting review. Every submitted disbursement has been processed."
              : "No pending vouchers match your current filters. Try resetting search criteria."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/expenses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition"
            >
              <span>View Approved Expenses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Batch select header if items present */}
          {canApprove && (
            <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Select all visible ({filtered.length})</span>
              </label>

              {selectedIds.length > 0 && (
                <span className="text-brand-600 font-semibold">
                  {selectedIds.length} vouchers selected
                </span>
              )}
            </div>
          )}

          {/* Individual Pending Cards */}
          {filtered.map((e) => {
            const isProcessing = processingId === e.id;
            const isSelected = selectedIds.includes(e.id);

            return (
              <div
                key={e.id}
                className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                  isSelected ? "border-brand-500 ring-1 ring-brand-500/20" : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {canApprove && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(e.id)}
                        className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{e.projectName}</span>
                        {e.mouza && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {e.mouza}
                          </span>
                        )}
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{formatDate(e.expenseDate)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{e.expenseCategory}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
                          PENDING
                        </span>
                      </div>

                      {e.description && (
                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
                          {e.description}
                        </p>
                      )}

                      {/* Payment Channel Indicator */}
                      <div className="pt-1 flex items-center gap-2 text-xs">
                        {e.paymentChannel === "CASH" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Wallet className="w-3 h-3" /> Treasury Cash Drawer
                          </span>
                        )}
                        {e.paymentChannel === "BANK" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            <Building2 className="w-3 h-3" /> {e.bankName || "Commercial Bank"}
                          </span>
                        )}
                        {e.paymentChannel === "PAID_BY_PARTNER" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            <Users className="w-3 h-3" /> Paid by {e.paidByPartnerName || "Partner"}
                            {e.paidByPartnerPhone ? ` (${e.paidByPartnerPhone})` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Amount and Dual Action Buttons */}
                  <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Amount</p>
                      <p className="text-xl font-bold text-slate-900">{formatBDT(e.amount)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewVoucher(e)}
                        className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                        title="View Full Voucher Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canApprove && (
                        <>
                          <button
                            onClick={() => handleReject(e.id)}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl disabled:opacity-50 transition active:scale-[0.98]"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => handleApprove(e.id)}
                            disabled={isProcessing}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs disabled:opacity-50 transition active:scale-[0.98] flex items-center gap-1.5"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Approve</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Voucher Detail Preview Modal */}
      {previewVoucher && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewVoucher(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Pending Voucher Dossier</h3>
              </div>
              <button
                onClick={() => setPreviewVoucher(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Requested Amount</p>
                  <p className="text-2xl font-bold text-slate-900">{formatBDT(previewVoucher.amount)}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  PENDING REVIEW
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Project</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{previewVoucher.projectName}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Category</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{previewVoucher.expenseCategory}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Payment Channel</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{previewVoucher.paymentChannel}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Account / Payer</p>
                  <p className="text-slate-900 font-semibold mt-0.5">
                    {previewVoucher.bankName ||
                      previewVoucher.paidByPartnerName ||
                      "Treasury Cash Drawer"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Expense Date</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{formatDate(previewVoucher.expenseDate)}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Voucher ID</p>
                  <p className="text-slate-900 font-mono text-[10px] mt-0.5">{previewVoucher.id}</p>
                </div>
              </div>

              {previewVoucher.description && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Description</p>
                  <p className="text-xs text-slate-800 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {previewVoucher.description}
                  </p>
                </div>
              )}

              {previewVoucher.voucherImageUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1.5">Attached Receipt / Bill</p>
                  <a
                    href={previewVoucher.voucherImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline font-semibold bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Uploaded Receipt Document
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {canApprove ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const id = previewVoucher.id;
                      setPreviewVoucher(null);
                      handleApprove(id);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const id = previewVoucher.id;
                      setPreviewVoucher(null);
                      handleReject(id);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              ) : <div />}

              <button
                type="button"
                onClick={() => setPreviewVoucher(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition active:scale-[0.98]"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
