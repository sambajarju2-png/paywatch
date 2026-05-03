"use client";

import { useState, useEffect } from "react";

const C = { navy: "#0A2540", blue: "#2563EB", green: "#059669", amber: "#D97706", red: "#DC2626", purple: "#7C3AED", muted: "#64748B", border: "#E2E8F0" };

const PLAN_META: Record<string, { label: string; color: string; bg: string }> = {
  pro_monthly:     { label: "Pro /mo",    color: C.blue,   bg: "#EFF6FF" },
  pro_yearly:      { label: "Pro /jr",    color: C.blue,   bg: "#EFF6FF" },
  premium_monthly: { label: "Premium /mo",color: C.purple, bg: "#F5F3FF" },
  premium_yearly:  { label: "Premium /jr",color: C.purple, bg: "#F5F3FF" },
};

const PROVIDER_META: Record<string, { label: string; color: string }> = {
  stripe:      { label: "Stripe",      color: C.blue },
  revenuecat:  { label: "RevenueCat",  color: C.purple },
  manual:      { label: "Handmatig",   color: C.muted },
};

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  active:    { label: "Actief",     color: C.green,  dot: C.green },
  cancelled: { label: "Opgezegd",   color: C.amber,  dot: C.amber },
  expired:   { label: "Verlopen",   color: C.red,    dot: C.red },
  past_due:  { label: "Achterstal", color: C.red,    dot: C.red },
  trialing:  { label: "Trial",      color: C.blue,   dot: C.blue },
};

interface PayingUser {
  user_id: string;
  name: string;
  email: string;
  plan: string;
  voice_seconds_used: number;
  last_active_at: string | null;
  created_at: string;
  payment_provider: string;
  sub_status: string;
  period_end: string | null;
  cancel_at_end: boolean;
  mrr_cents: number;
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

function relativeTime(d: string | null) {
  if (!d) return "Nooit";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Vandaag";
  if (days === 1) return "Gisteren";
  if (days < 30) return `${days}d geleden`;
  return formatDate(d);
}

export default function PayingUsersPage() {
  const [users, setUsers] = useState<PayingUser[]>([]);
  const [mrr, setMrr] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [addModal, setAddModal] = useState<string | null>(null); // user_id
  const [addForm, setAddForm] = useState({ plan_id: "pro_monthly", payment_provider: "manual", sub_status: "active" });
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/paying-users");
    const d = await res.json();
    setUsers(d.users || []);
    setMrr(d.mrr || 0);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? users
    : filter === "pro" ? users.filter(u => u.plan.startsWith("pro"))
    : filter === "premium" ? users.filter(u => u.plan.startsWith("premium"))
    : filter === "cancelled" ? users.filter(u => u.sub_status === "cancelled" || u.cancel_at_end)
    : users;

  async function manualAdd(userId: string) {
    setAdding(true);
    const res = await fetch("/api/admin/paying-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, ...addForm }),
    });
    if (res.ok) { setAddModal(null); await load(); }
    else alert("Opslaan mislukt");
    setAdding(false);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A2540] tracking-tight">Betalende gebruikers</h1>
          <p className="text-sm text-[#64748B] mt-1">Overzicht van alle Pro en Premium abonnementen</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-xs text-amber-700 font-medium">Stripe/RevenueCat nog niet gekoppeld — handmatige data</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Betalende users", value: users.length, color: C.blue },
          { label: "Pro", value: users.filter(u => u.plan.startsWith("pro")).length, color: C.blue },
          { label: "Premium", value: users.filter(u => u.plan.startsWith("premium")).length, color: C.purple },
          { label: "MRR (schatting)", value: `€${(mrr/100).toFixed(0)}`, color: C.green, sub: "Zal accuraat zijn na Stripe koppeling" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wide mb-2">{k.label}</p>
            <p className="text-[28px] font-extrabold leading-none" style={{ color: k.color }}>{k.value}</p>
            {k.sub && <p className="text-[10px] text-[#94A3B8] mt-1">{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl w-fit mb-5">
        {[["all","Alle"], ["pro","Pro"], ["premium","Premium"], ["cancelled","Opgezegd"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${filter === v ? "bg-white text-[#0A2540] shadow-sm" : "text-[#64748B]"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full" style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr className="bg-[#FAFBFC] border-b border-[#E2E8F0]">
              {["Gebruiker","Plan","Betaalprovider","Status","Periode einde","Beltijd","Actief","MRR"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-12 text-center text-[#64748B] text-sm">Laden...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-[#64748B] text-sm">
                Geen betalende gebruikers gevonden.
                {filter === "all" && " Voeg handmatig toe of koppel Stripe/RevenueCat."}
              </td></tr>
            ) : filtered.map((u, i) => {
              const planMeta = PLAN_META[u.plan];
              const provMeta = PROVIDER_META[u.payment_provider] || PROVIDER_META.manual;
              const statMeta = STATUS_META[u.sub_status] || STATUS_META.active;
              const voicePct = u.plan.startsWith("pro") ? Math.min(100, Math.round(u.voice_seconds_used/3600*100)) : 0;
              return (
                <tr key={u.user_id} className={`border-b border-[#F8FAFC] ${i % 2 === 0 ? "" : "bg-[#FAFBFC]/50"} hover:bg-[#F8FAFC]`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-[#0A2540]">{u.name || "—"}</p>
                      <p className="text-[11px] text-[#64748B]">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {planMeta && (
                      <span className="text-[11px] font-bold px-2 py-1 rounded-lg" style={{ background: planMeta.bg, color: planMeta.color }}>
                        {planMeta.label}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-medium" style={{ color: provMeta.color }}>{provMeta.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: statMeta.color }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: statMeta.dot }} />
                      {statMeta.label}
                      {u.cancel_at_end && <span className="text-[10px] text-[#D97706] ml-1">↓ einde termijn</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{formatDate(u.period_end)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#F1F5F9] rounded-full">
                        <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${voicePct}%` }} />
                      </div>
                      <span className="text-[11px] text-[#64748B]">{Math.floor(u.voice_seconds_used/60)}m</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{relativeTime(u.last_active_at)}</td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#0A2540]">
                    €{(u.mrr_cents/100).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-[#94A3B8] mt-4">
        MRR berekend op vaste prijzen (Pro €4,99/mo, Premium €9,99/mo). Exacte data beschikbaar na Stripe/RevenueCat koppeling.
      </p>
    </div>
  );
}
