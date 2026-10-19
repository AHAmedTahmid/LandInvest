export type PermissionKey =
  | "dashboard.view"
  | "partners.view" | "partners.manage" | "partners.capital.deposit" | "partners.capital.withdraw" | "partners.ledger.view"
  | "treasury.view" | "treasury.bank.manage" | "treasury.contra.create" | "treasury.contra.approve"
  | "projects.view" | "projects.create" | "projects.edit" | "projects.delete" | "plots.manage"
  | "expenses.view" | "expenses.create" | "expenses.approve" | "expenses.delete"
  | "sales.view" | "sales.create" | "sales.collect" | "receipts.print"
  | "profit.view" | "profit.distribute"
  | "reports.view" | "reports.export"
  | "reports.financial.view" | "reports.partners.view" | "reports.projects.view"
  | "reports.sales.view" | "reports.audit.view"
  | "users.view" | "users.manage" | "roles.manage" | "billing.manage" | "audit.view";

export type PermissionDef = { key: PermissionKey; en: string; bn: string };
export type PermissionGroup = { module: string; moduleEn: string; moduleBn: string; permissions: PermissionDef[] };

export const PERMISSIONS: PermissionGroup[] = [
  {
    module: "dashboard", moduleEn: "Dashboard", moduleBn: "ড্যাশবোর্ড",
    permissions: [{ key: "dashboard.view", en: "View dashboard", bn: "ড্যাশবোর্ড দেখুন" }],
  },
  {
    module: "partners", moduleEn: "Partners", moduleBn: "পার্টনার",
    permissions: [
      { key: "partners.view", en: "View partners", bn: "পার্টনার দেখুন" },
      { key: "partners.manage", en: "Manage partners", bn: "পার্টনার ব্যবস্থাপনা" },
      { key: "partners.capital.deposit", en: "Record capital deposit", bn: "মূলধন জমা" },
      { key: "partners.capital.withdraw", en: "Record capital withdrawal", bn: "মূলধন উত্তোলন" },
      { key: "partners.ledger.view", en: "View partner ledger", bn: "পার্টনার লেজার দেখুন" },
    ],
  },
  {
    module: "treasury", moduleEn: "Treasury", moduleBn: "ট্রেজারি",
    permissions: [
      { key: "treasury.view", en: "View treasury", bn: "ট্রেজারি দেখুন" },
      { key: "treasury.bank.manage", en: "Manage bank accounts", bn: "ব্যাংক অ্যাকাউন্ট ব্যবস্থাপনা" },
      { key: "treasury.contra.create", en: "Create contra transfer", bn: "কন্ট্রা তৈরি" },
      { key: "treasury.contra.approve", en: "Approve contra transfer", bn: "কন্ট্রা অনুমোদন" },
    ],
  },
  {
    module: "projects", moduleEn: "Land Projects", moduleBn: "জমি প্রকল্প",
    permissions: [
      { key: "projects.view", en: "View projects", bn: "প্রকল্প দেখুন" },
      { key: "projects.create", en: "Create project", bn: "প্রকল্প তৈরি" },
      { key: "projects.edit", en: "Edit project", bn: "প্রকল্প সম্পাদনা" },
      { key: "projects.delete", en: "Delete project / plot", bn: "প্রকল্প/প্লট মুছুন" },
      { key: "plots.manage", en: "Manage plots", bn: "প্লট ব্যবস্থাপনা" },
    ],
  },
  {
    module: "expenses", moduleEn: "Expenses", moduleBn: "ব্যয়",
    permissions: [
      { key: "expenses.view", en: "View expenses", bn: "ব্যয় দেখুন" },
      { key: "expenses.create", en: "Create expense", bn: "ব্যয় তৈরি" },
      { key: "expenses.approve", en: "Approve expense", bn: "ব্যয় অনুমোদন" },
      { key: "expenses.delete", en: "Delete expense", bn: "ব্যয় মুছুন" },
    ],
  },
  {
    module: "sales", moduleEn: "Sales", moduleBn: "বিক্রয়",
    permissions: [
      { key: "sales.view", en: "View sales", bn: "বিক্রয় দেখুন" },
      { key: "sales.create", en: "Create sale / booking", bn: "বিক্রয় তৈরি" },
      { key: "sales.collect", en: "Collect payment", bn: "পেমেন্ট আদায়" },
      { key: "receipts.print", en: "Print receipts", bn: "রসিদ প্রিন্ট" },
    ],
  },
  {
    module: "profit", moduleEn: "Profit", moduleBn: "লাভ",
    permissions: [
      { key: "profit.view", en: "View PnL", bn: "লাভ-ক্ষতি দেখুন" },
      { key: "profit.distribute", en: "Distribute profit", bn: "লাভ বণ্টন" },
    ],
  },
  {
    module: "reports", moduleEn: "Reports", moduleBn: "রিপোর্ট",
    permissions: [
      { key: "reports.view", en: "View reports", bn: "রিপোর্ট দেখুন" },
      { key: "reports.export", en: "Export reports", bn: "রিপোর্ট এক্সপোর্ট" },
      { key: "reports.financial.view", en: "View financial reports", bn: "আর্থিক প্রতিবেদন দেখুন" },
      { key: "reports.partners.view", en: "View partner reports", bn: "অংশীদার প্রতিবেদন দেখুন" },
      { key: "reports.projects.view", en: "View project reports", bn: "প্রকল্প প্রতিবেদন দেখুন" },
      { key: "reports.sales.view", en: "View sales reports", bn: "বিক্রয় প্রতিবেদন দেখুন" },
      { key: "reports.audit.view", en: "View audit reports", bn: "অডিট প্রতিবেদন দেখুন" },
    ],
  },
  {
    module: "admin", moduleEn: "Administration", moduleBn: "প্রশাসন",
    permissions: [
      { key: "users.view", en: "View users", bn: "ইউজার দেখুন" },
      { key: "users.manage", en: "Manage users", bn: "ইউজার ব্যবস্থাপনা" },
      { key: "roles.manage", en: "Manage roles", bn: "রোল ব্যবস্থাপনা" },
      { key: "billing.manage", en: "Manage billing", bn: "বিলিং ব্যবস্থাপনা" },
      { key: "audit.view", en: "View audit log", bn: "অডিট লগ দেখুন" },
    ],
  },
];

export const ALL_KEYS = PERMISSIONS.flatMap((g) => g.permissions.map((p) => p.key)) as PermissionKey[];
export const KEY_SET = new Set<string>(ALL_KEYS);

export function isValidKey(k: string): k is PermissionKey {
  return KEY_SET.has(k);
}
