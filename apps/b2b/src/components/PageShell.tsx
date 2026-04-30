import { TenantContext } from "@/lib/tenant";
import B2BSidebar from "./B2BSidebar";

interface Props {
  tenant: TenantContext;
  userEmail?: string;
  children: React.ReactNode;
}

export default function PageShell({ tenant, userEmail, children }: Props) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <B2BSidebar
        mode={tenant.mode}
        memberRole={tenant.memberRole}
        orgName={tenant.orgName}
        orgLogo={tenant.logoUrl}
        orgColor={tenant.primaryColor}
        userEmail={userEmail}
      />
      <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
