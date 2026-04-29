"use client";

import { useState } from "react";

interface Endpoint {
  id: string;
  label: string;
  method: string;
  path: string;
  scope: string;
  body: any;
  extraHeaders?: Record<string, string>;
  description: string;
}

export default function ApiTestClient({ orgId, orgSlug }: { orgId: string; orgSlug: string }) {
  const ENDPOINTS: Endpoint[] = [
    {
      id: "invite",
      label: "Uitnodiging aanmaken",
      method: "POST",
      path: "/api/v1/invite",
      scope: "users:write",
      body: { email: "test@voorbeeld.nl", external_id: "TEST-001" },
      description: "Maakt een uitnodiging aan met QR code en invite URL.",
    },
    {
      id: "api-key",
      label: "API Key aanmaken",
      method: "POST",
      path: "/api/v1/api-keys",
      scope: "intern",
      body: { name: "Test key", environment: "sandbox", scopes: ["users:read", "analytics:read"] },
      description: "Genereert een nieuwe API key. Wordt eenmalig getoond.",
    },
    {
      id: "buddy",
      label: "Coach toewijzen",
      method: "POST",
      path: "/api/v1/buddies",
      scope: "intern",
      body: { user_id: "d0000001-0000-0000-0000-000000000013", buddy_member_id: "080cc939-de61-4b8d-b4a3-a9978d65cd7c", role: "schuldhulpverlener" },
      description: "Koppelt een gebruiker aan een coach.",
    },
    {
      id: "members",
      label: "Teamlid uitnodigen",
      method: "POST",
      path: "/api/members",
      scope: "intern",
      body: { email: "testlid@voorbeeld.nl", role: "viewer", organization_id: orgId },
      description: "Nodigt een teamlid uit met tijdelijk wachtwoord.",
    },
    {
      id: "webhook",
      label: "Webhook delivery (test)",
      method: "POST",
      path: "/api/v1/webhooks/deliver",
      scope: "intern (Supabase)",
      body: {
        type: "INSERT",
        table: "user_organizations",
        schema: "public",
        record: { user_id: "d0000001-0000-0000-0000-000000000001", organization_id: orgId, status: "active" },
        old_record: null,
      },
      extraHeaders: { "x-webhook-secret": "" },
      description: "Simuleert een Supabase DB webhook event. Vul je SUPABASE_WEBHOOK_SECRET in.",
    },
    {
      id: "org-update",
      label: "Organisatie bijwerken",
      method: "PATCH",
      path: `/api/organizations/${orgId}`,
      scope: "super-admin",
      body: { name: "Gemeente Wormerveer", status: "active" },
      description: "Werkt organisatiegegevens bij (alleen super-admin).",
    },
  ];

  const [active, setActive] = useState<Endpoint>(ENDPOINTS[0]);
  const [bodyText, setBodyText] = useState(JSON.stringify(ENDPOINTS[0].body, null, 2));
  const [headerText, setHeaderText] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [history, setHistory] = useState<{ method: string; path: string; status: number; ms: number }[]>([]);

  function selectEndpoint(ep: Endpoint) {
    setActive(ep);
    setBodyText(JSON.stringify(ep.body, null, 2));
    setHeaderText(ep.extraHeaders ? JSON.stringify(ep.extraHeaders, null, 2) : "");
    setResponse(null);
    setStatus(null);
    setDuration(null);
  }

  async function runTest() {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    const start = performance.now();

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (headerText) {
      try { Object.assign(headers, JSON.parse(headerText)); } catch {}
    }

    try {
      const res = await fetch(active.path, {
        method: active.method,
        headers,
        body: ["GET", "HEAD"].includes(active.method) ? undefined : bodyText,
      });
      const ms = Math.round(performance.now() - start);
      setStatus(res.status);
      setDuration(ms);
      let data;
      try { data = await res.json(); } catch { data = { raw: await res.text() }; }
      setResponse(data);
      setHistory(prev => [{ method: active.method, path: active.path, status: res.status, ms }, ...prev.slice(0, 9)]);
    } catch (err: any) {
      setResponse({ error: err.message });
      setStatus(0);
      setDuration(Math.round(performance.now() - start));
    }
    setLoading(false);
  }

  const statusColor = status !== null ? (status >= 200 && status < 300 ? "#059669" : status === 401 ? "#D97706" : "#DC2626") : "#64748B";

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">API Tester</h1>
          <p className="text-sm text-pw-muted mt-1">Test alle endpoints direct vanuit het portaal</p>
        </div>
      </div>

      {/* Endpoint selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {ENDPOINTS.map((ep) => (
          <button
            key={ep.id}
            onClick={() => selectEndpoint(ep)}
            className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${active.id === ep.id ? "bg-blue-50 border-pw-blue/30 text-pw-blue" : "bg-white border-pw-border text-pw-text hover:bg-pw-bg"}`}
          >
            <span className={`text-[10px] font-bold mr-1.5 px-1.5 py-0.5 rounded ${ep.method === "GET" ? "bg-green-50 text-pw-green" : ep.method === "PATCH" ? "bg-amber-50 text-pw-amber" : "bg-blue-50 text-pw-blue"}`}>
              {ep.method}
            </span>
            {ep.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Request */}
        <div className="bg-white border border-pw-border rounded-2xl p-5">
          <div className="mb-3">
            <div className="text-sm font-bold text-pw-navy">{active.label}</div>
            <code className="text-xs text-pw-muted">{active.method} {active.path}</code>
          </div>
          <p className="text-xs text-pw-muted mb-4">{active.description}</p>

          <div className="mb-3">
            <label className="block text-[10px] font-bold text-pw-muted uppercase tracking-wider mb-1">Scope: {active.scope}</label>
          </div>

          <div className="mb-3">
            <label className="block text-[10px] font-bold text-pw-muted uppercase tracking-wider mb-1">Request Body</label>
            <textarea
              value={bodyText} onChange={(e) => setBodyText(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 bg-pw-bg border border-pw-border rounded-lg font-mono text-xs resize-y"
            />
          </div>

          {active.extraHeaders && (
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-pw-muted uppercase tracking-wider mb-1">Extra Headers</label>
              <textarea
                value={headerText} onChange={(e) => setHeaderText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-pw-bg border border-pw-border rounded-lg font-mono text-xs resize-y"
              />
            </div>
          )}

          <button onClick={runTest} disabled={loading}
            className="w-full py-2.5 bg-pw-blue text-white text-sm font-bold rounded hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? "Verzenden..." : "Verstuur request"}
          </button>
        </div>

        {/* Response */}
        <div className="bg-white border border-pw-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-pw-navy">Response</span>
            <div className="flex items-center gap-2">
              {duration !== null && <span className="text-xs text-pw-muted">{duration}ms</span>}
              {status !== null && (
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: statusColor, background: status >= 200 && status < 300 ? "#F0FDF4" : status === 401 ? "#FEF3C7" : "#FEF2F2" }}>
                  {status === 0 ? "NETWORK ERROR" : status}
                </span>
              )}
            </div>
          </div>

          {response ? (
            <pre className="bg-pw-navy text-blue-100 p-4 rounded-xl text-xs font-mono overflow-auto max-h-96 whitespace-pre-wrap break-words">
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : (
            <div className="py-16 text-center text-sm text-pw-muted">Klik op &quot;Verstuur request&quot; om te testen</div>
          )}

          {status === 401 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <strong>401</strong> — Je bent niet ingelogd of je sessie is verlopen. Ververs de pagina en log opnieuw in.
            </div>
          )}
        </div>
      </div>

      {/* Request history */}
      {history.length > 0 && (
        <div className="mt-4 bg-white border border-pw-border rounded-2xl p-5">
          <h2 className="text-sm font-bold text-pw-navy mb-3">Geschiedenis</h2>
          <div className="space-y-1">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-xs py-1.5 border-b border-pw-border/30 last:border-0">
                <span className={`font-bold px-1.5 py-0.5 rounded ${h.method === "GET" ? "bg-green-50 text-pw-green" : h.method === "PATCH" ? "bg-amber-50 text-pw-amber" : "bg-blue-50 text-pw-blue"}`}>{h.method}</span>
                <code className="text-pw-muted flex-1 truncate">{h.path}</code>
                <span className="font-bold" style={{ color: h.status >= 200 && h.status < 300 ? "#059669" : "#DC2626" }}>{h.status}</span>
                <span className="text-pw-muted">{h.ms}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
