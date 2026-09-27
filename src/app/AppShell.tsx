"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Wallet, Map, Receipt, BadgeDollarSign, PieChart, ShieldCheck, Bell } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/partners", label: "Partners & Capital", icon: Users },
  { href: "/treasury", label: "Cash & Bank Ledger", icon: Wallet },
  { href: "/projects", label: "Land & Acquisition", icon: Map },
  { href: "/expenses", label: "Project Expenses", icon: Receipt },
  { href: "/sales", label: "Plot Sales & Dues", icon: BadgeDollarSign },
  { href: "/reports", label: "Profit & Loss (P&L)", icon: PieChart },
  { href: "/audit", label: "Audit Trail", icon: ShieldCheck },
];

const TITLES: Record<string, string> = {
  "/dashboard": "Executive Overview",
  "/partners": "Partners' Capital & Equity",
  "/treasury": "Cash & Bank Treasury",
  "/projects": "Land Inventory & Acquisition",
  "/expenses": "Project Development Expenses",
  "/sales": "Plot Sales & Customer Installments",
  "/reports": "Profit & Loss (P&L) Reconciliation",
  "/audit": "Audit Trail",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/signup" || pathname?.startsWith("/invite");
  if (isAuth) return <>{children}</>;

  const title = TITLES[pathname] ?? TITLES[Object.keys(TITLES).find(k => pathname?.startsWith(k)) ?? ""] ?? "LandInvest";

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-lg">L</div>
          <div><h1 className="text-sm font-bold text-white tracking-wide">LANDINVEST</h1><p className="text-[11px] text-slate-400">Partnership ERP Suite</p></div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link key={href} href={href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? "text-white bg-brand-700/80" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white">SA</div>
          <div className="flex-1 min-w-0"><p className="text-xs font-medium text-white truncate">Super Admin</p><p className="text-[10px] text-slate-400 truncate">Dhaka HQ Office</p></div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3"><h2 className="text-lg font-bold text-slate-800">{title}</h2><span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">FY 2026-2027</span></div>
          <div className="flex items-center gap-3"><Link href="/sales" className="flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg">New Entry</Link><span className="p-2 text-slate-400"><Bell className="w-4 h-4" /></span></div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
