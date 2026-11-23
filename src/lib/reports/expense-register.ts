import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";
import { controlPrisma } from "@/lib/control";

export type ExpenseReportFilters = ReportFilters & {
  channel?: string;
  category?: string;
};

export interface ExpenseRegisterItem {
  id: string;
  voucherNo: string;
  date: string | Date;
  postedAt: string | Date;
  postedBy: string;
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
  status: "APPROVED" | "PENDING" | "REJECTED" | string;
  approver: string;
  approvedBy?: string | null;
  createdBy: string;
  voucherImageUrl?: string | null;
}

export interface ExpenseRegisterKpis {
  totalExpenses: number;
  totalVouchersCount: number;
  approvedAmount: number;
  approvedCount: number;
  pendingAmount: number;
  pendingCount: number;
  rejectedAmount: number;
  rejectedCount: number;
  paidByPartnersAmount: number;
  paidByPartnersCount: number;
  paidByTreasuryAmount: number;
  cashAmount: number;
  cashCount: number;
  bankAmount: number;
  bankCount: number;
  mfsAmount: number;
  mfsCount: number;
}

export interface ExpenseCategoryBreakdown {
  category: string;
  classification: "ACQUISITION" | "CIVIL_INFRASTRUCTURE" | "SITE_OVERHEADS" | "GENERAL";
  amount: number;
  count: number;
  percentage: number;
}

export interface ExpenseChannelBreakdown {
  channel: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface ExpenseProjectBreakdown {
  projectId: string;
  projectName: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface ExpenseRegisterData extends ReportData {
  items: ExpenseRegisterItem[];
  kpis: ExpenseRegisterKpis;
  categoryBreakdown: ExpenseCategoryBreakdown[];
  channelBreakdown: ExpenseChannelBreakdown[];
  projectBreakdown: ExpenseProjectBreakdown[];
  costTypeBreakdown: {
    classification: string;
    labelEn: string;
    labelBn: string;
    amount: number;
    count: number;
    percentage: number;
  }[];
}

const expenseColumns: ReportColumn[] = [
  { key: "voucherNo", labelEn: "Voucher No", labelBn: "ভাউচার নং", width: "12%" },
  { key: "date", labelEn: "Expense Date", labelBn: "ব্যয়ের তারিখ", type: "date", width: "9%" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প", width: "13%" },
  { key: "category", labelEn: "Category", labelBn: "বিভাগ", width: "13%" },
  { key: "description", labelEn: "Particulars / Description", labelBn: "বিবরণ", width: "18%" },
  { key: "channel", labelEn: "Channel / Payee", labelBn: "মাধ্যম / প্রাপক", width: "13%" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা", width: "8%" },
  { key: "approver", labelEn: "Approver", labelBn: "অনুমোদক", width: "10%" },
  { key: "amount", labelEn: "Amount (BDT)", labelBn: "পরিমাণ (টাকা)", type: "number", align: "right", width: "12%" },
];

export function classifyExpenseCategory(cat: string): "ACQUISITION" | "CIVIL_INFRASTRUCTURE" | "SITE_OVERHEADS" | "GENERAL" {
  const c = (cat || "").toLowerCase();
  if (
    c.includes("bayna") ||
    c.includes("registration") ||
    c.includes("stamp") ||
    c.includes("mutation") ||
    c.includes("drafting") ||
    c.includes("deed") ||
    c.includes("acquisition") ||
    c.includes("sub-registry") ||
    c.includes("legal")
  ) {
    return "ACQUISITION";
  }
  if (
    c.includes("earth") ||
    c.includes("filling") ||
    c.includes("wall") ||
    c.includes("road") ||
    c.includes("drainage") ||
    c.includes("survey") ||
    c.includes("cadastral") ||
    c.includes("civil") ||
    c.includes("demarcation") ||
    c.includes("labor") ||
    c.includes("pillar")
  ) {
    return "CIVIL_INFRASTRUCTURE";
  }
  if (
    c.includes("salary") ||
    c.includes("rent") ||
    c.includes("security") ||
    c.includes("signboard") ||
    c.includes("marketing") ||
    c.includes("office") ||
    c.includes("honorarium") ||
    c.includes("utility") ||
    c.includes("entertainment") ||
    c.includes("travel")
  ) {
    return "SITE_OVERHEADS";
  }
  return "GENERAL";
}

export async function queryExpenseRegister(prisma: any, filters: ExpenseReportFilters): Promise<ExpenseRegisterData> {
  const where: any = {};
  if (filters.projectId && filters.projectId !== "ALL") where.projectId = filters.projectId;
  if (filters.status && filters.status !== "ALL") where.status = filters.status;
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
    orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
  });

  const projects = await prisma.landProject.findMany({
    select: { id: true, projectName: true, mouza: true },
  });
  const partners = await prisma.partner.findMany({
    select: { id: true, name: true, phone: true },
  });
  const projMap = new Map(projects.map((p: any) => [p.id, p]));
  const partnerMap = new Map(partners.map((p: any) => [p.id, p]));

  // Resolve user details (posted by and approver) from control plane
  const userIds = new Set<string>();
  for (const e of expenses) {
    if (e.createdBy) userIds.add(e.createdBy);
    if (e.approvedBy) userIds.add(e.approvedBy);
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
      // Fallback silently if control plane is unreachable
    }
  }

  const resolveUser = (uid?: string | null) => {
    if (!uid) return "-";
    return userMap.get(uid) || `User (${uid.slice(0, 6)})`;
  };

  const items: ExpenseRegisterItem[] = expenses.map((e: any) => {
    const proj = e.project || (e.projectId ? projMap.get(e.projectId) : null);
    const ptnr = e.paidByPartner || (e.paidByPartnerId ? partnerMap.get(e.paidByPartnerId) : null);
    const categoryClass = classifyExpenseCategory(e.expenseCategory);
    const amt = toNum(e.amount);

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
      categoryClassification: categoryClass,
      description: e.description || e.expenseCategory,
      payee: ptnr ? `${ptnr.name}${ptnr.phone ? ` (${ptnr.phone})` : ""}` : e.description || "-",
      paidByPartnerId: e.paidByPartnerId,
      paidByPartnerName: ptnr?.name || null,
      amount: amt,
      channel: e.paymentChannel,
      bankAccountId: e.bankAccountId,
      bankAccountName: e.bankAccount ? `${e.bankAccount.bankName} (${e.bankAccount.accountNumber})` : null,
      bankAccountType: e.bankAccount?.accountType || null,
      status: e.status,
      approver: e.status === "APPROVED" ? resolveUser(e.approvedBy) : e.status === "REJECTED" ? `Rejected by ${resolveUser(e.approvedBy)}` : "Pending Audit",
      approvedBy: e.approvedBy,
      voucherImageUrl: e.voucherImageUrl || null,
    };
  });

  // Calculate Aggregates & KPIs
  let totalExpenses = 0;
  let approvedAmount = 0;
  let approvedCount = 0;
  let pendingAmount = 0;
  let pendingCount = 0;
  let rejectedAmount = 0;
  let rejectedCount = 0;

  let paidByPartnersAmount = 0;
  let paidByPartnersCount = 0;
  let cashAmount = 0;
  let cashCount = 0;
  let bankAmount = 0;
  let bankCount = 0;
  let mfsAmount = 0;
  let mfsCount = 0;

  const catMap = new Map<string, { count: number; amount: number; classification: "ACQUISITION" | "CIVIL_INFRASTRUCTURE" | "SITE_OVERHEADS" | "GENERAL" }>();
  const chanMap = new Map<string, { count: number; amount: number }>();
  const projBreakMap = new Map<string, { projectName: string; count: number; amount: number }>();
  const costTypeMap = new Map<string, { amount: number; count: number }>();

  for (const it of items) {
    totalExpenses += it.amount;

    if (it.status === "APPROVED") {
      approvedAmount += it.amount;
      approvedCount++;
    } else if (it.status === "PENDING") {
      pendingAmount += it.amount;
      pendingCount++;
    } else if (it.status === "REJECTED") {
      rejectedAmount += it.amount;
      rejectedCount++;
    }

    if (it.channel === "PAID_BY_PARTNER") {
      paidByPartnersAmount += it.amount;
      paidByPartnersCount++;
    } else if (it.channel === "CASH") {
      cashAmount += it.amount;
      cashCount++;
    } else if (it.channel === "BANK") {
      bankAmount += it.amount;
      bankCount++;
    } else if (it.channel === "MFS") {
      mfsAmount += it.amount;
      mfsCount++;
    }

    // Category breakdown
    const existingCat = catMap.get(it.category) || { count: 0, amount: 0, classification: it.categoryClassification };
    existingCat.count += 1;
    existingCat.amount += it.amount;
    catMap.set(it.category, existingCat);

    // Channel breakdown
    const existingChan = chanMap.get(it.channel) || { count: 0, amount: 0 };
    existingChan.count += 1;
    existingChan.amount += it.amount;
    chanMap.set(it.channel, existingChan);

    // Project breakdown
    const pKey = it.projectId || "general";
    const existingProj = projBreakMap.get(pKey) || { projectName: it.projectName, count: 0, amount: 0 };
    existingProj.count += 1;
    existingProj.amount += it.amount;
    projBreakMap.set(pKey, existingProj);

    // Cost classification
    const ctExisting = costTypeMap.get(it.categoryClassification) || { amount: 0, count: 0 };
    ctExisting.amount += it.amount;
    ctExisting.count += 1;
    costTypeMap.set(it.categoryClassification, ctExisting);
  }

  const kpis: ExpenseRegisterKpis = {
    totalExpenses,
    totalVouchersCount: items.length,
    approvedAmount,
    approvedCount,
    pendingAmount,
    pendingCount,
    rejectedAmount,
    rejectedCount,
    paidByPartnersAmount,
    paidByPartnersCount,
    paidByTreasuryAmount: totalExpenses - paidByPartnersAmount,
    cashAmount,
    cashCount,
    bankAmount,
    bankCount,
    mfsAmount,
    mfsCount,
  };

  const categoryBreakdown: ExpenseCategoryBreakdown[] = Array.from(catMap.entries())
    .map(([cat, val]) => ({
      category: cat,
      classification: val.classification,
      amount: val.amount,
      count: val.count,
      percentage: totalExpenses > 0 ? (val.amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const channelBreakdown: ExpenseChannelBreakdown[] = Array.from(chanMap.entries())
    .map(([chan, val]) => ({
      channel: chan,
      amount: val.amount,
      count: val.count,
      percentage: totalExpenses > 0 ? (val.amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const projectBreakdown: ExpenseProjectBreakdown[] = Array.from(projBreakMap.entries())
    .map(([pId, val]) => ({
      projectId: pId,
      projectName: val.projectName,
      amount: val.amount,
      count: val.count,
      percentage: totalExpenses > 0 ? (val.amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const costTypeMeta: Record<string, { labelEn: string; labelBn: string }> = {
    ACQUISITION: { labelEn: "Land Acquisition & Registration", labelBn: "জমি ক্রয় ও রেজিস্ট্রেশন" },
    CIVIL_INFRASTRUCTURE: { labelEn: "Civil Works & Site Infrastructure", labelBn: "সাইট উন্নয়ন ও অবকাঠামো" },
    SITE_OVERHEADS: { labelEn: "Site Management & Overheads", labelBn: "সাইট ব্যবস্থাপনা ও সার্বিক ব্যয়" },
    GENERAL: { labelEn: "General & Miscellaneous", labelBn: "সাধারণ ও বিবিধ ব্যয়" },
  };

  const costTypeBreakdown = ["ACQUISITION", "CIVIL_INFRASTRUCTURE", "SITE_OVERHEADS", "GENERAL"]
    .map((typeKey) => {
      const data = costTypeMap.get(typeKey) || { amount: 0, count: 0 };
      const meta = costTypeMeta[typeKey] || { labelEn: typeKey, labelBn: typeKey };
      return {
        classification: typeKey,
        labelEn: meta.labelEn,
        labelBn: meta.labelBn,
        amount: data.amount,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      };
    })
    .filter((ct) => ct.amount > 0);

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
    status: r.status,
    approver: r.approver,
  }));

  return {
    columns: expenseColumns,
    rows,
    totals: { amount: totalExpenses },
    summary: categoryBreakdown.slice(0, 8).map((cat) => ({
      labelEn: `${cat.category} (${cat.count})`,
      labelBn: `${cat.category} (${cat.count})`,
      value: fmt(cat.amount),
    })),
    items,
    kpis,
    categoryBreakdown,
    channelBreakdown,
    projectBreakdown,
    costTypeBreakdown,
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
