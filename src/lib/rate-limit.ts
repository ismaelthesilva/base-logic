/**
 * In-memory sliding-window rate limiter.
 *
 * Works correctly in a single-process server (development, Docker, etc.).
 * On multi-instance serverless deployments (Vercel) each worker has its own
 * store, so the effective limit is (limit × worker count).  For production
 * multi-instance enforcement, replace with an Upstash Redis limiter:
 *   npm i @upstash/ratelimit @upstash/redis
 *   https://github.com/upstash/ratelimit-js
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();
let lastCleanup = Date.now();

export function checkRateLimit(
  key: string,
  opts: { limit?: number; windowMs?: number } = {}
): boolean {
  const { limit = 10, windowMs = 60_000 } = opts;
  const now = Date.now();

  // Lazy cleanup — prevent unbounded Map growth
  if (now - lastCleanup > 60_000) {
    for (const [k, e] of store) {
      if (now >= e.resetAt) store.delete(k);
    }
    lastCleanup = now;
  }

  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
