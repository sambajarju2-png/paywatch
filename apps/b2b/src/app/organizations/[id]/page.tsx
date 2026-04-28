import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export default async function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user || tenant.mode !== "super-admin") redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (!org) redirect("/");

  const { count: userCount } = await supabase
    .from("user_organizations")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", id);

  const { count: activeUsers } = await supabase
    .from("user_organizations")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", id)
    .eq("status", "active");

  const { count: pendingInvites } = await supabase
    .from("b2b_invites")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", id)
    .eq("status", "pending");

  const { count: memberCount } = await supabase
    .from("organization_members")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", id);

  const { data: members } = await supabase
    .from("organization_members")
    .select("id, role, invite_email, invite_status, created_at, user_id")
    .eq("organization_id", id)
    .order("created_at");

  const features = org.features || {};
  const roleLabels: Record<string, string> = { owner: "Eigenaar", admin: "Admin", viewer: "Viewer", coach: "Coach" };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <div className="mb-2">
          <Link href="/" className="text-label text-pw-muted no-underline">&larr; Alle organisaties</Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-body"
            style={{ backgroundColor: org.primary_color || "#2563EB" }}
          >
            {org.logo_url ? (
              <img src={org.logo_url} alt="" className="w-10 h-10 object-contain" />
            ) : (
              org.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-page-heading text-pw-text">{org.name}</h1>
            <p className="text-label text-pw-muted">
              <a href={"https://" + org.slug + ".paywatch.app"} target="_blank" rel="noopener" className="text-pw-blue no-underline font-medium">
                {org.slug}.paywatch.app
              </a>
              {" "}&middot; {org.type} &middot; {org.tier}
            </p>
          </div>
          <Link href={`/organizations/${id}/edit`} className="ml-auto px-4 py-2 bg-pw-navy text-white text-label font-semibold rounded-button no-underline">
            Bewerken
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Gebruikers", value: userCount || 0 },
            { label: "Actief", value: activeUsers || 0 },
            { label: "Openstaande invites", value: pendingInvites || 0 },
            { label: "Teamleden", value: memberCount || 0 },
          ].map((s) => (
            <div key={s.label} className="bg-pw-surface border border-pw-border rounded-card p-4">
              <div className="text-caption text-pw-muted mb-1">{s.label}</div>
              <div className="text-hero" style={{ color: org.primary_color || "#2563EB" }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Team members */}
          <div className="bg-pw-surface border border-pw-border rounded-card p-6">
            <h2 className="text-section-head text-pw-text mb-4">Teamleden</h2>
            {(!members || members.length === 0) ? (
              <p className="text-label text-pw-muted">Geen teamleden</p>
            ) : (
              <div className="space-y-1">
                {members.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b border-pw-border/30">
                    <div>
                      <div className="text-label font-medium text-pw-text">{m.invite_email || "Onbekend"}</div>
                      <div className="text-caption text-pw-muted">{m.invite_status}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-pw-bg text-pw-muted text-tiny font-semibold rounded-badge">{roleLabels[m.role] || m.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-pw-surface border border-pw-border rounded-card p-6">
            <h2 className="text-section-head text-pw-text mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(features).map(([key, enabled]) => (
                <div key={key} className="flex items-center gap-2 py-1">
                  <span className={"w-2 h-2 rounded-full " + (enabled ? "bg-pw-green" : "bg-pw-border")} />
                  <span className="text-label text-pw-text">{key.replace(/_/g, " ")}</span>
                  <span className={"text-caption font-semibold ml-auto " + (enabled ? "text-pw-green" : "text-pw-muted")}>
                    {enabled ? "Aan" : "Uit"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Org info */}
          <div className="bg-pw-surface border border-pw-border rounded-card p-6">
            <h2 className="text-section-head text-pw-text mb-4">Details</h2>
            <div className="space-y-2 text-label">
              {[
                ["Status", org.status],
                ["Contact", org.contact_email || "\u2014"],
                ["KvK", org.kvk_number || "\u2014"],
                ["Stad", org.city || "\u2014"],
                ["Website", org.website || "\u2014"],
                ["Aangemaakt", new Date(org.created_at).toLocaleDateString("nl-NL")],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between py-1 border-b border-pw-border/30">
                  <span className="text-pw-muted">{label}</span>
                  <span className="font-medium text-pw-text">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Branding preview */}
          <div className="bg-pw-surface border border-pw-border rounded-card p-6">
            <h2 className="text-section-head text-pw-text mb-4">Branding</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: org.primary_color || "#2563EB" }} />
                <span className="text-label font-mono text-pw-muted">{org.primary_color || "#2563EB"}</span>
              </div>
              {org.logo_url && (
                <div>
                  <p className="text-caption text-pw-muted mb-1">Logo</p>
                  <img src={org.logo_url} alt="" className="h-10 w-auto" />
                </div>
              )}
              {org.custom_intro_text && (
                <div>
                  <p className="text-caption text-pw-muted mb-1">Intro tekst</p>
                  <p className="text-label text-pw-text">{org.custom_intro_text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
