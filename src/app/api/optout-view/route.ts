import { randomBytes } from "node:crypto";
import { optoutPageState } from "@/lib/audit-page";
import { MACHINE_UA, validToken } from "@/lib/audit-validate";
import { putJSON } from "@/lib/blob-store";
import { uaClass } from "@/lib/demo-caps";
import { allow, clientIp } from "@/lib/rate-limit";
import { optoutViewPath } from "@/lib/voice-link";

/**
 * POST /api/optout-view  {token}
 *
 * The opt-out page's once-per-session beacon (/u/<token>, voice build
 * contract 8.5, 2026-11-16), the same beacon the demo page sends to
 * /api/audit-view. Writes, for the pipeline's --status count:
 *
 *   optout-views/<token>/<iso>-<rand>.json  {v: 1, token, at, ua}
 *
 * ua is the coarse device class (demo-caps.uaClass). A visit opts nobody out
 * and is never texted. Always answers 204, whatever happened, so it says
 * nothing about which tokens exist. Skips machine user agents (and a request
 * with none at all), unknown tokens and tokens whose page is not a voice page;
 * an expired voice page is still counted, as its opt-out still works.
 */

/** The beacon's body is a token in a JSON object; anything far past that is not the beacon. */
const MAX_BODY_BYTES = 4096;
/** Visits one browser may record for one page in the window (the same three /api/audit-view allows). */
const VIEW_LIMIT = 3;

const NO_CONTENT = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return NO_CONTENT();
  let token: unknown;
  try {
    // sendBeacon posts text/plain or application/json; read either.
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return NO_CONTENT();
    token = (JSON.parse(text) as { token?: unknown } | null)?.token;
  } catch {
    return NO_CONTENT();
  }
  if (!validToken(token)) return NO_CONTENT();
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!userAgent.trim() || MACHINE_UA.test(userAgent)) return NO_CONTENT();
  if (!allow(`optview|${clientIp(req.headers)}|${token}`, VIEW_LIMIT)) return NO_CONTENT();

  if ((await optoutPageState(token)) !== "yes") return NO_CONTENT();

  const now = new Date();
  try {
    await putJSON(optoutViewPath(token, now, randomBytes(16).toString("hex")), {
      v: 1,
      token,
      at: now.toISOString(),
      ua: uaClass(userAgent),
    });
  } catch (err) {
    console.error("[optout-view] write failed", err instanceof Error ? err.message : err);
  }
  return NO_CONTENT();
}
