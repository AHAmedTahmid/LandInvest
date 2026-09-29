"use client";
import { useActionState } from "react";

export default function PartnersForm({ action }: { action: (prev: string | null, formData: FormData) => Promise<string | null> }) {
  const [msg, formAction, pending] = useActionState(action, null);
  return (
    <>
      {msg && <div className={`p-3 rounded text-sm ${msg.startsWith("✓") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>{msg}</div>}
      <form action={formAction} className="bg-white p-4 rounded-xl shadow border grid grid-cols-1 md:grid-cols-5 gap-3">
        <input name="id" placeholder="ID (blank for new)" className="border rounded px-3 py-2" />
        <input name="name" placeholder="Name" required className="border rounded px-3 py-2" />
        <input name="phone" placeholder="Phone" required className="border rounded px-3 py-2" />
        <input name="nidNumber" placeholder="NID" className="border rounded px-3 py-2" />
        <input name="opening_balance" placeholder="Opening Balance" type="number" step="0.01" className="border rounded px-3 py-2" />
        <button disabled={pending} className="bg-blue-600 text-white rounded px-4 py-2 md:col-span-5 disabled:opacity-50">{pending ? "Saving..." : "Add / Update"}</button>
      </form>
    </>
  );
}
