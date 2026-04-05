import type { Metadata } from "next";
import { Suspense } from "react";
import PersonalizedOutreachPage from "@/components/personalized/PersonalizedOutreachPage";

export const metadata: Metadata = {
  title: "PayWatch voor hulporganisaties",
  description: "Ontdek hoe PayWatch uw clienten kan ondersteunen met digitaal financieel overzicht en schuldenpreventie.",
  robots: { index: false, follow: false },
};

export default function HulporgContactPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg)]" />}>
      <PersonalizedOutreachPage audience="hulporg" />
    </Suspense>
  );
}
