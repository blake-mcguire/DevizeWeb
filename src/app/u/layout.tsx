/**
 * /u/<t>, the opt-out page the voice email's footer links to, wears exactly
 * the chrome of /a/ (the logo, the content, the postal address) and the same
 * metadata: never indexed, no referrer (the opt-out token in the address is
 * the only key to the page). It is the /a/ layout itself, so the two cannot
 * drift. Also kept out of search by the X-Robots-Tag header in
 * next.config.ts and the /u/ disallow in robots.ts.
 */
export { default, metadata } from "../a/layout";
