export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: [
      "https://paywatch.app/sitemap.xml",
      "https://paywatch.app/sitemap-blog.xml",
      "https://paywatch.app/sitemap-pages.xml",
    ],
  };
}
