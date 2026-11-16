/**
 * The demo caps (contract section 2): three sessions per page per Central
 * day, six per page in its life, twenty-five a day across all pages, all
 * counted from blob names. Run with: npm test
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CALL_ID,
  DEMO_CAPS,
  callPath,
  capDay,
  capReached,
  countCaps,
  demoDayPath,
  demoDayPrefix,
  demoPath,
  demosPrefix,
  isoCompact,
  timeOfPath,
  uaClass,
} from "../src/lib/demo-caps.ts";
import { tok } from "./fixtures.mjs";

const TOKEN = tok("caps");
const RAND = "0123456789abcdef0123456789abcdef";
const at = (iso) => new Date(iso);
const marker = (iso, n = 0) => demoPath(TOKEN, at(iso), RAND.slice(0, 31) + (n % 16).toString(16));

test("the three caps are the contract's numbers", () => {
  assert.deepEqual(DEMO_CAPS, { perPagePerDay: 3, perPageLife: 6, globalPerDay: 25 });
});

test("paths: the contract's shapes, and a name gives its time back", () => {
  const when = at("2026-11-16T03:15:09Z");
  assert.equal(isoCompact(when), "20261116T031509Z");
  assert.equal(demoPath(TOKEN, when, RAND), `demos/${TOKEN}/20261116T031509Z-${RAND}.json`);
  // 03:15 UTC on the 16th is still the 15th in Central time.
  assert.equal(demoDayPath(when, RAND), `demo-days/2026-11-15/20261116T031509Z-${RAND}.json`);
  assert.equal(callPath(when, "48211"), "calls/20261116T031509Z-48211.json");
  assert.equal(demosPrefix(TOKEN), `demos/${TOKEN}/`);
  assert.equal(demoDayPrefix("2026-11-15"), "demo-days/2026-11-15/");
  assert.equal(timeOfPath(demoPath(TOKEN, when, RAND))?.toISOString(), "2026-11-16T03:15:09.000Z");
  assert.equal(timeOfPath(callPath(when, "48211"))?.toISOString(), "2026-11-16T03:15:09.000Z");
  assert.equal(timeOfPath(`demos/${TOKEN}/notes.json`), null);
});

test("the cap day is the Central calendar day, across midnight and both clock changes", () => {
  assert.equal(capDay(at("2026-11-16T05:59:59Z")), "2026-11-15"); // 23:59 CST
  assert.equal(capDay(at("2026-11-16T06:00:00Z")), "2026-11-16"); // midnight CST
  assert.equal(capDay(at("2026-07-04T04:59:59Z")), "2026-07-03"); // 23:59 CDT
  assert.equal(capDay(at("2026-07-04T05:00:00Z")), "2026-07-04"); // midnight CDT
  // The night daylight saving ends: the 25-hour day is still one day.
  assert.equal(capDay(at("2026-11-01T05:00:00Z")), "2026-11-01"); // midnight CDT
  assert.equal(capDay(at("2026-11-02T05:59:59Z")), "2026-11-01"); // 23:59 CST
  assert.equal(capDay(at("2026-11-02T06:00:00Z")), "2026-11-02");
});

test("counting: today's, lifetime and all-pages", () => {
  const now = at("2026-11-16T20:00:00Z"); // 14:00 Central on the 16th
  const pagePaths = [
    marker("2026-11-10T15:00:00Z", 1), // last week
    marker("2026-11-16T05:30:00Z", 2), // 23:30 Central on the 15th: yesterday
    marker("2026-11-16T06:10:00Z", 3), // 00:10 Central today
    marker("2026-11-16T19:00:00Z", 4), // today
  ];
  const dayPaths = Array.from({ length: 7 }, (_, i) => demoDayPath(at("2026-11-16T19:00:00Z"), RAND.slice(0, 31) + i));
  assert.deepEqual(countCaps(pagePaths, dayPaths, now), { pageToday: 2, pageLife: 4, globalToday: 7 });
  assert.deepEqual(countCaps([], [], now), { pageToday: 0, pageLife: 0, globalToday: 0 });
});

test("counting: a file whose name cannot be read counts as today's (stricter, never looser)", () => {
  const now = at("2026-11-16T20:00:00Z");
  const counts = countCaps([`demos/${TOKEN}/notes.json`, marker("2026-11-10T15:00:00Z")], [], now);
  assert.deepEqual(counts, { pageToday: 1, pageLife: 2, globalToday: 0 });
});

test("which cap is reached", () => {
  const ok = { pageToday: 2, pageLife: 5, globalToday: 24 };
  assert.equal(capReached(ok), null);
  assert.equal(capReached({ ...ok, pageToday: 3 }), "page_day");
  assert.equal(capReached({ ...ok, pageLife: 6 }), "page_life");
  assert.equal(capReached({ ...ok, globalToday: 25 }), "busy");
  // The one that will not clear by itself is named first.
  assert.equal(capReached({ pageToday: 3, pageLife: 6, globalToday: 25 }), "page_life");
  assert.equal(capReached({ pageToday: 3, pageLife: 5, globalToday: 25 }), "page_day");
  // The numbers come from one place and can be changed there.
  assert.equal(capReached(ok, { perPagePerDay: 2, perPageLife: 6, globalPerDay: 25 }), "page_day");
  assert.equal(capReached({ pageToday: 0, pageLife: 0, globalToday: 0 }), null);
});

test("a page's fourth press today, its seventh ever, and the twenty-sixth of the day are all refused", () => {
  const now = at("2026-11-16T20:00:00Z");
  const today = (n) => Array.from({ length: n }, (_, i) => marker(`2026-11-16T1${i % 9}:00:00Z`, i));
  const earlier = (n) => Array.from({ length: n }, (_, i) => marker(`2026-11-0${1 + (i % 8)}T15:00:00Z`, i));
  const day = (n) => Array.from({ length: n }, (_, i) => demoDayPath(now, `${RAND.slice(0, 30)}${String(i).padStart(2, "0")}`));
  assert.equal(capReached(countCaps(today(2), day(2), now)), null);
  assert.equal(capReached(countCaps(today(3), day(3), now)), "page_day");
  assert.equal(capReached(countCaps([...earlier(5)], day(0), now)), null);
  assert.equal(capReached(countCaps([...earlier(4), ...today(2)], day(2), now)), "page_life");
  assert.equal(capReached(countCaps([], day(24), now)), null);
  assert.equal(capReached(countCaps([], day(25), now)), "busy");
});

test("call ids that may go in a blob name", () => {
  for (const id of ["48211", "a1b2-c3d4", "call_77", "A".repeat(64)]) assert.equal(CALL_ID.test(id), true, id);
  for (const id of ["", "../x", "a/b", "a b", "a.json", "A".repeat(65), "id?x=1"]) assert.equal(CALL_ID.test(id), false, id);
});

test("the device class says phone or desk, never the user agent", () => {
  const cases = {
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 Version/18.1 Mobile/15E148 Safari/604.1": "iphone",
    "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1": "ipad",
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36": "android",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.1 Safari/605.1.15": "mac",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36": "windows",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36": "linux",
    "": "other",
    "SomethingElse/1.0": "other",
  };
  for (const [ua, want] of Object.entries(cases)) assert.equal(uaClass(ua), want, ua);
});
