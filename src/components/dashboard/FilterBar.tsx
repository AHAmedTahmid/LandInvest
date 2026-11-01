"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import {
  Eye,
  EyeOff,
  RefreshCw,
  Bell,
  SlidersHorizontal,
  Download,
  Calendar,
  Building,
  Check,
} from "lucide-react";

export interface FilterState {
  fiscalYear: string;
  preset: string;
  projectIds: string[];
  compareWithPrevious: boolean;
}

export default function FilterBar({
  filters,
  onChange,
  privacyMode,
  onTogglePrivacy,
  autoRefresh,
  onToggleAutoRefresh,
  lastRefreshedAt,
  insightsCount,
  onOpenInsights,
  onOpenLayoutEditor,
  canCustomize,
  canExport,
  projects = [],
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  lastRefreshedAt: Date | null;
  insightsCount: number;
  onOpenInsights: () => void;
  onOpenLayoutEditor: () => void;
  canCustomize: boolean;
  canExport: boolean;
  projects?: { id: string; projectName: string }[];
}) {
  const { lang } = useLang();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const presets = [
    { key: "today", label: lang === "bn" ? "আজ" : "Today" },
    { key: "month", label: lang === "bn" ? "চলতি মাস" : "This Month" },
    { key: "fy", label: lang === "bn" ? "চলতি অর্থবছর" : "This FY" },
    { key: "all", label: lang === "bn" ? "সব সময়" : "All Time" },
  ];

  const handleExport = () => {
    window.print();
  };

  const toggleProject = (id: string) => {
    let next: string[];
    if (filters.projectIds.includes(id)) {
      next = filters.projectIds.filter((p) => p !== id);
    } else {
      next = [...filters.projectIds, id];
    }
    onChange({ ...filters, projectIds: next });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left side: Date / FY / Project filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* FY Selector */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700">
          <Calendar className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
          <select
            value={filters.fiscalYear}
            onChange={(e) => onChange({ ...filters, fiscalYear: e.target.value })}
            className="bg-transparent border-none text-xs font-semibold focus:outline-hidden cursor-pointer"
          >
            <option value="FY 2026-2027">FY 2026-2027</option>
            <option value="FY 2025-2026">FY 2025-2026</option>
            <option value="FY 2024-2025">FY 2024-2025</option>
          </select>
        </div>

        {/* Date Presets */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200/80">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => onChange({ ...filters, preset: p.key })}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filters.preset === p.key
                  ? "bg-white text-gray-900 shadow-2xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Project Multi-Select Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {filters.projectIds.length === 0
                ? lang === "bn" ? "সকল প্রকল্প" : "All Projects"
                : `${filters.projectIds.length} ${lang === "bn" ? "প্রকল্প নির্বাচিত" : "Selected"}`}
            </span>
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-40 max-h-60 overflow-y-auto">
              <div className="px-3 py-1 font-semibold text-[11px] text-gray-400 uppercase tracking-wider">
                {lang === "bn" ? "প্রকল্প নির্বাচন করুন" : "Filter by Projects"}
              </div>
              <button
                onClick={() => {
                  onChange({ ...filters, projectIds: [] });
                  setProjectDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between text-gray-700"
              >
                <span>{lang === "bn" ? "সব প্রকল্প (রিসেট)" : "All Projects (Clear)"}</span>
                {filters.projectIds.length === 0 && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              {projects.map((p) => {
                const checked = filters.projectIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProject(p.id)}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between text-gray-700 truncate"
                  >
                    <span className="truncate">{p.projectName}</span>
                    {checked && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Utilities (Privacy, Auto-refresh, Insights, Edit Layout, Export) */}
      <div className="flex items-center gap-2">
        {/* Privacy Mode Toggle */}
        <button
          onClick={onTogglePrivacy}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
            privacyMode
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600"
          }`}
          title={privacyMode ? "Privacy mode on (figures masked)" : "Hide financial figures for presentation"}
        >
          {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">
            {privacyMode ? (lang === "bn" ? "ব্যক্তিগত মোড" : "Privacy On") : (lang === "bn" ? "প্রাইভেসি" : "Privacy")}
          </span>
        </button>

        {/* Auto-Refresh Toggle */}
        <button
          onClick={onToggleAutoRefresh}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
            autoRefresh
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-400"
          }`}
          title={autoRefresh ? "Auto-refresh active (every 60s)" : "Auto-refresh paused"}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? "animate-spin-slow" : ""}`} />
          <span className="hidden md:inline">
            {autoRefresh ? "60s" : "Paused"}
          </span>
        </button>

        {/* Insights Notification Bell */}
        <button
          onClick={onOpenInsights}
          className="relative p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg transition-colors"
          title="Smart Insights"
        >
          <Bell className="w-4 h-4" />
          {insightsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
              {insightsCount}
            </span>
          )}
        </button>

        {/* Edit Layout Button */}
        {canCustomize && (
          <button
            onClick={onOpenLayoutEditor}
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
            title="Rearrange or hide widgets"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === "bn" ? "লেআউট" : "Layout"}
            </span>
          </button>
        )}

        {/* Export Button */}
        {canExport && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-olive-700 hover:bg-olive-800 text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors shadow-2xs"
            title="Print or export dashboard"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === "bn" ? "এক্সপোর্ট" : "Export"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
