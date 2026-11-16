/**
 * The secret part of a finished call's file name (calls/<iso>-<call id>-<tag>.json).
 * The store is public by path and the file holds a mobile number, so the name
 * must not be guessable from the call id and the time. Run with: npm test
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { callTag } from "../src/lib/call-tag.ts";
import { CALL_TAG } from "../src/lib/demo-caps.ts";

const SECRET = "test-webhook-secret-0123456789";

test("the tag is the first 32 hex of HMAC-SHA256(webhook secret, call id)", () => {
  // Known answers, so the pipeline side can check its own reading of the rule:
  //   python3: hmac.new(secret.encode(), call_id.encode(), hashlib.sha256).hexdigest()[:32]
  assert.equal(callTag(SECRET, "48211"), "1d0f361a7b43f3f05a60316dc80d4701");
  assert.equal(callTag(SECRET, "500"), "bacac91e3f0c530c0afbb2b96f21a719");
  assert.equal(callTag("e2e-webhook-secret-0123456789", "48211"), "fb13fe9fa369b000bea8fd1383aada3c");
});

test("the same call always gets the same tag, so a repeat lands on the same name", () => {
  assert.equal(callTag(SECRET, "48211"), callTag(SECRET, "48211"));
  assert.equal(CALL_TAG.test(callTag(SECRET, "48211")), true);
});

test("the tag changes with the call id and with the secret, and neighbours share nothing", () => {
  const tags = new Set();
  for (let id = 48200; id < 48300; id++) tags.add(callTag(SECRET, String(id)));
  assert.equal(tags.size, 100);
  assert.notEqual(callTag(SECRET, "48211"), callTag(`${SECRET}x`, "48211"));
  // No tag can be made without a secret: the route never gets this far without one, and the function refuses too.
  for (const bad of ["", "   ", undefined, null]) assert.throws(() => callTag(bad, "48211"), /secret/);
  for (const bad of ["", undefined, null, 48211]) assert.throws(() => callTag(SECRET, bad), /call id/);
});
