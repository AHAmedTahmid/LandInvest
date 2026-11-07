"use client";

import { useState, useMemo, useEffect } from "react";
import { formatBDT } from "@/lib/format";
import {
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  CreditCard,
  FileText,
  Building,
  User,
  Phone,
  Layers,
  ChevronRight,
  X,
  Wallet,
  Receipt,
  Check,
  TrendingDown,
  PieChart,
} from "lucide-react";

export interface DueSaleItem {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerNid: string | null;
  saleDate: string;
  status: string;
  totalAgreedPrice: number;
  advanceBookingAmount: number;
  currentDueAmount: number;
  totalPaid: number;
  paidPercent: number;
  overdueAmount: number;
  overdueCount: number;
  nextInstallment: {
    id: string;
    dueDate: string;
    dueAmount: number;
    status: string;
  } | null;
  totalInstallments: number;
  paidInstallmentsCount: number;
  project: {
    id: string;
    projectName: string;
    mouza: string;
    totalAreaShotok: number;
  } | null;
  plot: {
    id: string;
    plotNumber: string;
    plotSizeShotok: number;
    askingPrice: number;
  } | null;
  schedules: Array<{
    id: string;
    dueDate: string;
    dueAmount: number;
    status: string;
  }>;
  customerPayments: Array<{
    id: string;
    amountPaid: number;
    paymentDate: string;
    receiptNo: string;
    paymentMethod: string;
    remarks: string | null;
  }>;
}

export interface DuesPageData {
  sales: DueSaleItem[];
  bankAccounts: Array<{
    id: string;
    bankName: string;
    accountNumber: string;
    branch: string | null;
  }>;
  canCollect: boolean;
  metrics: {
    totalOutstandingDue: number;
    totalAgreed: number;
    totalCollected: number;
    totalOverdueAmount: number;
    totalOverdueInstallments: number;
    dueThisMonth: number;
    activeDueAccountsCount: number;
    settledAccountsCount: number;
  };
}

export default function DuesClient({ data }: { data: DuesPageData }) {
  const [salesList, setSalesList] = useState<DueSaleItem[]>(data.sales);
  const [activeTab, setActiveTab] = useState<"OUTSTANDING" | "OVERDUE" | "SETTLED" | "ALL">("OUTSTANDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("ALL");
  const [sortBy, setSortBy] = useState<"DUE_DESC" | "DUE_ASC" | "OVERDUE_DESC" | "NEXT_DUE_ASC" | "RECENT">("DUE_DESC");

  // Payment Collection Modal State
  const [collectModalSale, setCollectModalSale] = useState<DueSaleItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [bankAccountId, setBankAccountId] = useState<string>(data.bankAccounts[0]?.id || "");
  const [paymentRemarks, setPaymentRemarks] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Schedule / Details Drawer State
  const [scheduleModalSale, setScheduleModalSale] = useState<DueSaleItem | null>(null);
  const [scheduleActiveTab, setScheduleActiveTab] = useState<"SCHEDULE" | "PAYMENTS">("SCHEDULE");

  // Escape key handler for modal dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCollectModalSale(null);
        setScheduleModalSale(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter projects list for dropdown
  const uniqueProjects = useMemo(() => {
    const map = new Map<string, string>();
    salesList.forEach((s) => {
      if (s.project) {
        map.set(s.project.id, s.project.projectName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [salesList]);

  // Dynamic metrics calculation
  const metrics = useMemo(() => {
    const totalOutstandingDue = salesList.reduce((acc, s) => acc + s.currentDueAmount, 0);
    const totalAgreed = salesList.reduce((acc, s) => acc + s.totalAgreedPrice, 0);
    const totalCollected = totalAgreed - totalOutstandingDue;
    const overdueRecords = salesList.filter((s) => s.overdueAmount > 0);
    const totalOverdueAmount = overdueRecords.reduce((acc, s) => acc + s.overdueAmount, 0);
    const totalOverdueInstallments = overdueRecords.reduce((acc, s) => acc + s.overdueCount, 0);
    const activeDueCount = salesList.filter((s) => s.currentDueAmount > 0).length;
    const settledCount = salesList.filter((s) => s.currentDueAmount <= 0).length;

    return {
      totalOutstandingDue,
      totalAgreed,
      totalCollected,
      totalOverdueAmount,
      totalOverdueInstallments,
      dueThisMonth: data.metrics.dueThisMonth,
      activeDueAccountsCount: activeDueCount,
      settledAccountsCount: settledCount,
      collectionRatio: totalAgreed > 0 ? Math.round((totalCollected / totalAgreed) * 100) : 0,
    };
  }, [salesList, data.metrics.dueThisMonth]);

  // Filtered & Sorted Sales List
  const filteredSales = useMemo(() => {
    let result = salesList.filter((sale) => {
      // Tab filter
      if (activeTab === "OUTSTANDING" && sale.currentDueAmount <= 0) return false;
      if (activeTab === "OVERDUE" && sale.overdueAmount <= 0) return false;
      if (activeTab === "SETTLED" && sale.currentDueAmount > 0) return false;

      // Project filter
      if (selectedProjectId !== "ALL" && sale.project?.id !== selectedProjectId) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const buyerMatch = sale.buyerName.toLowerCase().includes(query);
        const phoneMatch = sale.buyerPhone.toLowerCase().includes(query);
        const plotMatch = sale.plot?.plotNumber.toLowerCase().includes(query) ?? false;
        const projectMatch = sale.project?.projectName.toLowerCase().includes(query) ?? false;
        const nidMatch = sale.buyerNid?.toLowerCase().includes(query) ?? false;
        if (!buyerMatch && !phoneMatch && !plotMatch && !projectMatch && !nidMatch) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "DUE_DESC") return b.currentDueAmount - a.currentDueAmount;
      if (sortBy === "DUE_ASC") return a.currentDueAmount - b.currentDueAmount;
      if (sortBy === "OVERDUE_DESC") return b.overdueAmount - a.overdueAmount;
      if (sortBy === "NEXT_DUE_ASC") {
        if (!a.nextInstallment) return 1;
        if (!b.nextInstallment) return -1;
        return new Date(a.nextInstallment.dueDate).getTime() - new Date(b.nextInstallment.dueDate).getTime();
      }
      return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime();
    });

    return result;
  }, [salesList, activeTab, selectedProjectId, searchQuery, sortBy]);

  // Open Collect Modal
  const openCollectModal = (sale: DueSaleItem) => {
    setCollectModalSale(sale);
    setPaymentError(null);
    setPaymentSuccess(null);
    setPaymentRemarks("");
    setPaymentMethod("CASH");

    // Suggest logical default payment amount
    if (sale.nextInstallment && sale.nextInstallment.dueAmount > 0) {
      setPaymentAmount(Math.min(sale.currentDueAmount, sale.nextInstallment.dueAmount).toString());
    } else {
      setPaymentAmount(sale.currentDueAmount.toString());
    }
  };

  // Submit Payment Collection
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectModalSale) return;

    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0) {
      setPaymentError("Please enter a valid payment amount greater than zero.");
      return;
    }
    if (amt > collectModalSale.currentDueAmount) {
      setPaymentError(`Payment amount cannot exceed the outstanding balance of ৳${formatBDT(collectModalSale.currentDueAmount)}.`);
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError(null);

    try {
      const res = await fetch(`/api/sales/${collectModalSale.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          payment_method: paymentMethod,
          bank_account: paymentMethod !== "CASH" ? bankAccountId : null,
          remarks: paymentRemarks || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to process installment payment.");
      }

      const receipt = await res.json();
      setPaymentSuccess(`Payment of ৳${formatBDT(amt)} successfully recorded! Receipt No: ${receipt.receiptNo || "Generated"}`);

      // Update state locally for real-time responsiveness
      const updatedDue = collectModalSale.currentDueAmount - amt;
      const updatedPaid = collectModalSale.totalPaid + amt;
      const updatedStatus = updatedDue <= 0 ? "PAID_IN_FULL" : "PARTIAL";

      setSalesList((prev) =>
        prev.map((s) => {
          if (s.id === collectModalSale.id) {
            return {
              ...s,
              currentDueAmount: updatedDue,
              totalPaid: updatedPaid,
              paidPercent: s.totalAgreedPrice > 0 ? Math.min(100, Math.round((updatedPaid / s.totalAgreedPrice) * 100)) : 100,
              status: updatedStatus,
              customerPayments: [
                {
                  id: receipt.id || String(Date.now()),
                  amountPaid: amt,
                  paymentDate: new Date().toISOString(),
                  receiptNo: receipt.receiptNo || `REC-${Date.now()}`,
                  paymentMethod: paymentMethod,
                  remarks: paymentRemarks || null,
                },
                ...s.customerPayments,
              ],
            };
          }
          return s;
        })
      );

      // Auto close after brief confirmation
      setTimeout(() => {
        setCollectModalSale(null);
        setPaymentSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPaymentError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Export filtered dues to CSV
  const handleExportCSV = () => {
    const headers = [
      "Buyer Name",
      "Phone",
      "NID",
      "Project",
      "Plot Number",
      "Total Agreed (BDT)",
      "Total Paid (BDT)",
      "Outstanding Due (BDT)",
      "Overdue Amount (BDT)",
      "Next Due Date",
      "Status",
    ];

    const rows = filteredSales.map((s) => [
      `"${s.buyerName.replace(/"/g, '""')}"`,
      `"${s.buyerPhone}"`,
      `"${s.buyerNid || ""}"`,
      `"${s.project?.projectName || "Whole Project"}"`,
      `"${s.plot?.plotNumber || "Project-Wide"}"`,
      s.totalAgreedPrice,
      s.totalPaid,
      s.currentDueAmount,
      s.overdueAmount,
      s.nextInstallment ? new Date(s.nextInstallment.dueDate).toLocaleDateString("en-GB") : "N/A",
      s.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `landinvest-dues-ledger-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to format days until due or overdue
  const getRelativeDueBadge = (inst: { dueDate: string; status: string } | null) => {
    if (!inst) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500">Fully Settled</span>;
    }

    const dueDate = new Date(inst.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (inst.status === "OVERDUE" || diffDays < 0) {
      const days = Math.abs(diffDays);
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Overdue {days === 0 ? "today" : `${days}d ago`}
        </span>
      );
    }

    if (diffDays <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          Due in {diffDays} {diffDays === 1 ? "day" : "days"}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
        <Calendar className="w-3 h-3 text-slate-400" />
        Due in {diffDays} days
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              Receivables Ledger
            </span>
            <span className="text-xs text-slate-400 font-medium">Real-Time Collections</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Dues & Installments</h1>
          <p className="text-sm text-slate-500">
            Track outstanding buyer balances, scheduled installments, overdue accounts, and collect payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Financial Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Outstanding Dues */}
        <div className="p-5 rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase">Total Outstanding Dues</span>
            <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">৳{formatBDT(metrics.totalOutstandingDue)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {metrics.activeDueAccountsCount} Active Accounts
              </span>
              <span className="text-xs text-slate-500 font-medium">Pending settlement</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Overdue Installments */}
        <div className="p-5 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/70 via-white to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">Overdue Amount</span>
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">৳{formatBDT(metrics.totalOverdueAmount)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {metrics.totalOverdueInstallments} Overdue Installments
              </span>
              <span className="text-xs text-slate-500 font-medium">Requires recovery</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Due This Month */}
        <div className="p-5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase">Due This Month</span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">৳{formatBDT(metrics.dueThisMonth)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-medium text-slate-600">Expected inflow for current cycle</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Total Collected to Date */}
        <div className="p-5 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">Collected to Date</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">৳{formatBDT(metrics.totalCollected)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.collectionRatio}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-700">{metrics.collectionRatio}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab("OUTSTANDING")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeTab === "OUTSTANDING"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Outstanding Dues ({metrics.activeDueAccountsCount})
            </button>
            <button
              onClick={() => setActiveTab("OVERDUE")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeTab === "OVERDUE"
                  ? "bg-rose-600 text-white font-bold shadow-sm"
                  : "text-rose-700 hover:text-rose-900"
              }`}
            >
              Overdue ({salesList.filter((s) => s.overdueAmount > 0).length})
            </button>
            <button
              onClick={() => setActiveTab("SETTLED")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeTab === "SETTLED"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fully Settled ({metrics.settledAccountsCount})
            </button>
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeTab === "ALL"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Records ({salesList.length})
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="DUE_DESC">Highest Due Balance</option>
              <option value="DUE_ASC">Lowest Due Balance</option>
              <option value="OVERDUE_DESC">Most Overdue Amount</option>
              <option value="NEXT_DUE_ASC">Upcoming Due Date (Soonest)</option>
              <option value="RECENT">Recent Bookings</option>
            </select>
          </div>
        </div>

        {/* Search & Project Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by buyer name, phone, plot number, NID..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="ALL">All Projects ({uniqueProjects.length})</option>
              {uniqueProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dues Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Buyer & Contact</th>
                <th className="py-3 px-4">Property / Plot</th>
                <th className="py-3 px-4 text-right">Agreed Value</th>
                <th className="py-3 px-4">Paid vs Due Status</th>
                <th className="py-3 px-4 text-center">Installments</th>
                <th className="py-3 px-4">Next Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-600">No records found</p>
                      <p className="text-xs text-slate-400">
                        No buyer dues match the selected filters or search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition">
                    {/* Buyer Details */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sale.buyerName}</div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{sale.buyerPhone}</span>
                        {sale.buyerNid && (
                          <span className="text-[10px] text-slate-400">| NID: {sale.buyerNid}</span>
                        )}
                      </div>
                    </td>

                    {/* Property / Plot */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">
                        {sale.project?.projectName || "Land Project"}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {sale.plot ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium text-brand-700">Plot #{sale.plot.plotNumber}</span>
                            <span>• {sale.plot.plotSizeShotok} shotok</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            Entire Project
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Agreed Value */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-bold text-slate-900">৳{formatBDT(sale.totalAgreedPrice)}</div>
                      <div className="text-[11px] text-slate-500">
                        Adv: ৳{formatBDT(sale.advanceBookingAmount)}
                      </div>
                    </td>

                    {/* Paid vs Due Status */}
                    <td className="py-3 px-4">
                      <div className="w-48 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-bold">
                            Paid: ৳{formatBDT(sale.totalPaid)}
                          </span>
                          <span className="text-rose-700 font-bold">
                            Due: ৳{formatBDT(sale.currentDueAmount)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              sale.currentDueAmount <= 0 ? "bg-emerald-500" : "bg-brand-600"
                            }`}
                            style={{ width: `${sale.paidPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{sale.paidPercent}% settled</span>
                          {sale.overdueAmount > 0 && (
                            <span className="text-rose-600 font-semibold">
                              ৳{formatBDT(sale.overdueAmount)} Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Installments */}
                    <td className="py-3 px-4 text-center">
                      <div className="font-semibold text-slate-800">
                        {sale.paidInstallmentsCount} / {sale.totalInstallments}
                      </div>
                      <div className="text-[10px] text-slate-400">Paid / Total</div>
                    </td>

                    {/* Next Due Date */}
                    <td className="py-3 px-4">
                      {sale.nextInstallment ? (
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-800">
                            {new Date(sale.nextInstallment.dueDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {getRelativeDueBadge(sale.nextInstallment)}
                            <span className="text-[11px] font-bold text-slate-700">
                              ৳{formatBDT(sale.nextInstallment.dueAmount)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        getRelativeDueBadge(null)
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          sale.status === "PAID_IN_FULL"
                            ? "bg-emerald-100 text-emerald-800"
                            : sale.status === "PARTIAL"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {sale.status === "PAID_IN_FULL"
                          ? "SETTLED"
                          : sale.status === "PARTIAL"
                          ? "IN PROGRESS"
                          : "BOOKED"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {data.canCollect && sale.currentDueAmount > 0 && (
                          <button
                            onClick={() => openCollectModal(sale)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                            title="Collect Installment Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Collect</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setScheduleModalSale(sale);
                            setScheduleActiveTab("SCHEDULE");
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="View Schedule & Receipts"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`/api/sales/${sale.id}/receipt`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Print / View Receipt"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {collectModalSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Collect Installment / Due</h3>
                  <p className="text-xs text-slate-500">Record cash or bank receipt against outstanding balance</p>
                </div>
              </div>
              <button
                onClick={() => setCollectModalSale(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
              {paymentError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{paymentError}</span>
                </div>
              )}

              {paymentSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{paymentSuccess}</span>
                </div>
              )}

              {/* Deal Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Buyer:</span>
                  <span className="font-bold text-slate-900">{collectModalSale.buyerName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Project & Plot:</span>
                  <span className="font-semibold text-slate-800">
                    {collectModalSale.project?.projectName} (
                    {collectModalSale.plot ? `Plot #${collectModalSale.plot.plotNumber}` : "Entire Project"})
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Agreed:</span>
                  <span className="font-semibold text-slate-800">
                    ৳{formatBDT(collectModalSale.totalAgreedPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Current Outstanding Due:</span>
                  <span className="text-sm font-extrabold text-rose-700">
                    ৳{formatBDT(collectModalSale.currentDueAmount)}
                  </span>
                </div>
              </div>

              {/* Quick Amount Suggestion Pills */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Quick Fill Amount</label>
                <div className="flex flex-wrap items-center gap-2">
                  {collectModalSale.nextInstallment && collectModalSale.nextInstallment.dueAmount > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentAmount(
                          Math.min(
                            collectModalSale.currentDueAmount,
                            collectModalSale.nextInstallment!.dueAmount
                          ).toString()
                        )
                      }
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                      Next Installment (৳{formatBDT(collectModalSale.nextInstallment.dueAmount)})
                    </button>
                  )}
                  {collectModalSale.currentDueAmount > 20000 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentAmount(Math.round(collectModalSale.currentDueAmount / 2).toString())
                      }
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition"
                    >
                      50% Due (৳{formatBDT(Math.round(collectModalSale.currentDueAmount / 2))})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(collectModalSale.currentDueAmount.toString())}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                  >
                    Full Balance (৳{formatBDT(collectModalSale.currentDueAmount)})
                  </button>
                </div>
              </div>

              {/* Payment Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount to Collect (৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    min="1"
                    max={collectModalSale.currentDueAmount}
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 50000"
                  />
                </div>
                {paymentAmount && parseFloat(paymentAmount) > 0 && (
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Remaining Balance After Payment:</span>
                    <span
                      className={`font-bold ${
                        collectModalSale.currentDueAmount - parseFloat(paymentAmount) <= 0
                          ? "text-emerald-700"
                          : "text-slate-800"
                      }`}
                    >
                      ৳{formatBDT(Math.max(0, collectModalSale.currentDueAmount - parseFloat(paymentAmount)))}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Method & Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CASH">Cash in Hand</option>
                    <option value="BANK_TRANSFER">Bank Transfer (Cheque/EFT)</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="MFS">MFS (bKash/Nagad/Rocket)</option>
                  </select>
                </div>

                {paymentMethod !== "CASH" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Deposit Bank Account <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={bankAccountId}
                      onChange={(e) => setBankAccountId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {data.bankAccounts.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bankName} - {b.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Note (Optional)</label>
                <input
                  type="text"
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  placeholder="e.g. Installment #3 via Sonali Bank slip"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCollectModalSale(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmittingPayment ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm Collection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule / Receipts Modal */}
      {scheduleModalSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {scheduleModalSale.buyerName} — Payment Dossier
                </h3>
                <p className="text-xs text-slate-500">
                  {scheduleModalSale.project?.projectName} (
                  {scheduleModalSale.plot ? `Plot #${scheduleModalSale.plot.plotNumber}` : "Entire Project"})
                </p>
              </div>
              <button
                onClick={() => setScheduleModalSale(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setScheduleActiveTab("SCHEDULE")}
                className={`pb-2 border-b-2 transition ${
                  scheduleActiveTab === "SCHEDULE"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Installment Schedule ({scheduleModalSale.schedules.length})
              </button>
              <button
                onClick={() => setScheduleActiveTab("PAYMENTS")}
                className={`pb-2 border-b-2 transition ${
                  scheduleActiveTab === "PAYMENTS"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Collection Receipts ({scheduleModalSale.customerPayments.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {scheduleActiveTab === "SCHEDULE" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-center">
                    <div>
                      <p className="text-[11px] text-slate-400">Total Price</p>
                      <p className="text-sm font-bold text-slate-800">
                        ৳{formatBDT(scheduleModalSale.totalAgreedPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Paid Amount</p>
                      <p className="text-sm font-bold text-emerald-700">
                        ৳{formatBDT(scheduleModalSale.totalPaid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Remaining Due</p>
                      <p className="text-sm font-bold text-rose-700">
                        ৳{formatBDT(scheduleModalSale.currentDueAmount)}
                      </p>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Due Date</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scheduleModalSale.schedules.map((inst, idx) => (
                        <tr key={inst.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-medium text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-3 text-slate-800">
                            {new Date(inst.dueDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            ৳{formatBDT(inst.dueAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                                inst.status === "PAID"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : inst.status === "OVERDUE"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {inst.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduleModalSale.customerPayments.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-400">
                      No customer payment receipts recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {scheduleModalSale.customerPayments.map((pay) => (
                        <div
                          key={pay.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">
                                Receipt #{pay.receiptNo}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {pay.paymentMethod}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {new Date(pay.paymentDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                              {pay.remarks && ` • ${pay.remarks}`}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-extrabold text-emerald-700">
                              ৳{formatBDT(pay.amountPaid)}
                            </span>
                            <a
                              href={`/api/sales/${scheduleModalSale.id}/receipt`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
                              title="Print Receipt"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs text-slate-500">
                Sale ID: <code className="text-slate-700">{scheduleModalSale.id.slice(0, 8)}</code>
              </span>
              <button
                onClick={() => setScheduleModalSale(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
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
