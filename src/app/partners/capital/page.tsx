import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum, formatDate } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import CapitalDepositForm from "./CapitalDepositForm";

function calculateLiveBalance(opening: number, txs: any[]): number {
  let bal = opening;
  for (const t of txs) {
    const a = toNum(t.amount);
    if (["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType)) bal += a;
    else if (t.txnType === "WITHDRAWAL") bal -= a;
  }
  return bal;
}

export default async function CapitalDepositPage({
  searchParams,
}: {
  searchParams: Promise<{ partnerId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (
    !(await can(session, "partners.capital.deposit")) &&
    !(await can(session, "partners.manage")) &&
    !(await can(session, "partners.view"))
  ) {
    return <div className="p-8 text-red-600">Forbidden: partners.capital.deposit</div>;
  }

  const { partnerId } = await searchParams;
  const prisma: any = await getTenantClientFromSession();

  const [partnersRaw, banksRaw, recentDeposits] = await Promise.all([
    prisma.partner.findMany({
      include: {
        partnerTransactions: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.bankAccount.findMany({
      where: { isActive: true },
      orderBy: { bankName: "asc" },
    }),
    prisma.partnerTransaction.findMany({
      where: { txnType: "DEPOSIT" },
      take: 15,
      orderBy: { txnDate: "desc" },
      include: {
        partner: { select: { id: true, name: true, phone: true } },
      },
    }),
  ]);

  const partnersData = partnersRaw.map((p: any) => ({
    id: p.id,
    name: p.name,
    phone: p.phone,
    isActive: p.isActive ?? true,
    liveBalance: calculateLiveBalance(toNum(p.openingBalance), p.partnerTransactions || []),
  }));

  const banksData = banksRaw.map((b: any) => ({
    id: b.id,
    bankName: b.bankName,
    accountNumber: b.accountNumber,
    currentBalance: toNum(b.currentBalance),
  }));

  async function recordDepositAction(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!(await canFn(s, "partners.capital.deposit")) && !(await canFn(s, "partners.manage"))) {
      return { error: "Forbidden: partners.capital.deposit" };
    }

    const pId = (formData.get("partnerId") as string) || "";
    const amountNum = parseFloat(formData.get("amount") as string) || 0;
    const dateStr = (formData.get("date") as string) || new Date().toISOString();
    const paymentChannel = (formData.get("paymentChannel") as string) || "CASH";
    const bankAccountId = (formData.get("bankAccountId") as string) || null;
    const reference = ((formData.get("reference") as string) || "").trim();
    const notes = ((formData.get("notes") as string) || "").trim();

    if (!pId) return { error: "Please select a partner" };
    if (amountNum <= 0) return { error: "Amount must be greater than zero" };
    if (paymentChannel === "BANK" && !bankAccountId) return { error: "Please select a bank account" };

    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const userId = (s!.user as any).id;
    const partnerTxnId = randomUUID();
    const treasuryLedgerId = randomUUID();

    try {
      await prisma2.$transaction(async (tx: any) => {
        const partner = await tx.partner.findUnique({ where: { id: pId } });
        if (!partner) throw new Error("Partner not found");

        // 1. Record partner transaction
        const pt = await tx.partnerTransaction.create({
          data: {
            id: partnerTxnId,
            partnerId: pId,
            txnType: "DEPOSIT",
            amount: amountNum,
            txnDate: new Date(dateStr),
            referenceId: reference || null,
            notes: notes || `Capital investment from ${partner.name}`,
          },
        });
        await writeAudit(tx, "partner_transactions", partnerTxnId, "CREATE", userId, null, pt);

        // 2. Record treasury ledger inflow
        const tl = await tx.treasuryLedger.create({
          data: {
            id: treasuryLedgerId,
            txnDate: new Date(dateStr),
            accountType: paymentChannel,
            bankAccountId: paymentChannel === "BANK" ? bankAccountId : null,
            flowType: "IN",
            amount: amountNum,
            purpose: `Capital deposit - ${partner.name}${reference ? ` (${reference})` : ""}`,
            referenceType: "CAPITAL_DEPOSIT",
            referenceId: partnerTxnId,
            createdBy: userId,
          },
        });
        await writeAudit(tx, "treasury_ledger", treasuryLedgerId, "CREATE", userId, null, tl);

        // 3. Update bank account balance if channel is BANK
        if (paymentChannel === "BANK" && bankAccountId) {
          await tx.bankAccount.update({
            where: { id: bankAccountId },
            data: { currentBalance: { increment: amountNum } },
          });
        }
      });
    } catch (e: any) {
      return { error: e.message || "Failed to record capital deposit" };
    }

    revalidatePath("/partners");
    revalidatePath("/partners/capital");
    revalidatePath("/partners/dashboard");
    revalidatePath("/treasury");
    revalidatePath("/dashboard");
    return { success: true };
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Capital / Partner Investment</h1>
        <p className="text-sm text-slate-500">
          Inject new syndicate funds from an existing partner. This immediately updates the partner&apos;s live equity balance and records the cash/bank inflow in treasury.
        </p>
      </div>

      {/* Deposit Form */}
      <CapitalDepositForm
        partners={partnersData}
        banks={banksData}
        initialPartnerId={partnerId}
        depositAction={recordDepositAction}
      />

      {/* Recent Capital Deposits History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Recent Capital Injections ({recentDeposits.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="p-3">Date</th>
                <th>Partner Name</th>
                <th>Channel / Bank</th>
                <th>Reference</th>
                <th className="text-right">Injected Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentDeposits.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No capital injections recorded yet. Use the form above to record an investment.
                  </td>
                </tr>
              )}
              {recentDeposits.map((dep: any) => (
                <tr key={dep.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-xs text-slate-500">{formatDate(dep.txnDate)}</td>
                  <td className="font-semibold text-slate-900">{dep.partner?.name || "Partner"}</td>
                  <td className="text-xs text-slate-600">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {dep.referenceId?.startsWith("BANK") ? "BANK" : "CASH"}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500 font-mono">{dep.referenceId || "-"}</td>
                  <td className="text-right font-mono font-bold text-emerald-700 text-xs">
                    +{formatBDT(toNum(dep.amount))}
                  </td>
                  <td className="text-xs text-slate-500">{dep.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

