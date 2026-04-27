import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";

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

  const memberIds = [...new Set((buddies || []).map((b: any) => b.buddy_member_id))];
  let memberDetails: Record<string, any> = {};
  if (memberIds.length > 0) {
    const { data: members } = await supabase.from("organization_members").select("id, invite_email, role").in("id", memberIds);
    if (members) members.forEach((m: any) => { memberDetails[m.id] = m; });
  }

  const roleLabels: Record<string, string> = {
    schuldhulpverlener: "Schuldhulpverlener", dossierbehandelaar: "Dossierbehandelaar",
    bewindvoerder: "Bewindvoerder", vrijwilliger: "Vrijwilliger", maatje: "Maatje",
    coach: "Coach", sociaal_werker: "Sociaal werker", administrateur: "Administrateur", debiteurencoach: "Debiteurencoach",
  };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <h1 className="text-page-heading text-pw-text mb-2">Coaches & Buddies</h1>
        <p className="text-label text-pw-muted mb-6">{buddies?.length || 0} koppelingen</p>

        <div className="bg-pw-surface border border-pw-border rounded-card overflow-hidden">
          {(!buddies || buddies.length === 0) ? (
            <div className="p-12 text-center text-pw-muted text-label">Nog geen coaches gekoppeld aan gebruikers.</div>
          ) : (
            buddies.map((b: any) => {
              const member = memberDetails[b.buddy_member_id] || {};
              return (
                <div key={b.id} className="px-5 py-3 border-b border-pw-border/50 flex items-center justify-between text-label">
                  <div className="font-medium text-pw-text">{member.invite_email || "Onbekend"}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-caption text-pw-muted">{roleLabels[b.role] || b.role}</span>
                    <span className={"px-2 py-0.5 text-tiny font-semibold rounded-badge " + (b.status === "active" ? "bg-pw-green-light text-pw-green" : "bg-pw-bg text-pw-muted")}>
                      {b.status}
                    </span>
                    <span className="text-caption text-pw-muted">{new Date(b.assigned_at).toLocaleDateString("nl-NL")}</span>
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
