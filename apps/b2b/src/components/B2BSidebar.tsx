"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  mode: "super-admin" | "org-admin";
  orgName?: string | null;
  orgLogo?: string | null;
  orgColor?: string;
  userEmail?: string;
}

const SUPER_NAV = [
  { href: "/", label: "Organisaties", key: "organizations", icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" },
];

const ORG_NAV = [
  { href: "/", label: "Dashboard", key: "dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/users", label: "Gebruikers", key: "users", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { href: "/invites", label: "Uitnodigen", key: "invites", icon: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z" },
  { href: "/buddies", label: "Coaches", key: "buddies", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { href: "/analytics", label: "Rapportage", key: "analytics", icon: "M18 20V10M12 20V4M6 20v-6" },
  { href: "/api-keys", label: "API", key: "api-keys", icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" },
  { href: "/members", label: "Teamleden", key: "members", icon: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { href: "/settings", label: "Instellingen", key: "settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" },
];

export default function B2BSidebar({ mode, orgName, orgLogo, orgColor, userEmail }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = mode === "super-admin" ? SUPER_NAV : ORG_NAV;

  useEffect(() => {
    const saved = localStorage.getItem("pw-b2b-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("pw-b2b-sidebar-collapsed", String(next));
  }

  const isActive = (key: string, href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarW = collapsed ? 68 : 240;

  return (
    <aside
      style={{
        width: sidebarW,
        background: "#0A2540",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 8, minHeight: 36 }}>
        {collapsed ? (
          <svg width="28" height="28" viewBox="0 0 512 512" style={{ flexShrink: 0 }}>
            <rect width="512" height="512" rx="96" fill="transparent" />
            <g transform="translate(96, 56) scale(13.3)" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </g>
          </svg>
        ) : (
          <>
            <img src="/logo-dark.svg" alt="PayWatch" style={{ height: 22, width: "auto" }} />
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#2563EB",
              background: "rgba(37, 99, 235, 0.15)", padding: "2px 6px",
              borderRadius: 4, letterSpacing: "0.05em",
            }}>
              B2B
            </span>
          </>
        )}
      </div>

      {/* Org context for org-admin mode */}
      {mode === "org-admin" && !collapsed && orgName && (
        <div style={{ padding: "0 16px", marginBottom: 16 }}>
          <div style={{
            background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {orgLogo ? (
              <img src={orgLogo} alt="" style={{ height: 20, width: "auto", borderRadius: 4 }} />
            ) : (
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: orgColor || "#2563EB",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 10, fontWeight: 700,
              }}>
                {(orgName || "?").substring(0, 2).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: 12, fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {orgName}
            </span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0 8px" }}>
        {navItems.map((item) => {
          const active = isActive(item.key, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: collapsed ? "10px 12px" : "10px 12px",
                borderRadius: 8, marginBottom: 2,
                background: active ? "rgba(37, 99, 235, 0.15)" : "transparent",
                color: active ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                textDecoration: "none",
                fontSize: 13, fontWeight: active ? 600 : 400,
                transition: "all 0.15s ease",
              }}
              title={collapsed ? item.label : undefined}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0 }}>
                <path d={item.icon} />
              </svg>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: collapse toggle + user */}
      <div style={{ padding: "0 8px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
        <button
          onClick={toggleCollapse}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, width: "100%",
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.4)", fontSize: 12,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? (
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            ) : (
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            )}
          </svg>
          {!collapsed && <span>Inklappen</span>}
        </button>

        {userEmail && !collapsed && (
          <div style={{ padding: "8px 12px", fontSize: 11, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {userEmail}
          </div>
        )}
      </div>
    </aside>
  );
}
