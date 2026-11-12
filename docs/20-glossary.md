# 20. Glossary (English & Bengali)

**Purpose:** Plain-language definitions of Bangladeshi real estate terms and software/accounting terms used in LandInvest.  
**Intended Reader:** Non-technical Owner, New Developer, Stakeholder.  
**Last Verified:** 2026-11-12

---

## Bangladeshi Land & Real Estate Terms

| Term (English) | Bengali (বাংলা) | Meaning |
|---|---|---|
| **Bayna** | বায়না | Earnest money / advance booking deposit paid to lock a land or plot purchase. |
| **Dag** | দাগ | Plot/survey parcel number recorded on a Mouza map. |
| **Khatian (CS, SA, RS, BS)** | খতিয়ান | Official land ownership record-of-rights across historical surveys (Cadastral, State Acquisition, Revisional, Bangladesh Survey). |
| **Mouza** | মৌজা | Lowest revenue/cadastral geographical land unit (village/estate survey area). |
| **JL (Jurisdiction List) No.** | জে.এল. নং | Unique number identifying a Mouza within a Thana/Upazila. |
| **Namjari / Mutation** | নামজারি | Updating government land records to register the new owner's name after purchase. |
| **Khajna** | খাজনা | Annual land development tax paid to the Union Land Office. |
| **Shotok (Decimal)** | শতক | Standard land area unit (`1/100` of an acre = `435.6 sq ft`); base unit in LandInvest. |
| **Katha** | কাঠা | Traditional urban land unit (`1 Katha ≈ 1.65 Shotok` / `720 sq ft`). |
| **Bigha** | বিঘা | Large land unit (`1 Bigha = 20 Katha ≈ 33 Shotok`). |
| **Saf Kabala** | সাফ কবলা | Registered final sale deed transferring full legal title to the buyer. |

---

## Accounting & Technical Terms

| Term | Bengali (বাংলা) | Meaning |
|---|---|---|
| **Contra Voucher** | কন্ট্রা ভাউচার | Internal transfer of funds between Cash-in-Hand and Bank (neither income nor expense). |
| **Money Receipt** | মানি রিসিট | Official acknowledgement issued to a buyer upon receiving an advance or installment. |
| **Receivable** | প্রাপ্য | Remaining agreed amount owed by plot buyers (`current_due_amount`). |
| **ROI (Return on Investment)** | বিনিয়োগের বিপরীতে আয় | Net profit divided by total project cost, expressed as a percentage. |
| **Fiscal Year (FY)** | অর্থবছর | 12-month financial reporting period (Bangladesh standard: July 1 – June 30). |
| **Tenant** | টেন্যান্ট / প্রতিষ্ঠান | An isolated customer organization with its own dedicated MySQL database. |
| **Control Plane** | কন্ট্রোল প্লেন | The shared central database (`control_plane`) managing logins, tenants, and billing. |
| **RBAC** | ভূমিকা-ভিত্তিক প্রবেশাধিকার | Role-Based Access Control — assigning granular permissions to roles rather than individual pages. |
| **Ledger** | খতিয়ান / লেজার | Append-only record of `CREDIT` and `DEBIT` financial movements. |
| **Idempotent** | আইডেমপোটেন্ট | An operation that produces the same safe result even if executed multiple times (e.g., `seedRoles`). |
`;
writeDoc("20-glossary.md", ...)`
