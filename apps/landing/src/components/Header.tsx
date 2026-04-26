"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "./AppProvider";
import { useSanityContent } from "./SanityContentProvider";
import { navItems, siteConfig } from "@/lib/config";
import HamburgerIcon from "./HamburgerIcon";
import OverlayMenu from "./OverlayMenu";

const vergelijkDropdown = [
  { slug: "dyme-alternatief", name: "Dyme", domain: "dyme.app" },
  { slug: "grassfeld-alternatief", name: "Grassfeld", domain: "grassfeld.com" },
  { slug: "fikks-alternatief", name: "fiKks", domain: "wijgaanhetfikksen.nl" },
  { slug: "cleo-alternatief", name: "Cleo", domain: "meetcleo.com" },
  { slug: "schuldhulpmaatje", name: "SchuldHulpMaatje", domain: "schuldhulpmaatje.nl" },
];

export default function Header() {
  const { lang, setLang, theme, setTheme, t } = useApp();
  const { getNav } = useSanityContent();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* Use Sanity nav if available, otherwise hardcoded */
  const sanityHeaderNav = getNav("header");
  const headerItems = sanityHeaderNav
    ? sanityHeaderNav.map((item) => ({
        key: item.href.replace(/^\//, ""),
        href: item.href,
        label: item.label[lang] || item.label.nl || item.label.en,
        isExternal: item.isExternal || false,
      }))
    : navItems.map((item) => ({
        key: item.key,
        href: item.href,
        label: t.nav[item.key as keyof typeof t.nav],
        isExternal: false,
      }));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[#0A2540] dark:bg-[#060D1B]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo-dark.svg" alt="PayWatch" className="h-6" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {headerItems.map((item) =>
              item.key === "vergelijken" ? (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
                  </Link>
                  {dropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56">
                      <div className="rounded-xl border border-slate-700 bg-[#0A2540] shadow-xl overflow-hidden">
                        {vergelijkDropdown.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/vergelijking/${c.slug}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            <img
                              src={`https://img.logo.dev/${c.domain}?token=pk_RLZzD1KxRrCpEywuCrIRRw&size=40&format=png`}
                              alt=""
                              width={20}
                              height={20}
                              className="rounded"
                              loading="lazy"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                            <span>vs {c.name}</span>
                          </Link>
                        ))}
                        <div className="border-t border-slate-700">
                          <Link
                            href="/vergelijking"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-blue-400 hover:bg-slate-800 transition-colors"
                          >
                            {lang === "nl" ? "Bekijk alle vergelijkingen" : "View all comparisons"}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : item.isExternal ? (
                <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  {item.label}
                </a>
              ) : (
                <Link key={item.key} href={item.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right side: controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "nl" ? "en" : "nl")}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-600 text-xs hover:border-slate-400 transition-colors"
              aria-label="Toggle language"
            >
              {lang === "nl" ? "🇬🇧" : "🇳🇱"}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-600 text-xs hover:border-slate-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-400">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>

            {/* Login link — desktop only */}
            <Link href={`https://${siteConfig.appDomain}`}
              className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {t.nav.login}
            </Link>

            {/* CTA button — desktop only */}
            <Link href={`https://${siteConfig.appDomain}`}
              className="hidden sm:inline-flex items-center rounded bg-[var(--blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              {t.nav.cta}
            </Link>

            {/* Single hamburger — opens full-page overlay on all screen sizes */}
            <HamburgerIcon onClick={() => setOverlayOpen(true)} />
          </div>
        </nav>
      </header>

      {/* Full-page overlay menu */}
      <OverlayMenu isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
}
