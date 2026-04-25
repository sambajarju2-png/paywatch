import type { Metadata } from "next";
import CategoryContent from "./CategoryContent";

export const metadata: Metadata = {
  title: "Beste app om schulden te voorkomen (2026) — vergelijk en kies | PayWatch",
  description:
    "Vergelijk de beste apps om schulden te voorkomen in Nederland. Van budget apps tot schuldhulp tools. Ontdek welke app bij jouw situatie past.",
  alternates: { canonical: "https://paywatch.app/app-voor-schulden-voorkomen" },
  openGraph: {
    title: "Beste app om schulden te voorkomen (2026)",
    description: "Vergelijk budget apps, coaching apps en schuldpreventie tools. Ontdek welke app bij jou past.",
    url: "https://paywatch.app/app-voor-schulden-voorkomen",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wat is de beste app tegen schulden in Nederland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dat hangt af van je situatie. Voor het voorkomen van schulden is PayWatch gebouwd: het scant je inbox op rekeningen en waarschuwt voordat een factuur escaleert. Voor budgetteren zijn Dyme en Grassfeld goed. Voor hulp bij bestaande schulden is fiKks of SchuldHulpMaatje geschikt.",
      },
    },
    {
      "@type": "Question",
      name: "Kan een app schulden voorkomen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, mits de app actief je rekeningen monitort en je waarschuwt voor deadlines. Alleen uitgaven bijhouden is niet genoeg. Je hebt een tool nodig die facturen detecteert, escalatiefasen herkent en je op tijd laat handelen.",
      },
    },
    {
      "@type": "Question",
      name: "Wat als ik al schulden heb?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dan is een budget app alleen niet genoeg. Kijk naar SchuldHulpMaatje voor gratis persoonlijke begeleiding, of neem contact op met de schuldhulpverlening in je gemeente. PayWatch helpt je daarnaast nieuwe rekeningen in de gaten te houden zodat de situatie niet erger wordt.",
      },
    },
    {
      "@type": "Question",
      name: "Is PayWatch gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Je kunt gratis je inbox koppelen, rekeningen scannen, escalaties volgen en schuldhulp zoeken bij jou in de buurt.",
      },
    },
  ],
};

export default function AppVoorSchuldenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CategoryContent />
    </>
  );
}
