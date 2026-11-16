/**
 * Every visible sentence on a voice demo page (/a/<token> when page.json is
 * of kind "voice") and in /api/demo-session's answers, in one place, for
 * Blake's review.
 *
 * VOICE_COPY_STATUS is "draft": these words were written on 2026-11-15 during
 * the overnight build, with nobody to ask, and kept as few and as plain as
 * the page allows. Site copy belongs to Blake and the website session, so
 * flip this to "approved" only when one of them has read every line. The page
 * renders either way, like copy.ts: nothing links here until the pipeline
 * builds a voice page and an email carries its link.
 *
 * Rules kept: the page says "we"; no greeting; short sentences; no claim
 * about recording, privacy or what the receptionist can do; and the company
 * that runs the voice line is never named, here or anywhere the browser can
 * read.
 */

export const VOICE_COPY_STATUS: "draft" | "approved" = "draft";

/** What can go wrong between the button press and the call, each with one sentence. */
export const VOICE_ERRORS = {
  // The microphone, checked in the browser before any session is asked for.
  mic_denied: "The microphone is blocked for this page. Allow it in your browser settings, then press the button again.",
  mic_missing: "No microphone was found on this device. Try the link on your phone.",
  mic_failed: "The microphone could not be used. Close anything else that is using it, then try again.",
  unsupported: "This browser cannot run the demo. Open the link in Safari or Chrome.",
  // The server's answers (the HTTP status is in the comment).
  balance: "The demo line is not taking calls right now. Reply to the email and we will call you.", // 402
  busy: "The demo line is busy right now. Please try again in a few minutes.", // 429
  page_day: "That is all the demo calls for today. Please try again tomorrow.", // 429
  page_life: "This demo has had all of its calls. Reply to the email and we will set up another.", // 429
  rate: "That is a few tries in a row. Please wait a few minutes.", // 429
  unavailable: "The demo is not available right now. Please try again in a few minutes, or reply to the email.", // 503
  gone: "This page has expired. Reply to the email and we will send a new one.", // 404
  forbidden: "The demo could not start from this browser. Open the link in Safari or Chrome.", // 403
  bad_request: "The demo could not start. Please reload the page and try again.", // 400
  // The call itself did not connect, or dropped while connecting.
  failed: "The call did not connect. Please try again.",
} as const;

export type VoiceErrorCode = keyof typeof VOICE_ERRORS;

/** Errors that pressing the button again cannot fix: the button is not offered again. */
export const VOICE_FINAL_ERRORS: readonly VoiceErrorCode[] = ["page_life", "gone", "unsupported"];

/** The sentence for a server answer: its own code when the page knows it, else one by HTTP status. */
export function voiceErrorFor(status: number, code: unknown): VoiceErrorCode {
  if (typeof code === "string" && Object.hasOwn(VOICE_ERRORS, code)) return code as VoiceErrorCode;
  if (status === 402) return "balance";
  if (status === 429) return "busy";
  if (status === 404) return "gone";
  return "unavailable";
}

export const voiceCopy = {
  /** Browser tab. The page appends " · Devize", as the audit pages' tab has. */
  pageTitle: "Your receptionist demo",
  /** Small line above the business name. */
  eyebrow: "Receptionist demo",
  /** Shown beside the eyebrow when page.json says sample: true. */
  sampleBadge: "Sample",
  /** The one plain line under the business name. */
  line: "This is your receptionist, set up as a demo.",
  /** The button. */
  talk: "Talk to it",
  talkAgain: "Talk to it again",
  /** Under the button, before the first press. */
  micHint: "Your browser will ask to use your microphone.",
  /** Between the press and the first word from the call. */
  starting: "Starting",
  /** The call's live states, as the session reports them. */
  states: {
    connecting: "Connecting",
    listening: "Listening",
    thinking: "Thinking",
    speaking: "Speaking",
    ended: "The call has ended.",
  },
  endCall: "End call",
  /** Without JavaScript the button cannot work. */
  noScript: "This demo needs JavaScript turned on in your browser.",
  errors: VOICE_ERRORS,
} as const;
