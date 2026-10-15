/**
 * The homepage audit request form's messages, shared by the form's script
 * (contact.tsx), its no-JavaScript path (/api/lead's 303 to /thanks) and the
 * /thanks page, so all three say the same thing.
 */

export const LEAD_THANKS = "Thanks. We'll run your searches and email your audit to you.";

export const LEAD_ERRORS = {
  fields: "Please fill in your business name, town and email.",
  email: "Please provide a valid email.",
  rate: "Too many requests. Please try again in a few minutes, or email admin@devize.ai.",
} as const;

export type LeadErrorCode = keyof typeof LEAD_ERRORS;

export function isLeadErrorCode(v: unknown): v is LeadErrorCode {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(LEAD_ERRORS, v);
}
