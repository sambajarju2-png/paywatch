import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vacatures — Werken bij PayWatch",
  description: "Help mee financiële stress in Nederland te verminderen. Bekijk onze openstaande vacatures in engineering, sales en marketing.",
  alternates: { canonical: "https://paywatch.app/jobs" },
  openGraph: {
    title: "Werken bij PayWatch",
    description: "Vacatures in engineering, sales en marketing. Remote en hybride mogelijkheden.",
    url: "https://paywatch.app/jobs",
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
