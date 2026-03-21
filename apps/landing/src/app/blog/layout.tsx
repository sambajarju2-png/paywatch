import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Tips en uitleg over rekeningen en schulden",
  description: "Praktische tips, uitleg over escalatiefases en hulp bij het omgaan met rekeningen en schulden in Nederland. Door het PayWatch team.",
  alternates: { canonical: "https://paywatch.app/blog" },
  openGraph: {
    title: "PayWatch Blog — Tips over rekeningen en schulden",
    description: "Praktische tips, uitleg over escalatiefases en hulp bij schulden in Nederland.",
    url: "https://paywatch.app/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
