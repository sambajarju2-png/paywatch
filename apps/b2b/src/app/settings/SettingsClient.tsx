"use client";

import { useState } from "react";

const FEATURE_LABELS: Record<string, { label: string; desc: string }> = {
  bank_sync: { label: "Bankrekening koppeling", desc: "Open banking verbinding" },
  ai_insights: { label: "AI inzichten", desc: "Slimme suggesties en voorspellingen" },
  payment_plans: { label: "Betalingsregelingen", desc: "Regelingen beheren en volgen" },
  community: { label: "Community feed", desc: "Gebruikers kunnen ervaringen delen" },
  camera_scan: { label: "Camera scan", desc: "Rekeningen scannen met camera" },
  buddy_system: { label: "Coach systeem", desc: "Coaches koppelen aan clienten" },
  spending_analytics: { label: "Uitgavenanalyse", desc: "Inzicht in bestedingspatronen" },
  push_notifications: { label: "Push notificaties", desc: "Herinneringen en waarschuwingen" },
  export_reports: { label: "Rapportage export", desc: "Download PDF/CSV rapporten" },
  escalation_alerts: { label: "Escalatie meldingen", desc: "Waarschuwing bij verslechtering" },
};

export default function SettingsClient({ org, orgId }: { org: any; orgId: string }) {
  const [data, setData] = useState(org);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const features = data.features || {};

  function toggleFeature(key: string) {
    setData({ ...data, features: { ...features, [key]: !features[key] } });
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.error) setMessage("Fout: " + result.error);
      else setMessage("Opgeslagen!");
    } catch { setMessage("Er ging iets mis"); }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Instellingen</h1>
          <p className="text-sm text-pw-muted mt-1">Beheer branding, functies en contactgegevens</p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className={`text-sm font-semibold ${message.startsWith("Fout") ? "text-pw-red" : "text-pw-green"}`}>{message}</span>}
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-pw-blue text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? "Opslaan..." : "Wijzigingen opslaan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Settings — 2 cols */}
        <div className="col-span-2 space-y-4">
          {/* Branding */}
          <div className="bg-white border border-pw-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-pw-navy mb-4">Branding</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Hoofdkleur</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={data.primary_color || "#2563EB"} onChange={e => setData({ ...data, primary_color: e.target.value })}
                    className="w-10 h-9 border border-pw-border rounded cursor-pointer" />
                  <input value={data.primary_color || ""} onChange={e => setData({ ...data, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-pw-border rounded-lg text-sm font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Website (logo)</label>
                <input value={data.website || ""} onChange={e => setData({ ...data, website: e.target.value })}
                  placeholder="organisatie.nl"
                  className="w-full px-3 py-2 border border-pw-border rounded-lg text-sm" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Welkomsttekst</label>
              <textarea value={data.custom_intro_text || ""} onChange={e => setData({ ...data, custom_intro_text: e.target.value })}
                rows={2} placeholder="Welkom bij het portaal van..."
                className="w-full px-3 py-2 border border-pw-border rounded-lg text-sm resize-y" />
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white border border-pw-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-pw-navy mb-4">Contactgegevens</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Contactpersoon</label>
                <input value={data.contact_name || ""} onChange={e => setData({ ...data, contact_name: e.target.value })}
                  className="w-full px-3 py-2 border border-pw-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">E-mail</label>
                <input value={data.contact_email || ""} onChange={e => setData({ ...data, contact_email: e.target.value })}
                  className="w-full px-3 py-2 border border-pw-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Stad</label>
                <input value={data.city || ""} onChange={e => setData({ ...data, city: e.target.value })}
                  className="w-full px-3 py-2 border border-pw-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">KvK</label>
                <input value={data.kvk_number || ""} onChange={e => setData({ ...data, kvk_number: e.target.value })}
                  className="w-full px-3 py-2 border border-pw-border rounded-lg text-sm" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white border border-pw-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-pw-navy mb-4">Functies</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(FEATURE_LABELS).map(([key, { label, desc }]) => {
                const enabled = features[key] ?? false;
                return (
                  <button key={key} type="button" onClick={() => toggleFeature(key)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${enabled ? "border-pw-blue/20 bg-blue-50/30" : "border-pw-border bg-white hover:bg-pw-bg"}`}>
                    <div>
                      <div className="text-sm font-semibold text-pw-text">{label}</div>
                      <div className="text-xs text-pw-muted mt-0.5">{desc}</div>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ml-3 ${enabled ? "bg-pw-blue" : "bg-gray-200"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${enabled ? "left-5" : "left-0.5"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live preview — 1 col */}
        <div className="col-span-1">
          <div className="bg-white border border-pw-border rounded-2xl p-6 sticky top-6">
            <h2 className="text-base font-bold text-pw-navy mb-4">Live voorbeeld</h2>

            {/* Header preview */}
            <div className="rounded-xl overflow-hidden border border-pw-border mb-4">
              <div style={{ backgroundColor: data.primary_color || "#2563EB", padding: "16px 20px" }} className="flex items-center gap-2">
                {data.logo_url && <img src={data.logo_url} alt="" className="w-6 h-6 rounded" />}
                <span style={{ color: data.secondary_color || "#FFFFFF" }} className="text-sm font-bold">{data.name}</span>
                <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>via PayWatch</span>
              </div>
              <div className="p-3 bg-white">
                <div className="text-xs text-pw-muted">{data.custom_intro_text || "Welkomsttekst..."}</div>
              </div>
            </div>

            {/* Button preview */}
            <button className="w-full py-2 rounded text-sm font-semibold text-white mb-2"
              style={{ backgroundColor: data.primary_color || "#2563EB" }}>
              Primaire actie
            </button>

            {/* Color palette */}
            <div className="mt-4 pt-4 border-t border-pw-border">
              <p className="text-[10px] font-bold text-pw-muted uppercase tracking-wider mb-2">Kleurenpalet</p>
              <div className="flex gap-2">
                <div className="flex-1 h-8 rounded-lg" style={{ backgroundColor: data.primary_color || "#2563EB" }} />
                <div className="flex-1 h-8 rounded-lg bg-pw-navy" />
                <div className="flex-1 h-8 rounded-lg bg-pw-green" />
                <div className="flex-1 h-8 rounded-lg bg-pw-amber" />
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 pt-4 border-t border-pw-border space-y-2 text-xs text-pw-muted">
              <div className="flex justify-between"><span>Contact</span><span className="font-medium text-pw-text">{data.contact_email || "—"}</span></div>
              <div className="flex justify-between"><span>Stad</span><span className="font-medium text-pw-text">{data.city || "—"}</span></div>
              <div className="flex justify-between"><span>KvK</span><span className="font-medium text-pw-text">{data.kvk_number || "—"}</span></div>
              <div className="flex justify-between"><span>Tier</span><span className="font-medium text-pw-text">{data.tier || "—"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
