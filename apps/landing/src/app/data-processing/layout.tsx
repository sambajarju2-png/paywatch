import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gegevensverwerking",
  description: "Transparantie over hoe PayWatch je data verwerkt. Subverwerkers, beveiligingsmaatregelen en AVG/GDPR compliance.",
  alternates: { canonical: "https://paywatch.app/data-processing" },
  openGraph: {
    title: "Gegevensverwerking — PayWatch",
    description: "Onze subverwerkers en beveiligingsmaatregelen. AES-256, TLS 1.3, SOC 2 compliant.",
    url: "https://paywatch.app/data-processing",
  },
};

export default function DataProcessingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
