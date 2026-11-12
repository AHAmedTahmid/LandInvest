# 08. Business Rules Register

**Purpose:** Numbered register of all enforced business rules, why they exist, where they are enforced in code, and which tests verify them.  
**Intended Reader:** Technical Lead, QA Engineer, Business Analyst, New Developer.  
**Last Verified:** 2026-11-12

---

| # | Rule Statement | Why It Exists | Enforced In | Verified By |
|---|---|---|---|---|
| **BR-01** | **Paid-by-Partner expenses never touch `treasury_ledger`** | Partner-paid expenses do not leave company cash or bank; they credit the partner's ledger (`DIRECT_EXPENSE`) instead. | `src/lib/tenantRules.ts` (`isPaidByPartner`), `src/app/api/expenses/[id]/approve/route.ts` | `scripts/acceptance.mjs` (C3 `leaked=0`) |
| **BR-02** | **Only `APPROVED` expenses count toward project cost & PnL** | Pending or rejected vouchers must not distort financial statements or profit calculations. | `src/lib/reports/project-cost.ts`, `src/lib/reports/project-pnl.ts`, `src/app/api/reports/pnl/route.ts` | `scripts/acceptance.mjs` (C2 PnL) |
| **BR-03** | **Partner ownership shares per project must total 100%** | Prevents unallocated or >100% profit distribution splits. | `src/app/projects/actions.ts`, `src/app/projects/new/page.tsx` | Manual / UI validation |
| **BR-04** | **Plot sizes cannot exceed saleable land area** | Prevents overselling subdivided Shotok beyond the acquired project area. | `src/app/projects/[id]/` plot creation actions | UI / Server Action validation |
| **BR-05** | **Sold/Booked plots are locked from resale** | Prevents double-selling an already booked or sold plot. | `src/lib/tenantRules.ts` (`sellPlot`), `src/app/api/sales/route.ts` | `scripts/acceptance.mjs` (C2) |
| **BR-06** | **Advance payment cannot exceed total agreed price** | Prevents negative due balances on sale creation. | `src/app/api/sales/route.ts` (`advance > totalPrice`) | `scripts/test_full_project.mjs` (Test 6a) |
| **BR-07** | **Installment collection cannot exceed `currentDueAmount`** | Prevents overpaying a sale contract beyond remaining receivable. | `src/lib/collections.ts` (`collectPayment`) | `scripts/test_full_project.mjs` (Test 6c) |
| **BR-08** | **Installments settle FIFO (oldest due date first)** | Standardizes installment tracking when partial or lump-sum payments arrive. | `src/lib/collections.ts` (`collectPayment`) | `scripts/acceptance.mjs` (C2 FIFO) |
| **BR-09** | **Full payment flips sale to `PAID_IN_FULL` and plots to `SOLD`** | Keeps inventory and contract status synchronized upon settlement (upfront or final installment). | `src/lib/collections.ts`, `src/app/api/sales/route.ts` | `scripts/test_full_project.mjs` (Test 6e) |
| **BR-10** | **Every financial & settings write emits an `audit_log` row with actor ID** | Guarantees full traceability of who created, approved, or modified any record. | `src/lib/tenantRules.ts` (`writeAudit`), `src/lib/fiscalYear.ts` | `scripts/acceptance.mjs` (C3) |
| **BR-11** | **Cash & Bank balances are ledger-derived** | `treasury_ledger` is the single source of truth; `bank_accounts.current_balance` is updated atomically inside `$transaction`. | `src/lib/treasury.ts`, `src/lib/collections.ts` | `scripts/acceptance.mjs` (C2/C3) |
| **BR-12** | **Area conversions use Shotok as base unit** | Avoids floating-point drift across Shotok, Katha, and Bigha inputs. | `src/lib/area.ts` | Unit helpers |
| **BR-13** | **Non-approver contra transfers require approval** | Accountants can queue Cash ↔ Bank transfers, but only approvers (`treasury.contra.approve`) can post to `treasury_ledger`. | `src/lib/treasury.ts` (`createContra`), `src/app/api/treasury/contra/[id]/approve/route.ts` | `scripts/acceptance.mjs` (C2), `scripts/test_full_project.mjs` (Test 4) |
| **BR-14** | **Owner role cannot be edited/deleted; current active FY cannot be deleted** | Prevents system lockout and ensures an active reporting FY always exists. | `src/app/api/roles/[id]/route.ts`, `src/lib/fiscalYear.ts` | `scripts/test_fiscal_years.mjs` (Test 3) |
`;
writeDoc("08-business-rules.md", ...)`
