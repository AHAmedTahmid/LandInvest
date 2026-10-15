import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getUserPermissions } from "@/lib/rbac";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const perms = await getUserPermissions(session);
  return NextResponse.json({ permissions: perms, isOwner: !!(session.user as any).isOwner });
}
