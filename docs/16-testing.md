# 16. Testing

**Purpose:** Documents all automated test suites, how to run them, what they cover, and remaining coverage gaps.  
**Intended Reader:** QA Engineer, New Developer, Technical Lead.  
**Last Verified:** 2026-11-12

---

## Test Suites & Commands

| Script | Command | What It Tests | Latest Observed Result |
|---|---|---|---|
| **TypeScript Check** | `npm run typecheck` | Full strict TypeScript compilation (`tsc --noEmit`). | Pass (exit 0) |
| **Acceptance Suite** | `npm run acceptance` | 92 checks across C1 (MySQL/Redis/Next), C2 (Expenses, Sales, FIFO installments, Contra, PnL, CSV/PDF), C3 (Audit trail completeness & Paid-by-Partner isolation), C4 (RBAC across 4 roles). | **92/92 passed** |
| **Fiscal Year TDD** | `npm run test:fy` | 5 E2E tests (`node:test`) covering unauth 401, RBAC, date/duplicate/delete validation, MySQL + audit persistence, and `preset=this_fy` integration across Reports UI + Export API. | **5/5 passed** |
| **Full Project E2E** | `npm run test:all` | 8 E2E suites (`node:test`) covering Login, all 29+ pages, core read APIs, Contra, Expenses/Vouchers, Multi-plot & Full-payment Sales + Overpayment guards, Reports catalog, and all 26 Reports + PnL exports. | **8/8 passed** |
| **i18n Key Check** | `npm run test:i18n` | Verifies English/Bengali translation key parity (`scripts/test_translation_keys.mjs`). | Available |
| **RBAC Smoke** | `npm run rbac:smoke` | Quick RBAC smoke checks (`scripts/rbac_smoke.mjs`). | Available |

---

## Coverage Gaps

1. **Headless Browser UI Tests:** Current E2E suites test HTTP/HTML/API/DB layers via `fetch` + `mysql2`; there is no Playwright/Cypress DOM click-through suite for client-only modal interactions.
2. **Plot Hold Expiry & Land Acquisition Wizard:** Multi-step wizard edge cases (e.g., partner share != 100% UI validation) rely primarily on manual/UI checks rather than automated unit tests.
3. **Production Load / Concurrency Testing:** No stress test for concurrent multi-tenant `PrismaClient` connection pooling.
`;
writeDoc("16-testing.md", ...)`
