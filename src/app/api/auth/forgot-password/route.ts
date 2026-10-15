import { NextRequest, NextResponse } from "next/server";
import { controlPrisma } from "@/lib/control";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));
  const cleanEmail = String(email || "").trim().toLowerCase();
  // always return ok to avoid email enumeration
  if (cleanEmail) {
    const user: any = await (controlPrisma as any).globalUser.findUnique({ where: { email: cleanEmail } });
    if (user) {
      await (controlPrisma as any).passwordResetToken.deleteMany({ where: { userId: user.id } });
      const token = randomUUID();
      await (controlPrisma as any).passwordResetToken.create({
        data: { userId: user.id, token, expiresAt: new Date(Date.now() + 3600e3) },
      });
      const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      console.log(`[reset] ${cleanEmail} -> ${base}/reset-password/${token}`);
    }
  }
  return NextResponse.json({ ok: true });
}
