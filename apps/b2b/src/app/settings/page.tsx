import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";

export default async function SettingsPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: org } = await supabase.from("organizations").select("*").eq("id", tenant.orgId).single();
  if (!org) redirect("/");

  const features = org.features || {};

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 900 }}>
        <h1 className="text-page-heading text-pw-text mb-6">Instellingen</h1>

        <div className="space-y-4">
          <div className="bg-pw-surface border border-pw-border rounded-card p-6">
            <h2 className="text-section-head text-pw-text mb-4">Branding</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-caption text-pw-muted mb-1">Naam</div>
                <div className="text-label text-pw-text font-medium">{org.name}</div>
              </div>
              <div>
                <div className="text-caption text-pw-muted mb-1">Subdomain</div>
                <div className="text-label text-pw-text font-medium font-mono">{org.slug}.paywatch.app</div>
              </div>
              <div>
                <div className="text-caption text-pw-muted mb-1">Hoofdkleur</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: org.primary_color }} />
                  <span className="text-label text-pw-muted font-mono">{org.primary_color}</span>
                </div>
              </div>
              <div>
                <div className="text-caption text-pw-muted mb-1">Logo</div>
                {org.logo_url ? <img src={org.logo_url} alt="" className="h-8 w-auto" /> : <span className="text-label text-pw-muted">Geen logo</span>}
              </div>
            </div>
          </div>

          <div className="bg-pw-surface border border-pw-border rounded-card p-6">
            <h2 className="text-section-head text-pw-text mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(features).map(([key, enabled]) => (
                <div key={key} className="flex items-center gap-2 py-1.5">
                  <span className={"w-2 h-2 rounded-full " + (enabled ? "bg-pw-green" : "bg-pw-border")} />
                  <span className="text-label text-pw-text font-mono">{key}</span>
                  <span className={"text-caption font-semibold ml-auto " + (enabled ? "text-pw-green" : "text-pw-muted")}>{enabled ? "Aan" : "Uit"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-pw-surface border border-pw-border rounded-card p-6">
            <h2 className="text-section-head text-pw-text mb-4">Organisatie</h2>
            <div className="grid grid-cols-2 gap-3 text-label">
              {[
                ["Type", org.type], ["Tier", org.tier], ["Status", org.status],
                ["Contact", org.contact_email || "\u2014"], ["KvK", org.kvk_number || "\u2014"],
                ["Stad", org.city || "\u2014"],
                ["Aangemaakt", new Date(org.created_at).toLocaleDateString("nl-NL")],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between py-1 border-b border-pw-border/30">
                  <span className="text-pw-muted">{label}</span>
                  <span className="font-medium text-pw-text">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
