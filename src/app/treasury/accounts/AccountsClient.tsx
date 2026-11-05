"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Smartphone,
  PlusCircle,
  Search,
  Edit2,
  Lock,
  Plus,
  History,
  X,
  CheckCircle2,
  AlertCircle,
  Power,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { formatBDT, formatDate } from "@/lib/format";

export type AccountRow = {
  id: string;
  accountType: "BANK" | "MBANKING";
  bankName: string;
  accountName?: string | null;
  accountNumber: string;
  branchName?: string | null;
  routingNumber?: string | null;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
  transactions: Array<{
    id: string;
    flowType: "IN" | "OUT";
    amount: number;
    purpose: string;
    referenceType: string;
    txnDate: string;
  }>;
};

export default function AccountsClient({
  accounts,
  createAction,
  updateAction,
  toggleStatusAction,
}: {
  accounts: AccountRow[];
  createAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  updateAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  toggleStatusAction: (id: string, nextStatus: boolean) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "BANK" | "MBANKING" | "INACTIVE">("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountRow | null>(null);
  const [inspectAccount, setInspectAccount] = useState<AccountRow | null>(null);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Keyboard shortcut: Escape closes active modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddModal(false);
        setEditingAccount(null);
        setInspectAccount(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredAccounts = accounts.filter((a) => {
    if (typeFilter === "BANK" && (a.accountType !== "BANK" || !a.isActive)) return false;
    if (typeFilter === "MBANKING" && (a.accountType !== "MBANKING" || !a.isActive)) return false;
    if (typeFilter === "INACTIVE" && a.isActive) return false;

    const q = searchTerm.toLowerCase();
    return (
      a.bankName.toLowerCase().includes(q) ||
      a.accountNumber.toLowerCase().includes(q) ||
      (a.accountName && a.accountName.toLowerCase().includes(q)) ||
      (a.branchName && a.branchName.toLowerCase().includes(q))
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
      showToast("✓ Bank / MFS Account created successfully!");
      setShowAddModal(false);
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
      showToast("✓ Account details successfully updated!");
      setEditingAccount(null);
    }
  };

  const handleToggleStatus = async (account: AccountRow) => {
    const nextStatus = !account.isActive;
    const actionLabel = nextStatus ? "activate" : "deactivate";
    if (!confirm(`Are you sure you want to ${actionLabel} ${account.bankName} (${account.accountNumber})?`)) return;

    setTogglingId(account.id);
    const res = await toggleStatusAction(account.id, nextStatus);
    setTogglingId(null);

    if (res.error) {
      showToast(res.error, true);
    } else {
      showToast(`✓ Account is now ${nextStatus ? "Active" : "Inactive"}`);
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
          <h1 className="text-2xl font-bold text-slate-900">Bank & MFS Accounts</h1>
          <p className="text-sm text-slate-500">
            Open commercial banks and mobile financial services with fixed opening balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/treasury"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Wallet className="w-4 h-4" /> Contra Transfer
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> Open New Account
          </button>
        </div>
      </div>

      {/* Search & Quick Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search accounts by bank, account title, or account number..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-xs text-slate-400 hover:text-slate-600 px-2">
              Clear
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium w-full sm:w-auto justify-center">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`px-3 py-1 rounded-md transition ${
              typeFilter === "ALL" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({accounts.length})
          </button>
          <button
            onClick={() => setTypeFilter("BANK")}
            className={`px-3 py-1 rounded-md transition ${
              typeFilter === "BANK" ? "bg-white text-blue-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Banks ({accounts.filter((a) => a.accountType === "BANK" && a.isActive).length})
          </button>
          <button
            onClick={() => setTypeFilter("MBANKING")}
            className={`px-3 py-1 rounded-md transition ${
              typeFilter === "MBANKING" ? "bg-white text-purple-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            MFS ({accounts.filter((a) => a.accountType === "MBANKING" && a.isActive).length})
          </button>
          <button
            onClick={() => setTypeFilter("INACTIVE")}
            className={`px-3 py-1 rounded-md transition ${
              typeFilter === "INACTIVE" ? "bg-white text-rose-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Inactive ({accounts.filter((a) => !a.isActive).length})
          </button>
        </div>
      </div>

      {/* Accounts Directory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Bank / Provider</th>
                <th>Type</th>
                <th>Account Details</th>
                <th>Status</th>
                <th className="text-right">Opening Balance</th>
                <th className="text-right">Current Live Balance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No accounts found matching your filter.
                  </td>
                </tr>
              )}
              {filteredAccounts.map((a) => {
                const isMfs = a.accountType === "MBANKING";
                return (
                  <tr key={a.id} className={`hover:bg-slate-50/50 ${!a.isActive ? "bg-slate-50/40 text-slate-400" : ""}`}>
                    <td className="p-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isMfs ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {isMfs ? <Smartphone className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="block text-slate-900 leading-tight">{a.bankName}</span>
                          {a.accountName && <span className="text-[11px] text-slate-500 font-normal">{a.accountName}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isMfs
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {isMfs ? "Mobile Banking" : "Commercial Bank"}
                      </span>
                    </td>
                    <td className="text-xs">
                      <p className="font-mono font-semibold text-slate-800">{a.accountNumber}</p>
                      <p className="text-slate-400 text-[11px]">
                        {a.branchName ? `${a.branchName} Branch` : "Main"} {a.routingNumber ? `| RN: ${a.routingNumber}` : ""}
                      </p>
                    </td>
                    <td>
                      {a.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="text-right font-mono text-slate-600 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        {formatBDT(a.openingBalance)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span
                        className={`font-bold font-mono px-2.5 py-1 rounded-md border text-xs ${
                          a.isActive
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : "text-slate-600 bg-slate-100 border-slate-200"
                        }`}
                      >
                        {formatBDT(a.currentBalance)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Status Toggle Action Button */}
                        <button
                          onClick={() => handleToggleStatus(a)}
                          disabled={togglingId === a.id}
                          title={a.isActive ? "Deactivate Account" : "Activate Account"}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition border ${
                            a.isActive
                              ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {togglingId === a.id ? "..." : a.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => setEditingAccount(a)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>

                        <button
                          onClick={() => setInspectAccount(a)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition"
                        >
                          <History className="w-3 h-3" /> Ledger
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open Account Modal */}
      {showAddModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Open Bank / Mobile Banking Account
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type *</label>
                  <select
                    name="accountType"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="BANK">Commercial Bank</option>
                    <option value="MBANKING">Mobile Banking / MFS</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bank / MFS Provider Name *
                  </label>
                  <input
                    name="bankName"
                    placeholder="e.g. Dutch-Bangla Bank or bKash Merchant"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Title / Name</label>
                  <input
                    name="accountName"
                    placeholder="e.g. LandInvest Ops Account"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account / Wallet Number *</label>
                  <input
                    name="accountNumber"
                    placeholder="e.g. 110.120.4567 or 01711000000"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name</label>
                  <input
                    name="branchName"
                    placeholder="e.g. Mirpur-10 (Optional for MFS)"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Routing Number</label>
                  <input
                    name="routingNumber"
                    placeholder="e.g. 090271234 (Optional)"
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Opening Balance (BDT) *
                  </label>
                  <input
                    name="openingBalance"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue="0"
                    required
                    placeholder="0.00"
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Locked Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <strong>Important:</strong> Opening balance is registered once upon creation and cannot be edited later to safeguard treasury audit integrity.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  {submitting ? "Creating..." : "Open Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal (Opening Balance Strictly Locked) */}
      {editingAccount && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingAccount(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" /> Edit Account Details
              </h2>
              <button onClick={() => setEditingAccount(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <input type="hidden" name="id" value={editingAccount.id} />

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type</label>
                  <select
                    name="accountType"
                    defaultValue={editingAccount.accountType}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="BANK">Commercial Bank</option>
                    <option value="MBANKING">Mobile Banking / MFS</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bank / MFS Provider Name *</label>
                  <input
                    name="bankName"
                    defaultValue={editingAccount.bankName}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Title / Name</label>
                  <input
                    name="accountName"
                    defaultValue={editingAccount.accountName || ""}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account / Wallet Number *</label>
                  <input
                    name="accountNumber"
                    defaultValue={editingAccount.accountNumber}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name</label>
                  <input
                    name="branchName"
                    defaultValue={editingAccount.branchName || ""}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Routing Number</label>
                  <input
                    name="routingNumber"
                    defaultValue={editingAccount.routingNumber || ""}
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    name="isActive"
                    defaultValue={editingAccount.isActive ? "true" : "false"}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active (Can receive and send funds)</option>
                    <option value="false">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              {/* NON-EDITABLE OPENING BALANCE */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Opening Balance (Locked)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {formatBDT(editingAccount.openingBalance)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Opening balance cannot be modified to preserve ledger integrity. To adjust liquid reserves, use Contra Transfer.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Ledger Drawer / Modal */}
      {inspectAccount && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectAccount(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {inspectAccount.bankName} — Statement
                  <span className="text-[11px] font-mono text-slate-400">({inspectAccount.accountNumber})</span>
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Live Balance: <span className="font-bold text-emerald-700">{formatBDT(inspectAccount.currentBalance)}</span> | Opening: {formatBDT(inspectAccount.openingBalance)}
                </p>
              </div>
              <button onClick={() => setInspectAccount(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b text-xs uppercase sticky top-0">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th>Flow</th>
                    <th>Purpose / Details</th>
                    <th>Reference</th>
                    <th className="text-right p-2.5">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inspectAccount.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        No transactions recorded for this account.
                      </td>
                    </tr>
                  ) : (
                    inspectAccount.transactions.map((tx) => {
                      const isInflow = tx.flowType === "IN";
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-mono text-xs text-slate-500">{formatDate(tx.txnDate)}</td>
                          <td>
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                                isInflow ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {isInflow ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                              {isInflow ? "IN" : "OUT"}
                            </span>
                          </td>
                          <td className="text-xs text-slate-700 font-medium">{tx.purpose}</td>
                          <td className="text-xs text-slate-500 font-mono">{tx.referenceType}</td>
                          <td
                            className={`text-right font-mono font-bold text-xs p-2.5 ${
                              isInflow ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {isInflow ? "+" : "-"}
                            {formatBDT(tx.amount)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Link href="/treasury" className="text-xs font-semibold text-emerald-700 hover:underline">
                + Initiate Transfer With This Account
              </Link>
              <button
                onClick={() => setInspectAccount(null)}
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

