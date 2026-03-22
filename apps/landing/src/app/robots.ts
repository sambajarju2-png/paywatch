import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/studio/",
          "/unsubscribe",
        ],
      },
      // Block AI scrapers that don't respect content rights
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"], // Allow Google AI (helps SEO visibility)
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
      },
    ],
    sitemap: "https://paywatch.app/sitemap.xml",
  };
}
