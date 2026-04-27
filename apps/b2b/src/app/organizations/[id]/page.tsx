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

  // Get stats
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

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-3"><Link href="/" className="text-sm text-gray-400 hover:text-gray-600">&larr; Alle organisaties</Link></div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: org.primary_color || "#2563EB" }}
          >
            {org.logo_url ? (
              <img src={org.logo_url} alt="" className="w-10 h-10 object-contain" />
            ) : (
              org.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
            <p className="text-sm text-gray-500">
              <a href={"https://" + org.slug + ".paywatch.app"} target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                {org.slug}.paywatch.app
              </a>
              {" "}&middot; {org.type} &middot; {org.tier}
            </p>
          </div>
          <Link href={`/organizations/${id}/edit`} className="px-4 py-2 bg-pw-navy text-white text-xs font-semibold rounded no-underline">Bewerken</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Gebruikers", value: userCount || 0 },
            { label: "Actief", value: activeUsers || 0 },
            { label: "Openstaande invites", value: pendingInvites || 0 },
            { label: "Teamleden", value: memberCount || 0 },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className="text-2xl font-bold" style={{ color: org.primary_color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Team members */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Teamleden</h2>
            {(!members || members.length === 0) ? (
              <p className="text-sm text-gray-400">Geen teamleden</p>
            ) : (
              <div className="space-y-2">
                {members.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{m.invite_email || "Onbekend"}</div>
                      <div className="text-xs text-gray-400">{m.invite_status}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded">{m.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(features).map(([key, enabled]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className={"w-2 h-2 rounded-full " + (enabled ? "bg-green-500" : "bg-gray-300")} />
                  <span className="text-gray-700 font-mono text-xs">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Org info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-2 text-sm">
              {[
                ["Status", org.status],
                ["Contact", org.contact_email || "—"],
                ["KvK", org.kvk_number || "—"],
                ["Stad", org.city || "—"],
                ["Website", org.website || "—"],
                ["Aangemaakt", new Date(org.created_at).toLocaleDateString("nl-NL")],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Branding preview */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Branding</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: org.primary_color || "#2563EB" }} />
                <span className="text-sm font-mono text-gray-600">{org.primary_color || "#2563EB"}</span>
              </div>
              {org.logo_url && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Logo</p>
                  <img src={org.logo_url} alt="" className="h-10 w-auto" />
                </div>
              )}
              {org.custom_intro_text && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Intro tekst</p>
                  <p className="text-sm text-gray-700">{org.custom_intro_text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
