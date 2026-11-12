import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const ROOT = process.cwd();
const DOCS = path.join(ROOT, "docs");
const GEN = path.join(DOCS, "_generated");
const HIGHLVL = path.join(ROOT, "highlvl");
fs.mkdirSync(HIGHLVL, { recursive: true });

const modFiles = fs
  .readdirSync(path.join(DOCS, "05-modules"))
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => path.join("05-modules", f));

const ORDER = [
  "00-README.md",
  "01-executive-summary.md",
  "02-architecture.md",
  "03-tech-stack.md",
  "04-database/04a-overview.md",
  "04-database/04b-control-plane-tables.md",
  "04-database/04c-tenant-tables.md",
  "04-database/04d-erd.md",
  "04-database/04e-indexes-and-constraints.md",
  ...modFiles,
  "06-workflows.md",
  "07-auth-roles-permissions.md",
  "08-business-rules.md",
  "09-api-and-actions.md",
  "10-reports-and-dashboard.md",
  "11-background-jobs.md",
  "12-configuration-and-environment.md",
  "13-setup-and-run-guide.md",
  "14-deployment-and-operations.md",
  "15-security.md",
  "16-testing.md",
  "17-developer-guide.md",
  "18-decision-log.md",
  "19-known-issues-and-roadmap.md",
  "20-glossary.md",
];

const sections = [];
const tocItems = [];

for (const rel of ORDER) {
  const full = path.join(DOCS, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing documentation file: ${rel}`);
  }
  const content = fs.readFileSync(full, "utf8").trim();
  const firstHeading = content.match(/^#\s+(.+)$/m)?.[1] || rel;
  const anchor = firstHeading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  tocItems.push({ title: firstHeading, anchor, file: rel });
  sections.push({ rel, title: firstHeading, anchor, content });
}

const tocMd = [
  "# LandInvest — Complete Project Documentation",
  "",
  "**Version:** 1.0.0 | **Last Verified:** 2026-11-12",
  "",
  "## Table of Contents",
  "",
  ...tocItems.map((t, idx) => `${idx + 1}. [${t.title}](#${t.anchor})`),
  "",
  "---",
  "",
].join("\n");

const combinedMd =
  tocMd +
  sections.map((s) => `<a id="${s.anchor}"></a>\n\n${s.content}`).join("\n\n---\n\n") +
  "\n";

fs.writeFileSync(path.join(ROOT, "PROJECT_DOCUMENTATION.md"), combinedMd, "utf8");
console.log("Wrote PROJECT_DOCUMENTATION.md");

// Verification checks (Section 5)
const permsJson = JSON.parse(fs.readFileSync(path.join(GEN, "permissions.json"), "utf8"));
const routesJson = JSON.parse(fs.readFileSync(path.join(GEN, "routes_and_actions.json"), "utf8"));
const controlDb = JSON.parse(fs.readFileSync(path.join(GEN, "db_control_plane.json"), "utf8"));
const tenantDb = JSON.parse(fs.readFileSync(path.join(GEN, "db_tenant.json"), "utf8"));

const authDoc = fs.readFileSync(path.join(DOCS, "07-auth-roles-permissions.md"), "utf8");
const apiDoc = fs.readFileSync(path.join(DOCS, "09-api-and-actions.md"), "utf8");
const cpDoc = fs.readFileSync(path.join(DOCS, "04-database", "04b-control-plane-tables.md"), "utf8");
const tnDoc = fs.readFileSync(path.join(DOCS, "04-database", "04c-tenant-tables.md"), "utf8");

const missingPerms = permsJson.permissions.filter((p) => !authDoc.includes(`\`${p.key}\``));
const missingApis = routesJson.apis.filter((a) => !apiDoc.includes(`\`${a.route}\``));
const missingPages = routesJson.pages.filter((p) => !apiDoc.includes(`\`${p.route}\``));
const missingCpTables = controlDb.tables.filter((t) => !cpDoc.includes(`\`${t.TABLE_NAME}\``));
const missingTnTables = tenantDb.tables.filter((t) => !tnDoc.includes(`\`${t.TABLE_NAME}\``));

// Check balanced mermaid blocks
const mermaidOpens = (combinedMd.match(/```mermaid/g) || []).length;
const totalFences = (combinedMd.match(/```/g) || []).length;
if (totalFences % 2 !== 0) {
  throw new Error("Unbalanced code fences detected in PROJECT_DOCUMENTATION.md");
}

console.log("Verification summary:", {
  missingPerms: missingPerms.length,
  missingApis: missingApis.length,
  missingPages: missingPages.length,
  missingCpTables: missingCpTables.length,
  missingTnTables: missingTnTables.length,
  mermaidDiagrams: mermaidOpens,
});

if (
  missingPerms.length ||
  missingApis.length ||
  missingPages.length ||
  missingCpTables.length ||
  missingTnTables.length
) {
  throw new Error("Documentation completeness verification failed!");
}

// Minimal clean Markdown -> HTML renderer for PDF export
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMd(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let inCode = false;
  let codeLang = "";
  let codeBuf = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (!inTable || tableRows.length === 0) return;
    const header = tableRows[0];
    const body = tableRows.slice(2); // skip separator row
    const parseRow = (r) =>
      r
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
    out.push("<table><thead><tr>");
    for (const h of parseRow(header)) out.push(`<th>${inlineMd(h)}</th>`);
    out.push("</tr></thead><tbody>");
    for (const b of body) {
      out.push("<tr>");
      for (const c of parseRow(b)) out.push(`<td>${inlineMd(c)}</td>`);
      out.push("</tr>");
    }
    out.push("</tbody></table>");
    inTable = false;
    tableRows = [];
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushTable();
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeBuf = [];
      } else {
        const raw = codeBuf.join("\n");
        if (codeLang === "mermaid") {
          out.push(`<div class="mermaid-box"><div class="mermaid-label">Mermaid Diagram</div><pre class="mermaid">${esc(raw)}</pre></div>`);
        } else {
          out.push(`<pre><code>${esc(raw)}</code></pre>`);
        }
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (line.trim().startsWith("|")) {
      inTable = true;
      tableRows.push(line);
      continue;
    } else {
      flushTable();
    }

    if (line.startsWith("<a id=")) {
      out.push(`<div class="page-break"></div>${line}`);
    } else if (line.startsWith("# ")) {
      out.push(`<h1>${inlineMd(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      out.push(`<h2>${inlineMd(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      out.push(`<h3>${inlineMd(line.slice(4))}</h3>`);
    } else if (line.startsWith("> ")) {
      out.push(`<blockquote>${inlineMd(line.slice(2))}</blockquote>`);
    } else if (line.startsWith("---")) {
      out.push("<hr/>");
    } else if (/^[-*]\s+/.test(line)) {
      out.push(`<div class="li">&bull; ${inlineMd(line.replace(/^[-*]\s+/, ""))}</div>`);
    } else if (/^\d+\.\s+/.test(line)) {
      out.push(`<div class="li">${inlineMd(line)}</div>`);
    } else if (line.trim() === "") {
      out.push("");
    } else {
      out.push(`<p>${inlineMd(line)}</p>`);
    }
  }
  flushTable();
  return out.join("\n");
}

const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>LandInvest — Complete Handover Documentation</title>
<style>
  @page { margin: 18mm 14mm 18mm 14mm; }
  body { font-family: "Segoe UI", Arial, "Noto Sans Bengali", sans-serif; font-size: 10pt; line-height: 1.5; color: #1e293b; }
  .cover { text-align: center; padding: 120px 24px 60px; page-break-after: always; }
  .cover h1 { font-size: 28pt; color: #0f172a; margin-bottom: 8px; border: none; }
  .cover .sub { font-size: 13pt; color: #475569; margin-bottom: 32px; }
  .cover .meta { display: inline-block; text-align: left; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px 24px; font-size: 10pt; }
  h1 { font-size: 18pt; color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 4px; margin-top: 18px; }
  h2 { font-size: 13pt; color: #1e293b; margin-top: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
  h3 { font-size: 11pt; color: #334155; margin-top: 10px; }
  p { margin: 5px 0; }
  .li { margin: 2px 0 2px 14px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 14px; font-size: 8.5pt; page-break-inside: auto; }
  tr { page-break-inside: avoid; }
  th, td { border: 1px solid #cbd5e1; padding: 5px 7px; text-align: left; vertical-align: top; word-break: break-word; }
  th { background: #f1f5f9; font-weight: 600; color: #0f172a; }
  code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-family: Consolas, monospace; font-size: 8.5pt; }
  pre { background: #0f172a; color: #f8fafc; padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 8pt; line-height: 1.4; }
  pre code { background: transparent; color: inherit; padding: 0; }
  .mermaid-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; margin: 8px 0; background: #f8fafc; page-break-inside: avoid; }
  .mermaid-label { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; color: #059669; margin-bottom: 4px; }
  .mermaid-box pre { background: #ffffff; color: #334155; border: 1px dashed #cbd5e1; margin: 0; }
  blockquote { border-left: 3px solid #10b981; margin: 8px 0; padding: 4px 12px; background: #ecfdf5; color: #065f46; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>
  <div class="cover">
    <h1>LandInvest ERP Suite</h1>
    <div class="sub">Complete Technical &amp; Business Handover Documentation</div>
    <div class="meta">
      <div><strong>Document Version:</strong> 1.0.0</div>
      <div><strong>Last Verified:</strong> 2026-11-12</div>
      <div><strong>Databases:</strong> control_plane (7 tables) + tenant_* (19 tables)</div>
      <div><strong>Scope:</strong> Architecture, DB Data Dictionaries, 14 Modules, 26 Reports, 79 Permissions, Setup &amp; Operations</div>
    </div>
  </div>
  ${mdToHtml(combinedMd)}
</body>
</html>`;

async function generatePdf() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlDoc, { waitUntil: "load" });
    const pdfOpts = {
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size:8px;color:#64748b;width:100%;padding:0 14mm;display:flex;justify-content:space-between;"><span>LandInvest ERP — Handover Documentation</span><span>v1.0.0</span></div>`,
      footerTemplate: `<div style="font-size:8px;color:#64748b;width:100%;padding:0 14mm;display:flex;justify-content:space-between;"><span>Confidential — Internal Handover</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
      margin: { top: "18mm", bottom: "18mm", left: "14mm", right: "14mm" },
    };
    const highlvlPdf = path.join(HIGHLVL, "LandInvest_Project_Documentation.pdf");
    const rootPdf = path.join(ROOT, "PROJECT_DOCUMENTATION.pdf");
    await page.pdf({ ...pdfOpts, path: highlvlPdf });
    fs.copyFileSync(highlvlPdf, rootPdf);
    console.log("Generated PDFs:", highlvlPdf, "and", rootPdf);
  } finally {
    await browser.close();
  }
}

generatePdf().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
