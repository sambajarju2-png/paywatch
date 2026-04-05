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

/* ── Full-page loading overlay ── */
function LoadingOverlay({ company, visible }: { company: string; visible: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        background: "linear-gradient(135deg, #0A2540 0%, #132F4C 50%, #0A2540 100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="text-center px-6">
        {/* PayWatch logo */}
        <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <h1 className="text-xl font-extrabold text-white mb-1">PayWatch</h1>
        <p className="text-white/40 text-sm mb-8">Grip op je rekeningen</p>

        {/* Animated dots */}
        <div className="flex items-center gap-2.5 justify-center mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              style={{
                animation: `pulse-dot 1s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>

        <p className="text-white/25 text-xs">
          We bereiden uw pagina voor
        </p>
        <p className="text-white/50 text-xs font-medium mt-1">{company}</p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 1; }
        }
      `}</style>
    </div>
  );
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
  const [showLoader, setShowLoader] = useState(!!companyFromUrl);
  const [fadeIn, setFadeIn] = useState(false);

  const handleDataLoaded = useCallback(
    (d: PersonalizeData) => { onDataLoaded?.(d); },
    [onDataLoaded]
  );

  useEffect(() => {
    async function load() {
      let company = companyFromUrl;

      // Check localStorage cache
      const cached = typeof window !== "undefined" ? localStorage.getItem(storageKey(audience)) : null;
      if (!company && cached) {
        try {
          const parsed = JSON.parse(cached) as PersonalizeData;
          setData(parsed);
          handleDataLoaded(parsed);
          setShowLoader(false);
          setTimeout(() => setFadeIn(true), 50);
          return;
        } catch { /* ignore */ }
      }

      if (!company) {
        setShowLoader(false);
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

      // Fade out loader, fade in content
      setTimeout(() => setShowLoader(false), 200);
      setTimeout(() => setFadeIn(true), 500);
    }
    load();
  }, [companyFromUrl, audience, handleDataLoaded]);

  const primary = data?.primaryColor || "#2563EB";
  const secondary = data?.secondaryColor || "#1E40AF";

  /* ── Full-page loader (covers everything) ── */
  const loaderElement = companyFromUrl ? (
    <LoadingOverlay company={companyFromUrl} visible={showLoader} />
  ) : null;

  /* ── No data: generic banner ── */
  if (!data) {
    return (
      <>
        {loaderElement}
        <section className="relative overflow-hidden bg-[#0A2540]" style={{ minHeight: 340 }}>
          <div
            className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 transition-all duration-700"
            style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "none" : "translateY(20px)" }}
          >
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
      </>
    );
  }

  /* ── Personalized banner: navy base + brand color tint + geometric pattern ── */
  return (
    <>
      {loaderElement}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        {/* Background: navy blended with brand color */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(145deg, #0A2540 0%, ${primary}18 40%, #0A2540 70%, ${secondary}12 100%)`,
        }} />

        {/* Geometric circle pattern using brand color */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full" style={{
            background: `radial-gradient(circle, ${primary}12 0%, transparent 70%)`,
          }} />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full" style={{
            background: `radial-gradient(circle, ${secondary}0a 0%, transparent 70%)`,
          }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${primary}08 1px, transparent 1px), linear-gradient(90deg, ${primary}08 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: primary }} />

        <div
          className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 transition-all duration-700"
          style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "none" : "translateY(20px)" }}
        >
          {/* Top row: PayWatch × Company */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <span className="text-sm font-semibold text-white/50">PayWatch</span>
              <span className="text-white/20">×</span>
              <span className="text-sm font-semibold text-white/90">{data.companyName}</span>
            </div>

            {/* Company logo pill */}
            <div className="hidden sm:flex items-center gap-3 rounded-xl px-4 py-2.5 border border-white/10" style={{ backgroundColor: `${primary}15` }}>
              <Image src={data.logo} alt={`Logo ${data.companyName}`} width={30} height={30} className="rounded-md" unoptimized />
              <span className="text-xs font-semibold text-white/80">{data.companyName}</span>
            </div>
          </div>

          {/* Mobile logo */}
          <div className="sm:hidden flex items-center gap-3 mb-6 rounded-xl px-4 py-3 border border-white/10 w-fit" style={{ backgroundColor: `${primary}15` }}>
            <Image src={data.logo} alt={`Logo ${data.companyName}`} width={24} height={24} className="rounded-md" unoptimized />
            <span className="text-sm font-medium text-white/90">{data.companyName}</span>
          </div>

          {/* Tagline badge with brand color dot */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 mb-5" style={{ backgroundColor: `${primary}15` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
            <span className="text-xs font-semibold text-white/70">{data.tagline}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.08] max-w-3xl">
            {data.greeting}
          </h1>

          {children}
        </div>

        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--bg)] to-transparent z-[5]" />
      </section>
    </>
  );
}
