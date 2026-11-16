"use client";

import { useEffect } from "react";
import { VIEW_ENDPOINT, VIEW_FIELD, VIEW_KEY, viewBeaconBody } from "./view-beacon-target";

/**
 * One POST /api/audit-view per browser session, sent once the page is
 * actually visible (not while prerendered or opened in a background tab).
 * Renders nothing.
 *
 * The opt-out page (/u/<t>, 2026-11-16) reports its own visits the same way
 * to its own route: `endpoint`, `storageKey` and `field` say where, under
 * which session key and under which body key, and all three default to
 * exactly what the audit and voice pages have always used
 * (view-beacon-target.ts, which the node tests pin). On /u/ `token` holds the
 * opt-out token t, sent as {t} (contract 8.6); everywhere else it is the page
 * token, sent as {token}.
 */
export default function ViewBeacon({
  token,
  endpoint = VIEW_ENDPOINT,
  storageKey = VIEW_KEY,
  field = VIEW_FIELD,
}: {
  token: string;
  endpoint?: string;
  storageKey?: string;
  field?: string;
}) {
  useEffect(() => {
    const key = `${storageKey}${token}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // Storage blocked: fall through and send; the server rate-limits repeats.
    }

    const send = () => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
      const body = viewBeaconBody(token, field);
      const sent =
        typeof navigator.sendBeacon === "function" &&
        navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      if (!sent) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    };

    if (document.visibilityState === "visible") {
      send();
      return;
    }
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisible);
      send();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [token, endpoint, storageKey, field]);

  return null;
}
