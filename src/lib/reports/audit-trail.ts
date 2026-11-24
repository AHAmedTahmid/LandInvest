import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";
import { formatDateTime } from "./format";

export const auditColumns: ReportColumn[] = [
  { key: "createdAt", labelEn: "Timestamp", labelBn: "তারিখ ও সময়", type: "datetime" },
  { key: "userName", labelEn: "Operator / User", labelBn: "ব্যবহারকারী" },
  { key: "userRole", labelEn: "System Role", labelBn: "ভূমিকা" },
  { key: "action", labelEn: "Action", labelBn: "কার্যক্রম" },
  { key: "entityLabel", labelEn: "Target Entity", labelBn: "টেবিল / খাত" },
  { key: "recordId", labelEn: "Record ID", labelBn: "রেকর্ড আইডি" },
  { key: "changesSummary", labelEn: "Summary of Changes", labelBn: "পরিবর্তন বিবরণ" },
];

export interface AuditFieldDiff {
  field: string;
  oldValue: any;
  newValue: any;
  type: "CREATED" | "MODIFIED" | "DELETED";
}

export interface AuditTrailItem {
  id: string;
  createdAt: string;
  rawTimestamp: string;
  tableName: string;
  entityLabelEn: string;
  entityLabelBn: string;
  recordId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | string;
  changedBy: string;
  userName: string;
  userRole: string;
  changesSummary: string;
  diffs: AuditFieldDiff[];
  oldValues: any;
  newValues: any;
}

export interface EntityAuditStats {
  tableName: string;
  labelEn: string;
  labelBn: string;
  count: number;
  createCount: number;
  updateCount: number;
}

export interface OperatorAuditStats {
  userId: string;
  name: string;
  role: string;
  count: number;
}

export interface AuditTrailKpis {
  totalEvents: number;
  createdEvents: number;
  updatedEvents: number;
  activeOperatorsCount: number;
  monitoredTablesCount: number;
}

export interface AuditTrailResult extends ReportData {
  kpis: AuditTrailKpis;
  items: AuditTrailItem[];
  entityStats: EntityAuditStats[];
  operatorStats: OperatorAuditStats[];
  availableTables: { value: string; label: string }[];
  availableUsers: { value: string; label: string }[];
  availableActions: string[];
}

const ENTITY_CONFIG: Record<string, { labelEn: string; labelBn: string }> = {
  customer_payments: { labelEn: "Customer Payments", labelBn: "গ্রাহক জমা / রসিদ" },
  land_sales: { labelEn: "Land Sales Contracts", labelBn: "জমি বিক্রয় চুক্তি" },
  project_expenses: { labelEn: "Project Expenses / Vouchers", labelBn: "প্রকল্প ব্যয় ভাউচার" },
  treasury_transfer_requests: { labelEn: "Treasury Transfers", labelBn: "তহবিল স্থানান্তর" },
  profit_distributions: { labelEn: "Profit Distributions", labelBn: "মুনাফা বণ্টন" },
  partners: { labelEn: "Syndicate Partners", labelBn: "অংশীদার প্রোফাইল" },
  partner_transactions: { labelEn: "Partner Capital Transactions", labelBn: "মূলধন লেনদেন" },
  land_projects: { labelEn: "Land Projects", labelBn: "জমি প্রকল্প" },
  bank_accounts: { labelEn: "Bank & MFS Accounts", labelBn: "ব্যাংক ও এমএফএস হিসাব" },
  user_roles: { labelEn: "User Security Roles", labelBn: "ব্যবহারকারী রোল" },
  roles: { labelEn: "RBAC Role Definitions", labelBn: "অনুমতি রোল" },
};

const USER_DIRECTORY: Record<string, { name: string; role: string }> = {
  "10000000-0000-0000-0000-000000000001": { name: "Md. Rafiqul Islam", role: "Owner / Managing Director" },
  "10000000-0000-0000-0000-000000000002": { name: "Barrister Tariq Ahmed", role: "Managing Partner" },
  "10000000-0000-0000-0000-000000000003": { name: "Kazi Faruq Hossain", role: "Head of Accounts" },
  "10000000-0000-0000-0000-000000000004": { name: "Haji Abdul Gafur", role: "Site Project Manager" },
  "10000000-0000-0000-0000-000000000005": { name: "Sadia Afrin", role: "Sales Executive" },
  "10000000-0000-0000-0000-000000000006": { name: "Internal Audit Bureau", role: "Auditor (Read-Only)" },
};

export async function queryAuditTrail(prisma: any, filters: ReportFilters): Promise<AuditTrailResult> {
  const where: any = {};
  if (filters.userId && filters.userId !== "ALL") where.changedBy = filters.userId;
  if (filters.tableName && filters.tableName !== "ALL") where.tableName = filters.tableName;
  if (filters.action && filters.action !== "ALL") where.action = filters.action;
  
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }

  // 1. Fetch audit logs (up to 500 records)
  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: 500,
  });

  // 2. Compute entity and operator statistics
  const entityMap = new Map<string, EntityAuditStats>();
  const operatorMap = new Map<string, OperatorAuditStats>();
  let createdCount = 0;
  let updatedCount = 0;

  for (const l of logs) {
    if (l.action === "CREATE") createdCount += 1;
    if (l.action === "UPDATE") updatedCount += 1;

    // Entity stats
    const cfg = ENTITY_CONFIG[l.tableName] || { labelEn: l.tableName, labelBn: l.tableName };
    let eStat = entityMap.get(l.tableName);
    if (!eStat) {
      eStat = {
        tableName: l.tableName,
        labelEn: cfg.labelEn,
        labelBn: cfg.labelBn,
        count: 0,
        createCount: 0,
        updateCount: 0,
      };
      entityMap.set(l.tableName, eStat);
    }
    eStat.count += 1;
    if (l.action === "CREATE") eStat.createCount += 1;
    if (l.action === "UPDATE") eStat.updateCount += 1;

    // Operator stats
    const uInfo = USER_DIRECTORY[l.changedBy] || { name: `User (${l.changedBy.slice(0, 8)})`, role: "Operator" };
    let oStat = operatorMap.get(l.changedBy);
    if (!oStat) {
      oStat = {
        userId: l.changedBy,
        name: uInfo.name,
        role: uInfo.role,
        count: 0,
      };
      operatorMap.set(l.changedBy, oStat);
    }
    oStat.count += 1;
  }

  // 3. Map items and compute field diffs
  const items: AuditTrailItem[] = logs.map((l: any) => {
    const uInfo = USER_DIRECTORY[l.changedBy] || { name: `Operator ${l.changedBy.slice(0, 8)}`, role: "Authorized User" };
    const cfg = ENTITY_CONFIG[l.tableName] || { labelEn: l.tableName, labelBn: l.tableName };

    let oldV = l.oldValues;
    let newV = l.newValues;
    if (typeof oldV === "string") {
      try { oldV = JSON.parse(oldV); } catch { /* noop */ }
    }
    if (typeof newV === "string") {
      try { newV = JSON.parse(newV); } catch { /* noop */ }
    }

    const diffs: AuditFieldDiff[] = [];
    const changeSnippets: string[] = [];

    if (!oldV && newV && typeof newV === "object") {
      // Creation event
      for (const [k, val] of Object.entries(newV)) {
        diffs.push({ field: k, oldValue: null, newValue: val, type: "CREATED" });
        if (changeSnippets.length < 3) {
          changeSnippets.push(`${k}: ${typeof val === "object" ? JSON.stringify(val) : val}`);
        }
      }
    } else if (oldV && newV && typeof oldV === "object" && typeof newV === "object") {
      // Update event
      const allKeys = new Set([...Object.keys(oldV), ...Object.keys(newV)]);
      for (const k of allKeys) {
        const o = oldV[k];
        const n = newV[k];
        if (JSON.stringify(o) !== JSON.stringify(n)) {
          diffs.push({ field: k, oldValue: o, newValue: n, type: o === undefined ? "CREATED" : n === undefined ? "DELETED" : "MODIFIED" });
          if (changeSnippets.length < 3) {
            changeSnippets.push(`${k}: ${o ?? "null"} → ${n ?? "null"}`);
          }
        }
      }
    }

    const changesSummary = changeSnippets.length > 0
      ? changeSnippets.join("; ") + (diffs.length > 3 ? ` (+${diffs.length - 3} more)` : "")
      : (l.action === "CREATE" ? "New record initialized" : "Record modified");

    return {
      id: l.id,
      createdAt: l.createdAt instanceof Date ? l.createdAt.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : String(l.createdAt),
      rawTimestamp: l.createdAt instanceof Date ? l.createdAt.toISOString() : String(l.createdAt),
      tableName: l.tableName,
      entityLabelEn: cfg.labelEn,
      entityLabelBn: cfg.labelBn,
      recordId: l.recordId,
      action: l.action,
      changedBy: l.changedBy,
      userName: uInfo.name,
      userRole: uInfo.role,
      changesSummary,
      diffs,
      oldValues: oldV,
      newValues: newV,
    };
  });

  const kpis: AuditTrailKpis = {
    totalEvents: logs.length,
    createdEvents: createdCount,
    updatedEvents: updatedCount,
    activeOperatorsCount: operatorMap.size,
    monitoredTablesCount: entityMap.size,
  };

  const rows = items.map((i) => ({
    createdAt: i.createdAt,
    userName: i.userName,
    userRole: i.userRole,
    action: i.action,
    entityLabel: i.entityLabelEn,
    recordId: i.recordId.slice(0, 8),
    changesSummary: i.changesSummary,
  }));

  const availableTables = Object.entries(ENTITY_CONFIG).map(([value, { labelEn }]) => ({
    value,
    label: `${labelEn} (${value})`,
  }));

  const availableUsers = Object.entries(USER_DIRECTORY).map(([value, { name, role }]) => ({
    value,
    label: `${name} - ${role}`,
  }));

  return {
    columns: auditColumns,
    rows,
    totals: { totalEvents: logs.length },
    kpis,
    items,
    entityStats: Array.from(entityMap.values()).sort((a, b) => b.count - a.count),
    operatorStats: Array.from(operatorMap.values()).sort((a, b) => b.count - a.count),
    availableTables,
    availableUsers,
    availableActions: ["CREATE", "UPDATE", "DELETE", "APPROVE"],
  };
}
