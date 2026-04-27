"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Ongeldig e-mailadres of wachtwoord"
        : error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-[420px] flex-shrink-0 hidden lg:flex flex-col justify-between" style={{ background: "#0A2540", padding: "60px 48px" }}>
        <div>
          <img src="/logo-dark.svg" alt="PayWatch" className="h-7 mb-12" />
          <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-tight mb-4">
            B2B Partner Portal
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            Beheer je organisatie, volg de voortgang van je cliënten, en bewijs compliance — allemaal vanuit één platform.
          </p>
        </div>
        <p className="text-[11px] text-white/20">PayWatch © 2026 — Rotterdam, Nederland</p>
      </div>

      <div className="flex-1 flex items-center justify-center" style={{ background: "#F4F7FB" }}>
        <div className="w-full max-w-sm px-6">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src="/logo.svg" alt="PayWatch" className="h-6" />
            <span className="px-2 py-0.5 bg-pw-navy text-white text-[10px] font-bold rounded">B2B</span>
          </div>
          <h2 className="text-page-heading text-pw-text mb-1">Inloggen</h2>
          <p className="text-label text-pw-muted mb-6">Alleen voor geautoriseerde partners</p>

          <div className="bg-white border border-pw-border rounded-card p-6">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="block text-caption text-pw-muted font-medium mb-1">E-mailadres</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="je@organisatie.nl" required autoFocus
                  className="w-full px-3.5 py-2.5 border border-pw-border rounded-input text-label focus:outline-none focus:ring-2 focus:ring-pw-blue/30 focus:border-pw-blue" />
              </div>
              <div className="mb-4">
                <label className="block text-caption text-pw-muted font-medium mb-1">Wachtwoord</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full px-3.5 py-2.5 border border-pw-border rounded-input text-label focus:outline-none focus:ring-2 focus:ring-pw-blue/30 focus:border-pw-blue" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full px-4 py-2.5 bg-pw-navy text-white rounded-button text-label font-semibold disabled:opacity-50 cursor-pointer border-none">
                {loading ? "Inloggen..." : "Inloggen"}
              </button>
            </form>
            {error && <p className="mt-3 text-caption text-pw-red text-center">{error}</p>}
          </div>

          <p className="text-center text-caption text-pw-muted mt-4">
            Geen account? Neem contact op met je beheerder.
          </p>
        </div>
      </div>
    </div>
  );
}
