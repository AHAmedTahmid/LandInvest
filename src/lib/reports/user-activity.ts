import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";
import { controlPrisma } from "@/lib/control";

export interface UserActivityKpis {
  totalActiveUsers: number;
  totalUserActions: number;
  avgActionsPerUser: number;
  topOperatorName: string;
  topOperatorCount: number;
  monitoredModulesCount: number;
}

export interface OperatorProfile {
  userId: string;
  name: string;
  role: string;
  email: string;
  isOwner: boolean;
  isActive: boolean;
  totalActions: number;
  createCount: number;
  updateCount: number;
  deleteCount: number;
  tablesTouched: string[];
  lastActive: string;
  firstActive: string;
  categoryBreakdown: {
    financial: number;
    sales: number;
    projects: number;
    governance: number;
  };
}

export interface UserActivityItem {
  id: string;
  timestamp: string;
  rawTimestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  tableName: string;
  entityLabel: string;
  recordId: string;
  summaryText: string;
  category: "FINANCIAL" | "SALES" | "PROJECTS" | "GOVERNANCE";
  ipAddress?: string;
}

export interface CategoryWorkload {
  category: string;
  labelEn: string;
  labelBn: string;
  count: number;
  percentage: number;
}

export interface UserActivityResult extends ReportData {
  kpis: UserActivityKpis;
  operators: OperatorProfile[];
  items: UserActivityItem[];
  categoryWorkload: CategoryWorkload[];
  availableUsers: { value: string; label: string }[];
}

const activityColumns: ReportColumn[] = [
  { key: "timestamp", labelEn: "Timestamp", labelBn: "তারিখ ও সময়", type: "date" },
  { key: "userName", labelEn: "User / Operator", labelBn: "ব্যবহারকারী / কর্মকর্তা" },
  { key: "userRole", labelEn: "Role", labelBn: "রোল / পদবী" },
  { key: "action", labelEn: "Action", labelBn: "কার্যক্রম" },
  { key: "entityLabel", labelEn: "Target Module", labelBn: "লক্ষ্য মডিউল" },
  { key: "summaryText", labelEn: "Activity Summary", labelBn: "কার্যকলাপ বিবরণ" },
];

const KNOWN_USERS: Record<string, { name: string; role: string; email: string }> = {
  "10000000-0000-0000-0000-000000000001": { name: "Md. Rafiqul Islam", role: "Owner / Managing Director", email: "owner@alpha.com" },
  "10000000-0000-0000-0000-000000000002": { name: "Barrister Tariq Ahmed", role: "Managing Partner", email: "admin@alpha.com" },
  "10000000-0000-0000-0000-000000000003": { name: "Kazi Faruq Hossain", role: "Head of Accounts", email: "accounts@alpha.com" },
  "10000000-0000-0000-0000-000000000004": { name: "Haji Abdul Gafur", role: "Site Project Manager", email: "site@alpha.com" },
  "10000000-0000-0000-0000-000000000005": { name: "Sadia Afrin", role: "Sales Executive", email: "sales@alpha.com" },
  "10000000-0000-0000-0000-000000000006": { name: "Internal Audit Bureau", role: "Auditor (Read-Only)", email: "auditor@alpha.com" },
};

function categorizeTable(table: string): "FINANCIAL" | "SALES" | "PROJECTS" | "GOVERNANCE" {
  switch (table) {
    case "customer_payments":
    case "treasury_transfer_requests":
    case "profit_distributions":
    case "bank_accounts":
    case "partner_transactions":
      return "FINANCIAL";
    case "land_sales":
    case "project_plots":
      return "SALES";
    case "project_expenses":
    case "land_projects":
    case "partners":
      return "PROJECTS";
    case "user_roles":
    case "roles":
    case "role_permissions":
    case "dashboard_layouts":
    case "dashboard_settings":
      return "GOVERNANCE";
    default:
      return "GOVERNANCE";
  }
}

const TABLE_LABELS: Record<string, string> = {
  customer_payments: "Customer Payments",
  project_expenses: "Project Expenses",
  land_sales: "Land Sales Contracts",
  treasury_transfer_requests: "Treasury Fund Transfers",
  profit_distributions: "Profit Distributions",
  partners: "Syndicate Partners",
  partner_transactions: "Partner Transactions",
  land_projects: "Land Projects",
  bank_accounts: "Bank Accounts",
  user_roles: "User Role Assignments",
  roles: "Security Roles",
};

export async function queryUserActivity(prisma: any, filters: ReportFilters): Promise<UserActivityResult> {
  const where: any = {};
  if (filters.userId && filters.userId !== "ALL") where.changedBy = filters.userId;
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

  // 2. Fetch global users if available from controlPrisma for name resolution
  const userDirectory: Record<string, { name: string; role: string; email: string }> = { ...KNOWN_USERS };
  try {
    const gUsers = await (controlPrisma as any).globalUser.findMany({
      select: { id: true, fullName: true, email: true, isOwner: true },
    });
    for (const gu of gUsers) {
      if (!userDirectory[gu.id]) {
        userDirectory[gu.id] = {
          name: gu.fullName,
          role: gu.isOwner ? "Owner / Managing Director" : "Team Member",
          email: gu.email,
        };
      }
    }
  } catch {
    // If control plane query fails, rely on KNOWN_USERS
  }

  // 3. Process logs into detailed items and aggregate per operator
  const operatorMap = new Map<string, OperatorProfile>();
  const categoryCounts = { FINANCIAL: 0, SALES: 0, PROJECTS: 0, GOVERNANCE: 0 };

  const items: UserActivityItem[] = logs.map((l: any) => {
    const op = userDirectory[l.changedBy] || {
      name: `Operator (${l.changedBy?.slice(0, 8) ?? "sys"})`,
      role: "System Operator",
      email: `${l.changedBy?.slice(0, 8) ?? "user"}@system.local`,
    };

    const cat = categorizeTable(l.tableName);
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    // Aggregate operator profile
    let profile = operatorMap.get(l.changedBy);
    if (!profile) {
      profile = {
        userId: l.changedBy,
        name: op.name,
        role: op.role,
        email: op.email,
        isOwner: op.role.includes("Owner"),
        isActive: true,
        totalActions: 0,
        createCount: 0,
        updateCount: 0,
        deleteCount: 0,
        tablesTouched: [],
        lastActive: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
        firstActive: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
        categoryBreakdown: {
          financial: 0,
          sales: 0,
          projects: 0,
          governance: 0,
        },
      };
      operatorMap.set(l.changedBy, profile);
    }

    profile.totalActions += 1;
    if (l.action === "CREATE") profile.createCount += 1;
    else if (l.action === "UPDATE") profile.updateCount += 1;
    else if (l.action === "DELETE") profile.deleteCount += 1;

    if (!profile.tablesTouched.includes(l.tableName)) {
      profile.tablesTouched.push(l.tableName);
    }

    if (cat === "FINANCIAL") profile.categoryBreakdown.financial += 1;
    else if (cat === "SALES") profile.categoryBreakdown.sales += 1;
    else if (cat === "PROJECTS") profile.categoryBreakdown.projects += 1;
    else if (cat === "GOVERNANCE") profile.categoryBreakdown.governance += 1;

    const logDate = new Date(l.createdAt);
    if (new Date(profile.lastActive) < logDate) profile.lastActive = logDate.toISOString();
    if (new Date(profile.firstActive) > logDate) profile.firstActive = logDate.toISOString();

    // Summary text formatting
    let summaryText = "";
    if (l.action === "CREATE") {
      summaryText = `Initial entry created in ${TABLE_LABELS[l.tableName] || l.tableName} (ID: ${l.recordId?.slice(0, 8)})`;
    } else if (l.action === "UPDATE") {
      summaryText = `Modified record in ${TABLE_LABELS[l.tableName] || l.tableName} (ID: ${l.recordId?.slice(0, 8)})`;
    } else {
      summaryText = `${l.action} operation on ${TABLE_LABELS[l.tableName] || l.tableName}`;
    }

    return {
      id: l.id,
      timestamp: logDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      rawTimestamp: l.createdAt.toISOString(),
      userId: l.changedBy,
      userName: op.name,
      userRole: op.role,
      action: l.action,
      tableName: l.tableName,
      entityLabel: TABLE_LABELS[l.tableName] || l.tableName,
      recordId: l.recordId,
      summaryText,
      category: cat,
      ipAddress: "127.0.0.1",
    };
  });

  // Sort operators by total actions descending
  const operators = Array.from(operatorMap.values()).sort((a, b) => b.totalActions - a.totalActions);

  // Compute Top Operator and Macro KPIs
  const totalUserActions = items.length;
  const totalActiveUsers = operators.length;
  const avgActionsPerUser = totalActiveUsers > 0 ? Math.round(totalUserActions / totalActiveUsers) : 0;
  const topOperator = operators[0];
  const monitoredModulesCount = new Set(items.map((i) => i.tableName)).size;

  const kpis: UserActivityKpis = {
    totalActiveUsers,
    totalUserActions,
    avgActionsPerUser,
    topOperatorName: topOperator ? topOperator.name : "N/A",
    topOperatorCount: topOperator ? topOperator.totalActions : 0,
    monitoredModulesCount,
  };

  // Category Workload
  const totalCat = totalUserActions || 1;
  const categoryWorkload: CategoryWorkload[] = [
    {
      category: "FINANCIAL",
      labelEn: "Financial & Treasury",
      labelBn: "আর্থিক ও ট্রেজারি",
      count: categoryCounts.FINANCIAL,
      percentage: Math.round((categoryCounts.FINANCIAL / totalCat) * 1000) / 10,
    },
    {
      category: "PROJECTS",
      labelEn: "Land Acquisition & Expenses",
      labelBn: "জমি ক্রয় ও প্রকল্প ব্যয়",
      count: categoryCounts.PROJECTS,
      percentage: Math.round((categoryCounts.PROJECTS / totalCat) * 1000) / 10,
    },
    {
      category: "SALES",
      labelEn: "Sales & Plot Allotments",
      labelBn: "বিক্রয় ও প্লট বরাদ্দ",
      count: categoryCounts.SALES,
      percentage: Math.round((categoryCounts.SALES / totalCat) * 1000) / 10,
    },
    {
      category: "GOVERNANCE",
      labelEn: "Security & Governance",
      labelBn: "নিরাপত্তা ও প্রশাসন",
      count: categoryCounts.GOVERNANCE,
      percentage: Math.round((categoryCounts.GOVERNANCE / totalCat) * 1000) / 10,
    },
  ];

  // Available users for dropdown filter
  const availableUsers = Object.entries(userDirectory).map(([id, info]) => ({
    value: id,
    label: `${info.name} (${info.role})`,
  }));

  // Build standard ReportData rows
  const rows = items.map((i) => ({
    timestamp: i.timestamp,
    userName: i.userName,
    userRole: i.userRole,
    action: i.action,
    entityLabel: i.entityLabel,
    summaryText: i.summaryText,
  }));

  return {
    columns: activityColumns,
    rows,
    kpis,
    operators,
    items,
    categoryWorkload,
    availableUsers,
  };
}
