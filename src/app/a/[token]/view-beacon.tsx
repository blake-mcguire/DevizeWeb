"use client";

import { useEffect } from "react";

/**
 * One POST /api/audit-view per browser session, sent once the page is
 * actually visible (not while prerendered or opened in a background tab).
 * Renders nothing.
 */
export default function ViewBeacon({ token }: { token: string }) {
  useEffect(() => {
    const key = `devize_view_${token}`;
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
        navigator.sendBeacon("/api/audit-view", new Blob([body], { type: "application/json" }));
      if (!sent) {
        fetch("/api/audit-view", {
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
  }, [token]);

  return null;
}
