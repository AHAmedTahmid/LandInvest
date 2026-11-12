# 15. Security

**Purpose:** Documents tenant isolation, authentication/session security, RBAC, PII handling, audit trail coverage, and remaining security risks.  
**Intended Reader:** Security Auditor, Technical Lead, Business Owner.  
**Last Verified:** 2026-11-12

---

## 1. Tenant Isolation
- **Physical Isolation:** Every customer organization has its own MySQL schema (`tenant_<slug>`).
- **Session-Derived Resolution:** `getTenantClientFromSession()` (`src/lib/tenant.ts`) reads `tenantId` exclusively from the signed Auth.js JWT (`getServerSession`), never from a request query/body parameter.
- **Live Suspension Check:** `src/auth.ts` re-queries `control_plane.global_users.isActive` and `tenants.status` on every session check (fail-closed if DB unreachable or user/tenant deactivated).

## 2. Role-Based Access Control (RBAC)
- Every API route and sensitive RSC page calls `can(session, "<permission.key>")` (`src/lib/rbac.ts`).
- `Owner` (`isOwner: true`) bypasses permission checks; all other roles are checked against `tenant.user_roles` -> `role_permissions`.
- Verified across 4 roles (`owner@demo.com`, `admin@demo.com`, `site@demo.com`, `acct@demo.com`) by `scripts/acceptance.mjs` (Phase C4).

## 3. Audit Trail Coverage
- `writeAudit()` (`src/lib/tenantRules.ts`) logs `table_name`, `record_id`, `action`, `changed_by`, `old_values`, and `new_values` into `audit_log`.
- Verified by `scripts/acceptance.mjs` (Phase C3): 100% of `project_expenses`, `treasury_ledger`, `land_sales`, `customer_payments`, and `profit_distributions` rows have matching `audit_log` entries with non-null `changed_by`.

## 4. Personal Data (PII) & File Uploads
- **PII Stored:** Buyer `buyer_name`, `buyer_phone`, `buyer_nid` (`land_sales`), Partner `phone`, `nid_number`, `bank_account_number` (`partners`), and User `email` (`global_users`).
- **File Uploads:** Expense vouchers uploaded via `POST /api/expenses` are saved via `src/lib/storage.ts` with UUID prefixes (`vouchers/${randomUUID()}-${file.name}`).

## 5. Candid List of Remaining Risks

1. **Hardcoded Local MySQL Credentials in `tenant.ts` / `worker.ts`:** `src/lib/tenant.ts` currently constructs `mysql://${tenant.dbUser}:@localhost:3306/${tenant.dbName}` (empty password) and `src/worker.ts` uses `{ host: "localhost", user: "root", password: "" }`. Must be parameterized via encrypted credentials / env vars for production.
2. **File Upload Validation:** `POST /api/expenses` saves uploaded voucher files without strict MIME-type/magic-byte or file-size allowlist checks.
3. **17 `npm audit` Vulnerabilities:** `npm audit` reports 1 critical, 9 high, and 7 moderate advisories across the dependency tree (`03-tech-stack.md`).
4. **Stubbed Billing & Password Reset Delivery:** Billing payment (`POST /api/billing/pay`) has no cryptographic webhook verification because no live gateway is wired yet.
`;
writeDoc("15-security.md", ...)`
