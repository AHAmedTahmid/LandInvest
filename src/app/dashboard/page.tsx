import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { getEffectiveLayout } from "@/lib/dashboard/layout";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "dashboard.view"))) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold bg-white rounded-2xl border border-red-200 m-6 shadow-xs">
        <h2 className="text-lg font-bold mb-1">Forbidden: viewDashboard</h2>
        <p className="text-xs text-gray-500">
          You do not have permission to access the Executive Dashboard.
        </p>
      </div>
    );
  }

  const prisma: any = await getTenantClientFromSession();

  const [canCustomize, canManageRoleLayout, canExport, projects, layoutResult] = await Promise.all([
    can(session, "dashboard.customize"),
    can(session, "dashboard.layout.manage"),
    can(session, "dashboard.export"),
    prisma.landProject.findMany({
      select: { id: true, projectName: true },
      orderBy: { createdAt: "desc" },
    }),
    getEffectiveLayout(prisma, session),
  ]);

  return (
    <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <DashboardClient
        initialLayout={layoutResult.layout}
        visibleTabs={layoutResult.visibleTabs}
        canCustomize={canCustomize}
        canManageRoleLayout={canManageRoleLayout}
        canExport={canExport}
        projects={projects}
      />
    </div>
  );
}
