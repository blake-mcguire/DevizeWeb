import "server-only";

import { blobUrl, getJSON } from "@/lib/blob-store";
import { validToken } from "@/lib/audit-validate";

/** One row of "who came up instead of you", exactly as the pipeline writes it. */
export type AuditRow = {
  name: string;
  rating: number | null;
  reviews_display: string;
  top3: number | null;
  me: boolean;
};

/** audits/<token>/page.json, v1. Written by the pipeline before the email goes out. */
export type AuditPage = {
  v: 1;
  token: string;
  place_id: string;
  business: string;
  city: string;
  trade: "dental" | "hvac";
  place_noun: "practice" | "shop";
  keyword: string;
  pins: number;
  top3: number;
  mid: number;
  absent: number;
  scanned_on: string;
  rows: AuditRow[];
  typical_line: string | null;
  persona_first: string;
  persona_name: string;
  sender_email: string;
  map_url: string;
  audit_pdf_url: string;
  plan_pdf_url: string;
  created_at: string;
  expires_at: string | null;
};

const isStr = (x: unknown): x is string => typeof x === "string" && x.trim().length > 0;
const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

/**
 * An http(s) URL or a root-relative path, else null. page.json is written by
 * our own pipeline, so this is a guard against a bad value, not an attacker.
 */
function safeUrl(u: unknown): string | null {
  if (!isStr(u)) return null;
  const s = u.trim();
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  try {
    const parsed = new URL(s);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function asset(token: string, file: string, given: unknown): string | null {
  return safeUrl(given) ?? blobUrl(`audits/${token}/${file}`);
}

/**
 * The page for a token, or null when the token is malformed, unknown,
 * expired, or the document is unreadable. Callers must treat every null the
 * same way (a plain 404), so a visitor learns nothing about which it was.
 */
export async function loadAuditPage(token: string): Promise<AuditPage | null> {
  if (!validToken(token)) return null;
  let raw: Record<string, unknown> | null;
  try {
    raw = await getJSON<Record<string, unknown>>(`audits/${token}/page.json`);
  } catch (err) {
    console.error("[audit-page] read failed", err instanceof Error ? err.message : err);
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  if (raw.token !== token) return null;

  if (isStr(raw.expires_at)) {
    const exp = Date.parse(raw.expires_at);
    if (Number.isFinite(exp) && exp < Date.now()) return null;
  }

  if (!isStr(raw.business) || !isStr(raw.keyword) || !isNum(raw.pins)) return null;

  const trade = raw.trade === "dental" ? "dental" : "hvac";
  const rows: AuditRow[] = Array.isArray(raw.rows)
    ? raw.rows
        .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
        .filter((r) => isStr(r.name))
        .map((r) => ({
          name: String(r.name).trim(),
          rating: isNum(r.rating) ? r.rating : null,
          reviews_display: isStr(r.reviews_display) ? r.reviews_display.trim() : "",
          top3: isNum(r.top3) ? r.top3 : null,
          me: r.me === true,
        }))
    : [];

  const map = asset(token, "map.png", raw.map_url);
  const audit = asset(token, "audit.pdf", raw.audit_pdf_url);
  const plan = asset(token, "plan.pdf", raw.plan_pdf_url);
  if (!audit || !plan) return null; // nothing to hand over: do not take their number

  return {
    v: 1,
    token,
    place_id: isStr(raw.place_id) ? raw.place_id : "",
    business: raw.business.trim(),
    city: isStr(raw.city) ? raw.city.trim() : "",
    trade,
    place_noun: raw.place_noun === "practice" || raw.place_noun === "shop"
      ? raw.place_noun
      : trade === "dental" ? "practice" : "shop",
    keyword: raw.keyword.trim(),
    pins: raw.pins,
    top3: isNum(raw.top3) ? raw.top3 : 0,
    mid: isNum(raw.mid) ? raw.mid : 0,
    absent: isNum(raw.absent) ? raw.absent : 0,
    scanned_on: isStr(raw.scanned_on) ? raw.scanned_on.trim() : "",
    rows,
    typical_line: isStr(raw.typical_line) ? raw.typical_line.trim() : null,
    persona_first: isStr(raw.persona_first) ? raw.persona_first.trim() : "Blake",
    persona_name: isStr(raw.persona_name) ? raw.persona_name.trim() : "Blake McGuire",
    sender_email: isStr(raw.sender_email) ? raw.sender_email.trim() : "",
    map_url: map ?? "",
    audit_pdf_url: audit,
    plan_pdf_url: plan,
    created_at: isStr(raw.created_at) ? raw.created_at : "",
    expires_at: isStr(raw.expires_at) ? raw.expires_at : null,
  };
}
