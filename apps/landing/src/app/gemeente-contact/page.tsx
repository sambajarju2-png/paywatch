import type { Metadata } from "next";
import { Suspense } from "react";
import PersonalizedOutreachPage from "@/components/personalized/PersonalizedOutreachPage";

export const metadata: Metadata = {
  title: "Samenwerken met PayWatch — Voor gemeentes",
  description: "Ontdek hoe PayWatch uw gemeente kan helpen met schuldhulpverlening en vroegsignalering.",
  robots: { index: false, follow: false },
};

export default function GemeenteContactPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg)]" />}>
      <PersonalizedOutreachPage audience="gemeente" />
    </Suspense>
  );
}
