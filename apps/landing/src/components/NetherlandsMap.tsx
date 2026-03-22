"use client";

import { useState, useRef, useCallback } from "react";
import { useApp } from "./AppProvider";
import { PROVINCE_PATHS } from "@/lib/nl-provinces";

/* ─── City data with Mercator-projected coordinates ─── */
/* Projection: x = (lon - 3.2) * 170, y = (53.7 - lat) * 300 */
/* Source: official lat/lon from Dutch CBS/Kadaster */

interface City {
  n: string;        // name
  x: number;        // projected x
  y: number;        // projected y
  s: "lg" | "md" | "sm";  // population size tier
  p: string;        // province name
}

const CITIES: City[] = [
  /* Large cities (>300k) */
  { n: "Amsterdam",         x: 289.7, y: 399.7, s: "lg", p: "Noord-Holland" },
  { n: "Rotterdam",         x: 217.2, y: 532.7, s: "lg", p: "Zuid-Holland" },
  { n: "Den Haag",          x: 187.1, y: 488.9, s: "lg", p: "Zuid-Holland" },
  { n: "Utrecht",           x: 326.6, y: 482.8, s: "lg", p: "Utrecht" },
  { n: "Eindhoven",         x: 385.8, y: 677.5, s: "lg", p: "Noord-Brabant" },
  { n: "Groningen",         x: 572.3, y: 144.2, s: "lg", p: "Groningen" },
  /* Medium cities (100k-300k) */
  { n: "Tilburg",           x: 321.5, y: 643.4, s: "md", p: "Noord-Brabant" },
  { n: "Almere",            x: 351.0, y: 404.8, s: "md", p: "Flevoland" },
  { n: "Breda",             x: 267.9, y: 638.4, s: "md", p: "Noord-Brabant" },
  { n: "Nijmegen",          x: 451.4, y: 566.2, s: "md", p: "Gelderland" },
  { n: "Apeldoorn",         x: 470.9, y: 446.6, s: "md", p: "Gelderland" },
  { n: "Haarlem",           x: 245.9, y: 393.8, s: "md", p: "Noord-Holland" },
  { n: "Arnhem",            x: 458.8, y: 514.5, s: "md", p: "Gelderland" },
  { n: "Enschede",          x: 627.9, y: 443.6, s: "md", p: "Overijssel" },
  { n: "Amersfoort",        x: 371.9, y: 463.2, s: "md", p: "Utrecht" },
  { n: "'s-Hertogenbosch",  x: 355.5, y: 600.7, s: "md", p: "Noord-Brabant" },
  { n: "Zwolle",            x: 490.2, y: 355.0, s: "md", p: "Overijssel" },
  { n: "Leeuwarden",        x: 441.0, y: 149.6, s: "md", p: "Friesland" },
  { n: "Maastricht",        x: 423.5, y: 854.6, s: "md", p: "Limburg" },
  /* Smaller cities (50k-100k) */
  { n: "Leiden",            x: 220.5, y: 462.0, s: "sm", p: "Zuid-Holland" },
  { n: "Dordrecht",         x: 250.5, y: 566.0, s: "sm", p: "Zuid-Holland" },
  { n: "Ede",               x: 418.9, y: 498.5, s: "sm", p: "Gelderland" },
  { n: "Emmen",             x: 628.7, y: 277.1, s: "sm", p: "Drenthe" },
  { n: "Venlo",             x: 504.6, y: 699.0, s: "sm", p: "Limburg" },
  { n: "Deventer",          x: 502.4, y: 433.5, s: "sm", p: "Overijssel" },
  { n: "Delft",             x: 196.7, y: 506.5, s: "sm", p: "Zuid-Holland" },
  { n: "Helmond",           x: 418.4, y: 666.9, s: "sm", p: "Noord-Brabant" },
  { n: "Heerlen",           x: 472.8, y: 845.3, s: "sm", p: "Limburg" },
  { n: "Oss",               x: 394.2, y: 580.6, s: "sm", p: "Noord-Brabant" },
  { n: "Roosendaal",        x: 214.1, y: 650.8, s: "sm", p: "Noord-Brabant" },
  { n: "Gouda",             x: 256.8, y: 506.6, s: "sm", p: "Zuid-Holland" },
  { n: "Alkmaar",           x: 263.4, y: 320.3, s: "sm", p: "Noord-Holland" },
  { n: "Lelystad",          x: 386.8, y: 354.4, s: "sm", p: "Flevoland" },
  { n: "Hoorn",             x: 316.1, y: 317.4, s: "sm", p: "Noord-Holland" },
  { n: "Purmerend",         x: 299.0, y: 357.9, s: "sm", p: "Noord-Holland" },
  { n: "Zoetermeer",        x: 219.8, y: 492.8, s: "sm", p: "Zuid-Holland" },
  { n: "Middelburg",        x: 69.6,  y: 660.4, s: "sm", p: "Zeeland" },
  { n: "Assen",             x: 571.6, y: 212.1, s: "sm", p: "Drenthe" },
  { n: "Sittard-Geleen",    x: 453.5, y: 809.7, s: "sm", p: "Limburg" },
  { n: "Hilversum",         x: 335.8, y: 441.2, s: "sm", p: "Noord-Holland" },
  { n: "Zaanstad",          x: 275.2, y: 373.5, s: "sm", p: "Noord-Holland" },
  { n: "Alphen a/d Rijn",   x: 247.8, y: 471.2, s: "sm", p: "Zuid-Holland" },
  { n: "Vlissingen",        x: 63.1,  y: 673.9, s: "sm", p: "Zeeland" },
];

const R: Record<string, number> = { lg: 5.5, md: 4, sm: 2.8 };

/* ─── Organization data ─── */
interface Org {
  name: string;
  cat: string;
  desc: { nl: string; en: string };
  url?: string;
  tel?: string;
  scope?: string;
}

const CAT_STYLES: Record<string, { bg: string; bgDark: string; fg: string; fgDark: string }> = {
  Juridisch:   { bg: "#F5F3FF", bgDark: "#2E1065", fg: "#7C3AED", fgDark: "#A78BFA" },
  Financieel:  { bg: "#EFF6FF", bgDark: "#1E3A5F", fg: "#2563EB", fgDark: "#60A5FA" },
  Schuldhulp:  { bg: "#F0FDF4", bgDark: "#052E16", fg: "#059669", fgDark: "#34D399" },
  Sociaal:     { bg: "#FEF3C7", bgDark: "#451A03", fg: "#D97706", fgDark: "#FBBF24" },
  Gemeente:    { bg: "#F0FDF4", bgDark: "#052E16", fg: "#059669", fgDark: "#34D399" },
};

const NATIONAL_ORGS: Org[] = [
  { name: "Juridisch Loket", cat: "Juridisch", desc: { nl: "Gratis juridisch advies voor iedereen. Helpt bij schulden, incasso's en consumentenrecht.", en: "Free legal advice for everyone. Helps with debts, collections and consumer law." }, url: "https://juridischloket.nl", tel: "0900-8020", scope: "Landelijk" },
  { name: "Nibud", cat: "Financieel", desc: { nl: "Nationaal Instituut voor Budgetvoorlichting. Tips, tools en begrotingsadviezen.", en: "National budget advice institute. Tips, tools and budgeting advice." }, url: "https://nibud.nl", scope: "Landelijk" },
  { name: "NVVK", cat: "Financieel", desc: { nl: "Vereniging voor schuldhulpverlening en sociaal bankieren.", en: "Association for debt counseling and social banking." }, url: "https://nvvk.nl", scope: "Landelijk" },
  { name: "SchuldHulpMaatje", cat: "Schuldhulp", desc: { nl: "Vrijwilligers die je helpen met schulden. Persoonlijke begeleiding.", en: "Volunteers helping with debts. Personal guidance." }, url: "https://schuldhulpmaatje.nl", tel: "088-7788990" },
  { name: "Sociaal Raadslieden", cat: "Schuldhulp", desc: { nl: "Gratis hulp bij financiële en juridische problemen via je gemeente.", en: "Free help with financial and legal problems through your municipality." }, scope: "Landelijk" },
];

const LOCAL_ORGS: Record<string, Org[]> = {
  "Amsterdam":  [{ name: "Gemeente Amsterdam Schuldhulp", cat: "Gemeente", desc: { nl: "Schuldhulpverlening via de gemeente. Gratis budgetcoaching en schuldsanering.", en: "Municipal debt counseling. Free budget coaching and debt restructuring." }, url: "https://amsterdam.nl/schuldhulp" }],
  "Rotterdam":  [{ name: "Gemeente Rotterdam Kredietbank", cat: "Gemeente", desc: { nl: "Schuldhulpverlening, budgetbeheer en sociale leningen.", en: "Debt counseling, budget management and social loans." }, url: "https://rotterdam.nl/schulden" }, { name: "Humanitas Rotterdam", cat: "Sociaal", desc: { nl: "Thuisadministratie en financiële begeleiding door vrijwilligers.", en: "Home administration and financial guidance by volunteers." } }],
  "Den Haag":   [{ name: "Gemeente Den Haag Schuldhulp", cat: "Gemeente", desc: { nl: "Aanmelden voor schuldhulpverlening. Gratis budgetadvies.", en: "Register for debt counseling. Free budget advice." }, url: "https://denhaag.nl/schuldhulp" }],
  "Utrecht":    [{ name: "Werk & Inkomen Utrecht", cat: "Gemeente", desc: { nl: "Schuldhulpverlening en bijzondere bijstand.", en: "Debt counseling and special assistance." }, url: "https://utrecht.nl/schulden" }, { name: "Buurtteam Utrecht", cat: "Sociaal", desc: { nl: "Dichtbij hulp voor financiële en sociale vragen.", en: "Nearby help for financial and social questions." } }],
  "Eindhoven":  [{ name: "WIJeindhoven", cat: "Gemeente", desc: { nl: "Schuldhulpverlening via WIJeindhoven. Laagdrempelig.", en: "Debt counseling via WIJeindhoven. Low threshold." }, url: "https://wijeindhoven.nl" }],
  "Groningen":  [{ name: "Gemeente Groningen Schuldhulp", cat: "Gemeente", desc: { nl: "Hulp bij schulden via de gemeente. Budgetcoaching.", en: "Debt help through the municipality. Budget coaching." } }],
  "Maastricht": [{ name: "Sociale Zaken Maastricht", cat: "Gemeente", desc: { nl: "Schuldhulpverlening en minimaregelingen.", en: "Debt counseling and minimum income schemes." } }],
  "Tilburg":    [{ name: "ContourdeTwern Tilburg", cat: "Gemeente", desc: { nl: "Budgetcoaching, schuldhulp en financieel advies.", en: "Budget coaching, debt help and financial advice." } }],
  "Breda":      [{ name: "IMW Breda", cat: "Gemeente", desc: { nl: "Schuldhulpverlening namens de gemeente Breda.", en: "Debt counseling on behalf of municipality Breda." } }],
  "Nijmegen":   [{ name: "Bindkracht10 Nijmegen", cat: "Gemeente", desc: { nl: "Schuldhulpverlening en maatschappelijk werk.", en: "Debt counseling and social work." } }],
  "Arnhem":     [{ name: "Rijnstad Arnhem", cat: "Gemeente", desc: { nl: "Schuldhulpverlening, budgetcoaching en financieel advies.", en: "Debt counseling, budget coaching and financial advice." } }],
};

/* ─── Component ─── */
export default function NetherlandsMap() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = query.length > 0 && !selected
    ? CITIES.filter((c) => c.n.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const handleSelect = useCallback((name: string) => {
    setSelected(name);
    setQuery(name);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSelected(null), 4000);
  }, []);

  const closePanel = useCallback(() => {
    setSelected(null);
    setQuery("");
  }, []);

  const selectedCity = selected ? CITIES.find((c) => c.n === selected) : null;

  const t = {
    title: isNl ? "Beschikbaar in jouw gemeente" : "Available in your municipality",
    subtitle: isNl ? "PayWatch werkt in 43+ gemeenten door heel Nederland" : "PayWatch works in 43+ municipalities across the Netherlands",
    search: isNl ? "Zoek jouw gemeente..." : "Search your municipality...",
    available: isNl ? "beschikbaar" : "available",
    municipalities: isNl ? "Gemeenten" : "Municipalities",
    free: isNl ? "Gratis" : "Free",
    always: isNl ? "24/7" : "24/7",
    localHelp: isNl ? "Lokale hulp" : "Local help",
    national: isNl ? "Landelijke organisaties" : "National organizations",
    visit: isNl ? "Bezoek website" : "Visit website",
    call: isNl ? "Bel" : "Call",
    moreInfo: isNl ? "Meer info" : "More info",
    clickHint: isNl ? "Klik op een stad voor hulporganisaties" : "Click a city for help organizations",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] text-center tracking-tight leading-tight">
        {t.title}
      </h2>
      <p className="text-sm text-[var(--muted)] text-center mt-2 mb-6 sm:mb-8">
        {t.subtitle}
      </p>

      {/* Search */}
      <div className="relative max-w-xs sm:max-w-sm mx-auto mb-4 sm:mb-6 z-10">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          placeholder={t.search}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent transition-shadow"
        />
        {filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] max-h-48 overflow-y-auto z-20">
            {filtered.map((city) => (
              <button
                key={city.n}
                onClick={() => handleSelect(city.n)}
                className="flex items-center justify-between w-full px-4 py-2.5 border-b border-[var(--border)] last:border-b-0 text-sm text-left hover:bg-[var(--bg)] transition-colors"
              >
                <span className="font-medium text-[var(--text)]">{city.n}</span>
                <span className="text-[10px] font-semibold text-[var(--green)] bg-[var(--green-light)] rounded px-2 py-0.5 shrink-0 ml-2">
                  ✓ {t.available}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-5">
        <svg
          viewBox="20 30 680 900"
          className="w-full h-auto block"
          role="img"
          aria-label={t.title}
        >
          <defs>
            <filter id="pw-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Province shapes */}
          {PROVINCE_PATHS.map((prov) => (
            <path
              key={prov.name}
              d={prov.d}
              fill={hoveredProvince === prov.name ? "var(--blue-light)" : "var(--bg)"}
              stroke="var(--border)"
              strokeWidth="0.8"
              strokeLinejoin="round"
              className="transition-[fill] duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredProvince(prov.name)}
              onMouseLeave={() => setHoveredProvince(null)}
              onClick={() => {
                /* Find first city in this province */
                const first = CITIES.find((c) => c.p === prov.name);
                if (first) handleSelect(first.n);
              }}
            />
          ))}

          {/* City dots */}
          {CITIES.map((city) => {
            const isActive = selected === city.n;
            const isHovered = hoveredCity === city.n;
            const r = R[city.s] ?? 4;
            const showLabel = city.s === "lg" || isActive || isHovered;

            return (
              <g
                key={city.n}
                className="cursor-pointer"
                onClick={() => handleSelect(city.n)}
                onMouseEnter={() => setHoveredCity(city.n)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Pulse rings for selected city */}
                {isActive && (
                  <>
                    <circle cx={city.x} cy={city.y} r={r * 3} fill="var(--blue)" opacity="0.1">
                      <animate attributeName="r" from={`${r * 2}`} to={`${r * 6}`} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.15" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={city.x} cy={city.y} r={r * 2} fill="var(--blue)" opacity="0.15">
                      <animate attributeName="r" from={`${r * 1.5}`} to={`${r * 4}`} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.2" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
                {/* Dot */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? r * 1.8 : isHovered ? r * 1.3 : r}
                  fill="var(--blue)"
                  opacity={isActive ? 1 : isHovered ? 0.85 : 0.4}
                  filter={isActive ? "url(#pw-glow)" : undefined}
                  className="transition-all duration-300"
                />
                {/* Label */}
                {showLabel && (
                  <text
                    x={city.x + r + 6}
                    y={city.y + 4}
                    fill={isActive ? "var(--blue)" : "var(--navy)"}
                    fontSize={isActive ? 13 : city.s === "lg" ? 11 : 9}
                    fontWeight={isActive || city.s === "lg" ? 700 : 500}
                    className="pointer-events-none select-none"
                    style={{ fontFamily: "inherit" }}
                  >
                    {city.n}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Stats bar */}
        <div className="flex justify-center gap-8 sm:gap-12 pt-3 mt-2 border-t border-[var(--border)]">
          {[
            { v: "43+", l: t.municipalities },
            { v: "100%", l: t.free },
            { v: "24/7", l: t.always },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-lg sm:text-xl font-extrabold text-[var(--blue)] tracking-tight">{s.v}</p>
              <p className="text-[10px] sm:text-xs text-[var(--muted)] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hint when no city selected */}
      {!selectedCity && (
        <p className="text-center text-xs text-[var(--muted)] mt-3 opacity-60">{t.clickHint}</p>
      )}

      {/* Organizations panel */}
      {selectedCity && (
        <div
          className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
          style={{ animation: "pwFadeUp 0.25s ease" }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div>
              <span className="text-base font-bold text-[var(--navy)]">{selectedCity.n}</span>
              <span className="text-xs text-[var(--muted)] ml-2">{selectedCity.p}</span>
            </div>
            <button onClick={closePanel} className="text-[var(--muted)] hover:text-[var(--text)] text-lg px-2 transition-colors">×</button>
          </div>

          {/* Local organizations */}
          {LOCAL_ORGS[selectedCity.n] && LOCAL_ORGS[selectedCity.n].length > 0 && (
            <>
              <p className="px-4 pt-3 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide">
                {t.localHelp} {selectedCity.n}
              </p>
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                {LOCAL_ORGS[selectedCity.n].map((org) => (
                  <OrgCard key={org.name} org={org} isNl={isNl} t={t} isLocal />
                ))}
              </div>
            </>
          )}

          {/* Divider */}
          <div className="mx-4 border-t border-[var(--border)]" />

          {/* National organizations */}
          <p className="px-4 pt-3 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide">
            {t.national}
          </p>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {NATIONAL_ORGS.map((org) => (
              <OrgCard key={org.name} org={org} isNl={isNl} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Keyframe for panel animation */}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes pwFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}` }} />
    </div>
  );
}

/* ─── Organization card sub-component ─── */
function OrgCard({ org, isNl, t, isLocal }: { org: Org; isNl: boolean; t: Record<string, string>; isLocal?: boolean }) {
  const catStyle = CAT_STYLES[org.cat] || CAT_STYLES.Financieel;

  return (
    <div className={`rounded-xl border p-3.5 flex flex-col gap-2 ${isLocal ? "border-[var(--green)]" : "border-[var(--border)]"}`} style={isLocal ? { borderColor: "var(--green)", borderOpacity: 0.3 } : undefined}>
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold"
          style={{ background: catStyle.bg, color: catStyle.fg }}
        >
          {org.name[0]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--navy)] truncate">{org.name}</p>
          <span
            className="inline-block text-[10px] font-semibold rounded px-1.5 py-0.5 mt-0.5"
            style={{ background: catStyle.bg, color: catStyle.fg }}
          >
            {org.cat}
          </span>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] leading-relaxed">{isNl ? org.desc.nl : org.desc.en}</p>
      {org.scope && (
        <span className="self-start text-[10px] text-[var(--muted)] border border-[var(--border)] rounded px-1.5 py-0.5">
          {org.scope}
        </span>
      )}
      <div className="flex gap-2 mt-auto">
        {org.url && (
          <a href={org.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center rounded border border-[var(--border)] py-2 text-xs font-semibold text-[var(--blue)] hover:border-[var(--blue)] transition-colors">
            {t.visit} →
          </a>
        )}
        {org.tel && (
          <a href={`tel:${org.tel}`}
            className="flex-1 text-center rounded border border-[var(--border)] py-2 text-xs font-semibold text-[var(--green)] hover:border-[var(--green)] transition-colors">
            {t.call}: {org.tel}
          </a>
        )}
        {!org.url && !org.tel && (
          <span className="flex-1 text-center rounded border border-[var(--border)] py-2 text-xs font-semibold text-[var(--muted)]">
            {t.moreInfo}
          </span>
        )}
      </div>
    </div>
  );
}
