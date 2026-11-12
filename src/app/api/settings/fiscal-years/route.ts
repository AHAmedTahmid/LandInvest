import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import {
  getFiscalYears,
  addFiscalYear,
  setCurrentFiscalYear,
  updateFiscalYearStatus,
  deleteFiscalYear,
} from "@/lib/fiscalYear";

async function canManageFy(session: any) {
  return (
    (await can(session, "dashboard.settings.manage")) ||
    (await can(session, "roles.manage")) ||
    (await can(session, "users.manage"))
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma: any = await getTenantClientFromSession();
  const data = await getFiscalYears(prisma);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canManageFy(session))) {
    return NextResponse.json({ error: "Forbidden: dashboard.settings.manage" }, { status: 403 });
  }

  const userId = (session.user as any).id;
  const prisma: any = await getTenantClientFromSession();
  const body = await req.json();
  const action = body.action || "CREATE";

  try {
    if (action === "SET_CURRENT") {
      if (!body.id) return NextResponse.json({ error: "Fiscal year ID required" }, { status: 400 });
      const res = await setCurrentFiscalYear(prisma, body.id, userId);
      return NextResponse.json(res);
    }

    if (action === "TOGGLE_STATUS") {
      if (!body.id || !["ACTIVE", "CLOSED"].includes(body.status)) {
        return NextResponse.json({ error: "Valid fiscal year ID and status required" }, { status: 400 });
      }
      const res = await updateFiscalYearStatus(prisma, body.id, body.status, userId);
      return NextResponse.json(res);
    }

    if (action === "DELETE") {
      if (!body.id) return NextResponse.json({ error: "Fiscal year ID required" }, { status: 400 });
      const res = await deleteFiscalYear(prisma, body.id, userId);
      return NextResponse.json(res);
    }

    // CREATE
    const res = await addFiscalYear(
      prisma,
      {
        label: body.label,
        labelBn: body.labelBn,
        startDate: body.startDate,
        endDate: body.endDate,
        setAsCurrent: !!body.setAsCurrent,
        notes: body.notes,
      },
      userId
    );
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Operation failed" }, { status: 400 });
  }
}

