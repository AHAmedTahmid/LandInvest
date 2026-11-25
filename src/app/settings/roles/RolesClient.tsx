"use client";

import { useEffect, useState, useMemo } from "react";
import { PERMISSIONS, type PermissionKey, type PermissionGroup, type PermissionDef, type ActionType } from "@/lib/permissions";
import { DASHBOARD_TABS, WIDGET_REGISTRY } from "@/lib/dashboard/widgets";
import {
  Shield,
  Sliders,
  Eye,
  AlertTriangle,
  Search,
  CheckSquare,
  Sparkles,
  ExternalLink,
  X,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  DollarSign,
  Building2,
  Layers,
  Users,
  Landmark,
  BarChart3,
  Lock,
  ShieldAlert,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";

type Role = {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permCount: number;
  userCount: number;
  permissions: string[];
};

// Module icon mapping
const MODULE_ICONS: Record<string, any> = {
  dashboard: Sliders,
  projects: Building2,
  plots: Layers,
  sales: DollarSign,
  expenses: FileText,
  partners: Users,
  treasury: Landmark,
  profit: BarChart3,
  reports: BarChart3,
  admin: ShieldAlert,
};

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState<"all" | "system" | "custom">("all");
  const [editing, setEditing] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchPerms, setSearchPerms] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState<"matrix" | "dashboard">("matrix");
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState<Role | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/roles");
      const d = await r.json();
      if (Array.isArray(d)) setRoles(d);
    } catch {
      setFeedback({ type: "error", text: "Failed to load roles from server." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormDesc("");
    // Give default baseline: dashboard view + overview tab
    setSelected(new Set(["dashboard.view", "dashboard.tab.overview"]));
    setFeedback(null);
    setActiveEditorTab("matrix");
    setFormOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditing(role);
    setFormName(role.name);
    setFormDesc(role.description ?? "");
    setSelected(new Set(role.permissions));
    setFeedback(null);
    setActiveEditorTab("matrix");
    setFormOpen(true);
  };

  const openDuplicate = (role: Role) => {
    setEditing(null);
    setFormName(role.name + " (Copy)");
    setFormDesc(role.description ? `Copy of ${role.name}: ${role.description}` : `Copy of ${role.name}`);
    setSelected(new Set(role.permissions));
    setFeedback(null);
    setActiveEditorTab("matrix");
    setFormOpen(true);
  };

  const toggle = (k: string) => {
    const s = new Set(selected);
    if (s.has(k)) s.delete(k);
    else s.add(k);
    setSelected(s);
  };

  const toggleAllInKeys = (keys: string[], targetState?: boolean) => {
    const s = new Set(selected);
    const shouldAdd = targetState !== undefined ? targetState : !keys.every((k) => s.has(k));
    for (const k of keys) {
      if (shouldAdd) s.add(k);
      else s.delete(k);
    }
    setSelected(s);
  };

  // Operational Modules (excluding dashboard which has its own tab)
  const operationalModules = useMemo(() => {
    return PERMISSIONS.filter((g) => g.module !== "dashboard");
  }, []);

  // Quick Module Actions
  const setModuleAccess = (group: PermissionGroup, mode: "view_only" | "full" | "clear") => {
    const s = new Set(selected);
    const allKeys = group.permissions.map((p) => p.key);

    if (mode === "clear") {
      allKeys.forEach((k) => s.delete(k));
    } else if (mode === "view_only") {
      // Clear all module keys first, then add only view/read keys
      allKeys.forEach((k) => s.delete(k));
      group.permissions
        .filter((p) => p.actionType === "view")
        .forEach((p) => s.add(p.key));
    } else if (mode === "full") {
      allKeys.forEach((k) => s.add(k));
    }

    setSelected(s);
  };

  // Global Role Presets
  const applyRolePreset = (preset: "auditor" | "sales" | "accountant" | "site" | "executive" | "superadmin" | "clear_ops") => {
    const s = new Set(selected);

    if (preset === "clear_ops") {
      operationalModules.forEach((m) => {
        m.permissions.forEach((p) => s.delete(p.key));
      });
      setSelected(s);
      return;
    }

    if (preset === "superadmin") {
      operationalModules.forEach((m) => {
        m.permissions.forEach((p) => s.add(p.key));
      });
      s.add("dashboard.view");
      s.add("dashboard.customize");
      s.add("dashboard.layout.manage");
      s.add("dashboard.export");
      s.add("dashboard.settings.manage");
      DASHBOARD_TABS.forEach((t) => s.add(`dashboard.tab.${t.key}`));
      Object.keys(WIDGET_REGISTRY).forEach((w) => s.add(`dashboard.widget.${w}`));
      setSelected(s);
      return;
    }

    if (preset === "auditor") {
      // READ-ONLY EVERYWHERE!
      operationalModules.forEach((m) => {
        m.permissions.forEach((p) => {
          if (p.actionType === "view") s.add(p.key);
          else s.delete(p.key);
        });
      });
      s.add("dashboard.view");
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.financial");
      s.add("dashboard.tab.projects");
      s.add("dashboard.tab.sales");
      s.add("dashboard.tab.partners");
      setSelected(s);
      return;
    }

    if (preset === "sales") {
      const salesKeys: PermissionKey[] = [
        "dashboard.view",
        "dashboard.tab.overview",
        "dashboard.tab.sales",
        "plots.view",
        "sales.view",
        "sales.create",
        "sales.collect",
        "receipts.print",
        "reports.view",
        "reports.sales.view",
      ];
      // clear other operational keys
      operationalModules.forEach((m) => {
        m.permissions.forEach((p) => {
          if (!salesKeys.includes(p.key)) s.delete(p.key);
        });
      });
      salesKeys.forEach((k) => s.add(k));
      setSelected(s);
      return;
    }

    if (preset === "accountant") {
      const accKeys: PermissionKey[] = [
        "dashboard.view",
        "dashboard.tab.overview",
        "dashboard.tab.financial",
        "dashboard.customize",
        "dashboard.export",
        "expenses.view",
        "expenses.create",
        "expenses.edit",
        "sales.view",
        "sales.collect",
        "receipts.print",
        "treasury.view",
        "treasury.bank.create",
        "treasury.bank.edit",
        "treasury.bank.manage",
        "treasury.contra.create",
        "reports.view",
        "reports.export",
        "reports.financial.view",
        "reports.sales.view",
      ];
      accKeys.forEach((k) => s.add(k));
      setSelected(s);
      return;
    }

    if (preset === "site") {
      const siteKeys: PermissionKey[] = [
        "dashboard.view",
        "dashboard.tab.overview",
        "dashboard.tab.projects",
        "projects.view",
        "projects.create",
        "projects.edit",
        "plots.view",
        "plots.create",
        "plots.edit",
        "plots.manage",
        "expenses.view",
        "expenses.create",
        "expenses.edit",
        "reports.view",
        "reports.projects.view",
      ];
      siteKeys.forEach((k) => s.add(k));
      setSelected(s);
      return;
    }

    if (preset === "executive") {
      // All operational permissions except system security deletion
      operationalModules.forEach((m) => {
        m.permissions.forEach((p) => {
          if (!["users.delete", "roles.delete", "roles.manage"].includes(p.key)) {
            s.add(p.key);
          }
        });
      });
      s.add("dashboard.view");
      s.add("dashboard.customize");
      s.add("dashboard.export");
      DASHBOARD_TABS.forEach((t) => s.add(`dashboard.tab.${t.key}`));
      setSelected(s);
      return;
    }
  };

  // Dashboard Tab Presets
  const applyDashboardPreset = (presetName: string) => {
    const s = new Set(selected);
    s.add("dashboard.view");
    s.add("dashboard.customize");
    s.add("dashboard.export");

    if (presetName === "Executive") {
      DASHBOARD_TABS.forEach((t) => s.add(`dashboard.tab.${t.key}`));
      Object.keys(WIDGET_REGISTRY).forEach((w) => s.add(`dashboard.widget.${w}`));
    } else if (presetName === "Treasury/Accountant") {
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.financial");
      s.add("dashboard.tab.operations");
      [
        "cash_balance", "bank_balance", "total_liquidity", "working_capital",
        "cash_flow_trend", "cash_flow_forecast", "recent_transactions",
        "expenses_month", "pending_approvals", "pending_vouchers", "quick_actions",
      ].forEach((w) => s.add(`dashboard.widget.${w}`));
    } else if (presetName === "Operations/Site") {
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.projects");
      s.add("dashboard.tab.operations");
      [
        "capital_deployed", "unsold_inventory", "expenses_month", "plot_inventory_status",
        "project_cost_vs_sales", "project_summary", "pending_approvals", "expense_breakdown", "quick_actions",
      ].forEach((w) => s.add(`dashboard.widget.${w}`));
    } else if (presetName === "Sales & Collections") {
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.sales");
      [
        "sales_month", "collections_month", "total_receivables", "overdue_receivables",
        "receivables_aging", "collection_trend", "overdue_installments", "quick_actions",
      ].forEach((w) => s.add(`dashboard.widget.${w}`));
    } else if (presetName === "Partner View") {
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.partners");
      ["partner_equity", "partner_equity_dist", "partner_summary", "quick_actions"].forEach((w) => s.add(`dashboard.widget.${w}`));
    }

    setSelected(s);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setFeedback({ type: "error", text: "Role name cannot be empty." });
      return;
    }

    try {
      setSaving(true);
      const payload = { name: formName.trim(), description: formDesc.trim() || null, permissionKeys: [...selected] };
      const url = editing ? `/api/roles/${editing.id}` : "/api/roles";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: d.error || "Failed to save role permissions." });
      } else {
        setFeedback({ type: "success", text: `Role "${formName}" permissions saved successfully.` });
        setFormOpen(false);
        load();
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while saving role." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmRole) return;
    try {
      const res = await fetch(`/api/roles/${deleteConfirmRole.id}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: d.error || "Failed to delete role." });
      } else {
        setFeedback({ type: "success", text: `Role "${deleteConfirmRole.name}" deleted successfully.` });
        load();
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while deleting role." });
    } finally {
      setDeleteConfirmRole(null);
    }
  };

  // Filtered roles list
  const filteredRoles = roles.filter((r) => {
    const matchQ = !q || r.name.toLowerCase().includes(q.toLowerCase()) || (r.description && r.description.toLowerCase().includes(q.toLowerCase()));
    if (!matchQ) return false;
    if (filterType === "system") return r.isSystem;
    if (filterType === "custom") return !r.isSystem;
    return true;
  });

  // KPI calculations
  const totalRoles = roles.length;
  const customRolesCount = roles.filter((r) => !r.isSystem).length;
  const totalGovernedUsers = roles.reduce((sum, r) => sum + r.userCount, 0);

  // Filtered operational modules for search inside modal
  const filteredOperationalModules = useMemo(() => {
    if (!searchPerms.trim()) return operationalModules;
    const term = searchPerms.toLowerCase();
    return operationalModules
      .map((g) => ({
        ...g,
        permissions: g.permissions.filter(
          (p) =>
            p.key.toLowerCase().includes(term) ||
            p.en.toLowerCase().includes(term) ||
            p.bn.includes(term) ||
            g.moduleEn.toLowerCase().includes(term)
        ),
      }))
      .filter((g) => g.permissions.length > 0);
  }, [operationalModules, searchPerms]);

  // Selected permission counts breakdown
  const stats = useMemo(() => {
    let views = 0;
    let creates = 0;
    let edits = 0;
    let deletes = 0;
    let actions = 0;
    let dashboardPerms = 0;

    for (const key of selected) {
      if (key.startsWith("dashboard.")) {
        dashboardPerms++;
      } else {
        for (const m of operationalModules) {
          const p = m.permissions.find((perm) => perm.key === key);
          if (p) {
            if (p.actionType === "view") views++;
            else if (p.actionType === "create") creates++;
            else if (p.actionType === "edit") edits++;
            else if (p.actionType === "delete") deletes++;
            else actions++;
            break;
          }
        }
      }
    }

    return { views, creates, edits, deletes, actions, dashboardPerms, total: selected.size };
  }, [selected, operationalModules]);

  // Widgets grouped by category
  const widgetsList = Object.values(WIDGET_REGISTRY);
  const widgetCategories = Array.from(new Set(widgetsList.map((w) => w.category)));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-olive-700 text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                Role Governance & RBAC Matrix
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure granular module permissions (View, Create, Edit, Delete) and role-specific dashboard views
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={load}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs"
            title="Refresh roles"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-olive-700" : ""}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-olive-700 hover:bg-olive-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Role</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:bg-black/5 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Security Roles</span>
            <Shield className="w-4 h-4 text-olive-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{totalRoles}</span>
            <span className="text-xs text-gray-500 font-medium">total configured</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Custom Roles</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{customRolesCount}</span>
            <span className="text-xs text-gray-500 font-medium">tailored access</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Governed Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{totalGovernedUsers}</span>
            <span className="text-xs text-gray-500 font-medium">assigned memberships</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">System Modules</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{operationalModules.length}</span>
            <span className="text-xs text-gray-500 font-medium">CRUD protected</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            placeholder="Search roles by title or scope..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border border-gray-200 bg-white rounded-xl pl-9 pr-3 py-2 text-xs w-full shadow-2xs focus:outline-hidden focus:border-olive-600"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200/80 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === "all" ? "bg-white text-gray-900 shadow-2xs font-semibold" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Roles ({roles.length})
          </button>
          <button
            onClick={() => setFilterType("system")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === "system" ? "bg-white text-gray-900 shadow-2xs font-semibold" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            System ({roles.filter((r) => r.isSystem).length})
          </button>
          <button
            onClick={() => setFilterType("custom")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === "custom" ? "bg-white text-gray-900 shadow-2xs font-semibold" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Custom ({roles.filter((r) => !r.isSystem).length})
          </button>
        </div>
      </div>

      {/* Roles Grid / Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-left bg-gray-50/80 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Role Title & Type</th>
                <th className="p-4">Description & Scope</th>
                <th className="p-4 text-center">Assigned Users</th>
                <th className="p-4 text-center">Granted Permissions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRoles.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl shrink-0 ${r.isSystem ? "bg-amber-100 text-amber-800" : "bg-olive-100 text-olive-800"}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          <span>{r.name}</span>
                          {r.isSystem && (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold px-2 py-0.5 rounded-full">
                              System Preset
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {r.isSystem ? "Built-in core role" : "Custom defined role"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 max-w-sm">
                    <p className="line-clamp-2 leading-relaxed">{r.description || "No specific scope description provided."}</p>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 font-medium">
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      <span>{r.userCount} {r.userCount === 1 ? "member" : "members"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-olive-50 border border-olive-200/70 text-olive-900 font-bold">
                      <KeyRound className="w-3.5 h-3.5 text-olive-700" />
                      <span>{r.isSystem ? "All Permissions (Full)" : `${r.permCount} keys`}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(r)}
                        disabled={r.isSystem}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-olive-800 hover:bg-olive-50 border border-transparent hover:border-olive-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
                        title={r.isSystem ? "System role cannot be modified" : "Configure role permissions"}
                      >
                        <Sliders className="w-3.5 h-3.5 text-olive-700" />
                        <span>Edit Access</span>
                      </button>
                      <button
                        onClick={() => openDuplicate(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                        title="Duplicate as new custom role"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                        <span>Duplicate</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmRole(r)}
                        disabled={r.isSystem}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
                        title={r.isSystem ? "System role cannot be deleted" : "Delete role"}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gray-700">No roles found matching criteria</p>
                    <p className="text-xs text-gray-400 mt-1">Try clearing search or filters to see all roles</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Editor Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-5xl w-full overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-olive-700 text-white shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base md:text-lg">
                    {editing ? `Configure Permissions: ${editing.name}` : "Create Custom Security Role"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Define granular operational access (View, Create, Edit, Delete) and custom dashboard layouts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 shadow-2xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-olive-700" />
                  <span>Preview Role View</span>
                </button>
                <button
                  onClick={() => setFormOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Role Metadata Input Form */}
            <div className="p-5 bg-white border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Senior Land Surveyor, Accounts Officer"
                  className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full shadow-2xs focus:outline-hidden focus:border-olive-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Scope & Description</label>
                <input
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Field site operations, voucher entries, and plot inspections"
                  className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full shadow-2xs focus:outline-hidden focus:border-olive-600"
                />
              </div>
            </div>

            {/* Tab switch between Operational Matrix and Dashboard Access */}
            <div className="flex items-center justify-between px-5 pt-3 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab("matrix")}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeEditorTab === "matrix"
                      ? "border-olive-700 text-olive-800"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Operational CRUD Matrix</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-olive-100 text-olive-800">
                    {stats.total - stats.dashboardPerms} keys
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEditorTab("dashboard")}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeEditorTab === "dashboard"
                      ? "border-olive-700 text-olive-800"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Dashboard Views & Widgets</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {stats.dashboardPerms} active
                  </span>
                </button>
              </div>

              {/* Matrix Live Counter Stats */}
              <div className="hidden md:flex items-center gap-2 text-[11px] pb-2 text-gray-600">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200/60">
                  👁️ {stats.views} Views
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">
                  ➕ {stats.creates} Creates
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200/60">
                  ✏️ {stats.edits} Edits
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-semibold border border-rose-200/60">
                  🗑️ {stats.deletes} Deletes
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeEditorTab === "matrix" ? (
                <div className="space-y-4">
                  {/* Presets Toolbar */}
                  <div className="bg-olive-50/70 border border-olive-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-olive-900">
                        <Sparkles className="w-4 h-4 text-olive-700" />
                        <span>Quick Role Templates (One-Click Presets):</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyRolePreset("clear_ops")}
                        className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 transition-colors"
                      >
                        Clear Operational Keys
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => applyRolePreset("auditor")}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-blue-50 border border-blue-300 text-blue-900 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-700" />
                        <span>Auditor (Read-Only)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyRolePreset("sales")}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Sales Representative</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyRolePreset("accountant")}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-purple-50 border border-purple-300 text-purple-900 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Landmark className="w-3.5 h-3.5 text-purple-700" />
                        <span>Accountant / Treasury</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyRolePreset("site")}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Building2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Site Supervisor</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyRolePreset("executive")}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-olive-100 border border-olive-300 text-olive-900 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Shield className="w-3.5 h-3.5 text-olive-700" />
                        <span>Executive Partner</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyRolePreset("superadmin")}
                        className="px-3 py-1.5 text-xs font-semibold bg-gray-900 hover:bg-black text-white rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Select All (Full Admin)</span>
                      </button>
                    </div>
                  </div>

                  {/* Operational Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      value={searchPerms}
                      onChange={(e) => setSearchPerms(e.target.value)}
                      placeholder="Search permissions by name, key, or Bengali translation..."
                      className="border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs w-full shadow-2xs focus:outline-hidden focus:border-olive-600"
                    />
                  </div>

                  {/* Modules CRUD Matrix Cards */}
                  <div className="space-y-3.5">
                    {filteredOperationalModules.map((group) => {
                      const Icon = MODULE_ICONS[group.module] || Shield;
                      const allModuleKeys = group.permissions.map((p) => p.key);
                      const grantedInModule = allModuleKeys.filter((k) => selected.has(k)).length;
                      const isAllGranted = grantedInModule === allModuleKeys.length;

                      // Categorize permissions into CRUD + Action
                      const viewPerms = group.permissions.filter((p) => p.actionType === "view");
                      const createPerms = group.permissions.filter((p) => p.actionType === "create");
                      const editPerms = group.permissions.filter((p) => p.actionType === "edit");
                      const deletePerms = group.permissions.filter((p) => p.actionType === "delete");
                      const actionPerms = group.permissions.filter((p) => p.actionType === "action");

                      return (
                        <div
                          key={group.module}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            grantedInModule > 0
                              ? "border-olive-300/80 bg-white shadow-2xs"
                              : "border-gray-200 bg-gray-50/50"
                          }`}
                        >
                          {/* Module Header Bar */}
                          <div className="p-3.5 bg-gray-50/90 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`p-2 rounded-xl shrink-0 ${
                                  grantedInModule > 0 ? "bg-olive-700 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
                                  <span>{group.moduleEn}</span>
                                  <span className="text-gray-400 font-normal text-xs">({group.moduleBn})</span>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                  {group.descriptionEn || "Module operational controls"}
                                </div>
                              </div>
                            </div>

                            {/* Module Quick Actions */}
                            <div className="flex items-center gap-1.5 self-end sm:self-auto">
                              <span className="text-[11px] font-bold text-gray-500 mr-1">
                                {grantedInModule} / {allModuleKeys.length}
                              </span>
                              <button
                                type="button"
                                onClick={() => setModuleAccess(group, "view_only")}
                                className="px-2 py-1 text-[11px] font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                              >
                                View Only
                              </button>
                              <button
                                type="button"
                                onClick={() => setModuleAccess(group, "full")}
                                className="px-2 py-1 text-[11px] font-semibold bg-olive-50 text-olive-800 hover:bg-olive-100 border border-olive-200 rounded-lg transition-colors"
                              >
                                Full Access
                              </button>
                              <button
                                type="button"
                                onClick={() => setModuleAccess(group, "clear")}
                                className="px-2 py-1 text-[11px] font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                Clear
                              </button>
                            </div>
                          </div>

                          {/* Module CRUD Grid */}
                          <div className="p-4 space-y-3 bg-white">
                            {/* Standard CRUD Columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                              {/* View (Read-Only) */}
                              <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/20 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                                    <span>View / Read</span>
                                  </span>
                                  {viewPerms.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleAllInKeys(viewPerms.map((p) => p.key))}
                                      className="text-[10px] text-blue-700 hover:underline"
                                    >
                                      All
                                    </button>
                                  )}
                                </div>
                                {viewPerms.length > 0 ? (
                                  viewPerms.map((p) => (
                                    <label
                                      key={p.key}
                                      className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-blue-50/60 cursor-pointer text-xs"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selected.has(p.key)}
                                        onChange={() => toggle(p.key)}
                                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                                      />
                                      <div className="min-w-0">
                                        <div className="font-semibold text-gray-800 leading-tight">{p.en}</div>
                                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.key}</div>
                                      </div>
                                    </label>
                                  ))
                                ) : (
                                  <div className="text-[11px] text-gray-400 italic py-1">Inherited via module</div>
                                )}
                              </div>

                              {/* Create (Add New) */}
                              <div className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/20 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Create / Add</span>
                                  </span>
                                  {createPerms.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleAllInKeys(createPerms.map((p) => p.key))}
                                      className="text-[10px] text-emerald-700 hover:underline"
                                    >
                                      All
                                    </button>
                                  )}
                                </div>
                                {createPerms.length > 0 ? (
                                  createPerms.map((p) => (
                                    <label
                                      key={p.key}
                                      className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50/60 cursor-pointer text-xs"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selected.has(p.key)}
                                        onChange={() => toggle(p.key)}
                                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                                      />
                                      <div className="min-w-0">
                                        <div className="font-semibold text-gray-800 leading-tight">{p.en}</div>
                                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.key}</div>
                                      </div>
                                    </label>
                                  ))
                                ) : (
                                  <div className="text-[11px] text-gray-400 italic py-1">N/A in module</div>
                                )}
                              </div>

                              {/* Edit (Modify) */}
                              <div className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/20 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Edit / Modify</span>
                                  </span>
                                  {editPerms.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleAllInKeys(editPerms.map((p) => p.key))}
                                      className="text-[10px] text-amber-700 hover:underline"
                                    >
                                      All
                                    </button>
                                  )}
                                </div>
                                {editPerms.length > 0 ? (
                                  editPerms.map((p) => (
                                    <label
                                      key={p.key}
                                      className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-amber-50/60 cursor-pointer text-xs"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selected.has(p.key)}
                                        onChange={() => toggle(p.key)}
                                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                                      />
                                      <div className="min-w-0">
                                        <div className="font-semibold text-gray-800 leading-tight">{p.en}</div>
                                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.key}</div>
                                      </div>
                                    </label>
                                  ))
                                ) : (
                                  <div className="text-[11px] text-gray-400 italic py-1">N/A in module</div>
                                )}
                              </div>

                              {/* Delete (Remove) */}
                              <div className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/20 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-rose-900 uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Delete / Remove</span>
                                  </span>
                                  {deletePerms.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleAllInKeys(deletePerms.map((p) => p.key))}
                                      className="text-[10px] text-rose-700 hover:underline"
                                    >
                                      All
                                    </button>
                                  )}
                                </div>
                                {deletePerms.length > 0 ? (
                                  deletePerms.map((p) => (
                                    <label
                                      key={p.key}
                                      className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-rose-50/60 cursor-pointer text-xs"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selected.has(p.key)}
                                        onChange={() => toggle(p.key)}
                                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                                      />
                                      <div className="min-w-0">
                                        <div className="font-semibold text-gray-800 leading-tight">{p.en}</div>
                                        <div className="text-[10px] text-rose-500 font-mono mt-0.5">{p.key}</div>
                                      </div>
                                    </label>
                                  ))
                                ) : (
                                  <div className="text-[11px] text-gray-400 italic py-1">N/A in module</div>
                                )}
                              </div>
                            </div>

                            {/* Module Special Actions (if any) */}
                            {actionPerms.length > 0 && (
                              <div className="pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Special Module Actions & Workflows ({actionPerms.length})</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {actionPerms.map((p) => (
                                    <label
                                      key={p.key}
                                      className={`flex items-start gap-2 p-2 rounded-xl border transition-all cursor-pointer text-xs ${
                                        selected.has(p.key)
                                          ? "bg-purple-50/40 border-purple-300 text-purple-950 font-medium"
                                          : "bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100/70"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selected.has(p.key)}
                                        onChange={() => toggle(p.key)}
                                        className="mt-0.5 rounded text-purple-700 focus:ring-purple-500"
                                      />
                                      <div className="min-w-0">
                                        <div className="font-bold text-gray-900 leading-tight">{p.en}</div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">{p.bn}</div>
                                        <div className="text-[9px] text-gray-400 font-mono mt-0.5">{p.key}</div>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Dashboard Tab & Widget Settings */
                <div className="space-y-4">
                  {/* Dashboard Presets */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      <span>One-Click Dashboard View Presets:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Executive", "Treasury/Accountant", "Operations/Site", "Sales & Collections", "Partner View"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => applyDashboardPreset(p)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-blue-100/60 border border-blue-300 text-blue-900 rounded-xl shadow-2xs transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard Management Capabilities */}
                  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                    <span className="font-bold text-xs text-gray-800 block mb-2.5">
                      Dashboard Management Capabilities
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {[
                        { key: "dashboard.view", label: "Open Main Dashboard", desc: "Access default workspace" },
                        { key: "dashboard.customize", label: "Customize Own Layout", desc: "Drag & toggle widgets" },
                        { key: "dashboard.layout.manage", label: "Manage Role Layouts", desc: "Save default blueprints" },
                        { key: "dashboard.export", label: "Export Dashboard", desc: "Download PDF & PNG" },
                      ].map((cp) => (
                        <label
                          key={cp.key}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selected.has(cp.key)
                              ? "bg-white border-olive-500 shadow-2xs"
                              : "bg-white/60 border-gray-200 text-gray-600"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.has(cp.key)}
                            onChange={() => toggle(cp.key)}
                            className="mt-0.5 rounded text-olive-700 focus:ring-olive-500"
                          />
                          <div>
                            <div className="font-bold text-gray-900 text-xs">{cp.label}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{cp.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Granted Dashboard Views (Tabs) */}
                  <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">Granted Dashboard Tabs</span>
                        <span className="text-[11px] text-gray-400">Tabs visible in the top navigation bar</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAllInKeys(DASHBOARD_TABS.map((t) => `dashboard.tab.${t.key}`))}
                        className="text-[11px] font-semibold text-olive-700 hover:text-olive-900"
                      >
                        Toggle All Tabs
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                      {DASHBOARD_TABS.map((tab) => {
                        const tabKey = `dashboard.tab.${tab.key}`;
                        const isGranted = selected.has(tabKey);
                        return (
                          <label
                            key={tabKey}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isGranted
                                ? "bg-olive-50/50 border-olive-400 text-olive-950 font-semibold shadow-2xs"
                                : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => toggle(tabKey)}
                              className="rounded text-olive-700 focus:ring-olive-500"
                            />
                            <span className="truncate">{tab.title.en}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Widgets by Category */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">Available Dashboard Widgets</span>
                      <span className="text-[11px] text-gray-400">Configure which metrics this role can inspect</span>
                    </div>
                    {widgetCategories.map((cat) => {
                      const catWidgets = widgetsList.filter((w) => w.category === cat);
                      const allCatKeys = catWidgets.map((w) => `dashboard.widget.${w.key}`);
                      return (
                        <div key={cat} className="border border-gray-200 rounded-2xl p-4 bg-white">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
                              {cat} ({catWidgets.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleAllInKeys(allCatKeys)}
                              className="text-[11px] font-semibold text-olive-700 hover:text-olive-900"
                            >
                              Select all in {cat}
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {catWidgets.map((w) => {
                              const wKey = `dashboard.widget.${w.key}`;
                              const isChecked = selected.has(wKey);
                              const hasModulePerm =
                                !w.requiresModules || w.requiresModules.some((m) => selected.has(m));
                              return (
                                <div
                                  key={w.key}
                                  className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
                                    isChecked
                                      ? "bg-olive-50/30 border-olive-400/80 shadow-2xs"
                                      : "bg-gray-50/40 border-gray-200 text-gray-600"
                                  }`}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggle(wKey)}
                                      className="mt-0.5 rounded text-olive-700 focus:ring-olive-500"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="font-bold text-gray-900 truncate">{w.title.en}</div>
                                      <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                                        {w.description.en}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Warning if widget drilldown is missing required module */}
                                  {isChecked && !hasModulePerm && (
                                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[10px] text-amber-800 font-medium">
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                      <span className="truncate">
                                        Drill-down requires module: {w.requiresModules?.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>Total Permissions Selected:</span>
                <span className="font-mono font-bold text-olive-800 text-sm">{selected.size} keys</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-olive-700 hover:bg-olive-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Role Permissions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Live Simulation Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-3xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Simulated Workspace Access: {formName || "Custom Role"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Live verification of granted operational actions and visible dashboard components
                </p>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Operational CRUD Summary */}
              <div>
                <span className="text-xs font-bold text-gray-800 block mb-2">Operational Permissions Summary</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 bg-blue-50 border border-blue-200/70 rounded-xl text-center">
                    <span className="block text-xl font-bold text-blue-900">{stats.views}</span>
                    <span className="text-[11px] font-semibold text-blue-700">Views (Read-Only)</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl text-center">
                    <span className="block text-xl font-bold text-emerald-900">{stats.creates}</span>
                    <span className="text-[11px] font-semibold text-emerald-700">Create / Add</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-center">
                    <span className="block text-xl font-bold text-amber-900">{stats.edits}</span>
                    <span className="text-[11px] font-semibold text-amber-700">Edit / Modify</span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200/70 rounded-xl text-center">
                    <span className="block text-xl font-bold text-rose-900">{stats.deletes}</span>
                    <span className="text-[11px] font-semibold text-rose-700">Delete / Remove</span>
                  </div>
                </div>
              </div>

              {/* Granted Tabs */}
              <div>
                <span className="text-xs font-bold text-gray-800 block mb-2">Granted Dashboard Views</span>
                <div className="flex flex-wrap gap-2">
                  {DASHBOARD_TABS.filter((t) => selected.has(`dashboard.tab.${t.key}`)).map((t) => (
                    <span
                      key={t.key}
                      className="px-3 py-1 bg-olive-700 text-white rounded-xl text-xs font-semibold shadow-2xs"
                    >
                      {t.title.en}
                    </span>
                  ))}
                  {DASHBOARD_TABS.filter((t) => selected.has(`dashboard.tab.${t.key}`)).length === 0 && (
                    <span className="text-xs text-gray-400 italic">No dashboard tabs granted</span>
                  )}
                </div>
              </div>

              {/* Granted Widgets */}
              <div>
                <span className="text-xs font-bold text-gray-800 block mb-2">
                  Visible Widgets ({Array.from(selected).filter((k) => k.startsWith("dashboard.widget.")).length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-200">
                  {Array.from(selected)
                    .filter((k) => k.startsWith("dashboard.widget."))
                    .map((k) => {
                      const wKey = k.replace("dashboard.widget.", "");
                      const w = WIDGET_REGISTRY[wKey];
                      return (
                        <div key={k} className="p-2.5 bg-white rounded-xl border border-gray-200 text-xs shadow-2xs">
                          <div className="font-bold text-gray-800 truncate">{w?.title.en || wKey}</div>
                          <div className="text-[10px] text-gray-400 capitalize mt-0.5">{w?.category || "general"}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Delete Security Role?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete the role{" "}
              <span className="font-bold text-gray-900">"{deleteConfirmRole.name}"</span>? Any team members currently
              assigned this role will lose its permissions.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRole(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
