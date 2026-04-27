import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SettingsPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", tenant.orgId)
    .single();

  if (!org) redirect("/");

  const features = org.features || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4" style={{ borderTopColor: tenant.primaryColor, borderTopWidth: 3, borderTopStyle: "solid" }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            {tenant.logoUrl && <img src={tenant.logoUrl} alt="" className="h-8 w-auto" />}
            <span className="text-lg font-bold" style={{ color: tenant.primaryColor }}>{tenant.orgName}</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
            <Link href="/users" className="text-gray-500 hover:text-gray-900">Gebruikers</Link>
            <Link href="/invites" className="text-gray-500 hover:text-gray-900">Uitnodigen</Link>
            <Link href="/settings" className="font-medium text-gray-900">Instellingen</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Instellingen</h1>

        <div className="space-y-6">
          {/* Branding */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Branding</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">{org.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">{org.slug}.paywatch.app</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primaire kleur</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: org.primary_color }} />
                  <span className="text-sm text-gray-600">{org.primary_color}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                {org.logo_url ? (
                  <img src={org.logo_url} alt="" className="h-8 w-auto" />
                ) : (
                  <span className="text-sm text-gray-400">Geen logo</span>
                )}
              </div>
            </div>
          </div>

          {/* Feature flags */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(features).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between py-2 px-3 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-700 font-mono">{key}</span>
                  <span className={"text-xs font-semibold " + (enabled ? "text-green-600" : "text-gray-400")}>
                    {enabled ? "Aan" : "Uit"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Organization info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Organisatie</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Type:</span> <span className="font-medium">{org.type}</span></div>
              <div><span className="text-gray-500">Tier:</span> <span className="font-medium">{org.tier}</span></div>
              <div><span className="text-gray-500">Status:</span> <span className="font-medium">{org.status}</span></div>
              <div><span className="text-gray-500">Contact:</span> <span className="font-medium">{org.contact_email || "—"}</span></div>
              <div><span className="text-gray-500">KvK:</span> <span className="font-medium">{org.kvk_number || "—"}</span></div>
              <div><span className="text-gray-500">Aangemaakt:</span> <span className="font-medium">{new Date(org.created_at).toLocaleDateString("nl-NL")}</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
