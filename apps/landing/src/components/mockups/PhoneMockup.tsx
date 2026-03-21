"use client";

import { useState, useEffect } from "react";
import { useApp } from "../AppProvider";

type Screen = "dashboard" | "payments" | "stats" | "cashflow";

interface PhoneMockupProps {
  screen: Screen;
  scale?: number;
}

export default function PhoneMockup({ screen, scale = 0.55 }: PhoneMockupProps) {
  const { theme, lang } = useApp();
  const dark = theme === "dark";
  const n = lang === "nl";

  const C = dark
    ? { bg:"#0B1120",surface:"#1E293B",navy:"#E2E8F0",blue:"#3B82F6",text:"#F1F5F9",muted:"#94A3B8",border:"#334155",green:"#10B981",amber:"#F59E0B",red:"#EF4444",purple:"#8B5CF6" }
    : { bg:"#F4F7FB",surface:"#FFFFFF",navy:"#0A2540",blue:"#2563EB",text:"#0F172A",muted:"#64748B",border:"#E2E8F0",green:"#059669",amber:"#D97706",red:"#DC2626",purple:"#7C3AED" };

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", display: "inline-flex" }}>
      <div style={{ position: "relative", width: 375, height: 780, borderRadius: 52, background: "#000", boxShadow: `0 40px 80px -20px rgba(0,0,0,${dark?"0.6":"0.25"}), 0 0 0 10px #1a1a2e, 0 0 0 12px #2d2d44`, overflow: "hidden", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 160, height: 34, background: "#000", borderRadius: "0 0 20px 20px", zIndex: 50 }}>
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 60, height: 5, borderRadius: 3, background: "#1a1a2e" }} />
        </div>
        {/* Status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", zIndex: 40, color: C.text, fontSize: 12, fontWeight: 600 }}>
          <span>09:41</span>
        </div>
        {/* Content */}
        <div style={{ position: "absolute", top: 50, left: 0, right: 0, bottom: 72, overflow: "auto", background: C.bg }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>PayWatch</span>
            <div style={{ width: 26, height: 26, borderRadius: 13, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{n ? "🇬🇧" : "🇳🇱"}</div>
          </div>
          <div style={{ padding: 14 }}>
            {screen === "dashboard" && <DashScreen C={C} n={n} />}
            {screen === "payments" && <PayScreen C={C} n={n} />}
            {screen === "stats" && <StatsScreen C={C} n={n} />}
            {screen === "cashflow" && <CashScreen C={C} n={n} />}
          </div>
        </div>
        {/* Bottom nav */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 72, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", paddingTop: 6, paddingBottom: 16 }}>
          {["Overzicht","Betalingen","Stats","Cashflow","Meer"].map((t, i) => {
            const active = (screen === "dashboard" && i===0) || (screen === "payments" && i===1) || (screen === "stats" && i===2) || (screen === "cashflow" && i===3);
            return (
              <div key={t} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: active ? C.blue : C.muted }} />
                <span style={{ fontSize: 10, fontWeight: 500, color: active ? C.blue : C.muted }}>{t}</span>
                {active && <div style={{ width: 4, height: 4, borderRadius: 2, background: C.blue }} />}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 3, background: C.text, opacity: 0.2 }} />
      </div>
    </div>
  );
}

/* ─── Screen contents ─── */

function DashScreen({ C, n }: { C: Record<string, string>; n: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>{n ? "Overzicht" : "Overview"}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[[n?"Openstaand":"Outstanding","€ 1.280",C.blue],[n?"Achterstallig":"Overdue","2",C.red],[n?"Binnenkort":"Upcoming","3",C.amber],[n?"Betaald":"Paid","€ 4.520",C.green]].map(([l,v,c]) => (
          <div key={l as string} style={{ background: `${c}11`, borderRadius: 12, border: `1px solid ${C.border}`, padding: "10px 12px" }}>
            <div style={{ width: 28, height: 3, borderRadius: 2, background: c as string, marginBottom: 6 }} />
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{l}</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: c as string, margin: "2px 0 0" }}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}>
        <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{n ? "Mijn schulden" : "My debt"}</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "4px 0 0" }}>€ 1.280,00</p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.green }}>€ 760,98 {n ? "bespaard" : "saved"}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[n?"Scan rekening":"Scan bill", n?"Scan e-mail":"Scan email"].map(l => (
          <div key={l} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 0", fontSize: 12, fontWeight: 600, color: C.text }}>{l}</div>
        ))}
      </div>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: "0 0 8px" }}>{n ? "Hoe voel je je?" : "How do you feel?"}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["😰","😟","😐","😌","😊"].map((e,i) => (
            <div key={i} style={{ width: 44, height: 44, borderRadius: 10, border: i===3?`2px solid ${C.blue}`:`1px solid ${C.border}`, background: i===3?`${C.blue}15`:"transparent", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{e}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PayScreen({ C, n }: { C: Record<string, string>; n: boolean }) {
  const bills = [
    { v:"Vattenfall",a:n?"€ 400,00":"€ 400.00",s:n?"Incasso":"Collection",c:C.red,od:true },
    { v:"VGZ",a:n?"€ 280,00":"€ 280.00",s:n?"Factuur":"Invoice",c:C.blue,od:false },
    { v:"T-Mobile",a:n?"€ 200,00":"€ 200.00",s:n?"Herinnering":"Reminder",c:C.amber,od:false },
    { v:"Ziggo",a:n?"€ 89,95":"€ 89.95",s:n?"Factuur":"Invoice",c:C.blue,od:false },
    { v:n?"Gemeente":"Municipal",a:n?"€ 310,05":"€ 310.05",s:n?"Aanmaning":"Notice",c:"#EA580C",od:true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>{n ? "Betalingen" : "Payments"}</h1>
        <div style={{ background: C.blue, borderRadius: 4, padding: "6px 10px", color: "#fff", fontSize: 12, fontWeight: 600 }}>{n ? "+ Toevoegen" : "+ Add"}</div>
      </div>
      <div style={{ display: "flex", gap: 3, background: `${C.border}55`, borderRadius: 8, padding: 3 }}>
        {(n?["Openstaand","Binnenkort","Achterstallig","Betaald"]:["Outstanding","Upcoming","Overdue","Paid"]).map((t,i) => (
          <div key={t} style={{ flex: 1, textAlign: "center", borderRadius: 6, padding: "5px 0", fontSize: 10, fontWeight: 600, background: i===0?C.surface:"transparent", color: i===0?C.text:C.muted, boxShadow: i===0?"0 1px 3px rgba(0,0,0,0.12)":"none" }}>{t}</div>
        ))}
      </div>
      {bills.map((b,i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: b.od?`${C.red}0A`:C.surface, border: `1px solid ${b.od?`${C.red}22`:C.border}`, borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{b.v}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: b.c }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: b.c }}>{b.s}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{b.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsScreen({ C, n }: { C: Record<string, string>; n: boolean }) {
  const r = 38; const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>{n ? "Statistieken" : "Statistics"}</h1>
      <div style={{ background: `${C.amber}11`, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <svg width="86" height="86" viewBox="0 0 86 86" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
          <circle cx="43" cy="43" r={r} fill="none" stroke={C.border} strokeWidth="7" />
          <circle cx="43" cy="43" r={r} fill="none" stroke={C.amber} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(60/100)*circ} ${circ}`} />
          <text x="43" y="47" textAnchor="middle" fill={C.amber} fontSize="24" fontWeight="800" transform="rotate(90 43 43)">60</text>
        </svg>
        <div>
          <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{n ? "Financiële gezondheid" : "Financial health"}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.amber, margin: "2px 0" }}>{n ? "Kan beter" : "Needs work"}</p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.3 }}>{n ? "Score: betaalgedrag & escalaties" : "Score: payment behavior & escalations"}</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[["On-time","53%",C.green],["Streak","1",C.blue],[n?"Bespaard":"Saved","€ 760",C.green],[n?"Achterstallig":"Overdue","2",C.red]].map(([l,v,c]) => (
          <div key={l as string} style={{ background: `${c}11`, borderRadius: 12, border: `1px solid ${C.border}`, padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{l}</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: c as string, margin: "2px 0" }}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: "0 0 10px" }}>{n ? "Per categorie" : "By category"}</h3>
        {[{n:n?"Nutsvoorzieningen":"Utilities",a:"€ 400",p:100},{n:n?"Overheid":"Government",a:"€ 310",p:78},{n:n?"Zorg":"Healthcare",a:"€ 280",p:70}].map(c => (
          <div key={c.n} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: C.text }}>{c.n}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{c.a}</span>
            </div>
            <div style={{ height: 5, width: "100%", borderRadius: 3, background: `${C.border}88` }}>
              <div style={{ height: 5, borderRadius: 3, background: C.blue, width: `${c.p}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CashScreen({ C, n }: { C: Record<string, string>; n: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>Cashflow</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: `${C.green}11`, borderRadius: 12, border: `1px solid ${C.border}`, padding: "10px 12px" }}>
          <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{n ? "Verwacht in" : "Expected in"}</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: C.green, margin: "2px 0" }}>€ 4.200</p>
        </div>
        <div style={{ background: `${C.red}11`, borderRadius: 12, border: `1px solid ${C.border}`, padding: "10px 12px" }}>
          <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{n ? "Verwacht uit" : "Expected out"}</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: C.red, margin: "2px 0" }}>€ 2.194</p>
        </div>
      </div>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: "0 0 10px" }}>{n ? "Voorspelling" : "Forecast"}</h3>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 90 }}>
          {[{l:"W1",i:2100,o:1280},{l:"W2",i:0,o:490},{l:"W3",i:2100,o:276},{l:"W4",i:0,o:148}].map(b => (
            <div key={b.l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 72 }}>
                <div style={{ flex: 1, background: C.green, borderRadius: "3px 3px 0 0", height: `${Math.max(4,(b.i/2100)*100)}%`, opacity: b.i?1:0.15 }} />
                <div style={{ flex: 1, background: C.red, borderRadius: "3px 3px 0 0", height: `${Math.max(4,(b.o/2100)*100)}%` }} />
              </div>
              <span style={{ fontSize: 9, color: C.muted }}>{b.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: "0 0 8px" }}>{n ? "Binnenkort" : "Upcoming"}</h3>
        {[{v:"VGZ",a:"€ 280",d:"20 mrt"},{v:"T-Mobile",a:"€ 200",d:"21 mrt"},{v:"Ziggo",a:"€ 90",d:"25 mrt"},{v:"Vattenfall",a:"€ 128",d:"1 apr"}].map((b,i) => (
          <div key={b.v} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i<3?`1px solid ${C.border}`:"none" }}>
            <div style={{ width: 36, textAlign: "center" }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: i===0?C.amber:C.muted, margin: 0 }}>{b.d}</p>
            </div>
            <div style={{ width: 2, height: 20, background: i===0?C.amber:C.border, borderRadius: 1 }} />
            <div style={{ flex: 1 }}><p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: 0 }}>{b.v}</p></div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, margin: 0 }}>{b.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
