# LandInvest Handover Documentation

**Purpose:** Master index and reading guide for the complete LandInvest ERP handover documentation.  
**Intended Reader:** Non-technical Owner, Technical Lead, New Developer, Maintainer.  
**Document Version:** 1.0.0  
**Last Verified:** 2026-11-12

---

## How to Read These Docs

- **For Business Owners & Non-Technical Readers:** Start with [01-executive-summary.md](./01-executive-summary.md), [06-workflows.md](./06-workflows.md), and [20-glossary.md](./20-glossary.md).
- **For Technical Leads & Architects:** Read [02-architecture.md](./02-architecture.md), [04a-overview.md](./04-database/04a-overview.md), [15-security.md](./15-security.md), and [18-decision-log.md](./18-decision-log.md).
- **For New Developers & Maintainers:** Start with [13-setup-and-run-guide.md](./13-setup-and-run-guide.md), [17-developer-guide.md](./17-developer-guide.md), [04c-tenant-tables.md](./04-database/04c-tenant-tables.md), and [09-api-and-actions.md](./09-api-and-actions.md).

---

## Complete Document Index

| # | Document | Focus |
|---|---|---|
| 00 | [00-README.md](./00-README.md) | Index, reading guide, verification notes |
| 01 | [01-executive-summary.md](./01-executive-summary.md) | Plain-English product overview, status, risks |
| 02 | [02-architecture.md](./02-architecture.md) | Multi-tenant design, request lifecycle, caching |
| 03 | [03-tech-stack.md](./03-tech-stack.md) | Languages, frameworks, exact versions, `npm audit` |
| 04a | [04-database/04a-overview.md](./04-database/04a-overview.md) | DB totals, schema diff, money flow, conventions |
| 04b | [04-database/04b-control-plane-tables.md](./04-database/04b-control-plane-tables.md) | `control_plane` data dictionary (7 tables) |
| 04c | [04-database/04c-tenant-tables.md](./04-database/04c-tenant-tables.md) | Tenant DB data dictionary (19 tables) |
| 04d | [04-database/04d-erd.md](./04-database/04d-erd.md) | Control plane, tenant overview, and module ERDs |
| 04e | [04-database/04e-indexes-and-constraints.md](./04-database/04e-indexes-and-constraints.md) | Foreign keys, logical links, indexes |
| 05 | [05-modules/](./05-modules/01-auth-and-tenants.md) | 14 individual module specifications |
| 06 | [06-workflows.md](./06-workflows.md) | 14 end-to-end workflows & state machines |
| 07 | [07-auth-roles-permissions.md](./07-auth-roles-permissions.md) | Auth, sessions, 79 permission keys, role matrix |
| 08 | [08-business-rules.md](./08-business-rules.md) | Numbered register of enforced business rules |
| 09 | [09-api-and-actions.md](./09-api-and-actions.md) | 39 APIs, 11 server action files, 37 pages |
| 10 | [10-reports-and-dashboard.md](./10-reports-and-dashboard.md) | 26 reports, 6 dashboard tabs, widget registry |
| 11 | [11-background-jobs.md](./11-background-jobs.md) | BullMQ worker, provisioning, scheduled jobs |
| 12 | [12-configuration-and-environment.md](./12-configuration-and-environment.md) | Environment variables, settings tables, flags |
| 13 | [13-setup-and-run-guide.md](./13-setup-and-run-guide.md) | Clean setup steps & real troubleshooting |
| 14 | [14-deployment-and-operations.md](./14-deployment-and-operations.md) | Production deployment, backups, multi-tenant migrations |
| 15 | [15-security.md](./15-security.md) | Tenant isolation, RBAC, PII, audit trail, risks |
| 16 | [16-testing.md](./16-testing.md) | Acceptance, FY, full E2E, i18n, and coverage gaps |
| 17 | [17-developer-guide.md](./17-developer-guide.md) | Patterns, conventions, step-by-step recipes |
| 18 | [18-decision-log.md](./18-decision-log.md) | Architectural & domain decisions with trade-offs |
| 19 | [19-known-issues-and-roadmap.md](./19-known-issues-and-roadmap.md) | Stubs, tech debt, risks, prioritized next steps |
| 20 | [20-glossary.md](./20-glossary.md) | English & Bengali business and technical terms |
| — | [PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md) | Single combined document for offline reading & PDF |

---

## Regenerating Factual Sections

Run the following command whenever the database schema, routes, dependencies, or registries change:

```bash
npm run docs:generate
```

This executes `docs/_generated/extract_facts.mjs` (introspecting `control_plane` and `tenant_demo` plus TypeScript registries) and `docs/_generated/render_factual_docs.mjs`.

---

## `UNVERIFIED:` and `Inferred reason:` Register

For strict accuracy, all items not directly proven by code comments or commit messages are listed below:

1. **`Inferred reason:` Database-per-tenant architecture** (`02-architecture.md`, `18-decision-log.md`): Chosen to provide hard physical isolation between competing land syndicates and simplify per-tenant backup/restore, at the cost of multi-DB migration complexity.
2. **`Inferred reason:` Native Windows MySQL + Redis instead of Docker** (`13-setup-and-run-guide.md`, `18-decision-log.md`): Observed in `src/worker.ts` error messages (`net start MySQL84`, `Memurai/redis-windows 6.2+`) and `package.json` (`next dev --webpack`), indicating a native Windows developer environment without Docker Desktop.
3. **`Inferred reason:` Stubbed Billing module** (`01-executive-summary.md`, `19-known-issues-and-roadmap.md`): `src/app/api/billing/pay/route.ts` and `billing_invoices` exist to model SaaS subscriptions without live bKash/SSLCommerz/Stripe gateway keys yet.
4. **`UNVERIFIED:` Production Linux deployment & HTTPS reverse proxy**: No production `Dockerfile`, `nginx.conf`, or `ecosystem.config.js` exists in the repository; production setup in `14-deployment-and-operations.md` is marked `NOT IMPLEMENTED`.
5. **`UNVERIFIED:` Plot hold expiry background worker**: `src/worker.ts` currently runs only the `tenant-provisioning` BullMQ worker; automated plot hold expiry or recurring snapshot cron jobs were not found in `src/worker.ts`.
6. **`UNVERIFIED:` Automated backup/restore execution in production**: Backup/restore procedures in `14-deployment-and-operations.md` document standard `mysqldump` commands for the observed schema layout, as no automated backup script exists in `scripts/`.
`;
writeDoc("00-README.md", ...)`
