"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Wachtwoord moet minimaal 8 tekens zijn"); return; }
    if (password !== confirm) { setError("Wachtwoorden komen niet overeen"); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4F7FB" }}>
      <div className="w-full max-w-sm px-6">
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.svg" alt="PayWatch" className="h-6" />
          <span className="px-2 py-0.5 bg-pw-navy text-white text-[10px] font-bold rounded">B2B</span>
        </div>

        <h2 className="text-page-heading text-pw-text mb-1">Wachtwoord instellen</h2>
        <p className="text-label text-pw-muted mb-6">Kies een sterk wachtwoord voor je account.</p>

        <div className="bg-white border border-pw-border rounded-card p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-caption text-pw-muted font-medium mb-1">Nieuw wachtwoord</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Minimaal 8 tekens" required autoFocus
                className="w-full px-3.5 py-2.5 border border-pw-border rounded-input text-label focus:outline-none focus:ring-2 focus:ring-pw-blue/30" />
            </div>
            <div className="mb-4">
              <label className="block text-caption text-pw-muted font-medium mb-1">Bevestig wachtwoord</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Herhaal wachtwoord" required
                className="w-full px-3.5 py-2.5 border border-pw-border rounded-input text-label focus:outline-none focus:ring-2 focus:ring-pw-blue/30" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full px-4 py-2.5 bg-pw-navy text-white rounded-button text-label font-semibold disabled:opacity-50 cursor-pointer border-none">
              {loading ? "Opslaan..." : "Wachtwoord opslaan"}
            </button>
          </form>
          {error && <p className="mt-3 text-caption text-pw-red text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
