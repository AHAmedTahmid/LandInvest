"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Search, Edit2, Lock, Plus, History, X, CheckCircle2, AlertCircle } from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";

export type PartnerRow = {
  id: string;
  name: string;
  phone: string;
  nidNumber?: string | null;
  openingBalance: number;
  liveBalance: number;
  transactions: Array<{
    id: string;
    txnType: string;
    amount: number;
    txnDate: string;
    notes?: string | null;
  }>;
};

export default function PartnersClient({
  partners,
  createAction,
  updateAction,
}: {
  partners: PartnerRow[];
  createAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  updateAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerRow | null>(null);
  const [inspectPartner, setInspectPartner] = useState<PartnerRow | null>(null);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredPartners = partners.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      (p.nidNumber && p.nidNumber.toLowerCase().includes(q))
    );
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await createAction(fd);
    setSubmitting(false);
    if (res.error) {
      showToast(res.error, true);
    } else {
      showToast("✓ Partner successfully created!");
      setShowAddForm(false);
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateAction(fd);
    setSubmitting(false);
    if (res.error) {
      showToast(res.error, true);
    } else {
      showToast("✓ Partner details successfully updated!");
      setEditingPartner(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-in ${
            toast.error ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          {toast.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partners Directory</h1>
          <p className="text-sm text-slate-500">
            Manage partner profiles, contact information, opening capital, and view real-time live balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/partners/capital"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Deposit Capital
          </Link>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> {showAddForm ? "Close Form" : "Add New Partner"}
          </button>
        </div>
      </div>

      {/* Add Partner Form */}
      {showAddForm && (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-200 bg-blue-50/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Register New Partner</h2>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Full Name *</label>
                <input
                  name="name"
                  placeholder="e.g. Akter Hossain"
                  required
                  className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  name="phone"
                  placeholder="e.g. 01711000001"
                  required
                  className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">National ID (NID)</label>
                <input
                  name="nidNumber"
                  placeholder="e.g. 1985123456789"
                  className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Equity Balance (BDT)</label>
                <input
                  name="opening_balance"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                  placeholder="0.00"
                  className="w-full border rounded px-3 py-2 text-sm bg-white font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <p className="text-xs text-amber-700 flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5" /> Note: Opening balance is set once at registration and cannot be edited later.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded px-5 py-2 text-xs transition shadow-sm"
              >
                {submitting ? "Saving..." : "Create Partner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search partners by name, phone number, or NID..."
          className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="text-xs text-slate-400 hover:text-slate-600 px-2">
            Clear
          </button>
        )}
      </div>

      {/* Partners List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Partner Name</th>
                <th>Phone Number</th>
                <th>NID Number</th>
                <th className="text-right">Opening Balance</th>
                <th className="text-right">Live Current Balance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No partners found matching your search.
                  </td>
                </tr>
              )}
              {filteredPartners.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <span className="font-semibold text-slate-900 block">{p.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {p.id.slice(0, 8)}...</span>
                  </td>
                  <td className="text-slate-700 text-xs font-mono">{p.phone}</td>
                  <td className="text-slate-600 text-xs font-mono">{p.nidNumber || "-"}</td>
                  <td className="text-right font-mono text-slate-600 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      {formatBDT(p.openingBalance)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-xs">
                      {formatBDT(p.liveBalance)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setEditingPartner(p)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <Link
                        href={`/partners/capital?partnerId=${p.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 transition"
                      >
                        <Plus className="w-3 h-3" /> Deposit
                      </Link>
                      <button
                        onClick={() => setInspectPartner(p)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition"
                      >
                        <History className="w-3 h-3" /> Ledger
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Partner Modal (Opening balance is non-editable) */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" /> Edit Partner Profile
              </h2>
              <button onClick={() => setEditingPartner(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <input type="hidden" name="id" value={editingPartner.id} />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Full Name *</label>
                <input
                  name="name"
                  defaultValue={editingPartner.name}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  name="phone"
                  defaultValue={editingPartner.phone}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">National ID (NID)</label>
                <input
                  name="nidNumber"
                  defaultValue={editingPartner.nidNumber || ""}
                  placeholder="e.g. 1985123456789"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* NON-EDITABLE OPENING BALANCE */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Opening Balance (Locked)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {formatBDT(editingPartner.openingBalance)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Opening balance cannot be modified to preserve ledger integrity. To add new investments, use the Add Capital module.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  {submitting ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Partner Ledger Drawer / Modal */}
      {inspectPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">{inspectPartner.name} — Capital Ledger</h2>
                <p className="text-xs text-slate-500 font-mono">
                  Live Balance: <span className="font-bold text-emerald-700">{formatBDT(inspectPartner.liveBalance)}</span> | Opening: {formatBDT(inspectPartner.openingBalance)}
                </p>
              </div>
              <button onClick={() => setInspectPartner(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b text-xs uppercase sticky top-0">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th>Type</th>
                    <th className="text-right">Amount</th>
                    <th>Notes / Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inspectPartner.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">
                        No transactions recorded beyond opening balance.
                      </td>
                    </tr>
                  ) : (
                    inspectPartner.transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-mono text-xs text-slate-500">{formatDate(tx.txnDate)}</td>
                        <td>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              tx.txnType === "DEPOSIT"
                                ? "bg-emerald-100 text-emerald-800"
                                : tx.txnType === "PROFIT_CREDIT"
                                ? "bg-blue-100 text-blue-800"
                                : tx.txnType === "DIRECT_EXPENSE"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {tx.txnType}
                          </span>
                        </td>
                        <td className="text-right font-mono font-semibold text-xs text-slate-900">
                          {formatBDT(tx.amount)}
                        </td>
                        <td className="text-xs text-slate-500">{tx.notes || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Link
                href={`/partners/capital?partnerId=${inspectPartner.id}`}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                + Record New Capital Investment
              </Link>
              <button
                onClick={() => setInspectPartner(null)}
                className="px-4 py-1.5 border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
