import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { getUserPermissions } from "@/lib/rbac";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const perms = await getUserPermissions(session);
  const me: any = await (controlPrisma as any).globalUser.findUnique({
    where: { id: (session.user as any).id },
    select: { fullName: true, email: true, mustChangePassword: true },
  });
  return NextResponse.json({ permissions: perms, isOwner: !!(session.user as any).isOwner, mustChangePassword: !!me?.mustChangePassword, fullName: me?.fullName ?? null, email: me?.email ?? null });
}
