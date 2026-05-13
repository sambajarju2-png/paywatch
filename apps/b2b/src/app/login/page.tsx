"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setLoading(true);
    setError("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) {
      setError("Google inloggen mislukt. Probeer het opnieuw.");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Onjuist e-mailadres of wachtwoord");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[420px] flex-shrink-0 flex-col justify-between relative overflow-hidden" style={{ background: "#0A2540" }}>
        {/* Animated blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" style={{ animation: "pulse 4s ease-in-out infinite" }} />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl" style={{ animation: "pulse 4s ease-in-out infinite 2s" }} />
        </div>

        <div className="relative z-10 p-12">
          <img src="/logo-dark.svg" alt="PayWatch" className="h-7 mb-10" />
          <h1 className="text-[32px] font-extrabold text-white tracking-tight leading-tight mb-4">
            Beheer financiele<br />gezondheid met<br />vertrouwen
          </h1>
          <p className="text-sm text-blue-200 leading-relaxed max-w-xs">
            Help huishoudens hun schulden te beheersen met slimme inzichten en persoonlijke coaching.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: "M18 20V10M12 20V4M6 20v-6", label: "Real-time inzichten", desc: "Volg escalaties op één dashboard" },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Coach toewijzing", desc: "Koppel clienten aan de juiste ondersteuning" },
              { icon: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z", label: "Uitnodigingen", desc: "Gebruikers onboarden via link of QR" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{f.label}</div>
                  <div className="text-xs text-blue-200">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-12 pt-0">
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {[
              { value: "Gemeentes", label: "" },
              { value: "Incassobureaus", label: "" },
              { value: "Hulporganisaties", label: "" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[24px] font-extrabold text-white">{s.value}</div>
                <div className="text-[11px] text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center" style={{ background: "#F4F7FB" }}>
        <div className="w-full max-w-sm px-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src="/logo.svg" alt="PayWatch" className="h-6" />
            <span className="px-2 py-0.5 bg-pw-navy text-white text-[10px] font-bold rounded">B2B</span>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-pw-border">
            <h2 className="text-[22px] font-extrabold text-pw-navy tracking-tight mb-1">Welkom terug</h2>
            <p className="text-sm text-pw-muted mb-6">Log in om je dashboard te openen</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1.5">E-mailadres</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pw-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="naam@organisatie.nl" required autoFocus
                    className="w-full pl-10 pr-4 py-2.5 bg-pw-bg border border-pw-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1.5">Wachtwoord</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pw-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Je wachtwoord" required
                    className="w-full pl-10 pr-10 py-2.5 bg-pw-bg border border-pw-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pw-muted hover:text-pw-text transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showPassword
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-pw-red">{error}</div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-pw-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75"/></svg>
                ) : null}
                {loading ? "Inloggen..." : "Inloggen"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-pw-border" />
              <span className="text-[11px] font-medium text-pw-muted">of</span>
              <div className="flex-1 h-px bg-pw-border" />
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-2.5 bg-white border border-pw-border text-pw-text text-sm font-semibold rounded-lg hover:bg-pw-bg disabled:opacity-50 transition-colors flex items-center justify-center gap-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Inloggen met Google
            </button>
          </div>

          <p className="text-center text-xs text-pw-muted mt-4">
            Geen account? Neem contact op met je beheerder.
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-pw-muted mt-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Beveiligd met enterprise-grade encryptie
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } }`}</style>
    </div>
  );
}
