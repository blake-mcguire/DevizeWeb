/**
 * The offer's words and numbers, in one place (rebuilt 2026-11-04 for the
 * digital strategy partner positioning).
 *
 * ============================================================================
 * DRAFT: FOR BLAKE TO CONFIRM BEFORE THIS BRANCH SHIPS.
 * Decided by Blake on 2026-11-04, so NOT draft: $500 a month flat for SEO and
 * review management, and Google Ads as an optional add-on at $150 a month with
 * stated monthly deliverables. Ad spend is separate and the client pays it to
 * Google. Decided earlier and still standing: month to month, cancel any time
 * and keep everything we built, the free audit, name and photo near the call
 * to action.
 *
 * Everything marked `TODO(Blake)` or `DRAFT` below is wording or a quantity he
 * has not signed off. Change it here and it changes everywhere it shows.
 *
 * The gate is real: a Vercel production build fails until `offerCopyConfirmed`
 * is true in src/lib/launch-gate.json.
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
 * The lead label. Lower case on purpose: it describes what Devize is, and is
 * not a brand name (an unrelated firm trades as "Digital Strategy Partners";
 * no trademark search was run). "Digital Transformation Company" stays off the
 * site, per the brief.
 */
export const LABEL = "Digital strategy partner";
export const LABEL_FOR = `${LABEL} for service businesses`;

/**
 * What the label means. The brief: this sentence ALWAYS sits beside the label,
 * which alone names no work. Written in the second person on purpose: in the
 * first person, on a page, it reads as a quote from a client, and there are no
 * clients. TODO(Blake): the brief's own version is first person ("Someone I can
 * reach tells me..."). Second person is my change; keep or overrule.
 */
export const LABEL_PLAIN =
  "Someone you can reach tells you what to fix first and what to skip, does the work, and sends a short monthly note with counts. Everything stays in your name. You can leave any time.";

/**
 * The core mission (Blake, 2026-11-04). His exact words: the only place this
 * wording lives. It states a purpose, so never present it as a promised result.
 */
export const MISSION =
  "Helping B2C service businesses convert clicks into clients without adding headcount.";

/** The mission on an industry page, in the trade's own word. Still reads MISSION. */
export function missionFor(trade: string, word: string): string {
  return MISSION.replace("B2C service businesses", trade).replace("clients", word);
}

/** The plain gloss that sits under MISSION wherever an owner may not know "B2C". */
export const MISSION_NOTE =
  "B2C just means you sell to people, not to other companies. This is what we work toward. It's a purpose, not a promised result.";

// ---------------------------------------------------------------------------
// Price (Blake, 2026-11-04)
// ---------------------------------------------------------------------------

export const PRICE = {
  /** Dollars a month. Also feeds the Service Offer in the home page JSON-LD. */
  amount: 500,
  currency: "USD",
  display: "$500",
  headline: "$500 a month, flat.",
  service: "SEO and review management",
  term: "Month to month. Cancel any time.",
  audit: "The audit is free.",
  /**
   * TODO(Blake): is $500 per listing? An earlier note said "for this listing"
   * and multi-location is undecided. I have written one location as the
   * default, because the page must say something. A note also tied $500 to one
   * proposal, so confirm it is the public price.
   */
  scope: "Covers one location. More than one? Ask us.",
  /** One line by the call to action. */
  ctaLine: "If you want the monthly work: $500 a month, flat. Month to month. Cancel any time.",
  /** Blake, 2026-10-15: "Cancel any time and keep everything we built." Not draft. */
  keep: "Cancel any time and keep everything we built: your listing, your reviews and every page we write.",
  keepShort: "Keep everything we built if you leave: your listing, your reviews and every page we write.",
} as const;

// TODO(Blake): the $997 website rebuild is decided as a price but is not built,
// so the brief keeps it off the site. Add it back here once one dry run is done.

// ---------------------------------------------------------------------------
// What $500 buys each month
// ---------------------------------------------------------------------------

export type Purpose = "May help on the map" | "Helps people choose you" | "Protects you" | "Shows what happened";

export type WorkItem = {
  /** The count, printed large. */
  count: string;
  title: string;
  detail: string;
  /** What the item is for. Only one item is tagged as a map lever, on purpose. */
  purpose: Purpose;
};

// DRAFT: TODO(Blake): size these counts. Keep only what can be delivered every
// month for every client. Delivery has never been measured, so log the hours.
// Once confirmed, the Order template must list these same items and the fee
// (terms 3.1 points to this list). Posts and town pages are off the list: the
// research did not support either as map work.
export const MONTHLY_WORK: WorkItem[] = [
  {
    count: "1",
    title: "review request routine, kept running",
    // TODO(Blake): no review tool is chosen, and who pays for one is unanswered.
    // "Without your staff having to remember" depends on that tool existing.
    // Health practices need a privacy contract and their lawyer's answer first.
    detail:
      "Every customer gets asked after the visit, without your staff having to remember. No star screen, no paying for reviews, no asking only happy customers. Health practices need a privacy contract in place first.",
    purpose: "May help on the map",
  },
  {
    count: "Every",
    title: "new review answered within 2 business days",
    // The clock can only be ours if the sign-off is once, on the wording, and
    // not on each reply (FAQ and terms 3.4 say the same).
    detail:
      "In wording you sign off on once, at the start, so no reply waits on you. Never confirming someone is a patient or a customer.",
    purpose: "Helps people choose you",
  },
  {
    count: "1",
    title: "listing check and fixes",
    detail:
      "Categories, services, hours, photos, questions and your booking link, checked against the truth and corrected.",
    purpose: "Helps people choose you",
  },
  {
    count: "1",
    title: "facts check",
    detail:
      "Your name, phone, address and hours on your listing, your site and the main directories. Corrected where we can, with you claiming any that only the owner can change. AI answers read these same facts, so we keep them plain. We don't track AI answers yet.",
    purpose: "Helps people choose you",
  },
  {
    count: "1",
    title: "better page on your site",
    detail:
      "One page written or improved, in your own words, about work you want more of. If someone else runs your site, we send them the page.",
    purpose: "Helps people choose you",
  },
  {
    count: "1",
    title: "account and wording check",
    detail:
      "Who holds each account, whether your categories and claims are true, and any old copy of your site still online. We flag what looks risky. Your lawyer decides anything legal.",
    purpose: "Protects you",
  },
  {
    count: "1",
    title: "map re-run",
    // The re-run is by hand: no client record, schedule or report is built.
    detail:
      "The same searches from the same spots, on the same weekday, done by hand for now. Places can shift with no edits at all, so we look at nearby businesses that changed nothing, too.",
    purpose: "Shows what happened",
  },
  {
    count: "1",
    title: "one-page note",
    detail:
      "What got done, in counts. What's next, what we'd skip and what we still don't know. If you share your own numbers, like calls and bookings, we read those too.",
    purpose: "Shows what happened",
  },
];

// DRAFT
export const LEFT_OUT: string[] = [
  "Google Ads and ad spend, unless you add them below.",
  "New websites, and more than one page a month.",
  "Copy-paste town pages, and posts sold as a way up the map. If you have news, a post is fine for your readers.",
  // TODO(Blake): who pays for a review tool is unanswered.
  "Any review tool's cost, if one is needed. We agree it with you before it starts.",
  "Legal sign-off. We flag what looks risky. Your lawyer decides.",
  "Anything not on this list. It gets its own quote, or we tell you to skip it.",
];

// ---------------------------------------------------------------------------
// Google Ads add-on (Blake, 2026-11-04: "a tag on of 150 a month and it should
// have an actual deliverable"). The counts come from the research file
// documents/research/strategy-partner-2026-11-04/google-ads-scope.md.
// ---------------------------------------------------------------------------

export const GOOGLE_ADS = {
  /** Dollars a month, on top of PRICE. Also feeds the JSON-LD. */
  amount: 150,
  currency: "USD",
  display: "$150",
  title: "Google Ads management",
  headline: "$150 a month, added to the $500.",
  spend: "Ad spend is separate. You pay it straight to Google.",
  keep: "Cancel any time and keep everything we built: the account, the ad copy, the blocked search lists and the log.",
  // TODO(Blake): print as written? The scope file says to put it in every
  // proposal. Reword if you like, but keep all four facts in it.
  disclosure:
    "Devize has not run a client's Google Ads before. You are getting careful, counted work at a low price from someone learning on your account, inside the limits written here. We are not a Google Partner. We do not promise leads, costs or positions.",
  // TODO(Blake): confirm these limits. Above them, quote again.
  limits: [
    "1 search campaign",
    "1 service area",
    "Up to 2 services",
    "Up to about $1,500 a month in ad money",
    "In your own Google Ads account",
  ],
} as const;

// DRAFT: TODO(Blake): is this count the public version? "5 written and approved"
// is the promise, not "5 live". There is no quota on blocked searches, on purpose.
export const ADS_MONTHLY: { count: string; title: string; detail: string }[] = [
  {
    count: "5",
    title: "new lines of ad copy",
    detail:
      "4 headlines and 1 description, checked against a rule list and approved by you. The promise is 5 written and approved. They go live early in the month unless a test is running, and the report says so if they wait.",
  },
  {
    count: "2",
    title: "search reviews",
    detail:
      "Every search that drew a click is read and marked keep, block or watch. Every search we block is listed for you. There's no quota on blocks, because a quota can shut out real customers.",
  },
  {
    count: "1",
    title: "test open at a time",
    detail:
      "A written question and a date to read it. At this level of spend, the honest answer is often \"no clear answer\", and the report will say so.",
  },
  {
    count: "4",
    title: "Friday check-ins",
    detail: "One line each: spend against your ceiling, any problems, and calls that week.",
  },
  {
    count: "1",
    title: "one-page report",
    detail:
      "The same fields every month, by the 5th working day, with numbers you can match in your own account and on Google's bill.",
  },
];

// TODO(Blake): read-only length. The brief says 30 days read-only on existing
// accounts; the scope file uses 14 days with no edits. This list is the scope
// file's suggestion that satisfies both: no edits for 14 days, then only edits
// you approve, and no budget, bidding or area change before day 30. Confirm.
export const ADS_FIRST_30: { when: string; title: string; detail: string }[] = [
  {
    when: "Days 1 to 14",
    title: "We look and change nothing",
    detail:
      "You invite us as read-only, and you keep Admin. We write down where the money goes, what gets counted as a lead and whether that's true.",
  },
  {
    when: "Day 14",
    title: "A one-page memo and a 30-minute call",
    detail:
      "The top problems, what we'd change first, and what we still can't tell. You choose to go ahead, stay as you are, or stop. If you stop, the memo is yours.",
  },
  {
    when: "Days 15 to 30",
    title: "First edits, with your written OK",
    detail:
      "Blocked searches, risky wording and the first 5 lines. No budget, bidding or area change before day 30.",
  },
  {
    when: "Day 30",
    title: "First report",
    detail: "Measured against the starting numbers we saved on day 1. Then we pick the first test.",
  },
];

export const ADS_LEFT_OUT: string[] = [
  "Ad spend, or holding your billing",
  "More than 1 campaign, 1 area or 2 services",
  "Performance Max, Display, YouTube, Meta or remarketing of any kind",
  "Local Services Ads",
  "New landing pages or site builds",
  "Installing call tracking or call recording tools",
  "Legal review or a compliance sign-off",
  "Disputes with an old agency, or trademark complaints",
  "Handling patient or customer data: lists, names, caller numbers or form entries",
  "Weekly calls, or reports on revenue",
];

export const ADS_NOT_PROMISED: string[] = [
  "Any number of leads, calls or customers",
  "Any cost per click or per lead",
  "Top placement, or showing at all times",
  "That a test will find a winner",
  "That wasted clicks will stop",
  "Google's approval of any ad",
  "That rivals will stop bidding on your name",
];

export const ADS_PROMISED: string[] = [
  "The counts above, on the dates stated",
  "No budget change without your written yes",
  "Every change logged with a reason",
  "A plain word when a test shows nothing",
  "We step out when you cancel",
];

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
    "For any other trade or area, we'll tell you plainly that your comparison waits until we have the data.",
} as const;

// ---------------------------------------------------------------------------
// The mission, and what each service does for it
// ---------------------------------------------------------------------------

// TODO(Blake): After-Hours Scheduling (voice) belongs in "Without adding
// headcount" once you confirm the product is ready. It stays off the site until
// then, along with its service page. Voice AI, texting and reactivation are held
// back, and no delivered system is on file.
export const MISSION_GROUPS: { title: string; lead: string; items: { label: string; href?: string; note?: string }[] }[] = [
  {
    title: "Get the click",
    lead: "Show up when someone nearby searches, and know what's in your way.",
    items: [
      { label: "Free map audit", href: "/services/free-audit" },
      { label: "SEO", href: "/services/seo-and-reviews" },
      { label: "Google Ads", href: "/services/google-ads", note: "optional add-on" },
    ],
  },
  {
    title: "Turn the click into a client",
    lead: "Give people what they check before they call.",
    items: [
      { label: "Correct facts on your listing", href: "/services/seo-and-reviews" },
      { label: "Reviews and replies", href: "/services/seo-and-reviews" },
      { label: "Better pages on your site", href: "/services/seo-and-reviews" },
      // TODO(Blake): the brief lists online booking here. Nothing on file says
      // Devize sells or sets up booking software, so I wrote it as checking that
      // the link you already have works. Say if you mean more than that.
      { label: "A booking link that works", href: "/services/seo-and-reviews" },
    ],
  },
  {
    title: "Without adding headcount",
    lead: "Nobody new on your payroll, and less for your staff to remember.",
    items: [
      { label: "Review requests that go out on their own", href: "/services/seo-and-reviews" },
      { label: "The work done for you, by Devize", href: "/how-we-work" },
    ],
  },
];

export const SERVICES: {
  href: string;
  title: string;
  price: string;
  summary: string;
  group: string;
}[] = [
  {
    href: "/services/free-audit",
    title: AUDIT_NAME,
    price: "Free",
    summary:
      "See where you come up and who comes up instead, on a phone, from spots all around you, with 21 checks and the fixes we'd make first.",
    group: "Start here",
  },
  {
    href: "/services/seo-and-reviews",
    title: "SEO and Review Management",
    price: "$500 a month, flat",
    summary:
      "Reviews asked for and answered, correct facts, one better page, and a one-page note with counts, every month.",
    group: "The monthly work",
  },
  {
    href: "/services/google-ads",
    title: "Google Ads Management",
    price: "Add-on, $150 a month, plus ad spend paid to Google",
    summary:
      "5 new lines of ad copy, 2 search reviews, 1 test, 4 check-ins and 1 report a month, in your own account. We haven't run a client's ads before, and we say so up front.",
    group: "Optional add-on",
  },
];

// ---------------------------------------------------------------------------
// What "partner" means here
// ---------------------------------------------------------------------------

export const PARTNER_MEANS: { title: string; detail: string }[] = [
  {
    title: "One person to reach",
    // TODO(Blake): who is the one person? Blake is named on the site, and cold
    // mail goes out as Blake, Conner and Jaden. Say what the roles are, and
    // whether Conner and Jaden get a line. No "team" claim until then.
    detail: "A name and an email, in plain words. Not a portal and not a queue.",
  },
  {
    title: "A plan that says what not to buy",
    detail:
      "A short written plan: what to fix first and what to leave alone. That includes our own add-on when it isn't worth it.",
  },
  {
    title: "Everything in your name",
    detail:
      "Your listing, your site, your reviews and any ad account stay yours. You add us, and you can remove us any time.",
  },
  {
    title: "Notes with counts",
    detail:
      "Each month, one page: what was done, counted, what's next, and what we still don't know.",
  },
];

export const NOT_INVESTOR =
  "Not an investor. We don't buy into businesses or take a stake in yours.";
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
    detail:
      "We run the full audit against the businesses leading your map, and hand it to you.",
  },
  {
    title: "Access",
    detail:
      "You add us as a manager on your Google listing and tell us who runs your site. We write down who holds every account. You stay the owner of all of it.",
  },
  {
    title: "One call",
    detail:
      "We go through it together, and ask for the numbers only you can see: calls, bookings and Google's own report. We agree the first fixes and what to leave alone, and you get it on one page.",
  },
  {
    title: "First fixes",
    detail:
      "Listing fixes, your review reply wording, signed off once, and the start of your review requests. Health practices need a privacy contract before the requests start.",
  },
  {
    title: "First note",
    detail: "One page: what was done, what's next and what we can't promise.",
  },
];

// ---------------------------------------------------------------------------
// What we won't promise, and what we won't do
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
    title: "No AI answer naming you",
    detail:
      "Nobody outside these companies sees exactly how they choose. We work on what they read, and we don't track it yet.",
  },
  {
    title: "No fake reviews",
    detail:
      "No fake or paid reviews, and no asking only your happy customers. Google bars them, and the FTC bans fake reviews.",
  },
  {
    title: "No lead count",
    detail:
      "No number of calls, leads or customers, from the map or from ads. No cost per lead and no ad position either.",
  },
];

export const WONT_DO: { title: string; detail: string }[] = [
  {
    title: "No long contract",
    detail: "Month to month. Cancel any time, and it ends with the month you've paid for.",
  },
  {
    title: "Nothing that isn't yours",
    detail:
      "You own your listing and your site. Nothing we make lives in an account you'd have to keep paying us for.",
  },
  {
    title: "Nothing that risks a suspension",
    detail: "No made-up addresses, and no search words stuffed into your business name.",
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
    title: "Distance does a lot of the deciding",
    detail:
      "Google says distance is one of the three things it weighs, and nobody can move your building. A plan has to start from that.",
  },
  {
    title: "Replies, posts, photos and links didn't explain one practice's gap",
    // Used without a name, as one practice, per truth.md section 5. Not a client.
    detail:
      "We looked closely at one dental practice, which is not a client. Those four things did not explain why it sat behind the leaders. That's one practice, and small effects aren't ruled out. We still answer reviews, because it helps people choose you.",
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
  // DRAFT: the founder block. Facts only. It says "I" because it is Blake's own
  // block, and the rest of the site says "we". Never "team" or "I run every
  // audit": the pipeline builds audits and a person presses Send.
  bio: [
    "I run Devize. It exists because Google's map decides who gets looked at first, and an owner can't see that map from a customer's phone a few miles away.", // DRAFT
    "I'll tell you plainly what I'd fix, what I'd skip, what nobody can promise, and what was done each month.", // DRAFT
  ],
  // The brief's line, in full: "Devize is new, so there are no client stories
  // here. Judge us by the sample, the price and the terms." The last three go on
  // as links in founder.tsx.
  newLine: "Devize is new, so there are no client stories here. Judge us by",
} as const;
