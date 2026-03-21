import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: "Het privacybeleid van PayWatch. Hoe we je gegevens verzamelen, gebruiken en beschermen. AVG/GDPR compliant.",
  alternates: { canonical: "https://paywatch.app/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
