"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FEATURE_FLAGS, FEATURE_LABELS, tierIncludes } from "@paywatch/config";

export default function EditOrgForm({ orgId, initialData }: { orgId: string; initialData: any }) {
  const router = useRouter();
  const [org, setOrg] = useState<any>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [priceEuro, setPriceEuro] = useState(initialData?.price_per_seat != null ? String(initialData.price_per_seat / 100) : "");
  const [monthlyEuro, setMonthlyEuro] = useState(initialData?.monthly_fee != null ? String(initialData.monthly_fee / 100) : "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...org,
        price_per_seat: priceEuro === "" ? null : Math.round(parseFloat(priceEuro) * 100),
        monthly_fee: monthlyEuro === "" ? null : Math.round(parseFloat(monthlyEuro) * 100),
      };
      const res = await fetch(`/api/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  async function uploadLogo(file: File) {
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("slug", org?.slug || "org");
      const res = await fetch("/api/logo/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.logoUrl) setOrg({ ...org, logo_url: data.logoUrl });
      else setError(data.error || "Upload mislukt");
    } catch {
      setError("Upload mislukt");
    }
  }

  function toggleFeature(key: string) {
    const features = { ...org.features };
    features[key] = !features[key];
    setOrg({ ...org, features });
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
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="churned">Churned</option>
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
            {FEATURE_FLAGS.map((key) => {
              const allowed = tierIncludes(org.tier, key);
              const enabled = allowed && features[key] === true;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!allowed}
                  onClick={() => { if (allowed) toggleFeature(key); }}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-colors"
                  style={{
                    background: enabled ? "rgba(5, 150, 105, 0.06)" : "transparent",
                    border: `1px solid ${enabled ? "rgba(5, 150, 105, 0.2)" : "#E2E8F0"}`,
                    opacity: allowed ? 1 : 0.45,
                    cursor: allowed ? "pointer" : "not-allowed",
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
                    <div className="text-caption text-pw-muted">{allowed ? (enabled ? "Aan" : "Uit") : "Niet in tier"}</div>
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
          <div className="mt-3">
            <label className="block text-caption text-pw-muted font-medium mb-1">Of upload een logo (PNG, JPG, SVG · max 2MB)</label>
            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
              className="text-caption text-pw-muted" />
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
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Telefoon</label>
              <input value={org.contact_phone || ""} onChange={e => setOrg({...org, contact_phone: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
          </div>
        </div>

        <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-4">
          <h2 className="text-card-title text-pw-text mb-4">Facturering & contract</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Seat-limiet</label>
              <input type="number" min={0} value={org.seat_limit ?? ""} onChange={e => setOrg({...org, seat_limit: e.target.value === "" ? null : parseInt(e.target.value, 10)})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Facturatieperiode</label>
              <select value={org.billing_period || "monthly"} onChange={e => setOrg({...org, billing_period: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label bg-white">
                <option value="monthly">Maandelijks</option>
                <option value="quarterly">Per kwartaal</option>
                <option value="annual">Jaarlijks</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Prijs per seat (€)</label>
              <input type="number" min={0} step="0.01" value={priceEuro} onChange={e => setPriceEuro(e.target.value)}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Maandbedrag (€)</label>
              <input type="number" min={0} step="0.01" value={monthlyEuro} onChange={e => setMonthlyEuro(e.target.value)}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Contract start</label>
              <input type="date" value={(org.contract_start_at || "").slice(0, 10)} onChange={e => setOrg({...org, contract_start_at: e.target.value || null})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Contract eind</label>
              <input type="date" value={(org.contract_end_at || "").slice(0, 10)} onChange={e => setOrg({...org, contract_end_at: e.target.value || null})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Facturatie-e-mail</label>
              <input value={org.billing_email || ""} onChange={e => setOrg({...org, billing_email: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
            <div>
              <label className="block text-caption text-pw-muted font-medium mb-1">Factuurreferentie</label>
              <input value={org.invoice_reference || ""} onChange={e => setOrg({...org, invoice_reference: e.target.value})}
                className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-caption text-pw-muted font-medium mb-1">Notities</label>
            <textarea value={org.billing_notes || ""} onChange={e => setOrg({...org, billing_notes: e.target.value})}
              rows={2} className="w-full px-3 py-2 border border-pw-border rounded-input text-label resize-y" />
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
