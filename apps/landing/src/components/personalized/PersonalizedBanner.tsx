"use client";

import { useState, useEffect } from "react";
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
  audience: "gemeente" | "incasso" | "hulporg";
  fallbackTitle: string;
  fallbackSubtitle: string;
  children?: React.ReactNode;
  onDataLoaded?: (data: PersonalizeData) => void;
}

export default function PersonalizedBanner({
  company,
  audience,
  fallbackTitle,
  fallbackSubtitle,
  children,
  onDataLoaded,
}: Props) {
  const [data, setData] = useState<PersonalizeData | null>(null);
  const [loading, setLoading] = useState(!!company);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!company) return;

    async function fetchPersonalization() {
      try {
        const res = await fetch("/api/personalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company, audience }),
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
          onDataLoaded?.(result);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPersonalization();
  }, [company, audience, onDataLoaded]);

  const primary = data?.primaryColor || "#0A2540";
  const secondary = data?.secondaryColor || "#2563EB";

  /* ── Loading state ── */
  if (loading) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: 340,
          background: "linear-gradient(135deg, #0A2540 0%, #1E3A5F 100%)",
        }}
      >
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12 sm:pt-20 sm:pb-14 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 animate-pulse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <p className="text-sm text-white/50">
            Moment geduld, we bereiden uw pagina voor...
          </p>
          {company && (
            <p className="mt-1 text-xs text-white/30">{company}</p>
          )}
        </div>
      </section>
    );
  }

  /* ── No company or error: show generic banner ── */
  if (!data || error || !company) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: 320,
          background: "linear-gradient(135deg, #0A2540 0%, #1E3A5F 50%, #2563EB 100%)",
        }}
      >
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <span className="text-sm font-semibold text-white/70">PayWatch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.1]">
            {fallbackTitle}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
            {fallbackSubtitle}
          </p>
          {children}
        </div>
      </section>
    );
  }

  /* ── Personalized banner ── */
  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: 380,
        background: `linear-gradient(135deg, ${primary} 0%, ${primary}dd 40%, ${secondary}cc 100%)`,
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px, 90px 90px",
        }}
      />

      {/* Branded diagonal stripes */}
      <div className="absolute top-0 right-0 w-40 h-full sm:w-56 z-[2] pointer-events-none overflow-hidden">
        <div
          className="absolute -top-10 -right-10 w-[200%] h-[200%] origin-top-right"
          style={{
            background: `repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.08) 20px,
              rgba(255,255,255,0.08) 30px,
              transparent 30px,
              transparent 50px
            )`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
        {/* Top: PayWatch + Company logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <span className="text-sm font-semibold text-white/70">PayWatch</span>
            <span className="text-white/30 mx-1">×</span>
            <span className="text-sm font-semibold text-white/90">{data.companyName}</span>
          </div>

          {/* Company logo pill */}
          <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10">
            <Image
              src={data.logo}
              alt={`Logo ${data.companyName}`}
              width={32}
              height={32}
              className="rounded-md"
              unoptimized
            />
            <span className="text-xs font-semibold text-white/80">{data.companyName}</span>
          </div>
        </div>

        {/* Mobile logo */}
        <div className="sm:hidden flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 w-fit">
          <Image
            src={data.logo}
            alt={`Logo ${data.companyName}`}
            width={28}
            height={28}
            className="rounded-md"
            unoptimized
          />
          <span className="text-sm font-semibold text-white/90">{data.companyName}</span>
        </div>

        {/* Tagline badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          <span className="text-xs font-semibold text-white/80">{data.tagline}</span>
        </div>

        {/* AI-generated greeting */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15] max-w-3xl">
          {data.greeting}
        </h1>

        {/* Children: audience-specific CTA or extra elements */}
        {children}
      </div>
    </section>
  );
}
