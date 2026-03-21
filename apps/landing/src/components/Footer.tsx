import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-pw-navy pt-14 pb-6 px-6">
      <div className="max-w-[1140px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-[5px] bg-pw-blue/20 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="text-[15px] font-extrabold text-white">{siteConfig.name}</span>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed max-w-[260px]">
              Gebouwd in Rotterdam, voor heel Nederland. Jouw rekeningen, jouw rust.
            </p>
            <div className="flex gap-2 mt-4">
              {["EU product", "GDPR/AVG", "AES-256"].map((badge) => (
                <span
                  key={badge}
                  className="text-[9px] font-semibold text-white/30 bg-white/[0.06] px-2 py-[3px] rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic columns from config */}
          {siteConfig.footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <div className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-white/55 hover:text-white/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-5 flex justify-between items-center">
          <span className="text-[11px] text-white/25">
            © 2026 {siteConfig.name} B.V. — KVK {siteConfig.kvk} — {siteConfig.city}
          </span>
          <span className="text-[11px] text-white/25">Gebouwd met ♥ in 🇳🇱</span>
        </div>
      </div>
    </footer>
  );
}
