// Seeds a store directory with test pages (every business invented). Usage: node seed.mjs <dir>
// Prints NAME=token lines for the run script.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { alnumTok, auditPage, linkFile, tok, voicePage } from "../fixtures.mjs";

const dir = process.argv[2];

async function put(pathname, doc) {
  const file = path.join(dir, pathname);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(doc, null, 1));
}
const pages = {
  A: voicePage(tok("e2eVoiceA")),
  B: voicePage(tok("e2eVoiceB"), { business: "Cedar Park Plumbing Co", top: { trade: "plumbing", city: "Austin" } }),
  C: voicePage(tok("e2eVoiceC")),
  D: voicePage(tok("e2eVoiceD")),
  E: voicePage(tok("e2eVoiceE")),
  SAMPLE: voicePage(tok("e2eSample"), { business: "Sample Family Dental", top: { sample: true } }),
  EXPIRED: voicePage(tok("e2eExpired"), { top: { expires_at: "2026-01-01" } }),
  AUDIT: auditPage(tok("e2eAudit")),
  // The readable link (contract 8.4): pages with tokens exactly as the pipeline makes them (22 letters and digits).
  LINKED: voicePage(alnumTok("e2eLinked"), { business: "Willow Bend Dental Studio" }),
  LINKED_EXPIRED: voicePage(alnumTok("e2eLinkedExpired"), { top: { expires_at: "2026-01-01" } }),
  LINKED_AUDIT: auditPage(alnumTok("e2eLinkedAudit")),
};
const out = {};
for (const [name, doc] of Object.entries(pages)) {
  await put(`audits/${doc.token}/page.json`, doc);
  out[name] = doc.token;
}
// A token whose page.json cannot be parsed: the store "error" state, where /u/ still shows the button (review, 2026-11-16).
out.BROKEN = tok("e2eBroken");
await mkdir(path.join(dir, "audits", out.BROKEN), { recursive: true });
await writeFile(path.join(dir, "audits", out.BROKEN, "page.json"), "{not json");
// Page E has used all six of its calls on earlier days.
for (let i = 0; i < 6; i++) {
  await put(`demos/${out.E}/2026010${i + 1}T180000Z-${"e".repeat(31)}${i}.json`, { v: 1, token: out.E });
}
// links/<slug>.json as the pipeline writes them, one good and three that must each be the plain 404.
const links = {
  LINK_SLUG: ["willow-bend-dental-studio", linkFile("willow-bend-dental-studio", out.LINKED)],
  LINK_EXPIRED_SLUG: ["expired-dental", linkFile("expired-dental", out.LINKED_EXPIRED)],
  LINK_AUDIT_SLUG: ["audit-linked", linkFile("audit-linked", out.LINKED_AUDIT)],
  // A file whose slug is not its own path's: never followed.
  LINK_WRONG_SLUG: ["wrong-slug-file", linkFile("willow-bend-dental-studio", out.LINKED)],
};
for (const [name, [slug, doc]] of Object.entries(links)) {
  await put(`links/${slug}.json`, doc);
  out[name] = slug;
}
console.log(Object.entries(out).map(([k, v]) => `${k}=${v}`).join("\n"));
