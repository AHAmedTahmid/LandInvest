"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Lock, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(d => { if (active) setValid(!!d.valid); })
      .catch(() => { if (active) setValid(false); });
    return () => { active = false; };
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await res.json();
      if (!res.ok) setError(d.error || "Reset failed");
      else setDone(true);
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
          {done ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-brand-600 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Password updated</h2>
              <p className="text-sm text-slate-500">You can now sign in with your new password.</p>
              <Link href="/login" className="inline-block text-sm font-semibold text-brand-700 hover:underline">Back to sign in</Link>
            </div>
          ) : valid === null ? (
            <p className="text-sm text-slate-500 text-center">Checking reset link…</p>
          ) : !valid ? (
            <div className="text-center space-y-3">
              <XCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Link invalid or expired</h2>
              <p className="text-sm text-slate-500">Reset links expire after 1 hour. Request a new one.</p>
              <Link href="/forgot-password" className="inline-block text-sm font-semibold text-brand-700 hover:underline">Request new link</Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Set new password</h2>
                <p className="text-sm text-slate-500 mt-1">Choose a password with at least 6 characters.</p>
              </div>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" type="password" required minLength={6}
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600" />
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" type="password" required minLength={6}
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600" />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
                <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
