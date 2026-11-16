/**
 * The voice demo's spending caps and the blob paths they are counted from.
 *
 * What it is for: every demo call costs real minutes, and a link in a cold
 * email can be forwarded or opened by a scanner. So a session is minted only
 * on the button press, and only while three counts are under their caps.
 * There is no database on the site: each mint writes two small files to the
 * Blob store, and the counts are simply how many files sit under a prefix.
 *
 *   demos/<token>/<iso>-<rand>.json           one per minted session of a page
 *   demo-days/<YYYY-MM-DD>/<iso>-<rand>.json  one per minted session, by day
 *   calls/<iso>-<call id>-<tag>.json          one per finished call (webhook)
 *   demo-alerts/<YYYY-MM-DD>/<reason>.json    at most one per reason per day
 *
 * <iso> is UTC in basic ISO 8601 to the second (20261115T031500Z), the same
 * form blob-store.ts uses. The day is the calendar day in CAP_DAY_TZ. <tag>
 * is 32 hex characters only the webhook secret can make (call-tag.ts): the
 * store is public by path and a call's file holds a mobile number.
 *
 * Who decided what: the paths are the voice build contract's (section 5),
 * with two changes made by the overnight review on 2026-11-15 that the
 * contract has to take up: the <tag> in a call's name, and the demo-alerts
 * folder. The three numbers are engineering defaults taken on 2026-11-15
 * (contract section 2), not Blake's decision yet; they live here and nowhere
 * else.
 *
 * The caps are not strict when presses arrive side by side. A press counts
 * the markers, asks for the session, then writes its own marker, so presses
 * that overlap each see the count from before the others. One server
 * instance refuses a second press on a page while the first is in flight
 * (the mint route's inFlight), but two instances do not know of each other,
 * and neither do two different pages pressed together. A person pressing a
 * button will not do this; a script holding a link can. What then bounds it
 * is the vendor, as its documents read on 2026-11-15: 10 new sessions a
 * minute and 10 at once per account, and the assistant's own 7 minute limit
 * on a call (not yet confirmed for browser calls). That is about 70 call
 * minutes in one burst, more than half of a 120 minute month. Making the
 * caps strict needs a reserve marker written before the session is asked
 * for and removed when it is refused; the site has no delete on the store
 * yet, so that is left as a decision for Blake with the caps themselves.
 *
 * Pure functions, no imports: the mint route, the webhook route and the node
 * tests share this file.
 */

/** Sessions one page may start in one day, in its whole life, and all pages together in one day. */
export const DEMO_CAPS = { perPagePerDay: 3, perPageLife: 6, globalPerDay: 25 } as const;
export type DemoCaps = { perPagePerDay: number; perPageLife: number; globalPerDay: number };

/** The day the caps count by: the operator's, Central time. */
export const CAP_DAY_TZ = "America/Chicago";

export const DEMOS_PREFIX = "demos";
export const DEMO_DAYS_PREFIX = "demo-days";
export const CALLS_PREFIX = "calls";
export const DEMO_ALERTS_PREFIX = "demo-alerts";

/** A call id as it may appear in a blob name: letters, digits, underscore and hyphen. */
export const CALL_ID = /^[A-Za-z0-9_-]{1,64}$/;
/** The secret part of a call's file name: 32 lower-case hex characters (128 bits), made by call-tag.ts. */
export const CALL_TAG = /^[0-9a-f]{32}$/;

/** UTC in basic ISO 8601 to the second: 20261115T031500Z. */
export function isoCompact(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");
}

/** The calendar day (YYYY-MM-DD) of an instant in CAP_DAY_TZ. */
export function capDay(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CAP_DAY_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Where one page's session markers live. The trailing slash keeps one token from matching a longer one. */
export function demosPrefix(token: string): string {
  return `${DEMOS_PREFIX}/${token}/`;
}

/** Where one day's markers live, for every page together. */
export function demoDayPrefix(day: string): string {
  return `${DEMO_DAYS_PREFIX}/${day}/`;
}

/** rand is 32 hex characters (128 random bits), as in blob-store's eventPath. */
export function demoPath(token: string, at: Date, rand: string): string {
  return `${demosPrefix(token)}${isoCompact(at)}-${rand}.json`;
}

export function demoDayPath(at: Date, rand: string): string {
  return `${demoDayPrefix(capDay(at))}${isoCompact(at)}-${rand}.json`;
}

/**
 * Where one finished call is stored. `tag` is required and checked, so a
 * name made of only a time and a call id (both guessable) cannot be produced
 * by leaving it out.
 */
export function callPath(at: Date, callId: string, tag: string): string {
  if (typeof tag !== "string" || !CALL_TAG.test(tag)) throw new Error("demo-caps: a call path needs its 32 hex tag");
  return `${CALLS_PREFIX}/${isoCompact(at)}-${callId}-${tag}.json`;
}

const CALL_NAME = new RegExp(`^${CALLS_PREFIX}/\\d{8}T\\d{6}Z-(.+)$`);

/**
 * True when a stored pathname is this call's own file, under whatever time:
 * the whole name after the time must match, so call 777 is never taken for
 * a-777 or 1777.
 */
export function isCallFile(pathname: string, callId: string, tag: string): boolean {
  const m = CALL_NAME.exec(pathname);
  return !!m && m[1] === `${callId}-${tag}.json`;
}

/**
 * What the mint route tells the pipeline about, so it can text Blake: the
 * vendor says the minutes have run out ("balance"), or the all-pages daily
 * cap has been reached ("day_full"). Until either clears, every prospect who
 * presses the button is turned away.
 */
export type DemoAlert = "balance" | "day_full";

/** One fixed name per reason per day in CAP_DAY_TZ, so a hundred refused presses leave one file. */
export function demoAlertPath(at: Date, reason: DemoAlert): string {
  return `${DEMO_ALERTS_PREFIX}/${capDay(at)}/${reason}.json`;
}

const NAME_ISO = /(?:^|\/)(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z-[^/]*$/;

/** The instant in a marker's file name, or null when the name does not start with one. */
export function timeOfPath(pathname: string): Date | null {
  const m = NAME_ISO.exec(pathname);
  if (!m) return null;
  const at = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]));
  return Number.isFinite(at) ? new Date(at) : null;
}

export type CapCounts = { pageToday: number; pageLife: number; globalToday: number };

/**
 * The three counts, from the two listings.
 *
 * pagePaths is everything under demos/<token>/; dayPaths is everything under
 * demo-days/<today>/. Every file counts, whatever it is called: a marker
 * whose name cannot be read is counted as today's, so a strange file can only
 * ever make the page stricter, never looser.
 */
export function countCaps(pagePaths: readonly string[], dayPaths: readonly string[], now: Date): CapCounts {
  const today = capDay(now);
  let pageToday = 0;
  for (const p of pagePaths) {
    const at = timeOfPath(p);
    if (!at || capDay(at) === today) pageToday += 1;
  }
  return { pageToday, pageLife: pagePaths.length, globalToday: dayPaths.length };
}

export type CapReason = "page_life" | "page_day" | "day_full";

/**
 * Which cap is reached, or null when one more session may start. The page's
 * lifetime cap is named first (it will not clear), then its daily cap, then
 * the all-pages daily cap ("day_full": the visitor did nothing wrong, and
 * nothing changes until the next day in CAP_DAY_TZ, so it is not the same
 * answer as a vendor that is busy for a few minutes).
 */
export function capReached(counts: CapCounts, caps: DemoCaps = DEMO_CAPS): CapReason | null {
  if (counts.pageLife >= caps.perPageLife) return "page_life";
  if (counts.pageToday >= caps.perPagePerDay) return "page_day";
  if (counts.globalToday >= caps.globalPerDay) return "day_full";
  return null;
}

/**
 * A coarse class of the visitor's device for the session marker: enough to
 * tell a phone from a desk, never the user agent itself.
 */
export function uaClass(userAgent: string): "iphone" | "ipad" | "android" | "mac" | "windows" | "linux" | "other" {
  const ua = userAgent || "";
  if (/iPhone|iPod/i.test(ua)) return "iphone";
  if (/iPad/i.test(ua)) return "ipad";
  if (/Android/i.test(ua)) return "android";
  if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
  if (/Windows/i.test(ua)) return "windows";
  if (/Linux|CrOS|X11/i.test(ua)) return "linux";
  return "other";
}
