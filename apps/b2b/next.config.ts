import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@paywatch/ui", "@paywatch/database", "@paywatch/config"],
  poweredByHeader: false,
  typescript: {
    // TODO: fix remaining strict TS errors and remove this
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.logo.dev" },
      { protocol: "https", hostname: "ectcwerjdpiurubdpxcp.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
