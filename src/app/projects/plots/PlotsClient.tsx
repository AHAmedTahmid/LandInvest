"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Grid3X3,
  Search,
  Plus,
  Edit2,
  DollarSign,
  Maximize2,
  Tag,
  Building2,
  CheckCircle2,
  Clock,
  Check,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import { formatBDT } from "@/lib/format";

export type PlotItem = {
  id: string;
  plotNumber: string;
  plotSizeShotok: number;
  askingPrice: number;
  status: string;
  projectId: string;
  projectName: string;
  mouza: string;
  sale?: {
    id: string;
    buyerName: string;
    buyerPhone?: string | null;
    status: string;
  } | null;
};

export type ProjectOption = {
  id: string;
  projectName: string;
};

export default function PlotsClient({
  plots,
  projects,
  canManagePlots,
  updatePlotAction,
  createPlotAction,
}: {
  plots: PlotItem[];
  projects: ProjectOption[];
  canManagePlots: boolean;
  updatePlotAction: (data: {
    plotId: string;
    plotNumber: string;
    plotSizeShotok: number;
    askingPrice: number;
    status: string;
  }) => Promise<{ success?: boolean; error?: string }>;
  createPlotAction: (data: {
    projectId: string;
    plotNumber: string;
    plotSizeShotok: number;
    askingPrice: number;
  }) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Edit Plot Modal state
  const [editingPlot, setEditingPlot] = useState<PlotItem | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editSize, setEditSize] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState("AVAILABLE");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Add Plot Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addProjectId, setAddProjectId] = useState(projects[0]?.id || "");
  const [addPlotNumber, setAddPlotNumber] = useState("");
  const [addPlotSize, setAddPlotSize] = useState("");
  const [addAskingPrice, setAddAskingPrice] = useState("");
  const [savingAdd, setSavingAdd] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Keyboard shortcut: Escape closes active modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingPlot(null);
        setShowAddModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Open Edit Modal
  const openEditModal = (plot: PlotItem) => {
    setEditingPlot(plot);
    setEditNumber(plot.plotNumber);
    setEditSize(String(plot.plotSizeShotok));
    setEditPrice(String(plot.askingPrice));
    setEditStatus(plot.status);
    setEditError(null);
  };

  // Handle Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot) return;
    setSavingEdit(true);
    setEditError(null);

    const res = await updatePlotAction({
      plotId: editingPlot.id,
      plotNumber: editNumber.trim(),
      plotSizeShotok: parseFloat(editSize) || 0,
      askingPrice: parseFloat(editPrice) || 0,
      status: editStatus,
    });

    setSavingEdit(false);
    if (res.error) {
      setEditError(res.error);
    } else {
      showToast(`✓ ${editNumber} updated successfully`);
      setEditingPlot(null);
    }
  };

  // Handle Create Plot
  const handleCreatePlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addProjectId) {
      setAddError("Please select a Land Project.");
      return;
    }
    setSavingAdd(true);
    setAddError(null);

    const res = await createPlotAction({
      projectId: addProjectId,
      plotNumber: addPlotNumber.trim(),
      plotSizeShotok: parseFloat(addPlotSize) || 0,
      askingPrice: parseFloat(addAskingPrice) || 0,
    });

    setSavingAdd(false);
    if (res.error) {
      setAddError(res.error);
    } else {
      showToast(`✓ Plot ${addPlotNumber} created successfully`);
      setShowAddModal(false);
      setAddPlotNumber("");
      setAddPlotSize("");
      setAddAskingPrice("");
    }
  };

  // Filtering
  const filteredPlots = plots.filter((p) => {
    if (projectFilter !== "ALL" && p.projectId !== projectFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      p.plotNumber.toLowerCase().includes(q) ||
      p.projectName.toLowerCase().includes(q) ||
      p.mouza.toLowerCase().includes(q) ||
      (p.sale?.buyerName && p.sale.buyerName.toLowerCase().includes(q))
    );
  });

  // KPI calculations
  const totalPlots = plots.length;
  const availablePlots = plots.filter((p) => p.status === "AVAILABLE").length;
  const bookedPlots = plots.filter((p) => p.status === "BOOKED").length;
  const soldPlots = plots.filter((p) => p.status === "SOLD").length;
  const totalValuation = plots.reduce((sum, p) => sum + p.askingPrice, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-emerald-600 text-white animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Plots Inventory & Pricing</h1>
          <p className="text-sm text-slate-500">
            Manage individual plots across land projects. Customize plot-wise asking prices and plot sizes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/projects/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Building2 className="w-4 h-4" /> New Acquirement
          </Link>
          {canManagePlots && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Plot
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Plots</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalPlots}</p>
          <span className="text-[11px] text-slate-400">Across {projects.length} projects</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">Available</span>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">{availablePlots}</p>
          <span className="text-[11px] text-slate-400">Ready for sale</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase">Booked / Partial</span>
          <p className="text-2xl font-bold font-mono text-blue-700 mt-1">{bookedPlots}</p>
          <span className="text-[11px] text-slate-400">Under installments</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Sold Out</span>
          <p className="text-2xl font-bold font-mono text-slate-800 mt-1">{soldPlots}</p>
          <span className="text-[11px] text-slate-400">Fully realized</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-purple-700 uppercase">Total Inventory Value</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{formatBDT(totalValuation)}</p>
          <span className="text-[11px] text-slate-400">Aggregated asking prices</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plot number, project name, or buyer..."
              className="w-full pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Project Filter */}
          <div className="sm:col-span-4">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE (Unsold)</option>
              <option value="BOOKED">BOOKED (In Sale)</option>
              <option value="SOLD">SOLD (Paid in Full)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plots Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Plot Identifier</th>
                <th>Land Project</th>
                <th>Plot Size</th>
                <th className="text-right">Asking Price</th>
                <th>Status</th>
                <th>Buyer / Sale Info</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlots.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <p className="text-sm">No plots match your selected filters.</p>
                    {(searchTerm || projectFilter !== "ALL" || statusFilter !== "ALL") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setProjectFilter("ALL");
                          setStatusFilter("ALL");
                        }}
                        className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Reset all filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {filteredPlots.map((plot) => {
                const isAvail = plot.status === "AVAILABLE";
                const isBooked = plot.status === "BOOKED";
                const isSold = plot.status === "SOLD";

                return (
                  <tr key={plot.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold font-mono text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                          <Grid3X3 className="w-4 h-4" />
                        </span>
                        <span>{plot.plotNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className="font-semibold text-slate-900 block text-xs">
                          {plot.projectName}
                        </span>
                        <span className="text-[11px] text-slate-400">{plot.mouza}</span>
                      </div>
                    </td>
                    <td className="font-mono font-semibold text-slate-800 text-xs">
                      {plot.plotSizeShotok} Shotok
                    </td>
                    <td className="text-right font-mono font-bold text-slate-900 text-xs">
                      {formatBDT(plot.askingPrice)}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isAvail
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isBooked
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {plot.status}
                      </span>
                    </td>
                    <td>
                      {plot.sale ? (
                        <div className="text-xs">
                          <span className="font-semibold text-slate-800 block">
                            {plot.sale.buyerName}
                          </span>
                          <Link
                            href={`/sales/${plot.sale.id}`}
                            className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            View Sale File <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">None (Ready to Sell)</span>
                      )}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {canManagePlots ? (
                        <button
                          type="button"
                          onClick={() => openEditModal(plot)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-md transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Size / Price
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">View only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plot Modal (Set Custom Price & Size) */}
      {editingPlot && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingPlot(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Plot Size & Asking Price
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingPlot.projectName} • {editingPlot.plotNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlot(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plot Identifier / Number *
                </label>
                <input
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  placeholder="e.g. Plot-1 or Block-A/12"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Individual Plot Size (Shotok) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editSize}
                  onChange={(e) => setEditSize(e.target.value)}
                  placeholder="e.g. 5.50"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Set a custom size specific to this individual plot.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Individual Asking Price (BDT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="e.g. 1500000"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Set a custom asking price specific to this individual plot.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="AVAILABLE">AVAILABLE (Ready for Sale)</option>
                  <option value="BOOKED">BOOKED (In Sale / Reserved)</option>
                  <option value="SOLD">SOLD (Paid in Full)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlot(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Plot Modal */}
      {showAddModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Plot to Project</h3>
                  <p className="text-[11px] text-slate-500">
                    Add a new plot with specific size and asking price.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlot} className="p-6 space-y-4">
              {addError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Land Project *
                </label>
                <select
                  value={addProjectId}
                  onChange={(e) => setAddProjectId(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plot Number / Name *
                </label>
                <input
                  value={addPlotNumber}
                  onChange={(e) => setAddPlotNumber(e.target.value)}
                  placeholder="e.g. Plot-15 or Block-B/5"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plot Size (Shotok) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={addPlotSize}
                  onChange={(e) => setAddPlotSize(e.target.value)}
                  placeholder="e.g. 5.00"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asking Price (BDT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={addAskingPrice}
                  onChange={(e) => setAddAskingPrice(e.target.value)}
                  placeholder="e.g. 1800000"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdd}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                >
                  {savingAdd && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
