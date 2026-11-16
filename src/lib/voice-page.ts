/**
 * The voice demo page: audits/<token>/page.json of kind "voice", and the
 * clock pick the mint route makes at the moment of the click.
 *
 * What it is for: the pipeline writes one page.json per prospect ahead of the
 * email (voice build contract, section 5, 2026-11-15). It carries every call
 * variable that does not depend on the time, plus a seven-day table of the
 * business's open spans, each day's arrival windows and the two spoken lines
 * that depend on the clock. At the click the site works out the local weekday
 * and minute in the business's own timezone and fills the three clock keys
 * from that table, so a link built on a Monday and pressed on a Thursday
 * still says the right day.
 *
 * Who decided what: the page shape, the three clock keys and the pick rule
 * are the build contract's. The engineering defaults in this file (how strict
 * the reader is, an overnight span carrying into the next morning, how a
 * date-only expiry is read) were taken on 2026-11-15 with nobody to ask; each
 * is a named constant below.
 *
 * The day's windows (the same night's consistency pass): the pipeline's page
 * writer (voice_pages.py, voice_slots.clock_days) stores each weekday's
 * arrival windows as [start, end, words] beside the two pairs, and stores the
 * same pair twice (the next open day), because one stored pair cannot know
 * the minute of the click. So the windows are read first here: those of
 * today that have not ended are offered as "today", and the stored pair
 * speaks only when none is left. That is what the pipeline's own
 * voice_slots.slots() says at every minute; a page written without the key
 * is read by the pairs alone, as before.
 *
 * Pure functions: no server or browser APIs and no imports, so the page
 * loader, the route handlers and the node tests all share this file.
 */

/** The trades a voice page may carry (contract section 2). */
export const VOICE_TRADES = ["dental", "hvac", "plumbing"] as const;
export type VoiceTrade = (typeof VOICE_TRADES)[number];

/** The three variables set at the click, never stored in page.json. */
export const CLOCK_KEYS = ["after_hours", "next_open_day", "appt_windows"] as const;
export type ClockKeys = { after_hours: "yes" | "no"; next_open_day: string; appt_windows: string };

/** The session API takes at most this many variables, all of them scalars. */
export const MAX_SESSION_VARS = 50;
/** So page.json may hold at most this many: the clock keys are added at the click. */
export const MAX_STATIC_VARS = MAX_SESSION_VARS - CLOCK_KEYS.length;
/** The pipeline clips every value at 300 characters; anything far past that is not ours. */
export const MAX_VAR_CHARS = 1000;
export const MAX_BUSINESS_CHARS = 200;
/** A variable name as the pipeline writes them (business_name, lead_token). */
const VAR_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;

/** A day has at most this many open spans (a lunch break makes two). */
export const MAX_SPANS_PER_DAY = 6;
/** What next_open_day says while a window of today has not ended (voice_slots.py says the same word). */
export const TODAY_WORD = "today";
const DAY_MINUTES = 1440;
/** An overnight span may end past midnight, but never past the end of the next day. */
const MAX_SPAN_END = 2 * DAY_MINUTES;

/**
 * A span that runs past midnight (end over 1440) also counts as open for the
 * first hours of the next day: a listing open Monday 6 PM to 2 AM is open at
 * 1 AM on Tuesday. Engineering default, 2026-11-15. Set false to read the
 * contract's "a span of day w contains m" by the letter.
 */
export const OVERNIGHT_CARRIES_OVER = true;

/**
 * A date-only expires_at ("2026-12-30") is good through the end of that day
 * in this timezone, the same day the demo caps count by. A full timestamp is
 * that instant. Engineering default, 2026-11-15.
 */
export const EXPIRY_DAY_TZ = "America/Chicago";

export type DayPick = { next_open_day: string; appt_windows: string };

/** One arrival window of a day: start and end in local minutes from midnight, and the words to say. */
export type VoiceWindow = [number, number, string];

export type VoiceDay = {
  /** Open spans in local minutes from midnight; [] when the listing says closed; null when unknown. */
  spans: Array<[number, number]> | null;
  /** The day's arrival windows in the order of the day; [] on a closed or unknown day, or when the page has none. */
  windows: VoiceWindow[];
  /** What to say while the day's last span has not ended. Null only on a day with no spans. */
  before_close: DayPick | null;
  /** What to say after the last span ends, and all day on a closed or unknown day. */
  after_close: DayPick;
};

export type VoiceDemo = {
  /** Every call variable that does not depend on the clock. Never sent to the browser. */
  vars: Record<string, string>;
  /** The business's IANA timezone. */
  tz: string;
  /** Seven entries; index 0 is Monday. */
  days: VoiceDay[];
};

export type VoicePage = {
  v: 1;
  kind: "voice";
  token: string;
  /** The one name the email and the demo both use (company_said). */
  business: string;
  city: string;
  state: string;
  trade: VoiceTrade;
  persona: string;
  sample: boolean;
  expires_at: string;
  demo: VoiceDemo;
};

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === "string" && x.trim().length > 0;

/** "voice" for a page.json that says so, "audit" for every other document (the audit pages carry no kind). */
export function pageKind(raw: unknown): "voice" | "audit" {
  return isObj(raw) && raw.kind === "voice" ? "voice" : "audit";
}

/** True when the runtime knows this IANA timezone name. */
export function validTimeZone(tz: unknown): tz is string {
  if (!isStr(tz) || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * The wall clock in a timezone at an instant: weekday (0 is Monday), minute
 * of the day (0 to 1439) and the calendar date. Intl does the offset, so a
 * daylight saving change is already in the answer.
 */
export function localClock(tz: string, now: Date): { weekday: number; minute: number; date: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = WEEKDAYS.indexOf(get("weekday"));
  // Some engines print midnight as 24 under a 24-hour cycle.
  const hour = Number(get("hour")) % 24;
  const minute = hour * 60 + Number(get("minute"));
  if (weekday < 0 || !Number.isFinite(minute)) throw new Error("voice-page: unreadable local clock");
  return { weekday, minute, date: `${get("year")}-${get("month")}-${get("day")}` };
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Whether a page's expires_at has passed: true, false, or null when the value
 * cannot be read as a date at all (the reader treats that as a bad page).
 */
export function voiceExpired(expiresAt: unknown, now: Date): boolean | null {
  if (!isStr(expiresAt)) return null;
  const s = expiresAt.trim();
  const m = DATE_ONLY.exec(s);
  if (m) {
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const real = new Date(Date.UTC(y, mo - 1, d));
    if (real.getUTCFullYear() !== y || real.getUTCMonth() !== mo - 1 || real.getUTCDate() !== d) return null;
    return localClock(EXPIRY_DAY_TZ, now).date > s;
  }
  const at = Date.parse(s);
  if (!Number.isFinite(at)) return null;
  return at < now.getTime();
}

/** Why a page was refused. Words for the pipeline's own checks and logs, never shown to a visitor. */
class PageFault extends Error {}

function need(ok: unknown, why: string): asserts ok {
  if (!ok) throw new PageFault(why);
}

function readPick(raw: unknown, where: string): DayPick {
  need(isObj(raw), `${where} must be an object with next_open_day and appt_windows`);
  for (const key of ["next_open_day", "appt_windows"] as const) {
    need(isStr(raw[key]), `${where}.${key} is missing or blank`);
    need((raw[key] as string).length <= MAX_VAR_CHARS, `${where}.${key} is longer than ${MAX_VAR_CHARS} characters`);
  }
  return { next_open_day: (raw.next_open_day as string).trim(), appt_windows: (raw.appt_windows as string).trim() };
}

function readSpans(raw: unknown, where: string): Array<[number, number]> | null {
  if (raw === null) return null;
  need(Array.isArray(raw), `${where} must be a list of [start, end] pairs, [] for closed, or null for unknown`);
  need(raw.length <= MAX_SPANS_PER_DAY, `${where} has more than ${MAX_SPANS_PER_DAY} spans`);
  const out: Array<[number, number]> = [];
  for (const span of raw as unknown[]) {
    need(Array.isArray(span) && span.length === 2, `${where}: each span is a [start, end] pair`);
    const [start, end] = span as unknown[];
    need(Number.isInteger(start) && Number.isInteger(end), `${where}: span minutes must be whole numbers`);
    need(
      (start as number) >= 0 && (start as number) < DAY_MINUTES,
      `${where}: a span must start between 0 and ${DAY_MINUTES - 1} minutes`,
    );
    need(
      (end as number) > (start as number) && (end as number) <= MAX_SPAN_END,
      `${where}: a span must end after it starts and by minute ${MAX_SPAN_END}`,
    );
    out.push([start as number, end as number]);
  }
  return out;
}

/**
 * A day's arrival windows: [start, end, words] entries inside the day (0 to
 * 1440 minutes), with words to say. Absent or null is [] (a page written
 * before the key existed). A window on a day with no open spans is a fault:
 * "today" would be offered on a day the listing says is closed or does not
 * give. Said together the words must fit one variable, which also bounds how
 * many there can be. Every rule here is one the pipeline's own check
 * (voice_pages.check_page) already holds a page to before it is uploaded.
 */
function readWindows(raw: unknown, spans: Array<[number, number]> | null, where: string): VoiceWindow[] {
  if (raw === undefined || raw === null) return [];
  need(Array.isArray(raw), `${where} must be a list of [start, end, words] entries, or []`);
  const out: VoiceWindow[] = [];
  for (const entry of raw as unknown[]) {
    need(Array.isArray(entry) && entry.length === 3, `${where}: each window is a [start, end, words] entry`);
    const [start, end, words] = entry as unknown[];
    need(Number.isInteger(start) && Number.isInteger(end), `${where}: window minutes must be whole numbers`);
    need(
      (start as number) >= 0 && (end as number) > (start as number) && (end as number) <= DAY_MINUTES,
      `${where}: a window must start at 0 or later, end after it starts and end by minute ${DAY_MINUTES}`,
    );
    need(isStr(words), `${where}: a window needs words to say`);
    out.push([start as number, end as number, words.trim()]);
  }
  need(out.length === 0 || (spans !== null && spans.length > 0), `${where} offers a window on a day with no open spans`);
  need(
    out.map((w) => w[2]).join(", ").length <= MAX_VAR_CHARS,
    `${where} said together is longer than ${MAX_VAR_CHARS} characters`,
  );
  return out;
}

function readDay(raw: unknown, where: string): VoiceDay {
  need(isObj(raw), `${where} must be an object`);
  need(raw.spans !== undefined, `${where}.spans is missing ([] for closed, null for unknown)`);
  const spans = readSpans(raw.spans, `${where}.spans`);
  const windows = readWindows(raw.windows, spans, `${where}.windows`);
  const after = readPick(raw.after_close, `${where}.after_close`);
  // before_close can only be reached on a day with spans, so it is required only there.
  const given = raw.before_close !== undefined && raw.before_close !== null;
  const before = given ? readPick(raw.before_close, `${where}.before_close`) : null;
  need(!spans || spans.length === 0 || before, `${where}.before_close is missing on a day that has spans`);
  return { spans, windows, before_close: before, after_close: after };
}

function readDays(raw: unknown): VoiceDay[] {
  // An object keyed "0" to "6" (the contract), or the same seven as a list.
  need(!!raw && typeof raw === "object", "demo.days is missing");
  const table = raw as Record<string, unknown>;
  const keys = Object.keys(table);
  need(
    keys.length === 7 && keys.every((k) => /^[0-6]$/.test(k)),
    "demo.days must have exactly the seven keys 0 to 6 (0 is Monday)",
  );
  return Array.from({ length: 7 }, (_, i) => readDay(table[String(i)], `demo.days.${i}`));
}

function readVars(raw: unknown): Record<string, string> {
  need(isObj(raw), "demo.vars is missing");
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    need(VAR_NAME.test(key), `demo.vars has a key that is not a plain variable name: ${JSON.stringify(key.slice(0, 40))}`);
    need(typeof value === "string", `demo.vars.${key} must be a string`);
    need(value.length <= MAX_VAR_CHARS, `demo.vars.${key} is longer than ${MAX_VAR_CHARS} characters`);
    // The clock keys are set at the click; a stored copy would be stale, so it is dropped.
    if ((CLOCK_KEYS as readonly string[]).includes(key)) continue;
    out[key] = value;
  }
  need(
    Object.keys(out).length <= MAX_STATIC_VARS,
    `demo.vars has more than ${MAX_STATIC_VARS} variables (the session takes ${MAX_SESSION_VARS}, three are set at the click)`,
  );
  return out;
}

/** An optional string field: absent is "", any other type is a fault. */
function readOptional(raw: Record<string, unknown>, key: string): string {
  const value = raw[key];
  if (value === undefined || value === null) return "";
  need(typeof value === "string", `${key} must be a string when present`);
  need(value.length <= MAX_BUSINESS_CHARS, `${key} is longer than ${MAX_BUSINESS_CHARS} characters`);
  return value.trim();
}

/**
 * An optional yes or no: true and false, and also 1 and 0, because the
 * pipeline's voice_pages table holds its flags as integers and a writer may
 * pass the column straight through. Absent or null is false. Anything else
 * is null (a fault): a word like "yes" is not guessed at.
 */
function readFlag(value: unknown): boolean | null {
  if (value === undefined || value === null || value === false || value === 0) return false;
  if (value === true || value === 1) return true;
  return null;
}

function readVoicePage(raw: unknown, token: string, now: Date): VoicePage {
  need(isObj(raw), "page.json is not an object");
  need(raw.v === 1, "v must be 1");
  need(raw.kind === "voice", 'kind must be "voice"');
  need(!!token && raw.token === token, "token is not the token of the page's own path");
  const expired = voiceExpired(raw.expires_at, now);
  need(expired !== null, "expires_at is missing or is not a date (YYYY-MM-DD or a full timestamp)");
  need(expired === false, "the page has expired (expires_at is in the past)");

  need(isStr(raw.business), "business is missing or blank");
  const business = raw.business.trim();
  need(business.length <= MAX_BUSINESS_CHARS, `business is longer than ${MAX_BUSINESS_CHARS} characters`);
  const trade = VOICE_TRADES.find((t) => t === raw.trade);
  need(trade, `trade must be one of ${VOICE_TRADES.join(", ")}`);
  const city = readOptional(raw, "city");
  const state = readOptional(raw, "state");
  const persona = readOptional(raw, "persona");
  const sample = readFlag(raw.sample);
  need(sample !== null, "sample must be true or false (or 1 or 0) when present");

  need(isObj(raw.demo), "demo is missing");
  const vars = readVars(raw.demo.vars);
  // One name: what the page shows is what the receptionist says.
  need(
    typeof vars.business_name === "string" && vars.business_name.trim() === business,
    "demo.vars.business_name must be the same string as business",
  );
  need(vars.lead_token === token, "demo.vars.lead_token must be the page token");
  need(vars.demo_mode === "yes", 'demo.vars.demo_mode must be "yes"');
  const tz = raw.demo.tz;
  need(validTimeZone(tz), "demo.tz is missing or is not a timezone name this server knows");
  const days = readDays(raw.demo.days);

  return {
    v: 1,
    kind: "voice",
    token,
    business,
    city,
    state,
    trade,
    persona,
    sample,
    expires_at: (raw.expires_at as string).trim(),
    demo: { vars, tz: tz.trim(), days },
  };
}

/**
 * A voice page from its page.json, or the first thing wrong with it.
 *
 * Refused: the wrong kind or version, another token, a missing or expired
 * expires_at, a trade outside the three, a name that is not the same string
 * in the page and in the call variables, a lead_token that is not this
 * page's token, demo_mode other than "yes", an unknown timezone, or a day
 * table that is not seven well-formed days. Strict on purpose: a page that
 * fails here shows the plain 404 and can never start a call with half-right
 * details. The fault is a sentence for the pipeline (npm run check:voice-page
 * prints it); a visitor never sees it.
 *
 * `token` is the token from the URL, already checked by validToken.
 */
export function checkVoicePage(
  raw: unknown,
  token: string,
  now: Date,
): { ok: true; page: VoicePage } | { ok: false; fault: string } {
  try {
    return { ok: true, page: readVoicePage(raw, token, now) };
  } catch (err) {
    if (err instanceof PageFault) return { ok: false, fault: err.message };
    throw err;
  }
}

/** A voice page from its page.json, or null when checkVoicePage finds anything wrong with it. */
export function parseVoicePage(raw: unknown, token: string, now: Date): VoicePage | null {
  const checked = checkVoicePage(raw, token, now);
  return checked.ok ? checked.page : null;
}

/**
 * The three clock keys for one instant (contract section 5). Local time in
 * the page's timezone gives weekday w and minute m. after_hours is "no" when
 * a span of day w contains m (or, with OVERNIGHT_CARRIES_OVER, when the day
 * before ran past midnight and has not ended yet), else "yes".
 *
 * The two spoken lines: the windows of day w that end after m are offered as
 * "today", their words joined with ", " (what the pipeline's own
 * voice_slots.slots() says at that minute). When none is left, or the page
 * carries no windows, they come from before_close while day w has spans and
 * m is before the end of its last one, else from after_close.
 */
export function clockKeys(demo: VoiceDemo, now: Date): ClockKeys {
  const { weekday: w, minute: m } = localClock(demo.tz, now);
  const today = demo.days[w];
  const spans = today.spans ?? [];
  let open = spans.some(([start, end]) => start <= m && m < end);
  if (!open && OVERNIGHT_CARRIES_OVER) {
    const before = demo.days[(w + 6) % 7].spans ?? [];
    open = before.some(([start, end]) => end > DAY_MINUTES && start <= m + DAY_MINUTES && m + DAY_MINUTES < end);
  }
  const after_hours = open ? "no" : "yes";
  const left = (today.windows ?? []).filter(([, end]) => end > m);
  if (left.length > 0) {
    return { after_hours, next_open_day: TODAY_WORD, appt_windows: left.map(([, , words]) => words).join(", ") };
  }
  const lastEnd = spans.reduce((latest, [, end]) => Math.max(latest, end), -1);
  const pick = spans.length > 0 && m < lastEnd && today.before_close ? today.before_close : today.after_close;
  return { after_hours, next_open_day: pick.next_open_day, appt_windows: pick.appt_windows };
}

/** Everything the session gets: the stored variables plus the three clock keys for this instant. */
export function sessionVariables(page: VoicePage, now: Date): Record<string, string> {
  const variables = { ...page.demo.vars, ...clockKeys(page.demo, now) };
  if (Object.keys(variables).length > MAX_SESSION_VARS) throw new Error("voice-page: too many session variables");
  return variables;
}
