"use client";

import { useApp } from "@/components/AppProvider";
import FeatureRoadmap from "@/components/FeatureRoadmap";

export default function RoadmapPage() {
  const { lang } = useApp();
  const isNl = lang === "nl";

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <FeatureRoadmap />
      </div>

      {/* Legend */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { color: "var(--green)", label: isNl ? "Voltooid" : "Completed" },
              { color: "var(--blue)", label: isNl ? "Nu bezig" : "In progress" },
              { color: "var(--amber)", label: isNl ? "Binnenkort" : "Upcoming" },
              { color: "var(--muted)", label: isNl ? "Gepland" : "Planned" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="text-xs text-[var(--muted)] font-medium">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--muted)] mt-4 opacity-60">
            {isNl ? "Datums en features kunnen veranderen." : "Dates and features are subject to change."}
          </p>
        </div>
      </div>
    </div>
  );
}
