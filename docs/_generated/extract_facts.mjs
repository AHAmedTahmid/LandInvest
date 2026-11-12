import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { execSync } from "node:child_process";
import { PERMISSIONS, ALL_KEYS } from "../../src/lib/permissions.ts";
import { DASHBOARD_TABS, WIDGET_REGISTRY } from "../../src/lib/dashboard/widgets.ts";
import { DEFAULT_ROLES } from "../../src/lib/seedRoles.ts";
import { REPORT_REGISTRY } from "../../src/lib/reports/registry.ts";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "docs", "_generated");
fs.mkdirSync(OUT_DIR, { recursive: true });

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else results.push(full);
  }
  return results;
}

async function introspectDatabase(dbName) {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "information_schema",
  });

  try {
    const [tables] = await conn.query(
      `SELECT TABLE_NAME, TABLE_TYPE, ENGINE, TABLE_COLLATION, TABLE_ROWS
       FROM TABLES
       WHERE TABLE_SCHEMA = ?
       ORDER BY TABLE_NAME`,
      [dbName]
    );

    const [columns] = await conn.query(
      `SELECT TABLE_NAME, COLUMN_NAME, ORDINAL_POSITION, COLUMN_DEFAULT, IS_NULLABLE,
              DATA_TYPE, COLUMN_TYPE, COLUMN_KEY, EXTRA, COLUMN_COMMENT
       FROM COLUMNS
       WHERE TABLE_SCHEMA = ?
       ORDER BY TABLE_NAME, ORDINAL_POSITION`,
      [dbName]
    );

    const [fks] = await conn.query(
      `SELECT kcu.TABLE_NAME, kcu.COLUMN_NAME, kcu.CONSTRAINT_NAME,
              kcu.REFERENCED_TABLE_NAME, kcu.REFERENCED_COLUMN_NAME,
              rc.UPDATE_RULE, rc.DELETE_RULE
       FROM KEY_COLUMN_USAGE kcu
       JOIN REFERENTIAL_CONSTRAINTS rc
         ON kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
        AND kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
       WHERE kcu.TABLE_SCHEMA = ?
         AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
       ORDER BY kcu.TABLE_NAME, kcu.COLUMN_NAME`,
      [dbName]
    );

    const [indexes] = await conn.query(
      `SELECT TABLE_NAME, INDEX_NAME, NON_UNIQUE, SEQ_IN_INDEX, COLUMN_NAME, INDEX_TYPE
       FROM STATISTICS
       WHERE TABLE_SCHEMA = ?
       ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX`,
      [dbName]
    );

    return {
      database: dbName,
      tableCount: tables.filter((t) => t.TABLE_TYPE === "BASE TABLE").length,
      viewCount: tables.filter((t) => t.TABLE_TYPE === "VIEW").length,
      fkCount: fks.length,
      uniqueIndexCount: new Set(indexes.map((i) => `${i.TABLE_NAME}.${i.INDEX_NAME}`)).size,
      tables,
      columns,
      foreignKeys: fks,
      indexes,
    };
  } finally {
    await conn.end();
  }
}

function parsePrismaModels(schemaPath) {
  if (!fs.existsSync(schemaPath)) return [];
  const src = fs.readFileSync(schemaPath, "utf8");
  const models = [];
  const regex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let m;
  while ((m = regex.exec(src))) {
    const modelName = m[1];
    const body = m[2];
    const mapMatch = body.match(/@@map\("([^"]+)"\)/);
    models.push({
      modelName,
      tableName: mapMatch ? mapMatch[1] : modelName,
    });
  }
  return models;
}

function extractRoutesAndActions() {
  const appDir = path.join(ROOT, "src", "app");
  const files = walk(appDir);
  const pages = [];
  const apis = [];

  for (const f of files) {
    const rel = path.relative(appDir, f).replace(/\\/g, "/");
    if (rel.endsWith("page.tsx")) {
      const route = "/" + rel.replace(/\/?page\.tsx$/, "");
      const content = fs.readFileSync(f, "utf8");
      const permMatches = [...content.matchAll(/can\([^,]+,\s*["']([^"']+)["']/g)].map((x) => x[1]);
      pages.push({ route: route === "/" ? "/" : route, file: `src/app/${rel}`, permissions: [...new Set(permMatches)] });
    } else if (rel.endsWith("route.ts")) {
      const route = "/" + rel.replace(/\/?route\.ts$/, "");
      const content = fs.readFileSync(f, "utf8");
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"].filter((m) =>
        new RegExp(`export\\s+(?:async\\s+)?function\\s+${m}\\b`).test(content)
      );
      const permMatches = [...content.matchAll(/can\([^,]+,\s*["']([^"']+)["']/g)].map((x) => x[1]);
      apis.push({ route, file: `src/app/${rel}`, methods, permissions: [...new Set(permMatches)] });
    }
  }

  const allSrc = walk(path.join(ROOT, "src"));
  const serverActions = [];
  for (const f of allSrc) {
    if (!f.endsWith(".ts") && !f.endsWith(".tsx")) continue;
    const content = fs.readFileSync(f, "utf8");
    if (content.includes('"use server"') || content.includes("'use server'")) {
      const fns = [...content.matchAll(/export\s+async\s+function\s+(\w+)/g)].map((x) => x[1]);
      const permMatches = [...content.matchAll(/can\([^,]+,\s*["']([^"']+)["']/g)].map((x) => x[1]);
      serverActions.push({
        file: path.relative(ROOT, f).replace(/\\/g, "/"),
        functions: fns,
        permissions: [...new Set(permMatches)],
      });
    }
  }

  return { pages, apis, serverActions };
}

function extractEnvVars() {
  const allFiles = walk(path.join(ROOT, "src")).concat(walk(path.join(ROOT, "scripts")));
  const envVars = new Set();
  for (const f of allFiles) {
    if (!/\.(ts|tsx|js|mjs)$/.test(f)) continue;
    const content = fs.readFileSync(f, "utf8");
    for (const m of content.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
      envVars.add(m[1]);
    }
  }
  return [...envVars].sort();
}

function extractDependencies() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const lockPath = path.join(ROOT, "package-lock.json");
  let lockPackages = {};
  if (fs.existsSync(lockPath)) {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    lockPackages = lock.packages || {};
  }

  const resolveExact = (name, declared) => {
    const entry = lockPackages[`node_modules/${name}`];
    return entry?.version || declared;
  };

  const deps = Object.entries(pkg.dependencies || {}).map(([name, range]) => ({
    name,
    declared: range,
    locked: resolveExact(name, range),
    type: "dependency",
  }));
  const devDeps = Object.entries(pkg.devDependencies || {}).map(([name, range]) => ({
    name,
    declared: range,
    locked: resolveExact(name, range),
    type: "devDependency",
  }));

  let nodeVersion = process.version;
  let npmVersion = "unknown";
  try {
    npmVersion = execSync("npm -v", { encoding: "utf8" }).trim();
  } catch {}

  return {
    name: pkg.name,
    version: pkg.version,
    nodeVersion,
    npmVersion,
    scripts: pkg.scripts,
    dependencies: deps,
    devDependencies: devDeps,
  };
}

function extractPermissions() {
  const perms = [];
  for (const g of PERMISSIONS) {
    for (const p of g.permissions) {
      perms.push({
        key: p.key,
        module: g.module,
        moduleEn: g.moduleEn,
        moduleBn: g.moduleBn,
        en: p.en,
        bn: p.bn,
        category: p.category || null,
      });
    }
  }
  return { totalKeys: ALL_KEYS.length, groups: PERMISSIONS.length, permissions: perms };
}

function extractReports() {
  return REPORT_REGISTRY;
}

function extractGitSummary() {
  try {
    const log = execSync('git log -n 40 --pretty=format:"%h|%ad|%s" --date=short', {
      encoding: "utf8",
      cwd: ROOT,
    });
    return log.split("\n").map((line) => {
      const [hash, date, ...msg] = line.split("|");
      return { hash, date, message: msg.join("|") };
    });
  } catch {
    return [];
  }
}

async function main() {
  console.log("Extracting LandInvest codebase and database facts...");

  const controlDb = await introspectDatabase("control_plane");
  const tenantDb = await introspectDatabase("tenant_demo");

  const controlPrisma = parsePrismaModels(path.join(ROOT, "prisma", "control", "schema.prisma"));
  const tenantPrisma = parsePrismaModels(path.join(ROOT, "prisma", "tenant", "schema.prisma"));

  const controlTableSet = new Set(controlDb.tables.map((t) => t.TABLE_NAME));
  const tenantTableSet = new Set(tenantDb.tables.map((t) => t.TABLE_NAME));

  const schemaDiff = {
    control: {
      inDbNotPrisma: [...controlTableSet].filter((t) => !controlPrisma.some((p) => p.tableName === t)),
      inPrismaNotDb: controlPrisma.filter((p) => !controlTableSet.has(p.tableName)).map((p) => p.tableName),
    },
    tenant: {
      inDbNotPrisma: [...tenantTableSet].filter((t) => !tenantPrisma.some((p) => p.tableName === t)),
      inPrismaNotDb: tenantPrisma.filter((p) => !tenantTableSet.has(p.tableName)).map((p) => p.tableName),
    },
  };

  const routes = extractRoutesAndActions();
  const envVars = extractEnvVars();
  const deps = extractDependencies();
  const permissions = extractPermissions();
  const reports = extractReports();
  const gitHistory = extractGitSummary();

  const summary = {
    generatedAt: new Date().toISOString(),
    databases: {
      control_plane: {
        tables: controlDb.tableCount,
        views: controlDb.viewCount,
        foreignKeys: controlDb.fkCount,
        indexes: controlDb.uniqueIndexCount,
      },
      tenant_demo: {
        tables: tenantDb.tableCount,
        views: tenantDb.viewCount,
        foreignKeys: tenantDb.fkCount,
        indexes: tenantDb.uniqueIndexCount,
      },
    },
    schemaDiff,
    counts: {
      pages: routes.pages.length,
      apiRoutes: routes.apis.length,
      serverActionFiles: routes.serverActions.length,
      permissions: permissions.totalKeys,
      permissionGroups: permissions.groups,
      dashboardTabs: DASHBOARD_TABS.length,
      dashboardWidgets: Array.isArray(WIDGET_REGISTRY) ? WIDGET_REGISTRY.length : Object.keys(WIDGET_REGISTRY).length,
      defaultRoles: DEFAULT_ROLES.length,
      reports: reports.length,
      envVars: envVars.length,
    },
  };

  fs.writeFileSync(path.join(OUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "db_control_plane.json"), JSON.stringify(controlDb, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "db_tenant.json"), JSON.stringify(tenantDb, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "routes_and_actions.json"), JSON.stringify(routes, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "env_vars.json"), JSON.stringify(envVars, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "dependencies.json"), JSON.stringify(deps, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "permissions.json"), JSON.stringify(permissions, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "dashboard.json"), JSON.stringify({ tabs: DASHBOARD_TABS, widgets: WIDGET_REGISTRY }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "default_roles.json"), JSON.stringify(DEFAULT_ROLES, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "reports.json"), JSON.stringify(reports, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "git_history.json"), JSON.stringify(gitHistory, null, 2));

  console.log("Extraction complete:", JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error("Extraction failed:", err);
  process.exit(1);
});
