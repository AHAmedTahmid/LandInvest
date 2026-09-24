import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT } from "@/lib/format";
import { computePnl } from "@/lib/pnl";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!can((session.user as any).role, "viewDashboard")) return new Response("Forbidden", { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const pnl = await computePnl(prisma);

  const rows = pnl
    .map(
      (r) =>
        `<tr><td>${r.projectName}</td><td>${formatBDT(r.revenue)}</td><td>${formatBDT(r.landCost)}</td>` +
        `<td>${formatBDT(r.expCost)}</td><td>${formatBDT(r.totalCost)}</td><td>${formatBDT(r.netProfit)}</td></tr>`
    )
    .join("");
  const html =
    `<html><body><h1>PnL Report</h1>` +
    `<table border="1" cellpadding="6"><tr><th>Project</th><th>Revenue</th><th>Land Cost</th>` +
    `<th>Expenses</th><th>Total Cost</th><th>Net Profit</th></tr>${rows}</table></body></html>`;

  try {
    const puppeteer = await import("puppeteer");
    const browser = await (puppeteer as any).launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();
    return new Response(Buffer.from(pdf), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=pnl.pdf" },
    });
  } catch (e: any) {
    console.error(`[pnl-pdf] PDF generation failed: ${e.message}`);
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }
}
