"use client";

import { useApp } from "./AppProvider";

export default function TrustBar() {
  const { t } = useApp();

  const badges = [
    { emoji: "🇪🇺", label: t.trustBar.eu },
    { emoji: "🛡️", label: t.trustBar.gdpr },
    { emoji: "✓", label: t.trustBar.soc2 },
    { emoji: "🔒", label: t.trustBar.encryption },
  ];

  return (
    <div className="bg-[var(--blue-light)] dark:bg-[#111827] border-y border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-sm">{b.emoji}</span>
              <span className="text-xs font-semibold text-[var(--navy)] tracking-wide uppercase">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
