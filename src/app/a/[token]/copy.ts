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
 * Layout (Blake, 2026-11-03): one simple page. His question at the top,
 * naming the search and the business, the answer from their own searches
 * under it, then the form, which asks for a name and a mobile only (the video
 * slot is off for now, Blake's later word the same day). The map, the table
 * and the "what it covers" list are gone from the page (they are in the PDF
 * and in git history).
 *
 * Voice (Devize, 2026-10-12/14): plain, a favour not a scoreboard, map only
 * (no claims about their phones, forms, booking, speed or hours), no
 * greeting, short sentences, dentists get practice/patients, HVAC gets
 * shop/homeowner. Two exceptions, both Blake's: the headline is his question,
 * and the page says "we" (one voice; the email's sender may not be Blake).
 * Every number comes from page.json; none is written here.
 *
 * The plan is optional (2026-10-14 integration): page.json's `plan` is false
 * whenever the PDF will not carry it (the plan's own copy is still a draft,
 * or it could not be built). Every line that names the plan therefore takes
 * `plan` and has a no-plan wording, so the page never promises a file it
 * cannot hand over, and it says what the emails say.
 *
 * Round 2 (Blake, 2026-10-14): one PDF (the audit, then the plan), built when
 * the page is first opened, downloaded by ONE button after a name and a
 * mobile. If it is not built yet the page says so and waits up to two
 * minutes; after that it says the file comes by email and who will call.
 */

export const COPY_STATUS: "draft" | "approved" = "draft";

type Who = { persona_first: string };
type Find = {
  pins: number;
  keyword: string;
  place_noun: "practice" | "shop";
  top3: number;
};

/** "Conner or Blake", or just "Blake" when the persona is Blake. */
function callers({ persona_first }: Who): string {
  const p = (persona_first || "").trim();
  return !p || p === "Blake" ? "Blake" : `${p} or Blake`;
}

export const copy = {
  /** Browser tab. The layout's template appends " · Devize". */
  pageTitle: "Your audit",

  // ---- Top of the page -------------------------------------------------------
  // Blake's question (2026-11-03): "Your clients are searching for (Category) near me, but are they seeing
  // (Company Name)?" The category is the phrase we scanned (page.json keyword). The search phrase and the business name
  // are "italicized and the only purple text" (Blake, same day). Four parts, around those two: before the phrase,
  // between the two, after the name.
  headline: (keyword: string) =>
    ["Your clients are searching for", `${keyword} near me`, ", but are they seeing", "?"] as const,
  // The answer, from this business's own searches. Two parts: the page sets the result in bold.
  searched: (f: Find) => `We searched Google for "${f.keyword}" from ${f.pins} spots around your ${f.place_noun}.`,
  result: (f: Find) =>
    f.top3 === 0
      ? `You did not come up in the top three at any of them.`
      : f.top3 >= f.pins
        ? `You came up in the top three at all ${f.pins}.`
        : `You came up in the top three at ${f.top3} of them.`,
  jumpToForm: (plan: boolean) => (plan ? "Skip to your audit and plan" : "Skip to your audit"),

  // ---- The video ---------------------------------------------------------------
  vslPlay: "Play the video",
  // Local and preview builds only, while src/lib/vsl.ts has no video.
  vslMissing: "The video goes here.",
  vslMissingHow: "Set src in src/lib/vsl.ts. Production leaves this space out until then.",

  // ---- The form ----------------------------------------------------------------
  // Blake's words (2026-11-03, round 2).
  formHeading: "Get the full SEO and AEO strategy roadmap so you can start improving your organic growth today.",
  // Says what is in it and what happens: one PDF, a download, nothing "opens on this page".
  formIntro: (plan: boolean) =>
    plan
      ? "Where you come up on Google, who comes up instead, and the steps to fix it, in order. It downloads as one PDF."
      : "Where you come up on Google and who comes up instead. It downloads as a PDF.",
  nameLabel: "Your name",
  mobileLabel: "Mobile number",
  // Blake's wording (2026-10-14), one button.
  submit: (plan: boolean) => (plan ? "Get the plan now" : "Get the audit now"),
  submitting: "Sending",
  consent: (w: Who) =>
    `By sending this, you agree that ${
      callers(w) === "Blake" ? "Blake McGuire from Devize" : `${w.persona_first} or Blake McGuire from Devize`
    } may call or text you about your audit. Message and data rates may apply; reply STOP to opt out of texts.`,
  legalLinks: { smsTerms: "SMS Terms", privacy: "Privacy", terms: "Terms" },

  // ---- After they send it: the PDF is still being built ------------------------
  // Blake's wording (2026-10-14).
  finishing: (plan: boolean) => (plan ? "Finishing your plan, a few seconds…" : "Finishing your audit, a few seconds…"),
  finishingNote: "It downloads by itself when it is ready.",
  // The same wait on a later visit (the form was sent before): nothing downloads by itself, a link shows instead.
  finishingNoteLink: "The download link shows here when it is ready.",
  // Without JavaScript the page reloads itself every few seconds instead.
  finishingNoScript: "This page checks again by itself every few seconds.",
  checkAgain: "Check again",
  // After two minutes without the file. DRAFT for Blake: "by email" holds only
  // while landing.email_copy is on and the pipeline's copy is approved; the
  // pipeline builds the file on the submission either way.
  lateHeading: "This is taking longer than it should.",
  lateBody: (plan: boolean, w: Who) =>
    `Your ${plan ? "audit and plan" : "audit"} will come by email instead, and ${callers(w)} will call you.`,

  // ---- After they send it: the download -----------------------------------------
  // `started`: this visit started the download; false on a later visit (a reload), which starts nothing by itself.
  doneHeading: (plan: boolean, started: boolean) =>
    started
      ? plan
        ? "Your audit and plan are downloading."
        : "Your audit is downloading."
      : plan
        ? "Your audit and plan are ready."
        : "Your audit is ready.",
  download: (plan: boolean) => (plan ? "Download the audit and plan" : "Download the audit"),
  // A round-1 page's separate plan.
  downloadPlan: "Download the plan",
  // No "shortly": nobody calls at night or on a Sunday.
  doneCall: (w: Who) => `${callers(w)} will call you.`,
  // DRAFT for Blake: the emailed copy is not certain. landing_poll holds it
  // (and never retries) when sending or the persona's mailbox is paused, the
  // address is suppressed or landing.email_copy is off.
  doneEmail: "A copy is on its way by email.",

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
