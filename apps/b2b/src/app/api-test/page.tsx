import { getTenant, isSuperAdmin } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import ApiTestClient from "./ApiTestClient";

export default async function ApiTestPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  // Only super-admins or org admins can access
  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <ApiTestClient orgId={tenant.orgId || ""} orgSlug={tenant.orgSlug || "b2b"} />
    </PageShell>
  );
}
