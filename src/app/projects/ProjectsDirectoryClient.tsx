"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  Plus,
  Layers,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  PieChart,
  Grid,
  X,
} from "lucide-react";
import { formatBDT } from "@/lib/format";

export type ProjectRow = {
  id: string;
  projectName: string;
  mouza: string;
  dagNumbers: string;
  khatianNumbers: string;
  jlNumber?: string | null;
  totalAreaShotok: number;
  purchasePrice: number;
  baynaAmount: number;
  registrationCost: number;
  mutationTaxCost: number;
  status: string;
  totalPlots: number;
  availablePlots: number;
  bookedPlots: number;
  soldPlots: number;
  createdAt: string;
};

export default function ProjectsDirectoryClient({
  projects,
  canCreate,
}: {
  projects: ProjectRow[];
  canCreate: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = projects.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      p.projectName.toLowerCase().includes(q) ||
      p.mouza.toLowerCase().includes(q) ||
      p.dagNumbers.toLowerCase().includes(q) ||
      p.khatianNumbers.toLowerCase().includes(q)
    );
  });

  const totalAcresShotok = projects.reduce((s, p) => s + p.totalAreaShotok, 0);
  const totalCost = projects.reduce(
    (s, p) => s + p.purchasePrice + p.registrationCost + p.mutationTaxCost,
    0
  );
  const allPlotsCount = projects.reduce((s, p) => s + p.totalPlots, 0);
  const totalAvailablePlots = projects.reduce((s, p) => s + p.availablePlots, 0);
  const totalSoldPlots = projects.reduce((s, p) => s + p.soldPlots, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Land Projects</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{projects.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            Total Area: <span className="font-semibold text-slate-700">{totalAcresShotok.toLocaleString()} Shotok</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Acquisition Cost</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatBDT(totalCost)}</div>
          <div className="text-xs text-slate-500 mt-1">Purchase, bayna, mutation & reg</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Plots Inventory</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Grid className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{allPlotsCount}</div>
          <div className="text-xs text-slate-500 mt-1">
            Across {projects.length} registered projects
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Status</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <PieChart className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{totalAvailablePlots}</span>
            <span className="text-xs text-slate-500">Available</span>
            <span className="text-slate-300">/</span>
            <span className="text-2xl font-black text-slate-900">{totalSoldPlots}</span>
            <span className="text-xs text-slate-500">Sold</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {allPlotsCount > 0
              ? `${Math.round((totalSoldPlots / allPlotsCount) * 100)}% inventory liquidated`
              : "No plots generated"}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Land Projects & Acquisition Hub
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage your land portfolio: acquire new land, define customized plot layouts & pricing, and track live project inventory.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {canCreate && (
            <Link
              href="/projects/new"
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> 1. New Acquirement
            </Link>
          )}
          <Link
            href="/projects/plots"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition"
          >
            <Grid className="w-4 h-4" /> 2. Manage Plots
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project, mouza, DAG, khatian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_BAYNA">Under Bayna</option>
            <option value="REGISTERED">Registered</option>
            <option value="MUTATED">Mutated</option>
            <option value="READY_FOR_SALE">Ready for Sale</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            All Land Projects ({filtered.length})
          </h3>
          <span className="text-xs text-slate-500">Showing registered acquisition tracts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Project & Location</th>
                <th>Legal Details</th>
                <th>Area (Shotok)</th>
                <th>Total Cost</th>
                <th>Plots Distribution</th>
                <th>Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <p className="text-sm">No land projects match the selected criteria.</p>
                    {(searchTerm || statusFilter !== "ALL") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("ALL");
                        }}
                        className="mt-2 text-xs font-semibold text-brand-700 hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {filtered.map((p) => {
                const totalCost = p.purchasePrice + p.registrationCost + p.mutationTaxCost;
                const percentSold =
                  p.totalPlots > 0 ? Math.round((p.soldPlots / p.totalPlots) * 100) : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{p.projectName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.mouza}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold text-slate-500">DAG:</span> {p.dagNumbers}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-400">Khatian:</span> {p.khatianNumbers}
                        {p.jlNumber ? ` | JL: ${p.jlNumber}` : ""}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-slate-900">
                        {p.totalAreaShotok.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">Shotok</span>
                    </td>
                    <td>
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {formatBDT(totalCost)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Purchase: {formatBDT(p.purchasePrice)}
                      </div>
                    </td>
                    <td>
                      {p.totalPlots === 0 ? (
                        <span className="text-xs text-slate-400 italic">No plots defined</span>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {p.availablePlots} Avail
                            </span>
                            <span className="text-slate-400">/</span>
                            <span className="text-xs font-semibold text-slate-700">
                              {p.totalPlots} Total
                            </span>
                            {p.soldPlots > 0 && (
                              <span className="text-[11px] text-slate-500">
                                ({p.soldPlots} sold)
                              </span>
                            )}
                          </div>
                          {/* Mini progress bar */}
                          <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all"
                              style={{ width: `${percentSold}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.status === "READY_FOR_SALE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : p.status === "REGISTERED"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : p.status === "MUTATED"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {p.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/projects/plots?projectId=${p.id}`}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                        >
                          Plots
                        </Link>
                        <Link
                          href={`/projects/${p.id}`}
                          className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition flex items-center gap-1"
                        >
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
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
  );
}
