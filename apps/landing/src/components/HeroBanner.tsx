"use client";

import { useState, useEffect, useCallback } from "react";
import { useApp } from "./AppProvider";

/* Mini screen contents rendered inside the phone */
function MiniDashboard({ isNl }: { isNl: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-bold text-[var(--navy)]">{isNl ? "Overzicht" : "Overview"}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          [isNl ? "Openstaand" : "Outstanding", "€ 1.280", "var(--blue)"],
          [isNl ? "Achterstallig" : "Overdue", "2", "var(--red)"],
          [isNl ? "Binnenkort" : "Upcoming", "3", "var(--amber)"],
          [isNl ? "Betaald" : "Paid", "€ 4.520", "var(--green)"],
        ].map(([label, value, color]) => (
          <div key={label as string} className="rounded-lg border border-[var(--border)] p-2" style={{ background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
            <div className="h-0.5 w-5 rounded-full mb-1" style={{ background: color as string }} />
            <p className="text-[8px] text-[var(--muted)]">{label}</p>
            <p className="text-xs font-extrabold" style={{ color: color as string }}>{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        <p className="text-[8px] text-[var(--muted)]">{isNl ? "Mijn schulden" : "My debt"}</p>
        <p className="text-base font-extrabold text-[var(--navy)]">€ 1.280,00</p>
        <div className="border-t border-[var(--border)] pt-1 mt-1">
          <p className="text-[9px] font-semibold text-[var(--green)]">€ 760 {isNl ? "bespaard" : "saved"}</p>
        </div>
      </div>
    </div>
  );
}

function MiniBills({ isNl }: { isNl: boolean }) {
  const bills = [
    ["Vattenfall", "€ 400", "var(--red)", isNl ? "Incasso" : "Collection", true],
    ["VGZ", "€ 280", "var(--blue)", isNl ? "Factuur" : "Invoice", false],
    ["T-Mobile", "€ 200", "var(--amber)", isNl ? "Herinnering" : "Reminder", false],
    ["Ziggo", "€ 90", "var(--blue)", isNl ? "Factuur" : "Invoice", false],
  ] as const;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-bold text-[var(--navy)]">{isNl ? "Betalingen" : "Payments"}</p>
      {bills.map(([vendor, amount, color, stage, overdue]) => (
        <div key={vendor as string} className="flex items-center gap-2 rounded-lg border p-2" style={{
          borderColor: overdue ? `color-mix(in srgb, var(--red) 20%, transparent)` : 'var(--border)',
          background: overdue ? `color-mix(in srgb, var(--red) 4%, transparent)` : 'var(--surface)',
        }}>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-[var(--text)]">{vendor}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color as string }} />
              <span className="text-[8px] font-semibold" style={{ color: color as string }}>{stage}</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-[var(--text)]">{amount}</p>
        </div>
      ))}
    </div>
  );
}

function MiniStats({ isNl }: { isNl: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-bold text-[var(--navy)]">{isNl ? "Statistieken" : "Statistics"}</p>
      <div className="rounded-lg border border-[var(--border)] p-2.5 flex items-center gap-3" style={{ background: `color-mix(in srgb, var(--amber) 8%, transparent)` }}>
        <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90 flex-shrink-0">
          <circle cx="26" cy="26" r="20" fill="none" stroke="var(--border)" strokeWidth="5" />
          <circle cx="26" cy="26" r="20" fill="none" stroke="var(--amber)" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(60/100) * 2 * Math.PI * 20} ${2 * Math.PI * 20}`} />
          <text x="26" y="29" textAnchor="middle" fill="var(--amber)" fontSize="16" fontWeight="800" transform="rotate(90 26 26)">60</text>
        </svg>
        <div>
          <p className="text-[8px] text-[var(--muted)]">{isNl ? "Financiële gezondheid" : "Financial health"}</p>
          <p className="text-xs font-bold text-[var(--amber)]">{isNl ? "Kan beter" : "Needs work"}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[["53%", "var(--green)"], ["1", "var(--blue)"], ["€ 760", "var(--green)"], ["2", "var(--red)"]].map(([v, c], i) => (
          <div key={i} className="rounded-lg border border-[var(--border)] p-2" style={{ background: `color-mix(in srgb, ${c} 8%, transparent)` }}>
            <p className="text-base font-extrabold" style={{ color: c as string }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCashflow({ isNl }: { isNl: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-bold text-[var(--navy)]">Cashflow</p>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-lg border border-[var(--border)] p-2" style={{ background: `color-mix(in srgb, var(--green) 8%, transparent)` }}>
          <p className="text-[8px] text-[var(--muted)]">{isNl ? "Verwacht in" : "Expected in"}</p>
          <p className="text-sm font-extrabold text-[var(--green)]">€ 4.200</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-2" style={{ background: `color-mix(in srgb, var(--red) 8%, transparent)` }}>
          <p className="text-[8px] text-[var(--muted)]">{isNl ? "Verwacht uit" : "Expected out"}</p>
          <p className="text-sm font-extrabold text-[var(--red)]">€ 2.194</p>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        <p className="text-[9px] font-bold text-[var(--navy)] mb-1">{isNl ? "Binnenkort" : "Upcoming"}</p>
        {[["VGZ", "€ 280", "20 mrt"], ["T-Mobile", "€ 200", "21 mrt"], ["Ziggo", "€ 90", "25 mrt"]].map(([v, a]) => (
          <div key={v} className="flex justify-between py-1 border-b border-[var(--border)] last:border-0">
            <span className="text-[9px] font-semibold text-[var(--text)]">{v}</span>
            <span className="text-[9px] font-bold text-[var(--navy)]">{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Feature descriptions per screen */
const FEATURES = {
  nl: [
    { title: "Overzicht", desc: "Al je rekeningen, schulden en besparingen in één oogopslag.", icon: "grid" },
    { title: "Betalingen", desc: "Beheer elke rekening. Bekijk details en escalatiefase.", icon: "card" },
    { title: "Statistieken", desc: "Financiële gezondheid score en AI-inzichten.", icon: "chart" },
    { title: "Cashflow", desc: "Voorspel je inkomsten en uitgaven.", icon: "flow" },
  ],
  en: [
    { title: "Overview", desc: "All your bills, debts and savings at a glance.", icon: "grid" },
    { title: "Payments", desc: "Manage every bill. View details and escalation stage.", icon: "card" },
    { title: "Statistics", desc: "Financial health score and AI insights.", icon: "chart" },
    { title: "Cashflow", desc: "Predict your income and expenses.", icon: "flow" },
  ],
};

export default function HeroBanner() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const features = FEATURES[lang];

  const [screen, setScreen] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const INTERVAL = 4000;
  const SCREENS = 4;

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
      {/* Feature text — left side */}
      <div className="max-w-sm min-w-[260px]">
        {/* Progress bars */}
        <div className="flex gap-1.5 mb-6">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-1 rounded-full overflow-hidden cursor-pointer border-0 bg-[var(--border)]"
              style={{ flex: i === screen ? 2 : 1 }}
            >
              {i === screen && (
                <div className="absolute inset-y-0 left-0 bg-[var(--blue)] rounded-full" style={{ width: `${progress}%`, transition: "width 0.05s linear" }} />
              )}
              {i < screen && (
                <div className="absolute inset-0 bg-[var(--blue)] opacity-50 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Feature number + title */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm font-bold text-[var(--blue)]">{screen + 1})</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight">{f.title}</h2>
        </div>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-6">{f.desc}</p>

        {/* Dot nav */}
        <div className="flex gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full border-0 cursor-pointer transition-all duration-300"
              style={{
                width: i === screen ? 28 : 10,
                height: 10,
                background: i === screen ? "var(--blue)" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Phone — right side */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--blue) 15%, transparent) 0%, transparent 70%)" }}
        />

        {/* iPhone frame */}
        <div className="relative w-[260px] h-[540px] sm:w-[280px] sm:h-[580px] rounded-[36px] bg-black overflow-hidden"
          style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 8px #1a1a2e, 0 0 0 10px #2d2d44" }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-50">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#1a1a2e]" />
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-5 z-40 text-[var(--text)] text-[10px] font-semibold">
            <span>09:41</span>
          </div>

          {/* Content area */}
          <div className="absolute top-10 left-0 right-0 bottom-14 bg-[var(--bg)] overflow-hidden">
            {/* App topbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]" style={{ background: "var(--surface)" }}>
              <span className="text-xs font-bold text-[var(--navy)]">PayWatch</span>
              <div className="w-5 h-5 rounded-full border border-[var(--border)] flex items-center justify-center text-[8px]">
                {isNl ? "🇬🇧" : "🇳🇱"}
              </div>
            </div>

            {/* Screen content */}
            <div className="p-2.5 overflow-auto h-[calc(100%-36px)]">
              {screen === 0 && <MiniDashboard isNl={isNl} />}
              {screen === 1 && <MiniBills isNl={isNl} />}
              {screen === 2 && <MiniStats isNl={isNl} />}
              {screen === 3 && <MiniCashflow isNl={isNl} />}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-[var(--surface)] border-t border-[var(--border)] flex pt-1.5 pb-3">
            {["Overzicht", "Betalingen", "Stats", "Cashflow", "Meer"].map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === screen ? "var(--blue)" : "var(--muted)" }} />
                <span className="text-[7px] font-medium" style={{ color: i === screen ? "var(--blue)" : "var(--muted)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-[var(--text)] opacity-20" />
        </div>
      </div>
    </div>
  );
}
