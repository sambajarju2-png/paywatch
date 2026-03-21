import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { TrustBar } from "@/components/TrustBar";
import { GemeenteSearch } from "@/components/GemeenteSearch";

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-20 pb-14 px-6 bg-pw-bg">
        <div className="max-w-[1140px] mx-auto flex items-center gap-14">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pw-blue-light text-pw-blue text-[12px] font-semibold mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Vertrouwd in 43+ gemeenten
            </div>
            <h1 className="text-[48px] font-extrabold text-pw-navy leading-[1.08] tracking-[-1.5px] mb-4">
              Jouw rekeningen.
              <br />
              <span className="text-pw-blue">Gescand. Gesorteerd.</span>
            </h1>
            <p className="text-[17px] text-pw-muted leading-relaxed mb-8 max-w-[460px]">
              PayWatch scant je inbox, houdt elke rekening bij, en waarschuwt je voordat kosten oplopen. Zodat jij je hoofd vrij hebt voor de dingen die ertoe doen.
            </p>
            <div className="flex gap-3 items-center">
              <Link
                href={siteConfig.appUrl}
                className="bg-pw-blue text-white text-[15px] font-semibold px-7 py-3 rounded-button hover:bg-blue-700 transition-colors"
              >
                Gratis beginnen
              </Link>
              <Link
                href="/features"
                className="text-[15px] font-medium text-pw-blue hover:underline"
              >
                Bekijk hoe het werkt →
              </Link>
            </div>
          </div>

          {/* Phone mockup placeholder — replace with HeroBannerMockup component */}
          <div className="w-[300px] h-[600px] rounded-[42px] bg-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden relative shrink-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-black rounded-b-[14px] z-10" />
            <div className="absolute top-[30px] left-0 right-0 bottom-0 bg-pw-bg overflow-hidden">
              {/* Topbar */}
              <div className="flex items-center justify-between px-3 py-2 bg-white/90 backdrop-blur-sm border-b border-pw-border/50">
                <span className="text-[12px] font-bold text-pw-navy">PayWatch</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-pw-blue">🔥 12d</span>
                </div>
              </div>
              {/* Debt card */}
              <div className="mx-2.5 mt-2.5 bg-gradient-to-br from-pw-navy to-[#2D3B4E] rounded-xl p-3.5">
                <p className="text-[8px] text-white/60">Totaal openstaand</p>
                <p className="text-[22px] font-extrabold text-white tracking-tight">€ 2.847,50</p>
                <div className="flex gap-1 mt-1">
                  <span className="text-[7px] bg-white/12 text-white/70 px-1.5 py-0.5 rounded">12 rekeningen</span>
                  <span className="text-[7px] bg-green-500/30 text-green-300 px-1.5 py-0.5 rounded">€847 bespaard</span>
                </div>
              </div>
              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-1 mx-2.5 mt-2">
                {[
                  { l: "Kritiek", v: "3", c: "text-pw-red", bg: "bg-pw-red-light", bt: "border-t-2 border-pw-red" },
                  { l: "Binnenkort", v: "4", c: "text-amber-600", bg: "bg-amber-50", bt: "border-t-2 border-amber-500" },
                  { l: "Openstaand", v: "5", c: "text-pw-blue", bg: "bg-pw-blue-light", bt: "border-t-2 border-pw-blue" },
                  { l: "Betaald", v: "8", c: "text-pw-green", bg: "bg-pw-green-light", bt: "border-t-2 border-pw-green" },
                ].map((s) => (
                  <div key={s.l} className={`${s.bg} ${s.bt} rounded-md p-2`}>
                    <p className="text-[7px] text-pw-muted">{s.l}</p>
                    <p className={`text-[16px] font-extrabold ${s.c}`}>{s.v}</p>
                  </div>
                ))}
              </div>
              {/* Bills */}
              <div className="mx-2.5 mt-2 space-y-1">
                {[
                  { name: "Vattenfall", amt: "€245", stage: "Aanmaning", color: "bg-pw-red" },
                  { name: "Ziggo", amt: "€89,50", stage: "Herinnering", color: "bg-amber-500" },
                  { name: "Gemeente", amt: "€412", stage: "Openstaand", color: "bg-pw-blue" },
                  { name: "VGZ", amt: "€134", stage: "Betaald", color: "bg-pw-green" },
                ].map((b) => (
                  <div key={b.name} className="bg-white rounded-md p-2 border border-pw-border/50 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-semibold text-pw-text">{b.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className={`w-[5px] h-[5px] rounded-full ${b.color}`} />
                        <span className="text-[7px] font-semibold" style={{ color: b.color === "bg-pw-red" ? "#DC2626" : b.color === "bg-amber-500" ? "#D97706" : b.color === "bg-pw-blue" ? "#2563EB" : "#059669" }}>{b.stage}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-pw-text">{b.amt}</span>
                  </div>
                ))}
              </div>
              {/* Bottom nav */}
              <div className="absolute bottom-0 left-0 right-0 h-[44px] bg-white border-t border-pw-border flex justify-around items-center">
                {["Overzicht", "Rekeningen", "Stats", "Cashflow"].map((t, i) => (
                  <div key={t} className="text-center">
                    {i === 0 && <div className="w-1 h-1 rounded-full bg-pw-blue mx-auto mb-0.5" />}
                    <span className={`text-[7px] font-medium ${i === 0 ? "text-pw-blue" : "text-pw-muted/50"}`}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <TrustBar />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">Hoe het werkt</span>
            <h2 className="text-[36px] font-extrabold text-pw-navy mt-2 tracking-tight">Drie stappen naar rust</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01", title: "Scan",
                desc: "Verbind je Gmail of maak een foto van je brief. Onze AI herkent je rekeningen automatisch — bedrag, IBAN, vervaldatum, alles.",
                icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
                color: "bg-pw-blue-light", iconColor: "#2563EB",
              },
              {
                num: "02", title: "Volg",
                desc: "Zie precies in welke fase elke rekening zit. Van eerste factuur tot deurwaarder — inclusief wat het je kost als je te laat bent.",
                icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
                color: "bg-amber-50", iconColor: "#D97706",
              },
              {
                num: "03", title: "Los op",
                desc: "Genereer een nette reactiebrief met AI, of vind direct een hulporganisatie of jurist in jouw gemeente.",
                icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
                color: "bg-pw-purple-light", iconColor: "#7C3AED",
              },
            ].map((step) => (
              <div key={step.num} className="bg-pw-bg rounded-2xl p-8 border border-pw-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${step.color} flex items-center justify-center`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={step.iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={step.icon} />
                    </svg>
                  </div>
                  <span className="text-[32px] font-extrabold text-pw-border">{step.num}</span>
                </div>
                <h3 className="text-[18px] font-bold text-pw-navy mb-2">{step.title}</h3>
                <p className="text-[14px] text-pw-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES PREVIEW ─── */}
      <section className="py-20 px-6 bg-pw-bg">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">Features</span>
            <h2 className="text-[36px] font-extrabold text-pw-navy mt-2 mb-3 tracking-tight">Alles wat je nodig hebt. Niets meer.</h2>
            <p className="text-[15px] text-pw-muted max-w-[480px] mx-auto">Gebouwd voor mensen die grip willen — zonder gedoe.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", title: "Inbox Scanner", desc: "Gmail verbinden en klaar. AI pikt facturen eruit en voegt ze toe.", tag: "AI" },
              { icon: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 13a4 4 0 100-8 4 4 0 000 8z", title: "Brief Scanner", desc: "Maak een foto van een brief. AI leest alles en voegt het direct toe.", tag: "Camera" },
              { icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0", title: "Escalatie Ladder", desc: "Zie in welke fase je rekening zit. Van factuur tot deurwaarder — en wat elke stap kost.", tag: "5 fases" },
              { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "AI Reactiebrieven", desc: "Bezwaarschrift, betalingsregeling, klacht of uitstel — AI schrijft een nette brief.", tag: "4 templates" },
              { icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6", title: "Cashflow Voorspelling", desc: "Weet wat er aankomt. Zie welke rekeningen binnenkort vervallen.", tag: "Forecast" },
              { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", title: "Streaks & Badges", desc: "Blijf gemotiveerd met dagelijkse streaks en badges. Schulden beheren mag ook leuk zijn.", tag: "Motivatie" },
            ].map((f, i) => (
              <div key={f.title} className="bg-white rounded-card p-6 border border-pw-border flex gap-4">
                <div className={`w-[42px] h-[42px] rounded-[10px] ${i % 2 === 0 ? "bg-pw-blue-light" : "bg-pw-purple-light"} flex items-center justify-center shrink-0`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? "#2563EB" : "#7C3AED"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-pw-navy">{f.title}</h3>
                    <span className="text-[9px] font-semibold text-pw-blue bg-pw-blue-light px-2 py-0.5 rounded">{f.tag}</span>
                  </div>
                  <p className="text-[13px] text-pw-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/features" className="text-[14px] font-semibold text-pw-blue hover:underline">
              Alle features bekijken →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MOTIVATION ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1140px] mx-auto flex items-center gap-14">
          <div className="flex-1">
            <span className="text-[12px] font-semibold text-amber-600 tracking-widest uppercase">Motivatie</span>
            <h2 className="text-[32px] font-extrabold text-pw-navy mt-2 mb-4 tracking-tight">
              Schulden beheren hoeft niet zwaar te voelen
            </h2>
            <p className="text-[15px] text-pw-muted leading-relaxed mb-6">
              Met streaks, badges en een stemmingstracker houd je jezelf gemotiveerd. Elke betaalde rekening is een overwinning. En wij vieren dat met je mee.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "M12 3q1 4 4 6.5t3 5.5a1 1 0 01-14 0 5 5 0 011-3 1 1 0 005 0c0-2-1.5-3-1.5-5q0-2 2.5-4z", label: "Dagelijkse streaks", color: "#D97706" },
                { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: "11 badges", color: "#2563EB" },
                { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Besparingen tracker", color: "#059669" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-pw-bg border border-pw-border">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={m.icon} />
                  </svg>
                  <span className="text-[12px] font-semibold text-pw-text">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[340px] h-[220px] rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <div className="text-center">
              <div className="text-[48px] mb-2">🔥</div>
              <p className="text-[32px] font-extrabold text-amber-600">12 dagen</p>
              <p className="text-[13px] text-pw-muted">actieve streak</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-16 px-6 bg-pw-navy">
        <div className="max-w-[1140px] mx-auto flex justify-around text-center">
          {[
            { value: "€2.3B", label: "Incassokosten per jaar in NL" },
            { value: "1.4M", label: "Huishoudens met betalingsproblemen" },
            { value: "87%", label: "Weet niet van escalatiestappen" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[40px] font-extrabold text-white tracking-tight">{s.value}</p>
              <p className="text-[13px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MUNICIPALITY SEARCH ─── */}
      <GemeenteSearch />

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 bg-pw-bg text-center">
        <div className="max-w-[520px] mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-pw-blue-light flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-[32px] font-extrabold text-pw-navy mb-3 tracking-tight">Klaar voor rust?</h2>
          <p className="text-[15px] text-pw-muted leading-relaxed mb-7">
            Gratis beginnen. Geen creditcard nodig. Binnen 2 minuten je eerste rekening gescand.
          </p>
          <Link
            href={siteConfig.appUrl}
            className="inline-block bg-pw-blue text-white text-[15px] font-semibold px-9 py-3.5 rounded-button hover:bg-blue-700 transition-colors"
          >
            Begin nu — het is gratis
          </Link>
        </div>
      </section>
    </>
  );
}
