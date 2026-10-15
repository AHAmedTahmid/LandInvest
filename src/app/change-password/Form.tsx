"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangeForm({ must }: { must: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: current, newPassword: next }) });
    const d = await res.json();
    if (!res.ok) setMsg(d.error || "Failed");
    else { setMsg("Password changed"); setTimeout(() => router.push("/dashboard"), 800); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      {!must && <input type="password" placeholder="Current password" value={current} onChange={e => setCurrent(e.target.value)} className="border rounded px-3 py-2 w-full" required />}
      {must && <input type="password" placeholder="Current (if known)" value={current} onChange={e => setCurrent(e.target.value)} className="border rounded px-3 py-2 w-full" />}
      <input type="password" placeholder="New password (min 6)" value={next} onChange={e => setNext(e.target.value)} className="border rounded px-3 py-2 w-full" required />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Update</button>
      {msg && <div className="text-sm p-2 bg-slate-100 rounded">{msg}</div>}
    </form>
  );
}
