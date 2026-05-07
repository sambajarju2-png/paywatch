"use client";

import { useState, useEffect } from "react";
import { useApp } from "./AppProvider";

export default function CookieBanner() {
  const { t } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pw-cookie-dismissed");
    if (!dismissed) setShow(true);
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem("pw-cookie-dismissed", "1");
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-lg flex-shrink-0">🍪</span>
          <div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{t.cookie.message}</p>
            <p className="text-xs text-[var(--muted)] mt-1 opacity-70">
              Verwerkers: Supabase (EU), Vercel (EU edge), Anthropic (DPA), ElevenLabs (EU), Resend (DPA), Scaleway (EU).{" "}
              <a href="/privacy" className="underline text-[var(--blue)]">Privacybeleid</a>
            </p>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="rounded bg-[var(--blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {t.cookie.accept}
        </button>
      </div>
    </div>
  );
}
