import { PrismaClient } from "@/generated/control";

const globalForControl = globalThis as unknown as { controlPrisma?: PrismaClient };

export const controlPrisma =
  globalForControl.controlPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForControl.controlPrisma = controlPrisma;
}

export default controlPrisma;
