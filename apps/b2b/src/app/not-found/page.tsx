export default async function NotFoundPage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug } = await searchParams;
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7FB" }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#0A2540", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" viewBox="0 0 512 512" fill="none">
            <g transform="translate(96, 56) scale(13.3)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </g>
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Organisatie niet gevonden</h1>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
          {slug ? (
            <>De organisatie <strong style={{ color: "#0F172A" }}>{slug}.paywatch.app</strong> bestaat niet of is niet actief.</>
          ) : (
            <>Dit subdomein is niet gekoppeld aan een organisatie.</>
          )}
        </p>
        <a href="https://b2b.paywatch.app" style={{
          display: "inline-block", padding: "10px 20px", background: "#0A2540", color: "white",
          borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: "none",
        }}>
          Naar PayWatch B2B
        </a>
      </div>
    </div>
  );
}
