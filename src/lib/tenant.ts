import { PrismaClient } from "@/generated/tenant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";

type TenantInfo = { id: string; dbName: string; dbHost: string; dbUser: string; dbPasswordEncrypted: string };

const globalForTenant = globalThis as unknown as { tenantClients?: Map<string, PrismaClient> };
if (!globalForTenant.tenantClients) globalForTenant.tenantClients = new Map();

export function getTenantClient(tenant: TenantInfo): PrismaClient {
  const cached = globalForTenant.tenantClients!.get(tenant.id);
  if (cached) return cached;
  const url = `mysql://${tenant.dbUser}:@localhost:3306/${tenant.dbName}`;
  const client = new PrismaClient({ datasources: { db: { url } } } as any);
  globalForTenant.tenantClients!.set(tenant.id, client);
  return client;
}

export async function getTenantClientFromSession(): Promise<PrismaClient> {
  const session = await getServerSession(authOptions);
  const tenantId = (session?.user as any)?.tenantId;
  if (!tenantId || !session) throw new Error("No session");
  const tenant = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new Error("Tenant not found");
  return getTenantClient(tenant);
}
