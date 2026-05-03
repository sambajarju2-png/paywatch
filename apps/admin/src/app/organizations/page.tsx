"use client";

import { useState, useEffect } from "react";

const C = {
  navy: "#0A2540", blue: "#2563EB", green: "#059669", amber: "#D97706",
  red: "#DC2626", purple: "#7C3AED", muted: "#64748B", border: "#E2E8F0",
  surface: "#FFFFFF", bg: "#F8FAFC",
};

const TIER_CFG: Record<string, { label: string; bg: string; color: string }> = {
  pilot:        { label: "Pilot",        bg: "#F0FDF4", color: "#059669" },
  professional: { label: "Professional", bg: "#EFF6FF", color: "#2563EB" },
  enterprise:   { label: "Enterprise",   bg: "#F5F3FF", color: "#7C3AED" },
};

const STATUS_CFG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  active:   { label: "Actief",   bg: "#F0FDF4", color: "#059669", dot: "#059669" },
  inactive: { label: "Inactief", bg: "#F8FAFC", color: "#64748B", dot: "#94A3B8" },
  trial:    { label: "Trial",    bg: "#FFFBEB", color: "#D97706", dot: "#D97706" },
};

const INV_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: "Concept",    color: "#64748B", bg: "#F8FAFC" },
  sent:      { label: "Verzonden",  color: "#2563EB", bg: "#EFF6FF" },
  paid:      { label: "Betaald",    color: "#059669", bg: "#F0FDF4" },
  overdue:   { label: "Te laat",    color: "#DC2626", bg: "#FEF2F2" },
  cancelled: { label: "Geannuleerd",color: "#94A3B8", bg: "#F8FAFC" },
};

function formatEuro(cents: number) {
  return "€ " + (cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Invoice {
  id: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  seats_billed: number;
  amount_cents: number;
  status: string;
  sent_at: string | null;
  paid_at: string | null;
  due_date: string | null;
  notes: string | null;
  created_at: string;
}

interface Org {
  id: string;
  name: string;
  type: string;
  status: string;
  tier: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  billing_email: string | null;
  kvk_number: string | null;
  website: string | null;
  city: string | null;
  seat_limit: number;
  price_per_seat: number;
  monthly_fee: number;
  billing_period: string;
  contract_start_at: string | null;
  contract_end_at: string | null;
  invoice_reference: string | null;
  billing_notes: string | null;
  active_seats: number;
  invoices: Invoice[];
}

function EditDrawer({ org, onClose, onSave }: { org: Org; onClose: () => void; onSave: (updated: Org) => void }) {
  const [form, setForm] = useState({ ...org });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"contract" | "billing" | "invoices" | "tier">("contract");
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);

  function f(k: keyof typeof form, v: unknown) { setForm(prev => ({ ...prev, [k]: v })); }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/organizations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) onSave(form);
      else alert("Opslaan mislukt");
    } catch { alert("Fout"); } finally { setSaving(false); }
  }

  async function sendInvoice(invoiceId: string) {
    setSendingInvoice(invoiceId);
    try {
      const res = await fetch("/api/admin/organizations/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = form.invoices.map(i => i.id === invoiceId ? { ...i, status: "sent" } : i);
        setForm(prev => ({ ...prev, invoices: updated }));
        onSave({ ...form, invoices: updated });
        alert(`Factuur verzonden naar ${data.sent_to}`);
      } else {
        alert("Verzenden mislukt: " + (data.error || "onbekende fout"));
      }
    } catch { alert("Fout bij verzenden"); } finally { setSendingInvoice(null); }
  }

  async function createInvoice() {
    setCreatingInvoice(true);
    try {
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_invoice", organization_id: org.id }),
      });
      const data = await res.json();
      if (res.ok && data.invoice) {
        onSave({ ...form, invoices: [data.invoice, ...form.invoices] });
        setForm(prev => ({ ...prev, invoices: [data.invoice, ...prev.invoices] }));
      } else alert("Factuur aanmaken mislukt");
    } catch { alert("Fout"); } finally { setCreatingInvoice(false); }
  }

  async function updateInvoiceStatus(invoiceId: string, status: string) {
    const res = await fetch("/api/admin/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_invoice", invoice_id: invoiceId, organization_id: org.id, status }),
    });
    if (res.ok) {
      const updated = form.invoices.map(i => i.id === invoiceId ? { ...i, status } : i);
      setForm(prev => ({ ...prev, invoices: updated }));
      onSave({ ...form, invoices: updated });
    }
  }

  const periodicFee = (form.monthly_fee || 0) + ((form.price_per_seat || 0) * (org.active_seats || 0));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }} onClick={onClose}>
      {/* Overlay */}
      <div style={{ flex: 1, background: "rgba(0,0,0,0.3)" }} />
      {/* Drawer */}
      <div style={{ width: 520, background: C.surface, height: "100%", display: "flex", flexDirection: "column", boxShadow: "-4px 0 32px rgba(0,0,0,0.12)", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid " + C.border }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {form.type === "gemeente" ? "Gemeente" : form.type === "incasso" ? "Incassobureau" : form.type}
              </p>
              <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: C.navy }}>{form.name}</h2>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, ...(TIER_CFG[form.tier] || TIER_CFG.pilot) }}>
                  {(TIER_CFG[form.tier] || TIER_CFG.pilot).label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: "#F0FDF4", color: C.green }}>
                  {org.active_seats} / {form.seat_limit} seats
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4, fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid " + C.border, padding: "0 28px" }}>
          {(["contract", "billing", "invoices", "tier"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "12px 16px", border: "none", borderBottom: `2px solid ${tab === t ? C.blue : "transparent"}`, background: "none", fontSize: 12, fontWeight: 600, color: tab === t ? C.blue : C.muted, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {t === "contract" ? "Contract" : t === "billing" ? "Facturering" : t === "tier" ? "Tier & Features" : `Facturen (${form.invoices.length})`}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px 28px" }}>
          {tab === "contract" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Organisatienaam" value={form.name} onChange={v => f("name", v)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <SelectField label="Type" value={form.type} onChange={v => f("type", v)}
                  options={[["gemeente","Gemeente"],["incasso","Incassobureau"],["hulporg","Hulporganisatie"],["zakelijk","Zakelijk"]]} />
                <SelectField label="Status" value={form.status} onChange={v => f("status", v)}
                  options={[["active","Actief"],["inactive","Inactief"],["trial","Trial"]]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <SelectField label="Tier" value={form.tier} onChange={v => f("tier", v)}
                  options={[["pilot","Pilot"],["professional","Professional"],["enterprise","Enterprise"]]} />
                <Field label="KVK-nummer" value={form.kvk_number || ""} onChange={v => f("kvk_number", v)} placeholder="12345678" />
              </div>
              <Field label="Contactpersoon" value={form.contact_name || ""} onChange={v => f("contact_name", v)} placeholder="Jan de Vries" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Contact email" value={form.contact_email || ""} onChange={v => f("contact_email", v)} type="email" />
                <Field label="Telefoon" value={form.contact_phone || ""} onChange={v => f("contact_phone", v)} placeholder="+31 6 12345678" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Stad" value={form.city || ""} onChange={v => f("city", v)} placeholder="Rotterdam" />
                <Field label="Website" value={form.website || ""} onChange={v => f("website", v)} placeholder="https://..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Contract start" value={form.contract_start_at?.split("T")[0] || ""} onChange={v => f("contract_start_at", v)} type="date" />
                <Field label="Contract einde" value={form.contract_end_at?.split("T")[0] || ""} onChange={v => f("contract_end_at", v)} type="date" />
              </div>
            </div>
          )}

          {tab === "billing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Pricing summary */}
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, border: "1px solid " + C.border }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Geschatte factuur</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.navy }}>{formatEuro(periodicFee)}</p>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
                  {form.billing_period === "monthly" ? "per maand" : form.billing_period === "quarterly" ? "per kwartaal" : "per jaar"}
                  {" · "}{org.active_seats} actieve gebruikers
                </p>
              </div>

              <Field label="Facturatie email" value={form.billing_email || ""} onChange={v => f("billing_email", v)} type="email" placeholder="finance@organisatie.nl" />
              <Field label="PO/referentienummer" value={form.invoice_reference || ""} onChange={v => f("invoice_reference", v)} placeholder="PO-2025-001" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Seat limiet" value={String(form.seat_limit)} onChange={v => f("seat_limit", parseInt(v) || 0)} type="number" />
                <SelectField label="Facturatieperiode" value={form.billing_period} onChange={v => f("billing_period", v)}
                  options={[["monthly","Maandelijks"],["quarterly","Kwartaal"],["annual","Jaarlijks"]]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Vaste vergoeding (€)" value={String((form.monthly_fee || 0) / 100)} onChange={v => f("monthly_fee", Math.round(parseFloat(v || "0") * 100))} type="number" placeholder="0.00" />
                <Field label="Per seat (€)" value={String((form.price_per_seat || 0) / 100)} onChange={v => f("price_per_seat", Math.round(parseFloat(v || "0") * 100))} type="number" placeholder="0.00" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Facturatie notities</label>
                <textarea value={form.billing_notes || ""} onChange={e => f("billing_notes", e.target.value)} rows={3} placeholder="Interne notities voor facturatie..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          {tab === "invoices" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: C.muted }}>{form.invoices.length} facturen</p>
                <button onClick={createInvoice} disabled={creatingInvoice}
                  style={{ padding: "8px 16px", borderRadius: 8, background: C.navy, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: creatingInvoice ? 0.6 : 1 }}>
                  {creatingInvoice ? "Aanmaken..." : "+ Nieuwe factuur"}
                </button>
              </div>

              {form.invoices.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 13 }}>
                  Nog geen facturen. Maak de eerste aan na contract afronding.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {form.invoices.map(inv => {
                    const sc = INV_STATUS[inv.status] || INV_STATUS.draft;
                    return (
                      <div key={inv.id} style={{ background: C.bg, borderRadius: 10, border: "1px solid " + C.border, padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{inv.invoice_number}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: sc.bg, color: sc.color }}>{sc.label}</span>
                            </div>
                            <p style={{ margin: "0 0 2px", fontSize: 12, color: C.muted }}>
                              {new Date(inv.period_start).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })} — {new Date(inv.period_end).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                            <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{inv.seats_billed} seats · {inv.due_date ? `Vervalt ${new Date(inv.due_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}` : ""}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: C.navy }}>{formatEuro(inv.amount_cents)}</p>
                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                              {inv.status === "draft" && (
                                <button onClick={() => sendInvoice(inv.id)} disabled={sendingInvoice === inv.id}
                                  style={{ padding: "4px 12px", borderRadius: 6, background: C.navy, border: "none", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: sendingInvoice === inv.id ? 0.6 : 1 }}>
                                  {sendingInvoice === inv.id ? "Verzenden..." : "✉ Verstuur"}
                                </button>
                              )}
                              <select value={inv.status} onChange={e => updateInvoiceStatus(inv.id, e.target.value)}
                                style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, border: "1px solid " + C.border, outline: "none", fontFamily: "inherit", cursor: "pointer", color: C.muted }}>
                                <option value="draft">Concept</option>
                                <option value="sent">Verzonden</option>
                                <option value="paid">Betaald</option>
                                <option value="overdue">Te laat</option>
                                <option value="cancelled">Geannuleerd</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "tier" && (() => {
            const FEATURE_LABELS: Record<string, string> = {
              buddy_system: "Coach systeem",
              ai_insights: "AI inzichten",
              camera_scan: "Camera scan",
              payment_plans: "Betalingsregelingen",
              push_notifications: "Push notificaties",
              escalation_alerts: "Escalatie meldingen",
              spending_analytics: "Uitgavenanalyse",
              export_reports: "Rapportage export",
              bank_sync: "Bankrekening koppeling",
              community: "Community feed",
              api_access: "API toegang",
              custom_branding: "Custom branding",
              audit_log: "Audit log",
              webhooks: "Webhooks",
              white_label: "White label",
            };
            const TIER_FEATURES: Record<string, Record<string, boolean>> = {
              pilot:        { buddy_system: true, ai_insights: false, camera_scan: true, payment_plans: true, push_notifications: true, escalation_alerts: true, spending_analytics: false, export_reports: false, bank_sync: false, community: false, api_access: false, custom_branding: false, audit_log: false, webhooks: false, white_label: false },
              professional: { buddy_system: true, ai_insights: true,  camera_scan: true, payment_plans: true, push_notifications: true, escalation_alerts: true, spending_analytics: true,  export_reports: true,  bank_sync: false, community: false, api_access: true,  custom_branding: false, audit_log: true,  webhooks: true,  white_label: false },
              enterprise:   { buddy_system: true, ai_insights: true,  camera_scan: true, payment_plans: true, push_notifications: true, escalation_alerts: true, spending_analytics: true,  export_reports: true,  bank_sync: true,  community: true,  api_access: true,  custom_branding: true,  audit_log: true,  webhooks: true,  white_label: true  },
            };
            const SEAT_DEFAULTS: Record<string, string> = { pilot: "25", professional: "250", enterprise: "Onbeperkt" };
            const SUPPORT: Record<string, string> = { pilot: "Email", professional: "Prioriteit", enterprise: "Dedicated + SLA" };
            const BASE_PRICE: Record<string, string> = { pilot: "Gratis / op maat", professional: "€99/mnd + €2,99/user", enterprise: "€299/mnd + €1,99/user" };

            const features = TIER_FEATURES[form.tier] || TIER_FEATURES.pilot;
            const orgFeatures = form.features as Record<string, boolean> || {};

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Tier comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {(["pilot", "professional", "enterprise"] as const).map(t => {
                    const isActive = form.tier === t;
                    const cfg = { pilot: { label: "Pilot", color: "#059669", bg: "#F0FDF4", border: "#BBF7D0" }, professional: { label: "Professional", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" }, enterprise: { label: "Enterprise", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" } }[t];
                    return (
                      <button key={t} onClick={() => setForm(prev => ({ ...prev, tier: t }))}
                        style={{ padding: "12px 10px", borderRadius: 10, border: `2px solid ${isActive ? cfg.color : C.border}`, background: isActive ? cfg.bg : "#fff", cursor: "pointer", textAlign: "center" }}>
                        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</p>
                        <p style={{ margin: "0 0 2px", fontSize: 11, color: C.muted }}>{SEAT_DEFAULTS[t]} seats</p>
                        <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{BASE_PRICE[t]}</p>
                      </button>
                    );
                  })}
                </div>

                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 16px", border: "1px solid " + C.border }}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Support niveau</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>{SUPPORT[form.tier] || "Email"}</p>
                </div>

                <div>
                  <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: C.navy }}>Features voor dit tier</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {Object.entries(FEATURE_LABELS).map(([key, label]) => {
                      const tierHas = features[key] || false;
                      const orgHas = key in orgFeatures ? orgFeatures[key] : tierHas;
                      return (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, background: orgHas ? "#F0FDF4" : "#F8FAFC", border: "1px solid " + (orgHas ? "#BBF7D0" : C.border) }}>
                          <span style={{ fontSize: 13, color: orgHas ? "#059669" : "#CBD5E1" }}>{orgHas ? "✓" : "✗"}</span>
                          <span style={{ fontSize: 12, color: orgHas ? C.navy : C.muted }}>{label}</span>
                          {tierHas !== orgHas && <span style={{ fontSize: 10, color: orgHas ? "#059669" : C.red, marginLeft: "auto" }}>{orgHas ? "+override" : "-override"}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Save */}
        {tab !== "invoices" && (
          <div style={{ padding: "16px 28px", borderTop: "1px solid " + C.border, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid " + C.border, background: "transparent", fontSize: 13, color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Annuleer</button>
            <button onClick={save} disabled={saving}
              style={{ padding: "9px 20px", borderRadius: 8, background: C.navy, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Opslaan..." : "Opslaan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, outline: "none", fontFamily: "inherit", background: C.surface }}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editing, setEditing] = useState<Org | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/organizations");
      if (res.ok) setOrgs((await res.json()).organizations || []);
    } catch {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = orgs.filter(o => {
    const q = search.toLowerCase();
    if (q && !o.name.toLowerCase().includes(q) && !(o.contact_email || "").includes(q) && !(o.city || "").includes(q)) return false;
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    return true;
  });

  const totalSeats = orgs.reduce((s, o) => s + o.active_seats, 0);
  const totalRevenue = orgs.reduce((s, o) => {
    const inv = o.invoices.filter(i => i.status === "paid");
    return s + inv.reduce((a, i) => a + i.amount_cents, 0);
  }, 0);
  const openInvoices = orgs.flatMap(o => o.invoices.filter(i => ["sent", "overdue"].includes(i.status)));
  const openAmount = openInvoices.reduce((s, i) => s + i.amount_cents, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: "-0.03em" }}>Organisaties</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>Gemeentes &amp; incasso bureaus — B2B contract beheer</p>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Organisaties", value: orgs.length, color: C.navy },
          { label: "Actieve seats", value: totalSeats, color: C.blue },
          { label: "Open facturen", value: formatEuro(openAmount), color: openAmount > 0 ? C.amber : C.muted, sub: openInvoices.length + " facturen" },
          { label: "Ontvangen", value: formatEuro(totalRevenue), color: C.green, sub: "Totaal betaald" },
        ].map(k => (
          <div key={k.label} style={{ background: C.surface, borderRadius: 12, border: "1px solid " + C.border, padding: "16px 20px" }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: k.color, letterSpacing: "-0.02em" }}>{k.value}</p>
            {k.sub && <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <input type="text" placeholder="Zoek op naam, email, stad..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 300, padding: "8px 14px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
        <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 8, padding: 4 }}>
          {[["all","Alle"],["gemeente","Gemeente"],["incasso","Incasso"],["hulporg","Hulporg"]].map(([v,l]) => (
            <button key={v} onClick={() => setTypeFilter(v)}
              style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: typeFilter === v ? C.surface : "transparent", color: typeFilter === v ? C.navy : C.muted, boxShadow: typeFilter === v ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>{l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#FAFBFC" }}>
              {["Organisatie", "Type", "Seats", "Contract", "Facturering", "Openstaand", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid " + C.border }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.muted }}>Laden...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.muted }}>Geen organisaties gevonden</td></tr>
            ) : filtered.map((org, i) => {
              const seatPct = org.seat_limit > 0 ? Math.min(100, Math.round((org.active_seats / org.seat_limit) * 100)) : 0;
              const seatColor = seatPct > 90 ? C.red : seatPct > 70 ? C.amber : C.green;
              const sc = STATUS_CFG[org.status] || STATUS_CFG.active;
              const tc = TIER_CFG[org.tier] || TIER_CFG.pilot;
              const openInv = org.invoices.filter(i => ["sent", "overdue"].includes(i.status));
              const openAmt = openInv.reduce((s, i) => s + i.amount_cents, 0);
              const periodFee = (org.monthly_fee || 0) + ((org.price_per_seat || 0) * org.active_seats);

              return (
                <tr key={org.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none", background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#FAFBFC")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: org.type === "gemeente" ? "#EFF6FF" : org.type === "incasso" ? "#FEF3C7" : "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: org.type === "gemeente" ? C.blue : org.type === "incasso" ? C.amber : C.purple, flexShrink: 0 }}>
                        {org.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: C.navy }}>{org.name}</p>
                        {org.contact_email && <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{org.contact_email}</p>}
                        {org.city && <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{org.city}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, ...(tc), width: "fit-content" }}>{tc.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                        {sc.label}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: C.navy }}>{org.active_seats} / {org.seat_limit}</p>
                      <div style={{ width: 80, height: 4, background: "#F1F5F9", borderRadius: 2 }}>
                        <div style={{ width: seatPct + "%", height: "100%", background: seatColor, borderRadius: 2, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {org.contract_start_at ? (
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 12, color: C.navy }}>
                          {new Date(org.contract_start_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {org.contract_end_at && <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                          t/m {new Date(org.contract_end_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                        </p>}
                      </div>
                    ) : <span style={{ color: C.muted, fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {periodFee > 0 ? (
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: C.navy }}>{formatEuro(periodFee)}</p>
                        <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                          {org.billing_period === "monthly" ? "/maand" : org.billing_period === "quarterly" ? "/kwartaal" : "/jaar"}
                          {org.invoice_reference ? " · " + org.invoice_reference : ""}
                        </p>
                      </div>
                    ) : <span style={{ fontSize: 12, color: C.muted }}>Niet ingesteld</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {openAmt > 0 ? (
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: openInv.some(i => i.status === "overdue") ? C.red : C.amber }}>{formatEuro(openAmt)}</p>
                        <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{openInv.length} factuur{openInv.length > 1 ? "en" : ""}</p>
                      </div>
                    ) : <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>✓ Geen openstaand</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => setEditing(org)}
                      style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", fontSize: 12, fontWeight: 600, color: C.navy, cursor: "pointer", fontFamily: "inherit" }}>
                      Beheer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditDrawer
          org={editing}
          onClose={() => setEditing(null)}
          onSave={updated => {
            setOrgs(prev => prev.map(o => o.id === updated.id ? updated : o));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
