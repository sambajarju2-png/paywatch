"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, colors as C } from "@/lib/config";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-pw-navy">
      <div className="max-w-[1140px] mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-pw-blue flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-[17px] font-extrabold text-white tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] font-medium transition-colors ${
                pathname === item.href
                  ? "text-white"
                  : "text-white/60 hover:text-white/90"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={siteConfig.appUrl}
            className="text-[13px] font-medium text-white/70 px-4 py-[7px] rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
          >
            Inloggen
          </Link>
          <Link
            href={siteConfig.appUrl}
            className="text-[13px] font-semibold text-white px-[18px] py-[7px] rounded-lg bg-pw-blue hover:bg-blue-700 transition-colors"
          >
            Start gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
