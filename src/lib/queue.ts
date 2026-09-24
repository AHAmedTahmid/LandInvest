import { Queue } from "bullmq";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let connection: IORedis | null = null;
try {
  connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: false,
    enableReadyCheck: true,
    connectTimeout: 4000,
    retryStrategy: (times) => Math.min(times * 500, 2000),
  });
  connection.on("error", () => { /* surfaced by assertRedisAvailable */ });
} catch {
  connection = null;
}

export const tenantProvisioningQueue = connection
  ? new Queue("tenant-provisioning", { connection: connection as any })
  : (null as unknown as Queue);

/**
 * Fail fast with a human-readable message if Redis is unreachable.
 * Never let a silent catch hide a dead queue.
 */
export async function assertRedisAvailable(): Promise<void> {
  if (!connection) {
    throw new Error(`Redis is not configured (REDIS_URL=${REDIS_URL}). Start the native Redis service, then retry.`);
  }
  try {
    const pong = await connection.ping();
    if (pong !== "PONG") throw new Error(`unexpected reply '${pong}'`);
  } catch (e: any) {
    throw new Error(
      `Redis is not reachable at ${REDIS_URL}. Start the native service (e.g. redis-server or Memurai), then retry. Original: ${e.message}`
    );
  }
}

/** Enqueue provisioning; throws a readable error on failure. */
export async function enqueueProvisioning(data: { tenantId: string; dbName: string }): Promise<string> {
  await assertRedisAvailable();
  try {
    const job = await tenantProvisioningQueue.add("provision", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 500,
    });
    return job.id as string;
  } catch (e: any) {
    throw new Error(`Failed to queue tenant provisioning job: ${e.message}`);
  }
}
