import { getTenant, canManage } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";

export default async function ApiKeysPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: keys } = await supabase
    .from("b2b_api_keys")
    .select("id, name, key_prefix, scopes, rate_limit, environment, last_used_at, created_at, revoked_at")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false });

  interface ApiKeyRow { id: string; name: string; key_prefix: string; scopes: string[]; rate_limit: number; environment: string; last_used_at: string | null; created_at: string; revoked_at: string | null; }
  const activeKeys = ((keys || []) as ApiKeyRow[]).filter(k => !k.revoked_at);

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <h1 className="text-page-heading text-pw-text mb-2">API Keys</h1>
        <p className="text-label text-pw-muted mb-6">{activeKeys.length} actieve keys</p>

        <div className="bg-pw-blue-light border border-blue-200 rounded-card p-4 mb-6">
          <p className="text-label text-pw-blue">
            <strong>Base URL:</strong> <code className="bg-blue-100 px-2 py-0.5 rounded text-caption font-mono">https://api.paywatch.app/v1</code>
          </p>
          <p className="text-caption text-pw-blue mt-1">
            Gebruik je API key in de Authorization header: <code className="bg-blue-100 px-1 rounded">Bearer pw_live_...</code>
          </p>
        </div>

        <div className="bg-pw-surface border border-pw-border rounded-card overflow-hidden mb-6">
          {activeKeys.length === 0 ? (
            <div className="p-8 text-center text-pw-muted text-label">
              Nog geen API keys. Neem contact op met PayWatch om API toegang te activeren.
            </div>
          ) : (
            activeKeys.map((key) => (
              <div key={key.id} className="px-5 py-3 border-b border-pw-border/50 flex items-center justify-between text-label">
                <div>
                  <div className="font-medium text-pw-text">{key.name}</div>
                  <div className="text-caption text-pw-muted font-mono">{key.key_prefix}...</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-caption text-pw-muted">{key.rate_limit} req/min</span>
                  <span className={"px-2 py-0.5 text-tiny font-semibold rounded-badge " + (key.environment === "live" ? "bg-pw-green-light text-pw-green" : "bg-pw-amber-light text-pw-amber")}>
                    {key.environment}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-pw-surface border border-pw-border rounded-card p-5">
          <h2 className="text-card-title text-pw-text mb-3">Beschikbare scopes</h2>
          <div className="flex flex-wrap gap-2">
            {["users:read", "users:write", "debts:read", "debts:write", "plans:read", "plans:write", "analytics:read", "webhooks:manage"].map((scope) => (
              <span key={scope} className="px-3 py-1.5 bg-pw-bg rounded-badge text-caption font-mono text-pw-muted">{scope}</span>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
