/**
 * The homepage audit request form's messages, shared by the form's script
 * (audit-form.tsx), its no-JavaScript path (/api/lead's 303 to /thanks) and the
 * /thanks page, so all three say the same thing.
 *
 * TODO(Blake): before launch, make a form request reach a person: an alert to a
 * named person on every stored request, run end to end once. Today the request
 * is stored and nothing alerts anyone, so this line would not yet be true. Until
 * leadFormReachesPerson is true in src/lib/launch-gate.json, production stays
 * blocked and the pages show an email link instead of the form
 * (src/components/audit-request.tsx).
 */

export const LEAD_THANKS =
  "Thanks. We'll check your listing, your reviews and your website and email you what we find. If we've already scanned your kind of business in your area, we'll compare you with your competitors too.";

export const LEAD_ERRORS = {
  fields: "Please fill in your business name, town and email.",
  email: "Please provide a valid email.",
  rate: "Too many requests. Please try again in a few minutes, or email admin@devize.ai.",
} as const;

export type LeadErrorCode = keyof typeof LEAD_ERRORS;

export function isLeadErrorCode(v: unknown): v is LeadErrorCode {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(LEAD_ERRORS, v);
}
