"use client";

import Link from "next/link";
import { useApp } from "./AppProvider";
import { footerColumns, siteConfig } from "@/lib/config";

export default function Footer() {
  const { lang, t } = useApp();
  const isNl = lang === "nl";

  const columns = [
    { title: t.footer.product, items: footerColumns.product },
    { title: t.footer.company, items: footerColumns.company },
    { title: t.footer.legal, items: footerColumns.legal },
    { title: t.footer.support, items: footerColumns.support },
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
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                    >
                      {isNl ? item.labelNl : item.labelEn}
                    </Link>
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
