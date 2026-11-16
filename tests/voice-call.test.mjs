/**
 * The voice demo block's small call helpers (src/app/a/[token]/voice-call.ts):
 * the wait for the assistant to join, and a timeout signal that also works
 * where AbortSignal.timeout does not exist. Run with: npm test
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { FIRST_STATE, JOIN_TIMEOUT_MS, agentJoined, joinWatch, timeoutSignal } from "../src/app/a/[token]/voice-call.ts";
import { VOICE_ERRORS, VOICE_FINAL_ERRORS, voiceCopy, voiceErrorFor } from "../src/app/a/[token]/voice-copy.ts";

test("the all-pages daily cap has its own sentence, and it says tomorrow, not a few minutes", () => {
  // Before the fix the cap answered "busy": "try again in a few minutes", which is untrue until midnight Central.
  assert.equal(voiceErrorFor(429, "day_full"), "day_full");
  assert.match(VOICE_ERRORS.day_full, /tomorrow/i);
  assert.equal(/minutes/i.test(VOICE_ERRORS.day_full), false);
  assert.notEqual(VOICE_ERRORS.day_full, VOICE_ERRORS.busy);
  // A vendor that is busy for a moment still says minutes, and a 429 the page has no code for is read as that.
  assert.match(VOICE_ERRORS.busy, /few minutes/i);
  assert.equal(voiceErrorFor(429, undefined), "busy");
  assert.equal(voiceErrorFor(429, "something new"), "busy");
  // The button stays for it: tomorrow the same press works.
  assert.equal(VOICE_FINAL_ERRORS.includes("day_full"), false);
});

test("every sentence on the page: no vendor name, no long dash", () => {
  const words = [...Object.values(VOICE_ERRORS), ...Object.values(voiceCopy.states)];
  for (const [key, value] of Object.entries(voiceCopy)) if (typeof value === "string") words.push(`${key}: ${value}`);
  // The two long dashes, by code point, so this file holds neither.
  const longDash = new RegExp(`[${String.fromCharCode(8211, 8212)}]`);
  for (const sentence of words) {
    assert.equal(/autocalls|livekit|voice-session/i.test(sentence), false, sentence);
    assert.equal(longDash.test(sentence), false, sentence);
  }
  assert.equal(longDash.test(`a ${String.fromCharCode(8212)} b`), true, "the check itself works");
  // A call that did not connect has still used one of the page's calls, so the sentence points at the usual cause.
  assert.match(VOICE_ERRORS.failed, /did not connect/);
  assert.match(VOICE_ERRORS.failed, /mobile data/);
});

test("the page shows Connecting from the start: the SDK never announces its first state", () => {
  // @voice-session/web 0.3.0 starts out in "connecting" and only emits agent_state on a change, so the first
  // event a page ever gets is the assistant joining. The block sets this state itself when the SDK is started.
  assert.equal(FIRST_STATE, "connecting");
  assert.equal(agentJoined(FIRST_STATE), false);
});

test("which states mean the assistant is on the call", () => {
  for (const state of ["listening", "thinking", "speaking"]) assert.equal(agentJoined(state), true, state);
  for (const state of ["connecting", "ended", "starting", "idle", "", "initializing"]) assert.equal(agentJoined(state), false, state);
});

test("no assistant within the wait: the page is told once, at the wait and not before", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let late = 0;
  joinWatch(JOIN_TIMEOUT_MS, () => (late += 1));
  t.mock.timers.tick(JOIN_TIMEOUT_MS - 1);
  assert.equal(late, 0, "not before the wait is over");
  t.mock.timers.tick(1);
  assert.equal(late, 1);
  t.mock.timers.tick(10 * JOIN_TIMEOUT_MS);
  assert.equal(late, 1, "once only");
  assert.equal(JOIN_TIMEOUT_MS, 30_000);
  assert.ok(JOIN_TIMEOUT_MS < 8 * 60 * 1000, "far short of the eight minute stop that used to be the only one");
});

test("the assistant joins in time, or the call ends some other way: nothing is said", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let late = 0;
  const joinedInTime = joinWatch(JOIN_TIMEOUT_MS, () => (late += 1));
  t.mock.timers.tick(12_000);
  joinedInTime.joined();
  const ended = joinWatch(JOIN_TIMEOUT_MS, () => (late += 1));
  t.mock.timers.tick(5_000);
  ended.cancel();
  t.mock.timers.tick(10 * JOIN_TIMEOUT_MS);
  assert.equal(late, 0);
  // Calling either again, or after the wait has run out, is harmless.
  joinedInTime.joined();
  ended.cancel();
  const lateOne = joinWatch(1_000, () => (late += 1));
  t.mock.timers.tick(1_000);
  lateOne.joined();
  lateOne.cancel();
  assert.equal(late, 1);
});

test("a timeout signal aborts after the wait, with or without AbortSignal.timeout", async (t) => {
  // With it (every current browser, and node).
  assert.equal(typeof AbortSignal.timeout, "function");
  const modern = timeoutSignal(20);
  assert.equal(modern.aborted, false);
  await new Promise((resolve) => modern.addEventListener("abort", resolve, { once: true }));
  assert.equal(modern.aborted, true);

  // Without it (Safari before 16): before the fix the press threw "AbortSignal.timeout is not a function" and the
  // page said the demo was not available, on every press.
  const real = AbortSignal.timeout;
  t.after(() => (AbortSignal.timeout = real));
  AbortSignal.timeout = undefined;
  assert.throws(() => AbortSignal.timeout(20), TypeError, "what the old code ran into");
  const old = timeoutSignal(20);
  assert.ok(old instanceof AbortSignal);
  assert.equal(old.aborted, false);
  await new Promise((resolve) => old.addEventListener("abort", resolve, { once: true }));
  assert.equal(old.aborted, true);
  // And it does what a fetch needs of it: a request still waiting is given up.
  const waiting = new Promise((_, reject) => {
    const signal = timeoutSignal(20);
    signal.addEventListener("abort", () => reject(new Error("given up")), { once: true });
  });
  await assert.rejects(waiting, /given up/);
});
