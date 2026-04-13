import type { Metadata } from "next";
import { faqItems } from "@/lib/support-content";

export const metadata: Metadata = {
  title: "Hulp & uitleg | PayWatch",
  description:
    "Leer hoe PayWatch werkt. Stap-voor-stap uitleg over e-mail koppelen, rekeningen scannen, betalingsregelingen en meer. Plus veelgestelde vragen.",
  alternates: {
    canonical: "https://paywatch.app/support",
  },
  openGraph: {
    title: "Hulp & uitleg | PayWatch",
    description:
      "Leer hoe PayWatch werkt. Stap-voor-stap uitleg en veelgestelde vragen.",
    url: "https://paywatch.app/support",
    siteName: "PayWatch",
    type: "website",
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question.nl,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.nl,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
