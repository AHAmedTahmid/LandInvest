import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { sellPlot, writeAudit } from "@/lib/tenantRules";
import { randomUUID } from "crypto";
export async function GET(){
  const s=await getServerSession(authOptions); if(!s) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!can((s.user as any).role,"receiveSales")) return NextResponse.json({error:"Forbidden"},{status:403});
  const prisma:any=await getTenantClientFromSession();
  return NextResponse.json(await prisma.landSale.findMany({orderBy:{saleDate:"desc"}}));
}
export async function POST(req:NextRequest){
  const s=await getServerSession(authOptions); if(!s) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!can((s.user as any).role,"receiveSales")) return NextResponse.json({error:"Forbidden"},{status:403});
  const b=await req.json();
  const userId=(s.user as any).id; const prisma:any=await getTenantClientFromSession();
  const saleId=randomUUID();
  const due=Number(b.total_agreed_price)-Number(b.advance||0);
  const saleData={id:saleId,projectId:b.project_id,plotId:b.plot_id||null,buyerName:b.buyer_name,buyerPhone:b.buyer_phone,buyerNid:b.buyer_nid||null,saleDate:new Date(),totalAgreedPrice:b.total_agreed_price,advanceBookingAmount:b.advance||0,currentDueAmount:due,status:"BOOKED"};
  const result=await prisma.$transaction(async(tx:any)=>{
    let sale;
    if(b.plot_id) sale=await sellPlot(tx,b.plot_id,saleData,userId);
    else { sale=await tx.landSale.create({data:saleData}); await writeAudit(tx,"land_sales",saleId,"CREATE",userId,null,saleData); }
    if(b.installments?.length){ for(const ins of b.installments){ const id=randomUUID(); const r=await tx.installmentSchedule.create({data:{id,saleId, dueDate:new Date(ins.dueDate), dueAmount:ins.dueAmount,status:"UPCOMING"}}); await writeAudit(tx,"installment_schedule",id,"CREATE",userId,null,r); }}
    if(Number(b.advance)>0){
      const payId=randomUUID(); const cp=await tx.customerPayment.create({data:{id:payId,saleId,paymentDate:new Date(),amountPaid:b.advance,paymentMethod:b.payment_method||"CASH",bankAccountId:b.bank_account||null,receiptNo:`R-${Date.now()}`,remarks:"Advance"}});
      await writeAudit(tx,"customer_payments",payId,"CREATE",userId,null,cp);
      const tl=await tx.treasuryLedger.create({data:{id:randomUUID(),txnDate:new Date(),accountType:b.bank_account?"BANK":"CASH",bankAccountId:b.bank_account||null,flowType:"IN",amount:b.advance,purpose:`Advance sale ${saleId}`,referenceType:"SALE_PAYMENT",referenceId:saleId,createdBy:userId}});
      await writeAudit(tx,"treasury_ledger",tl.id,"CREATE",userId,null,tl);
    }
    return sale;
  });
  return NextResponse.json(result);
}
