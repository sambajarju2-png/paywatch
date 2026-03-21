"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"nl" | "en">("nl");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({ email: u.email || "", name: u.user_metadata?.display_name || u.email?.split("@")[0] || "" });
      }
    });
    // Load preferences
    const savedTheme = localStorage.getItem("pw-theme") as "light" | "dark" | null;
    const savedLang = localStorage.getItem("pw-lang") as "nl" | "en" | null;
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("pw-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function toggleLang() {
    const next = lang === "nl" ? "en" : "nl";
    setLang(next);
    localStorage.setItem("pw-lang", next);
    document.documentElement.setAttribute("lang", next);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  async function handleDeleteAccount() {
    // In production, call a server-side API route that cascading-deletes all data
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      <h1 className="text-xl font-bold text-[var(--navy)]">Instellingen</h1>

      {/* Account */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--navy)] mb-3">Account</h2>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-[var(--blue-light)] flex items-center justify-center">
            <span className="text-lg font-bold text-[var(--blue)]">{user?.name?.[0]?.toUpperCase() || "?"}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{user?.name || "..."}</p>
            <p className="text-xs text-[var(--muted)]">{user?.email || "..."}</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--navy)] mb-3">Voorkeuren</h2>

        {/* Theme */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            <span className="text-sm text-[var(--text)]">Donkere modus</span>
          </div>
          <button onClick={toggleTheme}
            className={`w-11 h-6 rounded-full relative transition-colors ${theme === "dark" ? "bg-[var(--blue)]" : "bg-[var(--border)]"}`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${theme === "dark" ? "translate-x-5.5 left-0.5" : "left-0.5"}`}
              style={{ transform: theme === "dark" ? "translateX(20px)" : "translateX(0)" }} />
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            <span className="text-sm text-[var(--text)]">Taal</span>
          </div>
          <button onClick={toggleLang}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
            {lang === "nl" ? "🇳🇱 NL" : "🇬🇧 EN"}
          </button>
        </div>
      </div>

      {/* Support links */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--navy)] mb-3">Ondersteuning</h2>
        {[
          { label: "Privacybeleid", href: "https://paywatch.app/privacy" },
          { label: "Voorwaarden", href: "https://paywatch.app/terms" },
          { label: "Contact", href: "https://paywatch.app/contact" },
          { label: "Hulpmiddelen", href: "https://paywatch.app/resources" },
        ].map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0 text-sm text-[var(--text)] hover:text-[var(--blue)] transition-colors">
            {link.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--red)] hover:bg-[var(--red-light)] transition-colors">
        Uitloggen
      </button>

      {/* Danger zone */}
      <div className="rounded-xl border border-[var(--red)]/20 bg-[var(--red-light)] p-4">
        <h2 className="text-sm font-semibold text-[var(--red)] mb-2">Gevaarzone</h2>
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)}
            className="text-xs font-semibold text-[var(--red)] hover:underline">
            Account verwijderen
          </button>
        ) : (
          <div>
            <p className="text-xs text-[var(--text)] mb-3">
              Dit verwijdert je account en alle data permanent. Dit kan niet ongedaan gemaakt worden.
            </p>
            <div className="flex gap-2">
              <button onClick={handleDeleteAccount}
                className="rounded bg-[var(--red)] px-4 py-2 text-xs font-semibold text-white">
                Ja, verwijder alles
              </button>
              <button onClick={() => setShowDeleteConfirm(false)}
                className="rounded border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)]">
                Annuleer
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-[var(--muted)] py-4">PayWatch v2.0 — paywatch.app</p>
    </div>
  );
}
