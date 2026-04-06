"use client";

import { useEffect, useRef, useCallback } from "react";

interface EngagementConfig {
  audience: string;
  companyDomain?: string;
  companyName?: string;
}

/* ── Generate or retrieve a session ID ── */
function getSessionId(audience: string): string {
  const key = `pw_session_${audience}`;
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${audience}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

/* ── Get visit count from localStorage ── */
function getVisitCount(audience: string): number {
  const key = `pw_visits_${audience}`;
  if (typeof window === "undefined") return 1;
  const count = parseInt(localStorage.getItem(key) || "0", 10) + 1;
  localStorage.setItem(key, String(count));
  return count;
}

/* ── Track if user has submitted form ── */
export function markFormSubmitted(audience: string, firstName: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`pw_submitted_${audience}`, "true");
  localStorage.setItem(`pw_visitor_name_${audience}`, firstName);
}

export function hasSubmittedForm(audience: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`pw_submitted_${audience}`) === "true";
}

export function getVisitorName(audience: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`pw_visitor_name_${audience}`);
}

export function getVisitCountValue(audience: string): number {
  if (typeof window === "undefined") return 1;
  return parseInt(localStorage.getItem(`pw_visits_${audience}`) || "1", 10);
}

export function useEngagement(config: EngagementConfig) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const clickedCta = useRef(false);
  const sentRef = useRef(false);

  const sessionId = typeof window !== "undefined" ? getSessionId(config.audience) : "ssr";
  const visitCount = typeof window !== "undefined" ? getVisitCount(config.audience) : 1;

  const sendEngagement = useCallback(() => {
    if (sentRef.current) return;
    // Don't send if company data hasn't loaded yet
    if (!config.companyDomain) return;
    sentRef.current = true;

    const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
    if (timeOnPage < 2) return; // Skip very short visits
    const submitted = hasSubmittedForm(config.audience);

    // Use sendBeacon for reliability on page unload
    const payload = JSON.stringify({
      sessionId,
      companyDomain: config.companyDomain,
      companyName: config.companyName,
      audience: config.audience,
      timeOnPage,
      maxScrollDepth: maxScroll.current,
      clickedCta: clickedCta.current,
      submittedForm: submitted,
      visitCount,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track-engagement", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track-engagement", { method: "POST", body: payload, keepalive: true });
    }
  }, [sessionId, visitCount, config.audience, config.companyDomain, config.companyName]);

  useEffect(() => {
    // Track scroll depth
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const depth = Math.round((scrollTop / docHeight) * 100);
        if (depth > maxScroll.current) {
          maxScroll.current = depth;
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Send on page unload
    function handleUnload() {
      sendEngagement();
    }

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") sendEngagement();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleUnload);
      sendEngagement(); // Send on unmount too
    };
  }, [sendEngagement]);

  return {
    trackCtaClick: () => { clickedCta.current = true; },
    visitCount,
  };
}
