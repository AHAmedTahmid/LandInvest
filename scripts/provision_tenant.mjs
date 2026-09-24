import { Queue } from "bullmq";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const tenantId = process.argv[2];
const dbName = process.argv[3];
if (!tenantId || !dbName) {
  console.error("usage: node scripts/provision_tenant.mjs <tenantId> <dbName>");
  process.exit(1);
}

const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });
const q = new Queue("tenant-provisioning", { connection });
const job = await q.add("provision", { tenantId, dbName }, {
  attempts: 3,
  backoff: { type: "exponential", delay: 2000 },
  removeOnComplete: 100,
  removeOnFail: 500,
});
console.log(`queued provision job id=${job.id} tenant=${tenantId} db=${dbName}`);
await q.close();
connection.disconnect();
