import type { Metadata } from "next";
import { Suspense } from "react";
import PersonalizedOutreachPage from "@/components/personalized/PersonalizedOutreachPage";

export const metadata: Metadata = {
  title: "Minder vermijdbare dossiers met PayWatch",
  description: "35% van incassozaken is vermijdbaar. PayWatch helpt consumenten rekeningen op tijd te betalen. Minder escalatie, lagere kosten, betere betalingsmoraal.",
  keywords: "incasso preventie, betalingsmoraal verbeteren, incassokosten verlagen, PayWatch incasso, WIK wet incassokosten, schuldenpreventie",
  openGraph: {
    title: "Minder vermijdbare dossiers met PayWatch",
    description: "35% van incassozaken is vermijdbaar. PayWatch helpt consumenten rekeningen op tijd te betalen.",
    url: "https://paywatch.app/incasso-contact",
    type: "website",
  },
  alternates: { canonical: "https://paywatch.app/incasso-contact" },
};

export default function IncassoContactPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg)]" />}>
      <PersonalizedOutreachPage audience="incasso" />
    </Suspense>
  );
}
