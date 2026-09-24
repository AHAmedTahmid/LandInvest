import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { canAddLand } from "@/lib/rbac";
import { formatBDT, toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

const PROJECT_STATUSES = ["DRAFT", "UNDER_BAYNA", "REGISTERED", "MUTATED", "READY_FOR_SALE", "SOLD_OUT"];

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const perm = canAddLand((session?.user as any)?.role);
  if (!perm) return <div className="p-8 text-red-600">Forbidden: addLand</div>;

  const prisma: any = await getTenantClientFromSession();
  const project = await prisma.landProject.findUnique({ where: { id }, include: { projectPlots: true } });
  if (!project) return <div className="p-8">Not found</div>;

  async function assertAddLand() {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { canAddLand: fn } = await import("@/lib/rbac");
    if (!fn((s!.user as any).role)) throw new Error("Forbidden: addLand");
    return (s!.user as any).id;
  }

  async function addPlot(formData: FormData) {
    "use server";
    const userId = await assertAddLand();
    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const data = {
      id: randomUUID(), projectId: id,
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
  }

  async function deletePlot(formData: FormData) {
    "use server";
    const userId = await assertAddLand();
    const prisma2: any = await getTenantClientFromSession();
    const { writeAudit } = await import("@/lib/tenantRules");
    const plotId = formData.get("plotId") as string;
    await prisma2.$transaction(async (tx: any) => {
      const plot = await tx.projectPlot.delete({ where: { id: plotId } });
      await writeAudit(tx, "project_plots", plotId, "DELETE", userId, plot, null);
    });
    revalidatePath(`/projects/${id}`);
  }

  async function updatePlot(formData: FormData) {
    "use server";
    const userId = await assertAddLand();
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
  }

  async function setStatus(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const { canAddLand: fn } = await import("@/lib/rbac");
    if (fn((s!.user as any).role) !== "full") throw new Error("Forbidden: addLand (full)");
    const status = formData.get("status") as string;
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{project.projectName}</h1>
      <div className="bg-white p-4 rounded-xl shadow border text-sm grid grid-cols-2 gap-2">
        <div>Mouza: {project.mouza}</div><div>JL: {project.jlNumber || "-"}</div>
        <div>DAG: {project.dagNumbers}</div><div>Khatian: {project.khatianNumbers}</div>
        <div>Area: {toNum(project.totalAreaShotok)} Shotok</div><div>Price: {formatBDT(toNum(project.purchasePrice))}</div>
        <div>Status: {project.status}</div>
        <div>Plots sold: {project.projectPlots.filter((p: any) => p.status === "SOLD").length} / {project.projectPlots.length}</div>
      </div>

      {perm === "full" && (
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-semibold mb-2">Project Status</h2>
          <form action={setStatus} className="flex gap-2">
            <select name="status" defaultValue={project.status} className="border rounded px-3 py-2">
              {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="bg-blue-600 text-white rounded px-4 py-2">Update Status</button>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold mb-2">Add Plot</h2>
        <form action={addPlot} className="flex flex-wrap gap-2">
          <input name="plotNumber" placeholder="Plot No" required className="border rounded px-3 py-2"/>
          <input name="plotSizeShotok" placeholder="Size" type="number" step="0.01" required className="border rounded px-3 py-2"/>
          <input name="askingPrice" placeholder="Asking Price" type="number" step="0.01" required className="border rounded px-3 py-2"/>
          <select name="status" className="border rounded px-3 py-2"><option>AVAILABLE</option><option>BOOKED</option><option>SOLD</option></select>
          <button className="bg-blue-600 text-white rounded px-4 py-2">Add</button>
        </form>
      </div>

      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="text-left border-b"><th className="p-2">Plot</th><th>Size</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{project.projectPlots.map((pl: any) => (
          <tr key={pl.id} className="border-b">
            <td className="p-2">{pl.plotNumber}</td><td>{toNum(pl.plotSizeShotok).toString()}</td><td>{formatBDT(toNum(pl.askingPrice))}</td><td>{pl.status}</td>
            <td className="flex gap-1 py-1">
              <form action={updatePlot} className="flex gap-1">
                <input type="hidden" name="plotId" value={pl.id}/>
                <input name="plotNumber" defaultValue={pl.plotNumber} className="border rounded px-1 py-1 w-20"/>
                <input name="plotSizeShotok" defaultValue={toNum(pl.plotSizeShotok)} className="border rounded px-1 py-1 w-16"/>
                <input name="askingPrice" defaultValue={toNum(pl.askingPrice)} className="border rounded px-1 py-1 w-24"/>
                <select name="status" defaultValue={pl.status} className="border rounded px-1 py-1"><option>AVAILABLE</option><option>BOOKED</option><option>SOLD</option></select>
                <button className="bg-green-600 text-white rounded px-2">Save</button>
              </form>
              <form action={deletePlot}><input type="hidden" name="plotId" value={pl.id}/><button className="bg-red-600 text-white rounded px-2 py-1">Delete</button></form>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
