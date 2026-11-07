"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "bn";
const Ctx = createContext<{ lang: Lang; t: (k: string) => string; toggle: () => void }>({ lang: "en", t: (k) => k, toggle: () => {} });

const DICT: Record<string, { en: string; bn: string }> = {
  dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  partners: { en: "Partners & Capital", bn: "পার্টনার ও মূলধন" },
  partners_dashboard: { en: "Overview & Analytics", bn: "ওভারভিউ ও অ্যানালিটিক্স" },
  partners_list: { en: "Partners Directory", bn: "পার্টনার তালিকা" },
  partners_capital: { en: "Add Capital / Investment", bn: "মূলধন জমা / বিনিয়োগ" },
  treasury: { en: "Cash & Bank Ledger", bn: "ক্যাশ ও ব্যাংক লেজার" },
  treasury_dashboard: { en: "Overview & Analytics", bn: "ওভারভিউ ও অ্যানালিটিক্স" },
  treasury_cash: { en: "Treasury (Cash & Contra)", bn: "ট্রেজারি (নগদ ও কন্ট্রা)" },
  treasury_accounts: { en: "Bank & MFS Accounts", bn: "ব্যাংক ও এমএফএস অ্যাকাউন্ট" },
  treasury_transactions: { en: "Ledger Transactions", bn: "লেজার লেনদেনসমূহ" },
  treasury_approvals: { en: "Transfer Approvals", bn: "ট্রান্সফার অনুমোদন" },
  projects: { en: "Land Projects & Acquisition", bn: "জমি প্রকল্প ও অধিগ্রহণ" },
  projects_new: { en: "New Acquirement", bn: "নতুন অধিগ্রহণ" },
  projects_plots: { en: "Plots", bn: "প্লটসমূহ" },
  projects_all: { en: "All Projects", bn: "সকল প্রকল্প" },
  expenses: { en: "Project Expenses", bn: "প্রকল্প ব্যয়" },
  expenses_dashboard: { en: "Expenses Dashboard", bn: "ব্যয় ড্যাশবোর্ড" },
  expenses_all: { en: "Expenses", bn: "সকল ব্যয়" },
  expenses_approvals: { en: "Approval Queue (PENDING)", bn: "অনুমোদন সারি (পেন্ডিং)" },
  expenses_breakdown: { en: "Project-wise Cost Breakdown", bn: "প্রকল্পভিত্তিক ব্যয় বিশ্লেষণ" },
  vouchers: { en: "Voucher Management", bn: "ভাউচার ব্যবস্থাপনা" },
  sales: { en: "Plot Sales & Bookings", bn: "প্লট বিক্রয় ও বুকিং" },
  sales_all: { en: "Plot Sales", bn: "প্লট বিক্রয়" },
  sales_bookings: { en: "Bookings", bn: "বুকিং" },
  sales_dues: { en: "Dues & Installments", bn: "বকেয়া ও কিস্তি" },
  pnl: { en: "Profit & Loss (P&L)", bn: "লাভ-ক্ষতি" },
  reports: { en: "Reports", bn: "প্রতিবেদন" },
  audit: { en: "Audit Trail", bn: "অডিট ট্রেইল" },
  users: { en: "Users", bn: "ব্যবহারকারী" },
  roles: { en: "Roles", bn: "ভূমিকা" },
  administration: { en: "Administration", bn: "প্রশাসন" },
  logout: { en: "Log out", bn: "লগ আউট" },
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
  // Dashboard & KPI Tiles
  cashBalance: { en: "Cash in Hand", bn: "হাতে নগদ" },
  bankBalance: { en: "Bank Balance", bn: "ব্যাংক ব্যালেন্স" },
  unsoldInventory: { en: "Unsold Inventory", bn: "অবিক্রীত ইনভেন্টরি" },
  receivables: { en: "Total Receivables", bn: "মোট বকেয়া/প্রাপ্য" },
  salesMonth: { en: "Sales This Month", bn: "চলতি মাসের বিক্রয়" },
  salesYear: { en: "Sales This Fiscal Year", bn: "চলতি অর্থবছরের বিক্রয়" },
  totalLiquidity: { en: "Total Liquidity", bn: "মোট তরল তহবিল" },
  workingCapital: { en: "Available Working Capital", bn: "চলতি কার্যনির্বাহী মূলধন" },
  totalEquity: { en: "Partner Equity Injected", bn: "অংশীদারদের বিনিয়োগকৃত মূলধন" },
  capitalDeployed: { en: "Capital Deployed", bn: "প্রকল্পে বিনিয়োগ" },
  overdueReceivables: { en: "Overdue Receivables", bn: "মেয়াদোত্তীর্ণ বকেয়া" },
  expensesMonth: { en: "Expenses This Month", bn: "চলতি মাসের খরচ" },
  pendingApprovals: { en: "Pending Approvals", bn: "অনুমোদনাধীন ভাউচার" },
  realizedProfit: { en: "Realized Cash Profit", bn: "বাস্তবায়িত নগদ মুনাফা" },
  portfolioRoi: { en: "Portfolio ROI", bn: "পোর্টফোলিও আরওআই" },
  futureDated: { en: "Future Dated", bn: "ভবিষ্যতের তারিখযুক্ত" },
  save: { en: "Save", bn: "সংরক্ষণ" },
  cancel: { en: "Cancel", bn: "বাতিল" },
  view: { en: "View", bn: "দেখুন" },
  delete: { en: "Delete", bn: "মুছুন" },
  edit: { en: "Edit", bn: "সম্পাদনা" },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  // hydration-safe: server renders "en", client hydrates "en" then switches after mount
  useEffect(() => {
    const s = localStorage.getItem("lang") as Lang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s) setLang(s);
  }, []);
  const toggle = () => setLang((l) => { const n: Lang = l === "en" ? "bn" : "en"; localStorage.setItem("lang", n); return n; });
  const t = (k: string) => DICT[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, t, toggle }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
