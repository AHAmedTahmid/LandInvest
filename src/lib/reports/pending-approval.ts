import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";
import { controlPrisma } from "@/lib/control";
import { classifyExpenseCategory } from "./expense-register";

export interface PendingApprovalItem {
  id: string;
  voucherNo: string;
  date: string | Date;
  postedAt: string | Date;
  postedBy: string;
  createdBy: string;
  projectId?: string | null;
  projectName: string;
  mouza?: string | null;
  category: string;
  categoryClassification: "ACQUISITION" | "CIVIL_INFRASTRUCTURE" | "SITE_OVERHEADS" | "GENERAL";
  description: string;
  payee: string;
  paidByPartnerId?: string | null;
  paidByPartnerName?: string | null;
  amount: number;
  channel: "CASH" | "BANK" | "MFS" | "PAID_BY_PARTNER" | string;
  bankAccountId?: string | null;
  bankAccountName?: string | null;
  bankAccountType?: string | null;
  voucherImageUrl?: string | null;
  ageDays: number;
  agingSeverity: "NORMAL" | "MODERATE" | "HIGH" | "CRITICAL";
}

export interface PendingApprovalKpis {
  totalPendingAmount: number;
  totalPendingCount: number;
  averageAgeDays: number;
  maxAgeDays: number;
  criticalAgeAmount: number; // > 30 days
  criticalAgeCount: number;
  highAgeAmount: number; // 15 - 30 days
  highAgeCount: number;
  moderateAgeAmount: number; // 8 - 14 days
  moderateAgeCount: number;
  normalAgeAmount: number; // 0 - 7 days
  normalAgeCount: number;
  bankAmount: number;
  bankCount: number;
  cashAmount: number;
  cashCount: number;
  partnerAmount: number;
  partnerCount: number;
}

export interface PendingProjectDistribution {
  projectId: string;
  projectName: string;
  amount: number;
  count: number;
  percentage: number;
  avgAgeDays: number;
}

export interface PendingAgingBucket {
  bucketKey: "0_7" | "8_14" | "15_30" | "30_plus";
  labelEn: string;
  labelBn: string;
  amount: number;
  count: number;
  percentage: number;
  severity: "NORMAL" | "MODERATE" | "HIGH" | "CRITICAL";
}

export interface PendingApprovalData extends ReportData {
  items: PendingApprovalItem[];
  kpis: PendingApprovalKpis;
  projectDistribution: PendingProjectDistribution[];
  agingBuckets: PendingAgingBucket[];
  channelBreakdown: {
    channel: string;
    labelEn: string;
    labelBn: string;
    amount: number;
    count: number;
    percentage: number;
  }[];
}

const pendingColumns: ReportColumn[] = [
  { key: "voucherNo", labelEn: "Voucher No", labelBn: "ভাউচার নং", width: "12%" },
  { key: "date", labelEn: "Expense Date", labelBn: "ব্যয়ের তারিখ", type: "date", width: "10%" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প", width: "14%" },
  { key: "category", labelEn: "Category", labelBn: "বিভাগ", width: "13%" },
  { key: "description", labelEn: "Particulars / Description", labelBn: "বিবরণ", width: "20%" },
  { key: "channel", labelEn: "Channel / Payee", labelBn: "মাধ্যম / প্রাপক", width: "13%" },
  { key: "age", labelEn: "Age (Days)", labelBn: "বয়স (দিন)", type: "number", align: "right", width: "8%" },
  { key: "amount", labelEn: "Amount (BDT)", labelBn: "পরিমাণ (টাকা)", type: "number", align: "right", width: "10%" },
];

export type PendingApprovalFilters = ReportFilters & {
  channel?: string;
  category?: string;
  agingBucket?: string;
};

export async function queryPendingApproval(prisma: any, filters: PendingApprovalFilters): Promise<PendingApprovalData> {
  const where: any = { status: "PENDING" };
  if (filters.projectId && filters.projectId !== "ALL") where.projectId = filters.projectId;
  if (filters.channel && filters.channel !== "ALL") where.paymentChannel = filters.channel;
  if (filters.category && filters.category !== "ALL") where.expenseCategory = filters.category;
  if (filters.partnerId && filters.partnerId !== "ALL") where.paidByPartnerId = filters.partnerId;

  if (filters.from || filters.to) {
    where.expenseDate = {};
    if (filters.from) where.expenseDate.gte = new Date(filters.from);
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      where.expenseDate.lte = toDate;
    }
  }

  const expenses = await prisma.projectExpense.findMany({
    where,
    include: {
      project: { select: { id: true, projectName: true, mouza: true } },
      bankAccount: { select: { id: true, bankName: true, accountNumber: true, accountType: true } },
      paidByPartner: { select: { id: true, name: true, phone: true } },
    },
    orderBy: [{ expenseDate: "asc" }, { createdAt: "desc" }],
  });

  const projects = await prisma.landProject.findMany({
    select: { id: true, projectName: true, mouza: true },
  });
  const partners = await prisma.partner.findMany({
    select: { id: true, name: true, phone: true },
  });
  const projMap = new Map(projects.map((p: any) => [p.id, p]));
  const partnerMap = new Map(partners.map((p: any) => [p.id, p]));

  // Resolve user details (posted by) from control plane
  const userIds = new Set<string>();
  for (const e of expenses) {
    if (e.createdBy) userIds.add(e.createdBy);
  }

  let userMap = new Map<string, string>();
  if (userIds.size > 0) {
    try {
      const users: any[] = await (controlPrisma as any).globalUser.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, fullName: true, email: true },
      });
      userMap = new Map(users.map((u: any) => [u.id, u.fullName || u.email]));
    } catch {
      // Fallback
    }
  }

  const resolveUser = (uid?: string | null) => {
    if (!uid) return "-";
    return userMap.get(uid) || `User (${uid.slice(0, 6)})`;
  };

  const now = new Date();

  const items: PendingApprovalItem[] = expenses.map((e: any) => {
    const proj = e.project || (e.projectId ? projMap.get(e.projectId) : null);
    const ptnr = e.paidByPartner || (e.paidByPartnerId ? partnerMap.get(e.paidByPartnerId) : null);
    const amt = toNum(e.amount);

    const expenseTime = new Date(e.expenseDate).getTime();
    const daysDiff = Math.max(0, Math.floor((now.getTime() - expenseTime) / (1000 * 60 * 60 * 24)));

    let severity: "NORMAL" | "MODERATE" | "HIGH" | "CRITICAL" = "NORMAL";
    if (daysDiff > 30) severity = "CRITICAL";
    else if (daysDiff >= 15) severity = "HIGH";
    else if (daysDiff >= 8) severity = "MODERATE";

    return {
      id: e.id,
      voucherNo: e.voucherNumber || `V-${e.id.slice(0, 8).toUpperCase()}`,
      date: e.expenseDate,
      postedAt: e.createdAt,
      postedBy: resolveUser(e.createdBy),
      createdBy: e.createdBy,
      projectId: e.projectId,
      projectName: proj?.projectName || "General Overhead",
      mouza: proj?.mouza || null,
      category: e.expenseCategory,
      categoryClassification: classifyExpenseCategory(e.expenseCategory),
      description: e.description || e.expenseCategory,
      payee: ptnr ? `${ptnr.name}${ptnr.phone ? ` (${ptnr.phone})` : ""}` : e.description || "-",
      paidByPartnerId: e.paidByPartnerId,
      paidByPartnerName: ptnr?.name || null,
      amount: amt,
      channel: e.paymentChannel,
      bankAccountId: e.bankAccountId,
      bankAccountName: e.bankAccount ? `${e.bankAccount.bankName} (${e.bankAccount.accountNumber})` : null,
      bankAccountType: e.bankAccount?.accountType || null,
      voucherImageUrl: e.voucherImageUrl || null,
      ageDays: daysDiff,
      agingSeverity: severity,
    };
  });

  // Calculate Aggregates & KPIs
  let totalPendingAmount = 0;
  let totalAgeDaysSum = 0;
  let maxAgeDays = 0;

  let criticalAgeAmount = 0;
  let criticalAgeCount = 0;
  let highAgeAmount = 0;
  let highAgeCount = 0;
  let moderateAgeAmount = 0;
  let moderateAgeCount = 0;
  let normalAgeAmount = 0;
  let normalAgeCount = 0;

  let bankAmount = 0;
  let bankCount = 0;
  let cashAmount = 0;
  let cashCount = 0;
  let partnerAmount = 0;
  let partnerCount = 0;

  const projDistMap = new Map<string, { projectName: string; amount: number; count: number; totalAgeDays: number }>();
  const channelMap = new Map<string, { amount: number; count: number }>();

  for (const it of items) {
    totalPendingAmount += it.amount;
    totalAgeDaysSum += it.ageDays;
    if (it.ageDays > maxAgeDays) maxAgeDays = it.ageDays;

    if (it.ageDays > 30) {
      criticalAgeAmount += it.amount;
      criticalAgeCount++;
    } else if (it.ageDays >= 15) {
      highAgeAmount += it.amount;
      highAgeCount++;
    } else if (it.ageDays >= 8) {
      moderateAgeAmount += it.amount;
      moderateAgeCount++;
    } else {
      normalAgeAmount += it.amount;
      normalAgeCount++;
    }

    if (it.channel === "BANK") {
      bankAmount += it.amount;
      bankCount++;
    } else if (it.channel === "CASH") {
      cashAmount += it.amount;
      cashCount++;
    } else if (it.channel === "PAID_BY_PARTNER") {
      partnerAmount += it.amount;
      partnerCount++;
    }

    // Channel breakdown
    const ch = channelMap.get(it.channel) || { amount: 0, count: 0 };
    ch.amount += it.amount;
    ch.count++;
    channelMap.set(it.channel, ch);

    // Project breakdown
    const pKey = it.projectId || "general";
    const curProj = projDistMap.get(pKey) || { projectName: it.projectName, amount: 0, count: 0, totalAgeDays: 0 };
    curProj.amount += it.amount;
    curProj.count++;
    curProj.totalAgeDays += it.ageDays;
    projDistMap.set(pKey, curProj);
  }

  const averageAgeDays = items.length > 0 ? totalAgeDaysSum / items.length : 0;

  const kpis: PendingApprovalKpis = {
    totalPendingAmount,
    totalPendingCount: items.length,
    averageAgeDays,
    maxAgeDays,
    criticalAgeAmount,
    criticalAgeCount,
    highAgeAmount,
    highAgeCount,
    moderateAgeAmount,
    moderateAgeCount,
    normalAgeAmount,
    normalAgeCount,
    bankAmount,
    bankCount,
    cashAmount,
    cashCount,
    partnerAmount,
    partnerCount,
  };

  const projectDistribution: PendingProjectDistribution[] = Array.from(projDistMap.entries())
    .map(([pId, val]) => ({
      projectId: pId,
      projectName: val.projectName,
      amount: val.amount,
      count: val.count,
      percentage: totalPendingAmount > 0 ? (val.amount / totalPendingAmount) * 100 : 0,
      avgAgeDays: val.count > 0 ? Math.round(val.totalAgeDays / val.count) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const agingBuckets: PendingAgingBucket[] = [
    {
      bucketKey: "0_7",
      labelEn: "0 - 7 Days (Current Cycle)",
      labelBn: "০ - ৭ দিন (চলতি চক্র)",
      amount: normalAgeAmount,
      count: normalAgeCount,
      percentage: totalPendingAmount > 0 ? (normalAgeAmount / totalPendingAmount) * 100 : 0,
      severity: "NORMAL",
    },
    {
      bucketKey: "8_14",
      labelEn: "8 - 14 Days (Review Due)",
      labelBn: "৮ - ১৪ দিন (যাচাইযোগ্য)",
      amount: moderateAgeAmount,
      count: moderateAgeCount,
      percentage: totalPendingAmount > 0 ? (moderateAgeAmount / totalPendingAmount) * 100 : 0,
      severity: "MODERATE",
    },
    {
      bucketKey: "15_30",
      labelEn: "15 - 30 Days (High Latency)",
      labelBn: "১৫ - ৩০ দিন (বিলম্বিত)",
      amount: highAgeAmount,
      count: highAgeCount,
      percentage: totalPendingAmount > 0 ? (highAgeAmount / totalPendingAmount) * 100 : 0,
      severity: "HIGH",
    },
    {
      bucketKey: "30_plus",
      labelEn: "30+ Days (Critical Bottleneck)",
      labelBn: "৩০+ দিন (গুরুতর বিলম্ব)",
      amount: criticalAgeAmount,
      count: criticalAgeCount,
      percentage: totalPendingAmount > 0 ? (criticalAgeAmount / totalPendingAmount) * 100 : 0,
      severity: "CRITICAL",
    },
  ];

  const channelBreakdown = Array.from(channelMap.entries())
    .map(([chan, val]) => ({
      channel: chan,
      labelEn:
        chan === "BANK"
          ? "Treasury Bank Transfer"
          : chan === "CASH"
          ? "Site Petty Cash"
          : chan === "PAID_BY_PARTNER"
          ? "Paid by Partner"
          : chan,
      labelBn:
        chan === "BANK"
          ? "ট্রেজারি ব্যাংক একাউন্ট"
          : chan === "CASH"
          ? "সাইট পেটি ক্যাশ"
          : chan === "PAID_BY_PARTNER"
          ? "অংশীদার প্রদত্ত"
          : chan,
      amount: val.amount,
      count: val.count,
      percentage: totalPendingAmount > 0 ? (val.amount / totalPendingAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Standard generic rows for backwards compatibility
  const rows = items.map((r) => ({
    voucherNo: r.voucherNo,
    date: r.date,
    postedAt: r.postedAt,
    postedBy: r.postedBy,
    project: r.projectName,
    category: r.category,
    description: r.description,
    payee: r.payee,
    amount: r.amount,
    channel: r.channel === "PAID_BY_PARTNER" ? `Partner: ${r.paidByPartnerName || "Partner"}` : r.bankAccountName ? `${r.channel} (${r.bankAccountName})` : r.channel,
    age: r.ageDays,
  }));

  return {
    columns: pendingColumns,
    rows,
    totals: {
      amount: totalPendingAmount,
      age: Math.round(averageAgeDays),
    },
    summary: agingBuckets.map((b) => ({
      labelEn: `${b.labelEn} (${b.count})`,
      labelBn: `${b.labelBn} (${b.count})`,
      value: fmt(b.amount),
    })),
    items,
    kpis,
    projectDistribution,
    agingBuckets,
    channelBreakdown,
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
