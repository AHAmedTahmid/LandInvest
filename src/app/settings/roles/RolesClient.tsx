"use client";
import { useEffect, useState } from "react";
import { PERMISSIONS } from "@/lib/permissions";
import { DASHBOARD_TABS, WIDGET_REGISTRY, type DashboardTabKey } from "@/lib/dashboard/widgets";
import { PRESETS } from "@/lib/dashboard/layout";
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

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<"dashboard" | "system">("dashboard");
  const [previewOpen, setPreviewOpen] = useState(false);

  const load = async () => {
    const r = await fetch("/api/roles");
    const d = await r.json();
    if (Array.isArray(d)) setRoles(d);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/roles")
      .then((r) => r.json())
      .then((d) => {
        if (active && Array.isArray(d)) setRoles(d);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormDesc("");
    // By default give dashboard.view and overview tab
    setSelected(new Set(["dashboard.view", "dashboard.tab.overview"]));
    setMsg(null);
    setFormOpen(true);
    setActiveEditorTab("dashboard");
  };

  const openEdit = (role: Role) => {
    setEditing(role);
    setFormName(role.name);
    setFormDesc(role.description ?? "");
    setSelected(new Set(role.permissions));
    setMsg(null);
    setFormOpen(true);
    setActiveEditorTab("dashboard");
  };

  const openDuplicate = (role: Role) => {
    setEditing(null);
    setFormName(role.name + " Copy");
    setFormDesc(role.description ?? "");
    setSelected(new Set(role.permissions));
    setMsg(null);
    setFormOpen(true);
  };

  const toggle = (k: string) => {
    const s = new Set(selected);
    if (s.has(k)) s.delete(k);
    else s.add(k);
    setSelected(s);
  };

  const toggleAllInKeys = (keys: string[]) => {
    const all = keys.every((k) => selected.has(k));
    const s = new Set(selected);
    for (const k of keys) {
      if (all) s.delete(k);
      else s.add(k);
    }
    setSelected(s);
  };

  // One-click dashboard presets
  const applyPreset = (presetName: string) => {
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
        "expenses_month", "pending_approvals", "pending_vouchers", "quick_actions"
      ].forEach((w) => s.add(`dashboard.widget.${w}`));
    } else if (presetName === "Operations/Site") {
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.projects");
      s.add("dashboard.tab.operations");
      [
        "capital_deployed", "unsold_inventory", "expenses_month", "plot_inventory_status",
        "project_cost_vs_sales", "project_summary", "pending_approvals", "expense_breakdown", "quick_actions"
      ].forEach((w) => s.add(`dashboard.widget.${w}`));
    } else if (presetName === "Sales & Collections") {
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.sales");
      [
        "sales_month", "collections_month", "total_receivables", "overdue_receivables",
        "receivables_aging", "collection_trend", "overdue_installments", "quick_actions"
      ].forEach((w) => s.add(`dashboard.widget.${w}`));
    } else if (presetName === "Partner View") {
      s.add("dashboard.tab.overview");
      s.add("dashboard.tab.partners");
      ["partner_equity", "partner_equity_dist", "partner_summary", "quick_actions"].forEach((w) => s.add(`dashboard.widget.${w}`));
    }

    setSelected(s);
  };

  const save = async () => {
    const payload = { name: formName, description: formDesc, permissionKeys: [...selected] };
    let res;
    if (editing) {
      res = await fetch(`/api/roles/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    const d = await res.json();
    if (!res.ok) setMsg(d.error || "Failed");
    else {
      setMsg("Saved successfully");
      setFormOpen(false);
      load();
    }
  };

  const del = async (role: Role) => {
    if (!confirm(`Delete ${role.name}?`)) return;
    const res = await fetch(`/api/roles/${role.id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) alert(d.error || "Failed");
    else load();
  };

  // Group widgets by category
  const widgetsList = Object.values(WIDGET_REGISTRY);
  const categories = Array.from(new Set(widgetsList.map((w) => w.category)));

  // Filtered system modules
  const filteredModules = PERMISSIONS.filter((g) => g.module !== "dashboard").map((g) => ({
    ...g,
    permissions: g.permissions.filter(
      (p) =>
        !search ||
        p.key.toLowerCase().includes(search.toLowerCase()) ||
        p.en.toLowerCase().includes(search.toLowerCase()) ||
        p.bn.includes(search)
    ),
  })).filter((g) => g.permissions.length > 0);

  const list = roles.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Role Management & RBAC</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure system permissions, dashboard view access, and widget visibility per role
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-olive-700 hover:bg-olive-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs"
        >
          Create Role
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        <input
          placeholder="Search roles..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border border-gray-200 bg-white rounded-xl pl-9 pr-3 py-2 text-xs w-full shadow-2xs focus:outline-hidden focus:border-olive-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-left bg-gray-50/80 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="p-3.5">Role Name</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5 text-center">Users</th>
              <th className="p-3.5 text-center">Permissions</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2">
                  <span>{r.name}</span>
                  {r.isSystem && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full">
                      System Role
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-gray-500 max-w-xs truncate">{r.description ?? "-"}</td>
                <td className="p-3.5 text-center font-mono font-medium">{r.userCount}</td>
                <td className="p-3.5 text-center font-mono font-semibold text-olive-700">{r.permCount}</td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => openEdit(r)}
                    disabled={r.isSystem}
                    className="text-xs font-semibold text-olive-700 hover:text-olive-900 disabled:opacity-30 transition-colors"
                  >
                    Edit Access
                  </button>
                  <button
                    onClick={() => openDuplicate(r)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => del(r)}
                    disabled={r.isSystem}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-30 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Editor Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="font-bold text-gray-900 text-base">
                  {editing ? `Edit Permissions: ${editing.name}` : "Create Role & Permissions"}
                </h2>
                <p className="text-xs text-gray-500">
                  Configure dashboard widgets and operational module permissions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 shadow-2xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-olive-700" />
                  <span>Preview as this Role</span>
                </button>
                <button
                  onClick={() => setFormOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {msg && <div className="mx-4 mt-3 text-xs p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">{msg}</div>}

            {/* Role Metadata Input */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Senior Land Surveyor"
                  className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs w-full shadow-2xs focus:outline-hidden focus:border-olive-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <input
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Role responsibilities and department"
                  className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs w-full shadow-2xs focus:outline-hidden focus:border-olive-600"
                />
              </div>
            </div>

            {/* Tab switch between Dashboard Access and System Modules */}
            <div className="flex items-center gap-2 px-4 pt-3 border-b border-gray-200 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setActiveEditorTab("dashboard")}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeEditorTab === "dashboard"
                    ? "border-olive-700 text-olive-800"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Dashboard Access ({Array.from(selected).filter((k) => k.startsWith("dashboard.")).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab("system")}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeEditorTab === "system"
                    ? "border-olive-700 text-olive-800"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>System Modules ({Array.from(selected).filter((k) => !k.startsWith("dashboard.")).length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeEditorTab === "dashboard" ? (
                <div className="space-y-4">
                  {/* Presets Toolbar */}
                  <div className="bg-olive-50/70 border border-olive-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-olive-900">
                      <Sparkles className="w-4 h-4 text-olive-700" />
                      <span>One-Click Dashboard Presets:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Executive", "Treasury/Accountant", "Operations/Site", "Sales & Collections", "Partner View"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => applyPreset(p)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-olive-100/60 border border-olive-300 text-olive-800 rounded-lg shadow-2xs transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Core Dashboard Permissions */}
                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                    <span className="font-bold text-xs text-gray-800 block mb-2">Dashboard Management Capabilities</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {[
                        { key: "dashboard.view", label: "Open Dashboard" },
                        { key: "dashboard.customize", label: "Customize Layout" },
                        { key: "dashboard.layout.manage", label: "Manage Role Layouts" },
                        { key: "dashboard.export", label: "Export PDF/PNG" },
                      ].map((cp) => (
                        <label key={cp.key} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected.has(cp.key)}
                            onChange={() => toggle(cp.key)}
                            className="rounded text-olive-700 focus:ring-olive-500"
                          />
                          <span className="font-medium truncate">{cp.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard Tab Access */}
                  <div className="border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-gray-800">Granted Dashboard Views (Tabs)</span>
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
                        return (
                          <label key={tabKey} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white hover:border-olive-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected.has(tabKey)}
                              onChange={() => toggle(tabKey)}
                              className="rounded text-olive-700 focus:ring-olive-500"
                            />
                            <span className="font-semibold truncate">{tab.title.en}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Widgets Grouped by Category */}
                  <div className="space-y-3">
                    <span className="font-bold text-xs text-gray-800 block">Available Dashboard Widgets</span>
                    {categories.map((cat) => {
                      const catWidgets = widgetsList.filter((w) => w.category === cat);
                      const allCatKeys = catWidgets.map((w) => `dashboard.widget.${w.key}`);
                      return (
                        <div key={cat} className="border border-gray-200 rounded-xl p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
                              Category: {cat} ({catWidgets.length})
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
                                !w.requiresModules ||
                                w.requiresModules.some((m) => selected.has(m));
                              return (
                                <div
                                  key={w.key}
                                  className={`p-2.5 rounded-lg border flex flex-col justify-between transition-colors ${
                                    isChecked
                                      ? "bg-olive-50/30 border-olive-400/70"
                                      : "bg-gray-50/50 border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggle(wKey)}
                                      className="mt-0.5 rounded text-olive-700 focus:ring-olive-500"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="font-bold text-gray-900 truncate">{w.title.en}</div>
                                      <div className="text-[11px] text-gray-500 truncate mt-0.5">{w.description.en}</div>
                                    </div>
                                  </div>

                                  {/* Warning if widget granted without required drilldown permission */}
                                  {isChecked && !hasModulePerm && (
                                    <div className="mt-2 pt-1.5 border-t border-amber-200/60 flex items-center gap-1.5 text-[10px] text-amber-800">
                                      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                      <span className="truncate">
                                        Drill-down link disabled (requires {w.requiresModules?.join(", ")})
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
              ) : (
                /* System Modules */
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search operational permissions..."
                      className="border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs w-full shadow-2xs focus:outline-hidden"
                    />
                  </div>
                  {filteredModules.map((g) => (
                    <div key={g.module} className="border border-gray-200 rounded-xl p-3 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-gray-900">
                          {g.moduleEn} <span className="text-gray-400 font-normal">({g.moduleBn})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleAllInKeys(g.permissions.map((p) => p.key))}
                          className="text-[11px] font-semibold text-olive-700 hover:text-olive-900"
                        >
                          Toggle module
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {g.permissions.map((p) => (
                          <label key={p.key} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer text-gray-700">
                            <input
                              type="checkbox"
                              checked={selected.has(p.key)}
                              onChange={() => toggle(p.key)}
                              className="rounded text-olive-700 focus:ring-olive-500"
                            />
                            <span className="truncate">
                              {p.en} <span className="text-gray-400 font-mono text-[10px]">({p.key})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Total Permissions Selected: <span className="font-bold text-olive-800">{selected.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="px-5 py-2 bg-olive-700 hover:bg-olive-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  Save Role Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-3xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Dashboard Preview: {formName || "Custom Role"}</h3>
                <p className="text-xs text-gray-500">Read-only simulation of widgets and tabs visible for this role</p>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-700">Visible Tabs:</div>
              <div className="flex flex-wrap gap-2">
                {DASHBOARD_TABS.filter((t) => selected.has(`dashboard.tab.${t.key}`)).map((t) => (
                  <span key={t.key} className="px-3 py-1 bg-olive-700 text-white rounded-lg text-xs font-semibold">
                    {t.title.en}
                  </span>
                ))}
              </div>

              <div className="text-xs font-bold text-gray-700 pt-2">Visible Widgets ({Array.from(selected).filter((k) => k.startsWith("dashboard.widget.")).length}):</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                {Array.from(selected)
                  .filter((k) => k.startsWith("dashboard.widget."))
                  .map((k) => {
                    const wKey = k.replace("dashboard.widget.", "");
                    const w = WIDGET_REGISTRY[wKey];
                    return (
                      <div key={k} className="p-2 bg-white rounded-lg border border-gray-200 text-xs shadow-2xs">
                        <div className="font-bold text-gray-800 truncate">{w?.title.en || wKey}</div>
                        <div className="text-[10px] text-gray-400 capitalize">{w?.type || "widget"}</div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
