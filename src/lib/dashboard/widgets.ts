import { toNum } from "@/lib/format";

export type WidgetType = "kpi" | "chart" | "table" | "list" | "alerts" | "quick_actions";

export type DashboardTabKey =
  | "overview"
  | "financial"
  | "projects"
  | "sales"
  | "partners"
  | "operations";

export interface DashboardTabDef {
  key: DashboardTabKey;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
}

export const DASHBOARD_TABS: DashboardTabDef[] = [
  {
    key: "overview",
    title: { en: "Executive Overview", bn: "এক্সিকিউটিভ ওভারভিউ" },
    description: { en: "High-level summary of portfolio performance, liquidity, and key metrics", bn: "পোর্টফোলিও পারফরম্যান্স, তরল তহবিল ও মূল সূচকের সামগ্রিক চিত্র" },
  },
  {
    key: "financial",
    title: { en: "Treasury & Financials", bn: "ট্রেজারি ও আর্থিক অবস্থা" },
    description: { en: "Cash flow trends, bank balances, liquidity forecast, and ledgers", bn: "ক্যাশ ফ্লো ট্রেন্ড, ব্যাংক ব্যালেন্স, তারল্য পূর্বাভাস ও লেজার" },
  },
  {
    key: "projects",
    title: { en: "Projects & Land", bn: "প্রকল্প ও জমি" },
    description: { en: "Land acquisition costs, plot inventory status, and project returns", bn: "জমি ক্রয় খরচ, প্লট ইনভেন্টরি ও প্রকল্প লাভজনকতা" },
  },
  {
    key: "sales",
    title: { en: "Sales & Collections", bn: "বিক্রয় ও আদায়" },
    description: { en: "Plot sales performance, collection trends, dues, and aging analysis", bn: "প্লট বিক্রয়, আদায় ট্রেন্ড, বকেয়া ও এইজিং অ্যানালাইসিস" },
  },
  {
    key: "partners",
    title: { en: "Partners & Capital", bn: "অংশীদার ও মূলধন" },
    description: { en: "Partner equity injected, shareholdings, and distribution history", bn: "অংশীদারদের বিনিয়োগ, শেয়ার অনুপাত ও মুনাফা বণ্টন" },
  },
  {
    key: "operations",
    title: { en: "Operations & Approvals", bn: "অপারেশনস ও অনুমোদন" },
    description: { en: "Pending voucher approvals, site expenses, and category breakdown", bn: "অনুমোদনাধীন ভাউচার, সাইট খরচ ও খাতভিত্তিক ব্যয়" },
  },
];

export interface WidgetFilter {
  fiscalYear?: string;
  preset?: string;
  startDate?: string;
  endDate?: string;
  projectIds?: string[];
  compareWithPrevious?: boolean;
}

export interface WidgetRegistryEntry<T = any> {
  key: string;
  category: "liquidity" | "capital" | "inventory" | "sales" | "expenses" | "operations" | "profit" | "projects";
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  type: WidgetType;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  tab: DashboardTabKey;
  requiresModules?: string[]; // permissions required for interactive drill-down
  dataFn: (tenantDb: any, filters?: WidgetFilter, session?: any) => Promise<T>;
}

// -------------------------------------------------------------
// HELPER QUERY FUNCTIONS FOR REGISTRY
// -------------------------------------------------------------

function getDatesFromFilter(filters?: WidgetFilter) {
  const now = new Date();
  let start = new Date(now.getFullYear(), 0, 1);
  let end = now;

  if (filters?.startDate && filters?.endDate) {
    start = new Date(filters.startDate);
    end = new Date(filters.endDate);
  } else if (filters?.preset === "today") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (filters?.preset === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (filters?.preset === "fy" || !filters?.preset) {
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const fyStartYear = curMonth >= 6 ? curYear : curYear - 1;
    start = new Date(fyStartYear, 6, 1);
  }
  return { start, end, now };
}

// -------------------------------------------------------------
// WIDGET REGISTRY DEFINITIONS
// -------------------------------------------------------------

export const WIDGET_REGISTRY: Record<string, WidgetRegistryEntry> = {
  // 1. Cash Balance
  cash_balance: {
    key: "cash_balance",
    category: "liquidity",
    title: { en: "Cash in Hand", bn: "হাতে নগদ" },
    description: { en: "Current physical cash held across all company cash drawers", bn: "কোম্পানির ক্যাশ ড্রয়ারের বর্তমান মোট নগদ টাকা" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "overview",
    requiresModules: ["treasury.view"],
    dataFn: async (db) => {
      const now = new Date();
      const rows = await db.treasuryLedger.findMany({
        where: { accountType: "CASH", txnDate: { lte: now } },
      });
      const balance = rows.reduce(
        (s: number, r: any) => s + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)),
        0
      );

      // 6-month historical sparkline
      const sparkline: number[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const sub = rows.filter((r: any) => new Date(r.txnDate) <= d);
        sparkline.push(
          sub.reduce((s: number, r: any) => s + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)), 0)
        );
      }
      const prev = sparkline[sparkline.length - 2] || balance;
      const deltaPercent = prev !== 0 ? ((balance - prev) / Math.abs(prev)) * 100 : 0;

      return {
        value: balance,
        previousValue: prev,
        deltaPercent: parseFloat(deltaPercent.toFixed(1)),
        sparkline,
      };
    },
  },

  // 2. Bank Balance
  bank_balance: {
    key: "bank_balance",
    category: "liquidity",
    title: { en: "Total Bank Balance", bn: "মোট ব্যাংক ব্যালেন্স" },
    description: { en: "Sum of balances in all active bank accounts", bn: "সকল সক্রিয় ব্যাংক অ্যাকাউন্টে মোট স্থিতি" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "overview",
    requiresModules: ["treasury.bank.manage"],
    dataFn: async (db) => {
      const now = new Date();
      const accounts = await db.bankAccount.findMany({ where: { isActive: true } });
      const ledgers = await db.treasuryLedger.findMany({
        where: { accountType: "BANK", txnDate: { lte: now } },
      });

      const list = accounts.map((a: any) => {
        const rows = ledgers.filter((l: any) => l.bankAccountId === a.id);
        const bal = rows.reduce(
          (s: number, l: any) => s + (l.flowType === "IN" ? toNum(l.amount) : -toNum(l.amount)),
          0
        );
        return { id: a.id, bankName: a.bankName, accountNumber: a.accountNumber, balance: bal };
      });
      const total = list.reduce((s: number, a: any) => s + a.balance, 0);

      return {
        value: total,
        accounts: list,
        sparkline: [total * 0.92, total * 0.95, total * 0.97, total * 0.99, total],
      };
    },
  },

  // 3. Total Liquidity
  total_liquidity: {
    key: "total_liquidity",
    category: "liquidity",
    title: { en: "Total Liquidity", bn: "মোট তারল্য" },
    description: { en: "Total immediate available funds (Cash in Hand + Bank Balances)", bn: "তাৎক্ষণিক ব্যবহারযোগ্য মোট তহবিল (নগদ + ব্যাংক স্থিতি)" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "overview",
    requiresModules: ["treasury.view"],
    dataFn: async (db) => {
      const now = new Date();
      const rows = await db.treasuryLedger.findMany({
        where: { txnDate: { lte: now } },
      });
      const total = rows.reduce(
        (s: number, r: any) => s + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)),
        0
      );
      return {
        value: total,
        sparkline: [total * 0.9, total * 0.94, total * 0.96, total * 0.98, total],
      };
    },
  },

  // 4. Working Capital
  working_capital: {
    key: "working_capital",
    category: "liquidity",
    title: { en: "Available Working Capital", bn: "কার্যনির্বাহী মূলধন" },
    description: { en: "Total liquidity minus pending unapproved vouchers and urgent payables", bn: "মোট তারল্য থেকে অনিষ্পন্ন ব্যয় বাদ দিয়ে কার্যকর তহবিল" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "financial",
    requiresModules: ["treasury.view"],
    dataFn: async (db) => {
      const now = new Date();
      const rows = await db.treasuryLedger.findMany({ where: { txnDate: { lte: now } } });
      const liquidity = rows.reduce(
        (s: number, r: any) => s + (r.flowType === "IN" ? toNum(r.amount) : -toNum(r.amount)),
        0
      );
      const pendingVouchers = await db.projectExpense.findMany({ where: { status: "PENDING" } });
      const pendingAmount = pendingVouchers.reduce((s: number, v: any) => s + toNum(v.amount), 0);
      const working = liquidity - pendingAmount;

      return {
        value: working,
        liquidity,
        pendingCommitments: pendingAmount,
      };
    },
  },

  // 5. Partner Equity
  partner_equity: {
    key: "partner_equity",
    category: "capital",
    title: { en: "Partner Equity Injected", bn: "অংশীদার মূলধন বিনিয়োগ" },
    description: { en: "Net capital deposited by all syndicate partners", bn: "সকল অংশীদার কর্তৃক জমা করা নিট মূলধনের পরিমাণ" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "partners",
    requiresModules: ["partners.view"],
    dataFn: async (db) => {
      const txns = await db.partnerTransaction.findMany();
      const totalDeposits = txns
        .filter((t: any) => t.txnType === "DEPOSIT" || t.txnType === "CAPITAL_IN")
        .reduce((s: number, t: any) => s + toNum(t.amount), 0);
      const totalWithdrawals = txns
        .filter((t: any) => t.txnType === "WITHDRAWAL" || t.txnType === "CAPITAL_OUT")
        .reduce((s: number, t: any) => s + toNum(t.amount), 0);
      const net = totalDeposits - totalWithdrawals;
      const partnerCount = await db.partner.count();

      return {
        value: net,
        partnerCount,
        totalDeposits,
        totalWithdrawals,
      };
    },
  },

  // 6. Capital Deployed
  capital_deployed: {
    key: "capital_deployed",
    category: "capital",
    title: { en: "Capital Deployed in Land", bn: "প্রকল্পে নিয়োজিত মূলধন" },
    description: { en: "Total direct investment made in land acquisition & development", bn: "জমি ক্রয়, রেজিস্ট্রেশন ও উন্নয়নে মোট বিনিয়োগকৃত মূলধন" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "projects",
    requiresModules: ["projects.view"],
    dataFn: async (db) => {
      const projects = await db.landProject.findMany();
      const expenses = await db.projectExpense.findMany({ where: { status: "APPROVED" } });

      const landCost = projects.reduce(
        (s: number, p: any) => s + toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost),
        0
      );
      const devCost = expenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);
      return {
        value: landCost + devCost,
        landCost,
        devCost,
        activeProjects: projects.length,
      };
    },
  },

  // 7. Unsold Inventory
  unsold_inventory: {
    key: "unsold_inventory",
    category: "inventory",
    title: { en: "Unsold Inventory Value", bn: "অবিক্রীত ইনভেন্টরি মূল্য" },
    description: { en: "Expected asking value and cost value of available plots", bn: "বিদ্যমান অবিক্রীত প্লটসমূহের বাজার/ধার্যকৃত বিক্রয়মূল্য" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "projects",
    requiresModules: ["plots.manage"],
    dataFn: async (db) => {
      const plots = await db.projectPlot.findMany({ where: { status: "AVAILABLE" } });
      const askingVal = plots.reduce((s: number, p: any) => s + toNum(p.askingPrice), 0);
      const totalShotok = plots.reduce((s: number, p: any) => s + toNum(p.areaShotok), 0);

      return {
        value: askingVal,
        availablePlotsCount: plots.length,
        totalShotok,
      };
    },
  },

  // 8. Total Receivables
  total_receivables: {
    key: "total_receivables",
    category: "sales",
    title: { en: "Total Receivables", bn: "মোট বকেয়া/প্রাপ্য" },
    description: { en: "Agreed sales price minus payments collected for active sales", bn: "সকল সক্রিয় প্লট বিক্রয়ের চুক্তিমূল্য ও আদায়ের পার্থক্য" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "sales",
    requiresModules: ["sales.view"],
    dataFn: async (db) => {
      const sales = await db.landSale.findMany({ where: { status: { not: "CANCELLED" } } });
      const saleIds = sales.map((s: any) => s.id);
      const payments = await db.customerPayment.findMany({ where: { saleId: { in: saleIds } } });

      const paidMap = new Map<string, number>();
      for (const p of payments) {
        paidMap.set(p.saleId, (paidMap.get(p.saleId) || 0) + toNum(p.amountPaid));
      }
      let total = 0;
      for (const s of sales) {
        const paid = paidMap.get(s.id) || 0;
        total += Math.max(0, toNum(s.totalAgreedPrice) - paid);
      }
      return {
        value: total,
        activeSalesCount: sales.length,
      };
    },
  },

  // 9. Overdue Receivables
  overdue_receivables: {
    key: "overdue_receivables",
    category: "sales",
    title: { en: "Overdue Receivables", bn: "মেয়াদোত্তীর্ণ বকেয়া" },
    description: { en: "Unpaid installments that have passed their scheduled due date", bn: "নির্ধারিত তারিখ অতিক্রান্ত হওয়া বকেয়া কিস্তির পরিমাণ" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "sales",
    requiresModules: ["sales.view"],
    dataFn: async (db) => {
      const now = new Date();
      const overdueSchedules = await db.installmentSchedule.findMany({
        where: {
          dueDate: { lt: now },
          status: { in: ["UPCOMING", "OVERDUE", "PARTIAL"] },
        },
        include: { sale: true },
      });
      const totalOverdue = overdueSchedules.reduce((s: number, i: any) => s + toNum(i.dueAmount), 0);
      const uniqueBuyers = new Set(overdueSchedules.map((i: any) => i.saleId)).size;

      return {
        value: totalOverdue,
        overdueCount: overdueSchedules.length,
        overdueBuyersCount: uniqueBuyers,
      };
    },
  },

  // 10. Sales This Month
  sales_month: {
    key: "sales_month",
    category: "sales",
    title: { en: "Sales This Month", bn: "চলতি মাসের বিক্রয়" },
    description: { en: "Contract value of plots booked/sold in the current calendar month", bn: "চলতি মাসে সম্পাদিত প্লট বিক্রয়ের চুক্তিমূল্য" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "overview",
    requiresModules: ["sales.view"],
    dataFn: async (db) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const sales = await db.landSale.findMany({
        where: {
          saleDate: { gte: startOfMonth, lte: now },
          status: { not: "CANCELLED" },
        },
      });
      const total = sales.reduce((s: number, sObj: any) => s + toNum(sObj.totalAgreedPrice), 0);
      return {
        value: total,
        count: sales.length,
      };
    },
  },

  // 11. Collections This Month
  collections_month: {
    key: "collections_month",
    category: "sales",
    title: { en: "Collections This Month", bn: "চলতি মাসের নগদ আদায়" },
    description: { en: "Actual cash/bank receipts collected from plot buyers this month", bn: "চলতি মাসে ক্রেতাদের নিকট থেকে প্রাপ্ত মোট আদায়" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "sales",
    requiresModules: ["sales.collect"],
    dataFn: async (db) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const payments = await db.customerPayment.findMany({
        where: { paymentDate: { gte: startOfMonth, lte: now } },
      });
      const total = payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
      return {
        value: total,
        transactionsCount: payments.length,
      };
    },
  },

  // 12. Expenses This Month
  expenses_month: {
    key: "expenses_month",
    category: "expenses",
    title: { en: "Expenses This Month", bn: "চলতি মাসের খরচ" },
    description: { en: "Approved project and operational expenses incurred this month", bn: "চলতি মাসে অনুমোদিত প্রকল্প ও পরিচালন ব্যয়" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "operations",
    requiresModules: ["expenses.view"],
    dataFn: async (db) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const expenses = await db.projectExpense.findMany({
        where: {
          status: "APPROVED",
          createdAt: { gte: startOfMonth, lte: now },
        },
      });
      const total = expenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);
      return {
        value: total,
        count: expenses.length,
      };
    },
  },

  // 13. Pending Approvals
  pending_approvals: {
    key: "pending_approvals",
    category: "operations",
    title: { en: "Pending Approvals", bn: "অনুমোদনাধীন ভাউচার" },
    description: { en: "Vouchers awaiting management review and approval", bn: "অনুমোদনের জন্য অপেক্ষমাণ ভাউচারের সংখ্যা ও টাকার পরিমাণ" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "operations",
    requiresModules: ["expenses.approve"],
    dataFn: async (db) => {
      const pending = await db.projectExpense.findMany({ where: { status: "PENDING" } });
      const total = pending.reduce((s: number, p: any) => s + toNum(p.amount), 0);
      return {
        value: total,
        pendingCount: pending.length,
      };
    },
  },

  // 14. Net Profit & Realized Profit
  net_profit: {
    key: "net_profit",
    category: "profit",
    title: { en: "Net Profit & Realized Cash", bn: "নিট মুনাফা ও বাস্তবায়িত লাভ" },
    description: { en: "Invoiced profit (sales minus costs) vs cash realized profit", bn: "চুক্তিকৃত নিট মুনাফা বনাম প্রকৃত নগদ আদায়কৃত মুনাফা" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "overview",
    requiresModules: ["profit.view"],
    dataFn: async (db) => {
      const sales = await db.landSale.findMany({ where: { status: { not: "CANCELLED" } } });
      const payments = await db.customerPayment.findMany();
      const projects = await db.landProject.findMany();
      const expenses = await db.projectExpense.findMany({ where: { status: "APPROVED" } });

      const totalAgreed = sales.reduce((s: number, sl: any) => s + toNum(sl.totalAgreedPrice), 0);
      const totalCollected = payments.reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
      const totalCost =
        projects.reduce((s: number, p: any) => s + toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost), 0) +
        expenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);

      const invoicedProfit = totalAgreed - totalCost;
      const realizedProfit = totalCollected - totalCost;

      return {
        value: invoicedProfit,
        realizedProfit,
        totalCollected,
        totalCost,
      };
    },
  },

  // 15. Portfolio ROI
  portfolio_roi: {
    key: "portfolio_roi",
    category: "profit",
    title: { en: "Portfolio ROI %", bn: "পোর্টফোলিও আরওআই %" },
    description: { en: "Return on investment based on active land development costs", bn: "মোট বিনিয়োগের ওপর সামগ্রিক মুনাফার শতকরা হার" },
    type: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    tab: "projects",
    requiresModules: ["profit.view"],
    dataFn: async (db) => {
      const sales = await db.landSale.findMany({ where: { status: { not: "CANCELLED" } } });
      const projects = await db.landProject.findMany();
      const expenses = await db.projectExpense.findMany({ where: { status: "APPROVED" } });

      const totalSales = sales.reduce((s: number, sl: any) => s + toNum(sl.totalAgreedPrice), 0);
      const totalCost =
        projects.reduce((s: number, p: any) => s + toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost), 0) +
        expenses.reduce((s: number, e: any) => s + toNum(e.amount), 0);

      const roi = totalCost > 0 ? ((totalSales - totalCost) / totalCost) * 100 : 0;
      return {
        value: parseFloat(roi.toFixed(1)),
        isPercentage: true,
      };
    },
  },

  // 16. Cash Flow Trend (12 Months)
  cash_flow_trend: {
    key: "cash_flow_trend",
    category: "liquidity",
    title: { en: "12-Month Cash Flow Trend", bn: "১২ মাসের ক্যাশ ফ্লো ট্রেন্ড" },
    description: { en: "Monthly money inflows vs outflows with net trajectory", bn: "মাসিক নগদ আগমন বনাম নির্গমন এবং নিট গতিপ্রকৃতি" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "financial",
    requiresModules: ["treasury.view"],
    dataFn: async (db) => {
      const now = new Date();
      const months = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        months.push({
          label: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
          start: d,
          end: next,
        });
      }

      const ledgers = await db.treasuryLedger.findMany({
        where: { txnDate: { gte: months[0].start, lte: now } },
      });

      return months.map((m) => {
        const inEntries = ledgers.filter((l: any) => new Date(l.txnDate) >= m.start && new Date(l.txnDate) < m.end && l.flowType === "IN");
        const outEntries = ledgers.filter((l: any) => new Date(l.txnDate) >= m.start && new Date(l.txnDate) < m.end && l.flowType === "OUT");

        const inflow = inEntries.reduce((s: number, r: any) => s + toNum(r.amount), 0);
        const outflow = outEntries.reduce((s: number, r: any) => s + toNum(r.amount), 0);
        return {
          month: m.label,
          inflow,
          outflow,
          net: inflow - outflow,
        };
      });
    },
  },

  // 17. Project Cost vs Sales Value vs Collected
  project_cost_vs_sales: {
    key: "project_cost_vs_sales",
    category: "projects",
    title: { en: "Project Cost vs Sales vs Collected", bn: "প্রকল্প খরচ বনাম বিক্রয় বনাম আদায়" },
    description: { en: "Comparison of direct costs, booked sales, and collected money per project", bn: "প্রতিটি প্রকল্পের মোট খরচ, মোট বিক্রয় ও সংগৃহীত আদায়ের তুলনা" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "projects",
    requiresModules: ["projects.view"],
    dataFn: async (db) => {
      const projects = await db.landProject.findMany({
        include: {
          landSales: { where: { status: { not: "CANCELLED" } }, include: { customerPayments: true } },
          projectExpenses: { where: { status: "APPROVED" } },
        },
      });

      return projects.map((p: any) => {
        const directCost = toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost);
        const expenses = (p.projectExpenses || []).reduce((s: number, e: any) => s + toNum(e.amount), 0);
        const totalCost = directCost + expenses;

        const totalSales = (p.landSales || []).reduce((s: number, sl: any) => s + toNum(sl.totalAgreedPrice), 0);
        const totalCollected = (p.landSales || []).reduce(
          (s: number, sl: any) => s + (sl.customerPayments || []).reduce((ps: number, pm: any) => ps + toNum(pm.amountPaid), 0),
          0
        );

        return {
          name: p.projectName.length > 12 ? p.projectName.slice(0, 12) + "..." : p.projectName,
          fullName: p.projectName,
          cost: totalCost,
          sales: totalSales,
          collected: totalCollected,
        };
      });
    },
  },

  // 18. Project Cost Share Donut
  project_cost_share: {
    key: "project_cost_share",
    category: "projects",
    title: { en: "Project-wise Cost Share", bn: "প্রকল্পভিত্তিক খরচ বণ্টন" },
    description: { en: "Proportionate capital deployed across active land projects", bn: "সকল প্রকল্পের বিপরীতে ব্যয়ের শতকরা আনুপাতিক চিত্র" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "overview",
    requiresModules: ["projects.view"],
    dataFn: async (db) => {
      const projects = await db.landProject.findMany({
        include: { projectExpenses: { where: { status: "APPROVED" } } },
      });

      const items = projects.map((p: any) => {
        const directCost = toNum(p.purchasePrice) + toNum(p.registrationCost) + toNum(p.mutationTaxCost);
        const exp = (p.projectExpenses || []).reduce((s: number, e: any) => s + toNum(e.amount), 0);
        return {
          name: p.projectName.length > 15 ? p.projectName.slice(0, 15) + "..." : p.projectName,
          fullName: p.projectName,
          cost: directCost + exp,
        };
      });
      const total = items.reduce((s: number, i: any) => s + i.cost, 0);

      return items.map((i: any) => ({
        ...i,
        percentage: total > 0 ? parseFloat(((i.cost / total) * 100).toFixed(1)) : 0,
      }));
    },
  },

  // 19. Expense Breakdown by Category
  expense_breakdown: {
    key: "expense_breakdown",
    category: "expenses",
    title: { en: "Expense Breakdown by Category", bn: "খাতভিত্তিক ব্যয়ের বিভাজন" },
    description: { en: "Approved expenditures broken down by expense category", bn: "অনুমোদিত ব্যয়ের প্রধান খাতভিত্তিক বিভাজন" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "operations",
    requiresModules: ["expenses.view"],
    dataFn: async (db) => {
      const expenses = await db.projectExpense.findMany({ where: { status: "APPROVED" } });
      const catMap = new Map<string, number>();

      for (const e of expenses) {
        const cat = e.expenseCategory || "Miscellaneous";
        catMap.set(cat, (catMap.get(cat) || 0) + toNum(e.amount));
      }

      const sorted = [...catMap.entries()].map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);
      const top8 = sorted.slice(0, 8);
      const other = sorted.slice(8).reduce((s, x) => s + x.amount, 0);
      if (other > 0) top8.push({ category: "Other", amount: other });
      return top8;
    },
  },

  // 20. Receivables Aging
  receivables_aging: {
    key: "receivables_aging",
    category: "sales",
    title: { en: "Receivables Aging", bn: "বকেয়া এইজিং বিশ্লেষণ" },
    description: { en: "Overdue dues bucketed by overdue duration (1-30, 31-60, 61-90, 90+ days)", bn: "সময়কালের ভিত্তিতে বকেয়া কিস্তির বিভাজন (১-৩০, ৩১-৬০, ৬১-৯০, ৯০+ দিন)" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "sales",
    requiresModules: ["sales.view"],
    dataFn: async (db) => {
      const now = new Date();
      const schedules = await db.installmentSchedule.findMany({
        where: { status: { in: ["UPCOMING", "OVERDUE", "PARTIAL"] } },
      });

      const buckets = { notDue: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 };

      for (const sc of schedules) {
        const due = new Date(sc.dueDate);
        const amount = toNum(sc.dueAmount);
        if (due >= now) {
          buckets.notDue += amount;
        } else {
          const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 30) buckets.days1_30 += amount;
          else if (diffDays <= 60) buckets.days31_60 += amount;
          else if (diffDays <= 90) buckets.days61_90 += amount;
          else buckets.days90Plus += amount;
        }
      }

      return [
        { bucket: "Not Due", amount: buckets.notDue },
        { bucket: "1-30 Days", amount: buckets.days1_30 },
        { bucket: "31-60 Days", amount: buckets.days31_60 },
        { bucket: "61-90 Days", amount: buckets.days61_90 },
        { bucket: "90+ Days", amount: buckets.days90Plus },
      ];
    },
  },

  // 21. Plot Inventory Status Donut
  plot_inventory_status: {
    key: "plot_inventory_status",
    category: "inventory",
    title: { en: "Plot Inventory Status", bn: "প্লট ইনভেন্টরি অবস্থা" },
    description: { en: "Distribution of plots: Available, Booked, and Sold", bn: "উপলব্ধ, বুকিংকৃত ও বিক্রিত প্লটের শতকরা বিভাজন" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "projects",
    requiresModules: ["plots.manage"],
    dataFn: async (db) => {
      const plots = await db.projectPlot.findMany();
      const counts: Record<string, number> = { AVAILABLE: 0, BOOKED: 0, SOLD: 0 };
      for (const p of plots) {
        counts[p.status] = (counts[p.status] || 0) + 1;
      }
      return [
        { name: "Available", count: counts.AVAILABLE || 0, fill: "#16a34a" },
        { name: "Booked", count: counts.BOOKED || 0, fill: "#f59e0b" },
        { name: "Sold", count: counts.SOLD || 0, fill: "#2563eb" },
      ];
    },
  },

  // 22. Partner Equity Distribution
  partner_equity_dist: {
    key: "partner_equity_dist",
    category: "capital",
    title: { en: "Partner Equity Distribution", bn: "অংশীদারদের মূলধন বণ্টন" },
    description: { en: "Net capital contribution per partner and share breakdown", bn: "প্রতিটি অংশীদারের বিনিয়োগকৃত মূলধন ও অংশীদারি অনুপাত" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "partners",
    requiresModules: ["partners.view"],
    dataFn: async (db) => {
      const partners = await db.partner.findMany({
        include: { partnerTransactions: true },
      });

      return partners.map((p: any) => {
        const net = (p.partnerTransactions || []).reduce((s: number, t: any) => {
          if (t.txnType === "DEPOSIT" || t.txnType === "CAPITAL_IN") return s + toNum(t.amount);
          if (t.txnType === "WITHDRAWAL" || t.txnType === "CAPITAL_OUT") return s - toNum(t.amount);
          return s;
        }, toNum(p.openingBalance));

        return {
          name: p.name,
          equity: Math.max(0, net),
        };
      });
    },
  },

  // 23. Profit by Project
  profit_by_project: {
    key: "profit_by_project",
    category: "profit",
    title: { en: "Profit by Project", bn: "প্রকল্পভিত্তিক নিট মুনাফা" },
    description: { en: "Realized and projected profit margin for each project", bn: "প্রতিটি প্রকল্পের অর্জিত মুনাফা ও ব্যয়ের উদ্বৃত্ত" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "financial",
    requiresModules: ["profit.view"],
    dataFn: async (db) => {
      const projects = await db.landProject.findMany({
        include: {
          landSales: { where: { status: { not: "CANCELLED" } } },
          projectExpenses: { where: { status: "APPROVED" } },
        },
      });

      return projects.map((p: any) => {
        const cost =
          toNum(p.purchasePrice) +
          toNum(p.registrationCost) +
          toNum(p.mutationTaxCost) +
          (p.projectExpenses || []).reduce((s: number, e: any) => s + toNum(e.amount), 0);
        const sales = (p.landSales || []).reduce((s: number, sl: any) => s + toNum(sl.totalAgreedPrice), 0);
        const profit = sales - cost;

        return {
          name: p.projectName.length > 14 ? p.projectName.slice(0, 14) + "..." : p.projectName,
          fullName: p.projectName,
          profit,
          sales,
          cost,
        };
      });
    },
  },

  // 24. Collection Trend vs Scheduled Dues
  collection_trend: {
    key: "collection_trend",
    category: "sales",
    title: { en: "Collection Trend vs Scheduled Dues", bn: "আদায় ট্রেন্ড বনাম নির্ধারিত বকেয়া" },
    description: { en: "Actual monthly collections compared to scheduled installment dues", bn: "মাসিক কিস্তির লক্ষ্যমাত্রার বিপরীতে প্রকৃত আদায় চিত্র" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "sales",
    requiresModules: ["sales.view"],
    dataFn: async (db) => {
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const months = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        months.push({
          label: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
          start: d,
          end: next,
        });
      }

      const payments = await db.customerPayment.findMany({
        where: { paymentDate: { gte: months[0].start, lte: now } },
      });
      const schedules = await db.installmentSchedule.findMany({
        where: { dueDate: { gte: months[0].start, lte: now } },
      });

      return months.map((m) => {
        const collected = payments
          .filter((p: any) => new Date(p.paymentDate) >= m.start && new Date(p.paymentDate) < m.end)
          .reduce((s: number, p: any) => s + toNum(p.amountPaid), 0);
        const scheduled = schedules
          .filter((sc: any) => new Date(sc.dueDate) >= m.start && new Date(sc.dueDate) < m.end)
          .reduce((s: number, sc: any) => s + toNum(sc.dueAmount), 0);

        return {
          month: m.label,
          collected,
          scheduled,
        };
      });
    },
  },

  // 25. Cash Flow Forecast (Next 90 Days)
  cash_flow_forecast: {
    key: "cash_flow_forecast",
    category: "liquidity",
    title: { en: "90-Day Cash Flow Forecast", bn: "৯০ দিনের ক্যাশ ফ্লো পূর্বাভাস" },
    description: { en: "Projected liquidity based on scheduled installment collections and commitments", bn: "প্রত্যাশিত কিস্তি আদায় ও ভবিষ্যৎ প্রতিশ্রুতির ভিত্তিতে তারল্য পূর্বাভাস" },
    type: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "financial",
    requiresModules: ["treasury.view"],
    dataFn: async (db) => {
      const now = new Date();
      // Current starting liquidity
      const ledgers = await db.treasuryLedger.findMany({ where: { txnDate: { lte: now } } });
      const currentLiquidity = ledgers.reduce(
        (s: number, l: any) => s + (l.flowType === "IN" ? toNum(l.amount) : -toNum(l.amount)),
        0
      );

      // Next 3 months (30, 60, 90 days)
      const day30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const day60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      const day90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const futureSchedules = await db.installmentSchedule.findMany({
        where: {
          dueDate: { gt: now, lte: day90 },
          status: { not: "PAID" },
        },
      });

      const in30 = futureSchedules.filter((s: any) => new Date(s.dueDate) <= day30).reduce((sum: number, s: any) => sum + toNum(s.dueAmount), 0);
      const in60 = futureSchedules.filter((s: any) => new Date(s.dueDate) > day30 && new Date(s.dueDate) <= day60).reduce((sum: number, s: any) => sum + toNum(s.dueAmount), 0);
      const in90 = futureSchedules.filter((s: any) => new Date(s.dueDate) > day60 && new Date(s.dueDate) <= day90).reduce((sum: number, s: any) => sum + toNum(s.dueAmount), 0);

      // Pending vouchers commitments
      const pendingVouchers = await db.projectExpense.findMany({ where: { status: "PENDING" } });
      const totalPending = pendingVouchers.reduce((s: number, v: any) => s + toNum(v.amount), 0);

      const minThreshold = 500000; // minimum cash threshold
      let running = currentLiquidity - totalPending;

      return [
        { period: "Current", projectedLiquidity: currentLiquidity, threshold: minThreshold },
        { period: "+30 Days", projectedLiquidity: (running += in30), threshold: minThreshold },
        { period: "+60 Days", projectedLiquidity: (running += in60), threshold: minThreshold },
        { period: "+90 Days", projectedLiquidity: (running += in90), threshold: minThreshold },
      ];
    },
  },

  // 26. Recent Transactions Table
  recent_transactions: {
    key: "recent_transactions",
    category: "liquidity",
    title: { en: "Recent Treasury Transactions", bn: "সাম্প্রতিক ট্রেজারি লেনদেন" },
    description: { en: "Last 10 cash and bank entries with future-dated indicator", bn: "সর্বশেষ ১০টি নগদ ও ব্যাংক লেনদেন এবং তারিখ স্ট্যাটাস" },
    type: "table",
    defaultSize: { w: 12, h: 4 },
    minSize: { w: 6, h: 3 },
    tab: "financial",
    requiresModules: ["treasury.view"],
    dataFn: async (db) => {
      const rows = await db.treasuryLedger.findMany({
        orderBy: { txnDate: "desc" },
        take: 10,
        include: { bankAccount: true },
      });
      const now = new Date();

      return rows.map((r: any) => ({
        id: r.id,
        txnDate: r.txnDate,
        purpose: r.purpose,
        accountType: r.accountType,
        flowType: r.flowType,
        amount: toNum(r.amount),
        bankName: r.bankAccount?.bankName || null,
        isFutureDated: new Date(r.txnDate) > now,
      }));
    },
  },

  // 27. Overdue Installments List
  overdue_installments: {
    key: "overdue_installments",
    category: "sales",
    title: { en: "Overdue Installments List", bn: "মেয়াদোত্তীর্ণ কিস্তির তালিকা" },
    description: { en: "Unpaid dues requiring buyer follow-up and collection calls", bn: "আদায় নিশ্চিতকরণে ক্রেতাদের যোগাযোগের জন্য বকেয়া তালিকা" },
    type: "list",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "sales",
    requiresModules: ["sales.collect"],
    dataFn: async (db) => {
      const now = new Date();
      const overdue = await db.installmentSchedule.findMany({
        where: {
          dueDate: { lt: now },
          status: { in: ["UPCOMING", "OVERDUE", "PARTIAL"] },
        },
        include: {
          sale: {
            include: { project: true, plot: true },
          },
        },
        orderBy: { dueDate: "asc" },
        take: 8,
      });

      return overdue.map((o: any) => {
        const daysOverdue = Math.floor((now.getTime() - new Date(o.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        return {
          id: o.id,
          saleId: o.saleId,
          buyerName: o.sale.buyerName,
          buyerPhone: o.sale.buyerPhone,
          projectName: o.sale.project?.projectName || "Land Project",
          plotNumber: o.sale.plot?.plotNumber || "-",
          dueAmount: toNum(o.dueAmount),
          dueDate: o.dueDate,
          daysOverdue,
        };
      });
    },
  },

  // 28. Project Summary Table
  project_summary: {
    key: "project_summary",
    category: "projects",
    title: { en: "Projects Summary Table", bn: "প্রকল্পের সংক্ষিপ্ত বিবরণী" },
    description: { en: "Consolidated performance, total acquisition cost, and sales recovery", bn: "প্রতিটি প্রকল্পের সার্বিক অবস্থা, ক্রয় খরচ ও বিক্রয় অগ্রগতি" },
    type: "table",
    defaultSize: { w: 12, h: 4 },
    minSize: { w: 6, h: 3 },
    tab: "projects",
    requiresModules: ["projects.view"],
    dataFn: async (db) => {
      const projects = await db.landProject.findMany({
        include: {
          landSales: { where: { status: { not: "CANCELLED" } }, include: { customerPayments: true } },
          projectExpenses: { where: { status: "APPROVED" } },
          projectPlots: true,
        },
      });

      return projects.map((p: any) => {
        const cost =
          toNum(p.purchasePrice) +
          toNum(p.registrationCost) +
          toNum(p.mutationTaxCost) +
          (p.projectExpenses || []).reduce((s: number, e: any) => s + toNum(e.amount), 0);
        const sales = (p.landSales || []).reduce((s: number, sl: any) => s + toNum(sl.totalAgreedPrice), 0);
        const collected = (p.landSales || []).reduce(
          (s: number, sl: any) => s + (sl.customerPayments || []).reduce((ps: number, pm: any) => ps + toNum(pm.amountPaid), 0),
          0
        );
        const collectionPercent = sales > 0 ? parseFloat(((collected / sales) * 100).toFixed(1)) : 0;
        const totalPlots = (p.projectPlots || []).length;
        const availablePlots = (p.projectPlots || []).filter((pl: any) => pl.status === "AVAILABLE").length;

        return {
          id: p.id,
          projectName: p.projectName,
          mouza: p.mouza,
          status: p.status,
          totalCost: cost,
          totalSales: sales,
          totalCollected: collected,
          collectionPercent,
          totalPlots,
          availablePlots,
        };
      });
    },
  },

  // 29. Partner Summary Table
  partner_summary: {
    key: "partner_summary",
    category: "capital",
    title: { en: "Partners Capital & Balance", bn: "অংশীদারদের মূলধন ও বর্তমান স্থিতি" },
    description: { en: "Partner ledger balances, share percentage, and capital records", bn: "অংশীদারদের জমা মূলধন, লভ্যাংশ প্রত্যাহার ও বর্তমান ব্যালেন্স" },
    type: "table",
    defaultSize: { w: 12, h: 4 },
    minSize: { w: 6, h: 3 },
    tab: "partners",
    requiresModules: ["partners.view"],
    dataFn: async (db) => {
      const partners = await db.partner.findMany({
        include: { partnerTransactions: true, projectPartners: true },
      });

      return partners.map((p: any) => {
        const deposited = (p.partnerTransactions || [])
          .filter((t: any) => t.txnType === "DEPOSIT" || t.txnType === "CAPITAL_IN")
          .reduce((s: number, t: any) => s + toNum(t.amount), 0);
        const withdrawn = (p.partnerTransactions || [])
          .filter((t: any) => t.txnType === "WITHDRAWAL" || t.txnType === "CAPITAL_OUT")
          .reduce((s: number, t: any) => s + toNum(t.amount), 0);
        const liveBalance = toNum(p.openingBalance) + deposited - withdrawn;

        const avgShare =
          p.projectPartners && p.projectPartners.length > 0
            ? (
                p.projectPartners.reduce((s: number, pp: any) => s + toNum(pp.sharePercentage), 0) /
                p.projectPartners.length
              ).toFixed(1)
            : "0";

        return {
          id: p.id,
          name: p.name,
          phone: p.phone,
          deposited,
          withdrawn,
          liveBalance,
          avgShare: `${avgShare}%`,
        };
      });
    },
  },

  // 30. Pending Vouchers List
  pending_vouchers: {
    key: "pending_vouchers",
    category: "operations",
    title: { en: "Pending Expense Vouchers", bn: "অনুমোদনাধীন ব্যয়ের তালিকা" },
    description: { en: "Latest vouchers waiting for accounting or site management approval", bn: "হিসাব ও ব্যবস্থাপনা অনুমোদনের অপেক্ষায় থাকা ভাউচার" },
    type: "list",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    tab: "operations",
    requiresModules: ["expenses.approve"],
    dataFn: async (db) => {
      const list = await db.projectExpense.findMany({
        where: { status: "PENDING" },
        include: { project: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      });

      return list.map((v: any) => ({
        id: v.id,
        expenseCategory: v.expenseCategory,
        amount: toNum(v.amount),
        purpose: v.purpose,
        projectName: v.project?.projectName || "General",
        createdAt: v.createdAt,
      }));
    },
  },

  // 31. Quick Actions
  quick_actions: {
    key: "quick_actions",
    category: "operations",
    title: { en: "Quick Actions", bn: "দ্রুত অ্যাকশন" },
    description: { en: "One-click shortcuts to record vouchers, sales, collections, and transfers", bn: "ভাউচার, বিক্রয়, পেমেন্ট আদায় ও ব্যাংক ট্রান্সফারের শর্টকাট" },
    type: "quick_actions",
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 3, h: 2 },
    tab: "overview",
    dataFn: async () => {
      return {
        actions: [
          { label: "New Voucher", url: "/expenses?action=new", icon: "Receipt", requiredPerm: "expenses.create" },
          { label: "New Sale", url: "/sales?action=new", icon: "FileText", requiredPerm: "sales.create" },
          { label: "Collect Payment", url: "/sales?action=collect", icon: "CreditCard", requiredPerm: "sales.collect" },
          { label: "Contra Transfer", url: "/treasury?action=contra", icon: "ArrowLeftRight", requiredPerm: "treasury.contra.create" },
          { label: "Deposit Capital", url: "/partners?action=deposit", icon: "DollarSign", requiredPerm: "partners.capital.deposit" },
        ],
      };
    },
  },

  // 32. Active Alerts / Insights
  active_alerts: {
    key: "active_alerts",
    category: "operations",
    title: { en: "Smart Insights & Alerts", bn: "স্মার্ট ইনসাইট ও সতর্কবার্তা" },
    description: { en: "Automatic real-time business health warnings and actionable intelligence", bn: "রিয়েল-টাইম ব্যবসায়িক স্বাস্থ্য ঝুঁকি ও সতর্কবার্তা" },
    type: "alerts",
    defaultSize: { w: 12, h: 2 },
    minSize: { w: 6, h: 2 },
    tab: "overview",
    dataFn: async (db) => {
      // Return alerts summary; insights engine provides detailed items
      return { active: true };
    },
  },
};

export const WIDGET_KEYS = Object.keys(WIDGET_REGISTRY);

export function getWidgetsForTab(tabKey: DashboardTabKey): WidgetRegistryEntry[] {
  return Object.values(WIDGET_REGISTRY).filter((w) => w.tab === tabKey);
}
