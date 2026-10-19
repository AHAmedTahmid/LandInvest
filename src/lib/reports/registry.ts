export type ReportCategory = "financial" | "partners" | "projects" | "sales" | "profit" | "audit";

export type ReportFilterField = "dateRange" | "project" | "partner" | "bankAccount" | "status" | "sale" | "user" | "table" | "action";

export type ReportDef = {
  key: string;
  titleEn: string;
  titleBn: string;
  category: ReportCategory;
  permission: string;
  filters: ReportFilterField[];
  descriptionEn: string;
  descriptionBn: string;
};

export const REPORT_REGISTRY: ReportDef[] = [
  // A. Financial / Treasury
  { key: "cash-book", titleEn: "Cash Book", titleBn: "নগদ খাতা", category: "financial", permission: "reports.financial.view", filters: ["dateRange"], descriptionEn: "Date-wise cash in/out with running balance", descriptionBn: "তারিখভিত্তিক নগদ আদায়-পরিশোধ এবং চলতি ব্যালেন্স" },
  { key: "bank-book", titleEn: "Bank Book", titleBn: "ব্যাংক খাতা", category: "financial", permission: "reports.financial.view", filters: ["dateRange", "bankAccount"], descriptionEn: "Bank account transactions with running balance", descriptionBn: "ব্যাংক অ্যাকাউন্টের লেনদেন এবং চলতি ব্যালেন্স" },
  { key: "daily-summary", titleEn: "Daily Collection & Payment Summary", titleBn: "দৈনিক আদায় ও পরিশোধ সারাংশ", category: "financial", permission: "reports.financial.view", filters: ["dateRange"], descriptionEn: "Daily cash/bank receipts, payments and net movement", descriptionBn: "দৈনিক নগদ/ব্যাংক আদায়, পরিশোধ এবং নেট চলাচল" },
  { key: "receipts-payments", titleEn: "Receipts & Payments Statement", titleBn: "আদায় ও পরিশোধ বিবরণী", category: "financial", permission: "reports.financial.view", filters: ["dateRange"], descriptionEn: "Money in/out grouped by purpose for a period", descriptionBn: "সময়সীমার জন্য উদ্দেশ্যভিত্তিক আদায়-পরিশোধ" },
  { key: "contra-register", titleEn: "Contra / Fund Transfer Register", titleBn: "কন্ট্রা / তহবিল স্থানান্তর নিবন্ধন", category: "financial", permission: "reports.financial.view", filters: ["dateRange"], descriptionEn: "All cash and bank transfers in the period", descriptionBn: "সময়সীমার মধ্যে সকল নগদ ও ব্যাংক স্থানান্তর" },

  // B. Partners
  { key: "partner-capital", titleEn: "Partner Capital Statement", titleBn: "অংশীদার মূলধন বিবরণী", category: "partners", permission: "reports.partners.view", filters: ["dateRange", "partner"], descriptionEn: "Individual partner ledger with running balance", descriptionBn: "প্রতিটি অংশীদারের খাতা চলতি ব্যালেন্সসহ" },
  { key: "partners-summary", titleEn: "All Partners Summary", titleBn: "সকল অংশীদার সারাংশ", category: "partners", permission: "reports.partners.view", filters: [], descriptionEn: "One row per partner: deposits, expenses, profit, withdrawals, balance", descriptionBn: "প্রতিটি অংশীদারের জন্য আমানত, ব্যয়, লাভ, উত্তোলন, ব্যালেন্স" },
  { key: "partner-contribution", titleEn: "Partner Contribution by Project", titleBn: "প্রকল্পভিত্তিক অংশীদার অবদান", category: "partners", permission: "reports.partners.view", filters: ["project"], descriptionEn: "Each partner's contribution vs share % per project", descriptionBn: "প্রতিটি প্রকল্পে অংশীদারের অবদান বনাম শেয়ার %" },

  // C. Land Projects
  { key: "project-cost", titleEn: "Project Cost Statement", titleBn: "প্রকল্প খরচ বিবরণী", category: "projects", permission: "reports.projects.view", filters: ["project"], descriptionEn: "Acquisition + development expenses, cost per Shotok", descriptionBn: "অধিগ্রহণ ও উন্নয়ন ব্যয়, প্রতি শতক খরচ" },
  { key: "project-pnl", titleEn: "Project Profit & Loss", titleBn: "প্রকল্প লাভ-ক্ষতি", category: "projects", permission: "reports.projects.view", filters: ["project"], descriptionEn: "Invoiced and realised profit for one project", descriptionBn: "একটি প্রকল্পের ইনভয়েসভিত্তিক ও প্রকৃত লাভ" },
  { key: "projects-comparison", titleEn: "All Projects Comparison", titleBn: "সকল প্রকল্প তুলনা", category: "projects", permission: "reports.projects.view", filters: [], descriptionEn: "Area, cost, sales, collected, receivable, profit, ROI, status", descriptionBn: "জায়গা, খরচ, বিক্রয়, আদায়, বকেয়া, লাভ, ROI, অবস্থা" },
  { key: "expense-register", titleEn: "Expense Register", titleBn: "ব্যয় নিবন্ধন", category: "projects", permission: "reports.projects.view", filters: ["dateRange", "project", "status"], descriptionEn: "All vouchers with subtotals by category", descriptionBn: "সকল ভাউচার বিভাগভিত্তিক সাবটোটালসহ" },
  { key: "pending-approval", titleEn: "Pending Approval Report", titleBn: "অনুমোদনের অপেক্ষায় প্রতিবেদন", category: "projects", permission: "reports.projects.view", filters: ["project"], descriptionEn: "Expenses awaiting approval with age in days", descriptionBn: "অনুমোদনের অপেক্ষায় থাকা ব্যয় দিনভিত্তিক বয়সসহ" },
  { key: "land-documents", titleEn: "Land Document Register", titleBn: "জমি দলিল নিবন্ধন", category: "projects", permission: "reports.projects.view", filters: [], descriptionEn: "Mouza, JL, Dag, Khatian numbers, area, status", descriptionBn: "মৌজা, জেএল, দাগ, খতিয়ান নম্বর, জায়গা, অবস্থা" },

  // D. Sales & Receivables
  { key: "sales-register", titleEn: "Sales Register", titleBn: "বিক্রয় নিবন্ধন", category: "sales", permission: "reports.sales.view", filters: ["dateRange", "project", "status"], descriptionEn: "All sale contracts with buyer, price, paid, due", descriptionBn: "সকল বিক্রয় চুক্তি ক্রেতা, মূল্য, পরিশোধিত, বকেয়াসহ" },
  { key: "plot-inventory", titleEn: "Plot Inventory / Stock Report", titleBn: "প্লট তালিকা / স্টক প্রতিবেদন", category: "sales", permission: "reports.sales.view", filters: ["project"], descriptionEn: "Plots by status with inventory value", descriptionBn: "অবস্থাভিত্তিক প্লট এবং স্টক মূল্য" },
  { key: "buyer-statement", titleEn: "Buyer Statement", titleBn: "ক্রেতা বিবরণী", category: "sales", permission: "reports.sales.view", filters: ["sale"], descriptionEn: "Contract details, installments, payments, remaining due", descriptionBn: "চুক্তির বিবরণ, কিস্তি, পরিশোধ, অবশিষ্ট বকেয়া" },
  { key: "receivables-aging", titleEn: "Receivables Aging", titleBn: "বকেয়া বয়সভিত্তিক প্রতিবেদন", category: "sales", permission: "reports.sales.view", filters: ["dateRange", "project"], descriptionEn: "Outstanding dues by aging bucket", descriptionBn: "বয়সভিত্তিক বকেয়া বিভাগ" },
  { key: "installment-report", titleEn: "Installment Due & Overdue Report", titleBn: "কিস্তি বকেয়া ও মেয়াদোত্তীর্ণ প্রতিবেদন", category: "sales", permission: "reports.sales.view", filters: ["dateRange"], descriptionEn: "Upcoming installments and overdue with buyer phone", descriptionBn: "আসন্ন কিস্তি ও মেয়াদোত্তীর্ণ ক্রেতার ফোন নম্বরসহ" },
  { key: "collection-report", titleEn: "Collection Report", titleBn: "আদায় প্রতিবেদন", category: "sales", permission: "reports.sales.view", filters: ["dateRange", "project"], descriptionEn: "Payments received in a period", descriptionBn: "সময়সীমায় প্রাপ্ত পরিশোধ" },

  // E. Profit Distribution
  { key: "profit-allocation", titleEn: "Profit Allocation Sheet", titleBn: "লাভ বণ্টন চার্ট", category: "profit", permission: "reports.financial.view", filters: ["project"], descriptionEn: "Net profit split by partner share %", descriptionBn: "অংশীদার শেয়ার অনুযায়ী নিট লাভ বণ্টন" },
  { key: "profit-history", titleEn: "Profit Distribution History", titleBn: "লাভ বণ্টন ইতিহাস", category: "profit", permission: "reports.financial.view", filters: ["dateRange", "project"], descriptionEn: "Every distribution run with amounts", descriptionBn: "প্রতিটি বণ্টনের তারিখ, প্রকল্প, অংশীদার ও পরিমাণ" },

  // F. Control & Audit
  { key: "audit-trail", titleEn: "Audit Trail Report", titleBn: "অডিট ট্রেইল প্রতিবেদন", category: "audit", permission: "reports.audit.view", filters: ["dateRange", "user", "table", "action"], descriptionEn: "Who changed what and when", descriptionBn: "কে কী পরিবর্তন করেছে কখন" },
  { key: "user-activity", titleEn: "User Activity Report", titleBn: "ব্যবহারকারী কার্যকলাপ প্রতিবেদন", category: "audit", permission: "reports.audit.view", filters: ["dateRange", "user"], descriptionEn: "Logins and key actions per user", descriptionBn: "প্রতিটি ব্যবহারকারীর লগইন ও মূল কার্যকলাপ" },
  { key: "reconciliation", titleEn: "Reconciliation Check", titleBn: "মিলান পরীক্ষা", category: "audit", permission: "reports.audit.view", filters: [], descriptionEn: "Automatic integrity checks with pass/fail", descriptionBn: "স্বয়ংক্রিয় সমন্বয় পরীক্ষা পাস/ফেইলসহ" },
];

export function getReportDef(key: string): ReportDef | undefined {
  return REPORT_REGISTRY.find((r) => r.key === key);
}

export function reportsByCategory(cat: ReportCategory): ReportDef[] {
  return REPORT_REGISTRY.filter((r) => r.category === cat);
}
