"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold text-xl">L</div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-slate-800">LANDINVEST</h1>
            <p className="text-[11px] text-slate-500">Partnership ERP Suite</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 space-y-5">
          {sent ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-brand-600 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Check your inbox</h2>
              <p className="text-sm text-slate-500">If an account exists for <span className="font-semibold text-slate-700">{email}</span>, a password reset link is on its way. It expires in 1 hour.</p>
              <Link href="/login" className="inline-block text-sm font-semibold text-brand-700 hover:underline">Back to sign in</Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Forgot password</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your account email and we will send you a reset link.</p>
              </div>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" type="email" required
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600" />
                </div>
                <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
                </button>
              </form>
              <p className="text-center text-sm text-slate-500">
                Remembered it? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
