import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import Link from "next/link";
import { Plus, Grid, Building2 } from "lucide-react";
import ProjectsDirectoryClient, { ProjectRow } from "./ProjectsDirectoryClient";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "projects.view"))) return <div className="p-8 text-red-600">Forbidden: projects.view</div>;
  const canCreate = await can(session, "projects.create");
  const prisma: any = await getTenantClientFromSession();

  const rawProjects = await prisma.landProject.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      projectPlots: {
        select: { id: true, status: true, askingPrice: true },
      },
    },
  });

  const projects: ProjectRow[] = rawProjects.map((p: any) => {
    const totalPlots = p.projectPlots?.length || 0;
    const availablePlots = p.projectPlots?.filter((pl: any) => pl.status === "AVAILABLE").length || 0;
    const bookedPlots = p.projectPlots?.filter((pl: any) => pl.status === "BOOKED").length || 0;
    const soldPlots = p.projectPlots?.filter((pl: any) => pl.status === "SOLD").length || 0;

    return {
      id: p.id,
      projectName: p.projectName,
      mouza: p.mouza,
      dagNumbers: p.dagNumbers,
      khatianNumbers: p.khatianNumbers,
      jlNumber: p.jlNumber || null,
      totalAreaShotok: toNum(p.totalAreaShotok),
      purchasePrice: toNum(p.purchasePrice),
      baynaAmount: toNum(p.baynaAmount),
      registrationCost: toNum(p.registrationCost),
      mutationTaxCost: toNum(p.mutationTaxCost),
      status: p.status,
      totalPlots,
      availablePlots,
      bookedPlots,
      soldPlots,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Land Projects & Acquisition</span>
            <span>•</span>
            <span className="text-brand-600">All Projects Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            All Land Projects {!canCreate && "(View only)"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all acquired tracts, legal DAG/khatian details, and aggregated plot distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCreate && (
            <Link
              href="/projects/new"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Acquirement
            </Link>
          )}
          <Link
            href="/projects/plots"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs"
          >
            <Grid className="w-4 h-4 text-purple-600" /> Plots Inventory
          </Link>
        </div>
      </div>

      {/* Main Client Directory Component */}
      <ProjectsDirectoryClient projects={projects} canCreate={canCreate} />
    </div>
  );
}
