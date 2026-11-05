import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import ProjectDetailClient, { ProjectDetailData } from "./ProjectDetailClient";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!(await can(session, "projects.view"))) return <div className="p-8 text-red-600">Forbidden: projects.view</div>;
  const canEdit = await can(session, "projects.edit");
  const canManagePlots = await can(session, "plots.manage");

  const prisma: any = await getTenantClientFromSession();
  const project = await prisma.landProject.findUnique({
    where: { id },
    include: {
      projectPlots: {
        orderBy: { plotNumber: "asc" },
        include: {
          landSales: {
            select: { id: true, buyerName: true, totalAgreedPrice: true, status: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!project) return <div className="p-8 font-semibold text-slate-700">Project not found</div>;

  const projectData: ProjectDetailData = {
    id: project.id,
    projectName: project.projectName,
    mouza: project.mouza,
    jlNumber: project.jlNumber || null,
    dagNumbers: project.dagNumbers,
    khatianNumbers: project.khatianNumbers,
    totalAreaShotok: toNum(project.totalAreaShotok),
    purchasePrice: toNum(project.purchasePrice),
    baynaAmount: toNum(project.baynaAmount),
    registrationCost: toNum(project.registrationCost),
    mutationTaxCost: toNum(project.mutationTaxCost),
    status: project.status,
    createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString(),
    plots: project.projectPlots.map((pl: any) => {
      const sale = pl.landSales?.[0];
      return {
        id: pl.id,
        plotNumber: pl.plotNumber,
        plotSizeShotok: toNum(pl.plotSizeShotok),
        askingPrice: toNum(pl.askingPrice),
        status: pl.status,
        sale: sale
          ? {
              id: sale.id,
              buyerName: sale.buyerName,
              totalAgreedPrice: toNum(sale.totalAgreedPrice),
              status: sale.status,
            }
          : null,
      };
    }),
  };

  async function assertPlotManage() {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "plots.manage"))) throw new Error("Forbidden: plots.manage");
    return (s!.user as any).id;
  }

  async function batchGeneratePlots(formData: FormData) {
    "use server";
    const userId = await assertPlotManage();
    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const count = parseInt(formData.get("count") as string, 10) || 0;
    const askingPrice = parseFloat(formData.get("askingPrice") as string) || 0;
    const existingCount = await prisma2.projectPlot.count({ where: { projectId: id } });
    const sizeShotok =
      parseFloat(formData.get("sizeShotok") as string) ||
      (count > 0 ? toNum(project.totalAreaShotok) / count : 0);

    if (count > 0) {
      await prisma2.$transaction(async (tx: any) => {
        for (let i = 1; i <= count; i++) {
          const plotNum = existingCount + i;
          const plotId = randomUUID();
          const plotData = {
            id: plotId,
            projectId: id,
            plotNumber: `Plot-${plotNum}`,
            plotSizeShotok: Math.round(sizeShotok * 100) / 100,
            askingPrice,
            status: "AVAILABLE",
          };
          const plot = await tx.projectPlot.create({ data: plotData });
          await writeAudit(tx, "project_plots", plot.id, "CREATE", userId, null, plotData);
        }
      });
      revalidatePath(`/projects/${id}`);
      revalidatePath("/projects");
      revalidatePath("/projects/plots");
      revalidatePath("/sales");
    }
  }

  async function addPlot(formData: FormData) {
    "use server";
    const userId = await assertPlotManage();
    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const data = {
      id: randomUUID(),
      projectId: id,
      plotNumber: formData.get("plotNumber") as string,
      plotSizeShotok: parseFloat(formData.get("plotSizeShotok") as string) || 0,
      askingPrice: parseFloat(formData.get("askingPrice") as string) || 0,
      status: (formData.get("status") as string) || "AVAILABLE",
    };
    await prisma2.$transaction(async (tx: any) => {
      const plot = await tx.projectPlot.create({ data });
      await writeAudit(tx, "project_plots", plot.id, "CREATE", userId, null, plot);
    });
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    revalidatePath("/projects/plots");
    revalidatePath("/sales");
  }

  async function deletePlot(formData: FormData) {
    "use server";
    const userId = await assertPlotManage();
    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const plotId = formData.get("plotId") as string;
    await prisma2.$transaction(async (tx: any) => {
      const plot = await tx.projectPlot.delete({ where: { id: plotId } });
      await writeAudit(tx, "project_plots", plotId, "DELETE", userId, plot, null);
    });
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    revalidatePath("/projects/plots");
    revalidatePath("/sales");
  }

  async function updatePlot(formData: FormData) {
    "use server";
    const userId = await assertPlotManage();
    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const plotId = formData.get("plotId") as string;
    const prev = await prisma2.projectPlot.findUnique({ where: { id: plotId } });
    const data = {
      plotNumber: formData.get("plotNumber") as string,
      plotSizeShotok: parseFloat(formData.get("plotSizeShotok") as string) || 0,
      askingPrice: parseFloat(formData.get("askingPrice") as string) || 0,
      status: formData.get("status") as string,
    };
    await prisma2.$transaction(async (tx: any) => {
      const updated = await tx.projectPlot.update({ where: { id: plotId }, data });
      await writeAudit(tx, "project_plots", plotId, "UPDATE", userId, prev, updated);
    });
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    revalidatePath("/projects/plots");
    revalidatePath("/sales");
  }

  async function setStatus(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "projects.edit"))) throw new Error("Forbidden: projects.edit");
    const status = formData.get("status") as string;
    const PROJECT_STATUSES = ["DRAFT", "UNDER_BAYNA", "REGISTERED", "MUTATED", "READY_FOR_SALE", "SOLD_OUT"];
    if (!PROJECT_STATUSES.includes(status)) throw new Error(`Invalid status: ${status}`);
    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const prev = await prisma2.landProject.findUnique({ where: { id } });
    if (!prev) throw new Error("Project not found");
    await prisma2.$transaction(async (tx: any) => {
      const updated = await tx.landProject.update({ where: { id }, data: { status } });
      await writeAudit(tx, "land_projects", id, "UPDATE", (s!.user as any).id, { status: prev.status }, { status: updated.status });
    });
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
  }

  return (
    <div className="p-6">
      <ProjectDetailClient
        project={projectData}
        canEdit={canEdit}
        canManagePlots={canManagePlots}
        updateStatusAction={setStatus}
        addPlotAction={addPlot}
        updatePlotAction={updatePlot}
        deletePlotAction={deletePlot}
        batchGenerateAction={batchGeneratePlots}
      />
    </div>
  );
}
