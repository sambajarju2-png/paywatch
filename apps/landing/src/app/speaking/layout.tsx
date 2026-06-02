import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastcolleges & Spreekbeurten — Samba Jarju over schuldenpreventie",
  description:
    "Boek Samba Jarju voor een gastcollege over schuldenpreventie, maatschappelijk ondernemen en fintech. Geschikt voor HBO, MBO, universiteiten, gemeentes en events.",
  alternates: { canonical: "https://paywatch.app/speaking" },
  openGraph: {
    title: "Gastcolleges — PayWatch",
    description:
      "Samba Jarju geeft gastcolleges over schulden voorkomen, maatschappelijk betrokken ondernemen en de toekomst van fintech in Nederland.",
    url: "https://paywatch.app/speaking",
    images: [{ url: "https://paywatch.app/speaking-stage.png", width: 1200, height: 630 }],
  },
};

export default function SpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
