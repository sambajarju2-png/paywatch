"use client";

import { useState, useEffect, useCallback } from "react";
import { useApp } from "./AppProvider";

const FEATURES = {
  nl: [
    { num: "01", title: "Overzicht", desc: "Al je rekeningen, schulden en financieel overzicht in één oogopslag.", badge: "Dashboard", bc: "var(--blue)" },
    { num: "02", title: "Betalingen", desc: "Beheer elke rekening. Bekijk details, escalatiefase en betaal direct.", badge: "Smart Bills", bc: "var(--green)" },
    { num: "03", title: "Financieel Inzicht", desc: "Categoriseer je transacties, ontdek abonnementen en zie waar je geld naartoe gaat.", badge: "Analytics", bc: "var(--purple)" },
    { num: "04", title: "PayBuddy", desc: "Bel met je AI-assistent. Stel vragen over rekeningen, schuldhulp en bezwaarschriften.", badge: "AI Voice", bc: "var(--amber)" },
    { num: "05", title: "Community", desc: "Deel ervaringen, stel vragen en steun elkaar. Anoniem of met naam.", badge: "Samen", bc: "var(--green)" },
  ],
  en: [
    { num: "01", title: "Overview", desc: "All your bills, debts and financial overview at a glance.", badge: "Dashboard", bc: "var(--blue)" },
    { num: "02", title: "Payments", desc: "Manage every bill. View details, escalation stage and pay directly.", badge: "Smart Bills", bc: "var(--green)" },
    { num: "03", title: "Financial Insight", desc: "Categorize your transactions, discover subscriptions and see where your money goes.", badge: "Analytics", bc: "var(--purple)" },
    { num: "04", title: "PayBuddy", desc: "Call your AI assistant. Ask about bills, debt help and dispute letters.", badge: "AI Voice", bc: "var(--amber)" },
    { num: "05", title: "Community", desc: "Share experiences, ask questions and support each other.", badge: "Together", bc: "var(--green)" },
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
        if (prev >= 100) { setScreen((s) => (s + 1) % SCREENS); return 0; }
        return prev + (step / INTERVAL) * 100;
      });
    }, step);
    return () => clearInterval(tick);
  }, [paused]);

  const goTo = useCallback((i: number) => { setScreen(i); setProgress(0); }, []);
  const f = features[screen];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      className="flex items-center justify-center gap-10 lg:gap-16 flex-wrap py-6">
      {/* Left — Feature info */}
      <div className="max-w-sm min-w-[260px]">
        <div className="flex gap-1.5 mb-6">
          {features.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="relative h-1 rounded-full overflow-hidden cursor-pointer border-0 bg-[var(--border)] transition-all duration-500"
              style={{ flex: i === screen ? 2.5 : 1 }}>
              {i === screen && <div className="absolute inset-y-0 left-0 bg-[var(--blue)] rounded-full" style={{ width: `${progress}%`, transition: "width 0.05s linear" }} />}
              {i < screen && <div className="absolute inset-0 bg-[var(--blue)] opacity-40 rounded-full" />}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 border"
          style={{ background: `color-mix(in srgb, ${f.bc} 8%, transparent)`, borderColor: `color-mix(in srgb, ${f.bc} 20%, transparent)` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.bc }} />
          <span className="text-[11px] font-bold tracking-wide" style={{ color: f.bc }}>{f.badge}</span>
        </div>
        <div className="flex items-baseline gap-2.5 mb-2">
          <span className="text-sm font-extrabold opacity-40 font-mono text-[var(--blue)]">{f.num}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight">{f.title}</h2>
        </div>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-6 max-w-[340px]">{f.desc}</p>
        <div className="flex gap-2 items-center">
          {features.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="rounded-full border-0 cursor-pointer transition-all duration-500"
              style={{ width: i === screen ? 28 : 10, height: 10, background: i === screen ? "var(--blue)" : "var(--border)" }} />
          ))}
          <span className="ml-2 text-xs text-[var(--muted)] tabular-nums">{screen + 1} / {SCREENS}</span>
        </div>
      </div>
      {/* Right — Phone */}
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--blue) 12%, transparent) 0%, transparent 70%)" }} />
        <div className="relative w-[260px] h-[540px] sm:w-[280px] sm:h-[580px] rounded-[36px] bg-black overflow-hidden"
          style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 8px #1a1a2e, 0 0 0 10px #2d2d44" }}>
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50" />
          <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-6 pb-0.5 z-40 text-white text-[10px] font-semibold">
            <span>16:34</span>
            <div className="flex gap-1 items-center">
              <span className="text-[9px]">5G</span>
              <div className="w-4 h-2 border border-white rounded-sm relative"><div className="absolute left-px top-px bottom-px w-3 rounded-sm bg-green-400" /></div>
            </div>
          </div>
          <div className="absolute top-10 left-0 right-0 bottom-0 bg-[var(--bg)] overflow-hidden">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-500 ease-out overflow-hidden"
                style={{ opacity: i === screen ? 1 : 0, pointerEvents: i === screen ? "auto" : "none" }}>
                <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]" style={{ background: "var(--surface)" }}>
                  <span className="text-[13px] font-extrabold text-[var(--blue)] tracking-tight">PayWatch</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-5 h-5 rounded-full border border-[var(--border)] flex items-center justify-center text-[8px]">{n ? "🇬🇧" : "🇳🇱"}</div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/></svg>
                    <div className="relative">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
                      <div className="absolute -top-1 -right-1.5 w-3 h-3 rounded-full bg-[var(--red)] text-[6px] font-bold text-white flex items-center justify-center">3</div>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 overflow-auto h-[calc(100%-36px)]">
                  {i === 0 && <ScrOverview n={n} />}
                  {i === 1 && <ScrPayments n={n} />}
                  {i === 2 && <ScrAnalytics n={n} />}
                  {i === 3 && <ScrBuddy n={n} />}
                  {i === 4 && <ScrCommunity n={n} />}
                </div>
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-[var(--surface)] border-t border-[var(--border)] flex pt-1.5 pb-3 z-10">
              {[
                { l: n?"Overzicht":"Overview", si: 0, icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
                { l: n?"Betalingen":"Payments", si: 1, icon: "M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM2 10h20" },
                { l: "Feed", si: 4, fab: true },
                { l: "Stats", si: 2, icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
                { l: "Buddy", si: 3, icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
              ].map((nav) => (
                <button key={nav.si} onClick={() => goTo(nav.si)} className="flex-1 flex flex-col items-center gap-0.5 bg-transparent border-0 cursor-pointer p-0">
                  {nav.fab ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center -mt-1.5"
                      style={{ background: screen===nav.si ? "var(--blue)" : "color-mix(in srgb, var(--blue) 15%, transparent)" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={screen===nav.si?"#fff":"var(--blue)"} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </div>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={screen===nav.si?"var(--blue)":"var(--muted)"} strokeWidth="1.5"><path d={nav.icon!}/></svg>
                  )}
                  <span className="text-[7px]" style={{ fontWeight: screen===nav.si?700:500, color: screen===nav.si?"var(--blue)":"var(--muted)" }}>{nav.l}</span>
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

function ScrOverview({ n }: { n: boolean }) {
  return (<div className="flex flex-col gap-2">
    <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">{n?"Overzicht":"Overview"}</p>
    <div className="grid grid-cols-2 gap-1.5">
      {[[n?"Openstaand":"Outstanding","€ 981,74","var(--blue)"],[n?"Achterstallig":"Overdue","2","var(--red)"],[n?"Binnenkort":"Upcoming","3","var(--amber)"],[n?"Betaald":"Paid","€ 64,97","var(--green)"]].map(([l,v,c])=>(
        <div key={l as string} className="rounded-lg border border-[var(--border)] p-2" style={{background:`color-mix(in srgb, ${c} 5%, transparent)`}}>
          <div className="h-0.5 w-5 rounded-full mb-1" style={{background:c as string}}/>
          <p className="text-[8px] text-[var(--muted)]">{l}</p>
          <p className="text-[13px] font-extrabold" style={{color:c as string}}>{v}</p>
        </div>))}
    </div>
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
      <div className="flex items-center gap-1.5 mb-2">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <p className="text-[9px] font-bold text-[var(--navy)]">{n?"Financieel inzicht":"Financial insight"}</p>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" className="ml-auto"><path d="M9 18l6-6-6-6"/></svg>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {[[n?"Inkomen":"Income","€ 4.637","var(--green)"],[n?"Uitgaven":"Expenses","€ 4.954","var(--red)"],["Netto","€ -317","var(--red)"]].map(([l,v,c])=>(
          <div key={l as string} className="rounded-md border border-[var(--border)] p-1.5 text-center">
            <p className="text-[7px] text-[var(--muted)]">{l}</p>
            <p className="text-[10px] font-bold" style={{color:c as string}}>{v}</p>
          </div>))}
      </div>
    </div>
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:"color-mix(in srgb, var(--blue) 8%, transparent)"}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div className="flex-1">
        <p className="text-[7px] text-[var(--muted)]">{n?"Schuldenvrij countdown":"Debt-free countdown"}</p>
        <p className="text-sm font-extrabold text-[var(--navy)]">~6 <span className="text-[9px] font-semibold text-[var(--muted)]">{n?"maanden":"months"}</span></p>
      </div>
      <div className="text-right">
        <p className="text-[7px] text-[var(--muted)]">{n?"50% naar schuld":"50% to debt"}</p>
        <p className="text-[10px] font-bold text-[var(--amber)]">€ 2.463</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      {[[n?"Scan rekening":"Scan bill","📷"],[n?"Scan e-mail":"Scan email","✉️"]].map(([l,icon])=>(
        <div key={l as string} className="flex items-center justify-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg py-2">
          <span className="text-[10px]">{icon}</span>
          <span className="text-[9px] font-bold text-[var(--text)]">{l}</span>
        </div>))}
    </div>
  </div>);
}

function ScrPayments({ n }: { n: boolean }) {
  return (<div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">{n?"Betalingen":"Payments"}</p>
      <div className="bg-[var(--blue)] rounded-md px-2 py-1 flex items-center gap-1">
        <span className="text-white text-[10px] font-light">+</span>
        <span className="text-white text-[8px] font-bold">{n?"Toevoegen":"Add"}</span>
      </div>
    </div>
    <div className="flex gap-0.5">
      {(n?["Openstaand","Binnenkort","Achterstallig","Betaald"]:["Outstanding","Upcoming","Overdue","Paid"]).map((t,i)=>(
        <div key={t} className="py-1 px-1.5 rounded-md text-[8px]" style={{background:i===0?"var(--surface)":"transparent",fontWeight:i===0?700:500,color:i===0?"var(--text)":"var(--muted)",border:i===0?"1px solid var(--border)":"none"}}>{t}</div>))}
    </div>
    {[{v:"CJIB",a:"€ 350,00",c:"var(--blue)",s:n?"Factuur":"Invoice",cat:n?"Overig":"Other",due:"27 mrt",gov:true},
      {v:"Flanderijn",a:"€ 220,00",c:"var(--red)",s:n?"Incasso":"Collection",cat:n?"Zorg":"Health",due:"26 mrt"},
      {v:"Eneco",a:"€ 216,00",c:"var(--blue)",s:n?"Factuur":"Invoice",cat:n?"Energie":"Energy",due:"27 mrt"}
    ].map((b)=>(
      <div key={b.v} className="relative overflow-hidden rounded-lg border bg-[var(--surface)] p-2" style={{borderColor:b.gov?"color-mix(in srgb, var(--purple) 25%, transparent)":"var(--border)"}}>
        {b.gov&&<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--purple)]"/>}
        <div className="flex items-center gap-2" style={{marginLeft:b.gov?4:0}}>
          {b.gov&&<div className="w-6 h-6 rounded-md flex items-center justify-center" style={{background:"color-mix(in srgb, var(--purple) 10%, transparent)"}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>}
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[var(--text)]">{b.v}</span>
              {b.gov&&<span className="text-[6px] font-extrabold text-white bg-[var(--purple)] px-1 py-px rounded tracking-wider">PRIORITEIT</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1 h-1 rounded-full" style={{background:b.c}}/>
              <span className="text-[8px] font-semibold" style={{color:b.c}}>{b.s}</span>
              <span className="text-[7px] text-[var(--muted)]">{b.cat}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[var(--text)]">{b.a}</p>
            <p className="text-[8px] text-[var(--blue)] font-medium">{b.due}</p>
          </div>
          <div className="w-5 h-5 rounded border flex items-center justify-center" style={{borderColor:"color-mix(in srgb, var(--green) 25%, transparent)",background:"color-mix(in srgb, var(--green) 5%, transparent)"}}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>))}
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
      <p className="text-[9px] font-bold text-[var(--navy)] mb-1.5">{n?"Agenda":"Calendar"}</p>
      <div className="flex gap-1">
        {(n?["Ma","Di","Wo","Do","Vr","Za","Zo"]:["Mo","Tu","We","Th","Fr","Sa","Su"]).map((d,i)=>(
          <div key={d} className="flex-1 text-center">
            <p className="text-[6px] text-[var(--muted)]">{d}</p>
            <div className="w-4 h-4 rounded-full mx-auto mt-0.5 flex items-center justify-center text-[7px] font-semibold" style={{background:i===2?"var(--blue)":i===4?"color-mix(in srgb, var(--red) 12%, transparent)":"transparent",color:i===2?"#fff":i===4?"var(--red)":"var(--text)"}}>{24+i}</div>
          </div>))}
      </div>
    </div>
  </div>);
}

function ScrAnalytics({ n }: { n: boolean }) {
  const r=30;const circ=2*Math.PI*r;
  const cats=[{l:n?"Schuld":"Debt",pct:50,c:"#991B1B",v:"€ 2.463"},{l:n?"Vaste lasten":"Fixed",pct:16,c:"#7C3AED",v:"€ 816"},{l:n?"Winkelen":"Shopping",pct:9,c:"#DB2777",v:"€ 438"},{l:n?"Eten":"Food",pct:5,c:"#EA580C",v:"€ 245"},{l:n?"Wonen":"Housing",pct:4,c:"#2563EB",v:"€ 216"},{l:n?"Overig":"Other",pct:16,c:"#94A3B8",v:"€ 776"}];
  let off=0;
  return (<div className="flex flex-col gap-2">
    <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">{n?"Financieel inzicht":"Financial insight"}</p>
    <div className="flex items-center justify-between">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      <span className="text-[11px] font-semibold text-[var(--navy)]">{n?"april 2026":"April 2026"}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" style={{opacity:0.3}}><path d="M9 18l6-6-6-6"/></svg>
    </div>
    <div className="grid grid-cols-3 gap-1">
      {[[n?"Inkomen":"Income","€ 4.637","var(--green)"],[n?"Uitgaven":"Expenses","€ 4.954","var(--red)"],["Netto","€ -317","var(--red)"]].map(([l,v,c])=>(
        <div key={l as string} className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5 text-center">
          <p className="text-[7px] text-[var(--muted)]">{l}</p>
          <p className="text-[10px] font-bold" style={{color:c as string}}>{v}</p>
        </div>))}
    </div>
    <div className="flex overflow-hidden text-[7px] border-b border-[var(--border)]">
      {(n?["Uitgaven","Inkomen","Geldstroom","Trend","Schuld","Transacties"]:["Spending","Income","Cashflow","Trend","Debt","Transactions"]).map((t,i)=>(
        <span key={t} className="px-1.5 py-1 whitespace-nowrap" style={{fontWeight:i===0?700:500,color:i===0?"var(--blue)":"var(--muted)",borderBottom:i===0?"2px solid var(--blue)":"2px solid transparent"}}>{t}</span>))}
    </div>
    <div className="flex justify-center py-1">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {cats.map((cat)=>{const d=(cat.pct/100)*circ;const el=(<circle key={cat.l} cx="40" cy="40" r={r} fill="none" stroke={cat.c} strokeWidth="8" strokeDasharray={`${d} ${circ-d}`} strokeDashoffset={-off} transform="rotate(-90 40 40)"/>);off+=d;return el;})}
        <text x="40" y="37" textAnchor="middle" fill="var(--muted)" fontSize="6">{n?"Totaal":"Total"}</text>
        <text x="40" y="46" textAnchor="middle" fill="var(--navy)" fontSize="9" fontWeight="800">€ 4.954</text>
      </svg>
    </div>
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
      {cats.map((cat)=>(
        <div key={cat.l} className="flex items-center justify-between py-1 border-b border-[var(--border)] last:border-0">
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{background:cat.c}}/><span className="text-[8px] font-medium text-[var(--text)]">{cat.l}</span></div>
          <div className="flex items-center gap-2"><span className="text-[7px] text-[var(--muted)]">{cat.pct}%</span><span className="text-[8px] font-bold text-[var(--navy)]">{cat.v}</span></div>
        </div>))}
    </div>
    {/* Compact subscriptions summary */}
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 mt-1">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[9px] font-bold text-[var(--navy)]">{n?"Abonnementen":"Subscriptions"}</p>
        <span className="text-[7px] text-[var(--amber)] font-bold">€ 1.374/{n?"maand":"mo"}</span>
      </div>
      {[{name:"Woonstad Rotterdam",amount:"€ 850",cat:n?"Huur":"Rent"},{name:"Vattenfall",amount:"€ 185",cat:n?"Energie":"Energy"},{name:"KPN",amount:"€ 89",cat:"Telecom"}].map((sub)=>(
        <div key={sub.name} className="flex items-center justify-between py-0.5">
          <div className="flex items-center gap-1.5"><span className="text-[7px] font-medium text-[var(--text)]">{sub.name}</span><span className="text-[6px] px-1 rounded bg-[var(--bg)] text-[var(--muted)]">{sub.cat}</span></div>
          <span className="text-[7px] font-bold text-[var(--navy)]">{sub.amount}</span>
        </div>))}
    </div>
  </div>);
}

function ScrBuddy({ n }: { n: boolean }) {
  return (<div className="flex flex-col gap-2">
    <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">PayBuddy</p>
    <p className="text-[8px] text-[var(--muted)]">{n?"Je persoonlijke financiële assistent":"Your personal financial assistant"}</p>
    {/* Active call simulation */}
    <div className="rounded-xl p-3 flex flex-col items-center gap-3" style={{background:"linear-gradient(135deg, #0F172A, #1E293B)"}}>
      {/* Waveform animation (static representation) */}
      <div className="flex items-center gap-0.5 h-8">
        {[3,5,8,12,16,20,16,12,8,5,3,5,8,14,18,14,8,5,3].map((h,i)=>(
          <div key={i} className="rounded-full" style={{width:2,height:h,background:`color-mix(in srgb, #3B82F6 ${60+i*2}%, #818CF8)`,opacity:0.8+i*0.01}}/>
        ))}
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background:"linear-gradient(135deg, #2563EB, #1D4ED8)",boxShadow:"0 4px 20px rgba(37,99,235,0.4)"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
      </div>
      <p className="text-[10px] font-semibold text-white opacity-90">{n?"Luisteren...":"Listening..."}</p>
      <p className="text-[7px] text-white opacity-50">02:34</p>
    </div>
    {/* Transcript */}
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[7px]" style={{background:"color-mix(in srgb, var(--blue) 12%, transparent)"}}>🤖</div>
        <div className="rounded-lg rounded-tl-sm px-2 py-1.5" style={{background:"color-mix(in srgb, var(--blue) 6%, transparent)"}}>
          <p className="text-[8px] text-[var(--text)] leading-snug">{n?"Hoi! Ik zie dat je een factuur van Vattenfall hebt van €185. Wil je dat ik kijk of je te veel betaalt?":"Hi! I see you have a €185 Vattenfall bill. Want me to check if you're overpaying?"}</p>
        </div>
      </div>
      <div className="flex gap-1.5 justify-end">
        <div className="rounded-lg rounded-tr-sm px-2 py-1.5 bg-[var(--blue)]">
          <p className="text-[8px] text-white leading-snug">{n?"Ja graag! En kan je ook een bezwaarbrief maken?":"Yes please! And can you also draft a dispute letter?"}</p>
        </div>
        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[7px]" style={{background:"color-mix(in srgb, var(--green) 12%, transparent)"}}>👤</div>
      </div>
      <div className="flex gap-1.5">
        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[7px]" style={{background:"color-mix(in srgb, var(--blue) 12%, transparent)"}}>🤖</div>
        <div className="rounded-lg rounded-tl-sm px-2 py-1.5" style={{background:"color-mix(in srgb, var(--blue) 6%, transparent)"}}>
          <p className="text-[8px] text-[var(--text)] leading-snug">{n?"Komt voor elkaar! Ik stel nu een bezwaarbrief op...":"On it! I'm drafting a dispute letter now..."}</p>
        </div>
      </div>
    </div>
    {/* Quick actions */}
    <div className="flex gap-1.5">
      {(n?["📊 Financieel overzicht","📝 Bezwaarbrief","🏛️ Schuldhulp"]:["📊 Overview","📝 Dispute","🏛️ Debt help"]).map((a)=>(
        <div key={a} className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-1.5 text-center">
          <p className="text-[6.5px] font-medium text-[var(--muted)]">{a}</p>
        </div>))}
    </div>
  </div>);
}

function ScrCommunity({ n }: { n: boolean }) {
  return (<div className="flex flex-col gap-2">
    <p className="text-[15px] font-extrabold text-[var(--navy)] tracking-tight">Community</p>
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px]" style={{background:"color-mix(in srgb, var(--blue) 12%, transparent)"}}>🐻</div>
      <span className="text-[8px] text-[var(--muted)] flex-1">{n?"Deel je ervaring...":"Share your experience..."}</span>
      <div className="bg-[var(--blue)] text-white text-[7px] font-bold px-2 py-1 rounded">Post</div>
    </div>
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{background:"color-mix(in srgb, var(--green) 12%, transparent)"}}>🦊</div>
        <span className="text-[9px] font-bold text-[var(--text)]">SpaarHeld</span><span className="text-[7px] text-[var(--muted)]">16u</span>
      </div>
      <span className="text-[7px] font-bold text-[var(--green)] px-1.5 py-0.5 rounded inline-block mb-1" style={{background:"color-mix(in srgb, var(--green) 10%, transparent)"}}>{n?"Schuldenvrij!":"Debt-free!"}</span>
      <p className="text-[9px] text-[var(--text)] leading-snug">{n?"Eindelijk na 8 maanden! PayWatch heeft me echt geholpen.":"Finally after 8 months! PayWatch really helped me."}</p>
      <div className="flex gap-2 mt-1.5"><span className="text-[8px] text-[var(--muted)]">❤️ 12</span><span className="text-[8px] text-[var(--muted)]">👏 4</span><span className="text-[8px] text-[var(--muted)]">💪 8</span></div>
    </div>
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{background:"color-mix(in srgb, var(--blue) 12%, transparent)"}}>🦁</div>
        <span className="text-[9px] font-bold text-[var(--text)]">BudgetLeeuw</span><span className="text-[7px] text-[var(--muted)]">1d</span>
      </div>
      <p className="text-[9px] text-[var(--text)] leading-snug line-clamp-3">{n?"Tip: bel altijd eerst het bedrijf voordat je een incassobureau inschakelt!":"Tip: always call the company before involving a collection agency!"}</p>
      <div className="flex gap-2 mt-1.5"><span className="text-[8px] text-[var(--muted)]">❤️ 24</span><span className="text-[8px] text-[var(--muted)]">💬 7</span></div>
    </div>
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{background:"color-mix(in srgb, var(--amber) 12%, transparent)"}}>🐻</div>
        <span className="text-[9px] font-bold text-[var(--text)]">Anoniem</span><span className="text-[7px] text-[var(--muted)]">3d</span>
      </div>
      <p className="text-[9px] text-[var(--text)] leading-snug line-clamp-2">{n?"Hoeveel kost een deurwaarder echt? Ik ben in paniek...":"How much does a bailiff really cost? I'm panicking..."}</p>
      <div className="flex gap-2 mt-1.5"><span className="text-[8px] text-[var(--muted)]">❤️ 6</span><span className="text-[8px] text-[var(--muted)]">💬 15</span></div>
    </div>
  </div>);
}
