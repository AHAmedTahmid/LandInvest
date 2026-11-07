"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { formatBDT } from "@/lib/format";
import {
  Search,
  Plus,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Building,
  Layers,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  User,
  ArrowUpRight,
  Check,
  Calendar,
  Wallet,
  Receipt,
  PieChart,
} from "lucide-react";

export interface SaleDirectoryItem {
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

export interface ProjectOption {
  id: string;
  projectName: string;
  mouza: string | null;
  totalPlotsCount: number;
  plots: Array<{
    id: string;
    plotNumber: string;
    askingPrice: number;
    plotSizeShotok: number;
    status: string;
  }>;
}

export interface BankOption {
  id: string;
  bankName: string;
  accountNumber: string;
  branchName?: string | null;
}

export interface SalesDirectoryData {
  sales: SaleDirectoryItem[];
  projects: ProjectOption[];
  banks: BankOption[];
  canCreate: boolean;
  canCollect: boolean;
  metrics: {
    totalGrossRevenue: number;
    totalRealizedRevenue: number;
    totalOutstandingDues: number;
    totalSalesCount: number;
    fullySettledCount: number;
    partialCount: number;
    bookedCount: number;
  };
}

export default function SalesDirectoryClient({ data }: { data: SalesDirectoryData }) {
  const [salesList, setSalesList] = useState<SaleDirectoryItem[]>(data.sales);
  const [activeStatusTab, setActiveStatusTab] = useState<"ALL" | "PAID_IN_FULL" | "PARTIAL" | "BOOKED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("ALL");
  const [sortBy, setSortBy] = useState<"RECENT" | "TOTAL_DESC" | "DUE_DESC" | "BUYER_ASC">("RECENT");

  // New Sale Modal State
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [formProjectId, setFormProjectId] = useState(data.projects[0]?.id || "");
  const [formPlotId, setFormPlotId] = useState("");
  const [formBuyerName, setFormBuyerName] = useState("");
  const [formBuyerPhone, setFormBuyerPhone] = useState("");
  const [formBuyerNid, setFormBuyerNid] = useState("");
  const [formTotalPrice, setFormTotalPrice] = useState("");
  const [formAdvance, setFormAdvance] = useState("");
  const [formInstallmentsCount, setFormInstallmentsCount] = useState("6");
  const [formPaymentMethod, setFormPaymentMethod] = useState("CASH");
  const [formBankAccountId, setFormBankAccountId] = useState(data.banks[0]?.id || "");
  const [isSubmittingSale, setIsSubmittingSale] = useState(false);
  const [saleError, setSaleError] = useState<string | null>(null);

  // Quick Collect Payment Modal State
  const [collectModalSale, setCollectModalSale] = useState<SaleDirectoryItem | null>(null);
  const [collectAmount, setCollectAmount] = useState("");
  const [collectMethod, setCollectMethod] = useState("CASH");
  const [collectBankId, setCollectBankId] = useState(data.banks[0]?.id || "");
  const [collectRemarks, setCollectRemarks] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [collectError, setCollectError] = useState<string | null>(null);
  const [collectSuccess, setCollectSuccess] = useState<string | null>(null);

  // Dossier / Schedule Drawer State
  const [dossierSale, setDossierSale] = useState<SaleDirectoryItem | null>(null);
  const [dossierTab, setDossierTab] = useState<"SCHEDULE" | "PAYMENTS">("SCHEDULE");

  // Modal keyboard dismiss handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNewSaleOpen(false);
        setCollectModalSale(null);
        setDossierSale(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Selected project for new sale form
  const currentProject = useMemo(() => {
    return data.projects.find((p) => p.id === formProjectId);
  }, [data.projects, formProjectId]);

  const availablePlots = currentProject?.plots || [];

  // Handle project change in form
  const handleProjectSelect = (projId: string) => {
    setFormProjectId(projId);
    setFormPlotId("");
    setFormTotalPrice("");
  };

  // Handle plot change in form
  const handlePlotSelect = (plotId: string) => {
    setFormPlotId(plotId);
    if (!plotId) {
      setFormTotalPrice("");
      return;
    }
    const found = availablePlots.find((pl) => pl.id === plotId);
    if (found) {
      setFormTotalPrice(String(found.askingPrice));
    }
  };

  // Submit New Sale
  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProjectId) {
      setSaleError("Please select a land project.");
      return;
    }
    const agreed = parseFloat(formTotalPrice);
    if (!agreed || agreed <= 0) {
      setSaleError("Please enter a valid total agreed price.");
      return;
    }

    setIsSubmittingSale(true);
    setSaleError(null);

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: formProjectId,
          plot_id: formPlotId || null,
          buyer_name: formBuyerName,
          buyer_phone: formBuyerPhone,
          buyer_nid: formBuyerNid || null,
          total_agreed_price: agreed,
          advance: parseFloat(formAdvance) || 0,
          installments_count: parseInt(formInstallmentsCount, 10) || 0,
          payment_method: formPaymentMethod === "CASH" ? "CASH" : "BANK",
          bank_account: formPaymentMethod !== "CASH" ? formBankAccountId : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to record sale.");
      }

      const created = await res.json();
      const advancePaid = parseFloat(formAdvance) || 0;
      const initialDue = agreed - advancePaid;
      const newStatus = initialDue <= 0 ? "PAID_IN_FULL" : advancePaid > 0 ? "PARTIAL" : "BOOKED";

      const newItem: SaleDirectoryItem = {
        id: created.id,
        buyerName: formBuyerName,
        buyerPhone: formBuyerPhone,
        buyerNid: formBuyerNid || null,
        saleDate: new Date().toISOString(),
        status: newStatus,
        totalAgreedPrice: agreed,
        advanceBookingAmount: advancePaid,
        currentDueAmount: initialDue,
        totalPaid: advancePaid,
        paidPercent: agreed > 0 ? Math.min(100, Math.round((advancePaid / agreed) * 100)) : 100,
        project: currentProject
          ? {
              id: currentProject.id,
              projectName: currentProject.projectName,
              mouza: currentProject.mouza || "",
              totalAreaShotok: 0,
            }
          : null,
        plot: formPlotId
          ? {
              id: formPlotId,
              plotNumber: availablePlots.find((p) => p.id === formPlotId)?.plotNumber || "Plot",
              plotSizeShotok: availablePlots.find((p) => p.id === formPlotId)?.plotSizeShotok || 0,
              askingPrice: agreed,
            }
          : null,
        schedules: [],
        customerPayments: advancePaid > 0
          ? [
              {
                id: `adv-${Date.now()}`,
                amountPaid: advancePaid,
                paymentDate: new Date().toISOString(),
                receiptNo: `REC-ADV`,
                paymentMethod: formPaymentMethod,
                remarks: "Advance booking payment",
              },
            ]
          : [],
      };

      setSalesList((prev) => [newItem, ...prev]);
      setIsNewSaleOpen(false);

      // Reset form
      setFormBuyerName("");
      setFormBuyerPhone("");
      setFormBuyerNid("");
      setFormPlotId("");
      setFormTotalPrice("");
      setFormAdvance("");
    } catch (err: any) {
      setSaleError(err.message || "An error occurred.");
    } finally {
      setIsSubmittingSale(false);
    }
  };

  // Submit Quick Payment
  const handleQuickCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectModalSale) return;

    const amt = parseFloat(collectAmount);
    if (!amt || amt <= 0) {
      setCollectError("Please enter a valid amount.");
      return;
    }
    if (amt > collectModalSale.currentDueAmount) {
      setCollectError(`Cannot exceed remaining due of ৳${formatBDT(collectModalSale.currentDueAmount)}.`);
      return;
    }

    setIsSubmittingPayment(true);
    setCollectError(null);

    try {
      const res = await fetch(`/api/sales/${collectModalSale.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          payment_method: collectMethod,
          bank_account: collectMethod !== "CASH" ? collectBankId : null,
          remarks: collectRemarks || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to process payment.");
      }

      const receipt = await res.json();
      setCollectSuccess(`Payment of ৳${formatBDT(amt)} successfully recorded!`);

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
                  paymentMethod: collectMethod,
                  remarks: collectRemarks || null,
                },
                ...s.customerPayments,
              ],
            };
          }
          return s;
        })
      );

      setTimeout(() => {
        setCollectModalSale(null);
        setCollectSuccess(null);
      }, 1500);
    } catch (err: any) {
      setCollectError(err.message || "Failed to collect payment.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Open Collect Modal
  const openCollect = (sale: SaleDirectoryItem) => {
    setCollectModalSale(sale);
    setCollectAmount(sale.currentDueAmount.toString());
    setCollectError(null);
    setCollectSuccess(null);
    setCollectRemarks("");
  };

  // Dynamic Metrics
  const metrics = useMemo(() => {
    const totalGrossRevenue = salesList.reduce((acc, s) => acc + s.totalAgreedPrice, 0);
    const totalOutstandingDues = salesList.reduce((acc, s) => acc + s.currentDueAmount, 0);
    const totalRealizedRevenue = totalGrossRevenue - totalOutstandingDues;
    const fullySettledCount = salesList.filter((s) => s.currentDueAmount <= 0).length;
    const bookedCount = salesList.filter((s) => s.status === "BOOKED").length;
    const partialCount = salesList.filter((s) => s.status === "PARTIAL").length;
    const realizedPercent = totalGrossRevenue > 0 ? Math.round((totalRealizedRevenue / totalGrossRevenue) * 100) : 0;

    return {
      totalGrossRevenue,
      totalRealizedRevenue,
      totalOutstandingDues,
      totalSalesCount: salesList.length,
      fullySettledCount,
      partialCount,
      bookedCount,
      realizedPercent,
    };
  }, [salesList]);

  // Filtered & Sorted Sales
  const filteredSales = useMemo(() => {
    let result = salesList.filter((s) => {
      // Status tab
      if (activeStatusTab !== "ALL" && s.status !== activeStatusTab) return false;

      // Project filter
      if (selectedProjectId !== "ALL" && s.project?.id !== selectedProjectId) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = s.buyerName.toLowerCase().includes(q);
        const phoneMatch = s.buyerPhone.toLowerCase().includes(q);
        const plotMatch = s.plot?.plotNumber.toLowerCase().includes(q) ?? false;
        const projMatch = s.project?.projectName.toLowerCase().includes(q) ?? false;
        if (!nameMatch && !phoneMatch && !plotMatch && !projMatch) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sortBy === "TOTAL_DESC") return b.totalAgreedPrice - a.totalAgreedPrice;
      if (sortBy === "DUE_DESC") return b.currentDueAmount - a.currentDueAmount;
      if (sortBy === "BUYER_ASC") return a.buyerName.localeCompare(b.buyerName);
      return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime();
    });

    return result;
  }, [salesList, activeStatusTab, selectedProjectId, searchQuery, sortBy]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Sale ID", "Date", "Buyer Name", "Phone", "Project", "Plot", "Total Price", "Paid", "Due", "Status"];
    const rows = filteredSales.map((s) => [
      s.id.slice(0, 8),
      new Date(s.saleDate).toLocaleDateString("en-GB"),
      `"${s.buyerName.replace(/"/g, '""')}"`,
      `"${s.buyerPhone}"`,
      `"${s.project?.projectName || "-"}"`,
      `"${s.plot?.plotNumber || "Whole Project"}"`,
      s.totalAgreedPrice,
      s.totalPaid,
      s.currentDueAmount,
      s.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `landinvest-sales-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Switcher Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-fit text-xs font-semibold mb-2">
            <span className="px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm">
              Plot Sales
            </span>
            <Link
              href="/sales/bookings"
              className="px-3 py-1 rounded-md text-slate-600 hover:text-slate-900 transition"
            >
              Bookings
            </Link>
            <Link
              href="/sales/dues"
              className="px-3 py-1 rounded-md text-slate-600 hover:text-slate-900 transition"
            >
              Dues & Installments
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Plot Sales Master Directory</h1>
          <p className="text-sm text-slate-500">
            Comprehensive sales ledger, inventory reservation, buyer accounts, and revenue reconciliation.
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

          {data.canCreate && (
            <button
              onClick={() => {
                setIsNewSaleOpen(true);
                setSaleError(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              + Record New Sale
            </button>
          )}
        </div>
      </div>

      {/* Financial Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Sales Revenue */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Gross Sales Revenue</span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">৳{formatBDT(metrics.totalGrossRevenue)}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{metrics.totalSalesCount} Deals Closed</span>
              <span>• Total contractual volume</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Realized Collections */}
        <div className="p-5 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">Realized Revenue</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">৳{formatBDT(metrics.totalRealizedRevenue)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.realizedPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-700">{metrics.realizedPercent}%</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Outstanding Receivables */}
        <div className="p-5 rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/60 via-white to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase">Outstanding Dues</span>
            <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">৳{formatBDT(metrics.totalOutstandingDues)}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <Link href="/sales/dues" className="font-semibold text-rose-700 hover:underline flex items-center gap-1">
                View Dues Ledger <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* KPI 4: Deal Fulfillment Status */}
        <div className="p-5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase">Fulfillment Status</span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-center">
              <p className="text-base font-bold text-emerald-700">{metrics.fullySettledCount}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Settled</p>
            </div>
            <div className="text-center border-x border-slate-200 px-3">
              <p className="text-base font-bold text-blue-700">{metrics.partialCount}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-amber-700">{metrics.bookedCount}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveStatusTab("ALL")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeStatusTab === "ALL"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Sales ({salesList.length})
            </button>
            <button
              onClick={() => setActiveStatusTab("PAID_IN_FULL")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeStatusTab === "PAID_IN_FULL"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fully Settled ({metrics.fullySettledCount})
            </button>
            <button
              onClick={() => setActiveStatusTab("PARTIAL")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeStatusTab === "PARTIAL"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              In Installments ({metrics.partialCount})
            </button>
            <button
              onClick={() => setActiveStatusTab("BOOKED")}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                activeStatusTab === "BOOKED"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Advance Only ({metrics.bookedCount})
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
              <option value="RECENT">Recent First</option>
              <option value="TOTAL_DESC">Highest Price</option>
              <option value="DUE_DESC">Highest Due</option>
              <option value="BUYER_ASC">Buyer Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search Bar & Project Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by buyer name, phone, plot number, project..."
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
              <option value="ALL">All Projects ({data.projects.length})</option>
              {data.projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.projectName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Sales Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Buyer & Contact</th>
                <th className="py-3 px-4">Project & Plot</th>
                <th className="py-3 px-4 text-right">Agreed Value</th>
                <th className="py-3 px-4">Payment Progress</th>
                <th className="py-3 px-4 text-right">Due Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-600">No sales recorded</p>
                      <p className="text-xs text-slate-400">
                        No sales match your current search criteria. Click "+ Record New Sale" to register a deal.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition">
                    {/* Buyer */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sale.buyerName}</div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{sale.buyerPhone}</span>
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

                    {/* Payment Progress */}
                    <td className="py-3 px-4">
                      <div className="w-44 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-bold">৳{formatBDT(sale.totalPaid)}</span>
                          <span className="text-slate-400 font-medium">{sale.paidPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              sale.currentDueAmount <= 0 ? "bg-emerald-500" : "bg-brand-600"
                            }`}
                            style={{ width: `${sale.paidPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Due Balance */}
                    <td className="py-3 px-4 text-right">
                      {sale.currentDueAmount > 0 ? (
                        <div className="font-bold text-rose-700">৳{formatBDT(sale.currentDueAmount)}</div>
                      ) : (
                        <div className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <Check className="w-3.5 h-3.5" />
                          <span>Nil</span>
                        </div>
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
                            onClick={() => openCollect(sale)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                            title="Quick Collect Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Collect</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setDossierSale(sale);
                            setDossierTab("SCHEDULE");
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

      {/* Record New Sale Modal */}
      {isNewSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record New Plot Sale</h3>
                  <p className="text-xs text-slate-500">Sell an available plot or complete land project</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewSaleOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateSale} className="p-6 overflow-y-auto space-y-4 flex-1">
              {saleError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{saleError}</span>
                </div>
              )}

              {/* Project & Plot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Project <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formProjectId}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {data.projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Plot <span className="text-slate-400 font-normal">(Leave empty for whole project)</span>
                  </label>
                  <select
                    value={formPlotId}
                    onChange={(e) => handlePlotSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Whole Project / Unassigned</option>
                    {availablePlots.map((plot) => (
                      <option key={plot.id} value={plot.id}>
                        Plot #{plot.plotNumber} — {plot.plotSizeShotok} shotok (৳{formatBDT(plot.askingPrice)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buyer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Buyer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formBuyerName}
                    onChange={(e) => setFormBuyerName(e.target.value)}
                    placeholder="e.g. Rafiqul Islam"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formBuyerPhone}
                    onChange={(e) => setFormBuyerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NID (Optional)</label>
                  <input
                    type="text"
                    value={formBuyerNid}
                    onChange={(e) => setFormBuyerNid(e.target.value)}
                    placeholder="National ID"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Pricing & Installments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Agreed Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={formTotalPrice}
                    onChange={(e) => setFormTotalPrice(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Advance Payment (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formAdvance}
                    onChange={(e) => setFormAdvance(e.target.value)}
                    placeholder="e.g. 300000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Installment Count
                  </label>
                  <select
                    value={formInstallmentsCount}
                    onChange={(e) => setFormInstallmentsCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="0">Full Payment (No Installments)</option>
                    <option value="3">3 Monthly Installments</option>
                    <option value="6">6 Monthly Installments</option>
                    <option value="12">12 Monthly Installments</option>
                    <option value="24">24 Monthly Installments</option>
                    <option value="36">36 Monthly Installments</option>
                  </select>
                </div>
              </div>

              {/* Payment Method & Bank */}
              {parseFloat(formAdvance) > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Advance Payment Method</label>
                    <select
                      value={formPaymentMethod}
                      onChange={(e) => setFormPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="CASH">Cash in Hand</option>
                      <option value="BANK">Bank Account / Transfer</option>
                    </select>
                  </div>

                  {formPaymentMethod === "BANK" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Deposit Bank <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formBankAccountId}
                        onChange={(e) => setFormBankAccountId(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {data.banks.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.bankName} - {b.accountNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Real-time Calculation Summary */}
              {formTotalPrice && parseFloat(formTotalPrice) > 0 && (
                <div className="p-3.5 bg-brand-50/70 border border-brand-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-600">Remaining Balance:</span>
                    <span className="font-extrabold text-rose-700 ml-2">
                      ৳{formatBDT(Math.max(0, parseFloat(formTotalPrice) - (parseFloat(formAdvance) || 0)))}
                    </span>
                  </div>
                  {parseInt(formInstallmentsCount, 10) > 0 && (
                    <div>
                      <span className="text-slate-600">Approx. Per Month:</span>
                      <span className="font-bold text-slate-900 ml-2">
                        ৳
                        {formatBDT(
                          Math.round(
                            Math.max(0, parseFloat(formTotalPrice) - (parseFloat(formAdvance) || 0)) /
                              parseInt(formInstallmentsCount, 10)
                          )
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewSaleOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSale}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmittingSale ? "Recording..." : "Confirm & Record Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {collectModalSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Collect Due Payment</h3>
                  <p className="text-xs text-slate-500">Record buyer payment against outstanding balance</p>
                </div>
              </div>
              <button
                onClick={() => setCollectModalSale(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickCollect} className="p-6 space-y-4">
              {collectError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{collectError}</span>
                </div>
              )}

              {collectSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{collectSuccess}</span>
                </div>
              )}

              {/* Deal Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Buyer:</span>
                  <span className="font-bold text-slate-900">{collectModalSale.buyerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Project:</span>
                  <span className="font-semibold text-slate-800">{collectModalSale.project?.projectName}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Outstanding Balance:</span>
                  <span className="font-extrabold text-rose-700 text-sm">
                    ৳{formatBDT(collectModalSale.currentDueAmount)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collection Amount (৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    min="1"
                    max={collectModalSale.currentDueAmount}
                    step="0.01"
                    required
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method & Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={collectMethod}
                    onChange={(e) => setCollectMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CASH">Cash in Hand</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="MFS">MFS (bKash/Nagad)</option>
                  </select>
                </div>

                {collectMethod !== "CASH" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Deposit Bank</label>
                    <select
                      value={collectBankId}
                      onChange={(e) => setCollectBankId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {data.banks.map((b) => (
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks (Optional)</label>
                <input
                  type="text"
                  value={collectRemarks}
                  onChange={(e) => setCollectRemarks(e.target.value)}
                  placeholder="e.g. Received via Sonali Bank deposit"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Actions */}
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
                  {isSubmittingPayment ? "Processing..." : "Confirm Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dossier & Schedule Modal */}
      {dossierSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">{dossierSale.buyerName} — Sale Dossier</h3>
                <p className="text-xs text-slate-500">
                  {dossierSale.project?.projectName} (
                  {dossierSale.plot ? `Plot #${dossierSale.plot.plotNumber}` : "Entire Project"})
                </p>
              </div>
              <button
                onClick={() => setDossierSale(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setDossierTab("SCHEDULE")}
                className={`pb-2 border-b-2 transition ${
                  dossierTab === "SCHEDULE"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Installment Schedule ({dossierSale.schedules.length})
              </button>
              <button
                onClick={() => setDossierTab("PAYMENTS")}
                className={`pb-2 border-b-2 transition ${
                  dossierTab === "PAYMENTS"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Collection Receipts ({dossierSale.customerPayments.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {dossierTab === "SCHEDULE" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-center">
                    <div>
                      <p className="text-[11px] text-slate-400">Total Price</p>
                      <p className="text-sm font-bold text-slate-800">৳{formatBDT(dossierSale.totalAgreedPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Paid Amount</p>
                      <p className="text-sm font-bold text-emerald-700">৳{formatBDT(dossierSale.totalPaid)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Remaining Due</p>
                      <p className="text-sm font-bold text-rose-700">৳{formatBDT(dossierSale.currentDueAmount)}</p>
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
                      {dossierSale.schedules.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400">
                            No installment schedule found (settled upfront or ungenerated).
                          </td>
                        </tr>
                      ) : (
                        dossierSale.schedules.map((inst, idx) => (
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-3">
                  {dossierSale.customerPayments.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-400">
                      No payment receipts recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {dossierSale.customerPayments.map((pay) => (
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
                              href={`/api/sales/${dossierSale.id}/receipt`}
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
                Sale ID: <code className="text-slate-700">{dossierSale.id.slice(0, 8)}</code>
              </span>
              <button
                onClick={() => setDossierSale(null)}
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
