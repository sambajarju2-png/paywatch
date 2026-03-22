"use client";

import { useEffect, useState } from "react";
import { supabaseAuth, ADMIN_EMAILS } from "@/lib/auth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated" | "forbidden">("loading");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabaseAuth.auth.getSession();
      if (!session?.user?.email) {
        setStatus("unauthenticated");
        return;
      }
      if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
        setStatus("forbidden");
        return;
      }
      setStatus("authenticated");
    };
    check();

    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      if (!session?.user?.email) {
        setStatus("unauthenticated");
        return;
      }
      if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
        setStatus("forbidden");
        return;
      }
      setStatus("authenticated");
    });

    return () => subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--muted)]">Laden...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm mx-4">
          <div className="rounded-2xl border border-[var(--border)] p-8 text-center" style={{ background: "var(--surface)" }}>
            <div className="w-12 h-12 rounded-xl bg-[var(--blue-light)] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[var(--navy)] mb-1">PayWatch Admin</h1>
            <p className="text-sm text-[var(--muted)] mb-6">Meld je aan met je Google-account</p>
            <button
              onClick={async () => {
                await supabaseAuth.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: window.location.origin + "/api/auth/callback" },
                });
              }}
              className="w-full flex items-center justify-center gap-3 rounded border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--blue)] transition-colors"
              style={{ background: "var(--surface)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Inloggen met Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="rounded-2xl border border-[var(--border)] p-8 max-w-sm mx-4 text-center" style={{ background: "var(--surface)" }}>
          <div className="w-12 h-12 rounded-xl bg-[var(--red-light)] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <h2 className="text-lg font-bold text-[var(--navy)] mb-1">Geen toegang</h2>
          <p className="text-sm text-[var(--muted)] mb-4">Dit account is niet geautoriseerd als admin.</p>
          <button
            onClick={async () => { await supabaseAuth.auth.signOut(); setStatus("unauthenticated"); }}
            className="text-sm font-semibold text-[var(--blue)] hover:underline"
          >
            Ander account proberen
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
