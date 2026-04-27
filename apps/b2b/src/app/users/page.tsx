import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UsersPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: users } = await supabase
    .from("user_organizations")
    .select(`
      id, status, external_id, onboarded_at, created_at,
      user_id,
      metadata
    `)
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false })
    .limit(100);

  // Get user details for active users
  const userIds = (users || []).filter(u => u.user_id).map(u => u.user_id);
  let userDetails: Record<string, any> = {};

  if (userIds.length > 0) {
    const { data: settings } = await supabase
      .from("user_settings")
      .select("user_id, display_name, first_name, last_name, gemeente, onboarding_complete, last_active_at")
      .in("user_id", userIds);

    if (settings) {
      settings.forEach(s => { userDetails[s.user_id] = s; });
    }
  }

  const statusColors: Record<string, string> = {
    invited: "bg-amber-50 text-amber-700",
    active: "bg-green-50 text-green-700",
    paused: "bg-gray-100 text-gray-500",
    exited: "bg-red-50 text-red-700",
  };

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
            <Link href="/users" className="font-medium text-gray-900">Gebruikers</Link>
            <Link href="/invites" className="text-gray-500 hover:text-gray-900">Uitnodigen</Link>
            <Link href="/settings" className="text-gray-500 hover:text-gray-900">Instellingen</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gebruikers</h1>
            <p className="text-sm text-gray-500 mt-1">{users?.length || 0} gekoppelde gebruikers</p>
          </div>
          <Link href="/invites" className="px-4 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90" style={{ backgroundColor: tenant.primaryColor }}>
            + Uitnodigen
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_120px_140px_100px] gap-4 px-4 py-3 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
            <span>Naam / ID</span>
            <span>Status</span>
            <span>Gemeente</span>
            <span>Laatst actief</span>
            <span>Onboarding</span>
          </div>

          {(!users || users.length === 0) ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              Nog geen gebruikers. <Link href="/invites" className="font-medium hover:underline" style={{ color: tenant.primaryColor }}>Nodig je eerste gebruiker uit</Link>
            </div>
          ) : (
            users.map((uo) => {
              const detail = userDetails[uo.user_id] || {};
              const name = detail.display_name || detail.first_name || uo.external_id || "Onbekend";
              return (
                <div key={uo.id} className="grid grid-cols-[1fr_120px_120px_140px_100px] gap-4 px-4 py-3 border-b border-gray-50 items-center text-sm hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-gray-900">{name}</div>
                    {uo.external_id && <div className="text-xs text-gray-400">Ref: {uo.external_id}</div>}
                  </div>
                  <span className={"px-2 py-0.5 text-[10px] font-semibold rounded inline-block w-fit " + (statusColors[uo.status] || "bg-gray-100 text-gray-500")}>
                    {uo.status}
                  </span>
                  <span className="text-gray-500 text-xs">{detail.gemeente || "—"}</span>
                  <span className="text-gray-500 text-xs">
                    {detail.last_active_at ? new Date(detail.last_active_at).toLocaleDateString("nl-NL") : "—"}
                  </span>
                  <span className="text-xs">
                    {detail.onboarding_complete ? (
                      <span className="text-green-600 font-medium">Voltooid</span>
                    ) : (
                      <span className="text-gray-400">Niet gestart</span>
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
