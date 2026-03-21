import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hulpmiddelen — Schuldhulp, juridisch advies en meer",
  description: "Vind hulporganisaties, juridisch adviseurs en gemeentelijke schuldhulp in Nederland. Gratis advies en ondersteuning bij schulden.",
  alternates: { canonical: "https://paywatch.app/resources" },
  openGraph: {
    title: "Hulpmiddelen — PayWatch",
    description: "Hulporganisaties, juristen en gemeentelijke ondersteuning voor mensen met schulden.",
    url: "https://paywatch.app/resources",
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
