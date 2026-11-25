import { DASHBOARD_TABS, WIDGET_REGISTRY } from "@/lib/dashboard/widgets";

export type BasePermissionKey =
  // Dashboard & Executive
  | "dashboard.view"
  | "dashboard.customize"
  | "dashboard.layout.manage"
  | "dashboard.export"
  | "dashboard.settings.manage"

  // Syndicate Partners (CRUD + Capital)
  | "partners.view"
  | "partners.create"
  | "partners.edit"
  | "partners.delete"
  | "partners.manage"
  | "partners.capital.deposit"
  | "partners.capital.withdraw"
  | "partners.ledger.view"

  // Treasury & Banking (CRUD + Contra)
  | "treasury.view"
  | "treasury.bank.create"
  | "treasury.bank.edit"
  | "treasury.bank.delete"
  | "treasury.bank.manage"
  | "treasury.contra.create"
  | "treasury.contra.approve"

  // Land Projects & Plots (CRUD)
  | "projects.view"
  | "projects.create"
  | "projects.edit"
  | "projects.delete"
  | "plots.view"
  | "plots.create"
  | "plots.edit"
  | "plots.delete"
  | "plots.manage"

  // Expenses & Vouchers (CRUD + Approve)
  | "expenses.view"
  | "expenses.create"
  | "expenses.edit"
  | "expenses.delete"
  | "expenses.approve"

  // Sales & Contracts (CRUD + Collect + Print)
  | "sales.view"
  | "sales.create"
  | "sales.edit"
  | "sales.delete"
  | "sales.collect"
  | "receipts.print"

  // Profit Distribution (View + Distribute + Export)
  | "profit.view"
  | "profit.distribute"
  | "profit.export"

  // Reports
  | "reports.view"
  | "reports.export"
  | "reports.financial.view"
  | "reports.partners.view"
  | "reports.projects.view"
  | "reports.sales.view"
  | "reports.audit.view"

  // Administration & Security (CRUD)
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "users.manage"
  | "roles.view"
  | "roles.create"
  | "roles.edit"
  | "roles.delete"
  | "roles.manage"
  | "billing.manage"
  | "audit.view"
  | "settings.manage";

export type PermissionKey =
  | BasePermissionKey
  | `dashboard.tab.${string}`
  | `dashboard.widget.${string}`;

export type ActionType = "view" | "create" | "edit" | "delete" | "action";

export type PermissionDef = {
  key: PermissionKey;
  en: string;
  bn: string;
  actionType?: ActionType;
  category?: string;
};

export type PermissionGroup = {
  module: string;
  moduleEn: string;
  moduleBn: string;
  descriptionEn?: string;
  permissions: PermissionDef[];
};

// Dynamic dashboard tab permissions
const dashboardTabPerms: PermissionDef[] = DASHBOARD_TABS.map((tab) => ({
  key: `dashboard.tab.${tab.key}` as PermissionKey,
  en: `View Tab: ${tab.title.en}`,
  bn: `ট্যাব দেখুন: ${tab.title.bn}`,
  actionType: "view",
  category: "tabs",
}));

// Dynamic dashboard widget permissions
const dashboardWidgetPerms: PermissionDef[] = Object.values(WIDGET_REGISTRY).map((w) => ({
  key: `dashboard.widget.${w.key}` as PermissionKey,
  en: `Widget: ${w.title.en}`,
  bn: `উইজেট: ${w.title.bn}`,
  actionType: "view",
  category: w.category,
}));

export const PERMISSIONS: PermissionGroup[] = [
  {
    module: "dashboard",
    moduleEn: "Dashboard & Executive Views",
    moduleBn: "ড্যাশবোর্ড ও এক্সিকিউটিভ ভিউ",
    descriptionEn: "Workspace overview, executive analytics, and widget customizer",
    permissions: [
      { key: "dashboard.view", en: "View dashboard", bn: "ড্যাশবোর্ড দেখুন", actionType: "view" },
      { key: "dashboard.customize", en: "Customize own layout", bn: "নিজের লেআউট কাস্টমাইজ করুন", actionType: "edit" },
      { key: "dashboard.layout.manage", en: "Manage role default layouts", bn: "রোলের ডিফল্ট লেআউট পরিচালনা", actionType: "action" },
      { key: "dashboard.export", en: "Export dashboard as PDF/PNG", bn: "ড্যাশবোর্ড এক্সপোর্ট (পিডিএফ/ছবি)", actionType: "action" },
      { key: "dashboard.settings.manage", en: "Manage settings & thresholds", bn: "ড্যাশবোর্ড সেটিংস ও থ্রেশহোল্ড পরিচালনা", actionType: "action" },
      ...dashboardTabPerms,
      ...dashboardWidgetPerms,
    ],
  },
  {
    module: "projects",
    moduleEn: "Land Projects",
    moduleBn: "জমি প্রকল্প",
    descriptionEn: "Acquisition parameters, Mouza/JL registers, and project costings",
    permissions: [
      { key: "projects.view", en: "View projects (Read-Only)", bn: "প্রকল্প দেখুন (শুধুমাত্র দর্শন)", actionType: "view" },
      { key: "projects.create", en: "Create new project", bn: "নতুন প্রকল্প তৈরি করুন", actionType: "create" },
      { key: "projects.edit", en: "Edit project specifications", bn: "প্রকল্প সম্পাদনা করুন", actionType: "edit" },
      { key: "projects.delete", en: "Delete project record", bn: "প্রকল্প মুছুন", actionType: "delete" },
    ],
  },
  {
    module: "plots",
    moduleEn: "Plot Inventory & Demarcation",
    moduleBn: "প্লট তালিকা ও বরাদ্দ",
    descriptionEn: "Subdivided land parcels, status tracking, and inventory dimensions",
    permissions: [
      { key: "plots.view", en: "View plot inventory (Read-Only)", bn: "প্লট তালিকা দেখুন", actionType: "view" },
      { key: "plots.create", en: "Create demarcated plots", bn: "নতুন প্লট তৈরি করুন", actionType: "create" },
      { key: "plots.edit", en: "Edit plot size, rate & details", bn: "প্লটের মাপ ও মূল্য সম্পাদনা", actionType: "edit" },
      { key: "plots.delete", en: "Delete / remove plots", bn: "প্লট মুছুন", actionType: "delete" },
      { key: "plots.manage", en: "Manage plot layout & status", bn: "প্লট লেআউট ও অবস্থা পরিচালনা", actionType: "action" },
    ],
  },
  {
    module: "sales",
    moduleEn: "Sales & Buyer Bookings",
    moduleBn: "বিক্রয় ও বুকিং",
    descriptionEn: "Deed agreements, installment amortization, and collection receipts",
    permissions: [
      { key: "sales.view", en: "View sales register (Read-Only)", bn: "বিক্রয় চুক্তি দেখুন", actionType: "view" },
      { key: "sales.create", en: "Create booking / sale deed", bn: "নতুন বিক্রয় / বুকিং তৈরি", actionType: "create" },
      { key: "sales.edit", en: "Edit sales contract & terms", bn: "বিক্রয় চুক্তি সম্পাদনা", actionType: "edit" },
      { key: "sales.delete", en: "Cancel / delete sale contract", bn: "বিক্রয় চুক্তি বাতিল বা মুছুন", actionType: "delete" },
      { key: "sales.collect", en: "Collect customer payment", bn: "গ্রাহক কিস্তি আদায় করুন", actionType: "action" },
      { key: "receipts.print", en: "Print official money receipt", bn: "মানি রসিদ প্রিন্ট করুন", actionType: "action" },
    ],
  },
  {
    module: "expenses",
    moduleEn: "Project & Operational Expenses",
    moduleBn: "প্রকল্প ও পরিচালনা ব্যয়",
    descriptionEn: "Development cost vouchers, registration fees, and site expenditures",
    permissions: [
      { key: "expenses.view", en: "View expenses (Read-Only)", bn: "ব্যয় দেখুন", actionType: "view" },
      { key: "expenses.create", en: "Create expense voucher", bn: "ব্যয় ভাউচার তৈরি", actionType: "create" },
      { key: "expenses.edit", en: "Edit pending expense voucher", bn: "অপেক্ষমাণ ভাউচার সম্পাদনা", actionType: "edit" },
      { key: "expenses.delete", en: "Delete expense voucher", bn: "ব্যয় ভাউচার মুছুন", actionType: "delete" },
      { key: "expenses.approve", en: "Approve & capitalize voucher", bn: "ভাউচার অনুমোদন ও ক্যাপিটালাইজ", actionType: "action" },
    ],
  },
  {
    module: "partners",
    moduleEn: "Syndicate Partners & Capital",
    moduleBn: "সিন্ডিকেট অংশীদার ও মূলধন",
    descriptionEn: "Investor profiles, capital equity deposits, and withdrawal ledgers",
    permissions: [
      { key: "partners.view", en: "View partners (Read-Only)", bn: "অংশীদার দেখুন", actionType: "view" },
      { key: "partners.create", en: "Onboard new partner", bn: "নতুন অংশীদার যুক্ত করুন", actionType: "create" },
      { key: "partners.edit", en: "Edit partner details & KYC", bn: "অংশীদার তথ্য সম্পাদনা", actionType: "edit" },
      { key: "partners.delete", en: "Remove partner profile", bn: "অংশীদার মুছুন", actionType: "delete" },
      { key: "partners.manage", en: "Manage partner profile & shares", bn: "অংশীদার প্রোফাইল ও শেয়ার পরিচালনা", actionType: "action" },
      { key: "partners.capital.deposit", en: "Record capital deposit", bn: "মূলধন জমা এন্ট্রি", actionType: "action" },
      { key: "partners.capital.withdraw", en: "Record capital withdrawal", bn: "মূলধন উত্তোলন এন্ট্রি", actionType: "action" },
      { key: "partners.ledger.view", en: "View partner capital ledger", bn: "অংশীদার খাতা দেখুন", actionType: "view" },
    ],
  },
  {
    module: "treasury",
    moduleEn: "Treasury & Bank / MFS Accounts",
    moduleBn: "ট্রেজারি ও ব্যাংক/MFS হিসাব",
    descriptionEn: "Bank & bKash/Nagad accounts, physical vault cash, and contra transfers",
    permissions: [
      { key: "treasury.view", en: "View treasury & accounts (Read-Only)", bn: "ট্রেজারি ও হিসাব দেখুন", actionType: "view" },
      { key: "treasury.bank.create", en: "Add bank or MFS account", bn: "ব্যাংক বা MFS হিসাব যুক্ত করুন", actionType: "create" },
      { key: "treasury.bank.edit", en: "Edit account parameters", bn: "অ্যাকাউন্ট তথ্য সম্পাদনা", actionType: "edit" },
      { key: "treasury.bank.delete", en: "Deactivate bank/MFS account", bn: "অ্যাকাউন্ট নিষ্ক্রিয়/মুছুন", actionType: "delete" },
      { key: "treasury.bank.manage", en: "Manage bank master accounts", bn: "ব্যাংক অ্যাকাউন্ট পরিচালনা", actionType: "action" },
      { key: "treasury.contra.create", en: "Initiate contra fund transfer", bn: "কন্ট্রা তহবিল স্থানান্তর তৈরি", actionType: "action" },
      { key: "treasury.contra.approve", en: "Approve contra fund transfer", bn: "কন্ট্রা তহবিল স্থানান্তর অনুমোদন", actionType: "action" },
    ],
  },
  {
    module: "profit",
    moduleEn: "Profit Allocation & Distribution",
    moduleBn: "লাভ বণ্টন ও লভ্যাংশ",
    descriptionEn: "Project profit calculations, contingency reserves, and dividend payouts",
    permissions: [
      { key: "profit.view", en: "View PnL & profit models", bn: "লাভ-ক্ষতি ও মডেল দেখুন", actionType: "view" },
      { key: "profit.distribute", en: "Execute profit distribution run", bn: "লভ্যাংশ বণ্টন কার্যকর করুন", actionType: "action" },
      { key: "profit.export", en: "Export dividend allocation sheets", bn: "লভ্যাংশ বিবরণী এক্সপোর্ট করুন", actionType: "action" },
    ],
  },
  {
    module: "reports",
    moduleEn: "Executive & Financial Reports",
    moduleBn: "প্রতিবেদন ও অ্যানালিটিক্স",
    descriptionEn: "26-report catalog across Financial, Partners, Projects, Sales, and Audit",
    permissions: [
      { key: "reports.view", en: "View reports catalog", bn: "রিপোর্ট ক্যাটালগ দেখুন", actionType: "view" },
      { key: "reports.export", en: "Export reports to PDF & Excel", bn: "রিপোর্ট এক্সপোর্ট (পিডিএফ/এক্সেল)", actionType: "action" },
      { key: "reports.financial.view", en: "Access financial treasury reports", bn: "আর্থিক প্রতিবেদন দেখুন", actionType: "view" },
      { key: "reports.partners.view", en: "Access partner capital reports", bn: "অংশীদার প্রতিবেদন দেখুন", actionType: "view" },
      { key: "reports.projects.view", en: "Access project cost & PnL reports", bn: "প্রকল্প প্রতিবেদন দেখুন", actionType: "view" },
      { key: "reports.sales.view", en: "Access sales & collection reports", bn: "বিক্রয় প্রতিবেদন দেখুন", actionType: "view" },
      { key: "reports.audit.view", en: "Access forensic audit trail reports", bn: "অডিট ও নিয়ন্ত্রণ প্রতিবেদন দেখুন", actionType: "view" },
    ],
  },
  {
    module: "admin",
    moduleEn: "User Governance & Security Administration",
    moduleBn: "ইউজার প্রশাসন ও নিরাপত্তা",
    descriptionEn: "Team member credentials, role delegation, audit telemetry, and billing",
    permissions: [
      { key: "users.view", en: "View users & team members", bn: "ব্যবহারকারী তালিকা দেখুন", actionType: "view" },
      { key: "users.create", en: "Invite / provision new users", bn: "ব্যবহারকারী আমন্ত্রণ বা তৈরি", actionType: "create" },
      { key: "users.edit", en: "Edit user profile & permissions", bn: "ব্যবহারকারী তথ্য সম্পাদনা", actionType: "edit" },
      { key: "users.delete", en: "Deactivate or remove users", bn: "ব্যবহারকারী নিষ্ক্রিয় বা মুছুন", actionType: "delete" },
      { key: "users.manage", en: "Full user access administration", bn: "ব্যবহারকারী পূর্ণ ব্যবস্থাপনা", actionType: "action" },
      { key: "roles.view", en: "View role templates", bn: "রোল তালিকা দেখুন", actionType: "view" },
      { key: "roles.create", en: "Create custom security role", bn: "কাস্টম রোল তৈরি করুন", actionType: "create" },
      { key: "roles.edit", en: "Edit role permission matrix", bn: "রোল অনুমতি সম্পাদনা করুন", actionType: "edit" },
      { key: "roles.delete", en: "Delete custom security role", bn: "কাস্টম রোল মুছুন", actionType: "delete" },
      { key: "roles.manage", en: "Full role & RBAC administration", bn: "রোল ও পারমিশন পূর্ণ ব্যবস্থাপনা", actionType: "action" },
      { key: "settings.manage", en: "Manage tenant settings & fiscal years", bn: "টেন্যান্ট সেটিংস ও অর্থবছর পরিচালনা", actionType: "action" },
      { key: "billing.manage", en: "Manage billing & subscriptions", bn: "বিলিং ও সাবস্ক্রিপশন ব্যবস্থাপনা", actionType: "action" },
      { key: "audit.view", en: "View system audit telemetry", bn: "সিস্টেম অডিট টেলিমেট্রি দেখুন", actionType: "view" },
    ],
  },
];

export const ALL_KEYS = PERMISSIONS.flatMap((g) => g.permissions.map((p) => p.key)) as PermissionKey[];
export const KEY_SET = new Set<string>(ALL_KEYS);

export function isValidKey(k: string): k is PermissionKey {
  return KEY_SET.has(k);
}
