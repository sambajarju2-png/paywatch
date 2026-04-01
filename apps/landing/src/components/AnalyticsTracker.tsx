"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* ── Persistent visitor ID (survives sessions) ── */
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "pw_vid";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/* ── Session ID (per browser session) ── */
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("pw_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("pw_sid", id);
  }
  return id;
}

/* ── Detect browser from UA ── */
function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome")) return "Safari";
  return "Other";
}

/* ── Extract UTM params ── */
function getUTM(sp: URLSearchParams) {
  return {
    utm_source: sp.get("utm_source") || undefined,
    utm_medium: sp.get("utm_medium") || undefined,
    utm_campaign: sp.get("utm_campaign") || undefined,
  };
}

/* ── Fire-and-forget beacon ── */
function send(payload: Record<string, unknown>) {
  const data = JSON.stringify(payload);
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
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollSent = useRef(false);
  const pageStart = useRef(Date.now());

  /* ── Page view ── */
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const session_id = getSessionId();
    const visitor_id = getVisitorId();
    if (!session_id) return;

    const utm = getUTM(searchParams);

    send({
      event_type: "pageview",
      session_id,
      visitor_id,
      path: pathname,
      referrer: document.referrer || null,
      browser: getBrowser(),
      ...utm,
    });

    // Reset scroll tracking per page
    scrollSent.current = false;
    pageStart.current = Date.now();
  }, [pathname, searchParams]);

  /* ── Scroll depth tracking (fires once per page at max depth) ── */
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    let maxDepth = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const depth = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      if (depth > maxDepth) maxDepth = depth;
    };

    const sendScroll = () => {
      if (maxDepth > 10 && !scrollSent.current) {
        scrollSent.current = true;
        send({
          event_type: "scroll",
          session_id: getSessionId(),
          visitor_id: getVisitorId(),
          path: pathname,
          scroll_depth: maxDepth,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Send on page leave
    const handleBeforeUnload = () => {
      sendScroll();
      // Also send duration
      const dur = Date.now() - pageStart.current;
      if (dur > 1000) {
        send({
          event_type: "duration",
          session_id: getSessionId(),
          visitor_id: getVisitorId(),
          path: pathname,
          duration_ms: dur,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        sendScroll();
      }
    });

    return () => {
      sendScroll();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  /* ── CTA click tracking (delegated) ── */
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (process.env.NODE_ENV !== "production") return;
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const trackAttr = target.getAttribute("data-track");
      if (!trackAttr) {
        // Auto-track external links and CTA buttons
        const href = target.getAttribute("href");
        const isExternal = href && !href.startsWith("/") && !href.startsWith("#");
        const isCta =
          target.textContent?.match(
            /start gratis|aanmelden|sign up|bekijk functies|inloggen/i
          ) ||
          href === "https://app.paywatch.app";

        if (!isExternal && !isCta) return;

        send({
          event_type: "event",
          session_id: getSessionId(),
          visitor_id: getVisitorId(),
          path: pathname,
          event_name: isExternal
            ? `outbound:${href}`
            : `cta:${target.textContent?.trim().slice(0, 40)}`,
        });
      } else {
        // Explicit data-track="event_name"
        send({
          event_type: "event",
          session_id: getSessionId(),
          visitor_id: getVisitorId(),
          path: pathname,
          event_name: trackAttr,
        });
      }
    },
    [pathname]
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClick]);

  return null;
}
