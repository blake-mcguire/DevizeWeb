import "server-only";

import { blobUrl, getJSON, pathnameOfUrl, stat } from "@/lib/blob-store";
import { validToken } from "@/lib/audit-validate";
import { cleanFilename, downloadName } from "@/lib/download-name";
import { chooseView } from "@/lib/prospect-view";
import { allow, spent } from "@/lib/rate-limit";
import { linkPath, linkToken, optoutAllowed, validSlug, type OptoutState } from "@/lib/voice-link";
import { pageKind, parseVoicePage, type VoicePage } from "@/lib/voice-page";

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
  /** The download's name as the pipeline gave it (page.json pdf_filename), or null: the site names it the same way. */
  pdf_filename: string | null;
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

/**
 * Whether the one file this page hands over carries the plan: page.json
 * `plan`, except on a round-1 page, whose plan is a second file. The page,
 * /api/audit-request and /api/audit-status all word the file from this.
 */
export function filePlan(page: AuditPage): boolean {
  return page.plan && !page.legacy;
}

/** The one PDF a round-2 page hands over, at a fixed path. */
export function pdfPathname(token: string): string {
  return `audits/${token}/plan.pdf`;
}

/**
 * What audits/<token>/page.json turned out to be: an audit page (every page
 * before 2026-11-15, which carry no kind), or a voice demo page (kind
 * "voice", read and checked by voice-page.ts; it has no keyword, no pins and
 * no file).
 */
export type LoadedPage = { kind: "audit"; page: AuditPage } | { kind: "voice"; page: VoicePage };

/**
 * The page for a token, of either kind, or null when the token is malformed,
 * unknown, expired, or the document is unreadable. Callers must treat every
 * null the same way (a plain 404), so a visitor learns nothing about which
 * it was. Only /a/<token> itself and the view beacon take both kinds; every
 * audit route keeps asking loadAuditPage, so a voice page has no form, no
 * status and no file. (/for/<slug> reads through here as well and shows
 * voice pages only: prospect-view.ts.)
 */
export async function loadPage(token: string): Promise<LoadedPage | null> {
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

  if (pageKind(raw) === "voice") {
    const voice = parseVoicePage(raw, token, new Date());
    return voice ? { kind: "voice", page: voice } : null;
  }
  const audit = auditFromRaw(raw, token);
  return audit ? { kind: "audit", page: audit } : null;
}

/**
 * The token a readable link (/for/<slug>) names, or null when the slug is
 * malformed, has no links/<slug>.json, or the file is not {v: 1, slug, token}
 * for this very slug (voice-link.ts). Callers treat every null as the plain
 * 404, as /a/ does.
 */
export async function tokenForSlug(slug: string): Promise<string | null> {
  if (!validSlug(slug)) return null;
  let raw: unknown;
  try {
    raw = await getJSON(linkPath(slug));
  } catch (err) {
    console.error("[audit-page] link read failed", err instanceof Error ? err.message : err);
    return null;
  }
  return linkToken(raw, slug);
}

/**
 * The page a readable link leads to: the token from links/<slug>.json, then
 * exactly the loadPage /a/<token> uses, so the two addresses read the same
 * page under the same rules (an expired or broken page is null on both).
 */
export async function loadPageForSlug(slug: string): Promise<LoadedPage | null> {
  const token = await tokenForSlug(slug);
  return token ? loadPage(token) : null;
}

/**
 * /for/ misses one address may make in FOR_MISS_WINDOW_MS before every /for/
 * answer to that address is the plain 404, given without reading the store
 * (engineering default, fixer, 2026-11-16, after the review). A slug is made
 * from a public business name, so without it a script could try name after
 * name, learn from each 200 which businesses are being emailed, and cost a
 * Blob read a try. A link that leads to a page is a hit and never counts, so
 * a prospect opening their own link again and again is never turned away. In
 * memory, per server instance (rate-limit.ts): it slows one address trying
 * names; it does not stop many addresses or one targeted guess (the readable
 * link's trade-off, which is Blake's to decide).
 */
export const FOR_MISS_LIMIT = 20;
export const FOR_MISS_WINDOW_MS = 10 * 60 * 1000;

/** loadPageForSlug for one caller's address (rate-limit.clientIp), under the /for/ miss limit above. */
export async function loadPageForSlugFrom(slug: string, ip: string): Promise<LoadedPage | null> {
  const key = `for-miss|${ip}`;
  if (spent(key, FOR_MISS_LIMIT, FOR_MISS_WINDOW_MS)) return null;
  const loaded = await loadPageForSlug(slug);
  if (chooseView(loaded, "for").kind === "missing") allow(key, FOR_MISS_LIMIT, FOR_MISS_WINDOW_MS);
  return loaded;
}

/**
 * Whether a token may be opted out (/u/<token>, POST /api/unsubscribe):
 * "yes" when audits/<token>/page.json is a voice page of this token, expired
 * or not (voice-link.optoutAllowed); "no" for a malformed token, no page, or
 * a page of another kind; "error" when the store could not be read, so the
 * button can say "try again" instead of turning a real opt-out away. What the
 * page shows for each is voice-link.OPTOUT_PAGE_SHOWS.
 */
export async function optoutPageState(token: string): Promise<OptoutState> {
  if (!validToken(token)) return "no";
  let raw: unknown;
  try {
    raw = await getJSON(`audits/${token}/page.json`);
  } catch (err) {
    console.error("[audit-page] opt-out page read failed", err instanceof Error ? err.message : err);
    return "error";
  }
  return optoutAllowed(raw, token) ? "yes" : "no";
}

/**
 * The audit page for a token, or null when the token is malformed, unknown,
 * expired, the document is unreadable, or the page is a voice demo. Callers
 * must treat every null the same way (a plain 404), so a visitor learns
 * nothing about which it was.
 */
export async function loadAuditPage(token: string): Promise<AuditPage | null> {
  const loaded = await loadPage(token);
  return loaded?.kind === "audit" ? loaded.page : null;
}

/** An audit page from its page.json (token already matched), exactly as before the voice kind existed. */
function auditFromRaw(raw: Record<string, unknown>, token: string): AuditPage | null {
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
    pdf_filename: legacyAudit ? null : cleanFilename(raw.pdf_filename),
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
 * fresh, and so does the page's own render once this browser has sent the
 * form (a reload a few seconds after the download must not fall back to the
 * finishing state and download it again; round 3). Before the form is sent
 * the page does not need to know.
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
  const kind = filePlan(page) ? "audit-and-plan" : "audit";
  const filename = page.pdf_filename ?? downloadName(page.business, kind);
  if (page.pdf_url) {
    // Normally the public URL of audits/<token>/plan.pdf; anything that does
    // not resolve to this page's own folder falls back to the fixed path.
    const fixed = page.legacy ? `audits/${page.token}/audit.pdf` : pdfPathname(page.token);
    return { pathname: ownPdf(page, page.pdf_url) ?? fixed, filename };
  }
  if (!fresh) return null;
  const built = Date.parse(page.created_at);
  if (!Number.isFinite(built)) return null;
  const pathname = pdfPathname(page.token);
  try {
    const st = await stat(pathname);
    if (st && st.size > 0 && st.uploadedAt.getTime() >= built) {
      return { pathname, filename };
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
