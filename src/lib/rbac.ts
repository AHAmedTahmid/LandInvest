import { controlPrisma } from "@/lib/control";
import { getTenantClient } from "@/lib/tenant";
import { ALL_KEYS, isValidKey, type PermissionKey } from "@/lib/permissions";

// cache per tenant+user, 60s TTL
type CacheEntry = { perms: Set<string>; expires: number };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 60_000;

function cacheKey(tenantId: string, userId: string) { return `${tenantId}:${userId}`; }

export function invalidateUserCache(tenantId: string, userId: string) {
  cache.delete(cacheKey(tenantId, userId));
}
export function invalidateTenantCache(tenantId: string) {
  for (const k of [...cache.keys()]) if (k.startsWith(`${tenantId}:`)) cache.delete(k);
}
export function invalidateRoleCache(tenantId: string, roleId: string) {
  // we don't track role->users mapping in cache, so invalidate whole tenant
  // callers should also invalidate specific users if known
  invalidateTenantCache(tenantId);
}

type SessionLike = { user?: any; } | { userId?: string; tenantId?: string; isOwner?: boolean } | any;

function extractIds(session: SessionLike): { userId: string; tenantId: string; isOwner: boolean } | null {
  // support NextAuth session shape and plain object
  const u = session?.user ?? session;
  const userId = u?.id ?? u?.userId ?? u?.user_id ?? null;
  const tenantId = u?.tenantId ?? u?.tenant_id ?? null;
  const isOwner = !!(u?.isOwner ?? u?.is_owner ?? false);
  if (!userId || !tenantId) return null;
  return { userId: String(userId), tenantId: String(tenantId), isOwner };
}

async function loadPermissions(tenantId: string, userId: string, isOwner: boolean): Promise<Set<string>> {
  if (isOwner) return new Set(ALL_KEYS);

  const key = cacheKey(tenantId, userId);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.perms;

  // check control plane isActive - deactivated users have no perms
  const gu = await (controlPrisma as any).globalUser.findUnique({ where: { id: userId }, select: { isActive: true, tenantId: true } });
  if (!gu || gu.isActive === false || String(gu.tenantId) !== String(tenantId)) {
    const empty = new Set<string>();
    cache.set(key, { perms: empty, expires: Date.now() + TTL_MS });
    return empty;
  }

  // load tenant role
  const tenant = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  if (!tenant?.dbName) {
    const empty = new Set<string>();
    cache.set(key, { perms: empty, expires: Date.now() + TTL_MS });
    return empty;
  }
  const tPrisma: any = getTenantClient(tenant as any);
  // user_roles -> role -> role_permissions
  const ur = await tPrisma.userRole.findUnique({ where: { userId } });
  if (!ur) {
    const empty = new Set<string>();
    cache.set(key, { perms: empty, expires: Date.now() + TTL_MS });
    return empty;
  }
  const role = await tPrisma.role.findUnique({ where: { id: ur.roleId } });
  if (!role) {
    const empty = new Set<string>();
    cache.set(key, { perms: empty, expires: Date.now() + TTL_MS });
    return empty;
  }
  if (role.isSystem) {
    const all = new Set(ALL_KEYS);
    cache.set(key, { perms: all, expires: Date.now() + TTL_MS });
    return all;
  }
  const perms = await tPrisma.rolePermission.findMany({ where: { roleId: role.id } });
  const set = new Set<string>(perms.map((p: any) => p.permissionKey));
  cache.set(key, { perms: set, expires: Date.now() + TTL_MS });
  return set;
}

export async function can(session: SessionLike, permission: PermissionKey): Promise<boolean> {
  if (!isValidKey(permission)) return false;
  const ids = extractIds(session);
  if (!ids) return false;
  const perms = await loadPermissions(ids.tenantId, ids.userId, ids.isOwner);
  return perms.has(permission);
}

export async function canAny(session: SessionLike, perms: PermissionKey[]): Promise<boolean> {
  for (const p of perms) if (await can(session, p)) return true;
  return false;
}

export async function assertCan(session: SessionLike, permission: PermissionKey): Promise<void> {
  if (!(await can(session, permission))) throw new Error(`Forbidden: ${permission}`);
}

export async function getUserPermissions(session: SessionLike): Promise<string[]> {
  const ids = extractIds(session);
  if (!ids) return [];
  const perms = await loadPermissions(ids.tenantId, ids.userId, ids.isOwner);
  return [...perms];
}

// keep legacy helper for gradual migration - maps old Feature to new keys
export function legacyCan(role: string, feature: string): boolean { return false; }
