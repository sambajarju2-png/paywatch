import { getTenant, isSuperAdmin } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import EditOrgForm from "./EditOrgForm";

export default async function EditOrgPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user || !isSuperAdmin(tenant)) redirect("/");

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <EditOrgForm orgId={id} />
    </PageShell>
  );
}
