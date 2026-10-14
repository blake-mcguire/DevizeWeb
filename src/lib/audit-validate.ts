/**
 * Input checks for the audit page's form. Pure functions, no server or
 * browser APIs, so the route handlers and tests can share them.
 */

/** Tokens are the pipeline's 128-bit random keys; the shape check only keeps junk off the store. */
export const TOKEN_RE = /^[A-Za-z0-9_-]{8,64}$/;

export function validToken(token: unknown): token is string {
  return typeof token === "string" && TOKEN_RE.test(token);
}

/**
 * Set on a successful submit. The page reads it (a reload shows the download,
 * or the finishing state, instead of the form) and /api/audit-file requires
 * it: the file goes only to a browser that sent this token's form. Path "/"
 * so both /a/<token> and /api/audit-file receive it; the value is only "1".
 */
export function sentCookieName(token: string): string {
  return `da_${token}`;
}

export const SENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Where a page's file downloads from (/api/audit-file). part "plan" is a round-1 page's separate plan. */
export function auditFileUrl(token: string, part?: "plan"): string {
  return `/api/audit-file?token=${encodeURIComponent(token)}${part ? `&part=${part}` : ""}`;
}

/** The form's two field names. "tel" and "name" are what phones and browsers autofill from a saved contact. */
export const FIELD_NAME = "name";
export const FIELD_TEL = "tel";

/** User agents that are machines, not a person opening the link (mail scanners, previews, headless). */
export const MACHINE_UA =
  /bot|crawl|spider|slurp|preview|headless|python|curl|wget|httpclient|okhttp|scanner|monitor|proofpoint|mimecast|barracuda|facebookexternalhit|lighthouse/i;

/** A cleaned name (1-80 chars, whitespace collapsed), or null when it is missing or obvious junk. */
export function cleanName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const name = input.normalize("NFC").replace(/\s+/g, " ").trim();
  if (name.length < 1 || name.length > 80) return null;
  if (!/\p{L}/u.test(name)) return null; // no letters at all
  if (/[<>{}[\]\\|@=$^~`]/.test(name)) return null; // markup, emails, code
  if (/https?:|www\.|\.(com|net|org|io|ru|xyz)\b/i.test(name)) return null; // links
  if ((name.match(/\d/g) ?? []).length > 2) return null; // a phone number in the name box
  return name;
}

/**
 * A US number in E.164 (+1XXXXXXXXXX), or null.
 *
 * Accepts the usual ways people type one, and what autofill fills in:
 * (713) 555-2368, 713.555.2368, +1 713 555 2368, +17135552368,
 * 1-713-555-2368. Rejects what cannot be a real NANP line:
 * an area code or exchange starting 0 or 1, N11 codes (411, 911), the
 * 555-01XX fiction block, one digit repeated, and 123-456-7890. Whether it is
 * a mobile cannot be told from the digits; the label asks for one.
 */
export function usMobileE164(input: unknown): string | null {
  if (typeof input !== "string") return null;
  // What autofill and a pasted contact card can carry around the digits:
  // invisible direction marks and joiners, odd spaces, typographic dashes.
  const raw = input
    .normalize("NFKC")
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .trim();
  if (raw.length > 32) return null;
  if (/[^\d\s().+-]/.test(raw)) return null; // letters, extensions, anything odd
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length !== 10) return null;

  const area = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);
  const line = digits.slice(6);
  if (/^[01]/.test(area) || /^[01]/.test(exchange)) return null;
  if (/^\d11$/.test(area) || /^\d11$/.test(exchange)) return null;
  if (area === "555") return null;
  if (exchange === "555" && /^01\d\d$/.test(line)) return null;
  if (/^(\d)\1{9}$/.test(digits)) return null;
  if (digits === "1234567890" || digits === "2345678901" || digits === "9876543210") return null;
  return `+1${digits}`;
}
