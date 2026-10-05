"use client";
import { createContext, useContext, useState } from "react";

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
  // system-wide labels
  name: { en: "Name", bn: "নাম" },
  phone: { en: "Phone", bn: "ফোন" },
  nid: { en: "NID", bn: "এনআইডি" },
  opening: { en: "Opening", bn: "ওপেনিং" },
  liveBalance: { en: "Live Balance", bn: "লাইভ ব্যালেন্স" },
  ledger: { en: "Ledger", bn: "লেজার" },
  addUpdate: { en: "Add / Update", bn: "যোগ / আপডেট" },
  capitalLedger: { en: "Capital Ledger for", bn: "মূলধন লেজার" },
  date: { en: "Date", bn: "তারিখ" },
  type: { en: "Type", bn: "ধরন" },
  amount: { en: "Amount", bn: "পরিমাণ" },
  notes: { en: "Notes", bn: "নোট" },
  projectName: { en: "Project Name", bn: "প্রকল্পের নাম" },
  mouza: { en: "Mouza", bn: "মৌজা" },
  totalCapital: { en: "Total Capital", bn: "মোট মূলধন" },
  totalLandCost: { en: "Total Land Cost", bn: "মোট জমির খরচ" },
  totalExpenses: { en: "Total Expenses", bn: "মোট ব্যয়" },
  totalSales: { en: "Total Sales Collected", bn: "মোট বিক্রয় আদায়" },
  netPnL: { en: "Net P&L", bn: "নিট লাভ-ক্ষতি" },
  save: { en: "Save", bn: "সংরক্ষণ" },
  cancel: { en: "Cancel", bn: "বাতিল" },
  view: { en: "View", bn: "দেখুন" },
  delete: { en: "Delete", bn: "মুছুন" },
  edit: { en: "Edit", bn: "সম্পাদনা" },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") return (localStorage.getItem("lang") as Lang) || "en";
    return "en";
  });
  const toggle = () => setLang((l) => { const n: Lang = l === "en" ? "bn" : "en"; localStorage.setItem("lang", n); return n; });
  const t = (k: string) => DICT[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, t, toggle }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
