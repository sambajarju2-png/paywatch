import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import ApiKeysClient from "./ApiKeysClient";

export default async function ApiKeysPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: keys } = await supabase
    .from("b2b_api_keys")
    .select("id, name, key_prefix, scopes, rate_limit, environment, last_used_at, created_at")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false });

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <ApiKeysClient keys={keys || []} orgId={tenant.orgId} />
    </PageShell>
  );
}
