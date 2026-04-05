import type { Metadata } from "next";
import { Suspense } from "react";
import PersonalizedOutreachPage from "@/components/personalized/PersonalizedOutreachPage";

export const metadata: Metadata = {
  title: "PayWatch voor hulporganisaties — Clienten beter voorbereid | PayWatch",
  description: "86% van mensen met schulden wordt niet bereikt door hulpverlening. PayWatch geeft clienten overzicht zodat intake sneller verloopt en terugval wordt voorkomen.",
  keywords: "schuldhulpverlening tool, clienten ondersteunen schulden, PayWatch hulporganisatie, financieel overzicht clienten, NVVK samenwerking",
  openGraph: {
    title: "PayWatch voor hulporganisaties — Clienten beter voorbereid",
    description: "86% van mensen met schulden wordt niet bereikt. PayWatch geeft clienten overzicht voor snellere intake.",
    url: "https://paywatch.app/hulporg-contact",
    type: "website",
  },
  alternates: { canonical: "https://paywatch.app/hulporg-contact" },
};

export default function HulporgContactPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg)]" />}>
      <PersonalizedOutreachPage audience="hulporg" />
    </Suspense>
  );
}
