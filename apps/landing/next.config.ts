import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@paywatch/ui", "@paywatch/config"],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
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
          // FIX: Explicitly set CORS to override Vercel's default wildcard
          { key: "Access-Control-Allow-Origin", value: "https://paywatch.app" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdn.sanity.io https://cdn.jsdelivr.net https://cdn.simpleicons.org https://cdn.jsdelivr.net https://cdn.simpleicons.org",
              "connect-src 'self' https://ectcwerjdpiurubdpxcp.supabase.co https://cdn.sanity.io",
              "font-src 'self'",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://app.paywatch.app",
            ].join("; "),
          },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
