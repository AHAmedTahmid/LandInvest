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
  const projects = await prisma.landProject.findMany({ orderBy: { createdAt: "desc" } });

  async function createProject(formData: FormData) {
    "use server";
    const s = await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    if (!(await (await import("@/lib/rbac")).can(s, "projects.create"))) throw new Error("Forbidden: projects.create");
    const prisma2: any = await getTenantClientFromSession();
    const data = {
      id: randomUUID(),
      projectName: formData.get("projectName") as string,
      mouza: formData.get("mouza") as string,
      jlNumber: (formData.get("jlNumber") as string) || null,
      dagNumbers: formData.get("dagNumbers") as string,
      khatianNumbers: formData.get("khatianNumbers") as string,
      totalAreaShotok: parseFloat(formData.get("totalAreaShotok") as string) || 0,
      purchasePrice: parseFloat(formData.get("purchasePrice") as string) || 0,
      baynaAmount: parseFloat(formData.get("baynaAmount") as string) || 0,
      registrationCost: parseFloat(formData.get("registrationCost") as string) || 0,
      mutationTaxCost: parseFloat(formData.get("mutationTaxCost") as string) || 0,
      status: (await (await import("@/lib/rbac")).can(s, "projects.create")) ? (formData.get("status") as string) || "UNDER_BAYNA" : "DRAFT",
    };
    const { writeAudit } = await import("@/lib/tenantRules");
    await prisma2.$transaction(async (tx: any) => {
      const pr = await tx.landProject.create({ data });
      await writeAudit(tx, "land_projects", pr.id, "CREATE", (s!.user as any).id, null, pr);
    });
    revalidatePath("/projects");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Land Projects {!canCreate && "(View only)"}</h1>
      {canCreate && (
        <form action={createProject} className="bg-white p-4 rounded-xl shadow border grid grid-cols-1 md:grid-cols-3 gap-3">
          <input name="projectName" placeholder="Project Name" required className="border rounded px-3 py-2"/>
          <input name="mouza" placeholder="Mouza" required className="border rounded px-3 py-2"/>
          <input name="jlNumber" placeholder="JL Number" className="border rounded px-3 py-2"/>
          <input name="dagNumbers" placeholder="DAG Numbers" required className="border rounded px-3 py-2"/>
          <input name="khatianNumbers" placeholder="Khatian Numbers" required className="border rounded px-3 py-2"/>
          <input name="totalAreaShotok" placeholder="Area Shotok" type="number" step="0.01" required className="border rounded px-3 py-2"/>
          <input name="purchasePrice" placeholder="Purchase Price" type="number" step="0.01" required className="border rounded px-3 py-2"/>
          <input name="baynaAmount" placeholder="Bayna Amount" type="number" step="0.01" className="border rounded px-3 py-2"/>
          <input name="registrationCost" placeholder="Registration Cost" type="number" step="0.01" className="border rounded px-3 py-2"/>
          <input name="mutationTaxCost" placeholder="Mutation Tax Cost" type="number" step="0.01" className="border rounded px-3 py-2"/>
          <select name="status" className="border rounded px-3 py-2"><option>UNDER_BAYNA</option><option>REGISTERED</option><option>MUTATED</option><option>READY_FOR_SALE</option></select>
          <button className="bg-blue-600 text-white rounded px-4 py-2">Create Project</button>
        </form>
      )}
      <table className="w-full text-sm bg-white rounded-xl shadow border">
        <thead><tr className="text-left border-b"><th className="p-2">Name</th><th>Mouza</th><th>Area</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody>{projects.map((p:any)=><tr key={p.id} className="border-b"><td className="p-2">{p.projectName}</td><td>{p.mouza}</td><td>{toNum(p.totalAreaShotok).toString()}</td><td>{formatBDT(toNum(p.purchasePrice))}</td><td>{p.status}</td><td><Link href={`/projects/${p.id}`} className="text-blue-600 underline">View</Link></td></tr>)}</tbody>
      </table>
    </div>
  );
}
