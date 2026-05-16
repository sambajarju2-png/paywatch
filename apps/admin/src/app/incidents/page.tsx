"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Clock, Users, CheckCircle2, Loader2, Plus, Bell } from "lucide-react";

interface Incident {
  id: string; title: string; description: string; severity: string; status: string;
  affected_scope: string; affected_count: number | null; affected_service: string | null;
  ap_notified: boolean; ap_notified_at: string | null; ap_reference: string | null;
  users_notified: boolean; users_notified_at: string | null; users_notified_count: number | null;
  detected_at: string; contained_at: string | null; resolved_at: string | null;
  reported_by: string; action_taken: string | null; root_cause: string | null;
}

const SEV = { critical: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" }, high: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700" }, medium: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" }, low: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" } };

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", severity: "medium", affected_scope: "unknown", affected_service: "" });

  async function load() { const r = await fetch("/api/admin/incidents"); if (r.ok) setIncidents((await r.json()).incidents); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function create() {
    setActing("create");
    await fetch("/api/admin/incidents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowCreate(false); setForm({ title: "", description: "", severity: "medium", affected_scope: "unknown", affected_service: "" });
    await load(); setActing(null);
  }

  async function act(id: string, action: string, extra?: Record<string, string>) {
    setActing(id);
    const res = await fetch("/api/admin/incidents", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ incident_id: id, action, ...extra }) });
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
    await load(); setActing(null);
  }

  function hoursOpen(detected: string) { return Math.round((Date.now() - new Date(detected).getTime()) / 3600000); }

  const active = incidents.filter(i => !["resolved", "closed"].includes(i.status));
  const resolved = incidents.filter(i => ["resolved", "closed"].includes(i.status));

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-pw-navy">Beveiligingsincidenten</h1>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
          <Plus className="w-4 h-4" /> Nieuw incident
        </button>
      </div>

      {showCreate && (
        <div className="mb-8 rounded-xl border-2 border-red-200 bg-red-50/50 p-5 space-y-3">
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Titel incident" className="w-full px-3 py-2 rounded-lg border text-sm" />
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Beschrijving" className="w-full px-3 py-2 rounded-lg border text-sm" rows={3} />
          <div className="flex gap-3">
            <select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})} className="px-3 py-2 rounded-lg border text-sm">
              <option value="critical">Kritiek</option><option value="high">Hoog</option><option value="medium">Middel</option><option value="low">Laag</option>
            </select>
            <select value={form.affected_scope} onChange={e => setForm({...form, affected_scope: e.target.value})} className="px-3 py-2 rounded-lg border text-sm">
              <option value="unknown">Onbekend</option><option value="all_users">Alle gebruikers</option><option value="specific_service">Specifieke dienst</option><option value="none">Geen</option>
            </select>
            {form.affected_scope === "specific_service" && (
              <select value={form.affected_service} onChange={e => setForm({...form, affected_service: e.target.value})} className="px-3 py-2 rounded-lg border text-sm">
                <option value="">Selecteer dienst</option><option value="email_scan">E-mail scan</option><option value="bank">Bankverbinding</option><option value="voice">Spraakassistent</option>
              </select>
            )}
          </div>
          <button onClick={create} disabled={!form.title || acting === "create"} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
            {acting === "create" ? <Loader2 className="w-4 h-4 animate-spin inline" /> : null} Incident aanmaken
          </button>
        </div>
      )}

      {loading ? <div className="text-center py-20 text-pw-muted"><Loader2 className="w-5 h-5 animate-spin inline" /> Laden...</div> : (
        <>
          {active.length > 0 && (
            <div className="mb-10 space-y-4">
              <h2 className="text-sm font-semibold text-pw-navy flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Actieve incidenten ({active.length})</h2>
              {active.map(inc => {
                const sev = SEV[inc.severity as keyof typeof SEV] || SEV.medium;
                const hrs = hoursOpen(inc.detected_at);
                const apDeadline = hrs >= 72;

                return (
                  <div key={inc.id} className={`rounded-xl border-2 ${sev.border} ${sev.bg} p-5`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[15px] font-bold text-pw-navy">{inc.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${sev.text} ${sev.border}`}>{inc.severity.toUpperCase()}</span>
                          {apDeadline && !inc.ap_notified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">⚠ AP DEADLINE VERSTREKEN</span>}
                        </div>
                        {inc.description && <p className="text-[13px] text-pw-text mt-1">{inc.description}</p>}
                        <p className="text-[12px] text-pw-muted mt-1">Gedetecteerd: {new Date(inc.detected_at).toLocaleString("nl-NL")} · {hrs} uur geleden</p>
                        {inc.affected_count != null && <p className="text-[12px] text-pw-muted">Getroffen gebruikers: <strong>{inc.affected_count}</strong></p>}
                      </div>
                      <div className="text-right">
                        <div className={`text-[20px] font-bold ${hrs >= 72 ? 'text-red-600' : hrs >= 48 ? 'text-orange-600' : 'text-pw-navy'}`}>{hrs}u</div>
                        <div className="text-[10px] text-pw-muted">van 72u</div>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 mb-3 text-[11px]">
                      <span className="px-2 py-1 rounded-full bg-white border">{inc.ap_notified ? `✅ AP gemeld ${inc.ap_reference ? `(${inc.ap_reference})` : ""}` : "❌ AP niet gemeld"}</span>
                      <span className="px-2 py-1 rounded-full bg-white border">{inc.users_notified ? `✅ ${inc.users_notified_count} gebruikers geïnformeerd` : "❌ Gebruikers niet geïnformeerd"}</span>
                      <span className="px-2 py-1 rounded-full bg-white border">Status: {inc.status}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => act(inc.id, "count_affected")} disabled={acting === inc.id} className="px-3 py-1.5 bg-white border rounded-lg text-[12px] font-medium active:scale-95 disabled:opacity-50">
                        <Users className="w-3 h-3 inline mr-1" /> Tel getroffen gebruikers
                      </button>
                      {!inc.ap_notified && (
                        <button onClick={() => { const ref = prompt("AP referentienummer (optioneel):"); act(inc.id, "mark_ap_notified", { reference: ref || "" }); }} disabled={acting === inc.id} className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[12px] font-medium active:scale-95 disabled:opacity-50">
                          <Shield className="w-3 h-3 inline mr-1" /> AP-melding registreren
                        </button>
                      )}
                      {!inc.users_notified && (
                        <button onClick={() => { if (confirm("ALLE gebruikers krijgen een beveiligingsmelding per e-mail. Doorgaan?")) act(inc.id, "notify_users"); }} disabled={acting === inc.id} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[12px] font-medium active:scale-95 disabled:opacity-50">
                          <Bell className="w-3 h-3 inline mr-1" /> Gebruikers informeren
                        </button>
                      )}
                      <button onClick={() => act(inc.id, "test_notify")} disabled={acting === inc.id} className="px-3 py-1.5 bg-white border border-amber-400 text-amber-700 rounded-lg text-[12px] font-medium active:scale-95 disabled:opacity-50">
                        📧 Test e-mail
                      </button>
                      <select onChange={e => { if (e.target.value) { const note = prompt("Toelichting (optioneel):"); act(inc.id, "update_status", { status: e.target.value, action_taken: note || "" }); e.target.value = ""; } }} className="px-3 py-1.5 bg-white border rounded-lg text-[12px]" defaultValue="">
                        <option value="" disabled>Status wijzigen...</option>
                        <option value="investigating">Onderzoek</option>
                        <option value="contained">Ingeperkt</option>
                        <option value="resolved">Opgelost</option>
                        <option value="closed">Gesloten</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {resolved.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-pw-navy flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Afgehandeld ({resolved.length})</h2>
              {resolved.map(inc => (
                <div key={inc.id} className="rounded-xl border border-pw-border bg-white px-5 py-3 mb-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="text-[13px] font-semibold text-pw-navy">{inc.title}</span>
                      <p className="text-[11px] text-pw-muted">{inc.ap_notified ? "AP gemeld" : ""} · {inc.users_notified ? `${inc.users_notified_count} gebruikers geïnformeerd` : ""}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {incidents.length === 0 && (
            <div className="text-center py-20">
              <Shield className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
              <p className="text-pw-muted text-sm">Geen beveiligingsincidenten geregistreerd.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
