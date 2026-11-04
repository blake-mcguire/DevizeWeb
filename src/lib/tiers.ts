/**
 * The three tiers, in one file: what each holds, the status of every line, and
 * every price. (Blake, 2026-11-04: "The Services we sell should be a 3 tiered option.")
 *
 * These read from this file, so a status or price changed here follows: the home
 * page's tier cards, the tier cards on Services, its description and JSON-LD, the
 * flywheel's tags and What We Do's stage pills.
 *
 * These are sentences, and stay manual when a line goes live: hero.tsx, the
 * how-it-works paragraph in src/app/(site)/page.tsx, the stage wording on What We
 * Do, each pilot's "would" wording below, TRADE_ACCESS and the six trade pages.
 *
 * The launch gate stays closed: production builds fail until `offerCopyConfirmed`
 * is true in src/lib/launch-gate.json, and that flag covers this file.
 *
 * Proof rule: Devize has no client on record. Nothing here may say or imply
 * otherwise. Nothing unbuilt is shown as available. No rank, date, lead count or
 * booked job is promised. Google Partner status, ads experience and ads results
 * are never claimed. The vendors behind the tools are never named in public copy,
 * and the tools are never called proprietary.
 */

import { BOOKING_OS } from "@/lib/offer-copy";

export type Status = "available" | "pilot";

export const STATUS_LABEL: Record<Status, string> = {
  available: "Available now",
  pilot: "In pilot, ask us",
};

export const ASK_US = "Ask us";

// TODO(Blake): confirm this says what "in pilot" means to you. truth.md records
// no delivered voice, texting or reactivation system, so it says no client is on
// any of it. Change it once one is. "Pilot" suggests something is running, so answer
// line by line: built or not? Anything not built becomes "Planned, ask us", which
// is a one-line change to STATUS_LABEL or a new status.
export const PILOT_NOTE =
  "In pilot means no client runs on it today and the price isn't set. Ask us where it stands for your trade.";

// ---------------------------------------------------------------------------
// Prices that are decided (Blake, 2026-11-04)
// ---------------------------------------------------------------------------

const TIER_1_DOLLARS = 500;
const ADS_DOLLARS = 150;

export const PRICE = {
  /** Dollars a month. Also feeds the Service Offer in the Services JSON-LD. */
  amount: TIER_1_DOLLARS,
  currency: "USD",
  display: `$${TIER_1_DOLLARS}`,
  headline: `$${TIER_1_DOLLARS} a month, flat.`,
  term: "Month to month. Cancel any time.",
  audit: "The audit is free.",
  // TODO(Blake): does the flat $500 cover a business with several locations? An
  // earlier note said "for this listing" and multi-location is undecided, so this
  // says one location. Change it or confirm it.
  scope: "Covers one location. More than one? Ask us.",
} as const;

export const GOOGLE_ADS = {
  /** Dollars a month, on top of Tier 1. Also feeds the JSON-LD. */
  amount: ADS_DOLLARS,
  currency: "USD",
  display: `$${ADS_DOLLARS}`,
  title: "Google Ads management",
  headline: `$${ADS_DOLLARS} a month, added to Tier 1.`,
  spend: "Ad spend is separate. You pay it straight to Google.",
  // Google's third-party policy: a separate fee must be stated clearly, in writing
  // before the first purchase and on every invoice.
  // TODO(Blake): "it's on every invoice" describes an invoice that doesn't exist yet.
  // True only once paymentPathReady is true in src/lib/launch-gate.json.
  fee: `Our $${ADS_DOLLARS} fee is separate from what Google charges you. You get it in writing before your first purchase, and it's on every invoice.`,
  // Google's "Advertiser guide" notice: it must be linked in a clearly visible
  // place on the site, and shared with customers at sale and renewal. It sits
  // under Google Ads on Services and in the footer.
  guide: {
    label: "Advertiser guide: Working with third parties",
    url: "https://support.google.com/adspolicy/answer/9457109",
  },
  // TODO(Blake): print as written? google-ads-scope.md says to put it in every
  // proposal. Reword if you like, but keep all four facts in it.
  disclosure:
    "Devize has not run a client's Google Ads before. You are getting careful, counted work at a low price from someone learning on your account, inside the limits written here. We are not a Google Partner. We do not promise leads, costs or positions.",
  // TODO(Blake): confirm these limits. Above them, quote again.
  limits: [
    "1 search campaign",
    "1 service area",
    "Up to 2 services",
    "Up to about $1,500 a month in ad spend",
    "In your own Google Ads account",
  ],
} as const;

// ---------------------------------------------------------------------------
// The tiers
// ---------------------------------------------------------------------------

export type TierItem = {
  id: string;
  title: string;
  status: Status;
  /** One short line on the tier card. */
  note?: string;
  /** The fuller line on Services. */
  detail: string;
};

export type Tier = {
  id: string;
  number: 1 | 2 | 3;
  name: string;
  /** One sentence for the home page. */
  brief: string;
  /** Why anyone would pay for it, printed above the line-by-line list on Services. */
  purpose?: string;
  status: Status;
  /** The status pills under the price. */
  pills: { status: Status; label: string }[];
  price: string;
  priceNote: string;
  /** Printed above the list. Says what this tier adds to the one before. */
  listLead: string;
  items: TierItem[];
};

// TODO(Blake): the old eight-item list is retired in favour of your six lines
// below. It also held a review request routine, a listing check, a facts check,
// one better page a month, and an account and wording check. Say which come back.
// The research's one owner-held map lever is the review request routine, so
// that's the one to look at first.
// TODO(Blake): set the counts. How many blog posts and Google posts a month? The
// tool's article cap is the likely limit (search-atlas.md section 6), so test it
// before promising a number. Delivery has never been timed: log the hours.
// TODO(Blake): run all of this on Devize's own site first, and keep approval mode
// on in the tool from day one (search-atlas.md, "Settings on day one").
// TODO(Blake): rename this tier, or put review requests in it for HVAC and plumbing.
// Its name promises "Review Automation", but asking for reviews is left out and the
// automation is only drafting replies a person approves. flywheel-v2.md has your
// later words putting review requests in Tier 1, which would settle it.
// TODO(Blake): are listing fixes in Tier 1? The trade pages teach them at length
// (service area, name, hours, categories), and the six lines below don't include
// them, though Terms 3.2 lists correcting wrong facts. If yes, add a seventh line
// here, align Terms 3.1 and 3.2, and drop the "yours to change" line on the HVAC and
// dental pages. If no, keep that line and add it to the other four trade pages.
const TIER_1: Tier = {
  id: "tier-1",
  number: 1,
  name: "SEO Management and Review Automation",
  brief:
    "For the customer who finds you and is deciding whether to call: your site, posts, review replies and map kept in order, with a monthly note that counts it.",
  purpose:
    "It's for the customer who finds you and is deciding whether to call: true facts, real pages, reviews answered, and a count of what got done. It won't answer your phone.",
  status: "available",
  pills: [{ status: "available", label: STATUS_LABEL.available }],
  price: `${PRICE.display} a month, flat`,
  priceNote: `${PRICE.term} ${PRICE.scope}`,
  listLead: "What's in it",
  items: [
    {
      id: "on-site-fixes",
      title: "On-site SEO fixes",
      status: "available",
      detail:
        "Titles, descriptions, headings, structured data, alt text and internal links. A person checks each batch before it goes live. Some of these run through our tools rather than your site's own files, and that matters if you leave.",
    },
    {
      id: "blog-posts",
      title: "Blog posts checked by a person",
      status: "available",
      detail:
        "Drafted with software, then read and fact-checked by a person before they go on your site. Health and legal posts need your sign-off on every claim, and nothing publishes itself.",
    },
    {
      id: "google-posts",
      title: "Google post scheduling",
      status: "available",
      detail:
        "Posts for your Google listing, scheduled ahead and approved first. They're for the people reading your listing. We don't sell them as a way up the map.",
    },
    {
      id: "review-replies",
      // TODO(Blake): who approves each reply: you at Devize, or the client? This
      // reads as a person at Devize approving each one, inside wording the client
      // signs off once (terms 3.4). Wording can't be locked in the tool as far as
      // the research could find, so the person is the safeguard.
      title: "Review replies drafted and approved before posting",
      status: "available",
      detail:
        "A reply is drafted for each new review, and a person approves it before it goes up. Nothing posts on its own. You sign off once on the wording, and no reply ever confirms that someone is a patient or a client.",
    },
    {
      id: "map-tracking",
      title: "Map tracking",
      status: "available",
      // By hand: gbp_grid.py --close can rescan one shop, but no client record,
      // schedule or report is built (truth.md section 2).
      detail:
        "The same searches from the same spots each month, by hand for now. Places can shift with no edits at all, so we also track nearby businesses we don't work on, as a rough check.",
    },
    {
      id: "monthly-note",
      title: "A monthly note with counts",
      status: "available",
      detail:
        "One page: what got done, counted. What's next, what we'd skip and what we still don't know. If you share your own numbers, like calls and bookings, we read those too.",
    },
  ],
};

// TODO(Blake): Tier 2's price, and what is built. Everything but Google Ads reads
// "In pilot, ask us" and "Ask us" until you confirm it.
const TIER_2: Tier = {
  id: "tier-2",
  number: 2,
  name: "Convert",
  brief:
    "Adds paid clicks today. In pilot, a shorter path from first contact to booked: speed to lead (a fast first reply), missed-call text-back, online booking and reminders.",
  status: "pilot",
  pills: [
    { status: "available", label: "Google Ads available now" },
    { status: "pilot", label: "The rest in pilot, ask us" },
  ],
  price: ASK_US,
  priceNote: "Google Ads is the one line with a price today.",
  listLead: "Everything in Tier 1, plus",
  items: [
    {
      id: "google-ads",
      title: "Google Ads management",
      status: "available",
      note: `${GOOGLE_ADS.display} a month add-on, ad spend paid to Google. No client campaign run yet.`,
      detail:
        "Counted monthly work in your own account, inside tight limits. You can add this to Tier 1 today. The full terms are in the Google Ads section below.",
    },
    {
      id: "speed-to-lead",
      // TODO(Blake): built? priced? Consent wording needs a lawyer before any form
      // goes live (product-requirements.md section b).
      title: "Speed to lead",
      status: "pilot",
      detail:
        "A new lead would reach a person right away, and the reply would go out in your words. Automated texts would only go to people who ticked a separate, optional box. Everyone else would get a call from a person.",
    },
    {
      id: "missed-call-text-back",
      // TODO(Blake): built? priced? How far a reply can go before it counts as
      // marketing is a lawyer's question.
      title: "Missed-call text-back",
      status: "pilot",
      detail:
        "When a call goes unanswered, one text would go back to answer it. It would carry no offer, and it would stop the moment someone says stop.",
    },
    {
      id: "booking-reminders",
      // TODO(Blake): built? priced? Does this replace a client's existing booking
      // tool, or sit beside it?
      title: "Online booking and reminders",
      status: "pilot",
      detail:
        "A booking link that would land on your calendar, and reminders so people show up. Nothing about someone's health or legal matter would go in a message.",
    },
  ],
};

// TODO(Blake): Tier 3's price, and what is built. All of it reads "In pilot, ask
// us" and "Ask us" until you confirm it.
const TIER_3: Tier = {
  id: "tier-3",
  number: 3,
  name: `${BOOKING_OS} in full`,
  brief:
    "Would add a custom AI voice agent for overflow and after-hours calls, follow-up on dead estimates, and win-back for past customers.",
  status: "pilot",
  pills: [{ status: "pilot", label: STATUS_LABEL.pilot }],
  price: ASK_US,
  priceNote: "No price until we've confirmed what it takes to run.",
  listLead: "Everything in Tier 2, plus",
  items: [
    {
      id: "voice-agent",
      // TODO(Blake): built? priced? Which vendor? Needs an AI and recording notice,
      // a tested on-call path and insurance first (product-requirements.md section a).
      title: "Custom AI voice agent for overflow and after-hours calls",
      status: "pilot",
      detail:
        "Would pick up when the line is busy or you're closed. Its first sentence would say it's an AI and which business it's answering for. It would never decide how serious something is: it would book, take a message or hand off to your on-call person.",
    },
    {
      id: "dead-estimates",
      // TODO(Blake): built? priced? Consent records are the hard part.
      title: "Dead-estimate follow-up",
      status: "pilot",
      detail:
        "An estimate that went quiet would get a follow-up by email or from a person. A text would only go where there's a consent record for that number.",
    },
    {
      id: "reactivation",
      // TODO(Blake): built? priced? Expect most old lists to fail the consent check
      // (product-requirements.md section e).
      title: "Reactivation and win-back",
      status: "pilot",
      detail:
        "Past customers would hear from you again. We'd audit the list first, because we don't treat a number on an old invoice as consent to text, and every old opt-out would be applied before the first send.",
    },
  ],
};

export const TIERS: Tier[] = [TIER_1, TIER_2, TIER_3];

export const TIER_ITEMS = TIERS.flatMap((t) => t.items);

// ---------------------------------------------------------------------------
// The flywheel, in order. Each stage names the tier lines it runs on, and its tag,
// its pill on What We Do and `solid` are worked out from their status, so a line
// that goes live here changes the diagram too. `solid` means all of the stage can
// be bought today; the diagram draws the others dashed.
// ---------------------------------------------------------------------------

export type FlywheelStage = {
  title: string;
  sub: string;
  /** The short words on the diagram. */
  tag: string;
  /** The status pill on What We Do. */
  pill: { status: Status; label: string };
  solid: boolean;
};

function stage(
  title: string,
  sub: string,
  itemIds: string[],
  /** For a stage with a part in no tier at all, so it can't read as fully on sale. */
  partly?: { tag: string; pill: string }
): FlywheelStage {
  const statuses = itemIds.map((id) => {
    const item = TIER_ITEMS.find((i) => i.id === id);
    if (!item) throw new Error(`Flywheel stage "${title}" names a tier line that doesn't exist: ${id}`);
    return item.status;
  });
  if (!partly && statuses.every((s) => s === "available")) {
    return { title, sub, tag: STATUS_LABEL.available, pill: { status: "available", label: STATUS_LABEL.available }, solid: true };
  }
  if (!partly && statuses.every((s) => s === "pilot")) {
    return { title, sub, tag: "In pilot", pill: { status: "pilot", label: STATUS_LABEL.pilot }, solid: false };
  }
  return {
    title,
    sub,
    tag: partly?.tag ?? "Partly available",
    pill: { status: "pilot", label: partly?.pill ?? "Partly available, ask us" },
    solid: false,
  };
}

export const FLYWHEEL: FlywheelStage[] = [
  stage("Clicks", "SEO and paid ads", ["on-site-fixes", "blog-posts", "google-ads"]),
  stage(BOOKING_OS, "meant to take in each lead", ["speed-to-lead"]),
  stage("Converted", "answered and booked", ["speed-to-lead", "missed-call-text-back", "booking-reminders", "voice-agent"]),
  stage("Retained", "reminders and win-back", ["booking-reminders", "dead-estimates", "reactivation"]),
  // Only the replies can be bought. Asking for reviews is in no tier (TIER_1_LEFT_OUT),
  // so the stage that closes the loop can't be drawn as on sale.
  stage("Reviews and repeat", "feed the next clicks", ["review-replies"], {
    tag: "Only replies today",
    pill: "Review replies available now. Asking for reviews: ask us",
  }),
];

// ---------------------------------------------------------------------------
// Which trades each tier is open to (product-requirements.md: "The tiers cannot
// be the same for every trade at launch. Each tier needs to say which trades it
// is open to.")
// ---------------------------------------------------------------------------

export type AccessState = "open" | "conditions" | "ask" | "waits";

export const ACCESS_LABEL: Record<AccessState, string> = {
  open: "Open",
  conditions: "With conditions",
  ask: "In pilot, ask us",
  waits: "Waits",
};

export type Access = { state: AccessState; text: string };

export type TradeAccess = {
  /** Tier 1. */
  tier1: Access;
  /** The Google Ads add-on. */
  ads: Access;
  /** Everything in pilot, across Tiers 2 and 3. */
  pilots: Access;
};

// TODO(Blake): before connecting a dental or medical listing to our tools, get the
// vendor's written answer on a privacy contract (BAA). The research found no public
// offer of one (search-atlas.md section 7). Until that answer is in hand, the "with
// conditions" below means the tools stay off those listings.
export const TRADE_ACCESS: Record<string, TradeAccess> = {
  hvac: {
    tier1: { state: "open", text: "Nothing in the way that we know of." },
    ads: { state: "open", text: "Texas ads need the license number." },
    pilots: { state: "ask", text: "First in line, with plumbing." },
  },
  "dental-clinics": {
    tier1: { state: "conditions", text: "A person approves every reply. Privacy paperwork comes first." },
    ads: { state: "conditions", text: "After your lawyer answers a few questions. No patient lists, ever." },
    pilots: { state: "waits", text: "Voice, text and a lead system (CRM) wait until we have our own privacy program and signed agreements at every link." },
  },
  "law-firms": {
    tier1: { state: "conditions", text: "Your firm sets the rule on replies and signs off on what we write." },
    ads: { state: "conditions", text: "Your lawyer reviews the copy and any filing." },
    pilots: { state: "waits", text: "Voice and text wait until your own lawyer signs off in writing." },
  },
  "walk-in-clinics": {
    tier1: { state: "conditions", text: "A person approves every reply. Privacy paperwork comes first." },
    ads: { state: "conditions", text: "After your lawyer answers a few questions. No patient lists, ever." },
    pilots: { state: "waits", text: "Voice, text and CRM wait, and walk-in clinics come last of all." },
  },
  "veterinary-clinics": {
    tier1: { state: "open", text: "Replies stay general, whatever the review says." },
    ads: { state: "open", text: "Claims stay inside the state board's ad rules." },
    pilots: { state: "ask", text: "A lawyer answers on client confidentiality first." },
  },
  "plumbing-companies": {
    tier1: { state: "open", text: "Nothing in the way that we know of." },
    ads: { state: "open", text: "Texas ads need the license number." },
    pilots: { state: "ask", text: "First in line, with HVAC." },
  },
};

// ---------------------------------------------------------------------------
// Tier 1: what it needs from you, and what it leaves out
// ---------------------------------------------------------------------------

export const TIER_1_YOUR_PART: string[] = [
  "Add us as a manager on your Google listing. You stay the owner, and you can remove us any time.",
  "Give us a login to your site, or tell us who runs it.",
  "Accurate facts about your business, and photos of your real work where you can.",
  "One sign-off at the start, on how we reply to reviews in your name.",
  "Your own numbers, if you'll share them: calls, bookings and Google's report. No outside scan can see those.",
];

export const TIER_1_LEFT_OUT: string[] = [
  "Google Ads and ad spend, unless you add them.",
  // TODO(Blake): which tier holds review requests? The flywheel needs them and no
  // tier lists them yet. If they go by text, the consent rules apply, and for
  // dentists a privacy contract comes first.
  "Asking your customers for reviews. It sends messages to real people, so it has its own consent and privacy checks. Ask us.",
  "New websites.",
  "Copy-paste town pages, and bought links or link swaps. Google's spam rules name them.",
  "Legal sign-off. We flag what looks risky. Your lawyer decides.",
  "Anything not on this list. It gets its own quote, or we tell you to skip it.",
];

// ---------------------------------------------------------------------------
// Google Ads add-on (Blake, 2026-11-04: "a tag on of 150 a month and it should
// have an actual deliverable"). The counts come from google-ads-scope.md.
// ---------------------------------------------------------------------------

// TODO(Blake): is this count the public version? "5 written and approved" is the
// promise, not "5 live". There is no quota on blocked searches, on purpose.
export const ADS_MONTHLY: { count: string; title: string; detail: string }[] = [
  {
    count: "5",
    title: "new lines of ad copy",
    detail:
      "4 headlines and 1 description, checked against a rule list and approved by you. They go live early in the month unless a test is running, and the report says so if they wait.",
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
      "Such as running ads only in the hours someone can answer. A written question and a date to read it. At this level of spend the honest result is often \"no clear answer\", and the report will say so.",
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
      "The same fields every month, by the 5th working day, with numbers you can match in your own account and on Google's bill. What Google charged is shown without our fee.",
  },
];

// TODO(Blake): read-only length. The memory note says 30 days read-only on existing
// accounts; the scope file uses 14 days with no edits. This list is the scope file's
// suggestion that satisfies both. Confirm.
export const ADS_FIRST_30: { when: string; title: string; detail: string }[] = [
  {
    when: "Days 1 to 14",
    title: "We look and change nothing",
    detail:
      "You invite us as read-only and keep Admin. We write down where the money goes, what gets counted as a lead and whether that's true.",
  },
  {
    when: "Day 14",
    title: "A one-page memo and a call",
    detail:
      "The top problems, what we'd change first, and what we still can't tell. You go ahead, stay as you are, or stop. If you stop, the memo is yours.",
  },
  {
    when: "Days 15 to 30",
    title: "First edits, with your written OK",
    detail: "Blocked searches, risky wording and the first 5 lines. No budget, bidding or area change before day 30.",
  },
  {
    when: "Day 30",
    title: "First report",
    detail: "Measured against the numbers we saved on day 1. Then we pick the first test.",
  },
];

export const ADS_OWNERSHIP: string[] = [
  "You own the account and hold Admin, with your own Google sign-in.",
  "You pay Google directly. We never hold your billing.",
  "We get a user invitation: read-only first, then Standard, which can edit ads but can't add users. Never Admin, and never a shared password.",
  "You can remove us at any time, and we step out when you cancel.",
  "No budget change without your written yes. Every change is logged with a reason.",
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

export const ADS_LEFT_OUT: string[] = [
  "Ad spend, or holding your billing",
  "More than 1 campaign, 1 area or 2 services",
  "Performance Max, Display, YouTube, Meta, or ads that follow past visitors",
  "Local Services Ads",
  "New landing pages or site builds",
  "Installing call tracking or call recording tools",
  "Legal review or a compliance sign-off",
  "Disputes with an old agency, or trademark complaints",
  "Handling patient or customer data: lists, names, caller numbers or form entries",
  "Weekly calls, or reports on revenue",
];
