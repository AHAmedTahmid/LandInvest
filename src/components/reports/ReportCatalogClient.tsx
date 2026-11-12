"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { ReportCategory, ReportDef, ReportFilterField } from "@/lib/reports/registry";
import {
  Search,
  LayoutGrid,
  List,
  Landmark,
  Users,
  Map as MapIcon,
  BadgeDollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  X,
  FileBarChart2,
  SlidersHorizontal,
} from "lucide-react";

export type ReportGroupData = {
  key: ReportCategory;
  labelEn: string;
  labelBn: string;
  reports: ReportDef[];
};

const CATEGORY_STYLE: Record<
  ReportCategory,
  {
    icon: React.ComponentType<{ className?: string }>;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    iconBg: string;
    iconText: string;
  }
> = {
  financial: {
    icon: Landmark,
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
  },
  partners: {
    icon: Users,
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    iconBg: "bg-blue-50",
    iconText: "text-blue-700",
  },
  projects: {
    icon: MapIcon,
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
  },
  sales: {
    icon: BadgeDollarSign,
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    badgeBorder: "border-purple-200",
    iconBg: "bg-purple-50",
    iconText: "text-purple-700",
  },
  profit: {
    icon: TrendingUp,
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    badgeBorder: "border-teal-200",
    iconBg: "bg-teal-50",
    iconText: "text-teal-700",
  },
  audit: {
    icon: ShieldCheck,
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    badgeBorder: "border-slate-300",
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
  },
};

const FILTER_LABELS: Record<ReportFilterField, { en: string; bn: string }> = {
  dateRange: { en: "Date Range", bn: "তারিখ সীমা" },
  project: { en: "Project", bn: "প্রকল্প" },
  partner: { en: "Partner", bn: "অংশীদার" },
  bankAccount: { en: "Bank Account", bn: "ব্যাংক" },
  status: { en: "Status", bn: "অবস্থা" },
  sale: { en: "Sale / Buyer", bn: "বিক্রয় / ক্রেতা" },
  user: { en: "User", bn: "ব্যবহারকারী" },
  table: { en: "Module", bn: "মডিউল" },
  action: { en: "Action", bn: "কার্যকলাপ" },
};

const VIEW_STORAGE_KEY = "landinvest_reports_view_mode";

export default function ReportCatalogClient({ groups }: { groups: ReportGroupData[] }) {
  const { lang } = useLang();
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ReportCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Restore saved view preference on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_STORAGE_KEY);
      if (saved === "grid" || saved === "list") {
        setViewMode(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleSetViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // ignore storage errors
    }
  };

  // Non-empty accessible groups
  const accessibleGroups = useMemo(
    () => groups.filter((g) => g.reports.length > 0),
    [groups]
  );

  const totalReportsCount = useMemo(
    () => accessibleGroups.reduce((acc, g) => acc + g.reports.length, 0),
    [accessibleGroups]
  );

  // Filtered groups based on category selection & search text
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return accessibleGroups
      .filter((g) => selectedCategory === "ALL" || g.key === selectedCategory)
      .map((g) => {
        if (!q) return g;
        const matching = g.reports.filter(
          (r) =>
            r.titleEn.toLowerCase().includes(q) ||
            r.titleBn.toLowerCase().includes(q) ||
            r.descriptionEn.toLowerCase().includes(q) ||
            r.descriptionBn.toLowerCase().includes(q) ||
            r.key.toLowerCase().includes(q)
        );
        return { ...g, reports: matching };
      })
      .filter((g) => g.reports.length > 0);
  }, [accessibleGroups, selectedCategory, searchQuery]);

  const filteredReportsCount = useMemo(
    () => filteredGroups.reduce((acc, g) => acc + g.reports.length, 0),
    [filteredGroups]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-sm">
              <FileBarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {lang === "bn" ? "প্রতিবেদন ও বিশ্লেষণ কেন্দ্র" : "Reports & Intelligence Center"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === "bn"
                  ? "আর্থিক বিবরণী, অংশীদার খাতা, প্রকল্প ব্যয় এবং অডিট প্রতিবেদন দেখুন ও ডাউনলোড করুন"
                  : "Browse financial statements, partner capital ledgers, project analytics, sales registers & audit reports"}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Metric Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            <span>
              {filteredReportsCount === totalReportsCount
                ? `${totalReportsCount} ${lang === "bn" ? "টি প্রতিবেদন" : "Reports Available"}`
                : `${filteredReportsCount} of ${totalReportsCount} ${lang === "bn" ? "টি" : "Reports"}`}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & View Controls Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "প্রতিবেদনের নাম বা বিবরণ দিয়ে খুঁজুন..."
                  : "Search reports by title, topic or description..."
              }
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Preference Switcher */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              {lang === "bn" ? "ভিউ:" : "View:"}
            </span>
            <div
              role="group"
              aria-label="View mode preference"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80"
            >
              <button
                type="button"
                onClick={() => handleSetViewMode("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/70"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "গ্রিড" : "Grid View"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetViewMode("list")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/70"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "তালিকা" : "List View"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1.5 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            {lang === "bn" ? "বিভাগ:" : "Category:"}
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              selectedCategory === "ALL"
                ? "bg-brand-700 text-white border-brand-700 shadow-2xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {lang === "bn" ? "সকল বিভাগ" : "All Categories"} ({totalReportsCount})
          </button>

          {accessibleGroups.map((cat) => {
            const Icon = CATEGORY_STYLE[cat.key].icon;
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  active
                    ? "bg-brand-700 text-white border-brand-700 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? cat.labelBn : cat.labelEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.reports.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty Search Result State */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === "bn" ? "কোনো প্রতিবেদন পাওয়া যায়নি" : "No matching reports found"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === "bn"
                ? "অনুগ্রহ করে অন্য শব্দ বা বিভাগ দিয়ে অনুসন্ধান করুন।"
                : "Try adjusting your search query or switching back to all categories."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-700 text-white text-xs font-semibold hover:bg-brand-600 transition"
          >
            {lang === "bn" ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredGroups.map((cat) => {
            const style = CATEGORY_STYLE[cat.key];
            const CatIcon = style.icon;

            return (
              <section key={cat.key} className="space-y-3">
                {/* Category Heading */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg ${style.iconBg} ${style.iconText} border ${style.badgeBorder} flex items-center justify-center`}
                    >
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-slate-800">
                      {lang === "bn" ? cat.labelBn : cat.labelEn}
                    </h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {cat.reports.length}
                    </span>
                  </div>
                </div>

                {/* GRID VIEW */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.reports.map((r) => (
                      <Link
                        key={r.key}
                        href={`/reports/${r.key}`}
                        className="group bg-white rounded-xl border border-slate-200 shadow-2xs p-4.5 hover:shadow-md hover:border-brand-600 transition flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-700 transition leading-snug">
                              {lang === "bn" ? r.titleBn : r.titleEn}
                            </h3>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition shrink-0 mt-0.5" />
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {lang === "bn" ? r.descriptionBn : r.descriptionEn}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1 flex-wrap">
                            {r.filters.length > 0 ? (
                              r.filters.slice(0, 3).map((f) => (
                                <span
                                  key={f}
                                  className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                                >
                                  {lang === "bn" ? FILTER_LABELS[f].bn : FILTER_LABELS[f].en}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">
                                {lang === "bn" ? "সারাংশ প্রতিবেদন" : "Summary View"}
                              </span>
                            )}
                            {r.filters.length > 3 && (
                              <span className="text-[10px] font-medium text-slate-400">
                                +{r.filters.length - 3}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-brand-700 opacity-0 group-hover:opacity-100 transition">
                            {lang === "bn" ? "খুলুন" : "Open"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* LIST VIEW */
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100">
                    {cat.reports.map((r) => (
                      <Link
                        key={r.key}
                        href={`/reports/${r.key}`}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 hover:bg-brand-50/40 transition"
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-8 h-8 rounded-lg ${style.iconBg} ${style.iconText} border ${style.badgeBorder} flex items-center justify-center shrink-0 mt-0.5 sm:mt-0`}
                          >
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-700 transition truncate">
                              {lang === "bn" ? r.titleBn : r.titleEn}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {lang === "bn" ? r.descriptionBn : r.descriptionEn}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-11 sm:pl-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            {r.filters.length > 0 ? (
                              r.filters.map((f) => (
                                <span
                                  key={f}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                                >
                                  {lang === "bn" ? FILTER_LABELS[f].bn : FILTER_LABELS[f].en}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">
                                {lang === "bn" ? "সারাংশ" : "Summary"}
                              </span>
                            )}
                          </div>

                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 group-hover:border-brand-600 group-hover:bg-brand-700 group-hover:text-white transition">
                            <span>{lang === "bn" ? "দেখুন" : "Open"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
