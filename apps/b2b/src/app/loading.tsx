export default function Loading() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar skeleton */}
      <aside style={{
        width: 240, background: "#0A2540", padding: "20px 0",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ padding: "0 16px", marginBottom: 24 }}>
          <div style={{ width: 100, height: 22, background: "rgba(255,255,255,0.08)", borderRadius: 4 }} />
        </div>
        <nav style={{ flex: 1, padding: "0 8px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, marginBottom: 2,
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
              <div style={{ width: 80 + Math.random() * 40, height: 13, background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
            </div>
          ))}
        </nav>
      </aside>

      {/* Content skeleton */}
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1100 }}>
        {/* Title */}
        <div style={{ width: 180, height: 24, background: "#E2E8F0", borderRadius: 6, marginBottom: 24 }} />

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16,
            }}>
              <div style={{ width: 60, height: 11, background: "#F1F5F9", borderRadius: 3, marginBottom: 8 }} />
              <div style={{ width: 40, height: 28, background: "#F1F5F9", borderRadius: 4 }} />
            </div>
          ))}
        </div>

        {/* Content card */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20,
        }}>
          <div style={{ width: 140, height: 16, background: "#F1F5F9", borderRadius: 4, marginBottom: 16 }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", padding: "12px 0",
              borderBottom: i < 4 ? "1px solid #F1F5F9" : "none",
            }}>
              <div style={{ width: 120 + i * 15, height: 14, background: "#F1F5F9", borderRadius: 4 }} />
              <div style={{ width: 50, height: 14, background: "#F1F5F9", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
