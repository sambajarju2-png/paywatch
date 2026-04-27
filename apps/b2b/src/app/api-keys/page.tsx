import { getTenant, canManage } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import OrgNav from "@/components/OrgNav";

export default async function ApiKeysPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");
  if (!canManage(tenant)) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: keys } = await supabase
    .from("b2b_api_keys")
    .select("id, name, key_prefix, scopes, rate_limit, environment, last_used_at, created_at, revoked_at")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false });

  interface ApiKeyRow {
    id: string;
    name: string;
    key_prefix: string;
    scopes: string[];
    rate_limit: number;
    environment: string;
    last_used_at: string | null;
    created_at: string;
    revoked_at: string | null;
  }

  const activeKeys = ((keys || []) as ApiKeyRow[]).filter(k => !k.revoked_at);
  const revokedKeys = ((keys || []) as ApiKeyRow[]).filter(k => k.revoked_at);

  return (
    <div className="min-h-screen bg-gray-50">
      <OrgNav tenant={tenant} userEmail={user.email} active="api-keys" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
            <p className="text-sm text-gray-500 mt-1">{activeKeys.length} actieve keys</p>
          </div>
        </div>

        {/* API docs link */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Base URL:</strong>{" "}
            <code className="bg-blue-100 px-2 py-0.5 rounded text-xs font-mono">https://api.paywatch.app/v1</code>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Gebruik je API key in de Authorization header: <code className="bg-blue-100 px-1 rounded">Bearer pw_live_...</code>
          </p>
        </div>

        {/* Active keys */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Actieve keys</h2>
          </div>

          {activeKeys.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Nog geen API keys. Neem contact op met PayWatch om API toegang te activeren.
            </div>
          ) : (
            activeKeys.map((key) => (
              <div key={key.id} className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{key.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{key.key_prefix}...</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">{key.rate_limit} req/min</span>
                  <span className={"px-2 py-0.5 text-[10px] font-semibold rounded " +
                    (key.environment === "live" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>
                    {key.environment}
                  </span>
                  <span className="text-xs text-gray-400">
                    {key.last_used_at ? `Laatst: ${new Date(key.last_used_at).toLocaleDateString("nl-NL")}` : "Nog niet gebruikt"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Scopes reference */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm">Beschikbare scopes</h2>
          <div className="grid grid-cols-3 gap-2">
            {["users:read", "users:write", "debts:read", "debts:write", "plans:read", "plans:write", "analytics:read", "webhooks:manage"].map((scope) => (
              <div key={scope} className="px-3 py-1.5 bg-gray-50 rounded text-xs font-mono text-gray-600">{scope}</div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
