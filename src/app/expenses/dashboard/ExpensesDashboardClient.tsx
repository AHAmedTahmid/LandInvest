"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Wallet,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Layers,
  Sparkles,
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

export interface DashboardData {
  expenses: ExpenseItem[];
  projects: ProjectInfo[];
  partners: { id: string; name: string; phone?: string | null }[];
  banks: { id: string; bankName: string; accountNumber: string }[];
}

export default function ExpensesDashboardClient({ data }: { data: DashboardData }) {
  const { t } = useLang();
  const router = useRouter();
  const { expenses, projects, partners, banks } = data;

  const [activeModalExpense, setActiveModalExpense] = useState<ExpenseItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Close modals on Escape key
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

  // Compute metrics
  const approvedExpenses = useMemo(() => expenses.filter((e) => e.status === "APPROVED"), [expenses]);
  const pendingExpenses = useMemo(() => expenses.filter((e) => e.status === "PENDING"), [expenses]);
  const rejectedExpenses = useMemo(() => expenses.filter((e) => e.status === "REJECTED"), [expenses]);

  const totalApprovedAmount = useMemo(
    () => approvedExpenses.reduce((sum, e) => sum + e.amount, 0),
    [approvedExpenses]
  );
  const totalPendingAmount = useMemo(
    () => pendingExpenses.reduce((sum, e) => sum + e.amount, 0),
    [pendingExpenses]
  );

  // Channel breakdown (approved)
  const channelMetrics = useMemo(() => {
    const cash = approvedExpenses.filter((e) => e.paymentChannel === "CASH").reduce((s, e) => s + e.amount, 0);
    const bank = approvedExpenses.filter((e) => e.paymentChannel === "BANK").reduce((s, e) => s + e.amount, 0);
    const partner = approvedExpenses
      .filter((e) => e.paymentChannel === "PAID_BY_PARTNER")
      .reduce((s, e) => s + e.amount, 0);
    const total = totalApprovedAmount || 1;
    return {
      cash: { amount: cash, pct: Math.round((cash / total) * 100) },
      bank: { amount: bank, pct: Math.round((bank / total) * 100) },
      partner: { amount: partner, pct: Math.round((partner / total) * 100) },
    };
  }, [approvedExpenses, totalApprovedAmount]);

  // Top categories breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    approvedExpenses.forEach((e) => {
      const cat = e.expenseCategory.trim() || "Uncategorized";
      map.set(cat, (map.get(cat) || 0) + e.amount);
    });
    const sorted = Array.from(map.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        pct: totalApprovedAmount ? Math.round((amount / totalApprovedAmount) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
    return sorted.slice(0, 6);
  }, [approvedExpenses, totalApprovedAmount]);

  // Project breakdown
  const projectStats = useMemo(() => {
    const map = new Map<string, number>();
    approvedExpenses.forEach((e) => {
      const pId = e.projectId || "general";
      map.set(pId, (map.get(pId) || 0) + e.amount);
    });

    return projects.map((p) => {
      const spent = map.get(p.id) || 0;
      const costPerShotok = p.totalAreaShotok > 0 ? spent / p.totalAreaShotok : 0;
      return {
        ...p,
        totalSpent: spent,
        costPerShotok,
      };
    });
  }, [approvedExpenses, projects]);

  const generalOverheadSpent = useMemo(() => {
    return approvedExpenses
      .filter((e) => !e.projectId)
      .reduce((s, e) => s + e.amount, 0);
  }, [approvedExpenses]);

  // Recent 6 expenses
  const recentExpenses = useMemo(() => expenses.slice(0, 7), [expenses]);

  // Create expense handler
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/expenses", { method: "POST", body: fd });
      if (res.ok) {
        setShowCreateModal(false);
        setToast("Expense submitted for approval successfully!");
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to submit expense");
      }
    } finally {
      setCreateBusy(false);
    }
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

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Financial Control & Procurement</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Project Expenses Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Executive oversight of site procurement, contractor disbursements, and direct partner investments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            href="/expenses/approvals"
            className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-[0.98]"
          >
            <Clock className="w-4 h-4" />
            <span>Approval Queue ({pendingExpenses.length})</span>
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved Expenses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Approved</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            {formatBDT(totalApprovedAmount)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-600">{approvedExpenses.length} vouchers</span>
            <span>settled & capitalized</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Pending Approvals */}
        <Link
          href="/expenses/approvals"
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-400 transition block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Sign-off</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2 tracking-tight">
            {formatBDT(totalPendingAmount)}
          </p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {pendingExpenses.length} awaiting review
            </span>
            <span className="text-slate-400 group-hover:text-amber-600 font-medium flex items-center gap-0.5">
              Review <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </Link>

        {/* Direct Partner Expenses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Partner Paid</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            {formatBDT(channelMetrics.partner.amount)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="font-semibold text-purple-600">{channelMetrics.partner.pct}% of approved</span>
            <span>funded from equity</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
        </div>

        {/* Bank & Cash Outflows */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Treasury</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            {formatBDT(channelMetrics.bank.amount + channelMetrics.cash.amount)}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <span className="text-blue-600 font-medium">Bank: {formatBDT(channelMetrics.bank.amount)}</span>
            <span>•</span>
            <span className="text-slate-600 font-medium">Cash: {formatBDT(channelMetrics.cash.amount)}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>
      </div>

      {/* Visual Channel Distribution Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span>Payment Channel Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Proportion of project capital disbursed via Bank Transfer, Cash in Hand, or Paid Directly by Partners.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Bank ({channelMetrics.bank.pct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Cash ({channelMetrics.cash.pct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Partner Paid ({channelMetrics.partner.pct}%)</span>
            </div>
          </div>
        </div>

        {/* Multi-segment bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${channelMetrics.bank.pct}%` }}
            className="bg-blue-600 h-full transition-all duration-500 hover:brightness-110"
            title={`Bank: ${formatBDT(channelMetrics.bank.amount)} (${channelMetrics.bank.pct}%)`}
          />
          <div
            style={{ width: `${channelMetrics.cash.pct}%` }}
            className="bg-emerald-600 h-full transition-all duration-500 hover:brightness-110"
            title={`Cash: ${formatBDT(channelMetrics.cash.amount)} (${channelMetrics.cash.pct}%)`}
          />
          <div
            style={{ width: `${channelMetrics.partner.pct}%` }}
            className="bg-purple-600 h-full transition-all duration-500 hover:brightness-110"
            title={`Partner Paid: ${formatBDT(channelMetrics.partner.amount)} (${channelMetrics.partner.pct}%)`}
          />
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Bank Accounts</p>
              <p className="text-sm font-bold text-slate-900">{formatBDT(channelMetrics.bank.amount)}</p>
              <p className="text-[11px] text-blue-600 font-semibold">{channelMetrics.bank.pct}% of total</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Cash in Hand</p>
              <p className="text-sm font-bold text-slate-900">{formatBDT(channelMetrics.cash.amount)}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">{channelMetrics.cash.pct}% of total</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Paid by Partner</p>
              <p className="text-sm font-bold text-slate-900">{formatBDT(channelMetrics.partner.amount)}</p>
              <p className="text-[11px] text-purple-600 font-semibold">{channelMetrics.partner.pct}% of total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Top Categories & Project Cost Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Expense Categories */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span>Top Expense Categories</span>
            </h2>
            <Link
              href="/expenses"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              All Categories <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {categoryStats.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No approved expenses recorded yet.</p>
          ) : (
            <div className="space-y-3.5">
              {categoryStats.map((cat, i) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-[10px] text-slate-500 flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatBDT(cat.amount)}{" "}
                      <span className="text-[11px] text-slate-400 font-normal">({cat.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(cat.pct, 100)}%` }}
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Cost Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Project Cost Allocation</span>
            </h2>
            <Link
              href="/expenses/breakdown"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Full Breakdown <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projectStats.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.projectName}</p>
                    {p.mouza && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                        {p.mouza}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Area: <span className="font-medium text-slate-700">{p.totalAreaShotok} Shotok</span>
                    {p.totalAreaShotok > 0 && (
                      <span> • Cost: <span className="font-medium text-slate-700">{formatBDT(p.costPerShotok)}</span> / Shotok</span>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-900">{formatBDT(p.totalSpent)}</p>
                  <Link
                    href={`/expenses/breakdown?project=${p.id}`}
                    className="text-[11px] text-brand-600 hover:underline font-medium inline-flex items-center gap-0.5"
                  >
                    Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}

            {/* General Overhead Row */}
            <div className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">General Overhead / Corporate</p>
                <p className="text-[11px] text-slate-400">Non-project specific operational expenditures</p>
              </div>
              <p className="text-xs font-bold text-slate-700">{formatBDT(generalOverheadSpent)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Expense Entries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest procurement vouchers recorded in the ledger</p>
          </div>
          <Link
            href="/expenses"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All Expenses <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Category & Description</th>
                <th className="px-5 py-3">Channel / Payer</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No expenses recorded yet. Click &quot;Record Expense&quot; above to log the first entry.
                  </td>
                </tr>
              ) : (
                recentExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 transition group">
                    <td className="px-5 py-3 font-medium text-slate-600 whitespace-nowrap">
                      {formatDate(e.expenseDate)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {e.projectName}
                      {e.mouza && (
                        <span className="block text-[10px] font-normal text-slate-500">{e.mouza}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-slate-800">{e.expenseCategory}</span>
                      {e.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{e.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {e.paymentChannel === "CASH" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Wallet className="w-3 h-3" /> Cash in Hand
                        </span>
                      )}
                      {e.paymentChannel === "BANK" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Building2 className="w-3 h-3" /> {e.bankName || "Bank"}
                        </span>
                      )}
                      {e.paymentChannel === "PAID_BY_PARTNER" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          <Users className="w-3 h-3" /> {e.paidByPartnerName || "Partner"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatBDT(e.amount)}
                    </td>
                    <td className="px-5 py-3 text-center whitespace-nowrap">
                      {e.status === "APPROVED" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          APPROVED
                        </span>
                      )}
                      {e.status === "PENDING" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 animate-pulse">
                          PENDING
                        </span>
                      )}
                      {e.status === "REJECTED" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                          REJECTED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setActiveModalExpense(e)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-600 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
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
                <h3 className="font-bold text-slate-900 text-base">Expense Voucher Details</h3>
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
                  <p className="text-xs text-slate-500">Total Amount</p>
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

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
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
