"use client";

import { useApp } from "./AppProvider";

export default function TrustBar() {
  const { t } = useApp();

  return (
    <div className="bg-[var(--blue-light)] dark:bg-[#111827] border-y border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {/* EU — emoji flag */}
          <div className="flex items-center gap-2">
            <span className="text-sm">🇪🇺</span>
            <span className="text-xs font-semibold text-[var(--navy)] tracking-wide uppercase">{t.trustBar.eu}</span>
          </div>

          {/* GDPR — shield icon */}
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.5" className="opacity-70">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-xs font-semibold text-[var(--navy)] tracking-wide uppercase">{t.trustBar.gdpr}</span>
          </div>

          {/* SOC 2 — check-circle icon */}
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.5" className="opacity-70">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-xs font-semibold text-[var(--navy)] tracking-wide uppercase">{t.trustBar.soc2}</span>
          </div>

          {/* AES-256 — lock icon */}
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.5" className="opacity-70">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-xs font-semibold text-[var(--navy)] tracking-wide uppercase">{t.trustBar.encryption}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
