import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hulp & uitleg | PayWatch",
  description:
    "Leer hoe PayWatch werkt. Stap-voor-stap uitleg over e-mail koppelen, rekeningen scannen, betalingsregelingen en meer. Plus veelgestelde vragen.",
  alternates: {
    canonical: "https://www.paywatch.app/support",
  },
  openGraph: {
    title: "Hulp & uitleg | PayWatch",
    description:
      "Leer hoe PayWatch werkt. Stap-voor-stap uitleg en veelgestelde vragen.",
    url: "https://www.paywatch.app/support",
    siteName: "PayWatch",
    type: "website",
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
