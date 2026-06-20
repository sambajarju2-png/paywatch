"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { defaultSeatLimitFor, TIER_PRICING, type Tier } from "@paywatch/config";

export default function NewOrgForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("gemeente");
  const [domain, setDomain] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [tier, setTier] = useState("pilot");
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [city, setCity] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [customIntro, setCustomIntro] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Billing & contract (defaults seeded from the tier, fully editable)
  const initPrice = (t: string) => String((TIER_PRICING[t as Tier]?.per_seat ?? 0) / 100);
  const initMonthly = (t: string) => String((TIER_PRICING[t as Tier]?.monthly_fee ?? 0) / 100);
  const [contactPhone, setContactPhone] = useState("");
  const [seatLimit, setSeatLimit] = useState(String(defaultSeatLimitFor("pilot")));
  const [pricePerSeat, setPricePerSeat] = useState(initPrice("pilot"));
  const [monthlyFee, setMonthlyFee] = useState(initMonthly("pilot"));
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [billingEmail, setBillingEmail] = useState("");
  const [contractStart, setContractStart] = useState("");
  const [contractEnd, setContractEnd] = useState("");
  const [invoiceReference, setInvoiceReference] = useState("");
  const [billingNotes, setBillingNotes] = useState("");

  // Changing the tier refreshes the seat-limit + pricing defaults (still overridable).
  function handleTierChange(newTier: string) {
    setTier(newTier);
    setSeatLimit(String(defaultSeatLimitFor(newTier)));
    setPricePerSeat(initPrice(newTier));
    setMonthlyFee(initMonthly(newTier));
  }

  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 30);
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!slug || slug === autoSlug(name)) {
      setSlug(autoSlug(val));
    }
  }

  async function fetchLogo() {
    if (!domain) return;
    setLogoLoading(true);
    try {
      const res = await fetch(`/api/logo?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      if (data.logoUrl) setLogoUrl(data.logoUrl);
    } catch {}
    setLogoLoading(false);
  }

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("slug", slug || "org");
      const res = await fetch("/api/logo/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.logoUrl) setLogoUrl(data.logoUrl);
      else setError(data.error || "Upload mislukt");
    } catch {
      setError("Upload mislukt");
    }
    setLogoUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("type", type);
    formData.set("primary_color", primaryColor);
    formData.set("tier", tier);
    formData.set("contact_email", contactEmail);
    formData.set("contact_name", contactName);
    formData.set("logo_url", logoUrl);
    formData.set("city", city);
    formData.set("kvk_number", kvkNumber);
    formData.set("website", website || domain);
    formData.set("custom_intro_text", customIntro);
    formData.set("secondary_color", textColor);
    formData.set("contact_phone", contactPhone);
    formData.set("seat_limit", seatLimit);
    formData.set("price_per_seat", String(Math.round(parseFloat(pricePerSeat || "0") * 100)));
    formData.set("monthly_fee", String(Math.round(parseFloat(monthlyFee || "0") * 100)));
    formData.set("billing_period", billingPeriod);
    formData.set("billing_email", billingEmail);
    formData.set("contract_start_at", contractStart);
    formData.set("contract_end_at", contractEnd);
    formData.set("invoice_reference", invoiceReference);
    formData.set("billing_notes", billingNotes);

    try {
      const res = await fetch("/api/organizations", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.id) {
        router.push(`/organizations/${data.id}`);
        return;
      }
    } catch (err: any) {
      setError(err.message || "Er ging iets mis");
    }
    setSaving(false);
  }

  const orgTypes = [
    { value: "gemeente", label: "Gemeente", desc: "Schuldhulpverlening voor inwoners" },
    { value: "incasso", label: "Incassobureau", desc: "WKI-compliant debiteurenbeheer" },
    { value: "bewindvoerder", label: "Bewindvoerder", desc: "Financieel beheer voor clienten" },
    { value: "hulporganisatie", label: "Hulporganisatie", desc: "SchuldHulpMaatje, Humanitas, etc." },
    { value: "kredietbank", label: "Kredietbank", desc: "Saneringskrediet en schuldregeling" },
  ];

  const tiers = [
    { value: "pilot", label: "Pilot", desc: "Tot 100 gebruikers, basis features" },
    { value: "professional", label: "Professional", desc: "Tot 5.000 gebruikers, alle features + API" },
    { value: "enterprise", label: "Enterprise", desc: "Onbeperkt, custom integraties, EU-only compute" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FB", display: "flex" }}>
      {/* Form */}
      <div style={{ flex: 1, padding: "32px 40px", maxWidth: 680, overflowY: "auto" }}>
        <a href="/" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", marginBottom: 16, display: "block" }}>&larr; Alle organisaties</a>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 24 }}>Nieuwe organisatie</h1>

        <form onSubmit={handleSubmit}>
          {/* Basic info */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Organisatie</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Naam *</label>
                <input value={name} onChange={e => handleNameChange(e.target.value)} required placeholder="Gemeente Rotterdam"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Slug (subdomain) *</label>
                <div style={{ display: "flex" }}>
                  <input value={slug} onChange={e => setSlug(autoSlug(e.target.value))} required placeholder="rotterdam"
                    style={{ flex: 1, padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: "8px 0 0 8px", fontSize: 13, boxSizing: "border-box" }} />
                  <span style={{ padding: "9px 12px", background: "#F4F7FB", border: "1px solid #E2E8F0", borderLeft: "none", borderRadius: "0 8px 8px 0", fontSize: 12, color: "#64748B", whiteSpace: "nowrap" }}>.paywatch.app</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Type organisatie *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {orgTypes.map(t => (
                  <button key={t.value} type="button" onClick={() => setType(t.value)}
                    style={{
                      padding: "10px 14px", textAlign: "left", borderRadius: 8, cursor: "pointer",
                      border: type === t.value ? "2px solid #0A2540" : "1px solid #E2E8F0",
                      background: type === t.value ? "#F4F7FB" : "white",
                    }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Branding */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Branding</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Website / domein (voor logo ophalen)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="rotterdam.nl"
                  style={{ flex: 1, padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                <button type="button" onClick={fetchLogo} disabled={logoLoading || !domain}
                  style={{ padding: "9px 16px", background: "#0A2540", color: "white", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: logoLoading ? 0.5 : 1 }}>
                  {logoLoading ? "Laden..." : "Logo ophalen"}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Of upload een logo (PNG, JPG, SVG · max 2MB)</label>
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp"
                disabled={logoUploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
                style={{ fontSize: 12, color: "#64748B" }} />
              {logoUploading && <span style={{ fontSize: 11, color: "#64748B", marginLeft: 8 }}>Uploaden...</span>}
            </div>

            {logoUrl && (
              <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <img src={logoUrl} alt="Logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "contain", border: "1px solid #E2E8F0" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Logo gevonden</div>
                  <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} style={{ fontSize: 11, color: "#64748B", border: "none", background: "none", width: 300 }} />
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Hoofdkleur</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                    style={{ width: 40, height: 36, border: "1px solid #E2E8F0", borderRadius: 6, cursor: "pointer" }} />
                  <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                    style={{ flex: 1, padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Tekstkleur (op header)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                    style={{ width: 40, height: 36, border: "1px solid #E2E8F0", borderRadius: 6, cursor: "pointer" }} />
                  <input value={textColor} onChange={e => setTextColor(e.target.value)}
                    style={{ flex: 1, padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Welkomsttekst (optioneel)</label>
              <textarea value={customIntro} onChange={e => setCustomIntro(e.target.value)} placeholder="Welkom bij het portaal van..."
                rows={2} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Contact + tier */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Contact & Tier</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Contactpersoon</label>
                <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Jan de Vries"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>E-mail</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="info@gemeente.nl"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Stad</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Rotterdam"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>KvK-nummer</label>
                <input value={kvkNumber} onChange={e => setKvkNumber(e.target.value)} placeholder="12345678"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Telefoon</label>
                <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="010 123 4567"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#64748B", display: "block", marginBottom: 4 }}>Tier</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {tiers.map(t => (
                  <button key={t.value} type="button" onClick={() => handleTierChange(t.value)}
                    style={{
                      padding: "10px 12px", textAlign: "left", borderRadius: 8, cursor: "pointer",
                      border: tier === t.value ? "2px solid #0A2540" : "1px solid #E2E8F0",
                      background: tier === t.value ? "#F4F7FB" : "white",
                    }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Billing & contract */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Facturering & contract</h2>
            <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>Vooringevuld op basis van de tier. Pas vrij aan.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Seat-limiet</label>
                <input type="number" min={0} value={seatLimit} onChange={e => setSeatLimit(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Facturatieperiode</label>
                <select value={billingPeriod} onChange={e => setBillingPeriod(e.target.value)} style={{ ...inputStyle, background: "white" }}>
                  <option value="monthly">Maandelijks</option>
                  <option value="quarterly">Per kwartaal</option>
                  <option value="annual">Jaarlijks</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Prijs per seat (€)</label>
                <input type="number" min={0} step="0.01" value={pricePerSeat} onChange={e => setPricePerSeat(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Maandbedrag (€)</label>
                <input type="number" min={0} step="0.01" value={monthlyFee} onChange={e => setMonthlyFee(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contract start</label>
                <input type="date" value={contractStart} onChange={e => setContractStart(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contract eind</label>
                <input type="date" value={contractEnd} onChange={e => setContractEnd(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Facturatie-e-mail</label>
                <input type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} placeholder="facturen@gemeente.nl" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Factuurreferentie</label>
                <input value={invoiceReference} onChange={e => setInvoiceReference(e.target.value)} placeholder="PO-nummer" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Notities</label>
              <textarea value={billingNotes} onChange={e => setBillingNotes(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          {error && <div style={{ padding: 12, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, color: "#DC2626", fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <button type="submit" disabled={saving || !name || !slug}
            style={{ width: "100%", padding: "12px 20px", background: "#0A2540", color: "white", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
            {saving ? "Aanmaken..." : "Organisatie aanmaken"}
          </button>
        </form>
      </div>

      {/* Live preview */}
      <div style={{ width: 340, background: "#0A2540", padding: 24, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 16, letterSpacing: "0.05em" }}>PREVIEW PORTAAL</div>

        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {logoUrl ? (
              <img src={logoUrl} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "contain" }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 6, background: primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: textColor, fontSize: 11, fontWeight: 700 }}>
                {name ? name.substring(0, 2).toUpperCase() : "??"}
              </div>
            )}
            <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{name || "Organisatienaam"}</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
            {slug || "slug"}.paywatch.app
          </div>
        </div>

        {/* Preview header bar */}
        <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ background: primaryColor, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            {logoUrl && <img src={logoUrl} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />}
            <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{name || "Organisatie"}</span>
          </div>
          <div style={{ background: "white", padding: 16 }}>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>Dashboard preview</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ background: "#F4F7FB", borderRadius: 6, padding: 8 }}>
                <div style={{ fontSize: 9, color: "#64748B" }}>Gebruikers</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: primaryColor }}>0</div>
              </div>
              <div style={{ background: "#F4F7FB", borderRadius: 6, padding: 8 }}>
                <div style={{ fontSize: 9, color: "#64748B" }}>Actief</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: primaryColor }}>0</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          Kleuren en logo worden direct zichtbaar op het partnerportaal.
        </div>
      </div>
    </div>
  );
}
