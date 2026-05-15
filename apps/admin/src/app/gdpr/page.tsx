"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Loader2, Shield, AlertCircle } from "lucide-react";

interface GdprRequest {
  id: string;
  user_id: string;
  user_email: string;
  ref: string;
  request_type: string;
  status: string;
  details: any;
  completed_at: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  inzage: "Inzage", overdracht: "Overdracht", toestemming_intrekken: "Toestemming intrekken",
  rectificatie: "Correctie", beperking: "Beperking", bezwaar: "Bezwaar", verwijdering: "Verwijdering",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function GdprPage() {
  const [requests, setRequests] = useState<GdprRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/gdpr");
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests || []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function complete(requestId: string) {
    setCompleting(requestId);
    const res = await fetch("/api/admin/gdpr", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, note: note || undefined }),
    });
    if (res.ok) {
      setNote("");
      setShowNoteFor(null);
      await load();
    }
    setCompleting(null);
  }

  const pending = requests.filter(r => r.status !== "completed");
  const completed = requests.filter(r => r.status === "completed");

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6 text-pw-blue" strokeWidth={1.5} />
        <h1 className="text-2xl font-bold text-pw-navy">Privacyverzoeken (AVG)</h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-pw-muted py-20 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          Laden...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20">
          <Shield className="w-10 h-10 text-pw-muted/30 mx-auto mb-3" />
          <p className="text-pw-muted text-sm">Nog geen privacyverzoeken ontvangen.</p>
        </div>
      ) : (
        <>
          {/* Pending requests */}
          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-pw-navy mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Open verzoeken ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map(r => (
                  <div key={r.id} className="rounded-xl border border-amber-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-pw-navy">{TYPE_LABELS[r.request_type] || r.request_type}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[r.status] || STATUS_COLORS.pending}`}>
                            {r.status === "processing" ? "In behandeling" : r.status}
                          </span>
                          <span className="text-[11px] text-pw-blue font-mono">REF: {r.ref}</span>
                        </div>
                        <p className="text-[13px] text-pw-muted mt-1">{r.user_email}</p>
                        <p className="text-[12px] text-pw-muted mt-0.5">
                          {new Date(r.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {r.details?.user_details && (
                          <div className="mt-2 px-3 py-2 bg-pw-bg rounded-lg text-[13px] text-pw-text">
                            {r.details.user_details}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {showNoteFor === r.id ? (
                          <div className="space-y-2 w-56">
                            <textarea value={note} onChange={(e) => setNote(e.target.value)}
                              placeholder="Toelichting (optioneel)..."
                              className="w-full rounded-lg border border-pw-border bg-pw-bg px-3 py-2 text-[12px] resize-none" rows={2} />
                            <div className="flex gap-2">
                              <button onClick={() => complete(r.id)} disabled={completing === r.id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-medium rounded-lg disabled:opacity-50">
                                {completing === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Afronden
                              </button>
                              <button onClick={() => { setShowNoteFor(null); setNote(""); }}
                                className="px-3 py-1.5 text-[11px] text-pw-muted">Annuleer</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setShowNoteFor(r.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-lg border border-emerald-200 hover:bg-emerald-100">
                            <CheckCircle2 className="w-3 h-3" />
                            Markeer als afgerond
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed requests */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-pw-navy mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Afgerond ({completed.length})
              </h2>
              <div className="space-y-2">
                {completed.map(r => (
                  <div key={r.id} className="rounded-xl border border-pw-border bg-white px-5 py-3 flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-pw-navy">{TYPE_LABELS[r.request_type] || r.request_type}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">Afgerond</span>
                        <span className="text-[10px] text-pw-blue font-mono">REF: {r.ref}</span>
                      </div>
                      <p className="text-[12px] text-pw-muted">{r.user_email} · {new Date(r.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</p>
                    </div>
                    {r.completed_at && (
                      <p className="text-[11px] text-pw-muted flex-shrink-0">
                        Afgerond {new Date(r.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
