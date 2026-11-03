import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import PartnersClient, { PartnerRow } from "./PartnersClient";

function calculateLiveBalance(opening: number, txs: any[]): number {
  let bal = opening;
  for (const t of txs) {
    const a = toNum(t.amount);
    if (["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType)) bal += a;
    else if (t.txnType === "WITHDRAWAL") bal -= a;
  }
  return bal;
}

export default async function PartnersPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "partners.manage")) && !(await can(session, "partners.view"))) {
    return <div className="p-8 text-red-600">Forbidden: managePartners</div>;
  }

  const prisma: any = await getTenantClientFromSession();
  const partnersRaw = await prisma.partner.findMany({
    include: {
      partnerTransactions: {
        orderBy: { txnDate: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const partnerRows: PartnerRow[] = partnersRaw.map((p: any) => {
    const opening = toNum(p.openingBalance);
    const live = calculateLiveBalance(opening, p.partnerTransactions || []);
    return {
      id: p.id,
      name: p.name,
      phone: p.phone,
      nidNumber: p.nidNumber,
      openingBalance: opening,
      liveBalance: live,
      transactions: (p.partnerTransactions || []).map((t: any) => ({
        id: t.id,
        txnType: t.txnType,
        amount: toNum(t.amount),
        txnDate: new Date(t.txnDate).toISOString(),
        notes: t.notes,
      })),
    };
  });

  async function createPartnerAction(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "partners.manage"))) {
      return { error: "Forbidden: partners.manage" };
    }

    const name = ((formData.get("name") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const nid = ((formData.get("nidNumber") as string) || "").trim();
    const opening = parseFloat(formData.get("opening_balance") as string) || 0;

    if (!name || !phone) return { error: "Name and phone number are required." };

    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const userId = (s!.user as any).id;
    const partnerId = randomUUID();

    try {
      await prisma2.$transaction(async (tx: any) => {
        const partner = await tx.partner.create({
          data: {
            id: partnerId,
            name,
            phone,
            nidNumber: nid || null,
            openingBalance: opening,
          },
        });
        await writeAudit(tx, "partners", partnerId, "CREATE", userId, null, partner);
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        const t = e.meta?.target as string[] | string | undefined;
        const str = Array.isArray(t) ? t.join(",") : String(t ?? "");
        if (str.includes("phone")) return { error: `Phone number "${phone}" is already registered.` };
        if (str.includes("nid")) return { error: `NID "${nid}" is already in use by another partner.` };
      }
      return { error: e.message || "Failed to create partner" };
    }

    revalidatePath("/partners");
    revalidatePath("/partners/dashboard");
    revalidatePath("/partners/capital");
    return { success: true };
  }

  async function updatePartnerAction(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "partners.manage"))) {
      return { error: "Forbidden: partners.manage" };
    }

    const id = ((formData.get("id") as string) || "").trim();
    const name = ((formData.get("name") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const nid = ((formData.get("nidNumber") as string) || "").trim();

    if (!id || !name || !phone) return { error: "ID, name, and phone are required." };

    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const userId = (s!.user as any).id;

    try {
      await prisma2.$transaction(async (tx: any) => {
        const prev = await tx.partner.findUnique({ where: { id } });
        if (!prev) throw new Error("Partner not found");

        // CRITICAL: Opening balance is NOT updated here to preserve financial integrity!
        const updated = await tx.partner.update({
          where: { id },
          data: {
            name,
            phone,
            nidNumber: nid || null,
          },
        });
        await writeAudit(tx, "partners", id, "UPDATE", userId, prev, updated);
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        const t = e.meta?.target as string[] | string | undefined;
        const str = Array.isArray(t) ? t.join(",") : String(t ?? "");
        if (str.includes("phone")) return { error: `Phone number "${phone}" is already registered.` };
        if (str.includes("nid")) return { error: `NID "${nid}" is already in use by another partner.` };
      }
      return { error: e.message || "Failed to update partner" };
    }

    revalidatePath("/partners");
    revalidatePath("/partners/dashboard");
    revalidatePath("/partners/capital");
    return { success: true };
  }

  return (
    <div className="p-6">
      <PartnersClient
        partners={partnerRows}
        createAction={createPartnerAction}
        updateAction={updatePartnerAction}
      />
    </div>
  );
}
