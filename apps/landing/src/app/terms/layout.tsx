import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: "De algemene voorwaarden van PayWatch B.V. Onze afspraken over het gebruik van de dienst.",
  alternates: { canonical: "https://paywatch.app/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
