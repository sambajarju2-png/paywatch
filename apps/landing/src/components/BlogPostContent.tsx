"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { useApp } from "./AppProvider";
import { blogPostsFull } from "@/lib/blog-content";
import NewsletterSubscribe from "./NewsletterSubscribe";

interface SanityPost {
  slug: string;
  title: { nl?: string; en?: string };
  excerpt: { nl?: string; en?: string };
  category: { title?: string; slug?: string } | null;
  publishedAt: string;
  readTime: string;
  author: { name?: string } | null;
  mainImageUrl: string | null;
  mainImageAlt: string | null;
  keywords: string[];
  body: unknown[] | null;
}

/* Portable Text custom components for rendering body with images */
const ptComponents = {
  types: {
    image: ({ value }: { value: { url?: string; alt?: string; caption?: string } }) => {
      if (!value?.url) return null;
      return (
        <figure className="my-6">
          <img
            src={value.url}
            alt={value.alt || ""}
            className="w-full rounded-xl border border-[var(--border)]"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-xs text-[var(--muted)] text-center mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-lg sm:text-xl font-bold text-[var(--navy)] mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-base sm:text-lg font-bold text-[var(--navy)] mt-6 mb-2">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-base text-[var(--text)] leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-[var(--blue)] pl-4 my-4 italic text-[var(--muted)]">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a href={value?.href} className="text-[var(--blue)] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 mb-4 text-[var(--text)]">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 text-[var(--text)]">{children}</ol>
    ),
  },
};

export default function BlogPostContent({ slug }: { slug: string }) {
  const { lang } = useApp();
  const isNl = lang === "nl";

  const [sanityPost, setSanityPost] = useState<SanityPost | null>(null);
  const [loading, setLoading] = useState(true);

  /* Fetch from Sanity API first */
  useEffect(() => {
    fetch(`/api/blog-posts/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.post) setSanityPost(d.post);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  /* Loading state */
  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* Try hardcoded fallback */
  const hardcodedPost = blogPostsFull.find((p) => p.slug === slug);

  /* If we have a Sanity post, render it */
  if (sanityPost) {
    const title = sanityPost.title?.[lang] || sanityPost.title?.nl || sanityPost.title?.en || slug;
    const categoryTitle = sanityPost.category?.title || "Blog";
    const categorySlug = sanityPost.category?.slug || "all";
    const authorName = sanityPost.author?.name || "PayWatch";
    const date = sanityPost.publishedAt?.slice(0, 10) || "";

    return (
      <div className="bg-[var(--bg)]">
        <article className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-[var(--blue)] hover:underline mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            {isNl ? "Terug naar blog" : "Back to blog"}
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--muted)] uppercase">
                {categoryTitle}
              </span>
              <span className="text-[10px] text-[var(--muted)]">{sanityPost.readTime || "5 min"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-[var(--blue-light)] flex items-center justify-center">
                <span className="text-xs font-bold text-[var(--blue)]">{authorName[0]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{authorName}</p>
                <p className="text-xs text-[var(--muted)]">{date}</p>
              </div>
            </div>
          </header>

          {/* Hero image from Sanity mainImage */}
          {sanityPost.mainImageUrl ? (
            <img
              src={sanityPost.mainImageUrl}
              alt={sanityPost.mainImageAlt || title}
              className="w-full rounded-2xl border border-[var(--border)] mb-8 object-cover"
              style={{ maxHeight: 400 }}
            />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] h-48 sm:h-64 mb-8 flex flex-col items-center justify-center gap-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-30">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs text-[var(--muted)] opacity-50">
                {isNl ? "Afbeelding toevoegen in Sanity Studio" : "Add image in Sanity Studio"}
              </span>
            </div>
          )}

          {/* Portable Text body */}
          {sanityPost.body && sanityPost.body.length > 0 ? (
            <div className="prose-pw">
              <PortableText value={sanityPost.body as never[]} components={ptComponents as never} />
            </div>
          ) : (
            <p className="text-base text-[var(--muted)] italic">
              {isNl ? "Dit artikel heeft nog geen inhoud. Voeg tekst toe in Sanity Studio." : "This article has no content yet. Add text in Sanity Studio."}
            </p>
          )}

          {/* Tags */}
          {(sanityPost.keywords?.length > 0 || categorySlug) && (
            <div className="mt-10 pt-6 border-t border-[var(--border)]">
              {categorySlug && (
                <>
                  <p className="text-xs font-semibold text-[var(--navy)] mb-2">{isNl ? "Categorie" : "Category"}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Link href={`/blog?category=${categorySlug}`}
                      className="rounded border border-[var(--blue)] bg-[var(--blue-light)] px-3 py-1 text-xs font-semibold text-[var(--blue)] hover:opacity-80 transition-opacity">
                      {categoryTitle}
                    </Link>
                  </div>
                </>
              )}
              {sanityPost.keywords?.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-[var(--navy)] mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {sanityPost.keywords.map((kw) => (
                      <span key={kw} className="rounded border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]">{kw}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-8 text-center">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-2">
              {isNl ? "Grip op je rekeningen?" : "Take control of your bills?"}
            </h3>
            <p className="text-sm text-[var(--muted)] mb-4 max-w-md mx-auto">
              {isNl ? "PayWatch scant je inbox en toont precies waar elke rekening staat. Gratis in beta." : "PayWatch scans your inbox and shows exactly where each bill stands. Free in beta."}
            </p>
            <Link href="https://app.paywatch.app" className="inline-flex rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              {isNl ? "Start gratis" : "Start free"}
            </Link>
          </div>

          {/* Newsletter */}
          <div className="mt-10">
            <NewsletterSubscribe lang={lang} variant="full" />
          </div>
        </article>
      </div>
    );
  }

  /* Fallback to hardcoded post */
  if (hardcodedPost) {
    const related = blogPostsFull
      .filter((p) => p.categorySlug === hardcodedPost.categorySlug && p.slug !== hardcodedPost.slug)
      .slice(0, 2);

    return (
      <div className="bg-[var(--bg)]">
        <article className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-[var(--blue)] hover:underline mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            {isNl ? "Terug naar blog" : "Back to blog"}
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--muted)] uppercase">
                {hardcodedPost.category[lang]}
              </span>
              <span className="text-[10px] text-[var(--muted)]">{hardcodedPost.readTime}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight leading-tight">
              {hardcodedPost.title[lang]}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-[var(--blue-light)] flex items-center justify-center">
                <span className="text-xs font-bold text-[var(--blue)]">{hardcodedPost.author[0]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{hardcodedPost.author}</p>
                <p className="text-xs text-[var(--muted)]">{hardcodedPost.date}</p>
              </div>
            </div>
          </header>

          <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] h-48 sm:h-64 mb-8 flex flex-col items-center justify-center gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-30">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>

          <div className="space-y-8">
            {hardcodedPost.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--navy)] mb-3">{section.heading[lang]}</h2>
                <p className="text-base text-[var(--text)] leading-relaxed">{section.body[lang]}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--navy)] mb-2">{isNl ? "Categorieën" : "Categories"}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Link href={`/blog?category=${hardcodedPost.categorySlug}`}
                className="rounded border border-[var(--blue)] bg-[var(--blue-light)] px-3 py-1 text-xs font-semibold text-[var(--blue)] hover:opacity-80 transition-opacity">
                {hardcodedPost.category[lang]}
              </Link>
            </div>
            <p className="text-xs font-semibold text-[var(--navy)] mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {hardcodedPost.keywords.map((kw) => (
                <span key={kw} className="rounded border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]">{kw}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-8 text-center">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-2">{isNl ? "Grip op je rekeningen?" : "Take control of your bills?"}</h3>
            <p className="text-sm text-[var(--muted)] mb-4 max-w-md mx-auto">{isNl ? "PayWatch scant je inbox en toont precies waar elke rekening staat. Gratis in beta." : "PayWatch scans your inbox and shows exactly where each bill stands. Free in beta."}</p>
            <Link href="https://app.paywatch.app" className="inline-flex rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">{isNl ? "Start gratis" : "Start free"}</Link>
          </div>

          {/* Newsletter */}
          <div className="mt-10">
            <NewsletterSubscribe lang={lang} variant="full" />
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-[var(--navy)] mb-4">{isNl ? "Lees ook" : "Also read"}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--blue)] transition-colors">
                    <span className="text-[10px] text-[var(--muted)] uppercase">{r.category[lang]}</span>
                    <h4 className="text-sm font-bold text-[var(--navy)] mt-1 group-hover:text-[var(--blue)] transition-colors leading-snug">{r.title[lang]}</h4>
                    <p className="text-xs text-[var(--muted)] mt-1">{r.author} · {r.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  /* Neither Sanity nor hardcoded found */
  return (
    <div className="bg-[var(--bg)] min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">
          {isNl ? "Artikel niet gevonden" : "Article not found"}
        </h1>
        <Link href="/blog" className="text-sm text-[var(--blue)] hover:underline">
          {isNl ? "Terug naar blog" : "Back to blog"}
        </Link>
      </div>
    </div>
  );
}
