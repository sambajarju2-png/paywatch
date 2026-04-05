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

/* ── Color utilities ── */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function blendWithNavy(hex: string, strength: number): string {
  const [r, g, b] = hexToRgb(hex);
  const navy = [10, 37, 64]; // #0A2540
  return rgbToHex(
    r + (navy[0] - r) * strength,
    g + (navy[1] - g) * strength,
    b + (navy[2] - b) * strength
  );
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/* ── Build a professional gradient from brand colors ── */
function buildGradient(primary: string, secondary: string): string {
  const lum = luminance(primary);

  // If primary is too light (yellow, light green, etc.), blend with navy for readability
  if (lum > 0.55) {
    const base = blendWithNavy(primary, 0.5);
    const end = blendWithNavy(primary, 0.65);
    return `linear-gradient(135deg, ${base} 0%, ${end} 100%)`;
  }

  // If primary is very dark, lighten one end slightly
  if (lum < 0.15) {
    const lighter = blendWithNavy(primary, -0.2);
    return `linear-gradient(135deg, ${primary} 0%, ${lighter} 50%, ${darken(primary, 0.15)} 100%)`;
  }

  // Normal case: gradient from primary to a darker version
  const gradEnd = darken(primary, 0.3);
  return `linear-gradient(135deg, ${primary} 0%, ${blendWithNavy(primary, 0.2)} 50%, ${gradEnd} 100%)`;
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
        <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <h1 className="text-xl font-extrabold text-white mb-1">PayWatch</h1>
        <p className="text-white/40 text-sm mb-8">Grip op je rekeningen</p>
        <div className="flex items-center gap-2.5 justify-center mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60" style={{
              animation: `pw-pulse 1s ease-in-out ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
        <p className="text-white/25 text-xs">We bereiden uw pagina voor</p>
        <p className="text-white/50 text-xs font-medium mt-1">{company}</p>
      </div>
      <style>{`@keyframes pw-pulse { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(1.8);opacity:1} }`}</style>
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
      setTimeout(() => setShowLoader(false), 200);
      setTimeout(() => setFadeIn(true), 500);
    }
    load();
  }, [companyFromUrl, audience, handleDataLoaded]);

  const primary = data?.primaryColor || "#2563EB";
  const secondary = data?.secondaryColor || "#1E40AF";

  /* ── Loader ── */
  const loaderEl = companyFromUrl ? <LoadingOverlay company={companyFromUrl} visible={showLoader} /> : null;

  /* ── No data: PayWatch branded fallback ── */
  if (!data) {
    return (
      <>
        {loaderEl}
        <section className="relative overflow-hidden" style={{
          minHeight: 380,
          background: "linear-gradient(135deg, #0A2540 0%, #132F4C 50%, #1a365d 100%)",
        }}>
          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 transition-all duration-700"
            style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "none" : "translateY(20px)" }}>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <span className="text-base font-bold text-white/80">PayWatch</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.08]">{fallbackTitle}</h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">{fallbackSubtitle}</p>
            {children}
          </div>
        </section>
      </>
    );
  }

  /* ── Fully branded banner: company colors ARE the background ── */
  const gradient = buildGradient(primary, secondary);

  return (
    <>
      {loaderEl}
      <section className="relative overflow-hidden" style={{ minHeight: 440, background: gradient }}>
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 transition-all duration-700"
          style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "none" : "translateY(20px)" }}>

          {/* Top row: PayWatch × Company */}
          <div className="flex items-center justify-between mb-10 sm:mb-14">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <span className="text-sm font-semibold text-white/60">PayWatch</span>
              <span className="text-white/25 text-lg">×</span>
              <span className="text-sm font-bold text-white">{data.companyName}</span>
            </div>

            {/* Desktop: bigger company logo */}
            <div className="hidden sm:flex items-center gap-4 rounded-2xl px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/10">
              <Image src={data.logo} alt={`Logo ${data.companyName}`} width={44} height={44} className="rounded-lg" unoptimized />
              <div>
                <p className="text-sm font-bold text-white">{data.companyName}</p>
                <p className="text-[11px] text-white/50">{data.domain}</p>
              </div>
            </div>
          </div>

          {/* Mobile logo */}
          <div className="sm:hidden flex items-center gap-3 mb-8 rounded-xl px-4 py-3 bg-white/10 border border-white/10 w-fit">
            <Image src={data.logo} alt={`Logo ${data.companyName}`} width={36} height={36} className="rounded-lg" unoptimized />
            <div>
              <p className="text-sm font-bold text-white">{data.companyName}</p>
              <p className="text-[10px] text-white/50">{data.domain}</p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-sm font-medium text-white/60 mb-3">{data.tagline}</p>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.08] max-w-3xl">
            {data.greeting}
          </h1>

          {children}
        </div>
      </section>
    </>
  );
}
