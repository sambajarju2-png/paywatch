"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Loader2, Shield, AlertCircle, Trash2, Pause, Play, Download, FileText } from "lucide-react";

interface GdprRequest {
  id: string;
  user_id: string;
  user_email: string;
  ref: string;
  request_type: string;
  status: string;
  details: any;
  action_taken: string | null;
  completed_at: string | null;
  created_at: string;
  days_open: number;
}

const TYPE_CONFIG: Record<string, { label: string; icon: any; actions: { key: string; label: string; icon: any; color: string; confirm: string }[] }> = {
  verwijdering: {
    label: "Verwijdering",
    icon: Trash2,
    actions: [
      { key: "delete_account", label: "Account verwijderen", icon: Trash2, color: "bg-red-600 text-white", confirm: "ALLE gegevens van deze gebruiker worden permanent verwijderd. Dit kan niet ongedaan worden. Doorgaan?" },
    ],
  },
  beperking: {
    label: "Beperking",
    icon: Pause,
    actions: [
      { key: "restrict_account", label: "Account bevriezen", icon: Pause, color: "bg-amber-600 text-white", confirm: "Account wordt bevroren — verwerking wordt gepauzeerd. Doorgaan?" },
      { key: "unrestrict_account", label: "Account ontdooien", icon: Play, color: "bg-emerald-600 text-white", confirm: "Account wordt weer actief. Doorgaan?" },
    ],
  },
  inzage: {
    label: "Inzage",
    icon: Download,
    actions: [
      { key: "generate_export", label: "Data-export genereren", icon: Download, color: "bg-pw-blue text-white", confirm: "Data-export voor deze gebruiker genereren?" },
    ],
  },
  overdracht: {
    label: "Overdracht",
    icon: Download,
    actions: [
      { key: "generate_export", label: "Data-export genereren", icon: Download, color: "bg-pw-blue text-white", confirm: "Data-export voor deze gebruiker genereren?" },
    ],
  },
  rectificatie: {
    label: "Correctie",
    icon: FileText,
    actions: [
      { key: "complete", label: "Afronden met toelichting", icon: CheckCircle2, color: "bg-emerald-600 text-white", confirm: "" },
    ],
  },
  bezwaar: {
    label: "Bezwaar",
    icon: FileText,
    actions: [
      { key: "complete", label: "Afronden met toelichting", icon: CheckCircle2, color: "bg-emerald-600 text-white", confirm: "" },
    ],
  },
  toestemming_intrekken: {
    label: "Toestemming intrekken",
    icon: CheckCircle2,
    actions: [
      { key: "complete", label: "Bevestig afronding", icon: CheckCircle2, color: "bg-emerald-600 text-white", confirm: "" },
    ],
  },
};

export default function GdprPage() {
  const [requests, setRequests] = useState<GdprRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/gdpr");
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests || []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function executeAction(requestId: string, action: string, confirmMsg: string) {
    let note: string | undefined;

    if (confirmMsg) {
      if (!confirm(confirmMsg)) return;
    }

    if (action === "complete") {
      const input = prompt("Toelichting bij afronding:");
      if (input === null) return;
      note = input || undefined;
    }

    setActing(requestId);
    try {
      const res = await fetch("/api/admin/gdpr", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId, action, note }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.export) {
          // Download the export as JSON
          const blob = new Blob([JSON.stringify(data.export, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `gdpr-export-${requestId.slice(0, 8)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
        alert(`✓ ${data.message || "Actie uitgevoerd"}\n\n${data.action || ""}`);
        await load();
      } else {
        alert(`Fout: ${data.error || "Onbekende fout"}`);
      }
    } catch {
      alert("Netwerkfout bij uitvoeren actie.");
    }
    setActing(null);
  }

  const pending = requests.filter(r => r.status !== "completed");
  const completed = requests.filter(r => r.status === "completed");

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-6 h-6 text-pw-blue" strokeWidth={1.5} />
        <h1 className="text-2xl font-bold text-pw-navy">Privacyverzoeken</h1>
      </div>
      <p className="text-sm text-pw-muted mb-8">AVG/GDPR verzoeken van gebruikers. Wettelijke deadline: 30 dagen.</p>

      {loading ? (
        <div className="flex items-center gap-2 text-pw-muted py-20 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Laden...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20">
          <Shield className="w-10 h-10 text-pw-muted/30 mx-auto mb-3" />
          <p className="text-pw-muted text-sm">Nog geen privacyverzoeken.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-pw-navy mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Open verzoeken ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map(r => {
                  const config = TYPE_CONFIG[r.request_type] || TYPE_CONFIG.rectificatie;
                  const TypeIcon = config.icon;
                  const isOverdue = r.days_open >= 25;
                  const isUrgent = r.days_open >= 20;

                  return (
                    <div key={r.id} className={`rounded-xl border-2 bg-white p-5 ${isOverdue ? "border-red-300" : isUrgent ? "border-amber-300" : "border-amber-200"}`}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <TypeIcon className="w-4 h-4 text-pw-navy" strokeWidth={2} />
                            <span className="text-[15px] font-bold text-pw-navy">{config.label}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200 font-medium">
                              In behandeling
                            </span>
                            {isOverdue && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">⚠ DEADLINE NADERT</span>}
                          </div>
                          <p className="text-[12px] text-pw-blue font-mono mt-1">REF: {r.ref}</p>
                        </div>
                        <div className="text-right text-[12px] text-pw-muted flex-shrink-0">
                          <p>Dag {r.days_open} van 30</p>
                        </div>
                      </div>

                      {/* User info */}
                      <div className="flex items-center gap-4 mb-3 text-[13px]">
                        <span className="text-pw-text font-medium">{r.user_email}</span>
                        <span className="text-pw-muted">
                          {new Date(r.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* User's message */}
                      {r.details?.user_details && (
                        <div className="mb-4 px-3 py-2 bg-pw-bg rounded-lg text-[13px] text-pw-text italic">
                          &ldquo;{r.details.user_details}&rdquo;
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {config.actions.map(a => (
                          <button
                            key={a.key}
                            onClick={() => executeAction(r.id, a.key, a.confirm)}
                            disabled={acting === r.id}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold rounded-lg active:scale-95 disabled:opacity-50 ${a.color}`}
                          >
                            {acting === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <a.icon className="w-4 h-4" strokeWidth={2} />}
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-pw-navy mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Afgerond ({completed.length})
              </h2>
              <div className="space-y-2">
                {completed.map(r => {
                  const config = TYPE_CONFIG[r.request_type] || TYPE_CONFIG.rectificatie;
                  return (
                    <div key={r.id} className="rounded-xl border border-pw-border bg-white px-5 py-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold text-pw-navy">{config.label}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">Afgerond</span>
                            <span className="text-[10px] text-pw-blue font-mono">REF: {r.ref}</span>
                          </div>
                          <p className="text-[12px] text-pw-muted">{r.user_email}</p>
                          {r.action_taken && <p className="text-[11px] text-pw-muted mt-0.5">{r.action_taken}</p>}
                        </div>
                        <div className="text-[11px] text-pw-muted text-right flex-shrink-0">
                          {r.completed_at && new Date(r.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                          {r.fulfilled_by && <p className="text-[10px]">door {r.fulfilled_by}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
