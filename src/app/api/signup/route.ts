import { NextRequest, NextResponse } from "next/server";
import { controlPrisma } from "@/lib/control";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { companyName, fullName, email, password } = await req.json();
  if (!companyName || !fullName || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const tenantId = randomUUID();
  const dbName = `tenant_${tenantId.replace(/-/g, "")}`;

  // 1) Fail fast BEFORE creating anything if the queue is down.
  let enqueue: (d: { tenantId: string; dbName: string }) => Promise<string> = () =>
    Promise.reject(new Error("queue not initialised"));
  try {
    const q = await import("@/lib/queue");
    await q.assertRedisAvailable();
    enqueue = q.enqueueProvisioning;
  } catch (e: any) {
    return NextResponse.json(
      { error: `Cannot provision new tenant: ${e.message}` },
      { status: 503 }
    );
  }

  // 2) Create control-plane rows
  const createdTenantIds: string[] = [];
  try {
    let plan = await (controlPrisma as any).plan.findFirst();
    if (!plan)
      plan = await (controlPrisma as any).plan.create({
        data: { name: "Trial", priceMonthly: 0, maxUsers: 5, maxProjects: 10 },
      });
    const tenant = await (controlPrisma as any).tenant.create({
      data: { id: tenantId, companyName, dbHost: "localhost", dbName, dbUser: "root", dbPasswordEncrypted: "", status: "trial" },
    });
    createdTenantIds.push(tenant.id);
    await (controlPrisma as any).subscription.create({ data: { tenantId: tenant.id, planId: plan.id, billingCycle: "monthly" } });
    const hash = await bcrypt.hash(password, 10);
    await (controlPrisma as any).globalUser.create({
      data: { tenantId: tenant.id, fullName, email, passwordHash: hash, role: "super_admin" },
    });

    // 3) Enqueue; if this fails, roll back so we never claim 'queued' falsely
    let jobId: string;
    try {
      jobId = await enqueue({ tenantId: tenant.id, dbName });
    } catch (e: any) {
      await (controlPrisma as any).tenant.delete({ where: { id: tenant.id } }).catch(() => {});
      return NextResponse.json({ error: e.message }, { status: 503 });
    }

    return NextResponse.json({ message: "Tenant created, provisioning queued", tenantId, dbName, jobId });
  } catch (e: any) {
    await Promise.all(createdTenantIds.map((id) => (controlPrisma as any).tenant.delete({ where: { id } }).catch(() => {})));
    return NextResponse.json({ error: `Tenant creation failed: ${e.message}` }, { status: 500 });
  }
}
