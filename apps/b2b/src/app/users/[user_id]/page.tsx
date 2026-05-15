import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import UserDetailClient from "./UserDetailClient";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  // Verify this user belongs to this org
  const { data: userOrg } = await supabase
    .from("user_organizations")
    .select("id, user_id, status, external_id, onboarded_at, created_at")
    .eq("organization_id", tenant.orgId)
    .eq("id", user_id)
    .single();

  if (!userOrg) notFound();

  // Parallel fetch of all user data
  const [
    settingsResult,
    financesResult,
    billsResult,
    paymentPlansResult,
    consentResult,
    buddyResult,
    authUserResult,
    auditResult,
  ] = await Promise.all([
    supabase
      .from("user_settings")
      .select("display_name, first_name, last_name, gemeente, language, last_active_at, onboarding_complete, onboarding_profile")
      .eq("user_id", userOrg.user_id)
      .single(),
    supabase
      .from("user_finances")
      .select("netto_inkomen, partner_inkomen, uitkering_inkomen, toeslagen_inkomen, overig_inkomen, monthly_rent, has_partner, num_children")
      .eq("user_id", userOrg.user_id)
      .single(),
    supabase
      .from("bills")
      .select("id, vendor, amount, due_date, status, escalation_stage, category, created_at")
      .eq("user_id", userOrg.user_id)
      .order("due_date", { ascending: false })
      .limit(20),
    supabase
      .from("payment_plans")
      .select("id, bill_id, total_terms, amount_per_term, payment_day, start_date, status")
      .eq("user_id", userOrg.user_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("b2b_consents")
      .select("scope, granted, granted_at")
      .eq("user_id", userOrg.user_id)
      .eq("organization_id", tenant.orgId),
    supabase
      .from("b2b_buddies")
      .select("buddy_member_id, role, assigned_at")
      .eq("user_id", userOrg.user_id)
      .eq("organization_id", tenant.orgId)
      .eq("status", "active")
      .order("assigned_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.auth.admin.getUserById(userOrg.user_id),
    // actor_email does not exist on b2b_audit_log — select actor_id, look up email separately
    supabase
      .from("b2b_audit_log")
      .select("action, actor_id, actor_type, metadata, created_at")
      .eq("organization_id", tenant.orgId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Resolve coach email if assigned
  let coachEmail: string | null = null;
  if (buddyResult.data?.buddy_member_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("invite_email")
      .eq("id", buddyResult.data.buddy_member_id)
      .single();
    coachEmail = member?.invite_email || null;
  }

  const email = authUserResult.data?.user?.email || "";
  const settings = settingsResult.data;
  const finances = financesResult.data;
  const bills = billsResult.data || [];
  const paymentPlans = paymentPlansResult.data || [];
  const consents = consentResult.data || [];
  const auditLog = auditResult.data || [];

  // Build granular consent scope map
  const grantedScopes = new Set(
    consents.filter((c: any) => c.granted).map((c: any) => c.scope)
  );
  const hasFullAccess = grantedScopes.has("full_access");
  const consentFlags = {
    contact_info: true, // always visible if user connected to org
    view_bills: hasFullAccess || grantedScopes.has("view_bills"),
    financial_overview: hasFullAccess || grantedScopes.has("financial_overview"),
    payment_plans: hasFullAccess || grantedScopes.has("payment_plans"),
    messaging: hasFullAccess || grantedScopes.has("messaging"),
  };
  // Legacy fallback: if old consent format (no granular scopes), treat as full access
  const hasAnyConsent = consents.some((c: any) => c.granted);
  if (hasAnyConsent && !hasFullAccess && grantedScopes.size <= 1) {
    // Old-style consent without granular scopes — allow everything
    consentFlags.view_bills = true;
    consentFlags.financial_overview = true;
    consentFlags.payment_plans = true;
    consentFlags.messaging = true;
  }

  const name =
    settings?.display_name ||
    [settings?.first_name, settings?.last_name].filter(Boolean).join(" ") ||
    email;

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        {/* Back link */}
        <Link
          href="/users"
          className="flex items-center gap-1.5 text-sm text-pw-muted hover:text-pw-navy mb-6 w-fit"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Terug naar gebruikers
        </Link>

        <UserDetailClient
          userOrgId={user_id}
          userId={userOrg.user_id}
          name={name}
          email={email}
          status={userOrg.status}
          externalId={userOrg.external_id || null}
          onboardedAt={userOrg.onboarded_at || null}
          lastActive={settings?.last_active_at || null}
          gemeente={settings?.gemeente || null}
          language={settings?.language || "nl"}
          onboardingComplete={settings?.onboarding_complete || false}
          coachEmail={coachEmail}
          consent={consentFlags}
          finances={consentFlags.financial_overview ? finances : null}
          bills={consentFlags.view_bills ? bills : []}
          paymentPlans={consentFlags.payment_plans ? paymentPlans : []}
          auditLog={auditLog}
        />
      </div>
    </PageShell>
  );
}
