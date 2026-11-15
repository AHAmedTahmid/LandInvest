# Sonar Bangla Land Developers Ltd. — Demo Data Guide

This document describes the clean, realistic demonstration environment created inside **LandInvest** for client presentations, walkthroughs, and automated screenshot generation.

---

## 1. Company Profile

- **Legal Entity:** Sonar Bangla Land Developers Ltd. (সোনার বাংলা ল্যান্ড ডেভেলপার্স লিমিটেড)
- **Tenant Slug:** `demo`
- **Database:** `tenant_demo` (Control Plane: `control_plane`)
- **Simulated Operating Period:** 22 Months (January 2025 to November 15, 2026)
- **Reference Date (As-Of):** `2026-11-15`
- **Subscription Plan:** Enterprise (Active, Annual billing with paid invoices)
- **Reporting Currency:** Bangladeshi Taka (BDT, ৳) with Lakh/Crore numbering (`৳ ২,৩৬,৮৭,৩৫০.০০`)

---

## 2. Demo User Logins

All demo users share the universal password: **`123456`**.

| Role | Email | User Name | What This User Demonstrates |
|---|---|---|---|
| **Owner** | `owner@alpha.com` | Md. Rafiqul Islam | Complete executive overview: portfolio ROI, profit distributions, treasury books, settings, and user administration. |
| **Managing Partner** | `admin@alpha.com` | Barrister Tariq Ahmed | C-level operational oversight across all projects, financial ledgers, and voucher approvals (excluding user management). |
| **Accountant** | `accountant@alpha.com` | Mahfuzur Rahman | Treasury management: cash drawer, 3 commercial bank accounts, contra fund transfers, installment collections, money receipt generation, and expense accounting. |
| **Site Manager** | `site@alpha.com` | Engr. Kamrul Hasan | Field operations: cadastral plot inventory, earthwork development expenses, site boundary demarcations, and voucher submission. |
| **Sales Executive** | `sales@alpha.com` | Tanvir Ahmed | **Custom restricted role:** Plot pricing, customer sales contracts, and overdue collections. **Strictly restricted from viewing costs, bank balances, or profit margins.** |
| **Auditor (read-only)** | `auditor@alpha.com` | Farhana Yasmin | **Custom audit role:** Comprehensive read-only review across all ledgers, audit trails, and reconciliation statements with zero write/edit permissions. |

*Additional Seeded Accounts:*
- **Invited User:** `engineer.invite@alpha.com` (Pending invite for Site Manager role)
- **Deactivated User:** `former.staff@alpha.com` (Demonstrates offboarding audit log in user settings)

---

## 3. Project Portfolio Overview

The portfolio features **6 distinct land development projects**, each intentionally structured to demonstrate specific workflows and system capabilities:

### 1. Green Valley City (`SOLD_OUT`)
- **Location:** Baraipara, Savar, Dhaka (Mouza JL #142)
- **Area:** 150.00 Shotok (~9.09 Bigha). Common Infrastructure: 30 Shotok. Saleable: 120 Shotok.
- **Plots:** 30 plots (`GV-01` to `GV-30`), sizes 3.5, 4.0, and 4.5 Shotok.
- **Financials:** Acquisition cost ৳ 1.80 Cr. Development expenses ৳ 64.51 L. Invoiced sales ৳ 3.84 Cr.
- **Demonstration:** A completed, highly successful project. **100% sold and 100% collected**. Net realised profit of **৳ 1.39 Cr distributed in full** across syndicate partners across 3 rounds (Interim Q1, Interim Q2, and Final completion basis). ROI > 57%.

### 2. River View Township (`SELLING` — Active Development)
- **Location:** Rohitpur, Keraniganj, Dhaka (Mouza JL #88)
- **Area:** 220.00 Shotok. Saleable: 175 Shotok.
- **Plots:** 40 plots (`RV-01` to `RV-40`), sizes 3.5 to 5.0 Shotok.
- **Sales Status:** 24 plots contracted (18 `SOLD`, 6 `BOOKED`), 2 `HELD`, 1 `RESERVED`, 13 `AVAILABLE`.
- **Demonstration:** Demonstrates active sales, flexible installment contracts (12 & 24 months), and **receivables aging across all buckets** (current, 1–30, 31–60, 61–90, and >90 days overdue). Plot `RV-26` is on hold expiring within 2 days.

### 3. Lake Garden Oasis (`SELLING` — Early Phase)
- **Location:** Bhelanagar, Purbachal Sector 22, Dhaka (Mouza JL #105)
- **Area:** 180.00 Shotok. Saleable: 144 Shotok.
- **Plots:** 32 plots (`LG-01` to `LG-32`), sizes 3.5 to 5.5 Shotok.
- **Sales Status:** 8 contracted (5 `SOLD`, 3 `BOOKED`), 2 `RESERVED`, 2 `NOT_FOR_SALE`, 20 `AVAILABLE`.
- **Demonstration:** Early-phase selling. Highlights premium corner and road-facing plots with differentiated price points. Triggers the **inventory stagnation alert** (>50% unsold after 6 months) to prompt promotional marketing.

### 4. Palm Heights (`DEVELOPING`)
- **Location:** Baoani, Gazipur Sadar (Mouza JL #64)
- **Area:** 120.00 Shotok.
- **Plots:** 24 plots (`PH-01` to `PH-24`).
- **Status:** Land registered and mutated. Active site preparation, earth filling, and boundary wall construction.
- **Demonstration:** Operations in progress. 6 newly priced plots, 18 `UNPRICED`. Contains **vouchers awaiting approval** (older than 3 days) which trigger the pending approval backlog alert.

### 5. Sunrise Residency (`UNDER_BAYNA`)
- **Location:** Murapara, Rupganj, Narayanganj (Mouza JL #42)
- **Area:** 90.00 Shotok.
- **Status:** Bayna token advance of ৳ 25.00 Lakh paid 68 days ago.
- **Demonstration:** Bayna contract is **expiring in 9 days**, triggering the **Bayna Expiry Warning** on executive dashboards.

### 6. Meghna Riverside Estate (`DRAFT`)
- **Location:** Baushia, Gazaria (Mouza JL #19)
- **Area:** 70.00 Shotok planned.
- **Demonstration:** Demonstrates an incomplete project wizard draft that can be opened, reviewed, and finalized.

---

## 4. Where to Find Key Features & Scenarios

| Business Scenario / Feature | Navigation Route | What to Notice |
|---|---|---|
| **Executive Overview & Insights** | `/` (Tab: Overview) | 5 live alert pills: Overdue Receivables Spike (Critical), Bayna Expiry (Warning), Voucher Approval Backlog (Warning), Unsold Plots in Lake Garden (Info), Partner Capital Variance (Info). |
| **12-Month Cash Flow Trends** | `/?tab=financial` | Multi-bar cash inflows vs outflows across 22 months, liquidity breakdown, and 90-day forecast. |
| **Receivables Aging Analysis** | `/reports/receivables-aging` | Full aging table grouping dues into 1–30, 31–60, 61–90, and >90 days overdue. |
| **Installment Dues & Follow-up** | `/reports/installment-report` | Individual buyer phone numbers, due dates, installment sequence, and status (`PAID`, `UPCOMING`, `OVERDUE`). |
| **Pending Voucher Approvals** | `/expenses/approvals` | 7 pending vouchers with age in days, description, payment channel, and one-click Approve/Reject actions. |
| **Completed Project Profit Distribution** | `/reports/profit-history` | 12 distribution records for Green Valley City totaling ৳ 1,39,48,644, split across partners according to agreed shares. |
| **Partner Capital Statements** | `/reports/partner-capital?partner=40000000-0000-0000-0000-000000000001` | Detailed running ledger for Managing Partner Md. Rafiqul Islam showing deposits, out-of-pocket expenses (`PAID_BY_PARTNER`), profit credits, and withdrawals. |
| **Treasury Contra Transfers** | `/reports/contra-register` | 23 double-entry transfers between Cash in Hand and the 3 commercial bank accounts (DBBL, IBBL, BRAC Bank). |
| **Money Receipts & Printing** | `/sales/befc311c-0b0c-4eae-87ac-7dc7de8ed3db` | Sequential money receipt `MR-0457` with customer copy, plot details, and printable PDF layout. |
| **Restricted Role Verification** | Log in as `sales@alpha.com` | Notice the dashboard has **zero cost, expense, or margin widgets**. The Financials and Operations tabs are hidden. Attempting to access cost APIs returns HTTP 403 Forbidden. |
| **Automated System Integrity** | `/reports/reconciliation` | Real-time automated audit scorecard verifying bank balances, partner balances, payment reconciliation, and isolation of partner-paid expenses (100% PASS). |

---

## 5. Headline Metrics Summary (As-Of 2026-11-15)

- **Total Invoiced Plot Sales:** ৳ 8,56,55,000.00 (~8.57 Crore BDT)
- **Total Collections Received:** ৳ 7,03,25,035.00 (~7.03 Crore BDT)
- **Outstanding Receivables:** ৳ 1,53,29,965.00 (~1.53 Crore BDT — 17.9% of total sales)
- **Total Approved Project Costs:** ৳ 11,95,83,210.00 (~11.96 Crore BDT)
- **Closing Company Liquidity:**
  - **Cash in Hand:** ৳ 55,56,253.00 (~55.56 Lakh BDT)
  - **Dutch-Bangla Bank PLC:** ৳ 1,65,34,664.00 (~1.65 Crore BDT)
  - **Islami Bank Bangladesh PLC:** ৳ 2,64,39,263.00 (~2.64 Crore BDT)
  - **BRAC Bank PLC:** ৳ 3,63,24,644.00 (~3.63 Crore BDT)
  - **Total Liquidity:** **৳ 8,48,54,824.00 (~8.49 Crore BDT)**
- **Automated Verification Score:** **16 of 16 Checks PASSED (100%)**

