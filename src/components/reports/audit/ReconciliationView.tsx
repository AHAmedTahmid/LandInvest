"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Download,
  X,
  ChevronRight,
  TrendingUp,
  Landmark,
  FileCheck,
  Building2,
  PieChart,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  ReconciliationResult,
  ReconciliationCheckItem,
  ReconciliationVector,
} from "@/lib/reports/reconciliation";

interface ReconciliationViewProps {
  def: ReportDef;
  data: ReconciliationResult;
  canExport?: boolean;
}

export default function ReconciliationView({
  def,
  data,
  canExport = true,
}: ReconciliationViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVector, setSelectedVector] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCheck, setSelectedCheck] = useState<ReconciliationCheckItem | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const kpis = data.kpis || {
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    warningChecks: 0,
    overallHealthScore: 100,
    totalVarianceAmount: 0,
    vectorsEvaluatedCount: 4,
  };

  const vectorSummaries = data.vectorSummaries || [];
  const items = data.items || [];

  // Filter items based on search, vector and status
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedVector !== "ALL" && item.vector !== selectedVector) return false;
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.checkTitleEn.toLowerCase().includes(q) ||
        item.checkTitleBn.toLowerCase().includes(q) ||
        item.vectorLabelEn.toLowerCase().includes(q) ||
        item.detailsEn.toLowerCase().includes(q)
      );
    });
  }, [items, selectedVector, selectedStatus, searchQuery]);

  const handleCopyFinding = (chk: ReconciliationCheckItem) => {
    const text = `LandInvest Financial Integrity & Reconciliation Finding:
Check: ${chk.checkTitleEn} (${chk.vectorLabelEn})
Status: ${chk.status} [Severity: ${chk.severity}]
Expected Value: ${chk.expectedDisplay}
Actual Recorded: ${chk.actualDisplay}
Variance: ${chk.varianceDisplay}
Details: ${chk.detailsEn}
Recommendation: ${chk.recommendationEn}`;
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getVectorIcon = (vector: ReconciliationVector) => {
    switch (vector) {
      case "TREASURY":
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case "SALES":
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case "EXPENSES":
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case "EQUITY":
        return <PieChart className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{def.titleEn}</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Audit & Data Governance
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
                href="/api/reports/reconciliation?format=pdf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </a>
              <a
                href="/api/reports/reconciliation?format=excel"
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

      {/* 2. MACRO KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: System Integrity Health Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              System Health Score
            </span>
            <span
              className={`p-2 rounded-lg ${
                kpis.overallHealthScore >= 95
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono tracking-tight ${
                kpis.overallHealthScore >= 95 ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {kpis.overallHealthScore.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500">integrity index</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Across all 4 financial vectors</span>
          </div>
        </div>

        {/* KPI 2: Evaluated Checks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Evaluated Checks
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {kpis.totalChecks}
            </span>
            <span className="text-xs text-slate-500">automated tests</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span className="font-semibold text-emerald-700">{kpis.passedChecks} Passed</span>
            <span>•</span>
            <span className="font-semibold text-slate-500">
              {kpis.warningChecks} Warnings
            </span>
          </div>
        </div>

        {/* KPI 3: Status Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Failed Checks
            </span>
            <span
              className={`p-2 rounded-lg ${
                kpis.failedChecks === 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {kpis.failedChecks === 0 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono tracking-tight ${
                kpis.failedChecks === 0 ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {kpis.failedChecks}
            </span>
            <span className="text-xs text-slate-500">discrepancies</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            {kpis.failedChecks === 0 ? (
              <span className="text-emerald-700 font-semibold">Zero critical failures</span>
            ) : (
              <span className="text-red-600 font-semibold">Action required</span>
            )}
          </div>
        </div>

        {/* KPI 4: Unreconciled Variance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Unreconciled Variance
            </span>
            <span className="p-2 bg-slate-50 text-slate-600 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              ৳ {new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2 }).format(kpis.totalVarianceAmount)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Net monetary ledger variance</span>
          </div>
        </div>
      </div>

      {/* 3. FOUR CORE INTEGRITY VECTORS STRIP */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Integrity Vectors Assessment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vectorSummaries.map((v) => (
            <button
              key={v.vector}
              onClick={() => setSelectedVector(selectedVector === v.vector ? "ALL" : v.vector)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedVector === v.vector
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getVectorIcon(v.vector)}
                  <span className="text-xs font-bold text-slate-800">{v.labelEn}</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  {v.healthPercent}%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Passed: <strong className="text-slate-800 font-mono">{v.passedChecks}</strong> / {v.totalChecks}
                </span>
                {v.failedChecks > 0 ? (
                  <span className="text-red-600 font-semibold">{v.failedChecks} Failed</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">100% In Sync</span>
                )}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${v.healthPercent}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. RECONCILIATION CHECKS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">Multi-Vector Data Reconciliation Register</h3>
            <p className="text-xs text-slate-500">
              Cross-table automated balancing tests and mathematical constraint evaluations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search check, module, details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Status Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              {["ALL", "PASS", "WARNING", "FAIL"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    selectedStatus === st
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Checks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Integrity Vector</th>
                <th className="py-3 px-4">Reconciliation Check</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Expected Standard</th>
                <th className="py-3 px-4 text-right">Actual Recorded</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No reconciliation checks match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((chk) => (
                  <tr
                    key={chk.id}
                    onClick={() => setSelectedCheck(chk)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getVectorIcon(chk.vector)}
                        <span>{chk.vectorLabelEn}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{chk.checkTitleEn}</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-sm">
                        {chk.detailsEn}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                          chk.status === "PASS"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : chk.status === "WARNING"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {chk.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700">
                      {chk.expectedDisplay}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                      {chk.actualDisplay}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span
                        className={
                          chk.status === "PASS"
                            ? "text-emerald-700"
                            : chk.status === "WARNING"
                            ? "text-amber-700"
                            : "text-red-700"
                        }
                      >
                        {chk.varianceDisplay}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center text-xs font-semibold">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. INTERACTIVE RECONCILIATION DOSSIER MODAL */}
      {selectedCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span
                  className={`p-3 rounded-xl ${
                    selectedCheck.status === "PASS"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedCheck.status === "WARNING"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedCheck.status === "PASS" ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : selectedCheck.status === "WARNING" ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <ShieldAlert className="w-6 h-6" />
                  )}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {selectedCheck.vectorLabelEn}
                    </span>
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.2 rounded-full ${
                        selectedCheck.status === "PASS"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : selectedCheck.status === "WARNING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {selectedCheck.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedCheck.checkTitleEn}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCheck(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Value Comparison Matrix */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Expected Standard
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1">
                    {selectedCheck.expectedDisplay}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Actual Recorded
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1">
                    {selectedCheck.actualDisplay}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Variance</div>
                  <div
                    className={`text-sm font-mono font-bold mt-1 ${
                      selectedCheck.status === "PASS"
                        ? "text-emerald-700"
                        : selectedCheck.status === "WARNING"
                        ? "text-amber-700"
                        : "text-red-700"
                    }`}
                  >
                    {selectedCheck.varianceDisplay}
                  </div>
                </div>
              </div>

              {/* Technical Audit Findings */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Technical Audit Findings
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p>{selectedCheck.detailsEn}</p>
                  <p className="text-slate-500 text-[11px] font-bangla border-t border-slate-200 pt-2">
                    {selectedCheck.detailsBn}
                  </p>
                </div>
              </div>

              {/* Corrective Action Recommendation */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Compliance Recommendation
                </h4>
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
                  <ArrowRight className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-indigo-900">Recommended Action:</p>
                    <p className="text-indigo-800 mt-0.5">{selectedCheck.recommendationEn}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => handleCopyFinding(selectedCheck)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Finding</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Reconciliation Finding</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedCheck(null)}
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
