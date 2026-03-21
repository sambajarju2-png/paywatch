import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Functies — Alle features van PayWatch",
  description: "Ontdek alle functies: Gmail scanning, escalatie tracking, AI-brieven, cashflow voorspelling, financiële gezondheid score, QR betalen en meer.",
  alternates: { canonical: "https://paywatch.app/features" },
  openGraph: {
    title: "PayWatch Functies — Alles wat je nodig hebt",
    description: "Gmail scanning, escalatie tracking, AI-brieven, cashflow voorspelling en meer. Gratis in beta.",
    url: "https://paywatch.app/features",
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
