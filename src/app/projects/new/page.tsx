import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import NewAcquirementForm from "./NewAcquirementForm";

export default async function NewAcquirementPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "projects.view"))) {
    return <div className="p-8 text-red-600 font-semibold">Forbidden: projects.view</div>;
  }
  const canCreate = await can(session, "projects.create");

  async function createProjectAction(data: any) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { can: canFn } = await import("@/lib/rbac");
    if (!(await canFn(s, "projects.create"))) {
      return { error: "Forbidden: projects.create" };
    }

    const { getTenantClientFromSession: gc } = await import("@/lib/tenant");
    const { writeAudit } = await import("@/lib/tenantRules");
    const prisma: any = await gc();
    const userId = (s!.user as any).id;
    const projectId = randomUUID();

    try {
      await prisma.$transaction(async (tx: any) => {
        // 1. Create Land Project
        const projectData = {
          id: projectId,
          projectName: data.projectName,
          mouza: data.mouza,
          jlNumber: data.jlNumber || null,
          dagNumbers: data.dagNumbers,
          khatianNumbers: data.khatianNumbers,
          totalAreaShotok: data.totalAreaShotok,
          purchasePrice: data.purchasePrice,
          baynaAmount: data.baynaAmount || 0,
          registrationCost: data.registrationCost || 0,
          mutationTaxCost: data.mutationTaxCost || 0,
          status: data.status || "UNDER_BAYNA",
        };

        const pr = await tx.landProject.create({ data: projectData });
        await writeAudit(tx, "land_projects", pr.id, "CREATE", userId, null, pr);

        // 2. Generate Distributed Plots
        if (data.customPlots && Array.isArray(data.customPlots) && data.customPlots.length > 0) {
          for (const cp of data.customPlots) {
            const plotId = randomUUID();
            const plotData = {
              id: plotId,
              projectId: pr.id,
              plotNumber: cp.plotNumber || "Plot",
              plotSizeShotok: Math.round((Number(cp.sizeShotok) || 0) * 100) / 100,
              askingPrice: Number(cp.askingPrice) || 0,
              status: "AVAILABLE",
            };
            const plot = await tx.projectPlot.create({ data: plotData });
            await writeAudit(tx, "project_plots", plot.id, "CREATE", userId, null, plotData);
          }
        } else if (data.numPlots > 0) {
          const numPlots = Number(data.numPlots);
          const sizePerPlot = Number(data.defaultSizePerPlot) || (numPlots > 0 ? Number(data.totalAreaShotok) / numPlots : 0);
          const pricePerPlot = Number(data.defaultPricePerPlot) || 0;

          for (let i = 1; i <= numPlots; i++) {
            const plotId = randomUUID();
            const plotData = {
              id: plotId,
              projectId: pr.id,
              plotNumber: `Plot-${i}`,
              plotSizeShotok: Math.round(sizePerPlot * 100) / 100,
              askingPrice: pricePerPlot,
              status: "AVAILABLE",
            };
            const plot = await tx.projectPlot.create({ data: plotData });
            await writeAudit(tx, "project_plots", plot.id, "CREATE", userId, null, plotData);
          }
        }
      });

      revalidatePath("/projects");
      revalidatePath("/projects/plots");
      revalidatePath("/sales");
      return { success: true, projectId };
    } catch (err: any) {
      return { error: err.message || "Failed to acquire land project" };
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Land Acquirement & Plot Distribution</h1>
        <p className="text-sm text-slate-500 mt-1">
          Record a new land purchase, enter legal survey coordinates, and divide into customized sellable plots.
        </p>
      </div>

      <NewAcquirementForm canCreate={canCreate} createAction={createProjectAction} />
    </div>
  );
}
