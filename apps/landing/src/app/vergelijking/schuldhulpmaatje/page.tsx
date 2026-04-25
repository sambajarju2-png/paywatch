import type { Metadata } from "next";
import SchuldHulpMaatjeContent from "./SchuldHulpMaatjeContent";

export const metadata: Metadata = {
  title: "SchuldHulpMaatje en PayWatch (2026) — samen schulden voorkomen | PayWatch",
  description:
    "SchuldHulpMaatje helpt bij bestaande schulden. PayWatch vangt het eerder op. Ontdek hoe beide organisaties elkaar aanvullen en samen schulden voorkomen.",
  alternates: {
    canonical: "https://paywatch.app/vergelijking/schuldhulpmaatje",
  },
  openGraph: {
    title: "SchuldHulpMaatje en PayWatch — samen schulden voorkomen",
    description:
      "SchuldHulpMaatje biedt persoonlijke begeleiding bij schulden. PayWatch scant je inbox en waarschuwt voordat het zover komt. Samen dekken ze het hele traject.",
    url: "https://paywatch.app/vergelijking/schuldhulpmaatje",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wat is SchuldHulpMaatje?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SchuldHulpMaatje is een landelijke vrijwilligersorganisatie die mensen met geldzorgen gratis koppelt aan een getrainde vrijwilliger. Samen werken ze aan het oplossen van schulden en het op orde brengen van de financiele situatie.",
      },
    },
    {
      "@type": "Question",
      name: "Wat is het verschil tussen SchuldHulpMaatje en PayWatch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SchuldHulpMaatje helpt wanneer schulden al bestaan, met persoonlijke begeleiding door een vrijwilliger. PayWatch werkt eerder in het proces: het scant je inbox op rekeningen en waarschuwt je voordat een factuur escaleert naar een aanmaning of incasso.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik SchuldHulpMaatje en PayWatch tegelijk gebruiken?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. PayWatch geeft je overzicht in je rekeningen en deadlines. SchuldHulpMaatje biedt persoonlijke begeleiding. Samen heb je zowel de technologie als de menselijke ondersteuning die je nodig hebt.",
      },
    },
  ],
};

export default function SchuldHulpMaatjePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SchuldHulpMaatjeContent />
    </>
  );
}
