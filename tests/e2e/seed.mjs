// Seeds a store directory with test pages (every business invented). Usage: node seed.mjs <dir>
// Prints NAME=token lines for the run script.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { auditPage, tok, voicePage } from "../fixtures.mjs";

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
};
const out = {};
for (const [name, doc] of Object.entries(pages)) {
  await put(`audits/${doc.token}/page.json`, doc);
  out[name] = doc.token;
}
// Page E has used all six of its calls on earlier days.
for (let i = 0; i < 6; i++) {
  await put(`demos/${out.E}/2026010${i + 1}T180000Z-${"e".repeat(31)}${i}.json`, { v: 1, token: out.E });
}
console.log(Object.entries(out).map(([k, v]) => `${k}=${v}`).join("\n"));
