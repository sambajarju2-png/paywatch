import type { Metadata } from "next";
import { Suspense } from "react";
import PersonalizedOutreachPage from "@/components/personalized/PersonalizedOutreachPage";

export const metadata: Metadata = {
  title: "PayWatch voor gemeentes — Schuldhulpverlening versterken | PayWatch",
  description: "Ontdek hoe PayWatch uw gemeente helpt met vroegsignalering en schuldenpreventie. 724.110 huishoudens hebben problematische schulden. Samen bereiken we inwoners voordat het escaleert.",
  keywords: "schuldhulpverlening gemeente, vroegsignalering schulden, PayWatch gemeente, schuldenpreventie inwoners, gemeentelijke schuldhulp, WIK wet",
  openGraph: {
    title: "PayWatch voor gemeentes — Schuldhulpverlening versterken",
    description: "Ontdek hoe PayWatch uw gemeente helpt met vroegsignalering en schuldenpreventie voor inwoners.",
    url: "https://paywatch.app/gemeente-contact",
    type: "website",
  },
  alternates: { canonical: "https://paywatch.app/gemeente-contact" },
};

export default function GemeenteContactPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg)]" />}>
      <PersonalizedOutreachPage audience="gemeente" />
    </Suspense>
  );
}
