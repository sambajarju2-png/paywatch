import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over PayWatch — Ons verhaal",
  description: "PayWatch is opgericht door Samba en Mariama in Rotterdam. Onze missie: niemand onnodig in de schulden door gebrek aan overzicht.",
  alternates: { canonical: "https://paywatch.app/about" },
  openGraph: {
    title: "Over PayWatch — Twee Rotterdammers met een missie",
    description: "Opgericht om onnodige incassokosten te voorkomen. Leer ons team kennen.",
    url: "https://paywatch.app/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
