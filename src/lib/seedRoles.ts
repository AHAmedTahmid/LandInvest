import { randomUUID } from "crypto";
import { ALL_KEYS, type PermissionKey } from "@/lib/permissions";

export const DEFAULT_ROLES: { name: string; description: string; isSystem: boolean; keys: PermissionKey[] }[] = [
  {
    name: "Owner",
    description: "Full access — cannot be edited or deleted",
    isSystem: true,
    keys: [...ALL_KEYS],
  },
  {
    name: "Managing Partner",
    description: "Executive access across all operations, financial ledgers, and reporting",
    isSystem: false,
    keys: ALL_KEYS.filter((k) => !["users.manage", "roles.manage", "billing.manage"].includes(k)) as PermissionKey[],
  },
  {
    name: "Accountant",
    description: "Treasury ledger, cash & bank management, payment collection, and expense accounting",
    isSystem: false,
    keys: [
      "dashboard.view",
      "dashboard.tab.overview",
      "dashboard.tab.financial",
      "dashboard.tab.operations",
      "dashboard.customize",
      "dashboard.export",
      "dashboard.widget.cash_balance",
      "dashboard.widget.bank_balance",
      "dashboard.widget.total_liquidity",
      "dashboard.widget.working_capital",
      "dashboard.widget.cash_flow_trend",
      "dashboard.widget.cash_flow_forecast",
      "dashboard.widget.recent_transactions",
      "dashboard.widget.expenses_month",
      "dashboard.widget.pending_approvals",
      "dashboard.widget.pending_vouchers",
      "dashboard.widget.quick_actions",
      "expenses.view",
      "expenses.create",
      "sales.view",
      "sales.collect",
      "receipts.print",
      "treasury.view",
      "treasury.bank.manage",
      "treasury.contra.create",
      "reports.view",
      "reports.financial.view",
    ] as PermissionKey[],
  },
  {
    name: "Site Manager",
    description: "Land projects inspection, plots management, and on-site project expense entries",
    isSystem: false,
    keys: [
      "dashboard.view",
      "dashboard.tab.overview",
      "dashboard.tab.projects",
      "dashboard.tab.operations",
      "dashboard.customize",
      "dashboard.widget.capital_deployed",
      "dashboard.widget.unsold_inventory",
      "dashboard.widget.plot_inventory_status",
      "dashboard.widget.project_cost_vs_sales",
      "dashboard.widget.project_summary",
      "dashboard.widget.expenses_month",
      "dashboard.widget.pending_approvals",
      "dashboard.widget.expense_breakdown",
      "dashboard.widget.quick_actions",
      "projects.view",
      "plots.manage",
      "expenses.view",
      "expenses.create",
      "reports.view",
      "reports.projects.view",
    ] as PermissionKey[],
  },
];

export async function seedDefaultRoles(prisma: any, createdBy: string | null) {
  for (const r of DEFAULT_ROLES) {
    let role = await prisma.role.findUnique({ where: { name: r.name } });
    if (!role) {
      const id = randomUUID();
      role = await prisma.role.create({
        data: { id, name: r.name, description: r.description, isSystem: r.isSystem, createdBy },
      });
    }

    if (!r.isSystem) {
      // Synchronize role permissions
      const existingPerms = await prisma.rolePermission.findMany({ where: { roleId: role.id } });
      const targetKeys = new Set(r.keys);
      for (const p of existingPerms) {
        if (!targetKeys.has(p.permissionKey)) {
          await prisma.rolePermission.delete({
            where: { roleId_permissionKey: { roleId: role.id, permissionKey: p.permissionKey } },
          });
        }
      }
      const existingSet = new Set(existingPerms.map((p: any) => p.permissionKey));
      for (const k of r.keys) {
        if (!existingSet.has(k)) {
          await prisma.rolePermission.create({ data: { roleId: role.id, permissionKey: k } });
        }
      }
    }
  }
}
