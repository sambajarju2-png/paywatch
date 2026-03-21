"use client";

import { useState } from "react";
import { siteConfig, t } from "@/lib/config";
import { useApp } from "@/components/AppProvider";

export function GemeenteSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ name: string; found: boolean } | null>(null);
  const { lang } = useApp();
  const tx = t[lang];

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const found = siteConfig.gemeenten.find((g) => g.toLowerCase().includes(q));
    setResult(found ? { name: found, found: true } : { name: query, found: false });
  };

  return (
    <section className="py-20 px-6 bg-pw-navy dark:bg-[#070B14]">
      <div className="max-w-[640px] mx-auto text-center">
        <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">{tx.mapLabel}</span>
        <h2 className="text-[32px] font-extrabold text-white mt-2 mb-3 tracking-tight">{tx.mapTitle}</h2>
        <p className="text-[15px] text-white/50 mb-8 leading-relaxed">{tx.mapSub}</p>
        <div className="flex gap-2 justify-center mb-6">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setResult(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={tx.mapPlaceholder}
            className="w-[320px] px-4 py-3 rounded-[10px] border border-white/15 bg-white/[0.06] text-white text-[14px] outline-none placeholder:text-white/30 focus:border-pw-blue/50"
          />
          <button onClick={handleSearch} className="bg-pw-blue text-white border-none rounded-[10px] px-6 py-3 text-[14px] font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
            {tx.mapSearch}
          </button>
        </div>
        {result && (
          <div className={`rounded-xl px-5 py-4 inline-block ${result.found ? "bg-green-500/15" : "bg-red-400/15"}`}>
            {result.found ? (
              <p className="text-[14px] text-green-400">✓ <strong>{result.name}</strong> {tx.mapFound}</p>
            ) : (
              <p className="text-[14px] text-orange-300">{tx.mapNotFound} <strong>{result.name}</strong> {tx.mapGrow}</p>
            )}
          </div>
        )}
        <div className="flex justify-center gap-10 mt-8">
          {[
            { value: "43+", label: tx.gemeenten },
            { value: "100%", label: tx.freeAccess },
            { value: "24/7", label: tx.available },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[28px] font-extrabold text-pw-blue">{s.value}</p>
              <p className="text-[12px] text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
