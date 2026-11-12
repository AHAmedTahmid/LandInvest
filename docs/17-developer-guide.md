# 17. Developer Guide

**Purpose:** Coding conventions, core helper patterns, and step-by-step recipes for extending LandInvest safely.  
**Intended Reader:** New Developer, Maintainer.  
**Last Verified:** 2026-11-12

---

## Core Coding Patterns

1. **Tenant DB Access:** Always call `const prisma: any = await getTenantClientFromSession();` inside authenticated API routes and Server Components — never accept a tenant DB name or ID from client input.
2. **Permission Checks:** Always check `if (!(await can(session, "<permission.key>")))` on both the UI page (rendering `Forbidden: <key>`) and the mutating API/Server Action (`403`).
3. **Atomic Financial Writes + Audit:** Wrap all multi-table financial writes in `prisma.$transaction(async (tx) => { ... })` and call `await writeAudit(tx, tableName, recordId, action, userId, oldVal, newVal)`.
4. **Decimal Math & Formatting:** Use `toNum()` when reading Prisma `Decimal` fields and `formatBDT()` / `formatCompactBDT()` from `src/lib/format.ts` for display.

---

## Step-by-Step Extension Recipes

| Task | Files to Touch | Notes |
|---|---|---|
| **Add a New Permission** | `src/lib/permissions.ts`, `src/lib/seedRoles.ts` | Add key to `BasePermissionKey` & `PERMISSIONS`; assign to appropriate default roles; run `npm run seed:roles`. |
| **Add a New Report** | `src/lib/reports/<key>.ts`, `src/lib/reports/index.ts`, `src/lib/reports/registry.ts` | Export `query<Name>(prisma, filters)` returning `ReportData`, register in `REPORT_QUERIES` and `REPORT_REGISTRY`. |
| **Add a Dashboard Widget** | `src/lib/dashboard/widgets.ts`, `src/lib/permissions.ts`, `src/lib/dashboard/` | Register widget key, tab, type, and query function; permission `dashboard.widget.<key>` is auto-derived. |
| **Add a Table or Column** | `prisma/tenant/schema.prisma`, `src/worker.ts` | Update Prisma schema, run `npx prisma generate --schema=prisma/tenant/schema.prisma`, push to all existing tenant DBs (`14-deployment-and-operations.md`). |
| **Add a Language Label (EN/BN)** | `src/lib/i18n.tsx` | Add `{ en: "...", bn: "..." }` to `DICT` and verify with `npm run test:i18n`. |
| **Add a Fiscal Year / Setting** | `src/lib/fiscalYear.ts` (or `dashboard_settings`) | Store under a unique `settingKey` in `dashboard_settings` with `writeAudit()`. |
`;
writeDoc("17-developer-guide.md", ...)`
