import type { NextRequest } from "next/server";
import { loadAuditPage } from "@/lib/audit-page";
import { MACHINE_UA, validToken } from "@/lib/audit-validate";
import { isoCompact, putJSON } from "@/lib/blob-store";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * POST /api/audit-view  {token}
 *
 * The page's once-per-session beacon. Writes views/<iso>-<token>.json for
 * the pipeline. Always answers 204, whatever happened, so it says nothing
 * about which tokens exist. Skips machine user agents (mail scanners,
 * previews, headless browsers) and unknown or expired tokens.
 */

const NO_CONTENT = () => new Response(null, { status: 204 });

export async function POST(req: NextRequest) {
  let token: unknown;
  try {
    // sendBeacon posts text/plain or application/json; read either.
    token = (JSON.parse(await req.text()) as { token?: unknown })?.token;
  } catch {
    return NO_CONTENT();
  }
  if (!validToken(token)) return NO_CONTENT();
  if (MACHINE_UA.test(req.headers.get("user-agent") ?? "")) return NO_CONTENT();
  if (!allow(`view|${clientIp(req.headers)}|${token}`, 3)) return NO_CONTENT();

  const page = await loadAuditPage(token);
  if (!page) return NO_CONTENT();

  const now = new Date();
  try {
    await putJSON(
      `views/${isoCompact(now)}-${token}.json`,
      { v: 1, token, viewed_at: now.toISOString() },
      { allowOverwrite: true },
    );
  } catch (err) {
    console.error("[audit-view] write failed", err instanceof Error ? err.message : err);
  }
  return NO_CONTENT();
}
