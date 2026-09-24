import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { isPaidByPartner, writeAudit } from "@/lib/tenantRules";
import { randomUUID } from "crypto";
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id:recordId}=await params;
  const session=await getServerSession(authOptions);
  if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const role=(session.user as any).role;
  if(!can(role,"approveExpense")) return NextResponse.json({error:"Forbidden"},{status:403});
  const {action}=await req.json(); // APPROVED or REJECTED
  const userId=(session.user as any).id;
  const prisma:any=await getTenantClientFromSession();
  const result=await prisma.$transaction(async(tx:any)=>{
    const exp=await tx.projectExpense.findUnique({where:{id:recordId}});
    if(!exp) throw new Error("Not found");
    const updated=await tx.projectExpense.update({where:{id:recordId},data:{status:action==="APPROVED"?"APPROVED":"REJECTED",approvedBy:userId}});
    await writeAudit(tx,"project_expenses",recordId,"UPDATE",userId,exp,updated);
    if(action==="APPROVED"){
      if(isPaidByPartner(exp.paymentChannel)){
        const pt=await tx.partnerTransaction.create({data:{id:randomUUID(),partnerId:exp.paidByPartnerId,txnType:"DIRECT_EXPENSE",amount:exp.amount,txnDate:new Date(),referenceId:recordId,notes:exp.description}});
        await writeAudit(tx,"partner_transactions",pt.id,"CREATE",userId,null,pt);
      } else {
        const accType=exp.paymentChannel==="BANK"?"BANK":"CASH";
        const tl=await tx.treasuryLedger.create({data:{id:randomUUID(),txnDate:new Date(),accountType:accType,bankAccountId:exp.bankAccountId,flowType:"OUT",amount:exp.amount,purpose:exp.expenseCategory,referenceType:"EXPENSE",referenceId:recordId,createdBy:userId}});
        await writeAudit(tx,"treasury_ledger",tl.id,"CREATE",userId,null,tl);
      }
    }
    return updated;
  });
  return NextResponse.json(result);
}
