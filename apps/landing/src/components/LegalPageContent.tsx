"use client";

import { PortableText } from "@portabletext/react";
import { useApp } from "./AppProvider";

interface LegalPageData {
  title: { nl?: string; en?: string };
  slug: string;
  lastUpdated: string | null;
  body: {
    nl?: unknown[];
    en?: unknown[];
  };
}

const ptComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-base font-bold text-[var(--navy)] mt-8 mb-2">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-sm font-bold text-[var(--navy)] mt-6 mb-2">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-sm text-[var(--text)] leading-relaxed mb-4">{children}</p>
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
      <ul className="list-disc list-inside space-y-1 mb-4 text-sm text-[var(--text)]">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 text-sm text-[var(--text)]">{children}</ol>
    ),
  },
};

export default function LegalPageContent({ page }: { page: LegalPageData }) {
  const { lang } = useApp();
  const isNl = lang === "nl";

  const title = page.title?.[lang] || page.title?.nl || page.title?.en || "";
  const body = page.body?.[lang] || page.body?.nl || page.body?.en || [];
  const lastUpdated = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString(isNl ? "nl-NL" : "en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight text-center">
          {title}
        </h1>
        {lastUpdated && (
          <p className="text-xs text-[var(--muted)] mt-2 text-center">
            {isNl ? "Laatst bijgewerkt:" : "Last updated:"} {lastUpdated}
          </p>
        )}

        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
          {body && (body as unknown[]).length > 0 ? (
            <PortableText value={body as never[]} components={ptComponents as never} />
          ) : (
            <p className="text-sm text-[var(--muted)] italic">
              {isNl ? "Deze pagina heeft nog geen inhoud." : "This page has no content yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
