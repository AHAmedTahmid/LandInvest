"use client";
import { useEffect, useState } from "react";

type User = { id: string; email: string; fullName: string; roleId: string | null; roleName: string; isOwner: boolean; isActive: boolean; mustChangePassword: boolean; status: string; lastLoginAt: string | null };
type Role = { id: string; name: string };

export default function UsersClient({ canManage }: { canManage: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [invited, setInvited] = useState<any[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  // forms
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [mode, setMode] = useState<"invite" | "direct">("invite");
  const [tempPass, setTempPass] = useState("");
  const [editing, setEditing] = useState<{ id: string; fullName: string; email: string } | null>(null);

  const load = async () => {
    const r = await fetch("/api/users");
    const d = await r.json();
    if (d.users) setUsers(d.users);
    if (d.invited) setInvited(d.invited);
    if (d.roles) setRoles(d.roles);
  };
  useEffect(() => {
    let active = true;
    fetch("/api/users").then(r => r.json()).then(d => {
      if (!active) return;
      if (d.users) setUsers(d.users);
      if (d.invited) setInvited(d.invited);
      if (d.roles) setRoles(d.roles);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenRole = roleId || roles[0]?.id || "";
    const url = mode === "invite" ? "/api/invites" : "/api/users";
    const body = mode === "invite" ? { email, roleId: chosenRole } : { email, fullName, password: tempPass, roleId: chosenRole };
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json();
    if (!res.ok) setMsg(d.error || "Failed"); else { setMsg(mode === "invite" ? `Invite link: ${d.inviteLink || d.inviteToken}` : "User created"); setEmail(""); setFullName(""); setTempPass(""); load(); }
  };

  const changeRole = async (userId: string, newRoleId: string) => {
    const res = await fetch(`/api/users/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roleId: newRoleId }) });
    const d = await res.json();
    if (!res.ok) alert(d.error); else load();
  };
  const toggleActive = async (u: User) => {
    const res = await fetch(`/api/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !u.isActive }) });
    const d = await res.json();
    if (!res.ok) alert(d.error); else load();
  };
  const remove = async (u: User) => {
    if (!confirm(`Remove ${u.email}?`)) return;
    const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) alert(d.error); else load();
  };
  const reset = async (u: User) => {
    const np = prompt(`New temp password for ${u.email}`);
    if (!np) return;
    const res = await fetch(`/api/users/${u.id}/reset`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newPassword: np }) });
    const d = await res.json();
    if (!res.ok) alert(d.error); else alert("Reset ok");
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/users/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: editing.fullName, email: editing.email }) });
    const d = await res.json();
    if (!res.ok) alert(d.error); else { setEditing(null); load(); }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      {msg && <div className="p-2 bg-slate-100 rounded text-sm">{msg}</div>}
      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="border-b text-left"><th className="p-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th>Actions</th></tr></thead>
        <tbody>{users.map(u => (
          <tr key={u.id} className="border-b">
            <td className="p-2">{u.fullName} {u.isOwner && <span className="text-xs bg-amber-100 px-1 rounded">owner</span>}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">
              {canManage ? (
                <select value={u.roleId ?? ""} onChange={e => changeRole(u.id, e.target.value)} className="border rounded px-1 py-1 text-xs">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              ) : u.roleName}
            </td>
            <td className="p-2">{u.status}{u.mustChangePassword && " (must change)"}</td>
            <td className="p-2 text-xs">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "-"}</td>
            <td className="p-2 flex gap-1">
              {canManage && !u.isOwner && <button onClick={() => setEditing({ id: u.id, fullName: u.fullName, email: u.email })} className="text-xs border px-2 py-1 rounded">Edit</button>}
              {canManage && <button onClick={() => toggleActive(u)} className="text-xs border px-2 py-1 rounded">{u.isActive ? "Deactivate" : "Activate"}</button>}
              {canManage && <button onClick={() => reset(u)} className="text-xs border px-2 py-1 rounded">Reset PW</button>}
              {canManage && <button onClick={() => remove(u)} className="text-xs text-red-600">Remove</button>}
            </td>
          </tr>
        ))}</tbody>
      </table>

      {editing && (
        <form onSubmit={saveEdit} className="bg-white p-4 rounded-xl shadow border space-y-3">
          <h2 className="font-semibold">Edit user</h2>
          <input value={editing.fullName} onChange={e => setEditing({ ...editing, fullName: e.target.value })} placeholder="Full name" required className="border rounded px-3 py-2 w-full" />
          <input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="Email" type="email" required className="border rounded px-3 py-2 w-full" />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditing(null)} className="border px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      {invited.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-semibold">Pending Invites</h2>
          <table className="w-full text-xs"><thead><tr className="border-b"><th>Email</th><th>Role</th><th>Expires</th></tr></thead>
            <tbody>{invited.map((i: any) => <tr key={i.id}><td>{i.email}</td><td>{i.roleName}</td><td>{new Date(i.expiresAt).toLocaleDateString()}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {canManage && (
        <form onSubmit={invite} className="bg-white p-4 rounded-xl shadow border space-y-3">
          <h2 className="font-semibold">Create / Invite User</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode("invite")} className={`px-3 py-1 rounded ${mode === "invite" ? "bg-blue-600 text-white" : "border"}`}>Invite by email</button>
            <button type="button" onClick={() => setMode("direct")} className={`px-3 py-1 rounded ${mode === "direct" ? "bg-blue-600 text-white" : "border"}`}>Create directly</button>
          </div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required className="border rounded px-3 py-2 w-full" />
          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" className="border rounded px-3 py-2 w-full" />
          {mode === "direct" && <input value={tempPass} onChange={e => setTempPass(e.target.value)} placeholder="Temp password (min 6)" type="password" required className="border rounded px-3 py-2 w-full" />}
          <select value={roleId || roles[0]?.id || ""} onChange={e => setRoleId(e.target.value)} className="border rounded px-3 py-2 w-full">
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">{mode === "invite" ? "Send Invite" : "Create User"}</button>
        </form>
      )}
    </div>
  );
}
