/**
 * The voice page reader: what page.json of kind "voice" must look like
 * (contract section 5), and that an audit page is never taken for one.
 * Run with: npm test
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_STATIC_VARS, checkVoicePage, pageKind, parseVoicePage, validTimeZone } from "../src/lib/voice-page.ts";
import { auditPage, tok, voicePage } from "./fixtures.mjs";

const NOW = new Date("2026-11-16T16:00:00Z");
const TOKEN = tok("page");

/** A good page with one change made to it. */
function changed(change) {
  const raw = voicePage(TOKEN);
  change(raw);
  return parseVoicePage(raw, TOKEN, NOW);
}

test("a good voice page is read whole", () => {
  const page = parseVoicePage(voicePage(TOKEN), TOKEN, NOW);
  assert.ok(page);
  assert.equal(page.kind, "voice");
  assert.equal(page.token, TOKEN);
  assert.equal(page.business, "Maple Creek Family Dental");
  assert.equal(page.city, "Katy");
  assert.equal(page.state, "TX");
  assert.equal(page.trade, "dental");
  assert.equal(page.persona, "Blake");
  assert.equal(page.sample, false);
  assert.equal(page.expires_at, "2999-12-30");
  assert.equal(page.demo.tz, "America/Chicago");
  assert.equal(page.demo.days.length, 7);
  assert.deepEqual(page.demo.days[0].spans, [[480, 1020]]);
  assert.deepEqual(page.demo.days[6].spans, []);
  assert.equal(page.demo.vars.business_name, page.business);
  assert.equal(page.demo.vars.lead_token, TOKEN);
  // It needs no keyword and no pins, and it carries none.
  assert.equal("keyword" in page, false);
  assert.equal("pins" in page, false);
});

test("the three trades are accepted, and only those", () => {
  for (const trade of ["dental", "hvac", "plumbing"]) {
    assert.equal(changed((r) => (r.trade = trade))?.trade, trade);
  }
  for (const trade of ["electrical", "roofing", "Dental", "", null, undefined, 7]) {
    assert.equal(
      changed((r) => (r.trade = trade)),
      null,
      String(trade),
    );
  }
});

test("optional fields: absent is fine, the wrong type is not", () => {
  const bare = changed((r) => {
    delete r.city;
    delete r.state;
    delete r.persona;
    delete r.sample;
  });
  assert.ok(bare);
  assert.deepEqual([bare.city, bare.state, bare.persona, bare.sample], ["", "", "", false]);
  assert.equal(changed((r) => (r.sample = true))?.sample, true);
  // The pipeline's voice_pages table holds sample as 0 or 1, and a column read straight through may be null.
  assert.equal(changed((r) => (r.sample = 1))?.sample, true);
  assert.equal(changed((r) => (r.sample = 0))?.sample, false);
  assert.equal(changed((r) => (r.sample = null))?.sample, false);
  for (const odd of ["yes", "1", "true", 2, -1, 0.5, [], {}]) {
    assert.equal(
      changed((r) => (r.sample = odd)),
      null,
      `sample ${JSON.stringify(odd)}`,
    );
  }
  assert.equal(
    changed((r) => (r.city = 77)),
    null,
  );
  assert.equal(
    changed((r) => (r.persona = ["Blake"])),
    null,
  );
});

test("a day table given as a list of seven is read the same as the keyed object", () => {
  const page = changed((r) => (r.demo.days = Object.values(r.demo.days)));
  assert.ok(page);
  assert.deepEqual(page.demo.days[5].spans, [[540, 780]]);
});

test("before_close is needed only on a day that has spans", () => {
  assert.ok(changed((r) => delete r.demo.days["6"].before_close)); // Sunday is closed
  assert.ok(changed((r) => (r.demo.days["6"] = { spans: null, after_close: r.demo.days["6"].after_close })));
  assert.equal(
    changed((r) => delete r.demo.days["0"].before_close),
    null,
  ); // Monday is open
});

test("bad pages are refused, one fault at a time", () => {
  const faults = {
    "not an object": () => parseVoicePage("voice", TOKEN, NOW),
    "a list": () => parseVoicePage([voicePage(TOKEN)], TOKEN, NOW),
    "null": () => parseVoicePage(null, TOKEN, NOW),
    "version 2": () => changed((r) => (r.v = 2)),
    "no version": () => changed((r) => delete r.v),
    "another kind": () => changed((r) => (r.kind = "audit")),
    "no kind": () => changed((r) => delete r.kind),
    "another page's token": () => changed((r) => (r.token = tok("other"))),
    "asked for by another token": () => parseVoicePage(voicePage(TOKEN), tok("other"), NOW),
    "no business": () => changed((r) => delete r.business),
    "blank business": () => changed((r) => (r.business = "   ")),
    "a business name 201 characters long": () =>
      changed((r) => {
        r.business = "A".repeat(201);
        r.demo.vars.business_name = r.business;
      }),
    "the page and the call say different names": () => changed((r) => (r.demo.vars.business_name = "Maple Creek Dental")),
    "no business_name variable": () => changed((r) => delete r.demo.vars.business_name),
    "lead_token is another token": () => changed((r) => (r.demo.vars.lead_token = tok("other"))),
    "no lead_token": () => changed((r) => delete r.demo.vars.lead_token),
    "demo_mode is no": () => changed((r) => (r.demo.vars.demo_mode = "no")),
    "no demo_mode": () => changed((r) => delete r.demo.vars.demo_mode),
    "no expires_at": () => changed((r) => delete r.expires_at),
    "expires_at is not a date": () => changed((r) => (r.expires_at = "next month")),
    "expired yesterday (date only)": () => changed((r) => (r.expires_at = "2026-11-15")),
    "expired a minute ago (timestamp)": () => changed((r) => (r.expires_at = "2026-11-16T15:59:00Z")),
    "no demo": () => changed((r) => delete r.demo),
    "demo is a list": () => changed((r) => (r.demo = [])),
    "no vars": () => changed((r) => delete r.demo.vars),
    "a variable that is a number": () => changed((r) => (r.demo.vars.city = 7)),
    "a variable that is an object": () => changed((r) => (r.demo.vars.faq_text = { q: "a" })),
    "a variable that is null": () => changed((r) => (r.demo.vars.website = null)),
    "a variable name with a space": () => changed((r) => (r.demo.vars["bad key"] = "x")),
    "a variable over 1000 characters": () => changed((r) => (r.demo.vars.faq_text = "x".repeat(1001))),
    "more variables than the session takes": () =>
      changed((r) => {
        for (let i = 0; i < MAX_STATIC_VARS; i++) r.demo.vars[`extra_${i}`] = "x";
      }),
    "no timezone": () => changed((r) => delete r.demo.tz),
    "an unknown timezone": () => changed((r) => (r.demo.tz = "America/Katy")),
    "a timezone that is an offset string": () => changed((r) => (r.demo.tz = "GMT minus six")),
    "no days": () => changed((r) => delete r.demo.days),
    "six days": () => changed((r) => delete r.demo.days["6"]),
    "eight days": () => changed((r) => (r.demo.days["7"] = r.demo.days["0"])),
    "a day named monday": () =>
      changed((r) => {
        r.demo.days.monday = r.demo.days["0"];
        delete r.demo.days["0"];
      }),
    "a day that is null": () => changed((r) => (r.demo.days["3"] = null)),
    "spans missing": () => changed((r) => delete r.demo.days["3"].spans),
    "spans is a string": () => changed((r) => (r.demo.days["3"].spans = "8AM-5PM")),
    "a span of three numbers": () => changed((r) => (r.demo.days["3"].spans = [[480, 720, 1020]])),
    "a span that ends before it starts": () => changed((r) => (r.demo.days["3"].spans = [[1020, 480]])),
    "a span of no length": () => changed((r) => (r.demo.days["3"].spans = [[480, 480]])),
    "a span with half a minute": () => changed((r) => (r.demo.days["3"].spans = [[480.5, 1020]])),
    "a span in text": () => changed((r) => (r.demo.days["3"].spans = [["480", "1020"]])),
    "a span that starts tomorrow": () => changed((r) => (r.demo.days["3"].spans = [[1440, 1500]])),
    "a span that starts before midnight": () => changed((r) => (r.demo.days["3"].spans = [[-60, 600]])),
    "a span longer than two days": () => changed((r) => (r.demo.days["3"].spans = [[0, 2881]])),
    "seven spans in a day": () => changed((r) => (r.demo.days["3"].spans = Array.from({ length: 7 }, (_, i) => [i * 60, i * 60 + 30]))),
    "no after_close": () => changed((r) => delete r.demo.days["3"].after_close),
    "after_close without appt_windows": () => changed((r) => delete r.demo.days["3"].after_close.appt_windows),
    "after_close with a blank next_open_day": () => changed((r) => (r.demo.days["3"].after_close.next_open_day = " ")),
    "before_close that is a string": () => changed((r) => (r.demo.days["3"].before_close = "tomorrow")),
  };
  for (const [name, make] of Object.entries(faults)) {
    assert.equal(make(), null, name);
  }
});

test("a refused page says what is wrong with it, for the pipeline's own check", () => {
  const fault = (change) => {
    const raw = voicePage(TOKEN);
    change(raw);
    const checked = checkVoicePage(raw, TOKEN, NOW);
    return checked.ok ? null : checked.fault;
  };
  assert.equal(fault(() => {}), null);
  assert.equal(checkVoicePage(voicePage(TOKEN), TOKEN, NOW).page.business, "Maple Creek Family Dental");
  assert.equal(fault((r) => (r.kind = "audit")), 'kind must be "voice"');
  assert.equal(fault((r) => (r.v = 2)), "v must be 1");
  assert.equal(fault((r) => (r.token = tok("other"))), "token is not the token of the page's own path");
  assert.equal(fault((r) => delete r.expires_at), "expires_at is missing or is not a date (YYYY-MM-DD or a full timestamp)");
  assert.equal(fault((r) => (r.expires_at = "2026-11-15")), "the page has expired (expires_at is in the past)");
  assert.equal(fault((r) => (r.trade = "roofing")), "trade must be one of dental, hvac, plumbing");
  assert.equal(fault((r) => (r.city = 7)), "city must be a string when present");
  assert.equal(
    fault((r) => (r.demo.vars.business_name = "Maple Creek Dental")),
    "demo.vars.business_name must be the same string as business",
  );
  assert.equal(fault((r) => (r.demo.vars.lead_token = "x")), "demo.vars.lead_token must be the page token");
  assert.equal(fault((r) => (r.demo.vars.demo_mode = "no")), 'demo.vars.demo_mode must be "yes"');
  assert.equal(fault((r) => (r.demo.vars.city = 7)), "demo.vars.city must be a string");
  assert.equal(fault((r) => (r.demo.tz = "Central")), "demo.tz is missing or is not a timezone name this server knows");
  assert.equal(fault((r) => delete r.demo.days["6"]), "demo.days must have exactly the seven keys 0 to 6 (0 is Monday)");
  assert.equal(fault((r) => delete r.demo.days["2"].spans), "demo.days.2.spans is missing ([] for closed, null for unknown)");
  assert.equal(
    fault((r) => (r.demo.days["2"].spans = [[1020, 480]])),
    "demo.days.2.spans: a span must end after it starts and by minute 2880",
  );
  assert.equal(fault((r) => delete r.demo.days["0"].before_close), "demo.days.0.before_close is missing on a day that has spans");
  assert.equal(fault((r) => delete r.demo.days["4"].after_close.appt_windows), "demo.days.4.after_close.appt_windows is missing or blank");
  // Only the first fault is named, and nothing a visitor typed can be in it.
  assert.equal(checkVoicePage(null, TOKEN, NOW).fault, "page.json is not an object");
});

test("stored clock keys are dropped, not trusted, and do not count against the limit", () => {
  const page = changed((r) => {
    r.demo.vars.after_hours = "no";
    r.demo.vars.next_open_day = "stale";
    r.demo.vars.appt_windows = "stale";
  });
  assert.ok(page);
  for (const key of ["after_hours", "next_open_day", "appt_windows"]) assert.equal(key in page.demo.vars, false, key);
});

test("exactly as many variables as the session leaves room for is still a page", () => {
  const page = changed((r) => {
    const have = Object.keys(r.demo.vars).length;
    for (let i = 0; i < MAX_STATIC_VARS - have; i++) r.demo.vars[`extra_${i}`] = "x";
  });
  assert.ok(page);
  assert.equal(Object.keys(page.demo.vars).length, MAX_STATIC_VARS);
});

test("an overnight span and a 24-hour day are valid spans", () => {
  assert.deepEqual(changed((r) => (r.demo.days["4"].spans = [[1080, 1560]]))?.demo.days[4].spans, [[1080, 1560]]);
  assert.deepEqual(changed((r) => (r.demo.days["4"].spans = [[0, 1440]]))?.demo.days[4].spans, [[0, 1440]]);
});

test("an existing audit page is not a voice page, and is told apart by kind alone", () => {
  const audit = auditPage(tok("audit"));
  assert.equal(pageKind(audit), "audit");
  assert.equal(parseVoicePage(audit, tok("audit"), NOW), null);
  assert.equal(pageKind(voicePage(TOKEN)), "voice");
  // Anything that is not exactly kind "voice" stays on the audit path.
  for (const raw of [{ kind: "Voice" }, { kind: "audit" }, { kind: 1 }, {}, null, "voice", ["voice"]]) {
    assert.equal(pageKind(raw), "audit", JSON.stringify(raw));
  }
});

test("timezone names", () => {
  for (const tz of ["America/Chicago", "America/New_York", "America/Phoenix", "Pacific/Honolulu", "UTC"]) {
    assert.equal(validTimeZone(tz), true, tz);
  }
  for (const tz of ["", " ", "Central", "America/Katy", null, undefined, 6, "x".repeat(65)]) {
    assert.equal(validTimeZone(tz), false, String(tz));
  }
});
