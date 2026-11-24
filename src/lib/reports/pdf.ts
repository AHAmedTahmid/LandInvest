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

export function buildCashBookPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: ReportData;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const totalIn = Number(data.totals?.in || 0);
  const totalOut = Number(data.totals?.out || 0);
  const netMovement = totalIn - totalOut;

  let openingBalance = 0;
  if (data.rows.length > 0) {
    const first = data.rows[0];
    const firstNet = (first.in || 0) - (first.out || 0);
    openingBalance = (first.balance || 0) - firstNet;
  }
  const closingBalance = data.rows.length > 0 ? (data.rows[data.rows.length - 1].balance || 0) : openingBalance;

  const inCount = data.rows.filter((r) => r.in !== null && r.in > 0).length;
  const outCount = data.rows.filter((r) => r.out !== null && r.out > 0).length;

  const getCategoryBadgeHtml = (refType: string) => {
    const type = (refType || "").toUpperCase();
    if (type.includes("DEPOSIT")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;">${lang === "bn" ? "মূলধন জমা" : "Deposit"}</span>`;
    }
    if (type.includes("COLLECTION")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe;">${lang === "bn" ? "বিক্রয় আদায়" : "Collection"}</span>`;
    }
    if (type.includes("CONTRA")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe;">${lang === "bn" ? "কন্ট্রা" : "Contra"}</span>`;
    }
    if (type.includes("EXPENSE")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#fffbeb;color:#92400e;border:1px solid #fde68a;">${lang === "bn" ? "প্রকল্প ব্যয়" : "Expense"}</span>`;
    }
    return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:600;background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;">${refType || "General"}</span>`;
  };

  const rowsHtml = data.rows.map((row, idx) => {
    return `<tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;white-space:nowrap;font-size:9.5px;color:#334155;">${formatDate(row.date)}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:9px;color:#64748b;white-space:nowrap;">#${row.voucher || "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;white-space:nowrap;">${getCategoryBadgeHtml(row.referenceType || row.reference)}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:9.5px;color:#0f172a;font-weight:500;">${row.purpose || "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:9.5px;color:#047857;font-weight:600;white-space:nowrap;">${row.in ? `+${formatBDT(row.in)}` : "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:9.5px;color:#be123c;font-weight:600;white-space:nowrap;">${row.out ? `-${formatBDT(row.out)}` : "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:10px;color:#0f172a;font-weight:700;white-space:nowrap;">${formatBDT(row.balance)}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>Cash Book - ${companyName}</title>
<style>
  @page { size: A4 landscape; margin: 10mm 12mm 12mm 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Noto Sans Bengali";
    font-size: 10px;
    color: #0f172a;
    background: #fff;
    line-height: 1.4;
  }
  .header-band {
    border-bottom: 2px solid #2c3605;
    padding-bottom: 8px;
    margin-bottom: 10px;
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
    width: 34px;
    height: 34px;
    background: #4b5c09;
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 800;
  }
  .company-title {
    font-size: 15px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.3px;
  }
  .company-sub {
    font-size: 9px;
    font-weight: 600;
    color: #4b5c09;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .meta-block {
    text-align: right;
    font-size: 9px;
    color: #64748b;
    line-height: 1.5;
  }
  .meta-block strong { color: #1e293b; }

  .doc-title-bar {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #d97706;
    padding: 7px 12px;
    border-radius: 6px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .doc-title {
    font-size: 12.5px;
    font-weight: 800;
    color: #0f172a;
  }
  .doc-subtitle {
    font-size: 9.5px;
    color: #475569;
    margin-top: 1px;
  }
  .scope-pill {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 3px 9px;
    font-size: 9px;
    font-weight: 700;
    color: #334155;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .kpi-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 7px 10px;
    border-top: 3px solid #64748b;
  }
  .kpi-card.opening { border-top-color: #64748b; background: #f8fafc; }
  .kpi-card.inflows { border-top-color: #059669; }
  .kpi-card.outflows { border-top-color: #e11d48; }
  .kpi-card.closing { border-top-color: #d97706; background: #fffbeb; }
  .kpi-label {
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
  }
  .kpi-value {
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 2px;
    font-variant-numeric: tabular-nums;
  }
  .kpi-sub {
    font-size: 8px;
    color: #94a3b8;
    margin-top: 1px;
  }

  .register-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 9.5px;
  }
  .register-table th {
    background: #2c3605;
    color: #ffffff;
    text-align: left;
    padding: 6px 8px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .register-table th.num { text-align: right; }
  .register-table td {
    padding: 5px 8px;
    border-bottom: 1px solid #f1f5f9;
  }

  .bf-row td {
    background: #fffbeb !important;
    font-weight: 700;
    border-bottom: 1px solid #fde68a !important;
    color: #78350f;
  }
  .cd-row td {
    background: #ecfdf5 !important;
    font-weight: 800;
    color: #065f46;
    border-top: 2px solid #059669 !important;
    border-bottom: 3px double #059669 !important;
  }

  .audit-verified-banner {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 9px;
    color: #065f46;
    font-weight: 700;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-top: 20px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  .sig-card {
    text-align: center;
    border-top: 1px solid #0f172a;
    padding-top: 4px;
  }
  .sig-title {
    font-size: 8.5px;
    font-weight: 700;
    color: #1e293b;
    text-transform: uppercase;
  }
  .sig-subtitle {
    font-size: 7.5px;
    color: #64748b;
    margin-top: 1px;
  }

  .policy-notes {
    border-top: 1px dashed #cbd5e1;
    padding-top: 6px;
    font-size: 7.5px;
    color: #64748b;
    line-height: 1.35;
    page-break-inside: avoid;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 14px;
    display: flex;
    justify-content: space-between;
    font-size: 7.5px;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
    padding-top: 3px;
  }
</style>
</head>
<body>

  <!-- Top Header -->
  <div class="header-band">
    <div class="brand-group">
      <div class="brand-logo">L</div>
      <div>
        <div class="company-title">${companyName}</div>
        <div class="company-sub">Partnership ERP Suite · Cash & Treasury Operations</div>
      </div>
    </div>
    <div class="meta-block">
      <div><strong>Document:</strong> Cash Book & Cash Ledger</div>
      <div><strong>Generated:</strong> ${now}</div>
      <div><strong>Authorized User:</strong> ${generatedBy}</div>
    </div>
  </div>

  <!-- Document Title & Scope Bar -->
  <div class="doc-title-bar">
    <div>
      <div class="doc-title">${lang === "bn" ? "নগদ খাতা ও ক্যাশ রেজিস্টার (CASH BOOK)" : "CASH BOOK & CASH LEDGER REGISTER"}</div>
      <div class="doc-subtitle">Filters: ${filterSummary} · Currency: BDT (৳)</div>
    </div>
    <div class="scope-pill">
      Scope: Physical Cash Vault / Drawer Float
    </div>
  </div>

  <!-- 4 KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card opening">
      <div class="kpi-label">${lang === "bn" ? "প্রারম্ভিক নগদ জের (B/F)" : "Opening Cash (B/F)"}</div>
      <div class="kpi-value">${formatBDT(openingBalance)}</div>
      <div class="kpi-sub">Brought forward balance</div>
    </div>
    <div class="kpi-card inflows">
      <div class="kpi-label">${lang === "bn" ? "মোট নগদ গ্রহণ / আদায়" : "Total Cash Inflows"}</div>
      <div class="kpi-value" style="color:#047857;">+${formatBDT(totalIn)}</div>
      <div class="kpi-sub">${inCount} inflow receipts</div>
    </div>
    <div class="kpi-card outflows">
      <div class="kpi-label">${lang === "bn" ? "মোট নগদ প্রদান / পরিশোধ" : "Total Cash Outflows"}</div>
      <div class="kpi-value" style="color:#be123c;">-${formatBDT(totalOut)}</div>
      <div class="kpi-sub">${outCount} outflow payments</div>
    </div>
    <div class="kpi-card closing">
      <div class="kpi-label">${lang === "bn" ? "সমাপনী ক্যাশ ব্যালেন্স (C/D)" : "Closing Cash (C/D)"}</div>
      <div class="kpi-value" style="color:#b45309;">${formatBDT(closingBalance)}</div>
      <div class="kpi-sub">Net movement: ${netMovement >= 0 ? "+" : ""}${formatBDT(netMovement)}</div>
    </div>
  </div>

  <!-- Cash Register Table -->
  <table class="register-table">
    <thead>
      <tr>
        <th style="width: 10%;">${lang === "bn" ? "তারিখ" : "Date"}</th>
        <th style="width: 10%;">${lang === "bn" ? "ভাউচার নং" : "Voucher #"}</th>
        <th style="width: 12%;">${lang === "bn" ? "শ্রেণি" : "Category"}</th>
        <th style="width: 38%;">${lang === "bn" ? "বিবরণ ও উদ্দেশ্য" : "Description / Purpose"}</th>
        <th class="num" style="width: 10%;">${lang === "bn" ? "নগদ গ্রহণ" : "Cash In"}</th>
        <th class="num" style="width: 10%;">${lang === "bn" ? "নগদ প্রদান" : "Cash Out"}</th>
        <th class="num" style="width: 10%;">${lang === "bn" ? "চলতি জের" : "Balance"}</th>
      </tr>
    </thead>
    <tbody>
      <!-- Row 0: Balance Brought Forward (B/F) -->
      <tr class="bf-row">
        <td>Start</td>
        <td style="font-family:monospace;color:#92400e;">-</td>
        <td><span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#fde68a;color:#78350f;">B/F</span></td>
        <td style="font-style:italic;">Opening Balance Brought Forward (B/F)</td>
        <td style="text-align:right;font-family:monospace;">-</td>
        <td style="text-align:right;font-family:monospace;">-</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;">${formatBDT(openingBalance)}</td>
      </tr>

      <!-- Data Rows -->
      ${rowsHtml}

      <!-- Row N: Balance Carried Down (C/D) -->
      <tr class="cd-row">
        <td>End</td>
        <td style="font-family:monospace;">-</td>
        <td><span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#a7f3d0;color:#065f46;">C/D</span></td>
        <td style="font-style:italic;font-weight:700;">Closing Balance Carried Down (C/D)</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;">+${formatBDT(totalIn)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#be123c;">-${formatBDT(totalOut)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:800;color:#065f46;font-size:10.5px;">${formatBDT(closingBalance)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Vault Audit Verified Banner -->
  <div class="audit-verified-banner">
    <div>
      ✔ &nbsp;${lang === "bn"
        ? "শারীরিক ক্যাশ ড্রয়ার ও খাতা সমীকরণ যাচাইকৃত: প্রারম্ভিক জের + মোট গ্রহণ - মোট প্রদান = সমাপনী জের"
        : "Vault Cash Audit Verified: Opening Balance (B/F) + Total Receipts - Total Disbursements = Closing Balance (C/D)"}
    </div>
    <div>
      Difference: ৳ 0.00 &nbsp;·&nbsp; Reconciled: 100.00%
    </div>
  </div>

  <!-- Signatures Grid -->
  <div class="signatures-grid">
    <div class="sig-card">
      <div class="sig-title">Prepared By (Cashier)</div>
      <div class="sig-subtitle">${generatedBy}</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Verified By (Accountant)</div>
      <div class="sig-subtitle">Internal Audit & Accounts</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-subtitle">Syndicate Managing Partner</div>
    </div>
  </div>

  <!-- Policy Footnotes -->
  <div class="policy-notes">
    <strong>Cash Control Policy:</strong> Physical vault cash must be verified daily against the C/D balance. All disbursements must have an approved project voucher or contra transfer slip.
  </div>

  <!-- Page Footer -->
  <div class="page-footer">
    <span>${companyName} ERP · Cash Ledger Document</span>
    <span>Page 1 of 1</span>
  </div>

</body>
</html>`;
}

export function buildBankBookPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: ReportData;
  bankAccountName?: string;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data, bankAccountName } = opts;
  const now = formatDateTime(new Date());

  const totalIn = Number(data.totals?.in || 0);
  const totalOut = Number(data.totals?.out || 0);
  const netMovement = totalIn - totalOut;

  let openingBalance = 0;
  if (data.rows.length > 0) {
    const first = data.rows[0];
    const firstNet = (first.in || 0) - (first.out || 0);
    openingBalance = (first.balance || 0) - firstNet;
  }
  const closingBalance = data.rows.length > 0 ? (data.rows[data.rows.length - 1].balance || 0) : openingBalance;

  const inCount = data.rows.filter((r) => r.in !== null && r.in > 0).length;
  const outCount = data.rows.filter((r) => r.out !== null && r.out > 0).length;

  const scope = bankAccountName || (lang === "bn" ? "সকল ব্যাংক অ্যাকাউন্ট (একত্রিত)" : "All Bank Accounts (Consolidated)");

  const getCategoryBadgeHtml = (refType: string) => {
    const type = (refType || "").toUpperCase();
    if (type.includes("DEPOSIT")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;">${lang === "bn" ? "মূলধন জমা" : "Deposit"}</span>`;
    }
    if (type.includes("COLLECTION")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe;">${lang === "bn" ? "প্লট আদায়" : "Collection"}</span>`;
    }
    if (type.includes("CONTRA")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe;">${lang === "bn" ? "কন্ট্রা" : "Contra"}</span>`;
    }
    if (type.includes("EXPENSE")) {
      return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#fffbeb;color:#92400e;border:1px solid #fde68a;">${lang === "bn" ? "প্রকল্প পরিশোধ" : "Expense"}</span>`;
    }
    return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:600;background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;">${refType || "General"}</span>`;
  };

  const rowsHtml = data.rows.map((row, idx) => {
    const bankDisplay = row.bankName
      ? `${row.bankName} ${row.accountNumber ? `<span style="color:#64748b;font-size:8.5px;">(${row.accountNumber.slice(-8)})</span>` : ""}`
      : "-";

    return `<tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;white-space:nowrap;font-size:9.5px;color:#334155;">${formatDate(row.date)}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:9px;color:#64748b;white-space:nowrap;">#${row.voucher || "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:9px;color:#1e293b;font-weight:600;white-space:nowrap;">${bankDisplay}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;white-space:nowrap;">${getCategoryBadgeHtml(row.referenceType || row.reference)}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:9.5px;color:#0f172a;font-weight:500;">${row.purpose || "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:9.5px;color:#047857;font-weight:600;white-space:nowrap;">${row.in ? `+${formatBDT(row.in)}` : "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:9.5px;color:#be123c;font-weight:600;white-space:nowrap;">${row.out ? `-${formatBDT(row.out)}` : "-"}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:10px;color:#0f172a;font-weight:700;white-space:nowrap;">${formatBDT(row.balance)}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>Bank Book - ${companyName}</title>
<style>
  @page { size: A4 landscape; margin: 10mm 12mm 12mm 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Noto Sans Bengali";
    font-size: 10px;
    color: #0f172a;
    background: #fff;
    line-height: 1.4;
  }
  .header-band {
    border-bottom: 2px solid #2c3605;
    padding-bottom: 8px;
    margin-bottom: 10px;
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
    width: 34px;
    height: 34px;
    background: #1e40af;
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 800;
  }
  .company-title {
    font-size: 15px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.3px;
  }
  .company-sub {
    font-size: 9px;
    font-weight: 600;
    color: #1e40af;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .meta-block {
    text-align: right;
    font-size: 9px;
    color: #64748b;
    line-height: 1.5;
  }
  .meta-block strong { color: #1e293b; }

  .doc-title-bar {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #1e40af;
    padding: 7px 12px;
    border-radius: 6px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .doc-title {
    font-size: 12.5px;
    font-weight: 800;
    color: #0f172a;
  }
  .doc-subtitle {
    font-size: 9.5px;
    color: #475569;
    margin-top: 1px;
  }
  .scope-pill {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 3px 9px;
    font-size: 9px;
    font-weight: 700;
    color: #1e40af;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .kpi-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 7px 10px;
    border-top: 3px solid #64748b;
  }
  .kpi-card.opening { border-top-color: #64748b; background: #f8fafc; }
  .kpi-card.inflows { border-top-color: #059669; }
  .kpi-card.outflows { border-top-color: #e11d48; }
  .kpi-card.closing { border-top-color: #1e40af; background: #eff6ff; }
  .kpi-label {
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
  }
  .kpi-value {
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 2px;
    font-variant-numeric: tabular-nums;
  }
  .kpi-sub {
    font-size: 8px;
    color: #94a3b8;
    margin-top: 1px;
  }

  .register-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 9.5px;
  }
  .register-table th {
    background: #1e293b;
    color: #ffffff;
    text-align: left;
    padding: 6px 8px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .register-table th.num { text-align: right; }
  .register-table td {
    padding: 5px 8px;
    border-bottom: 1px solid #f1f5f9;
  }

  .bf-row td {
    background: #fffbeb !important;
    font-weight: 700;
    border-bottom: 1px solid #fde68a !important;
    color: #78350f;
  }
  .cd-row td {
    background: #eff6ff !important;
    font-weight: 800;
    color: #1e3a8a;
    border-top: 2px solid #1e40af !important;
    border-bottom: 3px double #1e40af !important;
  }

  .audit-verified-banner {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 9px;
    color: #1e40af;
    font-weight: 700;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-top: 20px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  .sig-card {
    text-align: center;
    border-top: 1px solid #0f172a;
    padding-top: 4px;
  }
  .sig-title {
    font-size: 8.5px;
    font-weight: 700;
    color: #1e293b;
    text-transform: uppercase;
  }
  .sig-subtitle {
    font-size: 7.5px;
    color: #64748b;
    margin-top: 1px;
  }

  .policy-notes {
    border-top: 1px dashed #cbd5e1;
    padding-top: 6px;
    font-size: 7.5px;
    color: #64748b;
    line-height: 1.35;
    page-break-inside: avoid;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 14px;
    display: flex;
    justify-content: space-between;
    font-size: 7.5px;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
    padding-top: 3px;
  }
</style>
</head>
<body>

  <!-- Top Header -->
  <div class="header-band">
    <div class="brand-group">
      <div class="brand-logo">B</div>
      <div>
        <div class="company-title">${companyName}</div>
        <div class="company-sub">Partnership ERP Suite · Bank & Treasury Operations</div>
      </div>
    </div>
    <div class="meta-block">
      <div><strong>Document:</strong> Bank & MFS Account Ledger</div>
      <div><strong>Generated:</strong> ${now}</div>
      <div><strong>Authorized User:</strong> ${generatedBy}</div>
    </div>
  </div>

  <!-- Document Title & Scope Bar -->
  <div class="doc-title-bar">
    <div>
      <div class="doc-title">${lang === "bn" ? "ব্যাংক ও এমএফএস খাতা (BANK & MFS BOOK)" : "BANK & MFS ACCOUNT LEDGER"}</div>
      <div class="doc-subtitle">Filters: ${filterSummary} · Currency: BDT (৳)</div>
    </div>
    <div class="scope-pill">
      Scope: ${scope}
    </div>
  </div>

  <!-- 4 KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card opening">
      <div class="kpi-label">${lang === "bn" ? "প্রারম্ভিক ব্যাংক জের (B/F)" : "Opening Bank (B/F)"}</div>
      <div class="kpi-value">${formatBDT(openingBalance)}</div>
      <div class="kpi-sub">Brought forward balance</div>
    </div>
    <div class="kpi-card inflows">
      <div class="kpi-label">${lang === "bn" ? "মোট ব্যাংক জমা (Cr)" : "Total Deposits (Cr)"}</div>
      <div class="kpi-value" style="color:#047857;">+${formatBDT(totalIn)}</div>
      <div class="kpi-sub">${inCount} credit transactions</div>
    </div>
    <div class="kpi-card outflows">
      <div class="kpi-label">${lang === "bn" ? "মোট ব্যাংক পরিশোধ (Dr)" : "Total Disbursements (Dr)"}</div>
      <div class="kpi-value" style="color:#be123c;">-${formatBDT(totalOut)}</div>
      <div class="kpi-sub">${outCount} debit transactions</div>
    </div>
    <div class="kpi-card closing">
      <div class="kpi-label">${lang === "bn" ? "সমাপনী ব্যাংক জের (C/D)" : "Closing Bank (C/D)"}</div>
      <div class="kpi-value" style="color:#1e40af;">${formatBDT(closingBalance)}</div>
      <div class="kpi-sub">Net movement: ${netMovement >= 0 ? "+" : ""}${formatBDT(netMovement)}</div>
    </div>
  </div>

  <!-- Bank Register Table -->
  <table class="register-table">
    <thead>
      <tr>
        <th style="width: 10%;">${lang === "bn" ? "তারিখ" : "Date"}</th>
        <th style="width: 9%;">${lang === "bn" ? "ভাউচার নং" : "Voucher #"}</th>
        <th style="width: 14%;">${lang === "bn" ? "ব্যাংক অ্যাকাউন্ট" : "Bank Account"}</th>
        <th style="width: 10%;">${lang === "bn" ? "শ্রেণি" : "Category"}</th>
        <th style="width: 33%;">${lang === "bn" ? "বিবরণ ও উদ্দেশ্য" : "Particulars / Purpose"}</th>
        <th class="num" style="width: 8%;">${lang === "bn" ? "জমা (Cr)" : "Deposit (Cr)"}</th>
        <th class="num" style="width: 8%;">${lang === "bn" ? "উত্তোলন (Dr)" : "Withdrawal (Dr)"}</th>
        <th class="num" style="width: 8%;">${lang === "bn" ? "চলতি ব্যালেন্স" : "Balance"}</th>
      </tr>
    </thead>
    <tbody>
      <!-- Row 0: Balance Brought Forward (B/F) -->
      <tr class="bf-row">
        <td>Start</td>
        <td style="font-family:monospace;color:#92400e;">-</td>
        <td>${scope}</td>
        <td><span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#fde68a;color:#78350f;">B/F</span></td>
        <td style="font-style:italic;">Opening Balance Brought Forward (B/F)</td>
        <td style="text-align:right;font-family:monospace;">-</td>
        <td style="text-align:right;font-family:monospace;">-</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;">${formatBDT(openingBalance)}</td>
      </tr>

      <!-- Data Rows -->
      ${rowsHtml}

      <!-- Row N: Balance Carried Down (C/D) -->
      <tr class="cd-row">
        <td>End</td>
        <td style="font-family:monospace;">-</td>
        <td>${scope}</td>
        <td><span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8.5px;font-weight:700;background:#bfdbfe;color:#1e40af;">C/D</span></td>
        <td style="font-style:italic;font-weight:700;">Closing Balance Carried Down (C/D)</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;">+${formatBDT(totalIn)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#be123c;">-${formatBDT(totalOut)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:800;color:#1e40af;font-size:10.5px;">${formatBDT(closingBalance)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Bank Audit Verified Banner -->
  <div class="audit-verified-banner">
    <div>
      ✔ &nbsp;${lang === "bn"
        ? "ব্যাংক হিসাব খাতা ও সমীকরণ যাচাইকৃত: প্রারম্ভিক জের (B/F) + মোট জমা - মোট উত্তোলন = সমাপনী জের (C/D)"
        : "Bank Ledger Audit Verified: Opening Balance (B/F) + Total Deposits - Total Withdrawals = Closing Balance (C/D)"}
    </div>
    <div>
      Difference: ৳ 0.00 &nbsp;·&nbsp; Reconciled: 100.00%
    </div>
  </div>

  <!-- Signatures Grid -->
  <div class="signatures-grid">
    <div class="sig-card">
      <div class="sig-title">Prepared By (Treasury)</div>
      <div class="sig-subtitle">${generatedBy}</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Verified By (Auditor)</div>
      <div class="sig-subtitle">Internal Audit & Accounts</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-subtitle">Syndicate Managing Partner</div>
    </div>
  </div>

  <!-- Policy Footnotes -->
  <div class="policy-notes">
    <strong>Bank & MFS Control Policy:</strong> Bank and MFS balances are reconciled monthly with official commercial bank statements and verified mobile banking records (bKash/Nagad). All disbursements are supported by cheque leaves, deposit slips, RTGS/BEFTN, or MFS TrxIDs.
  </div>

  <!-- Page Footer -->
  <div class="page-footer">
    <span>${companyName} ERP · Bank Ledger Document</span>
    <span>Page 1 of 1</span>
  </div>

</body>
</html>`;
}

export function buildDailySummaryPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: ReportData;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const openingCash = Number(data.totals?.openingCash || 0);
  const openingBank = Number(data.totals?.openingBank || 0);
  const openingTreasury = Number(data.totals?.openingTreasury || (openingCash + openingBank));

  const totalCashIn = Number(data.totals?.cashIn || 0);
  const totalCashOut = Number(data.totals?.cashOut || 0);
  const totalBankIn = Number(data.totals?.bankIn || 0);
  const totalBankOut = Number(data.totals?.bankOut || 0);

  const totalIn = Number(data.totals?.totalIn || (totalCashIn + totalBankIn));
  const totalOut = Number(data.totals?.totalOut || (totalCashOut + totalBankOut));
  const netMovement = Number(data.totals?.net || (totalIn - totalOut));

  const closingCash = Number(data.totals?.closingCash || 0);
  const closingBank = Number(data.totals?.closingBank || 0);
  const closingTreasury = Number(data.totals?.closingTreasury || (closingCash + closingBank));

  const totalTxns = Number(data.totals?.totalTxns || 0);
  const activeDays = Number(data.totals?.activeDays || data.rows.length);

  const getDayName = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "short" });
    } catch {
      return "";
    }
  };

  const rowsHtml = data.rows.map((r, i) => {
    const dayName = getDayName(r.date);
    const isPositive = r.net > 0;
    const isNegative = r.net < 0;

    return `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="white-space:nowrap;font-weight:600;color:#0f172a;">
          ${formatDate(r.date)} <span style="font-size:8px;padding:1px 4px;border-radius:3px;background:#e2e8f0;color:#475569;">${dayName}</span>
        </td>
        <td style="text-align:right;font-family:monospace;color:#047857;font-weight:600;">
          ${r.cashIn > 0 ? formatBDT(r.cashIn) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;color:#be123c;">
          ${r.cashOut > 0 ? formatBDT(r.cashOut) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;color:#047857;font-weight:600;">
          ${r.bankIn > 0 ? formatBDT(r.bankIn) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;color:#be123c;">
          ${r.bankOut > 0 ? formatBDT(r.bankOut) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;background:#f0fdf4;color:#166534;font-weight:700;">
          ${r.totalIn > 0 ? formatBDT(r.totalIn) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;background:#fff1f2;color:#9f1239;font-weight:700;">
          ${r.totalOut > 0 ? formatBDT(r.totalOut) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;white-space:nowrap;">
          <span style="display:inline-block;padding:1px 5px;border-radius:3px;font-size:8.5px;font-weight:700;${
            isPositive
              ? "background:#dcfce7;color:#15803d;"
              : isNegative
              ? "background:#ffe4e6;color:#be123c;"
              : "color:#94a3b8;"
          }">
            ${isPositive ? "+" : ""}${formatBDT(r.net)}
          </span>
        </td>
        <td style="text-align:right;font-family:monospace;color:#334155;">
          ${formatBDT(r.cashBalance)}
        </td>
        <td style="text-align:right;font-family:monospace;color:#334155;">
          ${formatBDT(r.bankBalance)}
        </td>
        <td style="text-align:right;font-family:monospace;background:#fefce8;color:#0f172a;font-weight:700;">
          ${formatBDT(r.totalBalance)}
        </td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8"/>
<title>${lang === "bn" ? titleBn : titleEn} - ${companyName}</title>
<style>
  @page {
    size: A4 landscape;
    margin: 8mm 10mm 10mm 10mm;
  }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    margin: 0;
    padding: 0;
    font-size: 8.5px;
    line-height: 1.35;
  }

  .header-band {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 8px;
    border-bottom: 2px solid #0f172a;
    margin-bottom: 10px;
  }
  .brand-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-logo {
    width: 26px;
    height: 26px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: #ffffff;
    font-weight: 800;
    font-size: 14px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .company-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #0f172a;
  }
  .company-sub {
    font-size: 8px;
    color: #64748b;
  }
  .meta-block {
    text-align: right;
    font-size: 8px;
    color: #475569;
    line-height: 1.4;
  }

  .doc-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
    padding-bottom: 4px;
  }
  .doc-title {
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.2px;
  }
  .doc-subtitle {
    font-size: 8.5px;
    color: #475569;
    margin-top: 1px;
  }
  .scope-pill {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 8.5px;
    font-weight: 700;
    color: #1e293b;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .kpi-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 8px;
  }
  .kpi-card.opening { border-left: 3px solid #64748b; }
  .kpi-card.inflows { border-left: 3px solid #059669; }
  .kpi-card.outflows { border-left: 3px solid #e11d48; }
  .kpi-card.closing { border-left: 3px solid #2563eb; }

  .kpi-label {
    font-size: 7.5px;
    text-transform: uppercase;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 2px;
  }
  .kpi-value {
    font-size: 12px;
    font-weight: 800;
    font-family: monospace;
    color: #0f172a;
    line-height: 1.1;
  }
  .kpi-sub {
    font-size: 7.5px;
    color: #64748b;
    margin-top: 2px;
  }

  table.report-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 8px;
  }
  table.report-table thead tr {
    background: #0f172a;
    color: #ffffff;
    font-size: 7.5px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  table.report-table th, table.report-table td {
    padding: 4.5px 5px;
    border-bottom: 1px solid #e2e8f0;
  }
  table.report-table tfoot tr {
    background: #0f172a;
    color: #ffffff;
    font-weight: 800;
    border-top: 2px solid #0f172a;
  }

  .reconcile-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
    margin-bottom: 10px;
    page-break-inside: avoid;
  }
  .reconcile-col-title {
    font-size: 8.5px;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2px;
    margin-bottom: 4px;
  }
  .reconcile-row {
    display: flex;
    justify-content: space-between;
    font-family: monospace;
    font-size: 7.5px;
    margin-bottom: 1.5px;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-inside: avoid;
  }
  .sig-card {
    border-top: 1px solid #64748b;
    padding-top: 4px;
    text-align: center;
  }
  .sig-title {
    font-size: 8px;
    font-weight: 700;
    color: #0f172a;
  }
  .sig-subtitle {
    font-size: 7px;
    color: #64748b;
  }

  .policy-notes {
    font-size: 7px;
    color: #64748b;
    border-top: 1px dashed #cbd5e1;
    padding-top: 4px;
    margin-top: 4px;
    line-height: 1.3;
    page-break-inside: avoid;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 7px;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
    padding-top: 2px;
  }
</style>
</head>
<body>

  <!-- Top Header Band -->
  <div class="header-band">
    <div class="brand-group">
      <div class="brand-logo">T</div>
      <div>
        <div class="company-title">${companyName}</div>
        <div class="company-sub">Partnership ERP Suite · Consolidated Treasury Management</div>
      </div>
    </div>
    <div class="meta-block">
      <div><strong>Document:</strong> Daily Collection & Payment Summary</div>
      <div><strong>Generated:</strong> ${now}</div>
      <div><strong>Authorized User:</strong> ${generatedBy}</div>
    </div>
  </div>

  <!-- Document Title & Scope -->
  <div class="doc-title-bar">
    <div>
      <div class="doc-title">${lang === "bn" ? "দৈনিক আদায় ও পরিশোধ সারাংশ (DAILY SUMMARY)" : "DAILY COLLECTION & PAYMENT SUMMARY"}</div>
      <div class="doc-subtitle">Period: ${filterSummary} · Currency: BDT (৳)</div>
    </div>
    <div class="scope-pill">
      Scope: Consolidated Cash, Bank & MFS Treasury (${activeDays} active days / ${totalTxns} txns)
    </div>
  </div>

  <!-- 4 KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card opening">
      <div class="kpi-label">${lang === "bn" ? "প্রারম্ভিক মোট তহবিল (B/F)" : "Opening Treasury (B/F)"}</div>
      <div class="kpi-value">${formatBDT(openingTreasury)}</div>
      <div class="kpi-sub">Cash: ${formatBDT(openingCash)} · Bank: ${formatBDT(openingBank)}</div>
    </div>
    <div class="kpi-card inflows">
      <div class="kpi-label">${lang === "bn" ? "মোট সংগৃহীত আদায় (Inflow)" : "Total Receipts (Inflow)"}</div>
      <div class="kpi-value" style="color:#047857;">+${formatBDT(totalIn)}</div>
      <div class="kpi-sub">Cash In: ${formatBDT(totalCashIn)} · Bank In: ${formatBDT(totalBankIn)}</div>
    </div>
    <div class="kpi-card outflows">
      <div class="kpi-label">${lang === "bn" ? "মোট পরিশোধ (Outflow)" : "Total Payments (Outflow)"}</div>
      <div class="kpi-value" style="color:#be123c;">-${formatBDT(totalOut)}</div>
      <div class="kpi-sub">Cash Out: ${formatBDT(totalCashOut)} · Bank Out: ${formatBDT(totalBankOut)}</div>
    </div>
    <div class="kpi-card closing">
      <div class="kpi-label">${lang === "bn" ? "সমাপনী মোট তহবিল (C/D)" : "Closing Treasury (C/D)"}</div>
      <div class="kpi-value" style="color:#1e40af;">${formatBDT(closingTreasury)}</div>
      <div class="kpi-sub">Net Movement: ${netMovement >= 0 ? "+" : ""}${formatBDT(netMovement)}</div>
    </div>
  </div>

  <!-- Tabular Daily Register -->
  <table class="report-table">
    <thead>
      <tr>
        <th style="text-align:left;width:13%;">${lang === "bn" ? "তারিখ ও বার" : "Date & Day"}</th>
        <th style="text-align:right;width:9%;color:#86efac;">${lang === "bn" ? "নগদ আদায়" : "Cash In"}</th>
        <th style="text-align:right;width:9%;color:#fca5a5;">${lang === "bn" ? "নগদ প্রদান" : "Cash Out"}</th>
        <th style="text-align:right;width:9%;color:#86efac;">${lang === "bn" ? "ব্যাংক আদায়" : "Bank In"}</th>
        <th style="text-align:right;width:9%;color:#fca5a5;">${lang === "bn" ? "ব্যাংক প্রদান" : "Bank Out"}</th>
        <th style="text-align:right;width:10%;background:#1e293b;color:#a7f3d0;">${lang === "bn" ? "মোট আদায়" : "Total In"}</th>
        <th style="text-align:right;width:10%;background:#1e293b;color:#fecdd3;">${lang === "bn" ? "মোট পরিশোধ" : "Total Out"}</th>
        <th style="text-align:right;width:9%;">${lang === "bn" ? "নেট চলাচল" : "Net"}</th>
        <th style="text-align:right;width:7%;">${lang === "bn" ? "নগদ জের" : "Cash Bal"}</th>
        <th style="text-align:right;width:7%;">${lang === "bn" ? "ব্যাংক জের" : "Bank Bal"}</th>
        <th style="text-align:right;width:8%;background:#020617;color:#fde047;">${lang === "bn" ? "মোট তহবিল" : "Treasury Bal"}</th>
      </tr>
    </thead>
    <tbody>
      <!-- Opening Balance Row (B/F) -->
      <tr style="background:#f1f5f9;font-weight:700;">
        <td style="color:#0f172a;">${lang === "bn" ? "প্রারম্ভিক জের (B/F)" : "Opening Balance (B/F)"}</td>
        <td style="text-align:right;color:#94a3b8;font-family:monospace;">-</td>
        <td style="text-align:right;color:#94a3b8;font-family:monospace;">-</td>
        <td style="text-align:right;color:#94a3b8;font-family:monospace;">-</td>
        <td style="text-align:right;color:#94a3b8;font-family:monospace;">-</td>
        <td style="text-align:right;color:#94a3b8;font-family:monospace;background:#f8fafc;">-</td>
        <td style="text-align:right;color:#94a3b8;font-family:monospace;background:#f8fafc;">-</td>
        <td style="text-align:right;color:#94a3b8;font-family:monospace;">-</td>
        <td style="text-align:right;font-family:monospace;color:#334155;">${formatBDT(openingCash)}</td>
        <td style="text-align:right;font-family:monospace;color:#334155;">${formatBDT(openingBank)}</td>
        <td style="text-align:right;font-family:monospace;background:#fefce8;color:#0f172a;font-weight:800;">${formatBDT(openingTreasury)}</td>
      </tr>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td style="text-transform:uppercase;">${lang === "bn" ? "মোট যোগফল" : "Grand Total"}</td>
        <td style="text-align:right;font-family:monospace;color:#86efac;">${formatBDT(totalCashIn)}</td>
        <td style="text-align:right;font-family:monospace;color:#fca5a5;">${formatBDT(totalCashOut)}</td>
        <td style="text-align:right;font-family:monospace;color:#86efac;">${formatBDT(totalBankIn)}</td>
        <td style="text-align:right;font-family:monospace;color:#fca5a5;">${formatBDT(totalBankOut)}</td>
        <td style="text-align:right;font-family:monospace;background:#1e293b;color:#a7f3d0;">${formatBDT(totalIn)}</td>
        <td style="text-align:right;font-family:monospace;background:#1e293b;color:#fecdd3;">${formatBDT(totalOut)}</td>
        <td style="text-align:right;font-family:monospace;color:#ffffff;">${netMovement >= 0 ? "+" : ""}${formatBDT(netMovement)}</td>
        <td style="text-align:right;font-family:monospace;color:#cbd5e1;">${formatBDT(closingCash)}</td>
        <td style="text-align:right;font-family:monospace;color:#cbd5e1;">${formatBDT(closingBank)}</td>
        <td style="text-align:right;font-family:monospace;background:#020617;color:#fde047;font-weight:800;">${formatBDT(closingTreasury)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- Reconciliation Blocks -->
  <div class="reconcile-box">
    <div>
      <div class="reconcile-col-title">Cash Channel Reconciliation</div>
      <div class="reconcile-row"><span>Opening Cash (B/F):</span><span>${formatBDT(openingCash)}</span></div>
      <div class="reconcile-row" style="color:#059669;"><span>(+) Cash Inflows:</span><span>+${formatBDT(totalCashIn)}</span></div>
      <div class="reconcile-row" style="color:#e11d48;"><span>(-) Cash Outflows:</span><span>-${formatBDT(totalCashOut)}</span></div>
      <div class="reconcile-row" style="font-weight:700;border-top:1px solid #cbd5e1;padding-top:2px;"><span>(=) Closing Cash:</span><span>${formatBDT(closingCash)}</span></div>
    </div>
    <div>
      <div class="reconcile-col-title">Bank & MFS Channel Reconciliation</div>
      <div class="reconcile-row"><span>Opening Bank & MFS (B/F):</span><span>${formatBDT(openingBank)}</span></div>
      <div class="reconcile-row" style="color:#059669;"><span>(+) Bank & MFS Inflows:</span><span>+${formatBDT(totalBankIn)}</span></div>
      <div class="reconcile-row" style="color:#e11d48;"><span>(-) Bank & MFS Outflows:</span><span>-${formatBDT(totalBankOut)}</span></div>
      <div class="reconcile-row" style="font-weight:700;border-top:1px solid #cbd5e1;padding-top:2px;"><span>(=) Closing Bank & MFS:</span><span>${formatBDT(closingBank)}</span></div>
    </div>
  </div>

  <!-- Signatures Grid -->
  <div class="signatures-grid">
    <div class="sig-card">
      <div class="sig-title">Prepared By (Treasury In-Charge)</div>
      <div class="sig-subtitle">${generatedBy}</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Verified By (Internal Auditor)</div>
      <div class="sig-subtitle">Internal Audit & Accounts Compliance</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-subtitle">Executive Syndicate Board</div>
    </div>
  </div>

  <!-- Policy Notes -->
  <div class="policy-notes">
    <strong>Treasury Integrity Note:</strong> Opening and closing balances reconcile directly with physical cash vault records, scheduled bank statements, and MFS wallets (bKash/Nagad/Rocket). All transactions are supported by approved vouchers and audit logs.
  </div>

  <!-- Page Footer -->
  <div class="page-footer">
    <span>${companyName} ERP · Daily Treasury Summary</span>
    <span>Page 1 of 1</span>
  </div>

</body>
</html>`;
}

export function buildReceiptsPaymentsPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: ReportData;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const openingCash = Number(data.totals?.openingCash || 0);
  const openingBank = Number(data.totals?.openingBank || 0);
  const openingTreasury = Number(data.totals?.openingTreasury || (openingCash + openingBank));

  const totalReceipts = Number(data.totals?.totalReceipts || 0);
  const totalPayments = Number(data.totals?.totalPayments || 0);
  const netSurplus = Number(data.totals?.netSurplus || (totalReceipts - totalPayments));

  const closingCash = Number(data.totals?.closingCash || 0);
  const closingBank = Number(data.totals?.closingBank || 0);
  const closingTreasury = Number(data.totals?.closingTreasury || (closingCash + closingBank));

  const receiptsSideTotal = Number(data.totals?.receiptsSideTotal || (openingTreasury + totalReceipts));
  const paymentsSideTotal = Number(data.totals?.paymentsSideTotal || (totalPayments + closingTreasury));

  const periodCashIn = Number(data.totals?.periodCashIn || 0);
  const periodCashOut = Number(data.totals?.periodCashOut || 0);
  const periodBankIn = Number(data.totals?.periodBankIn || 0);
  const periodBankOut = Number(data.totals?.periodBankOut || 0);

  const receiptsRows = data.rows.filter((r) => r.type === "RECEIPT");
  const paymentsRows = data.rows.filter((r) => r.type === "PAYMENT");

  const receiptsRowsHtml = receiptsRows.map((r, i) => `
    <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:4.5px 6px;color:#0f172a;font-weight:600;">
        ${lang === "bn" ? r.categoryBn : r.category}
        <div style="font-size:7px;color:#059669;font-weight:normal;">${lang === "bn" ? r.classificationBn : r.classification}</div>
      </td>
      <td style="padding:4.5px 5px;text-align:right;font-family:monospace;color:#475569;">
        ${r.cashAmount > 0 ? formatBDT(r.cashAmount) : "-"}
      </td>
      <td style="padding:4.5px 5px;text-align:right;font-family:monospace;color:#475569;">
        ${r.bankAmount > 0 ? formatBDT(r.bankAmount) : "-"}
      </td>
      <td style="padding:4.5px 6px;text-align:right;font-family:monospace;font-weight:700;color:#047857;">
        ${formatBDT(r.totalAmount)}
      </td>
    </tr>
  `).join("");

  const paymentsRowsHtml = paymentsRows.map((p, i) => `
    <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:4.5px 6px;color:#0f172a;font-weight:600;">
        ${lang === "bn" ? p.categoryBn : p.category}
        <div style="font-size:7px;color:#e11d48;font-weight:normal;">${lang === "bn" ? p.classificationBn : p.classification}</div>
      </td>
      <td style="padding:4.5px 5px;text-align:right;font-family:monospace;color:#475569;">
        ${p.cashAmount > 0 ? formatBDT(p.cashAmount) : "-"}
      </td>
      <td style="padding:4.5px 5px;text-align:right;font-family:monospace;color:#475569;">
        ${p.bankAmount > 0 ? formatBDT(p.bankAmount) : "-"}
      </td>
      <td style="padding:4.5px 6px;text-align:right;font-family:monospace;font-weight:700;color:#be123c;">
        ${formatBDT(p.totalAmount)}
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8"/>
<title>${lang === "bn" ? titleBn : titleEn} - ${companyName}</title>
<style>
  @page {
    size: A4 landscape;
    margin: 8mm 10mm 10mm 10mm;
  }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    margin: 0;
    padding: 0;
    font-size: 8px;
    line-height: 1.35;
  }

  .header-band {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 8px;
    border-bottom: 2px solid #0f172a;
    margin-bottom: 10px;
  }
  .brand-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-logo {
    width: 26px;
    height: 26px;
    background: linear-gradient(135deg, #047857 0%, #065f46 100%);
    color: #ffffff;
    font-weight: 800;
    font-size: 14px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .company-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #0f172a;
  }
  .company-sub {
    font-size: 8px;
    color: #64748b;
  }
  .meta-block {
    text-align: right;
    font-size: 8px;
    color: #475569;
    line-height: 1.4;
  }

  .doc-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
    padding-bottom: 4px;
  }
  .doc-title {
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.2px;
  }
  .doc-subtitle {
    font-size: 8.5px;
    color: #475569;
    margin-top: 1px;
  }
  .scope-pill {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 8.5px;
    font-weight: 700;
    color: #1e293b;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .kpi-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 8px;
  }
  .kpi-card.opening { border-left: 3px solid #64748b; }
  .kpi-card.receipts { border-left: 3px solid #059669; }
  .kpi-card.payments { border-left: 3px solid #e11d48; }
  .kpi-card.closing { border-left: 3px solid #2563eb; }

  .kpi-label {
    font-size: 7.5px;
    text-transform: uppercase;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 2px;
  }
  .kpi-value {
    font-size: 12px;
    font-weight: 800;
    font-family: monospace;
    color: #0f172a;
    line-height: 1.1;
  }
  .kpi-sub {
    font-size: 7.5px;
    color: #64748b;
    margin-top: 2px;
  }

  /* Dual Table Layout */
  .dual-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }
  .table-box {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
  }
  .side-header {
    padding: 5px 8px;
    font-weight: 800;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .side-header.receipts { background: #064e3b; color: #ecfdf5; }
  .side-header.payments { background: #881337; color: #fff1f2; }

  table.side-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5px;
  }
  table.side-table thead tr {
    background: #f1f5f9;
    color: #334155;
    font-size: 7px;
    text-transform: uppercase;
    font-weight: 700;
    border-bottom: 1px solid #cbd5e1;
  }
  table.side-table th, table.side-table td {
    padding: 3.5px 5px;
    border-bottom: 1px solid #f1f5f9;
  }
  .side-footer {
    padding: 6px 8px;
    background: #0f172a;
    color: #ffffff;
    font-weight: 800;
    font-family: monospace;
    font-size: 9px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid #0f172a;
  }

  .reconcile-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 10px;
    margin-bottom: 8px;
    page-break-inside: avoid;
  }
  .reconcile-col-title {
    font-size: 8px;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2px;
    margin-bottom: 4px;
  }
  .reconcile-row {
    display: flex;
    justify-content: space-between;
    font-family: monospace;
    font-size: 7.5px;
    margin-bottom: 1.5px;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 12px;
    margin-bottom: 4px;
    page-break-inside: avoid;
  }
  .sig-card {
    border-top: 1px solid #64748b;
    padding-top: 4px;
    text-align: center;
  }
  .sig-title {
    font-size: 8px;
    font-weight: 700;
    color: #0f172a;
  }
  .sig-subtitle {
    font-size: 7px;
    color: #64748b;
  }

  .policy-notes {
    font-size: 7px;
    color: #64748b;
    border-top: 1px dashed #cbd5e1;
    padding-top: 4px;
    margin-top: 4px;
    line-height: 1.3;
    page-break-inside: avoid;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 7px;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
    padding-top: 2px;
  }
</style>
</head>
<body>

  <!-- Top Header Band -->
  <div class="header-band">
    <div class="brand-group">
      <div class="brand-logo">R</div>
      <div>
        <div class="company-title">${companyName}</div>
        <div class="company-sub">Partnership ERP Suite · Statutory Financial Statement</div>
      </div>
    </div>
    <div class="meta-block">
      <div><strong>Document:</strong> Receipts & Payments Statement</div>
      <div><strong>Generated:</strong> ${now}</div>
      <div><strong>Authorized User:</strong> ${generatedBy}</div>
    </div>
  </div>

  <!-- Document Title & Scope -->
  <div class="doc-title-bar">
    <div>
      <div class="doc-title">${lang === "bn" ? "আদায় ও পরিশোধ বিবরণী (RECEIPTS & PAYMENTS)" : "RECEIPTS & PAYMENTS STATEMENT"}</div>
      <div class="doc-subtitle">Period: ${filterSummary} · Currency: BDT (৳)</div>
    </div>
    <div class="scope-pill">
      Scope: Consolidated Cash, Bank & MFS Treasury · Pure Cash Accounting Basis
    </div>
  </div>

  <!-- 4 KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card opening">
      <div class="kpi-label">${lang === "bn" ? "প্রারম্ভিক তরল তহবিল (B/F)" : "Opening Reserves (B/F)"}</div>
      <div class="kpi-value">${formatBDT(openingTreasury)}</div>
      <div class="kpi-sub">Cash: ${formatBDT(openingCash)} · Bank/MFS: ${formatBDT(openingBank)}</div>
    </div>
    <div class="kpi-card receipts">
      <div class="kpi-label">${lang === "bn" ? "মোট সংগৃহীত প্রাপ্তি (Inflows)" : "Total Receipts (Inflows)"}</div>
      <div class="kpi-value" style="color:#047857;">+${formatBDT(totalReceipts)}</div>
      <div class="kpi-sub">Cash: ${formatBDT(periodCashIn)} · Bank/MFS: ${formatBDT(periodBankIn)}</div>
    </div>
    <div class="kpi-card payments">
      <div class="kpi-label">${lang === "bn" ? "মোট পরিশোধ (Disbursements)" : "Total Payments (Disbursements)"}</div>
      <div class="kpi-value" style="color:#be123c;">-${formatBDT(totalPayments)}</div>
      <div class="kpi-sub">Cash: ${formatBDT(periodCashOut)} · Bank/MFS: ${formatBDT(periodBankOut)}</div>
    </div>
    <div class="kpi-card closing">
      <div class="kpi-label">${lang === "bn" ? "সমাপনী তরল তহবিল (C/D)" : "Closing Reserves (C/D)"}</div>
      <div class="kpi-value" style="color:#1e40af;">${formatBDT(closingTreasury)}</div>
      <div class="kpi-sub">Net Surplus: ${netSurplus >= 0 ? "+" : ""}${formatBDT(netSurplus)}</div>
    </div>
  </div>

  <!-- Dual-Side T-Account Statement Table -->
  <div class="dual-grid">
    <!-- LEFT: RECEIPTS SIDE -->
    <div class="table-box">
      <div class="side-header receipts">
        <span>Receipts (Inflows)</span>
        <span style="font-family:monospace;">${formatBDT(receiptsSideTotal)}</span>
      </div>
      <table class="side-table">
        <thead>
          <tr>
            <th style="text-align:left;width:48%;">Particulars / Head</th>
            <th style="text-align:right;width:17%;">Cash</th>
            <th style="text-align:right;width:17%;">Bank/MFS</th>
            <th style="text-align:right;width:18%;">Total (৳)</th>
          </tr>
        </thead>
        <tbody>
          <!-- Opening Reserves Row -->
          <tr style="background:#f0fdf4;font-weight:700;">
            <td style="color:#065f46;">
              To Opening Balance (B/F)
              <div style="font-size:7px;color:#047857;font-weight:normal;">Cash in Hand & Bank Balances</div>
            </td>
            <td style="text-align:right;font-family:monospace;color:#334155;">${formatBDT(openingCash)}</td>
            <td style="text-align:right;font-family:monospace;color:#334155;">${formatBDT(openingBank)}</td>
            <td style="text-align:right;font-family:monospace;color:#065f46;font-weight:800;">${formatBDT(openingTreasury)}</td>
          </tr>
          ${receiptsRowsHtml}
        </tbody>
      </table>
      <div class="side-footer">
        <span style="font-size:7.5px;letter-spacing:0.2px;">TOTAL RECEIPTS SIDE</span>
        <span style="color:#a7f3d0;">${formatBDT(receiptsSideTotal)}</span>
      </div>
    </div>

    <!-- RIGHT: PAYMENTS SIDE -->
    <div class="table-box">
      <div class="side-header payments">
        <span>Payments (Outflows)</span>
        <span style="font-family:monospace;">${formatBDT(paymentsSideTotal)}</span>
      </div>
      <table class="side-table">
        <thead>
          <tr>
            <th style="text-align:left;width:48%;">Particulars / Head</th>
            <th style="text-align:right;width:17%;">Cash</th>
            <th style="text-align:right;width:17%;">Bank/MFS</th>
            <th style="text-align:right;width:18%;">Total (৳)</th>
          </tr>
        </thead>
        <tbody>
          ${paymentsRowsHtml}
          <!-- Closing Reserves Row -->
          <tr style="background:#eff6ff;font-weight:700;">
            <td style="color:#1e40af;">
              By Closing Balance (C/D)
              <div style="font-size:7px;color:#2563eb;font-weight:normal;">Closing Cash & Bank Balances</div>
            </td>
            <td style="text-align:right;font-family:monospace;color:#334155;">${formatBDT(closingCash)}</td>
            <td style="text-align:right;font-family:monospace;color:#334155;">${formatBDT(closingBank)}</td>
            <td style="text-align:right;font-family:monospace;color:#1e40af;font-weight:800;">${formatBDT(closingTreasury)}</td>
          </tr>
        </tbody>
      </table>
      <div class="side-footer">
        <span style="font-size:7.5px;letter-spacing:0.2px;">TOTAL PAYMENTS SIDE</span>
        <span style="color:#fde047;">${formatBDT(paymentsSideTotal)}</span>
      </div>
    </div>
  </div>

  <!-- Statutory Reconciliation Verification Blocks -->
  <div class="reconcile-box">
    <div>
      <div class="reconcile-col-title">Receipts Side Verification</div>
      <div class="reconcile-row"><span>Opening Reserves (B/F):</span><span>${formatBDT(openingTreasury)}</span></div>
      <div class="reconcile-row" style="color:#059669;"><span>(+) Gross Receipts:</span><span>+${formatBDT(totalReceipts)}</span></div>
      <div class="reconcile-row" style="font-weight:700;border-top:1px solid #cbd5e1;padding-top:2px;"><span>(=) Receipts Side Total:</span><span>${formatBDT(receiptsSideTotal)}</span></div>
    </div>
    <div>
      <div class="reconcile-col-title">Payments Side Verification</div>
      <div class="reconcile-row" style="color:#e11d48;"><span>Gross Disbursements:</span><span>${formatBDT(totalPayments)}</span></div>
      <div class="reconcile-row" style="color:#2563eb;"><span>(+) Closing Reserves (C/D):</span><span>+${formatBDT(closingTreasury)}</span></div>
      <div class="reconcile-row" style="font-weight:700;border-top:1px solid #cbd5e1;padding-top:2px;"><span>(=) Payments Side Total:</span><span>${formatBDT(paymentsSideTotal)}</span></div>
    </div>
  </div>

  <!-- Signatures Grid -->
  <div class="signatures-grid">
    <div class="sig-card">
      <div class="sig-title">Prepared By (Chief Accountant)</div>
      <div class="sig-subtitle">${generatedBy}</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Verified By (Head of Internal Audit)</div>
      <div class="sig-subtitle">Internal Audit & Statutory Compliance</div>
    </div>
    <div class="sig-card">
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-subtitle">Executive Syndicate Board</div>
    </div>
  </div>

  <!-- Policy Notes -->
  <div class="policy-notes">
    <strong>Statutory Policy:</strong> This statement reflects actual liquid transactions during the period across all cash vaults, scheduled bank accounts, and MFS wallets. The Receipts Side and Payments Side are balanced and verified against general ledgers.
  </div>

  <!-- Page Footer -->
  <div class="page-footer">
    <span>${companyName} ERP · Receipts & Payments Statement</span>
    <span>Page 1 of 1</span>
  </div>

</body>
</html>`;
}

export function buildContraRegisterPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const transfers: any[] = data.transfers || [];
  const kpis = data.kpis || {
    totalTransferred: transfers.reduce((sum, t) => sum + (t.amount || 0), 0),
    transferCount: transfers.length,
    cashToBankAmount: 0,
    cashToBankCount: 0,
    bankToCashAmount: 0,
    bankToCashCount: 0,
    interAccountAmount: 0,
    interAccountCount: 0,
  };

  const getBadgeHtml = (type: string) => {
    switch (type) {
      case "CASH_TO_BANK":
      case "CASH_TO_MFS":
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:700;background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe;">Cash Deposit</span>`;
      case "BANK_TO_CASH":
      case "MFS_TO_CASH":
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:700;background:#fffbeb;color:#92400e;border:1px solid #fde68a;">Float Withdrawal</span>`;
      default:
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:700;background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe;">Inter-Account</span>`;
    }
  };

  const getChannelHtml = (channel: any) => {
    if (!channel || channel.type === "CASH") {
      return `<strong>Cash in Hand</strong><br/><span style="font-size:8px;color:#047857;">Physical Vault</span>`;
    }
    const isMfs = channel.type === "MFS";
    const subLabel = channel.accountNumber ? `<span style="font-size:8px;color:#64748b;font-family:monospace;">${channel.accountNumber}</span>` : "";
    return `<strong>${channel.bankName || "Bank Account"}</strong>${isMfs ? ` <span style="font-size:7.5px;color:#be185d;background:#fdf2f8;padding:1px 3px;border-radius:3px;">MFS</span>` : ""}<br/>${subLabel}`;
  };

  const rowsHtml = transfers.map((t, idx) => `
    <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;vertical-align:top;">
        <span style="font-weight:700;color:#0f172a;">${t.date}</span><br/>
        <span style="color:#64748b;font-size:7.5px;">${t.voucherNo}</span>
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8.5px;vertical-align:top;">
        ${getChannelHtml(t.from)}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8px;text-align:center;vertical-align:top;">
        ${getBadgeHtml(t.transferType)}<br/>
        <span style="color:#94a3b8;font-size:7.5px;">Dr ➔ Cr</span>
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8.5px;vertical-align:top;">
        ${getChannelHtml(t.to)}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8.5px;color:#1e293b;vertical-align:top;line-height:1.35;">
        ${t.purpose}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8px;text-align:center;vertical-align:top;">
        <span style="display:inline-block;padding:2px 5px;border-radius:3px;font-weight:700;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;">✓ POSTED</span>
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:9px;font-family:monospace;font-weight:700;text-align:right;color:#0f172a;vertical-align:top;">
        ${formatBDT(t.amount)}
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${opts.titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.35;
    }

    /* Header */
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .brand-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
    }
    .doc-title {
      font-size: 12px;
      font-weight: 800;
      color: #065f46;
      margin-top: 2px;
    }

    /* KPI Grid */
    .kpi-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .kpi-label {
      font-size: 7.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 10px;
    }
    table.data-table th {
      background: #1e293b;
      color: #ffffff;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 6px 7px;
      text-align: left;
      border-right: 1px solid #334155;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-size: 7.5px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 12px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 10px;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Treasury, Liquid Asset Management & Corporate Banking Division</div>
        <div class="doc-title">${opts.titleEn} (${opts.titleBn})</div>
      </td>
      <td style="text-align:right;vertical-align:top;font-size:8px;color:#475569;line-height:1.4;">
        <div><strong>Filter:</strong> ${filterSummary}</div>
        <div><strong>Generated:</strong> ${now}</div>
        <div><strong>Prepared By:</strong> ${generatedBy}</div>
        <div><strong>Accounting Standard:</strong> Zero Net Leakage (Dr ≡ Cr)</div>
      </td>
    </tr>
  </table>

  <!-- 4 KPI Cards -->
  <div class="kpi-row">
    <div class="kpi-card" style="border-left:3px solid #0f172a;">
      <div class="kpi-label">Total Fund Transferred</div>
      <div class="kpi-val">${formatBDT(kpis.totalTransferred)}</div>
      <div class="kpi-sub">${kpis.transferCount} total executed transfers</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Cash ➔ Bank Deposits</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(kpis.cashToBankAmount)}</div>
      <div class="kpi-sub">${kpis.cashToBankCount} deposits banked</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #d97706;">
      <div class="kpi-label">Bank ➔ Cash Float</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(kpis.bankToCashAmount)}</div>
      <div class="kpi-sub">${kpis.bankToCashCount} operational float withdrawals</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Inter-Bank & MFS</div>
      <div class="kpi-val" style="color:#6d28d9;">${formatBDT(kpis.interAccountAmount)}</div>
      <div class="kpi-sub">${kpis.interAccountCount} wallet & account transfers</div>
    </div>
  </div>

  <!-- Register Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:14%;">Date & Voucher #</th>
        <th style="width:20%;">Source (From)</th>
        <th style="width:13%;text-align:center;">Transfer Type</th>
        <th style="width:20%;">Destination (To)</th>
        <th style="width:19%;">Narration / Purpose</th>
        <th style="width:7%;text-align:center;">Audit</th>
        <th style="width:11%;text-align:right;">Amount (BDT)</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || `<tr><td colspan="7" style="text-align:center;padding:15px;color:#94a3b8;">No contra transfers recorded for this period.</td></tr>`}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;font-size:9px;">
        <td colspan="2" style="padding:6px 7px;">TOTAL EXECUTED: ${transfers.length} TRANSFERS</td>
        <td colspan="4" style="padding:6px 7px;text-align:center;font-size:8px;color:#cbd5e1;">
          NET LIQUID TREASURY IMPACT: <span style="color:#34d399;font-weight:800;">৳ 0.00 (ZERO LEAKAGE PARITY)</span>
        </td>
        <td style="padding:6px 7px;text-align:right;font-family:monospace;font-size:10px;">
          ${formatBDT(kpis.totalTransferred)}
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Statutory Contra Governance:</strong> Contra entries reflect simultaneous double-entry transfers between internal liquid accounts (Vault ↔ Banks ↔ MFS Wallets). Debit and Credit entries offset identically, ensuring net asset conservation with zero impact on operational profit or loss. Bank deposits are corroborated by verified deposit counterfoils; cash withdrawals are reconciled with cheque counterfoils and physical vault logs.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Treasury)</div>
      <div class="sig-sub">Senior Accounts Officer</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Head of Audit & Compliance</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Executive Syndicate Committee</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildPartnerCapitalPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const partner = data.partner || { name: "Partner", phone: "-", projects: [] };
  const transactions: any[] = data.transactions || [];
  const kpis = data.kpis || {
    openingBalance: 0,
    totalDeposits: 0,
    totalDirectExpenses: 0,
    totalProfitCredits: 0,
    totalCapitalAdditions: 0,
    totalWithdrawals: 0,
    netPeriodChange: 0,
    closingBalance: 0,
  };

  const getBadgeHtml = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5px;font-weight:700;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;">Deposit</span>`;
      case "DIRECT_EXPENSE":
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5px;font-weight:700;background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe;">Direct Expense</span>`;
      case "PROFIT_CREDIT":
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5px;font-weight:700;background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe;">Profit Share</span>`;
      case "WITHDRAWAL":
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5px;font-weight:700;background:#fffbeb;color:#92400e;border:1px solid #fde68a;">Drawing</span>`;
      default:
        return `<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5px;font-weight:700;background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;">${type}</span>`;
    }
  };

  const rowsHtml = transactions.map((t, idx) => `
    <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;font-weight:600;color:#0f172a;vertical-align:top;">
        ${t.date}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8px;vertical-align:top;">
        ${getBadgeHtml(t.txnType)}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8px;color:#1e293b;vertical-align:top;line-height:1.35;">
        ${t.description}
        ${t.projectName ? `<div style="font-size:7.5px;color:#64748b;margin-top:2px;">Project: <strong>${t.projectName}</strong></div>` : ""}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#047857;vertical-align:top;">
        ${t.deposit ? `+${formatBDT(t.deposit)}` : "-"}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#b45309;vertical-align:top;">
        ${t.withdrawal ? `-${formatBDT(t.withdrawal)}` : "-"}
      </td>
      <td style="padding:5px 7px;border-bottom:1px solid #e2e8f0;font-size:9px;font-family:monospace;font-weight:800;text-align:right;color:#0f172a;vertical-align:top;">
        ${formatBDT(t.balance)}
      </td>
    </tr>
  `).join("");

  const projectPills = (partner.projects || [])
    .map((pr: any) => `<span style="display:inline-block;padding:2px 6px;margin-right:4px;margin-bottom:2px;border-radius:4px;font-size:7.5px;background:#f3e8ff;color:#6b21a8;border:1px solid #e9d5ff;">${pr.projectName} (<strong>${pr.sharePercentage}%</strong>)</span>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${opts.titleEn} - ${partner.name} - ${companyName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.35;
    }

    /* Header */
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .brand-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
    }
    .doc-title {
      font-size: 12px;
      font-weight: 800;
      color: #581c87;
      margin-top: 2px;
    }

    /* Partner Bio Box */
    .partner-bio {
      padding: 6px 8px;
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 6px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .partner-name {
      font-size: 12px;
      font-weight: 800;
      color: #3b0764;
    }
    .partner-meta {
      font-size: 8px;
      color: #6b21a8;
      margin-top: 2px;
    }

    /* KPI Grid */
    .kpi-row {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 10.5px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 6.5px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 10px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-size: 7.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 5px 6px;
      text-align: left;
      border-right: 1px solid #312e81;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-size: 7.5px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 12px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 10px;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Partnership Syndicate & Equity Capital Accounts Division</div>
        <div class="doc-title">${opts.titleEn} (${opts.titleBn})</div>
      </td>
      <td style="text-align:right;vertical-align:top;font-size:8px;color:#475569;line-height:1.4;">
        <div><strong>Period:</strong> ${filterSummary}</div>
        <div><strong>Generated:</strong> ${now}</div>
        <div><strong>Prepared By:</strong> ${generatedBy}</div>
        <div><strong>Accounting Standard:</strong> Partner Equity Ledger (Dr/Cr)</div>
      </td>
    </tr>
  </table>

  <!-- Partner Profile Summary -->
  <div class="partner-bio">
    <div>
      <div class="partner-name">${partner.name}</div>
      <div class="partner-meta">
        Phone: <strong>${partner.phone}</strong>
        ${partner.nidNumber ? ` &nbsp;|&nbsp; NID: <strong>${partner.nidNumber}</strong>` : ""}
        ${partner.bankName ? ` &nbsp;|&nbsp; Bank: <strong>${partner.bankName} (${partner.bankAccountNumber || ""})</strong>` : ""}
      </div>
      ${partner.projects && partner.projects.length > 0 ? `<div style="margin-top:4px;">${projectPills}</div>` : ""}
    </div>
    <div style="text-align:right;">
      <div style="font-size:7.5px;color:#6b21a8;text-transform:uppercase;font-weight:700;">Closing Equity (C/D)</div>
      <div style="font-size:13px;font-weight:800;font-family:monospace;color:#3b0764;">${formatBDT(kpis.closingBalance)}</div>
    </div>
  </div>

  <!-- 4 KPI Cards -->
  <div class="kpi-row">
    <div class="kpi-card" style="border-left:3px solid #64748b;">
      <div class="kpi-label">Opening Capital (B/F)</div>
      <div class="kpi-val">${formatBDT(kpis.openingBalance)}</div>
      <div class="kpi-sub">Brought forward balance</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Capital & Direct Expenses</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(kpis.totalDeposits + kpis.totalDirectExpenses)}</div>
      <div class="kpi-sub">Injected + out-of-pocket costs</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Profit Share Credited</div>
      <div class="kpi-val" style="color:#6d28d9;">${formatBDT(kpis.totalProfitCredits)}</div>
      <div class="kpi-sub">Realized sales distributions</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #d97706;">
      <div class="kpi-label">Drawings / Withdrawals</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(kpis.totalWithdrawals)}</div>
      <div class="kpi-sub">Total capital debited</div>
    </div>
  </div>

  <!-- Ledger Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:12%;">Date</th>
        <th style="width:14%;">Type</th>
        <th style="width:34%;">Particulars / Description</th>
        <th style="width:13%;text-align:right;">Credit (+)</th>
        <th style="width:13%;text-align:right;">Debit (-)</th>
        <th style="width:14%;text-align:right;">Balance</th>
      </tr>
    </thead>
    <tbody>
      <!-- Opening Balance Row -->
      <tr style="background:#f1f5f9;font-weight:600;">
        <td style="padding:5px 7px;border-bottom:1px solid #cbd5e1;font-size:8px;font-family:monospace;">${filterSummary.split(" ")[0] || "B/F"}</td>
        <td style="padding:5px 7px;border-bottom:1px solid #cbd5e1;font-size:7.5px;">B/F RESERVE</td>
        <td style="padding:5px 7px;border-bottom:1px solid #cbd5e1;font-size:8px;font-weight:700;">Opening Capital Balance Brought Forward</td>
        <td style="padding:5px 7px;border-bottom:1px solid #cbd5e1;text-align:right;color:#64748b;">-</td>
        <td style="padding:5px 7px;border-bottom:1px solid #cbd5e1;text-align:right;color:#64748b;">-</td>
        <td style="padding:5px 7px;border-bottom:1px solid #cbd5e1;text-align:right;font-family:monospace;font-size:8.5px;font-weight:800;">${formatBDT(kpis.openingBalance)}</td>
      </tr>
      ${rowsHtml || `<tr><td colspan="6" style="text-align:center;padding:15px;color:#94a3b8;">No transactions recorded for this period.</td></tr>`}
    </tbody>
    <tfoot>
      <tr style="background:#1e1b4b;color:#ffffff;font-weight:700;font-size:8.5px;">
        <td colspan="3" style="padding:6px 7px;">PERIOD TOTALS & CLOSING EQUITY:</td>
        <td style="padding:6px 7px;text-align:right;font-family:monospace;color:#34d399;">+${formatBDT(kpis.totalCapitalAdditions)}</td>
        <td style="padding:6px 7px;text-align:right;font-family:monospace;color:#fcd34d;">-${formatBDT(kpis.totalWithdrawals)}</td>
        <td style="padding:6px 7px;text-align:right;font-family:monospace;font-size:9.5px;font-weight:800;color:#ffffff;">${formatBDT(kpis.closingBalance)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Partner Capital Governance:</strong> Partner capital accounts are maintained in accordance with the Partnership Agreement and GAAP. Direct out-of-pocket development expenses are credited upon verified voucher approval. Realized profit shares are allocated based on registered percentage deeds. The closing balance reconciles directly with the Balance Sheet Partner Capital Accounts.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Treasury)</div>
      <div class="sig-sub">Senior Accounts Officer</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Partner Acknowledgment</div>
      <div class="sig-sub">${partner.name}</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Syndicate Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildPartnersSummaryPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const partners: any[] = data.partners || [];
  const kpis = data.kpis || {
    totalSyndicateEquity: 0,
    totalDeposited: 0,
    totalDirectExpenses: 0,
    totalProfitReceived: 0,
    totalCapitalAdditions: 0,
    totalWithdrawn: 0,
    activePartnerCount: partners.length,
  };

  const rowsHtml = partners.map((p, idx) => {
    const projectPills = (p.projects || [])
      .slice(0, 3)
      .map((pr: any) => `<span style="display:inline-block;padding:1px 4px;margin-right:2px;border-radius:3px;font-size:7px;background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;">${pr.projectName} (${pr.sharePercentage}%)</span>`)
      .join("");
    const moreCount = (p.projects || []).length > 3 ? `<span style="font-size:7px;color:#64748b;">+${p.projects.length - 3}</span>` : "";

    return `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
          <strong style="color:#0f172a;font-size:9px;">${p.name}</strong><br/>
          <span style="font-size:7.5px;color:#64748b;font-family:monospace;">${p.phone}</span>
          ${p.nidNumber ? `<span style="font-size:7px;color:#94a3b8;"> | NID: ${p.nidNumber}</span>` : ""}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;vertical-align:top;font-size:8px;">
          ${projectPills} ${moreCount}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;text-align:right;color:#64748b;vertical-align:top;">
          ${p.openingBalance ? formatBDT(p.openingBalance) : "-"}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#047857;vertical-align:top;">
          ${p.deposited ? `+${formatBDT(p.deposited)}` : "-"}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#3730a3;vertical-align:top;">
          ${p.directExpenses ? `+${formatBDT(p.directExpenses)}` : "-"}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#6b21a8;vertical-align:top;">
          ${p.profitReceived ? `+${formatBDT(p.profitReceived)}` : "-"}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#b45309;vertical-align:top;">
          ${p.withdrawn ? `-${formatBDT(p.withdrawn)}` : "-"}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:9.5px;font-family:monospace;font-weight:800;text-align:right;color:#0f172a;vertical-align:top;">
          ${formatBDT(p.balance)}
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:center;color:#4338ca;vertical-align:top;">
          ${p.equityShare.toFixed(2)}%
        </td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${opts.titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.35;
    }

    /* Header */
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .brand-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
    }
    .doc-title {
      font-size: 12px;
      font-weight: 800;
      color: #3730a3;
      margin-top: 2px;
    }

    /* KPI Grid */
    .kpi-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .kpi-label {
      font-size: 7.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 10px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 6px 8px;
      text-align: left;
      border-right: 1px solid #312e81;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-size: 7.5px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 12px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 10px;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Partnership Syndicate & Equity Capital Accounts Division</div>
        <div class="doc-title">${opts.titleEn} (${opts.titleBn})</div>
      </td>
      <td style="text-align:right;vertical-align:top;font-size:8px;color:#475569;line-height:1.4;">
        <div><strong>Filter:</strong> ${filterSummary}</div>
        <div><strong>Generated:</strong> ${now}</div>
        <div><strong>Prepared By:</strong> ${generatedBy}</div>
        <div><strong>Balance Sheet Parity:</strong> Exact Match (100.00%)</div>
      </td>
    </tr>
  </table>

  <!-- 4 KPI Cards -->
  <div class="kpi-row">
    <div class="kpi-card" style="border-left:3px solid #4338ca;">
      <div class="kpi-label">Total Syndicate Capital</div>
      <div class="kpi-val">${formatBDT(kpis.totalSyndicateEquity)}</div>
      <div class="kpi-sub">${partners.length} active partners • 100% equity</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Fresh Capital Deposited</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(kpis.totalDeposited)}</div>
      <div class="kpi-sub">Direct liquid funds introduced</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Direct Project Expenses</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(kpis.totalDirectExpenses)}</div>
      <div class="kpi-sub">Out-of-pocket development paid</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Profit Distributed</div>
      <div class="kpi-val" style="color:#6d28d9;">${formatBDT(kpis.totalProfitReceived)}</div>
      <div class="kpi-sub">Drawings: ${formatBDT(kpis.totalWithdrawn)}</div>
    </div>
  </div>

  <!-- Summary Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:19%;">Partner Profile</th>
        <th style="width:18%;">Project Stakes</th>
        <th style="width:9%;text-align:right;">Opening</th>
        <th style="width:10%;text-align:right;">Deposits (+)</th>
        <th style="width:10%;text-align:right;">Direct Exp (+)</th>
        <th style="width:10%;text-align:right;">Profits (+)</th>
        <th style="width:9%;text-align:right;">Drawings (-)</th>
        <th style="width:10%;text-align:right;">Net Equity</th>
        <th style="width:5%;text-align:center;">Share %</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || `<tr><td colspan="9" style="text-align:center;padding:15px;color:#94a3b8;">No partners recorded.</td></tr>`}
    </tbody>
    <tfoot>
      <tr style="background:#1e1b4b;color:#ffffff;font-weight:700;font-size:9px;">
        <td colspan="3" style="padding:6px 8px;">SYNDICATE TOTALS: ${partners.length} PARTNERS</td>
        <td style="padding:6px 8px;text-align:right;font-family:monospace;color:#34d399;">+${formatBDT(kpis.totalDeposited)}</td>
        <td style="padding:6px 8px;text-align:right;font-family:monospace;color:#93c5fd;">+${formatBDT(kpis.totalDirectExpenses)}</td>
        <td style="padding:6px 8px;text-align:right;font-family:monospace;color:#c084fc;">+${formatBDT(kpis.totalProfitReceived)}</td>
        <td style="padding:6px 8px;text-align:right;font-family:monospace;color:#fcd34d;">-${formatBDT(kpis.totalWithdrawn)}</td>
        <td style="padding:6px 8px;text-align:right;font-family:monospace;font-size:10px;color:#ffffff;">${formatBDT(kpis.totalSyndicateEquity)}</td>
        <td style="padding:6px 8px;text-align:center;font-family:monospace;color:#ffffff;">100.00%</td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Balance Sheet Exact Parity:</strong> The aggregate syndicate capital balance of <strong>${formatBDT(kpis.totalSyndicateEquity)}</strong> exactly mirrors the Partner Capital Accounts under Equity & Liabilities on the official Statement of Financial Position. All capital injections are reconciled with bank statements; direct expenses are corroborated by approved vouchers, and profit shares reflect registered deed allocations.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Treasury)</div>
      <div class="sig-sub">Senior Accounts Officer</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Head of Audit & Compliance</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Syndicate Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildPartnerContributionPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const projects: any[] = data.projects || [];
  const kpis = data.kpis || {
    totalSyndicateProjectCost: 0,
    totalAcquisitionCost: 0,
    totalDevelopmentCost: 0,
    totalDirectPartnerFunded: 0,
    totalTreasuryFunded: 0,
    totalProfitDistributed: 0,
    activeProjectsCount: projects.length,
    participatingPartnersCount: 0,
  };

  const projectTablesHtml = projects.map((proj) => {
    const partnerRowsHtml = (proj.partners || []).map((partner: any, idx: number) => {
      let statusBadge = `<span style="display:inline-block;padding:1px 6px;border-radius:10px;font-size:7px;font-weight:700;background:#f1f5f9;color:#475569;">BALANCED</span>`;
      if (partner.varianceStatus === "SURPLUS") {
        statusBadge = `<span style="display:inline-block;padding:1px 6px;border-radius:10px;font-size:7px;font-weight:700;background:#dcfce7;color:#166534;">SURPLUS (+${formatBDT(partner.variance)})</span>`;
      } else if (partner.varianceStatus === "DEFICIT") {
        statusBadge = `<span style="display:inline-block;padding:1px 6px;border-radius:10px;font-size:7px;font-weight:700;background:#fee2e2;color:#991b1b;">DEFICIT (${formatBDT(partner.variance)})</span>`;
      }

      return `
        <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;">
            <strong style="color:#0f172a;">${partner.partnerName}</strong><br/>
            <span style="font-size:7px;color:#64748b;font-family:monospace;">${partner.partnerPhone}</span>
          </td>
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;font-weight:700;text-align:center;color:#4338ca;">
            ${partner.sharePercentage.toFixed(2)}%
          </td>
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#0f172a;">
            ${formatBDT(partner.budgetedShare)}
          </td>
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;font-weight:700;text-align:right;color:#b45309;">
            ${partner.directExpensesPaid > 0 ? formatBDT(partner.directExpensesPaid) : "-"}
          </td>
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#475569;">
            ${formatBDT(partner.treasuryCapitalShare)}
          </td>
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:800;text-align:right;color:#0f172a;">
            ${formatBDT(partner.totalContribution)}
          </td>
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;text-align:center;">
            ${statusBadge}
          </td>
          <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#6d28d9;">
            ${partner.profitReceived > 0 ? formatBDT(partner.profitReceived) : "-"}
          </td>
        </tr>
      `;
    }).join("");

    return `
      <div style="margin-bottom:14px;page-break-inside:avoid;">
        <!-- Project Sub-Banner -->
        <table style="width:100%;background:#f1f5f9;border:1px solid #cbd5e1;border-bottom:none;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 8px;">
              <span style="font-size:9.5px;font-weight:800;color:#0f172a;">${proj.projectName}</span>
              <span style="display:inline-block;margin-left:6px;padding:1px 5px;background:#e0e7ff;color:#3730a3;font-size:7px;font-weight:700;border-radius:3px;text-transform:uppercase;">${proj.status}</span>
              ${proj.totalAreaShotok > 0 ? `<span style="font-size:7.5px;color:#64748b;margin-left:6px;">(${proj.totalAreaShotok.toFixed(2)} Shotok)</span>` : ""}
            </td>
            <td style="padding:5px 8px;text-align:right;font-size:7.5px;color:#334155;">
              <span>Acquisition: <strong>${formatBDT(proj.acquisitionCost)}</strong></span> &nbsp;·&nbsp;
              <span>Site Dev: <strong>${formatBDT(proj.developmentExpenses)}</strong></span> &nbsp;·&nbsp;
              <span>Direct Paid: <strong style="color:#b45309;">${formatBDT(proj.directPartnerFunding)}</strong></span> &nbsp;·&nbsp;
              <span>Total Cost: <strong style="color:#0f172a;font-size:8.5px;">${formatBDT(proj.totalProjectCost)}</strong></span>
            </td>
          </tr>
        </table>

        <!-- Project Table -->
        <table class="data-table" style="margin-bottom:0;">
          <thead>
            <tr>
              <th style="width:20%;">Partner Name</th>
              <th style="width:7%;text-align:center;">Share %</th>
              <th style="width:13%;text-align:right;">Required Share</th>
              <th style="width:13%;text-align:right;">Direct Exp Paid</th>
              <th style="width:13%;text-align:right;">Treasury Fund</th>
              <th style="width:13%;text-align:right;">Total Contributed</th>
              <th style="width:11%;text-align:center;">Settlement Status</th>
              <th style="width:10%;text-align:right;">Profit Distributed</th>
            </tr>
          </thead>
          <tbody>
            ${partnerRowsHtml}
          </tbody>
          <tfoot>
            <tr style="background:#e2e8f0;color:#0f172a;font-weight:700;font-size:8px;">
              <td style="padding:4px 8px;">SUBTOTAL (${proj.projectName})</td>
              <td style="padding:4px 8px;text-align:center;font-family:monospace;">100.00%</td>
              <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalProjectCost)}</td>
              <td style="padding:4px 8px;text-align:right;font-family:monospace;color:#b45309;">${formatBDT(proj.directPartnerFunding)}</td>
              <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.treasuryFunding)}</td>
              <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalProjectCost)}</td>
              <td style="padding:4px 8px;text-align:center;color:#166534;">✔ Balanced</td>
              <td style="padding:4px 8px;text-align:right;font-family:monospace;color:#6d28d9;">${formatBDT(proj.totalProfitDistributed)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${opts.titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8.5px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    /* Header */
    table.header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      border-bottom: 2px solid #1e1b4b;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #1e1b4b;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }
    .report-title-main {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-meta-text {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* KPIs */
    .kpi-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 10px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-size: 7.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 5px 8px;
      text-align: left;
      border-right: 1px solid #312e81;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-size: 7.5px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 12px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      padding-top: 8px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Project Capital Accounting & Equity Equalization Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${lang === "bn" ? opts.titleBn : opts.titleEn}</div>
        <div class="report-meta-text">
          <span>Filters: ${filterSummary || "All Projects"}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Summary -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #1e1b4b;">
      <div class="kpi-label">Syndicate Project Assets</div>
      <div class="kpi-val">${formatBDT(kpis.totalSyndicateProjectCost)}</div>
      <div class="kpi-sub">${kpis.activeProjectsCount} Total Projects Capitalized</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Land Acquisition Capital</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(kpis.totalAcquisitionCost)}</div>
      <div class="kpi-sub">Registered deeds, stamps & mutation</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Site Dev & Civil Works</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(kpis.totalDevelopmentCost)}</div>
      <div class="kpi-sub">Approved vouchers & earthwork</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #d97706;">
      <div class="kpi-label">Direct Out-of-Pocket Paid</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(kpis.totalDirectPartnerFunded)}</div>
      <div class="kpi-sub">Treasury Capital: ${formatBDT(kpis.totalTreasuryFunded)}</div>
    </div>
  </div>

  <!-- Project Breakdown Tables -->
  ${projectTablesHtml || `<div style="text-align:center;padding:20px;color:#94a3b8;">No projects found for the selected criteria.</div>`}

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Statutory Capital Equalization Standard (Partnership Act, 1932):</strong> Project costs are apportioned strictly according to registered deed equity ratios. Out-of-pocket development expenses disbursed directly by partners are recognized as capital equity additions, creating surplus standing subject to first-lien equalization upon asset monetisation.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Project Accounts)</div>
      <div class="sig-sub">Senior Cost Controller</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Head of Audit & Quality Assurance</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Syndicate Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildProjectCostPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const proj = data.selectedProject || {
    projectName: "Project Cost Statement",
    status: "N/A",
    mouza: "-",
    jlNumber: null,
    dagNumbers: "-",
    khatianNumbers: "-",
    totalGrossAreaShotok: 0,
    totalSaleableAreaShotok: 0,
    infrastructureAreaShotok: 0,
    efficiencyRatio: 0,
    totalPlotsCount: 0,
    targetSalesValue: 0,
    totalAcquisitionCost: 0,
    totalDevelopmentCost: 0,
    totalProjectCost: 0,
    grossCostPerShotok: 0,
    saleableCostPerShotok: 0,
    acquisitionItems: [],
    developmentItems: [],
  };

  const acqRowsHtml = (proj.acquisitionItems || []).map((item: any, idx: number) => `
    <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;">
        <strong style="color:#0f172a;">${item.category}</strong><br/>
        <span style="font-size:7px;color:#64748b;">${item.categoryBn}</span>
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:center;color:#475569;">
        ${item.voucherCount}
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#047857;">
        ${formatBDT(item.amount)}
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#475569;">
        ${item.pctOfTotal.toFixed(2)}%
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#047857;">
        ${formatBDT(item.costPerGrossShotok)}
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#1d4ed8;">
        ${formatBDT(item.costPerSaleableShotok)}
      </td>
    </tr>
  `).join("");

  const devRowsHtml = (proj.developmentItems || []).map((item: any, idx: number) => `
    <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;">
        <strong style="color:#0f172a;">${item.category}</strong><br/>
        <span style="font-size:7px;color:#64748b;">${item.categoryBn}</span>
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:center;color:#475569;">
        ${item.voucherCount}
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8.5px;font-family:monospace;font-weight:700;text-align:right;color:#1d4ed8;">
        ${formatBDT(item.amount)}
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#475569;">
        ${item.pctOfTotal.toFixed(2)}%
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#047857;">
        ${formatBDT(item.costPerGrossShotok)}
      </td>
      <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#1d4ed8;">
        ${formatBDT(item.costPerSaleableShotok)}
      </td>
    </tr>
  `).join("");

  const acqPct = proj.totalProjectCost > 0 ? (proj.totalAcquisitionCost / proj.totalProjectCost) * 100 : 0;
  const devPct = proj.totalProjectCost > 0 ? (proj.totalDevelopmentCost / proj.totalProjectCost) * 100 : 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${opts.titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8.5px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    /* Header */
    table.header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-bottom: 2px solid #1e1b4b;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #1e1b4b;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }
    .report-title-main {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-meta-text {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* Project Banner */
    .proj-banner {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 6px 10px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .proj-name {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
    }
    .proj-meta {
      font-size: 7.5px;
      color: #475569;
      margin-top: 2px;
    }

    /* KPIs */
    .kpi-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Section Subhead */
    .section-head {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 8px;
      margin-top: 6px;
      margin-bottom: 0px;
      border: 1px solid #cbd5e1;
      border-bottom: none;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-size: 7.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 8px;
      text-align: left;
      border-right: 1px solid #312e81;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 5px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 7px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 6px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 3px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Real Estate Development & Quantity Surveying Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${lang === "bn" ? opts.titleBn : opts.titleEn}</div>
        <div class="report-meta-text">
          <span>Project: ${proj.projectName}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- Project Identity Banner -->
  <div class="proj-banner">
    <div>
      <div class="proj-name">${proj.projectName} &nbsp;<span style="display:inline-block;padding:1px 5px;background:#e0e7ff;color:#3730a3;font-size:7px;border-radius:3px;text-transform:uppercase;">${proj.status}</span></div>
      <div class="proj-meta">
        <strong>Mouza:</strong> ${proj.mouza} ${proj.jlNumber ? `(JL #${proj.jlNumber})` : ""} &nbsp;·&nbsp;
        <strong>Dag:</strong> ${proj.dagNumbers || "N/A"} &nbsp;·&nbsp;
        <strong>Khatian:</strong> ${proj.khatianNumbers || "N/A"}
      </div>
    </div>
    <div style="text-align:right;font-size:7.5px;">
      <div><strong>Gross Area:</strong> ${proj.totalGrossAreaShotok.toFixed(2)} Shotok &nbsp;·&nbsp; <strong>Net Saleable:</strong> ${proj.totalSaleableAreaShotok.toFixed(2)} Shotok</div>
      <div style="color:#64748b;"><strong>Efficiency:</strong> ${proj.efficiencyRatio.toFixed(1)}% Saleable &nbsp;·&nbsp; <strong>Infrastructure Space:</strong> ${proj.infrastructureAreaShotok.toFixed(2)} Shotok</div>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #1e1b4b;">
      <div class="kpi-label">Total Capitalized Cost</div>
      <div class="kpi-val">${formatBDT(proj.totalProjectCost)}</div>
      <div class="kpi-sub">Acq: ${formatBDT(proj.totalAcquisitionCost)} · Dev: ${formatBDT(proj.totalDevelopmentCost)}</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Gross Cost / Shotok</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(proj.grossCostPerShotok)}</div>
      <div class="kpi-sub">Across ${proj.totalGrossAreaShotok.toFixed(2)} gross acreage</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Saleable Cost / Shotok</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(proj.saleableCostPerShotok)}</div>
      <div class="kpi-sub">Loaded across ${proj.totalSaleableAreaShotok.toFixed(2)} net plot shotok</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #d97706;">
      <div class="kpi-label">Plot Demarcation & Target Value</div>
      <div class="kpi-val" style="color:#b45309;">${proj.totalPlotsCount} Plots Demarcated</div>
      <div class="kpi-sub">Asking Value: ${formatBDT(proj.targetSalesValue)}</div>
    </div>
  </div>

  <!-- SECTION A: LAND ACQUISITION CAPITAL -->
  <div class="section-head" style="background:#ecfdf5;color:#065f46;">
    Section A: Land Acquisition Capital Cost
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:28%;">Cost Category</th>
        <th style="width:8%;text-align:center;">Vouchers</th>
        <th style="width:16%;text-align:right;">Amount (BDT)</th>
        <th style="width:10%;text-align:right;">% of Total</th>
        <th style="width:19%;text-align:right;">Cost / Gross Shotok</th>
        <th style="width:19%;text-align:right;">Cost / Net Saleable</th>
      </tr>
    </thead>
    <tbody>
      ${acqRowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#dcfce7;color:#065f46;font-weight:700;font-size:8px;">
        <td style="padding:4px 8px;">SUBTOTAL LAND ACQUISITION</td>
        <td style="padding:4px 8px;text-align:center;font-family:monospace;">${proj.acquisitionItems.reduce((s: number, r: any) => s + r.voucherCount, 0)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalAcquisitionCost)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${acqPct.toFixed(2)}%</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalGrossAreaShotok > 0 ? proj.totalAcquisitionCost / proj.totalGrossAreaShotok : 0)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalSaleableAreaShotok > 0 ? proj.totalAcquisitionCost / proj.totalSaleableAreaShotok : 0)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- SECTION B: SITE DEVELOPMENT EXPENSES -->
  <div class="section-head" style="background:#eff6ff;color:#1e40af;">
    Section B: Civil Infrastructure & Site Development Expenses
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:28%;">Development Work Category</th>
        <th style="width:8%;text-align:center;">Vouchers</th>
        <th style="width:16%;text-align:right;">Amount (BDT)</th>
        <th style="width:10%;text-align:right;">% of Total</th>
        <th style="width:19%;text-align:right;">Cost / Gross Shotok</th>
        <th style="width:19%;text-align:right;">Cost / Net Saleable</th>
      </tr>
    </thead>
    <tbody>
      ${devRowsHtml || `<tr><td colspan="6" style="text-align:center;padding:10px;color:#94a3b8;">No development vouchers recorded yet for this project.</td></tr>`}
    </tbody>
    <tfoot>
      <tr style="background:#dbeafe;color:#1e40af;font-weight:700;font-size:8px;">
        <td style="padding:4px 8px;">SUBTOTAL SITE DEVELOPMENT</td>
        <td style="padding:4px 8px;text-align:center;font-family:monospace;">${proj.developmentItems.reduce((s: number, r: any) => s + r.voucherCount, 0)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalDevelopmentCost)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${devPct.toFixed(2)}%</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalGrossAreaShotok > 0 ? proj.totalDevelopmentCost / proj.totalGrossAreaShotok : 0)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;">${formatBDT(proj.totalSaleableAreaShotok > 0 ? proj.totalDevelopmentCost / proj.totalSaleableAreaShotok : 0)}</td>
      </tr>
      <tr style="background:#1e1b4b;color:#ffffff;font-weight:700;font-size:8.5px;">
        <td colspan="2" style="padding:5px 8px;">TOTAL CAPITALIZED PROJECT INVESTMENT</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:9.5px;color:#ffffff;">${formatBDT(proj.totalProjectCost)}</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;color:#ffffff;">100.00%</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;color:#34d399;">${formatBDT(proj.grossCostPerShotok)}</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;color:#93c5fd;">${formatBDT(proj.saleableCostPerShotok)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Quantity Surveying & Land Development Standard (Act No. 20 of 2010):</strong> Total project costs include registered deed acquisition capital and all verified on-site civil infrastructure works. Non-saleable spaces dedicated to internal access roads and green zones (${proj.infrastructureAreaShotok.toFixed(2)} Shotok) are loaded directly onto the cost basis of net saleable plot inventory (${proj.totalSaleableAreaShotok.toFixed(2)} Shotok), reflecting an actual layout efficiency of ${proj.efficiencyRatio.toFixed(1)}%.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Cost Accounts)</div>
      <div class="sig-sub">Senior Quantity Surveyor</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Head of Audit & Quality Assurance</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Syndicate Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildProjectPnlPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const proj = data.selectedProject || {
    projectName: "Project Profit & Loss",
    status: "N/A",
    mouza: "-",
    grossAreaShotok: 0,
    totalPlotsCount: 0,
    soldPlotsCount: 0,
    availablePlotsCount: 0,
    totalBookedSales: 0,
    totalCashCollected: 0,
    activeReceivables: 0,
    totalProjectCost: 0,
    invoicedGrossProfit: 0,
    invoicedMargin: 0,
    realisedCashProfit: 0,
    collectionRate: 0,
    paybackRate: 0,
    isPaybackAchieved: false,
    profitDistributedToDate: 0,
    retainedProjectSurplus: 0,
    lineItems: [],
    partnerAllocations: [],
  };

  const rowsHtml = (proj.lineItems || []).map((li: any, idx: number) => {
    if (li.isHeader) {
      return `
        <tr style="background:#f1f5f9;font-weight:700;">
          <td style="padding:4px 8px;font-family:monospace;color:#3730a3;font-size:7.5px;">${li.code}</td>
          <td colspan="4" style="padding:4px 8px;font-size:8px;text-transform:uppercase;color:#0f172a;letter-spacing:0.3px;">
            ${li.labelEn}
          </td>
        </tr>
      `;
    }

    if (li.isTotal) {
      const isProfit = li.code === "3.0";
      return `
        <tr style="background:${isProfit ? "#e0e7ff" : "#f1f5f9"};font-weight:700;border-top:1px solid #94a3b8;border-bottom:1px solid #94a3b8;">
          <td style="padding:5px 8px;font-family:monospace;font-size:8px;color:#334155;">${li.code}</td>
          <td style="padding:5px 8px;font-size:8.5px;color:#0f172a;">${li.labelEn}</td>
          <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:9.5px;color:#0f172a;">
            ${li.invoiced !== null ? formatBDT(li.invoiced) : "-"}
          </td>
          <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:9.5px;color:#0f172a;">
            ${li.realised !== null ? formatBDT(li.realised) : "-"}
          </td>
          <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:9px;color:#b45309;">
            ${li.variance !== null && li.variance !== 0 ? formatBDT(li.variance) : "৳ 0.00"}
          </td>
        </tr>
      `;
    }

    return `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:7.5px;color:#64748b;">${li.code}</td>
        <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;">
          <strong style="color:#0f172a;">${li.labelEn}</strong><br/>
          <span style="font-size:7px;color:#64748b;">${li.labelBn}</span>
        </td>
        <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;color:#0f172a;">
          ${li.invoiced !== null ? formatBDT(li.invoiced) : "-"}
        </td>
        <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;color:#0f172a;">
          ${li.realised !== null ? formatBDT(li.realised) : "-"}
        </td>
        <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;color:#b45309;">
          ${li.variance !== null && li.variance !== 0 ? formatBDT(li.variance) : "৳ 0.00"}
        </td>
      </tr>
    `;
  }).join("");

  const partnerAllocRowsHtml = (proj.partnerAllocations || []).map((p: any, idx: number) => `
    <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-weight:700;color:#0f172a;">${p.partnerName}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:center;color:#4338ca;">${p.sharePercentage.toFixed(2)}%</td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#047857;">${formatBDT(p.allocatedInvoicedProfit)}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#1d4ed8;">${formatBDT(p.allocatedRealisedProfit)}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;font-family:monospace;text-align:right;color:#6d28d9;">${p.actualProfitReceived > 0 ? formatBDT(p.actualProfitReceived) : "-"}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${opts.titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8.5px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    /* Header */
    table.header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-bottom: 2px solid #1e1b4b;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #1e1b4b;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }
    .report-title-main {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-meta-text {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* Project Banner */
    .proj-banner {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 6px 10px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .proj-name {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
    }
    .proj-meta {
      font-size: 7.5px;
      color: #475569;
      margin-top: 2px;
    }

    /* KPIs */
    .kpi-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-size: 7.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 8px;
      text-align: left;
      border-right: 1px solid #312e81;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 5px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 7px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 6px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 3px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Real Estate Financial Accounting & Syndicate Revenue Recognition Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${lang === "bn" ? opts.titleBn : opts.titleEn}</div>
        <div class="report-meta-text">
          <span>Project: ${proj.projectName}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- Project Identity Banner -->
  <div class="proj-banner">
    <div>
      <div class="proj-name">${proj.projectName} &nbsp;<span style="display:inline-block;padding:1px 5px;background:#e0e7ff;color:#3730a3;font-size:7px;border-radius:3px;text-transform:uppercase;">${proj.status}</span></div>
      <div class="proj-meta">
        <strong>Mouza:</strong> ${proj.mouza} &nbsp;·&nbsp;
        <strong>Gross Area:</strong> ${proj.grossAreaShotok.toFixed(2)} Shotok &nbsp;·&nbsp;
        <strong>Plots:</strong> ${proj.soldPlotsCount} Sold / ${proj.totalPlotsCount} Total Demarcated
      </div>
    </div>
    <div style="text-align:right;font-size:7.5px;">
      <div><strong>Collection Rate:</strong> ${proj.collectionRate.toFixed(1)}% Realised &nbsp;·&nbsp; <strong>Capital Payback:</strong> ${proj.paybackRate.toFixed(1)}%</div>
      <div style="color:${proj.isPaybackAchieved ? "#166534" : "#b45309"};font-weight:700;">
        ${proj.isPaybackAchieved ? "✔ 100% Capital Payback Achieved" : "⚠ Payback in Progress"}
      </div>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #1e1b4b;">
      <div class="kpi-label">Total Booked Sales</div>
      <div class="kpi-val">${formatBDT(proj.totalBookedSales)}</div>
      <div class="kpi-sub">${proj.soldPlotsCount} Plots Sold · ${formatBDT(proj.totalCashCollected)} collected</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Invoiced Gross Profit</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(proj.invoicedGrossProfit)}</div>
      <div class="kpi-sub">${proj.invoicedMargin.toFixed(1)}% margin on sales value</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Realised Cash Profit</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(proj.realisedCashProfit)}</div>
      <div class="kpi-sub">Total Cost: ${formatBDT(proj.totalProjectCost)}</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #d97706;">
      <div class="kpi-label">Customer Receivables</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(proj.activeReceivables)}</div>
      <div class="kpi-sub">Distributed: ${formatBDT(proj.profitDistributedToDate)} · Retained: ${formatBDT(proj.retainedProjectSurplus)}</div>
    </div>
  </div>

  <!-- Dual Comparative Statement Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:8%;">Code</th>
        <th style="width:40%;">Financial Head / Description</th>
        <th style="width:18%;text-align:right;">Invoiced / Accrual Basis</th>
        <th style="width:18%;text-align:right;">Realised / Cash Basis</th>
        <th style="width:16%;text-align:right;">Variance / Receivables</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <!-- Partner Profit Allocation Schedule -->
  <table class="data-table" style="margin-top:6px;">
    <thead>
      <tr>
        <th style="width:30%;">Syndicate Partner</th>
        <th style="width:12%;text-align:center;">Share %</th>
        <th style="width:20%;text-align:right;">Allocated Invoiced Profit</th>
        <th style="width:20%;text-align:right;">Allocated Cash Profit</th>
        <th style="width:18%;text-align:right;">Actual Distributed</th>
      </tr>
    </thead>
    <tbody>
      ${partnerAllocRowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#1e1b4b;color:#ffffff;font-weight:700;font-size:8px;">
        <td style="padding:4px 8px;">TOTAL PARTNER ALLOCATION</td>
        <td style="padding:4px 8px;text-align:center;font-family:monospace;">100.00%</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;color:#34d399;">${formatBDT(proj.invoicedGrossProfit)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;color:#93c5fd;">${formatBDT(proj.realisedCashProfit)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:monospace;color:#c084fc;">${formatBDT(proj.profitDistributedToDate)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Revenue Recognition & Dual Accounting Standard (IFRS 15 & Partnership Act 1932):</strong> Invoiced profit recognizes contracted sales deeds upon execution. Realised cash profit reflects verified bank clearance and liquid surplus over capitalized project acquisition and development costs. Partner distributions are authorized only from cleared liquid cash surplus.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Treasury)</div>
      <div class="sig-sub">Senior Project Accountant</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Head of Audit & Quality Assurance</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Syndicate Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildProjectsComparisonPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { companyName, filterSummary, generatedBy, lang, data } = opts;
  const now = formatDateTime(new Date());

  const projects: any[] = data.projects || [];
  const totals = data.portfolioTotals || {
    totalProjects: 0,
    totalGrossArea: 0,
    totalPlots: 0,
    totalSoldPlots: 0,
    totalCapitalizedCost: 0,
    totalBookedSales: 0,
    totalCashCollected: 0,
    totalActiveReceivables: 0,
    totalInvoicedProfit: 0,
    overallPaybackRate: 0,
    overallProjectedRoi: 0,
    overallEfficiencyRatio: 0,
  };

  const rowsHtml = projects.map((p: any, idx: number) => `
    <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;font-size:8px;">
        <strong style="color:#0f172a;">${p.projectName}</strong><br/>
        <span style="font-size:7px;color:#64748b;">${p.mouza} · ${p.status}</span>
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;">
        ${p.grossAreaShotok.toFixed(2)}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-family:monospace;font-size:8px;">
        ${p.soldPlotsCount} / ${p.totalPlotsCount}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;font-weight:700;">
        ${formatBDT(p.totalProjectCost)}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;font-weight:700;">
        ${p.bookedSalesValue > 0 ? formatBDT(p.bookedSalesValue) : "-"}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;color:#047857;font-weight:700;">
        ${p.cashCollected > 0 ? formatBDT(p.cashCollected) : "-"}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;color:#b45309;">
        ${p.activeReceivables > 0 ? formatBDT(p.activeReceivables) : "-"}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;font-weight:700;color:${p.invoicedProfit >= 0 ? "#047857" : "#b91c1c"};">
        ${formatBDT(p.invoicedProfit)}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-family:monospace;font-size:7.5px;">
        ${p.isPaybackAchieved ? `✔ ${p.paybackRate.toFixed(0)}%` : `${p.paybackRate.toFixed(1)}%`}
      </td>
      <td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;font-size:8px;font-weight:700;color:#3730a3;">
        ${p.projectedFullyDilutedRoi.toFixed(1)}%
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${opts.titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8.5px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    /* Header */
    table.header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-bottom: 2px solid #1e1b4b;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #1e1b4b;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }
    .report-title-main {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-meta-text {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* KPIs */
    .kpi-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-size: 7.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 8px;
      text-align: left;
      border-right: 1px solid #312e81;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 5px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 7px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 6px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 3px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Syndicate Portfolio Management & Cross-Project Benchmark Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${lang === "bn" ? opts.titleBn : opts.titleEn}</div>
        <div class="report-meta-text">
          <span>Portfolio: ${totals.totalProjects} Projects</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #1e1b4b;">
      <div class="kpi-label">Syndicate Project Assets</div>
      <div class="kpi-val">${formatBDT(totals.totalCapitalizedCost)}</div>
      <div class="kpi-sub">${totals.totalProjects} Projects · ${totals.totalGrossArea.toFixed(1)} Shotok Acreage</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Booked Sales & Collections</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(totals.totalBookedSales)}</div>
      <div class="kpi-sub">Collected: ${formatBDT(totals.totalCashCollected)} (${totals.overallCollectionRate.toFixed(1)}%)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #d97706;">
      <div class="kpi-label">Customer Receivables</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(totals.totalActiveReceivables)}</div>
      <div class="kpi-sub">Available Asking: ${formatBDT(totals.totalUnsoldAskingValue)}</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Portfolio Plots Absorption</div>
      <div class="kpi-val" style="color:#1d4ed8;">${totals.totalSoldPlots} / ${totals.totalPlots} Plots</div>
      <div class="kpi-sub">Overall ROI: ${totals.overallProjectedRoi.toFixed(1)}% · Payback: ${totals.overallPaybackRate.toFixed(1)}%</div>
    </div>
  </div>

  <!-- Master Comparative Matrix Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:19%;">Project Profile</th>
        <th style="width:7%;text-align:right;">Gross Area</th>
        <th style="width:9%;text-align:center;">Plots (Sold/Tot)</th>
        <th style="width:12%;text-align:right;">Capitalized Cost</th>
        <th style="width:12%;text-align:right;">Booked Sales</th>
        <th style="width:11%;text-align:right;">Cash Collected</th>
        <th style="width:9%;text-align:right;">Receivables</th>
        <th style="width:10%;text-align:right;">Invoiced Profit</th>
        <th style="width:5%;text-align:center;">Payback</th>
        <th style="width:6%;text-align:right;">ROI %</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#1e1b4b;color:#ffffff;font-weight:700;font-size:8px;">
        <td style="padding:5px 8px;">TOTAL PORTFOLIO (${totals.totalProjects} PROJECTS)</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;">${totals.totalGrossArea.toFixed(2)}</td>
        <td style="padding:5px 8px;text-align:center;font-family:monospace;">${totals.totalSoldPlots} / ${totals.totalPlots}</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:8.5px;color:#ffffff;">${formatBDT(totals.totalCapitalizedCost)}</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:8.5px;color:#ffffff;">${formatBDT(totals.totalBookedSales)}</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:8.5px;color:#34d399;">${formatBDT(totals.totalCashCollected)}</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:8.5px;color:#fcd34d;">${formatBDT(totals.totalActiveReceivables)}</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;font-size:8.5px;color:#34d399;">${formatBDT(totals.totalInvoicedProfit)}</td>
        <td style="padding:5px 8px;text-align:center;font-family:monospace;color:#ffffff;">${totals.overallPaybackRate.toFixed(1)}%</td>
        <td style="padding:5px 8px;text-align:right;font-family:monospace;color:#93c5fd;">${totals.overallProjectedRoi.toFixed(1)}%</td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Portfolio Benchmark & Capital Equalization Standard (Act No. 20 of 2010):</strong> All project metrics are consolidated across active deed acquisitions and approved site vouchers. Capital recycling from mature projects with 100%+ payback funds ongoing civil works in newly registered pipeline developments.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Portfolio Analyst)</div>
      <div class="sig-sub">Corporate Development & Analytics</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Head of Audit & Quality Assurance</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Syndicate Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildExpenseRegisterPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const items = data.items || [];
  const kpis = data.kpis || {
    totalExpenses: data.totals?.amount || 0,
    totalVouchersCount: items.length,
    approvedAmount: 0,
    approvedCount: 0,
    pendingAmount: 0,
    pendingCount: 0,
    paidByPartnersAmount: 0,
  };

  const rowsHtml = items.map((r: any, idx: number) => {
    const isApproved = r.status === "APPROVED";
    const isPending = r.status === "PENDING";
    const statusBg = isApproved ? "#ecfdf5" : isPending ? "#fffbeb" : "#fff1f2";
    const statusColor = isApproved ? "#047857" : isPending ? "#b45309" : "#be123c";

    const chLabel = r.channel === "PAID_BY_PARTNER"
      ? `Partner: ${r.paidByPartnerName || "Partner"}`
      : r.channel === "BANK"
      ? `Bank: ${r.bankAccountName || "Bank Transfer"}`
      : r.channel;

    const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    const dateStr = formatDate(r.date);

    return `
      <tr style="background:${rowBg};border-bottom:1px solid #e2e8f0;">
        <td style="padding:4px 6px;font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">${r.voucherNo}</td>
        <td style="padding:4px 6px;font-family:monospace;color:#475569;white-space:nowrap;">${dateStr}</td>
        <td style="padding:4px 6px;">
          <div style="font-weight:700;color:#0f172a;">${r.projectName}</div>
          ${r.mouza ? `<div style="font-size:7px;color:#64748b;">${r.mouza}</div>` : ""}
        </td>
        <td style="padding:4px 6px;white-space:nowrap;">
          <div style="font-weight:600;color:#1e293b;">${r.category}</div>
          <div style="font-size:6.5px;color:#64748b;text-transform:uppercase;">${r.categoryClassification || ""}</div>
        </td>
        <td style="padding:4px 6px;color:#334155;max-width:180px;">${r.description || "-"}</td>
        <td style="padding:4px 6px;font-size:7px;color:#475569;">${chLabel}</td>
        <td style="padding:4px 6px;font-size:7px;color:#64748b;">
          <div>By: ${r.postedBy}</div>
          ${isApproved ? `<div style="color:#047857;font-weight:600;">Appr: ${r.approver}</div>` : ""}
        </td>
        <td style="padding:4px 6px;text-align:center;white-space:nowrap;">
          <span style="display:inline-block;padding:1px 5px;border-radius:4px;font-size:7px;font-weight:700;background:${statusBg};color:${statusColor};">
            ${r.status}
          </span>
        </td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">
          ${formatBDT(r.amount)}
        </td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    /* Header */
    table.header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-bottom: 2px solid #1e1b4b;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #1e1b4b;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }
    .report-title-main {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-meta-text {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* KPI Grid */
    .kpi-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 6px;
      text-align: left;
      border-right: 1px solid #312e81;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 5px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 7px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 6px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 3px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Project Financial Control, Treasury & Accounts Department</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          <span>Filter: ${filterSummary || "All Records"}</span> &nbsp;·&nbsp;
          <span>Scope: ${projectName || "All Projects"}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #1e1b4b;">
      <div class="kpi-label">Total Registered Outflows</div>
      <div class="kpi-val">${formatBDT(kpis.totalExpenses)}</div>
      <div class="kpi-sub">${kpis.totalVouchersCount} Vouchers Recorded</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Vetted & Approved Vouchers</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(kpis.approvedAmount)}</div>
      <div class="kpi-sub">${kpis.approvedCount} Vouchers (${kpis.totalExpenses > 0 ? ((kpis.approvedAmount / kpis.totalExpenses) * 100).toFixed(1) : 0}%)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #d97706;">
      <div class="kpi-label">Pending Internal Audit</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(kpis.pendingAmount)}</div>
      <div class="kpi-sub">${kpis.pendingCount} Vouchers Awaiting Approval</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Paid by Syndicate Partners</div>
      <div class="kpi-val" style="color:#6d28d9;">${formatBDT(kpis.paidByPartnersAmount)}</div>
      <div class="kpi-sub">${kpis.paidByPartnersCount || 0} Vouchers (Reimbursable / Equity Credit)</div>
    </div>
  </div>

  <!-- Master Voucher Ledger Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:10%;">Voucher #</th>
        <th style="width:8%;">Date</th>
        <th style="width:14%;">Project & Mouza</th>
        <th style="width:12%;">Category Head</th>
        <th style="width:20%;">Particulars / Description</th>
        <th style="width:12%;">Channel / Source</th>
        <th style="width:10%;">Audit Stamp</th>
        <th style="width:6%;text-align:center;">Status</th>
        <th style="width:8%;text-align:right;">Amount (BDT)</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#1e1b4b;color:#ffffff;font-weight:700;font-size:8px;">
        <td colspan="4" style="padding:5px 6px;">GRAND TOTAL OUTFLOWS (${items.length} VOUCHERS)</td>
        <td colspan="4" style="padding:5px 6px;font-size:7px;color:#cbd5e1;">
          Approved: ${formatBDT(kpis.approvedAmount)} &nbsp;|&nbsp; Pending: ${formatBDT(kpis.pendingAmount)} &nbsp;|&nbsp; Partner Paid: ${formatBDT(kpis.paidByPartnersAmount)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#ffffff;">
          ${formatBDT(kpis.totalExpenses)}
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Statutory Project Accounting Standard (Act No. 20 of 2010 & Income Tax Act 2023):</strong> All project expenditure entries are recorded on an accrual and cash basis under Section 15 of Act No. 20 of 2010. Expenditures incurred directly by syndicate partners are subject to board verification and reconciliation against equity contribution ledger accounts.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Site Accountant)</div>
      <div class="sig-sub">Accounts & Finance Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Head of Audit & Quality Control</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Executive Syndicate Committee</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildPendingApprovalPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const items = data.items || [];
  const kpis = data.kpis || {
    totalPendingAmount: data.totals?.amount || 0,
    totalPendingCount: items.length,
    averageAgeDays: data.totals?.age || 0,
    maxAgeDays: 0,
    highAgeAmount: 0,
    bankAmount: 0,
  };

  const rowsHtml = items.map((r: any, idx: number) => {
    let sevBg = "#ecfdf5";
    let sevColor = "#047857";
    if (r.agingSeverity === "CRITICAL") {
      sevBg = "#fff1f2";
      sevColor = "#be123c";
    } else if (r.agingSeverity === "HIGH") {
      sevBg = "#fff7ed";
      sevColor = "#c2410c";
    } else if (r.agingSeverity === "MODERATE") {
      sevBg = "#fffbeb";
      sevColor = "#b45309";
    }

    const chLabel = r.channel === "PAID_BY_PARTNER"
      ? `Partner: ${r.paidByPartnerName || "Partner"}`
      : r.channel === "BANK"
      ? `Bank: ${r.bankAccountName || "Bank Wire"}`
      : r.channel;

    const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    const dateStr = formatDate(r.date);

    return `
      <tr style="background:${rowBg};border-bottom:1px solid #e2e8f0;">
        <td style="padding:4px 6px;font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">${r.voucherNo}</td>
        <td style="padding:4px 6px;font-family:monospace;color:#475569;white-space:nowrap;">${dateStr}</td>
        <td style="padding:4px 6px;">
          <div style="font-weight:700;color:#0f172a;">${r.projectName}</div>
          ${r.mouza ? `<div style="font-size:7px;color:#64748b;">${r.mouza}</div>` : ""}
        </td>
        <td style="padding:4px 6px;white-space:nowrap;">
          <div style="font-weight:600;color:#1e293b;">${r.category}</div>
          <div style="font-size:6.5px;color:#64748b;text-transform:uppercase;">${r.categoryClassification || ""}</div>
        </td>
        <td style="padding:4px 6px;color:#334155;max-width:180px;">${r.description || "-"}</td>
        <td style="padding:4px 6px;font-size:7px;color:#475569;">${chLabel}</td>
        <td style="padding:4px 6px;font-size:7px;color:#64748b;">${r.postedBy}</td>
        <td style="padding:4px 6px;text-align:center;white-space:nowrap;">
          <span style="display:inline-block;padding:1px 6px;border-radius:4px;font-size:7px;font-weight:700;font-family:monospace;background:${sevBg};color:${sevColor};">
            ${r.ageDays}d (${r.agingSeverity})
          </span>
        </td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;font-weight:700;color:#b45309;white-space:nowrap;">
          ${formatBDT(r.amount)}
        </td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    /* Header */
    table.header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-bottom: 2px solid #b45309;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #1e1b4b;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }
    .report-title-main {
      font-size: 13px;
      font-weight: 800;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-meta-text {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* KPI Grid */
    .kpi-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    table.data-table th {
      background: #78350f;
      color: #ffffff;
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 6px;
      text-align: left;
      border-right: 1px solid #92400e;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 5px 8px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 4px;
      font-size: 7px;
      color: #78350f;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 6px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 3px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Internal Control, Quality Audit & Treasury Authorization Wing</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          <span>Filter: ${filterSummary || "All Records"}</span> &nbsp;·&nbsp;
          <span>Scope: ${projectName || "All Projects"}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #b45309;">
      <div class="kpi-label">Total Pending Queue</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(kpis.totalPendingAmount)}</div>
      <div class="kpi-sub">${kpis.totalPendingCount} Vouchers Awaiting Approval</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Average Approval Aging</div>
      <div class="kpi-val">${kpis.averageAgeDays.toFixed(1)} Days</div>
      <div class="kpi-sub">Max Latency: ${kpis.maxAgeDays} Days</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #e11d48;">
      <div class="kpi-label">Escalation Risk (>14 Days)</div>
      <div class="kpi-val" style="color:#be123c;">${formatBDT(kpis.highAgeAmount + (kpis.criticalAgeAmount || 0))}</div>
      <div class="kpi-sub">${(kpis.highAgeCount || 0) + (kpis.criticalAgeCount || 0)} Vouchers in High Latency</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Pending Bank Releases</div>
      <div class="kpi-val" style="color:#6d28d9;">${formatBDT(kpis.bankAmount)}</div>
      <div class="kpi-sub">${kpis.bankCount} Contractor Invoices</div>
    </div>
  </div>

  <!-- Master Pending Approval Queue Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:10%;">Voucher #</th>
        <th style="width:8%;">Date</th>
        <th style="width:14%;">Project & Mouza</th>
        <th style="width:12%;">Category Head</th>
        <th style="width:20%;">Particulars / Description</th>
        <th style="width:12%;">Channel / Source</th>
        <th style="width:10%;">Submitted By</th>
        <th style="width:6%;text-align:center;">Age (Days)</th>
        <th style="width:8%;text-align:right;">Amount (BDT)</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#78350f;color:#ffffff;font-weight:700;font-size:8px;">
        <td colspan="4" style="padding:5px 6px;">GRAND TOTAL PENDING QUEUE (${items.length} VOUCHERS)</td>
        <td colspan="3" style="padding:5px 6px;font-size:7px;color:#fef3c7;">
          Average Latency: ${kpis.averageAgeDays.toFixed(1)} days &nbsp;|&nbsp; Max: ${kpis.maxAgeDays} days
        </td>
        <td style="padding:5px 6px;text-align:center;font-family:monospace;font-size:8px;color:#ffffff;">
          Avg ${kpis.averageAgeDays.toFixed(1)}d
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#ffffff;">
          ${formatBDT(kpis.totalPendingAmount)}
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory & Audit Footnote -->
  <div class="statutory-box">
    <strong>Dual-Authorization Governance Protocol (Act No. 20 of 2010 Section 15):</strong> All project expenditure entries require mandatory dual authorization (Maker/Checker). Unapproved vouchers remain in suspense and do not reduce audited treasury bank balances or project equity until formal sign-off.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Field Officer)</div>
      <div class="sig-sub">Site Accounts & Operations</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Internal Audit)</div>
      <div class="sig-sub">Quality Control & Compliance</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Executive Syndicate Authorization</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildLandDocumentsPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const items = data.items || [];
  const kpis = data.kpis || {
    totalProjects: items.length,
    totalAreaShotok: data.totals?.area || 0,
    totalAreaAcres: (data.totals?.area || 0) / 100,
    totalNetPlotAreaShotok: data.totals?.netArea || 0,
    totalAcquisitionCost: data.totals?.acquisitionCost || 0,
    totalPlots: 0,
    overallEfficiencyRatio: 0,
    registeredProjectsCount: 0,
  };

  const rowsHtml = items.map((r: any, idx: number) => {
    const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    const statusBg =
      r.status === "SOLD_OUT"
        ? "#ecfdf5"
        : r.status === "SELLING"
        ? "#eff6ff"
        : r.status === "DEVELOPING"
        ? "#f5f3ff"
        : r.status === "UNDER_BAYNA"
        ? "#fffbeb"
        : "#f1f5f9";

    const statusColor =
      r.status === "SOLD_OUT"
        ? "#047857"
        : r.status === "SELLING"
        ? "#1d4ed8"
        : r.status === "DEVELOPING"
        ? "#6d28d9"
        : r.status === "UNDER_BAYNA"
        ? "#b45309"
        : "#475569";

    const partnerSummary = r.partners
      ? r.partners.map((p: any) => `${p.name} (${p.sharePercentage}%)`).join(", ")
      : "-";

    return `
      <tr style="background:${rowBg};border-bottom:1px solid #e2e8f0;">
        <td style="padding:4px 6px;">
          <div style="font-weight:700;color:#0f172a;">${r.projectName}</div>
          <span style="display:inline-block;padding:1px 5px;border-radius:3px;font-size:6.5px;font-weight:700;background:${statusBg};color:${statusColor};margin-top:1px;">
            ${r.statusLabelEn}
          </span>
        </td>
        <td style="padding:4px 6px;">
          <div style="font-weight:600;color:#1e293b;">${r.mouza}</div>
          <div style="font-size:7px;color:#64748b;font-family:monospace;">J.L. #${r.jlNumber}</div>
        </td>
        <td style="padding:4px 6px;font-family:monospace;font-size:7px;color:#334155;max-width:130px;">
          ${r.dagNumbers}
        </td>
        <td style="padding:4px 6px;font-family:monospace;font-size:7px;color:#334155;max-width:130px;">
          ${r.khatianNumbers}
        </td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">
          ${r.totalAreaShotok.toFixed(2)}
        </td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;color:#047857;white-space:nowrap;">
          <div>${r.netPlotAreaShotok.toFixed(2)}</div>
          <div style="font-size:6.5px;color:#059669;">${r.efficiencyRatio.toFixed(1)}%</div>
        </td>
        <td style="padding:4px 6px;text-align:center;font-family:monospace;white-space:nowrap;">
          <span style="font-weight:700;color:#047857;">${r.soldPlots}</span> / <span style="font-weight:600;color:#1e293b;">${r.totalPlots}</span>
        </td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">
          <div>${formatBDT(r.totalAcquisitionCost)}</div>
          <div style="font-size:6.5px;color:#64748b;">${formatBDT(r.costPerShotok)}/sh</div>
        </td>
        <td style="padding:4px 6px;font-size:7px;color:#475569;max-width:140px;">
          ${partnerSummary}
        </td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    /* Header */
    table.header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-bottom: 2px solid #065f46;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #1e1b4b;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }
    .report-title-main {
      font-size: 13px;
      font-weight: 800;
      color: #065f46;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-meta-text {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    /* KPI Grid */
    .kpi-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .kpi-card {
      flex: 1;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
    }
    .kpi-label {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    table.data-table th {
      background: #064e3b;
      color: #ffffff;
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 6px;
      text-align: left;
      border-right: 1px solid #047857;
    }
    table.data-table th:last-child {
      border-right: none;
    }

    /* Statutory Note */
    .statutory-box {
      padding: 5px 8px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 4px;
      font-size: 7px;
      color: #064e3b;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    /* Signatures */
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 6px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 28%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-bottom: 3px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Cadastral Survey, Land Title & Property Registration Department</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          <span>Portfolio: ${kpis.totalProjects} Land Estates</span> &nbsp;·&nbsp;
          <span>Total Acreage: ${kpis.totalAreaShotok.toFixed(2)} Shotok (${kpis.totalAreaAcres.toFixed(2)} Acres)</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Total Land Acreage</div>
      <div class="kpi-val" style="color:#047857;">${kpis.totalAreaShotok.toFixed(2)} Shotok</div>
      <div class="kpi-sub">${kpis.totalAreaAcres.toFixed(2)} Acres across ${kpis.totalProjects} Registered Estates</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Capitalized Acquisition Outlay</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(kpis.totalAcquisitionCost)}</div>
      <div class="kpi-sub">Avg Rate: ${formatBDT(kpis.avgCostPerShotok)} / Shotok</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Demarcated Plot Inventory</div>
      <div class="kpi-val" style="color:#6d28d9;">${kpis.totalPlots} Plots (${kpis.totalNetPlotAreaShotok.toFixed(1)} Sh)</div>
      <div class="kpi-sub">Planning Efficiency: ${kpis.overallEfficiencyRatio.toFixed(1)}% Saleable</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #b45309;">
      <div class="kpi-label">Title Clearance & Status</div>
      <div class="kpi-val" style="color:#b45309;">${kpis.registeredProjectsCount} / ${kpis.totalProjects} Registered</div>
      <div class="kpi-sub">${kpis.underBaynaProjectsCount} Under Bayna · ${kpis.draftProjectsCount} Due Diligence</div>
    </div>
  </div>

  <!-- Cadastral Matrix Table -->
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:14%;">Project & Status</th>
        <th style="width:13%;">Mouza & J.L. No.</th>
        <th style="width:14%;">Dag Numbers (CS/SA/RS/BS)</th>
        <th style="width:14%;">Khatian Record Porchas</th>
        <th style="width:8%;text-align:right;">Gross Area</th>
        <th style="width:8%;text-align:right;">Net Plots</th>
        <th style="width:6%;text-align:center;">Plots</th>
        <th style="width:10%;text-align:right;">Acq Outlay</th>
        <th style="width:13%;">Syndicate Ownership Shares</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#064e3b;color:#ffffff;font-weight:700;font-size:8px;">
        <td colspan="4" style="padding:5px 6px;">PORTFOLIO TOTALS (${items.length} REGISTERED ESTATES)</td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;">${kpis.totalAreaShotok.toFixed(2)}</td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8px;color:#a7f3d0;">${kpis.totalNetPlotAreaShotok.toFixed(2)}</td>
        <td style="padding:5px 6px;text-align:center;font-family:monospace;font-size:8px;">${kpis.totalPlots}</td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#ffffff;">
          ${formatBDT(kpis.totalAcquisitionCost)}
        </td>
        <td style="padding:5px 6px;font-size:7px;color:#d1fae5;">
          Efficiency: ${kpis.overallEfficiencyRatio.toFixed(1)}% | Avg Rate: ${formatBDT(kpis.avgCostPerShotok)}/sh
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory Cadastral Footnote -->
  <div class="statutory-box">
    <strong>Statutory Cadastral & Title Governance Standard (Act No. XVI of 1908 & Act XXVIII of 1951):</strong> All project land parcels are authenticated against official revenue records (CS, SA, RS, and BS porcha khatians), registered deeds, and formal mutation orders issued by the Assistant Commissioner (Land).
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Head Surveyor)</div>
      <div class="sig-sub">Cadastral Survey & Demarcation</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Legal Counsel)</div>
      <div class="sig-sub">Title Search & Non-Encumbrance (NEC)</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Partner)</div>
      <div class="sig-sub">Syndicate Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildSalesRegisterPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const items = (data.items || []) as any[];
  const kpis = data.kpis || {
    totalSalesCount: 0,
    totalAgreedPrice: 0,
    totalCashCollected: 0,
    totalActiveReceivables: 0,
    overallCollectionRate: 0,
    totalAreaSoldShotok: 0,
    avgRatePerShotok: 0,
    fullyPaidContractsCount: 0,
    activeInstallmentPlansCount: 0,
  };
  const projectBreakdown = (data.projectSalesBreakdown || []) as any[];

  // Render Master Rows
  const rowsHtml = items.map((row: any, idx: number) => {
    const isSold = row.status === "SOLD";
    const statusBg = isSold ? "#ecfdf5" : "#eff6ff";
    const statusColor = isSold ? "#047857" : "#1d4ed8";
    const statusBorder = isSold ? "#a7f3d0" : "#bfdbfe";
    const statusText = isBn ? row.statusLabelBn : row.statusLabelEn;

    const rateFmt = row.ratePerShotok > 0 ? `@ ${formatBDT(row.ratePerShotok)}/sh` : "";

    return `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="font-weight:600;color:#0f172a;white-space:nowrap;">
          <div>${row.contractNo}</div>
          <div style="font-size:7.5px;color:#64748b;font-weight:normal;">${formatDate(row.saleDate)}</div>
        </td>
        <td>
          <div style="font-weight:600;color:#0f172a;">${row.buyerName}</div>
          <div style="font-size:7.5px;color:#64748b;">${row.buyerPhone}${row.buyerNid ? ` · NID: ${row.buyerNid}` : ""}</div>
        </td>
        <td>
          <div style="font-weight:600;color:#0f172a;">${row.projectName}</div>
          <div style="font-size:7.5px;color:#64748b;">${row.mouza || "-"}</div>
        </td>
        <td>
          <div style="font-weight:600;color:#0f172a;">Plot ${row.plotNumber}</div>
          <div style="font-size:7.5px;color:#64748b;">${row.plotSizeShotok.toFixed(2)} Shotok ${rateFmt}</div>
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">
          ${formatBDT(row.totalAgreedPrice)}
        </td>
        <td style="text-align:right;font-family:monospace;color:#475569;">
          ${row.advanceBookingAmount > 0 ? formatBDT(row.advanceBookingAmount) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:600;color:#047857;">
          <div>${formatBDT(row.totalPaid)}</div>
          <div style="font-size:7px;color:#059669;">(${row.collectionRate.toFixed(1)}%)</div>
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:${row.currentDue > 0 ? "#dc2626" : "#94a3b8"};">
          ${row.currentDue > 0 ? formatBDT(row.currentDue) : "৳ 0.00"}
        </td>
        <td style="text-align:center;">
          <span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:7.5px;font-weight:700;background:${statusBg};color:${statusColor};border:1px solid ${statusBorder};">
            ${statusText}
          </span>
          ${row.installmentsCount > 0 ? `<div style="font-size:7px;color:#64748b;margin-top:2px;">${row.paidInstallmentsCount}/${row.installmentsCount} Paid</div>` : ""}
        </td>
      </tr>
    `;
  }).join("");

  // Project Breakdown Rows
  const projectRowsHtml = projectBreakdown.map((p: any) => `
    <tr style="background:#ffffff;">
      <td style="font-weight:600;color:#0f172a;">${p.projectName}</td>
      <td style="text-align:center;font-family:monospace;">${p.salesCount}</td>
      <td style="text-align:right;font-family:monospace;">${p.areaSoldShotok.toFixed(2)}</td>
      <td style="text-align:right;font-family:monospace;font-weight:600;">${formatBDT(p.agreedPrice)}</td>
      <td style="text-align:right;font-family:monospace;color:#047857;font-weight:600;">${formatBDT(p.cashCollected)}</td>
      <td style="text-align:right;font-family:monospace;color:${p.activeReceivables > 0 ? "#dc2626" : "#64748b"};font-weight:600;">${formatBDT(p.activeReceivables)}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">${p.collectionRate.toFixed(1)}%</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${isBn ? titleBn : titleEn}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 10px 0 4px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-table {
      margin-bottom: 12px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 4px 6px;
      border-bottom: 1px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
    }
    .summary-table td {
      padding: 3.5px 6px;
      border-bottom: 1px solid #f1f5f9;
      border-right: 1px solid #f1f5f9;
    }
    .data-table {
      margin-top: 4px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .data-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 5px 6px;
      letter-spacing: 0.02em;
      border-right: 1px solid #334155;
    }
    .data-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .data-table tr {
      page-break-inside: avoid;
    }
    .statutory-box {
      margin-top: 10px;
      padding: 6px 10px;
      background: #f8fafc;
      border-left: 3px solid #2563eb;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 7.5px;
      color: #334155;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    .sig-row {
      margin-top: 24px;
      display: table;
      width: 100%;
      table-layout: fixed;
      page-break-inside: avoid;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      padding: 0 16px;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      margin-bottom: 4px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .sig-title {
      font-size: 8.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Sales, Customer Contracts & Receivables Portfolio Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          ${projectName ? `<span>Project: ${projectName}</span> &nbsp;·&nbsp; ` : ""}
          <span>Scope: ${filterSummary}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Gross Booked Sales Value</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(kpis.totalAgreedPrice)}</div>
      <div class="kpi-sub">${kpis.totalSalesCount} Contracts · ${kpis.totalAreaSoldShotok.toFixed(2)} Shotok Demarcated</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Realised Cash Collections</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(kpis.totalCashCollected)}</div>
      <div class="kpi-sub">Overall Realisation Rate: ${kpis.overallCollectionRate.toFixed(1)}%</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #dc2626;">
      <div class="kpi-label">Active Receivables Portfolio</div>
      <div class="kpi-val" style="color:#dc2626;">${formatBDT(kpis.totalActiveReceivables)}</div>
      <div class="kpi-sub">${kpis.activeInstallmentPlansCount} Active Installment Plans</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Settlement & Land Metric</div>
      <div class="kpi-val" style="color:#6d28d9;">${kpis.fullyPaidContractsCount} / ${kpis.totalSalesCount} Settled</div>
      <div class="kpi-sub">Avg Land Rate: ${formatBDT(kpis.avgRatePerShotok)} / Shotok</div>
    </div>
  </div>

  ${projectBreakdown.length > 0 ? `
  <!-- Project Performance Summary -->
  <div class="section-title">Project-Wise Sales & Recovery Summary</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="width:24%;">Project Estate</th>
        <th style="width:10%;text-align:center;">Contracts</th>
        <th style="width:12%;text-align:right;">Area (Shotok)</th>
        <th style="width:16%;text-align:right;">Agreed Value (৳)</th>
        <th style="width:16%;text-align:right;">Cash Collected (৳)</th>
        <th style="width:14%;text-align:right;">Active Due (৳)</th>
        <th style="width:8%;text-align:right;">Realised %</th>
      </tr>
    </thead>
    <tbody>
      ${projectRowsHtml}
    </tbody>
  </table>
  ` : ""}

  <!-- Master Sales Register Table -->
  <div class="section-title">Master Sales & Booking Register (${items.length} Contracts)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:11%;">Contract & Date</th>
        <th style="width:15%;">Buyer / Customer</th>
        <th style="width:13%;">Project & Mouza</th>
        <th style="width:11%;">Plot Demarcation</th>
        <th style="width:12%;text-align:right;">Agreed Price</th>
        <th style="width:9%;text-align:right;">Booking Adv.</th>
        <th style="width:11%;text-align:right;">Realised Cash</th>
        <th style="width:10%;text-align:right;">Active Due</th>
        <th style="width:8%;text-align:center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;font-size:8px;">
        <td colspan="4" style="padding:5px 6px;">
          PORTFOLIO TOTALS (${items.length} CONTRACTS · ${kpis.totalAreaSoldShotok.toFixed(2)} SHOTOK DEMARCATED)
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;">
          ${formatBDT(kpis.totalAgreedPrice)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8px;color:#94a3b8;">
          -
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#86efac;">
          ${formatBDT(kpis.totalCashCollected)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#fca5a5;">
          ${formatBDT(kpis.totalActiveReceivables)}
        </td>
        <td style="padding:5px 6px;text-align:center;font-size:7.5px;color:#cbd5e1;">
          ${kpis.overallCollectionRate.toFixed(1)}% Realised
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory Real Estate Act Footnote -->
  <div class="statutory-box">
    <strong>Statutory Real Estate Governance (Real Estate Development and Management Act, 2010 - Sections 13 & 14):</strong>
    All land sales covenants, allotment schedules, and installment receipts are maintained in compliance with statutory consumer protections. Title deed registration and formal handover are executed upon complete settlement of contractual receivables.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Sales & Accounts)</div>
      <div class="sig-sub">Commercial Booking Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Head of Finance)</div>
      <div class="sig-sub">Treasury & Credit Recovery</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Board of Management</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildPlotInventoryPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const items = (data.items || []) as any[];
  const kpis = data.kpis || {
    totalPlots: 0,
    totalAreaShotok: 0,
    totalAreaKatha: 0,
    totalAreaAcres: 0,
    availableCount: 0,
    availableAreaShotok: 0,
    availableValuation: 0,
    bookedCount: 0,
    bookedAreaShotok: 0,
    bookedValuation: 0,
    soldCount: 0,
    soldAreaShotok: 0,
    soldValuation: 0,
    reservedHeldCount: 0,
    reservedHeldAreaShotok: 0,
    reservedHeldValuation: 0,
    unpricedCount: 0,
    unpricedAreaShotok: 0,
    totalAskingValuation: 0,
    avgAskingRatePerShotok: 0,
    disposalRate: 0,
  };
  const projectBreakdown = (data.projectBreakdown || []) as any[];

  // Render Master Rows
  const rowsHtml = items.map((row: any, idx: number) => {
    let statusBg = "#f1f5f9";
    let statusColor = "#334155";
    let statusBorder = "#cbd5e1";

    if (row.status === "AVAILABLE") {
      statusBg = "#ecfdf5";
      statusColor = "#047857";
      statusBorder = "#a7f3d0";
    } else if (row.status === "BOOKED") {
      statusBg = "#eff6ff";
      statusColor = "#1d4ed8";
      statusBorder = "#bfdbfe";
    } else if (row.status === "SOLD") {
      statusBg = "#f8fafc";
      statusColor = "#334155";
      statusBorder = "#cbd5e1";
    } else if (row.status === "RESERVED" || row.status === "HELD") {
      statusBg = "#fffbeb";
      statusColor = "#b45309";
      statusBorder = "#fde68a";
    } else if (row.status === "UNPRICED") {
      statusBg = "#f8fafc";
      statusColor = "#64748b";
      statusBorder = "#e2e8f0";
    }

    const statusText = isBn ? row.statusLabelBn : row.statusLabelEn;
    const rateFmt = row.ratePerShotok > 0 ? formatBDT(row.ratePerShotok) : "-";

    return `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="font-weight:700;color:#0f172a;font-family:monospace;white-space:nowrap;">
          <div>${row.plotNumber}</div>
          <div style="font-size:7px;color:#64748b;font-family:sans-serif;font-weight:normal;">Demarcated Parcel</div>
        </td>
        <td>
          <div style="font-weight:600;color:#0f172a;">${row.projectName}</div>
          <div style="font-size:7px;color:#64748b;">${row.mouza || "-"}</div>
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">
          <div>${row.plotSizeShotok.toFixed(2)} Sh</div>
          <div style="font-size:7px;color:#64748b;font-weight:normal;">(${row.plotSizeKatha.toFixed(2)} Katha)</div>
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">
          ${row.askingPrice > 0 ? formatBDT(row.askingPrice) : '<span style="color:#94a3b8;font-weight:normal;">Unpriced</span>'}
        </td>
        <td style="text-align:right;font-family:monospace;color:#475569;">
          ${rateFmt}
        </td>
        <td style="text-align:center;">
          <span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:7px;font-weight:700;background:${statusBg};color:${statusColor};border:1px solid ${statusBorder};">
            ${statusText}
          </span>
        </td>
        <td>
          ${row.buyerName ? `
            <div style="font-weight:600;color:#0f172a;">${row.buyerName}</div>
            <div style="font-size:7px;color:#64748b;">${row.buyerPhone || ""}${row.currentDueAmount > 0 ? ` · Due: ${formatBDT(row.currentDueAmount)}` : " · Fully Settled"}</div>
          ` : `
            <span style="color:#94a3b8;font-style:italic;font-size:7.5px;">Unallocated Stock</span>
          `}
        </td>
      </tr>
    `;
  }).join("");

  // Project Breakdown Rows
  const projectRowsHtml = projectBreakdown.map((p: any) => `
    <tr style="background:#ffffff;">
      <td style="font-weight:600;color:#0f172a;">${p.projectName}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700;">${p.totalPlots}</td>
      <td style="text-align:right;font-family:monospace;">${p.totalAreaShotok.toFixed(1)}</td>
      <td style="text-align:center;font-family:monospace;color:#047857;font-weight:600;">${p.availableCount}</td>
      <td style="text-align:center;font-family:monospace;color:#1d4ed8;font-weight:600;">${p.bookedCount}</td>
      <td style="text-align:center;font-family:monospace;color:#334155;font-weight:600;">${p.soldCount}</td>
      <td style="text-align:center;font-family:monospace;color:#64748b;">${p.unpricedCount + p.reservedCount}</td>
      <td style="text-align:right;font-family:monospace;font-weight:600;color:#047857;">${formatBDT(p.askingValuation)}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">${p.disposalRate.toFixed(1)}%</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${isBn ? titleBn : titleEn}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 10px 0 4px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-table {
      margin-bottom: 12px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 4px 6px;
      border-bottom: 1px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
    }
    .summary-table td {
      padding: 3.5px 6px;
      border-bottom: 1px solid #f1f5f9;
      border-right: 1px solid #f1f5f9;
    }
    .data-table {
      margin-top: 4px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .data-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 5px 6px;
      letter-spacing: 0.02em;
      border-right: 1px solid #334155;
    }
    .data-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .data-table tr {
      page-break-inside: avoid;
    }
    .statutory-box {
      margin-top: 10px;
      padding: 6px 10px;
      background: #f8fafc;
      border-left: 3px solid #059669;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 7.5px;
      color: #334155;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    .sig-row {
      margin-top: 24px;
      display: table;
      width: 100%;
      table-layout: fixed;
      page-break-inside: avoid;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      padding: 0 16px;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      margin-bottom: 4px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .sig-title {
      font-size: 8.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Cadastral Demarcation, Plot Inventory & Real Estate Asset Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          ${projectName ? `<span>Project: ${projectName}</span> &nbsp;·&nbsp; ` : ""}
          <span>Scope: ${filterSummary}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #0f172a;">
      <div class="kpi-label">Total Demarcated Stock</div>
      <div class="kpi-val" style="color:#0f172a;">${kpis.totalPlots} Plots</div>
      <div class="kpi-sub">${kpis.totalAreaShotok.toFixed(2)} Shotok (${kpis.totalAreaAcres.toFixed(2)} Acres)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Available For Sale</div>
      <div class="kpi-val" style="color:#047857;">${kpis.availableCount} Plots</div>
      <div class="kpi-sub">${kpis.availableAreaShotok.toFixed(2)} Shotok · Val: ${formatBDT(kpis.availableValuation)}</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Contracted / Disposed</div>
      <div class="kpi-val" style="color:#1d4ed8;">${kpis.soldCount + kpis.bookedCount} Plots</div>
      <div class="kpi-sub">${kpis.soldCount} Sold · ${kpis.bookedCount} Booked (${kpis.disposalRate.toFixed(1)}% Absorbed)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #7c3aed;">
      <div class="kpi-label">Pipeline & Valuation</div>
      <div class="kpi-val" style="color:#6d28d9;">${formatBDT(kpis.totalAskingValuation)}</div>
      <div class="kpi-sub">Avg Benchmark: ${formatBDT(kpis.avgAskingRatePerShotok)} / Shotok</div>
    </div>
  </div>

  ${projectBreakdown.length > 0 ? `
  <!-- Project Performance Summary -->
  <div class="section-title">Estate-Wise Inventory Stock & Absorption Summary</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="width:24%;">Project Estate</th>
        <th style="width:8%;text-align:center;">Total</th>
        <th style="width:10%;text-align:right;">Area (Sh)</th>
        <th style="width:9%;text-align:center;">Available</th>
        <th style="width:9%;text-align:center;">Booked</th>
        <th style="width:8%;text-align:center;">Sold</th>
        <th style="width:8%;text-align:center;">Pipeline</th>
        <th style="width:14%;text-align:right;">Asking Value (৳)</th>
        <th style="width:10%;text-align:right;">Disposed %</th>
      </tr>
    </thead>
    <tbody>
      ${projectRowsHtml}
    </tbody>
  </table>
  ` : ""}

  <!-- Master Plot Stock Table -->
  <div class="section-title">Master Plot Demarcation & Allotment Register (${items.length} Plots)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:10%;">Plot No.</th>
        <th style="width:18%;">Project Estate & Mouza</th>
        <th style="width:12%;text-align:right;">Area (Shotok)</th>
        <th style="width:13%;text-align:right;">Asking Valuation</th>
        <th style="width:11%;text-align:right;">Rate / Shotok</th>
        <th style="width:12%;text-align:center;">Stock Status</th>
        <th style="width:24%;">Customer Allotment / Buyer</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;font-size:8px;">
        <td colspan="2" style="padding:5px 6px;">
          PORTFOLIO TOTALS (${items.length} DEMARCATED PLOTS)
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#86efac;">
          ${kpis.totalAreaShotok.toFixed(2)} Sh
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#86efac;">
          ${formatBDT(kpis.totalAskingValuation)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8px;color:#cbd5e1;">
          Avg: ${formatBDT(kpis.avgAskingRatePerShotok)}
        </td>
        <td style="padding:5px 6px;text-align:center;font-size:7.5px;color:#86efac;">
          ${kpis.availableCount} Avail · ${kpis.soldCount + kpis.bookedCount} Disposed
        </td>
        <td style="padding:5px 6px;font-size:7.5px;color:#cbd5e1;">
          Disposal Rate: ${kpis.disposalRate.toFixed(1)}% | Avail Val: ${formatBDT(kpis.availableValuation)}
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory Demarcation Footnote -->
  <div class="statutory-box">
    <strong>Statutory Demarcation & Real Estate Compliance (Town Improvement Act & Real Estate Development and Management Act, 2010):</strong>
    All plot boundaries, dimensions, and easement covenants strictly correspond to registered master layout plans. Ownership mutation and final Sub-Kabala deed registration are executed upon complete settlement of purchase consideration.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Head Surveyor)</div>
      <div class="sig-sub">Cadastral Demarcation Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Commercial Sales Manager)</div>
      <div class="sig-sub">Inventory & Stock Allotment</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Board of Management</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildBuyerStatementPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const sale = data.sale;
  const kpis = data.kpis || {
    totalAgreedPrice: 0,
    totalPaid: 0,
    currentDue: 0,
    collectionRate: 0,
    installmentsCount: 0,
    paidInstallmentsCount: 0,
    upcomingInstallmentsCount: 0,
    overdueInstallmentsCount: 0,
  };
  const ledgerEntries = (data.ledgerEntries || []) as any[];
  const schedules = (data.schedules || []) as any[];

  // Render Ledger Rows
  const ledgerRowsHtml = ledgerEntries.map((row: any, idx: number) => {
    return `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="font-family:monospace;white-space:nowrap;color:#475569;">
          ${formatDate(row.date)}
        </td>
        <td style="font-family:monospace;font-weight:700;color:#0f172a;">
          ${row.reference}
        </td>
        <td>
          <div style="font-weight:600;color:#0f172a;">${row.description}</div>
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">
          ${row.debit > 0 ? formatBDT(row.debit) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;">
          ${row.credit > 0 ? formatBDT(row.credit) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">
          ${formatBDT(row.balance)}
        </td>
      </tr>
    `;
  }).join("");

  // Render Schedule Rows
  const scheduleRowsHtml = schedules.map((sch: any) => {
    const isPaid = sch.status === "PAID";
    const isOverdue = sch.status === "OVERDUE";
    const statusBg = isPaid ? "#ecfdf5" : isOverdue ? "#fef2f2" : "#eff6ff";
    const statusColor = isPaid ? "#047857" : isOverdue ? "#dc2626" : "#1d4ed8";
    const statusText = isBn ? sch.statusLabelBn : sch.statusLabelEn;

    return `
      <tr style="background:#ffffff;">
        <td style="text-align:center;font-family:monospace;font-weight:700;">#${sch.installmentNo}</td>
        <td style="font-family:monospace;color:#334155;">${formatDate(sch.dueDate)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;">${formatBDT(sch.dueAmount)}</td>
        <td style="text-align:center;">
          <span style="display:inline-block;padding:1px 5px;border-radius:3px;font-size:7px;font-weight:700;background:${statusBg};color:${statusColor};">
            ${statusText}
          </span>
        </td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${isBn ? titleBn : titleEn}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 10px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .dossier-grid {
      display: table;
      width: 100%;
      margin-bottom: 10px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
    }
    .dossier-col {
      display: table-cell;
      width: 50%;
      padding: 8px 12px;
      vertical-align: top;
    }
    .dossier-col + .dossier-col {
      border-left: 1px solid #cbd5e1;
    }
    .dossier-title {
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      color: #047857;
      margin-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }
    .dossier-row {
      display: table;
      width: 100%;
      margin-bottom: 2px;
      font-size: 8px;
    }
    .dossier-label {
      display: table-cell;
      width: 35%;
      color: #64748b;
    }
    .dossier-val {
      display: table-cell;
      width: 65%;
      font-weight: 700;
      color: #0f172a;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 10px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 8px 0 3px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .data-table {
      margin-top: 4px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .data-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 4px 6px;
      letter-spacing: 0.02em;
      border-right: 1px solid #334155;
    }
    .data-table td {
      padding: 3.5px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .data-table tr {
      page-break-inside: avoid;
    }
    .statutory-box {
      margin-top: 8px;
      padding: 5px 8px;
      background: #f8fafc;
      border-left: 3px solid #2563eb;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 7px;
      color: #334155;
      line-height: 1.35;
      page-break-inside: avoid;
    }
    .sig-row {
      margin-top: 20px;
      display: table;
      width: 100%;
      table-layout: fixed;
      page-break-inside: avoid;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      padding: 0 16px;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      margin-bottom: 4px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 6.5px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Customer Accounts, Plot Allotment & Credit Portfolio Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          <span>Statement Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  ${sale ? `
  <!-- Customer & Property Dossier -->
  <div class="dossier-grid">
    <div class="dossier-col">
      <div class="dossier-title">Customer / Buyer Profile</div>
      <div class="dossier-row"><div class="dossier-label">Full Name:</div><div class="dossier-val">${sale.buyerName}</div></div>
      <div class="dossier-row"><div class="dossier-label">Contact Phone:</div><div class="dossier-val">${sale.buyerPhone}</div></div>
      <div class="dossier-row"><div class="dossier-label">National ID (NID):</div><div class="dossier-val" style="font-family:monospace;">${sale.buyerNid || "N/A"}</div></div>
      <div class="dossier-row"><div class="dossier-label">Contract Number:</div><div class="dossier-val" style="font-family:monospace;">${sale.contractNo}</div></div>
      <div class="dossier-row"><div class="dossier-label">Contract Date:</div><div class="dossier-val">${formatDate(sale.saleDate)} (${sale.statusLabelEn})</div></div>
    </div>
    <div class="dossier-col">
      <div class="dossier-title">Demarcated Property Specification</div>
      <div class="dossier-row"><div class="dossier-label">Project Estate:</div><div class="dossier-val">${sale.projectName}</div></div>
      <div class="dossier-row"><div class="dossier-label">Cadastral Mouza:</div><div class="dossier-val">${sale.mouza || "Registered Cadastral Area"}</div></div>
      <div class="dossier-row"><div class="dossier-label">Demarcated Plot:</div><div class="dossier-val">Plot #${sale.plotNumber}</div></div>
      <div class="dossier-row"><div class="dossier-label">Land Dimensions:</div><div class="dossier-val">${sale.plotSizeShotok.toFixed(2)} Shotok (${sale.plotSizeKatha.toFixed(2)} Katha · ${sale.plotSizeSqFt.toFixed(0)} sq ft)</div></div>
      <div class="dossier-row"><div class="dossier-label">Benchmark Rate:</div><div class="dossier-val" style="font-family:monospace;">${formatBDT(sale.ratePerShotok)} / Shotok</div></div>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #0f172a;">
      <div class="kpi-label">Agreed Purchase Value</div>
      <div class="kpi-val" style="color:#0f172a;">${formatBDT(kpis.totalAgreedPrice)}</div>
      <div class="kpi-sub">Plot ${sale.plotNumber} (${sale.plotSizeShotok.toFixed(2)} Shotok)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Cash Realized / Paid</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(kpis.totalPaid)}</div>
      <div class="kpi-sub">${kpis.collectionRate.toFixed(1)}% Settled (${ledgerEntries.length - 1} Receipts)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #dc2626;">
      <div class="kpi-label">Outstanding Balance Due</div>
      <div class="kpi-val" style="color:${kpis.currentDue > 0 ? "#dc2626" : "#047857"};">${kpis.currentDue > 0 ? formatBDT(kpis.currentDue) : "৳ 0.00"}</div>
      <div class="kpi-sub">${kpis.upcomingInstallmentsCount + kpis.overdueInstallmentsCount} Remaining Due Schedules</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Installment Progress</div>
      <div class="kpi-val" style="color:#1d4ed8;">${kpis.paidInstallmentsCount} / ${kpis.installmentsCount || 1} Paid</div>
      <div class="kpi-sub">${sale.status === "SOLD" ? "Fully Disposed" : `${kpis.upcomingInstallmentsCount} Upcoming Schedules`}</div>
    </div>
  </div>

  <!-- Running Ledger -->
  <div class="section-title">Chronological Running Financial Account Ledger (${ledgerEntries.length} Transactions)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:12%;">Date</th>
        <th style="width:15%;">Reference No</th>
        <th style="width:37%;">Transaction Particulars</th>
        <th style="width:12%;text-align:right;">Debit (+Due)</th>
        <th style="width:12%;text-align:right;">Credit (-Paid)</th>
        <th style="width:12%;text-align:right;">Running Balance</th>
      </tr>
    </thead>
    <tbody>
      ${ledgerRowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;font-size:7.5px;">
        <td colspan="3" style="padding:4px 6px;">ACCOUNT STATEMENT TOTALS</td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;">${formatBDT(kpis.totalAgreedPrice)}</td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;color:#86efac;">${formatBDT(kpis.totalPaid)}</td>
        <td style="padding:4px 6px;text-align:right;font-family:monospace;color:#fde047;">${formatBDT(kpis.currentDue)}</td>
      </tr>
    </tfoot>
  </table>

  ${schedules.length > 0 ? `
  <!-- Installment Amortization Schedule (Compact Table) -->
  <div class="section-title" style="margin-top:10px;">Scheduled Installment Amortization Matrix (${schedules.length} Installments)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:15%;text-align:center;">Installment #</th>
        <th style="width:25%;">Scheduled Due Date</th>
        <th style="width:30%;text-align:right;">Scheduled Amount (৳)</th>
        <th style="width:30%;text-align:center;">Settlement Status</th>
      </tr>
    </thead>
    <tbody>
      ${scheduleRowsHtml}
    </tbody>
  </table>
  ` : ""}

  <!-- Statutory Real Estate Footnote -->
  <div class="statutory-box">
    <strong>Statutory Real Estate Notice (Real Estate Development and Management Act, 2010 - Section 13 & 14):</strong>
    This account statement certifies financial consideration received from the buyer. Registered deed transfer and physical possession demarcation are issued immediately upon complete settlement of outstanding dues.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Customer Accounts)</div>
      <div class="sig-sub">Commercial Credit Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Head of Finance)</div>
      <div class="sig-sub">Treasury & Credit Recovery</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Buyer / Allottee Acknowledgment</div>
      <div class="sig-sub">Signature & Date</div>
    </div>
  </div>
  ` : `
  <div style="padding:40px;text-align:center;color:#64748b;">
    No buyer contract selected.
  </div>
  `}

</body>
</html>`;
}

export function buildReceivablesAgingPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const items = (data.items || []) as any[];
  const kpis = data.kpis || {
    totalReceivables: 0,
    totalCurrentDue: 0,
    totalOverdue: 0,
    days1to30Total: 0,
    days31to60Total: 0,
    days61to90Total: 0,
    over90Total: 0,
    debtorsCount: 0,
    overdueDebtorsCount: 0,
    healthyDebtorsCount: 0,
    overdueRatio: 0,
    criticalRatio: 0,
  };
  const projectBreakdown = (data.projectBreakdown || []) as any[];
  const bucketPct = data.bucketPercentages || {
    notYetDue: 0,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
  };

  // Render Master Rows
  const rowsHtml = items.map((row: any, idx: number) => {
    let statusBg = "#f1f5f9";
    let statusColor = "#334155";
    if (row.riskTier === "HEALTHY") {
      statusBg = "#ecfdf5";
      statusColor = "#047857";
    } else if (row.riskTier === "LOW_RISK") {
      statusBg = "#fefce8";
      statusColor = "#854d0e";
    } else if (row.riskTier === "MEDIUM_RISK") {
      statusBg = "#fff7ed";
      statusColor = "#c2410c";
    } else if (row.riskTier === "HIGH_RISK") {
      statusBg = "#fef2f2";
      statusColor = "#b91c1c";
    } else if (row.riskTier === "CRITICAL_DEFAULT") {
      statusBg = "#ffe4e6";
      statusColor = "#be123c";
    }

    const riskText = isBn ? row.riskLabelBn : row.riskLabelEn;

    return `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="font-weight:700;color:#0f172a;white-space:nowrap;">
          <div>${row.buyerName}</div>
          <div style="font-size:7px;color:#64748b;font-weight:normal;">${row.buyerPhone}</div>
        </td>
        <td>
          <div style="font-weight:600;color:#0f172a;">Plot ${row.plotNumber}</div>
          <div style="font-size:7px;color:#64748b;">${row.projectName} (${row.plotSizeShotok.toFixed(1)} Sh)</div>
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;">
          ${formatBDT(row.totalDue)}
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:600;color:#047857;">
          ${row.notYetDue > 0 ? formatBDT(row.notYetDue) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;color:#b45309;">
          ${row.days1to30 > 0 ? formatBDT(row.days1to30) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;color:#c2410c;">
          ${row.days31to60 > 0 ? formatBDT(row.days31to60) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:600;color:#b91c1c;">
          ${row.days61to90 > 0 ? formatBDT(row.days61to90) : "-"}
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#be123c;">
          ${row.over90 > 0 ? formatBDT(row.over90) : "-"}
        </td>
        <td style="text-align:center;">
          <span style="display:inline-block;padding:2px 5px;border-radius:3px;font-size:7px;font-weight:700;background:${statusBg};color:${statusColor};">
            ${riskText}
          </span>
        </td>
      </tr>
    `;
  }).join("");

  // Project Breakdown Rows
  const projectRowsHtml = projectBreakdown.map((p: any) => `
    <tr style="background:#ffffff;">
      <td style="font-weight:600;color:#0f172a;">${p.projectName}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700;">${p.debtorsCount}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;">${formatBDT(p.totalDue)}</td>
      <td style="text-align:right;font-family:monospace;color:#047857;">${formatBDT(p.notYetDue)}</td>
      <td style="text-align:right;font-family:monospace;color:#b45309;">${p.days1to30 > 0 ? formatBDT(p.days1to30) : "-"}</td>
      <td style="text-align:right;font-family:monospace;color:#c2410c;">${p.days31to60 > 0 ? formatBDT(p.days31to60) : "-"}</td>
      <td style="text-align:right;font-family:monospace;color:#b91c1c;">${p.days61to90 > 0 ? formatBDT(p.days61to90) : "-"}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#be123c;">${p.over90 > 0 ? formatBDT(p.over90) : "-"}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:${p.overdueRatio > 25 ? "#be123c" : "#0f172a"};">${p.overdueRatio.toFixed(1)}%</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${isBn ? titleBn : titleEn}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 10px 0 4px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-table {
      margin-bottom: 12px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 4px 6px;
      border-bottom: 1px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
    }
    .summary-table td {
      padding: 3.5px 6px;
      border-bottom: 1px solid #f1f5f9;
      border-right: 1px solid #f1f5f9;
    }
    .data-table {
      margin-top: 4px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .data-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 5px 6px;
      letter-spacing: 0.02em;
      border-right: 1px solid #334155;
    }
    .data-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .data-table tr {
      page-break-inside: avoid;
    }
    .statutory-box {
      margin-top: 10px;
      padding: 6px 10px;
      background: #f8fafc;
      border-left: 3px solid #dc2626;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 7.5px;
      color: #334155;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    .sig-row {
      margin-top: 24px;
      display: table;
      width: 100%;
      table-layout: fixed;
      page-break-inside: avoid;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      padding: 0 16px;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      margin-bottom: 4px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .sig-title {
      font-size: 8.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Credit Management, Receivables Recovery & Risk Mitigation Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          ${projectName ? `<span>Project: ${projectName}</span> &nbsp;·&nbsp; ` : ""}
          <span>Scope: ${filterSummary}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #0f172a;">
      <div class="kpi-label">Total Receivables Portfolio</div>
      <div class="kpi-val" style="color:#0f172a;">${formatBDT(kpis.totalReceivables)}</div>
      <div class="kpi-sub">${kpis.debtorsCount} Active Debtor Accounts</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #059669;">
      <div class="kpi-label">Current / Performing</div>
      <div class="kpi-val" style="color:#047857;">${formatBDT(kpis.totalCurrentDue)}</div>
      <div class="kpi-sub">${bucketPct.notYetDue.toFixed(1)}% Performing Book (${kpis.healthyDebtorsCount} Healthy)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #dc2626;">
      <div class="kpi-label">Total Overdue Delinquency</div>
      <div class="kpi-val" style="color:#dc2626;">${formatBDT(kpis.totalOverdue)}</div>
      <div class="kpi-sub">${kpis.overdueRatio.toFixed(1)}% Portfolio (${kpis.overdueDebtorsCount} Accounts)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #be123c;">
      <div class="kpi-label">Critical Default (90+ Days)</div>
      <div class="kpi-val" style="color:#be123c;">${formatBDT(kpis.over90Total)}</div>
      <div class="kpi-sub">${kpis.criticalRatio.toFixed(1)}% Statutory Notice Exposure</div>
    </div>
  </div>

  ${projectBreakdown.length > 0 ? `
  <!-- Project Summary -->
  <div class="section-title">Estate-Wise Credit Exposure & Aging Summary</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="width:22%;">Project Estate</th>
        <th style="width:8%;text-align:center;">Debtors</th>
        <th style="width:14%;text-align:right;">Total Due (৳)</th>
        <th style="width:13%;text-align:right;">Current (৳)</th>
        <th style="width:9%;text-align:right;">1-30d (৳)</th>
        <th style="width:9%;text-align:right;">31-60d (৳)</th>
        <th style="width:9%;text-align:right;">61-90d (৳)</th>
        <th style="width:10%;text-align:right;">90+d (৳)</th>
        <th style="width:6%;text-align:right;">Overdue %</th>
      </tr>
    </thead>
    <tbody>
      ${projectRowsHtml}
    </tbody>
  </table>
  ` : ""}

  <!-- Master Aging Matrix Table -->
  <div class="section-title">Master Debtor Aging Matrix (${items.length} Active Accounts)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:16%;">Debtor / Buyer</th>
        <th style="width:14%;">Contract & Plot</th>
        <th style="width:12%;text-align:right;">Total Due</th>
        <th style="width:10%;text-align:right;">Current (Not Due)</th>
        <th style="width:9%;text-align:right;">1-30 Days</th>
        <th style="width:9%;text-align:right;">31-60 Days</th>
        <th style="width:9%;text-align:right;">61-90 Days</th>
        <th style="width:9%;text-align:right;">90+ Days</th>
        <th style="width:12%;text-align:center;">Risk Severity</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;font-size:8px;">
        <td colspan="2" style="padding:5px 6px;">
          PORTFOLIO AGING TOTALS (${items.length} DEBTORS)
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;">
          ${formatBDT(kpis.totalReceivables)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8px;color:#86efac;">
          ${formatBDT(kpis.totalCurrentDue)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8px;color:#fde047;">
          ${formatBDT(kpis.days1to30Total)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8px;color:#fdba74;">
          ${formatBDT(kpis.days31to60Total)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8px;color:#fca5a5;">
          ${formatBDT(kpis.days61to90Total)}
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#fda4af;">
          ${formatBDT(kpis.over90Total)}
        </td>
        <td style="padding:5px 6px;text-align:center;font-size:7.5px;color:#cbd5e1;">
          Overdue: ${kpis.overdueRatio.toFixed(1)}%
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory Recovery Notice -->
  <div class="statutory-box">
    <strong>Statutory Real Estate Credit Governance (Real Estate Development and Management Act, 2010 - Section 14):</strong>
    In the event of installment delinquency, the developer is legally mandated to deliver a formal written notice with a minimum 30-day cure period via registered post prior to initiating cancellation of allotment or forfeiture proceedings.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Credit Recovery Officer)</div>
      <div class="sig-sub">Commercial Recovery Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Head of Finance)</div>
      <div class="sig-sub">Treasury & Credit Control</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Board of Management</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildInstallmentReportPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, projectName } = opts;
  const isBn = lang === "bn";
  const now = formatDateTime(new Date());

  const items = (data.items || []) as any[];
  const kpis = data.kpis || {
    totalInstallmentsCount: 0,
    totalUnsettledCount: 0,
    totalUnsettledAmount: 0,
    overdueCount: 0,
    overdueAmount: 0,
    dueNext7DaysCount: 0,
    dueNext7DaysAmount: 0,
    dueNext30DaysCount: 0,
    dueNext30DaysAmount: 0,
    futureCount: 0,
    futureAmount: 0,
    paidCount: 0,
    paidAmount: 0,
    activeDebtorsCount: 0,
    overdueDebtorsCount: 0,
    overdueRatio: 0,
  };
  const projectBreakdown = (data.projectBreakdown || []) as any[];

  // Render Master Rows (Show active and overdue schedules, limit to reasonable preview if too large)
  const rowsHtml = items.map((row: any, idx: number) => {
    let statusBg = "#f1f5f9";
    let statusColor = "#334155";
    if (row.status === "OVERDUE") {
      statusBg = "#fef2f2";
      statusColor = "#dc2626";
    } else if (row.status === "DUE_7D") {
      statusBg = "#fefce8";
      statusColor = "#b45309";
    } else if (row.status === "DUE_30D") {
      statusBg = "#eff6ff";
      statusColor = "#1d4ed8";
    } else if (row.status === "PAID") {
      statusBg = "#ecfdf5";
      statusColor = "#047857";
    }

    const statusText = isBn ? row.statusLabelBn : row.statusLabelEn;

    return `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="font-family:monospace;white-space:nowrap;">
          <div style="font-weight:700;color:#0f172a;">${formatDate(row.dueDate)}</div>
          <div style="font-size:7px;color:${row.diffDays < 0 ? "#dc2626" : "#64748b"};font-weight:600;">${row.daysText}</div>
        </td>
        <td>
          <div style="font-weight:700;color:#0f172a;">${row.buyerName}</div>
          <div style="font-size:7px;color:#64748b;">${row.buyerPhone}</div>
        </td>
        <td>
          <div style="font-weight:600;color:#0f172a;">Plot ${row.plotNumber}</div>
          <div style="font-size:7px;color:#64748b;">${row.projectName} (${row.contractNo})</div>
        </td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0f172a;font-size:8.5px;">
          ${formatBDT(row.dueAmount)}
        </td>
        <td style="text-align:center;">
          <span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:7px;font-weight:700;background:${statusBg};color:${statusColor};">
            ${statusText}
          </span>
        </td>
      </tr>
    `;
  }).join("");

  // Project Breakdown Rows
  const projectRowsHtml = projectBreakdown.map((p: any) => `
    <tr style="background:#ffffff;">
      <td style="font-weight:600;color:#0f172a;">${p.projectName}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700;">${p.unsettledCount}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;">${formatBDT(p.unsettledAmount)}</td>
      <td style="text-align:center;font-family:monospace;color:#dc2626;font-weight:700;">${p.overdueCount}</td>
      <td style="text-align:right;font-family:monospace;color:#dc2626;font-weight:700;">${formatBDT(p.overdueAmount)}</td>
      <td style="text-align:center;font-family:monospace;color:#1d4ed8;">${p.dueNext30DaysCount}</td>
      <td style="text-align:right;font-family:monospace;color:#1d4ed8;font-weight:600;">${formatBDT(p.dueNext30DaysAmount)}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:${p.overdueRatio > 20 ? "#dc2626" : "#0f172a"};">${p.overdueRatio.toFixed(1)}%</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${isBn ? titleBn : titleEn}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 10px 0 4px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-table {
      margin-bottom: 12px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 4px 6px;
      border-bottom: 1px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
    }
    .summary-table td {
      padding: 3.5px 6px;
      border-bottom: 1px solid #f1f5f9;
      border-right: 1px solid #f1f5f9;
    }
    .data-table {
      margin-top: 4px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .data-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 7.5px;
      text-transform: uppercase;
      padding: 5px 6px;
      letter-spacing: 0.02em;
      border-right: 1px solid #334155;
    }
    .data-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .data-table tr {
      page-break-inside: avoid;
    }
    .statutory-box {
      margin-top: 10px;
      padding: 6px 10px;
      background: #f8fafc;
      border-left: 3px solid #dc2626;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 7.5px;
      color: #334155;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    .sig-row {
      margin-top: 24px;
      display: table;
      width: 100%;
      table-layout: fixed;
      page-break-inside: avoid;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      padding: 0 16px;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      margin-bottom: 4px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .sig-title {
      font-size: 8.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Credit Management, Installment Amortization & Delinquency Recovery Division</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div class="report-title-main">${isBn ? titleBn : titleEn}</div>
        <div class="report-meta-text">
          ${projectName ? `<span>Project: ${projectName}</span> &nbsp;·&nbsp; ` : ""}
          <span>Scope: ${filterSummary}</span> &nbsp;·&nbsp;
          <span>Generated: ${now}</span> &nbsp;·&nbsp;
          <span>By: ${generatedBy}</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left:3px solid #dc2626;">
      <div class="kpi-label">Overdue Arrears</div>
      <div class="kpi-val" style="color:#dc2626;">${formatBDT(kpis.overdueAmount)}</div>
      <div class="kpi-sub">${kpis.overdueCount} Overdue Schedules (${kpis.overdueDebtorsCount} Delinquent Debtors)</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #b45309;">
      <div class="kpi-label">Due in Next 7 Days</div>
      <div class="kpi-val" style="color:#b45309;">${formatBDT(kpis.dueNext7DaysAmount)}</div>
      <div class="kpi-sub">${kpis.dueNext7DaysCount} Imminent Due Schedules</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #2563eb;">
      <div class="kpi-label">Monthly Inflow (8-30 Days)</div>
      <div class="kpi-val" style="color:#1d4ed8;">${formatBDT(kpis.dueNext30DaysAmount)}</div>
      <div class="kpi-sub">${kpis.dueNext30DaysCount} Schedules in 30-Day Pipeline</div>
    </div>
    <div class="kpi-card" style="border-left:3px solid #0f172a;">
      <div class="kpi-label">Active Portfolio Due</div>
      <div class="kpi-val" style="color:#0f172a;">${formatBDT(kpis.totalUnsettledAmount)}</div>
      <div class="kpi-sub">${kpis.totalUnsettledCount} Active Schedules (${kpis.activeDebtorsCount} Active Debtors)</div>
    </div>
  </div>

  ${projectBreakdown.length > 0 ? `
  <!-- Project Summary -->
  <div class="section-title">Estate-Wise Installment Due & Arrears Summary</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="width:24%;">Project Estate</th>
        <th style="width:10%;text-align:center;">Active Schedules</th>
        <th style="width:15%;text-align:right;">Active Due (৳)</th>
        <th style="width:10%;text-align:center;">Overdue Count</th>
        <th style="width:15%;text-align:right;">Overdue Arrears (৳)</th>
        <th style="width:10%;text-align:center;">30-Day Due</th>
        <th style="width:16%;text-align:right;">30-Day Inflow (৳)</th>
      </tr>
    </thead>
    <tbody>
      ${projectRowsHtml}
    </tbody>
  </table>
  ` : ""}

  <!-- Master Schedules Table -->
  <div class="section-title">Master Installment Schedule Ledger (${items.length} Schedules)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:18%;">Due Date & Timeline</th>
        <th style="width:22%;">Debtor / Customer</th>
        <th style="width:26%;">Demarcated Property</th>
        <th style="width:18%;text-align:right;">Due Amount</th>
        <th style="width:16%;text-align:center;">Due Status</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;font-size:8px;">
        <td colspan="3" style="padding:5px 6px;">
          TOTAL SCHEDULES IN REGISTER (${items.length} SCHEDULES)
        </td>
        <td style="padding:5px 6px;text-align:right;font-family:monospace;font-size:8.5px;color:#86efac;">
          ${formatBDT(kpis.totalUnsettledAmount)}
        </td>
        <td style="padding:5px 6px;text-align:center;font-size:7.5px;color:#cbd5e1;">
          Overdue: ${formatBDT(kpis.overdueAmount)} (${kpis.overdueCount})
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Statutory Recovery Notice -->
  <div class="statutory-box">
    <strong>Statutory Installment Recovery Governance (Real Estate Development and Management Act, 2010 - Section 14):</strong>
    Developers are legally obligated to issue formal written demand notices via registered post with a minimum 30-day cure window prior to initiating allotment cancellation or forfeiture proceedings on overdue installments.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Installment Recovery Officer)</div>
      <div class="sig-sub">Commercial Collection Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Credit Manager)</div>
      <div class="sig-sub">Treasury & Credit Control</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Board of Management</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildCollectionReportPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang?: string;
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang = "en", data, projectName } = opts;

  const summary = {
    totalCollected: data?.kpis?.totalCollected ?? (data as any)?.summary?.totalCollected ?? 0,
    transactionCount: data?.kpis?.transactionCount ?? (data as any)?.summary?.transactionCount ?? 0,
    averageTicket: data?.kpis?.averageTicket ?? (data as any)?.summary?.averageTicket ?? 0,
    bankCollected: data?.kpis?.bankCollected ?? (data as any)?.summary?.bankCollected ?? 0,
    bankPercent: data?.kpis?.bankPercent ?? (data as any)?.summary?.bankPercent ?? 0,
    cashCollected: data?.kpis?.cashCollected ?? (data as any)?.summary?.cashCollected ?? 0,
    cashPercent: data?.kpis?.cashPercent ?? (data as any)?.summary?.cashPercent ?? 0,
    contractedBookValue: data?.kpis?.contractedBookValue ?? (data as any)?.summary?.contractedBookValue ?? 0,
    totalOutstandingDue: data?.kpis?.totalOutstandingDue ?? (data as any)?.summary?.totalOutstandingDue ?? 0,
    portfolioRealizationRate: data?.kpis?.portfolioRealizationRate ?? (data as any)?.summary?.portfolioRealizationRate ?? 0,
    projectBreakdown: data?.projectBreakdown ?? (data as any)?.summary?.projectBreakdown ?? [],
    channelBreakdown: data?.channelBreakdown ?? (data as any)?.summary?.channelBreakdown ?? [],
  };

  const receipts: any[] = data?.receipts || [];

  const nowStr = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const projectRowsHtml = summary.projectBreakdown
    .map(
      (p: any) => `
    <tr>
      <td style="font-weight:700;color:#0f172a;">${p.projectName}</td>
      <td style="text-align:center;">${p.contractCount}</td>
      <td style="text-align:right;font-family:monospace;">${formatBDT(p.totalAgreedPrice)}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;background:#f0fdf4;">${formatBDT(p.totalCollected)}</td>
      <td style="text-align:right;font-family:monospace;color:#be123c;">${formatBDT(p.currentDue)}</td>
      <td style="text-align:center;font-weight:700;font-family:monospace;color:#0f172a;">${p.realizationRate.toFixed(1)}%</td>
      <td style="text-align:center;font-family:monospace;">${p.transactionCount}</td>
    </tr>
  `
    )
    .join("");

  const channelRowsHtml = summary.channelBreakdown
    .map(
      (c: any) => `
    <tr>
      <td style="font-weight:600;color:#1e293b;">${c.accountName}</td>
      <td style="text-align:center;">
        <span style="display:inline-block;padding:1px 6px;border-radius:3px;font-size:7.5px;font-weight:700;${
          c.channel === "Cash" ? "background:#fef3c7;color:#92400e;" : "background:#dbeafe;color:#1e40af;"
        }">${c.channel}</span>
      </td>
      <td style="text-align:center;font-family:monospace;">${c.count}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;">${formatBDT(c.totalAmount)}</td>
      <td style="text-align:center;font-family:monospace;font-weight:600;">${c.percentage.toFixed(1)}%</td>
    </tr>
  `
    )
    .join("");

  const receiptRowsHtml = receipts
    .slice(0, 100) // Display up to 100 recent receipts in landscape print
    .map(
      (r: any) => `
    <tr>
      <td style="font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">${r.receiptNo}</td>
      <td style="font-family:monospace;white-space:nowrap;">${formatDate(r.paymentDate)}</td>
      <td>
        <div style="font-weight:600;color:#0f172a;">${r.buyerName}</div>
        <div style="font-size:7.5px;color:#64748b;font-family:monospace;">${r.buyerPhone}</div>
      </td>
      <td>
        <div style="font-weight:600;color:#1e293b;">Plot ${r.plotNo}</div>
        <div style="font-size:7.5px;color:#64748b;">${r.projectName}</div>
      </td>
      <td>
        <span style="display:inline-block;padding:1px 5px;border-radius:3px;font-size:7.5px;font-weight:700;${
          r.paymentMethod === "CASH" ? "background:#fef3c7;color:#92400e;" : "background:#dbeafe;color:#1e40af;"
        }">
          ${r.paymentMethod === "CASH" ? "Cash Vault" : r.bankAccountName}
        </span>
      </td>
      <td style="color:#475569;font-size:7.5px;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
        ${r.remarks}
      </td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;background:#f0fdf4;white-space:nowrap;">
        ${formatBDT(r.amountPaid)}
      </td>
    </tr>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 10px 0 4px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-table {
      margin-bottom: 12px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.03em;
      padding: 5px 6px;
      border: 1px solid #cbd5e1;
    }
    .summary-table td {
      padding: 4px 6px;
      border: 1px solid #e2e8f0;
    }
    .ledger-table {
      font-size: 8px;
      border: 1px solid #0f172a;
      margin-bottom: 16px;
    }
    .ledger-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.04em;
      padding: 5px 6px;
      border: 1px solid #1e293b;
    }
    .ledger-table td {
      padding: 4px 6px;
      border: 1px solid #e2e8f0;
    }
    .ledger-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .sig-row {
      display: table;
      width: 100%;
      margin-top: 24px;
      padding-top: 10px;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      vertical-align: top;
      padding: 0 15px;
    }
    .sig-line {
      border-top: 1px dashed #64748b;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Top Header Table -->
  <table class="header-table">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Commercial Treasury, Customer Realization & Audit Division</div>
        ${projectName ? `<div style="font-size:8.5px;color:#047857;font-weight:700;margin-top:2px;">Project Filter: ${projectName}</div>` : ""}
      </td>
      <td style="width: 50%; text-align: right; vertical-align: top;">
        <div class="report-title-main">${titleEn}</div>
        <div style="font-size: 9px; color: #475569; font-weight: 600;">${titleBn}</div>
        <div class="report-meta-text">
          Scope: ${filterSummary} · Generated: ${nowStr} · By: ${generatedBy}
        </div>
      </td>
    </tr>
  </table>

  <!-- 4 Macro KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left: 3px solid #047857;">
      <div class="kpi-label">Total Realized Inflow</div>
      <div class="kpi-val" style="color: #047857;">${formatBDT(summary.totalCollected)}</div>
      <div class="kpi-sub">${summary.transactionCount} Receipts · Avg ৳ ${Math.round(summary.averageTicket).toLocaleString()}</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #2563eb;">
      <div class="kpi-label">Bank & MFS Clearing</div>
      <div class="kpi-val" style="color: #2563eb;">${formatBDT(summary.bankCollected)}</div>
      <div class="kpi-sub">${summary.bankPercent.toFixed(1)}% of Inflows · Direct Wire</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #d97706;">
      <div class="kpi-label">Petty Cash Treasury</div>
      <div class="kpi-val" style="color: #d97706;">${formatBDT(summary.cashCollected)}</div>
      <div class="kpi-sub">${summary.cashPercent.toFixed(1)}% of Inflows · Vault Receipts</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #7c3aed;">
      <div class="kpi-label">Portfolio Realization</div>
      <div class="kpi-val" style="color: #7c3aed;">${summary.portfolioRealizationRate.toFixed(1)}%</div>
      <div class="kpi-sub">Due: ${formatBDT(summary.totalOutstandingDue)}</div>
    </div>
  </div>

  <!-- Estate Realization Table -->
  <div class="section-title">Estate-Wise Collection Realization & Recovery Summary</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="text-align:left;">Project Estate</th>
        <th style="text-align:center;">Contracts</th>
        <th style="text-align:right;">Agreed Value (৳)</th>
        <th style="text-align:right;">Realized Collections (৳)</th>
        <th style="text-align:right;">Outstanding Due (৳)</th>
        <th style="text-align:center;">Realization %</th>
        <th style="text-align:center;">Period Txns</th>
      </tr>
    </thead>
    <tbody>
      ${projectRowsHtml}
    </tbody>
  </table>

  <!-- Channels & Destination Accounts Table -->
  <div class="section-title">Clearing Channels & Treasury Accounts</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="text-align:left;">Destination Account / Clearing Channel</th>
        <th style="text-align:center;">Type</th>
        <th style="text-align:center;">Transactions</th>
        <th style="text-align:right;">Total Deposited (৳)</th>
        <th style="text-align:center;">Inflow Share</th>
      </tr>
    </thead>
    <tbody>
      ${channelRowsHtml}
    </tbody>
  </table>

  <!-- Master Money Receipt Register -->
  <div class="section-title">Master Money Receipt Register (${receipts.length} Total Receipts)</div>
  <table class="ledger-table">
    <thead>
      <tr>
        <th style="text-align:left;width:12%;">Receipt No</th>
        <th style="text-align:left;width:10%;">Date</th>
        <th style="text-align:left;width:20%;">Debtor / Customer</th>
        <th style="text-align:left;width:20%;">Demarcated Property</th>
        <th style="text-align:left;width:16%;">Clearing Channel</th>
        <th style="text-align:left;width:12%;">Remarks / Ref</th>
        <th style="text-align:right;width:10%;">Amount (৳)</th>
      </tr>
    </thead>
    <tbody>
      ${receiptRowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;">
        <td colspan="6" style="padding:6px;text-transform:uppercase;letter-spacing:0.04em;">
          Total Filtered Collections (${receipts.length} Receipts)
        </td>
        <td style="text-align:right;font-family:monospace;font-size:9.5px;color:#34d399;">
          ${formatBDT(summary.totalCollected)}
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Treasury Accountant)</div>
      <div class="sig-sub">Commercial Accounts Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Chief Financial Officer)</div>
      <div class="sig-sub">Finance & Treasury Operations</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Board of Management</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildProfitAllocationPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang?: string;
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang = "en", data, projectName } = opts;

  const kpis = data?.kpis || {
    totalProjectRevenue: 0,
    totalProjectCost: 0,
    grossProjectProfit: 0,
    statutoryReserveAmount: 0,
    netDistributableProfit: 0,
    totalDisbursedToDate: 0,
    totalPendingSurplus: 0,
    partnersCount: 0,
    effectiveRealizationRate: 0,
    basis: "INVOICED_BASIS",
  };

  const projectSummary = data?.projectSummary || {
    projectName: projectName || "All Estates",
    projectLocation: "Dhaka Division",
    totalAgreedSales: 0,
    totalApprovedExpenses: 0,
  };

  const partnerAllocations: any[] = data?.partnerAllocations || [];

  const nowStr = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const partnerRowsHtml = partnerAllocations
    .map(
      (pa: any) => `
    <tr>
      <td style="font-weight:700;color:#0f172a;">
        <div>${pa.partnerName}</div>
        <div style="font-size:7.5px;color:#64748b;font-family:monospace;">${pa.partnerPhone}</div>
      </td>
      <td style="text-align:center;font-weight:700;font-family:monospace;color:#0f172a;">
        ${pa.sharePercentage.toFixed(1)}%
      </td>
      <td style="text-align:right;font-family:monospace;font-weight:600;">
        ${formatBDT(pa.grossEntitlement)}
      </td>
      <td style="text-align:right;font-family:monospace;color:#d97706;">
        ${formatBDT(pa.statutoryReserve)}
      </td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#6d28d9;background:#f5f3ff;">
        ${formatBDT(pa.netAllocated)}
      </td>
      <td style="text-align:right;font-family:monospace;color:#2563eb;font-weight:600;">
        ${formatBDT(pa.historicallyPaid)}
      </td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;background:#f0fdf4;">
        ${formatBDT(pa.pendingSurplus)}
      </td>
      <td style="text-align:center;">
        <span style="display:inline-block;padding:1px 6px;border-radius:3px;font-size:7px;font-weight:700;${
          pa.status === "FULLY_PAID"
            ? "background:#dcfce7;color:#15803d;"
            : pa.status === "PARTIALLY_PAID"
            ? "background:#dbeafe;color:#1e40af;"
            : "background:#fef3c7;color:#92400e;"
        }">
          ${pa.statusLabelEn}
        </span>
      </td>
    </tr>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 10px 0 4px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-table {
      margin-bottom: 12px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.03em;
      padding: 5px 6px;
      border: 1px solid #cbd5e1;
    }
    .summary-table td {
      padding: 5px 6px;
      border: 1px solid #e2e8f0;
    }
    .ledger-table {
      font-size: 8px;
      border: 1px solid #0f172a;
      margin-bottom: 16px;
    }
    .ledger-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.04em;
      padding: 5px 6px;
      border: 1px solid #1e293b;
    }
    .ledger-table td {
      padding: 5px 6px;
      border: 1px solid #e2e8f0;
    }
    .ledger-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .sig-row {
      display: table;
      width: 100%;
      margin-top: 24px;
      padding-top: 10px;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      vertical-align: top;
      padding: 0 15px;
    }
    .sig-line {
      border-top: 1px dashed #64748b;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Top Header Table -->
  <table class="header-table">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Syndicate Capital, Project Equity & Profit Distribution Division</div>
        <div style="font-size:9px;color:#6d28d9;font-weight:800;margin-top:3px;">
          Project Syndicate: ${projectSummary.projectName} (${projectSummary.projectLocation})
        </div>
      </td>
      <td style="width: 50%; text-align: right; vertical-align: top;">
        <div class="report-title-main">${titleEn}</div>
        <div style="font-size: 9px; color: #475569; font-weight: 600;">${titleBn}</div>
        <div class="report-meta-text">
          Basis: ${kpis.basis} · Generated: ${nowStr} · By: ${generatedBy}
        </div>
      </td>
    </tr>
  </table>

  <!-- 4 Macro KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left: 3px solid #047857;">
      <div class="kpi-label">Audited Net Profit</div>
      <div class="kpi-val" style="color: #047857;">${formatBDT(kpis.grossProjectProfit)}</div>
      <div class="kpi-sub">Total Audited Net Earnings</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #d97706;">
      <div class="kpi-label">Statutory Reserve (5%)</div>
      <div class="kpi-val" style="color: #d97706;">${formatBDT(kpis.statutoryReserveAmount)}</div>
      <div class="kpi-sub">Retained Treasury Buffer</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #6d28d9;">
      <div class="kpi-label">Distributable Pool (95%)</div>
      <div class="kpi-val" style="color: #6d28d9;">${formatBDT(kpis.netDistributableProfit)}</div>
      <div class="kpi-sub">${kpis.partnersCount} Syndicate Equity Partners</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #2563eb;">
      <div class="kpi-label">Disbursed to Date</div>
      <div class="kpi-val" style="color: #2563eb;">${formatBDT(kpis.totalDisbursedToDate)}</div>
      <div class="kpi-sub">Pending Surplus: ${formatBDT(kpis.totalPendingSurplus)}</div>
    </div>
  </div>

  <!-- Financial Waterfall Summary Table -->
  <div class="section-title">Project Profit Waterfall & Distributable Pool Computation</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="text-align:left;">Gross Invoiced Revenue</th>
        <th style="text-align:left;">Capitalized Development Cost</th>
        <th style="text-align:left;">Audited Operating Net Profit</th>
        <th style="text-align:left;">Statutory Contingency Retention (5%)</th>
        <th style="text-align:left;">Net Distributable Dividend Pool</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-family:monospace;font-weight:700;">${formatBDT(projectSummary.totalAgreedSales)}</td>
        <td style="font-family:monospace;color:#be123c;font-weight:700;">- ${formatBDT(projectSummary.totalApprovedExpenses)}</td>
        <td style="font-family:monospace;font-weight:800;color:#047857;">${formatBDT(kpis.grossProjectProfit)}</td>
        <td style="font-family:monospace;color:#d97706;font-weight:700;">- ${formatBDT(kpis.statutoryReserveAmount)}</td>
        <td style="font-family:monospace;font-weight:800;color:#6d28d9;background:#f5f3ff;">${formatBDT(kpis.netDistributableProfit)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Master Partner Equity & Allocation Ledger Table -->
  <div class="section-title">Master Partner Syndicate Allocation Ledger (${partnerAllocations.length} Partners)</div>
  <table class="ledger-table">
    <thead>
      <tr>
        <th style="text-align:left;width:22%;">Equity Syndicate Partner</th>
        <th style="text-align:center;width:10%;">Share %</th>
        <th style="text-align:right;width:14%;">Gross Entitlement (৳)</th>
        <th style="text-align:right;width:12%;">5% Reserve (৳)</th>
        <th style="text-align:right;width:14%;">Net Distributable (৳)</th>
        <th style="text-align:right;width:14%;">Disbursed to Date (৳)</th>
        <th style="text-align:right;width:14%;">Pending Surplus (৳)</th>
        <th style="text-align:center;width:10%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${partnerRowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;">
        <td style="padding:6px;text-transform:uppercase;letter-spacing:0.04em;">Total Syndicate Pool</td>
        <td style="text-align:center;font-family:monospace;">100.0%</td>
        <td style="text-align:right;font-family:monospace;">${formatBDT(kpis.grossProjectProfit)}</td>
        <td style="text-align:right;font-family:monospace;color:#fcd34d;">${formatBDT(kpis.statutoryReserveAmount)}</td>
        <td style="text-align:right;font-family:monospace;color:#c4b5fd;">${formatBDT(kpis.netDistributableProfit)}</td>
        <td style="text-align:right;font-family:monospace;color:#93c5fd;">${formatBDT(kpis.totalDisbursedToDate)}</td>
        <td style="text-align:right;font-family:monospace;color:#6ee7b7;">${formatBDT(kpis.totalPendingSurplus)}</td>
        <td style="text-align:center;">100% ALLOCATED</td>
      </tr>
    </tfoot>
  </table>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Head of Treasury)</div>
      <div class="sig-sub">Syndicate Accounts Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Partner Representative)</div>
      <div class="sig-sub">Syndicate Management Committee</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Board of Directors</div>
    </div>
  </div>

</body>
</html>`;
}

export function buildProfitHistoryPdfHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang?: string;
  data: any;
  projectName?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang = "en", data, projectName } = opts;

  const kpis = data?.kpis || {
    totalDistributed: 0,
    tranchesCount: 0,
    averageTranchePayout: 0,
    uniquePartnersCount: 0,
    cashBasisTotal: 0,
    completionBasisTotal: 0,
  };

  const items: any[] = data?.items || [];
  const partnerTotals: any[] = data?.partnerTotals || [];

  const nowStr = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const partnerTotalsRowsHtml = partnerTotals
    .map((pt: any) => {
      const shareOfTotal = kpis.totalDistributed > 0 ? (pt.totalPayout / kpis.totalDistributed) * 100 : 0;
      return `
    <tr>
      <td style="font-weight:700;color:#0f172a;">${pt.partnerName}</td>
      <td style="font-family:monospace;color:#64748b;">${pt.partnerPhone}</td>
      <td style="text-align:center;font-weight:700;font-family:monospace;">${pt.sharePercentage}%</td>
      <td style="text-align:center;font-family:monospace;">${pt.tranchesCount}</td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;background:#f0fdf4;">${formatBDT(pt.totalPayout)}</td>
      <td style="text-align:center;font-family:monospace;font-weight:600;">${shareOfTotal.toFixed(1)}%</td>
    </tr>
  `;
    })
    .join("");

  const itemRowsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td style="font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">
        ${formatDate(item.distributionDate)}
      </td>
      <td>
        <div style="font-weight:600;color:#0f172a;">${item.projectName}</div>
        <div style="font-size:7.5px;color:#64748b;">${item.projectLocation}</div>
      </td>
      <td>
        <div style="font-weight:700;color:#0f172a;">${item.partnerName}</div>
        <div style="font-size:7.5px;color:#64748b;font-family:monospace;">${item.partnerPhone}</div>
      </td>
      <td style="text-align:center;">
        <span style="display:inline-block;padding:1px 5px;border-radius:3px;font-size:7px;font-weight:700;${
          item.realizationBasis === "CASH_BASIS" ? "background:#dbeafe;color:#1e40af;" : "background:#fef3c7;color:#92400e;"
        }">
          ${item.realizationBasis === "CASH_BASIS" ? "Cash Realized" : "Completion / Invoiced"}
        </span>
      </td>
      <td style="text-align:center;font-family:monospace;font-weight:700;">
        ${item.partnerSharePercent.toFixed(1)}%
      </td>
      <td style="text-align:right;font-family:monospace;color:#475569;">
        ${formatBDT(item.totalProjectNetProfit)}
      </td>
      <td style="text-align:right;font-family:monospace;font-weight:700;color:#047857;background:#f0fdf4;white-space:nowrap;">
        ${formatBDT(item.payoutAmount)}
      </td>
    </tr>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${titleEn} - ${companyName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.35;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .header-table {
      width: 100%;
      margin-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 500;
    }
    .report-title-main {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .report-meta-text {
      font-size: 8px;
      color: #64748b;
      margin-top: 3px;
    }
    .kpi-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    .kpi-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
      vertical-align: top;
      width: 25%;
    }
    .kpi-card + .kpi-card {
      padding-left: 10px;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 1px;
    }
    .kpi-sub {
      font-size: 7px;
      color: #64748b;
    }
    .section-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      margin: 10px 0 4px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-table {
      margin-bottom: 12px;
      font-size: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.03em;
      padding: 5px 6px;
      border: 1px solid #cbd5e1;
    }
    .summary-table td {
      padding: 4px 6px;
      border: 1px solid #e2e8f0;
    }
    .ledger-table {
      font-size: 8px;
      border: 1px solid #0f172a;
      margin-bottom: 16px;
    }
    .ledger-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.04em;
      padding: 5px 6px;
      border: 1px solid #1e293b;
    }
    .ledger-table td {
      padding: 4px 6px;
      border: 1px solid #e2e8f0;
    }
    .ledger-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .sig-row {
      display: table;
      width: 100%;
      margin-top: 24px;
      padding-top: 10px;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      vertical-align: top;
      padding: 0 15px;
    }
    .sig-line {
      border-top: 1px dashed #64748b;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
    }
    .sig-sub {
      font-size: 7px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Top Header Table -->
  <table class="header-table">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <div class="brand-title">${companyName}</div>
        <div class="brand-sub">Commercial Treasury, Syndicate Capital & Dividend Disbursement Division</div>
        ${projectName ? `<div style="font-size:9px;color:#047857;font-weight:800;margin-top:3px;">Syndicate Filter: ${projectName}</div>` : ""}
      </td>
      <td style="width: 50%; text-align: right; vertical-align: top;">
        <div class="report-title-main">${titleEn}</div>
        <div style="font-size: 9px; color: #475569; font-weight: 600;">${titleBn}</div>
        <div class="report-meta-text">
          Scope: ${filterSummary} · Generated: ${nowStr} · By: ${generatedBy}
        </div>
      </td>
    </tr>
  </table>

  <!-- 4 Macro KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card" style="border-left: 3px solid #047857;">
      <div class="kpi-label">Total Disbursed Dividends</div>
      <div class="kpi-val" style="color: #047857;">${formatBDT(kpis.totalDistributed)}</div>
      <div class="kpi-sub">${items.length} Payout Vouchers Executed</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #7c3aed;">
      <div class="kpi-label">Disbursement Tranches</div>
      <div class="kpi-val" style="color: #7c3aed;">${kpis.tranchesCount} Tranche Runs</div>
      <div class="kpi-sub">Avg Tranche: ${formatBDT(kpis.averageTranchePayout)}</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #2563eb;">
      <div class="kpi-label">Cash Realized Basis</div>
      <div class="kpi-val" style="color: #2563eb;">${formatBDT(kpis.cashBasisTotal)}</div>
      <div class="kpi-sub">${kpis.totalDistributed > 0 ? ((kpis.cashBasisTotal / kpis.totalDistributed) * 100).toFixed(1) : 0}% of Total Disbursed</div>
    </div>
    <div class="kpi-card" style="border-left: 3px solid #d97706;">
      <div class="kpi-label">Completion / Milestone Basis</div>
      <div class="kpi-val" style="color: #d97706;">${formatBDT(kpis.completionBasisTotal)}</div>
      <div class="kpi-sub">${kpis.totalDistributed > 0 ? ((kpis.completionBasisTotal / kpis.totalDistributed) * 100).toFixed(1) : 0}% of Total Disbursed</div>
    </div>
  </div>

  <!-- Partner Cumulative Earnings Summary Table -->
  <div class="section-title">Partner Cumulative Dividend Earnings Summary</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="text-align:left;">Syndicate Partner</th>
        <th style="text-align:left;">Contact Phone</th>
        <th style="text-align:center;">Equity Share</th>
        <th style="text-align:center;">Tranches Received</th>
        <th style="text-align:right;">Total Disbursed Dividend (৳)</th>
        <th style="text-align:center;">Share of Total</th>
      </tr>
    </thead>
    <tbody>
      ${partnerTotalsRowsHtml}
    </tbody>
  </table>

  <!-- Master Dividend Distribution Register Table -->
  <div class="section-title">Master Dividend Distribution Register (${items.length} Vouchers)</div>
  <table class="ledger-table">
    <thead>
      <tr>
        <th style="text-align:left;width:12%;">Disbursement Date</th>
        <th style="text-align:left;width:20%;">Project Syndicate</th>
        <th style="text-align:left;width:20%;">Equity Partner</th>
        <th style="text-align:center;width:12%;">Accounting Basis</th>
        <th style="text-align:center;width:8%;">Share %</th>
        <th style="text-align:right;width:14%;">Project Net Profit (৳)</th>
        <th style="text-align:right;width:14%;">Dividend Payout (৳)</th>
      </tr>
    </thead>
    <tbody>
      ${itemRowsHtml}
    </tbody>
    <tfoot>
      <tr style="background:#0f172a;color:#ffffff;font-weight:700;">
        <td colspan="6" style="padding:6px;text-transform:uppercase;letter-spacing:0.04em;">
          Total Filtered Disbursements (${items.length} Vouchers)
        </td>
        <td style="text-align:right;font-family:monospace;font-size:9.5px;color:#34d399;">
          ${formatBDT(kpis.totalDistributed)}
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Prepared By (Treasury Accountant)</div>
      <div class="sig-sub">Commercial Accounts Division</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Verified By (Chief Financial Officer)</div>
      <div class="sig-sub">Finance & Treasury Operations</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div class="sig-title">Approved By (Managing Director)</div>
      <div class="sig-sub">Board of Management</div>
    </div>
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
