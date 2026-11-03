"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, DollarSign, Wallet, ArrowDownLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { formatBDT } from "@/lib/format";

export type PartnerOption = {
  id: string;
  name: string;
  phone: string;
  liveBalance: number;
};

export type BankOption = {
  id: string;
  bankName: string;
  accountNumber: string;
  currentBalance: number;
};

export default function CapitalDepositForm({
  partners,
  banks,
  initialPartnerId,
  depositAction,
}: {
  partners: PartnerOption[];
  banks: BankOption[];
  initialPartnerId?: string;
  depositAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}) {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState<string>(
    initialPartnerId && partners.some((p) => p.id === initialPartnerId)
      ? initialPartnerId
      : partners[0]?.id || ""
  );
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paymentChannel, setPaymentChannel] = useState<string>("CASH");
  const [bankAccountId, setBankAccountId] = useState<string>(banks[0]?.id || "");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const selectedPartner = partners.find((p) => p.id === partnerId);
  const currentBalance = selectedPartner?.liveBalance || 0;
  const depositNum = parseFloat(amount) || 0;
  const projectedBalance = currentBalance + depositNum;

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!partnerId) {
      showToast("Please select a partner", true);
      return;
    }
    if (depositNum <= 0) {
      showToast("Deposit amount must be greater than zero", true);
      return;
    }
    if (paymentChannel === "BANK" && !bankAccountId) {
      showToast("Please select a bank account for bank deposit", true);
      return;
    }

    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await depositAction(fd);
    setSubmitting(false);

    if (res.error) {
      showToast(res.error, true);
    } else {
      showToast(`✓ Successfully deposited ${formatBDT(depositNum)} for ${selectedPartner?.name}!`);
      setAmount("");
      setReference("");
      setNotes("");
      router.refresh();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
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

      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
        <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
          <ArrowDownLeft className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">Record Partner Capital Contribution</h2>
          <p className="text-xs text-slate-500">
            Deposit new funds or investment capital from a partner into treasury cash/bank.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Partner Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Partner *
            </label>
            <select
              name="partnerId"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — Current Live Balance: {formatBDT(p.liveBalance)}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Investment Amount (BDT) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-xs">৳</span>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500000"
                required
                className="w-full border rounded-lg pl-7 pr-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deposit Date *</label>
            <input
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Channel */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deposit Channel *
            </label>
            <select
              name="paymentChannel"
              value={paymentChannel}
              onChange={(e) => setPaymentChannel(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="CASH">CASH (Liquid Hand Cash)</option>
              <option value="BANK">BANK (Deposit to Company Bank Account)</option>
            </select>
          </div>

          {/* Bank Account (Conditional) */}
          {paymentChannel === "BANK" && (
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receiving Bank Account *
              </label>
              <select
                name="bankAccountId"
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} — Acc: {b.accountNumber} (Current Bal: {formatBDT(b.currentBalance)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reference No */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reference / Cheque / Slip No (Optional)
            </label>
            <input
              name="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. CHQ-98124 or Deposit Slip #45"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Purpose / Description
            </label>
            <input
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Additional capital for Phase 2 Land Acquisition"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Live Balance Impact Preview Card */}
        {selectedPartner && (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Live Balance Update Preview
              </p>
              <p className="text-xs text-slate-600">
                Partner: <span className="font-semibold text-slate-900">{selectedPartner.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">Current Balance</span>
                <span className="font-semibold text-slate-800">{formatBDT(currentBalance)}</span>
              </div>
              <span className="text-emerald-700 font-bold text-sm">+</span>
              <div>
                <span className="text-slate-500 block text-[11px]">New Deposit</span>
                <span className="font-semibold text-emerald-700">{formatBDT(depositNum)}</span>
              </div>
              <span className="text-slate-400 font-bold text-sm">=</span>
              <div>
                <span className="text-slate-500 block text-[11px]">Projected Live Balance</span>
                <span className="font-bold text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-300">
                  {formatBDT(projectedBalance)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Recording Capital & Updating Balance...
              </>
            ) : (
              "Confirm & Deposit Capital"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
