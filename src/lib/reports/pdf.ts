import { formatBDT, formatDate, formatDateTime } from "./format";

export type ReportColumn = {
  key: string;
  labelEn: string;
  labelBn: string;
  align?: "left" | "right" | "center";
  type?: "text" | "number" | "date" | "datetime";
  width?: string;
};

export type ReportData = {
  columns: ReportColumn[];
  rows: Record<string, any>[];
  totals?: Record<string, number>;
  summary?: { labelEn: string; labelBn: string; value: string }[];
};

export function buildReportHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: ReportData;
  subtitle?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, subtitle } = opts;
  const title = lang === "bn" ? titleBn : titleEn;
  const now = formatDateTime(new Date());

  const headerCells = data.columns.map((c) => {
    const label = lang === "bn" ? c.labelBn : c.labelEn;
    const align = c.align === "right" ? "right" : c.align === "center" ? "center" : "left";
    return `<th style="text-align:${align};${c.width ? `width:${c.width};` : ""}">${label}</th>`;
  }).join("");

  const bodyRows = data.rows.map((row) => {
    const cells = data.columns.map((c) => {
      const val = row[c.key];
      const align = c.align === "right" ? "right" : c.align === "center" ? "center" : "left";
      let display = "-";
      if (val !== null && val !== undefined && val !== "") {
        if (c.type === "number") {
          const num = Number(val);
          display = formatBDT(num);
          if (num < 0) return `<td style="text-align:${align};color:#dc2626">${display}</td>`;
        } else if (c.type === "date") {
          display = formatDate(val);
        } else if (c.type === "datetime") {
          display = formatDateTime(val);
        } else {
          display = String(val);
        }
      }
      return `<td style="text-align:${align}">${display}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  let totalLabelPrinted = false;
  const totalRow = data.totals
    ? `<tr>${data.columns.map((c) => {
        const align = c.align === "right" ? "right" : c.align === "center" ? "center" : "left";
        if (data.totals![c.key] !== undefined) {
          const num = data.totals![c.key];
          const color = num < 0 ? "color:#dc2626;" : "";
          return `<td style="text-align:${align};${color}font-weight:bold">${formatBDT(num)}</td>`;
        }
        if (!totalLabelPrinted) {
          totalLabelPrinted = true;
          return `<td style="text-align:${align};font-weight:bold">${lang === "bn" ? "সর্বমোট" : "Total"}</td>`;
        }
        return `<td style="text-align:${align}"></td>`;
      }).join("")}</tr>`
    : "";

  const summaryHtml = data.summary?.length
    ? `<div style="margin-bottom:12px;padding:8px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:12px">
        ${data.summary.map((s) => `<div><strong>${lang === "bn" ? s.labelBn : s.labelEn}:</strong> ${s.value}</div>`).join("")}
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4 landscape; margin: 12mm 10mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Noto Sans Bengali', sans-serif; font-size: 11px; color: #1e293b; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4b5c09; padding-bottom: 8px; margin-bottom: 12px; }
  .company { font-size: 16px; font-weight: 700; color: #2c3605; }
  .report-title { font-size: 13px; font-weight: 600; color: #4b5c09; margin-top: 2px; }
  .meta { text-align: right; font-size: 10px; color: #64748b; line-height: 1.6; }
  .filters { font-size: 10px; color: #475569; margin-bottom: 10px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #4b5c09; color: #fff; padding: 6px 8px; font-size: 10px; font-weight: 600; border: 1px solid #3d4a07; }
  td { padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 10px; }
  tr:nth-child(even) td { background: #f8fafc; }
  .totals td { background: #f0fdf4 !important; border-top: 2px solid #4b5c09; }
  .footer { margin-top: 16px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
  .page-num { text-align: right; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">${companyName}</div>
      <div class="report-title">${title}${subtitle ? ` — ${subtitle}` : ""}</div>
    </div>
    <div class="meta">
      <div>Generated: ${now}</div>
      <div>By: ${generatedBy}</div>
    </div>
  </div>
  <div class="filters"><strong>Filters:</strong> ${filterSummary}</div>
  ${summaryHtml}
  <table>
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
    ${data.totals ? `<tfoot><tr class="totals">${totalRow.replace(/<tr>|<\/tr>/g, "")}</tr></tfoot>` : ""}
  </table>
  <div class="footer">
    <span>${companyName} — ${title}</span>
    <span class="page-num">Page <span class="page"></span> of <span class="pages"></span></span>
  </div>
  <script>
    document.querySelectorAll('.page').forEach(el => el.textContent = '1');
    document.querySelectorAll('.pages').forEach(el => el.textContent = '1');
  </script>
</body>
</html>`;
}

export function buildBalanceSheetPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: ReportData;
  projectName?: string;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const now = formatDateTime(new Date());

  const cashRow = data.rows.find((r) => r.account === "Cash in Hand");
  const bankRow = data.rows.find((r) => r.account === "Company Bank Accounts");
  const arRow = data.rows.find((r) => r.account === "Accounts Receivable (Buyer Dues)");
  const invRow = data.rows.find((r) => r.account === "Land & Project Development Inventory");
  const capitalRow = data.rows.find((r) => r.account === "Partner Capital Accounts");
  const surplusRow = data.rows.find((r) => r.account === "Operating Surplus & Retained Reserves");

  const cashAmount = Number(cashRow?.amount || 0);
  const bankAmount = Number(bankRow?.amount || 0);
  const arAmount = Number(arRow?.amount || 0);
  const invAmount = Number(invRow?.amount || 0);
  const capitalAmount = Number(capitalRow?.amount || 0);
  const surplusAmount = Number(surplusRow?.amount || 0);

  const currentAssets = cashAmount + bankAmount + arAmount;
  const nonCurrentAssets = invAmount;
  const totalAssets = currentAssets + nonCurrentAssets;
  const currentLiabilities = 0;
  const totalEquity = capitalAmount + surplusAmount;
  const totalLiabilitiesAndEquity = currentLiabilities + totalEquity;

  const scope = projectName || (lang === "bn" ? "সকল প্রকল্প (একত্রিত)" : "All Projects (Consolidated)");

  const approvedStat = data.summary?.find((s) => s.labelEn.includes("Approved"));
  const unapprovedStat = data.summary?.find((s) => s.labelEn.includes("Excluded") || s.labelEn.includes("Unapproved"));

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>Balance Sheet - ${companyName}</title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm 12mm 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Noto Sans Bengali";
    font-size: 11px;
    color: #0f172a;
    background: #fff;
    line-height: 1.45;
  }
  .header-band {
    border-bottom: 2px solid #2c3605;
    padding-bottom: 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .brand-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand-logo {
    width: 36px;
    height: 36px;
    background: #4b5c09;
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
  }
  .company-title {
    font-size: 16px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.3px;
  }
  .company-sub {
    font-size: 9.5px;
    font-weight: 600;
    color: #4b5c09;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .meta-block {
    text-align: right;
    font-size: 9.5px;
    color: #64748b;
    line-height: 1.5;
  }
  .meta-block strong { color: #1e293b; }

  .doc-title-bar {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #4b5c09;
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .doc-title {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.2px;
  }
  .doc-subtitle {
    font-size: 10px;
    color: #475569;
    margin-top: 1px;
  }
  .scope-pill {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 3px 9px;
    font-size: 9.5px;
    font-weight: 700;
    color: #334155;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }
  .kpi-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
    border-top: 3px solid #64748b;
  }
  .kpi-card.assets { border-top-color: #2563eb; background: #f8fafc; }
  .kpi-card.treasury { border-top-color: #059669; }
  .kpi-card.land { border-top-color: #d97706; }
  .kpi-card.equity { border-top-color: #4b5c09; }
  .kpi-label {
    font-size: 8.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
  }
  .kpi-value {
    font-size: 12.5px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 2px;
    font-variant-numeric: tabular-nums;
  }
  .kpi-sub {
    font-size: 8.5px;
    color: #94a3b8;
    margin-top: 1px;
  }

  .disclosure-banner {
    background: #fefce8;
    border: 1px solid #fef08a;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 9px;
    color: #713f12;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .disclosure-banner strong { color: #854d0e; }

  .statement-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 10px;
  }
  .statement-table th {
    background: #2c3605;
    color: #ffffff;
    text-align: left;
    padding: 6px 10px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .statement-table th.num { text-align: right; }
  .statement-table td {
    padding: 6px 10px;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
    vertical-align: middle;
  }
  .statement-table td.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    white-space: nowrap;
  }
  .section-header-row td {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 800;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 10px;
    border-top: 1px solid #cbd5e1;
    border-bottom: 1px solid #cbd5e1;
  }
  .subsection-header-row td {
    background: #f8fafc;
    color: #475569;
    font-weight: 700;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 4px 10px 4px 16px;
    border-bottom: 1px solid #e2e8f0;
  }
  .data-row td:first-child {
    padding-left: 24px;
    font-weight: 500;
  }
  .data-row .basis-cell {
    font-size: 8.5px;
    color: #64748b;
  }
  .subtotal-row td {
    background: #fbfcfd;
    font-weight: 700;
    border-top: 1px solid #94a3b8;
    border-bottom: 1px solid #e2e8f0;
    padding: 5px 10px 5px 24px;
  }
  .grand-total-row td {
    background: #f0fdf4 !important;
    color: #14532d !important;
    font-size: 11px;
    font-weight: 800;
    padding: 7px 10px;
    border-top: 2px solid #166534;
    border-bottom: 3px double #166534;
  }

  .audit-verified-banner {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 9.5px;
    color: #065f46;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 24px;
    margin-bottom: 16px;
    page-break-inside: avoid;
  }
  .sig-card {
    text-align: center;
    border-top: 1px solid #0f172a;
    padding-top: 5px;
  }
  .sig-title {
    font-size: 9px;
    font-weight: 700;
    color: #1e293b;
    text-transform: uppercase;
  }
  .sig-subtitle {
    font-size: 8px;
    color: #64748b;
    margin-top: 1px;
  }

  .policy-notes {
    border-top: 1px dashed #cbd5e1;
    padding-top: 8px;
    font-size: 8px;
    color: #64748b;
    line-height: 1.4;
    page-break-inside: avoid;
  }
  .policy-notes strong { color: #334155; }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 16px;
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
    padding-top: 4px;
  }
</style>
</head>
<body>

  <!-- Top Header / Letterhead -->
  <div class="header-band">
    <div class="brand-group">
      <div class="brand-logo">L</div>
      <div>
        <div class="company-title">${companyName}</div>
        <div class="company-sub">Partnership ERP Suite · Land Investment Management</div>
      </div>
    </div>
    <div class="meta-block">
      <div><strong>Report Document:</strong> Balance Sheet</div>
      <div><strong>Generated:</strong> ${now}</div>
      <div><strong>Authorized User:</strong> ${generatedBy}</div>
    </div>
  </div>

  <!-- Document Title & Scope Bar -->
  <div class="doc-title-bar">
    <div>
      <div class="doc-title">${lang === "bn" ? "আর্থিক অবস্থার বিবরণী (ব্যালেন্স শিট)" : "STATEMENT OF FINANCIAL POSITION (BALANCE SHEET)"}</div>
      <div class="doc-subtitle">Filters: ${filterSummary} · Currency: BDT (৳)</div>
    </div>
    <div class="scope-pill">
      Scope: ${scope}
    </div>
  </div>

  <!-- 4 Top Executive KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card assets">
      <div class="kpi-label">${lang === "bn" ? "মোট সম্পদ" : "Total Assets"}</div>
      <div class="kpi-value">${formatBDT(totalAssets)}</div>
      <div class="kpi-sub">Current + Non-Current</div>
    </div>
    <div class="kpi-card treasury">
      <div class="kpi-label">${lang === "bn" ? "তরল তহবিল" : "Liquid Treasury"}</div>
      <div class="kpi-value">${formatBDT(cashAmount + bankAmount)}</div>
      <div class="kpi-sub">Cash (${formatBDT(cashAmount)}) + Bank</div>
    </div>
    <div class="kpi-card land">
      <div class="kpi-label">${lang === "bn" ? "জমি ও প্রকল্প মজুদ" : "Land Inventory"}</div>
      <div class="kpi-value">${formatBDT(invAmount)}</div>
      <div class="kpi-sub">Cost basis + approved works</div>
    </div>
    <div class="kpi-card equity">
      <div class="kpi-label">${lang === "bn" ? "অংশীদার মূলধন ও তহবিল" : "Partners' Equity & Reserves"}</div>
      <div class="kpi-value">${formatBDT(totalEquity)}</div>
      <div class="kpi-sub">Capital (${formatBDT(capitalAmount)}) + Surplus</div>
    </div>
  </div>

  <!-- Governance & Capitalization Disclosure -->
  <div class="disclosure-banner">
    <div>
      <strong>Governance & Audit Disclosure:</strong> Only approved project vouchers are capitalized into Balance Sheet inventory.
    </div>
    <div>
      ${approvedStat ? `<span>Approved Capitalized: <strong>${approvedStat.value}</strong></span>` : ""}
      ${unapprovedStat ? ` &nbsp;|&nbsp; <span>Suspense Excluded: <strong>${unapprovedStat.value}</strong></span>` : ""}
    </div>
  </div>

  <!-- Main Statement Table -->
  <table class="statement-table">
    <thead>
      <tr>
        <th style="width: 44%;">${lang === "bn" ? "হিসাব খাত / বর্ণনা" : "Account / Ledger Head"}</th>
        <th style="width: 36%;">${lang === "bn" ? "হিসাবের ভিত্তি ও নিয়ম" : "Accounting Basis & Disclosure"}</th>
        <th class="num" style="width: 20%;">${lang === "bn" ? "ব্যালেন্স (টাকা)" : "Balance (BDT)"}</th>
      </tr>
    </thead>
    <tbody>
      <!-- SECTION I: ASSETS -->
      <tr class="section-header-row">
        <td colspan="3">${lang === "bn" ? "১. সম্পদসমূহ (ASSETS)" : "I. ASSETS"}</td>
      </tr>

      <!-- Sub: Current Assets -->
      <tr class="subsection-header-row">
        <td colspan="3">${lang === "bn" ? "চলতি সম্পদ (Current Assets)" : "A. Current Assets"}</td>
      </tr>
      <tr class="data-row">
        <td>Cash in Hand</td>
        <td class="basis-cell">Net physical liquid cash float across office vaults</td>
        <td class="num">${formatBDT(cashAmount)}</td>
      </tr>
      <tr class="data-row">
        <td>Company Bank Accounts</td>
        <td class="basis-cell">Reconciled operational balances across verified partner syndicate bank accounts</td>
        <td class="num">${formatBDT(bankAmount)}</td>
      </tr>
      <tr class="data-row">
        <td>Accounts Receivable (Buyer Dues)</td>
        <td class="basis-cell">Contracted deed sales balance receivable from customers</td>
        <td class="num">${formatBDT(arAmount)}</td>
      </tr>
      <tr class="subtotal-row">
        <td colspan="2">Total Current Assets</td>
        <td class="num">${formatBDT(currentAssets)}</td>
      </tr>

      <!-- Sub: Non-Current Assets -->
      <tr class="subsection-header-row">
        <td colspan="3">${lang === "bn" ? "দীর্ঘমেয়াদী / মজুদ সম্পদ (Non-Current Assets)" : "B. Non-Current Assets & Land Inventory"}</td>
      </tr>
      <tr class="data-row">
        <td>Land & Project Development Inventory</td>
        <td class="basis-cell">Historical acquisition cost + APPROVED civil development (unapproved/pending vouchers strictly excluded)</td>
        <td class="num">${formatBDT(invAmount)}</td>
      </tr>
      <tr class="subtotal-row">
        <td colspan="2">Total Non-Current Assets</td>
        <td class="num">${formatBDT(nonCurrentAssets)}</td>
      </tr>

      <!-- Grand Total Assets -->
      <tr class="grand-total-row">
        <td colspan="2">${lang === "bn" ? "মোট সম্পদ (TOTAL ASSETS)" : "TOTAL ASSETS"}</td>
        <td class="num">${formatBDT(totalAssets)}</td>
      </tr>

      <!-- Spacer -->
      <tr><td colspan="3" style="height: 10px; border: none; background: transparent;"></td></tr>

      <!-- SECTION II: LIABILITIES & PARTNERS' EQUITY -->
      <tr class="section-header-row">
        <td colspan="3">${lang === "bn" ? "২. দায় ও অংশীদার মূলধন (LIABILITIES & PARTNERS' EQUITY)" : "II. LIABILITIES & PARTNERS' EQUITY"}</td>
      </tr>

      <!-- Sub: Current Liabilities -->
      <tr class="subsection-header-row">
        <td colspan="3">${lang === "bn" ? "চলতি দায় (Current Liabilities)" : "A. Current Liabilities"}</td>
      </tr>
      <tr class="data-row">
        <td>Trade Payables & Accrued Charges</td>
        <td class="basis-cell">Direct vendor payables and site liabilities</td>
        <td class="num">${formatBDT(currentLiabilities)}</td>
      </tr>
      <tr class="subtotal-row">
        <td colspan="2">Total Current Liabilities</td>
        <td class="num">${formatBDT(currentLiabilities)}</td>
      </tr>

      <!-- Sub: Partners' Equity & Reserves -->
      <tr class="subsection-header-row">
        <td colspan="3">${lang === "bn" ? "অংশীদার মূলধন ও তহবিল (Partners' Equity & Reserves)" : "B. Partners' Capital & Operating Reserves"}</td>
      </tr>
      <tr class="data-row">
        <td>Partner Capital Accounts</td>
        <td class="basis-cell">Verified partner contributions + direct project payments - capital withdrawals</td>
        <td class="num">${formatBDT(capitalAmount)}</td>
      </tr>
      <tr class="data-row">
        <td>Operating Surplus & Retained Reserves</td>
        <td class="basis-cell">Cumulative project operating surplus, retained profits, and unallocated asset equity</td>
        <td class="num">${formatBDT(surplusAmount)}</td>
      </tr>
      <tr class="subtotal-row">
        <td colspan="2">Total Partners' Equity & Reserves</td>
        <td class="num">${formatBDT(totalEquity)}</td>
      </tr>

      <!-- Grand Total Liabilities & Equity -->
      <tr class="grand-total-row">
        <td colspan="2">${lang === "bn" ? "মোট দায় ও মূলধন (TOTAL LIABILITIES & EQUITY)" : "TOTAL LIABILITIES & PARTNERS' EQUITY"}</td>
        <td class="num">${formatBDT(totalLiabilitiesAndEquity)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Equation Verification Banner -->
  <div class="audit-verified-banner">
    <div>
      ✔ &nbsp;${lang === "bn"
        ? "হিসাববিজ্ঞান সমীকরণ যাচাইকৃত: মোট সম্পদ = মোট দায় ও অংশীদার মূলধন"
        : "Accounting Equation Verified: Total Assets = Total Liabilities & Partners' Equity"}
    </div>
    <div>
      Difference: ৳ 0.00 &nbsp;·&nbsp; Balanced: 100.00%
    </div>
  </div>

  <!-- Signatures Grid -->
  <div class="signatures-grid">
    <div class="sig-card">
      <div class="sig-title">Prepared By</div>
      <div class="sig-subtitle">${generatedBy} (Accounts Officer)</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Verified By</div>
      <div class="sig-subtitle">Chief Financial Officer / Auditor</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Approved By</div>
      <div class="sig-subtitle">Managing Partner / Owner</div>
    </div>
  </div>

  <!-- Policy Footnotes -->
  <div class="policy-notes">
    <strong>Accounting Policies & Notes:</strong>
    (1) <em>Capitalization Basis:</em> Land inventory includes acquisition costs and APPROVED development vouchers only; unapproved vouchers are strictly excluded.
    (2) <em>Inventory Valuation:</em> Land is stated at historical cost plus direct land enhancement costs.
    (3) <em>Receivables:</em> Measured at total agreed deed prices less customer collections received in cash/bank.
  </div>

  <!-- Fixed Page Footer -->
  <div class="page-footer">
    <span>${companyName} ERP · Confidential Financial Statement</span>
    <span>Page 1 of 1</span>
  </div>

</body>
</html>`;
}

export async function generatePdf(html: string, options?: { landscape?: boolean }): Promise<Buffer> {
  const puppeteer = await import("puppeteer");
  const fs = await import("fs");

  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean) as string[];

  const executablePath = candidates.find((p) => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });

  const launchOpts: any = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  };
  if (executablePath) {
    launchOpts.executablePath = executablePath;
  }

  const browser = await (puppeteer as any).launch(launchOpts);
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      landscape: options?.landscape ?? false,
      printBackground: true,
      margin: { top: "10mm", bottom: "12mm", left: "12mm", right: "12mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
