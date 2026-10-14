/**
 * What a downloaded audit is called, and the header that names it. Pure
 * functions (no server or browser APIs), so tests can import them directly.
 */

const SUFFIX = {
  "audit-and-plan": "Google Map Audit and Plan",
  audit: "Google Map Audit",
  plan: "Google Map Plan",
} as const;

/**
 * "<Business> - Google Map Audit and Plan.pdf", the same name the pipeline
 * gives the file (landing.pdf_filename, which page.json carries as
 * pdf_filename and the emailed copy uses): every run of / \ : * ? " < > |
 * and control characters becomes one space, spaces and dots go from both
 * ends, whitespace collapses, at most 120 characters of name.
 */
export function downloadName(business: string, kind: keyof typeof SUFFIX): string {
  const name =
    business
      .normalize("NFC")
      .replace(/[\\/:*?"<>|\p{Cc}]+/gu, " ")
      .replace(/^[ .]+|[ .]+$/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 120) || "Your business";
  return `${name} - ${SUFFIX[kind]}.pdf`;
}

/**
 * page.json's pdf_filename, if it is a usable file name (the same characters
 * refused as above, ends in .pdf), else null and the caller names it.
 */
export function cleanFilename(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const name = input
    .normalize("NFC")
    .replace(/[\\/:*?"<>|\p{Cc}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+/, "");
  return name.length >= 5 && name.length <= 200 && /\.pdf$/i.test(name) ? name : null;
}

/**
 * Content-Disposition for a download: attachment, the UTF-8 name as
 * filename* (RFC 6266/8187), and a plain-ASCII filename for old clients.
 */
export function attachmentHeader(filename: string): string {
  const ascii =
    filename
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .replace(/[^\x20-\x7e]/g, "")
      .replace(/["\\%]/g, "")
      .replace(/\s+/g, " ")
      .trim() || "audit.pdf";
  const encoded = encodeURIComponent(filename).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
