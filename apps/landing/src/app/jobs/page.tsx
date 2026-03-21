"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";

export default function JobsPage() {
  const { lang } = useApp();
  const n = lang === "nl";
  const jobs = [
    { title: n ? "Account Manager Hulporganisaties" : "Account Manager Aid Organizations", type: "Sales", loc: "Rotterdam / Remote" },
    { title: n ? "Account Manager Private Sector" : "Account Manager Private Sector", type: "Sales", loc: "Rotterdam / Remote" },
    { title: "Full Stack Developer", type: "Engineering", loc: "Remote" },
    { title: n ? "Open sollicitatie" : "Open application", type: n ? "Algemeen" : "General", loc: "Remote" },
  ];

  return (
    <section className="py-16 px-6 bg-pw-bg min-h-screen">
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-hero text-pw-navy mb-2">{n ? "Vacatures" : "Jobs"}</h1>
        <p className="text-body text-pw-muted mb-8">{n ? "Help mee om financiële rust bereikbaar te maken." : "Help make financial peace accessible."}</p>
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.title} className="bg-white rounded-card p-6 border border-pw-border flex justify-between items-center">
              <div>
                <h3 className="text-section-head text-pw-navy mb-1">{j.title}</h3>
                <div className="flex gap-3">
                  <span className="text-label text-pw-blue font-semibold">{j.type}</span>
                  <span className="text-label text-pw-muted">{j.loc}</span>
                </div>
              </div>
              <Link href="/contact" className="bg-pw-blue-light text-pw-blue rounded-button px-4 py-2 text-[12px] font-semibold shrink-0 hover:bg-blue-100 transition-colors">
                {n ? "Solliciteer" : "Apply"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
