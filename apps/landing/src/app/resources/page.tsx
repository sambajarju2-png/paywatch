"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import GemeenteSearch from "@/components/GemeenteSearch";
import { aidOrganizations, legalAdvisors, blogPosts, type AidOrg } from "@/lib/config";

type Category = "all" | "legal" | "debtHelp" | "financial";
type Tab = "directory" | "blog";

export default function ResourcesPage() {
  const { lang, t } = useApp();
  const isNl = lang === "nl";
  const [tab, setTab] = useState<Tab>("directory");
  const [filter, setFilter] = useState<Category>("all");

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t.resources.all },
    { key: "legal", label: t.resources.legal },
    { key: "debtHelp", label: t.resources.debtHelp },
    { key: "financial", label: t.resources.financial },
  ];

  const categoryColors: Record<string, string> = {
    legal: "var(--purple)",
    debtHelp: "var(--blue)",
    financial: "var(--green)",
  };

  const categoryLabels: Record<string, Record<string, string>> = {
    legal: { nl: "Juridisch", en: "Legal" },
    debtHelp: { nl: "Schuldhulp", en: "Debt help" },
    financial: { nl: "Financieel", en: "Financial" },
  };

  function filterOrgs(orgs: AidOrg[]): AidOrg[] {
    if (filter === "all") return orgs;
    return orgs.filter((o) => o.category === filter);
  }

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.resources.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.resources.subtitle}</p>
      </div>

      {/* Tabs: Directory / Blog */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8">
        <div className="flex gap-2 justify-center bg-[var(--surface)] border border-[var(--border)] rounded-lg p-1 max-w-xs mx-auto">
          {(["directory", "blog"] as const).map((t2) => (
            <button
              key={t2}
              onClick={() => setTab(t2)}
              className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-colors ${
                tab === t2
                  ? "bg-[var(--blue)] text-white shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {t.resources.tabs[t2]}
            </button>
          ))}
        </div>
      </div>

      {tab === "directory" && (
        <>
          {/* Filter */}
          <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors border ${
                    filter === cat.key
                      ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                      : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--blue)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aid Organizations */}
          <div id="aid" className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-4">{t.resources.aidOrgs}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterOrgs(aidOrganizations).map((org) => (
                <OrgCard key={org.name} org={org} lang={lang} categoryColors={categoryColors} categoryLabels={categoryLabels} t={t} />
              ))}
            </div>
            {filterOrgs(aidOrganizations).length === 0 && (
              <p className="text-sm text-[var(--muted)] py-4">{isNl ? "Geen resultaten voor deze filter." : "No results for this filter."}</p>
            )}
          </div>

          {/* Lawyers */}
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-4">{t.resources.lawyers}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterOrgs(legalAdvisors).map((org) => (
                <OrgCard key={org.name} org={org} lang={lang} categoryColors={categoryColors} categoryLabels={categoryLabels} t={t} />
              ))}
            </div>
            {filterOrgs(legalAdvisors).length === 0 && (
              <p className="text-sm text-[var(--muted)] py-4">{isNl ? "Geen resultaten voor deze filter." : "No results for this filter."}</p>
            )}
          </div>

          {/* Gemeente Search */}
          <div id="gemeente" className="bg-[var(--surface)] border-t border-[var(--border)]">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
              <GemeenteSearch />
            </div>
          </div>
        </>
      )}

      {tab === "blog" && (
        <div id="blog" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
          {blogPosts.length === 0 ? (
            <p className="text-center text-base text-[var(--muted)] py-12">{t.resources.blogEmpty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article key={post.slug} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--blue)] transition-colors">
                  {/* IMAGE PLACEHOLDER: Add blog post cover image here */}
                  <div className="h-40 bg-[var(--bg)] border-b border-[var(--border)] flex flex-col items-center justify-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-30">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-[10px] text-[var(--muted)] opacity-50">{isNl ? "Afbeelding" : "Image"}</span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)] uppercase">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-[var(--muted)]">{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-[var(--navy)] mb-2 leading-snug">{post.title[lang]}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{post.excerpt[lang]}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--muted)]">{post.author} · {post.date}</span>
                      {/* Blog post detail pages will be built in Step 3 */}
                      <span className="text-xs font-semibold text-[var(--blue)]">{t.resources.readMore} →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrgCard({
  org, lang, categoryColors, categoryLabels, t,
}: {
  org: AidOrg;
  lang: "nl" | "en";
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, Record<string, string>>;
  t: ReturnType<typeof import("@/components/AppProvider").useApp>["t"];
}) {
  const color = categoryColors[org.category] || "var(--blue)";
  const catLabel = categoryLabels[org.category]?.[lang] || org.category;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        {/* IMAGE PLACEHOLDER: Add organization logo here */}
        <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
          <span className="text-lg font-bold" style={{ color }}>{org.name[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[var(--navy)] truncate">{org.name}</h3>
          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold mt-0.5" style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
            {catLabel}
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] leading-relaxed mb-3 flex-1">{org.description[lang]}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {org.cities.map((city) => (
          <span key={city} className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] text-[var(--muted)]">{city}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
        {org.website && (
          <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex-1 text-center rounded border border-[var(--border)] py-2 text-xs font-semibold text-[var(--blue)] hover:border-[var(--blue)] transition-colors">
            {t.resources.visit} →
          </a>
        )}
        {org.phone && (
          <a href={`tel:${org.phone}`} className="flex-1 text-center rounded border border-[var(--border)] py-2 text-xs font-semibold text-[var(--green)] hover:border-[var(--green)] transition-colors">
            {t.resources.call}: {org.phone}
          </a>
        )}
      </div>
    </div>
  );
}
