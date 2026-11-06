/**
 * The menu, in one file: every line and every price. It replaces the three tiers
 * (Blake, 2026-11-05: one flat SEO and review price, three ad plans, a few add-ons).
 *
 * These read from this file, so a price changed here follows: the home page's menu
 * block, the menu on Services, its description and JSON-LD, the footer's guide link
 * and the seven service pages.
 *
 * The launch gate stays closed: production builds fail until `offerCopyConfirmed`
 * is true in src/lib/launch-gate.json, and that flag covers this file. (The gate's
 * own note still calls this file src/lib/tiers.ts and talks of tiers. It was left
 * alone on purpose. Update the note when the gate is next opened.)
 *
 * Proof rule (Blake, 2026-11-05): voluntary admissions stay off the site. No "we're
 * new", "no client yet", "in pilot", no "would" or "meant to" about something on the
 * menu, and no list of everything we don't promise. A sales page isn't a confession
 * booth, and that governs what we volunteer, not what's true. So we still never
 * claim clients, results, experience or certifications we lack: no client count,
 * testimonial, case study, result, years in business, money managed, Google Partner
 * status, "proven", "guaranteed", award or logo, no promise of a rank, date, lead
 * count or booked job, and nothing that implies past client campaigns. Expertise
 * shows through what is true: our own counted scans with their date and basis, the
 * audit and the sample, specific method, counted deliverables, each trade's rules,
 * month-to-month terms and the client owning every account. If someone asks straight,
 * the person answers straight (copy-research/copy_evidence.md, rule 12).
 *
 * The vendors behind the tools are never named in public copy.
 *
 * TODO(Blake): the claim bank (copy-research/claim_bank.md, section 5) records that
 * nothing on this menu has been delivered to a client. Each line below carries its own
 * TODO saying what has to exist before it can be sold on order. Removing the old
 * hedges makes each line a plain statement that the thing is for sale, so each one
 * has to be true on launch day. Also still open: no order form, invoice or payment
 * path (`paymentPathReady`), delivery has never been timed (an estimate is 5 to 7
 * hours of checking a client on top of tools), Texas sales tax, and who delivers
 * (three names sign the mail, so no "team" claim until the roles are stated).
 * TODO(Blake): run all of this on Devize's own site first, and keep approval mode on
 * in the tool from day one (search-atlas.md, "Settings on day one").
 */

import { S, type Source } from "@/lib/industries";

export function money(dollars: number): string {
  return `$${dollars.toLocaleString("en-US")}`;
}

// ---------------------------------------------------------------------------
// SEO and review management
// ---------------------------------------------------------------------------

/**
 * TODO(Blake): the citation or fix count. You gave no number. 5 is my judgement, with
 * no evidence for any size: a number one person can finish by hand and an owner can
 * check, and a small count hit every month beats a big one missed. Citation cost is
 * still unmeasured, so log the hours and revisit. Change it here and it changes
 * everywhere it prints.
 */
export const FIXES_PER_MONTH = 5;

const SEO_DOLLARS = 500;

export type SeoLine = {
  id: string;
  /** The line as it prints on any menu. Blake's deliverable, with the count filled in. */
  line: string;
  /** What it's for, and how the owner checks it. */
  detail: string;
};

export const SEO_LINES: SeoLine[] = [
  {
    id: "profile-and-posts",
    // TODO(Blake): not built or delivered. Doable by hand with manager access. No write
    // access in code, and the tool that could schedule posts hasn't been bought or
    // tried. How many hours a month? Posts don't move the map in our data, so they stay
    // sold as for the reader.
    line: "Google Business Profile management and weekly posts",
    detail:
      "Your hours, categories and facts kept right, and a post a week for the people reading your listing.",
  },
  {
    id: "review-system",
    // TODO(Blake): nothing exists and no vendor is chosen. Dentists need a tool whose
    // maker signs a privacy contract, plus counsel. Texts need consent. The method is
    // from reviews.md and Google's policy. Replies are by hand until a tool is chosen.
    // Who approves each reply: you at Devize, or the client? This reads as a person at
    // Devize, inside wording the client signs off once (terms 3.4).
    line: "A review request system with review responses",
    detail:
      "A request goes out a few hours after the visit or job, the same way to everyone, with no star question first. A person reads every response before it goes up. For healthcare and legal practices, no response confirms that someone is a patient or a client.",
  },
  {
    id: "citations-or-fixes",
    // TODO(Blake): see FIXES_PER_MONTH. No directory vendor is connected. Sell this as
    // accuracy, not rank. Fixes that run through our tools can stop when the service
    // stops, and Terms 3.6 carries that, so nothing public may say everything stays.
    line: `${FIXES_PER_MONTH} citations or on-page fixes a month`,
    detail:
      "A citation is your name, address and phone number listed on another site, such as a directory. An on-page fix is a correction on your own website. Each one is named in your report, with where to find it.",
  },
  {
    id: "geo-grid-report",
    // TODO(Blake): the scan code exists (gbp_grid.py --close). There is no client record,
    // schedule or report, and PRICE_PAGE in gbp_grid.py is half the real price. Month to
    // month it mostly shows noise, so report a three-month trend beside unchanged
    // neighbours. Never claim a move was caused by the work.
    // The 31%: 151 of 486 places, one area, recounted 5 Nov (claim bank C9).
    line: "A monthly geo-grid report showing map rank movement",
    detail:
      "A geo-grid is a map of where you show up when people search from different spots around you. We run the same searches from the same spots, with your rivals on the same map. Places move on their own: around one dental practice we scanned, 31% of top-three places changed in 23 days at the same spots (12 October to 4 November 2026), with no edit we know of. So we read the trend.",
  },
];

export const SEO_REVIEWS = {
  id: "seo-and-reviews",
  name: "SEO and review management",
  /** Dollars a month. Also feeds the JSON-LD. */
  amount: SEO_DOLLARS,
  currency: "USD",
  display: money(SEO_DOLLARS),
  price: `${money(SEO_DOLLARS)} a month, flat`,
  // Never call the price low, cheap or the bottom of a range. The market figures aren't
  // verified well enough to print (copy-research/peers.md, "Market facts check").
  reason: "because the list is fixed.",
  term: "Month to month. Cancel any time.",
  // TODO(Blake): does the flat $500 cover a business with several locations? An earlier
  // note said "for this listing" and multi-location is undecided, so this says one
  // location. Change it or confirm it.
  scope: "Covers one location. More than one? Ask us.",
  /** The whole list as one sentence, for trade pages and structured data. */
  list: `Google Business Profile management and weekly posts, a review request system with review responses, ${FIXES_PER_MONTH} citations or on-page fixes a month, and a monthly geo-grid report showing map rank movement`,
  check:
    "Every month you get the count: posts published, review replies sent, fixes made, and the same map scan from the same spots. You can check the posts and replies on your own listing, and the report says where to find each fix.",
  leftOut:
    "Link outreach and high-volume content can be added and priced separately.",
  wontSell: "We don't sell look-alike town pages or bought links. Google's spam rules name both.",
} as const;

export const SEO_YOUR_PART: string[] = [
  "Add us as a manager on your Google listing. You stay the owner.",
  "Give us a login to your site, or tell us who runs it.",
  "Accurate facts about your business, and photos of your real work where you can.",
  "One sign-off at the start, on how we reply to reviews in your name.",
  "Your own numbers, if you'll share them: calls, bookings and Google's report. We read them beside the map.",
];

// ---------------------------------------------------------------------------
// Ads. These replace the old $150 Google Ads add-on and its limits everywhere.
// ---------------------------------------------------------------------------

export const PERCENT_OF_SPEND = 10;

export type Counted = { count: string; title: string; detail: string };

type AdsPlanInput = {
  id: string;
  name: string;
  /** Dollars, once. */
  setup: number;
  /** Dollars a month, until the percentage passes it. */
  monthly: number;
  /** What the line is for, in a few words. */
  note: string;
  noteSource?: Source;
  /** What this plan adds to ADS_MONTHLY. */
  counts: Counted[];
};

function plan(input: AdsPlanInput) {
  const crossover = (input.monthly * 100) / PERCENT_OF_SPEND;
  return {
    ...input,
    setupDisplay: money(input.setup),
    monthlyDisplay: money(input.monthly),
    monthlyLine: `${money(input.monthly)} a month or ${PERCENT_OF_SPEND}% of ad spend, whichever is higher`,
    /** Monthly ad spend above which the percentage is the higher of the two. */
    crossoverDisplay: money(crossover),
    /** Assumes ad spend at or under the crossover. */
    firstMonthDisplay: `${money(input.setup + input.monthly)} plus ad spend`,
    summary: `${money(input.setup)} setup, then ${money(input.monthly)} a month or ${PERCENT_OF_SPEND}% of ad spend, whichever is higher`,
  };
}

/**
 * TODO(Blake): your table had no column headings. This reads the columns as one-time
 * setup, then monthly management. 99 Calls and Blue Grid split theirs the same way,
 * which supports the reading, but it's a reading. Confirm it. The crossover and
 * first-month figures are arithmetic on it.
 * TODO(Blake): the printed ad plans have no delivered campaign behind them, and you
 * asked for countable deliverables, so the counts here are for you to confirm. Search
 * comes from google-ads-scope.md, which was sized for $150. Local Services and Meta
 * are written by me by analogy, because nothing is scoped for them.
 * TODO(Blake): a lawyer should read percentage pricing for law firms against the Texas
 * solicitation rule. The 10% only applies above the crossovers printed here.
 */
export const ADS = {
  lsa: plan({
    id: "local-services",
    name: "Google Local Services Ads",
    setup: 250,
    monthly: 150,
    // TODO(Blake): not scoped or researched: eligibility by trade, health care lead
    // credits. Setup is changing now, as Google moves these into Performance Max. Don't
    // print the name of Google's badge on these ads: it contains "guaranteed".
    note: "You pay Google per valid lead, not per click. Google is moving these into Performance Max, starting with US home services such as plumbing and HVAC.",
    noteSource: S.lsaMove,
    counts: [
      {
        count: "2",
        title: "lead reviews",
        detail: "Every lead is read and marked real or not, and any we'd dispute is listed for you.",
      },
      {
        count: "1",
        title: "profile check",
        detail: "Your services, hours and service area, checked against your Google listing.",
      },
    ],
  }),
  search: plan({
    id: "google-search",
    name: "Google Search ads",
    setup: 500,
    monthly: 400,
    // TODO(Blake): no campaign has ever been run. No ads clause in Terms yet.
    note: "Goes after the searches closest to a booked job, and blocks the ones that waste money.",
    counts: [
      {
        count: "5",
        title: "new lines of ad copy",
        detail: "4 headlines and 1 description, checked against a rule list and approved by you.",
      },
      {
        count: "2",
        title: "search reviews",
        detail: "Every search that drew a click is read and marked keep, block or watch, and every search we block is listed for you.",
      },
    ],
  }),
  meta: plan({
    id: "facebook-instagram",
    name: "Facebook and Instagram ads",
    setup: 500,
    monthly: 450,
    // TODO(Blake): nothing exists, and there's no research on file on Meta's rules, its
    // health data limits or account ownership. Google's rules don't cover it.
    note: "Puts your name in front of nearby households before they need to search.",
    counts: [
      {
        count: "5",
        title: "new ad variations",
        detail: "Copy checked against a rule list and approved by you, with your own photos of real work where you have them.",
      },
      {
        count: "2",
        title: "audience reviews",
        detail: "Where the money went, who saw it and what we cut, with every cut listed for you.",
      },
    ],
  }),
};

export const ADS_PLANS = [ADS.lsa, ADS.search, ADS.meta];

export const ADS_INTRO =
  "We work out with you where the budget should go, cut what wastes it and write the copy where the platform lets us. Your ceiling stays put unless you change it in writing.";

export const ADS_TERMS =
  "Month to month, in your own ad account.";

/** Stays with the table even though other fine print is in the footer: the price cells depend on it. */
export const ADS_CAPTION =
  "Ad spend is separate and paid directly to the platform. First month assumes ad spend under the level shown.";

/**
 * TODO(Blake): read-only length. The memory note says 30 days read-only on existing
 * accounts, and the scope file uses 14 days with no edits. This is the scope file's
 * suggestion that satisfies both. Confirm it.
 * TODO(Blake): what does each setup fee buy? You gave no list. This comes from the
 * scope's first 30 days, and nothing has been timed.
 */
export const ADS_START =
  "Setup pays for the first read and the build. Any account you already have gets 14 days with no edits while we write down where the money goes and what gets counted as a lead. Then you get a one-page memo and a call, and first edits go in with your written OK.";

/** On every ad plan, each month. There is no quota on blocked searches, on purpose: a quota can shut out real customers. */
export const ADS_MONTHLY: Counted[] = [
  {
    count: "1",
    title: "test at a time",
    // The 686: 95% confidence and 80% power, checked in google-ads-scope.md (claim bank F3).
    detail:
      "A written question and a date to read it, such as running ads only in the hours someone can answer. We size it to what your budget can prove: telling a 10% lead rate from 15% takes about 686 clicks per side.",
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
      "The same fields every month, by the 5th working day, with numbers you can match in your own account and on the platform's bill. What the platform charged is shown without our fee.",
  },
];

/** Method and platform facts. None of it says or implies a campaign has been run. Sourced on Services. */
export const ADS_CHECKS: { text: string; source: Source }[] = [
  {
    text: "Google's auto-apply and AI Max can change keywords or ad copy with no person involved, and new Search campaigns start with AI Max on. We check those first in any account.",
    source: S.aiMax,
  },
  {
    text: "A $40 daily budget can spend up to about $80 in a day, and at most about $1,216 in a month. So the ceiling we write down is the monthly one.",
    source: S.budget,
  },
  {
    text: "Google doesn't stop rivals bidding on your name. Its trademark review looks at the ad's wording. So your Google Search report lists the top 3 rivals in your auctions.",
    source: S.trademark,
  },
];

export const ADS_OWNERSHIP: string[] = [
  "You own the account and hold Admin, with your own sign-in.",
  "You pay the platform directly. We never hold your billing.",
  "We get a user invitation: read-only first, then a level that can edit ads but can't add users. Never Admin, and never a shared password.",
  "You can remove us at any time, and we step out when you cancel.",
  "No budget change without your written yes. Every change is logged with a reason.",
];

/**
 * Google's "Advertiser guide" notice: it must be linked in a clearly visible place on
 * the site, and shared with customers at sale and renewal. It sits in the footer.
 */
export const ADVERTISER_GUIDE = {
  label: "Google's advertiser guide",
  url: "https://support.google.com/adspolicy/answer/9457109",
} as const;

// ---------------------------------------------------------------------------
// Add-ons
// ---------------------------------------------------------------------------

export type AddOn = {
  id: string;
  name: string;
  /** Dollars, when there's a set price. */
  amount?: number;
  price: string;
  detail: string;
};

export const ADD_ONS: AddOn[] = [
  {
    id: "website-rebuild",
    name: "Website rebuild",
    amount: 997,
    price: money(997),
    // TODO(Blake): scope document only, no template built. 9.5 to 12 hours a site as
    // corrected, first paid launch about 6 to 8 weeks from go, and the scope says no
    // turnaround promise before one dry run, so no date prints. Never sell it as rank work.
    detail: "A new site in accounts you own, for when the one you have is broken or doesn't work on a phone.",
  },
  {
    id: "ai-voice-receptionist",
    name: "AI Voice Receptionist",
    // TODO(Blake): no price given, so "Quoted to your call volume". Comparable vendors
    // print prices, so a "from" figure would help this row if you can set one. Also not
    // built: no delivered system, no vendor signed, no test call ever placed. The vendor
    // note says one-client HVAC or plumbing first, refer dental to a dental product,
    // wait on law. It needs an AI and recording notice, the gas script, a tested on-call
    // path and insurance. Your note says "when most businesses are closed", which our
    // scans back for dental and not for HVAC (only 12% of HVAC rows showed closed at
    // 9 PM), so this shared row says "after your office closes". Never sell it as map
    // work, or as making a business open 24 hours.
    price: "Quoted to your call volume",
    detail:
      "Handles after-hours and overflow calls, so you can capture the searches that come in after your office closes. It pairs well with ads, because a paid click at 7pm still needs an answer.",
  },
  {
    id: "lead-nurture-sms",
    name: "Lead Nurture SMS",
    // TODO(Blake): no price given, so "Quoted". Also not built: nothing exists. The
    // research ranks texting old customer lists last: the client must show a consent
    // record per number and most old lists are expected to fail. Not for dental, walk-in
    // or law until counsel clears it. $500 a violation, up to three times if willful.
    price: "Quoted",
    detail:
      "A follow-up system and SMS marketing infrastructure for past clients, built for the highest lifetime value.",
  },
];
