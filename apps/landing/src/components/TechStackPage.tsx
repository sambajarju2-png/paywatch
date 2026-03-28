"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import {
  Mail, Brain, Shield, Database, Smartphone, Rocket, BarChart3,
  Plug, Globe, Code2, Server, Zap, Lock, Eye, Layers, GitBranch,
  ChevronDown, ExternalLink,
} from "lucide-react";

/* ─── Brand logo URLs (pinned versions for stability) ─── */
const LOGO = {
  nextjs:     "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/nextjs/nextjs-original.svg",
  react:      "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/react/react-original.svg",
  typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/typescript/typescript-original.svg",
  tailwind:   "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/tailwindcss/tailwindcss-original.svg",
  supabase:   "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/supabase/supabase-original.svg",
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/postgresql/postgresql-original.svg",
  vercel:     "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/vercel/vercel-original.svg",
  github:     "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/github/github-original.svg",
  vscode:     "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/vscode/vscode-original.svg",
  google:     "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/google/google-original.svg",
  sanity:     "https://cdn.simpleicons.org/sanity/F03E2F",
  pnpm:       "https://cdn.simpleicons.org/pnpm/F69220",
  turborepo:  "https://cdn.simpleicons.org/turborepo/EF4444",
  anthropic:  "https://cdn.simpleicons.org/anthropic/191919",
  recharts:   "https://cdn.simpleicons.org/recharts/22B5BF",
};

/* Icons that are dark/black and need inversion in dark mode */
const DARK_ICONS = new Set(["nextjs", "vercel", "github", "anthropic"]);

function BrandIcon({ src, alt, size = 22, className = "" }: { src: string; alt: string; size?: number; className?: string }) {
  const needsInvert = Object.entries(LOGO).some(
    ([key, url]) => url === src && DARK_ICONS.has(key)
  );
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      className={`rounded ${needsInvert ? "dark:invert" : ""} ${className}`}
    />
  );
}

/* ─── Types ─── */
type IconType = "brand" | "lucide";

interface StackItem {
  name: string;
  iconType: IconType;
  brandIcon?: string;
  lucideIcon?: React.ReactNode;
  desc: { nl: string; en: string };
  why: { nl: string; en: string };
  snippet?: string;
  url?: string;
}

interface StackCategory {
  title: { nl: string; en: string };
  icon: React.ReactNode;
  items: StackItem[];
}

/* ─── Stack data ─── */
const STACK: StackCategory[] = [
  {
    title: { nl: "Frontend", en: "Frontend" },
    icon: <Code2 size={16} />,
    items: [
      {
        name: "Next.js 16", iconType: "brand", brandIcon: LOGO.nextjs,
        desc: { nl: "App Router, server components, Turbopack", en: "App Router, server components, Turbopack" },
        why: { nl: "De snelste React framework. Server components reduceren bundle size met 40%. Turbopack bouwt in 4.3 seconden.", en: "The fastest React framework. Server components reduce bundle size by 40%. Turbopack builds in 4.3 seconds." },
        snippet: `// next.config.ts — Turbopack enabled\nexport default {\n  images: {\n    remotePatterns: [\n      { hostname: "cdn.sanity.io" }\n    ]\n  }\n}`,
        url: "https://nextjs.org",
      },
      {
        name: "React 19", iconType: "brand", brandIcon: LOGO.react,
        desc: { nl: "Server Components, Suspense, use() hook", en: "Server Components, Suspense, use() hook" },
        why: { nl: "Native async/await in components. Geen useEffect meer nodig voor data fetching.", en: "Native async/await in components. No more useEffect needed for data fetching." },
        snippet: `// Server Component — no "use client"\nexport default async function Blog() {\n  const posts = await sanity.fetch(\n    '*[_type == "blogPost"]'\n  );\n  return <PostGrid posts={posts} />;\n}`,
        url: "https://react.dev",
      },
      {
        name: "TypeScript", iconType: "brand", brandIcon: LOGO.typescript,
        desc: { nl: "Strict mode, volledige type coverage", en: "Strict mode, full type coverage" },
        why: { nl: "Compile-time checks voorkomen runtime bugs. Betere developer experience met autocompletion.", en: "Compile-time checks prevent runtime bugs. Better developer experience with autocompletion." },
        snippet: `interface Bill {\n  id: string;\n  vendor: string;\n  amount: number; // cents\n  escalation_stage:\n    | "factuur"\n    | "herinnering"\n    | "aanmaning"\n    | "incasso"\n    | "deurwaarder";\n}`,
      },
      {
        name: "Tailwind CSS", iconType: "brand", brandIcon: LOGO.tailwind,
        desc: { nl: "Utility-first, CSS variabelen voor dark mode", en: "Utility-first, CSS variables for dark mode" },
        why: { nl: "Geen CSS-in-JS overhead. CSS variabelen voor licht/donker thema. Final CSS: slechts 8KB.", en: "No CSS-in-JS overhead. CSS variables for light/dark theme. Final CSS: only 8KB." },
        snippet: `:root {\n  --bg: #F4F7FB;\n  --navy: #0A2540;\n  --blue: #2563EB;\n}\n[data-theme="dark"] {\n  --bg: #0F172A;\n  --navy: #E2E8F0;\n  --blue: #3B82F6;\n}`,
      },
    ],
  },
  {
    title: { nl: "Backend & Data", en: "Backend & Data" },
    icon: <Database size={16} />,
    items: [
      {
        name: "Supabase", iconType: "brand", brandIcon: LOGO.supabase,
        desc: { nl: "Postgres + Auth + RLS, 15 tabellen", en: "Postgres + Auth + RLS, 15 tables" },
        why: { nl: "Open-source Firebase alternatief. Row Level Security: iedere user ziet alleen eigen data. Google OAuth ingebouwd.", en: "Open-source Firebase alternative. Row Level Security: each user only sees their own data. Google OAuth built-in." },
        snippet: `-- Row Level Security\nCREATE POLICY "Users see own bills"\n  ON bills FOR SELECT\n  USING (auth.uid() = user_id);\n\n-- 15 tables, zero exposed endpoints`,
        url: "https://supabase.com",
      },
      {
        name: "Sanity CMS", iconType: "brand", brandIcon: LOGO.sanity,
        desc: { nl: "Headless CMS, 10 document types, GROQ", en: "Headless CMS, 10 document types, GROQ" },
        why: { nl: "Real-time collaborative editing. GROQ query taal is krachtiger dan REST. Blog, jobs, roadmap — alles vanuit Studio.", en: "Real-time collaborative editing. GROQ query language is more powerful than REST." },
        snippet: `// GROQ query\n*[_type == "blogPost"]\n  | order(publishedAt desc) {\n  title, slug, excerpt,\n  "category": category->title,\n  "image": mainImage.asset->url\n}`,
        url: "https://sanity.io",
      },
      {
        name: "Resend", iconType: "lucide", lucideIcon: <Mail size={20} strokeWidth={1.5} />,
        desc: { nl: "Transactional email via paywatch.app domein", en: "Transactional email via paywatch.app domain" },
        why: { nl: "Developer-first email API. reply_to naar info@paywatch.nl zodat antwoorden in je inbox komen.", en: "Developer-first email API. reply_to to info@paywatch.nl so replies land in your inbox." },
        snippet: `await resend.emails.send({\n  from: "PayWatch <noreply@paywatch.app>",\n  reply_to: "info@paywatch.nl",\n  to: user.email,\n  subject: "Je rekening update",\n});`,
        url: "https://resend.com",
      },
      {
        name: "PostgreSQL", iconType: "brand", brandIcon: LOGO.postgresql,
        desc: { nl: "Via Supabase, EU-West-1 regio", en: "Via Supabase, EU-West-1 region" },
        why: { nl: "Meest betrouwbare open-source database. Hosted in Europa voor GDPR. Realtime subscriptions via Supabase.", en: "Most reliable open-source database. Hosted in Europe for GDPR. Realtime subscriptions via Supabase." },
      },
    ],
  },
  {
    title: { nl: "AI Pipeline", en: "AI Pipeline" },
    icon: <Brain size={16} />,
    items: [
      {
        name: "Gemini 2.0 Flash", iconType: "brand", brandIcon: LOGO.google,
        desc: { nl: "Email classificatie — is dit een rekening?", en: "Email classification — is this a bill?" },
        why: { nl: "200ms per call. Filtert 300 emails in minder dan 1 minuut. Kost minder dan €0.001 per email.", en: "200ms per call. Filters 300 emails in under 1 minute. Costs less than €0.001 per email." },
        snippet: `// Stap 1: Gemini classificeert\nconst { isBill, confidence } =\n  await gemini.classify(emailBody);\n\nif (isBill && confidence > 0.8) {\n  // Door naar Haiku voor extractie\n  await extractWithHaiku(email);\n}`,
      },
      {
        name: "Claude Haiku", iconType: "brand", brandIcon: LOGO.anthropic,
        desc: { nl: "Diepe extractie: bedrag, IBAN, deadline", en: "Deep extraction: amount, IBAN, deadline" },
        why: { nl: "Haiku is snel en goedkoop. Extraheert gestructureerde data uit rommelige emails. €0.25 per 1M tokens.", en: "Haiku is fast and cheap. Extracts structured data from messy emails. €0.25 per 1M tokens." },
        snippet: `// Stap 2: Haiku extraheert\nconst bill = await haiku.extract({\n  fields: [\n    "amount", "due_date",\n    "vendor", "IBAN",\n    "escalation_stage"\n  ],\n  content: emailBody,\n  language: "nl"\n});`,
      },
    ],
  },
  {
    title: { nl: "Infrastructuur", en: "Infrastructure" },
    icon: <Server size={16} />,
    items: [
      {
        name: "Vercel", iconType: "brand", brandIcon: LOGO.vercel,
        desc: { nl: "3 projecten, Pro plan, edge functions", en: "3 projects, Pro plan, edge functions" },
        why: { nl: "Push naar GitHub = deploy in 30 seconden. Preview URLs voor iedere branch. Edge functions wereldwijd.", en: "Push to GitHub = deploy in 30 seconds. Preview URLs for every branch. Edge functions worldwide." },
        url: "https://vercel.com",
      },
      {
        name: "Turborepo", iconType: "brand", brandIcon: LOGO.turborepo,
        desc: { nl: "Monorepo: 3 apps + shared packages", en: "Monorepo: 3 apps + shared packages" },
        why: { nl: "Eén repo, drie apps. Cached builds: alleen gewijzigde code herbouwen. Gedeelde TypeScript types.", en: "One repo, three apps. Cached builds: only rebuild changed code. Shared TypeScript types." },
        snippet: `paywatch/\n├── apps/\n│   ├── landing/   → paywatch.app\n│   ├── app/       → app.paywatch.app\n│   └── admin/     → intern dashboard\n└── packages/\n    ├── ui/        → shared components\n    └── config/    → shared configs`,
      },
      {
        name: "Recharts", iconType: "lucide", lucideIcon: <BarChart3 size={20} strokeWidth={1.5} />,
        desc: { nl: "Grafieken in Stripe-stijl, 3 kleuren", en: "Stripe-style charts, 3 colors" },
        why: { nl: "Simpele API, responsive, past perfect bij onze Stripe-achtige design. Alleen blauw, groen en amber.", en: "Simple API, responsive, fits perfectly with our Stripe-like design. Only blue, green and amber." },
      },
      {
        name: "GitHub", iconType: "brand", brandIcon: LOGO.github,
        desc: { nl: "Version control, auto-deploy via Vercel", en: "Version control, auto-deploy via Vercel" },
        why: { nl: "Push naar main = automatische deploy op alle 3 Vercel projecten.", en: "Push to main = automatic deploy on all 3 Vercel projects." },
        url: "https://github.com",
      },
      {
        name: "pnpm", iconType: "brand", brandIcon: LOGO.pnpm,
        desc: { nl: "Snelle package manager, workspaces", en: "Fast package manager, workspaces" },
        why: { nl: "3x sneller dan npm. Content-addressable store bespaart diskruimte. Native workspace support.", en: "3x faster than npm. Content-addressable store saves disk space. Native workspace support." },
      },
    ],
  },
];

/* ─── Stats ─── */
const STATS = [
  { v: "15", l: { nl: "DB tabellen", en: "DB tables" }, s: "Supabase Postgres", icon: <Database size={14} /> },
  { v: "10", l: { nl: "CMS schemas", en: "CMS schemas" }, s: "Sanity Studio", icon: <Layers size={14} /> },
  { v: "335", l: { nl: "Gemeenten", en: "Municipalities" }, s: "8KB gzipped", icon: <Globe size={14} /> },
  { v: "4.3s", l: { nl: "Build time", en: "Build time" }, s: "Turbopack", icon: <Zap size={14} /> },
  { v: "150", l: { nl: "Advocaten", en: "Lawyers" }, s: "30 steden", icon: <Shield size={14} /> },
  { v: "~89KB", l: { nl: "First load", en: "First load" }, s: "JS bundle", icon: <Rocket size={14} /> },
];

/* ─── Apps (admin URL hidden) ─── */
const APPS = [
  { name: "paywatch.app", label: { nl: "Landing & CMS", en: "Landing & CMS" }, tech: "Next.js 16 · Sanity · Tailwind", color: "var(--blue)", icon: <Globe size={16} /> },
  { name: "app.paywatch.app", label: { nl: "Gebruikers app (PWA)", en: "User app (PWA)" }, tech: "Next.js 14 · Supabase · Recharts", color: "var(--green)", icon: <Smartphone size={16} /> },
  { name: "Intern dashboard", label: { nl: "Admin dashboard", en: "Admin dashboard" }, tech: "Next.js 16 · Supabase · OAuth", color: "var(--purple)", icon: <Lock size={16} /> },
];

/* ─── Principles ─── */
const PRINCIPLES = [
  { icon: <Shield size={18} />, title: { nl: "Privacy first", en: "Privacy first" }, desc: { nl: "Row Level Security op elke tabel. Data in EU-West-1. GDPR by design.", en: "Row Level Security on every table. Data in EU-West-1. GDPR by design." } },
  { icon: <Zap size={18} />, title: { nl: "Free tier strategie", en: "Free tier strategy" }, desc: { nl: "Vercel, Supabase, Sanity — alles draait op gratis tiers tot 1000+ users.", en: "Vercel, Supabase, Sanity — everything runs on free tiers up to 1000+ users." } },
  { icon: <Eye size={18} />, title: { nl: "AI als copiloot", en: "AI as copilot" }, desc: { nl: "AI extraheert data maar de gebruiker bevestigt altijd. Geen black box over geld.", en: "AI extracts data but the user always confirms. No black box over money." } },
  { icon: <Smartphone size={18} />, title: { nl: "Mobile first", en: "Mobile first" }, desc: { nl: "Ontworpen voor 375px breed. Progressive enhancement. Touch targets 44px.", en: "Designed for 375px width. Progressive enhancement. Touch targets 44px." } },
];

/* ─── Dev tools ─── */
const TOOLS = [
  { name: "VS Code", icon: LOGO.vscode, type: "brand" as const },
  { name: "GitHub", icon: LOGO.github, type: "brand" as const },
  { name: "Sanity Studio", icon: LOGO.sanity, type: "brand" as const },
  { name: "Supabase Studio", icon: LOGO.supabase, type: "brand" as const },
  { name: "Vercel Dashboard", icon: LOGO.vercel, type: "brand" as const },
  { name: "Claude", icon: LOGO.anthropic, type: "brand" as const },
  { name: "Google Cloud", icon: LOGO.google, type: "brand" as const },
  { name: "Postman", type: "lucide" as const, lucide: <Plug size={14} /> },
  { name: "Terminal", type: "lucide" as const, lucide: <Code2 size={14} /> },
];

/* ─── Component ─── */
export default function TechStackPage() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const [expanded, setExpanded] = useState<string | null>(null);

  const t = {
    tag: "TECH STACK",
    title: isNl ? "Onder de motorkap" : "Under the hood",
    subtitle: isNl ? "Transparant over onze technologie. Gebouwd op open-source tools, ontworpen voor schaalbaarheid en privacy." : "Transparent about our technology. Built on open-source tools, designed for scalability and privacy.",
    arch: isNl ? "Architectuur" : "Architecture",
    flow: isNl ? "Data flow" : "Data flow",
    principles: isNl ? "Onze principes" : "Our principles",
    tools: isNl ? "Development tools" : "Development tools",
    readMore: isNl ? "Lees meer" : "Read more",
  };

  /* Data flow steps */
  const FLOW = [
    { step: "1", title: isNl ? "Email binnenkomst" : "Email arrives", desc: isNl ? "Gmail API haalt nieuwe emails op" : "Gmail API fetches new emails", icon: <Mail size={16} />, color: "var(--blue)" },
    { step: "2", title: isNl ? "AI classificatie" : "AI classification", desc: isNl ? "Gemini Flash: rekening of niet?" : "Gemini Flash: bill or not?", icon: <Brain size={16} />, color: "var(--amber)" },
    { step: "3", title: isNl ? "Data extractie" : "Data extraction", desc: isNl ? "Haiku: bedrag, IBAN, deadline" : "Haiku: amount, IBAN, deadline", icon: <Zap size={16} />, color: "var(--purple)" },
    { step: "4", title: isNl ? "Opslag + RLS" : "Storage + RLS", desc: isNl ? "Supabase Postgres met encryptie" : "Supabase Postgres with encryption", icon: <Shield size={16} />, color: "var(--green)" },
    { step: "5", title: isNl ? "Dashboard" : "Dashboard", desc: isNl ? "Realtime UI via React 19" : "Realtime UI via React 19", icon: <BarChart3 size={16} />, color: "var(--blue)" },
  ];

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">

        {/* ═══ HERO ═══ */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-[11px] font-bold text-[var(--blue)] bg-[var(--blue-light)] rounded px-3 py-1.5 tracking-widest mb-4">
            {t.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight mb-3">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* ═══ STATS ═══ */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-12 sm:mb-16">
          {STATS.map((s) => (
            <div key={s.v} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
              <div className="flex justify-center text-[var(--blue)] mb-1.5">{s.icon}</div>
              <p className="text-xl sm:text-2xl font-extrabold text-[var(--blue)] tracking-tight">{s.v}</p>
              <p className="text-[11px] font-semibold text-[var(--navy)] mt-1">{isNl ? s.l.nl : s.l.en}</p>
              <p className="text-[9px] text-[var(--muted)]">{s.s}</p>
            </div>
          ))}
        </div>

        {/* ═══ ARCHITECTURE ═══ */}
        <div className="rounded-2xl bg-[var(--navy)] p-5 sm:p-8 mb-12 sm:mb-16">
          <p className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-widest mb-5">{t.arch}</p>

          {/* 3 app cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {APPS.map((app) => (
              <div key={app.name} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2.5 mb-2" style={{ color: app.color }}>
                  {app.icon}
                  <span className="text-[13px] font-bold text-[#E2E8F0]">{isNl ? app.label.nl : app.label.en}</span>
                </div>
                <p className="text-[11px] text-[#64748B] font-mono mb-2">{app.name}</p>
                <span className="text-[9px] font-semibold rounded px-2 py-1" style={{ color: app.color, background: `color-mix(in srgb, ${app.color} 15%, transparent)` }}>
                  {app.tech}
                </span>
              </div>
            ))}
          </div>

          {/* Services row */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {[
              { name: "Supabase", icon: <Database size={10} /> },
              { name: "Gmail API", icon: <Mail size={10} /> },
              { name: "Gemini + Haiku", icon: <Brain size={10} /> },
              { name: "Sanity CMS", icon: <Layers size={10} /> },
              { name: "Resend", icon: <Mail size={10} /> },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center gap-1.5 text-[#475569]">
                {svc.icon}
                <span className="text-[10px]">{svc.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ DATA FLOW ═══ */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-lg font-bold text-[var(--navy)] mb-4">{t.flow}</h2>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
            {FLOW.map((step, i) => (
              <div key={step.step} className="flex-shrink-0 relative" style={{ width: 160, scrollSnapAlign: "start" }}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${step.color} 12%, var(--surface))`, color: step.color }}>
                      {step.icon}
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: step.color }}>
                      {isNl ? "Stap" : "Step"} {step.step}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[var(--navy)] mb-0.5">{step.title}</p>
                  <p className="text-[10px] text-[var(--muted)] leading-relaxed">{step.desc}</p>
                </div>
                {i < FLOW.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[var(--border)] text-sm z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ TECH CARDS ═══ */}
        {STACK.map((cat) => (
          <div key={cat.title.nl} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--blue)]">{cat.icon}</span>
              <h2 className="text-lg font-bold text-[var(--navy)]">{isNl ? cat.title.nl : cat.title.en}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cat.items.map((item) => {
                const key = `${cat.title.nl}-${item.name}`;
                const isOpen = expanded === key;

                return (
                  <div
                    key={key}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 cursor-pointer transition-colors hover:border-[var(--blue)]"
                    style={isOpen ? { borderColor: "var(--blue)" } : undefined}
                    onClick={() => setExpanded(isOpen ? null : key)}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center bg-[var(--bg)] dark:bg-white/10">
                        {item.iconType === "brand" && item.brandIcon ? (
                          <BrandIcon src={item.brandIcon} alt={item.name} size={22} />
                        ) : (
                          <span className="text-[var(--blue)]">{item.lucideIcon}</span>
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[var(--navy)]">{item.name}</p>
                          {item.url && (
                            <ExternalLink size={10} className="text-[var(--muted)] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--muted)] truncate">{isNl ? item.desc.nl : item.desc.en}</p>
                      </div>
                      {/* Chevron */}
                      <ChevronDown
                        size={14}
                        className="text-[var(--muted)] flex-shrink-0 transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                      />
                    </div>

                    {/* Expanded */}
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)]">
                        <p className="text-xs text-[var(--text)] leading-relaxed mb-3">
                          {isNl ? item.why.nl : item.why.en}
                        </p>
                        {item.snippet && (
                          <pre className="bg-[#0F172A] text-[#E2E8F0] rounded-lg p-3.5 text-[11px] leading-relaxed overflow-x-auto font-mono">
                            {item.snippet}
                          </pre>
                        )}
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-[var(--blue)] hover:underline">
                            {item.url.replace("https://", "")}
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ═══ PRINCIPLES ═══ */}
        <div className="rounded-2xl bg-[var(--blue-light)] p-5 sm:p-8 mb-12">
          <h2 className="text-lg font-bold text-[var(--navy)] mb-5">{t.principles}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.title.nl} className="flex gap-3">
                <div className="text-[var(--blue)] mt-0.5 flex-shrink-0">{p.icon}</div>
                <div>
                  <p className="text-sm font-bold text-[var(--navy)] mb-1">{isNl ? p.title.nl : p.title.en}</p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{isNl ? p.desc.nl : p.desc.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ DEV TOOLS ═══ */}
        <div>
          <h2 className="text-lg font-bold text-[var(--navy)] mb-4">{t.tools}</h2>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((tool) => (
              <span key={tool.name} className="inline-flex items-center gap-2 text-xs font-medium text-[var(--navy)] bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2">
                {tool.type === "brand" ? (
                  <BrandIcon src={tool.icon!} alt={tool.name} size={14} />
                ) : (
                  <span className="text-[var(--muted)]">{tool.lucide}</span>
                )}
                {tool.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
