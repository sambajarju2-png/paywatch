"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "Overzicht", icon: "grid" },
  { href: "/bills", label: "Betalingen", icon: "card" },
  { href: "/settings", label: "Meer", icon: "menu" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--border)]" style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>
      <div className="flex pt-2 pb-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link key={tab.href} href={tab.href} className="flex-1 flex flex-col items-center gap-1 py-1">
              <TabIcon type={tab.icon} active={active} />
              <span className={`text-[10px] font-medium ${active ? "text-[var(--blue)]" : "text-[var(--muted)]"}`}>{tab.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-[var(--blue)]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TabIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? "var(--blue)" : "var(--muted)";
  const s = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5 };
  switch (type) {
    case "grid": return <svg {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "card": return <svg {...s}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
    case "menu": return <svg {...s}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
    default: return <svg {...s}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
