/**
 * The site's words that aren't tier contents (rebuilt 2026-11-04, for the
 * digital strategy partner positioning). Tier contents, statuses and prices live
 * in src/lib/tiers.ts.
 *
 * ============================================================================
 * DRAFT: FOR BLAKE TO CONFIRM BEFORE THIS BRANCH SHIPS.
 * Everything marked `TODO(Blake)` or `DRAFT` below is wording he has not signed
 * off. The gate is real: a Vercel production build fails until
 * `offerCopyConfirmed` is true in src/lib/launch-gate.json.
 *
 * Proof rule: Devize has no client on record. Nothing in this file may say or
 * imply otherwise. No testimonial, logo, client count, case study, result,
 * percentage lift, award or years in business, unless a file proves it. No rank
 * and no date. Google Partner status, certification, ads experience and ads
 * results are never claimed.
 * ============================================================================
 */

export const EMAIL = "admin@devize.ai";

// ---------------------------------------------------------------------------
// Positioning
// ---------------------------------------------------------------------------

/**
 * The label, lower case in running text: it describes what Devize is and is not
 * a brand name (an unrelated firm trades as "Digital Strategy Partners"; no
 * trademark search was run). Only /what-we-do explains what "partner" means.
 * Keep it away from Google Ads, where "partner" can read as Google's program.
 * "Digital Transformation Company" stays off the site.
 */
export const LABEL = "digital strategy partner";

/**
 * The core mission (Blake, 2026-11-04). His exact words: the only place this
 * wording lives. It states a purpose, so never present it as a promised result.
 */
export const MISSION =
  "Helping B2C service businesses convert clicks into clients without adding headcount.";

/** The plain gloss that sits under MISSION wherever an owner may not know "B2C". */
export const MISSION_NOTE =
  "B2C just means you sell to people, not to other companies. This is what we work toward. It's a purpose, not a promised result.";

/**
 * TODO(Blake): clear this name before launch. "BookingOS" is already used by other
 * products: a vacation-rental product on Capterra and a German live-booking tool.
 * Nobody has searched the trademark register. Change it here and it changes
 * everywhere it shows.
 * TODO(Blake): your word "bespoke" is held back. The requirements note says it only
 * holds if each client's setup is really built for them. The site says "set up
 * around each business" instead. Say the word if that's true and you want it.
 */
export const BOOKING_OS = "BookingOS";

// ---------------------------------------------------------------------------
// What stays yours
// ---------------------------------------------------------------------------

/**
 * Replaces "keep everything we built", which isn't true as written: on-page fixes
 * run in the tool's own layer and may stop working when the service stops
 * (search-atlas.md section 1).
 * TODO(Blake): you must choose. Either write fixes directly into each client's
 * site, in which case this can get stronger, or keep this wording. Exporting the
 * fixes and writing them in at the end costs about 2 to 4 hours a client.
 */
export const KEEP_PROMISE =
  "Your listing, reviews, ad account, website and every page and post we publish on it stay yours. On-site fixes that run through our tools can stop when the service stops, unless they have been written into your site.";

// ---------------------------------------------------------------------------
// The free audit
// ---------------------------------------------------------------------------

export const AUDIT_NAME = "Free Google Listing and Map Audit";

/**
 * Where the rival comparison runs. Real scans exist for Houston and Dallas
 * (dental and HVAC) and San Antonio (dental). Keep in step with the scraper's
 * market.py and metros.json.
 */
export const COVERAGE = {
  today:
    "The audit's rival comparison runs today for dental and HVAC, in the areas we've scanned: Houston and Dallas for both, San Antonio for dental.",
  others:
    "For any other trade or area, we'll tell you up front that your comparison waits until we have the data.",
} as const;

export const AUDIT_COUNTS: { count: string; title: string; detail: string }[] = [
  {
    count: "2",
    title: "searches your customers really run",
    detail: "Like \"dentist\" and \"dentist near me\", each one on a phone, from dozens of spots around your business.",
  },
  {
    count: "3",
    title: "marks on every search",
    detail: "In the top three, fourth to twentieth, or nowhere in the first twenty.",
  },
  {
    count: "3",
    title: "businesses that came up most instead",
    detail: "Who they are, how they're rated, and how many searches they took.",
  },
  {
    count: "21",
    title: "checks on what Google and your customers can see",
    detail: "On your map results, your Google listing, your reviews and your website.",
  },
  {
    count: "1",
    title: "list of fixes, in order",
    detail: "What we'd do first, and why. You can do them yourself, hire us, or do nothing.",
  },
];

// ---------------------------------------------------------------------------
// What "partner" means. Printed on /what-we-do and nowhere else.
// ---------------------------------------------------------------------------

export const PARTNER_MEANS: { title: string; detail: string }[] = [
  {
    title: "A person to reach",
    // TODO(Blake): who do people reach? Blake is named on the site, and cold mail
    // goes out as Blake, Conner and Jaden. Say what the roles are, and whether
    // Conner and Jaden get a line. No "team" claim until then.
    detail: "A name and an email, in plain words. Not a portal and not a queue.",
  },
  {
    title: "A plan that says what not to buy",
    detail:
      "A short written plan: what to fix first and what to leave alone. That includes our own tiers, when one isn't worth it for you.",
  },
  {
    title: "Your accounts in your name",
    detail: `You add us, and you can remove us any time. ${KEEP_PROMISE}`,
  },
  {
    title: "Notes with counts",
    detail: "Each month, one page: what was done, counted, what's next, and what we still don't know.",
  },
];

export const NOT_INVESTOR =
  "Not an investor. In dentistry and veterinary work the word can mean selling a stake in your practice. We don't buy into businesses.";
export const NOT_GOOGLE =
  "Not Google. Devize is independent. We don't work for Google, and we're not a Google Partner.";

// ---------------------------------------------------------------------------
// The first 30 days (order of work, never a promised result)
// ---------------------------------------------------------------------------

// TODO(Blake): publishing this makes it a commitment. Only keep it if you will
// really do it, in this order, for every client.
export const FIRST_30_DAYS: { title: string; detail: string }[] = [
  {
    title: "The audit",
    detail: "We run the full audit against the businesses leading your map, and hand it to you.",
  },
  {
    title: "Access",
    detail:
      "You add us as a manager on your Google listing and tell us who runs your site. We write down who holds every account.",
  },
  {
    title: "One call",
    detail:
      "We ask for the numbers only you can see: calls, bookings and Google's own report. We agree the first fixes and what to leave alone, and you get it on one page.",
  },
  {
    title: "First fixes",
    detail:
      "On-site fixes, any wrong facts on your listing, and your review reply wording. Health and legal practices get their extra checks first.",
  },
  {
    title: "First note",
    detail: "One page: what was done, what's next and what we can't promise.",
  },
];

// ---------------------------------------------------------------------------
// What we won't promise, and what we won't do. Printed on /what-we-do only.
// ---------------------------------------------------------------------------

export const WONT_PROMISE: { title: string; detail: string }[] = [
  {
    title: "No rank",
    detail:
      "Nobody controls Google's map, and Google says you can't pay for a better local ranking. Be careful with anyone who promises a spot.",
  },
  {
    title: "No date",
    detail:
      "We can tell you the order of the work. We can't tell you when, or if, a place on the map will change.",
  },
  {
    title: "No lead count",
    detail:
      `No number of calls, leads, booked jobs or customers, from the map, from ads or from ${BOOKING_OS}. No cost per lead and no ad position either.`,
  },
  {
    title: "No AI answer naming you",
    detail:
      "Nobody outside these companies sees exactly how they choose. We keep your facts plain in the places they may read, and we don't track AI answers yet.",
  },
  {
    title: "No fake reviews",
    detail:
      "No fake or paid reviews, and no asking only your happy customers. Google bars them, and the FTC bans fake reviews.",
  },
  {
    title: "No long contract",
    detail: "Month to month. Cancel any time, and it ends with the month you've paid for.",
  },
];

// ---------------------------------------------------------------------------
// Numbers from Devize's own searches. These are about the method, never about a
// result for anyone. TODO(Blake): publish these? The research defaults to yes,
// with date and basis, and an older note kept them internal.
// ---------------------------------------------------------------------------

export const SEARCH_COUNT = {
  line: "More than 5,000 Google map searches in Houston, Dallas and San Antonio since September 2026.",
  // Source: scraper logs/dataforseo, counted by file name on 2026-11-04 (truth.md section 5).
  basis:
    "Counted from our own search logs on 4 November 2026: 5,562 searches for dentists and HVAC, dated 18 September to 4 November. Houston 3,668, Dallas 1,444, San Antonio 450. The count includes repeat scans of the same spots, and a few could be failed reads.",
} as const;

export const DISTANCE_RATES = {
  title: "How often a listing reached the top three, by how far away the searcher was",
  // Source: store_stats.md, 1,288 searches, Monday 12 October 2026 (truth.md section 5).
  rows: [
    { distance: "Under a quarter mile", rate: "56.8%" },
    { distance: "Half a mile to a mile", rate: "26.7%" },
    { distance: "2 to 3 miles", rate: "4.0%" },
    { distance: "4 to 6 miles", rate: "0.52%" },
  ],
  basis:
    "Houston dental listings, from 1,288 searches on one Monday, 12 October 2026. It compares different listings at different distances. It proves no cause, and it's a rate, not anyone's result. Our Dallas scans show the same order.",
} as const;

export const WHAT_DOESNT_WORK: { title: string; detail: string }[] = [
  {
    title: "Places shift on their own",
    // Source: paid_treatment_search_scan section 1, one practice's scans (truth.md section 6).
    detail:
      "In one set of our scans around one practice, a quarter to a third of top-three places changed within about three weeks, with no edit we know of. So a move on a map isn't proof that anything worked, and our note won't claim it is.",
  },
  {
    title: "Replies, posts, photos and links didn't explain one practice's gap",
    // Used without a name, as one practice, per truth.md section 5. Not a client.
    detail:
      "We looked closely at one dental practice, which is not a client. Those four things did not explain why it sat behind the leaders. That's one practice, and small effects aren't ruled out. We still write replies and posts, because they help people choose you. We don't sell them as map work.",
  },
  {
    title: "Town pages with the name swapped",
    detail:
      "We don't sell them. They give a reader nothing, and Google's spam rules name pages aimed at specific cities that funnel people to one place as doorway abuse.",
  },
];

// ---------------------------------------------------------------------------
// Founder. Name and photo are decided (2026-10-15). No invented bio facts: no
// years, team size or titles.
// ---------------------------------------------------------------------------

export const FOUNDER = {
  name: "Blake McGuire",
  initials: "BM",
  town: "Willis, Texas",
  townShort: "Willis, TX",
  /**
   * TODO(Blake): supply the photo. Dropped into public/ this file replaces the
   * initials avatar with no code change (the check runs when the page is built).
   * Use a square or portrait photo at least 256px wide: it is shown as a cropped
   * circle. Also supply two or three true facts, and a LinkedIn link if you want
   * one.
   */
  photoFile: "blake.jpg",
  /** The line by the call to action. Replaces "I run every audit myself". */
  chip: "Blake McGuire runs Devize.",
  // TODO(Blake): this is draft wording in your voice. Facts only. It says "I"
  // because it is your own block, and the rest of the site says "we". Never "team"
  // or "I run every audit": the pipeline builds audits and a person presses Send.
  bio: [
    "I run Devize. A service business can pay for every click and still lose the customer at the phone, and most owners never see it happen.",
    "I'll show you where that's happening, tell you what I'd fix and what I'd skip, and say what nobody can promise.",
  ],
  // The brief's line, in full: "Devize is new, so there are no client stories
  // here. Judge us by the sample, the price and the terms." The last three go on
  // as links in founder.tsx.
  newLine: "Devize is new, so there are no client stories here. Judge us by",
} as const;
