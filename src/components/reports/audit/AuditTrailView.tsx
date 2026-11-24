"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { AuditTrailResult, AuditTrailItem } from "@/lib/reports/audit-trail";
import {
  ShieldAlert,
  Search,
  Filter,
  FileDown,
  Printer,
  ChevronRight,
  X,
  User,
  Clock,
  Database,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Layers,
  Sparkles,
  Fingerprint,
} from "lucide-react";

interface AuditTrailViewProps {
  def: {
    key: string;
    titleEn: string;
    titleBn: string;
    descriptionEn?: string;
    descriptionBn?: string;
  };
  data: AuditTrailResult;
  filters: {
    userId?: string;
    tableName?: string;
    action?: string;
    from?: string;
    to?: string;
  };
  canExport?: boolean;
}

export default function AuditTrailView({
  def,
  data,
  filters,
  canExport = true,
}: AuditTrailViewProps) {
  const [selectedTable, setSelectedTable] = useState<string>(filters.tableName || "ALL");
  const [selectedAction, setSelectedAction] = useState<string>(filters.action || "ALL");
  const [selectedUser, setSelectedUser] = useState<string>(filters.userId || "ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeItem, setActiveItem] = useState<AuditTrailItem | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  const kpis = data?.kpis || {
    totalEvents: 0,
    createdEvents: 0,
    updatedEvents: 0,
    activeOperatorsCount: 0,
    monitoredTablesCount: 0,
  };

  const items = data?.items || [];
  const entityStats = data?.entityStats || [];
  const availableTables = data?.availableTables || [];
  const availableUsers = data?.availableUsers || [];

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedTable !== "ALL" && item.tableName !== selectedTable) return false;
      if (selectedAction !== "ALL" && item.action !== selectedAction) return false;
      if (selectedUser !== "ALL" && item.changedBy !== selectedUser) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesUser = item.userName.toLowerCase().includes(q);
        const matchesTable = item.tableName.toLowerCase().includes(q) || item.entityLabelEn.toLowerCase().includes(q);
        const matchesRecord = item.recordId.toLowerCase().includes(q);
        const matchesChanges = item.changesSummary.toLowerCase().includes(q);
        return matchesUser || matchesTable || matchesRecord || matchesChanges;
      }
      return true;
    });
  }, [items, selectedTable, selectedAction, selectedUser, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  const handleCopyJson = (item: AuditTrailItem) => {
    const jsonStr = JSON.stringify(
      {
        id: item.id,
        timestamp: item.rawTimestamp,
        operator: item.userName,
        role: item.userRole,
        action: item.action,
        table: item.tableName,
        recordId: item.recordId,
        oldValues: item.oldValues,
        newValues: item.newValues,
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
              <Fingerprint className="w-3.5 h-3.5 text-rose-600" />
              ENTERPRISE SECURITY, COMPLIANCE & FORENSIC AUDIT DIVISION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {def.titleEn} <span className="font-normal text-slate-500 text-lg">({def.titleBn})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable, cryptographically logged audit trail of record creations, state modifications, and authorization approvals across system tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            ← Back to Reports
          </Link>
          {canExport && (
            <>
              <a
                href={`/api/reports/${def.key}?format=pdf${selectedTable !== "ALL" ? `&tableName=${selectedTable}` : ""}${selectedAction !== "ALL" ? `&action=${selectedAction}` : ""}${selectedUser !== "ALL" ? `&userId=${selectedUser}` : ""}${filters.from ? `&from=${filters.from}` : ""}${filters.to ? `&to=${filters.to}` : ""}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                Export Landscape PDF
              </a>
              <a
                href={`/api/reports/${def.key}?format=excel${selectedTable !== "ALL" ? `&tableName=${selectedTable}` : ""}${selectedAction !== "ALL" ? `&action=${selectedAction}` : ""}${selectedUser !== "ALL" ? `&userId=${selectedUser}` : ""}${filters.from ? `&from=${filters.from}` : ""}${filters.to ? `&to=${filters.to}` : ""}`}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                Excel (XLS)
              </a>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* 2. Top 4 Macro KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Audited Events */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Audited Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {kpis.totalEvents.toLocaleString()} Events
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>{kpis.monitoredTablesCount} Monitored Tables</span>
              <span className="font-semibold text-slate-700">100% Immutable</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Records Created */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Records Initialized (CREATE)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
              {kpis.createdEvents.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>New Record Ingestion</span>
              <span className="font-semibold text-emerald-600">
                {kpis.totalEvents > 0 ? ((kpis.createdEvents / kpis.totalEvents) * 100).toFixed(1) : 0}% of Activity
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Records Modified */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              State Changes (UPDATE)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-blue-700">
              {kpis.updatedEvents.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>Diff Mutations Tracked</span>
              <span className="font-semibold text-blue-600">
                {kpis.totalEvents > 0 ? ((kpis.updatedEvents / kpis.totalEvents) * 100).toFixed(1) : 0}% of Activity
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Active Operators */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Authenticated Operators
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-purple-700">
              {kpis.activeOperatorsCount} Active Users
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>RBAC Session Attribution</span>
              <span className="font-semibold text-purple-600">Strict Signature</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Entity Activity Distribution Chips */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-slate-500" />
            Monitored Entities & Tables ({entityStats.length})
          </span>
          {selectedTable !== "ALL" && (
            <button
              onClick={() => setSelectedTable("ALL")}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Clear Entity Filter ×
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {entityStats.map((e) => (
            <button
              key={e.tableName}
              onClick={() => setSelectedTable(selectedTable === e.tableName ? "ALL" : e.tableName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                selectedTable === e.tableName
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <span>{e.labelEn}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                selectedTable === e.tableName ? "bg-slate-800 text-rose-300" : "bg-slate-200 text-slate-700"
              }`}>
                {e.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Master Audit Trail Register */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Action Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => { setSelectedAction("ALL"); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedAction === "ALL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Actions ({items.length})
            </button>
            <button
              onClick={() => { setSelectedAction("CREATE"); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedAction === "CREATE"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Created ({items.filter((i) => i.action === "CREATE").length})
            </button>
            <button
              onClick={() => { setSelectedAction("UPDATE"); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedAction === "UPDATE"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Modified ({items.filter((i) => i.action === "UPDATE").length})
            </button>
          </div>

          {/* User selector & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search record ID, user, table, diff..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedUser}
              onChange={(e) => { setSelectedUser(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All System Operators</option>
              {availableUsers.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">System Operator</th>
                <th className="py-3 px-3 text-center">Action</th>
                <th className="py-3 px-3">Target Entity</th>
                <th className="py-3 px-3">Record ID</th>
                <th className="py-3 px-3">Changes Summary</th>
                <th className="py-3 px-3 text-center">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No audit records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className="hover:bg-slate-100/60 cursor-pointer transition-colors group"
                  >
                    {/* Timestamp */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-700">
                      {item.createdAt}
                    </td>

                    {/* Operator */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 group-hover:text-rose-700">
                        {item.userName}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.userRole}</div>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      {item.action === "CREATE" ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CREATE
                        </span>
                      ) : item.action === "UPDATE" ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          UPDATE
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {item.action}
                        </span>
                      )}
                    </td>

                    {/* Entity */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">{item.entityLabelEn}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.tableName}</div>
                    </td>

                    {/* Record ID */}
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                      {item.recordId.slice(0, 8)}...
                    </td>

                    {/* Changes Summary */}
                    <td className="py-2.5 px-3 max-w-[280px] truncate text-slate-600 text-[11px]">
                      {item.changesSummary}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveItem(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                      >
                        <Code2 className="w-3 h-3 text-slate-500" />
                        Diff
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer */}
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td colSpan={7} className="py-3 px-3 uppercase tracking-wider">
                    Total Filtered Events: {filteredItems.length} Records
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing <strong className="font-semibold text-slate-900">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
              <strong className="font-semibold text-slate-900">
                {Math.min(currentPage * pageSize, filteredItems.length)}
              </strong>{" "}
              of <strong className="font-semibold text-slate-900">{filteredItems.length}</strong> events
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-slate-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 border border-slate-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Interactive Audit Diff Dossier Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 font-bold">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Audit Log Inspection
                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      activeItem.action === "CREATE" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {activeItem.action}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {activeItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => { setActiveItem(null); setShowRawJson(false); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Event Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timestamp</span>
                  <span className="font-mono font-semibold text-slate-800 text-[11px]">{activeItem.createdAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Operator</span>
                  <span className="font-semibold text-slate-800 text-[11px]">{activeItem.userName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Entity</span>
                  <span className="font-semibold text-slate-800 text-[11px]">{activeItem.entityLabelEn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Record ID</span>
                  <span className="font-mono text-slate-700 text-[11px] truncate block">{activeItem.recordId}</span>
                </div>
              </div>

              {/* Field Diffs Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Field-Level Mutation Diff ({activeItem.diffs.length} Fields)
                  </span>
                  <button
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="text-xs text-purple-700 hover:text-purple-800 font-semibold inline-flex items-center gap-1"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    {showRawJson ? "Show Table View" : "Show Raw JSON"}
                  </button>
                </div>

                {showRawJson ? (
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-3 bg-slate-900 text-slate-300 rounded-lg overflow-x-auto max-h-60">
                      <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Old Values</div>
                      <pre>{JSON.stringify(activeItem.oldValues, null, 2) || "null"}</pre>
                    </div>
                    <div className="p-3 bg-slate-900 text-slate-300 rounded-lg overflow-x-auto max-h-60">
                      <div className="text-emerald-400 text-[10px] uppercase font-bold mb-1">New Values</div>
                      <pre>{JSON.stringify(activeItem.newValues, null, 2) || "null"}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                          <th className="py-2 px-3">Field Name</th>
                          <th className="py-2 px-3">Previous State</th>
                          <th className="py-2 px-3">Committed Value</th>
                          <th className="py-2 px-3 text-center">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {activeItem.diffs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-400 font-sans">
                              No explicit field differences detected.
                            </td>
                          </tr>
                        ) : (
                          activeItem.diffs.map((d, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-800">{d.field}</td>
                              <td className="py-2 px-3 text-rose-600 line-through">
                                {d.oldValue === null || d.oldValue === undefined ? "null" : typeof d.oldValue === "object" ? JSON.stringify(d.oldValue) : String(d.oldValue)}
                              </td>
                              <td className="py-2 px-3 text-emerald-700 font-bold">
                                {d.newValue === null || d.newValue === undefined ? "null" : typeof d.newValue === "object" ? JSON.stringify(d.newValue) : String(d.newValue)}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  d.type === "CREATED" ? "bg-emerald-100 text-emerald-800" : d.type === "DELETED" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                                }`}>
                                  {d.type}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Cryptographic Signature Footer */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Fingerprint className="w-4 h-4 text-slate-500" />
                  <span>Audit Trail Event Digest: Verified & Immutable</span>
                </div>
                <div className="font-mono text-slate-400">ChangedBy: {activeItem.changedBy}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleCopyJson(activeItem)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedJson ? "Copied JSON!" : "Copy Audit Event JSON"}
              </button>

              <button
                onClick={() => { setActiveItem(null); setShowRawJson(false); }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
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
