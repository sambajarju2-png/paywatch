"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";

export default function NotFound() {
  const { lang } = useApp();
  const isNl = lang === "nl";

  return (
    <div className="bg-[var(--bg)] min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-extrabold text-[var(--blue)] mb-4">404</p>
        <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">
          {isNl ? "Pagina niet gevonden" : "Page not found"}
        </h1>
        <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
          {isNl
            ? "De pagina die je zoekt bestaat niet of is verplaatst. Geen zorgen — we helpen je terug."
            : "The page you're looking for doesn't exist or has been moved. No worries — we'll help you get back."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
          >
            {isNl ? "Naar homepage" : "Go to homepage"}
          </Link>
          <Link
            href="/contact"
            className="rounded border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--muted)] transition-colors w-full sm:w-auto text-center"
          >
            {isNl ? "Contact opnemen" : "Contact us"}
          </Link>
        </div>
      </div>
    </div>
  );
}
