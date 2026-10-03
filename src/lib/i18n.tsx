"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "bn";
const Ctx = createContext<{ lang: Lang; t: (k: string) => string; toggle: () => void }>({ lang: "en", t: (k) => k, toggle: () => {} });

const DICT: Record<string, { en: string; bn: string }> = {
  dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  partners: { en: "Partners & Capital", bn: "পার্টনার ও মূলধন" },
  treasury: { en: "Cash & Bank Ledger", bn: "ক্যাশ ও ব্যাংক লেজার" },
  projects: { en: "Land & Acquisition", bn: "জমি ও অধিগ্রহণ" },
  expenses: { en: "Project Expenses", bn: "প্রকল্প ব্যয়" },
  sales: { en: "Plot Sales & Dues", bn: "প্লট বিক্রয় ও বকেয়া" },
  pnl: { en: "Profit & Loss (P&L)", bn: "লাভ-ক্ষতি" },
  audit: { en: "Audit Trail", bn: "অডিট ট্রেইল" },
  executive: { en: "Executive Overview", bn: "এক্সিকিউটিভ ওভারভিউ" },
  fy: { en: "FY 2026-2027", bn: "অর্থবছর ২০২৬-২০২৭" },
  newEntry: { en: "New Entry", bn: "নতুন এন্ট্রি" },
  english: { en: "English", bn: "ইংরেজি" },
  bangla: { en: "Bangla", bn: "বাংলা" },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => { const s = localStorage.getItem("lang") as Lang | null; if (s) setLang(s); }, []);
  const toggle = () => setLang((l) => { const n: Lang = l === "en" ? "bn" : "en"; localStorage.setItem("lang", n); return n; });
  const t = (k: string) => DICT[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, t, toggle }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
