"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/users", label: "Users", icon: "users" },
  { href: "/bills", label: "Bills", icon: "card" },
  { href: "/applications", label: "Applications", icon: "briefcase" },
  { href: "/contacts", label: "Contacts", icon: "mail" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)} className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">PayWatch</h1>
          <p className="text-xs text-gray-500 mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <NavIcon type={item.icon} active={active} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section with logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
          <div className="text-xs text-gray-400 mt-3 px-3">
            <p className="font-medium text-gray-500">PayWatch B.V.</p>
            <p>admin.paywatch.app</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? "#1D4ED8" : "#6B7280";
  const s = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5 };
  switch (type) {
    case "grid": return <svg {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "users": return <svg {...s}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case "card": return <svg {...s}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
    case "mail": return <svg {...s}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>;
    case "briefcase": return <svg {...s}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>;
    default: return <svg {...s}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
