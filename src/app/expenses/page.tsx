"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, FileCheck } from "lucide-react";
import { formatBDT } from "@/lib/format";

type Expense = {
  id: string;
  expenseCategory: string;
  amount: string;
  paymentChannel: string;
  status: string;
  description: string;
  projectId?: string;
  projectName?: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [expRes, projRes, partRes, bankRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/projects"),
        fetch("/api/partners"),
        fetch("/api/banks"),
      ]);
      if (expRes.ok) setExpenses(await expRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (partRes.ok) setPartners(await partRes.json());
      if (bankRes.ok) setBanks(await bankRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    setApproving(id);
    try {
      const res = await fetch(`/api/expenses/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVED" }),
      });
      const d = await res.json();
      if (!res.ok) { alert(d.error || "Approval failed"); return; }
      setToast(`Expense approved — ${d.expense?.expenseCategory ?? ""}`);
      await load();
    } finally {
      setApproving(null);
    }
  };

  const reject = async (id: string) => {
    if (!confirm("Reject this expense?")) return;
    setApproving(id);
    try {
      const res = await fetch(`/api/expenses/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECTED" }),
      });
      const d = await res.json();
      if (!res.ok) { alert(d.error || "Rejection failed"); return; }
      setToast(`Expense rejected — ${d.expense?.expenseCategory ?? ""}`);
      await load();
    } finally {
      setApproving(null);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const pending = expenses.filter((e) => e.status === "PENDING");
  const breakdown: Record<string, number> = {};
  expenses.filter((e) => e.status === "APPROVED").forEach((e) => {
    const k = e.projectId || "General";
    breakdown[k] = (breakdown[k] || 0) + Number(e.amount);
  });

  if (loading) return <div className="p-6 text-slate-500">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-in">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Link
          href="/vouchers"
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-sm"
        >
          <FileCheck className="w-4 h-4" /> Go to Voucher Management
        </Link>
      </div>

      <ExpenseForm projects={projects} banks={banks} partners={partners} />

      <h2 className="font-semibold">Approval Queue (PENDING)</h2>
      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Project</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Channel</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-slate-400">No pending expenses</td></tr>}
          {pending.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="p-2 font-medium">
                {projects.find((p) => p.id === e.projectId)?.projectName || (e.projectId ? "Specific Project" : "General")}
              </td>
              <td>{e.expenseCategory}</td>
              <td className="font-semibold">{formatBDT(Number(e.amount))}</td>
              <td>{e.paymentChannel}</td>
              <td><span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800 font-medium">{e.status}</span></td>
              <td className="p-2 flex gap-2">
                <button onClick={() => approve(e.id)} disabled={approving === e.id}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                  {approving === e.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
                </button>
                <button onClick={() => reject(e.id)} disabled={approving === e.id}
                  className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-3 py-1 rounded text-xs">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-semibold">Project-wise Cost Breakdown</h2>
      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="border-b"><th className="p-2 text-left">Project</th><th className="text-right p-2">Total Cost</th></tr></thead>
        <tbody>
          {Object.entries(breakdown).map(([k, v]) => (
            <tr key={k} className="border-b">
              <td className="p-2 font-medium">{projects.find((p) => p.id === k)?.projectName || (k === "General" ? "General / Overhead" : k)}</td>
              <td className="text-right p-2 font-semibold">{formatBDT(Number(v))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExpenseForm({ projects, banks, partners }: { projects: any[]; banks: any[]; partners: any[] }) {
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/expenses", { method: "POST", body: fd });
      if (res.ok) { e.currentTarget.reset(); window.location.reload(); }
      else { const d = await res.json(); alert(d.error || "Failed"); }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-4 rounded-xl shadow border grid grid-cols-2 gap-3">
      <select name="project_id" className="border rounded px-3 py-2 bg-white">
        <option value="">No Project (General Overhead)</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.projectName} {p.mouza ? `(${p.mouza})` : ""}
          </option>
        ))}
      </select>
      <input name="category" placeholder="Category" required className="border rounded px-3 py-2" />
      <input name="amount" type="number" step="0.01" placeholder="Amount" required className="border rounded px-3 py-2" />
      <select name="payment_channel" className="border rounded px-3 py-2 bg-white">
        <option>CASH</option><option>BANK</option><option>PAID_BY_PARTNER</option>
      </select>
      <select name="bank_account" className="border rounded px-3 py-2 bg-white">
        <option value="">Bank Account (for Bank Payments)</option>
        {banks.map((b) => (
          <option key={b.id} value={b.id}>
            {b.bankName} - {b.accountNumber}
          </option>
        ))}
      </select>
      <select name="paid_by_partner" className="border rounded px-3 py-2 bg-white">
        <option value="">Paid By Partner (if applicable)</option>
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} {p.phone ? `(${p.phone})` : ""}
          </option>
        ))}
      </select>
      <input name="voucher" type="file" className="border rounded px-3 py-2" />
      <input name="description" placeholder="Description" className="border rounded px-3 py-2 col-span-2" />
      <button disabled={busy} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded px-4 py-2 col-span-2 flex items-center justify-center gap-2 font-medium">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />} Create Expense
      </button>
    </form>
  );
}
