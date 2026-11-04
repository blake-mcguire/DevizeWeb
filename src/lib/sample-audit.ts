import type { MarkKey } from "@/lib/marks";

/**
 * The public sample audit, on INVENTED data (2026-11-04, the brief: "rebuilt on
 * invented data, marked SAMPLE on every page"). The business, its rivals and
 * every number are made up. Nothing here comes from a real scan, because taking
 * a name off a real one isn't enough: the pattern of pins and the nearby rivals
 * can still identify a business. The earlier sample, built from a real scan, is
 * gone from this branch (public/sample/ and src/data/sample.json).
 *
 * Never put a real prospect's name, town, numbers or map here.
 *
 * TODO(Blake): the sample shows the close layout, 81 spots a mile apart within 5
 * miles, which the audit document supports (gbp_grid.py --close) and the research
 * prefers. The audits going out today often use the wider 2-mile grid within 10
 * miles. If that stays the standard, change RADIUS_MI and SPACING_MI to match.
 */

export const SAMPLE_NOTE =
  "An invented business with invented numbers. It shows what an audit looks like. It is nobody's result.";

const RADIUS_MI = 5;
const SPACING_MI = 1;

export type SampleSpot = { x: number; y: number; miles: number; mark: MarkKey };

/**
 * Invented, and fixed: the same pins on every build. A small, repeatable wobble
 * keeps the rings from looking drawn with a compass, and the west side does a
 * little better than the east, the way a real map often isn't even.
 */
function markAt(x: number, y: number, phrase: number): MarkKey {
  const miles = Math.hypot(x, y) * SPACING_MI;
  const wobble = ((((x * 7 + y * 13 + phrase * 5) % 11) + 11) % 11) - 5;
  const reach = miles + wobble * 0.11 + x * 0.1;
  if (reach <= 1.35) return "top3";
  if (reach <= 3.3) return "mid";
  return "absent";
}

function spotsFor(phrase: number): SampleSpot[] {
  const spots: SampleSpot[] = [];
  const steps = Math.round(RADIUS_MI / SPACING_MI);
  for (let y = -steps; y <= steps; y++) {
    for (let x = -steps; x <= steps; x++) {
      const miles = Math.hypot(x, y) * SPACING_MI;
      if (miles <= RADIUS_MI + 1e-9) spots.push({ x, y, miles, mark: markAt(x, y, phrase) });
    }
  }
  return spots;
}

const firstPhrase = spotsFor(0);
const secondPhrase = spotsFor(1);

function count(mark: MarkKey): number {
  return [...firstPhrase, ...secondPhrase].filter((s) => s.mark === mark).length;
}

const totals = { top3: count("top3"), mid: count("mid"), absent: count("absent") };
const searches = firstPhrase.length + secondPhrase.length;

export const SAMPLE = {
  business: "Sample Dental Practice",
  phrases: ["dentist", "dentist near me"],
  drawnPhrase: "dentist",
  spots: firstPhrase,
  spotCount: firstPhrase.length,
  radiusMi: RADIUS_MI,
  spacingMi: SPACING_MI,
  searches,
  totals,
  /** Invented. Each row is one search phrase times the same spots. */
  whoCameUp: [
    { name: "Practice A", stars: 4.8, reviews: 612, top3: 74 },
    { name: "Practice B", stars: 4.6, reviews: 340, top3: 61 },
    { name: "Practice C", stars: 4.9, reviews: 205, top3: 47 },
    { name: "Sample Dental Practice", stars: 4.7, reviews: 86, top3: totals.top3, isSample: true },
  ],
};

export type CheckResult = "pass" | "gap" | "part";

/** Invented results for the 21 checks, in the order of AUDIT_CHECKS. */
export const SAMPLE_CHECKS: { group: string; rows: { check: string; result: CheckResult; finding: string }[] }[] = [
  {
    group: "The map",
    rows: [
      {
        check: "In the top three where people search",
        result: "gap",
        finding: `${totals.top3} of ${searches} searches, almost all within about a mile of the office.`,
      },
    ],
  },
  {
    group: "The Google listing",
    rows: [
      { check: "The right main category", result: "pass", finding: "Dentist." },
      { check: "Extra categories, next to the leaders", result: "part", finding: "1 extra category. The leaders show 2 or 3." },
      { check: "Verified", result: "pass", finding: "Yes." },
      { check: "Rated 4.5 or better", result: "pass", finding: "4.7 stars." },
      { check: "20 or more reviews", result: "pass", finding: "86 reviews." },
      { check: "A review in the last 30 days", result: "pass", finding: "Last review 12 days before the scan." },
      { check: "A new review every month", result: "gap", finding: "No new review in 3 of the last 6 months." },
      { check: "Answers its reviews", result: "part", finding: "Replied to 31 of the last 50." },
      { check: "Answers within a week", result: "gap", finding: "Replies land about 10 days after the review." },
      { check: "Photos, next to similar businesses", result: "part", finding: "Fewer than the leaders, but in the same range." },
      { check: "A photo of its own in the last year", result: "gap", finding: "Newest owner photo is 2 years old." },
      { check: "Hours for all seven days", result: "pass", finding: "Set for all seven days." },
      { check: "A description", result: "pass", finding: "Present." },
      { check: "Posts", result: "gap", finding: "0 posts. Noted for the reader. We don't sell posts as a way up the map." },
      { check: "No customer question left unanswered", result: "pass", finding: "None open." },
    ],
  },
  {
    group: "The website",
    rows: [
      { check: "The listing opens a working site", result: "pass", finding: "Opens." },
      { check: "The site works on a phone", result: "pass", finding: "Works." },
      { check: "The site shows the same number as the listing", result: "gap", finding: "The site shows a different number." },
      { check: "The home page says what you do and where", result: "pass", finding: "It says both." },
      { check: "Pages that name services and towns", result: "part", finding: "Services are named. No page says much about any of them." },
    ],
  },
];

/** Invented, and in order: facts that lose a customer come before anything slow. */
export const SAMPLE_FIXES: string[] = [
  "Make the phone number on the site match the listing. It's wrong today, and it costs nothing to fix.",
  "Ask every patient for a review, the same way, after each visit. A privacy contract comes first.",
  "Reply to reviews within a week, without confirming anyone is a patient.",
  "Add a current photo of the office and the people in it.",
  "Write one better page, about the treatment the practice wants more of.",
];

/** Invented. This part comes from the one-page plan, after the audit and the call. */
export const SAMPLE_SKIPS: string[] = [
  "Directory packages. Check the main ones and correct them. Don't pay for hundreds.",
  "Town pages with the name swapped. They give a reader nothing.",
  "Posting just to post. A post is fine when there's news. It isn't map work.",
  "Google Ads, for now. Fix the phone number and the reviews before paying for clicks.",
];
