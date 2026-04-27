import Link from "next/link";
import { TenantContext } from "@/lib/tenant";

interface Props {
  tenant: TenantContext;
  userEmail?: string;
  active?: string;
}

const orgLinks = [
  { href: "/", label: "Dashboard", key: "dashboard" },
  { href: "/users", label: "Gebruikers", key: "users" },
  { href: "/invites", label: "Uitnodigen", key: "invites" },
  { href: "/buddies", label: "Coaches", key: "buddies" },
  { href: "/analytics", label: "Rapportage", key: "analytics" },
  { href: "/api-keys", label: "API", key: "api-keys" },
  { href: "/settings", label: "Instellingen", key: "settings" },
];

const superLinks = [
  { href: "/", label: "Organisaties", key: "organizations" },
];

export default function OrgNav({ tenant, userEmail, active }: Props) {
  const isSuperAdmin = tenant.mode === "super-admin";
  const links = isSuperAdmin ? superLinks : orgLinks;
  const color = tenant.primaryColor || "#2563EB";

  return (
    <header
      className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50"
      style={isSuperAdmin ? {} : { borderTopColor: color, borderTopWidth: 3, borderTopStyle: "solid" }}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          {isSuperAdmin ? (
            <>
              <span className="text-xl font-black tracking-tight">PayWatch</span>
              <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">PLATFORM</span>
            </>
          ) : (
            <>
              {tenant.logoUrl && (
                <img src={tenant.logoUrl} alt="" className="h-7 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <span className="text-lg font-bold" style={{ color }}>{tenant.orgName}</span>
              <span className="text-[10px] text-gray-400 hidden sm:inline">powered by PayWatch</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1 mr-4">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={
                  "px-3 py-1.5 rounded-md text-sm transition-colors " +
                  (active === link.key
                    ? "font-semibold text-gray-900 bg-gray-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {userEmail && (
            <span className="text-xs text-gray-400 hidden lg:inline">{userEmail}</span>
          )}
        </div>
      </div>
    </header>
  );
}
