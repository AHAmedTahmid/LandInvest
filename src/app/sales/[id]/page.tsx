import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { formatBDT } from "@/lib/format";

export default async function SaleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!can((session?.user as any)?.role, "receiveSales")) return <div className="p-8 text-red-600">Forbidden: receiveSales</div>;

  const prisma: any = await getTenantClientFromSession();
  const sale = await prisma.landSale.findUnique({ where: { id }, include: { customerPayments: true, installmentSchedules: true } });
  if (!sale) return <div className="p-6">Not found</div>;
  const banks = await prisma.bankAccount.findMany();

  async function collect(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!canFn((s!.user as any).role, "receiveSales")) throw new Error("Forbidden: receiveSales");
    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { collectPayment } = await import("@/lib/collections");
    const p: any = await gc();
    await p.$transaction((tx: any) =>
      collectPayment(tx, {
        saleId: id,
        amount: parseFloat(formData.get("amount") as string),
        paymentMethod: (formData.get("payment_method") as string) || "CASH",
        bankAccountId: (formData.get("bank_account") as string) || null,
        userId: (s!.user as any).id,
      })
    );
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/sales/${id}`);
  }

  const payments = [...sale.customerPayments].sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  const schedule = [...sale.installmentSchedules].sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Sale {sale.buyerName} - {formatBDT(Number(sale.totalAgreedPrice))} Due {formatBDT(Number(sale.currentDueAmount))} <span className="text-sm font-normal">({sale.status})</span></h1>
      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold">Installment Collection</h2>
        <form action={collect} className="flex flex-wrap gap-2">
          <input name="amount" type="number" step="0.01" required placeholder="Amount" className="border rounded px-3 py-2" />
          <select name="payment_method" className="border rounded px-3 py-2"><option>CASH</option><option>BANK</option></select>
          <select name="bank_account" className="border rounded px-3 py-2"><option value="">Bank</option>{banks.map((b: any) => <option key={b.id} value={b.id}>{b.bankName}</option>)}</select>
          <button className="bg-emerald-600 text-white px-4 rounded">Collect</button>
        </form>
      </div>
      <a href={`/api/sales/${id}/receipt`} target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded">Download PDF</a>
      <button onClick={() => window.print()} className="ml-2 border px-4 py-2 rounded">Print (window.print)</button>
      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="border-b"><th className="p-2 text-left">Date</th><th className="text-left">Amount</th><th className="text-left">Method</th><th className="text-left">Receipt</th></tr></thead>
        <tbody>{payments.map((c: any) => <tr key={c.id} className="border-b"><td className="p-2">{new Date(c.paymentDate).toLocaleDateString()}</td><td>{formatBDT(Number(c.amountPaid))}</td><td>{c.paymentMethod}</td><td>{c.receiptNo}</td></tr>)}</tbody>
      </table>
      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold mb-2">Installment Schedule</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="p-2 text-left">Due Date</th><th className="text-left">Amount</th><th className="text-left">Status</th></tr></thead>
          <tbody>{schedule.map((i: any) => <tr key={i.id} className="border-b"><td className="p-2">{new Date(i.dueDate).toLocaleDateString()}</td><td>{formatBDT(Number(i.dueAmount))}</td><td className={i.status === "PAID" ? "text-green-600" : i.status === "OVERDUE" ? "text-red-600" : "text-amber-600"}>{i.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
