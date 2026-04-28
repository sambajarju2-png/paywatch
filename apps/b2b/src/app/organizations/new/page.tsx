import { getTenant, isSuperAdmin } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import NewOrgForm from "./NewOrgForm";

export default async function NewOrgPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user || !isSuperAdmin(tenant)) redirect("/");

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <NewOrgForm />
    </PageShell>
  );
}
