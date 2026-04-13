import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") || "default";
  const title = searchParams.get("title") || "PayWatch";
  const city = searchParams.get("city") || "";
  const subtitle = searchParams.get("subtitle") || "";

  // Build content based on type
  let heading = title;
  let sub = "Grip op je rekeningen";
  let accent = "#2563EB";

  if (type === "schuldhulp" && city) {
    heading = `Schuldhulp ${city}`;
    sub = `Gratis hulp bij schulden in ${city}`;
    accent = "#059669";
  } else if (type === "blog") {
    sub = subtitle || "PayWatch Blog";
    accent = "#2563EB";
  } else if (type === "feature") {
    sub = subtitle || "PayWatch Functies";
    accent = "#7C3AED";
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A2540",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
        }}
      >
        {/* Top: logo + accent line */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "8px",
              height: "40px",
              background: accent,
              borderRadius: "4px",
            }}
          />
          <span
            style={{
              color: accent,
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            PayWatch
          </span>
        </div>

        {/* Middle: heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: heading.length > 40 ? "44px" : "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            {heading}
          </span>
          <span
            style={{
              color: "#94A3B8",
              fontSize: "24px",
              fontWeight: 500,
              maxWidth: "700px",
            }}
          >
            {sub}
          </span>
        </div>

        {/* Bottom: domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#475569", fontSize: "18px", fontWeight: 500 }}>
            paywatch.app
          </span>
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#475569",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              🇪🇺 Gebouwd in de EU
            </span>
            <span
              style={{
                color: "#475569",
                fontSize: "16px",
              }}
            >
              •
            </span>
            <span
              style={{
                color: "#475569",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              100% gratis
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
