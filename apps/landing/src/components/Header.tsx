"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { useApp } from "@/components/AppProvider";

export function Header() {
  const pathname = usePathname();
  const { lang, setLang, theme, setTheme } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-pw-navy dark:bg-[#070B14]">
      <div className="max-w-[1140px] mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-pw-blue flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-[17px] font-extrabold text-white tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] font-medium transition-colors ${
                pathname === item.href ? "text-white" : "text-white/60 hover:text-white/90"
              }`}
            >
              {item.label[lang]}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "nl" ? "en" : "nl")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/15 text-[12px] font-semibold text-white/70 hover:bg-white/5 transition-colors"
            title={lang === "nl" ? "Switch to English" : "Schakel naar Nederlands"}
          >
            <span>{lang === "nl" ? "🇳🇱" : "🇬🇧"}</span>
            <span>{lang === "nl" ? "NL" : "EN"}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-8 h-8 rounded-md border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/5 transition-colors"
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Login + CTA */}
          <Link
            href={siteConfig.appUrl}
            className="text-[13px] font-medium text-white/70 px-4 py-[7px] rounded-lg border border-white/15 hover:bg-white/5 transition-colors hidden sm:inline-block"
          >
            {lang === "nl" ? "Inloggen" : "Log in"}
          </Link>
          <Link
            href={siteConfig.appUrl}
            className="text-[13px] font-semibold text-white px-[18px] py-[7px] rounded-lg bg-pw-blue hover:bg-blue-700 transition-colors"
          >
            {lang === "nl" ? "Start gratis" : "Start free"}
          </Link>
        </div>
      </div>
    </header>
  );
}
