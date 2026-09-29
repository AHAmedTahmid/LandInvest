import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import PartnersForm from "./PartnersForm";

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
  const viewPartner = viewId ? await prisma.partner.findUnique({ where: { id: viewId } }) : null;
  const viewTxs = viewId ? await prisma.partnerTransaction.findMany({ where: { partnerId: viewId }, orderBy: { txnDate: "desc" } }) : [];

  async function upsert(_prev: string | null, formData: FormData): Promise<string | null> {
    "use server";
    const prisma2: any = await getTenantClientFromSession();
    const rawId = ((formData.get("id") as string) || "").trim();
    const name = ((formData.get("name") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const nid = ((formData.get("nidNumber") as string) || "").trim();
    const opening = parseFloat(formData.get("opening_balance") as string) || 0;
    if (!name || !phone) return "✗ Name and phone are required";
    try {
      if (rawId) {
        const exists = await prisma2.partner.findUnique({ where: { id: rawId } });
        if (exists) {
          await prisma2.partner.update({ where: { id: rawId }, data: { name, phone, nidNumber: nid || null, openingBalance: opening } });
        } else {
          await prisma2.partner.create({ data: { id: randomUUID(), name, phone, nidNumber: nid || null, openingBalance: opening } });
        }
      } else {
        await prisma2.partner.create({ data: { id: randomUUID(), name, phone, nidNumber: nid || null, openingBalance: opening } });
      }
    } catch (e: any) {
      if (e.code === "P2002") {
        const t = e.meta?.target as string[] | string | undefined;
        const s = Array.isArray(t) ? t.join(",") : String(t ?? "");
        if (s.includes("phone")) return `✗ Phone "${phone}" already exists — use a different number`;
        if (s.includes("nid")) return `✗ NID "${nid}" already exists — each partner must have a unique NID`;
      }
      return `✗ ${e.message || "Failed to save partner"}`;
    }
    revalidatePath("/partners");
    return `✓ Partner "${name}" saved`;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Partners</h1>
      <PartnersForm action={upsert} />

      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="border-b text-left"><th className="p-2">Name</th><th>Phone</th><th>NID</th><th>Opening</th><th>Live Balance</th><th>Ledger</th></tr></thead>
        <tbody>{partners.map((p: any) => {
          const bal = getPartnerBalance(toNum(p.openingBalance), p.partnerTransactions);
          return <tr key={p.id} className="border-b"><td className="p-2">{p.name}</td><td>{p.phone}</td><td>{p.nidNumber||"-"}</td><td>{formatBDT(toNum(p.openingBalance))}</td><td className="font-bold">{formatBDT(bal)}</td><td><a href={`/partners?view=${p.id}`} className="text-blue-600 underline">View</a></td></tr>;
        })}</tbody>
      </table>

      {viewId && (
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-semibold mb-2">Capital Ledger for {viewPartner?.name ?? viewId}</h2>
          <table className="w-full text-sm"><thead><tr className="border-b text-left"><th>Date</th><th>Type</th><th>Amount</th><th>Notes</th></tr></thead>
            <tbody>{viewTxs.map((t: any) => <tr key={t.id} className="border-b"><td>{new Date(t.txnDate).toLocaleDateString()}</td><td>{t.txnType}</td><td>{formatBDT(toNum(t.amount))}</td><td>{t.notes||"-"}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
