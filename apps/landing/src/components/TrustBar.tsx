"use client";

import { useApp } from "@/components/AppProvider";

export function TrustBar() {
  const { lang } = useApp();

  const badges = [
    { emoji: "🇪🇺", label: lang === "nl" ? "EU Product" : "EU Product" },
    { icon: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4", label: "GDPR / AVG" },
    { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "SOC 2 Type II" },
    { icon: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4", label: lang === "nl" ? "AES-256 encryptie" : "AES-256 encryption" },
  ];

  return (
    <section className="py-4 px-6 bg-pw-blue-light dark:bg-[#111827] border-y border-pw-border dark:border-[#1F2937]">
      <div className="max-w-[1140px] mx-auto flex justify-center gap-10 md:gap-14">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2.5 opacity-60">
            {"emoji" in b && b.emoji ? (
              <span className="text-[16px]">{b.emoji}</span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pw-navy dark:text-white">
                <path d={b.icon} />
              </svg>
            )}
            <span className="text-[11px] font-semibold text-pw-navy dark:text-white/70 tracking-wide">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
