import type { AuditPage, LoadedPage } from "./audit-page";
import type { VoicePage } from "./voice-page";

/**
 * What a prospect's own address renders, decided in one place for both ways
 * in: /a/<token> (the token in the path) and /for/<slug> (the readable link,
 * whose links/<slug>.json names the token; voice build contract 8.4,
 * 2026-11-16). Both pages call chooseView with what loadPage gave them and
 * render the voice view through the same component (voice-view.tsx), so the
 * two addresses cannot drift apart.
 *
 * /for/ shows voice pages only (engineering default, 2026-11-16): the
 * pipeline writes links for voice pages alone, and an audit page's form, its
 * no-JavaScript reloads and its download all lead back to /a/<token>, so an
 * audit page behind a readable link would half work. Every other answer is
 * the same plain 404 /a/ gives.
 *
 * Pure: type imports only, so the node tests load it without a server.
 */

export type ProspectRoute = "a" | "for";

export type ProspectView =
  | { kind: "voice"; page: VoicePage }
  | { kind: "audit"; page: AuditPage }
  | { kind: "missing" };

/** The kinds of page each way in may show. */
export const ROUTE_SHOWS: Record<ProspectRoute, readonly LoadedPage["kind"][]> = {
  a: ["audit", "voice"],
  for: ["voice"],
};

export function chooseView(loaded: LoadedPage | null, route: ProspectRoute): ProspectView {
  if (!loaded || !ROUTE_SHOWS[route].includes(loaded.kind)) return { kind: "missing" };
  return loaded.kind === "voice" ? { kind: "voice", page: loaded.page } : { kind: "audit", page: loaded.page };
}
