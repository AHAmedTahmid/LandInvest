import { NextRequest, NextResponse } from "next/server";
import { controlPrisma } from "@/lib/control";
import bcrypt from "bcryptjs";

async function findValid(token: string) {
  if (!token) return null;
  const row: any = await (controlPrisma as any).passwordResetToken.findUnique({ where: { token } });
  if (!row || row.expiresAt.getTime() < Date.now()) return null;
  return row;
}

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  return NextResponse.json({ valid: !!(await findValid(token)) });
}

export async function POST(req: NextRequest) {
  const { token, password } = await req.json().catch(() => ({}));
  const row = await findValid(String(token || ""));
  if (!row) return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  if (!password || String(password).length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  const hash = await bcrypt.hash(String(password), 10);
  await (controlPrisma as any).globalUser.update({
    where: { id: row.userId },
    data: { passwordHash: hash, mustChangePassword: false },
  });
  await (controlPrisma as any).passwordResetToken.delete({ where: { id: row.id } });
  return NextResponse.json({ ok: true });
}
