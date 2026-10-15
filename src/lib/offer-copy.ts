/**
 * The offer's words and numbers, in one place (2026-10-15, site pass 2).
 *
 * ============================================================================
 * DRAFT: FOR BLAKE TO CONFIRM BEFORE THIS BRANCH SHIPS.
 * Every value marked `// DRAFT` below is wording or a quantity Blake has not
 * signed off. Change it here and it changes everywhere it shows (hero, price
 * card, work list, founder block, FAQ answers and the JSON-LD Offer).
 * Decided by Blake on 2026-10-15, so NOT draft: the $750 flat monthly price,
 * local SEO and AEO included, month to month with cancel any time, the free
 * audit, and his photo and name by the call to action.
 *
 * The gate is real (2026-10-15, pass 2 review): a Vercel production build
 * fails until `offerCopyConfirmed` is true in src/lib/launch-gate.json. Set it
 * once every DRAFT here and in faq.tsx is confirmed or changed.
 * ============================================================================
 */

export const EMAIL = "admin@devize.ai";

// ---------------------------------------------------------------------------
// Price (Blake, 2026-10-15)
// ---------------------------------------------------------------------------

export const PRICE = {
  /** Dollars a month. Also feeds the Service Offer in the home page JSON-LD. */
  amount: 750,
  currency: "USD",
  display: "$750",
  headline: "$750 a month, flat.",
  included: "Local SEO and AEO included.",
  term: "Month to month. Cancel any time.",
  audit: "The audit is free.",
  /** One line by the call to action. */
  ctaLine: "If you want the monthly work: $750 a month, flat. Month to month. Cancel any time.",
  /** Blake, 2026-10-15: "Cancel any time and keep everything we built." Not draft. */
  keep: "Cancel any time and keep everything we built: your listing, your reviews and every page we write.",
  /** The same promise for the price card, which already says "Cancel any time" on the line above. */
  keepShort: "Keep everything we built if you leave: your listing, your reviews and every page we write.",
  // DRAFT: why the price is what it is, in plain words (research: say why, never call it "the market rate").
  why: "One focused job: your Google listing, your map, your site's pages and the facts AI assistants read. No software to learn and no long contract.",
} as const;

// ---------------------------------------------------------------------------
// Optional website rebuild (Blake, 2026-10-15: "add on website rebuild for 997")
// ---------------------------------------------------------------------------

// The price and ownership are Blake's decisions; the wording is DRAFT. Built on Devize's
// template, in accounts in the client's name (their domain, a free hosting account they
// own), so there is no hosting fee and nothing stops working if they cancel.
// Scope: Devize Audit Scraper/documents/research/site-template-scope-2026-10-15.md.
export const REBUILD = {
  amount: 997,
  currency: "USD",
  display: "$997",
  title: "Optional: website rebuild",
  priceLine: "$997 one time. You own it.",
  // DRAFT
  detail:
    "A fast new site on your own domain: a page for each service and town you serve, your own photos, and the same name, phone and address as your Google listing. Built in accounts in your name, with no hosting fee. If you cancel, it stays up and it stays yours.",
} as const;

// ---------------------------------------------------------------------------
// What you get each month
// ---------------------------------------------------------------------------

// DRAFT: every quantity in this list (4 posts, 2 business days, up to 2 pages,
// the review routine in the first month) is a proposal for Blake to confirm or
// change. Keep only what he can deliver every month for every client. Once
// confirmed, the Order template should list these same items and the fee
// (terms 3.1 points to this list).
export const MONTHLY_WORK: { title: string; detail: string }[] = [
  {
    title: "Your Google listing kept complete and current", // DRAFT
    detail: "Categories, services, hours, photos and questions, checked every month.", // DRAFT
  },
  {
    title: "4 Google posts a month", // DRAFT (quantity)
    detail: "On your listing, where anyone who opens it can read them.", // DRAFT
  },
  {
    title: "Every review answered within 2 business days", // DRAFT (quantity)
    // The clock can only be ours if the sign-off is once, on the wording and
    // approach, not on each reply (FAQ and terms 3.4 say the same).
    detail: "In wording you sign off on once, at the start, so no reply waits on you. Never confirming someone is a patient or a customer.", // DRAFT
  },
  {
    title: "A simple routine so every customer is asked for a review", // DRAFT
    detail: "Set up in your first month. No paying for reviews and no asking only happy customers.", // DRAFT (timing)
  },
  {
    title: "Up to 2 new service or town pages for your site a month", // DRAFT (quantity)
    detail: "Written for your customers, never copy-paste pages with the town name swapped, until each service and town you serve has its own. If someone else runs your site, we send them the pages to put up.", // DRAFT
  },
  {
    // The AEO part of "Local SEO and AEO included", as a buyer can see it.
    title: "Your site's facts kept machine-readable", // DRAFT
    detail: "Structured data for your services, hours and towns, and plain answers on your pages to the questions customers ask before they call.", // DRAFT
  },
  {
    // One directory deliverable, worded the same in services.tsx (both cards)
    // and terms 3.2: checked and corrected, not "listed everywhere".
    title: "Your business details checked on the main directories", // DRAFT
    detail: "Corrected where we can, with you claiming any that only the owner can change. The same name, address and phone everywhere you're listed.", // DRAFT
  },
  {
    title: "The same map re-run every month", // DRAFT
    detail: "The same searches from the same spots, with a short note on what was done.", // DRAFT
  },
];

// ---------------------------------------------------------------------------
// What we won't do
// ---------------------------------------------------------------------------

// DRAFT: wording. The commitments themselves follow the research (section 4)
// and the terms v2.0 draft (no guarantee, no fake reviews, month to month,
// the client stays the owner).
export const WONT_DO: { title: string; detail: string }[] = [
  {
    title: "No guaranteed spot", // DRAFT
    detail: "Nobody controls Google's map or what an AI assistant says. Be careful with anyone who promises either.", // DRAFT
  },
  {
    title: "No fake or paid reviews", // DRAFT
    detail: "And no asking only your happy customers. Both break Google's rules.", // DRAFT
  },
  {
    title: "No long contract", // DRAFT
    detail: "Month to month. Cancel any time, and it ends with the month you've paid for.", // DRAFT
  },
  {
    title: "Nothing that isn't yours", // DRAFT
    detail: "You own your Google listing and your site. Cancel any time and keep everything we built, every page included. Nothing we make lives in an account you'd have to keep paying for.", // DRAFT
  },
  {
    title: "Nothing that risks a suspension", // DRAFT
    detail: "No made-up addresses, no search words stuffed into your business name.", // DRAFT
  },
];

// ---------------------------------------------------------------------------
// Founder (Blake, 2026-10-15: photo and name by the call to action, plus a
// short founder block). No invented bio facts: no years, team size or titles.
// ---------------------------------------------------------------------------

export const FOUNDER = {
  name: "Blake McGuire",
  initials: "BM",
  town: "Willis, Texas",
  townShort: "Willis, TX",
  /**
   * Dropped into public/ this file replaces the initials avatar with no code
   * change (the check runs when the page is built). Use a square or portrait
   * photo at least 256px wide: it is shown as a cropped circle, and next/image
   * sizes by width before the crop, so a landscape photo comes out soft.
   * Testing the swap locally: clear .next/dev/cache/images first, or the dev
   * server can serve an older /blake.jpg for up to 4 hours.
   */
  photoFile: "blake.jpg",
  // DRAFT: Blake's own suggested wording for the line by the call to action.
  // True while the reply funnel runs in draft mode (the scraper's
  // autopilot.json funnel_mode "draft": Blake sends each audit himself). If
  // funnel_mode goes to "auto", reword this, the bio's first line and the
  // FAQ's "He runs every audit himself", for example "Every audit comes from
  // me, and I answer every email myself."
  chip: "I run every audit myself.",
  // DRAFT: the founder block's two or three sentences.
  bio: [
    "I run Devize, and I run every audit myself.", // DRAFT
    "I do this work because Google's map decides who gets looked at first, and an owner can't see that map from a customer's phone a few miles away. The audit shows it to you.", // DRAFT
    "I'll tell you plainly what I'd fix, what nobody can promise, and what was done each month.", // DRAFT
  ],
} as const;
