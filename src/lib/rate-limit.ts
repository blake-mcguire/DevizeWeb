import "server-only";

/**
 * A naive sliding-window limiter held in memory. On Vercel each warm
 * function instance keeps its own window, so this stops a stuck button or a
 * casual script, not a determined attacker. That is all the audit form needs:
 * the token is unguessable, so nobody can reach the form without a link.
 */

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

/** Records one hit for `key`. Returns false when the key is over `limit` within `windowMs`. */
export function allow(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) {
    // Drop the oldest keys (Map keeps insertion order). Cheap and good enough.
    for (const k of hits.keys()) {
      hits.delete(k);
      if (hits.size <= MAX_KEYS / 2) break;
    }
  }
  return true;
}

/** The caller's IP as Vercel reports it, or "unknown". */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim() || "unknown";
  return headers.get("x-real-ip")?.trim() || "unknown";
}
