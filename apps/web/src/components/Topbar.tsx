"use client";

export default function Topbar({ userName }: { userName?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]" style={{ background: "var(--surface)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[var(--navy)]">PayWatch</span>
          {userName && <span className="text-sm text-[var(--muted)]">Hoi, {userName}</span>}
        </div>
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
