import "server-only";

/**
 * The one server-side call that starts a voice demo: a realtime session at
 * the voice vendor (Autocalls), minted with the account's API key.
 *
 * What it is for: the browser must never hold the key, choose the assistant
 * or write the call variables. So the mint route asks here, and the browser
 * only ever receives the short-lived {url, token} pair for one session.
 *
 *   POST <base>/api/user/realtime/session
 *   Authorization: Bearer <AUTOCALLS_API_KEY>
 *   {assistant_id: <AUTOCALLS_ASSISTANT_UUID>, variables: {...}, external_identifier: <page token>}
 *   -> 200 {id, url, token, expires_in}
 *
 * Environment (Blake sets the values in Vercel; nothing here has a default
 * that could reach the vendor by accident except the public host name):
 *   AUTOCALLS_API_KEY         the account key; required
 *   AUTOCALLS_ASSISTANT_UUID  the assistant's uuid (not its number); required
 *   AUTOCALLS_API_BASE        optional; DEFAULT_API_BASE when unset. Tests
 *                             point it at a local fake. It must be https,
 *                             or http on this machine only, so the key can
 *                             never travel in the clear.
 *
 * Nothing the vendor answers is passed on: not its error text, not its
 * session id, and never the key. Callers get a reason from a short list and
 * turn it into their own words.
 *
 * This file is server-only, and it is the only place the vendor's name and
 * host appear, so neither can reach a client bundle.
 */

export const DEFAULT_API_BASE = "https://app.autocalls.ai";
export const SESSION_PATH = "/api/user/realtime/session";
/**
 * The vendor answered in about a second in the 2026-11-13 trial. Eight is generous, still under a visitor's
 * patience, and leaves the mint route room to finish inside its own time limit (maxDuration in its route file).
 */
export const UPSTREAM_TIMEOUT_MS = 8_000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

export type UpstreamReason =
  | "config" // a missing or malformed environment value on our side
  | "auth" // 401: the key was refused
  | "balance" // 402: no minutes left
  | "blocked" // 403: the assistant is blocked
  | "assistant" // 404: no such assistant
  | "variables" // 422: the vendor refused what we sent
  | "busy" // 429: too many sessions at once, or too many mints a minute
  | "down" // 503, a timeout, or no connection
  | "unexpected"; // any other answer, or a 200 without a usable url and token

export type MintResult =
  | { ok: true; url: string; token: string }
  | { ok: false; reason: UpstreamReason; status: number | null };

/** The assistant's uuid from the environment, or null when it is unset or not a uuid. */
export function assistantUuid(): string | null {
  const id = process.env.AUTOCALLS_ASSISTANT_UUID?.trim() ?? "";
  return UUID.test(id) ? id.toLowerCase() : null;
}

/** The API base to call, or null when AUTOCALLS_API_BASE is set to something unsafe. */
export function apiBase(): string | null {
  const given = process.env.AUTOCALLS_API_BASE?.trim();
  if (!given) return DEFAULT_API_BASE;
  let url: URL;
  try {
    url = new URL(given);
  } catch {
    return null;
  }
  if (url.username || url.password || url.search || url.hash) return null;
  const local = LOOPBACK.has(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) return null;
  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

const REASON_BY_STATUS: Record<number, UpstreamReason> = {
  401: "auth",
  402: "balance",
  403: "blocked",
  404: "assistant",
  422: "variables",
  429: "busy",
  503: "down",
};

/** What a vendor status means to us. Anything not on the list is "unexpected". */
export function reasonForStatus(status: number): UpstreamReason {
  return REASON_BY_STATUS[status] ?? "unexpected";
}

/**
 * What the visitor's browser is told for each reason: an HTTP status and a
 * code the page has a sentence for. Only three statuses ever leave: 402 (no
 * minutes), 429 (busy) and 503 (everything else, which is ours to fix and
 * nothing the visitor can act on).
 */
export function publicError(reason: UpstreamReason): { status: 402 | 429 | 503; code: "balance" | "busy" | "unavailable" } {
  if (reason === "balance") return { status: 402, code: "balance" };
  if (reason === "busy") return { status: 429, code: "busy" };
  return { status: 503, code: "unavailable" };
}

function usableUrl(x: unknown): x is string {
  if (typeof x !== "string" || x.length === 0 || x.length > 2048) return false;
  try {
    const u = new URL(x);
    return u.protocol === "wss:" || u.protocol === "https:" || u.protocol === "ws:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Asks the vendor for one session. Never throws: every failure is a reason.
 * `variables` are the call variables (at most 50 scalar strings; the caller
 * builds them), `externalId` is the page token.
 */
export async function mintSession(variables: Record<string, string>, externalId: string): Promise<MintResult> {
  const key = process.env.AUTOCALLS_API_KEY?.trim();
  const assistant = assistantUuid();
  const base = apiBase();
  if (!key || !assistant || !base) return { ok: false, reason: "config", status: null };

  let res: Response;
  try {
    res = await fetch(`${base}${SESSION_PATH}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ assistant_id: assistant, variables, external_identifier: externalId }),
      cache: "no-store",
      // A redirect is never followed: the key goes to the host we named and nowhere else.
      redirect: "manual",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, reason: "down", status: null };
  }

  if (res.status !== 200) {
    // The body is never read: it may quote the request, and nothing in it is for the visitor.
    await res.body?.cancel().catch(() => {});
    return { ok: false, reason: reasonForStatus(res.status), status: res.status };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, reason: "unexpected", status: 200 };
  }
  const { url, token } = (data && typeof data === "object" ? data : {}) as { url?: unknown; token?: unknown };
  if (!usableUrl(url) || typeof token !== "string" || token.length === 0 || token.length > 8192) {
    return { ok: false, reason: "unexpected", status: 200 };
  }
  return { ok: true, url, token };
}
