"use client";

import { useApp } from "@/components/AppProvider";
import { subprocessors, securityMeasures } from "@/lib/config";

export default function DataProcessingPage() {
  const { lang, t } = useApp();

  return (
    <div className="bg-[var(--bg)]">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.dataProcessing.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.dataProcessing.subtitle}</p>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Subprocessor table */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide px-4 py-3">{t.dataProcessing.service}</th>
                  <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide px-4 py-3">{t.dataProcessing.purpose}</th>
                  <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide px-4 py-3 hidden sm:table-cell">{t.dataProcessing.dataProcessed}</th>
                  <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide px-4 py-3 hidden md:table-cell">{t.dataProcessing.location}</th>
                  <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide px-4 py-3">{t.dataProcessing.gdprStatus}</th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((sp, i) => (
                  <tr key={sp.service} className={`border-b border-[var(--border)] last:border-b-0 ${i % 2 === 0 ? "" : "bg-[var(--bg)]"}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--navy)]">{sp.service}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text)]">{sp.purpose[lang]}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] hidden sm:table-cell">{sp.data[lang]}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] hidden md:table-cell">{sp.location}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                        sp.gdpr ? "text-[var(--green)] bg-[var(--green-light)]" : "text-[var(--red)] bg-[var(--red-light)]"
                      }`}>
                        {sp.gdpr ? "✓ Compliant" : "✗"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security measures */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--navy)] mb-4">{t.dataProcessing.security}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {securityMeasures[lang].map((measure, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
                <div className="w-6 h-6 rounded-md bg-[var(--green-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-sm text-[var(--text)] leading-relaxed">{measure}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
