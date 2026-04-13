"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* Escalation stages with realistic cost progression */
const STAGES = [
  { label: "Factuur", color: "var(--blue)", delay: 0, extra: 0 },
  { label: "Herinnering", color: "#D97706", delay: 14, extra: 0 },
  { label: "Aanmaning", color: "#EA580C", delay: 28, extra: 15 },
  { label: "Incasso", color: "#DC2626", delay: 42, extra: 40 },
  { label: "Deurwaarder", color: "#991B1B", delay: 60, extra: 150 },
];

function EscalationCalculator() {
  const [amount, setAmount] = useState(45);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const runningTotal = (stageIdx: number) => {
    let total = amount;
    for (let i = 0; i <= stageIdx; i++) total += STAGES[i].extra;
    return total;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg">
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
          Wat kost het als je niet op tijd betaalt?
        </p>

        {/* Amount input */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-sm text-[var(--muted)]">Factuur:</span>
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5">
            <span className="text-sm font-bold text-[var(--navy)]">€</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-16 bg-transparent text-sm font-bold text-[var(--navy)] outline-none"
            />
          </div>
        </div>

        {/* Escalation timeline */}
        <div className="space-y-0">
          {STAGES.map((stage, idx) => {
            const isActive = idx <= activeStage;
            const total = runningTotal(idx);

            return (
              <div key={stage.label} className="relative flex items-start gap-3">
                {/* Vertical line */}
                {idx < 4 && (
                  <div
                    className="absolute left-[9px] top-[22px] w-[2px] h-[calc(100%-4px)]"
                    style={{
                      background: idx < activeStage ? stage.color : "var(--border)",
                      opacity: idx < activeStage ? 0.4 : 1,
                      transition: "background 0.5s",
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  className="relative z-10 mt-1 flex-shrink-0 rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    background: isActive ? stage.color : "var(--border)",
                    border: `2px solid ${isActive ? stage.color : "var(--border)"}`,
                    transition: "all 0.5s",
                    boxShadow: idx === activeStage ? `0 0 0 4px color-mix(in srgb, ${stage.color} 20%, transparent)` : "none",
                  }}
                />

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color: isActive ? stage.color : "var(--muted)",
                          transition: "color 0.5s",
                        }}
                      >
                        {stage.label}
                      </p>
                      {stage.delay > 0 && (
                        <p className="text-[11px] text-[var(--muted)]">
                          +{stage.delay} dagen
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className="text-base font-extrabold tabular-nums"
                        style={{
                          color: isActive ? stage.color : "var(--muted)",
                          transition: "color 0.5s",
                        }}
                      >
                        € {total.toLocaleString("nl-NL")}
                      </p>
                      {stage.extra > 0 && isActive && (
                        <p className="text-[11px] font-semibold" style={{ color: stage.color }}>
                          +€ {stage.extra} kosten
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom summary */}
        <div
          className="rounded-xl p-3 mt-1 text-center"
          style={{
            background: "color-mix(in srgb, var(--red) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--red) 15%, transparent)",
          }}
        >
          <p className="text-xs text-[var(--muted)]">Van € {amount} naar</p>
          <p className="text-xl font-extrabold text-[var(--red)]">
            € {runningTotal(4).toLocaleString("nl-NL")}
          </p>
          <p className="text-[11px] text-[var(--muted)]">als je niet op tijd handelt</p>
        </div>
      </div>
    </div>
  );
}

export default function HeroTestPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Comparison label */}
      <div className="bg-[var(--navy)] text-center py-2">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
          Hero Test Page (niet publiek)
        </p>
      </div>

      {/* ── NEW HERO ── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-12 sm:px-6 sm:pt-20 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--navy)] mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
                454 bedrijven herkend
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--navy)] tracking-tight leading-[1.1] mb-4">
                Voorkom € 40 tot € 150
                <br />
                <span style={{ color: "var(--red)" }}>incassokosten.</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6 max-w-lg">
                PayWatch scant je inbox, herkent facturen en waarschuwt je voordat een rekening escaleert naar aanmaning of deurwaarder.
              </p>

              {/* Trust bullets */}
              <div className="flex flex-col gap-2 mb-8">
                {[
                  "Werkt met Gmail en Outlook",
                  "Herkent CJIB, Ziggo, Eneco en 451+ anderen",
                  "100% gratis (beta)",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm text-[var(--text)]">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="https://app.paywatch.app"
                  className="rounded-lg bg-[var(--blue)] px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity text-center"
                >
                  Scan je inbox gratis
                </Link>
                <Link
                  href="#hoe-het-werkt"
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--blue)] transition-colors text-center"
                >
                  Bekijk hoe het werkt ↓
                </Link>
              </div>
            </div>

            {/* Right: Escalation Calculator */}
            <EscalationCalculator />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              { icon: "🇪🇺", label: "EU Product" },
              { icon: "🔒", label: "AVG/GDPR" },
              { icon: "🛡️", label: "AES-256 encryptie" },
              { icon: "📊", label: "454+ bedrijven herkend" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs font-semibold text-[var(--navy)] tracking-wide uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick comparison with current hero */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="text-xl font-bold text-[var(--navy)] mb-4 text-center">Vergelijking</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase mb-2">Huidige hero</p>
            <p className="text-sm text-[var(--text)]">
              Geanimeerde iPhone mockup met 5 schermen, generieke tekst &quot;Grip op je rekeningen&quot;, trust bar, how it works, features grid, stats, kaart, roadmap, newsletter. Alles in één scroll.
            </p>
            <p className="text-xs text-[var(--muted)] mt-2">Probleem: te veel, te lang, geen urgentie.</p>
          </div>
          <div className="rounded-xl border-2 border-[var(--blue)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold text-[var(--blue)] uppercase mb-2">Nieuwe hero (hierboven)</p>
            <p className="text-sm text-[var(--text)]">
              Eén belofte (voorkom incassokosten), live escalatiecalculator die de pijn laat zien, drie vertrouwenspunten, twee duidelijke CTAs.
            </p>
            <p className="text-xs text-[var(--green)] mt-2">Focus: urgentie + herkenning + actie.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
