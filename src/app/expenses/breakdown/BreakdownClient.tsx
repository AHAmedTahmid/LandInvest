"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  PieChart,
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Receipt,
  Layers,
  Wallet,
  Users,
  Coins,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";
import { useLang } from "@/lib/i18n";

export interface ProjectExpenseItem {
  id: string;
  projectId: string | null;
  expenseCategory: string;
  amount: number;
  expenseDate: string;
  description: string;
  paymentChannel: string;
  bankName: string | null;
  paidByPartnerName: string | null;
  voucherImageUrl: string | null;
}

export interface ProjectSummary {
  id: string;
  projectName: string;
  mouza: string;
  jlNumber: string | null;
  totalAreaShotok: number;
  purchasePrice: number;
  baynaAmount: number;
  registrationCost: number;
  mutationTaxCost: number;
  status: string;
  totalPlots: number;
}

export interface ProjectCostBreakdownData {
  projects: ProjectSummary[];
  expenses: ProjectExpenseItem[];
}

export default function BreakdownClient({ data }: { data: ProjectCostBreakdownData }) {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const initialProjectFilter = searchParams.get("project") || "ALL";

  const { projects, expenses } = data;
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectFilter);
  const [search, setSearch] = useState("");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    initialProjectFilter !== "ALL" ? initialProjectFilter : null
  );
  const [activeModalExpense, setActiveModalExpense] = useState<ProjectExpenseItem | null>(null);

  // Escape key handler for modal
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveModalExpense(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Aggregated data per project
  const projectBreakdown = useMemo(() => {
    return projects.map((p) => {
      const pExpenses = expenses.filter((e) => e.projectId === p.id);
      const totalDevExpenses = pExpenses.reduce((s, e) => s + e.amount, 0);
      const acquisitionCost = p.purchasePrice + p.registrationCost + p.mutationTaxCost;
      const totalOutlay = acquisitionCost + totalDevExpenses;
      const costPerShotok = p.totalAreaShotok > 0 ? totalOutlay / p.totalAreaShotok : 0;
      const devCostPerShotok = p.totalAreaShotok > 0 ? totalDevExpenses / p.totalAreaShotok : 0;

      // Channels
      const bank = pExpenses.filter((e) => e.paymentChannel === "BANK").reduce((s, e) => s + e.amount, 0);
      const cash = pExpenses.filter((e) => e.paymentChannel === "CASH").reduce((s, e) => s + e.amount, 0);
      const partner = pExpenses.filter((e) => e.paymentChannel === "PAID_BY_PARTNER").reduce((s, e) => s + e.amount, 0);

      // Categories
      const catMap = new Map<string, number>();
      pExpenses.forEach((e) => {
        const cat = e.expenseCategory.trim() || "Uncategorized";
        catMap.set(cat, (catMap.get(cat) || 0) + e.amount);
      });
      const categories = Array.from(catMap.entries())
        .map(([name, amount]) => ({
          name,
          amount,
          pct: totalDevExpenses > 0 ? Math.round((amount / totalDevExpenses) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      return {
        ...p,
        expensesList: pExpenses,
        totalDevExpenses,
        acquisitionCost,
        totalOutlay,
        costPerShotok,
        devCostPerShotok,
        channels: { bank, cash, partner },
        categories,
      };
    });
  }, [projects, expenses]);

  // General Overhead (non-project expenses)
  const generalExpenses = useMemo(() => {
    return expenses.filter((e) => !e.projectId);
  }, [expenses]);

  const generalOverheadTotal = useMemo(() => {
    return generalExpenses.reduce((s, e) => s + e.amount, 0);
  }, [generalExpenses]);

  // Overall Portfolio Aggregates
  const portfolioMetrics = useMemo(() => {
    const totalDevExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalAcquisition = projects.reduce(
      (s, p) => s + p.purchasePrice + p.registrationCost + p.mutationTaxCost,
      0
    );
    const totalCapitalOutlay = totalAcquisition + totalDevExpenses;
    const totalShotok = projects.reduce((s, p) => s + p.totalAreaShotok, 0);
    const avgOutlayPerShotok = totalShotok > 0 ? totalCapitalOutlay / totalShotok : 0;

    return {
      totalDevExpenses,
      totalAcquisition,
      totalCapitalOutlay,
      totalShotok,
      avgOutlayPerShotok,
    };
  }, [projects, expenses]);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    return projectBreakdown.filter((p) => {
      if (selectedProjectId !== "ALL" && p.id !== selectedProjectId) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.projectName.toLowerCase().includes(q);
        const matchMouza = p.mouza.toLowerCase().includes(q);
        if (!matchName && !matchMouza) return false;
      }
      return true;
    });
  }, [projectBreakdown, selectedProjectId, search]);

  // Export CSV
  function exportCSV() {
    const headers = [
      "Project Name",
      "Mouza",
      "Status",
      "Area (Shotok)",
      "Acquisition Cost (BDT)",
      "Development Expenses (BDT)",
      "Total Capital Outlay (BDT)",
      "Total Cost / Shotok (BDT)",
      "Bank Disbursed (BDT)",
      "Cash Disbursed (BDT)",
      "Partner Funded (BDT)",
    ];

    const rows = filteredProjects.map((p) => [
      `"${p.projectName.replace(/"/g, '""')}"`,
      `"${p.mouza.replace(/"/g, '""')}"`,
      `"${p.status}"`,
      p.totalAreaShotok,
      p.acquisitionCost,
      p.totalDevExpenses,
      p.totalOutlay,
      Math.round(p.costPerShotok),
      p.channels.bank,
      p.channels.cash,
      p.channels.partner,
    ]);

    // Add general overhead row
    rows.push([
      `"General Overhead / Corporate"`,
      `"N/A"`,
      `"OPERATIONAL"`,
      0,
      0,
      generalOverheadTotal,
      generalOverheadTotal,
      0,
      generalExpenses.filter((e) => e.paymentChannel === "BANK").reduce((s, e) => s + e.amount, 0),
      generalExpenses.filter((e) => e.paymentChannel === "CASH").reduce((s, e) => s + e.amount, 0),
      generalExpenses.filter((e) => e.paymentChannel === "PAID_BY_PARTNER").reduce((s, e) => s + e.amount, 0),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Project_Cost_Breakdown_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
            <PieChart className="w-4 h-4" />
            <span>Financial Analytics & Cost Accounting</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Project-wise Cost Breakdown
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed capital allocation, land acquisition, site development expenses, and unit cost per Shotok.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            href="/expenses/dashboard"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-xs active:scale-[0.98]"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Expenses Dashboard</span>
          </Link>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Capital Outlay
            </span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            {formatBDT(portfolioMetrics.totalCapitalOutlay)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">Acquisition + Development total</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Development Expenses
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2 tracking-tight">
            {formatBDT(portfolioMetrics.totalDevExpenses)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">{expenses.length} approved project vouchers</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Land Holding
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            {portfolioMetrics.totalShotok} <span className="text-sm font-medium text-slate-500">Shotok</span>
          </p>
          <p className="text-xs text-slate-500 mt-1.5">Across {projects.length} land projects</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Outlay / Shotok
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2 tracking-tight">
            {formatBDT(portfolioMetrics.avgOutlayPerShotok)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">Benchmark cost basis per unit</p>
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
            placeholder="Search by project name or mouza..."
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

        <div className="w-full md:w-64">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-brand-600"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} {p.mouza ? `(${p.mouza})` : ""}
              </option>
            ))}
          </select>
        </div>

        {(search || selectedProjectId !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedProjectId("ALL");
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-100 transition whitespace-nowrap active:scale-[0.98]"
          >
            Reset
          </button>
        )}
      </div>

      {/* Project Cards with Deep Category Breakdowns */}
      <div className="space-y-4">
        {filteredProjects.map((p) => {
          const isExpanded = expandedProjectId === p.id;

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition"
            >
              {/* Card Header / Summary Row */}
              <div
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
                onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 truncate">{p.projectName}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {p.mouza}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Land Area: <span className="font-semibold text-slate-800">{p.totalAreaShotok} Shotok</span>
                    {" • "}
                    Acquisition Cost: <span className="font-semibold text-slate-800">{formatBDT(p.acquisitionCost)}</span>
                    {" • "}
                    Plots: <span className="font-semibold text-slate-800">{p.totalPlots}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Development</p>
                    <p className="text-base font-bold text-emerald-600">{formatBDT(p.totalDevExpenses)}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Cost / Shotok</p>
                    <p className="text-base font-bold text-slate-900">{formatBDT(p.costPerShotok)}</p>
                  </div>

                  <div className="text-slate-400 hover:text-slate-700">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-brand-600" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Collapsed Channel & Category Pills Preview */}
              <div className="px-5 pb-4 pt-1 flex items-center justify-between gap-3 flex-wrap text-xs border-t border-slate-100/60 bg-slate-50/30">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">Disbursement Channels:</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    <Building2 className="w-3 h-3" /> Bank: {formatBDT(p.channels.bank)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Wallet className="w-3 h-3" /> Cash: {formatBDT(p.channels.cash)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    <Users className="w-3 h-3" /> Partner: {formatBDT(p.channels.partner)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 ml-auto"
                >
                  <span>{isExpanded ? "Hide Vouchers" : `View ${p.expensesList.length} Vouchers`}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
              </div>

              {/* Expanded Section: Category Aggregates & Individual Vouchers */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-5 animate-fade-in">
                  {/* Category Breakdown Bar Grid */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-600" />
                      <span>Category Distribution for {p.projectName}</span>
                    </h3>

                    {p.categories.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No development expenses allocated to this project.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {p.categories.map((c) => (
                          <div
                            key={c.name}
                            className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-800 truncate">{c.name}</span>
                              <span className="font-bold text-slate-900">{formatBDT(c.amount)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Allocation</span>
                              <span>{c.pct}% of dev budget</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${c.pct}%` }}
                                className="bg-brand-600 h-full rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Individual Vouchers Table */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-brand-600" />
                      <span>Approved Expense Vouchers ({p.expensesList.length})</span>
                    </h3>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2.5">Date</th>
                            <th className="px-4 py-2.5">Category</th>
                            <th className="px-4 py-2.5">Description</th>
                            <th className="px-4 py-2.5">Channel / Payer</th>
                            <th className="px-4 py-2.5 text-right">Amount</th>
                            <th className="px-4 py-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {p.expensesList.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                                No expenses logged for this project yet.
                              </td>
                            </tr>
                          ) : (
                            p.expensesList.map((e) => (
                              <tr key={e.id} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-2.5 font-medium text-slate-600 whitespace-nowrap">
                                  {formatDate(e.expenseDate)}
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-slate-800">
                                  {e.expenseCategory}
                                </td>
                                <td className="px-4 py-2.5 text-slate-600">
                                  {e.description || "—"}
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                  {e.paymentChannel === "CASH" && (
                                    <span className="text-emerald-700 font-medium">Cash in Hand</span>
                                  )}
                                  {e.paymentChannel === "BANK" && (
                                    <span className="text-blue-700 font-medium">{e.bankName || "Bank"}</span>
                                  )}
                                  {e.paymentChannel === "PAID_BY_PARTNER" && (
                                    <span className="text-purple-700 font-medium">Partner: {e.paidByPartnerName}</span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5 text-right font-bold text-slate-900 whitespace-nowrap">
                                  {formatBDT(e.amount)}
                                </td>
                                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => setActiveModalExpense(e)}
                                    className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Receipt</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* General Overhead Section */}
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">General Overhead & Corporate</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  Non-Project Expenditures
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Head office operations, general administration, legal retainers, and cross-project costs.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Corporate Overhead</p>
              <p className="text-lg font-bold text-slate-800">{formatBDT(generalOverheadTotal)}</p>
            </div>
          </div>

          {generalExpenses.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="text-slate-500 font-medium">{generalExpenses.length} General Vouchers:</span>
                {Array.from(
                  new Set(generalExpenses.map((e) => e.expenseCategory.trim() || "Miscellaneous"))
                ).map((cat) => {
                  const catSum = generalExpenses
                    .filter((e) => (e.expenseCategory.trim() || "Miscellaneous") === cat)
                    .reduce((s, e) => s + e.amount, 0);
                  return (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                    >
                      {cat}: <strong className="text-slate-900">{formatBDT(catSum)}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voucher Detail Modal */}
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
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="text-2xl font-bold text-slate-900">{formatBDT(activeModalExpense.amount)}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  APPROVED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Category</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeModalExpense.expenseCategory}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Payment Channel</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeModalExpense.paymentChannel}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Expense Date</p>
                  <p className="text-slate-900 font-semibold mt-0.5">{formatDate(activeModalExpense.expenseDate)}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Disbursed Via</p>
                  <p className="text-slate-900 font-semibold mt-0.5">
                    {activeModalExpense.bankName || activeModalExpense.paidByPartnerName || "Cash in Hand"}
                  </p>
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
    </div>
  );
}
