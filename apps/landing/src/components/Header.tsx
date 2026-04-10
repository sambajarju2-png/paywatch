"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "./AppProvider";
import { useSanityContent } from "./SanityContentProvider";
import { navItems, siteConfig } from "@/lib/config";

export default function Header() {
  const { lang, setLang, theme, setTheme, t } = useApp();
  const { getNav } = useSanityContent();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[#0A2540] dark:bg-[#060D1B]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo-dark.svg" alt="PayWatch" className="h-6" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {headerItems.map((item) =>
            item.isExternal ? (
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

          {/* Login link */}
          <Link href={`https://${siteConfig.appDomain}`}
            className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {t.nav.login}
          </Link>

          {/* CTA button */}
          <Link href={`https://${siteConfig.appDomain}`}
            className="hidden sm:inline-flex items-center rounded bg-[var(--blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            {t.nav.cta}
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-1" aria-label="Toggle menu">
            <span className={`block h-0.5 w-5 bg-slate-300 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-300 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-[#0A2540] dark:bg-[#060D1B] px-4 pb-4">
          {headerItems.map((item) =>
            item.isExternal ? (
              <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium text-slate-300 hover:text-white border-b border-slate-700/50">
                {item.label}
              </a>
            ) : (
              <Link key={item.key} href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium text-slate-300 hover:text-white border-b border-slate-700/50">
                {item.label}
              </Link>
            )
          )}
          <div className="flex gap-3 mt-4">
            <Link href={`https://${siteConfig.appDomain}`}
              className="flex-1 text-center rounded border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">
              {t.nav.login}
            </Link>
            <Link href={`https://${siteConfig.appDomain}`}
              className="flex-1 text-center rounded bg-[var(--blue)] px-4 py-2 text-sm font-semibold text-white">
              {t.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
