import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InvitesPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: invites } = await supabase
    .from("b2b_invites")
    .select("id, email, external_id, token, status, invite_type, created_at, expires_at, activated_at")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false })
    .limit(100);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    opened: "bg-blue-50 text-blue-700",
    activated: "bg-green-50 text-green-700",
    expired: "bg-gray-100 text-gray-500",
    revoked: "bg-red-50 text-red-700",
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
            <Link href="/users" className="text-gray-500 hover:text-gray-900">Gebruikers</Link>
            <Link href="/invites" className="font-medium text-gray-900">Uitnodigen</Link>
            <Link href="/settings" className="text-gray-500 hover:text-gray-900">Instellingen</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uitnodigingen</h1>
            <p className="text-sm text-gray-500 mt-1">{invites?.length || 0} uitnodigingen</p>
          </div>
        </div>

        {/* Create invite form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Nieuwe uitnodiging</h2>
          <form action="/api/v1/invite" method="POST" className="grid grid-cols-3 gap-4">
            <input name="email" type="email" placeholder="E-mailadres" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input name="external_id" placeholder="Referentie / dossiernr (optioneel)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <button type="submit" className="px-4 py-2 text-white text-sm font-semibold rounded-lg" style={{ backgroundColor: tenant.primaryColor }}>
              Uitnodiging versturen
            </button>
          </form>
        </div>

        {/* Existing invites */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_150px_100px_100px] gap-4 px-4 py-3 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
            <span>E-mail / Ref</span>
            <span>Type</span>
            <span>Link</span>
            <span>Status</span>
            <span>Aangemaakt</span>
          </div>

          {(!invites || invites.length === 0) ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              Nog geen uitnodigingen verstuurd.
            </div>
          ) : (
            invites.map((inv) => (
              <div key={inv.id} className="grid grid-cols-[1fr_120px_150px_100px_100px] gap-4 px-4 py-3 border-b border-gray-50 items-center text-sm">
                <div>
                  <div className="font-medium text-gray-900">{inv.email || "Geen e-mail"}</div>
                  {inv.external_id && <div className="text-xs text-gray-400">Ref: {inv.external_id}</div>}
                </div>
                <span className="text-xs text-gray-500">{inv.invite_type}</span>
                <span className="text-xs text-gray-400 truncate font-mono">
                  app.paywatch.app/invite/{inv.token?.substring(0, 8)}...
                </span>
                <span className={"px-2 py-0.5 text-[10px] font-semibold rounded inline-block w-fit " + (statusColors[inv.status] || "bg-gray-100 text-gray-500")}>
                  {inv.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(inv.created_at).toLocaleDateString("nl-NL")}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
