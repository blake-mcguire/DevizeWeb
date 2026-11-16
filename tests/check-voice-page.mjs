/**
 * Checks one voice page.json with the same reader the site uses, and says
 * what is wrong with it if the site would refuse it (a refused page is a
 * plain 404 to the prospect). For the pipeline side: run it on what
 * voice_pages.py wrote, before any email carries the link.
 *
 *   npm run check:voice-page -- path/to/page.json
 *   npm run check:voice-page -- path/to/page.json --at 2026-11-16T15:00:00Z
 *
 * Reads the file only. Prints OK and what a press would send for the clock
 * at --at (now when left out), or REFUSED and the first fault. Exit 0 or 1.
 */
import { readFileSync } from "node:fs";
import { validToken } from "../src/lib/audit-validate.ts";
import { checkVoicePage, clockKeys, localClock, sessionVariables } from "../src/lib/voice-page.ts";

const args = process.argv.slice(2);
const atFlag = args.indexOf("--at");
const now = atFlag >= 0 ? new Date(args[atFlag + 1]) : new Date();
const file = args.find((a, i) => !a.startsWith("--") && (atFlag < 0 || i !== atFlag + 1));

function refuse(why) {
  console.log(`REFUSED: ${why}`);
  process.exit(1);
}

if (!file) refuse("give the path of a page.json");
if (Number.isNaN(now.getTime())) refuse("--at is not a date");

let raw;
try {
  raw = JSON.parse(readFileSync(file, "utf8"));
} catch (err) {
  refuse(`the file is not readable JSON (${err.message})`);
}
const token = raw && typeof raw === "object" ? raw.token : undefined;
if (!validToken(token)) refuse("token is missing or is not a token the site accepts (8 to 64 letters, digits, _ or -)");

const checked = checkVoicePage(raw, token, now);
if (!checked.ok) refuse(checked.fault);

const page = checked.page;
const clock = localClock(page.demo.tz, now);
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const variables = sessionVariables(page, now);
console.log("OK");
console.log(`  business   ${page.business}${page.sample ? " (sample)" : ""}`);
console.log(`  trade      ${page.trade}`);
console.log(`  expires    ${page.expires_at}`);
console.log(`  variables  ${Object.keys(variables).length} of 50 at a press`);
console.log(`  clock      ${now.toISOString()} is ${days[clock.weekday]} ${String(Math.floor(clock.minute / 60)).padStart(2, "0")}:${String(clock.minute % 60).padStart(2, "0")} in ${page.demo.tz}`);
for (const [key, value] of Object.entries(clockKeys(page.demo, now))) console.log(`  ${key.padEnd(14)} ${value}`);
