import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastcolleges & Spreekbeurten over schuldenpreventie en ondernemen",
  description:
    "Boek Samba Jarju en Mariama Sesay voor een gastcollege, keynote of workshop over schuldenpreventie, maatschappelijk ondernemen en fintech. Voor HBO, MBO, universiteiten, gemeentes en events in Nederland.",
  alternates: { canonical: "https://paywatch.app/speaking" },
  openGraph: {
    title: "Gastcolleges schuldenpreventie en ondernemen — PayWatch",
    description:
      "Samba Jarju en Mariama Sesay geven gastcolleges bij hogescholen en events over schulden voorkomen, maatschappelijk betrokken ondernemen en fintech in Nederland.",
    url: "https://paywatch.app/speaking",
    images: [{ url: "https://paywatch.app/speaking-stage.png", width: 1200, height: 630 }],
  },
};

export default function SpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
