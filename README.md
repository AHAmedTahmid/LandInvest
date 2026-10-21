# LandInvest — Partnership ERP for Real-Estate Syndicates

Multi-tenant SaaS accounting for land-partnership syndicates in Bangladesh: partner
capital, cash & bank treasury, land projects, plot sales, profit distribution and a
full report pack.

## Prerequisites

- Node.js 20+
- MySQL 8.x running on `localhost:3306` (user `root`, no password for local dev)
- Redis running on `localhost:6379`

## Setup (fresh machine)

```bash
git clone <repo-url> && cd LandInvest
npm install
copy .env.example .env
```

Start MySQL and Redis, then create the databases and seed:

```bash
npm run setup        # creates control_plane + tenant_demo, pushes schemas, seeds users
npm run dev          # Next.js app on http://localhost:3000
npm run worker       # provisioning worker (in a second terminal)
```

### Audit / test dataset

`scripts/audit_seed.mjs` resets everything and builds the full test dataset
(2 tenants, 4 partners, 3 projects, 50 expenses, 30 sales with installments, 5 users on
custom roles):

```bash
npx tsx scripts/audit_seed.mjs
```

## Demo logins

After `npm run setup` (demo tenant):

| Email | Role | Password |
|---|---|---|
| `owner@demo.com` | Owner | `123456` |
| `admin@demo.com` | Managing Partner | `123456` |
| `site@demo.com` | Site Manager | `123456` |
| `acct@demo.com` | Accountant | `123456` |

After `npx tsx scripts/audit_seed.mjs` (audit tenants):

| Email | Tenant | Role | Password |
|---|---|---|---|
| `owner@alpha.com` | Alpha Estates | Owner | `123456` |
| `admin@alpha.com` | Alpha Estates | Managing Partner | `123456` |
| `auditor@alpha.com` | Alpha Estates | Auditor | `123456` |
| `field@alpha.com` | Alpha Estates | Field Officer | `123456` |
| `sales@alpha.com` | Alpha Estates | Sales Agent | `123456` |
| `owner@beta.com` | Beta Holdings | Owner | `123456` |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run worker` | BullMQ provisioning worker |
| `npm run setup` | Create + seed control and demo tenant |
| `npm run seed:roles` | Seed default roles + demo users (idempotent) |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run acceptance` | 4-criteria acceptance suite (services, flows, audit, RBAC) |
| `npm run rbac:smoke` | Dynamic-RBAC end-to-end smoke suite |
| `npm run audit` | Full security & integrity audit (see `scripts/audit.mjs`) |

## Architecture

- **Control plane** (`prisma/control/schema.prisma` → `control_plane` DB): tenants, plans,
  subscriptions, users, invitations, billing, password resets.
- **Tenant plane** (`prisma/tenant/schema.prisma` → one DB per tenant): partners, projects,
  plots, sales, payments, treasury, expenses, profit, audit log, roles.
- **Auth**: NextAuth v4 (JWT sessions, credentials provider, bcrypt passwords).
- **RBAC**: dynamic per-tenant roles with a permission catalog (`src/lib/permissions.ts`),
  cached 60s, enforced on the server by `can()` in `src/lib/rbac.ts`.
- **Provisioning**: BullMQ queue + worker creates, migrates and seeds each tenant DB.
- **Reports**: 25 reports in `src/lib/reports/` rendered from `registry.ts`, with PDF
  (Puppeteer) and Excel export.

## Environment variables

See `.env.example` for the full list.
