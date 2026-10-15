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
 * ============================================================================
 */

/** Flip to false once Blake has confirmed every DRAFT line in this file. */
export const OFFER_COPY_IS_DRAFT = true;

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
  // DRAFT: why the price is what it is, in plain words (research: say why, never call it "the market rate").
  why: "One focused job: your Google listing, your map, your site's pages and the facts AI assistants read. No software to learn and no long contract.",
} as const;

// ---------------------------------------------------------------------------
// What you get each month
// ---------------------------------------------------------------------------

// DRAFT: every quantity in this list (4 posts, 2 business days, up to 2 pages,
// the review routine in the first month) is a proposal for Blake to confirm or
// change. Keep only what he can deliver every month for every client.
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
    detail: "In words you've signed off on, and never confirming someone is a patient or a customer.", // DRAFT
  },
  {
    title: "A simple routine so every customer is asked for a review", // DRAFT
    detail: "Set up in your first month. No paying for reviews and no asking only happy customers.", // DRAFT (timing)
  },
  {
    title: "Up to 2 new service or town pages on your site a month", // DRAFT (quantity)
    detail: "Written for your customers. Never copy-paste pages with the town name swapped.", // DRAFT
  },
  {
    title: "Your business details checked across the main directories", // DRAFT
    detail: "The same name, address and phone everywhere you're listed.", // DRAFT
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
    detail: "You own your Google listing and your site, and every page we write for it stays yours.", // DRAFT
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
   * change (the check runs when the page is built). Any shape works: it is
   * shown as a cropped circle.
   */
  photoFile: "blake.jpg",
  // DRAFT: Blake's own suggested wording for the line by the call to action.
  chip: "I run every audit myself.",
  // DRAFT: the founder block's two or three sentences.
  bio: [
    "I run Devize, and I run every audit myself.", // DRAFT
    "I do this work because Google's map decides who gets looked at first, and an owner can't see that map from a customer's phone a few miles away. The audit shows it to you.", // DRAFT
    "I'll tell you plainly what I'd fix, what nobody can promise, and what was done each month.", // DRAFT
  ],
} as const;
