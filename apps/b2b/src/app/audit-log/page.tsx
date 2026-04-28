import { getTenant, canManage } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";

const ACTION_LABELS: Record<string, string> = {
  "invite.created": "Uitnodiging aangemaakt",
  "invite.activated": "Uitnodiging geactiveerd",
  "member.invited": "Teamlid uitgenodigd",
  "member.removed": "Teamlid verwijderd",
  "user.consent_granted": "Toestemming verleend",
  "user.consent_revoked": "Toestemming ingetrokken",
  "buddy.assigned": "Coach toegewezen",
  "buddy.removed": "Coach verwijderd",
  "settings.updated": "Instellingen bijgewerkt",
  "api_key.created": "API key aangemaakt",
  "api_key.revoked": "API key ingetrokken",
  "webhook.created": "Webhook aangemaakt",
  "user.data_accessed": "Gebruikersdata bekeken",
};

const ACTOR_LABELS: Record<string, string> = {
  staff: "Medewerker",
  api_key: "API",
  system: "Systeem",
  super_admin: "Super admin",
};

export default async function AuditLogPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: logs } = await supabase
    .from("b2b_audit_log")
    .select("id, actor_id, actor_type, action, target_type, target_id, metadata, created_at")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false })
    .limit(100);

  // Get actor emails
  const actorIds = [...new Set((logs || []).filter((l: any) => l.actor_id).map((l: any) => l.actor_id))];
  let actorEmails: Record<string, string> = {};
  if (actorIds.length > 0) {
    const { data: members } = await supabase
      .from("organization_members")
      .select("user_id, invite_email")
      .eq("organization_id", tenant.orgId)
      .in("user_id", actorIds);
    if (members) members.forEach((m: any) => { actorEmails[m.user_id] = m.invite_email; });
  }

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <h1 className="text-page-heading text-pw-text mb-2">Audit log</h1>
        <p className="text-label text-pw-muted mb-6">Alle acties worden gelogd voor compliance.</p>

        <div className="bg-pw-surface border border-pw-border rounded-card overflow-hidden">
          {(!logs || logs.length === 0) ? (
            <div className="p-12 text-center text-pw-muted text-label">Nog geen activiteit gelogd.</div>
          ) : (
            logs.map((log: any) => {
              const actorEmail = actorEmails[log.actor_id] || log.actor_type;
              return (
                <div key={log.id} className="px-5 py-3 border-b border-pw-border/50 flex items-center justify-between text-label">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-tiny font-bold flex-shrink-0"
                      style={{ backgroundColor: log.actor_type === "system" ? "#64748B" : log.actor_type === "api_key" ? "#7C3AED" : "#0A2540" }}
                    >
                      {log.actor_type === "system" ? "SYS" : log.actor_type === "api_key" ? "API" : (actorEmail || "?").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-pw-text">{ACTION_LABELS[log.action] || log.action}</div>
                      <div className="text-caption text-pw-muted truncate">
                        {actorEmail !== log.actor_type ? actorEmail : ACTOR_LABELS[log.actor_type] || log.actor_type}
                        {log.target_type && <> &middot; {log.target_type}</>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="px-2 py-0.5 bg-pw-bg text-pw-muted text-tiny font-semibold rounded-badge">
                      {ACTOR_LABELS[log.actor_type] || log.actor_type}
                    </span>
                    <span className="text-caption text-pw-muted whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("nl-NL", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
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
