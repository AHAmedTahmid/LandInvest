import mysql from "mysql2/promise";

const BASE = process.env.BASE_URL || "http://localhost:3000";
let pass = 0, fail = 0;
function check(name, ok, detail = "") {
  if (ok) pass++; else fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  --  ${detail}` : ""}`);
}

/* HTTP helpers (manual cookie jar, NextAuth v4) */
function applyCookies(jar, res) {
  const set = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of set) {
    const [pair] = c.split(";");
    const i = pair.indexOf("=");
    const k = pair.slice(0, i).trim();
    const v = pair.slice(i + 1).trim();
    if (!v || v === "deleted") jar.delete(k); else jar.set(k, v);
  }
}
const cookieHeader = (jar) => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

async function login(email, password) {
  const jar = new Map();
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  applyCookies(jar, csrfRes);
  const { csrfToken } = await csrfRes.json();
  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST", redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: cookieHeader(jar) },
    body: new URLSearchParams({ email, password, csrfToken, redirect: "false", json: "true" }),
  });
  applyCookies(jar, res);
  if (![...jar.keys()].some((k) => k.includes("session-token"))) throw new Error(`login failed for ${email}`);
  return { jar, cookie: cookieHeader(jar) };
}

async function call(sess, path, { method = "GET", json } = {}) {
  const headers = { cookie: sess.cookie };
  if (json !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, { method, headers, body: json !== undefined ? JSON.stringify(json) : undefined, redirect: "manual" });
  const text = await res.text();
  let parsed = null;
  try { parsed = JSON.parse(text); } catch {}
  return { status: res.status, text, json: parsed };
}

const EMAIL = "smoke@demo.com";
const ROLE_NAME = "Custom Auditor";
const created = { roleId: null, userId: null };

try {
  const owner = await login("owner@demo.com", "123456");
  const mp = await login("admin@demo.com", "123456");
  let smoke = null;

  // 1. create custom role
  let r = await call(owner, "/api/roles", { method: "POST", json: { name: ROLE_NAME, description: "smoke test role", permissionKeys: ["dashboard.view"] } });
  check("owner creates custom role", r.status === 200 && r.json?.id, `status=${r.status}`);
  created.roleId = r.json?.id ?? null;

  // 2. roles list includes it with count
  r = await call(owner, "/api/roles");
  const listed = Array.isArray(r.json) && r.json.find((x) => x.name === ROLE_NAME);
  check("GET /api/roles lists custom role (permCount=1)", !!listed && (listed.permCount === 1 || listed.permissions?.length === 1), `permCount=${listed?.permCount} perms=${listed?.permissions?.length}`);

  // 3. admin UI pages render for owner, blocked for MP
  r = await call(owner, "/settings/roles");
  check("owner sees /settings/roles", r.status === 200 && !r.text.includes("Forbidden"), `status=${r.status}`);
  r = await call(mp, "/settings/roles");
  check("MP blocked from /settings/roles", r.text.includes("Forbidden: roles.manage"), `status=${r.status}`);
  r = await call(owner, "/settings/users");
  check("owner sees /settings/users", r.status === 200 && !r.text.includes("Forbidden"), `status=${r.status}`);
  r = await call(mp, "/settings/users");
  check("MP blocked from /settings/users", r.text.includes("Forbidden: Super Admin only"), `status=${r.status}`);

  // 4. owner creates user with custom role
  r = await call(owner, "/api/users", { method: "POST", json: { email: EMAIL, fullName: "Smoke Tester", password: "smoke123", roleId: created.roleId } });
  check("owner direct-creates user with custom role", r.status === 200 && r.json?.id, `status=${r.status} err=${r.json?.error ?? ""}`);
  created.userId = r.json?.id ?? null;

  // 5. new user logs in, sees only granted permission
  smoke = await login(EMAIL, "smoke123");
  r = await call(smoke, "/api/me/permissions");
  const perms0 = r.json?.permissions ?? [];
  check("new user permissions == [dashboard.view]", perms0.length === 1 && perms0.includes("dashboard.view"), JSON.stringify(perms0));
  r = await call(smoke, "/api/treasury/contra");
  check("granted-no permission -> GET /api/treasury 403", r.status === 403, `status=${r.status}`);
  r = await call(smoke, "/dashboard");
  check("granted permission -> /dashboard200", r.status === 200 && !r.text.includes("Forbidden"), `status=${r.status}`);

  // 6. owner edits role; new permission propagates immediately (cache invalidated, well within 60s)
  r = await call(owner, "/api/roles/" + created.roleId, { method: "PATCH", json: { permissionKeys: ["dashboard.view", "treasury.view"] } });
  check("owner adds treasury.view to role", r.status === 200, `status=${r.status}`);
  r = await call(smoke, "/api/me/permissions");
  const perms1 = r.json?.permissions ?? [];
  check("permission edit propagates immediately", perms1.includes("treasury.view"), JSON.stringify(perms1));
  r = await call(smoke, "/api/treasury/contra");
  check("new permission -> GET /api/treasury 200", r.status === 200, `status=${r.status}`);

  // 7. safety rules
  const users = await call(owner, "/api/users");
  const ownerRow = (users.json?.users ?? []).find((u) => u.email === "owner@demo.com");
  r = await call(owner, "/api/users/" + ownerRow.id, { method: "PATCH", json: { isActive: false } });
  check("owner account cannot be deactivated", r.status === 403, `status=${r.status} err=${r.json?.error ?? ""}`);
  r = await call(owner, "/api/users/" + ownerRow.id, { method: "DELETE" });
  check("owner account cannot be deleted", r.status === 403, `status=${r.status}`);
  r = await call(mp, "/api/roles", { method: "POST", json: { name: "MP Escalation", permissionKeys: ["billing.manage"] } });
  check("MP cannot create roles (roles.manage)", r.status === 403, `status=${r.status}`);
  r = await call(mp, "/api/invites", { method: "POST", json: { email: "x@example.com", roleId: created.roleId } });
  check("MP cannot invite users (users.manage)", r.status === 403, `status=${r.status}`);
  const ownerRole = (await call(owner, "/api/roles")).json.find((x) => x.name === "Owner");
  r = await call(owner, "/api/roles/" + ownerRole.id, { method: "PATCH", json: { name: "NotOwner" } });
  check("system Owner role cannot be edited", r.status === 403, `status=${r.status}`);
  r = await call(owner, "/api/roles/" + created.roleId, { method: "DELETE" });
  check("role with assigned user cannot be deleted", r.status === 400, `status=${r.status} err=${r.json?.error ?? ""}`);
  r = await call(owner, "/api/users/" + created.userId, { method: "PATCH", json: { isActive: false } });
  check("deactivate smoke user", r.status === 200, `status=${r.status}`);
  r = await call(smoke, "/api/treasury/contra");
  check("deactivated user gets no permissions", r.status === 403, `status=${r.status}`);

  // 8. audit rows exist for role + user lifecycle
  const conn = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: "tenant_demo" });
  const [[{ c: roleAud }]] = await conn.query("SELECT COUNT(*) c FROM audit_log WHERE table_name = 'roles'");
  const [[{ c: userRoleAud }]] = await conn.query("SELECT COUNT(*) c FROM audit_log WHERE table_name IN ('user_roles','global_users') AND changed_by IS NOT NULL");
  await conn.end();
  check("audit_log has roles rows", roleAud >= 1, `rows=${roleAud}`);
  check("audit_log has user_roles/global_users rows with actor", userRoleAud >= 1, `rows=${userRoleAud}`);

  // 9. cleanup
  r = await call(owner, "/api/users/" + created.userId, { method: "DELETE" });
  check("cleanup: delete smoke user", r.status === 200, `status=${r.status}`);
  r = await call(owner, "/api/roles/" + created.roleId, { method: "DELETE" });
  check("cleanup: delete custom role", r.status === 200, `status=${r.status}`);
} catch (e) {
  check("smoke script completed", false, e.message);
} finally {
  console.log(`\n=== ${pass}/${pass + fail} rbac smoke checks passed ===`);
  process.exit(fail ? 1 : 0);
}
