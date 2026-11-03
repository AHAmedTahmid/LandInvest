import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import Link from "next/link";

const PROJECT_STATUSES = ["DRAFT", "UNDER_BAYNA", "REGISTERED", "MUTATED", "READY_FOR_SALE", "SOLD_OUT"];

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!(await can(session, "projects.view"))) return <div className="p-8 text-red-600">Forbidden: projects.view</div>;
  const canEdit = await can(session, "projects.edit");
  const canManagePlots = await can(session, "plots.manage");

  const prisma: any = await getTenantClientFromSession();
  const project = await prisma.landProject.findUnique({
    where: { id },
    include: { projectPlots: { orderBy: { plotNumber: "asc" } } },
  });
  if (!project) return <div className="p-8">Not found</div>;

  const totalPlots = project.projectPlots.length;
  const availablePlots = project.projectPlots.filter((p: any) => p.status === "AVAILABLE");
  const bookedPlots = project.projectPlots.filter((p: any) => p.status === "BOOKED");
  const soldPlots = project.projectPlots.filter((p: any) => p.status === "SOLD");

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
    const sizeShotok = parseFloat(formData.get("sizeShotok") as string) || (count > 0 ? toNum(project.totalAreaShotok) / count : 0);

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
    revalidatePath("/sales");
  }

  async function setStatus(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "projects.edit"))) throw new Error("Forbidden: projects.edit");
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/projects" className="text-blue-600 hover:underline text-sm font-medium">
              ← Back to Projects
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-1">{project.projectName}</h1>
        </div>
      </div>

      {/* KPI Cards for Plot Inventory */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Plots</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalPlots}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-xs font-semibold text-slate-500 uppercase">Available Plots (Remaining)</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{availablePlots.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-xs font-semibold text-slate-500 uppercase">Booked Plots</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{bookedPlots.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-xs font-semibold text-slate-500 uppercase">Sold Plots</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{soldPlots.length}</p>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white p-4 rounded-xl shadow border text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><span className="text-slate-500 block text-xs">Mouza</span> <span className="font-medium">{project.mouza}</span></div>
        <div><span className="text-slate-500 block text-xs">JL Number</span> <span className="font-medium">{project.jlNumber || "-"}</span></div>
        <div><span className="text-slate-500 block text-xs">DAG Numbers</span> <span className="font-medium">{project.dagNumbers}</span></div>
        <div><span className="text-slate-500 block text-xs">Khatian Numbers</span> <span className="font-medium">{project.khatianNumbers}</span></div>
        <div><span className="text-slate-500 block text-xs">Total Land Area</span> <span className="font-medium">{toNum(project.totalAreaShotok).toString()} Shotok</span></div>
        <div><span className="text-slate-500 block text-xs">Total Purchase Price</span> <span className="font-medium">{formatBDT(toNum(project.purchasePrice))}</span></div>
        <div><span className="text-slate-500 block text-xs">Bayna (Advance)</span> <span className="font-medium">{formatBDT(toNum(project.baynaAmount))}</span></div>
        <div><span className="text-slate-500 block text-xs">Status</span> <span className="font-semibold text-slate-800">{project.status}</span></div>
      </div>

      {canEdit && (
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-semibold mb-2 text-sm uppercase text-slate-700">Update Project Status</h2>
          <form action={setStatus} className="flex gap-2 max-w-sm">
            <select name="status" defaultValue={project.status} className="border rounded px-3 py-2 text-sm bg-white flex-1">
              {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 text-sm font-semibold transition">
              Update
            </button>
          </form>
        </div>
      )}

      {/* Batch Generate Plots */}
      {canManagePlots && (
        <div className="bg-white p-5 rounded-xl shadow border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm uppercase text-slate-700">Generate Plots in Batch</h2>
              <p className="text-xs text-slate-500">Quickly divide this land into multiple plots with auto-assigned plot numbers and asking price.</p>
            </div>
          </div>
          <form action={batchGeneratePlots} className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Number of Plots *</label>
              <input name="count" type="number" min="1" max="500" placeholder="e.g. 10" required className="w-full border rounded px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Asking Price per Plot (BDT) *</label>
              <input name="askingPrice" type="number" step="0.01" min="0" placeholder="e.g. 500000" required className="w-full border rounded px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Size per Plot (Shotok, optional)</label>
              <input name="sizeShotok" type="number" step="0.01" min="0" placeholder="Auto: Area / Plots" className="w-full border rounded px-3 py-2 text-sm"/>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded px-4 py-2 text-sm transition">
                + Generate Plots
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Single Plot */}
      {canManagePlots && (
        <div className="bg-white p-4 rounded-xl shadow border space-y-2">
          <h2 className="font-semibold text-sm uppercase text-slate-700">Add Individual Plot</h2>
          <form action={addPlot} className="flex flex-wrap gap-2">
            <input name="plotNumber" placeholder="Plot No (e.g. A-1)" required className="border rounded px-3 py-2 text-sm"/>
            <input name="plotSizeShotok" placeholder="Size (Shotok)" type="number" step="0.01" required className="border rounded px-3 py-2 text-sm"/>
            <input name="askingPrice" placeholder="Asking Price" type="number" step="0.01" required className="border rounded px-3 py-2 text-sm"/>
            <select name="status" className="border rounded px-3 py-2 text-sm bg-white">
              <option>AVAILABLE</option>
              <option>BOOKED</option>
              <option>SOLD</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded px-4 py-2 text-sm transition">
              Add Plot
            </button>
          </form>
        </div>
      )}

      {/* Plot List Table */}
      <div>
        <h2 className="font-semibold text-sm uppercase text-slate-700 mb-2">Plot Inventory ({project.projectPlots.length})</h2>
        <table className="w-full text-sm bg-white rounded-xl shadow border">
          <thead>
            <tr className="text-left border-b bg-slate-50 text-slate-600">
              <th className="p-3">Plot Number</th>
              <th>Size</th>
              <th>Asking Price</th>
              <th>Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {project.projectPlots.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  No plots created yet for this project. Use &ldquo;Generate Plots in Batch&rdquo; above to create plots.
                </td>
              </tr>
            )}
            {project.projectPlots.map((pl: any) => (
              <tr key={pl.id} className="border-b hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900">{pl.plotNumber}</td>
                <td>{toNum(pl.plotSizeShotok).toString()} Shotok</td>
                <td className="font-medium">{formatBDT(toNum(pl.askingPrice))}</td>
                <td>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      pl.status === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-800"
                        : pl.status === "BOOKED"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {pl.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {canManagePlots && (
                    <div className="inline-flex items-center gap-2">
                      <form action={updatePlot} className="inline-flex gap-1">
                        <input type="hidden" name="plotId" value={pl.id}/>
                        <input name="plotNumber" defaultValue={pl.plotNumber} className="border rounded px-2 py-1 w-20 text-xs"/>
                        <input name="plotSizeShotok" defaultValue={toNum(pl.plotSizeShotok)} className="border rounded px-2 py-1 w-16 text-xs"/>
                        <input name="askingPrice" defaultValue={toNum(pl.askingPrice)} className="border rounded px-2 py-1 w-24 text-xs"/>
                        <select name="status" defaultValue={pl.status} className="border rounded px-1 py-1 text-xs bg-white">
                          <option>AVAILABLE</option>
                          <option>BOOKED</option>
                          <option>SOLD</option>
                        </select>
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded px-2 py-1 text-xs font-medium">Save</button>
                      </form>
                      <form action={deletePlot} className="inline">
                        <input type="hidden" name="plotId" value={pl.id}/>
                        <button className="bg-red-600 hover:bg-red-500 text-white rounded px-2 py-1 text-xs font-medium">Delete</button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
