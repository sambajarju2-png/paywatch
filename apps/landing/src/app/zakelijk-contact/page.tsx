import type { Metadata } from "next";
import { Suspense } from "react";
import PersonalizedOutreachPage from "@/components/personalized/PersonalizedOutreachPage";

export const metadata: Metadata = {
  title: "PayWatch voor bedrijven — Klanten die op tijd betalen",
  description: "Ontdek hoe PayWatch uw klanten helpt rekeningen op tijd te betalen. Minder betalingsachterstanden, minder incassokosten.",
  robots: { index: false, follow: false },
};

export default function ZakelijkContactPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg)]" />}>
      <PersonalizedOutreachPage audience="zakelijk" />
    </Suspense>
  );
}
