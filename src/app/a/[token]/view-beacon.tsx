"use client";

import { useEffect } from "react";

/**
 * One POST /api/audit-view per browser session, sent once the page is
 * actually visible (not while prerendered or opened in a background tab).
 * Renders nothing.
 *
 * The opt-out page (/u/<token>, 2026-11-16) reports its own visits the same
 * way to its own route: `endpoint` and `storageKey` say where, and both
 * default to exactly what the audit and voice pages have always used.
 */
export default function ViewBeacon({
  token,
  endpoint = "/api/audit-view",
  storageKey = "devize_view_",
}: {
  token: string;
  endpoint?: string;
  storageKey?: string;
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
      const body = JSON.stringify({ token });
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
  }, [token, endpoint, storageKey]);

  return null;
}
