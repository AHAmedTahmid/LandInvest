"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Layers,
  Grid,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Maximize2,
  PieChart,
  ArrowRight,
  ShoppingCart,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { formatBDT } from "@/lib/format";

export type PlotItem = {
  id: string;
  plotNumber: string;
  plotSizeShotok: number;
  askingPrice: number;
  status: string;
  sale?: {
    id: string;
    buyerName: string;
    totalAgreedPrice: number;
    status: string;
  } | null;
};

export type ProjectDetailData = {
  id: string;
  projectName: string;
  mouza: string;
  jlNumber: string | null;
  dagNumbers: string;
  khatianNumbers: string;
  totalAreaShotok: number;
  purchasePrice: number;
  baynaAmount: number;
  registrationCost: number;
  mutationTaxCost: number;
  status: string;
  createdAt: string;
  plots: PlotItem[];
};

const PROJECT_STATUSES = [
  "DRAFT",
  "UNDER_BAYNA",
  "REGISTERED",
  "MUTATED",
  "READY_FOR_SALE",
  "SOLD_OUT",
];

export default function ProjectDetailClient({
  project,
  canEdit,
  canManagePlots,
  updateStatusAction,
  addPlotAction,
  updatePlotAction,
  deletePlotAction,
  batchGenerateAction,
}: {
  project: ProjectDetailData;
  canEdit: boolean;
  canManagePlots: boolean;
  updateStatusAction: (formData: FormData) => Promise<void>;
  addPlotAction: (formData: FormData) => Promise<void>;
  updatePlotAction: (formData: FormData) => Promise<void>;
  deletePlotAction: (formData: FormData) => Promise<void>;
  batchGenerateAction: (formData: FormData) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<"plots" | "dossier" | "financials">("plots");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [editingPlot, setEditingPlot] = useState<PlotItem | null>(null);
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial aggregates
  const totalCost =
    project.purchasePrice +
    project.registrationCost +
    project.mutationTaxCost;
  const costPerShotok =
    project.totalAreaShotok > 0 ? totalCost / project.totalAreaShotok : 0;

  const totalPlots = project.plots.length;
  const availablePlots = project.plots.filter((p) => p.status === "AVAILABLE");
  const bookedPlots = project.plots.filter((p) => p.status === "BOOKED");
  const soldPlots = project.plots.filter((p) => p.status === "SOLD");

  const totalPlotArea = project.plots.reduce((sum, p) => sum + p.plotSizeShotok, 0);
  const totalProjectedRevenue = project.plots.reduce((sum, p) => sum + p.askingPrice, 0);
  const zeroPricePlots = project.plots.filter((p) => p.askingPrice <= 0);

  const percentSold = totalPlots > 0 ? Math.round((soldPlots.length / totalPlots) * 100) : 0;
  const percentBooked = totalPlots > 0 ? Math.round((bookedPlots.length / totalPlots) * 100) : 0;

  // Filtered plots
  const filteredPlots = project.plots.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      p.plotNumber.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      (p.sale?.buyerName && p.sale.buyerName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Link href="/projects" className="hover:text-brand-600 transition">
              Land Projects
            </Link>
            <span>/</span>
            <span className="text-brand-600">{project.projectName}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-700" />
              {project.projectName}
            </h1>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                project.status === "READY_FOR_SALE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : project.status === "REGISTERED"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : project.status === "MUTATED"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : project.status === "SOLD_OUT"
                  ? "bg-slate-100 text-slate-700 border-slate-300"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {project.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Mouza: <strong className="text-slate-700">{project.mouza}</strong>
            {project.jlNumber && <span>• JL: {project.jlNumber}</span>}
            <span>• DAG: {project.dagNumbers}</span>
            <span>• Khatian: {project.khatianNumbers}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManagePlots && (
            <>
              <button
                onClick={() => setIsBatchOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Batch Generate
              </button>
              <button
                onClick={() => setIsAddPlotOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-brand-700 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Plot
              </button>
            </>
          )}
          <Link
            href={`/projects/plots?projectId=${project.id}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs"
          >
            <Grid className="w-3.5 h-3.5 text-purple-600" /> Manage Plots Hub
          </Link>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Land Area */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Land Area</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Maximize2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {project.totalAreaShotok.toLocaleString()} <span className="text-sm font-semibold text-slate-500">Shotok</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Plot Allocation: <strong className="text-slate-800">{totalPlotArea.toFixed(2)}</strong> / {project.totalAreaShotok} Shotok
          </div>
        </div>

        {/* Acquisition Cost */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Acquisition Cost</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatBDT(totalCost)}</div>
          <div className="text-xs text-slate-500 mt-1">
            Avg: <strong className="text-slate-700">{formatBDT(costPerShotok)}</strong> / Shotok
          </div>
        </div>

        {/* Plots Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Plot Inventory</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Grid className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{availablePlots.length}</span>
            <span className="text-xs text-slate-500">Available</span>
            <span className="text-slate-300">/</span>
            <span className="text-xl font-bold text-slate-800">{totalPlots}</span>
            <span className="text-xs text-slate-500">Total</span>
          </div>
          {/* Inventory status bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${totalPlots > 0 ? (availablePlots.length / totalPlots) * 100 : 0}%` }}
              title={`Available: ${availablePlots.length}`}
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${percentBooked}%` }}
              title={`Booked: ${bookedPlots.length}`}
            />
            <div
              className="bg-blue-600 h-full"
              style={{ width: `${percentSold}%` }}
              title={`Sold: ${soldPlots.length}`}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>{availablePlots.length} Avail</span>
            <span>{bookedPlots.length} Booked</span>
            <span>{soldPlots.length} Sold</span>
          </div>
        </div>

        {/* Projected Realization Value */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Projected Revenue</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatBDT(totalProjectedRevenue)}</div>
          <div className="text-xs text-slate-500 mt-1">
            {zeroPricePlots.length > 0 ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {zeroPricePlots.length} plot(s) have ৳0 price
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold">
                Est. Margin: {formatBDT(totalProjectedRevenue - totalCost)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("plots")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
            activeTab === "plots"
              ? "border-brand-600 text-brand-700 bg-brand-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Grid className="w-4 h-4" /> Plots Inventory ({project.plots.length})
        </button>
        <button
          onClick={() => setActiveTab("dossier")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
            activeTab === "dossier"
              ? "border-brand-600 text-brand-700 bg-brand-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" /> Legal & Acquisition Dossier
        </button>
        <button
          onClick={() => setActiveTab("financials")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
            activeTab === "financials"
              ? "border-brand-600 text-brand-700 bg-brand-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <PieChart className="w-4 h-4" /> Commercial Financials
        </button>
      </div>

      {/* TAB 1: PLOTS INVENTORY */}
      {activeTab === "plots" && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search plot number, status, buyer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white font-medium"
              >
                <option value="ALL">All Plot Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          {/* Plots Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Plot List for {project.projectName} ({filteredPlots.length})
              </h3>
              <span className="text-xs text-slate-500">
                Plot-wise customized sizes & asking prices
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
                  <tr>
                    <th className="p-3">Plot Identifier</th>
                    <th>Plot Size (Shotok)</th>
                    <th>Asking Price (BDT)</th>
                    <th>Price / Shotok</th>
                    <th>Status</th>
                    <th>Buyer / Sale</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPlots.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        {project.plots.length === 0
                          ? "No plots created yet for this project. Use '+ Add Plot' or 'Batch Generate' above."
                          : "No plots match the selected search criteria."}
                      </td>
                    </tr>
                  )}
                  {filteredPlots.map((pl) => {
                    const pricePerShotok =
                      pl.plotSizeShotok > 0 ? pl.askingPrice / pl.plotSizeShotok : 0;
                    const isZeroPrice = pl.askingPrice <= 0;

                    return (
                      <tr key={pl.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 font-mono text-sm">
                            {pl.plotNumber}
                          </span>
                        </td>
                        <td>
                          <span className="font-bold text-slate-800 font-mono">
                            {pl.plotSizeShotok.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">Shotok</span>
                        </td>
                        <td>
                          {isZeroPrice ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertCircle className="w-3 h-3" /> Set Price
                            </span>
                          ) : (
                            <span className="font-mono font-bold text-slate-900">
                              {formatBDT(pl.askingPrice)}
                            </span>
                          )}
                        </td>
                        <td>
                          {pricePerShotok > 0 ? (
                            <span className="text-xs text-slate-600 font-mono">
                              {formatBDT(pricePerShotok)} / Sh.
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              pl.status === "AVAILABLE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : pl.status === "BOOKED"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {pl.status}
                          </span>
                        </td>
                        <td>
                          {pl.sale ? (
                            <div className="text-xs">
                              <Link
                                href={`/sales/${pl.sale.id}`}
                                className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {pl.sale.buyerName}
                              </Link>
                              <span className="text-slate-400 text-[11px]">
                                Sold: {formatBDT(pl.sale.totalAgreedPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {pl.status === "AVAILABLE" && (
                              <Link
                                href={`/sales`}
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                                title="Sell Plot"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </Link>
                            )}
                            {canManagePlots && (
                              <>
                                <button
                                  onClick={() => setEditingPlot(pl)}
                                  className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                                  title="Edit Plot"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <form
                                  action={async (fd) => {
                                    if (confirm(`Delete plot "${pl.plotNumber}"?`)) {
                                      await deletePlotAction(fd);
                                    }
                                  }}
                                  className="inline"
                                >
                                  <input type="hidden" name="plotId" value={pl.id} />
                                  <button
                                    type="submit"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                    title="Delete Plot"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </form>
                              </>
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
        </div>
      )}

      {/* TAB 2: LEGAL & ACQUISITION DOSSIER */}
      {activeTab === "dossier" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legal Identification */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                Land Title & Legal Coordinates
              </h3>
              <div className="divide-y divide-slate-100 text-sm">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Project Name</span>
                  <span className="font-bold text-slate-900">{project.projectName}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Mouza</span>
                  <span className="font-semibold text-slate-800">{project.mouza}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">JL Number</span>
                  <span className="font-mono text-slate-800">{project.jlNumber || "—"}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">DAG Numbers</span>
                  <span className="font-mono font-bold text-slate-900">{project.dagNumbers}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Khatian Numbers</span>
                  <span className="font-mono font-bold text-slate-900">{project.khatianNumbers}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Total Land Area</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {project.totalAreaShotok.toLocaleString()} Shotok
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Acquisition Breakdown */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Acquisition Costs & Investments
              </h3>
              <div className="divide-y divide-slate-100 text-sm">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Land Purchase Price</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatBDT(project.purchasePrice)}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Bayna (Advance Paid)</span>
                  <span className="font-mono text-slate-700">{formatBDT(project.baynaAmount)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Registration Costs</span>
                  <span className="font-mono text-slate-700">
                    {formatBDT(project.registrationCost)}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Mutation & Tax Costs</span>
                  <span className="font-mono text-slate-700">
                    {formatBDT(project.mutationTaxCost)}
                  </span>
                </div>
                <div className="py-3 flex justify-between border-t-2 border-slate-200 bg-slate-50 px-3 rounded-lg">
                  <span className="font-bold text-slate-900">Total Acquisition Cost</span>
                  <span className="font-mono font-black text-emerald-700 text-base">
                    {formatBDT(totalCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Status Management */}
          {canEdit && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Update Project Legal & Commercial Status
              </h3>
              <p className="text-xs text-slate-500">
                Advance the lifecycle status of this acquisition tract as legal titles and mutations are accomplished.
              </p>
              <form
                action={async (fd) => {
                  setIsSubmitting(true);
                  try {
                    await updateStatusAction(fd);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 max-w-md"
              >
                <select
                  name="status"
                  defaultValue={project.status}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-brand-700 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Status
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMMERCIAL FINANCIALS */}
      {activeTab === "financials" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Project Performance & Return Projections
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison between land acquisition cost, plot asking prices, and expected ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Investment (Cost)</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {formatBDT(totalCost)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Includes purchase, deed & registration fees
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-xs text-emerald-700 block font-semibold">
                Projected Total Sales Value
              </span>
              <span className="text-xl font-black text-emerald-800 mt-1 block">
                {formatBDT(totalProjectedRevenue)}
              </span>
              <span className="text-[11px] text-emerald-600 mt-1 block">
                Sum of {project.plots.length} individual plot asking prices
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
              <span className="text-xs text-blue-700 block font-semibold">
                Projected Net Gross Return
              </span>
              <span className="text-xl font-black text-blue-800 mt-1 block">
                {formatBDT(totalProjectedRevenue - totalCost)}
              </span>
              <span className="text-[11px] text-blue-600 mt-1 block">
                {totalCost > 0
                  ? `Est. ROI: ${(((totalProjectedRevenue - totalCost) / totalCost) * 100).toFixed(1)}%`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PLOT */}
      {editingPlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Edit Plot: {editingPlot.plotNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Update customized size and price for this plot
                </p>
              </div>
              <button
                onClick={() => setEditingPlot(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              action={async (fd) => {
                setIsSubmitting(true);
                try {
                  await updatePlotAction(fd);
                  setEditingPlot(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-5 space-y-4"
            >
              <input type="hidden" name="plotId" value={editingPlot.id} />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plot Number / Identifier *
                </label>
                <input
                  name="plotNumber"
                  defaultValue={editingPlot.plotNumber}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plot Size (Shotok) *
                </label>
                <input
                  name="plotSizeShotok"
                  type="number"
                  step="0.01"
                  min="0.01"
                  defaultValue={editingPlot.plotSizeShotok}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asking Price (BDT) *
                </label>
                <input
                  name="askingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingPlot.askingPrice}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editingPlot.status}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">BOOKED</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlot(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-600 rounded-lg transition flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Plot Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD INDIVIDUAL PLOT */}
      {isAddPlotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add New Plot</h3>
                <p className="text-xs text-slate-500">
                  Create a custom individual plot for {project.projectName}
                </p>
              </div>
              <button
                onClick={() => setIsAddPlotOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              action={async (fd) => {
                setIsSubmitting(true);
                try {
                  await addPlotAction(fd);
                  setIsAddPlotOpen(false);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plot Number / Identifier *
                </label>
                <input
                  name="plotNumber"
                  placeholder={`Plot-${project.plots.length + 1}`}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plot Size (Shotok) *
                </label>
                <input
                  name="plotSizeShotok"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 2.5"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asking Price (BDT) *
                </label>
                <input
                  name="askingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 500000"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue="AVAILABLE"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">BOOKED</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPlotOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-600 rounded-lg transition flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Create Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BATCH GENERATE PLOTS */}
      {isBatchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Batch Generate Plots</h3>
                <p className="text-xs text-slate-500">
                  Quickly generate multiple plots with auto-numbering
                </p>
              </div>
              <button
                onClick={() => setIsBatchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              action={async (fd) => {
                setIsSubmitting(true);
                try {
                  await batchGenerateAction(fd);
                  setIsBatchOpen(false);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of Plots to Create *
                </label>
                <input
                  name="count"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="e.g. 10"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asking Price per Plot (BDT) *
                </label>
                <input
                  name="askingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 500000"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Size per Plot (Shotok, optional)
                </label>
                <input
                  name="sizeShotok"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Auto: Total Land Area / Plots"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBatchOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Generate Plots
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
