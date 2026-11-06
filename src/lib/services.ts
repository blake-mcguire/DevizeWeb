/**
 * The seven pages on what can be part of a Devize plan (Blake, 2026-11-05: "Remove the
 * services as something that can be picked off a menu like we are mcdonalds. WE are
 * strategic marketing partners not order and go marketers."). They explain the work, and
 * each page sits under one of his three stages. Nothing here is a thing to buy.
 *
 * No price prints on any of these pages. src/lib/menu.ts stays as the private price list:
 * this file may take names, counts and wording from it, never `amount`, `price`, `display`,
 * `summary` or a setup or monthly figure.
 *
 * The words on these pages live here. From menu.ts they take only names, count numbers, the
 * bold deliverable titles and SEO_REVIEWS.list, so the detail text in menu.ts (SEO_LINES, the
 * ad counts, ADS_MONTHLY, ADS_CHECKS, ADS_OWNERSHIP, SEO_YOUR_PART) no longer prints.
 *
 * Rules for these pages (src/lib/menu.ts has the full proof rule):
 * - Voluntary admissions stay off. No "new", "in pilot", "would", "meant to". We still
 *   claim no client, result, experience or certification we lack, and promise no rank,
 *   date, lead count or booked job.
 * - Our own numbers come only from copy-research/claim_bank.md, with their basis beside
 *   them. Each trade keeps its own. A number band appears only where one fits.
 * - No paragraph repeats across pages.
 * - The vendors behind the tools are never named. "Partner" stays off anything near ads,
 *   so the "strategic marketing partner" label is never used in this file.
 *
 * TODO(Blake): nothing on these pages has been delivered to a client yet (claim bank,
 * section 5), and every step and date below describes work nobody has timed. Each line
 * is a plain statement that we do the thing, so each has to be true on launch day.
 * The launch gate (`offerCopyConfirmed`) covers this file as well, even though the gate's
 * own note was written before it existed.
 */

import { S, type Source } from "@/lib/industries";
import {
  ADD_ONS,
  ADS,
  ADS_MONTHLY,
  SEO_LINES,
  SEO_REVIEWS,
  type Counted,
} from "@/lib/menu";
import { KEEP_PROMISE } from "@/lib/offer-copy";

export type Cited = { text: string; sources?: Source[] };

export type ServiceItem = {
  /** A counted deliverable shows its count. A line with none shows a check mark. */
  count?: string;
  title: string;
  detail: string;
  sources?: Source[];
};

export type ServiceStep = { when: string; items: string[] };

/** Blake's three stages, in his order. Same titles as HOW_WE_DO_IT in src/lib/offer-copy.ts. */
export const STAGES = ["Clicks", "Conversion", "The Flywheel"] as const;
export type Stage = (typeof STAGES)[number];

export type ServiceSampleKind = "lead-log" | "search-sheet" | "ad-phones" | "old-addresses" | "call-script" | "list-check";

export type ServicePage = {
  slug: string;
  /** The anchor the old one-page Services used. Old links land beside this page's link on /what-we-do. */
  anchor: string;
  name: string;
  /** The tab title. */
  title: string;
  description: string;
  /** The small line above the name, and the group it sits in on /what-we-do. */
  stage: Stage;
  pitchHead: string;
  pitch: string;
  band?: { items: { count: string; label: string }[]; basis: string };
  why: {
    head: string;
    body: Cited[];
    /** The small print a figure in the body needs. */
    caption?: string;
    checks?: Cited[];
  };
  getHead: string;
  get: ServiceItem[];
  getNote?: Cited;
  /** Show the sample audit on a device beside the list. */
  device?: boolean;
  /**
   * The page's one invented example (src/components/service-samples.tsx), and where it
   * sits: in the dark section, beside the list, or under it.
   */
  sample?: { kind: ServiceSampleKind; place: "why" | "beside" | "below" };
  stepsHead: string;
  steps: ServiceStep[];
  need: string[];
  /** Who owns what, where a page spells it out. */
  owns?: string[];
  /** In the order the page first cites them. */
  sources: Source[];
  serviceType: string;
};

function addOn(id: string) {
  const found = ADD_ONS.find((a) => a.id === id);
  if (!found) throw new Error(`No add-on called ${id}`);
  return found;
}

const REBUILD = addOn("website-rebuild");
const VOICE = addOn("ai-voice-receptionist");
const SMS = addOn("lead-nurture-sms");

const [AD_TEST, AD_CHECKINS, AD_REPORT] = ADS_MONTHLY;

/** A counted line from the menu, with this page's words under it. */
function counted(line: Counted, detail: string): ServiceItem {
  return { count: line.count, title: line.title, detail };
}

/** The monthly counts on all three kinds of ads, each worded for this page's platform. */
function adMonthly(detail: { test: string; checkins: string; report: string }): ServiceItem[] {
  return [
    counted(AD_TEST, detail.test),
    counted(AD_CHECKINS, detail.checkins),
    // "1 one-page report" reads badly beside the big number, so this title is ours.
    { count: AD_REPORT.count, title: "monthly report", detail: detail.report },
  ];
}

// ---------------------------------------------------------------------------
// SEO and review management
// ---------------------------------------------------------------------------

/** The text under the four bold lines. The bold lines stay in menu.ts, because the Terms mirror them. */
const SEO_DETAIL: Record<string, string> = {
  "profile-and-posts": "We keep your hours, categories and facts right, and we write each post for the people reading your listing.",
  "review-system":
    "Every customer gets the same request a few hours after the visit or job, with no star question first. A person reads every response, and for healthcare and legal practices, no response confirms that someone is a patient or a client.",
  "citations-or-fixes":
    "Each is a directory listing of your name, address and phone number or a correction on your own website, and your report says where to find it.",
  // Sold as accuracy and a trend. Never claim a move was caused by the work.
  // The 31%: 151 of 486 places, one area, recounted 5 Nov (claim bank C9). Its dates are in the band's note.
  "geo-grid-report":
    "We run the same searches from the same spots each month, so you can see where you show up and who shows up around you. Top-three spots move on their own: around one dental practice we scanned, 31% changed in 23 days. So we judge the map results by the three-month trend, and we compare it with businesses we don't work on.",
};

const seo: ServicePage = {
  slug: "seo-and-review-management",
  anchor: SEO_REVIEWS.id,
  name: SEO_REVIEWS.name,
  title: "SEO and Review Management",
  description: `What SEO and review management covers in a Devize plan: ${SEO_REVIEWS.list}, with your listing in your name.`,
  stage: "Clicks",
  pitchHead: "We do four jobs every month, and your report shows each one.",
  pitch: "You can check the posts and replies on your own listing, and the report says where to find each fix.",
  // Claim bank B1 and B4. Each trade's own numbers, each with its basis.
  band: {
    items: [
      { count: "62%", label: "of dental top-three spots went to a listing within 2 miles of the searcher. In HVAC, 48%." },
      { count: "529", label: "reviews on the median top-three dental listing. In HVAC, 421." },
    ],
    basis:
      "Our own phone searches from set spots: dentists in Houston, Dallas and San Antonio and HVAC companies in Houston and Dallas, 18 September to 4 November 2026. Distance figures are daytime scans, and HVAC distance uses the 3,942 top-three spots with a printed distance. Each figure here compares different listings at the time of the scan. The 31% further down compares the same spots from 12 October to 4 November 2026, with no edit we know of.",
  },
  why: {
    head: "Nobody can move your building.",
    body: [
      {
        // Says nothing about the map moving: the claim bank bars saying posts or replies lift it.
        text: "Distance decides a lot of who shows up on the map, so we work on what a person sees once they find you: your hours, your reviews, how you answer them and a website that agrees with your listing.",
      },
    ],
  },
  getHead: "What each job covers.",
  // The bold lines are in src/lib/menu.ts, with their TODOs. The text under them is SEO_DETAIL above.
  get: SEO_LINES.map((line) => ({ title: line.line, detail: SEO_DETAIL[line.id] ?? line.detail })),
  getNote: {
    text: "We ask every customer the same way and never pay for reviews, because Google bars asking only the happy ones and paying, and the FTC bans fake reviews and paying for a particular rating. We also don't build look-alike town pages or buy links, because Google's spam rules name both.",
    sources: [S.contribution, S.ftc, S.spam],
  },
  device: true,
  stepsHead: "It starts with a manager invite, and every month ends with a report.",
  // TODO(Blake): none of these dates has been timed. The menu's estimate is 5 to 7 hours
  // of checking a client on top of tools, and the first month is likely heavier. Confirm
  // that week one and day 30 are promises you can keep every time.
  steps: [
    {
      when: "First week",
      items: ["We run the baseline searches before anything changes.", "We correct what's wrong on the listing."],
    },
    {
      when: "First 30 days",
      items: ["The first posts, review requests and fixes go out.", "Your first report shows the map results beside the baseline."],
    },
    {
      when: "Every month",
      items: ["All four jobs repeat."],
    },
  ],
  need: [
    "Manager access on your Google listing. You stay the owner.",
    "A login to your site, or the name of whoever runs it.",
    "Accurate facts about your business, and photos of your real work where you can.",
    "One sign-off, at the start, on how we reply to reviews in your name.",
    "Your calls, bookings and the numbers from your Google listing, if you'll share them.",
  ],
  owns: [KEEP_PROMISE.replace("Month to month. ", "")],
  sources: [S.contribution, S.ftc, S.spam],
  serviceType: "Local search engine optimization and review management",
};

// ---------------------------------------------------------------------------
// Google Local Services Ads
// ---------------------------------------------------------------------------

const [LSA_LEADS, LSA_PROFILE] = ADS.lsa.counts;

const lsa: ServicePage = {
  slug: "google-local-services-ads",
  anchor: ADS.lsa.id,
  name: ADS.lsa.name,
  title: ADS.lsa.name,
  description: `You pay Google per valid lead in your own account, and we go through and mark every lead. Ad spend is paid directly to the platform.`,
  stage: "Clicks",
  pitchHead: "You pay Google per lead, and we go through every one.",
  pitch: "It all runs in your own account, under a monthly spending limit you set.",
  // Claim bank B6. "Paid listing" is what the scan saw: it doesn't say which ad product.
  band: {
    items: [
      { count: "26%", label: "of dental map searches showed at least one paid listing." },
      { count: "33%", label: "of HVAC map searches did." },
    ],
    basis:
      "745 of 2,910 dental and 883 of 2,644 HVAC searches. Our own phone searches from set spots, in Houston, Dallas and San Antonio for dental and Houston and Dallas for HVAC, 18 September to 4 November 2026. We counted any sponsored result on Google's local list as a paid listing, whichever ad product it was.",
  },
  why: {
    head: "Google is changing how these ads work.",
    body: [
      {
        text: "Google is moving them into Performance Max campaigns with pay-per-lead goals, starting with US home services such as plumbing and HVAC from August 2026, so last year's setup needs a fresh look.",
        sources: [S.lsaMove],
      },
    ],
  },
  getHead: "What you get each month.",
  sample: { kind: "lead-log", place: "below" },
  // TODO(Blake): not scoped or researched: eligibility by trade and health care lead
  // credits. Your menu note says setup is changing as Google moves these into Performance
  // Max. Don't print the name of Google's badge on these ads: it contains "guaranteed".
  get: [
    counted(LSA_LEADS, "We mark each lead real or not and list any we'd dispute."),
    counted(LSA_PROFILE, "We check your services, hours and service area against your Google listing."),
    ...adMonthly({
      test: "We write down what we're testing and the date we'll check it, such as taking leads only in the hours someone can answer.",
      checkins: "One line each on spend, leads and anything that went wrong.",
      report: "Numbers you can match on Google's bill, with what Google charged shown without our fee.",
    }),
  ],
  stepsHead: "We start read-only, and edits wait for your written OK.",
  // TODO(Blake): the 14 days come from the Search scope, carried here by analogy. Setup
  // steps for a brand new account depend on Google's current process, which nobody has run.
  steps: [
    {
      when: "First week",
      items: [
        "You invite us to your Google Ads account as a read-only user.",
        "We confirm what Google offers your business in your area today.",
      ],
    },
    {
      when: "First 30 days",
      items: [
        "If these ads already run, nothing changes for 14 days while we go through your leads.",
        "You get a one-page memo and a call on what we'd change first.",
        "Setup or first edits go in.",
      ],
    },
    {
      when: "Every month",
      items: ["The work above repeats.", "Your report comes by the 5th business day."],
    },
  ],
  // TODO(Blake): which documents Google asks for by trade isn't researched, so this stays
  // general. Confirm it once you've walked one trade through.
  need: [
    "Admin on your Google Ads account, with your own sign-in. We never hold your password.",
    "Your own payment method on the account.",
    "Your monthly spending limit, in writing.",
    "The services you want leads for, and the hours someone answers.",
    "Any documents Google asks you for.",
    "Which leads turned into real jobs, if you'll share it.",
  ],
  owns: ["The account is yours, you pay Google directly, and you can remove us any time."],
  sources: [S.lsaMove],
  serviceType: "Advertising management",
};

// ---------------------------------------------------------------------------
// Google Search ads
// ---------------------------------------------------------------------------

const [SEARCH_COPY, SEARCH_REVIEWS] = ADS.search.counts;

const search: ServicePage = {
  slug: "google-search-ads",
  anchor: ADS.search.id,
  name: ADS.search.name,
  title: ADS.search.name,
  description: `New ad copy, search reviews, a Friday check-in and a one-page report every month, in your own account. Ad spend is paid directly to the platform.`,
  stage: "Clicks",
  pitchHead: "We go after the searches closest to a booked job and block the ones that waste money.",
  pitch: "We work out with you where the budget goes, and we write the copy.",
  // Claim bank A6. Search counts for a metro, never quoted as a town's count. They say
  // nothing about running a campaign. The budget
  // arithmetic (F2) sits under "What we check first", because big dollar figures under the
  // hero would read as prices.
  band: {
    items: [
      { count: "90,500", label: "searches a month for \"dentist near me\" across the Houston area." },
      { count: "14,800", label: "searches a month for \"ac repair\" across Dallas." },
    ],
    basis: "Monthly search counts pulled 15 October to 4 November 2026, whole metro areas, rounded.",
  },
  why: {
    head: "On a small budget, one wrong search can eat the day.",
    body: [
      {
        text: "We mark every search that drew a click as keep, block or watch.",
      },
      {
        text: "At 50 clicks a month, it takes about 27 months to tell a 10% lead rate from a 15% one, so we test for big differences and plain faults, like ads running in hours nobody can answer.",
      },
    ],
    caption: "Arithmetic at 95% confidence and 80% power.",
    checks: [
      {
        text: "Google's auto-apply and AI Max can change keywords or ad copy with no person involved, and new Search campaigns start with AI Max on.",
        sources: [S.aiMax],
      },
      {
        text: "A $40 daily budget can spend up to about $80 in a day and about $1,216 in a month, so the limit we write down is the monthly one.",
        sources: [S.budget],
      },
      {
        text: "Google won't stop competitors from bidding on your name, so your monthly report lists the top 3 competitors in your auctions.",
        sources: [S.trademark],
      },
    ],
  },
  getHead: "We do the same five things every month.",
  sample: { kind: "search-sheet", place: "below" },
  // TODO(Blake): the scope's limits (1 campaign, 1 area, 2 services, about $1,500 of ad
  // spend) were built for $150 and don't fit $400 or 10%. So no limit prints here. How many
  // campaigns, areas and services does this price cover? Say so, and it goes on this page.
  get: [
    counted(SEARCH_COPY, "4 headlines and 1 description, checked against a rule list and approved by you."),
    counted(SEARCH_REVIEWS, "Each lists every search we blocked."),
    // The 686 stays in src/lib/menu.ts. This page's Why section already makes the point.
    ...adMonthly({
      test: "We write down what we're testing and the date we'll check it, sized to what your budget can prove.",
      checkins: "One line each on spend, problems and calls that week.",
      report: "Numbers you can match in your account and on Google's bill, with what Google charged shown without our fee.",
    }),
  ],
  stepsHead: "Not one edit before the memo.",
  // TODO(Blake): read-only length. See ADS_START in src/lib/menu.ts: this uses the scope's
  // suggestion, 14 days with no edits and no budget, bidding or area change before day 30.
  steps: [
    {
      when: "First week",
      items: [
        "You invite us as a read-only user.",
        "If an agency runs the account today, it keeps running.",
        "We save a dated baseline of campaigns, budgets, search terms and spend by hour, area and device.",
      ],
    },
    {
      when: "First 30 days",
      items: [
        "On day 14 you get a one-page memo and a 30-minute call on where the money goes and what counts as a lead.",
        "You choose: hand over, stay where you are, or stop. If you stop, you keep the memo and the exports.",
        "With your written OK, first edits go in.",
        "No budget, bidding or area change happens before day 30.",
        "On day 30 you get the first report, and we pick the first test.",
      ],
    },
    {
      when: "Every month",
      items: [
        "Approved copy goes live in the first week, unless it could spoil a running test.",
        "Your report comes by the 5th business day.",
      ],
    },
  ],
  need: [
    "Admin on your Google Ads account. If you can't get it, this doesn't start, because the account has to be yours.",
    "Google's billing in your name, and your monthly spending limit in writing.",
    "Access to Analytics and Tag Manager, or the name of whoever controls them.",
    "A front-desk tally of new calls for 14 days, with no names or numbers.",
    "Your monthly new-customer total.",
    "Your notice terms with any agency running the account today.",
  ],
  owns: [
    "You own the account and hold Admin, with your own sign-in.",
    "You pay Google directly, and we never hold your billing.",
    "We get a user invitation, read-only first and then able to edit ads but not add users. We never get Admin or a shared password.",
    "You can remove us at any time, and we step out when you cancel.",
    "We need your written yes before any budget change, and we log every change with a reason.",
  ],
  sources: [S.aiMax, S.budget, S.trademark],
  serviceType: "Advertising management",
};

// ---------------------------------------------------------------------------
// Facebook and Instagram ads
// ---------------------------------------------------------------------------

const [META_VARIATIONS, META_REVIEWS] = ADS.meta.counts;

const meta: ServicePage = {
  slug: "facebook-instagram-ads",
  anchor: ADS.meta.id,
  name: ADS.meta.name,
  title: ADS.meta.name,
  description: `New ad variations and audience reviews every month, with your real work in the photos, in your own ad account. Ad spend is paid directly to the platform.`,
  stage: "Clicks",
  pitchHead: "Get known before the AC quits.",
  pitch: "These ads run in your own ad account and put your name in front of nearby households.",
  why: {
    head: "Nobody searches for a plumber before the pipe bursts.",
    body: [
      {
        text: "These ads run on the quiet days, so people already know your name when something breaks.",
      },
      {
        text: "We write the copy, and the photos have to be yours.",
      },
    ],
  },
  getHead: "We do the same five things every month.",
  sample: { kind: "ad-phones", place: "why" },
  // TODO(Blake): nothing exists, and there's no research on file on Meta's rules, its
  // health data limits or how account ownership works there. Google's rules don't cover
  // it. The counts are by analogy to Search, for you to confirm. Look at Meta's rules before
  // this page is true for dental, clinics or law.
  get: [
    counted(META_VARIATIONS, "Copy checked against a rule list and approved by you, with your photos of real work."),
    counted(META_REVIEWS, "Where the money went, who saw it and a list of what we cut."),
    ...adMonthly({
      test: "We write down what we're testing and the date we'll check it, such as your own photos against a plain offer.",
      checkins: "One line each on spend, what ran that week and anything that went wrong.",
      report: "Numbers you can match on the platform's bill, with its charges shown apart from our fee.",
    }),
  ],
  stepsHead: "Nothing goes live without your written OK.",
  steps: [
    {
      when: "First week",
      items: [
        "You invite us to your ad account as a user.",
        "If ads have run before, we look at where the money went, and nothing changes yet.",
      ],
    },
    {
      when: "First 30 days",
      items: [
        "You get a one-page memo and a call on what we'd run first and what we'd stop.",
        "We build the audience around your service area and write the first variations.",
      ],
    },
    {
      when: "Every month",
      items: ["New variations go to you to approve.", "Your report comes by the 5th business day."],
    },
  ],
  need: [
    "Admin on your ad account, with your own sign-in. We get a user invitation and never a shared password.",
    "Your own card on the account, and your monthly spending limit in writing.",
    "Photos of your real work, and your OK to use them.",
    "Your service area, and which jobs you want more of.",
    "Your license number, if the rules put it on ads.",
    "Health practices and law firms: your OK on the copy. We upload no patient or client lists, and no ads follow past visitors.",
  ],
  sources: [],
  serviceType: "Advertising management",
};

// ---------------------------------------------------------------------------
// Website rebuild. From documents/research/site-template-scope-2026-10-15.md, with its
// skeptic's corrections applied where they change what an owner is told.
// ---------------------------------------------------------------------------

const rebuild: ServicePage = {
  slug: "website-rebuild",
  anchor: REBUILD.id,
  name: REBUILD.name,
  title: REBUILD.name,
  description: `A new site in accounts you own, with your old links redirected, your email records carried over and your facts matched to your Google listing.`,
  stage: "Conversion",
  pitchHead: "You get a new website in accounts you own.",
  pitch: "This goes in a plan when the site you have is broken or doesn't work on a phone. The new site keeps running whether or not you keep working with us.",
  why: {
    head: "A new homepage is the easy part.",
    body: [
      {
        text: "The risk is everything attached to the old one: your email runs on the same domain, old page links are on business cards and other sites, and the phone number has to match your Google listing.",
      },
      {
        text: "A new site won't fix your map results, so if yours works on a phone and says the right things, keep it.",
      },
    ],
  },
  getHead: "What goes into the new site.",
  sample: { kind: "old-addresses", place: "why" },
  // TODO(Blake): scope document only. No template is built and no dry run has happened. The
  // page counts are the scope's. The scope also carried over up to 25 old pages, and its
  // skeptic says about 5 is what the hours allow, so no number prints: choose one.
  // TODO(Blake): the 8 weeks of checks and the map scans are in the scope, and the skeptic
  // says they should stop if the client's monthly plan stops. Decide who pays for them.
  // TODO(Blake): "any developer can make them" needs the template licence to let any
  // contractor of the client change the site and host it anywhere. The scope wants an
  // attorney to look at that clause before the first sale.
  get: [
    {
      title: "About 15 to 20 pages",
      detail:
        "Home, a services page and up to 8 service pages for work you do in-house, an areas page and up to 6 town pages built on real local facts, About, Reviews, FAQ, Contact and the legal pages.",
    },
    {
      title: "Every old link handled",
      detail: "Old links keep working, each landing on its closest new page.",
    },
    {
      title: "Your email keeps working",
      detail: "We carry over every email record and check that it works.",
    },
    {
      title: "One set of facts",
      detail: "Your name, address, phone, hours and license numbers come from one checked list and match your Google listing.",
    },
    {
      title: "The rules for your business built in",
      detail: "HVAC and plumbing sites print your license number on every page. Dental sites use a call link and your own booking tool in place of a contact form.",
    },
    {
      title: "Accessibility built in",
      detail: "Built for screen readers and keyboards to a WCAG 2.2 AA target, and checked by software and then a person.",
    },
    {
      title: "Search Console and visit numbers in your name",
      detail: "Google Search Console and a sitemap in your name, plus cookie-free numbers on visits and taps on your call and booking links.",
    },
    {
      title: "Checks after launch",
      detail: "Daily in the first week and weekly to week 8, with map scans at weeks 2, 4 and 8, so you see where you stood before and after.",
    },
    {
      title: "The whole site handed over",
      detail: "The source, plain files, your domain's records and a list of your accounts. Changes after that need a developer, and any developer can make them.",
    },
  ],
  // TODO(Blake): no dates print before launch, on purpose. The scope says no turnaround
  // promise before one dry run. Its suggested promise, once you've done that, is a preview
  // within 7 business days of a complete intake and launch within 30 days of one, paused
  // while waiting on an owner, an agency or email. First paid launch is about 6 to 8 weeks
  // from go. Put a date here once that's real. Monitoring has its weeks because that's
  // after launch and counts from a date you control.
  getNote: {
    text: "This doesn't cover moving your email, getting a domain back from an old agency, photography, logo design, online payments, patient forms, chat widgets or a content editor.",
  },
  stepsHead: "The domain moves first, and the website switches last.",
  steps: [
    {
      when: "First week",
      items: [
        "On an intake call we confirm the domain login is yours, and you create the free hosting account on a shared screen.",
        "We build once we have everything on the list below.",
        "We tell you about any problem on the old setup, like a domain held by an agency, before anything moves.",
      ],
    },
    {
      when: "Before launch",
      items: [
        "You settle any conflicts in your facts, such as phones, hours and licenses.",
        "You get a private preview and one round of changes, and your approval goes on record.",
        "After the domain moves, we check email both ways for 48 to 72 hours before the website switches.",
      ],
    },
    {
      when: "After launch",
      items: ["We run the checks through week 8, and you get the handover."],
    },
  ],
  need: [
    "The login to your domain. If you don't hold it, that comes first.",
    "Primary ownership of your Google listing.",
    "Your logo, at least 6 real photos and headshots, with your OK to use them. We use no stock people.",
    "Who works there, with credentials and full license numbers.",
    "The services you do in-house, and by whom.",
    "Your fees, warranty and financing lender, or tell us you have none.",
    "The booking links you use, and whether anyone answers after hours.",
    "Word that you own the old site's copy, or that you want it rewritten.",
    "For dental, your insurance plans and Notice of Privacy Practices.",
  ],
  // TODO(Blake): the scope has this sold only with the monthly work. The price list has it
  // with no condition, so none prints. Also unsettled: when the $997
  // is collected and the refund rule, a price for more than one location, and Texas sales
  // tax on website work (the skeptic's note cites a Comptroller ruling).
  sources: [],
  serviceType: "Website design",
};

// ---------------------------------------------------------------------------
// AI Voice Receptionist. From product-requirements.md (a) and voice-vendors/verdict.md.
// ---------------------------------------------------------------------------

const voice: ServicePage = {
  slug: "ai-voice-receptionist",
  anchor: VOICE.id,
  name: VOICE.name,
  title: VOICE.name,
  description:
    "After-hours and overflow calls get an answer instead of voicemail. It tells callers it's an AI, never decides how serious something is, takes a message or hands off to your on-call person.",
  stage: "Conversion",
  pitchHead: "It answers your calls, says it's an AI and gets you the message.",
  pitch: "After-hours and overflow calls get an answer instead of voicemail, because a paid click at 7pm still needs one.",
  why: {
    head: "People don't stop searching at 5.",
    body: [
      {
        // Claim bank D1 invites "open 24 hours" as a shortcut. This line closes it.
        text: "The receptionist picks up after hours, and your listed hours stay the hours you're open.",
      },
    ],
  },
  getHead: "What happens on every call.",
  sample: { kind: "call-script", place: "beside" },
  // TODO(Blake): no delivered system, no vendor signed, and no test call has ever been
  // placed. Every line below has to be true the day you sell this. The vendor note says
  // one-client HVAC or plumbing first, message and transfer only, refer dental to a dental
  // product, wait on law. It also needs insurance, and a way to tell the owner about each
  // call: the platform's own alerts don't work per call, so that's a build.
  get: [
    {
      title: "It says what it is, first thing",
      detail: "The first sentence names your business and says it's an AI and that the call may be recorded. It never claims to be a person.",
    },
    {
      title: "It never decides how serious something is",
      detail: "It takes a message or hands off, and when in doubt it hands off, using a word list you sign off on.",
    },
    {
      title: "A caller who smells gas gets one short line",
      detail: "It tells them to leave and call from outside, then lets them go, as the utility advises.",
      sources: [S.gas],
    },
    {
      title: "Each kind of business gets its own script",
      detail: "Clinics and dental: any sign of danger gets \"hang up and call 911\". Vets: your emergency clinic's name and number. Law firms: it says it's AI and not a lawyer, and takes facts only.",
      sources: [S.florida241],
    },
    {
      title: "A person at the end of the line",
      detail: "You name an on-call person and a backup, we test the transfer, and the caller gets a plain answer if nobody picks up.",
    },
    {
      title: "A message for every call it takes",
      detail: "Who called, the number and what they need. On a health call it doesn't ask for symptoms.",
    },
  ],
  stepsHead: "We run test calls before it takes a real one.",
  // TODO(Blake): what happens each month is my draft from the requirements note. No count is
  // set, and you asked for countable deliverables. Set them once one has run.
  steps: [
    {
      when: "First week",
      items: [
        "We ask which software you run. If it comes with a receptionist that fits, we'll tell you to use that.",
        "You pull last month's after-hours calls from your phone log, so the plan goes by real calls.",
      ],
    },
    {
      when: "First 30 days",
      items: [
        "We write the script and word list, and you sign off on both.",
        "You ask your insurer whether an AI answering your calls changes your coverage.",
        "We test every path and log the results: a message, a transfer, nobody answering and a gas smell. We test again after every script change.",
        "It goes live through your call forwarding.",
      ],
    },
    {
      when: "Every month",
      items: [
        "We send you the number of calls and minutes.",
        "We test the transfer again.",
      ],
    },
  ],
  need: [
    "The name of your field or practice software.",
    "An on-call person, a backup and their numbers.",
    "Your hours and services.",
    "Vets: the emergency clinic you send people to.",
    "Clinics and dental: this touches patient information, so it doesn't start until a privacy program is in place and you, we and each vendor have signed an agreement.",
    "Law firms: your written sign-off, and your own lawyer on the script.",
  ],
  // TODO(Blake): no price is set, and none prints on the site. Work it out for the proposal
  // from the call count. The vendor note suggests $249 with 300 minutes and $0.40 a minute after, plus a setup fee you set.
  sources: [S.gas, S.florida241],
  serviceType: "Telephone answering service",
};

// ---------------------------------------------------------------------------
// Lead Nurture SMS. From product-requirements.md (b) and (e).
// ---------------------------------------------------------------------------

const sms: ServicePage = {
  slug: "lead-nurture-sms",
  anchor: SMS.id,
  name: SMS.name,
  title: SMS.name,
  description:
    "A follow-up system that texts past clients who opted in. We check the list before the first text goes out.",
  stage: "The Flywheel",
  pitchHead: "You earned these clients once. Stay in touch with the ones who said yes.",
  pitch: "We set up a follow-up system that texts past clients who opted in.",
  why: {
    head: "An old invoice isn't permission.",
    body: [
      {
        text: "Marketing texts need signed written consent that names the number and says agreeing isn't a condition of buying, and you have to honor a STOP within 10 business days. A number on an invoice doesn't meet that.",
        sources: [S.fcc],
      },
      {
        text: "So the first job is checking your list, and you should expect it to come back shorter.",
      },
    ],
  },
  getHead: "We check consent first, then set up the follow-up.",
  sample: { kind: "list-check", place: "why" },
  // TODO(Blake): nothing exists. The research ranks texting old customer lists last: the
  // client must show a consent record per number and most old lists are expected to fail.
  // Not for dental, walk-in or law until counsel clears it. $500 a violation, up to three
  // times if willful, and who's liable when your system sends for a client is a lawyer's
  // question. Counsel words the consent, and insurance isn't arranged.
  // TODO(Blake): the quiet hours are the research's suggested default, stricter than the
  // rules. Counsel should say whether one instant reply can go at night.
  get: [
    {
      title: "A consent check, number by number",
      detail: "Where each number came from, the wording they agreed to and when.",
    },
    {
      title: "An opt-in box on your forms",
      detail: "Separate, optional and unticked, naming your business as the sender, so your list grows the right way.",
    },
    {
      title: "Your business registered as the sender",
      detail: "Carriers want every business registered. We use your list only, with no shared lists or bought leads.",
    },
    {
      title: "Messages written for your business",
      detail: "You read each one first, and no health details ever go in a text.",
    },
    {
      title: "One master opt-out",
      detail: "STOP and HELP work from the first text, and a STOP covers text and calls across every list.",
    },
    {
      title: "Quiet hours, on by default",
      detail: "Automated texts go out only from 9am to 8pm Monday to Saturday and noon to 8pm Sunday. A lead at 11pm goes to you as an alert.",
    },
  ],
  stepsHead: "Only numbers that pass the check get a text.",
  // TODO(Blake): registration timing is unmeasured: the research estimates 2 to 3 weeks a
  // client because the site and form usually need fixing first, so no number prints. No
  // monthly count is set either, and you asked for countable deliverables.
  steps: [
    {
      when: "First week",
      items: [
        "We go through your list number by number, including old opt-outs and numbers that changed hands.",
        "You find out how many can be texted and how many can't.",
      ],
    },
    {
      when: "First 30 days",
      items: [
        "The opt-in box goes on your forms, and your privacy policy gets the wording it needs.",
        "We register your business, and you sign off on the messages.",
        "The first texts go out once registration clears.",
      ],
    },
    {
      when: "Every month",
      items: [
        "Follow-ups go out inside quiet hours, and every STOP goes on the master list.",
        "We tell you how many texts went out and how many people opted out or replied.",
      ],
    },
  ],
  need: [
    "Your customer list, with where each number came from.",
    "Any consent records, and every old opt-out.",
    "A live website that matches your business name.",
    "Your legal business name and tax ID.",
    "A way to edit your forms, or the name of whoever does.",
    "Dental, walk-in and law firms: your lawyer clears it first. A reminder and a sales follow-up aren't the same thing.",
  ],
  // TODO(Blake): no price is set, and none prints on the site. Registration and carrier fees
  // sit on top, and nobody has said who pays them.
  sources: [S.fcc],
  serviceType: "Text message marketing",
};

export const SERVICE_PAGES: ServicePage[] = [seo, lsa, search, meta, rebuild, voice, sms];

export function servicePageBySlug(slug: string): ServicePage | undefined {
  return SERVICE_PAGES.find((p) => p.slug === slug);
}

export const SERVICE_LINKS = SERVICE_PAGES.map((p) => ({ href: `/services/${p.slug}`, label: p.name }));
