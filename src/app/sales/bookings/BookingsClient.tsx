"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookmarkCheck,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  Building2,
  Wallet,
  Eye,
  X,
  Layers,
  ChevronRight,
  Download,
  Receipt,
  User,
  Phone,
  CreditCard,
  Calendar,
  AlertCircle,
  FileCheck,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";
import { useLang } from "@/lib/i18n";

export interface PlotItem {
  id: string;
  plotNumber: string;
  plotSizeShotok: number;
  askingPrice: number;
  status: string;
}

export interface ProjectData {
  id: string;
  projectName: string;
  mouza: string;
  totalAreaShotok: number;
  status: string;
  totalPlotsCount: number;
  plots: PlotItem[];
}

export interface BookingItem {
  id: string;
  projectId: string;
  projectName: string;
  mouza: string | null;
  plotId: string | null;
  plotNumber: string;
  plotSizeShotok: number | null;
  buyerName: string;
  buyerPhone: string;
  buyerNid: string | null;
  saleDate: string;
  totalAgreedPrice: number;
  advanceBookingAmount: number;
  currentDueAmount: number;
  status: string;
  paymentsCount: number;
  installmentsCount: number;
  latestReceiptNo: string | null;
  installmentSchedules: {
    id: string;
    dueDate: string;
    dueAmount: number;
    status: string;
  }[];
}

export interface BookingsPageData {
  projects: ProjectData[];
  bookings: BookingItem[];
  banks: { id: string; bankName: string; accountNumber: string }[];
  canCreate: boolean;
  canCollect: boolean;
}

export default function BookingsClient({ data }: { data: BookingsPageData }) {
  const { t } = useLang();
  const router = useRouter();
  const { projects, bookings: initialBookings, banks, canCreate, canCollect } = data;

  const [bookingsList, setBookingsList] = useState<BookingItem[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDossierBooking, setActiveDossierBooking] = useState<BookingItem | null>(null);
  const [activePayBooking, setActivePayBooking] = useState<BookingItem | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("CASH");
  const [payBankId, setPayBankId] = useState("");
  const [payBusy, setPayBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State for New Booking
  const [formProjectId, setFormProjectId] = useState<string>(projects[0]?.id || "");
  const [bookingScope, setBookingScope] = useState<"MULTI_PLOT" | "WHOLE_PROJECT">("MULTI_PLOT");
  const [selectedPlotIds, setSelectedPlotIds] = useState<string[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerNid, setBuyerNid] = useState("");
  const [agreedPrice, setAgreedPrice] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [installmentsCount, setInstallmentsCount] = useState("6");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [bankAccountId, setBankAccountId] = useState("");
  const [createBusy, setCreateBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setBookingsList(initialBookings);
  }, [initialBookings]);

  // Escape key handler for modals
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowCreateModal(false);
        setActiveDossierBooking(null);
        setActivePayBooking(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const currentProject = useMemo(
    () => projects.find((p) => p.id === formProjectId) || projects[0],
    [projects, formProjectId]
  );

  const availablePlotsInCurrent = useMemo(
    () => currentProject?.plots.filter((p) => p.status === "AVAILABLE") || [],
    [currentProject]
  );

  // Auto calculate agreed price when selected plots change
  useEffect(() => {
    if (bookingScope === "WHOLE_PROJECT") {
      const sum = availablePlotsInCurrent.reduce((s, p) => s + p.askingPrice, 0);
      setAgreedPrice(String(sum || 0));
    } else {
      const sum = availablePlotsInCurrent
        .filter((p) => selectedPlotIds.includes(p.id))
        .reduce((s, p) => s + p.askingPrice, 0);
      if (sum > 0) {
        setAgreedPrice(String(sum));
      }
    }
  }, [bookingScope, selectedPlotIds, availablePlotsInCurrent]);

  const togglePlotSelection = (plotId: string) => {
    setSelectedPlotIds((prev) =>
      prev.includes(plotId) ? prev.filter((id) => id !== plotId) : [...prev, plotId]
    );
  };

  const selectAllPlots = () => {
    if (selectedPlotIds.length === availablePlotsInCurrent.length) {
      setSelectedPlotIds([]);
    } else {
      setSelectedPlotIds(availablePlotsInCurrent.map((p) => p.id));
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookingsList.filter((b) => {
      if (selectedProjectFilter !== "ALL" && b.projectId !== selectedProjectFilter) return false;
      if (selectedStatusFilter !== "ALL" && b.status !== selectedStatusFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchBuyer = b.buyerName.toLowerCase().includes(q);
        const matchPhone = b.buyerPhone.toLowerCase().includes(q);
        const matchPlot = b.plotNumber.toLowerCase().includes(q);
        const matchProject = b.projectName.toLowerCase().includes(q);
        const matchNid = b.buyerNid?.toLowerCase().includes(q);
        if (!matchBuyer && !matchPhone && !matchPlot && !matchProject && !matchNid) {
          return false;
        }
      }
      return true;
    });
  }, [bookingsList, selectedProjectFilter, selectedStatusFilter, search]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalBookings = bookingsList.length;
    const totalValue = bookingsList.reduce((s, b) => s + b.totalAgreedPrice, 0);
    const totalAdvance = bookingsList.reduce((s, b) => s + b.advanceBookingAmount, 0);
    const totalDue = bookingsList.reduce((s, b) => s + b.currentDueAmount, 0);
    return { totalBookings, totalValue, totalAdvance, totalDue };
  }, [bookingsList]);

  // Handle Create Booking
  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!formProjectId) {
      setFormError("Please select a land project");
      return;
    }

    if (bookingScope === "MULTI_PLOT" && selectedPlotIds.length === 0) {
      setFormError("Please select at least one plot to book");
      return;
    }

    const priceNum = parseFloat(agreedPrice);
    if (!priceNum || priceNum <= 0) {
      setFormError("Agreed booking price must be greater than 0");
      return;
    }

    const advNum = parseFloat(advanceAmount) || 0;
    if (advNum > priceNum) {
      setFormError("Advance booking amount cannot exceed total agreed price");
      return;
    }

    setCreateBusy(true);
    setFormError(null);

    try {
      const payload: any = {
        project_id: formProjectId,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_nid: buyerNid || null,
        total_agreed_price: priceNum,
        advance: advNum,
        installments_count: parseInt(installmentsCount, 10) || 0,
        payment_method: paymentMethod,
        bank_account: paymentMethod === "BANK" ? bankAccountId : null,
      };

      if (bookingScope === "WHOLE_PROJECT") {
        payload.is_whole_project = true;
      } else {
        payload.plot_ids = selectedPlotIds;
        payload.plot_id = selectedPlotIds[0] || null;
      }

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to create booking");
      }

      setShowCreateModal(false);
      setToast("Plot booking created successfully!");
      // Reset form
      setBuyerName("");
      setBuyerPhone("");
      setBuyerNid("");
      setAdvanceAmount("");
      setSelectedPlotIds([]);
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to submit booking");
    } finally {
      setCreateBusy(false);
    }
  }

  // Handle Quick Payment Collection
  async function handleCollectPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!activePayBooking) return;
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }
    if (amt > activePayBooking.currentDueAmount) {
      alert(`Amount cannot exceed outstanding due of ${formatBDT(activePayBooking.currentDueAmount)}`);
      return;
    }

    setPayBusy(true);
    try {
      const res = await fetch(`/api/sales/${activePayBooking.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          payment_method: payMethod,
          bank_account: payMethod === "BANK" ? payBankId : null,
        }),
      });

      if (res.ok) {
        setToast("Payment collected and credited to treasury!");
        setActivePayBooking(null);
        setPayAmount("");
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Payment collection failed");
      }
    } finally {
      setPayBusy(false);
    }
  }

  // Export CSV
  function exportCSV() {
    const headers = [
      "Booking ID",
      "Date",
      "Buyer Name",
      "Phone",
      "Project",
      "Plot Number",
      "Total Agreed Price",
      "Advance Paid",
      "Outstanding Due",
      "Status",
    ];
    const rows = filteredBookings.map((b) => [
      `"${b.id}"`,
      `"${b.saleDate}"`,
      `"${b.buyerName.replace(/"/g, '""')}"`,
      `"${b.buyerPhone}"`,
      `"${b.projectName.replace(/"/g, '""')}"`,
      `"${b.plotNumber}"`,
      b.totalAgreedPrice,
      b.advanceBookingAmount,
      b.currentDueAmount,
      `"${b.status}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bookings_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
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

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Land & Plot Reservation Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Plot Sales & Bookings</h1>
          <p className="text-sm text-slate-300 mt-1">
            Reserve individual plots, multi-select plot clusters, or entire land projects with advance tokens and flexible installments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            href="/sales/dues"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-[0.98]"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Dues & Installments</span>
          </Link>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Deals Booked
            </span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            {metrics.totalBookings} Deals
          </p>
          <p className="text-xs text-slate-500 mt-1.5">Across all syndicate projects</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Booked Value
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            {formatBDT(metrics.totalValue)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">Gross property contract value</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Token Advance Received
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2 tracking-tight">
            {formatBDT(metrics.totalAdvance)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">Directly credited to treasury cash/bank</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Receivables / Due
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2 tracking-tight">
            {formatBDT(metrics.totalDue)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">Scheduled for installment collection</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by buyer name, phone, plot number, project..."
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
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-brand-600"
          >
            <option value="ALL">All Land Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} {p.mouza ? `(${p.mouza})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-brand-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="BOOKED">BOOKED</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="PAID_IN_FULL">PAID IN FULL</option>
          </select>
        </div>

        {(search || selectedProjectFilter !== "ALL" || selectedStatusFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedProjectFilter("ALL");
              setSelectedStatusFilter("ALL");
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-100 transition whitespace-nowrap active:scale-[0.98]"
          >
            Reset
          </button>
        )}
      </div>

      {/* Bookings Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Buyer Information</th>
                <th className="px-5 py-3.5">Land Project</th>
                <th className="px-5 py-3.5">Reserved Plot(s)</th>
                <th className="px-5 py-3.5 text-right">Agreed Price</th>
                <th className="px-5 py-3.5 text-right">Advance Paid</th>
                <th className="px-5 py-3.5 text-right">Outstanding Due</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <BookmarkCheck className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">No bookings found</p>
                      <p className="text-[11px] text-slate-400">
                        No property booking records match your current filter selection.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition group">
                    <td className="px-5 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                      {formatDate(b.saleDate)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{b.buyerName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {b.buyerPhone}
                        </span>
                        {b.buyerNid && <span>• NID: {b.buyerNid}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{b.projectName}</p>
                      {b.mouza && <span className="text-[10px] text-slate-400">{b.mouza}</span>}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {!b.plotId ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Building2 className="w-3 h-3" /> Entire Land Project
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {b.plotNumber} {b.plotSizeShotok ? `(${b.plotSizeShotok} Shotok)` : ""}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatBDT(b.totalAgreedPrice)}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <span className="font-bold text-emerald-600">{formatBDT(b.advanceBookingAmount)}</span>
                      {b.totalAgreedPrice > 0 && (
                        <span className="block text-[10px] text-slate-400">
                          {Math.round((b.advanceBookingAmount / b.totalAgreedPrice) * 100)}% token
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <span
                        className={`font-bold ${
                          b.currentDueAmount > 0 ? "text-amber-600" : "text-slate-400"
                        }`}
                      >
                        {formatBDT(b.currentDueAmount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "PAID_IN_FULL"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "PARTIAL"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveDossierBooking(b)}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition"
                          title="View Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {canCollect && b.currentDueAmount > 0 && (
                          <button
                            onClick={() => {
                              setActivePayBooking(b);
                              setPayAmount(
                                b.installmentSchedules[0]?.dueAmount
                                  ? String(b.installmentSchedules[0].dueAmount)
                                  : String(Math.min(b.currentDueAmount, 50000))
                              );
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition active:scale-[0.98]"
                          >
                            Collect
                          </button>
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

      {/* Booking Dossier Modal */}
      {activeDossierBooking && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveDossierBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Booking Deal Dossier</h3>
              </div>
              <button
                onClick={() => setActiveDossierBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <p className="text-slate-500">Total Agreed Contract</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatBDT(activeDossierBooking.totalAgreedPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">Outstanding Due</p>
                  <p className="text-xl font-bold text-amber-600">
                    {formatBDT(activeDossierBooking.currentDueAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-400 font-medium">Buyer Name</p>
                  <p className="text-slate-900 font-bold mt-0.5">{activeDossierBooking.buyerName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Contact Phone</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeDossierBooking.buyerPhone}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Land Project</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeDossierBooking.projectName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Plot Number</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeDossierBooking.plotNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Booking Date</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{formatDate(activeDossierBooking.saleDate)}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Status</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mt-0.5">
                    {activeDossierBooking.status}
                  </span>
                </div>
              </div>

              {activeDossierBooking.installmentSchedules.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="font-semibold text-slate-700 mb-2">
                    Installment Schedule ({activeDossierBooking.installmentSchedules.length} installments)
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-100 rounded-lg p-2 bg-slate-50">
                    {activeDossierBooking.installmentSchedules.map((ins, i) => (
                      <div
                        key={ins.id}
                        className="flex items-center justify-between text-[11px] p-1.5 rounded bg-white border border-slate-200/60"
                      >
                        <span className="text-slate-600">
                          Installment #{i + 1} — {formatDate(ins.dueDate)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{formatBDT(ins.dueAmount)}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                              ins.status === "PAID"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ins.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`/api/sales/${activeDossierBooking.id}/receipt`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Download Booking PDF Receipt
              </a>
              <button
                type="button"
                onClick={() => setActiveDossierBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition active:scale-[0.98]"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {activePayBooking && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePayBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Collect Installment / Due</h3>
              </div>
              <button
                onClick={() => setActivePayBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectPayment} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 text-xs">
                <p className="text-slate-500">Buyer: <strong className="text-slate-800">{activePayBooking.buyerName}</strong></p>
                <p className="text-slate-500">Plot: <strong className="text-slate-800">{activePayBooking.plotNumber}</strong> ({activePayBooking.projectName})</p>
                <p className="text-amber-700 font-semibold">
                  Outstanding Due: {formatBDT(activePayBooking.currentDueAmount)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collection Amount (BDT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  max={activePayBooking.currentDueAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-sm font-bold border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                >
                  <option value="CASH">CASH (Treasury Cash Drawer)</option>
                  <option value="BANK">BANK (Commercial Bank Account)</option>
                </select>
              </div>

              {payMethod === "BANK" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Bank Account *
                  </label>
                  <select
                    value={payBankId}
                    onChange={(e) => setPayBankId(e.target.value)}
                    required
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
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActivePayBooking(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cancel (Esc)
                </button>
                <button
                  type="submit"
                  disabled={payBusy}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-2"
                >
                  {payBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Collection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Booking Modal with Multi-Select and Whole Project Support */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">New Plot & Project Booking</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Project Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Land Project *
                </label>
                <select
                  value={formProjectId}
                  onChange={(e) => {
                    setFormProjectId(e.target.value);
                    setSelectedPlotIds([]);
                  }}
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectName} {p.mouza ? `(${p.mouza})` : ""} — {p.plots.filter((pl) => pl.status === "AVAILABLE").length} Available Plots
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Scope Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Booking Scope *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer text-xs transition flex items-center gap-2 ${
                      bookingScope === "MULTI_PLOT"
                        ? "border-brand-600 bg-brand-50/50 text-brand-900 font-semibold ring-1 ring-brand-500"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="booking_scope"
                      checked={bookingScope === "MULTI_PLOT"}
                      onChange={() => setBookingScope("MULTI_PLOT")}
                      className="text-brand-600"
                    />
                    <span>Select Plots (Multi-Select)</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer text-xs transition flex items-center gap-2 ${
                      bookingScope === "WHOLE_PROJECT"
                        ? "border-purple-600 bg-purple-50/50 text-purple-900 font-semibold ring-1 ring-purple-500"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="booking_scope"
                      checked={bookingScope === "WHOLE_PROJECT"}
                      onChange={() => setBookingScope("WHOLE_PROJECT")}
                      className="text-purple-600"
                    />
                    <span>Book Entire Land Project</span>
                  </label>
                </div>
              </div>

              {/* Multi-Plot Selection Grid */}
              {bookingScope === "MULTI_PLOT" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Choose Plots to Include in this Deal ({availablePlotsInCurrent.length} available):
                    </span>
                    {availablePlotsInCurrent.length > 0 && (
                      <button
                        type="button"
                        onClick={selectAllPlots}
                        className="text-brand-600 hover:underline font-semibold text-[11px]"
                      >
                        {selectedPlotIds.length === availablePlotsInCurrent.length
                          ? "Deselect All"
                          : "Select All Plots"}
                      </button>
                    )}
                  </div>

                  {availablePlotsInCurrent.length === 0 ? (
                    <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      No plots currently available in this project. All plots have been booked or sold.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                      {availablePlotsInCurrent.map((pl) => {
                        const isSelected = selectedPlotIds.includes(pl.id);
                        return (
                          <div
                            key={pl.id}
                            onClick={() => togglePlotSelection(pl.id)}
                            className={`p-2.5 rounded-lg border cursor-pointer transition text-xs select-none ${
                              isSelected
                                ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                                : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold">{pl.plotNumber}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {pl.plotSizeShotok} Shotok
                              </span>
                            </div>
                            <p className="mt-1 font-semibold text-[11px]">
                              {formatBDT(pl.askingPrice)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedPlotIds.length > 0 && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
                      <span>
                        Selected: <strong>{selectedPlotIds.length} Plot(s)</strong>
                      </span>
                      <span>
                        Total Asking: <strong>{formatBDT(parseFloat(agreedPrice) || 0)}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Entire Project Notice */}
              {bookingScope === "WHOLE_PROJECT" && (
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-700" />
                    <span>Entire Land Project Acquisition</span>
                  </p>
                  <p className="text-purple-700 text-[11px]">
                    This contract will reserve the entire land parcel ({currentProject?.totalAreaShotok} Shotok) and lock all {availablePlotsInCurrent.length} available plots under this buyer contract.
                  </p>
                </div>
              )}

              {/* Financial Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Agreed Contract Price (BDT) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Advance Token / Bayna (BDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 text-emerald-600 focus:outline-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Remaining Balance Due
                  </label>
                  <div className="w-full text-xs font-bold border border-slate-200 bg-slate-50 text-amber-700 rounded-lg px-3 py-2">
                    {formatBDT(
                      Math.max(0, (parseFloat(agreedPrice) || 0) - (parseFloat(advanceAmount) || 0))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Installment Count (Months)
                  </label>
                  <select
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                  >
                    <option value="0">Full Payment (No Installments)</option>
                    <option value="3">3 Months Installment Plan</option>
                    <option value="6">6 Months Installment Plan</option>
                    <option value="12">12 Months (1 Year) Plan</option>
                    <option value="24">24 Months (2 Years) Plan</option>
                    <option value="36">36 Months (3 Years) Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Advance Payment Channel
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-brand-600"
                  >
                    <option value="CASH">CASH in Hand (Treasury)</option>
                    <option value="BANK">Commercial Bank Transfer</option>
                  </select>
                </div>

                {paymentMethod === "BANK" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Bank Account *
                    </label>
                    <select
                      value={bankAccountId}
                      onChange={(e) => setBankAccountId(e.target.value)}
                      required
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
                )}
              </div>

              {/* Buyer Contact Information */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Buyer Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Al-Amin Chowdhury"
                      className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      National ID (NID)
                    </label>
                    <input
                      value={buyerNid}
                      onChange={(e) => setBuyerNid(e.target.value)}
                      placeholder="NID or Passport number"
                      className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-brand-600"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
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
                  {createBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirm Booking & Reserve</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
