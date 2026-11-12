# 03. Tech Stack

**Purpose:** Complete inventory of languages, frameworks, libraries, runtime versions, and known dependency vulnerabilities.  
**Intended Reader:** Technical Lead, New Developer, DevOps / Maintainer.  
**Last Verified:** 2026-11-12

---

## Runtime & Platform Environment

| Component | Observed Value | Notes |
|---|---|---|
| **Language** | TypeScript `^5` + SQL (MySQL) | Strict type checking via `npm run typecheck` |
| **Runtime** | Node.js `v24.19.0` | Native ESM (`"type": "module"` not set; `.mjs` for ESM scripts, `tsx` for TS scripts) |
| **Package Manager** | npm `11.17.0` | Lockfile: `package-lock.json` |
| **Database Engine** | MySQL 8.4 (InnoDB, `utf8mb4_unicode_ci`) | Native Windows service on `localhost:3306` (no Docker required) |
| **Queue / Cache** | Redis 6.2+ (`redis-windows`) | Required by BullMQ streams (`XADD`) on `localhost:6379` |
| **OS Assumptions** | Windows 10/11 (dev) / Linux (prod) | `next dev --webpack` used on Windows for stability |

---

## Dependencies (Extracted from `package.json` & `package-lock.json`)

| Package | Locked Version | Declared Range | Kind | Purpose |
|---|---|---|---|---|
| `@prisma/client` | `6.19.3` | `^6.19.3` | dependency | Type-safe ORM with dual-schema support (control plane + per-tenant DBs) |
| `bcryptjs` | `3.0.3` | `^3.0.3` | dependency | Password hashing for Credentials authentication |
| `bullmq` | `6.3.8` | `^6.3.8` | dependency | Redis-backed job queue for asynchronous tenant provisioning |
| `ioredis` | `6.0.0` | `^6.0.0` | dependency | Redis client for BullMQ and rate limiting |
| `lucide-react` | `1.48.0` | `^1.48.0` | dependency | Consistent SVG icon set across the UI |
| `mysql2` | `3.24.4` | `^3.24.4` | dependency | Direct MySQL driver for provisioning, seeding, and maintenance scripts |
| `next` | `16.3.6` | `16.3.6` | dependency | Full-stack React framework (App Router, Server Components, API routes) |
| `next-auth` | `4.24.15` | `^4.24.15` | dependency | Authentication and JWT session management (Auth.js v4) |
| `puppeteer` | `25.12.0` | `^25.12.0` | dependency | Headless Chromium for server-side PDF report & documentation generation |
| `react` | `19.2.8` | `19.2.8` | dependency | UI component library |
| `react-dom` | `19.2.8` | `19.2.8` | dependency | React DOM renderer |
| `recharts` | `3.10.1` | `^3.10.1` | dependency | Interactive charts for executive and financial dashboards |
| `@tailwindcss/postcss` | `4.3.3` | `^4` | devDependency | Tailwind CSS v4 PostCSS integration |
| `@types/node` | `20.19.43` | `^20` | devDependency | TypeScript definitions for Node.js APIs |
| `@types/react` | `19.3.0` | `^19` | devDependency | TypeScript definitions for React |
| `@types/react-dom` | `19.3.0` | `^19` | devDependency | TypeScript definitions for React DOM |
| `eslint` | `9.39.5` | `^9` | devDependency | Static code linting |
| `eslint-config-next` | `16.3.6` | `16.3.6` | devDependency | Next.js recommended ESLint rules |
| `prisma` | `6.19.3` | `^6.19.3` | devDependency | Prisma CLI for schema generation and db push |
| `tailwindcss` | `4.3.3` | `^4` | devDependency | Utility-first CSS styling |
| `tsx` | `4.23.15` | `^4.23.15` | devDependency | TypeScript script runner for workers, seeding, and doc generation |
| `typescript` | `5.9.3` | `^5` | devDependency | Static type checking across app and scripts |

---

## Known Vulnerabilities (`npm audit`)

Total dependencies scanned: **613** (165 prod, 403 dev).  
Summary: **17 vulnerabilities** (Critical: 1, High: 9, Moderate: 7, Low: 0).

| Package | Severity | Advisory Summary | Fix Available |
|---|---|---|---|
| `@prisma/config` | high | deepmerge-ts | Yes |
| `@typescript-eslint/eslint-plugin` | moderate | @typescript-eslint/type-utils; @typescript-eslint/utils | Yes |
| `@typescript-eslint/parser` | moderate | @typescript-eslint/typescript-estree | Yes |
| `@typescript-eslint/type-utils` | moderate | @typescript-eslint/typescript-estree; @typescript-eslint/utils | Yes |
| `@typescript-eslint/typescript-estree` | moderate | minimatch | Yes |
| `@typescript-eslint/utils` | moderate | @typescript-eslint/typescript-estree | Yes |
| `chromium-bidi` | high | zod | Yes |
| `deepmerge-ts` | high | DeepmergeTS has stack exhaustion when merging recursive object graphs | Yes |
| `minimatch` | moderate | minimatch has potential denial of service via globparts amplification | Yes |
| `next` | critical | Next.js: Pending `use cache` fill can leak Draft Mode content into regular responses and persisted pages; Next.js has cache poisoning of SSG and ISR pages in self-hosted applications | Yes |
| `prisma` | high | @prisma/config | Yes |
| `puppeteer` | high | chromium-bidi; puppeteer-core | Yes |
| `puppeteer-core` | high | chromium-bidi | Yes |
| `sharp` | high | sharp : Vulnerability in librsvg dependency CVE-2026-96889 | Yes |
| `source-map-js` | high | source-map-js allows event-loop denial of service through indexed source-map section offsets | Yes |
| `typescript-eslint` | moderate | @typescript-eslint/eslint-plugin; @typescript-eslint/parser | Yes |
| `zod` | high | Zod can exhaust memory while validating oversized constrained collections | Yes |
