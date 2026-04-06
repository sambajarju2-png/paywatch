import type { Metadata } from "next";
import { Suspense } from "react";
import PersonalizedOutreachPage from "@/components/personalized/PersonalizedOutreachPage";

export const metadata: Metadata = {
  title: "Klanten die op tijd betalen met PayWatch",
  description: "78% van consumenten betaalt na herinnering, mits op tijd. PayWatch helpt uw klanten rekeningen bij te houden. Minder betalingsachterstanden, minder incassokosten.",
  keywords: "betalingsachterstand voorkomen, klanten op tijd betalen, PayWatch bedrijven, incassokosten verlagen, facturatie verbeteren",
  openGraph: {
    title: "Klanten die op tijd betalen met PayWatch",
    description: "PayWatch helpt uw klanten rekeningen bij te houden. Minder betalingsachterstanden, minder incassokosten.",
    url: "https://paywatch.app/zakelijk-contact",
    type: "website",
  },
  alternates: { canonical: "https://paywatch.app/zakelijk-contact" },
};

export default function ZakelijkContactPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg)]" />}>
      <PersonalizedOutreachPage audience="zakelijk" />
    </Suspense>
  );
}
