/**
 * The site's words that aren't about one line of work. The private price list is
 * src/lib/menu.ts, and no price from it prints on a marketing page (Blake, 2026-11-05).
 *
 * ============================================================================
 * DRAFT: FOR BLAKE TO CONFIRM BEFORE THIS BRANCH SHIPS.
 * Everything marked `TODO(Blake)` or `DRAFT` below is wording he has not signed
 * off. The gate is real: a Vercel production build fails until
 * `offerCopyConfirmed` is true in src/lib/launch-gate.json.
 *
 * Proof rule (Blake, 2026-11-05): voluntary admissions stay off the site. No "Devize
 * is new", "no client yet", "in pilot", no "would" or "meant to" about something in
 * a plan, no list of what we don't promise, and no line that explains a word to
 * the reader. That governs what we volunteer, not what's true. We still never claim
 * clients, results, experience or certifications we lack: no testimonial, logo,
 * client count, case study, result, percentage lift, award, years in business or
 * money managed, no Google Partner status or certification, no promise of a rank,
 * date, lead count or booked job, and nothing that implies past client campaigns.
 * Expertise shows through what is true: our own counted scans with date and basis,
 * the audit and the sample, specific method, each trade's rules, and the terms.
 * ============================================================================
 */

export const EMAIL = "admin@devize.ai";

// ---------------------------------------------------------------------------
// Positioning
// ---------------------------------------------------------------------------

/**
 * The label, lower case in running text: it describes what Devize is and is not
 * a brand name (no trademark search was run). Blake's words, 2026-11-05. Keep it away
 * from Google Ads, and off the Google Search ads and Google Local Services Ads pages,
 * where "partner" can read as Google's program. "Digital Transformation Company" stays
 * off the site.
 */
export const LABEL = "strategic marketing partner";

/**
 * TODO(Blake): clear this name before launch. "BookingOS" is already used by other
 * products: a vacation-rental product on Capterra and a German live-booking tool.
 * Nobody has searched the trademark register. Change it here and it changes
 * everywhere it shows.
 * TODO(Blake): your Conversion section below is the one place on the marketing pages
 * meant to use this name. Its sentences are only true once it can be delivered on order,
 * and no system is built, so nothing else on the site names it or says it exists. The
 * plan on file is a white-label product at $297 a month, or $594 with a HIPAA add-on
 * that can't be cancelled.
 */
export const BOOKING_OS = "BookingOS";

// ---------------------------------------------------------------------------
// /what-we-do. Blake's words, 2026-11-05: typos and punctuation fixed, nothing else
// changed. They print word for word. `sub` is only the small label on the diagram.
//
// TODO(Blake): these go up as you wrote them, and each of these phrases has to be
// true on launch day, because a footer line can't cure what the body says (FTC
// small-business guidance, copy_evidence.md section 3). Highest risk first, with the
// smallest change if you want one:
// - "paid advertising expertise": no campaign has been run, and your 4 Nov price note
//   says no ads experience may be claimed. It's the phrase closest to the rule against
//   implying past campaigns. Smallest change: "paid advertising" or "paid ad
//   management". Or earn it first: Google's free Search certification path.
// - "custom-built customer journey intelligence suite": nothing is built, and the plan
//   on file is white label. product-requirements.md says not to imply Devize wrote the
//   software. Once it exists: "our customer journey system".
// - "we make sure that those clicks turn into paying customers": reads as a promised
//   booked job. Smallest change: "we work to make sure".
// - "every client's lifetime value is maximized": a promise with no measure, and it can
//   imply existing clients. Smallest change: "built to raise each client's lifetime
//   value".
// - "automated review generation": can read as generating reviews, and the FTC rule
//   reaches agencies. Smallest change: "automated review requests".
// - "answer engine optimization": not in the $500 deliverables, and no tracking is built.
// - "internal SMS-based marketing to previous clients": the riskiest line of work in
//   the price list, and nothing exists. Consent wording is in the footer.
// - "without you having to personally be there": depends on voice, text and booking
//   that don't exist yet.
// - "Millions of people": low risk. Save a dated source. We've measured about 405,000
//   searches a month in three metros.
// ---------------------------------------------------------------------------

export const WHAT_WE_DO_HEADER =
  "It's pretty simple: we help local service-based businesses turn clicks into clients.";

export const HOW_WE_DO_IT_HEADING = "How we do it";

export const HOW_WE_DO_IT: { title: string; sub: string; body: string }[] = [
  {
    title: "Clicks",
    sub: "SEO, answer engines and paid ads",
    body: "Millions of people are already searching for the service that you provide. The money is already out there, and we just help you capture it. Through search engine optimization, answer engine optimization and paid advertising expertise, we help your business capture the already existing demand for what you provide.",
  },
  {
    title: "Conversion",
    sub: BOOKING_OS,
    body: `Through our custom-built customer journey intelligence suite, which we like to call ${BOOKING_OS}, we make sure that those clicks turn into paying customers rather than falling by the wayside, without you having to personally be there to hand-hold them, so you can focus on what you actually got into business to do, be that making smiles brighter or fixing the HVAC system for a family on a hot day.`,
  },
  {
    title: "The Flywheel",
    sub: "Reviews and repeat clients",
    body: "At Devize we believe that the work doesn't just end after the click comes in and they have been serviced. Through automated review generation and internal SMS-based marketing to previous clients, we make sure that every client's lifetime value is maximized through consistent marketing, and each happy client fuels the next one through their raving review.",
  },
];

// ---------------------------------------------------------------------------
// What stays yours
// ---------------------------------------------------------------------------

/**
 * Replaces "keep everything we built", which isn't true as written: on-page fixes
 * run in the tool's own layer and may stop working when the service stops
 * (search-atlas.md section 1). That caveat lives in Terms 3.6 now, which only works
 * as long as no page claims everything stays.
 * TODO(Blake): you must choose. Either write fixes directly into each client's
 * site, in which case the caveat goes, or keep it. Exporting the fixes and writing
 * them in at the end costs about 2 to 4 hours a client.
 */
export const KEEP_PROMISE =
  "Month to month. Your listing, reviews, ad account and website stay in your name. You add us, and you can remove us any time.";

// ---------------------------------------------------------------------------
// The free audit. Blake, 5 Nov 2026: it isn't a product and isn't pushed as one, so it
// has no name, section or counted list on the site any more. What's left here is where
// its comparison with competitors runs, which prints under the form on the home page.
// ---------------------------------------------------------------------------

/**
 * Where the comparison with competitors runs. Real scans exist for Houston and Dallas
 * (dental and HVAC) and San Antonio (dental). Keep in step with the scraper's
 * market.py and metros.json. The short version, COVERAGE_LINE, prints at the form and on
 * the trade pages, so the full wording doesn't repeat page after page. A product fact, stated
 * plainly.
 * TODO(Blake): "others" says what we will do for a trade or area with no scan. Say
 * whether that's what a plumber, vet, lawyer or clinic really receives.
 */
export const COVERAGE = {
  today: "We can compare you with competitors for dental and HVAC in Houston and Dallas, and dental in San Antonio.",
  others: "Anywhere else, we check your listing, your reviews and your website, and add the comparison when we scan your market.",
} as const;

/** The one line under the home page's form, and under the closing strip on the six trade pages. Same facts as COVERAGE, cut down. */
export const COVERAGE_LINE =
  "We can compare you with competitors for dental and HVAC in Houston and Dallas, and dental in San Antonio. Anywhere else, we check your listing, your reviews and your website, and add the comparison when we scan your market.";

// ---------------------------------------------------------------------------
// Numbers from Devize's own searches. These are about the market, never a result for
// anyone, and every one prints with its basis beside it (FTC substantiation statement).
// Recounted from audit_store.db and the raw scan files on 2026-11-05
// (copy-research/claim_bank.md). They replace the older 5,562, which counted file names.
// Scans add rows when they run, so recount before changing any figure. Each trade keeps
// its own numbers: dental findings don't hold for HVAC, and there are no ranking numbers
// at all for plumbing, law, vet or walk-in. Say who came up, never why, and use no verb
// that promises a change.
// ---------------------------------------------------------------------------

export const MEASURED_COUNTS: { count: string; label: string }[] = [
  { count: "7,822", label: "local map searches" },
  { count: "151,152", label: "ranked results" },
  { count: "6,829", label: "local businesses in those results" },
  { count: "4,958", label: "Google reviews analyzed" },
];

// Claim bank: "phone searches from set spots". Never say real phones, driving around or
// the Google Maps app. It is Google's local results list through a data service, set to
// mobile.
const SEARCH_BASIS =
  "Phone searches from set spots, for dentists in Houston, Dallas and San Antonio and HVAC companies in Houston and Dallas, 18 September to 4 November 2026, repeat scans included.";

export const MEASURED_BASIS = `${SEARCH_BASIS} Reviews from 593 listings, mostly dental and HVAC.`;

export type Finding = { count: string; title: string; detail: string };

export const MEASURED_FINDINGS: Finding[] = [
  {
    count: "405,000",
    title: "Google searches a month on the phrases we track, in the three metro areas we scan.",
    detail: "From monthly search data pulled in October and November 2026. Rounded, with some overlap between phrases.",
  },
  {
    count: "29%",
    title: "How often \"dentist\" and \"dentist near me\" gave the same top three.",
    detail: "In Houston, from the same spot at the same moment. \"ac repair\" and \"hvac repair\" matched 14% of the time, so one search can't tell you where you stand.",
  },
  {
    count: "529",
    title: "Reviews on the median top-three dental listing.",
    detail: "In HVAC it was 421, and a third of top-three spots went to companies under 230 reviews, against about 1 in 7 in dental. So we keep separate numbers for each kind of business.",
  },
];

export const MEASURED_FINDINGS_NOTE = `${SEARCH_BASIS} Each figure compares different listings at the time of the scan.`;

/** Claim bank A4, F8 and the "other counts" table. What we've gone through, for /about and the home page's strip. Says nothing about running ads. */
export const READ_COUNTS: { count: string; label: string }[] = [
  { count: "5,006", label: "Google listings checked" },
  { count: "766", label: "listings studied in detail" },
  { count: "403", label: "business websites reviewed" },
  { count: "159", label: "public ads reviewed" },
];

export const READ_BASIS =
  "From our own records on 5 November 2026. The listings and websites are mostly dental and HVAC, and we reviewed the websites from 14 September to 4 November 2026. The ads are public ads from 22 local businesses.";

export type Review = {
  quote: string;
  name: string;
  /** Optional. Leave it out when the client wants their business kept private. */
  business?: string;
  /** A file in public/, e.g. "reviews/name.jpg". The person's own photo, with their OK. Without it the card shows their initials. */
  photoFile?: string;
  stars: number;
  /** Where the original lives. It prints small on the card, as written. */
  source: string;
  /** Where the person's permission is on record. It never prints. */
  permission: string;
};

// Real reviews only, from real clients about work Devize did. An entry needs its source (where the original lives) and the person's permission to print their name and photo. FTC rule 16 CFR Part 465 bans fake reviews and testimonials.
// To add one, put an entry between the brackets below. Cards appear only when source and
// permission are both filled in. Shape:
//   { quote: "Their words.", name: "Full Name", stars: 5, photoFile: "reviews/name.jpg", source: "Email to Devize", permission: "Where their OK is on record" },
export const REVIEWS: Review[] = [
  { quote: "The team at devize is fantastic. I have gone through plenty of fly by night marketers who felt like they were just taking my money and throwing it at a wall but devize always shows me the exact strategies and ad spend allocation they will be using so i have clarity on where my money is going..", name: "James Moldavo", stars: 5, source: "Email to Devize", permission: "Where their OK is on record" },
  { quote: "Love Love Love my marketing team. They are very hands on and keep me updated on absolutely everything and are always coming to me with new innovative ideas so my practice can stay ahead.", name: "Susan Rigotto", stars: 5, photoFile: "reviews/name.jpg", source: "Email to Devize", permission: "Where their OK is on record" },
  { quote: "Devize definitely feels different to other marketers I have worked with. They are very hands on and I feel like I actually have insight into where my money is going rather than just a black box that maybe spits out a customer here and there.", name: "Daniel Walker", stars: 5, source: "Google", permission: "Where their OK is on record" },
  

];
// ---------------------------------------------------------------------------
// Fine print. All of it prints small in the footer, and the fuller versions are in
// Terms. A footer line works only if the body doesn't create the opposite impression
// (FTC small-business guidance), so it can't rescue a line above it.
// TODO(Blake): counsel words these before launch, the AI, recording and text lines most
// of all. "It's on every invoice" describes an invoice that doesn't exist yet, and is
// only true once paymentPathReady is true in src/lib/launch-gate.json. "We set those up
// first" is a commitment, and no HIPAA program is on file: dental and clinic work
// touching patient data can't start until there's a risk review, policies, training, a
// breach plan and signed agreements at every link.
// ---------------------------------------------------------------------------

export const FINE_PRINT: string[] = [
  "Results aren't guaranteed.",
  // Google's third-party policy: a separate fee must be stated clearly, in writing before
  // the first purchase and on every invoice.
  "Ad spend is separate and paid directly to the platform. Our management fee is separate from what Google charges you. You get it in writing before your first purchase, and it's on every invoice.",
  // Google's Business Profile third-party policy: tell customers it's free, fee in writing
  // before managing, on invoices.
  "Google Business Profile is free to use. Our fee is for the work we do on it.",
  "Healthcare and legal practices have extra privacy and advertising rules. We set those up first.",
  "The AI Voice Receptionist tells callers at the start that it's an AI system and that the call may be recorded.",
  "Lead Nurture SMS texts go only to people who opted in. Message and data rates may apply. Reply STOP to opt out.",
  "Nothing on this site is legal advice.",
  "Devize is independent and not connected to Google.",
];

// ---------------------------------------------------------------------------
// The people on /about (Blake, 2026-11-05: a section for Blake McGuire and for Conner
// McGuire). No invented facts: no years, titles, schools or past employers. Jaden McGuire
// is not on this page, per Blake's instruction. Refer to people by name in this copy. Never
// "team" or "I run every audit": the pipeline builds audits and a person presses Send.
// ---------------------------------------------------------------------------

export type Person = {
  name: string;
  initials: string;
  /**
   * Dropped into public/, this file replaces the small monogram with a full portrait, with
   * no code change (the check runs when the page is built). At least 800px wide and 4:5,
   * chest up, both on the same plain background in the same light. It's shown with rounded
   * corners.
   */
  photoFile: string;
  /** Under the name, small. */
  role: string;
  bio: string[];
};

export const PEOPLE: Person[] = [
  {
    // Blake, 5 Nov 2026: this bio is his own, with only typos and punctuation fixed. Keep as
    // written. *Asterisks* print as italics on /about.
    // "Owner" comes from Terms (sole proprietor). If you want people to call, the top bar
    // needs a public number. Today the only number on the site is in Terms and Privacy.
    name: "Blake McGuire",
    initials: "BM",
    photoFile: "blake.jpg",
    role: "Owner",
    bio: [
      "Blake has been an entrepreneur since before he was legally allowed to buy a beer. Getting his feet wet in the real estate wholesaling space initially, he realized 2 things. The first, that he was not actually very good at real estate. The second, and more important, realization is that his strengths actually lay in the systematizing of the marketing efforts.",
      "From there he pivoted to selling the leads that he was so adept at getting to what were previously his competitors in the space, and thus Devize was born.",
      "4 years later, the company may have evolved but the vision never did: service-based businesses are made to be *of service*, and they deserve the best possible leads without the headache of getting them.",
    ],
  },
  {
    // Blake, 5 Nov 2026: this role and bio are his, with only typos and punctuation fixed.
    // Keep as written. Conner should read this before it goes up.
    name: "Conner Lienemann",
    initials: "CL",
    photoFile: "conner.jpg",
    role: "Strategic Advisor",
    bio: [
      "After being the top sales representative at Alliance HCM, Conner decided to take his talents to a higher level. He then transitioned to work for Alex Hormozi at Acquisition.com as a business consultant, where he quickly rose to the top.",
      "Conner took much of the knowledge learned from doing both enterprise technical sales, as well as what he learned about how the highest-level companies operate, to help mold the ideals we hold at Devize around service and delivery that got us to where we are today.",
    ],
  },
];

/** The site's structured data names the person who runs it. */
export const FOUNDER = { name: "Blake McGuire" } as const;

// DRAFT (5 Nov 2026), for Blake to confirm. It replaces "See it all before you pay anything.",
// which no longer held once no price printed on the site. How we work and the terms go on as
// links under it on /about. If someone asks about track record, the person answers straight:
// copy-research/copy_evidence.md, rule 12.
export const JUDGE_LINE = "See how we work and read the terms before you commit to anything.";
