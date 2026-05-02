import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import AssignCoach from "./AssignCoach";
import CoachView from "./CoachView";

const ROLE_LABELS: Record<string, string> = {
  schuldhulpverlener: "Schuldhulpverlener",
  sociaal_werker: "Sociaal werker",
  vrijwilliger: "Vrijwilliger",
  bewindvoerder: "Bewindvoerder",
};

export default async function BuddiesPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const isCoachOnly = tenant.memberRole === "coach";

  // --- COACH VIEW: only show own clients ---
  if (isCoachOnly && tenant.memberId) {
    const [myBuddiesResult, settingsResult, userOrgsResult, authUsersResult] = await Promise.all([
      supabase
        .from("b2b_buddies")
        .select("id, user_id, role, status, assigned_at")
        .eq("organization_id", tenant.orgId)
        .eq("buddy_member_id", tenant.memberId)
        .eq("status", "active"),
      supabase.from("user_settings").select("user_id, display_name, first_name, last_name, last_active_at"),
      supabase.from("user_organizations").select("id, user_id, status, onboarded_at").eq("organization_id", tenant.orgId),
      supabase.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const buddies = myBuddiesResult.data || [];
    const settings = settingsResult.data || [];
    const userOrgs = userOrgsResult.data || [];
    const authUsers = authUsersResult.data?.users || [];

    const settingsMap = new Map(settings.map((s: any) => [s.user_id, s]));
    const userOrgMap = new Map(userOrgs.map((u: any) => [u.user_id, u]));
    const authMap = new Map(authUsers.map((u: any) => [u.id, u.email]));

    const clients = buddies.map((b: any) => {
      const s = settingsMap.get(b.user_id);
      const uo = userOrgMap.get(b.user_id);
      const email = authMap.get(b.user_id) || "";
      const name = s?.display_name || [s?.first_name, s?.last_name].filter(Boolean).join(" ") || email || "Onbekend";
      return {
        buddyId: b.id,
        userId: b.user_id,
        userOrgId: uo?.id || null,
        name,
        email,
        role: ROLE_LABELS[b.role] || b.role || "Client",
        status: uo?.status || "unknown",
        lastActive: s?.last_active_at || null,
        onboardedAt: uo?.onboarded_at || null,
      };
    });

    return (
      <PageShell tenant={tenant} userEmail={user.email || ""}>
        <CoachView clients={clients} coachUserId={user.id} />
      </PageShell>
    );
  }

  // --- ADMIN VIEW: all coaches with their workload ---
  const [buddiesResult, membersResult, settingsResult, userOrgsResult] = await Promise.all([
    supabase.from("b2b_buddies")
      .select("id, user_id, buddy_member_id, role, status, assigned_at")
      .eq("organization_id", tenant.orgId)
      .order("assigned_at", { ascending: false }),
    supabase.from("organization_members")
      .select("id, user_id, invite_email, role")
      .eq("organization_id", tenant.orgId),
    supabase.from("user_settings").select("user_id, display_name, first_name, last_name"),
    supabase.from("user_organizations")
      .select("user_id, external_id")
      .eq("organization_id", tenant.orgId)
      .eq("status", "active"),
  ]);

  const buddies = buddiesResult.data || [];
  const members = membersResult.data || [];
  const settings = settingsResult.data || [];
  const userOrgs = userOrgsResult.data || [];

  const memberMap = new Map(members.map((m: any) => [m.id, m]));
  const settingsMap = new Map(settings.map((s: any) => [s.user_id, s]));

  const assignableUsers = userOrgs.map((uo: any) => {
    const s = settingsMap.get(uo.user_id);
    const name = s?.display_name || [s?.first_name, s?.last_name].filter(Boolean).join(" ") || uo.external_id || uo.user_id.substring(0, 8);
    return { id: uo.user_id, name };
  });

  const assignableCoaches = members
    .filter((m: any) => ["coach", "admin", "owner"].includes(m.role))
    .map((m: any) => ({ memberId: m.id, email: m.invite_email || "Onbekend" }));

  const coachGroups: Record<string, { email: string; clients: any[] }> = {};
  buddies.forEach((b: any) => {
    const coach = memberMap.get(b.buddy_member_id);
    const coachEmail = coach?.invite_email || "Onbekend";
    if (!coachGroups[coachEmail]) coachGroups[coachEmail] = { email: coachEmail, clients: [] };
    const clientSettings = settingsMap.get(b.user_id);
    const clientName = clientSettings?.display_name || [clientSettings?.first_name, clientSettings?.last_name].filter(Boolean).join(" ") || "Onbekend";
    coachGroups[coachEmail].clients.push({ ...b, clientName, roleName: ROLE_LABELS[b.role] || b.role });
  });

  const coaches = Object.values(coachGroups);
  const maxClients = 10;

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Coaches</h1>
            <p className="text-sm text-pw-muted mt-1">{buddies.length} koppelingen &middot; {coaches.length} coaches</p>
          </div>
        </div>

        <AssignCoach users={assignableUsers} coaches={assignableCoaches} orgId={tenant.orgId} />

        {coaches.length === 0 ? (
          <div className="bg-white border border-pw-border rounded-2xl p-12 text-center">
            <p className="text-pw-muted">Nog geen coach koppelingen</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {coaches.map((coach) => {
              const load = coach.clients.length;
              const overloaded = load > maxClients;
              return (
                <div key={coach.email} className="bg-white border border-pw-border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold ${overloaded ? "bg-pw-red" : "bg-pw-green"}`}>
                      {coach.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-pw-navy">{coach.email}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${overloaded ? "bg-pw-red" : "bg-pw-green"}`} />
                        <span className={`text-xs font-bold ${overloaded ? "text-pw-red" : "text-pw-green"}`}>
                          {overloaded ? "Overbelast" : "Actief"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-pw-muted">Werklast</span>
                      <span className={`font-bold ${overloaded ? "text-pw-red" : "text-pw-text"}`}>{load}/{maxClients}</span>
                    </div>
                    <div className="h-2 bg-pw-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${overloaded ? "bg-pw-red" : load > maxClients * 0.8 ? "bg-pw-amber" : "bg-pw-green"}`}
                        style={{ width: `${Math.min((load / maxClients) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {coach.clients.map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between py-2 px-3 bg-pw-bg rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-pw-navy text-white flex items-center justify-center text-[10px] font-bold">
                            {(c.clientName || "?").substring(0, 1).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-pw-text">{c.clientName}</span>
                        </div>
                        <span className="text-[10px] font-bold text-pw-muted bg-white px-2 py-0.5 rounded">{c.roleName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
