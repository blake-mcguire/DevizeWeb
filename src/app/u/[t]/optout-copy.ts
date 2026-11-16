/**
 * Every visible sentence on the opt-out page (/u/<t>), in one place, for
 * Blake's review.
 *
 * Decided, word for word (voice build contract 8.5, 2026-11-16): the caption
 * is Blake's own ("Wait lets make them go to a similar tracking page that
 * would unsubscribe them once the select a second button. with the caption,
 * \"Not interested in how AI can help your business? Unsubscribe here:
 * Button\""), the button says Unsubscribe, and the line after the press is
 * the contract's. Never reword these three.
 *
 * OPTOUT_COPY_STATUS is "draft" for the rest: the tab title, the line when a
 * press does not go through, and the no-JavaScript line, written on
 * 2026-11-16 with nobody to ask. They point at the reply route because a
 * "stop" reply is suppressed by the same path the button's opt-out takes
 * (contract 8.5). The company that runs the voice line is never named here.
 */

export const OPTOUT_COPY_STATUS: "draft" | "approved" = "draft";

export const optoutCopy = {
  /** Browser tab. The page appends " · Devize". Draft. */
  pageTitle: "Unsubscribe",
  /** Blake's caption, above the one button. Decided. */
  caption: "Not interested in how AI can help your business? Unsubscribe here:",
  /** The one button. Decided. */
  button: "Unsubscribe",
  /** Shown in place of the caption and the button once the press is recorded. Decided (contract 8.5). */
  done: "You're unsubscribed. You won't get any more emails from us.",
  /** A press that did not go through (no answer, the store refused, a rate limit). Draft. */
  failed: "That did not go through. Please try again, or reply to the email with the word stop.",
  /** Without JavaScript the button cannot send. Draft. */
  noScript: "This button needs JavaScript turned on in your browser. You can also reply to the email with the word stop.",
} as const;
