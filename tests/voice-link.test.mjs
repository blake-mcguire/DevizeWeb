/**
 * The readable link (/for/<slug>) and the opt-out page (/u/<token>), the pure
 * parts: the slug rule, the links file, which page each address shows, and
 * the opt-out paths (voice build contract 8.4 and 8.5). Run with: npm test
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { VIEW_ENDPOINT, VIEW_KEY, viewBeaconBody } from "../src/app/a/[token]/view-beacon-target.ts";
import { optoutCopy } from "../src/app/u/[token]/optout-copy.ts";
import { UNSUBSCRIBE_ENDPOINT, unsubscribeInit } from "../src/app/u/[token]/optout-press.ts";
import { ROUTE_SHOWS, chooseView } from "../src/lib/prospect-view.ts";
import {
  LINK_TOKEN_RE,
  OPTOUT_PAGE_SHOWS,
  OPTOUT_VIEW_ENDPOINT,
  OPTOUT_VIEW_KEY,
  SLUG_MAX,
  SLUG_RE,
  linkPath,
  linkToken,
  optoutAllowed,
  optoutPath,
  optoutPrefix,
  optoutViewPath,
  validSlug,
} from "../src/lib/voice-link.ts";
import { parseVoicePage } from "../src/lib/voice-page.ts";
import { alnumTok, auditPage, linkFile, tok, voicePage } from "./fixtures.mjs";

const TOKEN = alnumTok("linkTok");
const RAND = "0123456789abcdef0123456789abcdef";

test("slug: the contract's rule, letter for letter", () => {
  assert.equal(String(SLUG_RE), String(/^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/));
  assert.equal(SLUG_MAX, 60);
  for (const good of [
    "maple-creek-family-dental",
    "a",
    "7",
    "ab",
    "a-b",
    "joes-hvac-and-plumbing",
    "maple-creek-family-dental-katy",
    "maple-creek-family-dental-2",
    "x".repeat(60),
    `a${"-b".repeat(29)}b`,
  ]) {
    assert.equal(validSlug(good), true, good);
  }
  for (const bad of [
    "",
    "-maple",
    "maple-",
    "-",
    "Maple-Creek",
    "maple_creek",
    "maple creek",
    "maple.creek",
    "maple/creek",
    "../etc/passwd",
    "café-dental",
    "maple%20creek",
    "x".repeat(61),
    undefined,
    null,
    7,
    ["maple"],
  ]) {
    assert.equal(validSlug(bad), false, String(bad));
  }
});

test("slug: the link file sits beside the pages, and a bad slug never becomes a path", () => {
  assert.equal(linkPath("maple-creek-family-dental"), "links/maple-creek-family-dental.json");
  for (const bad of ["../x", "Maple", "", "a/b"]) assert.throws(() => linkPath(bad), /not a slug/, bad);
});

test("links file: {v: 1, slug of its own path, token of 22 letters and digits}, or nothing", () => {
  const slug = "maple-creek-family-dental";
  assert.equal(String(LINK_TOKEN_RE), String(/^[A-Za-z0-9]{22}$/));
  assert.equal(linkToken(linkFile(slug, TOKEN), slug), TOKEN);
  // A field the pipeline may add later cannot point the slug anywhere else, so it is ignored.
  assert.equal(linkToken({ ...linkFile(slug, TOKEN), written_at: "2026-11-16T10:00:00Z" }, slug), TOKEN);
  const refused = [
    ["no file", null],
    ["a list", [linkFile(slug, TOKEN)]],
    ["a string", JSON.stringify(linkFile(slug, TOKEN))],
    ["v 2", { ...linkFile(slug, TOKEN), v: 2 }],
    ['v "1"', { ...linkFile(slug, TOKEN), v: "1" }],
    ["no v", { slug, token: TOKEN }],
    ["another slug", linkFile("cedar-park-plumbing-co", TOKEN)],
    ["the slug in capitals", linkFile(slug.toUpperCase(), TOKEN)],
    ["no slug", { v: 1, token: TOKEN }],
    ["no token", { v: 1, slug }],
    ["a token with an underscore", linkFile(slug, tok("linkTok"))],
    ["a token of 21", linkFile(slug, TOKEN.slice(0, 21))],
    ["a token of 23", linkFile(slug, `${TOKEN}A`)],
    ["a token that is a path", linkFile(slug, "../../audits/x/page.js")],
    ["a token that is a number", linkFile(slug, 1234567890123456789012)],
  ];
  for (const [label, raw] of refused) assert.equal(linkToken(raw, slug), null, label);
  // A slug that is not of the rule's shape is refused even when the file agrees with it.
  assert.equal(linkToken(linkFile("Maple", TOKEN), "Maple"), null);
});

test("render choice: /a/ shows both kinds, /for/ the voice page only, and a missing page is the 404 on both", () => {
  assert.deepEqual(ROUTE_SHOWS, { a: ["audit", "voice"], for: ["voice"] });
  const voice = { kind: "voice", page: parseVoicePage(voicePage(TOKEN), TOKEN, new Date()) };
  assert.ok(voice.page);
  const audit = { kind: "audit", page: { token: tok("audit"), business: "Bayou Bend Heating and Air" } };
  assert.deepEqual(chooseView(voice, "a"), { kind: "voice", page: voice.page });
  assert.deepEqual(chooseView(voice, "for"), { kind: "voice", page: voice.page });
  // The two addresses hand the one view the very same page object: nothing to drift.
  assert.equal(chooseView(voice, "a").page, chooseView(voice, "for").page);
  assert.deepEqual(chooseView(audit, "a"), { kind: "audit", page: audit.page });
  assert.deepEqual(chooseView(audit, "for"), { kind: "missing" });
  assert.deepEqual(chooseView(null, "a"), { kind: "missing" });
  assert.deepEqual(chooseView(null, "for"), { kind: "missing" });
});

test("opt-out: a voice page of this token, expired or not; never an audit page or another token's page", () => {
  assert.equal(optoutAllowed(voicePage(TOKEN), TOKEN), true);
  const expired = voicePage(TOKEN, { top: { expires_at: "2026-01-01" } });
  assert.equal(parseVoicePage(expired, TOKEN, new Date()), null, "the demo itself is gone");
  assert.equal(optoutAllowed(expired, TOKEN), true, "but its opt-out still works");
  // A page the demo reader refuses for a fault of its own was still emailed: its opt-out works too.
  const broken = voicePage(TOKEN);
  delete broken.demo.tz;
  assert.equal(optoutAllowed(broken, TOKEN), true);
  assert.equal(optoutAllowed(auditPage(TOKEN), TOKEN), false, "an audit page has no kind");
  assert.equal(optoutAllowed({ ...voicePage(TOKEN), kind: "audit" }, TOKEN), false);
  assert.equal(optoutAllowed(voicePage(alnumTok("someoneElse")), TOKEN), false);
  assert.equal(optoutAllowed({ ...voicePage(TOKEN), token: undefined }, TOKEN), false);
  for (const raw of [null, undefined, "voice", [voicePage(TOKEN)], 7]) assert.equal(optoutAllowed(raw, TOKEN), false, String(raw));
});

test("opt-out: the two paths, a random part of 32 hex, and one token never matching a longer one", () => {
  const at = new Date("2026-11-16T15:30:12.345Z");
  assert.equal(optoutPath(TOKEN, at, RAND), `optouts/${TOKEN}/20261116T153012Z-${RAND}.json`);
  assert.equal(optoutViewPath(TOKEN, at, RAND), `optout-views/${TOKEN}/20261116T153012Z-${RAND}.json`);
  assert.equal(optoutPrefix(TOKEN), `optouts/${TOKEN}/`);
  assert.ok(optoutPath(TOKEN, at, RAND).startsWith(optoutPrefix(TOKEN)));
  assert.equal(optoutPath(`${TOKEN}X`, at, RAND).startsWith(optoutPrefix(TOKEN)), false);
  for (const bad of ["", "abc", RAND.toUpperCase(), `${RAND}0`, RAND.slice(1)]) {
    assert.throws(() => optoutPath(TOKEN, at, bad), /32 random hex/, bad);
    assert.throws(() => optoutViewPath(TOKEN, at, bad), /32 random hex/, bad);
  }
  assert.equal(OPTOUT_VIEW_ENDPOINT, "/api/optout-view");
});

test("opt-out page: the caption and button for a voice page and for a store that cannot be read; the 404 only for no", () => {
  // "error" shows the button: the press asks the store again and says try again, so a real recipient is never told
  // the page is gone while the store is down (the review, 2026-11-16).
  assert.deepEqual(OPTOUT_PAGE_SHOWS, { yes: true, error: true, no: false });
});

/** The en dash and the em dash, built from their code points so this file holds neither. */
const DASHES = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);

test("opt-out copy: the caption, the button and the done line are contract 8.5's, word for word", () => {
  assert.equal(optoutCopy.caption, "Not interested in how AI can help your business? Unsubscribe here:");
  assert.equal(optoutCopy.button, "Unsubscribe");
  assert.equal(optoutCopy.done, "You're unsubscribed. You won't get any more emails from us.");
  for (const line of Object.values(optoutCopy)) {
    assert.equal(DASHES.test(line), false, `no em or en dash: ${line}`);
    assert.equal(/autocalls/i.test(line), false, `no vendor name: ${line}`);
  }
});

test("the press: a JSON post of {token} and nothing else, to the route that records it", () => {
  const token = TOKEN;
  assert.equal(UNSUBSCRIBE_ENDPOINT, "/api/unsubscribe");
  const init = unsubscribeInit(token);
  assert.equal(init.method, "POST");
  assert.deepEqual(init.headers, { "Content-Type": "application/json" });
  assert.deepEqual(JSON.parse(init.body), { token });
  assert.equal(init.cache, "no-store");
});

test("view beacon: /a/ and /for/ report to /api/audit-view by default; /u/ to its own route under its own key", () => {
  assert.equal(VIEW_ENDPOINT, "/api/audit-view");
  assert.equal(VIEW_KEY, "devize_view_");
  assert.equal(OPTOUT_VIEW_ENDPOINT, "/api/optout-view");
  assert.equal(OPTOUT_VIEW_KEY, "devize_optout_view_");
  // The two once-per-session keys never hold each other back, whatever the token.
  assert.equal(`${OPTOUT_VIEW_KEY}${TOKEN}`.startsWith(`${VIEW_KEY}${TOKEN}`), false);
  assert.equal(`${VIEW_KEY}${TOKEN}`.startsWith(`${OPTOUT_VIEW_KEY}${TOKEN}`), false);
  assert.deepEqual(JSON.parse(viewBeaconBody(TOKEN)), { token: TOKEN });
});
