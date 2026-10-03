import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { moneyReceiptHtml, numberToWordsBDT } from "@/lib/branding";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: recordId } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can((s.user as any).role, "receiveSales")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const sale = await prisma.landSale.findUnique({ where: { id: recordId }, include: { customerPayments: true, project: true, plot: true } });
  if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const last = sale.customerPayments?.[sale.customerPayments.length - 1];
  const paid = Number(last?.amountPaid ?? sale.advanceBookingAmount ?? 0);
  const due = Number(sale.currentDueAmount ?? 0);
  const total = Number(sale.totalAgreedPrice ?? 0);

  const html = moneyReceiptHtml({
    receiptNo: last?.receiptNo ?? `REC-${recordId.slice(0, 8)}`,
    date: new Date(last?.paymentDate ?? sale.saleDate).toLocaleDateString("en-BD"),
    buyerName: sale.buyerName,
    address: "",
    phone: sale.buyerPhone,
    plotNo: sale.plot?.plotNumber ?? sale.project?.projectName ?? "-",
    bookingNo: recordId.slice(0, 8),
    purpose: `Plot booking - ${sale.project?.projectName ?? ""}`,
    amount: paid || total - due,
    amountWords: numberToWordsBDT(paid || total - due),
    paymentMode: last?.paymentMethod ?? "CASH",
  });

  try {
    const puppeteer = await import("puppeteer");
    const browser = await (puppeteer as any).launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return new NextResponse(Buffer.from(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename=receipt-${recordId}.pdf` } });
  } catch (e: any) {
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  }
}
