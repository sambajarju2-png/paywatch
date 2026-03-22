"use client";

import { useState, useRef, useCallback } from "react";
import { useApp } from "./AppProvider";
import { PROVINCE_PATHS } from "@/lib/nl-provinces";

const CITIES = [
  { name: "Amsterdam", x: 432, y: 370, s: "lg" },
  { name: "Rotterdam", x: 370, y: 580, s: "lg" },
  { name: "Den Haag", x: 310, y: 530, s: "lg" },
  { name: "Utrecht", x: 500, y: 520, s: "lg" },
  { name: "Eindhoven", x: 540, y: 710, s: "lg" },
  { name: "Groningen", x: 590, y: 110, s: "lg" },
  { name: "Maastricht", x: 580, y: 880, s: "lg" },
  { name: "Tilburg", x: 470, y: 700, s: "md" },
  { name: "Almere", x: 500, y: 370, s: "md" },
  { name: "Breda", x: 415, y: 720, s: "md" },
  { name: "Nijmegen", x: 585, y: 580, s: "md" },
  { name: "Apeldoorn", x: 575, y: 440, s: "md" },
  { name: "Haarlem", x: 375, y: 390, s: "md" },
  { name: "Arnhem", x: 590, y: 530, s: "md" },
  { name: "Enschede", x: 640, y: 400, s: "md" },
  { name: "Amersfoort", x: 490, y: 460, s: "md" },
  { name: "'s-Hertogenbosch", x: 505, y: 660, s: "md" },
  { name: "Zwolle", x: 560, y: 350, s: "md" },
  { name: "Leeuwarden", x: 490, y: 175, s: "md" },
  { name: "Zaanstad", x: 405, y: 355, s: "sm" },
  { name: "Haarlemmermeer", x: 395, y: 415, s: "sm" },
  { name: "Zoetermeer", x: 340, y: 550, s: "sm" },
  { name: "Leiden", x: 345, y: 490, s: "sm" },
  { name: "Dordrecht", x: 395, y: 610, s: "sm" },
  { name: "Ede", x: 540, y: 490, s: "sm" },
  { name: "Emmen", x: 640, y: 260, s: "sm" },
  { name: "Venlo", x: 580, y: 730, s: "sm" },
  { name: "Deventer", x: 590, y: 400, s: "sm" },
  { name: "Delft", x: 330, y: 545, s: "sm" },
  { name: "Sittard-Geleen", x: 575, y: 845, s: "sm" },
  { name: "Helmond", x: 560, y: 710, s: "sm" },
  { name: "Heerlen", x: 590, y: 860, s: "sm" },
  { name: "Oss", x: 530, y: 645, s: "sm" },
  { name: "Roosendaal", x: 385, y: 740, s: "sm" },
  { name: "Gouda", x: 395, y: 540, s: "sm" },
  { name: "Alkmaar", x: 395, y: 300, s: "sm" },
  { name: "Lelystad", x: 495, y: 335, s: "sm" },
  { name: "Alphen aan den Rijn", x: 375, y: 510, s: "sm" },
  { name: "Hoorn", x: 435, y: 290, s: "sm" },
  { name: "Purmerend", x: 430, y: 335, s: "sm" },
  { name: "Spijkenisse", x: 345, y: 600, s: "sm" },
  { name: "Vlaardingen", x: 333, y: 575, s: "sm" },
  { name: "Schiedam", x: 350, y: 568, s: "sm" },
];

const SIZE_MAP: Record<string, number> = { lg: 6, md: 4.5, sm: 3 };

export default function NetherlandsMap() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = query.length > 0 && !selected
    ? CITIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = useCallback((name: string) => {
    setSelected(name);
    setQuery(name);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSelected(null), 3500);
  }, []);

  const t = {
    title: isNl ? "Beschikbaar in jouw gemeente" : "Available in your municipality",
    subtitle: isNl ? "PayWatch werkt in 43+ gemeenten door heel Nederland" : "PayWatch works in 43+ municipalities across the Netherlands",
    search: isNl ? "Zoek jouw gemeente..." : "Search your municipality...",
    available: isNl ? "beschikbaar" : "available",
    municipalities: isNl ? "Gemeenten" : "Municipalities",
    free: isNl ? "Gratis toegang" : "Free access",
    always: isNl ? "Altijd beschikbaar" : "Always available",
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] text-center tracking-tight">{t.title}</h2>
      <p className="text-sm text-[var(--muted)] text-center mt-2 mb-8">{t.subtitle}</p>

      {/* Search */}
      <div className="relative max-w-sm mx-auto mb-6 z-10">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          placeholder={t.search}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
        />
        {filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] max-h-48 overflow-y-auto z-20">
            {filtered.map((city) => (
              <button
                key={city.name}
                onClick={() => handleSelect(city.name)}
                className="flex items-center justify-between w-full px-4 py-2.5 border-b border-[var(--border)] last:border-b-0 text-sm text-left hover:bg-[var(--bg)] transition-colors"
              >
                <span className="font-medium text-[var(--text)]">{city.name}</span>
                <span className="text-xs font-semibold text-[var(--green)] bg-[var(--green-light)] rounded px-2 py-0.5">
                  ✓ {t.available}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        <svg viewBox="90 30 600 900" className="w-full h-auto block">
          <defs>
            <filter id="city-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Province shapes */}
          {PROVINCE_PATHS.map((p) => (
            <path
              key={p.name}
              d={p.d}
              fill={hoveredProvince === p.name ? "var(--blue-light)" : "var(--bg)"}
              stroke="var(--border)"
              strokeWidth="1"
              strokeLinejoin="round"
              className="transition-[fill] duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredProvince(p.name)}
              onMouseLeave={() => setHoveredProvince(null)}
            />
          ))}

          {/* City dots */}
          {CITIES.map((city) => {
            const isActive = selected === city.name;
            const isHovered = hoveredCity === city.name;
            const r = SIZE_MAP[city.s] || 4;
            const showLabel = city.s === "lg" || isActive || isHovered;

            return (
              <g key={city.name} className="cursor-pointer" onClick={() => handleSelect(city.name)}
                onMouseEnter={() => setHoveredCity(city.name)} onMouseLeave={() => setHoveredCity(null)}>
                {isActive && (
                  <>
                    <circle cx={city.x} cy={city.y} r={r * 3} fill="var(--blue)" opacity="0.1">
                      <animate attributeName="r" from={`${r * 2}`} to={`${r * 5}`} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.15" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={city.x} cy={city.y} r={r * 2} fill="var(--blue)" opacity="0.15">
                      <animate attributeName="r" from={`${r * 1.5}`} to={`${r * 3.5}`} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.2" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
                <circle
                  cx={city.x} cy={city.y}
                  r={isActive ? r * 1.8 : isHovered ? r * 1.3 : r}
                  fill="var(--blue)"
                  opacity={isActive ? 1 : isHovered ? 0.85 : 0.4}
                  filter={isActive ? "url(#city-glow)" : undefined}
                  className="transition-all duration-300"
                />
                {showLabel && (
                  <text
                    x={city.x + r + 6} y={city.y + 4}
                    fill={isActive ? "var(--blue)" : "var(--navy)"}
                    fontSize={isActive ? 14 : city.s === "lg" ? 12 : 10}
                    fontWeight={isActive || city.s === "lg" ? 600 : 500}
                    className="pointer-events-none select-none"
                    style={{ fontFamily: "inherit" }}
                  >
                    {city.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-12 pt-4 mt-2 border-t border-[var(--border)]">
          {[
            { v: "43+", l: t.municipalities },
            { v: "100%", l: t.free },
            { v: "24/7", l: t.always },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-xl sm:text-2xl font-extrabold text-[var(--blue)] tracking-tight">{s.v}</p>
              <p className="text-[10px] sm:text-xs text-[var(--muted)] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
