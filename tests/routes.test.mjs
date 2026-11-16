/**
 * The two voice routes and the page loader, run in-process against a blob
 * mock directory and a small local stand-in for the voice vendor. No request
 * leaves this machine: a tripwire on fetch fails the test if one tries.
 * Run with: npm test
 */
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { after, before, beforeEach, test } from "node:test";
import { capDay, demoDayPath, demoPath } from "../src/lib/demo-caps.ts";
import { auditPage, tok, voicePage } from "./fixtures.mjs";

const KEY = "test-key-never-a-real-one-7f3a";
const ASSISTANT = "11111111-2222-4333-8444-555555555555";
const SECRET = "test-webhook-secret-0123456789";
const UPSTREAM_TEXT = "UPSTREAM-BODY-TEXT-THAT-MUST-NOT-LEAK";
const BROWSER =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";

// ---- the stand-in vendor ---------------------------------------------------------------------------------------

const vendor = { calls: [], next: null, port: 0 };
const GOOD = { status: 200, body: { id: "session-1", url: "wss://media.invalid/rtc", token: "session-token-abc", expires_in: 900 } };
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    vendor.calls.push({ method: req.method, url: req.url, headers: req.headers, body });
    const next = vendor.next ?? GOOD;
    if (next.destroy) return req.socket.destroy();
    res.writeHead(next.status, { "content-type": "application/json", ...(next.headers ?? {}) });
    res.end(typeof next.body === "string" ? next.body : JSON.stringify(next.body));
  });
});

// ---- the tripwire -----------------------------------------------------------------------------------------------

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

// ---- the store --------------------------------------------------------------------------------------------------

let root;
let store;
let mint;
let webhook;
let view;
let pages;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  vendor.port = server.address().port;
  root = await mkdtemp(path.join(os.tmpdir(), "voice-routes-"));
  delete process.env.VERCEL;
  process.env.AUTOCALLS_API_KEY = KEY;
  process.env.AUTOCALLS_ASSISTANT_UUID = ASSISTANT;
  process.env.AUTOCALLS_API_BASE = `http://127.0.0.1:${vendor.port}`;
  process.env.AUTOCALLS_WEBHOOK_SECRET = SECRET;
  process.env.BLOB_MOCK_DIR = path.join(root, "unset");
  ({ POST: mint } = await import("../src/app/api/demo-session/route.ts"));
  ({ POST: webhook } = await import("../src/app/api/autocalls-webhook/route.ts"));
  ({ POST: view } = await import("../src/app/api/audit-view/route.ts"));
  pages = await import("../src/lib/audit-page.ts");
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(root, { recursive: true, force: true });
  assert.deepEqual(tripped, [], "no request may leave this machine");
});

let n = 0;
beforeEach(async () => {
  // A fresh, empty store for every test, so no test's markers count against another's caps.
  store = path.join(root, `store-${++n}`);
  await mkdir(store, { recursive: true });
  process.env.BLOB_MOCK_DIR = store;
  process.env.AUTOCALLS_API_KEY = KEY;
  process.env.AUTOCALLS_ASSISTANT_UUID = ASSISTANT;
  process.env.AUTOCALLS_API_BASE = `http://127.0.0.1:${vendor.port}`;
  process.env.AUTOCALLS_WEBHOOK_SECRET = SECRET;
  vendor.calls.length = 0;
  vendor.next = null;
});

async function put(pathname, doc) {
  const file = path.join(store, pathname);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(doc));
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
function press(token, { ua = BROWSER, headers = {}, body } = {}) {
  const all = { "content-type": "application/json", "x-forwarded-for": `10.1.${++caller >> 8}.${caller & 255}`, ...headers };
  if (ua !== null) all["user-agent"] = ua;
  return mint(
    new Request("http://localhost/api/demo-session", { method: "POST", headers: all, body: body ?? JSON.stringify({ token }) }),
  );
}

/** A response's status and JSON, and the raw text for leak checks. */
async function answer(res) {
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, json, text, headers: res.headers };
}

function noLeak(text, label) {
  for (const secret of [KEY, UPSTREAM_TEXT, ASSISTANT, "session-1", `127.0.0.1:${vendor.port}`]) {
    assert.equal(text.includes(secret), false, `${label}: the answer must not contain ${secret}`);
  }
  assert.equal(/autocalls/i.test(text), false, `${label}: the answer must not name the vendor`);
}

// ---- the page loader ---------------------------------------------------------------------------------------------

test("loader: an existing audit page loads exactly as before, and is not a voice page", async () => {
  const token = tok("audit");
  await putPage(token, auditPage(token));
  const page = await pages.loadAuditPage(token);
  assert.ok(page);
  assert.equal(page.business, "Bayou Bend Heating and Air");
  assert.equal(page.trade, "hvac");
  assert.equal(page.place_noun, "shop");
  assert.equal(page.keyword, "ac repair");
  assert.equal(page.pins, 49);
  assert.equal(page.top3, 6);
  assert.equal(page.rows.length, 3);
  assert.equal(page.rows[2].me, true);
  assert.equal(page.persona_first, "Conner");
  assert.equal(page.plan, true);
  assert.equal(page.pdf_url, null);
  assert.equal(page.legacy, false);
  assert.equal(page.pdf_filename, "Bayou Bend Heating and Air - Google Map Audit and Plan.pdf");
  assert.equal(page.expires_at, "2999-01-01T00:00:00Z");
  const loaded = await pages.loadPage(token);
  assert.equal(loaded.kind, "audit");
  assert.deepEqual(loaded.page, page);
});

test("loader: an audit page still needs its keyword and pins, and still expires", async () => {
  for (const [label, change] of [
    ["no keyword", (p) => delete p.keyword],
    ["no pins", (p) => delete p.pins],
    ["expired", (p) => (p.expires_at = "2020-01-01T00:00:00Z")],
  ]) {
    const token = tok(`a${label.replace(/ /g, "")}`);
    const doc = auditPage(token);
    change(doc);
    await putPage(token, doc);
    assert.equal(await pages.loadAuditPage(token), null, label);
    assert.equal(await pages.loadPage(token), null, label);
  }
});

test("loader: a voice page loads as a voice page, and the audit routes' loader does not see it", async () => {
  const token = tok("voice");
  await putPage(token, voicePage(token));
  const loaded = await pages.loadPage(token);
  assert.equal(loaded.kind, "voice");
  assert.equal(loaded.page.business, "Maple Creek Family Dental");
  assert.equal(await pages.loadAuditPage(token), null);
  // A plumbing page, the trade the audit pages never had.
  const plumbing = tok("plumb");
  await putPage(plumbing, voicePage(plumbing, { top: { trade: "plumbing" } }));
  assert.equal((await pages.loadPage(plumbing)).page.trade, "plumbing");
  // A broken voice page is a 404, never an audit page by accident.
  const broken = tok("broken");
  const doc = voicePage(broken);
  delete doc.demo.tz;
  await putPage(broken, doc);
  assert.equal(await pages.loadPage(broken), null);
  assert.equal(await pages.loadPage(tok("nosuch")), null);
  assert.equal(await pages.loadPage("../../etc/passwd"), null);
});

test("view beacon: a voice page reports an open like an audit page does", async () => {
  const token = tok("viewed");
  await putPage(token, voicePage(token));
  const beacon = (t) =>
    view(
      new Request("http://localhost/api/audit-view", {
        method: "POST",
        headers: { "user-agent": BROWSER, "x-forwarded-for": `10.2.0.${++caller & 255}` },
        body: JSON.stringify({ token: t }),
      }),
    );
  assert.equal((await beacon(token)).status, 204);
  const views = await under("views");
  assert.equal(views.length, 1);
  assert.ok(views[0].endsWith(`-${token}.json`));
  assert.equal((await read(`views/${views[0]}`)).token, token);
  assert.equal((await beacon(tok("nosuch"))).status, 204);
  assert.equal((await under("views")).length, 1);
});

// ---- POST /api/demo-session ----------------------------------------------------------------------------------------

test("mint: refused before anything is read or asked for", async () => {
  const token = tok("good");
  await putPage(token, voicePage(token));
  const cases = [
    ["a form post", () => press(token, { headers: { "content-type": "application/x-www-form-urlencoded" }, body: `token=${token}` }), 400, "bad_request"],
    ["a text post", () => press(token, { headers: { "content-type": "text/plain" } }), 400, "bad_request"],
    ["not JSON", () => press(token, { body: "{token" }), 400, "bad_request"],
    ["another site's page", () => press(token, { headers: { "sec-fetch-site": "cross-site" } }), 403, "forbidden"],
    ["no token", () => press(undefined, { body: "{}" }), 404, "gone"],
    ["a null body", () => press(undefined, { body: "null" }), 404, "gone"],
    ["a short token", () => press("abc"), 404, "gone"],
    ["a token with a slash", () => press("abcdefgh/../../x"), 404, "gone"],
    ["a token that is a number", () => press(undefined, { body: '{"token":12345678}' }), 404, "gone"],
    ["curl", () => press(token, { ua: "curl/8.7.1" }), 403, "forbidden"],
    ["a python script", () => press(token, { ua: "python-requests/2.32" }), 403, "forbidden"],
    ["a mail scanner", () => press(token, { ua: "Mozilla/5.0 (compatible; Proofpoint Essentials)" }), 403, "forbidden"],
    ["a headless browser", () => press(token, { ua: "Mozilla/5.0 HeadlessChrome/131.0" }), 403, "forbidden"],
    ["a link preview", () => press(token, { ua: "Slackbot-LinkExpanding 1.0" }), 403, "forbidden"],
    ["no user agent at all", () => press(token, { ua: null }), 403, "forbidden"],
  ];
  for (const [label, send, status, code] of cases) {
    const got = await answer(await send());
    assert.equal(got.status, status, label);
    assert.equal(got.json.ok, false, label);
    assert.equal(got.json.error, code, label);
    assert.equal(typeof got.json.message, "string", label);
    noLeak(got.text, label);
  }
  assert.equal(vendor.calls.length, 0, "no session was asked for");
  assert.deepEqual(await under("demos"), []);
});

test("mint: unknown, expired, broken and audit pages all get the same 404", async () => {
  const expired = tok("expired");
  await putPage(expired, voicePage(expired, { top: { expires_at: "2026-01-01" } }));
  const audit = tok("auditkind");
  await putPage(audit, auditPage(audit));
  const broken = tok("brokenpage");
  const doc = voicePage(broken);
  doc.demo.vars.lead_token = tok("someoneelse");
  await putPage(broken, doc);

  const answers = [];
  for (const token of [tok("unknown"), expired, audit, broken]) {
    const got = await answer(await press(token));
    assert.equal(got.status, 404, token);
    answers.push(got.text);
  }
  assert.equal(new Set(answers).size, 1, "the four answers are identical");
  assert.equal(vendor.calls.length, 0);
});

test("mint: a good press returns only {url, token}, sends the right call, and writes both markers", async () => {
  const token = tok("mintgood");
  await putPage(token, voicePage(token));
  const started = Date.now();
  const got = await answer(await press(token));
  assert.equal(got.status, 200);
  assert.deepEqual(got.json, { url: "wss://media.invalid/rtc", token: "session-token-abc" });
  assert.equal(got.headers.get("cache-control"), "no-store");
  noLeak(got.text, "good mint");

  // What the vendor was sent.
  assert.equal(vendor.calls.length, 1);
  const call = vendor.calls[0];
  assert.equal(call.method, "POST");
  assert.equal(call.url, "/api/user/realtime/session");
  assert.equal(call.headers.authorization, `Bearer ${KEY}`);
  assert.equal(call.headers["content-type"], "application/json");
  const sent = JSON.parse(call.body);
  assert.deepEqual(Object.keys(sent).sort(), ["assistant_id", "external_identifier", "variables"]);
  assert.equal(sent.assistant_id, ASSISTANT);
  assert.equal(sent.external_identifier, token);
  assert.equal(sent.variables.business_name, "Maple Creek Family Dental");
  assert.equal(sent.variables.lead_token, token);
  assert.equal(sent.variables.demo_mode, "yes");
  assert.ok(["yes", "no"].includes(sent.variables.after_hours));
  assert.match(sent.variables.next_open_day, /^next-d[0-6]-(before|after)$/);
  assert.match(sent.variables.appt_windows, /^windows-d[0-6]-(before|after)$/);
  assert.ok(Object.keys(sent.variables).length <= 50);
  assert.ok(Object.values(sent.variables).every((v) => typeof v === "string"));

  // The two markers.
  const demos = await under(`demos/${token}`);
  assert.equal(demos.length, 1);
  assert.match(demos[0], /^\d{8}T\d{6}Z-[0-9a-f]{32}\.json$/);
  const marker = await read(`demos/${token}/${demos[0]}`);
  assert.deepEqual(Object.keys(marker).sort(), ["at", "token", "ua", "v"]);
  assert.equal(marker.token, token);
  assert.equal(marker.ua, "iphone");
  assert.ok(Math.abs(Date.parse(marker.at) - started) < 60_000);
  const day = capDay(new Date(marker.at));
  const days = await under(`demo-days/${day}`);
  assert.equal(days.length, 1);
  assert.equal(days[0], demos[0], "the same name under the day");
  assert.deepEqual(Object.keys(await read(`demo-days/${day}/${days[0]}`)).sort(), ["at", "v"]);
});

test("mint: the page's daily cap is three", async () => {
  const token = tok("capday");
  await putPage(token, voicePage(token));
  for (let i = 1; i <= 3; i++) assert.equal((await press(token)).status, 200, `press ${i}`);
  const fourth = await answer(await press(token));
  assert.equal(fourth.status, 429);
  assert.equal(fourth.json.error, "page_day");
  assert.equal(vendor.calls.length, 3, "the fourth press never reached the vendor");
  assert.equal((await under(`demos/${token}`)).length, 3);
  // Another page is not affected.
  const other = tok("capday2");
  await putPage(other, voicePage(other));
  assert.equal((await press(other)).status, 200);
});

test("mint: the page's lifetime cap is six", async () => {
  const token = tok("caplife");
  await putPage(token, voicePage(token));
  // Five sessions on earlier days, then one today: the sixth is allowed, the seventh is not.
  for (let i = 0; i < 5; i++) {
    await put(demoPath(token, new Date(Date.UTC(2026, 0, 5 + i, 18)), `${"a".repeat(31)}${i}`), { v: 1, token });
  }
  assert.equal((await press(token)).status, 200);
  const seventh = await answer(await press(token));
  assert.equal(seventh.status, 429);
  assert.equal(seventh.json.error, "page_life");
  assert.equal(vendor.calls.length, 1);
});

test("mint: the all-pages daily cap is twenty-five", async () => {
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    await put(demoDayPath(now, `${"b".repeat(30)}${String(i).padStart(2, "0")}`), { v: 1 });
  }
  const first = tok("global1");
  const second = tok("global2");
  await putPage(first, voicePage(first));
  await putPage(second, voicePage(second));
  assert.equal((await press(first)).status, 200, "the twenty-fifth of the day");
  const refused = await answer(await press(second));
  assert.equal(refused.status, 429);
  assert.equal(refused.json.error, "busy");
  assert.equal(vendor.calls.length, 1, "the twenty-sixth never reached the vendor");
  assert.deepEqual(await under(`demos/${second}`), []);
});

test("mint: every vendor error becomes a safe answer and no marker", async () => {
  const cases = [
    [401, 503, "unavailable"],
    [402, 402, "balance"],
    [403, 503, "unavailable"],
    [404, 503, "unavailable"],
    [422, 503, "unavailable"],
    [429, 429, "busy"],
    [503, 503, "unavailable"],
    [500, 503, "unavailable"],
    [302, 503, "unavailable"],
  ];
  for (const [upstream, status, code] of cases) {
    const token = tok(`up${upstream}`);
    await putPage(token, voicePage(token));
    vendor.calls.length = 0;
    vendor.next = {
      status: upstream,
      headers: upstream === 302 ? { location: `http://127.0.0.1:${vendor.port}/elsewhere` } : {},
      body: { error: UPSTREAM_TEXT, message: `Bearer ${KEY} was refused`, assistant_id: ASSISTANT },
    };
    const got = await answer(await press(token));
    assert.equal(got.status, status, `vendor ${upstream}`);
    assert.deepEqual(Object.keys(got.json).sort(), ["error", "message", "ok"], `vendor ${upstream}`);
    assert.equal(got.json.error, code, `vendor ${upstream}`);
    noLeak(got.text, `vendor ${upstream}`);
    assert.equal(vendor.calls.length, 1, `vendor ${upstream}: asked once, a redirect is not followed`);
    assert.deepEqual(await under(`demos/${token}`), [], `vendor ${upstream}: no marker`);
    assert.deepEqual(await under("demo-days"), [], `vendor ${upstream}: no day marker`);
  }
});

test("mint: a vendor that hangs up, or answers 200 with nothing usable, is 503 and no marker", async () => {
  const cases = [
    ["hangs up", { destroy: true }],
    ["not JSON", { status: 200, body: "<html>login</html>" }],
    ["no token", { status: 200, body: { id: "session-1", url: "wss://media.invalid/rtc" } }],
    ["no url", { status: 200, body: { id: "session-1", token: "session-token-abc" } }],
    ["a url that is not one", { status: 200, body: { url: "javascript:alert(1)", token: "session-token-abc" } }],
    ["201", { status: 201, body: GOOD.body }],
  ];
  for (const [label, next] of cases) {
    const token = tok(`odd${label.replace(/[^a-z0-9]/gi, "")}`);
    await putPage(token, voicePage(token));
    vendor.next = next;
    const got = await answer(await press(token));
    assert.equal(got.status, 503, label);
    assert.equal(got.json.error, "unavailable", label);
    noLeak(got.text, label);
    assert.deepEqual(await under(`demos/${token}`), [], label);
  }
});

test("mint: missing or unsafe settings are 503 and nothing is sent anywhere", async () => {
  const cases = [
    ["no key", () => delete process.env.AUTOCALLS_API_KEY],
    ["a blank key", () => (process.env.AUTOCALLS_API_KEY = "  ")],
    ["no assistant", () => delete process.env.AUTOCALLS_ASSISTANT_UUID],
    ["an assistant number, not a uuid", () => (process.env.AUTOCALLS_ASSISTANT_UUID = "16877")],
    ["a plain-http base on another host", () => (process.env.AUTOCALLS_API_BASE = "http://vendor.example")],
    ["a base with a password in it", () => (process.env.AUTOCALLS_API_BASE = "https://user:pw@vendor.example")],
    ["a base that is not a URL", () => (process.env.AUTOCALLS_API_BASE = "vendor")],
  ];
  for (const [label, change] of cases) {
    process.env.AUTOCALLS_API_KEY = KEY;
    process.env.AUTOCALLS_ASSISTANT_UUID = ASSISTANT;
    process.env.AUTOCALLS_API_BASE = `http://127.0.0.1:${vendor.port}`;
    change();
    const token = tok(`cfg${label.replace(/[^a-z0-9]/gi, "")}`);
    await putPage(token, voicePage(token));
    const got = await answer(await press(token));
    assert.equal(got.status, 503, label);
    assert.equal(got.json.error, "unavailable", label);
    noLeak(got.text, label);
  }
  assert.equal(vendor.calls.length, 0);
  assert.deepEqual(tripped, []);
});

test("mint: one browser pressing over and over is slowed before the store or the vendor is asked", async () => {
  const token = tok("burst");
  // No page on purpose: each press is a cheap 404 until the limiter steps in.
  const statuses = [];
  for (let i = 0; i < 12; i++) {
    statuses.push((await press(token, { headers: { "x-forwarded-for": "10.9.9.9" } })).status);
  }
  assert.deepEqual(statuses, [...Array(10).fill(404), 429, 429]);
});

// ---- POST /api/autocalls-webhook -------------------------------------------------------------------------------------

function callPayload(id, over = {}) {
  const token = over.token ?? tok("called");
  return {
    id,
    type: "web",
    assistant_id: ASSISTANT,
    assistant_name: "Receptionist",
    customer_phone: "",
    assistant_phone: "",
    duration: 184,
    status: "completed",
    ended_by: "customer",
    created_at: "2026-11-16T21:04:11+02:00",
    finished_at: "2026-11-16T21:07:15+02:00",
    input_variables: { business_name: "Maple Creek Family Dental", lead_token: token, demo_mode: "yes" },
    extracted_variables: {
      summary: "Asked about a chipped tooth and wanted a consultant to call.",
      caller_name: "Dana",
      wants_consult: true,
      consult_phone: "2815550142",
      consult_note: "after 3 PM",
      outcome: "message_taken",
    },
    transcript: [{ role: "assistant", text: "Thanks for calling." }],
    formatted_transcript: "assistant: Thanks for calling.",
    lead: { id: 9, phone: "+12815550142" },
    ...over.top,
  };
}

function hook(payload, { k = SECRET, route = webhook, raw } = {}) {
  const url = `http://localhost/api/autocalls-webhook${k === null ? "" : `?k=${encodeURIComponent(k)}`}`;
  return route(
    new Request(url, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "vendor-webhook/1.0" },
      body: raw ?? JSON.stringify(payload),
    }),
  );
}

test("webhook: no secret, the wrong secret and an unset secret are all the same 404", async () => {
  const texts = [];
  for (const [label, k] of [
    ["no k", null],
    ["an empty k", ""],
    ["a wrong k", "not-the-secret-0123456789abcdef"],
    ["a k that only starts right", SECRET.slice(0, -1)],
    ["a k that is longer", `${SECRET}x`],
  ]) {
    const got = await answer(await hook(callPayload("100"), { k }));
    assert.equal(got.status, 404, label);
    texts.push(got.text);
  }
  delete process.env.AUTOCALLS_WEBHOOK_SECRET;
  for (const k of [null, "", SECRET, "undefined"]) {
    const got = await answer(await hook(callPayload("101"), { k }));
    assert.equal(got.status, 404, `unset secret, k=${k}`);
    texts.push(got.text);
  }
  // A secret too short to be one keeps the route shut even when it matches.
  process.env.AUTOCALLS_WEBHOOK_SECRET = "short";
  const short = await answer(await hook(callPayload("102"), { k: "short" }));
  assert.equal(short.status, 404);
  texts.push(short.text);
  assert.equal(new Set(texts).size, 1, "every refusal reads the same");
  assert.deepEqual(await under("calls"), []);
});

test("webhook: the right secret stores the call once, without the transcript", async () => {
  const got = await answer(await hook(callPayload("48211")));
  assert.equal(got.status, 200);
  assert.deepEqual(got.json, { ok: true, stored: true });
  // The name is the call's own start time in UTC, then its id.
  assert.deepEqual(await under("calls"), ["20261116T190411Z-48211.json"]);
  const stored = await read("calls/20261116T190411Z-48211.json");
  assert.equal(stored.v, 1);
  assert.equal(stored.id, "48211");
  assert.equal(stored.type, "web");
  assert.equal(stored.assistant_id, ASSISTANT);
  assert.equal(stored.status, "completed");
  assert.equal(stored.duration, 184);
  assert.equal(stored.created_at, "2026-11-16T21:04:11+02:00");
  assert.equal(stored.lead_token, tok("called"));
  assert.equal(stored.input_variables.demo_mode, "yes");
  assert.equal(stored.extracted_variables.wants_consult, true);
  assert.equal(stored.extracted_variables.consult_phone, "2815550142");
  assert.equal(stored.extracted_variables.consult_note, "after 3 PM");
  for (const key of ["transcript", "formatted_transcript", "lead", "assistant_name"]) {
    assert.equal(key in stored, false, `${key} is not stored`);
  }
  assert.equal(JSON.stringify(stored).includes("Thanks for calling"), false);
});

test("webhook: a repeated id is answered 200 and stored once, by this instance and by a fresh one", async () => {
  assert.deepEqual((await answer(await hook(callPayload("500")))).json, { ok: true, stored: true });
  // The vendor's retry, to the same warm instance.
  assert.deepEqual((await answer(await hook(callPayload("500")))).json, { ok: true, stored: false, duplicate: true });
  // A resend much later, to an instance that has never seen the id: the store itself says so.
  const { POST: cold } = await import("../src/app/api/autocalls-webhook/route.ts?instance=2");
  const again = await answer(await hook(callPayload("500", { top: { status: "ended", duration: 999 } }), { route: cold }));
  assert.equal(again.status, 200);
  assert.deepEqual(again.json, { ok: true, stored: false, duplicate: true });
  assert.deepEqual(await under("calls"), ["20261116T190411Z-500.json"]);
  assert.equal((await read("calls/20261116T190411Z-500.json")).duration, 184, "the first copy is kept");
  // A different id is a different call.
  assert.deepEqual((await answer(await hook(callPayload("501"), { route: cold }))).json, { ok: true, stored: true });
  assert.equal((await under("calls")).length, 2);
});

test("webhook: a call with no time of its own is stored under the arrival time and still deduped", async () => {
  const bare = () => callPayload("600", { top: { created_at: undefined, finished_at: "not a date" } });
  assert.deepEqual((await answer(await hook(bare()))).json, { ok: true, stored: true });
  const names = await under("calls");
  assert.equal(names.length, 1);
  assert.match(names[0], /^\d{8}T\d{6}Z-600\.json$/);
  const { POST: cold } = await import("../src/app/api/autocalls-webhook/route.ts?instance=3");
  assert.deepEqual((await answer(await hook(bare(), { route: cold }))).json, { ok: true, stored: false, duplicate: true });
  assert.equal((await under("calls")).length, 1);
});

test("webhook: only our own demo calls are kept", async () => {
  const cases = [
    ["another assistant", callPayload("700", { top: { assistant_id: "99999999-2222-4333-8444-555555555555" } })],
    ["no assistant id", callPayload("701", { top: { assistant_id: undefined } })],
    ["a real call, not a demo", callPayload("702", { top: { input_variables: { demo_mode: "no", lead_token: "" } } })],
    ["no variables at all", callPayload("703", { top: { input_variables: undefined } })],
  ];
  for (const [label, payload] of cases) {
    const got = await answer(await hook(payload));
    assert.equal(got.status, 200, label);
    assert.deepEqual(got.json, { ok: true, stored: false, ignored: true }, label);
  }
  // With no assistant configured on our side nothing can be told apart, so nothing is kept.
  delete process.env.AUTOCALLS_ASSISTANT_UUID;
  assert.deepEqual((await answer(await hook(callPayload("704")))).json, { ok: true, stored: false, ignored: true });
  assert.deepEqual(await under("calls"), []);
});

test("webhook: a body that is not a call is 400, and an id can never be a path", async () => {
  const cases = [
    ["not JSON", { raw: "id=5" }],
    ["a list", { raw: "[1,2]" }],
    ["null", { raw: "null" }],
    ["no id", { raw: JSON.stringify({ ...callPayload("x"), id: undefined }) }],
    ["an id with a slash", { raw: JSON.stringify(callPayload("../../audits/x")) }],
    ["an id with a dot", { raw: JSON.stringify(callPayload("800.json")) }],
    ["an id that is an object", { raw: JSON.stringify({ ...callPayload("x"), id: { a: 1 } }) }],
    ["an id 65 characters long", { raw: JSON.stringify(callPayload("9".repeat(65))) }],
  ];
  for (const [label, options] of cases) {
    const got = await answer(await hook(null, options));
    assert.equal(got.status, 400, label);
    assert.equal(got.json.ok, false, label);
  }
  // A numeric id is fine.
  assert.deepEqual((await answer(await hook(callPayload(801)))).json, { ok: true, stored: true });
  assert.deepEqual(await under("calls"), ["20261116T190411Z-801.json"]);
  // Too large is refused before it is parsed.
  const big = await answer(await hook(null, { raw: JSON.stringify({ ...callPayload("802"), formatted_transcript: "x".repeat(1024 * 1024 + 10) }) }));
  assert.equal(big.status, 413);
});
