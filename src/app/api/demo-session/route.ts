import { randomBytes } from "node:crypto";
import { VOICE_ERRORS, type VoiceErrorCode } from "@/app/a/[token]/voice-copy";
import { loadPage } from "@/lib/audit-page";
import { MACHINE_UA, validToken } from "@/lib/audit-validate";
import { list, putJSON } from "@/lib/blob-store";
import { capDay, capReached, countCaps, demoDayPath, demoDayPrefix, demoPath, demosPrefix, uaClass } from "@/lib/demo-caps";
import { allow, clientIp } from "@/lib/rate-limit";
import { sessionVariables } from "@/lib/voice-page";
import { mintSession, publicError } from "@/lib/voice-upstream";

/**
 * POST /api/demo-session  {token}
 *
 * Starts one voice demo call for a voice page. This is the only place a
 * session is ever minted, and it runs only when the visitor presses the
 * button: never on page load, never for a scanner.
 *
 * In order: the body is JSON from this site, the token has the right shape,
 * the caller is not a machine, the page exists, is a voice page and has not
 * expired, and the three caps (demo-caps.ts) have room. Then the three clock
 * keys are set for this instant in the business's timezone, the session is
 * asked for with the page token as its external identifier, and two markers
 * are written to the Blob store:
 *
 *   demos/<token>/<iso>-<rand>.json           {v, token, at, ua}: the pipeline
 *                                             texts Blake that a demo started
 *   demo-days/<YYYY-MM-DD>/<iso>-<rand>.json  {v, at}: the all-pages daily cap
 *
 * A good answer is exactly {url, token}: the short-lived pair the browser
 * SDK connects with. Nothing else about the session, the variables or the
 * vendor leaves the server.
 *
 * Errors are {ok: false, error, message}. 404 gone (bad token, unknown or
 * expired page, an audit page: all the same, as everywhere on /a/), 403
 * forbidden (a machine, or another site's page), 400 bad_request, 429
 * rate | page_day | page_life | busy, 402 balance, 503 unavailable. What the
 * vendor answered is logged here as a status number and never passed on.
 */

/** Seconds the platform lets this route run: the vendor's eight at most, plus the store reads and writes. */
export const maxDuration = 20;

/** One browser hammering one page: stops repeat presses before any storage or vendor call. */
const BURST_LIMIT = 10;
const BURST_WINDOW_MS = 10 * 60 * 1000;

/** Tokens with a mint in flight in this instance, so a double press cannot slip two sessions past the caps. */
const inFlight = new Set<string>();

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

function fail(code: VoiceErrorCode, status: number): Response {
  return Response.json({ ok: false, error: code, message: VOICE_ERRORS[code] }, { status, headers: HEADERS });
}

/** Every path under a prefix. More than one listing page is already far over any cap, so it is not followed. */
async function pathsUnder(prefix: string): Promise<string[]> {
  const res = await list(prefix, { limit: 1000 });
  return res.blobs.map((b) => b.pathname);
}

export async function POST(req: Request) {
  // JSON only: a plain form or a text post from another site cannot reach the mint.
  if (!(req.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return fail("bad_request", 400);
  }
  if ((req.headers.get("sec-fetch-site") ?? "").toLowerCase() === "cross-site") return fail("forbidden", 403);

  let token: unknown;
  try {
    token = (JSON.parse(await req.text()) as { token?: unknown } | null)?.token;
  } catch {
    return fail("bad_request", 400);
  }
  if (!validToken(token)) return fail("gone", 404);

  const userAgent = req.headers.get("user-agent") ?? "";
  if (!userAgent.trim() || MACHINE_UA.test(userAgent)) return fail("forbidden", 403);
  if (!allow(`demo|${clientIp(req.headers)}|${token}`, BURST_LIMIT, BURST_WINDOW_MS)) return fail("rate", 429);

  const loaded = await loadPage(token);
  if (!loaded || loaded.kind !== "voice") return fail("gone", 404);
  const page = loaded.page;

  if (inFlight.has(token)) return fail("rate", 429);
  inFlight.add(token);
  try {
    const now = new Date();

    let reached;
    try {
      const [pagePaths, dayPaths] = await Promise.all([
        pathsUnder(demosPrefix(token)),
        pathsUnder(demoDayPrefix(capDay(now))),
      ]);
      reached = capReached(countCaps(pagePaths, dayPaths, now));
    } catch (err) {
      // No count, no call: a session that cannot be counted cannot be capped.
      console.error("[demo-session] cap count failed", err instanceof Error ? err.message : err);
      return fail("unavailable", 503);
    }
    if (reached) return fail(reached, 429);

    const minted = await mintSession(sessionVariables(page, now), token);
    if (!minted.ok) {
      console.error("[demo-session] no session", minted.reason, minted.status ?? "no answer");
      const { status, code } = publicError(minted.reason);
      return fail(code, status);
    }

    const rand = randomBytes(16).toString("hex");
    const [marker, dayMarker] = await Promise.allSettled([
      putJSON(demoPath(token, now, rand), { v: 1, token, at: now.toISOString(), ua: uaClass(userAgent) }),
      putJSON(demoDayPath(now, rand), { v: 1, at: now.toISOString() }),
    ]);
    if (marker.status === "rejected") {
      // The session exists but is not on the books. It is not handed over (an unused one costs nothing and
      // expires by itself), so the page's caps can never be passed by a store that has stopped writing.
      console.error("[demo-session] marker write failed", marker.reason instanceof Error ? marker.reason.message : marker.reason);
      return fail("unavailable", 503);
    }
    if (dayMarker.status === "rejected") {
      console.error(
        "[demo-session] day marker write failed",
        dayMarker.reason instanceof Error ? dayMarker.reason.message : dayMarker.reason,
      );
    }

    return Response.json({ url: minted.url, token: minted.token }, { headers: HEADERS });
  } finally {
    inFlight.delete(token);
  }
}
