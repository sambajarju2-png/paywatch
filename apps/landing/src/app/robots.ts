import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/404"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/blog/", "/vergelijking/", "/schuldhulp/", "/features/", "/app-voor-schulden-voorkomen"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/blog/", "/vergelijking/", "/schuldhulp/", "/features/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/blog/", "/vergelijking/", "/schuldhulp/", "/features/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/blog/", "/vergelijking/", "/schuldhulp/", "/features/"],
      },
    ],
    sitemap: "https://paywatch.app/sitemap.xml",
    host: "https://paywatch.app",
  };
}
