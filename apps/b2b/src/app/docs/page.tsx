import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";

const ENDPOINTS = [
  {
    method: "GET", path: "/v1/users", scope: "users:read",
    description: "Lijst van gekoppelde gebruikers (geanonimiseerd, alleen met toestemming)",
    response: '[\n  {\n    "id": "uuid",\n    "external_id": "WV-2026-001",\n    "status": "active",\n    "escalation_stage": "factuur",\n    "has_payment_plan": false,\n    "onboarded_at": "2026-03-15T10:00:00Z"\n  }\n]',
  },
  {
    method: "GET", path: "/v1/analytics", scope: "analytics:read",
    description: "Geaggregeerde rapportage over alle gekoppelde gebruikers",
    response: '{\n  "total_users": 15,\n  "active_users": 11,\n  "activation_rate": 0.73,\n  "escalation_distribution": {\n    "factuur": 7,\n    "herinnering": 3,\n    "aanmaning": 2,\n    "incasso": 2,\n    "deurwaarder": 2\n  }\n}',
  },
  {
    method: "POST", path: "/v1/invite", scope: "users:write",
    description: "Maak een uitnodiging aan voor een nieuwe gebruiker",
    body: '{\n  "email": "gebruiker@voorbeeld.nl",\n  "external_id": "WV-2026-016"\n}',
    response: '{\n  "invite_id": "uuid",\n  "invite_url": "https://app.paywatch.app/invite/...",\n  "qr_code_url": "data:image/png;base64,..."\n}',
  },
  {
    method: "POST", path: "/v1/webhooks", scope: "webhooks:manage",
    description: "Registreer een webhook endpoint voor real-time notificaties",
    body: '{\n  "url": "https://jouw-systeem.nl/paywatch-webhook",\n  "events": ["user.onboarded", "consent.granted"],\n  "secret": "jouw-geheim"\n}',
    response: '{\n  "webhook_id": "uuid",\n  "status": "active"\n}',
  },
  {
    method: "GET", path: "/v1/debts", scope: "debts:read",
    description: "Geaggregeerde schuldendata per gebruiker (vereist consent scope)",
    response: '[\n  {\n    "user_external_id": "WV-2026-001",\n    "total_outstanding_cents": 34299,\n    "bill_count": 3,\n    "highest_escalation": "herinnering"\n  }\n]',
  },
];

const EVENTS = [
  { name: "user.onboarded", description: "Gebruiker heeft account aangemaakt via uitnodiging" },
  { name: "user.status_changed", description: "Status van een gebruiker is gewijzigd (active, paused, etc.)" },
  { name: "consent.granted", description: "Gebruiker heeft toestemming verleend voor datadeling" },
  { name: "consent.revoked", description: "Gebruiker heeft toestemming ingetrokken" },
  { name: "bill.created", description: "Nieuwe rekening toegevoegd door gebruiker" },
  { name: "payment_plan.created", description: "Gebruiker is een betalingsregeling gestart" },
  { name: "buddy.assigned", description: "Coach is gekoppeld aan een gebruiker" },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-50 text-pw-green",
  POST: "bg-blue-50 text-pw-blue",
  PATCH: "bg-amber-50 text-pw-amber",
  DELETE: "bg-red-50 text-pw-red",
};

export default async function DocsPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 900 }}>
        <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight mb-2">API Documentatie</h1>
        <p className="text-sm text-pw-muted mb-8">Integreer PayWatch met je bestaande systemen via onze REST API.</p>

        {/* Auth section */}
        <div className="bg-white border border-pw-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-bold text-pw-navy mb-3">Authenticatie</h2>
          <p className="text-sm text-pw-muted mb-3">
            Elke API call vereist een geldige API key in de <code className="bg-pw-bg px-1 rounded font-mono text-xs">Authorization</code> header.
            Maak API keys aan via de <a href="/api-keys" className="text-pw-blue hover:underline">API pagina</a> in dit portaal.
          </p>
          <p className="text-sm text-pw-muted mb-4">
            Er zijn twee soorten keys: <strong>Live</strong> (echte data) en <strong>Sandbox</strong> (testomgeving). Begin altijd met Sandbox om te integreren.
            Elke key heeft scopes die bepalen wat je kunt doen. Geef alleen de scopes die je nodig hebt.
          </p>
          <div className="bg-pw-bg rounded-xl p-4 font-mono text-sm text-pw-text">
            <span className="text-pw-muted">curl</span> -H <span className="text-pw-blue">"Authorization: Bearer pw_live_..."</span> \<br />
            &nbsp;&nbsp;&nbsp;&nbsp; https://b2b.paywatch.app/api/v1/users
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-pw-amber font-semibold">Base URL: https://b2b.paywatch.app/api</p>
            <p className="text-xs text-pw-muted mt-1">Alle verzoeken vereisen een geldige API key met de juiste scope.</p>
          </div>
        </div>

        {/* Endpoints */}
        <h2 className="text-base font-bold text-pw-navy mb-4">Endpoints</h2>
        <div className="space-y-4 mb-8">
          {ENDPOINTS.map((ep) => (
            <details key={ep.path + ep.method} className="bg-white border border-pw-border rounded-2xl overflow-hidden group">
              <summary className="flex items-center gap-3 p-5 cursor-pointer hover:bg-pw-bg/50 transition-colors">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
                <code className="text-sm font-semibold text-pw-navy font-mono">{ep.path}</code>
                <span className="text-xs text-pw-muted ml-2">{ep.description}</span>
                <span className="ml-auto text-[10px] font-bold text-pw-muted bg-pw-bg px-2 py-0.5 rounded">{ep.scope}</span>
              </summary>
              <div className="border-t border-pw-border p-5 space-y-4">
                <p className="text-sm text-pw-text">{ep.description}</p>
                {(ep as any).notes && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs text-pw-blue leading-relaxed">{(ep as any).notes}</p>
                  </div>
                )}
                {ep.body && (
                  <div>
                    <p className="text-xs font-bold text-pw-muted uppercase tracking-wider mb-2">Request Body</p>
                    <pre className="bg-pw-bg rounded-xl p-4 text-xs font-mono text-pw-text overflow-x-auto">{ep.body}</pre>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-pw-muted uppercase tracking-wider mb-2">Response</p>
                  <pre className="bg-pw-bg rounded-xl p-4 text-xs font-mono text-pw-text overflow-x-auto">{ep.response}</pre>
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Webhook events */}
        <h2 className="text-base font-bold text-pw-navy mb-4">Webhook Events</h2>
        <div className="bg-white border border-pw-border rounded-2xl overflow-hidden mb-8">
          {EVENTS.map((ev, i) => (
            <div key={ev.name} className={`flex items-center justify-between px-5 py-3 ${i < EVENTS.length - 1 ? "border-b border-pw-border" : ""}`}>
              <div className="flex items-center gap-3">
                <code className="text-xs font-mono font-semibold text-pw-navy bg-pw-bg px-2 py-1 rounded">{ev.name}</code>
                <span className="text-sm text-pw-muted">{ev.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Rate limits */}
        <div className="bg-white border border-pw-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-pw-navy mb-3">Rate Limits & Privacy</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-pw-muted uppercase tracking-wider mb-2">Rate limits</p>
              <p className="text-sm text-pw-text">Standaard: 60 verzoeken per minuut per API key. Sandbox: 30/min.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-pw-muted uppercase tracking-wider mb-2">Privacy (AVG)</p>
              <p className="text-sm text-pw-text">Persoonlijke gegevens worden alleen gedeeld na expliciete toestemming van de gebruiker. Alle data is versleuteld.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
