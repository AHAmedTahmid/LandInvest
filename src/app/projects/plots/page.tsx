import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import PlotsClient, { PlotItem, ProjectOption } from "./PlotsClient";

export default async function PlotsPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "projects.view"))) {
    return <div className="p-8 text-red-600 font-semibold">Forbidden: projects.view</div>;
  }
  const canManagePlots = (await can(session, "plots.manage")) || (await can(session, "projects.create")) || (await can(session, "projects.edit"));

  const prisma: any = await getTenantClientFromSession();
  const [plotRows, projectRows] = await Promise.all([
    prisma.projectPlot.findMany({
      orderBy: [{ project: { projectName: "asc" } }, { plotNumber: "asc" }],
      include: {
        project: {
          select: { id: true, projectName: true, mouza: true },
        },
        landSales: {
          select: { id: true, buyerName: true, buyerPhone: true, status: true },
          take: 1,
        },
      },
    }),
    prisma.landProject.findMany({
      orderBy: { projectName: "asc" },
      select: { id: true, projectName: true },
    }),
  ]);

  const plots: PlotItem[] = plotRows.map((p: any) => ({
    id: p.id,
    plotNumber: p.plotNumber,
    plotSizeShotok: toNum(p.plotSizeShotok),
    askingPrice: toNum(p.askingPrice),
    status: p.status,
    projectId: p.projectId,
    projectName: p.project?.projectName || "Unknown Project",
    mouza: p.project?.mouza || "",
    sale: p.landSales && p.landSales.length > 0 ? p.landSales[0] : null,
  }));

  const projects: ProjectOption[] = projectRows.map((p: any) => ({
    id: p.id,
    projectName: p.projectName,
  }));

  async function updatePlotAction(data: {
    plotId: string;
    plotNumber: string;
    plotSizeShotok: number;
    askingPrice: number;
    status: string;
  }) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    const allowed = (await canFn(s, "plots.manage")) || (await canFn(s, "projects.edit")) || (await canFn(s, "projects.create"));
    if (!allowed) {
      return { error: "Forbidden: plots.manage" };
    }

    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { writeAudit } = await import("@/lib/tenantRules");
    const prismaClient: any = await gc();
    const userId = (s!.user as any).id;

    try {
      await prismaClient.$transaction(async (tx: any) => {
        const oldPlot = await tx.projectPlot.findUnique({ where: { id: data.plotId } });
        if (!oldPlot) throw new Error("Plot not found");

        const updPlot = await tx.projectPlot.update({
          where: { id: data.plotId },
          data: {
            plotNumber: data.plotNumber,
            plotSizeShotok: Math.round(data.plotSizeShotok * 100) / 100,
            askingPrice: data.askingPrice,
            status: data.status,
          },
        });

        await writeAudit(tx, "project_plots", data.plotId, "UPDATE", userId, oldPlot, updPlot);
      });

      revalidatePath("/projects/plots");
      revalidatePath("/projects");
      revalidatePath("/sales");
      return { success: true };
    } catch (err: any) {
      return { error: err.message || "Failed to update plot" };
    }
  }

  async function createPlotAction(data: {
    projectId: string;
    plotNumber: string;
    plotSizeShotok: number;
    askingPrice: number;
  }) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    const allowed = (await canFn(s, "plots.manage")) || (await canFn(s, "projects.create"));
    if (!allowed) {
      return { error: "Forbidden: plots.manage" };
    }

    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { writeAudit } = await import("@/lib/tenantRules");
    const prismaClient: any = await gc();
    const userId = (s!.user as any).id;
    const plotId = randomUUID();

    try {
      await prismaClient.$transaction(async (tx: any) => {
        const plotData = {
          id: plotId,
          projectId: data.projectId,
          plotNumber: data.plotNumber,
          plotSizeShotok: Math.round(data.plotSizeShotok * 100) / 100,
          askingPrice: data.askingPrice,
          status: "AVAILABLE",
        };

        const newPlot = await tx.projectPlot.create({ data: plotData });
        await writeAudit(tx, "project_plots", plotId, "CREATE", userId, null, newPlot);
      });

      revalidatePath("/projects/plots");
      revalidatePath("/projects");
      revalidatePath("/sales");
      return { success: true };
    } catch (err: any) {
      return { error: err.message || "Failed to create plot" };
    }
  }

  return (
    <div className="p-6">
      <PlotsClient
        plots={plots}
        projects={projects}
        canManagePlots={canManagePlots}
        updatePlotAction={updatePlotAction}
        createPlotAction={createPlotAction}
      />
    </div>
  );
}
