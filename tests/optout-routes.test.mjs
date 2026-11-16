/**
 * The readable link's loader, the opt-out page's loader, POST /api/unsubscribe
 * and the opt-out page's beacon (POST /api/optout-view), run in-process
 * against a blob mock directory (voice build contract 8.4 and 8.5). No
 * request leaves this machine: the store is forced to the mock directory
 * below, and a tripwire on fetch fails the run if anything tries.
 * Run with: npm test
 */
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, beforeEach, test } from "node:test";
import { VIEW_ENDPOINT, viewBeaconBody } from "../src/app/a/[token]/view-beacon-target.ts";
import { pressUnsubscribe } from "../src/app/u/[token]/optout-press.ts";
import { chooseView } from "../src/lib/prospect-view.ts";
import { OPTOUT_VIEW_ENDPOINT } from "../src/lib/voice-link.ts";
import { alnumTok, auditPage, linkFile, tok, voicePage } from "./fixtures.mjs";

const BROWSER =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const DESK = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const MACHINES = [
  ["curl", "curl/8.7.1"],
  ["a python script", "python-requests/2.32"],
  ["a mail scanner", "Mozilla/5.0 (compatible; Proofpoint Essentials)"],
  ["a headless browser", "Mozilla/5.0 HeadlessChrome/131.0"],
  ["a link preview", "Slackbot-LinkExpanding 1.0"],
  ["a blank user agent", "   "],
  ["no user agent at all", null],
];

// ---- this run can only ever touch the mock store (the same guard as routes.test.mjs) ----------------------------
const BLOB_ENV = ["BLOB_READ_WRITE_TOKEN", "BLOB_STORE_ID", "VERCEL_BLOB_API_URL", "VERCEL"];
process.env.NODE_ENV = "test";
for (const name of BLOB_ENV) delete process.env[name];

const realFetch = globalThis.fetch;
const tripped = [];
globalThis.fetch = (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (url.hostname !== "127.0.0.1") {
    tripped.push(url.host);
    throw new Error(`tripwire: a test tried to reach ${url.host}`);
  }
  return realFetch(input, init);
};

let root;
let store;
let unsubscribe;
let optoutView;
let auditView;
let pages;

before(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), "voice-optout-"));
  process.env.BLOB_MOCK_DIR = path.join(root, "unset");
  const blobStore = await import("../src/lib/blob-store.ts");
  assert.equal(blobStore.isMock(), true, "the routes must run on the mock directory, never on a real store");
  assert.ok(await blobStore.mockFs(), "the mock directory module must be the one in use");
  ({ POST: unsubscribe } = await import("../src/app/api/unsubscribe/route.ts"));
  ({ POST: optoutView } = await import("../src/app/api/optout-view/route.ts"));
  ({ POST: auditView } = await import("../src/app/api/audit-view/route.ts"));
  pages = await import("../src/lib/audit-page.ts");
});

after(async () => {
  await rm(root, { recursive: true, force: true });
  assert.deepEqual(tripped, [], "no request may leave this machine");
});

let n = 0;
beforeEach(async () => {
  store = path.join(root, `store-${++n}`);
  await mkdir(store, { recursive: true });
  process.env.BLOB_MOCK_DIR = store;
});

async function put(pathname, doc) {
  const file = path.join(store, pathname);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, typeof doc === "string" ? doc : JSON.stringify(doc));
}
const putPage = (token, doc) => put(`audits/${token}/page.json`, doc);

async function under(prefix) {
  try {
    const names = await readdir(path.join(store, prefix), { recursive: true });
    return names.filter((name) => name.endsWith(".json")).sort();
  } catch {
    return [];
  }
}
const read = async (pathname) => JSON.parse(await readFile(path.join(store, pathname), "utf8"));

let caller = 0;
function request(route, url, token, { ua = BROWSER, headers = {}, body } = {}) {
  const all = { "content-type": "application/json", "x-forwarded-for": `10.9.${++caller >> 8}.${caller & 255}`, ...headers };
  if (ua !== null) all["user-agent"] = ua;
  return route(new Request(url, { method: "POST", headers: all, body: body ?? JSON.stringify({ token }) }));
}
const press = (token, options) => request(unsubscribe, "http://localhost/api/unsubscribe", token, options);
const beacon = (token, options) => request(optoutView, "http://localhost/api/optout-view", token, options);

async function answer(res) {
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, json, text, headers: res.headers };
}

// ---- the readable link -------------------------------------------------------------------------------------------

test("link: a good links file leads to exactly the page /a/ loads for its token", async () => {
  const token = alnumTok("linkGood");
  await putPage(token, voicePage(token));
  await put("links/maple-creek-family-dental.json", linkFile("maple-creek-family-dental", token));
  assert.equal(await pages.tokenForSlug("maple-creek-family-dental"), token);
  const byLink = await pages.loadPageForSlug("maple-creek-family-dental");
  const byToken = await pages.loadPage(token);
  assert.equal(byLink.kind, "voice");
  assert.deepEqual(byLink, byToken);
  assert.deepEqual(chooseView(byLink, "for"), chooseView(byToken, "a"));
  assert.equal(chooseView(byLink, "for").page.business, "Maple Creek Family Dental");
});

test("link: every way a link can be wrong is the same null, so the page is the same 404", async () => {
  const live = alnumTok("linkLive");
  await putPage(live, voicePage(live));
  const expired = alnumTok("linkExpired");
  await putPage(expired, voicePage(expired, { top: { expires_at: "2026-01-01" } }));
  const audit = alnumTok("linkAudit");
  await putPage(audit, auditPage(audit));
  await put("links/another-slug.json", linkFile("cedar-park-plumbing-co", live));
  await put("links/old-version.json", { v: 2, slug: "old-version", token: live });
  await put("links/underscore-token.json", linkFile("underscore-token", tok("linkLive")));
  await put("links/not-json.json", "{slug:");
  await put("links/no-page.json", linkFile("no-page", alnumTok("linkNobody")));
  await put("links/expired-page.json", linkFile("expired-page", expired));
  await put("links/audit-page.json", linkFile("audit-page", audit));
  for (const slug of ["no-such-slug", "another-slug", "old-version", "underscore-token", "not-json", "Bad_Slug", "../links/x", ""]) {
    assert.equal(await pages.tokenForSlug(slug), null, slug);
    assert.equal(await pages.loadPageForSlug(slug), null, slug);
    assert.deepEqual(chooseView(await pages.loadPageForSlug(slug), "for"), { kind: "missing" }, slug);
  }
  // A good link to a page that is missing or expired: the same null as /a/<token> gives for that token.
  for (const slug of ["no-page", "expired-page"]) {
    assert.ok(await pages.tokenForSlug(slug), slug);
    assert.equal(await pages.loadPageForSlug(slug), null, slug);
  }
  // A link to an audit page loads it, and the /for/ choice turns it away.
  assert.equal((await pages.loadPageForSlug("audit-page")).kind, "audit");
  assert.deepEqual(chooseView(await pages.loadPageForSlug("audit-page"), "for"), { kind: "missing" });
});

test("link: the demo page's view beacon reports an open under the page token, however the page was reached", async () => {
  const token = alnumTok("linkViewed");
  await putPage(token, voicePage(token));
  await put("links/maple-creek-family-dental.json", linkFile("maple-creek-family-dental", token));
  const loaded = await pages.loadPageForSlug("maple-creek-family-dental");
  // The beacon on /for/ posts the token the view was rendered with.
  const res = await request(auditView, "http://localhost/api/audit-view", chooseView(loaded, "for").page.token);
  assert.equal(res.status, 204);
  const views = await under("views");
  assert.equal(views.length, 1);
  assert.ok(views[0].endsWith(`-${token}.json`));
});

// ---- the opt-out page's loader -----------------------------------------------------------------------------------

test("opt-out page: a voice page, live or expired, says yes; anything else says no; an unreadable store says error", async () => {
  const live = alnumTok("optLive");
  await putPage(live, voicePage(live));
  const expired = alnumTok("optExpired");
  await putPage(expired, voicePage(expired, { top: { expires_at: "2026-01-01" } }));
  const audit = alnumTok("optAudit");
  await putPage(audit, auditPage(audit));
  const other = alnumTok("optOther");
  await putPage(other, voicePage(alnumTok("optSomeone")));
  const corrupt = alnumTok("optCorrupt");
  await putPage(corrupt, "{not json");
  assert.equal(await pages.optoutPageState(live), "yes");
  assert.equal(await pages.optoutPageState(expired), "yes");
  assert.equal(await pages.loadPage(expired), null, "the demo itself is gone");
  assert.equal(await pages.optoutPageState(audit), "no");
  assert.equal(await pages.optoutPageState(other), "no", "a page.json that names another token");
  assert.equal(await pages.optoutPageState(alnumTok("optNobody")), "no");
  for (const bad of ["abc", "../../etc/passwd", "", "a b c d e f g h"]) assert.equal(await pages.optoutPageState(bad), "no", bad);
  assert.equal(await pages.optoutPageState(corrupt), "error");
});

// ---- POST /api/unsubscribe ---------------------------------------------------------------------------------------

test("unsubscribe: a press writes one opt-out file and answers only {ok: true}", async () => {
  const token = alnumTok("unsubGood");
  await putPage(token, voicePage(token));
  const started = Date.now();
  const got = await answer(await press(token));
  assert.equal(got.status, 200);
  assert.deepEqual(got.json, { ok: true });
  assert.equal(got.headers.get("cache-control"), "no-store");
  assert.equal(got.text.includes(token), false, "the answer never echoes the token");
  const files = await under(`optouts/${token}`);
  assert.equal(files.length, 1);
  assert.match(files[0], /^\d{8}T\d{6}Z-[0-9a-f]{32}\.json$/);
  const doc = await read(`optouts/${token}/${files[0]}`);
  assert.deepEqual(Object.keys(doc).sort(), ["at", "token", "ua", "v"]);
  assert.equal(doc.v, 1);
  assert.equal(doc.token, token);
  assert.equal(doc.ua, "iphone");
  assert.ok(Math.abs(Date.parse(doc.at) - started) < 60_000);
  // Nothing else is written: no view, no demo marker, nothing under views/.
  assert.deepEqual(await under("optout-views"), []);
  assert.deepEqual(await under("views"), []);
});

test("unsubscribe: pressing again is harmless (the same ok, still one file), and an expired page still opts out", async () => {
  const token = alnumTok("unsubTwice");
  await putPage(token, voicePage(token));
  for (let i = 0; i < 3; i++) {
    const got = await answer(await press(token, { ua: i === 2 ? DESK : BROWSER }));
    assert.equal(got.status, 200, `press ${i + 1}`);
    assert.deepEqual(got.json, { ok: true }, `press ${i + 1}`);
  }
  assert.equal((await under(`optouts/${token}`)).length, 1);

  const expired = alnumTok("unsubExpired");
  await putPage(expired, voicePage(expired, { top: { expires_at: "2026-01-01" } }));
  const got = await answer(await press(expired, { ua: DESK }));
  assert.equal(got.status, 200);
  assert.deepEqual(got.json, { ok: true });
  const files = await under(`optouts/${expired}`);
  assert.equal(files.length, 1);
  assert.equal((await read(`optouts/${expired}/${files[0]}`)).ua, "windows");
});

test("unsubscribe: machines are refused 403 and nothing is written", async () => {
  const token = alnumTok("unsubMachine");
  await putPage(token, voicePage(token));
  for (const [label, ua] of MACHINES) {
    const got = await answer(await press(token, { ua }));
    assert.equal(got.status, 403, label);
    assert.deepEqual(got.json, { ok: false, error: "forbidden" }, label);
  }
  const crossSite = await answer(await press(token, { headers: { "sec-fetch-site": "cross-site" } }));
  assert.equal(crossSite.status, 403, "another site's page");
  assert.deepEqual(await under("optouts"), []);
});

test("unsubscribe: each refusal has its own status, and none echoes what was sent", async () => {
  const live = alnumTok("unsubLive");
  await putPage(live, voicePage(live));
  const audit = alnumTok("unsubAudit");
  await putPage(audit, auditPage(audit));
  const corrupt = alnumTok("unsubCorrupt");
  await putPage(corrupt, "{not json");
  const cases = [
    ["a form post", () => press(live, { headers: { "content-type": "application/x-www-form-urlencoded" }, body: `token=${live}` }), 400, "bad_request"],
    ["a text post", () => press(live, { headers: { "content-type": "text/plain" } }), 400, "bad_request"],
    ["not JSON", () => press(live, { body: "{token" }), 400, "bad_request"],
    ["no token", () => press(undefined, { body: "{}" }), 400, "bad_token"],
    ["a null body", () => press(undefined, { body: "null" }), 400, "bad_token"],
    ["a short token", () => press("abc"), 400, "bad_token"],
    ["a token that is a path", () => press("../../audits/x/page"), 400, "bad_token"],
    ["a token that is a number", () => press(undefined, { body: '{"token":12345678901234567890}' }), 400, "bad_token"],
    ["an unknown token", () => press(alnumTok("unsubNobody")), 404, "gone"],
    ["an audit page", () => press(audit), 404, "gone"],
    ["a store that cannot be read", () => press(corrupt), 503, "unavailable"],
    ["too large", () => press(live, { body: JSON.stringify({ token: live, pad: "x".repeat(5000) }) }), 413, "too_large"],
  ];
  for (const [label, send, status, code] of cases) {
    const got = await answer(await send());
    assert.equal(got.status, status, label);
    assert.deepEqual(got.json, { ok: false, error: code }, label);
    for (const sent of [live, audit, corrupt, "audits/", "page.json"]) {
      assert.equal(got.text.includes(sent), false, `${label}: the answer must not contain ${sent}`);
    }
  }
  assert.deepEqual(await under("optouts"), []);
});

test("unsubscribe: a store that will not take the file is 503, so the page says try again", async () => {
  const token = alnumTok("unsubStuck");
  await putPage(token, voicePage(token));
  // A file where the token's folder should be: the listing fails (and is no reason to give up), then the write does.
  await put(`optouts/${token}`, "in the way");
  const got = await answer(await press(token));
  assert.equal(got.status, 503);
  assert.deepEqual(got.json, { ok: false, error: "unavailable" });
});

test("unsubscribe: one browser hammering one page is slowed after ten presses", async () => {
  const token = alnumTok("unsubBurst");
  await putPage(token, voicePage(token));
  const same = { headers: { "x-forwarded-for": "10.77.0.1" } };
  for (let i = 1; i <= 10; i++) assert.equal((await press(token, same)).status, 200, `press ${i}`);
  const got = await answer(await press(token, same));
  assert.equal(got.status, 429);
  assert.deepEqual(got.json, { ok: false, error: "rate" });
  assert.equal((await under(`optouts/${token}`)).length, 1);
});

// ---- POST /api/optout-view (the opt-out page's beacon) -------------------------------------------------------------

test("opt-out beacon: a visit is recorded, and opts nobody out", async () => {
  const token = alnumTok("viewGood");
  await putPage(token, voicePage(token));
  const res = await beacon(token);
  assert.equal(res.status, 204);
  assert.equal(await res.text(), "");
  const files = await under(`optout-views/${token}`);
  assert.equal(files.length, 1);
  assert.match(files[0], /^\d{8}T\d{6}Z-[0-9a-f]{32}\.json$/);
  const doc = await read(`optout-views/${token}/${files[0]}`);
  assert.deepEqual(Object.keys(doc).sort(), ["at", "token", "ua", "v"]);
  assert.equal(doc.v, 1);
  assert.equal(doc.token, token);
  assert.equal(doc.ua, "iphone");
  assert.deepEqual(await under("optouts"), [], "a visit is not an opt-out");
  assert.deepEqual(await under("views"), [], "nor a demo page view");
  // An expired page's opt-out page still counts its visits.
  const expired = alnumTok("viewExpired");
  await putPage(expired, voicePage(expired, { top: { expires_at: "2026-01-01" } }));
  assert.equal((await beacon(expired, { ua: DESK })).status, 204);
  assert.equal((await under(`optout-views/${expired}`)).length, 1);
});

test("opt-out beacon: always 204, and nothing is written for machines, bad bodies, unknown or audit tokens", async () => {
  const token = alnumTok("viewSkip");
  await putPage(token, voicePage(token));
  const audit = alnumTok("viewAudit");
  await putPage(audit, auditPage(audit));
  const cases = [
    ...MACHINES.map(([label, ua]) => [label, () => beacon(token, { ua })]),
    ["not JSON", () => beacon(token, { body: "{token" })],
    ["no token", () => beacon(undefined, { body: "{}" })],
    ["a short token", () => beacon("abc")],
    ["an unknown token", () => beacon(alnumTok("viewNobody"))],
    ["an audit page", () => beacon(audit)],
    ["too large", () => beacon(token, { body: JSON.stringify({ token, pad: "x".repeat(5000) }) })],
  ];
  for (const [label, send] of cases) {
    const res = await send();
    assert.equal(res.status, 204, label);
    assert.equal(await res.text(), "", label);
  }
  assert.deepEqual(await under("optout-views"), []);
  // sendBeacon may post its JSON as text/plain: that is still read.
  assert.equal((await beacon(token, { headers: { "content-type": "text/plain;charset=UTF-8" } })).status, 204);
  assert.equal((await under(`optout-views/${token}`)).length, 1);
});

test("opt-out beacon: three visits a window from one browser, like the demo page's beacon", async () => {
  const token = alnumTok("viewBurst");
  await putPage(token, voicePage(token));
  const same = { headers: { "x-forwarded-for": "10.78.0.1" } };
  for (let i = 0; i < 5; i++) assert.equal((await beacon(token, same)).status, 204);
  assert.equal((await under(`optout-views/${token}`)).length, 3);
});

// ---- what the pages themselves send (the review, 2026-11-16) -------------------------------------------------------
// The button's press (optout-press.ts) and the view beacon's body (view-beacon-target.ts) are sent here exactly as the
// page sends them, through a stand-in for the browser: it adds only what a browser adds (its user agent, same-origin)
// and hands the request to whichever route the page's own URL names. A URL with no route is the 404 a browser would get.

function browser({ ua = BROWSER, ip } = {}) {
  const sent = [];
  const routes = { "/api/unsubscribe": unsubscribe, "/api/optout-view": optoutView, "/api/audit-view": auditView };
  const send = async (url, init) => {
    sent.push({ url, init });
    const headers = new Headers(init.headers);
    headers.set("user-agent", ua);
    headers.set("sec-fetch-site", "same-origin");
    headers.set("x-forwarded-for", ip ?? `10.8.${++caller >> 8}.${caller & 255}`);
    const route = routes[url];
    if (!route) return new Response("Not found", { status: 404 });
    return route(new Request(new URL(url, "http://localhost"), { method: init.method, headers, body: init.body }));
  };
  return { send, sent };
}

test("the button: the page's own press is the route's ok and one opt-out file; pressing again is still done", async () => {
  const token = alnumTok("pressGood");
  await putPage(token, voicePage(token));
  const page = browser();
  assert.equal(await pressUnsubscribe(token, page.send), "done");
  assert.equal(page.sent.length, 1);
  assert.equal(page.sent[0].url, "/api/unsubscribe");
  const files = await under(`optouts/${token}`);
  assert.equal(files.length, 1);
  assert.equal((await read(`optouts/${token}/${files[0]}`)).token, token);
  assert.equal(await pressUnsubscribe(token, page.send), "done", "a second press");
  assert.equal((await under(`optouts/${token}`)).length, 1);
  // An expired page's press goes through the same way.
  const expired = alnumTok("pressExpired");
  await putPage(expired, voicePage(expired, { top: { expires_at: "2026-01-01" } }));
  assert.equal(await pressUnsubscribe(expired, browser().send), "done");
  assert.equal((await under(`optouts/${expired}`)).length, 1);
});

test("the button: a refusal, a store fault, no answer or a strange answer is failed, never done", async () => {
  const live = alnumTok("pressLive");
  await putPage(live, voicePage(live));
  const corrupt = alnumTok("pressCorrupt");
  await putPage(corrupt, "{not json");
  const cases = [
    ["an unknown token (404)", alnumTok("pressNobody"), browser().send],
    ["a store that cannot be read (503)", corrupt, browser().send],
    ["a machine (403)", live, browser({ ua: "curl/8.7.1" }).send],
    ["no answer at all", live, async () => { throw new TypeError("network down"); }],
    ["an answer that is not JSON", live, async () => new Response("<html>", { status: 200 })],
    ["ok without ok: true", live, async () => Response.json({ ok: false })],
    ["ok: true on an error status", live, async () => Response.json({ ok: true }, { status: 500 })],
    ["a null body", live, async () => Response.json(null)],
  ];
  for (const [label, token, send] of cases) assert.equal(await pressUnsubscribe(token, send), "failed", label);
  assert.deepEqual(await under("optouts"), []);
});

test("the view beacon: its body reaches both routes, as sendBeacon or fetch sends it, and lands in each one's own folder", async () => {
  const token = alnumTok("beaconBody");
  await putPage(token, voicePage(token));
  for (const type of ["application/json", "text/plain;charset=UTF-8"]) {
    const page = browser();
    const init = { method: "POST", headers: { "Content-Type": type }, body: viewBeaconBody(token) };
    assert.equal((await page.send(VIEW_ENDPOINT, init)).status, 204, `${VIEW_ENDPOINT} ${type}`);
    assert.equal((await page.send(OPTOUT_VIEW_ENDPOINT, init)).status, 204, `${OPTOUT_VIEW_ENDPOINT} ${type}`);
  }
  assert.equal((await under("views")).filter((name) => name.endsWith(`-${token}.json`)).length, 2, "the demo page's opens");
  assert.equal((await under(`optout-views/${token}`)).length, 2, "the opt-out page's visits");
  assert.deepEqual(await under("optouts"), [], "a visit is not an opt-out");
});

// ---- the readable link's miss limit (the review, 2026-11-16) -------------------------------------------------------

test("link: an address that keeps missing gets the 404 for every /for/ link; a real link never counts as a miss", async () => {
  assert.equal(pages.FOR_MISS_LIMIT, 20);
  assert.equal(pages.FOR_MISS_WINDOW_MS, 10 * 60 * 1000);
  const token = alnumTok("missLinked");
  await putPage(token, voicePage(token));
  await put("links/willow-bend-dental-studio.json", linkFile("willow-bend-dental-studio", token));
  const audit = alnumTok("missAudit");
  await putPage(audit, auditPage(audit));
  await put("links/audit-linked.json", linkFile("audit-linked", audit));

  // A prospect opening their own link again and again is never turned away.
  for (let i = 0; i < pages.FOR_MISS_LIMIT + 5; i++) {
    assert.equal((await pages.loadPageForSlugFrom("willow-bend-dental-studio", "10.60.0.1"))?.kind, "voice", `open ${i + 1}`);
  }
  // An address trying names: unknown slugs, a malformed one and a link to an audit page are all misses.
  const guesses = ["Bad_Slug", "audit-linked", ...Array.from({ length: pages.FOR_MISS_LIMIT - 2 }, (_, i) => `guess-dental-${i}`)];
  const shown = async (slug, ip) => chooseView(await pages.loadPageForSlugFrom(slug, ip), "for").kind;
  for (const slug of guesses) assert.equal(await shown(slug, "10.60.0.2"), "missing", slug);
  // From then on even a real link is the 404 for that address, and only for that address.
  assert.equal(await pages.loadPageForSlugFrom("willow-bend-dental-studio", "10.60.0.2"), null);
  assert.equal((await pages.loadPageForSlugFrom("willow-bend-dental-studio", "10.60.0.3"))?.kind, "voice");
  // One miss short of the limit still gets the page.
  for (let i = 0; i < pages.FOR_MISS_LIMIT - 1; i++) await pages.loadPageForSlugFrom(`near-miss-${i}`, "10.60.0.4");
  assert.equal((await pages.loadPageForSlugFrom("willow-bend-dental-studio", "10.60.0.4"))?.kind, "voice");
});
