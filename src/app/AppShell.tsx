"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Wallet, Map, Receipt, BadgeDollarSign, PieChart, ShieldCheck, Bell, Languages, UserCog, KeyRound, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLang } from "@/lib/i18n";

const NAV = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard, perm: "dashboard.view" },
  { href: "/partners", key: "partners", icon: Users, perm: "partners.view" },
  { href: "/treasury", key: "treasury", icon: Wallet, perm: "treasury.view" },
  { href: "/projects", key: "projects", icon: Map, perm: "projects.view" },
  { href: "/expenses", key: "expenses", icon: Receipt, perm: ["expenses.view", "expenses.create"] },
  { href: "/sales", key: "sales", icon: BadgeDollarSign, perm: ["sales.view", "sales.collect"] },
  { href: "/reports", key: "pnl", icon: PieChart, perm: ["profit.view", "reports.view"] },
  { href: "/audit", key: "audit", icon: ShieldCheck, perm: "audit.view" },
] as const;

// Administration section: manage roles (permissions) and users (name + password + role)
const ADMIN_NAV = [
  { href: "/settings/users", key: "users", icon: UserCog, perm: "users.manage" },
  { href: "/settings/roles", key: "roles", icon: KeyRound, perm: "roles.manage" },
] as const;

const TITLES: Record<string, string> = {
  "/dashboard": "executive",
  "/partners": "partners",
  "/treasury": "treasury",
  "/projects": "projects",
  "/expenses": "expenses",
  "/sales": "sales",
  "/reports": "pnl",
  "/audit": "audit",
  "/settings/users": "users",
  "/settings/roles": "roles",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, toggle } = useLang();
  const isAuth = pathname === "/login" || pathname === "/signup" || pathname === "/change-password" || pathname?.startsWith("/invite");
  const [perms, setPerms] = useState<string[] | null>(null);
  const [me, setMe] = useState<{ fullName: string | null; email: string | null } | null>(null);

  // load my permissions once; hide menu items I may not open, force password change when required
  useEffect(() => {
    if (isAuth) return;
    let active = true;
    fetch("/api/me/permissions").then(r => (r.ok ? r.json() : null)).then(d => {
      if (!active || !d) return;
      setPerms(d.permissions ?? []);
      setMe({ fullName: d.fullName ?? null, email: d.email ?? null });
      if (d.mustChangePassword && pathname !== "/change-password") router.replace("/change-password");
    }).catch(() => {});
    return () => { active = false; };
  }, [isAuth, pathname, router]);

  if (isAuth) return <>{children}</>;

  const has = (perm: string | readonly string[]) => {
    const mine: string[] | null = perms;
    if (!mine) return true; // loading: show all, filter once known
    const want: string[] = Array.isArray(perm) ? [...perm] : [perm];
    return want.some(p => mine.includes(p));
  };
  const adminLinks = ADMIN_NAV.filter(l => perms !== null && has(l.perm));

  const key = TITLES[pathname] ?? TITLES[Object.keys(TITLES).find(k => pathname?.startsWith(k)) ?? ""] ?? "dashboard";
  const title = t(key);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-lg">L</div>
          <div><h1 className="text-sm font-bold text-white tracking-wide">LANDINVEST</h1><p className="text-[11px] text-slate-400">Partnership ERP Suite</p></div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.filter(({ perm }) => has(perm)).map(({ href, key, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link key={href} href={href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? "text-white bg-brand-700/80" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                <Icon className="w-4 h-4" /> {t(key)}
              </Link>
            );
          })}
          {adminLinks.length > 0 && (
            <>
              <p className="px-3 pt-4 pb-1 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">{t("administration")}</p>
              {adminLinks.map(({ href, key, icon: Icon }) => {
                const active = pathname === href || pathname?.startsWith(href + "/");
                return (
                  <Link key={href} href={href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? "text-white bg-brand-700/80" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                    <Icon className="w-4 h-4" /> {t(key)}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white">{(me?.fullName ?? me?.email ?? "?").trim().charAt(0).toUpperCase()}</div>
          <div className="flex-1 min-w-0"><p className="text-xs font-medium text-white truncate">{me?.fullName ?? me?.email ?? "…"}</p><p className="text-[10px] text-slate-400 truncate">{me?.email ?? ""}</p></div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} title={t("logout")} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3"><h2 className="text-lg font-bold text-slate-800">{title}</h2><span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">{t("fy")}</span></div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50"><Languages className="w-3.5 h-3.5" />{lang === "en" ? "বাংলা" : "English"}</button>
            <Link href="/sales" className="flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg">{t("newEntry")}</Link><span className="p-2 text-slate-400"><Bell className="w-4 h-4" /></span></div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
