"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Search,
  RefreshCw,
  Printer,
  Eye,
  FileText,
  User,
  Wallet,
  Landmark,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  X,
  Filter,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatBDT } from "@/lib/format";

type UserRef = { id: string; name: string; email: string };

type Voucher = {
  id: string;
  voucherNo: string;
  date: string;
  createdAt: string;
  category: string;
  amount: number;
  description: string;
  paymentChannel: "CASH" | "BANK" | "PAID_BY_PARTNER";
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  voucherImageUrl: string | null;
  projectId: string | null;
  projectName: string;
  project: { id: string; projectName: string; mouza: string } | null;
  paidByDisplay: string;
  paidByDetails: {
    type: "CASH" | "BANK" | "PARTNER";
    id?: string;
    name?: string;
    phone?: string;
    bankName?: string;
    accountNumber?: string;
    label?: string;
  };
  created: {
    user: UserRef | null;
    at: string;
  };
  approved: {
    user: UserRef | null;
    at: string | null;
  } | null;
  rejected: {
    user: UserRef | null;
    at: string | null;
  } | null;
  cancelled: {
    user: UserRef | null;
    at: string | null;
  } | null;
  auditTrail: Array<{
    id: string;
    action: string;
    statusChangedTo: string | null;
    user: UserRef | null;
    timestamp: string;
  }>;
};

type SummaryMetrics = {
  totalCount: number;
  totalAmount: number;
  pendingCount: number;
  pendingAmount: number;
  approvedCount: number;
  approvedAmount: number;
  rejectedCount: number;
  rejectedAmount: number;
  cancelledCount: number;
  cancelledAmount: number;
};

export default function VoucherManagementPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [summary, setSummary] = useState<SummaryMetrics>({
    totalCount: 0,
    totalAmount: 0,
    pendingCount: 0,
    pendingAmount: 0,
    approvedCount: 0,
    approvedAmount: 0,
    rejectedCount: 0,
    rejectedAmount: 0,
    cancelledCount: 0,
    cancelledAmount: 0,
  });

  // Filter options from API
  const [projects, setProjects] = useState<Array<{ id: string; projectName: string }>>([]);
  const [partners, setPartners] = useState<Array<{ id: string; name: string; phone: string }>>([]);
  const [banks, setBanks] = useState<Array<{ id: string; bankName: string; accountNumber: string }>>([]);
  const [posters, setPosters] = useState<UserRef[]>([]);
  const [reviewers, setReviewers] = useState<UserRef[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [postedByFilter, setPostedByFilter] = useState<string>("");
  const [paidByFilter, setPaidByFilter] = useState<string>("");
  const [reviewedByFilter, setReviewedByFilter] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Pagination (Show 10, 25, 50, 100 entries)
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Modals
  const [activeVoucher, setActiveVoucher] = useState<Voucher | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    voucher: Voucher;
    action: "APPROVED" | "REJECTED" | "CANCELLED";
  } | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const reload = useCallback(() => {
    setReloadTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (projectFilter) params.set("projectId", projectFilter);
    if (postedByFilter) params.set("postedBy", postedByFilter);
    if (paidByFilter) params.set("paidBy", paidByFilter);
    if (reviewedByFilter) params.set("reviewedBy", reviewedByFilter);
    if (searchTerm) params.set("search", searchTerm);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    fetch(`/api/vouchers?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load vouchers");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setVouchers(data.vouchers || []);
        if (data.summary) setSummary(data.summary);
        if (data.filters?.projects) setProjects(data.filters.projects);
        if (data.filters?.partners) setPartners(data.filters.partners);
        if (data.filters?.banks) setBanks(data.filters.banks);
        if (data.filters?.posters) setPosters(data.filters.posters);
        if (data.filters?.reviewers) setReviewers(data.filters.reviewers);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Failed to fetch vouchers";
        setToast({ message: msg, type: "error" });
        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      active = false;
    };
  }, [
    statusFilter,
    projectFilter,
    postedByFilter,
    paidByFilter,
    reviewedByFilter,
    searchTerm,
    fromDate,
    toDate,
    reloadTrigger,
  ]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecuteAction = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/vouchers/${actionTarget.voucher.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionTarget.action,
          reason: actionReason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setToast({
        message: `Voucher ${actionTarget.voucher.voucherNo} marked as ${actionTarget.action}`,
        type: "success",
      });
      setActionTarget(null);
      setActionReason("");
      if (activeVoucher?.id === actionTarget.voucher.id) {
        setActiveVoucher(null);
      }
      reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setToast({ message: msg, type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter("ALL");
    setSearchTerm("");
    setProjectFilter("");
    setPostedByFilter("");
    setPaidByFilter("");
    setReviewedByFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  // Reset page to 1 when any filter changes (render-phase state adjustment per React docs)
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const filterKey = `${statusFilter}|${projectFilter}|${postedByFilter}|${paidByFilter}|${reviewedByFilter}|${searchTerm}|${fromDate}|${toDate}|${pageSize}`;
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  // Pagination calculations
  const totalEntries = vouchers.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = totalEntries === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const paginatedVouchers = vouchers.slice(startIndex, endIndex);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    Boolean(searchTerm) ||
    Boolean(projectFilter) ||
    Boolean(postedByFilter) ||
    Boolean(paidByFilter) ||
    Boolean(reviewedByFilter) ||
    Boolean(fromDate) ||
    Boolean(toDate);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white font-medium text-sm transition-all duration-300 ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-50 text-brand-700 rounded-xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Voucher Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized view for tracking who <b>posted</b>, <b>paid</b>, <b>approved</b>, or <b>rejected</b> each voucher &bull; Filter all, approved, and cancelled vouchers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setRefreshing(true);
              reload();
            }}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-brand-600" : ""}`} />
            Refresh
          </button>
          <Link
            href="/expenses"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-600 rounded-lg transition shadow-sm"
          >
            + New Voucher / Expense
          </Link>
        </div>
      </div>

      {/* Primary Status Quick-Filter Cards (All, Approved, Cancelled, Pending, Rejected) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`text-left p-4 rounded-xl border transition shadow-sm ${
            statusFilter === "ALL"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900 ring-offset-2"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">All Vouchers</span>
            <FileText className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-extrabold mt-2">{summary.totalCount}</div>
          <div className="text-xs opacity-80 mt-0.5">{formatBDT(summary.totalAmount)}</div>
        </button>

        <button
          onClick={() => setStatusFilter("APPROVED")}
          className={`text-left p-4 rounded-xl border transition shadow-sm ${
            statusFilter === "APPROVED"
              ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-600 ring-offset-2"
              : "bg-white text-emerald-900 border-emerald-200 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold mt-2">{summary.approvedCount}</div>
          <div className="text-xs opacity-80 mt-0.5">{formatBDT(summary.approvedAmount)}</div>
        </button>

        <button
          onClick={() => setStatusFilter("CANCELLED")}
          className={`text-left p-4 rounded-xl border transition shadow-sm ${
            statusFilter === "CANCELLED"
              ? "bg-slate-700 text-white border-slate-700 ring-2 ring-slate-700 ring-offset-2"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Cancelled</span>
            <Ban className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold mt-2">{summary.cancelledCount}</div>
          <div className="text-xs opacity-80 mt-0.5">{formatBDT(summary.cancelledAmount)}</div>
        </button>

        <button
          onClick={() => setStatusFilter("PENDING")}
          className={`text-left p-4 rounded-xl border transition shadow-sm ${
            statusFilter === "PENDING"
              ? "bg-amber-600 text-white border-amber-600 ring-2 ring-amber-600 ring-offset-2"
              : "bg-white text-amber-900 border-amber-200 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold mt-2">{summary.pendingCount}</div>
          <div className="text-xs opacity-80 mt-0.5">{formatBDT(summary.pendingAmount)}</div>
        </button>

        <button
          onClick={() => setStatusFilter("REJECTED")}
          className={`text-left p-4 rounded-xl border transition shadow-sm col-span-2 md:col-span-1 ${
            statusFilter === "REJECTED"
              ? "bg-rose-600 text-white border-rose-600 ring-2 ring-rose-600 ring-offset-2"
              : "bg-white text-rose-900 border-rose-200 hover:border-rose-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold mt-2">{summary.rejectedCount}</div>
          <div className="text-xs opacity-80 mt-0.5">{formatBDT(summary.rejectedAmount)}</div>
        </button>
      </div>

      {/* Advanced Filter and Search Bar with specific options */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        {/* Status Tab Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {(["ALL", "APPROVED", "CANCELLED", "PENDING", "REJECTED"] as const).map((st) => {
              const active = statusFilter === st;
              const count =
                st === "ALL"
                  ? summary.totalCount
                  : st === "APPROVED"
                  ? summary.approvedCount
                  : st === "CANCELLED"
                  ? summary.cancelledCount
                  : st === "PENDING"
                  ? summary.pendingCount
                  : summary.rejectedCount;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    active
                      ? "bg-brand-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>
                    {st === "ALL"
                      ? "All Vouchers"
                      : st === "APPROVED"
                      ? "Approved Only"
                      : st === "CANCELLED"
                      ? "Cancelled Only"
                      : st === "PENDING"
                      ? "Pending"
                      : "Rejected"}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      active ? "bg-brand-800 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Dedicated Governance Filters: Who Posted, Who Paid, Who Approved/Rejected */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          {/* Option: Who Posted the Voucher */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-brand-600" />
              <span>Posted By (Creator)</span>
            </label>
            <select
              value={postedByFilter}
              onChange={(e) => setPostedByFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="">All Posters (Anyone)</option>
              {posters.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.email ? `(${u.email})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Option: Paid By Who */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-emerald-600" />
              <span>Paid By (Payer Source)</span>
            </label>
            <select
              value={paidByFilter}
              onChange={(e) => setPaidByFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="">All Payers (Any)</option>
              <option value="CASH">Cash Treasury (Cash in Hand)</option>
              <optgroup label="Partners (Paid by Partner)">
                {partners.map((p) => (
                  <option key={p.id} value={`PARTNER:${p.id}`}>
                    Partner: {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Bank Accounts">
                {banks.map((b) => (
                  <option key={b.id} value={`BANK:${b.id}`}>
                    Bank: {b.bankName} ({b.accountNumber})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Option: Approved or Rejected by Who */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-blue-600" />
              <span>Approved / Rejected By</span>
            </label>
            <select
              value={reviewedByFilter}
              onChange={(e) => setReviewedByFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="">All Reviewers (Anyone)</option>
              {reviewers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.email ? `(${u.email})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-500" />
              <span>Project</span>
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Date Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search voucher #, payee, category, user name, description…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="md:col-span-6 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Date:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-1/2 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              title="From Date"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-1/2 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              title="To Date"
            />
          </div>
        </div>
      </div>

      {/* Vouchers Table with explicit Posted By, Paid By, and Reviewed By columns */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Top Bar: Show entries selector & summary */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-medium text-slate-700">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="font-medium text-slate-700">entries</span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {totalEntries === 0 ? (
              "Showing 0 to 0 of 0 entries"
            ) : (
              <>
                Showing <b className="text-slate-800">{startIndex + 1}</b> to{" "}
                <b className="text-slate-800">{endIndex}</b> of{" "}
                <b className="text-slate-800">{totalEntries}</b> entries
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Voucher No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Project & Category</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 bg-brand-50/40 text-brand-900 border-x border-slate-200/60">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brand-600" />
                    <span>Posted By</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 bg-emerald-50/40 text-emerald-900 border-r border-slate-200/60">
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paid By</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 bg-blue-50/40 text-blue-900 border-r border-slate-200/60">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Approved / Rejected By</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
                    <span>Loading voucher records…</span>
                  </td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-slate-600">No vouchers matching this filter</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {hasActiveFilters
                        ? "Try clearing filters to see all vouchers"
                        : "Record a new expense to generate vouchers"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedVouchers.map((v) => {
                  const isPending = v.status === "PENDING";
                  const isApproved = v.status === "APPROVED";
                  const isRejected = v.status === "REJECTED";
                  const isCancelled = v.status === "CANCELLED";

                  return (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Voucher No & Attachment Icon */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setActiveVoucher(v)}
                            className="text-brand-700 hover:text-brand-800 hover:underline flex items-center gap-1"
                          >
                            {v.voucherNo}
                          </button>
                          <button
                            onClick={() => handleCopy(v.voucherNo)}
                            title="Copy Voucher Number"
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition"
                          >
                            {copiedId === v.voucherNo ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          {v.voucherImageUrl && (
                            <span
                              title="Scanned receipt attached"
                              className="w-2 h-2 rounded-full bg-blue-500 inline-block"
                            />
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {new Date(v.date).toLocaleDateString("en-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Project & Category */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="font-bold text-slate-800">{v.projectName}</div>
                        <div className="text-[11px] text-slate-600 font-medium">{v.category}</div>
                        {v.description && (
                          <div className="text-[10px] text-slate-400 truncate" title={v.description}>
                            {v.description}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatBDT(v.amount)}
                      </td>

                      {/* Column 1: Who Posted the Voucher */}
                      <td className="py-3 px-4 whitespace-nowrap bg-brand-50/20 border-x border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {(v.created.user?.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {v.created.user?.name || "Unknown"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Posted: {new Date(v.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Paid by Who */}
                      <td className="py-3 px-4 whitespace-nowrap bg-emerald-50/20 border-r border-slate-100">
                        <div className="flex items-center gap-1.5">
                          {v.paymentChannel === "CASH" && (
                            <span className="p-1 rounded bg-amber-100 text-amber-800">
                              <Wallet className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {v.paymentChannel === "BANK" && (
                            <span className="p-1 rounded bg-blue-100 text-blue-800">
                              <Landmark className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {v.paymentChannel === "PAID_BY_PARTNER" && (
                            <span className="p-1 rounded bg-emerald-100 text-emerald-800">
                              <User className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <div>
                            <div className="font-medium text-slate-800">{v.paidByDisplay}</div>
                            <div className="text-[10px] text-slate-400 capitalize">
                              {v.paymentChannel.toLowerCase().replace(/_/g, " ")}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Approved / Rejected by Who */}
                      <td className="py-3 px-4 whitespace-nowrap bg-blue-50/20 border-r border-slate-100">
                        {isApproved && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-semibold text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Approved by {v.approved?.user?.name || "Authorized User"}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {v.approved?.at ? new Date(v.approved.at).toLocaleDateString() : "Approved"}
                            </div>
                          </div>
                        )}

                        {isRejected && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-semibold text-rose-800">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Rejected by {v.rejected?.user?.name || "Authorized User"}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {v.rejected?.at ? new Date(v.rejected.at).toLocaleDateString() : "Rejected"}
                            </div>
                          </div>
                        )}

                        {isCancelled && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-semibold text-slate-700">
                              <Ban className="w-3.5 h-3.5 text-slate-500" />
                              <span>Cancelled by {v.cancelled?.user?.name || "User"}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {v.cancelled?.at ? new Date(v.cancelled.at).toLocaleDateString() : "Cancelled"}
                            </div>
                          </div>
                        )}

                        {isPending && (
                          <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            <span>Awaiting Review</span>
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : isPending
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : isRejected
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-slate-100 text-slate-700 border border-slate-300"
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setActiveVoucher(v)}
                            className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition"
                            title="View Voucher Details & Audit Log"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <a
                            href={`/api/expenses/${v.id}/voucher?type=payment`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="Print Payment Voucher"
                          >
                            <Printer className="w-4 h-4" />
                          </a>

                          {isPending && (
                            <>
                              <button
                                onClick={() => setActionTarget({ voucher: v, action: "APPROVED" })}
                                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setActionTarget({ voucher: v, action: "REJECTED" })}
                                className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => setActionTarget({ voucher: v, action: "CANCELLED" })}
                                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            {totalEntries === 0 ? (
              "Showing 0 to 0 of 0 entries"
            ) : (
              <>
                Showing <b className="text-slate-700">{startIndex + 1}</b> to{" "}
                <b className="text-slate-700">{endIndex}</b> of{" "}
                <b className="text-slate-700">{totalEntries}</b> entries
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 font-medium transition shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safeCurrentPage) <= 1
                  );
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const hasGap = prev && p - prev > 1;
                  return (
                    <div key={p} className="flex items-center">
                      {hasGap && <span className="px-1 text-slate-400">&hellip;</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[30px] h-7 px-2 rounded-lg text-xs font-semibold transition ${
                          safeCurrentPage === p
                            ? "bg-brand-700 text-white shadow-sm"
                            : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 font-medium transition shadow-sm"
              title="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Voucher Detail & Audit Trail Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/20 text-brand-300 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base">{activeVoucher.voucherNo}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        activeVoucher.status === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : activeVoucher.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : activeVoucher.status === "REJECTED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                      }`}
                    >
                      {activeVoucher.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Expense Voucher &bull; ID: {activeVoucher.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveVoucher(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Amount</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {formatBDT(activeVoucher.amount)}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Date</span>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    {new Date(activeVoucher.date).toLocaleDateString("en-BD", {
                      dateStyle: "medium",
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Project</span>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    {activeVoucher.projectName}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Category</span>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    {activeVoucher.category}
                  </div>
                </div>
              </div>

              {/* Description */}
              {activeVoucher.description && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Description & Purpose
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-200">
                    {activeVoucher.description}
                  </div>
                </div>
              )}

              {/* Sign-off & Governance Matrix: Who Created/Posted, Paid, Approved, Rejected */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Sign-Off & Governance Record
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Posted By */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-brand-50/20 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold uppercase text-[10px] text-brand-700">1. Posted By (Creator)</span>
                      <User className="w-3.5 h-3.5 text-brand-600" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      {activeVoucher.created.user?.name || "System"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {activeVoucher.created.user?.email || "—"}
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      Posted on: {new Date(activeVoucher.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Paid By */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/20 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold uppercase text-[10px] text-emerald-700">2. Paid By (Source)</span>
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      {activeVoucher.paidByDisplay}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Channel: {activeVoucher.paymentChannel}
                    </div>
                    {activeVoucher.paidByDetails.phone && (
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                        Phone: {activeVoucher.paidByDetails.phone}
                      </div>
                    )}
                  </div>

                  {/* Decision (Approved / Rejected / Cancelled) */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-blue-50/20 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold uppercase text-[10px] text-blue-700">3. Decision (Reviewed By)</span>
                      {activeVoucher.status === "APPROVED" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : activeVoucher.status === "REJECTED" ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      ) : activeVoucher.status === "CANCELLED" ? (
                        <Ban className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>

                    {activeVoucher.status === "APPROVED" && (
                      <>
                        <div className="font-bold text-emerald-700 text-sm">
                          Approved by {activeVoucher.approved?.user?.name || "Authorized User"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {activeVoucher.approved?.user?.email || "—"}
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                          {activeVoucher.approved?.at
                            ? new Date(activeVoucher.approved.at).toLocaleString()
                            : "Approved"}
                        </div>
                      </>
                    )}

                    {activeVoucher.status === "REJECTED" && (
                      <>
                        <div className="font-bold text-rose-700 text-sm">
                          Rejected by {activeVoucher.rejected?.user?.name || "Authorized User"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {activeVoucher.rejected?.user?.email || "—"}
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                          {activeVoucher.rejected?.at
                            ? new Date(activeVoucher.rejected.at).toLocaleString()
                            : "Rejected"}
                        </div>
                      </>
                    )}

                    {activeVoucher.status === "CANCELLED" && (
                      <>
                        <div className="font-bold text-slate-700 text-sm">
                          Cancelled by {activeVoucher.cancelled?.user?.name || "User"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {activeVoucher.cancelled?.user?.email || "—"}
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                          {activeVoucher.cancelled?.at
                            ? new Date(activeVoucher.cancelled.at).toLocaleString()
                            : "Cancelled"}
                        </div>
                      </>
                    )}

                    {activeVoucher.status === "PENDING" && (
                      <>
                        <div className="font-bold text-amber-700 text-sm">Awaiting Review</div>
                        <div className="text-[11px] text-slate-500">
                          In Queue for Managing Partner or Accountant review
                        </div>
                        <div className="text-[10px] text-amber-600 pt-1 border-t border-slate-200/60">
                          Status: Active Pending
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Attached Scanned Receipt Preview */}
              {activeVoucher.voucherImageUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Scanned Bill / Receipt Attachment
                  </h4>
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-xs text-slate-800">Scanned Receipt Image</div>
                        <div className="text-[10px] text-slate-400">Attached during voucher entry</div>
                      </div>
                    </div>
                    <a
                      href={activeVoucher.voucherImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Full Image
                    </a>
                  </div>
                </div>
              )}

              {/* Audit Log Timeline */}
              {activeVoucher.auditTrail.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Audit Trail History
                  </h4>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                    {activeVoucher.auditTrail.map((log) => (
                      <div key={log.id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              log.statusChangedTo === "APPROVED"
                                ? "bg-emerald-500"
                                : log.statusChangedTo === "REJECTED"
                                ? "bg-rose-500"
                                : log.statusChangedTo === "CANCELLED"
                                ? "bg-slate-400"
                                : "bg-blue-500"
                            }`}
                          />
                          <span className="font-semibold text-slate-800">{log.action}</span>
                          {log.statusChangedTo && (
                            <span className="text-slate-500">
                              &rarr; Status set to <b>{log.statusChangedTo}</b>
                            </span>
                          )}
                          <span className="text-slate-400">by</span>
                          <span className="font-medium text-slate-700">{log.user?.name || "System"}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`/api/expenses/${activeVoucher.id}/voucher?type=payment`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  Print Payment Voucher
                </a>
                <a
                  href={`/api/expenses/${activeVoucher.id}/voucher?type=petty`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  Print Petty Cash Voucher
                </a>
              </div>

              {activeVoucher.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActionTarget({ voucher: activeVoucher, action: "APPROVED" });
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setActionTarget({ voucher: activeVoucher, action: "REJECTED" });
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setActionTarget({ voucher: activeVoucher, action: "CANCELLED" });
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Action Modal */}
      {actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div
              className={`p-5 text-white flex items-center justify-between ${
                actionTarget.action === "APPROVED"
                  ? "bg-emerald-600"
                  : actionTarget.action === "REJECTED"
                  ? "bg-rose-600"
                  : "bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {actionTarget.action === "APPROVED" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : actionTarget.action === "REJECTED" ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <Ban className="w-5 h-5" />
                )}
                <h3 className="font-bold text-sm">Confirm Voucher {actionTarget.action}</h3>
              </div>
              <button
                onClick={() => setActionTarget(null)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to mark voucher{" "}
                <b className="text-slate-900">{actionTarget.voucher.voucherNo}</b> (
                {formatBDT(actionTarget.voucher.amount)} - {actionTarget.voucher.category}) as{" "}
                <b className="uppercase">{actionTarget.action}</b>?
              </p>

              {(actionTarget.action === "REJECTED" || actionTarget.action === "CANCELLED") && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason / Remarks (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a reason for rejection/cancellation…"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionTarget(null)}
                  disabled={actionLoading}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleExecuteAction}
                  disabled={actionLoading}
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition flex items-center gap-1.5 shadow-sm ${
                    actionTarget.action === "APPROVED"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : actionTarget.action === "REJECTED"
                      ? "bg-rose-600 hover:bg-rose-500"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm {actionTarget.action}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
