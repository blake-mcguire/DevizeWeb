/**
 * Where the view beacon (view-beacon.tsx) reports an open by default, and
 * what it sends, kept apart from the component so node's own test runner can
 * pin them and send the body to the routes in-process (fixer, 2026-11-16,
 * after the review: the audit page, /a/<token> and /for/<slug> all rely on
 * these defaults, and nothing tested them).
 *
 * The opt-out page (/u/<token>) passes its own pair instead
 * (voice-link.OPTOUT_VIEW_ENDPOINT and OPTOUT_VIEW_KEY), so a visit there is
 * never counted as a demo or audit view, and the two once-per-session keys
 * never hold each other back.
 */

/** The audit and voice pages' view route. */
export const VIEW_ENDPOINT = "/api/audit-view";

/** The once-per-session key prefix; the token is appended. */
export const VIEW_KEY = "devize_view_";

/** The beacon's body, whichever route it goes to. */
export function viewBeaconBody(token: string): string {
  return JSON.stringify({ token });
}
