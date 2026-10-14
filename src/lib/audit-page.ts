import "server-only";

import { blobUrl, getJSON, pathnameOfUrl, stat } from "@/lib/blob-store";
import { validToken } from "@/lib/audit-validate";
import { downloadName } from "@/lib/download-name";

/** One row of "who came up instead of you", exactly as the pipeline writes it. */
export type AuditRow = {
  name: string;
  rating: number | null;
  reviews_display: string;
  top3: number | null;
  me: boolean;
};

/**
 * audits/<token>/page.json, v1, as the page uses it. The pipeline writes it
 * before the email goes out, with the map but WITHOUT the PDF (round 2,
 * 2026-10-14: files are built on click). On the first view or submission it
 * builds one PDF (the three-page audit, then the one-page plan when the plan
 * travels), uploads it to audits/<token>/plan.pdf and rewrites page.json with
 * pdf_url and pdf_built_at.
 *
 * Round-1 pages (audit_pdf_url and plan_pdf_url, two files, built ahead) are
 * still read: their audit is the file, their plan a second download.
 */
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
  /**
   * Whether the file this page hands over carries the plan: page.json `plan`
   * (true/false, set when the page is built and rewritten with the truth when
   * the PDF is). A round-1 page without the field: whether it named a plan.
   */
  plan: boolean;
  /** The file, once the pipeline has built it (pdf_url; a round-1 page's audit_pdf_url). null until then. */
  pdf_url: string | null;
  pdf_built_at: string | null;
  /** A round-1 page (audit_pdf_url, no pdf_url). */
  legacy: boolean;
  /** Round-1 pages only: their separate plan.pdf, a second download. */
  legacy_plan_url: string | null;
  created_at: string;
  expires_at: string | null;
};

/** What /api/audit-file streams for a page, and what the download is called. */
export type AuditFile = { pathname: string; filename: string };

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

/** The one PDF a round-2 page hands over, at a fixed path. */
export function pdfPathname(token: string): string {
  return `audits/${token}/plan.pdf`;
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
  // The file. A missing pdf_url means "not built yet", never "look anyway":
  // it is built on the first view, so there is no fixed-path fallback here.
  const pdf = isStr(raw.pdf_url) ? raw.pdf_url.trim() : null;
  // Round 1: two files built ahead; the audit is the file, the plan a second
  // download when the page named one (plan_pdf_url null means no plan).
  const legacyAudit = pdf ? null : safeUrl(raw.audit_pdf_url);
  const legacyPlan = legacyAudit ? safeUrl(raw.plan_pdf_url) : null;
  const plan = typeof raw.plan === "boolean" ? raw.plan : !!legacyPlan;

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
    plan,
    pdf_url: pdf ?? legacyAudit,
    pdf_built_at: isStr(raw.pdf_built_at) ? raw.pdf_built_at : null,
    legacy: !!legacyAudit,
    legacy_plan_url: legacyPlan,
    created_at: isStr(raw.created_at) ? raw.created_at : "",
    expires_at: isStr(raw.expires_at) ? raw.expires_at : null,
  };
}

/**
 * The file to hand over for this page, or null while it is not built.
 *
 * page.json is read through the Blob CDN, which may serve the copy from
 * before the rewrite for up to a minute after the pipeline adds pdf_url. So
 * when page.json does not name the file yet, `fresh` also asks the store
 * itself (stat, not the CDN) whether audits/<token>/plan.pdf exists and was
 * uploaded after this page was built (created_at): a file from an earlier
 * build of the same token never counts. The status and file routes pass
 * fresh; the page's own first render does not need to.
 *
 * `part: "plan"` is a round-1 page's separate plan.
 */
export async function auditFile(
  page: AuditPage,
  { fresh = false, part = "main" }: { fresh?: boolean; part?: "main" | "plan" } = {},
): Promise<AuditFile | null> {
  if (part === "plan") {
    if (!page.legacy_plan_url) return null;
    const p = ownPdf(page, page.legacy_plan_url) ?? `audits/${page.token}/plan.pdf`;
    return { pathname: p, filename: downloadName(page.business, "plan") };
  }
  const kind = page.plan && !page.legacy ? "audit-and-plan" : "audit";
  if (page.pdf_url) {
    // Normally the public URL of audits/<token>/plan.pdf; anything that does
    // not resolve to this page's own folder falls back to the fixed path.
    const fixed = page.legacy ? `audits/${page.token}/audit.pdf` : pdfPathname(page.token);
    return { pathname: ownPdf(page, page.pdf_url) ?? fixed, filename: downloadName(page.business, kind) };
  }
  if (!fresh) return null;
  const built = Date.parse(page.created_at);
  if (!Number.isFinite(built)) return null;
  const pathname = pdfPathname(page.token);
  try {
    const st = await stat(pathname);
    if (st && st.size > 0 && st.uploadedAt.getTime() >= built) {
      return { pathname, filename: downloadName(page.business, kind) };
    }
  } catch (err) {
    console.error("[audit-page] stat failed", err instanceof Error ? err.message : err);
  }
  return null;
}

/** The store pathname of a PDF URL (or bare pathname) from page.json, only when it is a PDF in this page's own folder. */
function ownPdf(page: AuditPage, url: string): string | null {
  const p = /^audits\//.test(url) ? url : pathnameOfUrl(url);
  return p && p.startsWith(`audits/${page.token}/`) && !p.slice(`audits/${page.token}/`.length).includes("/") &&
    p.endsWith(".pdf")
    ? p
    : null;
}
