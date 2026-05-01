"use client";
import Link from "next/link";
import { useApp } from "./AppProvider";
import { useSanityContent } from "./SanityContentProvider";
import { footerColumns, siteConfig } from "@/lib/config";
import NewsletterSubscribe from "./NewsletterSubscribe";

export default function Footer() {
  const { lang, t } = useApp();
  const { getNav } = useSanityContent();
  const isNl = lang === "nl";

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

        {/* Newsletter Section */}
        <div className="mb-10 pb-10 border-b border-[var(--border)]">
          <NewsletterSubscribe lang={lang} variant="full" />
        </div>

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
              {/* "Bekijk meer steden" link for the Steden/Cities column */}
              {col.title === t.footer.product && (
                <Link href="/schuldhulp" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[var(--blue)] hover:underline">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {isNl ? "Bekijk meer steden" : "View all cities"}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-[var(--muted)]">
            <span className="font-bold text-[var(--navy)]">{siteConfig.name}</span>
            <span className="hidden sm:inline">·</span>
            <span>{t.footer.copyright}</span>
            <span className="hidden sm:inline">·</span>
            <span>Daisycon-420734</span>
          </div>
          {/* Social icons + App Store */}
          <div className="flex items-center gap-4">
            {/* App Store badge */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Download on the App Store">
              <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="40" rx="6" fill="var(--navy, #0A2540)"/>
                <g fill="#fff">
                  <path d="M24.769 20.3a4.949 4.949 0 012.356-4.151 5.066 5.066 0 00-3.99-2.158c-1.68-.176-3.308 1.005-4.164 1.005-.872 0-2.19-.988-3.608-.958a5.315 5.315 0 00-4.473 2.728c-1.934 3.348-.491 8.269 1.361 10.976.927 1.325 2.01 2.805 3.428 2.753 1.387-.058 1.905-.885 3.58-.885 1.658 0 2.144.885 3.59.852 1.489-.025 2.426-1.332 3.32-2.67a10.962 10.962 0 001.52-3.092 4.782 4.782 0 01-2.92-4.4zM22.037 12.21a4.872 4.872 0 001.115-3.49 4.957 4.957 0 00-3.208 1.66 4.636 4.636 0 00-1.144 3.36 4.1 4.1 0 003.237-1.53z"/>
                  <text x="42" y="16" fontSize="8" fontFamily="-apple-system,BlinkMacSystemFont,sans-serif" fontWeight="400" letterSpacing=".5">{isNl ? 'Download in de' : 'Download on the'}</text>
                  <text x="42" y="28" fontSize="14" fontFamily="-apple-system,BlinkMacSystemFont,sans-serif" fontWeight="600">App Store</text>
                </g>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/paywatch-nl" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--navy)] transition-colors" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.instagram.com/paywatch.nl" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--navy)] transition-colors" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@paywatch.nl" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--navy)] transition-colors" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>
          <p className="text-sm text-[var(--muted)]">{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
