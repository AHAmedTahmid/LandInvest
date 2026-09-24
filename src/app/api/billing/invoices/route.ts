import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { can } from "@/lib/rbac";
export async function GET(){
  const s=await getServerSession(authOptions);
  if(!s) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!can((s.user as any).role,"manageBilling")) return NextResponse.json({error:"Forbidden"},{status:403});
  const list=await (controlPrisma as any).billingInvoice.findMany({where:{tenantId:(s.user as any).tenantId},orderBy:{invoiceDate:"desc"}});
  return NextResponse.json(list);
}
