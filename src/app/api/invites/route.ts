import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { assertOrThrow } from "@/lib/rbac";
import { randomUUID } from "crypto";

export async function POST(req:NextRequest){
  const session=await getServerSession(authOptions);
  if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{ assertOrThrow((session.user as any).role,"inviteUsers"); }catch{ return NextResponse.json({error:"Forbidden"},{status:403});}
  const {email,role}=await req.json();
  const tenantId=(session.user as any).tenantId;
  const token=randomUUID();
  const invite=await (controlPrisma as any).userInvitation.create({data:{tenantId,email,role,inviteToken:token,expiresAt:new Date(Date.now()+7*86400000)}});
  return NextResponse.json(invite);
}
export async function GET(){
  const session=await getServerSession(authOptions);
  if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{ assertOrThrow((session.user as any).role,"inviteUsers"); }catch{ return NextResponse.json({error:"Forbidden"},{status:403});}
  const tenantId=(session.user as any).tenantId;
  const list=await (controlPrisma as any).userInvitation.findMany({where:{tenantId}});
  return NextResponse.json(list);
}
