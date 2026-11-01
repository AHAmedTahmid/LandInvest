import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can, canAny } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { WIDGET_REGISTRY, type WidgetFilter } from "@/lib/dashboard/widgets";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await params;
    const widget = WIDGET_REGISTRY[key];
    if (!widget) {
      return NextResponse.json({ error: `Widget '${key}' not found in registry` }, { status: 404 });
    }

    // Server-Side RBAC Enforcement (Zero data query if not allowed)
    const hasPermission = await can(session, `dashboard.widget.${key}` as any);
    if (!hasPermission) {
      return NextResponse.json(
        { error: `Forbidden: Access to widget '${key}' is denied` },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const filters: WidgetFilter = {
      preset: searchParams.get("preset") || undefined,
      fiscalYear: searchParams.get("fy") || undefined,
      startDate: searchParams.get("from") || undefined,
      endDate: searchParams.get("to") || undefined,
      projectIds: searchParams.get("projects") ? searchParams.get("projects")!.split(",") : undefined,
    };

    const db: any = await getTenantClientFromSession();
    const data = await widget.dataFn(db, filters, session);

    // Check drill-down authorization
    let canDrillDown = true;
    if (widget.requiresModules && widget.requiresModules.length > 0) {
      canDrillDown = await canAny(session, widget.requiresModules as any);
    }

    return NextResponse.json({
      key,
      data,
      canDrillDown,
      refreshedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error(`Error loading widget data:`, err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

