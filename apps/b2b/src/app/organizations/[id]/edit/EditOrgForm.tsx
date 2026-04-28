"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FEATURE_LABELS: Record<string, string> = {
  bank_sync: "Bankrekening koppeling",
  ai_insights: "AI inzichten",
  payment_plans: "Betalingsregelingen",
  community: "Community feed",
  camera_scan: "Camera scan",
  buddy_system: "Buddy / coach systeem",
  spending_analytics: "Uitgavenanalyse",
  push_notifications: "Push notificaties",
  export_reports: "Rapportage export",
  escalation_alerts: "Escalatie waarschuwingen",
};

export default function EditOrgForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [org, setOrg] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("organizations").select("*").eq("id", orgId).single();
      if (data) setOrg(data);
    }
    load();
  }, [orgId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(org),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setMessage("Opgeslagen!");
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  }

  async function fetchLogo() {
    if (!org?.website) return;
    const domain = org.website.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const res = await fetch(`/api/logo?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    if (data.logoUrl) setOrg({ ...org, logo_url: data.logoUrl });
  }

  function toggleFeature(key: string) {
    const features = { ...org.features };
    features[key] = !features[key];
    setOrg({ ...org, features });
  }

  if (!org) {
    return (
      <div style={{ padding: "32px 40px" }}>
        <div className="text-label text-pw-muted">Laden...</div>
      </div>
    );
  }

  const features = org.features || {};

  return (
    <div style={{ padding: "32px 40px", maxWidth: 720 }}>
      <a href={`/organizations/${orgId}`} className="text-label text-pw-muted no-underline block mb-4">&larr; Terug</a>
      <h1 className="text-page-heading text-pw-text mb-6">Organisatie bewerken</h1>

      <form onSubmit={handleSave}>
        <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-4">
          <h2 className="text-card-title text-pw-text mb-4">Algemeen</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Naam</label>
              <input value={org.name || ""} onChange={e => setOrg({...org, name: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Status</label>
              <select value={org.status} onChange={e => setOrg({...org, status: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label bg-white">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Tier</label>
              <select value={org.tier} onChange={e => setOrg({...org, tier: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label bg-white">
                <option value="pilot">Pilot</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Type</label>
              <div className="px-3 py-2 bg-pw-bg border border-pw-border rounded-input text-label text-pw-muted">{org.type}</div>
            </div>
          </div>
        </div>

        {/* Features toggle grid */}
        <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-4">
          <h2 className="text-card-title text-pw-text mb-4">Features</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(FEATURE_LABELS).map((key) => {
              const enabled = features[key] ?? false;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFeature(key)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-colors"
                  style={{
                    background: enabled ? "rgba(5, 150, 105, 0.06)" : "transparent",
                    border: `1px solid ${enabled ? "rgba(5, 150, 105, 0.2)" : "#E2E8F0"}`,
                  }}
                >
                  <div
                    className="flex-shrink-0 rounded-md flex items-center justify-center"
                    style={{
                      width: 32, height: 32,
                      background: enabled ? "#059669" : "#E2E8F0",
                      transition: "background 0.15s ease",
                    }}
                  >
                    {enabled && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-label font-medium text-pw-text">{FEATURE_LABELS[key]}</div>
                    <div className="text-caption text-pw-muted">{enabled ? "Aan" : "Uit"}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-4">
          <h2 className="text-card-title text-pw-text mb-4">Branding</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Hoofdkleur</label>
              <div className="flex items-center gap-2">
                <input type="color" value={org.primary_color || "#2563EB"} onChange={e => setOrg({...org, primary_color: e.target.value})}
                  className="w-10 h-9 border border-pw-border rounded cursor-pointer" />
                <input value={org.primary_color || ""} onChange={e => setOrg({...org, primary_color: e.target.value})}
                  className="flex-1 px-3 py-2 border border-pw-border rounded-input text-label font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Tekstkleur</label>
              <div className="flex items-center gap-2">
                <input type="color" value={org.secondary_color || "#FFFFFF"} onChange={e => setOrg({...org, secondary_color: e.target.value})}
                  className="w-10 h-9 border border-pw-border rounded cursor-pointer" />
                <input value={org.secondary_color || ""} onChange={e => setOrg({...org, secondary_color: e.target.value})}
                  className="flex-1 px-3 py-2 border border-pw-border rounded-input text-label font-mono" />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-caption text-pw-muted font-medium mb-1">Website (voor logo)</label>
            <div className="flex gap-2">
              <input value={org.website || ""} onChange={e => setOrg({...org, website: e.target.value})}
                placeholder="gemeente.nl"
                className="flex-1 px-3 py-2 border border-pw-border rounded-input text-label" />
              <button type="button" onClick={fetchLogo}
                className="px-3 py-2 bg-pw-navy text-white rounded-button text-caption font-semibold cursor-pointer border-none">
                Logo ophalen
              </button>
            </div>
          </div>
          {org.logo_url && (
            <div className="mt-3 flex items-center gap-3">
              <img src={org.logo_url} alt="" className="w-12 h-12 rounded-lg object-contain border border-pw-border" />
              <input value={org.logo_url || ""} onChange={e => setOrg({...org, logo_url: e.target.value})}
                className="flex-1 px-3 py-2 border border-pw-border rounded-input text-caption" />
            </div>
          )}
          <div className="mt-3">
            <label className="block text-caption text-pw-muted font-medium mb-1">Welkomsttekst</label>
            <textarea value={org.custom_intro_text || ""} onChange={e => setOrg({...org, custom_intro_text: e.target.value})}
              rows={2} placeholder="Welkom bij het portaal van..."
              className="w-full px-3 py-2 border border-pw-border rounded-input text-label resize-y" />
          </div>
          {/* Preview */}
          <div className="mt-4 rounded-lg overflow-hidden border border-pw-border">
            <div style={{ background: org.primary_color || "#2563EB", padding: "10px 16px" }} className="flex items-center gap-2">
              {org.logo_url && <img src={org.logo_url} alt="" className="w-5 h-5 rounded" />}
              <span style={{ color: org.secondary_color || "#FFFFFF" }} className="text-label font-semibold">{org.name}</span>
            </div>
            <div className="bg-white p-3 text-caption text-pw-muted">Header preview</div>
          </div>
        </div>

        <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-4">
          <h2 className="text-card-title text-pw-text mb-4">Contact</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Contactpersoon</label>
              <input value={org.contact_name || ""} onChange={e => setOrg({...org, contact_name: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">E-mail</label>
              <input value={org.contact_email || ""} onChange={e => setOrg({...org, contact_email: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Stad</label>
              <input value={org.city || ""} onChange={e => setOrg({...org, city: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">KvK</label>
              <input value={org.kvk_number || ""} onChange={e => setOrg({...org, kvk_number: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
          </div>
        </div>

        {message && <div className="p-3 bg-pw-green-light border border-green-200 rounded-card text-label text-pw-green font-medium mb-4">{message}</div>}
        {error && <div className="p-3 bg-pw-red-light border border-red-200 rounded-card text-label text-pw-red mb-4">{error}</div>}

        <button type="submit" disabled={saving}
          className="w-full px-4 py-3 bg-pw-navy text-white rounded-button text-label font-semibold disabled:opacity-50 cursor-pointer border-none">
          {saving ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </form>
    </div>
  );
}
