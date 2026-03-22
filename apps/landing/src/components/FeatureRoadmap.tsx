"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useApp } from "./AppProvider";

interface RoadmapItem {
  title: { nl: string; en: string };
  description: { nl: string; en: string };
  quarter: string;
  status: "done" | "current" | "upcoming" | "planned";
  url?: string;
  features?: string[];
  order?: number;
}

/* Only completed features as hardcoded fallback */
const FALLBACK: RoadmapItem[] = [
  { title: { nl: "Gmail scanning", en: "Gmail scanning" }, description: { nl: "Automatisch rekeningen herkennen uit je inbox via de Gmail API.", en: "Automatically detect bills from your inbox via Gmail API." }, quarter: "Q1 2025", status: "done", order: 10 },
  { title: { nl: "Escalatie tracking", en: "Escalation tracking" }, description: { nl: "Realtime fases bijhouden: factuur → herinnering → aanmaning → incasso → deurwaarder.", en: "Track stages in real-time: invoice → reminder → notice → collection → bailiff." }, quarter: "Q1 2025", status: "done", order: 20 },
  { title: { nl: "AI extractie", en: "AI extraction" }, description: { nl: "Claude Haiku herkent automatisch bedragen, deadlines en IBAN uit e-mails.", en: "Claude Haiku automatically extracts amounts, deadlines and IBAN from emails." }, quarter: "Q1 2025", status: "done", order: 30 },
  { title: { nl: "Dashboard & statistieken", en: "Dashboard & statistics" }, description: { nl: "Financieel overzicht met health score, categorieën en besparingen.", en: "Financial overview with health score, categories and savings." }, quarter: "Q2 2025", status: "done", order: 40 },
  { title: { nl: "Betaallinks", en: "Payment links" }, description: { nl: "Directe betaallinks uit facturen zodat je met één klik kunt betalen.", en: "Direct payment links from invoices so you can pay in one click." }, quarter: "Q2 2025", status: "done", order: 50 },
  { title: { nl: "335+ gemeenten", en: "335+ municipalities" }, description: { nl: "Schuldhulpverlening data voor alle Nederlandse gemeenten.", en: "Debt counseling data for all Dutch municipalities." }, quarter: "Q2 2025", status: "done", order: 60 },
  { title: { nl: "Meertalig (NL/EN)", en: "Bilingual (NL/EN)" }, description: { nl: "Volledige app en website in Nederlands en Engels.", en: "Full app and website in Dutch and English." }, quarter: "Q3 2025", status: "done", order: 70 },
  { title: { nl: "Donkere modus", en: "Dark mode" }, description: { nl: "Schakel tussen licht en donker thema.", en: "Switch between light and dark theme." }, quarter: "Q3 2025", status: "done", order: 80 },
];

const STATUS_STYLES = {
  done:     { dot: "var(--green)",  label: { nl: "Voltooid", en: "Completed" } },
  current:  { dot: "var(--blue)",   label: { nl: "Nu bezig", en: "In progress" } },
  upcoming: { dot: "var(--amber)",  label: { nl: "Binnenkort", en: "Upcoming" } },
  planned:  { dot: "var(--muted)",  label: { nl: "Gepland", en: "Planned" } },
};

export default function FeatureRoadmap({ compact }: { compact?: boolean }) {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<RoadmapItem[]>(FALLBACK);
  const [canScrollL, setCanScrollL] = useState(false);
  const [canScrollR, setCanScrollR] = useState(true);

  /* Fetch from Sanity API */
  useEffect(() => {
    fetch("/api/roadmap")
      .then((r) => r.json())
      .then((d) => { if (d.items?.length > 0) setItems(d.items); })
      .catch(() => {});
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 20);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    /* Scroll to first "current" item on mount */
    const curIdx = items.findIndex((m) => m.status === "current");
    if (curIdx > 1) {
      setTimeout(() => { el.scrollLeft = Math.max(0, (curIdx - 1) * 220); }, 100);
    }
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => { el.removeEventListener("scroll", checkScroll); window.removeEventListener("resize", checkScroll); };
  }, [items, checkScroll]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const t = {
    title: isNl ? "Wat we bouwen" : "What we're building",
    subtitle: isNl ? "Van idee tot lancering — onze features in ontwikkeling" : "From idea to launch — our features in development",
    seeAll: isNl ? "Bekijk de volledige roadmap" : "View the full roadmap",
    readMore: isNl ? "Lees meer" : "Read more",
    tag: "Roadmap",
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="text-xs font-semibold text-[var(--blue)] uppercase tracking-widest">{t.tag}</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight mt-2">{t.title}</h2>
        <p className="text-sm text-[var(--muted)] mt-2">{t.subtitle}</p>
      </div>

      {/* Timeline container */}
      <div className="relative">
        {/* Navigation arrows — desktop only */}
        {canScrollL && (
          <button onClick={() => scroll(-1)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] items-center justify-center text-[var(--navy)] hover:border-[var(--blue)] transition-colors"
            aria-label="Scroll left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}
        {canScrollR && (
          <button onClick={() => scroll(1)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] items-center justify-center text-[var(--navy)] hover:border-[var(--blue)] transition-colors"
            aria-label="Scroll right">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {/* Fade edges */}
        {canScrollL && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--bg)] to-transparent z-[5] pointer-events-none" />}
        {canScrollR && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--bg)] to-transparent z-[5] pointer-events-none" />}

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto px-4 sm:px-12 pb-4 gap-0"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item, i) => {
            const isAbove = i % 2 === 0; /* Alternating: even=above, odd=below */
            const s = STATUS_STYLES[item.status] || STATUS_STYLES.planned;
            const isLast = i === items.length - 1;
            const cardContent = (
              <MilestoneCard item={item} lang={lang} status={s} isNl={isNl} readMore={t.readMore} />
            );

            return (
              <div key={i} className="flex-shrink-0 relative" style={{ scrollSnapAlign: "start", width: 220 }}>
                {/* Desktop: alternating above/below | Mobile: always above */}
                <div className="flex flex-col" style={{ minHeight: 320 }}>
                  {/* TOP card area */}
                  <div className="flex-1 flex items-end pb-3 px-1" style={{ minHeight: 130 }}>
                    <div className={`w-full ${isAbove ? "block" : "hidden sm:block sm:invisible"}`}>
                      {isAbove && (
                        item.url ? (
                          <Link href={item.url} className="block">{cardContent}</Link>
                        ) : (
                          cardContent
                        )
                      )}
                    </div>
                  </div>

                  {/* TIMELINE LINE + DOT */}
                  <div className="relative h-10 flex items-center">
                    {/* Horizontal line */}
                    <div
                      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full"
                      style={{
                        background: item.status === "done" ? "var(--green)"
                          : item.status === "current" ? "var(--blue)"
                          : "var(--border)",
                        right: isLast ? "50%" : 0,
                      }}
                    />
                    {/* Dot */}
                    <div
                      className="relative z-[2] ml-5 rounded-full border-[3px] border-[var(--surface)] flex items-center justify-center"
                      style={{
                        width: item.status === "current" ? 22 : 16,
                        height: item.status === "current" ? 22 : 16,
                        background: s.dot,
                        boxShadow: item.status === "current" ? `0 0 0 4px color-mix(in srgb, ${s.dot} 25%, transparent)` : undefined,
                      }}
                    >
                      {item.status === "done" && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      {item.status === "current" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* BOTTOM card area */}
                  <div className="flex-1 flex items-start pt-3 px-1" style={{ minHeight: 130 }}>
                    <div className={`w-full ${!isAbove ? "block" : "hidden sm:block sm:invisible"}`}>
                      {!isAbove && (
                        item.url ? (
                          <Link href={item.url} className="block">{cardContent}</Link>
                        ) : (
                          cardContent
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "See all" link for compact (homepage) mode */}
      {compact && (
        <div className="text-center mt-6">
          <Link href="/roadmap" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--blue)] hover:underline">
            {t.seeAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── Card sub-component ─── */
function MilestoneCard({ item, lang, status, isNl, readMore }: {
  item: RoadmapItem; lang: "nl" | "en";
  status: { dot: string; label: { nl: string; en: string } };
  isNl: boolean; readMore: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 hover:border-[var(--blue)] transition-colors group">
      {/* Badge + quarter */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-semibold rounded px-1.5 py-0.5"
          style={{
            color: status.dot,
            background: `color-mix(in srgb, ${status.dot} 10%, var(--surface))`,
          }}
        >
          {item.status === "done" && "✓ "}{isNl ? status.label.nl : status.label.en}
        </span>
        <span className="text-[10px] text-[var(--muted)] font-medium">{item.quarter}</span>
      </div>

      {/* Title */}
      <h3 className="text-[13px] font-bold text-[var(--navy)] leading-snug mb-1.5 group-hover:text-[var(--blue)] transition-colors">
        {isNl ? item.title.nl : item.title.en}
      </h3>

      {/* Description */}
      <p className="text-[11px] text-[var(--muted)] leading-relaxed line-clamp-3">
        {isNl ? item.description.nl : item.description.en}
      </p>

      {/* Features list */}
      {item.features && item.features.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.features.slice(0, 2).map((f, i) => (
            <span key={i} className="text-[9px] text-[var(--muted)] bg-[var(--bg)] border border-[var(--border)] rounded px-1.5 py-0.5">{f}</span>
          ))}
        </div>
      )}

      {/* Link arrow */}
      {item.url && (
        <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[11px] font-semibold text-[var(--blue)]">{readMore}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
        </div>
      )}
    </div>
  );
}
