"use client";
import { useEffect, useState } from "react";
import { PERMISSIONS } from "@/lib/permissions";

type Role = { id: string; name: string; description: string | null; isSystem: boolean; permCount: number; userCount: number; permissions: string[] };

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

  const load = async () => {
    const r = await fetch("/api/roles");
    const d = await r.json();
    if (Array.isArray(d)) setRoles(d);
  };
  useEffect(() => {
    let active = true;
    fetch("/api/roles").then(r => r.json()).then(d => { if (active && Array.isArray(d)) setRoles(d); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const openCreate = () => { setEditing(null); setFormName(""); setFormDesc(""); setSelected(new Set()); setMsg(null); setFormOpen(true); };
  const openEdit = (role: Role) => { setEditing(role); setFormName(role.name); setFormDesc(role.description ?? ""); setSelected(new Set(role.permissions)); setMsg(null); setFormOpen(true); };
  const openDuplicate = (role: Role) => { setEditing(null); setFormName(role.name + " Copy"); setFormDesc(role.description ?? ""); setSelected(new Set(role.permissions)); setMsg(null); setFormOpen(true); };

  const toggle = (k: string) => {
    const s = new Set(selected); if (s.has(k)) s.delete(k); else s.add(k); setSelected(s);
  };
  const toggleModule = (keys: string[]) => {
    const all = keys.every(k => selected.has(k));
    const s = new Set(selected); for (const k of keys) { if (all) s.delete(k); else s.add(k); } setSelected(s);
  };

  const save = async () => {
    const payload = { name: formName, description: formDesc, permissionKeys: [...selected] };
    let res;
    if (editing) {
      res = await fetch(`/api/roles/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      res = await fetch("/api/roles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    const d = await res.json();
    if (!res.ok) setMsg(d.error || "Failed"); else { setMsg("Saved"); setFormOpen(false); load(); }
  };

  const del = async (role: Role) => {
    if (!confirm(`Delete ${role.name}?`)) return;
    const res = await fetch(`/api/roles/${role.id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) alert(d.error || "Failed"); else load();
  };

  const duplicate = async () => {
    if (!editing) {
      // create from duplicate state: need to find source? use selected and formName
      // for duplicate via button, we already have selected+formName, just create as new
      return save();
    }
  };

  const filtered = PERMISSIONS.map(g => ({
    ...g,
    permissions: g.permissions.filter(p => !search || p.key.toLowerCase().includes(search.toLowerCase()) || p.en.toLowerCase().includes(search.toLowerCase()) || p.bn.includes(search))
  })).filter(g => g.permissions.length > 0);

  const list = roles.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Create Role</button>
      </div>
      <input placeholder="Search roles" value={q} onChange={e => setQ(e.target.value)} className="border rounded px-3 py-2 w-full max-w-sm" />
      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="border-b text-left"><th className="p-2">Name</th><th>Description</th><th>Users</th><th>Perms</th><th>Actions</th></tr></thead>
        <tbody>{list.map(r => (
          <tr key={r.id} className="border-b">
            <td className="p-2 font-semibold">{r.name} {r.isSystem && <span className="text-xs bg-amber-100 px-1 rounded">system</span>}</td>
            <td className="p-2">{r.description ?? "-"}</td>
            <td className="p-2">{r.userCount}</td>
            <td className="p-2">{r.permCount}</td>
            <td className="p-2 flex gap-1">
              <button onClick={() => openEdit(r)} disabled={r.isSystem} className="text-blue-600 disabled:opacity-30">Edit</button>
              <button onClick={() => openDuplicate(r)} className="text-green-600">Duplicate</button>
              <button onClick={() => del(r)} disabled={r.isSystem} className="text-red-600 disabled:opacity-30">Delete</button>
            </td>
          </tr>
        ))}</tbody>
      </table>

      {formOpen && (
        <div className="bg-white p-4 rounded-xl shadow border space-y-3">
          <h2 className="font-semibold">{editing ? `Edit ${editing.name}` : "Create / Duplicate Role"}</h2>
          {msg && <div className="text-sm p-2 bg-slate-100 rounded">{msg}</div>}
          <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Role name" className="border rounded px-3 py-2 w-full" />
          <input value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Description" className="border rounded px-3 py-2 w-full" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search permissions" className="border rounded px-3 py-2 w-full" />
          <div className="space-y-3 max-h-[40vh] overflow-auto">
            {filtered.map(g => (
              <div key={g.module} className="border rounded p-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{g.moduleEn} <span className="text-xs text-gray-500">{g.moduleBn}</span></span>
                  <button onClick={() => toggleModule(g.permissions.map(p => p.key))} className="text-xs text-blue-600">Toggle all</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                  {g.permissions.map(p => (
                    <label key={p.key} className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={selected.has(p.key)} onChange={() => toggle(p.key)} />
                      <span>{p.en} <span className="text-gray-500">({p.key})</span></span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => { setEditing(null); setFormName(""); setSelected(new Set()); setMsg(null); setFormOpen(false); }} className="border px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
