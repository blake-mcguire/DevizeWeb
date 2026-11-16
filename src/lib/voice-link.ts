/**
 * The readable demo link (/for/<slug>) and the opt-out page (/u/<token>):
 * the shapes the site accepts, and the Blob paths they read and write.
 *
 * What it is for: the cold email links to https://<sending domain>/for/<slug>
 * instead of /a/<token>, so the address a prospect sees reads as their own
 * business name. The pipeline writes links/<slug>.json = {v: 1, slug, token}
 * beside the page before any email carries the link, and never points an
 * existing slug at another token; the site reads that file and renders the
 * same voice page /a/<token> renders, under the readable address. The email
 * footer links to /u/<token>, a small page with one button; the press is
 * what opts the address out, never the visit.
 *
 *   links/<slug>.json                      written by the pipeline, read here
 *   optouts/<token>/<iso>-<rand>.json      written here on the button press
 *   optout-views/<token>/<iso>-<rand>.json written here by the page's beacon
 *
 * Who decided what: the slug rule, the links file and the three paths are the
 * voice build contract's (section 8.4 and 8.5, 2026-11-16), from Blake's
 * "a readable link" and his opt-out page ("Not interested in how AI can help
 * your business? Unsubscribe here: Button"). The engineering defaults taken
 * here with nobody to ask are named constants below.
 *
 * Pure functions, no imports: the pages, the routes and the node tests share
 * this file.
 */

/** A slug as the pipeline makes it: lower-case ASCII letters, digits and single inner hyphens, at most 60. */
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/;
export const SLUG_MAX = 60;

/** A page token as the pipeline makes it (landing.new_token): exactly 22 letters and digits. */
export const LINK_TOKEN_RE = /^[A-Za-z0-9]{22}$/;

export const LINKS_PREFIX = "links";
export const OPTOUTS_PREFIX = "optouts";
export const OPTOUT_VIEWS_PREFIX = "optout-views";

/** Where the opt-out page's beacon reports a visit, and the session key that keeps it to one a browser session. */
export const OPTOUT_VIEW_ENDPOINT = "/api/optout-view";
export const OPTOUT_VIEW_KEY = "devize_optout_view_";

/** True for a slug of the contract's shape. Anything else is the plain 404, before the store is asked. */
export function validSlug(slug: unknown): slug is string {
  return typeof slug === "string" && slug.length <= SLUG_MAX && SLUG_RE.test(slug);
}

/** Where the pipeline writes a slug's link file. Throws on a slug that is not of the contract's shape. */
export function linkPath(slug: string): string {
  if (!validSlug(slug)) throw new Error("voice-link: not a slug");
  return `${LINKS_PREFIX}/${slug}.json`;
}

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);

/**
 * The token a links/<slug>.json names, or null when the file is anything but
 * {v: 1, slug: <the slug of its own path>, token: <22 letters and digits>}.
 * Other keys are ignored (engineering default, 2026-11-16: the pipeline may add
 * a field such as the time it wrote the file, and an extra field cannot point
 * the slug anywhere else). A file whose slug is not its own path's is refused,
 * so a copy or a rename can never send one business's link to another's page.
 */
export function linkToken(raw: unknown, slug: string): string | null {
  if (!validSlug(slug) || !isObj(raw)) return null;
  if (raw.v !== 1 || raw.slug !== slug) return null;
  return typeof raw.token === "string" && LINK_TOKEN_RE.test(raw.token) ? raw.token : null;
}

/**
 * Whether a page.json lets its token be opted out: a voice page (kind
 * "voice") of this very token, EXPIRED OR NOT, because an opt-out must work
 * long after the demo has gone. Nothing else in it is checked (engineering
 * default, 2026-11-16): a page the demo reader refuses for a fault of its own,
 * or one of a later version, was still emailed, and its link must still work.
 * An audit page (no kind) is not a voice page, so its token has no opt-out
 * page here.
 */
export function optoutAllowed(raw: unknown, token: string): boolean {
  return isObj(raw) && raw.kind === "voice" && typeof raw.token === "string" && raw.token === token;
}

/**
 * What audit-page.optoutPageState answers for a token: "yes" (a voice page of
 * this token, expired or not), "no" (a malformed token, no page, or a page of
 * another kind), "error" (the store could not be read, or page.json could not
 * be parsed).
 */
export type OptoutState = "yes" | "no" | "error";

/**
 * Whether GET /u/<token> shows the caption and the button for each answer.
 * Only "no" is the /a/ 404. "error" shows the button too (fixer, 2026-11-16,
 * after the review): a real recipient who opens the link while the store
 * cannot be read would otherwise be told the page is gone and lose the
 * opt-out. The press asks the store again: it answers 503 and the button says
 * try again, or it goes through once the store is back. Nothing leaks: a
 * store fault is not something a visitor can cause, and POST /api/unsubscribe
 * still decides 404 against ok on its own read.
 */
export const OPTOUT_PAGE_SHOWS: Readonly<Record<OptoutState, boolean>> = { yes: true, error: true, no: false };

/** UTC in basic ISO 8601 to the second (20261116T031500Z), the form every other event name uses. */
function isoCompact(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");
}

const RAND = /^[0-9a-f]{32}$/;

function eventName(prefix: string, token: string, at: Date, rand: string): string {
  if (!RAND.test(rand)) throw new Error("voice-link: an event name needs 32 random hex characters");
  return `${prefix}/${token}/${isoCompact(at)}-${rand}.json`;
}

/** One token's opt-out files. The trailing slash keeps one token from matching a longer one. */
export function optoutPrefix(token: string): string {
  return `${OPTOUTS_PREFIX}/${token}/`;
}

/** An opt-out, written on the button press. rand is 32 hex characters (128 random bits). */
export function optoutPath(token: string, at: Date, rand: string): string {
  return eventName(OPTOUTS_PREFIX, token, at, rand);
}

/** A visit to the opt-out page, written by its beacon. rand is 32 hex characters (128 random bits). */
export function optoutViewPath(token: string, at: Date, rand: string): string {
  return eventName(OPTOUT_VIEWS_PREFIX, token, at, rand);
}
