import { NextRequest, NextResponse } from "next/server";
import { controlPrisma } from "@/lib/control";
import bcrypt from "bcryptjs";
export async function POST(req:NextRequest){
  const {token,password,fullName}=await req.json();
  const invite=await (controlPrisma as any).userInvitation.findUnique({where:{inviteToken:token}});
  if(!invite||invite.accepted||new Date(invite.expiresAt)<new Date()) return NextResponse.json({error:"Invalid invite"},{status:400});
  const hash=await bcrypt.hash(password,10);
  await (controlPrisma as any).globalUser.create({data:{tenantId:invite.tenantId,email:invite.email,fullName:fullName||invite.email,passwordHash:hash,role:invite.role}});
  await (controlPrisma as any).userInvitation.update({where:{id:invite.id},data:{accepted:true}});
  return NextResponse.json({message:"Account created"});
}
