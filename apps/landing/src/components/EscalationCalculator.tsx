"use client";

import { useState, useEffect } from "react";

const STAGES = [
  { label: "Factuur", color: "var(--blue)", delay: 0, extra: 0 },
  { label: "Herinnering", color: "#D97706", delay: 14, extra: 0 },
  { label: "Aanmaning", color: "#EA580C", delay: 28, extra: 15 },
  { label: "Incasso", color: "#DC2626", delay: 42, extra: 40 },
  { label: "Deurwaarder", color: "#991B1B", delay: 60, extra: 150 },
];

export default function EscalationCalculator() {
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
    <section className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight mb-2">
          Voorkom € 40 tot € 150 incassokosten
        </p>
        <p className="text-center text-sm text-[var(--muted)] mb-8">
          Zie wat er gebeurt als je niet op tijd betaalt
        </p>

        <div className="mx-auto max-w-sm">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg">
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

            {/* Timeline */}
            <div className="space-y-0">
              {STAGES.map((stage, idx) => {
                const isActive = idx <= activeStage;
                const total = runningTotal(idx);
                return (
                  <div key={stage.label} className="relative flex items-start gap-3">
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
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className="text-sm font-bold"
                            style={{ color: isActive ? stage.color : "var(--muted)", transition: "color 0.5s" }}
                          >
                            {stage.label}
                          </p>
                          {stage.delay > 0 && (
                            <p className="text-[11px] text-[var(--muted)]">+{stage.delay} dagen</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p
                            className="text-base font-extrabold tabular-nums"
                            style={{ color: isActive ? stage.color : "var(--muted)", transition: "color 0.5s" }}
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

            {/* Summary */}
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
      </div>
    </section>
  );
}
