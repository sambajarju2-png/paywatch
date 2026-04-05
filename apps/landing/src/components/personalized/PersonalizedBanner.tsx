"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface PersonalizeData {
  companyName: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  allColors: string[];
  greeting: string;
  tagline: string;
  logo: string;
  audience: string;
}

interface Props {
  company: string | null;
  audience: "gemeente" | "incasso" | "hulporg" | "zakelijk";
  fallbackTitle: string;
  fallbackSubtitle: string;
  children?: React.ReactNode;
  onDataLoaded?: (data: PersonalizeData) => void;
}

function storageKey(audience: string) {
  return `pw_personalize_${audience}`;
}

export default function PersonalizedBanner({
  company: companyFromUrl,
  audience,
  fallbackTitle,
  fallbackSubtitle,
  children,
  onDataLoaded,
}: Props) {
  const [data, setData] = useState<PersonalizeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const handleDataLoaded = useCallback(
    (d: PersonalizeData) => { onDataLoaded?.(d); },
    [onDataLoaded]
  );

  useEffect(() => {
    async function load() {
      let company = companyFromUrl;

      // Check localStorage for cached company
      const cached = typeof window !== "undefined" ? localStorage.getItem(storageKey(audience)) : null;
      if (!company && cached) {
        try {
          const parsed = JSON.parse(cached) as PersonalizeData;
          setData(parsed);
          handleDataLoaded(parsed);
          setLoading(false);
          setTimeout(() => setFadeIn(true), 50);
          return;
        } catch { /* ignore */ }
      }

      if (!company) {
        setLoading(false);
        setTimeout(() => setFadeIn(true), 50);
        return;
      }

      // Fetch personalization
      try {
        const res = await fetch("/api/personalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company, audience }),
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
          handleDataLoaded(result);
          if (typeof window !== "undefined") {
            localStorage.setItem(storageKey(audience), JSON.stringify(result));
          }
        }
      } catch { /* fallback */ }
      setLoading(false);
      setTimeout(() => setFadeIn(true), 100);
    }
    load();
  }, [companyFromUrl, audience, handleDataLoaded]);

  const accent = data?.primaryColor || "#2563EB";

  // ── Loading screen ──
  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#0A2540]" style={{ minHeight: 380 }}>
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: 380 }}>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <p className="text-base font-semibold text-white/90">We houden het graag persoonlijk</p>
          <p className="mt-1 text-sm text-white/40">Even geduld...</p>
          <div className="mt-6 w-32 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-white/30 animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>
    );
  }

  // ── No data: generic fallback ──
  if (!data) {
    return (
      <section className="relative overflow-hidden bg-[#0A2540]" style={{ minHeight: 340 }}>
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 transition-all duration-500"
          style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "none" : "translateY(12px)" }}>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <span className="text-sm font-semibold text-white/70">PayWatch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.1]">{fallbackTitle}</h1>
          <p className="mt-4 text-base text-slate-300 max-w-2xl leading-relaxed">{fallbackSubtitle}</p>
          {children}
        </div>
      </section>
    );
  }

  // ── Personalized: solid navy, accent as thin line only ──
  return (
    <section className="relative overflow-hidden bg-[#0A2540]" style={{ minHeight: 400 }}>
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 transition-all duration-600"
        style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "none" : "translateY(16px)" }}>
        {/* Top row */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <span className="text-sm font-semibold text-white/50">PayWatch</span>
            <span className="text-white/20">×</span>
            <span className="text-sm font-semibold text-white/80">{data.companyName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 rounded-xl px-4 py-2.5 border border-white/10 bg-white/[0.05]">
            <Image src={data.logo} alt={`Logo ${data.companyName}`} width={28} height={28} className="rounded-md" unoptimized />
            <span className="text-xs font-semibold text-white/70">{data.companyName}</span>
          </div>
        </div>

        {/* Mobile logo */}
        <div className="sm:hidden flex items-center gap-3 mb-6 rounded-xl px-4 py-3 border border-white/10 bg-white/[0.05] w-fit">
          <Image src={data.logo} alt={`Logo ${data.companyName}`} width={24} height={24} className="rounded-md" unoptimized />
          <span className="text-sm font-medium text-white/80">{data.companyName}</span>
        </div>

        {/* Tagline badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.05] mb-5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <span className="text-xs font-semibold text-white/60">{data.tagline}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl">
          {data.greeting}
        </h1>

        {children}
      </div>
    </section>
  );
}
