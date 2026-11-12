# 10. Reports & Dashboard

**Purpose:** Complete catalog of all 26 built-in reports, 6 dashboard tabs, and undefined dashboard widgets, plus formatting conventions.  
**Intended Reader:** Product Owner, Accountant, Frontend/Backend Developers.  
**Last Verified:** 2026-11-12

---

## Number, Currency & Fiscal Year Conventions

- **Currency:** Bangladeshi Taka (`৳`), formatted with `formatBDT()` in `src/lib/format.ts` using `en-IN` locale for **lakh** (1,00,000) and **crore** (1,00,00,000) grouping.
- **Bengali Numerals:** `toBnNum()` converts digits `0-9` to `০-৯` when `lang === "bn"`.
- **Fiscal Year:** Standard Bangladesh Fiscal Year runs **July 1 – June 30**, dynamically configurable per tenant via `/settings/fiscal-years` (`dashboard_settings` key `fiscal_years`). Reports with `preset=this_fy` read the active tenant FY in both the UI page (`src/app/reports/[key]/page.tsx`) and export API (`src/app/api/reports/[key]/route.ts`).
- **Exports:** Every report supports **PDF** (via Puppeteer HTML-to-PDF) and **Excel** (`.xls` HTML table) at `/api/reports/[key]?format=pdf|excel`.

---

## Report Catalog (26 Reports in `src/lib/reports/registry.ts`)

| Key | Title (EN) | Title (BN) | Category | Required Permission | Filters |
|---|---|---|---|---|---|
| `balance-sheet` | Balance Sheet | উদ্বৃত্তপত্র / ব্যালেন্স শিট | financial | `reports.financial.view` | dateRange, project |
| `cash-book` | Cash Book | নগদ খাতা | financial | `reports.financial.view` | dateRange |
| `bank-book` | Bank Book | ব্যাংক খাতা | financial | `reports.financial.view` | dateRange, bankAccount |
| `daily-summary` | Daily Collection & Payment Summary | দৈনিক আদায় ও পরিশোধ সারাংশ | financial | `reports.financial.view` | dateRange |
| `receipts-payments` | Receipts & Payments Statement | আদায় ও পরিশোধ বিবরণী | financial | `reports.financial.view` | dateRange |
| `contra-register` | Contra / Fund Transfer Register | কন্ট্রা / তহবিল স্থানান্তর নিবন্ধন | financial | `reports.financial.view` | dateRange |
| `partner-capital` | Partner Capital Statement | অংশীদার মূলধন বিবরণী | partners | `reports.partners.view` | dateRange, partner |
| `partners-summary` | All Partners Summary | সকল অংশীদার সারাংশ | partners | `reports.partners.view` | None |
| `partner-contribution` | Partner Contribution by Project | প্রকল্পভিত্তিক অংশীদার অবদান | partners | `reports.partners.view` | project |
| `project-cost` | Project Cost Statement | প্রকল্প খরচ বিবরণী | projects | `reports.projects.view` | project |
| `project-pnl` | Project Profit & Loss | প্রকল্প লাভ-ক্ষতি | projects | `reports.projects.view` | project |
| `projects-comparison` | All Projects Comparison | সকল প্রকল্প তুলনা | projects | `reports.projects.view` | None |
| `expense-register` | Expense Register | ব্যয় নিবন্ধন | projects | `reports.projects.view` | dateRange, project, status |
| `pending-approval` | Pending Approval Report | অনুমোদনের অপেক্ষায় প্রতিবেদন | projects | `reports.projects.view` | project |
| `land-documents` | Land Document Register | জমি দলিল নিবন্ধন | projects | `reports.projects.view` | None |
| `sales-register` | Sales Register | বিক্রয় নিবন্ধন | sales | `reports.sales.view` | dateRange, project, status |
| `plot-inventory` | Plot Inventory / Stock Report | প্লট তালিকা / স্টক প্রতিবেদন | sales | `reports.sales.view` | project |
| `buyer-statement` | Buyer Statement | ক্রেতা বিবরণী | sales | `reports.sales.view` | sale |
| `receivables-aging` | Receivables Aging | বকেয়া বয়সভিত্তিক প্রতিবেদন | sales | `reports.sales.view` | dateRange, project |
| `installment-report` | Installment Due & Overdue Report | কিস্তি বকেয়া ও মেয়াদোত্তীর্ণ প্রতিবেদন | sales | `reports.sales.view` | dateRange |
| `collection-report` | Collection Report | আদায় প্রতিবেদন | sales | `reports.sales.view` | dateRange, project |
| `profit-allocation` | Profit Allocation Sheet | লাভ বণ্টন চার্ট | profit | `reports.financial.view` | project |
| `profit-history` | Profit Distribution History | লাভ বণ্টন ইতিহাস | profit | `reports.financial.view` | dateRange, project |
| `audit-trail` | Audit Trail Report | অডিট ট্রেইল প্রতিবেদন | audit | `reports.audit.view` | dateRange, user, table, action |
| `user-activity` | User Activity Report | ব্যবহারকারী কার্যকলাপ প্রতিবেদন | audit | `reports.audit.view` | dateRange, user |
| `reconciliation` | Reconciliation Check | মিলান পরীক্ষা | audit | `reports.audit.view` | None |

---

## Dashboard Tabs (6 Tabs)

| Tab Key | Title (EN) | Title (BN) | Required Permission |
|---|---|---|---|
| `overview` | Executive Overview | এক্সিকিউটিভ ওভারভিউ | `dashboard.tab.overview` |
| `financial` | Treasury & Financials | ট্রেজারি ও আর্থিক অবস্থা | `dashboard.tab.financial` |
| `projects` | Projects & Land | প্রকল্প ও জমি | `dashboard.tab.projects` |
| `sales` | Sales & Collections | বিক্রয় ও আদায় | `dashboard.tab.sales` |
| `partners` | Partners & Capital | অংশীদার ও মূলধন | `dashboard.tab.partners` |
| `operations` | Operations & Approvals | অপারেশনস ও অনুমোদন | `dashboard.tab.operations` |

---

## Dashboard Widget Registry (32 Widgets in `src/lib/dashboard/widgets.ts`)

| Widget Key | Title (EN) | Tab | Type | Required Permission |
|---|---|---|---|---|
| `cash_balance` | Cash in Hand | overview | kpi | `dashboard.widget.cash_balance` |
| `bank_balance` | Total Bank Balance | overview | kpi | `dashboard.widget.bank_balance` |
| `total_liquidity` | Total Liquidity | overview | kpi | `dashboard.widget.total_liquidity` |
| `working_capital` | Available Working Capital | financial | kpi | `dashboard.widget.working_capital` |
| `partner_equity` | Partner Equity Injected | partners | kpi | `dashboard.widget.partner_equity` |
| `capital_deployed` | Capital Deployed in Land | projects | kpi | `dashboard.widget.capital_deployed` |
| `unsold_inventory` | Unsold Inventory Value | projects | kpi | `dashboard.widget.unsold_inventory` |
| `total_receivables` | Total Receivables | sales | kpi | `dashboard.widget.total_receivables` |
| `overdue_receivables` | Overdue Receivables | sales | kpi | `dashboard.widget.overdue_receivables` |
| `sales_month` | Sales This Month | overview | kpi | `dashboard.widget.sales_month` |
| `collections_month` | Collections This Month | sales | kpi | `dashboard.widget.collections_month` |
| `expenses_month` | Expenses This Month | operations | kpi | `dashboard.widget.expenses_month` |
| `pending_approvals` | Pending Approvals | operations | kpi | `dashboard.widget.pending_approvals` |
| `net_profit` | Net Profit & Realized Cash | overview | kpi | `dashboard.widget.net_profit` |
| `portfolio_roi` | Portfolio ROI % | projects | kpi | `dashboard.widget.portfolio_roi` |
| `cash_flow_trend` | 12-Month Cash Flow Trend | financial | chart | `dashboard.widget.cash_flow_trend` |
| `project_cost_vs_sales` | Project Cost vs Sales vs Collected | projects | chart | `dashboard.widget.project_cost_vs_sales` |
| `project_cost_share` | Project-wise Cost Share | overview | chart | `dashboard.widget.project_cost_share` |
| `expense_breakdown` | Expense Breakdown by Category | operations | chart | `dashboard.widget.expense_breakdown` |
| `receivables_aging` | Receivables Aging | sales | chart | `dashboard.widget.receivables_aging` |
| `plot_inventory_status` | Plot Inventory Status | projects | chart | `dashboard.widget.plot_inventory_status` |
| `partner_equity_dist` | Partner Equity Distribution | partners | chart | `dashboard.widget.partner_equity_dist` |
| `profit_by_project` | Profit by Project | financial | chart | `dashboard.widget.profit_by_project` |
| `collection_trend` | Collection Trend vs Scheduled Dues | sales | chart | `dashboard.widget.collection_trend` |
| `cash_flow_forecast` | 90-Day Cash Flow Forecast | financial | chart | `dashboard.widget.cash_flow_forecast` |
| `recent_transactions` | Recent Treasury Transactions | financial | table | `dashboard.widget.recent_transactions` |
| `overdue_installments` | Overdue Installments List | sales | list | `dashboard.widget.overdue_installments` |
| `project_summary` | Projects Summary Table | projects | table | `dashboard.widget.project_summary` |
| `partner_summary` | Partners Capital & Balance | partners | table | `dashboard.widget.partner_summary` |
| `pending_vouchers` | Pending Expense Vouchers | operations | list | `dashboard.widget.pending_vouchers` |
| `quick_actions` | Quick Actions | overview | quick_actions | `dashboard.widget.quick_actions` |
| `active_alerts` | Smart Insights & Alerts | overview | alerts | `dashboard.widget.active_alerts` |
