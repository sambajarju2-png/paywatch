"use client";

import { useState, useEffect, useMemo } from "react";
import { Shimmer, shimmerStyle } from "@/components/Shimmer";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string;
  role: string | null;
  request_type: "gemeente" | "incasso" | "hulporganisatie";
  estimated_users: string | null;
  message: string | null;
  lang: string;
  status: "new" | "contacted" | "demo_scheduled" | "onboarded" | "declined";
  notes: string | null;
  handled_by: string | null;
  handled_at: string | null;
}

interface SpeakingRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  organization: string;
  role: string | null;
  type: string | null;
  topic: string | null;
  audience: string | null;
  date_preference: string | null;
  message: string | null;
  status: "new" | "contacted" | "confirmed" | "completed" | "declined";
  notes: string | null;
  handled_at: string | null;
}

const C = {
  navy: "#0A2540",
  muted: "#64748B",
  border: "#E2E8F0",
  surface: "#FFFFFF",
  bg: "#F8FAFC",
  blue: "#2563EB",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  emerald: "#059669",
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "Nieuw", bg: "#DBEAFE", text: "#1D4ED8" },
  contacted: { label: "Contact gehad", bg: "#FEF3C7", text: "#D97706" },
  demo_scheduled: { label: "Demo gepland", bg: "#E0E7FF", text: "#4338CA" },
  onboarded: { label: "Onboarded", bg: "#D1FAE5", text: "#059669" },
  declined: { label: "Afgewezen", bg: "#FEE2E2", text: "#DC2626" },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  gemeente: { label: "Gemeente", color: C.blue },
  incasso: { label: "Incassobureau", color: C.amber },
  hulporganisatie: { label: "Hulporganisatie", color: C.emerald },
};

const SPEAKING_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "Nieuw", bg: "#DBEAFE", text: "#1D4ED8" },
  contacted: { label: "Contact gehad", bg: "#FEF3C7", text: "#D97706" },
  confirmed: { label: "Bevestigd", bg: "#D1FAE5", text: "#059669" },
  completed: { label: "Afgerond", bg: "#E0E7FF", text: "#4338CA" },
  declined: { label: "Afgewezen", bg: "#FEE2E2", text: "#DC2626" },
};

const SPEAKING_TYPE_LABELS: Record<string, string> = {
  gastcollege: "Gastcollege",
  keynote: "Keynote",
  panel: "Paneldiscussie",
  workshop: "Workshop",
  anders: "Anders",
};

const SPEAKING_TOPIC_LABELS: Record<string, string> = {
  schulden: "Schuldenpreventie",
  ondernemen: "Maatschappelijk ondernemen",
  fintech: "Fintech bouwen",
  digitaal: "Digitale geletterdheid",
  combinatie: "Combinatie / op maat",
};

function relativeTime(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "Zojuist";
  if (mins < 60) return mins + " min geleden";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + "u geleden";
  const days = Math.floor(hours / 24);
  if (days === 1) return "Gisteren";
  if (days < 30) return days + "d geleden";
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [speaking, setSpeaking] = useState<SpeakingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"b2b" | "speaking">("b2b");

  async function loadLeads() {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setSpeaking(data.speaking || []);
      }
    } catch {} finally { setLoading(false); }
  }
  useEffect(() => { loadLeads(); }, []);

  async function updateStatus(id: string, status: string, notes?: string, table?: string) {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes, table }),
      });
      if (res.ok) {
        if (table === "speaking") {
          setSpeaking((prev) =>
            prev.map((s) => s.id === id ? { ...s, status: status as SpeakingRequest["status"], notes: notes ?? s.notes, handled_at: new Date().toISOString() } : s)
          );
        } else {
          setLeads((prev) =>
            prev.map((l) => l.id === id ? { ...l, status: status as Lead["status"], notes: notes ?? l.notes, handled_at: new Date().toISOString() } : l)
          );
        }
      }
    } catch {} finally { setUpdating(null); }
  }

  const filtered = useMemo(() => {
    let result = leads;
    if (filter !== "all") {
      if (filter === "gemeente" || filter === "incasso" || filter === "hulporganisatie") {
        result = result.filter((l) => l.request_type === filter);
      } else {
        result = result.filter((l) => l.status === filter);
      }
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.organization.toLowerCase().includes(q)
      );
    }
    return result;
  }, [leads, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    leads.forEach((l) => {
      c[l.status] = (c[l.status] || 0) + 1;
      c[l.request_type] = (c[l.request_type] || 0) + 1;
    });
    return c;
  }, [leads]);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: 0 }}>
          B2B Leads
        </h1>
        <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>
          Demo-aanvragen, toegangsverzoeken en gastspreker aanvragen
        </p>
        <div style={{ display: "flex", gap: 4, marginTop: 12, background: C.bg, padding: 4, borderRadius: 10, border: `1px solid ${C.border}`, width: "fit-content" }}>
          {([
            { key: "b2b" as const, label: "B2B Leads", count: leads.length },
            { key: "speaking" as const, label: "Gastspreker", count: speaking.length },
          ]).map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setFilter("all"); setSearch(""); setExpandedId(null); }}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', system-ui",
                background: activeTab === tab.key ? C.navy : "transparent",
                color: activeTab === tab.key ? "white" : C.muted,
                transition: "all 0.15s",
              }}>
              {tab.label} {tab.count > 0 && <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 4 }}>({tab.count})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      {!loading && activeTab === "b2b" && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Totaal", value: counts.all || 0, color: C.navy },
            { label: "Nieuw", value: counts.new || 0, color: "#1D4ED8" },
            { label: "Gemeentes", value: counts.gemeente || 0, color: C.blue },
            { label: "Incasso", value: counts.incasso || 0, color: C.amber },
            { label: "Hulporg.", value: counts.hulporganisatie || 0, color: C.emerald },
            { label: "Onboarded", value: counts.onboarded || 0, color: C.green },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: C.surface,
                minWidth: 100,
              }}
            >
              <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: s.color, margin: "2px 0 0" }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters + search */}
      <div style={{ display: activeTab === "b2b" ? "flex" : "none", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek op naam, e-mail of organisatie..."
          style={{
            flex: 1,
            minWidth: 200,
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 13,
            outline: "none",
            fontFamily: "'Plus Jakarta Sans', system-ui",
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 13,
            fontFamily: "'Plus Jakarta Sans', system-ui",
            background: C.surface,
            cursor: "pointer",
          }}
        >
          <option value="all">Alle ({counts.all || 0})</option>
          <optgroup label="Status">
            <option value="new">Nieuw ({counts.new || 0})</option>
            <option value="contacted">Contact gehad ({counts.contacted || 0})</option>
            <option value="demo_scheduled">Demo gepland ({counts.demo_scheduled || 0})</option>
            <option value="onboarded">Onboarded ({counts.onboarded || 0})</option>
            <option value="declined">Afgewezen ({counts.declined || 0})</option>
          </optgroup>
          <optgroup label="Type">
            <option value="gemeente">Gemeente ({counts.gemeente || 0})</option>
            <option value="incasso">Incassobureau ({counts.incasso || 0})</option>
            <option value="hulporganisatie">Hulporganisatie ({counts.hulporganisatie || 0})</option>
          </optgroup>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface }}>
              <div style={{ display: "flex", gap: 16 }}>
                <Shimmer width={140} height={16} />
                <Shimmer width={200} height={16} />
                <Shimmer width={100} height={16} />
                <Shimmer width={80} height={16} />
              </div>
            </div>
          ))}
          <style>{shimmerStyle}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1" style={{ opacity: 0.4, margin: "0 auto 12px" }}>
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
          </svg>
          <p style={{ fontSize: 14, color: C.muted }}>
            {search ? "Geen leads gevonden" : "Nog geen aanvragen ontvangen"}
          </p>
        </div>
      )}

      {/* Leads list */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((lead) => {
            const type = TYPE_CONFIG[lead.request_type] || TYPE_CONFIG.gemeente;
            const st = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
            const expanded = expandedId === lead.id;

            return (
              <div
                key={lead.id}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${lead.status === "new" ? C.blue : C.border}`,
                  background: C.surface,
                  overflow: "hidden",
                  transition: "border-color 0.15s",
                }}
              >
                {/* Row header */}
                <div
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Type badge */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: type.color + "18",
                      color: type.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {type.label}
                  </span>

                  {/* Org name */}
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{lead.organization}</span>

                  {/* Contact name */}
                  <span style={{ fontSize: 13, color: C.muted }}>{lead.name}</span>

                  {/* Status badge */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: st.bg,
                      color: st.text,
                      marginLeft: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {st.label}
                  </span>

                  {/* Time */}
                  <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>
                    {relativeTime(lead.created_at)}
                  </span>

                  {/* Chevron */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={C.muted}
                    strokeWidth="2"
                    style={{ transition: "transform 0.15s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, paddingTop: 16 }}>
                      <div>
                        <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>E-mail</p>
                        <a href={`mailto:${lead.email}`} style={{ fontSize: 13, color: C.blue, textDecoration: "none" }}>{lead.email}</a>
                      </div>
                      {lead.phone && (
                        <div>
                          <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Telefoon</p>
                          <a href={`tel:${lead.phone}`} style={{ fontSize: 13, color: C.navy, textDecoration: "none" }}>{lead.phone}</a>
                        </div>
                      )}
                      {lead.role && (
                        <div>
                          <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Functie</p>
                          <p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>{lead.role}</p>
                        </div>
                      )}
                      {lead.estimated_users && (
                        <div>
                          <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Geschat gebruikers</p>
                          <p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>{lead.estimated_users}</p>
                        </div>
                      )}
                      <div>
                        <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Ontvangen</p>
                        <p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>
                          {new Date(lead.created_at).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {lead.message && (
                      <div style={{ marginTop: 12, padding: 12, background: C.bg, borderRadius: 8 }}>
                        <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Bericht</p>
                        <p style={{ fontSize: 13, color: C.navy, margin: "4px 0 0", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{lead.message}</p>
                      </div>
                    )}

                    {lead.notes && (
                      <div style={{ marginTop: 8, padding: 12, background: "#FFFBEB", borderRadius: 8 }}>
                        <p style={{ fontSize: 11, color: C.amber, margin: 0, fontWeight: 500 }}>Interne notities</p>
                        <p style={{ fontSize: 13, color: C.navy, margin: "4px 0 0", lineHeight: 1.5 }}>{lead.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {(["new", "contacted", "demo_scheduled", "onboarded", "declined"] as const).map((s) => {
                        const cfg = STATUS_CONFIG[s];
                        const active = lead.status === s;
                        return (
                          <button
                            key={s}
                            disabled={active || updating === lead.id}
                            onClick={() => updateStatus(lead.id, s)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: active ? `2px solid ${cfg.text}` : `1px solid ${C.border}`,
                              background: active ? cfg.bg : C.surface,
                              color: active ? cfg.text : C.muted,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: active ? "default" : "pointer",
                              opacity: updating === lead.id ? 0.5 : 1,
                              fontFamily: "'Plus Jakarta Sans', system-ui",
                            }}
                          >
                            {cfg.label}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => {
                          const note = prompt("Notitie toevoegen:", lead.notes || "");
                          if (note !== null) updateStatus(lead.id, lead.status, note);
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: `1px solid ${C.border}`,
                          background: C.surface,
                          color: C.navy,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          marginLeft: "auto",
                          fontFamily: "'Plus Jakarta Sans', system-ui",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Notitie
                      </button>
                    </div>

                    {lead.handled_by && (
                      <p style={{ fontSize: 11, color: C.muted, margin: "8px 0 0" }}>
                        Laatst bijgewerkt door {lead.handled_by}
                        {lead.handled_at && ` — ${relativeTime(lead.handled_at)}`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Speaking Requests Tab ── */}
      {activeTab === "speaking" && (
        <div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface }}>
                  <div style={{ display: "flex", gap: 16 }}><Shimmer width={140} height={16} /><Shimmer width={200} height={16} /><Shimmer width={80} height={16} /></div>
                </div>
              ))}
            </div>
          ) : speaking.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: 14, color: C.muted }}>Nog geen gastspreker aanvragen ontvangen</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {speaking.map(sr => {
                const st = SPEAKING_STATUS[sr.status] || SPEAKING_STATUS.new;
                const expanded = expandedId === sr.id;
                return (
                  <div key={sr.id} style={{ borderRadius: 12, border: `1px solid ${sr.status === "new" ? C.blue : C.border}`, background: C.surface, overflow: "hidden" }}>
                    <div onClick={() => setExpandedId(expanded ? null : sr.id)}
                      style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#8B5CF618", color: "#8B5CF6", whiteSpace: "nowrap" }}>
                        {SPEAKING_TYPE_LABELS[sr.type || ""] || sr.type || "Gastcollege"}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{sr.organization}</span>
                      <span style={{ fontSize: 13, color: C.muted }}>{sr.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: st.bg, color: st.text, marginLeft: "auto", whiteSpace: "nowrap" }}>{st.label}</span>
                      <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{relativeTime(sr.created_at)}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"
                        style={{ transition: "transform 0.15s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                    {expanded && (
                      <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.border}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, paddingTop: 16 }}>
                          <div><p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>E-mail</p><a href={`mailto:${sr.email}`} style={{ fontSize: 13, color: C.blue, textDecoration: "none" }}>{sr.email}</a></div>
                          {sr.role && <div><p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Functie</p><p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>{sr.role}</p></div>}
                          {sr.topic && <div><p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Onderwerp</p><p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>{SPEAKING_TOPIC_LABELS[sr.topic] || sr.topic}</p></div>}
                          {sr.audience && <div><p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Doelgroep</p><p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>{sr.audience}</p></div>}
                          {sr.date_preference && <div><p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Voorkeur datum</p><p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>{sr.date_preference}</p></div>}
                          <div><p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Ontvangen</p><p style={{ fontSize: 13, color: C.navy, margin: "2px 0 0" }}>{new Date(sr.created_at).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>
                        </div>
                        {sr.message && <div style={{ marginTop: 12, padding: 12, background: C.bg, borderRadius: 8 }}><p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Bericht</p><p style={{ fontSize: 13, color: C.navy, margin: "4px 0 0", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{sr.message}</p></div>}
                        {sr.notes && <div style={{ marginTop: 8, padding: 12, background: "#FFFBEB", borderRadius: 8 }}><p style={{ fontSize: 11, color: C.amber, margin: 0, fontWeight: 500 }}>Interne notities</p><p style={{ fontSize: 13, color: C.navy, margin: "4px 0 0", lineHeight: 1.5 }}>{sr.notes}</p></div>}
                        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          {(["new", "contacted", "confirmed", "completed", "declined"] as const).map(s => {
                            const cfg = SPEAKING_STATUS[s];
                            const active = sr.status === s;
                            return (<button key={s} disabled={active || updating === sr.id} onClick={() => updateStatus(sr.id, s, undefined, "speaking")}
                              style={{ padding: "6px 12px", borderRadius: 6, border: active ? `2px solid ${cfg.text}` : `1px solid ${C.border}`, background: active ? cfg.bg : C.surface, color: active ? cfg.text : C.muted, fontSize: 12, fontWeight: 600, cursor: active ? "default" : "pointer", opacity: updating === sr.id ? 0.5 : 1, fontFamily: "'Plus Jakarta Sans', system-ui" }}>{cfg.label}</button>);
                          })}
                          <button onClick={() => { const n = prompt("Notitie:", sr.notes || ""); if (n !== null) updateStatus(sr.id, sr.status, n, "speaking"); }}
                            style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 12, fontWeight: 500, cursor: "pointer", marginLeft: "auto", fontFamily: "'Plus Jakarta Sans', system-ui" }}>Notitie</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{shimmerStyle}</style>
    </div>
  );
}
