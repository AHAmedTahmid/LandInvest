"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Edit2,
  Lock,
  Plus,
  History,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Power,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";

export type PartnerRow = {
  id: string;
  name: string;
  phone: string;
  nidNumber?: string | null;
  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankBranch?: string | null;
  bankRoutingNumber?: string | null;
  isActive: boolean;
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
  toggleStatusAction,
}: {
  partners: PartnerRow[];
  createAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  updateAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  toggleStatusAction?: (id: string, nextStatus: boolean) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddBankDetails, setShowAddBankDetails] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerRow | null>(null);
  const [inspectPartner, setInspectPartner] = useState<PartnerRow | null>(null);
  const [viewingBankDetails, setViewingBankDetails] = useState<PartnerRow | null>(null);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredPartners = partners.filter((p) => {
    if (statusFilter === "ACTIVE" && !p.isActive) return false;
    if (statusFilter === "INACTIVE" && p.isActive) return false;

    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      (p.nidNumber && p.nidNumber.toLowerCase().includes(q)) ||
      (p.bankName && p.bankName.toLowerCase().includes(q)) ||
      (p.bankAccountNumber && p.bankAccountNumber.toLowerCase().includes(q))
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
      setShowAddBankDetails(false);
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

  const handleToggleStatus = async (partner: PartnerRow) => {
    if (!toggleStatusAction) return;
    const nextStatus = !partner.isActive;
    const actionLabel = nextStatus ? "activate" : "deactivate";
    if (!confirm(`Are you sure you want to ${actionLabel} ${partner.name}?`)) return;

    setTogglingId(partner.id);
    const res = await toggleStatusAction(partner.id, nextStatus);
    setTogglingId(null);

    if (res.error) {
      showToast(res.error, true);
    } else {
      showToast(`✓ ${partner.name} is now ${nextStatus ? "Active" : "Inactive"}`);
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
            Manage partner profiles, contact info, bank details, and active status.
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
            <button
              onClick={() => {
                setShowAddForm(false);
                setShowAddBankDetails(false);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
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

            {/* Non-mandatory Bank Details Section */}
            <div className="border border-slate-200 rounded-lg bg-white p-3 space-y-3">
              <button
                type="button"
                onClick={() => setShowAddBankDetails(!showAddBankDetails)}
                className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-700 hover:text-blue-600"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  Partner Bank Account Details
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    Non-mandatory / Optional
                  </span>
                </span>
                {showAddBankDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAddBankDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Bank Name</label>
                    <input
                      name="bankName"
                      placeholder="e.g. Dutch-Bangla Bank"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Account Title / Name</label>
                    <input
                      name="bankAccountName"
                      placeholder="e.g. Akter Hossain"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Account Number</label>
                    <input
                      name="bankAccountNumber"
                      placeholder="e.g. 110.120.34567"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Branch Name</label>
                    <input
                      name="bankBranch"
                      placeholder="e.g. Mirpur-10 Branch"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Routing Number</label>
                    <input
                      name="bankRoutingNumber"
                      placeholder="e.g. 090271234"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              )}
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partners by name, phone, NID, or bank account..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-xs text-slate-400 hover:text-slate-600 px-2">
              Clear
            </button>
          )}
        </div>

        {/* Quick status tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium w-full sm:w-auto justify-center">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1 rounded-md transition ${
              statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({partners.length})
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-3 py-1 rounded-md transition ${
              statusFilter === "ACTIVE" ? "bg-white text-emerald-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active ({partners.filter((p) => p.isActive).length})
          </button>
          <button
            onClick={() => setStatusFilter("INACTIVE")}
            className={`px-3 py-1 rounded-md transition ${
              statusFilter === "INACTIVE" ? "bg-white text-rose-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Inactive ({partners.filter((p) => !p.isActive).length})
          </button>
        </div>
      </div>

      {/* Partners List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Partner Name</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Bank Details</th>
                <th className="text-right">Opening Balance</th>
                <th className="text-right">Live Balance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No partners found matching your search.
                  </td>
                </tr>
              )}
              {filteredPartners.map((p) => (
                <tr key={p.id} className={`hover:bg-slate-50/50 ${!p.isActive ? "bg-slate-50/40 text-slate-400" : ""}`}>
                  <td className="p-3">
                    <span className={`font-semibold block ${p.isActive ? "text-slate-900" : "text-slate-500"}`}>
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {p.nidNumber ? `NID: ${p.nidNumber}` : `ID: ${p.id.slice(0, 8)}...`}
                    </span>
                  </td>
                  <td className="text-slate-700 text-xs font-mono">{p.phone}</td>
                  <td>
                    {p.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td>
                    {p.bankAccountNumber ? (
                      <button
                        onClick={() => setViewingBankDetails(p)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition"
                      >
                        <Building2 className="w-3 h-3 text-blue-600" />
                        <span>{p.bankName || "Bank"}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          (..{p.bankAccountNumber.slice(-4)})
                        </span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="text-right font-mono text-slate-600 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      {formatBDT(p.openingBalance)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className={`font-bold font-mono px-2.5 py-1 rounded-md border text-xs ${
                        p.isActive
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-slate-600 bg-slate-100 border-slate-200"
                      }`}
                    >
                      {formatBDT(p.liveBalance)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Active / Inactive Action Button */}
                      <button
                        onClick={() => handleToggleStatus(p)}
                        disabled={togglingId === p.id}
                        title={p.isActive ? "Deactivate Partner" : "Activate Partner"}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded transition border ${
                          p.isActive
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {togglingId === p.id ? "..." : p.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => setEditingPartner(p)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <Link
                        href={`/partners/capital?partnerId=${p.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 transition"
                      >
                        <Plus className="w-3 h-3" /> Deposit
                      </Link>
                      <button
                        onClick={() => setInspectPartner(p)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition"
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

      {/* Edit Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-scale-up max-h-[90vh] overflow-y-auto">
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

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
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
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Status</label>
                <select
                  name="isActive"
                  defaultValue={editingPartner.isActive ? "true" : "false"}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active (Can invest and receive payouts)</option>
                  <option value="false">Inactive (Suspended / Inactive)</option>
                </select>
              </div>

              {/* Bank Details in Edit Modal */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Bank Details (Non-mandatory)
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Bank Name</label>
                    <input
                      name="bankName"
                      defaultValue={editingPartner.bankName || ""}
                      placeholder="e.g. Dutch-Bangla Bank"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Account Title</label>
                    <input
                      name="bankAccountName"
                      defaultValue={editingPartner.bankAccountName || ""}
                      placeholder="e.g. Akter Hossain"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Account Number</label>
                    <input
                      name="bankAccountNumber"
                      defaultValue={editingPartner.bankAccountNumber || ""}
                      placeholder="e.g. 110.120.34567"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Branch Name</label>
                    <input
                      name="bankBranch"
                      defaultValue={editingPartner.bankBranch || ""}
                      placeholder="e.g. Mirpur-10"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Routing Number</label>
                    <input
                      name="bankRoutingNumber"
                      defaultValue={editingPartner.bankRoutingNumber || ""}
                      placeholder="e.g. 090271234"
                      className="w-full border rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
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

      {/* View Bank Details Modal */}
      {viewingBankDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Bank Account Details
              </h2>
              <button onClick={() => setViewingBankDetails(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                <p className="text-xs text-slate-500">Partner</p>
                <p className="text-sm font-bold text-slate-900">{viewingBankDetails.name}</p>
                <p className="text-xs text-slate-500 font-mono">{viewingBankDetails.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Bank Name</span>
                  <span className="font-semibold text-slate-800">{viewingBankDetails.bankName || "—"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Account Title</span>
                  <span className="font-semibold text-slate-800">{viewingBankDetails.bankAccountName || "—"}</span>
                </div>
                <div className="col-span-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Account Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {viewingBankDetails.bankAccountNumber || "—"}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Branch</span>
                  <span className="font-semibold text-slate-800">{viewingBankDetails.bankBranch || "—"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Routing Number</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {viewingBankDetails.bankRoutingNumber || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => {
                  const p = viewingBankDetails;
                  setViewingBankDetails(null);
                  setEditingPartner(p);
                }}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Edit Bank Details
              </button>
              <button
                onClick={() => setViewingBankDetails(null)}
                className="px-4 py-1.5 border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Partner Ledger Drawer / Modal */}
      {inspectPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {inspectPartner.name} — Capital Ledger
                  {inspectPartner.isActive ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Inactive
                    </span>
                  )}
                </h2>
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
