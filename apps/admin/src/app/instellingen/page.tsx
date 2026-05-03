"use client";

import { useState, useEffect } from "react";

const C = { navy: "#0A2540", blue: "#2563EB", green: "#059669", muted: "#64748B", border: "#E2E8F0" };

const FIELD_META: Record<string, { label: string; placeholder: string; icon: string }> = {
  iban:              { label: "IBAN",              placeholder: "NL00 INGB 0000 0000 00",  icon: "🏦" },
  bic:               { label: "BIC/SWIFT",         placeholder: "INGBNL2A",                icon: "🔢" },
  account_name:      { label: "Tenaamstelling",    placeholder: "PayWatch Rotterdam",       icon: "🏢" },
  invoice_from_name: { label: "Naam op factuur",   placeholder: "PayWatch",                 icon: "📄" },
  invoice_from_email:{ label: "Reply-to email",    placeholder: "samba@paywatch.nl",        icon: "✉️" },
  kvk:               { label: "KVK nummer",        placeholder: "83474889",                 icon: "📋" },
  btw:               { label: "BTW nummer",        placeholder: "NL000000000B01",           icon: "💼" },
  address:           { label: "Adres op factuur",  placeholder: "Rotterdam, Nederland",     icon: "📍" },
};

export default function InstellingenPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => { setSettings(d.settings || {}); })
      .finally(() => setLoading(false));
  }, []);

  function update(key: string, value: string) {
    setDirty(prev => ({ ...prev, [key]: value }));
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    if (Object.keys(dirty).length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dirty),
      });
      if (res.ok) { setSaved(true); setDirty({}); setTimeout(() => setSaved(false), 3000); }
      else alert("Opslaan mislukt");
    } catch { alert("Fout"); } finally { setSaving(false); }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: "-0.03em" }}>Instellingen</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>PayWatch facturatie & betaalinformatie</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {saved && <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>✓ Opgeslagen</span>}
          {Object.keys(dirty).length > 0 && (
            <button onClick={save} disabled={saving}
              style={{ padding: "9px 20px", borderRadius: 8, background: C.navy, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Opslaan..." : "Opslaan"}
            </button>
          )}
        </div>
      </div>

      {/* Payment details */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid " + C.border, padding: 28, marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: C.navy }}>Betaalgegevens</h2>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: C.muted }}>
          Deze gegevens verschijnen automatisch op alle B2B facturen die je verstuurt.
        </p>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{ height: 64, borderRadius: 10, background: "#F1F5F9", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {Object.entries(FIELD_META).map(([key, meta]) => (
              <div key={key}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  <span>{meta.icon}</span> {meta.label}
                </label>
                <input
                  type="text"
                  value={settings[key] || ""}
                  onChange={e => update(key, e.target.value)}
                  placeholder={meta.placeholder}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${dirty[key] !== undefined ? C.blue : C.border}`, fontSize: 14, fontWeight: key === "iban" ? 700 : 400, color: C.navy, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {!loading && settings.iban && (
        <div style={{ background: "#EFF6FF", borderRadius: 16, border: "1px solid #BFDBFE", padding: 24 }}>
          <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#1E40AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Voorbeeld op factuur
          </p>
          <div style={{ fontSize: 13, color: "#1E3A5F", lineHeight: 1.9 }}>
            <div><strong>IBAN:</strong> {settings.iban || "—"}</div>
            <div><strong>BIC:</strong> {settings.bic || "—"}</div>
            <div><strong>Ten name van:</strong> {settings.account_name || "—"}</div>
            <div><strong>KVK:</strong> {settings.kvk || "—"}</div>
            <div><strong>BTW:</strong> {settings.btw || "—"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
