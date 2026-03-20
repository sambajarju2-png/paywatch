import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-pw-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-pw-navy">PayWatch</span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-pw-muted">
            <Link href="/features" className="hover:text-pw-text transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-pw-text transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-pw-text transition-colors">Blog</Link>
          </nav>
          <a
            href="https://app.paywatch.app"
            className="bg-pw-blue text-white text-sm font-semibold px-4 py-2 rounded-button hover:bg-blue-700 transition-colors"
          >
            Open app
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-pw-blue-light text-pw-blue text-xs font-semibold mb-6">
          Nu beschikbaar in Nederland
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-pw-navy tracking-tight leading-tight mb-4">
          Grip op je rekeningen.<br />Voorkom extra kosten.
        </h1>
        <p className="text-lg text-pw-muted max-w-2xl mx-auto mb-8 leading-relaxed">
          PayWatch scant je inbox, houdt je rekeningen bij en waarschuwt je voor escalaties — zodat je nooit meer onnodig extra betaalt.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://app.paywatch.app"
            className="bg-pw-blue text-white font-semibold px-6 py-3 rounded-button hover:bg-blue-700 transition-colors"
          >
            Gratis beginnen
          </a>
          <Link
            href="/features"
            className="text-pw-blue font-semibold px-6 py-3 hover:underline"
          >
            Bekijk features →
          </Link>
        </div>
      </section>

      {/* Placeholder for Sanity-driven sections */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="bg-pw-bg rounded-card border border-pw-border p-12">
          <p className="text-pw-muted text-sm">
            More sections will be loaded from Sanity CMS — edit them at admin.paywatch.app/studio
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pw-border bg-pw-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="font-bold text-pw-navy">PayWatch</span>
            <p className="text-xs text-pw-muted mt-2">Grip op je rekeningen.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-pw-text mb-3">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-pw-muted">
              <Link href="/features" className="hover:text-pw-text">Features</Link>
              <Link href="/pricing" className="hover:text-pw-text">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-pw-text mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-pw-muted">
              <Link href="/privacy" className="hover:text-pw-text">Privacyverklaring</Link>
              <Link href="/terms" className="hover:text-pw-text">Voorwaarden</Link>
              <Link href="/subprocessors" className="hover:text-pw-text">Subprocessors</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-pw-text mb-3">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-pw-muted">
              <Link href="/blog" className="hover:text-pw-text">Blog</Link>
              <a href="mailto:hello@paywatch.app" className="hover:text-pw-text">Contact</a>
            </div>
          </div>
        </div>
        <div className="border-t border-pw-border">
          <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-pw-muted">
            © 2026 PayWatch. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </main>
  );
}
