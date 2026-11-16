/**
 * Where the view beacon (view-beacon.tsx) reports an open by default, and
 * what it sends, kept apart from the component so node's own test runner can
 * pin them and send the body to the routes in-process (fixer, 2026-11-16,
 * after the review: the audit page, /a/<token> and /for/<slug> all rely on
 * these defaults, and nothing tested them).
 *
 * The opt-out page (/u/<t>) passes its own three instead
 * (voice-link.OPTOUT_VIEW_ENDPOINT, OPTOUT_VIEW_KEY and OPTOUT_BODY_FIELD), so
 * a visit there is never counted as a demo or audit view, the two
 * once-per-session keys never hold each other back, and its body is {t}, the
 * opt-out token, never a page token (contract 8.6).
 */

/** The audit and voice pages' view route. */
export const VIEW_ENDPOINT = "/api/audit-view";

/** The once-per-session key prefix; the token is appended. */
export const VIEW_KEY = "devize_view_";

/** The body's one key by default: {token}, the page token, as /api/audit-view reads it. */
export const VIEW_FIELD = "token";

/** The beacon's body, whichever route it goes to: {[field]: value}, by default {token}. */
export function viewBeaconBody(value: string, field: string = VIEW_FIELD): string {
  return JSON.stringify({ [field]: value });
}
