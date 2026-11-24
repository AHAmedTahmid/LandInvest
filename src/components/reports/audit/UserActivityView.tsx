"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Activity,
  Award,
  Database,
  Search,
  Filter,
  Download,
  Calendar,
  X,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  UserCheck,
  Briefcase,
  Copy,
  Check,
} from "lucide-react";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  UserActivityResult,
  OperatorProfile,
  UserActivityItem,
} from "@/lib/reports/user-activity";

interface UserActivityViewProps {
  def: ReportDef;
  data: UserActivityResult;
  filters: {
    from: string;
    to: string;
    userId?: string;
    action?: string;
  };
  canExport?: boolean;
}

export default function UserActivityView({
  def,
  data,
  filters,
  canExport = true,
}: UserActivityViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedOperator, setSelectedOperator] = useState<OperatorProfile | null>(null);
  const [copiedOperatorId, setCopiedOperatorId] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const kpis = data.kpis || {
    totalActiveUsers: 0,
    totalUserActions: 0,
    avgActionsPerUser: 0,
    topOperatorName: "N/A",
    topOperatorCount: 0,
    monitoredModulesCount: 0,
  };

  const operators = data.operators || [];
  const items = data.items || [];
  const categoryWorkload = data.categoryWorkload || [];

  // Filter items based on search and action/category tabs
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedAction !== "ALL" && item.action !== selectedAction) return false;
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
      if (filters.userId && filters.userId !== "ALL" && item.userId !== filters.userId) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.userName.toLowerCase().includes(q) ||
        item.userRole.toLowerCase().includes(q) ||
        item.entityLabel.toLowerCase().includes(q) ||
        item.summaryText.toLowerCase().includes(q) ||
        item.recordId.toLowerCase().includes(q)
      );
    });
  }, [items, selectedAction, selectedCategory, filters.userId, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCopyOperatorAdvice = (op: OperatorProfile) => {
    const text = `LandInvest Operator Audit Dossier:
Operator: ${op.name}
Role: ${op.role}
Email: ${op.email}
User ID: ${op.userId}
Total Operations Logged: ${op.totalActions}
Creates: ${op.createCount} | Updates: ${op.updateCount} | Deletes: ${op.deleteCount}
Modules Maintained: ${op.tablesTouched.length}
Workload: Financial: ${op.categoryBreakdown.financial}, Sales: ${op.categoryBreakdown.sales}, Projects: ${op.categoryBreakdown.projects}, Governance: ${op.categoryBreakdown.governance}
Last Active: ${op.lastActive}`;
    navigator.clipboard.writeText(text);
    setCopiedOperatorId(true);
    setTimeout(() => setCopiedOperatorId(false), 2000);
  };

  // Construct export query string
  const exportParams = new URLSearchParams({
    from: filters.from,
    to: filters.to,
    ...(filters.userId && { userId: filters.userId }),
    ...(filters.action && { action: filters.action }),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{def.titleEn}</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Audit & Governance
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{def.descriptionEn}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/reports"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            ← Back to Catalog
          </Link>

          {canExport && (
            <div className="flex items-center gap-2">
              <a
                href={`/api/reports/user-activity?${exportParams.toString()}&format=pdf`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </a>
              <a
                href={`/api/reports/user-activity?${exportParams.toString()}&format=excel`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 2. DATE & USER FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <form method="GET" className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filters:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">From</span>
            <input
              type="date"
              name="from"
              defaultValue={filters.from}
              className="text-xs font-mono border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">To</span>
            <input
              type="date"
              name="to"
              defaultValue={filters.to}
              className="text-xs font-mono border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {data.availableUsers && data.availableUsers.length > 0 && (
            <select
              name="userId"
              defaultValue={filters.userId || "ALL"}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Active Operators</option>
              {data.availableUsers.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition-colors"
          >
            Apply Range
          </button>

          {(filters.userId || filters.from !== "2026-01-01" || filters.to !== "2026-12-31") && (
            <Link
              href="/reports/user-activity"
              className="text-xs text-slate-500 hover:text-slate-800 underline px-1"
            >
              Reset
            </Link>
          )}
        </form>

        <div className="text-xs text-slate-500 font-medium">
          Reporting Window: <span className="font-mono text-slate-700">{filters.from}</span> to{" "}
          <span className="font-mono text-slate-700">{filters.to}</span>
        </div>
      </div>

      {/* 3. MACRO KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Personnel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Personnel
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {kpis.totalActiveUsers}
            </span>
            <span className="text-xs text-slate-500">verified operators</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Role-governed tenant users</span>
          </div>
        </div>

        {/* KPI 2: Total Operations Logged */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Operations
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 tracking-tight">
              {kpis.totalUserActions}
            </span>
            <span className="text-xs text-slate-500">logged mutations</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% audit trail compliance</span>
          </div>
        </div>

        {/* KPI 3: Avg Productivity Index */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Productivity Index
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-700 tracking-tight">
              {kpis.avgActionsPerUser}
            </span>
            <span className="text-xs text-slate-500">ops / operator</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Across {kpis.monitoredModulesCount} active modules</span>
          </div>
        </div>

        {/* KPI 4: Lead Contributor */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lead Contributor
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-slate-900 truncate">
              {kpis.topOperatorName}
            </div>
            <div className="text-xs font-mono text-amber-700 font-semibold mt-0.5">
              {kpis.topOperatorCount} actions logged
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Highest operational throughput</span>
          </div>
        </div>
      </div>

      {/* 4. WORKLOAD BY DEPARTMENT / FUNCTIONAL AREA */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Workload Allocation by Functional Domain
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryWorkload.map((cat) => (
            <button
              key={cat.category}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.category ? "ALL" : cat.category)
              }
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedCategory === cat.category
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{cat.labelEn}</span>
                <span className="font-mono text-indigo-700 font-bold">{cat.percentage}%</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-slate-900">{cat.count}</span>
                <span className="text-xs text-slate-500">mutations</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. TEAM OPERATOR ROSTER (CARDS GRID) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Personnel Operational Profiles</h2>
          <span className="text-xs text-slate-500">
            Click any profile to inspect detailed mutation dossier
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operators.map((op) => (
            <div
              key={op.userId}
              onClick={() => setSelectedOperator(op)}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                      {op.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {op.name}
                      </h4>
                      <p className="text-xs text-slate-500">{op.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {op.role}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Ops</div>
                    <div className="text-sm font-mono font-bold text-slate-900">{op.totalActions}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-600 uppercase font-semibold">Creates</div>
                    <div className="text-sm font-mono font-bold text-emerald-700">{op.createCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-600 uppercase font-semibold">Updates</div>
                    <div className="text-sm font-mono font-bold text-blue-700">{op.updateCount}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Operation Split</span>
                    <span className="font-mono">
                      {Math.round((op.createCount / (op.totalActions || 1)) * 100)}% Creates
                    </span>
                  </div>
                  <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(op.createCount / (op.totalActions || 1)) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${(op.updateCount / (op.totalActions || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(op.lastActive).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View Dossier <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CHRONOLOGICAL USER ACTIVITY STREAM */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">Chronological Operational Activity Log</h3>
            <p className="text-xs text-slate-500">
              Real-time audit log of user interactions and state modifications
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, action, module..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg w-56 focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Action Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              {["ALL", "CREATE", "UPDATE"].map((act) => (
                <button
                  key={act}
                  onClick={() => {
                    setSelectedAction(act);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    selectedAction === act
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stream Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator & Role</th>
                <th className="py-3 px-4 text-center">Action</th>
                <th className="py-3 px-4">Target Module</th>
                <th className="py-3 px-4">Activity Summary</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No activity logs match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const matchedOp = operators.find((o) => o.userId === item.userId);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                      onClick={() => matchedOp && setSelectedOperator(matchedOp)}
                    >
                      <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {item.timestamp}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-900">
                        <div>{item.userName}</div>
                        <div className="text-[10px] text-slate-500">{item.userRole}</div>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            item.action === "CREATE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span>{item.entityLabel}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 max-w-md truncate">
                        {item.summaryText}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center text-xs font-semibold">
                          Inspect <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50">
            <div>
              Showing <span className="font-mono font-semibold">{(currentPage - 1) * pageSize + 1}</span>{" "}
              to{" "}
              <span className="font-mono font-semibold">
                {Math.min(currentPage * pageSize, filteredItems.length)}
              </span>{" "}
              of <span className="font-mono font-semibold">{filteredItems.length}</span> activities
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100"
              >
                Prev
              </button>
              <span className="px-3 py-1 font-mono text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. INTERACTIVE OPERATOR DOSSIER MODAL */}
      {selectedOperator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                  {selectedOperator.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{selectedOperator.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      Active Operator
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">{selectedOperator.role}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedOperator.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOperator(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Stat Matrix */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Total Ops</div>
                  <div className="text-xl font-mono font-bold text-slate-900 mt-1">
                    {selectedOperator.totalActions}
                  </div>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Creates</div>
                  <div className="text-xl font-mono font-bold text-emerald-800 mt-1">
                    {selectedOperator.createCount}
                  </div>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-blue-700">Updates</div>
                  <div className="text-xl font-mono font-bold text-blue-800 mt-1">
                    {selectedOperator.updateCount}
                  </div>
                </div>
                <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-indigo-700">Modules</div>
                  <div className="text-xl font-mono font-bold text-indigo-800 mt-1">
                    {selectedOperator.tablesTouched.length}
                  </div>
                </div>
              </div>

              {/* Functional Area Workload Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Operational Distribution by Domain
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Financial & Treasury Operations</span>
                      <span className="font-mono font-bold">
                        {selectedOperator.categoryBreakdown.financial} ops
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{
                          width: `${(selectedOperator.categoryBreakdown.financial / (selectedOperator.totalActions || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Land Acquisition & Project Expenses</span>
                      <span className="font-mono font-bold">
                        {selectedOperator.categoryBreakdown.projects} ops
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{
                          width: `${(selectedOperator.categoryBreakdown.projects / (selectedOperator.totalActions || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Sales Contracts & Plot Allotments</span>
                      <span className="font-mono font-bold">
                        {selectedOperator.categoryBreakdown.sales} ops
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{
                          width: `${(selectedOperator.categoryBreakdown.sales / (selectedOperator.totalActions || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Security & Role Governance</span>
                      <span className="font-mono font-bold">
                        {selectedOperator.categoryBreakdown.governance} ops
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{
                          width: `${(selectedOperator.categoryBreakdown.governance / (selectedOperator.totalActions || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Actions by this Operator */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Recent Activity Stream (Latest 8 Actions)
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {items
                    .filter((i) => i.userId === selectedOperator.userId)
                    .slice(0, 8)
                    .map((act) => (
                      <div key={act.id} className="p-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                                act.action === "CREATE"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {act.action}
                            </span>
                            <span className="font-bold text-slate-900">{act.entityLabel}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{act.summaryText}</p>
                        </div>
                        <span className="font-mono text-slate-400 text-[10px] whitespace-nowrap">
                          {act.timestamp}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => handleCopyOperatorAdvice(selectedOperator)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
              >
                {copiedOperatorId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Dossier</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Operator Summary</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedOperator(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
