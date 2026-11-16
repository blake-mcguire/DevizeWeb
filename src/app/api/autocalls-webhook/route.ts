import { createHash, timingSafeEqual } from "node:crypto";
import { validToken } from "@/lib/audit-validate";
import { list, putJSON, stat } from "@/lib/blob-store";
import { CALLS_PREFIX, CALL_ID, callPath } from "@/lib/demo-caps";
import { assistantUuid } from "@/lib/voice-upstream";

/**
 * POST /api/autocalls-webhook?k=<secret>
 *
 * The voice vendor's post-call webhook for demo calls. It relays one finished
 * call into the Blob store, where the pipeline on Blake's Mac reads it (a
 * consult request on the demo is a lead for him):
 *
 *   calls/<iso>-<call id>.json
 *
 * <iso> is the call's own start time (created_at, else finished_at) in UTC,
 * so a repeat of the same call lands on the same name and is seen as a
 * repeat. The vendor retries for about eight minutes and a call can be
 * resent by hand; each id is stored once.
 *
 * The vendor signs nothing, so the secret travels in the URL and is compared
 * in constant time with AUTOCALLS_WEBHOOK_SECRET. No secret on our side, no
 * secret in the URL or the wrong one all get the same plain 404: the route
 * does not say it exists.
 *
 * Only a demo call of our own assistant is kept (assistant_id is
 * AUTOCALLS_ASSISTANT_UUID and input_variables.demo_mode is "yes", the same
 * two tests the pipeline applies). Anything else is answered 200 and dropped,
 * so a real customer's call can never land in the store, which is public by
 * path. For the same reason the transcript is never stored: only the fields
 * the pipeline reads.
 *
 * Answers: 200 {ok, stored: true} | {ok, stored: false, duplicate: true} |
 * {ok, stored: false, ignored: true}; 400 for a body that is not a call; 413
 * for one that is too large; 500 when the store refuses (the vendor then
 * retries); 404 as above.
 */

/** Shorter than this is not a secret; the route stays shut. */
const SECRET_MIN_CHARS = 16;
/** A seven-minute call with its transcript is tens of kilobytes. */
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_KEYS = 60;
const MAX_VALUE_CHARS = 2000;
/** Top-level fields kept as they are (scalars only). */
const KEPT = [
  "type",
  "assistant_id",
  "status",
  "ended_by",
  "duration",
  "created_at",
  "finished_at",
  "customer_phone",
] as const;

/** Ids stored by this instance, so a quick retry is answered without asking the store. */
const seen = new Set<string>();
const SEEN_MAX = 500;

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
const notFound = () => new Response("Not found", { status: 404, headers: HEADERS });
const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: HEADERS });

function secretMatches(given: string): boolean {
  const secret = process.env.AUTOCALLS_WEBHOOK_SECRET?.trim() ?? "";
  if (secret.length < SECRET_MIN_CHARS || !given) return false;
  // Hashing first makes both sides the same length, which timingSafeEqual needs.
  const a = createHash("sha256").update(secret).digest();
  const b = createHash("sha256").update(given).digest();
  return timingSafeEqual(a, b);
}

type Scalar = string | number | boolean | null;

/** The scalar entries of an object, strings clipped; nested values (a transcript, a lead record) are left behind. */
function scalars(raw: unknown): Record<string, Scalar> {
  const out: Record<string, Scalar> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [key, value] of Object.entries(raw)) {
    if (Object.keys(out).length >= MAX_KEYS) break;
    if (value === null || typeof value === "number" || typeof value === "boolean") out[key] = value;
    else if (typeof value === "string") out[key] = value.slice(0, MAX_VALUE_CHARS);
  }
  return out;
}

function when(x: unknown): Date | null {
  if (typeof x !== "string" || !x.trim()) return null;
  const at = Date.parse(x.trim());
  return Number.isFinite(at) ? new Date(at) : null;
}

/** Whether calls/ already holds this id under another time (only asked when the call carries no time of its own). */
async function storedUnderAnotherName(id: string): Promise<boolean> {
  const suffix = `-${id}.json`;
  let cursor: string | undefined;
  for (let page = 0; page < 20; page++) {
    const res = await list(`${CALLS_PREFIX}/`, { limit: 1000, cursor });
    if (res.blobs.some((b) => b.pathname.endsWith(suffix))) return true;
    if (!res.hasMore || !res.cursor) return false;
    cursor = res.cursor;
  }
  return false;
}

export async function POST(req: Request) {
  if (!secretMatches(new URL(req.url).searchParams.get("k") ?? "")) return notFound();

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);
  let payload: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    payload = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const id = typeof payload.id === "number" || typeof payload.id === "string" ? String(payload.id).trim() : "";
  if (!CALL_ID.test(id)) return json({ ok: false, error: "bad_request" }, 400);

  const input = scalars(payload.input_variables);
  const ours = assistantUuid();
  const sameAssistant = !!ours && typeof payload.assistant_id === "string" && payload.assistant_id.trim().toLowerCase() === ours;
  if (!sameAssistant || input.demo_mode !== "yes") {
    console.log("[voice-webhook] ignored", id, sameAssistant ? "not a demo call" : "another assistant");
    return json({ ok: true, stored: false, ignored: true });
  }

  if (seen.has(id)) return json({ ok: true, stored: false, duplicate: true });

  const now = new Date();
  const callTime = when(payload.created_at) ?? when(payload.finished_at);
  const pathname = callPath(callTime ?? now, id);
  const top: Record<string, Scalar> = {};
  for (const key of KEPT) {
    const value = payload[key];
    if (value === null || typeof value === "number" || typeof value === "boolean") top[key] = value;
    else if (typeof value === "string") top[key] = value.slice(0, MAX_VALUE_CHARS);
  }

  try {
    const already = callTime ? !!(await stat(pathname)) : await storedUnderAnotherName(id);
    if (already) {
      remember(id);
      return json({ ok: true, stored: false, duplicate: true });
    }
    await putJSON(pathname, {
      v: 1,
      id,
      received_at: now.toISOString(),
      ...top,
      lead_token: validToken(input.lead_token) ? input.lead_token : null,
      input_variables: input,
      extracted_variables: scalars(payload.extracted_variables),
    });
  } catch (err) {
    console.error("[voice-webhook] write failed", id, err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }
  remember(id);
  console.log("[voice-webhook] stored", id);
  return json({ ok: true, stored: true });
}

function remember(id: string) {
  seen.add(id);
  if (seen.size > SEEN_MAX) {
    // Drop the oldest (a Set keeps insertion order).
    for (const old of seen) {
      seen.delete(old);
      if (seen.size <= SEEN_MAX / 2) break;
    }
  }
}
