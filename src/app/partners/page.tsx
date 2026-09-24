import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

function getPartnerBalance(opening: number, txs: any[]) {
  let bal = opening;
  for (const t of txs) {
    const a = toNum(t.amount);
    if (["DEPOSIT","DIRECT_EXPENSE","PROFIT_CREDIT"].includes(t.txnType)) bal += a;
    else if (t.txnType === "WITHDRAWAL") bal -= a;
  }
  return bal;
}

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const session = await getServerSession(authOptions);
  const role: any = (session?.user as any)?.role;
  if (!can(role, "managePartners")) return <div className="p-8 text-red-600">Forbidden: managePartners</div>;
  const prisma: any = await getTenantClientFromSession();
  const partners = await prisma.partner.findMany({ include: { partnerTransactions: true }, orderBy: { createdAt: "desc" } });
  const sp = await searchParams;
  const viewId = sp.view;
  const viewTxs = viewId ? await prisma.partnerTransaction.findMany({ where: { partnerId: viewId }, orderBy: { txnDate: "desc" } }) : [];

  async function upsert(formData: FormData) {
    "use server";
    const prisma2: any = await getTenantClientFromSession();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const nid = formData.get("nidNumber") as string;
    const opening = parseFloat(formData.get("opening_balance") as string) || 0;
    if (id) await prisma2.partner.update({ where: { id }, data: { name, phone, nidNumber: nid||null, openingBalance: opening } });
    else await prisma2.partner.create({ data: { id: randomUUID(), name, phone, nidNumber: nid||null, openingBalance: opening } });
    revalidatePath("/partners");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Partners</h1>
      <form action={upsert} className="bg-white p-4 rounded-xl shadow border grid grid-cols-1 md:grid-cols-5 gap-3">
        <input name="id" placeholder="ID (blank for new)" className="border rounded px-3 py-2" />
        <input name="name" placeholder="Name" required className="border rounded px-3 py-2" />
        <input name="phone" placeholder="Phone" required className="border rounded px-3 py-2" />
        <input name="nidNumber" placeholder="NID" className="border rounded px-3 py-2" />
        <input name="opening_balance" placeholder="Opening Balance" type="number" step="0.01" className="border rounded px-3 py-2" />
        <button className="bg-blue-600 text-white rounded px-4 py-2 md:col-span-5">Add / Update</button>
      </form>

      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="border-b text-left"><th className="p-2">Name</th><th>Phone</th><th>NID</th><th>Opening</th><th>Live Balance</th><th>Ledger</th></tr></thead>
        <tbody>{partners.map((p: any) => {
          const bal = getPartnerBalance(toNum(p.openingBalance), p.partnerTransactions);
          return <tr key={p.id} className="border-b"><td className="p-2">{p.name}</td><td>{p.phone}</td><td>{p.nidNumber||"-"}</td><td>{formatBDT(toNum(p.openingBalance))}</td><td className="font-bold">{formatBDT(bal)}</td><td><a href={`/partners?view=${p.id}`} className="text-blue-600 underline">View</a></td></tr>;
        })}</tbody>
      </table>

      {viewId && (
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-semibold mb-2">Capital Ledger for {viewId}</h2>
          <table className="w-full text-sm"><thead><tr className="border-b text-left"><th>Date</th><th>Type</th><th>Amount</th><th>Notes</th></tr></thead>
            <tbody>{viewTxs.map((t: any) => <tr key={t.id} className="border-b"><td>{new Date(t.txnDate).toLocaleDateString()}</td><td>{t.txnType}</td><td>{formatBDT(toNum(t.amount))}</td><td>{t.notes||"-"}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
