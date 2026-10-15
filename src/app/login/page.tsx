"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Users, Wallet, BadgeDollarSign } from "lucide-react";

const BARS = [38, 62, 45, 78, 55, 90, 68, 84, 52, 96, 70, 60];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Invalid email or password");
      else router.push("/");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Brand panel */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden bg-brand-900 text-white flex-col justify-between p-12">
        <div className="absolute inset-0" style={{ background: "radial-gradient(900px 480px at 15% 10%, rgba(255,255,255,0.14), transparent 60%), radial-gradient(700px 420px at 90% 90%, rgba(255,255,255,0.10), transparent 60%), linear-gradient(160deg, #2c3605 0%, #4b5c09 70%, #5a6509 100%)" }} />
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse at 30% 30%, black 30%, transparent 75%)" }} />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center text-brand-700 font-bold text-xl">L</div>
          <div>
            <h1 className="text-sm font-bold tracking-widest">LANDINVEST</h1>
            <p className="text-[11px] text-white/70">Partnership ERP Suite</p>
          </div>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold leading-tight">Land partnerships,<br />managed end to end.</h2>
            <p className="text-white/70 max-w-md">Partner capital, cash &amp; bank treasury, plots, sales dues and profit distribution — one workspace for your syndicate.</p>
          </div>

          {/* mock dashboard card */}
          <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur p-5 max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-white/80">COLLECTION OVERVIEW</p>
              <span className="text-[11px] bg-white/15 rounded-full px-2.5 py-0.5">FY 2026-27</span>
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {BARS.map((h, i) => (
                <div key={i} className={`flex-1 rounded-t ${i === 9 ? "bg-amber-300" : "bg-white/70"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[["Capital", "৳4.2Cr"], ["Plots sold", "38"], ["Collected", "৳2.9Cr"]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-black/20 py-2.5">
                  <p className="text-sm font-bold">{v}</p>
                  <p className="text-[10px] text-white/60">{k}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-5 text-[13px] text-white/80">
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Partner ledger</span>
            <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Treasury</span>
            <span className="flex items-center gap-2"><BadgeDollarSign className="w-4 h-4" /> Sales &amp; dues</span>
          </div>
        </div>

        <p className="relative text-[11px] text-white/50">Multi-tenant SaaS for real-estate syndicates · Dhaka, Bangladesh</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold text-xl">L</div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-slate-800">LANDINVEST</h1>
              <p className="text-[11px] text-slate-500">Partnership ERP Suite</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your workspace to continue.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Email address</label>
                <div className="mt-1.5 relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" type="email" required
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-brand-700 hover:underline">Forgot password?</Link>
                </div>
                <div className="mt-1.5 relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type={showPw ? "text" : "password"} required
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-11 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600" />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}

              <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              New organization? <Link href="/signup" className="font-semibold text-brand-700 hover:underline">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
