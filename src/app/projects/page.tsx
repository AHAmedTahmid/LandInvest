import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { formatBDT, toNum } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "projects.view"))) return <div className="p-8 text-red-600">Forbidden: projects.view</div>;
  const canCreate = await can(session, "projects.create");
  const prisma: any = await getTenantClientFromSession();
  const projects = await prisma.landProject.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      projectPlots: {
        select: { id: true, status: true, askingPrice: true },
      },
    },
  });

  async function createProject(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "projects.create"))) throw new Error("Forbidden: projects.create");
    const prisma2: any = await getTenantClientFromSession();
    const projectId = randomUUID();
    const totalArea = parseFloat(formData.get("totalAreaShotok") as string) || 0;
    const data = {
      id: projectId,
      projectName: formData.get("projectName") as string,
      mouza: formData.get("mouza") as string,
      jlNumber: (formData.get("jlNumber") as string) || null,
      dagNumbers: formData.get("dagNumbers") as string,
      khatianNumbers: formData.get("khatianNumbers") as string,
      totalAreaShotok: totalArea,
      purchasePrice: parseFloat(formData.get("purchasePrice") as string) || 0,
      baynaAmount: parseFloat(formData.get("baynaAmount") as string) || 0,
      registrationCost: parseFloat(formData.get("registrationCost") as string) || 0,
      mutationTaxCost: parseFloat(formData.get("mutationTaxCost") as string) || 0,
      status: (await (await import("@/lib/rbac")).can(s, "projects.create")) ? (formData.get("status") as string) || "UNDER_BAYNA" : "DRAFT",
    };

    const numPlots = parseInt(formData.get("numberOfPlots") as string, 10) || 0;
    const pricePerPlot = parseFloat(formData.get("pricePerPlot") as string) || 0;
    const sizePerPlot = parseFloat(formData.get("sizePerPlot") as string) || (numPlots > 0 ? totalArea / numPlots : 0);

    const { writeAudit } = await import("@/lib/tenantRules");
    const userId = (s!.user as any).id;

    await prisma2.$transaction(async (tx: any) => {
      const pr = await tx.landProject.create({ data });
      await writeAudit(tx, "land_projects", pr.id, "CREATE", userId, null, pr);

      // Automatically generate the specified plots for this land
      if (numPlots > 0) {
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
    revalidatePath("/sales");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Land Projects & Acquisition {!canCreate && "(View only)"}</h1>
          <p className="text-sm text-slate-500">Acquire land tracts, divide into sellable plots, and track plot inventory status.</p>
        </div>
      </div>

      {canCreate && (
        <div className="bg-white p-5 rounded-xl shadow border space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Acquire New Land & Divide into Plots</h2>
          <form action={createProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project Name *</label>
                <input name="projectName" placeholder="e.g. Green Valley City" required className="w-full border rounded px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mouza *</label>
                <input name="mouza" placeholder="e.g. Mirpur, Dhaka" required className="w-full border rounded px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">JL Number</label>
                <input name="jlNumber" placeholder="JL Number" className="w-full border rounded px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">DAG Numbers *</label>
                <input name="dagNumbers" placeholder="e.g. 101, 102" required className="w-full border rounded px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Khatian Numbers *</label>
                <input name="khatianNumbers" placeholder="e.g. 789" required className="w-full border rounded px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Land Area (Shotok) *</label>
                <input name="totalAreaShotok" placeholder="Area Shotok" type="number" step="0.01" required className="w-full border rounded px-3 py-2 text-sm"/>
              </div>
            </div>

            {/* Financial acquisition costs */}
            <div className="border-t pt-3">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Acquisition Costs (BDT)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Total Purchase Price *</label>
                  <input name="purchasePrice" placeholder="0.00" type="number" step="0.01" required className="w-full border rounded px-3 py-2 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Bayna (Advance) Amount</label>
                  <input name="baynaAmount" placeholder="0.00" type="number" step="0.01" className="w-full border rounded px-3 py-2 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Registration Cost</label>
                  <input name="registrationCost" placeholder="0.00" type="number" step="0.01" className="w-full border rounded px-3 py-2 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mutation / Tax Cost</label>
                  <input name="mutationTaxCost" placeholder="0.00" type="number" step="0.01" className="w-full border rounded px-3 py-2 text-sm"/>
                </div>
              </div>
            </div>

            {/* Plot division setup */}
            <div className="border-t pt-3 bg-emerald-50/50 -mx-5 px-5 py-3 border-b">
              <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                Plot Division & Pricing (Auto-Create Plots)
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Specify how many plots you are making in this land and the price per plot. Plots will be immediately available in the Sales module.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Plots (e.g. 10)</label>
                  <input
                    name="numberOfPlots"
                    type="number"
                    min="0"
                    placeholder="e.g. 10"
                    className="w-full border rounded px-3 py-2 text-sm bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Asking Price per Plot (BDT)</label>
                  <input
                    name="pricePerPlot"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 500000"
                    className="w-full border rounded px-3 py-2 text-sm bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Size per Plot (Shotok, optional)</label>
                  <input
                    name="sizePerPlot"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Auto: Total Area / Plots"
                    className="w-full border rounded px-3 py-2 text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="w-48">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Status</label>
                <select name="status" className="w-full border rounded px-3 py-2 text-sm bg-white">
                  <option>UNDER_BAYNA</option>
                  <option>REGISTERED</option>
                  <option>MUTATED</option>
                  <option>READY_FOR_SALE</option>
                </select>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition shadow-sm mt-4">
                Create Project & Generate Plots
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">All Land Projects ({projects.length})</h2>
        <table className="w-full text-sm bg-white rounded-xl shadow border">
          <thead>
            <tr className="text-left border-b text-slate-600 bg-slate-50">
              <th className="p-3">Project Name</th>
              <th>Mouza</th>
              <th>Total Area</th>
              <th>Land Cost</th>
              <th>Plots (Available / Total)</th>
              <th>Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">No land projects added yet.</td>
              </tr>
            )}
            {projects.map((p: any) => {
              const totalPlots = p.projectPlots?.length || 0;
              const availPlots = p.projectPlots?.filter((pl: any) => pl.status === "AVAILABLE").length || 0;
              const soldPlots = totalPlots - availPlots;

              return (
                <tr key={p.id} className="border-b hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{p.projectName}</td>
                  <td className="text-slate-600">{p.mouza}</td>
                  <td>{toNum(p.totalAreaShotok).toString()} Shotok</td>
                  <td className="font-medium">{formatBDT(toNum(p.purchasePrice))}</td>
                  <td>
                    {totalPlots === 0 ? (
                      <span className="text-xs text-slate-400 italic">0 Plots created</span>
                    ) : availPlots > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span>{availPlots} Available</span>
                        <span className="text-slate-400 font-normal">/ {totalPlots} total</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Sold Out ({soldPlots}/{totalPlots})
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-100 font-medium text-slate-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/projects/${p.id}`} className="text-blue-600 hover:underline font-semibold text-xs">
                      View & Manage Plots →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
