import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vergelijking — PayWatch vs budget apps",
  description:
    "Vergelijk PayWatch met Dyme, fiKks, Grassfeld, Cleo en andere budget apps. Ontdek welke app het beste past bij jouw situatie.",
  alternates: { canonical: "https://paywatch.app/vergelijking" },
  openGraph: {
    title: "PayWatch vs budget apps — eerlijke vergelijking",
    description:
      "PayWatch voorkomt dat rekeningen escaleren. Vergelijk met Dyme, fiKks, Grassfeld en Cleo.",
    url: "https://paywatch.app/vergelijking",
  },
};

export default function VergelijkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
