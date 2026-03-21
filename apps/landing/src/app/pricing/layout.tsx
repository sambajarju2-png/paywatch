import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijzen — Gratis in beta",
  description: "PayWatch is gratis te gebruiken. Nodig een vriend uit om alle functies te ontgrendelen: AI-inzichten, statistieken, cashflow en meer.",
  alternates: { canonical: "https://paywatch.app/pricing" },
  openGraph: {
    title: "PayWatch Prijzen — Gratis in beta",
    description: "Gratis rekeningen scannen en escalatie tracking. Nodig 1 vriend uit voor volledige toegang.",
    url: "https://paywatch.app/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
