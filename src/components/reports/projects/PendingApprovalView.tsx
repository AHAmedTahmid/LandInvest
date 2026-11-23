"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import type { ReportDef } from "@/lib/reports/registry";
import type {
  PendingApprovalData,
  PendingApprovalItem,
  PendingAgingBucket,
} from "@/lib/reports/pending-approval";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Search,
  Building2,
  Landmark,
  Wallet,
  Users,
  Eye,
  Receipt,
  FileText,
  ShieldAlert,
  ArrowUpDown,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: PendingApprovalData;
  filters: {
    projectId?: string;
    channel?: string;
    category?: string;
    agingBucket?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function PendingApprovalView({ def, data, filters, projects, canExport = true }: Props) {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBn = lang === "bn";

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(filters.projectId || "ALL");
  const [selectedChannel, setSelectedChannel] = useState(filters.channel || "ALL");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "ALL");
  const [selectedBucket, setSelectedBucket] = useState(filters.agingBucket || "ALL");
  const [sortField, setSortField] = useState<"age" | "amount" | "date" | "project">("age");
  const [sortAsc, setSortAsc] = useState(false); // default to oldest first

  // Interactive Verification Modal State
  const [activeVoucher, setActiveVoucher] = useState<PendingApprovalItem | null>(null);

  // Available categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    data.items.forEach((it) => set.add(it.category));
    return Array.from(set).sort();
  }, [data.items]);

  // Client-side filtering & sorting
  const filteredItems = useMemo(() => {
    return data.items
      .filter((it) => {
        if (selectedProject !== "ALL") {
          if (selectedProject === "GENERAL" && it.projectId) return false;
          if (selectedProject !== "GENERAL" && it.projectId !== selectedProject) return false;
        }
        if (selectedChannel !== "ALL" && it.channel !== selectedChannel) return false;
        if (selectedCategory !== "ALL" && it.category !== selectedCategory) return false;
        if (selectedBucket !== "ALL") {
          if (selectedBucket === "0_7" && it.ageDays > 7) return false;
          if (selectedBucket === "8_14" && (it.ageDays < 8 || it.ageDays > 14)) return false;
          if (selectedBucket === "15_30" && (it.ageDays < 15 || it.ageDays > 30)) return false;
          if (selectedBucket === "30_plus" && it.ageDays <= 30) return false;
        }

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchVoucher = it.voucherNo.toLowerCase().includes(q);
          const matchProj = it.projectName.toLowerCase().includes(q);
          const matchCat = it.category.toLowerCase().includes(q);
          const matchDesc = it.description.toLowerCase().includes(q);
          const matchPayee = it.payee.toLowerCase().includes(q);
          const matchPostedBy = it.postedBy.toLowerCase().includes(q);
          if (!matchVoucher && !matchProj && !matchCat && !matchDesc && !matchPayee && !matchPostedBy) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === "age") {
          return sortAsc ? a.ageDays - b.ageDays : b.ageDays - a.ageDays;
        }
        if (sortField === "amount") {
          return sortAsc ? a.amount - b.amount : b.amount - a.amount;
        }
        if (sortField === "date") {
          const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
          return sortAsc ? diff : -diff;
        }
        if (sortField === "project") {
          return sortAsc ? a.projectName.localeCompare(b.projectName) : b.projectName.localeCompare(a.projectName);
        }
        return 0;
      });
  }, [data.items, selectedProject, selectedChannel, selectedCategory, selectedBucket, search, sortField, sortAsc]);

  // Filtered Totals
  const filteredTotal = useMemo(() => filteredItems.reduce((acc, it) => acc + it.amount, 0), [filteredItems]);
  const filteredAvgAge = useMemo(
    () => (filteredItems.length > 0 ? filteredItems.reduce((acc, it) => acc + it.ageDays, 0) / filteredItems.length : 0),
    [filteredItems]
  );
  const filteredHighRiskCount = useMemo(
    () => filteredItems.filter((it) => it.ageDays >= 15).length,
    [filteredItems]
  );
  const filteredHighRiskAmount = useMemo(
    () => filteredItems.filter((it) => it.ageDays >= 15).reduce((acc, it) => acc + it.amount, 0),
    [filteredItems]
  );

  const applyUrlFilters = (newParams: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === undefined || v === "ALL" || v === "") {
        sp.delete(k);
      } else {
        sp.set(k, v);
      }
    });
    router.push(`/reports/${def.key}?${sp.toString()}`);
  };

  const handleExportCsv = () => {
    const headers = [
      "Voucher No",
      "Expense Date",
      "Project",
      "Mouza",
      "Category",
      "Classification",
      "Description",
      "Channel",
      "Account / Source",
      "Submitted By",
      "Age (Days)",
      "Aging Severity",
      "Amount (BDT)",
    ];
    const rows = filteredItems.map((r) => [
      `"${r.voucherNo.replace(/"/g, '""')}"`,
      new Date(r.date).toISOString().slice(0, 10),
      `"${r.projectName.replace(/"/g, '""')}"`,
      `"${(r.mouza || "").replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      r.categoryClassification,
      `"${r.description.replace(/"/g, '""')}"`,
      r.channel,
      `"${(r.bankAccountName || r.paidByPartnerName || r.payee || "").replace(/"/g, '""')}"`,
      `"${r.postedBy.replace(/"/g, '""')}"`,
      r.ageDays,
      r.agingSeverity,
      r.amount.toFixed(2),
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Pending_Approval_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBdt = (n: number) => {
    return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  };

  const formatDate = (d: string | Date) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return String(d);
    }
  };

  const formatDateTime = (d: string | Date) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(d);
    }
  };

  const toggleSort = (field: "age" | "amount" | "date" | "project") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>{isBn ? "ল্যান্ড প্রজেক্টস রিপোর্টস" : "Land Projects Reports"}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600">{isBn ? "অনুমোদনের অপেক্ষায় ব্যয়" : "Pending Approval"}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isBn ? "অনুমোদনের অপেক্ষায় থাকা ব্যয়ের প্রতিবেদন ও এজিং কিউ" : "Pending Approval Report & Aging Queue"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isBn
                ? "প্রকল্প ব্যয়ের অভ্যন্তরীণ অডিট অনুমোদন, পেমেন্ট ছাড় এবং দিনভিত্তিক বিলম্ব বিশ্লেষণ"
                : "Internal control verification queue of pending project vouchers, treasury release, and latency aging analysis"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {canExport && (
              <>
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
                  title="Export filtered records to CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? "সিএসভি এক্সপোর্ট" : "Export CSV"}</span>
                </button>
                <a
                  href={`/api/reports/${def.key}?${searchParams.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-xs"
                  title="Print official A4 landscape PDF report"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isBn ? "প্রিন্ট / পিডিএফ" : "Print / PDF"}</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {/* Project Selector */}
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              applyUrlFilters({ projectId: e.target.value });
            }}
            aria-label={isBn ? "প্রকল্প ফিল্টার" : "Project filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল প্রকল্প (All Projects)" : "All Projects"}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName}
              </option>
            ))}
            <option value="GENERAL">{isBn ? "সাধারণ ব্যয় (General Overhead)" : "General Overhead"}</option>
          </select>

          {/* Aging Bucket Selector */}
          <select
            value={selectedBucket}
            onChange={(e) => {
              setSelectedBucket(e.target.value);
              applyUrlFilters({ agingBucket: e.target.value });
            }}
            aria-label={isBn ? "বিলম্ব স্তর ফিল্টার" : "Aging latency filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল বিলম্ব স্তর (All Aging)" : "All Aging Buckets"}</option>
            <option value="0_7">{isBn ? "০ - ৭ দিন (চলতি চক্র)" : "0 - 7 Days (Current)"}</option>
            <option value="8_14">{isBn ? "৮ - ১৪ দিন (যাচাইযোগ্য)" : "8 - 14 Days (Review Due)"}</option>
            <option value="15_30">{isBn ? "১৫ - ৩০ দিন (বিলম্বিত)" : "15 - 30 Days (High Latency)"}</option>
            <option value="30_plus">{isBn ? "৩০+ দিন (গুরুতর বিলম্ব)" : "30+ Days (Critical)"}</option>
          </select>

          {/* Payment Channel Selector */}
          <select
            value={selectedChannel}
            onChange={(e) => {
              setSelectedChannel(e.target.value);
              applyUrlFilters({ channel: e.target.value });
            }}
            aria-label={isBn ? "পেমেন্ট মাধ্যম ফিল্টার" : "Payment channel filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল চ্যানেল (All Channels)" : "All Channels"}</option>
            <option value="BANK">{isBn ? "ব্যাংক একাউন্ট (Bank Account)" : "Bank Account"}</option>
            <option value="CASH">{isBn ? "নগদ পেটি ক্যাশ (Petty Cash)" : "Petty Cash"}</option>
            <option value="PAID_BY_PARTNER">{isBn ? "অংশীদার প্রদত্ত (Paid by Partner)" : "Paid by Partner"}</option>
            <option value="MFS">{isBn ? "মোবাইল ব্যাংকিং (MFS)" : "MFS"}</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              applyUrlFilters({ category: e.target.value });
            }}
            aria-label={isBn ? "ব্যয় খাত ফিল্টার" : "Expense category filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল খাত (All Categories)" : "All Categories"}</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBn ? "ভাউচার নং, বিবরণ, প্রকল্প, প্রস্তুতকারী অনুসন্ধান..." : "Search voucher no, description, project, submitter..."}
              className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-brand-600 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total In Pending Queue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "অপেক্ষমান মোট অর্থায়ন" : "Total Pending Outflow"}</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
            {formatBdt(filteredTotal)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "অপেক্ষমান ভাউচার সংখ্যা" : "Pending Vouchers"}</span>
            <span className="font-semibold font-mono text-slate-700">{filteredItems.length} pcs</span>
          </div>
        </div>

        {/* Average Approval Latency */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "গড় অনুমোদন বিলম্ব" : "Average Aging"}</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {filteredAvgAge.toFixed(1)} <span className="text-sm font-normal text-slate-500">{isBn ? "দিন" : "Days"}</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "সর্বোচ্চ বিলম্ব" : "Max Latency"}</span>
            <span className="font-semibold font-mono text-slate-700">{data.kpis.maxAgeDays} days</span>
          </div>
        </div>

        {/* High & Critical Latency */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "উচ্চ বিলম্ব ঝুঁকি (>১৪ দিন)" : "Escalation Risk (>14d)"}</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-rose-700">
            {formatBdt(filteredHighRiskAmount)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "জরুরি যাচাইযোগ্য" : "Urgent Attention"}</span>
            <span className="font-semibold font-mono text-rose-600">{filteredHighRiskCount} pcs</span>
          </div>
        </div>

        {/* Pending Bank Release */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "ব্যাংক ছাড় অপেক্ষমান" : "Pending Bank Release"}</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Landmark className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-purple-700">
            {formatBdt(data.kpis.bankAmount)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "ঠিকাদার বিল / ট্রান্সফার" : "Contractor Invoices"}</span>
            <span className="font-semibold font-mono text-purple-600">{data.kpis.bankCount} pcs</span>
          </div>
        </div>
      </div>

      {/* 3. Aging Buckets & Project Backlog Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aging Buckets Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {isBn ? "বিলম্ব স্তরভিত্তিক বিশ্লেষণ (Aging Buckets Analysis)" : "Approval Aging Buckets & Risk Distribution"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? "ভাউচার ইস্যু তারিখ থেকে অনুমোদন অপেক্ষার সময়কাল" : "Elapsed days since voucher issuance without executive sign-off"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-medium font-mono">
                {filteredItems.length} {isBn ? "টি ভাউচার" : "Vouchers"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.agingBuckets.map((b) => {
              const borderClass =
                b.severity === "CRITICAL"
                  ? "border-rose-200 bg-rose-50/40"
                  : b.severity === "HIGH"
                  ? "border-orange-200 bg-orange-50/40"
                  : b.severity === "MODERATE"
                  ? "border-amber-200 bg-amber-50/40"
                  : "border-emerald-200 bg-emerald-50/40";

              const badgeColor =
                b.severity === "CRITICAL"
                  ? "text-rose-700 bg-rose-100"
                  : b.severity === "HIGH"
                  ? "text-orange-700 bg-orange-100"
                  : b.severity === "MODERATE"
                  ? "text-amber-700 bg-amber-100"
                  : "text-emerald-700 bg-emerald-100";

              return (
                <div
                  key={b.bucketKey}
                  onClick={() => {
                    setSelectedBucket(selectedBucket === b.bucketKey ? "ALL" : b.bucketKey);
                  }}
                  className={`p-3.5 rounded-xl border ${borderClass} cursor-pointer hover:shadow-xs transition ${
                    selectedBucket === b.bucketKey ? "ring-2 ring-brand-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">{isBn ? b.labelBn : b.labelEn}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${badgeColor}`}>
                      {b.count} pcs
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {formatBdt(b.amount)}
                  </div>
                  <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        b.severity === "CRITICAL"
                          ? "bg-rose-500"
                          : b.severity === "HIGH"
                          ? "bg-orange-500"
                          : b.severity === "MODERATE"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>{b.percentage.toFixed(1)}% of pending queue</span>
                    {selectedBucket === b.bucketKey && <span className="font-bold text-brand-600">Active Filter</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Backlog Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {isBn ? "প্রকল্পভিত্তিক অপেক্ষমান বিল" : "Project Approval Backlog"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn ? "যেসব প্রকল্পে সর্বাধিক বিল ছাড়ের অপেক্ষায় রয়েছে" : "Projects with highest volume of unapproved contractor bills"}
            </p>

            <div className="mt-4 space-y-2.5">
              {data.projectDistribution.map((p) => (
                <div
                  key={p.projectId}
                  onClick={() => setSelectedProject(selectedProject === p.projectId ? "ALL" : p.projectId)}
                  className={`p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer ${
                    selectedProject === p.projectId ? "ring-2 ring-brand-500 bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{p.projectName}</span>
                    <span className="font-bold font-mono text-slate-900">{formatBdt(p.amount)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{p.count} vouchers</span>
                    <span>Avg {p.avgAgeDays} days latency</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900">
            <span className="font-semibold">{isBn ? "অডিট সতর্কবার্তা:" : "Audit Alert:"}</span>{" "}
            {isBn
              ? "১৫ দিনের অধিক বিলম্বিত বিলসমূহ ঠিকাদারের সাইট অগ্রগতি ব্যাহত করতে পারে। দ্রুত অনুমোদন আবশ্যক।"
              : "Vouchers aged >14 days risk site contractor stoppages and require immediate executive sign-off."}
          </div>
        </div>
      </div>

      {/* 4. Master Pending Approval Queue Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? "অনুমোদনের অপেক্ষায় ভাউচার কিউ" : "Pending Vouchers Verification Queue"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? `প্রদর্শিত হচ্ছে ${filteredItems.length} টি ভাউচার (ক্লিক করে বিস্তারিত রসিদ ও ভাউচার যাচাই করুন)`
                : `Showing ${filteredItems.length} pending vouchers (click any row to inspect invoice & verify attachment)`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-mono">
              {isBn ? "মোট অপেক্ষমান:" : "Queue Total:"} {formatBdt(filteredTotal)}
            </div>
            <Link
              href="/expenses"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
            >
              <span>{isBn ? "অ্যাকশন কিউ খুলুন" : "Open Action Queue"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">{isBn ? "ভাউচার নং" : "Voucher #"}</th>
                <th
                  onClick={() => toggleSort("date")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isBn ? "ব্যয়ের তারিখ" : "Date"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("project")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isBn ? "প্রকল্প ও মৌজা" : "Project & Mouza"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">{isBn ? "ব্যয় খাত ও শ্রেণী" : "Category Head"}</th>
                <th className="py-3 px-4 min-w-[200px]">{isBn ? "বিবরণ / পার্টিকুলারস" : "Description / Invoice Details"}</th>
                <th className="py-3 px-4">{isBn ? "মাধ্যম ও প্রাপক" : "Channel / Payee"}</th>
                <th className="py-3 px-4">{isBn ? "প্রস্তুতকারী" : "Submitted By"}</th>
                <th
                  onClick={() => toggleSort("age")}
                  className="py-3 px-4 text-center cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{isBn ? "বয়স / বিলম্ব" : "Age (Days)"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("amount")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isBn ? "পরিমাণ (টাকা)" : "Amount (BDT)"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">
                      {isBn ? "কোনো অনুমোদন অপেক্ষমান ভাউচার নেই!" : "Zero Pending Vouchers in this selection!"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isBn ? "সকল ভাউচার অনুমোদিত বা ফিল্টার পরিবর্তন করুন" : "All vouchers in this criteria have been approved or cleared"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => {
                  const severityClass =
                    it.agingSeverity === "CRITICAL"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : it.agingSeverity === "HIGH"
                      ? "bg-orange-50 text-orange-700 border-orange-200"
                      : it.agingSeverity === "MODERATE"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200";

                  const catClassBadge =
                    it.categoryClassification === "ACQUISITION"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : it.categoryClassification === "CIVIL_INFRASTRUCTURE"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : it.categoryClassification === "SITE_OVERHEADS"
                      ? "bg-purple-50 text-purple-800 border-purple-200"
                      : "bg-slate-50 text-slate-700 border-slate-200";

                  return (
                    <tr
                      key={it.id}
                      onClick={() => setActiveVoucher(it)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Voucher No */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-colors" />
                          <span>{it.voucherNo}</span>
                          {it.voucherImageUrl && (
                            <span className="p-0.5 bg-blue-50 text-blue-600 rounded text-[10px]" title="Voucher slip attached">
                              <Receipt className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {formatDate(it.date)}
                      </td>

                      {/* Project */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{it.projectName}</div>
                        {it.mouza && <div className="text-[11px] text-slate-400 font-mono">{it.mouza}</div>}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{it.category}</div>
                        <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${catClassBadge}`}>
                          {it.categoryClassification === "ACQUISITION"
                            ? isBn ? "অধিগ্রহণ" : "Acquisition"
                            : it.categoryClassification === "CIVIL_INFRASTRUCTURE"
                            ? isBn ? "সিভিল" : "Civil Works"
                            : it.categoryClassification === "SITE_OVERHEADS"
                            ? isBn ? "পরিচালন" : "Overheads"
                            : isBn ? "সাধারণ" : "General"}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <p className="line-clamp-2 text-xs" title={it.description}>
                          {it.description}
                        </p>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {it.channel === "BANK" ? (
                            <Landmark className="w-3.5 h-3.5 text-blue-600" />
                          ) : it.channel === "CASH" ? (
                            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                          ) : it.channel === "PAID_BY_PARTNER" ? (
                            <Users className="w-3.5 h-3.5 text-purple-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span className="font-semibold text-slate-800">
                            {it.channel === "PAID_BY_PARTNER"
                              ? isBn ? "অংশীদার" : "Partner"
                              : it.channel === "BANK"
                              ? isBn ? "ব্যাংক" : "Bank"
                              : it.channel === "CASH"
                              ? isBn ? "নগদ" : "Cash"
                              : it.channel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-[150px]" title={it.payee}>
                          {it.paidByPartnerName || it.bankAccountName || it.payee}
                        </div>
                      </td>

                      {/* Submitted By */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-500">
                        <div className="font-medium text-slate-800">{it.postedBy}</div>
                        <div className="text-slate-400 font-mono text-[10px]">{formatDateTime(it.postedAt)}</div>
                      </td>

                      {/* Aging Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono border ${severityClass}`}>
                          <Clock className="w-3 h-3" />
                          <span>{it.ageDays} {isBn ? "দিন" : "Days"}</span>
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-[13px]">
                        {formatBdt(it.amount)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap text-slate-400 group-hover:text-brand-600 transition">
                        <Eye className="w-4 h-4 mx-auto" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Footer */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-semibold text-slate-900 text-xs">
              <tr>
                <td colSpan={3} className="py-4 px-4 font-bold text-slate-900">
                  {isBn ? "মোট অপেক্ষমান ব্যয়ের পরিমাণ" : "Total Pending Approval Queue"}
                </td>
                <td colSpan={4} className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                  {isBn
                    ? `মোট ভাউচার: ${filteredItems.length} টি | গড় বিলম্ব: ${filteredAvgAge.toFixed(1)} দিন | উচ্চ ঝুঁকি (>১৪ দিন): ${filteredHighRiskCount} টি`
                    : `Vouchers: ${filteredItems.length} pcs | Avg Latency: ${filteredAvgAge.toFixed(1)} days | High Latency (>14d): ${filteredHighRiskCount} pcs`}
                </td>
                <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                  Avg {filteredAvgAge.toFixed(1)}d
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-base text-amber-700">
                  {formatBdt(filteredTotal)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. Statutory Disclosure & Compliance Notice */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl mt-0.5">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <h3 className="font-semibold text-slate-900">
              {isBn
                ? "দ্বৈত অনুমোদন নীতি ও নিরীক্ষা মানদণ্ড (Dual-Authorization Control Protocol)"
                : "Dual-Authorization Control Protocol & Statutory Compliance"}
            </h3>
            <p>
              {isBn
                ? "রিয়েল এস্টেট উন্নয়ন ও ব্যবস্থাপনা আইন, ২০১০ (২০১০ সনের ২০ নং আইন)-এর বিধান এবং আইসিএবি অডিট কাঠামোর অধীনে প্রতিটি প্রকল্প ব্যয় ছাড়ের পূর্বে ফিল্ড অফিসার কর্তৃক প্রস্তুত এবং অভ্যন্তরীণ নিরীক্ষক বা ব্যবস্থাপনা অংশীদার কর্তৃক যাচাইকৃত হতে হবে।"
                : "Under Section 15 of Act No. 20 of 2010 and standard syndicate accounting controls, every project expenditure must be verified by the Maker (Field/Site Officer) and officially authorized by the Checker (Internal Auditor or Managing Partner) prior to treasury settlement."}
            </p>
            <p className="text-slate-400 text-[11px]">
              {isBn
                ? "অনুমোদনের পূর্বে কোনো অর্থ ট্রেজারি হিসাব থেকে চূড়ান্ত ব্যয় হিসেবে গণ্য করা হবে না।"
                : "Unapproved vouchers remain in suspense and do not reduce audited cash balances until formal management authorization."}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Executive Signature Block */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
          {isBn ? "কর্তৃপক্ষের স্বাক্ষর ও অডিট যাচাইকরণ" : "Executive Signatures & Internal Audit Sign-off"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6">
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "প্রস্তুতকারী ফিল্ড অফিসার" : "Field Officer / Site Accountant"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "সাইট অ্যাকাউন্টস কিউ" : "Site Accounts Queue"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "অভ্যন্তরীণ নিরীক্ষক" : "Head of Internal Audit"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "যাচাই ও সুপারিশ" : "Verification & Review"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "ব্যবস্থাপনা পরিচালক / প্রধান অংশীদার" : "Managing Director / Partner"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "চূড়ান্ত অর্থায়ন অনুমোদন" : "Executive Treasury Release"}</p>
          </div>
        </div>
      </div>

      {/* 7. Interactive Voucher Verification Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? "অপেক্ষমান ভাউচার যাচাইকরণ" : "Pending Voucher Verification"}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">{activeVoucher.voucherNo}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveVoucher(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Top Banner Amount */}
              <div className="bg-amber-950 text-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-amber-300 uppercase font-semibold">
                    {isBn ? "অনুমোদনের অপেক্ষায় বিল" : "Awaiting Authorization"}
                  </p>
                  <p className="text-2xl font-bold font-mono tracking-tight text-white mt-0.5">
                    {formatBdt(activeVoucher.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    {activeVoucher.ageDays} {isBn ? "দিন যাবৎ অপেক্ষমান" : "Days Aging"}
                  </span>
                  <p className="text-[11px] text-amber-200 mt-1 font-mono">{formatDate(activeVoucher.date)}</p>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-slate-400 font-medium">{isBn ? "প্রকল্প" : "Project"}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{activeVoucher.projectName}</p>
                  {activeVoucher.mouza && <p className="text-slate-500 text-[11px]">{activeVoucher.mouza}</p>}
                </div>
                <div>
                  <p className="text-slate-400 font-medium">{isBn ? "ব্যয় খাত" : "Category Head"}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{activeVoucher.category}</p>
                  <p className="text-slate-500 text-[11px] font-mono">{activeVoucher.categoryClassification}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">{isBn ? "পরিশোধ মাধ্যম" : "Payment Channel"}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{activeVoucher.channel}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">{isBn ? "প্রাপক / ব্যাংক / উৎস" : "Payee / Source"}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {activeVoucher.paidByPartnerName || activeVoucher.bankAccountName || activeVoucher.payee}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-medium mb-1">{isBn ? "ব্যয়ের বিবরণ / চালান নোট" : "Particulars / Invoice Notes"}</p>
                <p className="text-slate-800 leading-relaxed font-normal">{activeVoucher.description}</p>
              </div>

              {/* Audit Stamp */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <div>
                  <p className="text-slate-400 font-medium">{isBn ? "প্রস্তুতকারী" : "Submitted By"}</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{activeVoucher.postedBy}</p>
                  <p className="text-slate-500 font-mono text-[10px]">{formatDateTime(activeVoucher.postedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-medium">{isBn ? "বিলম্ব স্তর" : "Latency Severity"}</p>
                  <p className={`font-bold mt-0.5 ${
                    activeVoucher.agingSeverity === "CRITICAL"
                      ? "text-rose-600"
                      : activeVoucher.agingSeverity === "HIGH"
                      ? "text-orange-600"
                      : activeVoucher.agingSeverity === "MODERATE"
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}>
                    {activeVoucher.agingSeverity}
                  </p>
                </div>
              </div>

              {/* Voucher Image / Receipt Attachment */}
              {activeVoucher.voucherImageUrl ? (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      {isBn ? "সংযুক্ত রসিদ / ভাউচার স্লিপ" : "Attached Voucher Slip"}
                    </span>
                    <a
                      href={activeVoucher.voucherImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700 flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <span>{isBn ? "পূর্ণ আকারে দেখুন" : "View Full Size"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="max-h-48 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                    <img
                      src={activeVoucher.voucherImageUrl}
                      alt="Voucher Receipt"
                      className="max-h-48 object-contain w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                  <Receipt className="w-5 h-5 mx-auto mb-1 opacity-50" />
                  <span>{isBn ? "কোনো ডিজিটাল রসিদ সংযুক্ত নেই" : "No receipt slip attachment uploaded for this voucher"}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <Link
                href="/expenses"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-xs"
              >
                <span>{isBn ? "অনুমোদন করুন / কিউতে যান" : "Review in Expense Action Queue"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setActiveVoucher(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition"
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
