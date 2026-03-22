"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";

interface BlogPost {
  slug: string;
  title: { nl: string; en: string };
  excerpt: { nl: string; en: string };
  category: { nl: string; en: string };
  categorySlug: string;
  date: string;
  readTime: string;
  author: string;
  mainImageUrl?: string | null;
}

interface CategoryItem {
  slug: string;
  label: { nl: string; en: string };
}

function BlogContent() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog-posts")
      .then((r) => r.json())
      .then((d) => {
        if (d.posts?.length > 0) setPosts(d.posts);
        if (d.categories?.length > 0) setCategories(d.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categoryFromUrl) setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  /* Build filter tabs: "All" + dynamic categories from Sanity */
  const allTab: CategoryItem = { slug: "all", label: { nl: "Alles", en: "All" } };
  const filterTabs = [allTab, ...categories];

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter((p) => p.categorySlug === activeCategory);

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">Blog</h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">
          {isNl ? "Tips, uitleg en hulp bij het omgaan met rekeningen en schulden." : "Tips, explanations and help for dealing with bills and debt."}
        </p>
      </div>

      {/* Category filter — dynamic from Sanity */}
      {filterTabs.length > 1 && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {filterTabs.map((cat) => (
              <button key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors border ${
                  activeCategory === cat.slug
                    ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                    : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--blue)]"
                }`}>
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden animate-pulse">
                <div className="h-44 bg-[var(--bg)]" />
                <div className="p-5"><div className="h-4 w-3/4 bg-[var(--border)] rounded mb-2" /><div className="h-3 w-full bg-[var(--border)] rounded" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-base text-[var(--muted)] py-12">
            {isNl ? "Geen artikelen in deze categorie." : "No articles in this category."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--blue)] transition-colors">
                {post.mainImageUrl ? (
                  <div className="h-44 bg-[var(--bg)] border-b border-[var(--border)] overflow-hidden">
                    <img src={post.mainImageUrl} alt={post.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-44 bg-[var(--bg)] border-b border-[var(--border)] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue-light)] to-transparent opacity-50" />
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-30 relative z-10"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)] uppercase">{post.category[lang]}</span>
                    <span className="text-[10px] text-[var(--muted)]">{post.readTime}</span>
                  </div>
                  <h2 className="text-base font-bold text-[var(--navy)] mb-2 leading-snug group-hover:text-[var(--blue)] transition-colors">{post.title[lang]}</h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{post.excerpt[lang]}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)]">{post.author} · {post.date}</span>
                    <span className="text-xs font-semibold text-[var(--blue)] group-hover:underline">{isNl ? "Lees meer" : "Read more"} →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <BlogContent />
    </Suspense>
  );
}
