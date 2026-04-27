import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export default async function UsersPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: users } = await supabase
    .from("user_organizations")
    .select("id, status, external_id, onboarded_at, created_at, user_id, metadata")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false })
    .limit(100);

  const userIds = (users || []).filter((u: any) => u.user_id).map((u: any) => u.user_id);
  let userDetails: Record<string, any> = {};

  if (userIds.length > 0) {
    const { data: settings } = await supabase
      .from("user_settings")
      .select("user_id, display_name, first_name, last_name, gemeente, onboarding_complete, last_active_at")
      .in("user_id", userIds);
    if (settings) settings.forEach((s: any) => { userDetails[s.user_id] = s; });
  }

  const statusColors: Record<string, string> = {
    invited: "bg-pw-amber-light text-pw-amber",
    active: "bg-pw-green-light text-pw-green",
    paused: "bg-pw-bg text-pw-muted",
    exited: "bg-pw-red-light text-pw-red",
  };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-page-heading text-pw-text">Gebruikers</h1>
            <p className="text-label text-pw-muted mt-1">{users?.length || 0} gekoppelde gebruikers</p>
          </div>
          <Link href="/invites" className="px-4 py-2 text-white text-label font-semibold rounded-button no-underline" style={{ backgroundColor: tenant.primaryColor }}>
            + Uitnodigen
          </Link>
        </div>

        <div className="bg-pw-surface border border-pw-border rounded-card overflow-hidden">
          {(!users || users.length === 0) ? (
            <div className="p-12 text-center text-pw-muted text-label">
              Nog geen gebruikers. <Link href="/invites" className="font-medium no-underline" style={{ color: tenant.primaryColor }}>Nodig je eerste gebruiker uit</Link>
            </div>
          ) : (
            users.map((uo: any) => {
              const detail = userDetails[uo.user_id] || {};
              const name = detail.display_name || detail.first_name || uo.external_id || "Onbekend";
              return (
                <div key={uo.id} className="px-5 py-3 border-b border-pw-border/50 flex items-center justify-between text-label hover:bg-pw-bg/50">
                  <div>
                    <div className="font-medium text-pw-text">{name}</div>
                    {uo.external_id && <div className="text-caption text-pw-muted">Ref: {uo.external_id}</div>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-caption text-pw-muted">{detail.gemeente || "\u2014"}</span>
                    <span className={"px-2 py-0.5 text-tiny font-semibold rounded-badge " + (statusColors[uo.status] || "bg-pw-bg text-pw-muted")}>
                      {uo.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageShell>
  );
}
