import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { paymentVoucherHtml, pettyCashVoucherHtml, numberToWordsBDT } from "@/lib/branding";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can((s.user as any).role, "createExpense") && !can((s.user as any).role, "approveExpense")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const exp = await prisma.projectExpense.findUnique({ where: { id }, include: { project: true, paidByPartner: true } });
  if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "payment";
  let html = "";
  const amt = Number(exp.amount);
  const date = new Date(exp.expenseDate).toLocaleDateString("en-BD");
  if (type === "petty") {
    html = pettyCashVoucherHtml({
      voucherNo: id.slice(0, 8),
      date,
      receiverName: exp.paidByPartner?.name ?? "—",
      landOwner: exp.project?.projectName ?? "—",
      landSize: String(exp.project?.totalAreaShotok ?? "—"),
      mouzaNo: exp.project?.mouza ?? "—",
      purpose: exp.description ?? exp.expenseCategory,
      items: [{ date, desc: exp.description ?? exp.expenseCategory, amount: amt }],
    });
  } else {
    html = paymentVoucherHtml({
      voucherNo: id.slice(0, 8),
      date,
      receiverName: exp.paidByPartner?.name ?? exp.description ?? exp.expenseCategory,
      phone: exp.paidByPartner?.phone ?? "—",
      amount: amt,
      amountWords: numberToWordsBDT(amt),
      purpose: exp.description ?? exp.expenseCategory,
      accountHead: exp.expenseCategory,
      paymentMode: exp.paymentChannel,
      chequeNo: exp.bankAccountId ?? "",
      preparedBy: (s.user as any).fullName ?? (s.user as any).email,
    });
  }

  try {
    const puppeteer = await import("puppeteer");
    const browser = await (puppeteer as any).launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return new NextResponse(Buffer.from(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename=voucher-${id}.pdf` } });
  } catch {
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  }
}
