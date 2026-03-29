"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  Send,
  Mail,
  Shield,
} from "lucide-react";

const TABS = [
  { href: "/outreach", label: "Overview", icon: BarChart3, exact: true },
  { href: "/outreach/contacts", label: "Contacts", icon: Users },
  { href: "/outreach/campaigns", label: "Campaigns", icon: Send },
  { href: "/outreach/queue", label: "Queue", icon: Mail },
  { href: "/outreach/accounts", label: "Accounts", icon: Shield },
];

export default function OutreachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(tab: (typeof TABS)[number]) {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-pw-navy">Outreach Engine</h1>
          <span className="text-[10px] font-semibold text-pw-blue bg-blue-50 px-2.5 py-0.5 rounded">
            B2B
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b border-pw-border mb-6 -mx-1">
        {TABS.map((tab) => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                active
                  ? "text-pw-blue border-pw-blue"
                  : "text-pw-muted border-transparent hover:text-pw-text hover:border-gray-200"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
