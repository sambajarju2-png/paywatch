import type { Metadata } from "next";
import { jobListings } from "@/lib/config";
import { generateJobPostingSchema } from "@/lib/job-schema-util";

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
  const jobSchemas = generateJobPostingSchema(jobListings);
  return (
    <>
      {jobSchemas.map((schema, i) => (
        <script
          key={`job-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
