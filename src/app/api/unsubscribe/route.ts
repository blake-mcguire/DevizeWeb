import { randomBytes } from "node:crypto";
import { optoutPageState } from "@/lib/audit-page";
import { MACHINE_UA, validToken } from "@/lib/audit-validate";
import { list, putJSON } from "@/lib/blob-store";
import { uaClass } from "@/lib/demo-caps";
import { allow, clientIp } from "@/lib/rate-limit";
import { optoutPath, optoutPrefix } from "@/lib/voice-link";

/**
 * POST /api/unsubscribe  {token}
 *
 * The opt-out page's button (/u/<token>, voice build contract 8.5,
 * 2026-11-16). This press, and nothing else, records that the address the
 * voice email went to wants no more email:
 *
 *   optouts/<token>/<iso>-<rand>.json  {v: 1, token, at, ua}
 *
 * ua is the coarse device class (demo-caps.uaClass), never the user agent
 * itself. The pipeline reads optouts/ on every pass, claims each file once,
 * suppresses the address as a "stop" reply is suppressed, and stops its
 * sequences. Nothing is texted to Blake.
 *
 * In order: the body is JSON from this site (a form post or another site's
 * page cannot reach it), the caller is not a machine (a mail scanner opening
 * every link must never opt anyone out), the body is small, the token has the
 * right shape, and audits/<token>/page.json is a voice page, EXPIRED OR NOT:
 * expiry never blocks an opt-out. Pressing again is harmless: when the token
 * already has an opt-out the answer is the same ok and nothing more is
 * written (SKIP_REPEAT); a listing that fails is no reason to lose the
 * press, so the file is then written anyway.
 *
 * Answers, never echoing the token or anything from the store:
 *   200 {ok: true}
 *   400 {ok: false, error: "bad_request" | "bad_token"}
 *   403 {ok: false, error: "forbidden"}      a machine, or another site's page
 *   404 {ok: false, error: "gone"}           no voice page for the token
 *   413 {ok: false, error: "too_large"}
 *   429 {ok: false, error: "rate"}
 *   503 {ok: false, error: "unavailable"}    the store could not be read or written
 * Any method but POST is 405, as on every route here.
 */

/** A token in a JSON object is well under a hundred bytes; anything far past that is not the page's button. */
const MAX_BODY_BYTES = 4096;
/** One browser pressing one page over and over: refused after this many presses in the window. */
const BURST_LIMIT = 10;
const BURST_WINDOW_MS = 10 * 60 * 1000;
/** A token that already has an opt-out file is answered ok without writing another (engineering default, 2026-11-16). */
const SKIP_REPEAT = true;

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

type Code = "bad_request" | "bad_token" | "forbidden" | "gone" | "too_large" | "rate" | "unavailable";

function fail(error: Code, status: number): Response {
  return Response.json({ ok: false, error }, { status, headers: HEADERS });
}
const done = () => Response.json({ ok: true }, { headers: HEADERS });

/** True when the token already has an opt-out file. False also when the store cannot say. */
async function alreadyOptedOut(token: string): Promise<boolean> {
  try {
    return (await list(optoutPrefix(token), { limit: 1 })).blobs.length > 0;
  } catch (err) {
    console.error("[unsubscribe] listing failed, writing anyway", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function POST(req: Request) {
  // JSON only: a plain form or a text post from another site cannot reach it.
  if (!(req.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return fail("bad_request", 400);
  }
  if ((req.headers.get("sec-fetch-site") ?? "").toLowerCase() === "cross-site") return fail("forbidden", 403);
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!userAgent.trim() || MACHINE_UA.test(userAgent)) return fail("forbidden", 403);

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return fail("too_large", 413);
  let token: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return fail("too_large", 413);
    token = (JSON.parse(text) as { token?: unknown } | null)?.token;
  } catch {
    return fail("bad_request", 400);
  }
  if (!validToken(token)) return fail("bad_token", 400);
  if (!allow(`unsub|${clientIp(req.headers)}|${token}`, BURST_LIMIT, BURST_WINDOW_MS)) return fail("rate", 429);

  const state = await optoutPageState(token);
  if (state === "error") return fail("unavailable", 503);
  if (state === "no") return fail("gone", 404);

  if (SKIP_REPEAT && (await alreadyOptedOut(token))) return done();

  const now = new Date();
  try {
    await putJSON(optoutPath(token, now, randomBytes(16).toString("hex")), {
      v: 1,
      token,
      at: now.toISOString(),
      ua: uaClass(userAgent),
    });
  } catch (err) {
    console.error("[unsubscribe] write failed", err instanceof Error ? err.message : err);
    return fail("unavailable", 503);
  }
  console.log("[unsubscribe] recorded");
  return done();
}
