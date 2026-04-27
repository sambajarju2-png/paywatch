import { headers } from "next/headers";

export type TenantMode = "super-admin" | "org-admin";

export interface TenantContext {
  mode: TenantMode;
  slug: string | null;
  orgId: string | null;
  orgName: string | null;
  orgType: string | null;
  primaryColor: string;
  logoUrl: string | null;
  memberRole: string | null;
}

export async function getTenant(): Promise<TenantContext> {
  const h = await headers();
  const mode = (h.get("x-tenant-mode") || "super-admin") as TenantMode;
  return {
    mode,
    slug: h.get("x-tenant-slug"),
    orgId: h.get("x-tenant-id"),
    orgName: h.get("x-tenant-name") ? decodeURIComponent(h.get("x-tenant-name")!) : null,
    orgType: h.get("x-tenant-type"),
    primaryColor: h.get("x-tenant-color") || "#2563EB",
    logoUrl: h.get("x-tenant-logo") || null,
    memberRole: h.get("x-member-role"),
  };
}

export function isSuperAdmin(tenant: TenantContext): boolean {
  return tenant.mode === "super-admin" || tenant.memberRole === "super_admin";
}

export function canManage(tenant: TenantContext): boolean {
  return ["owner", "admin", "super_admin"].includes(tenant.memberRole || "");
}
