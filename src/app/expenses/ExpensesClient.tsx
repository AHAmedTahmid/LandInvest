"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt,
  Search,
  Filter,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Wallet,
  Users,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Check,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";
import { useLang } from "@/lib/i18n";

export interface ExpenseItem {
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
  voucherImageUrl: string | null;
  status: string;
  createdAt: string;
}

export interface ProjectInfo {
  id: string;
  projectName: string;
  mouza: string;
  totalAreaShotok: number;
  status: string;
}

export interface ExpenseDirectoryData {
  expenses: ExpenseItem[];
  projects: ProjectInfo[];
  partners: { id: string; name: string; phone?: string | null }[];
  banks: { id: string; bankName: string; accountNumber: string }[];
  canApprove: boolean;
  canCreate: boolean;
}

export default function ExpensesClient({ data }: { data: ExpenseDirectoryData }) {
  const { t } = useLang();
  const router = useRouter();
  const { expenses: initialExpenses, projects, partners, banks, canApprove, canCreate } = data;

  const [expensesList, setExpensesList] = useState<ExpenseItem[]>(initialExpenses);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [selectedChannel, setSelectedChannel] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [activeModalExpense, setActiveModalExpense] = useState<ExpenseItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Sync list if data updates
  useEffect(() => {
    setExpensesList(initialExpenses);
  }, [initialExpenses]);

  // Keyboard escape handler for modals
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveModalExpense(null);
        setShowCreateModal(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Filtered expenses
  const filtered = useMemo(() => {
    return expensesList.filter((e) => {
      if (selectedProject !== "ALL") {
        if (selectedProject === "GENERAL" && e.projectId) return false;
        if (selectedProject !== "GENERAL" && e.projectId !== selectedProject) return false;
      }
      if (selectedChannel !== "ALL" && e.paymentChannel !== selectedChannel) return false;
      if (selectedStatus !== "ALL" && e.status !== selectedStatus) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchCategory = e.expenseCategory.toLowerCase().includes(query);
        const matchDesc = e.description.toLowerCase().includes(query);
        const matchProject = e.projectName.toLowerCase().includes(query);
        const matchMouza = e.mouza?.toLowerCase().includes(query);
        const matchId = e.id.toLowerCase().includes(query);
        if (!matchCategory && !matchDesc && !matchProject && !matchMouza && !matchId) {
          return false;
        }
      }
      return true;
    });
  }, [expensesList, selectedProject, selectedChannel, selectedStatus, search]);

  // Financial aggregates
  const totalFilteredAmount = useMemo(() => filtered.reduce((sum, e) => sum + e.amount, 0), [filtered]);
  const approvedTotal = useMemo(
    () => filtered.filter((e) => e.status === "APPROVED").reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );
  const pendingCount = useMemo(
    () => expensesList.filter((e) => e.status === "PENDING").length,
    [expensesList]
  );

  // Clear filters
  const resetFilters = () => {
    setSearch("");
    setSelectedProject("ALL");
    setSelectedChannel("ALL");
    setSelectedStatus("ALL");
  };

  const hasActiveFilters = search.trim() !== "" || selectedProject !== "ALL" || selectedChannel !== "ALL" || selectedStatus !== "ALL";

  // Single-item quick approval
  async function handleApprove(id: string) {
    setApprovingId(id);
    try {
      const res = await fetch(`/api/expenses/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVED" }),
      });
      if (res.ok) {
        setToast("Expense approved successfully!");
        setExpensesList((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: "APPROVED" } : e))
        );
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Approval failed");
      }
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Are you sure you want to reject this expense voucher?")) return;
    setApprovingId(id);
    try {
      const res = await fetch(`/api/expenses/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECTED" }),
      });
      if (res.ok) {
        setToast("Expense rejected.");
        setExpensesList((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: "REJECTED" } : e))
        );
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Rejection failed");
      }
    } finally {
      setApprovingId(null);
    }
  }

  // Create expense
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/expenses", { method: "POST", body: fd });
      if (res.ok) {
        setShowCreateModal(false);
        setToast("Expense logged and queued for approval!");
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to log expense");
      }
    } finally {
      setCreateBusy(false);
    }
  }

  // Export CSV
  function exportCSV() {
    const headers = [
      "Voucher ID",
      "Date",
      "Project",
      "Mouza",
      "Category",
      "Amount (BDT)",
      "Channel",
      "Status",
      "Description",
    ];
    const rows = filtered.map((e) => [
      `"${e.id}"`,
      `"${e.expenseDate}"`,
      `"${e.projectName.replace(/"/g, '""')}"`,
      `"${(e.mouza || "").replace(/"/g, '""')}"`,
      `"${e.expenseCategory.replace(/"/g, '""')}"`,
      e.amount,
      `"${e.paymentChannel}"`,
      `"${e.status}"`,
      `"${(e.description || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Expenses_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Master Expense Directory</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Expenses</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete procurement and site disbursement ledger across all land projects and company operations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {pendingCount > 0 && (
            <Link
              href="/expenses/approvals"
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-[0.98]"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Approval Queue ({pendingCount})</span>
            </Link>
          )}

          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-xs disabled:opacity-50 active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Filtered Total ({filtered.length} entries)</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatBDT(totalFilteredAmount)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Approved & Settled</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{formatBDT(approvedTotal)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Awaiting Approval</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{pendingCount} Vouchers</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by category, description, project, voucher ID..."
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

          {/* Project Filter */}
          <div className="w-full md:w-56">
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

          {/* Payment Channel Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-brand-600"
            >
              <option value="ALL">All Channels</option>
              <option value="CASH">Cash in Hand</option>
              <option value="BANK">Bank Account</option>
              <option value="PAID_BY_PARTNER">Paid by Partner</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-36">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-brand-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-100 transition whitespace-nowrap active:scale-[0.98]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Project</th>
                <th className="px-5 py-3.5">Category & Description</th>
                <th className="px-5 py-3.5">Channel / Details</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">No expense vouchers found</p>
                      <p className="text-[11px] text-slate-400">
                        {hasActiveFilters
                          ? "Try clearing filters or search query to view more results."
                          : "No expenses recorded in the ledger yet."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 text-xs font-semibold text-brand-600 hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition group">
                    <td className="px-5 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                      {formatDate(e.expenseDate)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{e.projectName}</p>
                      {e.mouza ? (
                        <span className="inline-block text-[10px] text-slate-500 font-normal">
                          {e.mouza}
                        </span>
                      ) : !e.projectId ? (
                        <span className="inline-block text-[10px] text-slate-400 italic">
                          Non-project overhead
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-800">{e.expenseCategory}</span>
                      {e.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{e.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {e.paymentChannel === "CASH" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Wallet className="w-3 h-3" /> Cash in Hand
                        </span>
                      )}
                      {e.paymentChannel === "BANK" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200" title={e.bankName || "Bank"}>
                          <Building2 className="w-3 h-3" /> {e.bankName || "Bank Account"}
                        </span>
                      )}
                      {e.paymentChannel === "PAID_BY_PARTNER" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200" title={e.paidByPartnerName || "Partner"}>
                          <Users className="w-3 h-3" /> {e.paidByPartnerName || "Partner Equity"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatBDT(e.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      {e.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <Check className="w-3 h-3" /> APPROVED
                        </span>
                      )}
                      {e.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 animate-pulse">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                      {e.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                          <X className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveModalExpense(e)}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-700 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {canApprove && e.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(e.id)}
                              disabled={approvingId === e.id}
                              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition"
                            >
                              {approvingId === e.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Approve"
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(e.id)}
                              disabled={approvingId === e.id}
                              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-2 py-1 rounded-md text-[11px] font-semibold transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Detail Modal */}
      {activeModalExpense && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModalExpense(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Expense Voucher Dossier</h3>
              </div>
              <button
                onClick={() => setActiveModalExpense(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Voucher Amount</p>
                  <p className="text-2xl font-bold text-slate-900">{formatBDT(activeModalExpense.amount)}</p>
                </div>
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      activeModalExpense.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : activeModalExpense.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {activeModalExpense.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Project</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeModalExpense.projectName}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Category</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeModalExpense.expenseCategory}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Payment Channel</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeModalExpense.paymentChannel}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Disbursed Via</p>
                  <p className="text-slate-900 font-semibold mt-0.5">
                    {activeModalExpense.bankName ||
                      activeModalExpense.paidByPartnerName ||
                      "Cash in Hand Drawer"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Expense Date</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{formatDate(activeModalExpense.expenseDate)}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Voucher ID</p>
                  <p className="text-slate-900 font-mono text-[10px] mt-0.5">{activeModalExpense.id}</p>
                </div>
              </div>

              {activeModalExpense.description && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Description</p>
                  <p className="text-xs text-slate-800 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {activeModalExpense.description}
                  </p>
                </div>
              )}

              {activeModalExpense.voucherImageUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1.5">Attached Receipt / Bill</p>
                  <a
                    href={activeModalExpense.voucherImageUrl}
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
              {canApprove && activeModalExpense.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const id = activeModalExpense.id;
                      setActiveModalExpense(null);
                      handleApprove(id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const id = activeModalExpense.id;
                      setActiveModalExpense(null);
                      handleReject(id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500"
                  >
                    Reject
                  </button>
                </div>
              ) : <div />}

              <button
                type="button"
                onClick={() => setActiveModalExpense(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition active:scale-[0.98]"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Record New Project Expense</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Land Project</label>
                  <select
                    name="project_id"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                  >
                    <option value="">No Project (General Overhead)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName} {p.mouza ? `(${p.mouza})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <input
                    name="category"
                    required
                    placeholder="e.g. Earth Filling, Legal, Survey"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (BDT) *</label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="0.00"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Channel *</label>
                  <select
                    name="payment_channel"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                  >
                    <option value="CASH">CASH (Treasury Cash-in-Hand)</option>
                    <option value="BANK">BANK (Commercial Bank Account)</option>
                    <option value="PAID_BY_PARTNER">PAID_BY_PARTNER (Direct Partner Capital)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bank Account (if Bank)
                  </label>
                  <select
                    name="bank_account"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                  >
                    <option value="">Select Bank Account</option>
                    {banks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} - {b.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Paying Partner (if Partner Paid)
                  </label>
                  <select
                    name="paid_by_partner"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                  >
                    <option value="">Select Partner</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.phone ? `(${p.phone})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Receipt / Voucher File</label>
                  <input
                    name="voucher"
                    type="file"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Details about contractor, bill no, voucher reference..."
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition active:scale-[0.98]"
                >
                  Cancel (Esc)
                </button>
                <button
                  type="submit"
                  disabled={createBusy}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-500 disabled:opacity-50 transition active:scale-[0.98] shadow-sm flex items-center gap-2"
                >
                  {createBusy ? "Submitting..." : "Submit for Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
