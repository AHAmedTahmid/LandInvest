"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import type { ReportDef } from "@/lib/reports/registry";
import type { ExpenseRegisterData, ExpenseRegisterItem } from "@/lib/reports/expense-register";
import {
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Landmark,
  Wallet,
  Users,
  Eye,
  Receipt,
  FileText,
  ShieldCheck,
  Tag,
  ArrowUpDown,
  Download,
  X,
  ExternalLink,
  ChevronRight,
  TrendingDown,
} from "lucide-react";

interface Props {
  def: ReportDef;
  data: ExpenseRegisterData;
  filters: {
    from?: string;
    to?: string;
    projectId?: string;
    status?: string;
    channel?: string;
    category?: string;
    partnerId?: string;
  };
  projects: { id: string; projectName: string }[];
  canExport?: boolean;
}

export default function ExpenseRegisterView({ def, data, filters, projects, canExport = true }: Props) {
  const { lang, t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBn = lang === "bn";

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(filters.projectId || "ALL");
  const [selectedStatus, setSelectedStatus] = useState(filters.status || "ALL");
  const [selectedChannel, setSelectedChannel] = useState(filters.channel || "ALL");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "ALL");
  const [selectedClassification, setSelectedClassification] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"date" | "amount" | "voucherNo" | "project">("date");
  const [sortAsc, setSortAsc] = useState(false);

  // Active Voucher Modal State
  const [activeVoucher, setActiveVoucher] = useState<ExpenseRegisterItem | null>(null);

  // Extract all unique categories from data
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    data.items.forEach((it) => set.add(it.category));
    return Array.from(set).sort();
  }, [data.items]);

  // Client-side Filter & Sort
  const filteredItems = useMemo(() => {
    return data.items
      .filter((it) => {
        if (selectedProject !== "ALL") {
          if (selectedProject === "GENERAL" && it.projectId) return false;
          if (selectedProject !== "GENERAL" && it.projectId !== selectedProject) return false;
        }
        if (selectedStatus !== "ALL" && it.status !== selectedStatus) return false;
        if (selectedChannel !== "ALL" && it.channel !== selectedChannel) return false;
        if (selectedCategory !== "ALL" && it.category !== selectedCategory) return false;
        if (selectedClassification !== "ALL" && it.categoryClassification !== selectedClassification) return false;

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchVoucher = it.voucherNo.toLowerCase().includes(q);
          const matchProj = it.projectName.toLowerCase().includes(q);
          const matchCat = it.category.toLowerCase().includes(q);
          const matchDesc = it.description.toLowerCase().includes(q);
          const matchPayee = it.payee.toLowerCase().includes(q);
          const matchApprover = it.approver.toLowerCase().includes(q);
          const matchPostedBy = it.postedBy.toLowerCase().includes(q);
          if (
            !matchVoucher &&
            !matchProj &&
            !matchCat &&
            !matchDesc &&
            !matchPayee &&
            !matchApprover &&
            !matchPostedBy
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === "date") {
          const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
          return sortAsc ? diff : -diff;
        }
        if (sortField === "amount") {
          return sortAsc ? a.amount - b.amount : b.amount - a.amount;
        }
        if (sortField === "voucherNo") {
          return sortAsc ? a.voucherNo.localeCompare(b.voucherNo) : b.voucherNo.localeCompare(a.voucherNo);
        }
        if (sortField === "project") {
          return sortAsc ? a.projectName.localeCompare(b.projectName) : b.projectName.localeCompare(a.projectName);
        }
        return 0;
      });
  }, [data.items, selectedProject, selectedStatus, selectedChannel, selectedCategory, selectedClassification, search, sortField, sortAsc]);

  // Dynamic aggregates on filtered set
  const filteredTotal = useMemo(() => filteredItems.reduce((acc, it) => acc + it.amount, 0), [filteredItems]);
  const filteredApproved = useMemo(
    () => filteredItems.filter((it) => it.status === "APPROVED").reduce((acc, it) => acc + it.amount, 0),
    [filteredItems]
  );
  const filteredPending = useMemo(
    () => filteredItems.filter((it) => it.status === "PENDING").reduce((acc, it) => acc + it.amount, 0),
    [filteredItems]
  );
  const filteredPartnerPaid = useMemo(
    () => filteredItems.filter((it) => it.channel === "PAID_BY_PARTNER").reduce((acc, it) => acc + it.amount, 0),
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

  const handlePresetChange = (preset: string) => {
    applyUrlFilters({ preset, from: undefined, to: undefined });
  };

  const handleExportCsv = () => {
    const headers = [
      "Voucher No",
      "Date",
      "Project",
      "Mouza",
      "Category",
      "Classification",
      "Description",
      "Payment Channel",
      "Account / Payee",
      "Status",
      "Amount (BDT)",
      "Posted By",
      "Approved By",
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
      `"${(r.payee || r.bankAccountName || "").replace(/"/g, '""')}"`,
      r.status,
      r.amount.toFixed(2),
      `"${r.postedBy.replace(/"/g, '""')}"`,
      `"${r.approver.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Expense_Register_${new Date().toISOString().slice(0, 10)}.csv`);
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

  const toggleSort = (field: "date" | "amount" | "voucherNo" | "project") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
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
              <span className="text-slate-600">{isBn ? "ব্যয় রেজিস্টার" : "Expense Register"}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isBn ? "প্রকল্প ব্যয় রেজিস্টার ও ভাউচার লেজার" : "Project Expense Register & Voucher Ledger"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isBn
                ? "ভূমি অধিগ্রহণ, সাইট সিভিল উন্নয়ন এবং প্রকল্প পরিচালন ব্যয়ের পুঙ্খানুপুঙ্খ অডিট লেজার"
                : "Comprehensive audit register of land acquisition, civil development, and site management expenditures"}
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
          {/* Preset Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => handlePresetChange("this_month")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "this_month" || (!searchParams.get("preset") && !filters.from)
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              {isBn ? "চলতি মাস" : "This Month"}
            </button>
            <button
              onClick={() => handlePresetChange("last_month")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "last_month" ? "bg-white text-slate-900 font-semibold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              {isBn ? "গত মাস" : "Last Month"}
            </button>
            <button
              onClick={() => handlePresetChange("this_fy")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "this_fy" ? "bg-white text-slate-900 font-semibold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              {isBn ? "চলতি অর্থবছর" : "This FY"}
            </button>
            <button
              onClick={() => handlePresetChange("all_time")}
              className={`px-2.5 py-1.5 rounded-md transition ${
                searchParams.get("preset") === "all_time" || searchParams.get("preset") === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              {isBn ? "সকল সময়" : "All Time"}
            </button>
          </div>

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

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              applyUrlFilters({ status: e.target.value });
            }}
            aria-label={isBn ? "অনুমোদন অবস্থা ফিল্টার" : "Approval status filter"}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-brand-600"
          >
            <option value="ALL">{isBn ? "সকল অবস্থা (All Status)" : "All Status"}</option>
            <option value="APPROVED">{isBn ? "অনুমোদিত (Approved)" : "Approved"}</option>
            <option value="PENDING">{isBn ? "অপেক্ষমান (Pending)" : "Pending Audit"}</option>
            <option value="REJECTED">{isBn ? "বাতিলকৃত (Rejected)" : "Rejected"}</option>
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
              placeholder={isBn ? "ভাউচার নং, বিবরণ, প্রকল্প, প্রাপক অনুসন্ধান..." : "Search voucher no, particulars, project, payee..."}
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
        {/* Total Incurred Expenses */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "মোট রেকর্ডকৃত ব্যয়" : "Total Outflows"}</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {formatBdt(filteredTotal)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "মোট ভাউচার সংখ্যা" : "Total Vouchers"}</span>
            <span className="font-semibold font-mono text-slate-700">{filteredItems.length} pcs</span>
          </div>
        </div>

        {/* Vetted & Approved */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "অনুমোদিত ও নিরীক্ষিত" : "Vetted & Approved"}</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
            {formatBdt(filteredApproved)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "অনুমোদন হার" : "Audit Rate"}</span>
            <span className="font-semibold font-mono text-emerald-600">
              {filteredTotal > 0 ? ((filteredApproved / filteredTotal) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Pending Internal Audit */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "অপেক্ষমান ভাউচার" : "Pending Audit"}</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
            {formatBdt(filteredPending)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "অপেক্ষমান ভাউচার" : "Pending Vouchers"}</span>
            <span className="font-semibold font-mono text-amber-600">
              {filteredItems.filter((i) => i.status === "PENDING").length} pcs
            </span>
          </div>
        </div>

        {/* Partner-Paid Out-of-Pocket */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>{isBn ? "অংশীদার প্রদত্ত ব্যয়" : "Paid by Partners"}</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-purple-700">
            {formatBdt(filteredPartnerPaid)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? "রিইম্বার্সমেন্ট / মূলধন ক্রেডিট" : "Equity / Payable"}</span>
            <span className="font-semibold font-mono text-purple-600">
              {filteredItems.filter((i) => i.channel === "PAID_BY_PARTNER").length} pcs
            </span>
          </div>
        </div>
      </div>

      {/* 3. Cost Classification & Channel Distribution Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Type Classification */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {isBn ? "ব্যয় শ্রেণীবিভাগ ও পোর্টফোলিও অনুপাত" : "Expense Classification & Portfolio Share"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? "ভূমি অধিগ্রহণ বনাম সিভিল অবকাঠামো বনাম সাইট পরিচালনা ব্যয়" : "Land Acquisition vs Civil Infrastructure vs Site Overheads"}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedClassification("ALL")}
                className={`px-2 py-1 text-xs rounded-md transition ${
                  selectedClassification === "ALL" ? "bg-slate-900 text-white font-semibold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isBn ? "সকল" : "All"}
              </button>
              <button
                onClick={() => setSelectedClassification("ACQUISITION")}
                className={`px-2 py-1 text-xs rounded-md transition ${
                  selectedClassification === "ACQUISITION" ? "bg-amber-700 text-white font-semibold" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {isBn ? "অধিগ্রহণ" : "Acquisition"}
              </button>
              <button
                onClick={() => setSelectedClassification("CIVIL_INFRASTRUCTURE")}
                className={`px-2 py-1 text-xs rounded-md transition ${
                  selectedClassification === "CIVIL_INFRASTRUCTURE" ? "bg-emerald-700 text-white font-semibold" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {isBn ? "সিভিল অবকাঠামো" : "Civil Works"}
              </button>
              <button
                onClick={() => setSelectedClassification("SITE_OVERHEADS")}
                className={`px-2 py-1 text-xs rounded-md transition ${
                  selectedClassification === "SITE_OVERHEADS" ? "bg-purple-700 text-white font-semibold" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                {isBn ? "পরিচালন ব্যয়" : "Overheads"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {data.costTypeBreakdown.map((ct) => {
              const badgeClass =
                ct.classification === "ACQUISITION"
                  ? "bg-amber-500"
                  : ct.classification === "CIVIL_INFRASTRUCTURE"
                  ? "bg-emerald-500"
                  : ct.classification === "SITE_OVERHEADS"
                  ? "bg-purple-500"
                  : "bg-slate-500";

              return (
                <div key={ct.classification} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">
                      {isBn ? ct.labelBn : ct.labelEn}
                      <span className="ml-2 font-normal text-slate-400 font-mono">({ct.count} vouchers)</span>
                    </span>
                    <span className="font-bold font-mono text-slate-900">{formatBdt(ct.amount)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${badgeClass} transition-all duration-300`}
                      style={{ width: `${ct.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-end text-[11px] text-slate-500 font-mono mt-1">
                    <span>{ct.percentage.toFixed(1)}% of total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {isBn ? "অর্থ পরিশোধ মাধ্যম মিশ্রণ" : "Payment Channel Mix"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn ? "ট্রেজারি ব্যাংক একাউন্ট বনাম পেটি ক্যাশ বনাম অংশীদার অর্থায়ন" : "Bank transfers vs petty cash vs partner out-of-pocket"}
            </p>

            <div className="mt-4 space-y-3">
              {data.channelBreakdown.map((ch) => {
                const icon =
                  ch.channel === "BANK" ? (
                    <Landmark className="w-4 h-4 text-blue-600" />
                  ) : ch.channel === "CASH" ? (
                    <Wallet className="w-4 h-4 text-emerald-600" />
                  ) : ch.channel === "PAID_BY_PARTNER" ? (
                    <Users className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Tag className="w-4 h-4 text-amber-600" />
                  );

                const label =
                  ch.channel === "BANK"
                    ? isBn ? "ট্রেজারি ব্যাংক একাউন্ট" : "Treasury Bank Transfer"
                    : ch.channel === "CASH"
                    ? isBn ? "সাইট পেটি ক্যাশ" : "Site Petty Cash"
                    : ch.channel === "PAID_BY_PARTNER"
                    ? isBn ? "অংশীদার প্রদত্ত অর্থ" : "Paid by Syndicate Partner"
                    : ch.channel;

                return (
                  <div key={ch.channel} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="font-semibold text-slate-800">{label}</span>
                      </div>
                      <span className="font-bold font-mono text-slate-900">{formatBdt(ch.amount)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{ch.count} vouchers</span>
                      <span>{ch.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900">
            <span className="font-semibold">{isBn ? "ট্রেজারি নোট:" : "Treasury Note:"}</span>{" "}
            {isBn
              ? "অংশীদারদের সরাসরি প্রদত্ত ব্যয়সমূহ পার্টনার কারেন্ট লেজারে জমাযোগ্য অথবা রিইম্বার্সযোগ্য।"
              : "Partner-funded vouchers are eligible for syndicate equity credit or treasury reimbursement."}
          </div>
        </div>
      </div>

      {/* 4. Master Expense Register Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? "ব্যয় ভাউচার তালিকা ও অডিট ট্রেইল" : "Expense Voucher Register & Audit Trail"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? `প্রদর্শিত হচ্ছে ${filteredItems.length} টি ভাউচার (ক্লিক করে বিস্তারিত ভাউচার রসিদ দেখুন)`
                : `Showing ${filteredItems.length} vouchers (click any row to view voucher receipt slip & audit trail)`}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-mono">
            {isBn ? "মোট পরিশোধিত:" : "Subtotal:"} {formatBdt(filteredTotal)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th
                  onClick={() => toggleSort("voucherNo")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isBn ? "ভাউচার নং" : "Voucher #"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("date")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isBn ? "তারিখ" : "Date"}</span>
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
                <th className="py-3 px-4">{isBn ? "ব্যয় খাত ও শ্রেণী" : "Category & Head"}</th>
                <th className="py-3 px-4 min-w-[200px]">{isBn ? "বিবরণ / পার্টিকুলারস" : "Description / Particulars"}</th>
                <th className="py-3 px-4">{isBn ? "মাধ্যম ও প্রাপক" : "Channel / Payee"}</th>
                <th className="py-3 px-4">{isBn ? "পোস্ট ও অনুমোদন" : "Audit Stamp"}</th>
                <th className="py-3 px-4 text-center">{isBn ? "অবস্থা" : "Status"}</th>
                <th
                  onClick={() => toggleSort("amount")}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isBn ? "পরিমাণ (টাকা)" : "Amount (BDT)"}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">{isBn ? "কোনো ব্যয় রেকর্ড পাওয়া যায়নি" : "No expense vouchers found"}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isBn ? "নির্বাচিত ফিল্টারের আওতায় কোনো রেকর্ড নেই" : "Try adjusting your filter or search query"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => {
                  const isApproved = it.status === "APPROVED";
                  const isPending = it.status === "PENDING";
                  const isRejected = it.status === "REJECTED";

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
                            <Tag className="w-3.5 h-3.5 text-amber-600" />
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

                      {/* Audit Stamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-500">
                        <div>
                          <span className="text-slate-400">{isBn ? "পোস্ট:" : "By:"}</span> {it.postedBy}
                        </div>
                        {isApproved && (
                          <div className="text-emerald-700 flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{it.approver}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isBn ? "অনুমোদিত" : "Approved"}</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>{isBn ? "অপেক্ষমান" : "Pending"}</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{isBn ? "বাতিল" : "Rejected"}</span>
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-[13px]">
                        {formatBdt(it.amount)}
                      </td>

                      {/* View Button */}
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
                  {isBn ? "সর্বমোট ব্যয় (ফিল্টারকৃত)" : "Grand Total Outflows (Filtered)"}
                </td>
                <td colSpan={5} className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                  {isBn
                    ? `মোট ভাউচার: ${filteredItems.length} টি | অনুমোদিত: ${formatBdt(filteredApproved)} | অংশীদার অর্থায়ন: ${formatBdt(filteredPartnerPaid)}`
                    : `Vouchers: ${filteredItems.length} pcs | Approved: ${formatBdt(filteredApproved)} | Partner Paid: ${formatBdt(filteredPartnerPaid)}`}
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-base text-brand-700">
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
          <div className="p-2 bg-slate-100 text-slate-600 rounded-xl mt-0.5">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <h3 className="font-semibold text-slate-900">
              {isBn
                ? "সংবিধিবদ্ধ মানদণ্ড ও হিসাবরক্ষণ সম্মতি (Statutory Audit & Tax Compliance)"
                : "Statutory Standards & Project Accounting Compliance"}
            </h3>
            <p>
              {isBn
                ? "এই ব্যয় রেজিস্টারটি রিয়েল এস্টেট উন্নয়ন ও ব্যবস্থাপনা আইন, ২০১০ (২০১০ সনের ২০ নং আইন)-এর ধারা ১৫ (প্রকল্পের হিসাবরক্ষণ ও নিরীক্ষা) এবং আয়কর আইন, ২০২৩-এর ধারা ৭৩ (ব্যবসা ও প্রকল্প ব্যয় কর্তন)-এর বিধান অনুযায়ী সংকলিত হয়েছে।"
                : "This Expense Register is maintained in compliance with Section 15 of the Real Estate Development and Management Act, 2010 (Act No. 20 of 2010) and Section 73 (Allowable Project Deductions) of the Bangladesh Income Tax Act, 2023."}
            </p>
            <p className="text-slate-400 text-[11px]">
              {isBn
                ? "সকল অনুমোদনযোগ্য খরচ অরিজিনাল ভাউচার রসিদ, সাব-রেজিস্ট্রি চালান এবং ব্যাংক লেনদেন স্টেটমেন্ট দ্বারা সমর্থিত হতে হবে।"
                : "All deductible expenses must be supported by stamped sub-registry receipts, vendor bills, and direct bank debit vouchers."}
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
            <p className="text-xs font-semibold text-slate-800">{isBn ? "প্রস্তুতকারী হিসাবরক্ষক" : "Site Accountant"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "হিসাব ও অর্থ বিভাগ" : "Accounts & Finance"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "অভ্যন্তরীণ নিরীক্ষক" : "Head of Internal Audit"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "নিরীক্ষা ও কমপ্লায়েন্স" : "Audit & Compliance"}</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="text-xs font-semibold text-slate-800">{isBn ? "ব্যবস্থাপনা পরিচালক / প্রধান অংশীদার" : "Managing Director / Partner"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isBn ? "চূড়ান্ত অনুমোদন" : "Executive Approval"}</p>
          </div>
        </div>
      </div>

      {/* 7. Interactive Voucher Slip Detail Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? "ব্যয় ভাউচার বিবরণী" : "Expense Voucher Details"}
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
              <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">
                    {isBn ? "ভাউচারের পরিমাণ" : "Voucher Amount"}
                  </p>
                  <p className="text-2xl font-bold font-mono tracking-tight text-white mt-0.5">
                    {formatBdt(activeVoucher.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      activeVoucher.status === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : activeVoucher.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {activeVoucher.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{formatDate(activeVoucher.date)}</p>
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
                  <p className="text-slate-400 font-medium">{isBn ? "প্রাপক / ব্যাংক / অংশীদার" : "Payee / Source"}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {activeVoucher.paidByPartnerName || activeVoucher.bankAccountName || activeVoucher.payee}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-medium mb-1">{isBn ? "ব্যয়ের বিবরণ / পার্টিকুলারস" : "Particulars / Description"}</p>
                <p className="text-slate-800 leading-relaxed font-normal">{activeVoucher.description}</p>
              </div>

              {/* Audit Stamp */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <div>
                  <p className="text-slate-400 font-medium">{isBn ? "পোস্ট করেছেন" : "Created By"}</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{activeVoucher.postedBy}</p>
                  <p className="text-slate-500 font-mono text-[10px]">{formatDateTime(activeVoucher.postedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-medium">{isBn ? "অনুমোদন স্ট্যাটাস" : "Audit / Approval"}</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{activeVoucher.approver}</p>
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
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
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
