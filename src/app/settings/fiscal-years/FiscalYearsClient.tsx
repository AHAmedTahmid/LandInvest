"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import type { FiscalYearEntry } from "@/lib/fiscalYear";
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  Lock,
  Unlock,
  Trash2,
  Sparkles,
  AlertTriangle,
  Calendar,
  ArrowRight,
  X,
} from "lucide-react";

interface InitialData {
  fiscalYears: FiscalYearEntry[];
  currentFiscalYear: FiscalYearEntry;
}

export default function FiscalYearsClient({ initialData }: { initialData: InitialData }) {
  const { lang } = useLang();
  const [fiscalYears, setFiscalYears] = useState<FiscalYearEntry[]>(initialData.fiscalYears);
  const [currentFY, setCurrentFY] = useState<FiscalYearEntry>(initialData.currentFiscalYear);

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [labelBn, setLabelBn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [setAsCurrent, setSetAsCurrent] = useState(true);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notifyShell = () => {
    try {
      window.dispatchEvent(new Event("fy-updated"));
    } catch {
      // ignore
    }
  };

  const applyPreset = (type: "BD_FY" | "CALENDAR", baseYear: number) => {
    if (type === "BD_FY") {
      setLabel(`FY ${baseYear}-${baseYear + 1}`);
      setLabelBn(`অর্থবছর ${baseYear}-${baseYear + 1}`);
      setStartDate(`${baseYear}-07-01`);
      setEndDate(`${baseYear + 1}-06-30`);
      setNotes("Standard Bangladesh Fiscal Year (Jul – Jun)");
    } else {
      setLabel(`FY ${baseYear}`);
      setLabelBn(`অর্থবছর ${baseYear}`);
      setStartDate(`${baseYear}-01-01`);
      setEndDate(`${baseYear}-12-31`);
      setNotes("Calendar Fiscal Year (Jan – Dec)");
    }
  };

  const openAddModal = () => {
    const nextYear = new Date().getFullYear() + 1;
    applyPreset("BD_FY", nextYear);
    setSetAsCurrent(false);
    setError(null);
    setIsAddOpen(true);
  };

  const handleAddFY = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/settings/fiscal-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE",
          label,
          labelBn: labelBn || undefined,
          startDate,
          endDate,
          setAsCurrent,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add fiscal year.");

      setFiscalYears(data.fiscalYears);
      setCurrentFY(data.currentFiscalYear);
      setIsAddOpen(false);
      setToast(
        setAsCurrent
          ? `"${label}" added and activated as Current Fiscal Year.`
          : `"${label}" added to Fiscal Years.`
      );
      notifyShell();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetCurrent = async (fy: FiscalYearEntry) => {
    if (fy.isCurrent) return;
    setBusyId(fy.id);
    setError(null);
    try {
      const res = await fetch("/api/settings/fiscal-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SET_CURRENT", id: fy.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set current fiscal year.");

      setFiscalYears(data.fiscalYears);
      setCurrentFY(data.currentFiscalYear);
      setToast(`Active Fiscal Year switched to ${fy.label}.`);
      notifyShell();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStatus = async (fy: FiscalYearEntry) => {
    const nextStatus = fy.status === "ACTIVE" ? "CLOSED" : "ACTIVE";
    setBusyId(fy.id);
    setError(null);
    try {
      const res = await fetch("/api/settings/fiscal-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_STATUS", id: fy.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");

      setFiscalYears(data.fiscalYears);
      setCurrentFY(data.currentFiscalYear);
      setToast(`${fy.label} marked as ${nextStatus}.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (fy: FiscalYearEntry) => {
    if (fy.isCurrent) return;
    setBusyId(fy.id);
    setError(null);
    try {
      const res = await fetch("/api/settings/fiscal-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", id: fy.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete fiscal year.");

      setFiscalYears(data.fiscalYears);
      setCurrentFY(data.currentFiscalYear);
      setToast(`Removed ${fy.label}.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const currentYearNum = new Date().getFullYear();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-sm">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {lang === "bn" ? "অর্থবছর (FY) ব্যবস্থাপনা" : "Fiscal Year (FY) Management"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "bn"
                ? "নতুন অর্থবছর যোগ করুন এবং বর্তমান সক্রিয় অর্থবছর নির্ধারণ করুন"
                : "Configure accounting periods, create new fiscal years, and set the active organization FY"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "bn" ? "নতুন অর্থবছর যোগ করুন" : "Add Fiscal Year"}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Current FY Hero Card */}
      {currentFY && (
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white rounded-2xl p-6 shadow-md border border-brand-700/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {lang === "bn" ? "বর্তমান সক্রিয় অর্থবছর" : "Current Active Fiscal Year"}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {lang === "bn" && currentFY.labelBn ? currentFY.labelBn : currentFY.label}
              </h2>
              <p className="text-xs text-white/80 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {formatDate(currentFY.startDate)} — {formatDate(currentFY.endDate)}
                </span>
                {currentFY.notes && <span className="text-white/60">· {currentFY.notes}</span>}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3 backdrop-blur-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                  {lang === "bn" ? "মোট সংরক্ষিত অর্থবছর" : "Configured Years"}
                </p>
                <p className="text-xl font-bold">{fiscalYears.length}</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                  {lang === "bn" ? "অবস্থা" : "Period Status"}
                </p>
                <p className="text-sm font-bold text-emerald-300">{currentFY.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fiscal Years Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            {lang === "bn" ? "সকল অর্থবছরের তালিকা" : "All Fiscal Years"}
          </h3>
          <span className="text-xs text-slate-500">
            {lang === "bn" ? "যেকোনো অর্থবছরকে বর্তমান হিসেবে সেট করুন" : "Select any period below to set it as current"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Fiscal Year</th>
                <th className="py-3 px-4">Period Range</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {fiscalYears.map((fy) => {
                const isBusy = busyId === fy.id;
                return (
                  <tr
                    key={fy.id}
                    className={`transition ${
                      fy.isCurrent ? "bg-emerald-50/35" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-slate-900">
                          {lang === "bn" && fy.labelBn ? fy.labelBn : fy.label}
                        </span>
                        {fy.isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            CURRENT
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      <span>{formatDate(fy.startDate)}</span>
                      <ArrowRight className="w-3 h-3 inline mx-1.5 text-slate-400" />
                      <span>{formatDate(fy.endDate)}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          fy.status === "ACTIVE"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {fy.status === "ACTIVE" ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {fy.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {fy.notes || "—"}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-2">
                        {!fy.isCurrent && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleSetCurrent(fy)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold transition disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{lang === "bn" ? "বর্তমান করুন" : "Set as Current"}</span>
                          </button>
                        )}

                        {!fy.isCurrent && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleStatus(fy)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition disabled:opacity-50"
                            title={fy.status === "ACTIVE" ? "Close Fiscal Year" : "Reopen Fiscal Year"}
                          >
                            {fy.status === "ACTIVE" ? (
                              <>
                                <Lock className="w-3 h-3 text-slate-500" />
                                <span>Close</span>
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3 h-3 text-slate-500" />
                                <span>Reopen</span>
                              </>
                            )}
                          </button>
                        )}

                        {!fy.isCurrent && fiscalYears.length > 1 && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(fy)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                            title="Delete Fiscal Year"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fiscal Year Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                  <CalendarRange className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Fiscal Year</h3>
                  <p className="text-xs text-slate-500">Define a new accounting cycle and dates</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFY} className="p-6 space-y-4">
              {/* Quick Presets */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset("BD_FY", currentYearNum)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 text-xs font-medium text-slate-700 transition"
                  >
                    BD FY {currentYearNum}-{currentYearNum + 1} (Jul–Jun)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("BD_FY", currentYearNum + 1)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 text-xs font-medium text-slate-700 transition"
                  >
                    BD FY {currentYearNum + 1}-{currentYearNum + 2} (Jul–Jun)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("CALENDAR", currentYearNum + 1)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 text-xs font-medium text-slate-700 transition"
                  >
                    Calendar {currentYearNum + 1} (Jan–Dec)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    FY Label (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. FY 2027-2028"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    FY Label (Bangla - Optional)
                  </label>
                  <input
                    type="text"
                    value={labelBn}
                    onChange={(e) => setLabelBn(e.target.value)}
                    placeholder="যেমন: অর্থবছর ২০২৭-২০২৮"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Standard Jul-Jun accounting year"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-50/70 border border-brand-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsCurrent}
                  onChange={(e) => setSetAsCurrent(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-700 focus:ring-brand-600"
                />
                <span className="text-xs font-semibold text-brand-950">
                  Set immediately as the Current Active Fiscal Year
                </span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Fiscal Year"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

