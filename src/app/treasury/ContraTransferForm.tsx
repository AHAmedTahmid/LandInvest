"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Wallet,
  Building2,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import { formatBDT } from "@/lib/format";

export type BankOption = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType?: string;
  currentBalance: number;
};

export default function ContraTransferForm({
  banks,
  cashBalance,
  canApprove,
  submitAction,
}: {
  banks: BankOption[];
  cashBalance: number;
  canApprove: boolean;
  submitAction: (formData: FormData) => Promise<void>;
}) {
  // Mode: "CASH_TO_BANK" (Deposit) or "BANK_TO_CASH" (Withdrawal)
  const [mode, setMode] = useState<"CASH_TO_BANK" | "BANK_TO_CASH">("CASH_TO_BANK");
  const [selectedBankId, setSelectedBankId] = useState<string>(banks[0]?.id || "");
  const [amount, setAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const selectedBank = banks.find((b) => b.id === selectedBankId);
  const bankBalance = selectedBank?.currentBalance || 0;
  const numAmount = parseFloat(amount) || 0;

  // Balance validations
  const isCashSource = mode === "CASH_TO_BANK";
  const sourceBalance = isCashSource ? cashBalance : bankBalance;
  const isOverdraft = numAmount > sourceBalance;

  // Projected balances
  const projectedSourceBal = sourceBalance - numAmount;
  const destCurrentBal = isCashSource ? bankBalance : cashBalance;
  const projectedDestBal = destCurrentBal + numAmount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBankId) {
      alert("Please select a Bank / MFS account.");
      return;
    }
    if (!(numAmount > 0)) {
      alert("Please enter a valid transfer amount.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("fromType", isCashSource ? "CASH" : "BANK");
      fd.append("toType", isCashSource ? "BANK" : "CASH");
      fd.append("bankAccountId", selectedBankId);
      fd.append("amount", amount);
      fd.append("purpose", purpose || (isCashSource ? "Cash deposit into bank account" : "Cash withdrawal from bank to vault"));
      await submitAction(fd);
      setAmount("");
      setPurpose("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Wallet className="w-4 h-4" />
            </span>
            Contra Transfer (Cash ⇄ Bank / MFS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select whether you are depositing physical cash into an account or withdrawing cash to the vault.
          </p>
        </div>
        {!canApprove ? (
          <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 font-medium self-start sm:self-auto">
            Requires Super Admin / Managing Partner Approval
          </span>
        ) : (
          <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 font-medium self-start sm:self-auto flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Direct Immediate Execution
          </span>
        )}
      </div>

      {/* Step 1: Transfer Direction Switcher */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          1. Choose Transfer Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option A: Cash -> Bank (Deposit) */}
          <button
            type="button"
            onClick={() => setMode("CASH_TO_BANK")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              mode === "CASH_TO_BANK"
                ? "border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/10"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                Deposit Cash into Bank / MFS
              </span>
              {mode === "CASH_TO_BANK" && (
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Deposit physical cash from vault into a bank account or mobile wallet.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs font-mono font-semibold text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-emerald-700">💵 Cash in Hand</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-blue-700">🏦 Bank / MFS</span>
            </div>
          </button>

          {/* Option B: Bank -> Cash (Withdrawal) */}
          <button
            type="button"
            onClick={() => setMode("BANK_TO_CASH")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              mode === "BANK_TO_CASH"
                ? "border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/10"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
                Withdraw Cash from Bank / MFS
              </span>
              {mode === "BANK_TO_CASH" && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Withdraw money from a bank account or MFS wallet into physical vault cash.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs font-mono font-semibold text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-blue-700">🏦 Bank / MFS</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-emerald-700">💵 Cash in Hand</span>
            </div>
          </button>
        </div>
      </div>

      {/* Step 2: Account Selection and Amount Details */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Source (Paying Out)
            </span>
            {isCashSource ? (
              <div>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" /> Physical Cash in Hand
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Available in vault: <span className="font-mono font-bold text-emerald-700">{formatBDT(cashBalance)}</span>
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Bank / MFS to Withdraw From *
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {banks.filter((b) => b.id).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} - {b.accountNumber} ({formatBDT(b.currentBalance)})
                    </option>
                  ))}
                </select>
                {selectedBank && (
                  <p className="text-xs text-slate-500 mt-1">
                    Available balance: <span className="font-mono font-bold text-blue-700">{formatBDT(bankBalance)}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Destination Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Destination (Receiving)
            </span>
            {isCashSource ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Bank / MFS to Deposit Into *
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {banks.filter((b) => b.id).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} - {b.accountNumber} ({formatBDT(b.currentBalance)})
                    </option>
                  ))}
                </select>
                {selectedBank && (
                  <p className="text-xs text-slate-500 mt-1">
                    Current balance: <span className="font-mono font-bold text-blue-700">{formatBDT(bankBalance)}</span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" /> Physical Cash in Hand
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Current vault cash: <span className="font-mono font-bold text-emerald-700">{formatBDT(cashBalance)}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Amount & Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transfer Amount (BDT) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className={`w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold bg-white focus:outline-none focus:ring-2 ${
                isOverdraft
                  ? "border-rose-400 text-rose-700 focus:ring-rose-500"
                  : "border-slate-300 text-slate-900 focus:ring-emerald-500"
              }`}
            />
            {isOverdraft && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Exceeds available source balance ({formatBDT(sourceBalance)})
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Purpose / Reference Note
            </label>
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={
                isCashSource
                  ? "e.g. Deposit sales cash collection to DBBL project account"
                  : "e.g. Cash withdrawal from bank for site construction labor payment"
              }
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Live Balance Impact Preview */}
        {numAmount > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <span className="font-semibold text-slate-600 block text-[11px] uppercase tracking-wider">
              Projected Balances After Transfer:
            </span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 font-mono">
              <div>
                <span className="text-slate-500">
                  {isCashSource ? "Vault Cash" : selectedBank?.bankName || "Bank"}:
                </span>{" "}
                <span className="font-bold text-slate-700">{formatBDT(sourceBalance)}</span>
                <span className="text-rose-600 font-semibold"> -{formatBDT(numAmount)}</span> →{" "}
                <span className={`font-bold ${projectedSourceBal < 0 ? "text-rose-600" : "text-slate-900"}`}>
                  {formatBDT(projectedSourceBal)}
                </span>
              </div>
              <div className="hidden sm:block text-slate-300">|</div>
              <div>
                <span className="text-slate-500">
                  {isCashSource ? selectedBank?.bankName || "Bank" : "Vault Cash"}:
                </span>{" "}
                <span className="font-bold text-slate-700">{formatBDT(destCurrentBal)}</span>
                <span className="text-emerald-600 font-semibold"> +{formatBDT(numAmount)}</span> →{" "}
                <span className="font-bold text-emerald-800">{formatBDT(projectedDestBal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting || isOverdraft || numAmount <= 0}
            className={`px-6 py-2.5 rounded-lg text-xs font-semibold text-white transition shadow-sm flex items-center gap-2 ${
              isCashSource ? "bg-emerald-700 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-500"
            } disabled:opacity-50`}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {canApprove
              ? isCashSource
                ? "Execute Deposit to Bank"
                : "Execute Withdrawal to Vault"
              : isCashSource
              ? "Submit Deposit for Approval"
              : "Submit Withdrawal for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}
