import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prisma: any = await getTenantClientFromSession();
  const list = await prisma.landProject.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      projectName: true,
      mouza: true,
      status: true,
      totalAreaShotok: true,
    },
  });

  return NextResponse.json(list);
}

