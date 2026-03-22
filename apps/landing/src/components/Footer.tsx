"use client";

import Link from "next/link";
import { useApp } from "./AppProvider";
import { useSanityContent } from "./SanityContentProvider";
import { footerColumns, siteConfig } from "@/lib/config";

export default function Footer() {
  const { lang, t } = useApp();
  const { getNav } = useSanityContent();
  const isNl = lang === "nl";

  /* Build columns: check Sanity first, fall back to hardcoded */
  function getColumn(placement: string, hardcoded: typeof footerColumns.product) {
    const sanityItems = getNav(placement);
    if (sanityItems && sanityItems.length > 0) {
      return sanityItems.map((item) => ({
        label: item.label[lang] || item.label.nl || item.label.en,
        href: item.href,
        isExternal: item.isExternal || false,
      }));
    }
    return hardcoded.map((item) => ({
      label: isNl ? item.labelNl : item.labelEn,
      href: item.href,
      isExternal: false,
    }));
  }

  const columns = [
    { title: t.footer.product, items: getColumn("footer-product", footerColumns.product) },
    { title: t.footer.company, items: getColumn("footer-company", footerColumns.company) },
    { title: t.footer.legal, items: getColumn("footer-legal", footerColumns.legal) },
    { title: t.footer.support, items: getColumn("footer-support", footerColumns.support) },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-[var(--navy)] mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.href}>
                    {item.isExternal ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href}
                        className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-[var(--muted)]">
            <span className="font-bold text-[var(--navy)]">{siteConfig.name}</span>
            <span className="hidden sm:inline">·</span>
            <span>{t.footer.copyright}</span>
          </div>
          <p className="text-sm text-[var(--muted)]">{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
