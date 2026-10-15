import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { isoCompact, putJSON } from "@/lib/blob-store";
import { LEAD_ERRORS, type LeadErrorCode } from "@/lib/lead-copy";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * POST /api/lead: the homepage audit request form.
 *
 * Two ways in. The page's script posts JSON and gets JSON back (an `error`
 * string written for the visitor on a 400 or 429). Without JavaScript, or
 * when someone submits before the script has loaded, the form posts itself
 * (urlencoded) and gets a 303 to /thanks, with ?e=<code> on an error. The
 * Location is relative, the same as /api/audit-request, so the browser stays
 * on the host it posted to.
 */

/**
 * The form's fields (2026-10-15, pass 2): business name, town and email are
 * required; your name and the search you want to show up for are optional.
 * No phone field. `trade` and `callVolume` are no longer on the form; they are
 * kept so an old cached page that still sends them does not lose the value.
 */
const FIELDS = ["company", "town", "email", "name", "message", "trade", "callVolume"] as const;

/** Required on the form, so required here too. Change the two together. */
const REQUIRED = ["company", "town", "email"] as const;

/** Which form sent it: the hero's or the contact section's. Anything else is dropped. */
const SOURCES = new Set(["hero", "contact"]);

/** The hidden honeypot input. People never see it; a bot that fills it is dropped. */
const HONEYPOT = "website";

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** The body as an object, or null when it is not one (bad JSON, `null`, an array, a string). */
async function readBody(
  request: NextRequest
): Promise<{ body: Record<string, unknown> | null; form: boolean }> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    try {
      const fd = await request.formData();
      const body: Record<string, string> = {};
      for (const [k, v] of fd.entries()) if (typeof v === "string") body[k] = v;
      return { body, form: true };
    } catch {
      return { body: null, form: true };
    }
  }
  try {
    const parsed: unknown = JSON.parse(await request.text());
    const ok = parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
    return { body: ok ? (parsed as Record<string, unknown>) : null, form: false };
  } catch {
    return { body: null, form: false };
  }
}

function toThanks(code?: LeadErrorCode): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: code ? `/thanks?e=${code}` : "/thanks", "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const { body, form } = await readBody(request);

  const fail = (code: LeadErrorCode, status: number) =>
    form ? toThanks(code) : Response.json({ error: LEAD_ERRORS[code] }, { status });
  const done = () => (form ? toThanks() : Response.json({ ok: true }));

  if (!allow(`lead|${clientIp(request.headers)}`)) return fail("rate", 429);
  if (!body) return fail("fields", 400);

  // A filled honeypot looks like success to the sender, and nothing is kept.
  const trap = body[HONEYPOT];
  if (typeof trap === "string" && trap.trim()) {
    console.log("[lead] honeypot filled, dropped");
    return done();
  }

  // Only the form's own fields, each a trimmed string of sane length.
  const lead: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = body[f];
    if (typeof v === "string" && v.trim()) lead[f] = v.trim().slice(0, 2000);
  }
  if (REQUIRED.some((f) => !lead[f])) return fail("fields", 400);
  if (!validEmail(lead.email)) return fail("email", 400);
  const source = typeof body.source === "string" && SOURCES.has(body.source) ? body.source : undefined;

  const now = new Date();
  const record = {
    v: 1,
    ...lead,
    ...(source ? { source } : {}),
    received_at: now.toISOString(),
    user_agent: (request.headers.get("user-agent") ?? "").slice(0, 400),
  };

  // leads/<iso>-<random>.json. The store is public and the timestamp alone is
  // guessable to the second, so the random part keeps a lead's details from
  // being found by counting through timestamps.
  const pathname = `leads/${isoCompact(now)}-${randomBytes(8).toString("hex")}.json`;
  try {
    await putJSON(pathname, record);
    console.log("[lead] stored", pathname);
  } catch (err) {
    // No Blob store connected yet (or it is down): keep the old behaviour, the
    // lead in the server log, so nothing is lost while storage is being set up.
    console.error("[lead] store failed", err instanceof Error ? err.message : err);
    console.log("[lead]", record);
  }

  return done();
}
