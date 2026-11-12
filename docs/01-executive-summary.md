# 01. Executive Summary

**Purpose:** Plain-language overview of LandInvest for business owners, investors, and stakeholders.  
**Intended Reader:** Non-technical Owner, Managing Partner, Stakeholder.  
**Last Verified:** 2026-11-12

---

## What Is LandInvest?

**LandInvest** is a bilingual (English and Bengali) multi-company software platform built specifically for **land investment syndicates and real estate developers in Bangladesh**. It replaces scattered Excel spreadsheets and paper cashbooks with one audited financial system.

## Who Is It For & What Problem Does It Solve?

In Bangladeshi land syndicates, multiple partners pool capital to buy raw land, pay registration and development costs, subdivide the land into plots (measured in *Shotok*, *Katha*, and *Bigha*), sell plots on advance + installment plans, and split the net profit by ownership percentage.

Without a unified system, syndicates struggle with:
- Knowing exact cash in hand vs. bank balances at any moment.
- Tracking who paid for an expense personally (*Paid by Partner*) versus out of company cash.
- Preventing double-booking or selling plots above available area.
- Calculating fair partner profit shares and defending numbers during an audit.

LandInvest solves these problems by enforcing every financial movement through immutable ledgers and an automatic audit trail.

---

## Main Modules (At a Glance)

| Module | What It Does |
|---|---|
| **Executive Dashboard** | Live KPIs, cash/bank summaries, dues, and customizable role-based charts. |
| **Partners & Capital** | Tracks partner profiles, capital deposits, withdrawals, direct expenses, and profit credits. |
| **Cash & Bank Treasury** | Manages company bank accounts, cash-in-hand, and Cash ↔ Bank contra transfers with approval. |
| **Land & Acquisition** | Records land projects, Bangladeshi land deed metadata (Mouza, JL, Dag, Khatian), and partner share splits (must total 100%). |
| **Plot Inventory** | Subdivides projects into plots, tracks availability (*Available*, *Booked*, *Sold*), and converts units. |
| **Project Expenses & Vouchers** | Logs land, legal, and development vouchers with receipt uploads and manager approval. |
| **Plot Sales & Dues** | Supports single-plot, multi-plot, and whole-project sales, installment schedules, and receipt printing. |
| **Reports & Profit Distribution** | 26 built-in financial, partner, project, sales, profit, and audit reports with PDF/Excel export and Fiscal Year filtering. |
| **Users, Roles & Audit Trail** | Fine-grained access control (79 permissions) and a complete log of who changed what and when. |
| **Fiscal Year (FY) Settings** | Lets administrators define Fiscal Years (e.g., Jul–Jun) and switch the active reporting FY. |
| **Billing (SaaS)** | Manages subscription plans and invoices for each tenant company (currently stubbed for manual testing). |

---

## Customer Onboarding & Subscription Model

1. **Multi-Tenant SaaS Design:** Each land company (*tenant*) gets its own isolated MySQL database so financial records never mix between customers.
2. **Onboarding:** New organizations can be provisioned via signup + background worker (`tenant-provisioning` queue in `src/worker.ts`), which creates the tenant database, pushes the schema, seeds default expense categories, creates 4 standard roles (*Owner*, *Managing Partner*, *Accountant*, *Site Manager*), and links the Owner account.
3. **Subscriptions:** `control_plane.subscription_plans` and `control_plane.billing_invoices` model monthly/annual SaaS plans per tenant (`trial`, `active`, `suspended`, `cancelled`).

---

## Current Completion Status

| Status | Areas |
|---|---|
| **Done & Verified** | Core ERP accounting (Partners, Treasury, Projects, Plots, Expenses, Vouchers, Multi-plot Sales, Collections, Profit Distribution), 79-permission RBAC, Bilingual UI (EN/BN), 26 Reports + PDF/Excel exports, Fiscal Year management, Full-project E2E & 92-check Acceptance suites. |
| **Partly Done / Stubbed** | SaaS Billing (`/api/billing/pay` is a stub without live bKash/SSLCommerz/Stripe integration); Email delivery for invites/password resets (uses token links/console in dev). |
| **Not Yet Implemented** | Automated production backup/restore scripts, Linux reverse-proxy/PM2 deployment manifests, automated plot-hold expiry background job. |

---

## Top Risks for an Owner to Know

1. **Billing & Email Are Not Live-Integrated:** Before onboarding paying public customers, wire a real payment gateway and transactional email provider (SMTP/SES/Resend).
2. **Database-Per-Tenant Operations:** Schema updates must be rolled out across every active tenant database, and backups must cover both `control_plane` and all `tenant_*` databases.
3. **Production Hardening Needed:** Ensure strong `NEXTAUTH_SECRET`, non-empty MySQL root/app passwords, and HTTPS termination before public internet exposure.
`;
