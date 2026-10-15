import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { currentPassword, newPassword } = await req.json();
  if (!newPassword || String(newPassword).length < 6) return NextResponse.json({ error: "New password too short" }, { status: 400 });
  const user: any = await (controlPrisma as any).globalUser.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // if mustChangePassword, currentPassword may be not required? But we require it for safety
  if (user.mustChangePassword) {
    // allow without current if they are forced? but we still check if provided
    if (currentPassword) {
      const ok = await bcrypt.compare(String(currentPassword), user.passwordHash);
      if (!ok) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
    }
  } else {
    if (!currentPassword) return NextResponse.json({ error: "Current password required" }, { status: 400 });
    const ok = await bcrypt.compare(String(currentPassword), user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
  }
  const hash = await bcrypt.hash(String(newPassword), 10);
  await (controlPrisma as any).globalUser.update({ where: { id: userId }, data: { passwordHash: hash, mustChangePassword: false } });
  return NextResponse.json({ ok: true });
}
