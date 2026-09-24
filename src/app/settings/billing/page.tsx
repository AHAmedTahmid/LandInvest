import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { can } from "@/lib/rbac";
import { formatBDT } from "@/lib/format";

export default async function BillingPage(){
  const session=await getServerSession(authOptions);
  if(!can((session?.user as any)?.role,"manageBilling")) return <div className="p-8 text-red-600">Forbidden</div>;
  const tenantId=(session!.user as any).tenantId;
  const sub=await (controlPrisma as any).subscription.findFirst({where:{tenantId},include:{plan:true}});
  const plans=await (controlPrisma as any).plan.findMany();
  const invoices=await (controlPrisma as any).billingInvoice.findMany({where:{tenantId},orderBy:{invoiceDate:"desc"}});
  return (<div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Billing</h1>
    <div className="bg-white rounded shadow border p-4">
      <h2 className="font-semibold">Current Plan: {sub?.plan?.name ?? "None"} ({sub?.billingCycle ?? "-"}) - {sub ? formatBDT(Number(sub.plan.priceMonthly))+"/mo" : ""}</h2>
      <p className="text-sm text-gray-500">Status: {sub?.status}</p>
      <div className="mt-2 flex gap-2">{plans.map((p:any)=><span key={p.id} className="border rounded px-2 py-1 text-sm">{p.name} {formatBDT(Number(p.priceMonthly))}</span>)}</div>
    </div>
    <table className="w-full text-sm bg-white rounded shadow border"><thead><tr className="border-b"><th className="p-2">Date</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>{invoices.map((inv:any)=><tr key={inv.id} className="border-b"><td className="p-2">{new Date(inv.invoiceDate).toLocaleDateString()}</td><td>{formatBDT(Number(inv.amount))}</td><td>{inv.status}</td><td>{inv.status!=="paid" ? <form action={async()=>{"use server"; const s=await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions); await (await import("@/lib/control")).controlPrisma.billingInvoice.update({where:{id:inv.id},data:{status:"paid"}} as any); const {revalidatePath}=await import("next/cache"); revalidatePath("/settings/billing");}}><button className="bg-green-600 text-white px-3 py-1 rounded text-xs">Mark as paid</button></form> : "✓"}</td></tr>)}</tbody></table>
  </div>);
}
