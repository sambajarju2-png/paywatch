"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/users", label: "Gebruikers", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { href: "/organizations", label: "Organisaties", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { href: "/paying-users", label: "Abonnementen", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" },
  { href: "/plans", label: "Plannen", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { href: "/bills", label: "Rekeningen", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/community", label: "Community", icon: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" },
  { href: "/buddies", label: "Buddy Netwerk", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { href: "/contacts", label: "Berichten", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { href: "/applications", label: "Sollicitaties", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { href: "/email", label: "Newsletters", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" },
  { href: "/outreach", label: "Outreach", icon: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z" },
  { href: "/analytics", label: "Analytics", icon: "M18 20V10M12 20V4M6 20v-6" },
  { href: "/gdpr", label: "Privacyverzoeken", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { href: "/instellingen", label: "Instellingen", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pw-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Escape key closes mobile
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("pw-sidebar-collapsed", String(next));
  }

  async function handleLogout() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      await supabase.auth.signOut();
    } catch {}
    window.location.reload();
  }

  const sidebarW = collapsed ? 68 : 240;

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
        className="pw-mobile-menu-btn"
        style={{ position: "fixed", top: 16, left: 16, zIndex: 60, width: 40, height: 40, borderRadius: 10,
          background: "#0A2540", border: "none", cursor: "pointer", display: "none",
          alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="pw-mobile-overlay"
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "none" }} />}

      {/* ── Sidebar ── */}
      <aside className={`pw-sidebar ${mobileOpen ? "pw-sidebar-open" : ""}`}
        style={{ width: sidebarW, background: "#0A2540", padding: "24px 0", display: "flex",
          flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh",
          transition: "width 0.2s ease, transform 0.2s ease", overflow: "hidden" }}>

        {/* Mobile close */}
        <button onClick={() => setMobileOpen(false)} className="pw-mobile-close"
          style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8,
            background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "none",
            alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {/* ── Logo ── */}
        <div style={{ padding: collapsed ? "0 0 20px" : "0 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            {!collapsed && (
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>PayWatch</span>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "2px 0 0", fontWeight: 500 }}>Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Nav items ── */}
        <nav style={{ padding: collapsed ? "16px 8px" : "16px 12px", display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: collapsed ? "10px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 8, background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  textDecoration: "none", transition: "background 0.15s", position: "relative",
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={active ? "#fff" : "rgba(255,255,255,0.45)"}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0 }}>
                  <path d={item.icon} />
                </svg>
                {!collapsed && (
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#fff" : "rgba(255,255,255,0.55)", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Collapse toggle (desktop only) ── */}
        <div className="pw-collapse-toggle" style={{ padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={toggleCollapse}
            style={{
              width: "100%", padding: collapsed ? "8px 0" : "8px 12px",
              borderRadius: 8, border: "none",
              background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500,
              cursor: "pointer", fontFamily: "'Plus Jakarta Sans', system-ui",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "background 0.15s",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed
                ? <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                : <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              }
            </svg>
            {!collapsed && <span>{collapsed ? "Expand" : "Collapse"}</span>}
          </button>
        </div>

        {/* ── Logout ── */}
        <div style={{ padding: collapsed ? "8px" : "8px 16px" }}>
          <button onClick={handleLogout} title={collapsed ? "Uitloggen" : undefined}
            style={{
              width: "100%", padding: collapsed ? "8px 0" : "8px 12px",
              borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500,
              cursor: "pointer", fontFamily: "'Plus Jakarta Sans', system-ui",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            {!collapsed && <span>Uitloggen</span>}
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .pw-mobile-menu-btn { display: flex !important; }
          .pw-mobile-overlay { display: block !important; }
          .pw-mobile-close { display: flex !important; }
          .pw-collapse-toggle { display: none !important; }
          .pw-sidebar {
            position: fixed !important;
            top: 0 !important; left: 0 !important; bottom: 0 !important;
            z-index: 80 !important;
            width: 240px !important;
            transform: translateX(-100%);
          }
          .pw-sidebar.pw-sidebar-open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
