/**
 * /for/<slug>, the readable demo link, wears exactly the chrome of /a/ (the
 * logo, the content, the postal address) and the same metadata: never
 * indexed, no referrer. It is the /a/ layout itself, so the two cannot drift.
 * Also kept out of search by the X-Robots-Tag header in next.config.ts and
 * the /for/ disallow in robots.ts.
 */
export { default, metadata } from "../a/layout";
