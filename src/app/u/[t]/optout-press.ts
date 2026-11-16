import { timeoutSignal } from "@/app/a/[token]/voice-call";
import { optoutBody } from "@/lib/voice-link";

/**
 * The opt-out button's press (optout-button.tsx), kept apart from the
 * component so node's own test runner can send exactly this request to the
 * route in-process (tests/optout-routes.test.mjs): no React, and nothing from
 * the browser is touched until the function is called (fixer, 2026-11-16,
 * after the review found nothing tested what the page itself sends).
 *
 * The request is the one POST /api/unsubscribe takes: JSON, {t}, nothing
 * else, t being the opt-out token from the page's own address (contract 8.6;
 * the route never takes a page token). The press is "done" only when the site answers ok with {ok: true};
 * every other answer, no answer, and a timeout are "failed", and the page
 * keeps the button.
 */

export const UNSUBSCRIBE_ENDPOINT = "/api/unsubscribe";

/** How long the press waits for the site before it says it did not go through. */
export const PRESS_TIMEOUT_MS = 15_000;

export type PressResult = "done" | "failed";

/** How the press reaches the site: fetch in the browser, the route itself in a test. */
export type Send = (url: string, init: RequestInit) => Promise<Response>;

/** The press's request, as the route requires it: a JSON post of {t} (voice-link.optoutBody). */
export function unsubscribeInit(t: string): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: optoutBody(t),
    cache: "no-store",
  };
}

export async function pressUnsubscribe(t: string, send: Send = (url, init) => fetch(url, init)): Promise<PressResult> {
  try {
    const res = await send(UNSUBSCRIBE_ENDPOINT, { ...unsubscribeInit(t), signal: timeoutSignal(PRESS_TIMEOUT_MS) });
    const data = (await res.json().catch(() => ({}))) as { ok?: unknown } | null;
    return res.ok && data?.ok === true ? "done" : "failed";
  } catch {
    return "failed";
  }
}
