import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: org } = await supabase.from("organizations").select("*").eq("id", tenant.orgId).single();
  if (!org) redirect("/");

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <SettingsClient org={org} orgId={tenant.orgId} />
    </PageShell>
  );
}
