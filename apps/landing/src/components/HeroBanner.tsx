"use client";

import { useState, useEffect, useCallback } from "react";
import { useApp } from "./AppProvider";

const FEATURES = {
  nl: [
    { num: "01", title: "Overzicht", desc: "Al je rekeningen, schulden en schuldenvrij countdown in één oogopslag.", badge: "Dashboard", bc: "var(--blue)" },
    { num: "02", title: "Betalingen", desc: "Beheer elke rekening. Bekijk details, escalatiefase en betaal direct.", badge: "Smart Bills", bc: "var(--green)" },
    { num: "03", title: "Community", desc: "Deel ervaringen, stel vragen en steun elkaar. Anoniem of met naam.", badge: "Nieuw", bc: "var(--purple)" },
    { num: "04", title: "Statistieken", desc: "Financiële gezondheid score, betaalgedrag en bespaartips.", badge: "Inzichten", bc: "var(--amber)" },
    { num: "05", title: "Buddy Modus", desc: "Geef iemand die je vertrouwt een vangnet. Incasso-alerts naar je buddy.", badge: "Veiligheid", bc: "var(--green)" },
  ],
  en: [
    { num: "01", title: "Overview", desc: "All your bills, debts and debt-free countdown at a glance.", badge: "Dashboard", bc: "var(--blue)" },
    { num: "02", title: "Payments", desc: "Manage every bill. View details, escalation stage and pay directly.", badge: "Smart Bills", bc: "var(--green)" },
    { num: "03", title: "Community", desc: "Share experiences, ask questions and support each other.", badge: "New", bc: "var(--purple)" },
    { num: "04", title: "Statistics", desc: "Financial health score, payment behavior and savings tips.", badge: "Insights", bc: "var(--amber)" },
    { num: "05", title: "Buddy Mode", desc: "Give someone you trust a safety net. Collection alerts to your buddy.", badge: "Safety", bc: "var(--green)" },
  ],
};

const SCREENS = 5;
const INTERVAL = 4500;

export default function HeroBanner() {
  const { lang } = useApp();
  const n = lang === "nl";
  const features = FEATURES[lang];

  const [screen, setScreen] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const step = 50;
    const tick = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setScreen((s) => (s + 1) % SCREENS);
          return 0;
        }
        return prev + (step / INTERVAL) * 100;
      });
    }, step);
    return () => clearInterval(tick);
  }, [paused]);

  const goTo = useCallback((i: number) => {
    setScreen(i);
    setProgress(0);
  }, []);

  const f = features[screen];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex items-center justify-center gap-10 lg:gap-16 flex-wrap py-6"
    >
      {/* Left — Feature info */}
      <div className="max-w-sm min-w-[260px]">
        {/* Progress bars */}
        <div className="flex gap-1.5 mb-6">
          {features.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="relative h-1 rounded-full overflow-hidden cursor-pointer border-0 bg-[var(--border)] transition-all duration-500"
              style={{ flex: i === screen ? 2.5 : 1 }}>
              {i === screen && (
                <div className="absolute inset-y-0 left-0 bg-[var(--blue)] rounded-full" style={{ width: `${progress}%`, transition: "width 0.05s linear" }} />
              )}
              {i < screen && (
                <div className="absolute inset-0 bg-[var(--blue)] opacity-40 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 border"
          style={{ background: `color-mix(in srgb, ${f.bc} 8%, transparent)`, borderColor: `color-mix(in srgb, ${f.bc} 20%, transparent)` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.bc }} />
          <span className="text-[11px] font-bold tracking-wide" style={{ color: f.bc }}>{f.badge}</span>
        </div>

        {/* Number + Title */}
        <div className="flex items-baseline gap-2.5 mb-2">
          <span className="text-sm font-extrabold opacity-40 font-mono text-[var(--blue)]">{f.num}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight">{f.title}</h2>
        </div>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-6 max-w-[340px]">{f.desc}</p>

        {/* Dots + counter */}
        <div className="flex gap-2 items-center">
          {features.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="rounded-full border-0 cursor-pointer transition-all duration-500"
              style={{ width: i === screen ? 28 : 10, height: 10, background: i === screen ? "var(--blue)" : "var(--border)" }} />
          ))}
          <span className="ml-2 text-xs text-[var(--muted)] tabular-nums">{screen + 1} / {SCREENS}</span>
        </div>
      </div>

      {/* Right — Phone */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--blue) 12%, transparent) 0%, transparent 70%)" }} />

        {/* iPhone */}
        <div className="relative w-[260px] h-[540px] sm:w-[280px] sm:h-[580px] rounded-[36px] bg-black overflow-hidden"
          style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 8px #1a1a2e, 0 0 0 10px #2d2d44" }}>

          {/* Dynamic Island */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50" />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-6 pb-0.5 z-40 text-white text-[10px] font-semibold">
            <span>16:34</span>
            <div className="flex gap-1 items-center">
              <span className="text-[9px]">5G</span>
              <div className="w-4 h-2 border border-white rounded-sm relative">
                <div className="absolute left-px top-px bottom-px w-3 rounded-sm bg-green-400" />
              </div>
            </div>
          </div>

          {/* Screen area — all screens rendered, crossfade via opacity */}
          <div className="absolute top-10 left-0 right-0 bottom-0 bg-[var(--bg)] overflow-hidden">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-500 ease-out overflow-hidden"
                style={{ opacity: i === screen ? 1 : 0, pointerEvents: i === screen ? "auto" : "none" }}>
                {/* Topbar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]" style={{ background: "var(--surface)" }}>
                  <span className="text-[13px] font-extrabold text-[var(--blue)] tracking-tight">PayWatch</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-5 h-5 rounded-full border border-[var(--border)] flex items-center justify-center text-[8px]">{n ? "🇬🇧" : "🇳🇱"}</div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[9px] font-bold text-[var(--blue)]">🔥 3</span>
                    </div>
                    <div className="relative">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
                      <div className="absolute -top-1 -right-1.5 w-3 h-3 rounded-full bg-[var(--red)] text-[6px] font-bold text-white flex items-center justify-center">7</div>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 overflow-auto h-[calc(100%-36px)]">
                  {i === 0 && <ScrOverview n={n} />}
                  {i === 1 && <ScrPayments n={n} />}
                  {i === 2 && <ScrCommunity n={n} />}
                  {i === 3 && <ScrStats n={n} />}
                  {i === 4 && <ScrBuddy n={n} />}
                </div>
              </div>
            ))}

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-[var(--surface)] border-t border-[var(--border)] flex pt-1.5 pb-3 z-10">
              {[
                { l: n ? "Overzicht" : "Overview", i: 0 },
                { l: n ? "Betalingen" : "Payments", i: 1 },
                { l: "Feed", i: 2, fab: true },
                { l: "Stats", i: 3 },
                { l: n ? "Instellingen" : "Settings", i: 4, dots: true },
              ].map((nav) => (
                <button key={nav.i} onClick={() => goTo(nav.i)} className="flex-1 flex flex-col items-center gap-0.5 bg-transparent border-0 cursor-pointer p-0">
                  {nav.fab ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center -mt-1.5"
                      style={{ background: screen === nav.i ? "var(--blue)" : "color-mix(in srgb, var(--blue) 15%, transparent)" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={screen === nav.i ? "#fff" : "var(--blue)"} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </div>
                  ) : nav.dots ? (
                    <div className="flex gap-0.5 mt-0.5">
                      {[0,1,2].map(d=><div key={d} className="w-[3px] h-[3px] rounded-full" style={{background:screen===nav.i?"var(--blue)":"var(--muted)"}}/>)}
                    </div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: screen === nav.i ? "var(--blue)" : "var(--muted)" }} />
                  )}
                  <span className="text-[7px]" style={{ fontWeight: screen === nav.i ? 700 : 500, color: screen === nav.i ? "var(--blue)" : "var(--muted)" }}>{nav.l}</span>
                  {screen === nav.i && <div className="w-1 h-1 rounded-full bg-[var(--blue)] -mt-0.5" />}
                </button>
              ))}
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-[var(--text)] opacity-15 z-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* Screen Components                          */
/* ═══════════════════════════════════════════ */

function ScrOverview({ n }: { n: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">{n ? "Overzicht" : "Overview"}</p>
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden" style={{ background: "color-mix(in srgb, var(--border) 40%, transparent)" }}>
        <div className="flex-1 text-center py-1 text-[8px] font-bold text-[var(--text)] bg-[var(--surface)] rounded-md shadow-sm mx-0.5 my-0.5">{n ? "Overzicht" : "Overview"}</div>
        <div className="flex-1 text-center py-1 text-[8px] font-medium text-[var(--muted)]">AI Inzicht</div>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          [n ? "Openstaand" : "Outstanding", "€ 981,74", "var(--blue)"],
          [n ? "Achterstallig" : "Overdue", "2", "var(--red)"],
          [n ? "Binnenkort" : "Upcoming", "3", "var(--amber)"],
          [n ? "Betaald" : "Paid", "€ 64,97", "var(--blue)"],
        ].map(([l, v, c]) => (
          <div key={l as string} className="rounded-lg border border-[var(--border)] p-2" style={{ background: `color-mix(in srgb, ${c} 5%, transparent)` }}>
            <div className="h-0.5 w-5 rounded-full mb-1" style={{ background: c as string }} />
            <p className="text-[8px] text-[var(--muted)]">{l}</p>
            <p className="text-[13px] font-extrabold" style={{ color: c as string }}>{v}</p>
          </div>
        ))}
      </div>
      {/* Debt card */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[8px] text-[var(--muted)]">{n ? "Mijn schulden" : "My debt"}</p>
            <p className="text-[16px] font-extrabold text-[var(--navy)]">€ 981,74</p>
          </div>
          <span className="text-[7px] font-bold text-[var(--red)] px-1.5 py-0.5 rounded" style={{ background: "color-mix(in srgb, var(--red) 10%, transparent)" }}>⚠ 1 {n ? "in escalatie" : "escalated"}</span>
        </div>
        <div className="border-t border-[var(--border)] mt-1.5 pt-1.5 flex items-center gap-1">
          <span className="text-[9px] font-semibold text-[var(--green)]">€ 120 {n ? "bespaard aan incassokosten" : "saved on collection fees"}</span>
        </div>
      </div>
      {/* Countdown */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--blue) 8%, transparent)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div className="flex-1">
          <p className="text-[7px] text-[var(--muted)]">{n ? "Schuldenvrij countdown" : "Debt-free countdown"}</p>
          <p className="text-sm font-extrabold text-[var(--navy)]">14 <span className="text-[9px] font-semibold text-[var(--muted)]">{n ? "weken" : "weeks"}</span></p>
        </div>
        <div className="text-right">
          <p className="text-[7px] text-[var(--muted)]">{n ? "Resterend" : "Remaining"}</p>
          <p className="text-[10px] font-bold text-[var(--text)]">€ 981,74</p>
        </div>
      </div>
      {/* Scan buttons */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          [n ? "Scan rekening" : "Scan bill", "📷"],
          [n ? "Scan e-mail" : "Scan email", "✉️"],
        ].map(([l, icon]) => (
          <div key={l as string} className="flex items-center justify-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg py-2">
            <span className="text-[10px]">{icon}</span>
            <span className="text-[9px] font-bold text-[var(--text)]">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrPayments({ n }: { n: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">{n ? "Betalingen" : "Payments"}</p>
        <div className="flex gap-1.5 items-center">
          <div className="flex rounded-md overflow-hidden" style={{ background: "color-mix(in srgb, var(--border) 40%, transparent)" }}>
            <div className="px-1.5 py-1 bg-[var(--surface)] rounded shadow-sm m-0.5"><span className="text-[8px]">☰</span></div>
            <div className="px-1.5 py-1 m-0.5"><span className="text-[8px] text-[var(--muted)]">📅</span></div>
          </div>
          <div className="bg-[var(--blue)] rounded-md px-2 py-1 flex items-center gap-1">
            <span className="text-white text-[10px] font-light">+</span>
            <span className="text-white text-[8px] font-bold">{n ? "Toevoegen" : "Add"}</span>
          </div>
        </div>
      </div>
      {/* Filter tabs */}
      <div className="flex gap-0.5">
        {(n ? ["Openstaand", "Binnenkort", "Achterstallig", "Betaald"] : ["Outstanding", "Upcoming", "Overdue", "Paid"]).map((t, i) => (
          <div key={t} className="py-1 px-1.5 rounded-md text-[8px]" style={{
            background: i === 0 ? "var(--surface)" : "transparent",
            fontWeight: i === 0 ? 700 : 500,
            color: i === 0 ? "var(--text)" : "var(--muted)",
            border: i === 0 ? "1px solid var(--border)" : "none",
          }}>{t}</div>
        ))}
      </div>
      {/* Bills */}
      {[
        { v: "CJIB", a: "€ 350,00", c: "var(--blue)", s: n ? "Factuur" : "Invoice", cat: n ? "Overig" : "Other", due: "27 mrt", gov: true },
        { v: "Flanderijn", a: "€ 220,00", c: "var(--red)", s: n ? "Incasso" : "Collection", cat: n ? "Zorg" : "Health", due: "26 mrt" },
        { v: "Eneco", a: "€ 216,00", c: "var(--blue)", s: n ? "Factuur" : "Invoice", cat: n ? "Nutsvoorzieningen" : "Utilities", due: "27 mrt" },
      ].map((b) => (
        <div key={b.v} className="relative overflow-hidden rounded-lg border bg-[var(--surface)] p-2"
          style={{ borderColor: b.gov ? "color-mix(in srgb, var(--purple) 25%, transparent)" : "var(--border)" }}>
          {b.gov && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--purple)]" />}
          <div className="flex items-center gap-2" style={{ marginLeft: b.gov ? 4 : 0 }}>
            {b.gov && (
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--purple) 10%, transparent)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[var(--text)]">{b.v}</span>
                {b.gov && <span className="text-[6px] font-extrabold text-white bg-[var(--purple)] px-1 py-px rounded tracking-wider">PRIORITEIT</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1 h-1 rounded-full" style={{ background: b.c }} />
                <span className="text-[8px] font-semibold" style={{ color: b.c }}>{b.s}</span>
                <span className="text-[7px] text-[var(--muted)]">{b.cat}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[var(--text)]">{b.a}</p>
              <p className="text-[8px] text-[var(--blue)] font-medium">{b.due}</p>
            </div>
            <div className="w-5 h-5 rounded border flex items-center justify-center" style={{ borderColor: "color-mix(in srgb, var(--green) 25%, transparent)", background: "color-mix(in srgb, var(--green) 5%, transparent)" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>
      ))}
      {/* Mini calendar */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        <p className="text-[9px] font-bold text-[var(--navy)] mb-1.5">{n ? "Agenda" : "Calendar"}</p>
        <div className="flex gap-1">
          {(n ? ["Ma","Di","Wo","Do","Vr","Za","Zo"] : ["Mo","Tu","We","Th","Fr","Sa","Su"]).map((d, i) => (
            <div key={d} className="flex-1 text-center">
              <p className="text-[6px] text-[var(--muted)]">{d}</p>
              <div className="w-4 h-4 rounded-full mx-auto mt-0.5 flex items-center justify-center text-[7px] font-semibold" style={{
                background: i === 2 ? "var(--blue)" : i === 4 ? "color-mix(in srgb, var(--red) 12%, transparent)" : "transparent",
                color: i === 2 ? "#fff" : i === 4 ? "var(--red)" : "var(--text)",
              }}>{24 + i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScrCommunity({ n }: { n: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">Community</p>
        <p className="text-[8px] text-[var(--muted)] mt-0.5">{n ? "Deel ervaringen, steun elkaar" : "Share experiences, support each other"}</p>
      </div>
      {/* Compose */}
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] p-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: "color-mix(in srgb, var(--amber) 12%, transparent)" }}>🐵</div>
        <span className="text-[9px] text-[var(--muted)] flex-1">{n ? "Deel je verhaal..." : "Share your story..."}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </div>
      {/* Tabs */}
      <div className="flex gap-1">
        {[n ? "Alles" : "All", `🔥 ${n ? "Populair" : "Popular"}`, n ? "Succesverhalen" : "Success", n ? "Tips" : "Tips"].map((t, i) => (
          <div key={t} className="px-2 py-1 rounded-full text-[8px]" style={{
            background: i === 0 ? "var(--navy)" : "transparent",
            color: i === 0 ? "var(--bg)" : "var(--muted)",
            fontWeight: i === 0 ? 700 : 500,
          }}>{t}</div>
        ))}
      </div>
      {/* Post 1 */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{ background: "color-mix(in srgb, var(--amber) 12%, transparent)" }}>🐵</div>
          <span className="text-[9px] font-bold text-[var(--text)]">SpaarHeld</span>
          <span className="text-[7px] text-[var(--muted)]">16u</span>
          <span className="ml-auto text-[9px] text-[var(--muted)]">⋯</span>
        </div>
        <span className="text-[7px] font-bold text-[var(--green)] px-1.5 py-0.5 rounded inline-block mb-1" style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)" }}>🎉 {n ? "Schuldenvrij!" : "Debt-free!"}</span>
        <p className="text-[9px] text-[var(--text)] leading-snug">{n ? "Eindelijk na 8 maanden! 💪" : "Finally after 8 months! 💪"}</p>
        <div className="flex gap-2 mt-1.5">
          <span className="text-[8px] text-[var(--muted)]">❤️ 12</span>
          <span className="text-[8px] text-[var(--muted)]">👏 4</span>
          <span className="text-[8px] text-[var(--muted)]">💪 8</span>
          <span className="text-[8px] text-[var(--muted)] ml-auto">💬</span>
        </div>
      </div>
      {/* Post 2 */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{ background: "color-mix(in srgb, var(--blue) 12%, transparent)" }}>🦁</div>
          <span className="text-[9px] font-bold text-[var(--text)]">BudgetLeeuw</span>
          <span className="text-[7px] text-[var(--muted)]">1d</span>
        </div>
        <p className="text-[9px] text-[var(--text)] leading-snug line-clamp-3">{n ? "Tip: bel altijd eerst het bedrijf voordat je een incassobureau inschakelt. Vaak kun je een betalingsregeling treffen! 📞" : "Tip: always call the company before involving a collection agency. Often you can arrange a payment plan! 📞"}</p>
        <div className="flex gap-2 mt-1.5">
          <span className="text-[8px] text-[var(--muted)]">❤️ 24</span>
          <span className="text-[8px] text-[var(--muted)]">💬 7</span>
        </div>
      </div>
    </div>
  );
}

function ScrStats({ n }: { n: boolean }) {
  const r = 18; const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">{n ? "Statistieken" : "Statistics"}</p>
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden" style={{ background: "color-mix(in srgb, var(--border) 40%, transparent)" }}>
        <div className="flex-1 text-center py-1 text-[8px] font-bold text-[var(--text)] bg-[var(--surface)] rounded-md shadow-sm mx-0.5 my-0.5">{n ? "Prestaties" : "Performance"}</div>
        <div className="flex-1 text-center py-1 text-[8px] font-medium text-[var(--muted)]">Cashflow</div>
      </div>
      {/* Health donut */}
      <div className="rounded-lg border border-[var(--border)] p-2.5 flex items-center gap-3" style={{ background: "color-mix(in srgb, var(--amber) 6%, transparent)" }}>
        <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90 flex-shrink-0">
          <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle cx="24" cy="24" r={r} fill="none" stroke="var(--amber)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(65/100) * circ} ${circ}`} />
          <text x="24" y="27" textAnchor="middle" fill="var(--amber)" fontSize="14" fontWeight="800" transform="rotate(90 24 24)">65</text>
        </svg>
        <div>
          <p className="text-[7px] text-[var(--muted)]">{n ? "Gezondheid" : "Health"}</p>
          <p className="text-[11px] font-extrabold text-[var(--amber)]">{n ? "Kan beter" : "Needs work"}</p>
          <p className="text-[7px] text-[var(--muted)]">{n ? "Op basis van betaalgedrag" : "Based on payment behavior"}</p>
        </div>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          [n ? "Op tijd betaald" : "Paid on time", "100%", "var(--green)", "3/3"],
          ["Streak", "3", "var(--blue)", n ? "op rij" : "in a row"],
          [n ? "Bespaard" : "Saved", "€ 120", "var(--green)", n ? "incassokosten" : "collection fees"],
          [n ? "Achterstallig" : "Overdue", "2", "var(--red)", n ? "Betaal snel" : "Pay soon"],
        ].map(([l, v, c, sub]) => (
          <div key={l as string} className="rounded-lg border border-[var(--border)] p-2" style={{ background: `color-mix(in srgb, ${c} 5%, transparent)` }}>
            <p className="text-[7px] text-[var(--muted)]">{l}</p>
            <p className="text-sm font-extrabold" style={{ color: c as string }}>{v}</p>
            <p className="text-[6px] text-[var(--muted)]">{sub}</p>
          </div>
        ))}
      </div>
      {/* Categories */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        <p className="text-[9px] font-bold text-[var(--navy)] mb-1.5">{n ? "Per categorie" : "By category"}</p>
        {[
          [n ? "Overig" : "Other", "€ 351", 100],
          [n ? "Zorg" : "Health", "€ 220", 63],
        ].map(([l, a, w]) => (
          <div key={l as string} className="mb-1.5">
            <div className="flex justify-between text-[8px]">
              <span className="font-semibold text-[var(--text)]">{l}</span>
              <span className="font-bold text-[var(--text)]">{a}</span>
            </div>
            <div className="h-1 rounded-full mt-0.5 overflow-hidden" style={{ background: "var(--border)" }}>
              <div className="h-full rounded-full bg-[var(--blue)]" style={{ width: `${w}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrBuddy({ n }: { n: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">{n ? "Veiligheidsnetwerk" : "Safety Network"}</p>
      {/* Circle */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--border)]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--blue)] flex items-center justify-center shadow-[0_0_0_2px_var(--surface),0_0_0_4px_color-mix(in_srgb,var(--blue)_30%,transparent)]">
            <span className="text-[7px] font-extrabold text-white">{n ? "JIJ" : "YOU"}</span>
          </div>
          <div className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-[var(--surface)] text-[8px] font-bold text-[var(--navy)] shadow-[0_0_0_2px_var(--green)]" style={{ left: 72, top: 16 }}>MJ</div>
          <div className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-[var(--surface)] text-[8px] font-bold text-[var(--navy)] shadow-[0_0_0_2px_var(--green)]" style={{ left: 6, top: 62 }}>PA</div>
        </div>
        <div className="flex gap-3 mt-2">
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" /><span className="text-[7px] text-[var(--muted)]">{n ? "Alles goed" : "All clear"}</span></div>
        </div>
      </div>
      {/* Alert */}
      <div className="rounded-lg border p-2" style={{ borderColor: "color-mix(in srgb, var(--red) 15%, transparent)", background: "color-mix(in srgb, var(--red) 4%, transparent)" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 rounded bg-[var(--red)] flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
          </div>
          <span className="text-[8px] font-bold text-[var(--text)]">PayWatch</span>
          <span className="text-[7px] text-[var(--muted)] ml-auto">{n ? "nu" : "now"}</span>
        </div>
        <p className="text-[8px] font-semibold text-[var(--text)]">⚠️ Samba {n ? "heeft een rekening in Incasso" : "has a bill in Collection"}</p>
        <p className="text-[7px] text-[var(--muted)] mt-0.5">Flanderijn — €220,00</p>
      </div>
      {/* Toggles */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        {[
          [n ? "Bedragen zichtbaar" : "Amounts visible"],
          [n ? "Incasso-alert aan" : "Collection alert on"],
        ].map(([ label ], i) => (
          <div key={i} className="flex items-center justify-between py-1" style={{ borderBottom: i === 0 ? "1px solid var(--border)" : "none" }}>
            <span className="text-[8px] text-[var(--text)]">{label}</span>
            <div className="w-6 h-3.5 rounded-full bg-[var(--blue)] relative">
              <div className="absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm" style={{ left: 10 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
