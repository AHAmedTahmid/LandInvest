import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import mysql from "mysql2/promise";
import { execSync } from "child_process";
import { controlPrisma } from "@/lib/control";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const MYSQL = { host: "localhost", user: "root", password: "", port: 3306 };

function die(msg: string): never {
  // Human-readable failure, never a raw connection stack trace
  console.error(`\n[worker] FATAL: ${msg}\n`);
  process.exit(1);
}

async function checkServices() {
  // MySQL reachable?
  try {
    const c = await mysql.createConnection({ ...MYSQL, connectTimeout: 4000 });
    await c.ping();
    await c.end();
  } catch (e: any) {
    die(`MySQL is not reachable on port 3306. Start it first (native service, e.g. 'net start MySQL84'), then retry. Original: ${e.code || e.message}`);
  }
  // Redis reachable?
  try {
    const r = new IORedis(REDIS_URL, { connectTimeout: 4000, maxRetriesPerRequest: 1, lazyConnect: true });
    await r.connect();
    const pong = await r.ping();
    await r.quit();
    if (pong !== "PONG") die(`Redis at ${REDIS_URL} responded '${pong}' instead of PONG.`);
    const v = await new IORedis(REDIS_URL, { lazyConnect: true }).info("server");
    const match = /redis_version:(\d+)\.(\d+)/.exec(v);
    if (match && (Number(match[1]) < 6)) {
      die(`Redis ${match[1]}.${match[2]} is too old for BullMQ (needs 6.2+, streams/XADD required). Use Memurai/redis-windows 6.2+.`);
    }
  } catch (e: any) {
    die(`Redis is not reachable at ${REDIS_URL}. Start it first (native service), then retry. Original: ${e.message}`);
  }
}

async function seedDefaultCategories(dbName: string) {
  // Idempotent default expense categories for a brand-new tenant
  const conn = await mysql.createConnection({ ...MYSQL, database: dbName });
  await conn.query(`
    CREATE TABLE IF NOT EXISTS default_categories (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      kind VARCHAR(20) NOT NULL,
      UNIQUE KEY uq_cat_name (name)
    )`);
  const cats = [
    ["Land & Bayna", "LAND"],
    ["Registration / Deed", "LEGAL"],
    ["Mutation & Tax", "LEGAL"],
    ["Development / Labour", "DEV"],
    ["Office & Admin", "OVERHEAD"],
    ["Marketing", "OVERHEAD"],
  ];
  const { randomUUID } = await import("crypto");
  for (const [name, kind] of cats) {
    await conn.query("INSERT IGNORE INTO default_categories (id,name,kind) VALUES (?,?,?)", [randomUUID(), name, kind]);
  }
  await conn.end();
  console.log(`[worker] seeded ${cats.length} default categories`);
}

async function main() {
  await checkServices();
  console.log("[worker] MySQL + Redis confirmed reachable");

  const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: false });
  connection.on("error", () => { /* handled below via explicit checks */ });

  const worker = new Worker(
    "tenant-provisioning",
    async (job) => {
      const { tenantId, dbName } = job.data;
      console.log(`[worker] provisioning ${dbName} (${tenantId})`);
      const conn = await mysql.createConnection(MYSQL);
      try {
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await conn.end();
        const url = `mysql://root:@localhost:3306/${dbName}`;
        execSync(`npx prisma db push --schema=prisma/tenant/schema.prisma --skip-generate`, {
          env: { ...process.env, DATABASE_URL_TENANT: url },
          stdio: "inherit",
        });
        await seedDefaultCategories(dbName);
        await (controlPrisma as any).tenant.update({ where: { id: tenantId }, data: { status: "active" } });
        console.log(`[worker] ${dbName} active`);
        return { dbName, status: "active" };
      } catch (e: any) {
        // surface failure on the job instead of silently dropping
        throw new Error(`Provisioning failed for ${dbName}: ${e.message}`);
      }
    },
    { connection: connection as any, concurrency: 1 }
  );

  const events = new QueueEvents("tenant-provisioning", { connection: connection as any });
  events.on("failed", ({ jobId, failedReason }) => console.error(`[worker] job ${jobId} FAILED: ${failedReason}`));

  worker.on("ready", () => console.log("[worker] listening on queue 'tenant-provisioning'"));

  process.on("SIGINT", async () => {
    await worker.close();
    await events.close();
    await connection.quit();
    process.exit(0);
  });
}

main().catch((e) => die(e.message));
