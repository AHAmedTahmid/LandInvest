import { WIDGET_REGISTRY, DASHBOARD_TABS, type DashboardTabKey, type WidgetRegistryEntry } from "./widgets";
import { getUserPermissions } from "@/lib/rbac";

export interface WidgetLayoutItem {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  hidden?: boolean;
}

export type TabbedLayout = Record<DashboardTabKey, WidgetLayoutItem[]>;

// -------------------------------------------------------------
// SYSTEM PRESETS PER TAB
// -------------------------------------------------------------

export const EXECUTIVE_PRESET: TabbedLayout = {
  overview: [
    { key: "active_alerts", x: 0, y: 0, w: 12, h: 2 },
    { key: "cash_balance", x: 0, y: 2, w: 3, h: 2 },
    { key: "bank_balance", x: 3, y: 2, w: 3, h: 2 },
    { key: "total_liquidity", x: 6, y: 2, w: 3, h: 2 },
    { key: "sales_month", x: 9, y: 2, w: 3, h: 2 },
    { key: "project_cost_share", x: 0, y: 4, w: 6, h: 4 },
    { key: "project_cost_vs_sales", x: 6, y: 4, w: 6, h: 4 },
    { key: "quick_actions", x: 0, y: 8, w: 12, h: 2 },
    { key: "net_profit", x: 0, y: 10, w: 6, h: 2 },
  ],
  financial: [
    { key: "cash_balance", x: 0, y: 0, w: 3, h: 2 },
    { key: "bank_balance", x: 3, y: 0, w: 3, h: 2 },
    { key: "total_liquidity", x: 6, y: 0, w: 3, h: 2 },
    { key: "working_capital", x: 9, y: 0, w: 3, h: 2 },
    { key: "cash_flow_trend", x: 0, y: 2, w: 6, h: 4 },
    { key: "cash_flow_forecast", x: 6, y: 2, w: 6, h: 4 },
    { key: "recent_transactions", x: 0, y: 6, w: 12, h: 4 },
  ],
  projects: [
    { key: "capital_deployed", x: 0, y: 0, w: 4, h: 2 },
    { key: "unsold_inventory", x: 4, y: 0, w: 4, h: 2 },
    { key: "portfolio_roi", x: 8, y: 0, w: 4, h: 2 },
    { key: "plot_inventory_status", x: 0, y: 2, w: 6, h: 4 },
    { key: "project_cost_vs_sales", x: 6, y: 2, w: 6, h: 4 },
    { key: "project_summary", x: 0, y: 6, w: 12, h: 4 },
  ],
  sales: [
    { key: "sales_month", x: 0, y: 0, w: 3, h: 2 },
    { key: "collections_month", x: 3, y: 0, w: 3, h: 2 },
    { key: "total_receivables", x: 6, y: 0, w: 3, h: 2 },
    { key: "overdue_receivables", x: 9, y: 0, w: 3, h: 2 },
    { key: "receivables_aging", x: 0, y: 2, w: 6, h: 4 },
    { key: "collection_trend", x: 6, y: 2, w: 6, h: 4 },
    { key: "overdue_installments", x: 0, y: 6, w: 12, h: 4 },
  ],
  partners: [
    { key: "partner_equity", x: 0, y: 0, w: 6, h: 2 },
    { key: "partner_equity_dist", x: 6, y: 0, w: 6, h: 4 },
    { key: "partner_summary", x: 0, y: 4, w: 12, h: 4 },
  ],
  operations: [
    { key: "expenses_month", x: 0, y: 0, w: 4, h: 2 },
    { key: "pending_approvals", x: 4, y: 0, w: 4, h: 2 },
    { key: "expense_breakdown", x: 0, y: 2, w: 6, h: 4 },
    { key: "pending_vouchers", x: 6, y: 2, w: 6, h: 4 },
  ],
};

export const TREASURY_PRESET: TabbedLayout = {
  overview: [
    { key: "cash_balance", x: 0, y: 0, w: 4, h: 2 },
    { key: "bank_balance", x: 4, y: 0, w: 4, h: 2 },
    { key: "total_liquidity", x: 8, y: 0, w: 4, h: 2 },
    { key: "cash_flow_trend", x: 0, y: 2, w: 6, h: 4 },
    { key: "cash_flow_forecast", x: 6, y: 2, w: 6, h: 4 },
    { key: "recent_transactions", x: 0, y: 6, w: 12, h: 4 },
  ],
  financial: EXECUTIVE_PRESET.financial,
  projects: [],
  sales: [],
  partners: [],
  operations: [
    { key: "expenses_month", x: 0, y: 0, w: 6, h: 2 },
    { key: "pending_approvals", x: 6, y: 0, w: 6, h: 2 },
    { key: "pending_vouchers", x: 0, y: 2, w: 12, h: 4 },
  ],
};

export const OPERATIONS_PRESET: TabbedLayout = {
  overview: [
    { key: "capital_deployed", x: 0, y: 0, w: 4, h: 2 },
    { key: "unsold_inventory", x: 4, y: 0, w: 4, h: 2 },
    { key: "expenses_month", x: 8, y: 0, w: 4, h: 2 },
    { key: "plot_inventory_status", x: 0, y: 2, w: 6, h: 4 },
    { key: "expense_breakdown", x: 6, y: 2, w: 6, h: 4 },
    { key: "project_summary", x: 0, y: 6, w: 12, h: 4 },
  ],
  financial: [],
  projects: EXECUTIVE_PRESET.projects,
  sales: [],
  partners: [],
  operations: EXECUTIVE_PRESET.operations,
};

export const PRESETS: Record<string, TabbedLayout> = {
  Executive: EXECUTIVE_PRESET,
  "Treasury/Accountant": TREASURY_PRESET,
  "Operations/Site": OPERATIONS_PRESET,
  "Sales & Collections": {
    ...EXECUTIVE_PRESET,
    overview: EXECUTIVE_PRESET.sales,
  },
  "Partner View": {
    ...EXECUTIVE_PRESET,
    overview: EXECUTIVE_PRESET.partners,
  },
};

/**
 * Resolve effective dashboard layout for user, intersecting with their live permissions.
 */
export async function getEffectiveLayout(
  prisma: any,
  session: any,
  roleName?: string
): Promise<{ layout: TabbedLayout; visibleTabs: DashboardTabKey[] }> {
  const user = session?.user;
  const userId = user?.id || user?.userId;
  const isOwner = !!(user?.isOwner ?? false);

  const permissions = new Set<string>(await getUserPermissions(session));

  // 1. Try personal user layout
  let rawLayout: TabbedLayout | null = null;
  if (userId) {
    try {
      if (prisma.dashboardLayout) {
        const userLayoutRow = await prisma.dashboardLayout.findUnique({
          where: { scope_scopeId: { scope: "USER", scopeId: userId } },
        });
        if (userLayoutRow?.layout) {
          rawLayout = typeof userLayoutRow.layout === "string" ? JSON.parse(userLayoutRow.layout) : userLayoutRow.layout;
        }
      } else {
        const rows: any = await prisma.$queryRaw`SELECT layout FROM dashboard_layouts WHERE scope = 'USER' AND scope_id = ${userId} LIMIT 1`;
        if (rows && rows.length > 0 && rows[0].layout) {
          rawLayout = typeof rows[0].layout === "string" ? JSON.parse(rows[0].layout) : rows[0].layout;
        }
      }
    } catch (e) {
      console.warn("Could not load user layout:", e);
    }
  }

  // 2. Try role default layout
  if (!rawLayout && user?.roleId) {
    try {
      if (prisma.dashboardLayout) {
        const roleLayoutRow = await prisma.dashboardLayout.findUnique({
          where: { scope_scopeId: { scope: "ROLE", scopeId: user.roleId } },
        });
        if (roleLayoutRow?.layout) {
          rawLayout = typeof roleLayoutRow.layout === "string" ? JSON.parse(roleLayoutRow.layout) : roleLayoutRow.layout;
        }
      } else {
        const rows: any = await prisma.$queryRaw`SELECT layout FROM dashboard_layouts WHERE scope = 'ROLE' AND scope_id = ${user.roleId} LIMIT 1`;
        if (rows && rows.length > 0 && rows[0].layout) {
          rawLayout = typeof rows[0].layout === "string" ? JSON.parse(rows[0].layout) : rows[0].layout;
        }
      }
    } catch (e) {
      console.warn("Could not load role layout:", e);
    }
  }

  // 3. Fallback to system preset based on role
  if (!rawLayout) {
    const rName = (roleName || user?.role || "").toLowerCase();
    if (rName.includes("accountant") || rName.includes("treasury")) {
      rawLayout = JSON.parse(JSON.stringify(TREASURY_PRESET));
    } else if (rName.includes("site") || rName.includes("operation")) {
      rawLayout = JSON.parse(JSON.stringify(OPERATIONS_PRESET));
    } else {
      rawLayout = JSON.parse(JSON.stringify(EXECUTIVE_PRESET));
    }
  }

  // 4. Intersect layout with current permissions
  const effectiveLayout: TabbedLayout = {
    overview: [],
    financial: [],
    projects: [],
    sales: [],
    partners: [],
    operations: [],
  };

  const visibleTabs: DashboardTabKey[] = [];

  for (const tab of DASHBOARD_TABS) {
    const tabKey = tab.key;
    const canTab = isOwner || permissions.has(`dashboard.tab.${tabKey}`);
    if (!canTab) continue;

    const savedItems: WidgetLayoutItem[] = rawLayout?.[tabKey] || [];
    const filteredItems: WidgetLayoutItem[] = [];
    const placedKeys = new Set<string>();

    // Keep permitted widgets from saved layout
    for (const item of savedItems) {
      const widgetDef = WIDGET_REGISTRY[item.key];
      if (!widgetDef) continue;
      const canWidget = isOwner || permissions.has(`dashboard.widget.${item.key}`);
      if (canWidget) {
        filteredItems.push(item);
        placedKeys.add(item.key);
      }
    }

    // Append newly granted widgets belonging to this tab if missing
    for (const [key, widget] of Object.entries(WIDGET_REGISTRY)) {
      if (widget.tab === tabKey && !placedKeys.has(key)) {
        const canWidget = isOwner || permissions.has(`dashboard.widget.${key}`);
        if (canWidget) {
          filteredItems.push({
            key,
            x: 0,
            y: 99,
            w: widget.defaultSize.w,
            h: widget.defaultSize.h,
            hidden: false,
          });
          placedKeys.add(key);
        }
      }
    }

    effectiveLayout[tabKey] = filteredItems;
    if (filteredItems.length > 0) {
      visibleTabs.push(tabKey);
    }
  }

  return { layout: effectiveLayout, visibleTabs };
}

