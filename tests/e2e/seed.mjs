// Seeds a store directory with test pages (every business invented). Usage: node seed.mjs <dir>
// Prints NAME=token lines for the run script.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { alnumTok, auditPage, linkFile, optoutLinkFile, tok, voicePage } from "../fixtures.mjs";

const dir = process.argv[2];

// The opt-out tokens (contract 8.6): 22 letters and digits, each a secret of its own, never a page token.
const OPT = {
  OPT_A: alnumTok("e2eOptA"),
  OPT_EXPIRED: alnumTok("e2eOptExpired"),
  OPT_BROKEN: alnumTok("e2eOptBroken"),
  OPT_AUDIT: alnumTok("e2eOptAudit"),
  OPT_LINKED: alnumTok("e2eOptLinked"),
  OPT_NOPAGE: alnumTok("e2eOptNoPage"),
  OPT_WRONG: alnumTok("e2eOptWrong"),
  OPT_SELF: alnumTok("e2eOptSelf"),
  OPT_BADLINK: alnumTok("e2eOptBadLink"),
};

async function put(pathname, doc) {
  const file = path.join(dir, pathname);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(doc, null, 1));
}
const pages = {
  // A, EXPIRED and BROKEN have tokens exactly as the pipeline makes them (22 letters and digits) since 8.6, so an
  // opt-out link file can name them.
  A: voicePage(alnumTok("e2eVoiceA")),
  B: voicePage(tok("e2eVoiceB"), { business: "Cedar Park Plumbing Co", top: { trade: "plumbing", city: "Austin" } }),
  C: voicePage(tok("e2eVoiceC")),
  D: voicePage(tok("e2eVoiceD")),
  E: voicePage(tok("e2eVoiceE")),
  SAMPLE: voicePage(tok("e2eSample"), { business: "Sample Family Dental", top: { sample: true } }),
  EXPIRED: voicePage(alnumTok("e2eExpired"), { top: { expires_at: "2026-01-01" } }),
  AUDIT: auditPage(tok("e2eAudit")),
  // The readable link (contract 8.4): pages with tokens exactly as the pipeline makes them (22 letters and digits).
  // LINKED's page.json also carries its opt-out token under a stray key, as a pipeline mistake would: /a/ and /for/
  // must still never send it to a browser (the page reader keeps only the fields it knows).
  LINKED: voicePage(alnumTok("e2eLinked"), { business: "Willow Bend Dental Studio", top: { optout_token: OPT.OPT_LINKED } }),
  LINKED_EXPIRED: voicePage(alnumTok("e2eLinkedExpired"), { top: { expires_at: "2026-01-01" } }),
  LINKED_AUDIT: auditPage(alnumTok("e2eLinkedAudit")),
  // A voice page whose token is also the t of a link file that names itself (a writer's mistake): never an opt-out.
  SELF: voicePage(OPT.OPT_SELF),
};
const out = {};
for (const [name, doc] of Object.entries(pages)) {
  await put(`audits/${doc.token}/page.json`, doc);
  out[name] = doc.token;
}
// A token whose page.json cannot be parsed: the store "error" state, where /u/ still shows the button (review, 2026-11-16).
out.BROKEN = alnumTok("e2eBroken");
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
// optout-links/<t>.json as the pipeline writes them (contract 8.6): one per page that has a footer link, then the ones
// that must each be the plain 404 (or, for a file that cannot be read, the button and a press that says try again).
const optoutLinks = {
  OPT_A: out.A,
  OPT_EXPIRED: out.EXPIRED,
  OPT_BROKEN: out.BROKEN,
  OPT_AUDIT: out.LINKED_AUDIT,
  OPT_LINKED: out.LINKED,
  OPT_NOPAGE: alnumTok("e2eNoPageAtAll"),
  OPT_SELF: OPT.OPT_SELF,
};
for (const [name, token] of Object.entries(optoutLinks)) await put(`optout-links/${OPT[name]}.json`, optoutLinkFile(OPT[name], token));
// A file whose optout_token is another t (never followed), and one that is not JSON.
await put(`optout-links/${OPT.OPT_WRONG}.json`, optoutLinkFile(OPT.OPT_A, out.A));
await writeFile(path.join(dir, "optout-links", `${OPT.OPT_BADLINK}.json`), "{not json");
Object.assign(out, OPT);
console.log(Object.entries(out).map(([k, v]) => `${k}=${v}`).join("\n"));
