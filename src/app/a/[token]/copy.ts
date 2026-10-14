/**
 * Every visible sentence on /a/<token> and its API responses, in one place,
 * for Blake's review.
 *
 * COPY_STATUS is "draft" until Blake approves the words. The page renders
 * either way: the site has no switch of its own, because nothing links here
 * until the pipeline's switch is on AND the pipeline's own copy is approved.
 * Flip this to "approved" when these words are signed off, so the review list
 * shows it.
 *
 * Voice (Devize, 2026-10-12/14): plain, a favour not a scoreboard, map only
 * (no claims about their phones, forms, booking, speed or hours), no
 * greeting, short sentences, no question marks, a person doing the work
 * ("I ran"), dentists get practice/patients, HVAC gets shop/homeowner.
 * Every number comes from page.json; none is written here.
 */

export const COPY_STATUS: "draft" | "approved" = "draft";

type Who = { persona_first: string };
type Find = {
  pins: number;
  keyword: string;
  place_noun: "practice" | "shop";
  top3: number;
  mid: number;
  absent: number;
  business: string;
};

const PLURAL = { practice: "practices", shop: "shops" } as const;

/** "Conner or Blake", or just "Blake" when the persona is Blake. */
function callers({ persona_first }: Who): string {
  const p = (persona_first || "").trim();
  return !p || p === "Blake" ? "Blake" : `${p} or Blake`;
}

export const copy = {
  /** Browser tab. The layout's template appends " · Devize". */
  pageTitle: "Your map",

  // ---- Top of the page -------------------------------------------------------
  headline: (f: Find) =>
    `I ran ${f.pins} Google searches for ${f.keyword} around your ${f.place_noun}. ` +
    (f.top3 > 0
      ? `You came up in the top three at ${f.top3} of them.`
      : `You never came up in the top three.`),
  byline: (p: { persona_name: string; scanned_on: string }) =>
    p.scanned_on ? `${p.persona_name}, Devize. Searched on ${p.scanned_on}.` : `${p.persona_name}, Devize.`,
  jumpToForm: "Get the full audit and the plan",

  // ---- The map ---------------------------------------------------------------
  mapAlt: (f: Find) =>
    `A map of ${f.pins} Google searches for ${f.keyword} around ${f.business}. ` +
    `You came up in the top three at ${f.top3} of them.`,
  bands: {
    top3: "In the top three",
    mid: "Fourth to twentieth",
    absent: "Nowhere in the first twenty",
  },
  legend: (f: Find) =>
    `Every pin is one search. Green means you were in the top three. ` +
    `Yellow means you came up, but under them. Grey means you were nowhere in the first twenty Google showed. ` +
    `The purple pin is your ${f.place_noun}.`,
  mapMissing: "The map did not load. The counts above are the same searches.",

  // ---- The table -------------------------------------------------------------
  tableHeading: "Who came up instead of you",
  tableColumns: (place_noun: "practice" | "shop") => ({
    name: place_noun === "practice" ? "Practice" : "Shop",
    stars: "Stars",
    reviews: "Reviews",
    top3: "In the top three",
  }),
  youPrefix: "You: ",
  top3Cell: (n: number | null, pins: number) => (n === null ? "not seen" : `${n} of ${pins}`),

  // ---- What they get -----------------------------------------------------------
  coverHeading: "What the full audit and the plan cover",
  coverBullets: (place_noun: "practice" | "shop") => [
    `Your Google listing, point by point, next to the ${PLURAL[place_noun]} above you.`,
    `How far your listing reaches from your own address, and where it stops.`,
    `A one-page plan: the changes I would make first, in order.`,
  ],

  // ---- The form ----------------------------------------------------------------
  formHeading: "Get the full audit and the plan",
  formIntro: "Leave your name and mobile. Both open on this page straight away.",
  nameLabel: "Name",
  mobileLabel: "Mobile",
  submit: "Open my audit and plan",
  submitting: "Opening",
  consent: (w: Who) =>
    `By sending this, you agree that ${
      callers(w) === "Blake" ? "Blake McGuire from Devize" : `${w.persona_first} or Blake McGuire from Devize`
    } may call or text you about your audit. Message and data rates may apply; reply STOP to opt out of texts.`,
  legalLinks: { smsTerms: "SMS Terms", privacy: "Privacy", terms: "Terms" },

  // ---- After they send it ----------------------------------------------------
  doneHeading: "Here they are.",
  viewAudit: "View your audit",
  viewPlan: "View your plan",
  doneCall: (w: Who) => `${callers(w)} will call you shortly.`,
  doneEmail: (w: Who) =>
    `${(w.persona_first || "Blake").trim()} is emailing you a copy as well.`,

  // ---- Errors (shown under the form) ---------------------------------------------
  errors: {
    name: "Please add your name.",
    mobile: "Please check the mobile number. It needs to be a US number.",
    gone: "This page has expired. Reply to the email and we will send it over.",
    rate: "That is a few tries in a row. Please wait a few minutes, or reply to the email.",
    server: "Something went wrong on our side. Please try again, or reply to the email.",
  },

  // ---- Footer and the 404 --------------------------------------------------------
  footerAddress: "Devize, 307 Irenic Mist Court, Willis, TX 77318",
  notFoundHeading: "This page is not available.",
  notFoundBody: "If you came here from an email, reply to it and we will send the audit over.",
} as const;

export type ErrorCode = keyof typeof copy.errors;
