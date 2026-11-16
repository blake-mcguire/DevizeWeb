/**
 * The clock pick the mint route makes at the click (contract section 5):
 * weekday and minute in the business's own timezone, after_hours, and which
 * of the day's two spoken lines is used. Run with: npm test
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { clockKeys, localClock, parseVoicePage, sessionVariables, voiceExpired } from "../src/lib/voice-page.ts";
import { FULL_DAY_WINDOWS, pipelineWeekTable, tok, voicePage, weekTable } from "./fixtures.mjs";

const demo = (tz, days = weekTable()) => ({ vars: {}, tz, days });
const at = (iso) => new Date(iso);
const keys = (label, afterHours) => ({
  after_hours: afterHours,
  next_open_day: `next-${label}`,
  appt_windows: `windows-${label}`,
});

test("local clock: weekday 0 is Monday, minutes run from local midnight", () => {
  // 2026-11-16 is a Monday. 16:00 UTC is 10:00 in Chicago (CST, UTC-6).
  assert.deepEqual(localClock("America/Chicago", at("2026-11-16T16:00:00Z")), {
    weekday: 0,
    minute: 600,
    date: "2026-11-16",
  });
  // Local midnight is minute 0, not 1440.
  assert.deepEqual(localClock("America/Chicago", at("2026-11-16T06:00:00Z")), {
    weekday: 0,
    minute: 0,
    date: "2026-11-16",
  });
  assert.equal(localClock("America/Chicago", at("2026-11-16T05:59:00Z")).minute, 1439);
});

test("one instant is a different weekday in different timezones", () => {
  const instant = at("2026-11-17T04:30:00Z"); // Tuesday in UTC
  assert.deepEqual(localClock("UTC", instant), { weekday: 1, minute: 270, date: "2026-11-17" });
  assert.deepEqual(localClock("America/New_York", instant), { weekday: 0, minute: 1410, date: "2026-11-16" });
  assert.deepEqual(localClock("America/Chicago", instant), { weekday: 0, minute: 1350, date: "2026-11-16" });
  assert.deepEqual(localClock("America/Denver", instant), { weekday: 0, minute: 1290, date: "2026-11-16" });
  assert.deepEqual(localClock("America/Los_Angeles", instant), { weekday: 0, minute: 1230, date: "2026-11-16" });
  assert.deepEqual(localClock("Pacific/Honolulu", instant), { weekday: 0, minute: 1110, date: "2026-11-16" });
  // So the same click is "open" for no one here, but picks Monday's table in Chicago and Tuesday's in UTC.
  assert.deepEqual(clockKeys(demo("America/Chicago"), instant), keys("d0-after", "yes"));
  assert.deepEqual(clockKeys(demo("UTC"), instant), keys("d1-before", "yes"));
});

test("open hours: inside a span is not after hours, the edges are exact", () => {
  const chicago = demo("America/Chicago");
  // Monday 2026-11-16, CST. Open 8:00 to 17:00.
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T13:59:00Z")), keys("d0-before", "yes")); // 7:59, before opening
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T14:00:00Z")), keys("d0-before", "no")); // 8:00
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T22:59:00Z")), keys("d0-before", "no")); // 16:59
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T23:00:00Z")), keys("d0-after", "yes")); // 17:00, closed
  assert.deepEqual(clockKeys(chicago, at("2026-11-17T05:30:00Z")), keys("d0-after", "yes")); // 23:30 Monday
  // Saturday 2026-11-21, open 9:00 to 13:00.
  assert.deepEqual(clockKeys(chicago, at("2026-11-21T17:00:00Z")), keys("d5-before", "no")); // 11:00
  assert.deepEqual(clockKeys(chicago, at("2026-11-21T19:00:00Z")), keys("d5-after", "yes")); // 13:00
});

test("a closed day and an unknown day are after hours all day and use after_close", () => {
  const chicago = demo("America/Chicago");
  // Sunday 2026-11-15: spans [] (the listing says closed).
  assert.deepEqual(clockKeys(chicago, at("2026-11-15T18:00:00Z")), keys("d6-after", "yes"));
  // The same table with Wednesday unknown (spans null), and no before_close on it at all.
  const days = weekTable();
  days["2"] = { spans: null, before_close: null, after_close: days["2"].after_close };
  assert.deepEqual(clockKeys(demo("America/Chicago", days), at("2026-11-18T18:00:00Z")), keys("d2-after", "yes"));
});

test("a lunch break: closed between the spans, but before_close until the last span ends", () => {
  const days = weekTable();
  days["0"].spans = [
    [480, 720],
    [780, 1020],
  ];
  const chicago = demo("America/Chicago", days);
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T18:30:00Z")), keys("d0-before", "yes")); // 12:30, at lunch
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T19:00:00Z")), keys("d0-before", "no")); // 13:00
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T23:00:00Z")), keys("d0-after", "yes")); // 17:00
});

test("a 24-hour day is never after hours", () => {
  const days = weekTable();
  days["0"].spans = [[0, 1440]];
  const chicago = demo("America/Chicago", days);
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T06:00:00Z")), keys("d0-before", "no")); // 0:00
  assert.deepEqual(clockKeys(chicago, at("2026-11-17T05:59:00Z")), keys("d0-before", "no")); // 23:59
});

test("an overnight span carries into the next morning", () => {
  const days = weekTable();
  days["4"].spans = [[1080, 1560]]; // Friday 6 PM to 2 AM
  const chicago = demo("America/Chicago", days);
  assert.deepEqual(clockKeys(chicago, at("2026-11-21T05:00:00Z")), keys("d4-before", "no")); // Friday 23:00
  // Saturday 1:00: still open from Friday night; the spoken lines are Saturday's (its own span has not ended).
  assert.deepEqual(clockKeys(chicago, at("2026-11-21T07:00:00Z")), keys("d5-before", "no"));
  // Saturday 2:00: Friday night is over, Saturday has not opened.
  assert.deepEqual(clockKeys(chicago, at("2026-11-21T08:00:00Z")), keys("d5-before", "yes"));
  // Sunday wraps back to Saturday, which does not run overnight.
  assert.deepEqual(clockKeys(chicago, at("2026-11-22T07:00:00Z")), keys("d6-after", "yes"));
  // And Monday 1:00 wraps to Sunday (index 6), closed.
  assert.deepEqual(clockKeys(chicago, at("2026-11-23T07:00:00Z")), keys("d0-before", "yes"));
});

test("daylight saving ends (2026-11-01, Chicago): the repeated hour is read twice, the day does not slip", () => {
  // 1:30 happens twice that Sunday: once in CDT (UTC-5) and again in CST (UTC-6).
  assert.deepEqual(localClock("America/Chicago", at("2026-11-01T06:30:00Z")), {
    weekday: 6,
    minute: 90,
    date: "2026-11-01",
  });
  assert.deepEqual(localClock("America/Chicago", at("2026-11-01T07:30:00Z")), {
    weekday: 6,
    minute: 90,
    date: "2026-11-01",
  });
  assert.equal(localClock("America/Chicago", at("2026-11-01T08:30:00Z")).minute, 150);
  // Saturday evening before it is still CDT; Monday morning after it is CST.
  assert.deepEqual(localClock("America/Chicago", at("2026-10-31T23:00:00Z")), {
    weekday: 5,
    minute: 1080,
    date: "2026-10-31",
  });
  // 8:00 opening on Monday 2026-11-02 is 14:00 UTC now, not 13:00.
  const chicago = demo("America/Chicago");
  assert.equal(clockKeys(chicago, at("2026-11-02T13:30:00Z")).after_hours, "yes"); // 7:30 CST
  assert.equal(clockKeys(chicago, at("2026-11-02T14:00:00Z")).after_hours, "no"); // 8:00 CST
  // The Friday before the change, 8:00 was 13:00 UTC.
  assert.equal(clockKeys(chicago, at("2026-10-30T13:00:00Z")).after_hours, "no"); // 8:00 CDT
  assert.equal(clockKeys(chicago, at("2026-10-30T12:59:00Z")).after_hours, "yes"); // 7:59 CDT
});

test("daylight saving starts (2026-03-08, Chicago): 2 AM does not exist, the clock jumps to 3", () => {
  assert.equal(localClock("America/Chicago", at("2026-03-08T07:59:00Z")).minute, 119); // 1:59 CST
  assert.equal(localClock("America/Chicago", at("2026-03-08T08:00:00Z")).minute, 180); // 3:00 CDT
  const chicago = demo("America/Chicago");
  // Monday 2026-03-09, CDT: closing at 17:00 is 22:00 UTC. In winter it was 23:00.
  assert.equal(clockKeys(chicago, at("2026-03-09T21:59:00Z")).after_hours, "no");
  assert.equal(clockKeys(chicago, at("2026-03-09T22:00:00Z")).after_hours, "yes");
});

test("a timezone with no daylight saving (Phoenix) keeps one offset all year", () => {
  const phoenix = demo("America/Phoenix");
  // 8:00 in Phoenix is 15:00 UTC in July and in December alike (both Mondays).
  assert.equal(clockKeys(phoenix, at("2026-07-06T15:00:00Z")).after_hours, "no");
  assert.equal(clockKeys(phoenix, at("2026-07-06T14:59:00Z")).after_hours, "yes");
  assert.equal(clockKeys(phoenix, at("2026-12-07T15:00:00Z")).after_hours, "no");
  assert.equal(clockKeys(phoenix, at("2026-12-07T14:59:00Z")).after_hours, "yes");
});

test("the day's windows are read first: today is offered while one of them has not ended", () => {
  // The week as the pipeline stores it: both pairs of a day say the next open day, the windows are data.
  const chicago = demo("America/Chicago", pipelineWeekTable());
  const said = (iso) => clockKeys(chicago, at(iso));
  // Monday 2026-11-16, CST (UTC-6). Open 8:00 to 17:00; windows 8 to 11, 11 to 1, 1 to 4.
  assert.deepEqual(said("2026-11-16T13:00:00Z"), { after_hours: "yes", next_open_day: "today", appt_windows: FULL_DAY_WINDOWS }); // 7:00
  assert.deepEqual(said("2026-11-16T16:00:00Z"), { after_hours: "no", next_open_day: "today", appt_windows: FULL_DAY_WINDOWS }); // 10:00
  // 10:59 is still inside the morning window; at 11:00 it has ended and is no longer offered.
  assert.equal(said("2026-11-16T16:59:00Z").appt_windows, FULL_DAY_WINDOWS);
  assert.deepEqual(said("2026-11-16T17:00:00Z"), {
    after_hours: "no",
    next_open_day: "today",
    appt_windows: "midday eleven to one, afternoon one to four",
  });
  assert.deepEqual(said("2026-11-16T21:59:00Z"), { after_hours: "no", next_open_day: "today", appt_windows: "afternoon one to four" }); // 15:59
  // 16:00: still open for an hour, but every window is over, so the offer is the next open day.
  assert.deepEqual(said("2026-11-16T22:00:00Z"), { after_hours: "no", next_open_day: "tomorrow, Tuesday", appt_windows: FULL_DAY_WINDOWS });
  assert.deepEqual(said("2026-11-16T23:00:00Z"), { after_hours: "yes", next_open_day: "tomorrow, Tuesday", appt_windows: FULL_DAY_WINDOWS }); // 17:00
  // Friday afternoon after the last window, and the closed weekend: Monday, never today.
  assert.deepEqual(said("2026-11-20T22:30:00Z"), { after_hours: "no", next_open_day: "Monday", appt_windows: FULL_DAY_WINDOWS });
  assert.deepEqual(said("2026-11-21T18:00:00Z"), { after_hours: "yes", next_open_day: "Monday", appt_windows: FULL_DAY_WINDOWS }); // Saturday noon
  assert.deepEqual(said("2026-11-22T18:00:00Z"), { after_hours: "yes", next_open_day: "tomorrow, Monday", appt_windows: FULL_DAY_WINDOWS }); // Sunday noon
});

test("a lunch break: a window after the break is still today while the business is closed for lunch", () => {
  const days = pipelineWeekTable();
  days["0"].spans = [
    [480, 720],
    [780, 1020],
  ];
  days["0"].windows = [
    [480, 660, "morning eight to eleven"],
    [660, 720, "midday eleven to twelve"],
    [780, 960, "afternoon one to four"],
  ];
  const chicago = demo("America/Chicago", days);
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T18:30:00Z")), {
    after_hours: "yes",
    next_open_day: "today",
    appt_windows: "afternoon one to four",
  }); // 12:30, at lunch
});

test("a page with no windows is read by the stored pairs alone, as before the key existed", () => {
  const chicago = demo("America/Chicago"); // weekTable() carries no windows key at all
  assert.deepEqual(clockKeys(chicago, at("2026-11-16T16:00:00Z")), keys("d0-before", "no"));
  const empty = weekTable();
  for (const day of Object.values(empty)) day.windows = [];
  assert.deepEqual(clockKeys(demo("America/Chicago", empty), at("2026-11-16T16:00:00Z")), keys("d0-before", "no"));
});

test("session variables from a page as the pipeline writes it: today and its windows at a morning press", () => {
  const token = tok("today");
  const raw = voicePage(token);
  raw.demo.days = pipelineWeekTable();
  const page = parseVoicePage(raw, token, at("2026-11-16T16:00:00Z"));
  assert.ok(page);
  assert.deepEqual(page.demo.days[0].windows, [
    [480, 660, "morning eight to eleven"],
    [660, 780, "midday eleven to one"],
    [780, 960, "afternoon one to four"],
  ]);
  const vars = sessionVariables(page, at("2026-11-16T18:00:00Z")); // Monday 12:00
  assert.equal(vars.after_hours, "no");
  assert.equal(vars.next_open_day, "today");
  assert.equal(vars.appt_windows, "midday eleven to one, afternoon one to four");
  assert.ok(Object.keys(vars).length <= 50);
});

test("session variables: the stored ones plus the three clock keys, clock keys win", () => {
  const token = tok("vars");
  const now = at("2026-11-16T16:00:00Z");
  // A stale clock key left in page.json is dropped by the reader; the click's own value is what is sent.
  const raw = voicePage(token);
  raw.demo.vars.after_hours = "stale";
  const page = parseVoicePage(raw, token, now);
  assert.ok(page);
  const vars = sessionVariables(page, now);
  assert.equal(vars.after_hours, "no");
  assert.equal(vars.next_open_day, "next-d0-before");
  assert.equal(vars.appt_windows, "windows-d0-before");
  assert.equal(vars.lead_token, token);
  assert.equal(vars.demo_mode, "yes");
  assert.ok(Object.keys(vars).length <= 50);
  assert.ok(Object.values(vars).every((v) => typeof v === "string"));
});

test("expiry: a date-only value is good through the end of that Central day", () => {
  assert.equal(voiceExpired("2026-11-15", at("2026-11-15T12:00:00Z")), false);
  assert.equal(voiceExpired("2026-11-15", at("2026-11-16T05:59:00Z")), false); // 23:59 Central on the 15th
  assert.equal(voiceExpired("2026-11-15", at("2026-11-16T06:00:00Z")), true); // midnight Central
  assert.equal(voiceExpired("2026-11-14", at("2026-11-15T12:00:00Z")), true);
  // A full timestamp is that instant.
  assert.equal(voiceExpired("2026-11-15T12:00:00Z", at("2026-11-15T11:59:59Z")), false);
  assert.equal(voiceExpired("2026-11-15T12:00:00Z", at("2026-11-15T12:00:01Z")), true);
  // Unreadable is null, which the reader treats as a bad page.
  for (const bad of ["", "soon", "2026-02-30", "2026-13-01", null, undefined, 20261115, {}]) {
    assert.equal(voiceExpired(bad, at("2026-11-15T12:00:00Z")), null, String(bad));
  }
});
