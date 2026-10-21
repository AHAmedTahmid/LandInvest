import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory sliding-window limiter for credential login attempts.
// Single-instance deployment: the map lives in this process. For multi-instance
// deployments swap this for a Redis-backed limiter (redis is already a dependency).
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = Number(process.env.AUTH_RATE_LIMIT_MAX || 20);
const attempts = new Map<string, { count: number; resetAt: number }>();

// opportunistic cleanup so the map cannot grow unbounded
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [ip, rec] of attempts) if (now > rec.resetAt) attempts.delete(ip);
}

export function middleware(request: NextRequest) {
  if (request.method !== "POST") return NextResponse.next();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  const now = Date.now();
  sweep(now);
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }
  rec.count += 1;
  if (rec.count > MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/callback/credentials", "/api/auth/signin/:path*"],
};
