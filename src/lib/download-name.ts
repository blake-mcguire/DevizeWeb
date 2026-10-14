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
 * "<Business> - Google Map Audit and Plan.pdf": the business as page.json
 * names it, made safe for every file system. A colon becomes " - " ("Pure
 * Smiles: Dr. Yap" gives "Pure Smiles - Dr. Yap - Google Map Audit and
 * Plan.pdf"), a slash "-" ("A/C" gives "A-C"); the characters Windows
 * refuses and control characters go; no leading dot; at most 100 characters
 * of name.
 */
export function downloadName(business: string, kind: keyof typeof SUFFIX): string {
  const safe = business
    .normalize("NFC")
    .replace(/\p{Cc}/gu, "")
    .replace(/\s*:\s*/g, " - ")
    .replace(/[/\\]/g, "-")
    .replace(/[*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[.\s-]+/, "")
    .slice(0, 100)
    .trim();
  return `${safe || "Your business"} - ${SUFFIX[kind]}.pdf`;
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
