"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("pw_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("pw_sid", id);
  }
  return id;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track in dev
    if (process.env.NODE_ENV !== "production") return;

    const session_id = getSessionId();
    if (!session_id) return;

    const data = JSON.stringify({
      session_id,
      path: pathname,
      referrer: document.referrer || null,
    });

    // Non-blocking: use sendBeacon, fall back to fetch
    const sent = navigator.sendBeacon?.(
      "/api/analytics/track",
      new Blob([data], { type: "application/json" })
    );

    if (!sent) {
      fetch("/api/analytics/track", {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
