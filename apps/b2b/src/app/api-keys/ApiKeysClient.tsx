"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  rate_limit: number;
  environment: string;
  last_used_at: string | null;
  created_at: string;
}

const AVAILABLE_SCOPES = [
  { key: "users:read", label: "Gebruikers lezen" },
  { key: "users:write", label: "Gebruikers schrijven" },
  { key: "debts:read", label: "Schuldendata lezen" },
  { key: "debts:write", label: "Schuldendata schrijven" },
  { key: "plans:read", label: "Regelingen lezen" },
  { key: "plans:write", label: "Regelingen schrijven" },
  { key: "analytics:read", label: "Analytics lezen" },
  { key: "webhooks:manage", label: "Webhooks beheren" },
];

const ENDPOINTS = [
  { method: "GET", path: "/v1/users", scope: "users:read", desc: "Lijst van gekoppelde gebruikers" },
  { method: "GET", path: "/v1/analytics", scope: "analytics:read", desc: "Geaggregeerde rapportage" },
  { method: "POST", path: "/v1/invite", scope: "users:write", desc: "Uitnodiging aanmaken" },
  { method: "POST", path: "/v1/webhooks", scope: "webhooks:manage", desc: "Webhook registreren" },
  { method: "GET", path: "/v1/debts", scope: "debts:read", desc: "Schuldendata per gebruiker" },
];

const METHOD_COLORS: Record<string, string> = { GET: "bg-green-50 text-pw-green", POST: "bg-blue-50 text-pw-blue" };

export default function ApiKeysClient({ keys, orgId }: { keys: ApiKey[]; orgId: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [env, setEnv] = useState("sandbox");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["users:read", "analytics:read"]);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);

  function toggleScope(scope: string) {
    setSelectedScopes(prev => prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]);
  }

  async function handleCreate() {
    if (!name) return;
    setCreating(true);
    try {
      const res = await fetch("/api/v1/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, environment: env, scopes: selectedScopes, organization_id: orgId }),
      });
      const data = await res.json();
      if (data.key) {
        setNewKey(data.key);
      }
    } catch {}
    setCreating(false);
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">API</h1>
          <p className="text-sm text-pw-muted mt-1">{keys.length} actieve keys</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowDocs(!showDocs)}
            className="px-4 py-2 bg-white border border-pw-border rounded-lg text-sm font-medium text-pw-text hover:bg-pw-bg transition-colors">
            {showDocs ? "Verberg documentatie" : "API Documentatie"}
          </button>
          <button onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-pw-blue text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors">
            + Nieuwe API key
          </button>
        </div>
      </div>

      {/* Auth info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-pw-blue">Base URL:</span>
          <code className="text-sm font-mono bg-white px-2 py-0.5 rounded border border-blue-200">https://b2b.paywatch.app/api</code>
        </div>
        <p className="text-xs text-pw-blue">Gebruik je API key in de Authorization header: <code className="bg-white px-1.5 py-0.5 rounded">Bearer pw_live_...</code></p>
      </div>

      {/* Keys list */}
      <div className="bg-white border border-pw-border rounded-2xl overflow-hidden mb-4">
        {keys.length === 0 ? (
          <div className="p-12 text-center text-sm text-pw-muted">Nog geen API keys aangemaakt</div>
        ) : keys.map((key, i) => (
          <div key={key.id} className={`px-5 py-4 flex items-center justify-between ${i < keys.length - 1 ? "border-b border-pw-border" : ""}`}>
            <div>
              <div className="text-sm font-semibold text-pw-navy">{key.name}</div>
              <div className="text-xs text-pw-muted font-mono mt-0.5">{key.key_prefix}...</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {key.scopes.map(s => <span key={s} className="text-[9px] font-bold text-pw-muted bg-pw-bg px-1.5 py-0.5 rounded">{s}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-pw-muted">{key.rate_limit} req/min</span>
              <Badge variant={key.environment === "live" ? "success" : "warning"}>{key.environment}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* New key created */}
      {newKey && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
          <p className="text-sm font-bold text-pw-green mb-2">API key aangemaakt! Kopieer deze nu, je ziet hem niet meer terug.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded border border-green-200 text-pw-text">{newKey}</code>
            <button onClick={() => { navigator.clipboard.writeText(newKey); }}
              className="px-3 py-2 bg-pw-green text-white text-sm font-semibold rounded">Kopieer</button>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-pw-navy">Nieuwe API key</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-pw-bg rounded-lg text-pw-muted">✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Naam</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Bijv. Productie integratie"
                className="w-full px-3 py-2 border border-pw-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Omgeving</label>
              <div className="flex gap-2">
                <button onClick={() => setEnv("sandbox")} className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${env === "sandbox" ? "bg-amber-50 border-pw-amber text-pw-amber" : "bg-white border-pw-border text-pw-muted"}`}>Sandbox</button>
                <button onClick={() => setEnv("live")} className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${env === "live" ? "bg-green-50 border-pw-green text-pw-green" : "bg-white border-pw-border text-pw-muted"}`}>Live</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Scopes</label>
              <div className="grid grid-cols-2 gap-1">
                {AVAILABLE_SCOPES.map(s => (
                  <button key={s.key} onClick={() => toggleScope(s.key)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${selectedScopes.includes(s.key) ? "bg-blue-50 border-pw-blue/30 text-pw-blue" : "bg-white border-pw-border text-pw-muted"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 bg-white border border-pw-border rounded-lg text-sm font-medium text-pw-text">Annuleren</button>
              <button onClick={handleCreate} disabled={creating || !name}
                className="flex-1 px-4 py-2 bg-pw-blue text-white rounded text-sm font-semibold disabled:opacity-50">
                {creating ? "Aanmaken..." : "API key aanmaken"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline docs */}
      {showDocs && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-pw-navy">Endpoints</h2>
          {ENDPOINTS.map(ep => (
            <div key={ep.path + ep.method} className="bg-white border border-pw-border rounded-2xl p-4 flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
              <code className="text-sm font-semibold text-pw-navy font-mono">{ep.path}</code>
              <span className="text-xs text-pw-muted">{ep.desc}</span>
              <span className="ml-auto text-[10px] font-bold text-pw-muted bg-pw-bg px-2 py-0.5 rounded">{ep.scope}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
