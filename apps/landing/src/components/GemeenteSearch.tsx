"use client";

import { useState } from "react";
import { useApp } from "./AppProvider";
import { gemeenten } from "@/lib/config";

export default function GemeenteSearch() {
  const { t } = useApp();
  const [query, setQuery] = useState("");

  const filtered = query.length > 0
    ? gemeenten.filter((g) => g.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div id="gemeente" className="w-full max-w-md mx-auto">
      <h3 className="text-base font-bold text-[var(--navy)] mb-3">{t.gemeente.title}</h3>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.gemeente.placeholder}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
        />
      </div>

      {query.length > 0 && (
        <div className="mt-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((g) => (
              <div key={g} className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] last:border-b-0">
                <span className="text-sm font-medium text-[var(--text)]">{g}</span>
                <span className="text-xs font-semibold text-[var(--green)] bg-[var(--green-light)] rounded px-2 py-0.5">
                  ✓ {t.gemeente.available}
                </span>
              </div>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-[var(--muted)]">{t.gemeente.noResults}</p>
          )}
        </div>
      )}

      {!query && (
        <p className="mt-2 text-xs text-[var(--muted)]">
          {gemeenten.length}+ {t.gemeente.available}
        </p>
      )}
    </div>
  );
}
