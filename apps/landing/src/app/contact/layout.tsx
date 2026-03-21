import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met PayWatch. Voor particulieren, gemeenten en bedrijven. E-mail: info@paywatch.nl.",
  alternates: { canonical: "https://paywatch.app/contact" },
  openGraph: {
    title: "Contact — PayWatch",
    description: "Vragen, feedback of samenwerking? Neem contact met ons op.",
    url: "https://paywatch.app/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
