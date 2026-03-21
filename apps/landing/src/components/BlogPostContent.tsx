"use client";

import Link from "next/link";
import { useApp } from "./AppProvider";
import { blogPostsFull } from "@/lib/blog-content";

export default function BlogPostContent({ slug }: { slug: string }) {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const post = blogPostsFull.find((p) => p.slug === slug);

  if (!post) {
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

  /* Find related posts (same category, different slug) */
  const related = blogPostsFull
    .filter((p) => p.categorySlug === post.categorySlug && p.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="bg-[var(--bg)]">
      <article className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-[var(--blue)] hover:underline mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          {isNl ? "Terug naar blog" : "Back to blog"}
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--muted)] uppercase">
              {post.category[lang]}
            </span>
            <span className="text-[10px] text-[var(--muted)]">{post.readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight leading-tight">
            {post.title[lang]}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            {/* Author avatar placeholder */}
            <div className="w-8 h-8 rounded-full bg-[var(--blue-light)] flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--blue)]">{post.author[0]}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{post.author}</p>
              <p className="text-xs text-[var(--muted)]">{post.date}</p>
            </div>
          </div>
        </header>

        {/* IMAGE PLACEHOLDER: Add blog post hero image here */}
        <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] h-48 sm:h-64 mb-8 flex flex-col items-center justify-center gap-2">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-30">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-xs text-[var(--muted)] opacity-50">
            {isNl ? "Hero afbeelding toevoegen" : "Add hero image"}
          </span>
        </div>

        {/* Article content */}
        <div className="space-y-8">
          {post.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--navy)] mb-3">
                {section.heading[lang]}
              </h2>
              <p className="text-base text-[var(--text)] leading-relaxed">
                {section.body[lang]}
              </p>
            </section>
          ))}
        </div>

        {/* Tags / keywords — clickable, link to blog filtered by category */}
        <div className="mt-10 pt-6 border-t border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--navy)] mb-2">{isNl ? "Categorieën" : "Categories"}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href={`/blog?category=${post.categorySlug}`}
              className="rounded border border-[var(--blue)] bg-[var(--blue-light)] px-3 py-1 text-xs font-semibold text-[var(--blue)] hover:opacity-80 transition-opacity">
              {post.category[lang]}
            </Link>
          </div>
          <p className="text-xs font-semibold text-[var(--navy)] mb-2">{isNl ? "Tags" : "Tags"}</p>
          <div className="flex flex-wrap gap-2">
            {post.keywords.map((kw) => (
              <span key={kw} className="rounded border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-8 text-center">
          <h3 className="text-lg font-bold text-[var(--navy)] mb-2">
            {isNl ? "Grip op je rekeningen?" : "Take control of your bills?"}
          </h3>
          <p className="text-sm text-[var(--muted)] mb-4 max-w-md mx-auto">
            {isNl
              ? "PayWatch scant je inbox en toont precies waar elke rekening staat. Gratis in beta."
              : "PayWatch scans your inbox and shows exactly where each bill stands. Free in beta."}
          </p>
          <Link
            href="https://app.paywatch.app"
            className="inline-flex rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {isNl ? "Start gratis" : "Start free"}
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-4">
              {isNl ? "Lees ook" : "Also read"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--blue)] transition-colors"
                >
                  <span className="text-[10px] text-[var(--muted)] uppercase">{r.category[lang]}</span>
                  <h4 className="text-sm font-bold text-[var(--navy)] mt-1 group-hover:text-[var(--blue)] transition-colors leading-snug">
                    {r.title[lang]}
                  </h4>
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
