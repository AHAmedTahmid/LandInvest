# 13. Setup and Run Guide (Clean Machine)

**Purpose:** Step-by-step instructions to run LandInvest locally from a fresh checkout using native Windows/Linux services (no Docker required).  
**Intended Reader:** New Developer, QA Engineer.  
**Last Verified:** 2026-11-12

---

## Prerequisites

1. **Node.js 20+** (verified on `v24.19.0`) and **npm** (`11+`).
2. **MySQL 8.4** running natively on port `3306` (e.g., Windows service `MySQL84` or `mysqld.exe --datadir=... --port=3306`).
3. **Redis 6.2+** running natively on port `6379` (e.g., `redis-windows` 6.2.22 or Memurai on Windows; `redis-server` on Linux).

---

## Step-by-Step Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone <repository-url> LandInvest
   cd LandInvest
   npm install
   ```

2. **Configure `.env`** (create `.env` from `.env.example` or set required variables):
   ```env
   DATABASE_URL_CONTROL="mysql://root:@localhost:3306/control_plane"
   DATABASE_URL_TENANT="mysql://root:@localhost:3306/tenant_demo"
   NEXTAUTH_SECRET="<replace-with-random-secret>"
   NEXTAUTH_URL="http://localhost:3000"
   REDIS_URL="redis://localhost:6379"
   ```

3. **Create Databases & Push Schemas + Seed Demo Data**
   ```bash
   npm run setup
   ```
   *(Or push Prisma schemas manually: `npx prisma db push --schema=prisma/control/schema.prisma` and `npx prisma db push --schema=prisma/tenant/schema.prisma`, then run `npm run seed:roles`, `node scripts/seed_realistic_data.mjs`, and `npm run seed:fy`.)*

4. **Start the Background Worker & Next.js Dev Server**
   ```bash
   # Terminal 1 (Tenant provisioning worker)
   npm run worker

   # Terminal 2 (Web application)
   npm run dev
   ```
   *(Note: `npm run dev` runs `next dev --webpack` on `http://localhost:3000`.)*

5. **Log In with Demo Accounts** (seeded in `tenant_demo` / `control_plane`):
   - **Owner:** `owner@demo.com` (password set by `setup.mjs` — e.g., check `scripts/setup.mjs` for local demo password)
   - **Managing Partner:** `admin@demo.com`
   - **Site Manager:** `site@demo.com`
   - **Accountant:** `acct@demo.com`

---

## Troubleshooting (Real Issues Observed in This Repo)

| Symptom | Root Cause | Resolution |
|---|---|---|
| `Redis X.X is too old for BullMQ` | Older Redis 3.x/5.x on Windows lacks `XADD` streams. | Use Redis 6.2+ (`redis-windows` 6.2.22 or Memurai). |
| `MySQL is not reachable on port 3306` | `mysqld` service stopped. | Start `MySQL84` service or run `mysqld --port=3306`. |
| `EPERM: operation not permitted, mkdir` on Windows | Transient Windows filesystem lock during `npm`/`npx`. | Re-run the command once. |
| `Table 'tenant_demo.users' doesn't exist` | Login accounts live in `control_plane.global_users`, not in tenant DBs. | Query `control_plane.global_users` for auth records. |
`;
writeDoc("13-setup-and-run-guide.md", ...)`
