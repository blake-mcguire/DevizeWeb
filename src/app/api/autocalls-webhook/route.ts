import { createHash, timingSafeEqual } from "node:crypto";
import { validToken } from "@/lib/audit-validate";
import { getJSON, list, putJSON, stat } from "@/lib/blob-store";
import { callTag } from "@/lib/call-tag";
import { CALLS_PREFIX, CALL_ID, callPath, isCallFile } from "@/lib/demo-caps";
import { assistantUuid } from "@/lib/voice-upstream";

/**
 * POST /api/autocalls-webhook?k=<secret>
 *
 * The voice vendor's post-call webhook for demo calls. It relays one finished
 * call into the Blob store, where the pipeline on Blake's Mac reads it (a
 * consult request on the demo is a lead for him):
 *
 *   calls/<iso>-<call id>-<tag>.json
 *
 * <iso> is the call's own start time (created_at, else finished_at) in UTC,
 * so a repeat of the same call lands on the same name and is seen as a
 * repeat. <tag> is 32 hex characters made from the webhook secret and the
 * call id (call-tag.ts): the store is public by path and this file holds a
 * mobile number, so its name must not be guessable from a call id and a
 * time. The pipeline reads the call id from the file's body, not its name.
 *
 * The vendor retries for about eight minutes and a call can be resent by
 * hand; each id is stored once. One exception: a copy that arrived before
 * the vendor had evaluated the call (no extracted variables) is replaced by
 * a later copy that has them, under the same name, because the consult
 * request lives in those variables. Once a copy with them is stored it is
 * kept, whatever comes after.
 *
 * The vendor signs nothing, so the secret travels in the URL and is compared
 * in constant time with AUTOCALLS_WEBHOOK_SECRET. No secret on our side, no
 * secret in the URL or the wrong one all get the same plain 404: the route
 * does not say it exists.
 *
 * Only a demo call of our own assistant is kept (assistant_id is
 * AUTOCALLS_ASSISTANT_UUID and input_variables.demo_mode says yes, the same
 * two tests the pipeline applies). Anything else is answered 200 and dropped,
 * so a real customer's call can never land in the store. For the same reason
 * the transcript is never stored: only the fields the pipeline reads. The
 * two tests follow the vendor's own sample payload (assistant_id is the
 * uuid, input_variables is an object). Two harmless variants are read as
 * well, variables sent as the text of a JSON object and demo_mode sent as
 * true; every drop is logged with its reason, so the first real payload
 * (plan step 12) can be checked against these tests before this route is
 * relied on.
 *
 * Answers: 200 {ok, stored: true} | {ok, stored: true, updated: true} |
 * {ok, stored: false, duplicate: true} | {ok, stored: false, ignored: true};
 * 400 for a body that is not a call; 413 for one that is too large; 500 when
 * the store refuses (the vendor then retries); 404 as above.
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
/** demo_mode as the mint sends it, and the same answer in the spellings a relay may turn it into. */
const YES_WORDS = ["yes", "true"];

/**
 * Ids stored by this instance, each with whether the stored copy has its
 * extracted variables, so a quick retry is answered without asking the store.
 */
const seen = new Map<string, boolean>();
const SEEN_MAX = 500;

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
const notFound = () => new Response("Not found", { status: 404, headers: HEADERS });
const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: HEADERS });
const duplicate = () => json({ ok: true, stored: false, duplicate: true });

/** The configured secret, or "" when there is none worth the name. */
function webhookSecret(): string {
  const secret = process.env.AUTOCALLS_WEBHOOK_SECRET?.trim() ?? "";
  return secret.length >= SECRET_MIN_CHARS ? secret : "";
}

function secretMatches(given: string, secret: string): boolean {
  if (!secret || !given) return false;
  // Hashing first makes both sides the same length, which timingSafeEqual needs.
  const a = createHash("sha256").update(secret).digest();
  const b = createHash("sha256").update(given).digest();
  return timingSafeEqual(a, b);
}

type Scalar = string | number | boolean | null;

/** A JSON object, given as itself or as the text of one (a relay may encode a nested field twice). Else null. */
function asObject(raw: unknown): Record<string, unknown> | null {
  let value = raw;
  if (typeof value === "string") {
    const text = value.trim();
    if (!text.startsWith("{")) return null;
    try {
      value = JSON.parse(text);
    } catch {
      return null;
    }
  }
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

/** The scalar entries of an object, strings clipped; nested values (a transcript, a lead record) are left behind. */
function scalars(raw: unknown): Record<string, Scalar> {
  const out: Record<string, Scalar> = {};
  const from = asObject(raw);
  if (!from) return out;
  for (const [key, value] of Object.entries(from)) {
    if (Object.keys(out).length >= MAX_KEYS) break;
    if (value === null || typeof value === "number" || typeof value === "boolean") out[key] = value;
    else if (typeof value === "string") out[key] = value.slice(0, MAX_VALUE_CHARS);
  }
  return out;
}

function saysYes(value: Scalar | undefined): boolean {
  if (value === true) return true;
  return typeof value === "string" && YES_WORDS.includes(value.trim().toLowerCase());
}

/** Why a call was dropped, for the log: the kind of thing that was sent, never the value. */
function whyIgnored(ours: string | null, given: unknown, sameAssistant: boolean): string {
  if (sameAssistant) return "demo_mode does not say yes";
  if (!ours) return "no assistant uuid is configured here";
  if (given === undefined || given === null) return "no assistant_id in the call";
  if (typeof given !== "string") return `assistant_id is a ${typeof given}, not a uuid`;
  return /^[0-9a-f-]{36}$/i.test(given.trim()) ? "another assistant" : "assistant_id is text that is not a uuid";
}

function when(x: unknown): Date | null {
  if (typeof x !== "string" || !x.trim()) return null;
  const at = Date.parse(x.trim());
  return Number.isFinite(at) ? new Date(at) : null;
}

/**
 * Where calls/ already holds this call under another time, or null (only
 * asked when the call carries no time of its own). The whole name after the
 * time is matched, so one id is never taken for another that ends the same.
 */
async function storedUnderAnotherTime(id: string, tag: string): Promise<string | null> {
  let cursor: string | undefined;
  for (let page = 0; page < 20; page++) {
    const res = await list(`${CALLS_PREFIX}/`, { limit: 1000, cursor });
    const found = res.blobs.find((b) => isCallFile(b.pathname, id, tag));
    if (found) return found.pathname;
    if (!res.hasMore || !res.cursor) return null;
    cursor = res.cursor;
  }
  return null;
}

/**
 * True when the stored copy of a call has no extracted variables: it arrived
 * before the vendor's evaluation. A copy that cannot be read counts as
 * lacking them, so the fuller one takes its place.
 */
async function lacksEvaluation(pathname: string): Promise<boolean> {
  try {
    const stored = await getJSON<{ extracted_variables?: unknown }>(pathname);
    return Object.keys(scalars(stored?.extracted_variables)).length === 0;
  } catch {
    return true;
  }
}

export async function POST(req: Request) {
  const secret = webhookSecret();
  if (!secretMatches(new URL(req.url).searchParams.get("k") ?? "", secret)) return notFound();

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
  if (!sameAssistant || !saysYes(input.demo_mode)) {
    console.log("[voice-webhook] ignored", id, whyIgnored(ours, payload.assistant_id, sameAssistant));
    return json({ ok: true, stored: false, ignored: true });
  }

  const extracted = scalars(payload.extracted_variables);
  const evaluated = Object.keys(extracted).length > 0;
  // A repeat is answered from memory, unless it may be the copy that brings the evaluation the stored one lacks.
  const known = seen.get(id);
  if (known === true || (known === false && !evaluated)) return duplicate();

  const now = new Date();
  const callTime = when(payload.created_at) ?? when(payload.finished_at);
  const tag = callTag(secret, id);
  const pathname = callPath(callTime ?? now, id, tag);
  const top: Record<string, Scalar> = {};
  for (const key of KEPT) {
    const value = payload[key];
    if (value === null || typeof value === "number" || typeof value === "boolean") top[key] = value;
    else if (typeof value === "string") top[key] = value.slice(0, MAX_VALUE_CHARS);
  }
  const doc = {
    v: 1,
    id,
    received_at: now.toISOString(),
    ...top,
    lead_token: validToken(input.lead_token) ? input.lead_token : null,
    input_variables: input,
    extracted_variables: extracted,
  };

  try {
    const existing = callTime ? ((await stat(pathname)) ? pathname : null) : await storedUnderAnotherTime(id, tag);
    if (existing) {
      // The first copy is kept, unless it has no evaluation and this one does.
      if (!evaluated || !(await lacksEvaluation(existing))) {
        remember(id, evaluated);
        return duplicate();
      }
      await putJSON(existing, doc, { allowOverwrite: true });
      remember(id, true);
      console.log("[voice-webhook] updated", id);
      return json({ ok: true, stored: true, updated: true });
    }
    await putJSON(pathname, doc);
  } catch (err) {
    console.error("[voice-webhook] write failed", id, err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }
  remember(id, evaluated);
  console.log("[voice-webhook] stored", id);
  return json({ ok: true, stored: true });
}

/** `evaluated` is whether the copy now in the store has its extracted variables (false also when that is not known). */
function remember(id: string, evaluated: boolean) {
  seen.delete(id);
  seen.set(id, evaluated);
  if (seen.size > SEEN_MAX) {
    // Drop the oldest (a Map keeps insertion order).
    for (const old of seen.keys()) {
      seen.delete(old);
      if (seen.size <= SEEN_MAX / 2) break;
    }
  }
}
