import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import OrgNav from "@/components/OrgNav";

export default async function BuddiesPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: buddies } = await supabase
    .from("b2b_buddies")
    .select("id, role, status, permissions, assigned_at, ended_at, user_id, buddy_member_id")
    .eq("organization_id", tenant.orgId)
    .order("assigned_at", { ascending: false })
    .limit(100);

  // Get member details
  const memberIds = [...new Set((buddies || []).map(b => b.buddy_member_id))];
  let memberDetails: Record<string, any> = {};

  if (memberIds.length > 0) {
    const { data: members } = await supabase
      .from("organization_members")
      .select("id, invite_email, role")
      .in("id", memberIds);

    if (members) members.forEach(m => { memberDetails[m.id] = m; });
  }

  const roleLabels: Record<string, string> = {
    schuldhulpverlener: "Schuldhulpverlener",
    dossierbehandelaar: "Dossierbehandelaar",
    bewindvoerder: "Bewindvoerder",
    vrijwilliger: "Vrijwilliger",
    maatje: "Maatje",
    coach: "Coach",
    sociaal_werker: "Sociaal werker",
    administrateur: "Administrateur",
    debiteurencoach: "Debiteurencoach",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OrgNav tenant={tenant} userEmail={user.email} active="buddies" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coaches &amp; Buddies</h1>
            <p className="text-sm text-gray-500 mt-1">{buddies?.length || 0} koppelingen</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_150px_120px_100px] gap-4 px-4 py-3 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
            <span>Coach</span>
            <span>Rol</span>
            <span>Status</span>
            <span>Sinds</span>
          </div>

          {(!buddies || buddies.length === 0) ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              Nog geen coaches gekoppeld aan gebruikers.
            </div>
          ) : (
            buddies.map((b) => {
              const member = memberDetails[b.buddy_member_id] || {};
              return (
                <div key={b.id} className="grid grid-cols-[1fr_150px_120px_100px] gap-4 px-4 py-3 border-b border-gray-50 items-center text-sm">
                  <div className="font-medium text-gray-900">{member.invite_email || "Onbekend"}</div>
                  <span className="text-gray-600 text-xs">{roleLabels[b.role] || b.role}</span>
                  <span className={"px-2 py-0.5 text-[10px] font-semibold rounded inline-block w-fit " +
                    (b.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500")}>
                    {b.status}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(b.assigned_at).toLocaleDateString("nl-NL")}</span>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
