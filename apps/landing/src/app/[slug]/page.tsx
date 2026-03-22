import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface SanityPage {
  title: string;
  slug: { current: string };
  metaDescription?: { nl?: string; en?: string };
  sections?: Array<{
    _type: string;
    _key: string;
    headline?: { nl?: string; en?: string };
    subheadline?: { nl?: string; en?: string };
    heading?: { nl?: string; en?: string };
    subheading?: { nl?: string; en?: string };
    content?: unknown[];
    ctaText?: string;
    ctaUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    items?: Array<{ value: string; label: { nl?: string; en?: string } }>;
  }>;
}

async function getPage(slug: string): Promise<SanityPage | null> {
  return client.fetch(
    `*[_type == "page" && slug.current == $urlSlug][0]{
      title,
      slug,
      metaDescription,
      sections
    }`,
    { urlSlug: slug }
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription?.nl || page.metaDescription?.en || "",
  };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] mb-8">{page.title}</h1>

        {page.sections?.map((section) => (
          <div key={section._key} className="mb-12">
            {/* Hero section */}
            {section._type === "hero" && (
              <div className="text-center mb-12">
                {section.headline?.nl && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] mb-3">{section.headline.nl}</h2>
                )}
                {section.subheadline?.nl && (
                  <p className="text-base text-[var(--muted)] max-w-xl mx-auto">{section.subheadline.nl}</p>
                )}
                {section.ctaText && section.ctaUrl && (
                  <a href={section.ctaUrl} className="inline-flex mt-6 rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                    {section.ctaText}
                  </a>
                )}
              </div>
            )}

            {/* Stats section */}
            {section._type === "stats" && (
              <div>
                {section.heading?.nl && (
                  <h2 className="text-xl font-bold text-[var(--navy)] mb-6 text-center">{section.heading.nl}</h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {section.items?.map((item, i) => (
                    <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
                      <p className="text-2xl font-extrabold text-[var(--blue)]">{item.value}</p>
                      <p className="text-xs text-[var(--muted)] mt-1">{item.label?.nl}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA section */}
            {section._type === "cta" && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                {section.heading?.nl && (
                  <h2 className="text-xl font-bold text-[var(--navy)] mb-2">{section.heading.nl}</h2>
                )}
                {section.subheading?.nl && (
                  <p className="text-sm text-[var(--muted)] mb-6">{section.subheading.nl}</p>
                )}
                {section.buttonText && section.buttonUrl && (
                  <a href={section.buttonUrl} className="inline-flex rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                    {section.buttonText}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
