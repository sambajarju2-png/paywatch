import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap & Directory | PayWatch",
  description:
    "Navigeer eenvoudig door alle pagina's van PayWatch. Overzicht van functies, schuldhulp per stad, blog, hulpbronnen en meer.",
  alternates: { canonical: "https://paywatch.app/directory" },
  openGraph: {
    title: "Sitemap & Directory | PayWatch",
    description: "Alle PayWatch pagina's op één plek.",
    url: "https://paywatch.app/directory",
    siteName: "PayWatch",
    type: "website",
    images: [{ url: "/api/og?type=feature&title=PayWatch%20Directory", width: 1200, height: 630 }],
  },
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
