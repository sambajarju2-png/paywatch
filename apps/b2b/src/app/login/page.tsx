"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSent(true); setLoading(false); }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4F7FB" }}>
        <div className="w-full max-w-sm text-center">
          <div className="bg-white border border-pw-border rounded-card p-8">
            <p className="font-bold text-pw-text mb-1">Check je e-mail</p>
            <p className="text-label text-pw-muted">Login-link gestuurd naar <strong>{email}</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-[420px] flex-shrink-0 flex flex-col justify-between" style={{ background: "#0A2540", padding: "60px 48px" }}>
        <div>
          <img src="/logo-dark.svg" alt="PayWatch" className="h-7 mb-12" />
          <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-tight mb-4">
            B2B Partner Portal
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            Beheer je organisatie, volg de voortgang van je cli&euml;nten, en bewijs compliance &mdash; allemaal vanuit &eacute;&eacute;n platform.
          </p>
        </div>
        <p className="text-[11px] text-white/20">PayWatch &copy; 2026 &mdash; Rotterdam, Nederland</p>
      </div>

      <div className="flex-1 flex items-center justify-center" style={{ background: "#F4F7FB" }}>
        <div className="w-full max-w-sm">
          <h2 className="text-page-heading text-pw-text mb-1">Inloggen</h2>
          <p className="text-label text-pw-muted mb-6">Alleen voor geautoriseerde partners</p>

          <div className="bg-white border border-pw-border rounded-card p-6">
            <button onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-pw-border rounded-input text-label font-medium text-pw-text hover:bg-pw-bg transition-colors mb-4 cursor-pointer bg-white">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Inloggen met Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-pw-border" />
              <span className="text-caption text-pw-muted">of</span>
              <div className="flex-1 h-px bg-pw-border" />
            </div>

            <form onSubmit={handleLogin}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="je@email.com" required
                className="w-full px-3.5 py-2.5 border border-pw-border rounded-input text-label focus:outline-none focus:ring-2 focus:ring-pw-blue/30 focus:border-pw-blue mb-3" />
              <button type="submit" disabled={loading}
                className="w-full px-4 py-2.5 bg-pw-navy text-white rounded-button text-label font-semibold disabled:opacity-50 cursor-pointer border-none">
                {loading ? "Versturen..." : "Login-link versturen"}
              </button>
            </form>
            {error && <p className="mt-3 text-caption text-pw-red text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
