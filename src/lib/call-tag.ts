import "server-only";

import { createHmac } from "node:crypto";

/**
 * The secret part of a finished call's file name:
 *
 *   calls/<iso>-<call id>-<tag>.json
 *
 * What it is for: the Blob store is public by path, and a call's file holds
 * what the caller left for a consult (a mobile number, a name, a note) and
 * the page's lead_token. The vendor's call ids look sequential and <iso> is
 * only to the second, so a name made of those two alone could be walked by
 * anyone who knows the store's host (it is printed in every audit page's map
 * image address). The site's rule since 2026-11-03 (blob-store.ts, eventPath)
 * is 128 unguessable bits in the name of any file that holds a mobile.
 *
 * Unlike a submission, a call must land on the same name when the vendor
 * sends it again, because that is how a repeat is recognised. So the part is
 * not random: it is the first 32 hex characters (128 bits) of
 * HMAC-SHA256(key = AUTOCALLS_WEBHOOK_SECRET, message = the call id). The
 * same call always gives the same name; nobody without the secret can work
 * the name out; and neighbouring call ids share nothing.
 *
 * The pipeline never needs to compute it: it lists calls/ with the store's
 * own credentials and reads the call id from each file's body. If it ever
 * wants to, the rule in Python is
 *   hmac.new(secret.encode(), call_id.encode(), hashlib.sha256).hexdigest()[:32]
 *
 * Changing AUTOCALLS_WEBHOOK_SECRET changes every later name, so a call
 * resent after a change is stored a second time under a new name. That is
 * harmless: the pipeline claims each call once by the id in the body.
 *
 * Decided 2026-11-15 by the overnight review (the contract's first name,
 * calls/<iso>-<call id>.json, had no secret part).
 */
export function callTag(secret: string, callId: string): string {
  if (typeof secret !== "string" || !secret.trim()) throw new Error("call-tag: no webhook secret to make a tag from");
  if (typeof callId !== "string" || !callId) throw new Error("call-tag: no call id to make a tag for");
  return createHmac("sha256", secret).update(callId).digest("hex").slice(0, 32);
}
