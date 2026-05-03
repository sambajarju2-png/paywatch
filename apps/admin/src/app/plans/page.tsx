"use client";

import { useState, useEffect } from "react";

const C = { navy: "#0A2540", blue: "#2563EB", green: "#059669", amber: "#D97706", red: "#DC2626", purple: "#7C3AED", muted: "#64748B", border: "#E2E8F0" };

const PLAN_META: Record<string, { label: string; color: string; bg: string; price: string }> = {
  gratis:          { label: "Gratis",              color: C.muted,   bg: "#F8FAFC", price: "€0" },
  pro_monthly:     { label: "Pro (maand)",          color: C.blue,    bg: "#EFF6FF", price: "€4,99/mo" },
  pro_yearly:      { label: "Pro (jaar)",           color: C.blue,    bg: "#EFF6FF", price: "€49,90/jr" },
  premium_monthly: { label: "Premium (maand)",      color: C.purple,  bg: "#F5F3FF", price: "€9,99/mo" },
  premium_yearly:  { label: "Premium (jaar)",       color: C.purple,  bg: "#F5F3FF", price: "€99,90/jr" },
};

const FEATURES = [
  { key: "ai_insights_enabled",    label: "AI Inzichten",       desc: "Persoonlijke financiële inzichten via Claude" },
  { key: "ai_chat_enabled",        label: "AI Chat",            desc: "PayBuddy AI chatbot" },
  { key: "dispute_letters_enabled",label: "Bezwaarbrieven",     desc: "AI-gegenereerde bezwaarbrieven" },
  { key: "bank_sync_enabled",      label: "Bank koppeling",     desc: "GoCardless/PSD2 bankrekening sync" },
  { key: "export_reports_enabled", label: "Rapporten export",   desc: "PDF/CSV exporteren" },
  { key: "enforce_voice_limits",   label: "Belminuten handhaven", desc: "Actief bellen limiet afdwingen" },
  { key: "enforce_chat_limits",    label: "Chat limiet handhaven", desc: "Dagelijks chatbericht limiet afdwingen" },
];

interface PlanRule {
  plan_id: string;
  display_name: string;
  voice_seconds_per_month: number;
  chat_messages_per_day: number;
  ai_insights_enabled: boolean;
  ai_chat_enabled: boolean;
  dispute_letters_enabled: boolean;
  bank_sync_enabled: boolean;
  export_reports_enabled: boolean;
  enforce_voice_limits: boolean;
  enforce_chat_limits: boolean;
  updated_at: string;
}

function formatMinutes(seconds: number) {
  if (seconds >= 99999) return "∞";
  return `${Math.floor(seconds / 60)} min`;
}

export default function PlansPage() {
  const [rules, setRules] = useState<PlanRule[]>([]);
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({});
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/plans")
      .then(r => r.json())
      .then(d => { setRules(d.rules || []); setPlanCounts(d.planCounts || {}); setRevenue(d.revenue || 0); })
      .finally(() => setLoading(false));
  }, []);

  async function toggle(planId: string, field: string, current: boolean) {
    setSaving(`${planId}:${field}`);
    const newVal = !current;
    const res = await fetch("/api/admin/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId, [field]: newVal }),
    });
    if (res.ok) {
      setRules(prev => prev.map(r => r.plan_id === planId ? { ...r, [field]: newVal } : r));
    } else alert("Opslaan mislukt");
    setSaving(null);
  }

  async function updateNumber(planId: string, field: string, value: number) {
    setSaving(`${planId}:${field}`);
    const res = await fetch("/api/admin/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId, [field]: value }),
    });
    if (res.ok) {
      setRules(prev => prev.map(r => r.plan_id === planId ? { ...r, [field]: value } : r));
    } else alert("Opslaan mislukt");
    setSaving(null);
  }

  const totalPaying = Object.entries(planCounts)
    .filter(([plan]) => plan !== "gratis")
    .reduce((s, [, n]) => s + n, 0);
  const totalUsers = Object.values(planCounts).reduce((s, n) => s + n, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A2540] tracking-tight">Plannen & Rechten</h1>
          <p className="text-sm text-[#64748B] mt-1">Beheer wat gebruikers per plan kunnen doen</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Totaal gebruikers", value: totalUsers, color: C.navy },
          { label: "Betaalde gebruikers", value: totalPaying, color: C.blue },
          { label: "Conversie", value: totalUsers > 0 ? `${Math.round(totalPaying/totalUsers*100)}%` : "0%", color: C.green },
          { label: "MRR (schatting)", value: `€${(revenue/100).toFixed(0)}`, color: C.purple },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wide mb-2">{k.label}</p>
            <p className="text-[28px] font-extrabold leading-none" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-5 gap-3">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {rules.map(rule => {
            const meta = PLAN_META[rule.plan_id] || PLAN_META.gratis;
            const count = planCounts[rule.plan_id] || 0;
            return (
              <div key={rule.plan_id} className="bg-white rounded-2xl border border-[#E2E8F0] flex flex-col" style={{ borderTopColor: meta.color, borderTopWidth: 3 }}>
                {/* Plan header */}
                <div className="p-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold" style={{ color: meta.color }}>{meta.label}</span>
                    <span className="text-[11px] font-semibold text-[#64748B]">{meta.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[22px] font-extrabold text-[#0A2540]">{count}</span>
                    <span className="text-[11px] text-[#64748B]">gebruikers</span>
                  </div>
                </div>

                {/* Numeric limits */}
                <div className="p-4 border-b border-[#E2E8F0] space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">PayBuddy</label>
                    <select
                      value={rule.voice_seconds_per_month}
                      onChange={e => updateNumber(rule.plan_id, "voice_seconds_per_month", parseInt(e.target.value))}
                      disabled={saving?.startsWith(rule.plan_id)}
                      className="w-full text-[12px] font-semibold px-2 py-1.5 rounded-lg border border-[#E2E8F0] outline-none text-[#0A2540]"
                    >
                      <option value={300}>5 min</option>
                      <option value={600}>10 min</option>
                      <option value={1800}>30 min</option>
                      <option value={3600}>60 min</option>
                      <option value={7200}>2 uur</option>
                      <option value={99999}>Onbeperkt</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">Chat/dag</label>
                    <select
                      value={rule.chat_messages_per_day}
                      onChange={e => updateNumber(rule.plan_id, "chat_messages_per_day", parseInt(e.target.value))}
                      disabled={saving?.startsWith(rule.plan_id)}
                      className="w-full text-[12px] font-semibold px-2 py-1.5 rounded-lg border border-[#E2E8F0] outline-none text-[#0A2540]"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={-1}>Onbeperkt</option>
                    </select>
                  </div>
                </div>

                {/* Feature toggles */}
                <div className="p-4 flex-1 space-y-2">
                  {FEATURES.map(f => {
                    const enabled = rule[f.key as keyof PlanRule] as boolean;
                    const key = `${rule.plan_id}:${f.key}`;
                    return (
                      <button
                        key={f.key}
                        onClick={() => toggle(rule.plan_id, f.key, enabled)}
                        disabled={saving === key}
                        title={f.desc}
                        className="w-full flex items-center justify-between py-1.5 px-0 text-left hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        <span className={`text-[11px] font-medium ${enabled ? "text-[#0A2540]" : "text-[#94A3B8]"}`}>{f.label}</span>
                        <div className={`w-8 h-4 rounded-full relative flex-shrink-0 transition-colors ${enabled ? "bg-[#059669]" : "bg-[#E2E8F0]"}`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${enabled ? "left-4" : "left-0.5"}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-[#94A3B8] mt-4">
        Wijzigingen worden direct opgeslagen. Stripe/RevenueCat webhooks worden later gekoppeld voor automatische planwisselingen.
      </p>
    </div>
  );
}
