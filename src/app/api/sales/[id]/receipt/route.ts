import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id:recordId}=await params;
  const s=await getServerSession(authOptions);
  if(!s) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!can((s.user as any).role,"receiveSales")) return NextResponse.json({error:"Forbidden"},{status:403});
  const prisma:any=await getTenantClientFromSession();
  const sale=await prisma.landSale.findUnique({where:{id:recordId},include:{customerPayments:true}});
  if(!sale) return NextResponse.json({error:"Not found"},{status:404});
  const html=`<html><body><h1>Receipt ${sale.id}</h1><p>Buyer: ${sale.buyerName}</p><p>Total: ${sale.totalAgreedPrice}</p><p>Due: ${sale.currentDueAmount}</p><button onclick="window.print()">Print</button></body></html>`;
  try{
    const puppeteer=await import("puppeteer");
    const browser=await (puppeteer as any).launch({headless:true,args:["--no-sandbox"]});
    const page=await browser.newPage(); await page.setContent(html,{waitUntil:"load"});
    const pdf=await page.pdf({format:"A4"}); await browser.close();
    return new NextResponse(pdf,{headers:{"Content-Type":"application/pdf","Content-Disposition":`inline; filename=receipt-${recordId}.pdf`}});
  }catch(e:any){
    console.error(`[receipt] PDF generation failed for sale ${recordId}: ${e.message}`);
    return new NextResponse(html,{headers:{"Content-Type":"text/html"}});
  }
}
