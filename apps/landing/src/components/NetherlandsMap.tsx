"use client";

import { useState, useRef, useCallback } from "react";
import { useApp } from "./AppProvider";
import { PROVINCE_PATHS } from "@/lib/nl-provinces";
import { GEMEENTE_DATA, ADVOCATEN_DATA, MULTI_GEMEENTE_ORGS, ALL_GEMEENTE_NAMES, findGemeente, findAdvocaten, type GemeenteData, type Advocaat } from "@/lib/gemeente-data";

/* ─── City dots (43 major cities with coordinates) ─── */
/* Projection: x = (lon - 3.2) * 170, y = (53.7 - lat) * 300 */

interface CityDot {
  n: string; x: number; y: number; s: "lg" | "md" | "sm"; p: string;
}

const CITIES: CityDot[] = [
  { n: "Amsterdam",         x: 289.7, y: 399.7, s: "lg", p: "Noord-Holland" },
  { n: "Rotterdam",         x: 217.2, y: 532.7, s: "lg", p: "Zuid-Holland" },
  { n: "Den Haag",          x: 187.1, y: 488.9, s: "lg", p: "Zuid-Holland" },
  { n: "Utrecht",           x: 326.6, y: 482.8, s: "lg", p: "Utrecht" },
  { n: "Eindhoven",         x: 385.8, y: 677.5, s: "lg", p: "Noord-Brabant" },
  { n: "Groningen",         x: 572.3, y: 144.2, s: "lg", p: "Groningen" },
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

/* ─── Component ─── */
export default function NetherlandsMap() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Search ALL 335 gemeenten, not just the 43 dots */
  const filtered = query.length > 0 && !selected
    ? ALL_GEMEENTE_NAMES.filter((name) => name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  const handleSelect = useCallback((name: string) => {
    setSelected(name);
    setQuery(name);
    if (timerRef.current) clearTimeout(timerRef.current);
    /* Don't auto-clear for gemeente panel — user closes manually */
  }, []);

  const closePanel = useCallback(() => {
    setSelected(null);
    setQuery("");
  }, []);

  /* Get data for selected gemeente */
  const selectedData = selected ? findGemeente(selected) : null;
  const selectedAdvocaten = selected ? findAdvocaten(selected) : [];
  const selectedDot = selected ? CITIES.find((c) => c.n === selected) : null;

  /* Check if selected gemeente is covered by a multi-gemeente org */
  const multiOrg = selected
    ? MULTI_GEMEENTE_ORGS.find((o) => o.coverage.toLowerCase().includes(selected.toLowerCase()))
    : null;

  const t = {
    title: isNl ? "Beschikbaar in jouw gemeente" : "Available in your municipality",
    subtitle: isNl ? "PayWatch werkt in elke gemeente in Nederland" : "PayWatch works in every municipality in the Netherlands",
    search: isNl ? "Zoek jouw gemeente..." : "Search your municipality...",
    available: isNl ? "beschikbaar" : "available",
    municipalities: isNl ? "Gemeenten" : "Municipalities",
    free: isNl ? "Gratis" : "Free",
    always: "Beschikbaar",
    gemeenteHelp: isNl ? "Gemeentelijke schuldhulp" : "Municipal debt help",
    partnerOrg: isNl ? "Partnerorganisatie" : "Partner organization",
    localOrg: isNl ? "Lokale hulporganisatie" : "Local help organization",
    advocaten: isNl ? "Advocaten in de buurt" : "Lawyers nearby",
    visit: isNl ? "Bezoek website →" : "Visit website →",
    clickHint: isNl ? "Zoek of klik op een stad" : "Search or click a city",
    noData: isNl ? "Geen gegevens gevonden voor deze gemeente." : "No data found for this municipality.",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] text-center tracking-tight leading-tight">
        {t.title}
      </h2>
      <p className="text-sm text-[var(--muted)] text-center mt-2 mb-6 sm:mb-8">{t.subtitle}</p>

      {/* Search — searches all 335 gemeenten */}
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
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] max-h-56 overflow-y-auto z-20">
            {filtered.map((name) => (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                className="flex items-center justify-between w-full px-4 py-2.5 border-b border-[var(--border)] last:border-b-0 text-sm text-left hover:bg-[var(--bg)] transition-colors"
              >
                <span className="font-medium text-[var(--text)]">{name}</span>
                <span className="text-[10px] font-semibold text-[var(--green)] bg-[var(--green-light)] rounded px-2 py-0.5 shrink-0 ml-2">
                  ✓ {t.available}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-5">
        <svg viewBox="20 30 680 900" className="w-full h-auto block" role="img" aria-label={t.title}>
          <defs>
            <filter id="pw-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
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
            />
          ))}
          {CITIES.map((city) => {
            const isActive = selected === city.n;
            const isHovered = hoveredCity === city.n;
            const r = R[city.s] ?? 4;
            const showLabel = city.s === "lg" || isActive || isHovered;
            return (
              <g key={city.n} className="cursor-pointer" onClick={() => handleSelect(city.n)}
                onMouseEnter={() => setHoveredCity(city.n)} onMouseLeave={() => setHoveredCity(null)}>
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
                <circle cx={city.x} cy={city.y} r={isActive ? r * 1.8 : isHovered ? r * 1.3 : r}
                  fill="var(--blue)" opacity={isActive ? 1 : isHovered ? 0.85 : 0.4}
                  filter={isActive ? "url(#pw-glow)" : undefined} className="transition-all duration-300" />
                {showLabel && (
                  <text x={city.x + r + 6} y={city.y + 4}
                    fill={isActive ? "var(--blue)" : "var(--navy)"}
                    fontSize={isActive ? 13 : city.s === "lg" ? 11 : 9}
                    fontWeight={isActive || city.s === "lg" ? 700 : 500}
                    className="pointer-events-none select-none" style={{ fontFamily: "inherit" }}>
                    {city.n}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex justify-center gap-8 sm:gap-12 pt-3 mt-2 border-t border-[var(--border)]">
          {[{ v: isNl ? "Alle" : "All", l: t.municipalities }, { v: "100%", l: t.free }, { v: "24/7", l: t.always }].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-lg sm:text-xl font-extrabold text-[var(--blue)] tracking-tight">{s.v}</p>
              <p className="text-[10px] sm:text-xs text-[var(--muted)] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {!selected && <p className="text-center text-xs text-[var(--muted)] mt-3 opacity-60">{t.clickHint}</p>}

      {/* ─── Organizations panel ─── */}
      {selected && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
          style={{ animation: "pwFadeUp 0.25s ease" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div>
              <span className="text-base font-bold text-[var(--navy)]">{selected}</span>
              {selectedDot && <span className="text-xs text-[var(--muted)] ml-2">{selectedDot.p}</span>}
            </div>
            <button onClick={closePanel} className="text-[var(--muted)] hover:text-[var(--text)] text-lg px-2 transition-colors">×</button>
          </div>

          {selectedData ? (
            <div className="p-4 space-y-3">
              {/* Gemeente official schuldhulp */}
              <div className="rounded-xl border border-[var(--green)] border-opacity-30 p-3.5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold bg-[var(--green-light)] text-[var(--green)]">G</div>
                  <div>
                    <p className="text-sm font-bold text-[var(--navy)]">{isNl ? `Gemeente ${selected}` : `Municipality ${selected}`}</p>
                    <span className="text-[10px] font-semibold text-[var(--green)] bg-[var(--green-light)] rounded px-1.5 py-0.5">{t.gemeenteHelp}</span>
                  </div>
                </div>
                {selectedData.url && (
                  <a href={selectedData.url} target="_blank" rel="noopener noreferrer"
                    className="block rounded border border-[var(--border)] py-2 text-center text-xs font-semibold text-[var(--blue)] hover:border-[var(--blue)] transition-colors mt-2">
                    {t.visit}
                  </a>
                )}
              </div>

              {/* Partner organization (from 335 mapping) */}
              {selectedData.partner && (
                <div className="rounded-xl border border-[var(--border)] p-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold bg-[var(--blue-light)] text-[var(--blue)]">{selectedData.partner[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">{selectedData.partner}</p>
                      <span className="text-[10px] font-semibold text-[var(--blue)] bg-[var(--blue-light)] rounded px-1.5 py-0.5">{t.partnerOrg}</span>
                    </div>
                  </div>
                  {selectedData.partnerUrl && (
                    <a href={selectedData.partnerUrl} target="_blank" rel="noopener noreferrer"
                      className="block rounded border border-[var(--border)] py-2 text-center text-xs font-semibold text-[var(--blue)] hover:border-[var(--blue)] transition-colors mt-2">
                      {t.visit}
                    </a>
                  )}
                </div>
              )}

              {/* Local org from seed list (43 cities only) */}
              {selectedData.orgName && (
                <div className="rounded-xl border border-[var(--border)] p-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold" style={{ background: "#FEF3C7", color: "#D97706" }}>{selectedData.orgName[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">{selectedData.orgName}</p>
                      <span className="text-[10px] font-semibold rounded px-1.5 py-0.5" style={{ background: "#FEF3C7", color: "#D97706" }}>
                        {selectedData.orgType || t.localOrg}
                      </span>
                    </div>
                  </div>
                  {selectedData.note && <p className="text-xs text-[var(--muted)] leading-relaxed mb-2">{selectedData.note}</p>}
                  {selectedData.orgUrl && (
                    <a href={selectedData.orgUrl} target="_blank" rel="noopener noreferrer"
                      className="block rounded border border-[var(--border)] py-2 text-center text-xs font-semibold text-[var(--blue)] hover:border-[var(--blue)] transition-colors">
                      {t.visit}
                    </a>
                  )}
                </div>
              )}

              {/* Multi-gemeente org if applicable */}
              {multiOrg && !selectedData.orgName?.includes(multiOrg.name) && (
                <div className="rounded-xl border border-[var(--border)] p-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold bg-[var(--purple-light)] text-[var(--purple)]">{multiOrg.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">{multiOrg.name}</p>
                      <span className="text-[10px] font-semibold text-[var(--purple)] bg-[var(--purple-light)] rounded px-1.5 py-0.5">{isNl ? "Regionaal" : "Regional"}</span>
                    </div>
                  </div>
                  {multiOrg.url && (
                    <a href={multiOrg.url} target="_blank" rel="noopener noreferrer"
                      className="block rounded border border-[var(--border)] py-2 text-center text-xs font-semibold text-[var(--blue)] hover:border-[var(--blue)] transition-colors">
                      {t.visit}
                    </a>
                  )}
                </div>
              )}

              {/* Advocaten */}
              {selectedAdvocaten.length > 0 && (
                <>
                  <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide pt-2">{t.advocaten}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedAdvocaten.slice(0, 4).map((adv) => (
                      <a key={adv.name} href={adv.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] p-3 hover:border-[var(--blue)] transition-colors">
                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold bg-[var(--purple-light)] text-[var(--purple)]">{adv.name[0]}</div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--navy)] truncate">{adv.name}</p>
                          <p className="text-[10px] text-[var(--muted)] truncate">{adv.url.replace("https://", "").replace("www.", "")}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}

              {/* National helplines */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 mt-1">
                <p className="text-[11px] font-semibold text-[var(--muted)] mb-2">{isNl ? "Landelijke hulplijnen" : "National helplines"}</p>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  <span className="font-semibold">Juridisch Loket:</span> 0900-8020 ({isNl ? "gratis" : "free"})<br />
                  <span className="font-semibold">SchuldHulpMaatje:</span> 088-7788990<br />
                  <span className="font-semibold">Nibud:</span> nibud.nl
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] p-4">{t.noData}</p>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes pwFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}` }} />
    </div>
  );
}
