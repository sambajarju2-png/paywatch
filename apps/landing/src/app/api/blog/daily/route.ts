import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || '';

const sanity = createClient({
  projectId: 'pwf6qbjc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

const CATEGORIES: Record<string, string> = {
  'schulden-incasso': '6cc622ef-5fdb-4cac-839c-db63e8ca3dc5',
  'besparen-budget': 'acd00829-63ec-47ed-869a-50157e82158b',
  'overheid-belasting': '8bf04c97-aa20-4d2f-aa3d-ede4d3a4d584',
  'juridisch': 'f890ccb1-b8b0-4955-b7ee-8b9f8a4a362c',
  'hulp-organisaties': '4ed54089-6f02-4132-a756-c689f2eead61',
  'nieuws-trends': 'a0e8a03a-3268-46bc-8266-e3e956f76b4e',
  'persoonlijk-verhalen': '55304196-fbb1-44dd-8912-fcc42e708a9f',
  'educatie': '74356885-8199-4528-a837-52e5cd5d7427',
};

// ─── Dutch News Fetcher ───────────────────────────────────────────
async function fetchDutchNews(): Promise<string> {
  if (!GNEWS_API_KEY) return 'No news API configured.';

  const queries = [
    'schulden Nederland',
    'incasso deurwaarder',
    'belastingdienst schuld',
    'huur energie kosten',
    'schuldhulpverlening gemeente',
  ];

  // Pick 2 random queries to stay within rate limits
  const shuffled = queries.sort(() => Math.random() - 0.5).slice(0, 2);
  const allHeadlines: string[] = [];

  for (const q of shuffled) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=nl&country=nl&max=5&apikey=${GNEWS_API_KEY}`
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.articles) {
        for (const article of data.articles) {
          allHeadlines.push(`- ${article.title} (${article.source.name}, ${article.publishedAt?.split('T')[0]})`);
        }
      }
    } catch {
      continue;
    }
  }

  if (allHeadlines.length === 0) return 'No recent Dutch finance news found.';
  return allHeadlines.slice(0, 10).join('\n');
}

// ─── Unsplash Image ───────────────────────────────────────────────
async function fetchUnsplashImage(query: string) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) return null;
    fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    }).catch(() => {});
    return {
      url: photo.urls.regular as string,
      photographer: photo.user.name as string,
      photographerUrl: photo.user.links.html as string,
      unsplashUrl: photo.links.html as string,
    };
  } catch {
    return null;
  }
}

// ─── Upload to Sanity ─────────────────────────────────────────────
async function uploadImageToSanity(imageUrl: string, filename: string) {
  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) return null;
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
    const asset = await sanity.assets.upload('image', imageBuffer, {
      filename: `${filename}.jpg`,
      contentType: 'image/jpeg',
    });
    return asset._id;
  } catch {
    return null;
  }
}

// ─── System Prompt ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the content engine for PayWatch (paywatch.app), a Dutch household bill tracking app based in Rotterdam. You write ONE high-quality blog post per week in Dutch, targeting SEO keywords around schulden, incasso, deurwaarders, besparen, and personal finance in the Netherlands.

IMPORTANT: You must respond with ONLY a valid JSON object. No markdown, no backticks, no explanation. Just the JSON.

The JSON must have this exact structure:
{
  "title_nl": "Dutch title (max 60 chars, include primary keyword, no em dashes)",
  "title_en": "English title",
  "slug": "url-friendly-slug-no-special-chars",
  "excerpt_nl": "Dutch excerpt 2-3 sentences, compelling, includes keyword",
  "excerpt_en": "English excerpt",
  "meta_nl": "SEO meta description Dutch (max 155 chars, action-oriented)",
  "meta_en": "English meta",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "readTime": "X min",
  "category": "one of: schulden-incasso, besparen-budget, overheid-belasting, juridisch, hulp-organisaties, nieuws-trends, persoonlijk-verhalen, educatie",
  "image_query": "2-3 English words for Unsplash image search",
  "body": [
    {"bold": true, "text": "Bold heading text"},
    {"bold": false, "text": "Paragraph text here with [Humanitas](https://www.humanitas.nl/) for help.", "links": [{"text": "Humanitas", "href": "https://www.humanitas.nl/"}]},
    {"bold": false, "text": "Check je [betaalfases](https://paywatch.app/features/betaalfases) in de app.", "links": [{"text": "betaalfases", "href": "https://paywatch.app/features/betaalfases"}]}
  ]
}

QUALITY STANDARDS (this is a weekly piece, not daily filler):
- 1500-2200 words in body. This must be a thorough, authoritative article.
- Write as a genuine expert, not a content mill. Show deep understanding of Dutch debt law and financial systems.
- Include specific data: CBS statistics, actual euro amounts from WIK law, real percentages.
- Name real organizations with correct details (phone numbers, websites, eligibility).
- Each claim should be verifiable. Cite sources where possible.
- Structure with clear H2-style bold headings (6-8 per article).
- Start with a strong hook that addresses a real pain point.
- End with 2-3 concrete action steps the reader can take today.
- Every article must answer a question someone would actually type into Google or ask ChatGPT.

LINKING RULES (critical for SEO):
Internal links (3-5 per article, to PayWatch pages):
  - Escalation/incasso/deurwaarder → https://paywatch.app/features/betaalfases
  - Payment plans/betalingsregeling → https://paywatch.app/features/betalingen
  - Buddy system → https://paywatch.app/features/buddy
  - Community → https://paywatch.app/features/community
  - Draft letters/bezwaar → https://paywatch.app/features/conceptbrieven
  - Support organizations → https://paywatch.app/features/hulpverleners
  - Email scanning → https://paywatch.app/features/email-scanner
  - Cash flow → https://paywatch.app/features/cashflow
  - Monthly budget → https://paywatch.app/features/maandbudget
  - FAQ/how it works → https://paywatch.app/support
  - Schuldhulp overview → https://paywatch.app/schuldhulp
  - PayWatch general → https://paywatch.app/

Internal links to EXISTING blog posts (1-3 per article, link to related posts):
{EXISTING_POSTS_FOR_LINKING}

External links (3-5 per article, to authoritative Dutch sources):
  - CBS/statistics → https://www.cbs.nl/
  - Rijksoverheid → https://www.rijksoverheid.nl/
  - Nibud → https://www.nibud.nl/
  - Juridisch Loket → https://www.juridischloket.nl/
  - NVVK → https://www.nvvk.nl/
  - Schuldhulpmaatje → https://www.schuldhulpmaatje.nl/
  - Humanitas → https://www.humanitas.nl/
  - Belastingdienst → https://www.belastingdienst.nl/
  - DUO → https://duo.nl/
  - CAK → https://www.hetcak.nl/
  - Justis Incasso Register → https://www.justis.nl/
  - Wetten.overheid.nl → https://wetten.overheid.nl/

WRITING RULES (CRITICAL for ranking and trust):
- Write in Dutch (nl), informal "je/jij" tone
- Write like a journalist at RTL Nieuws or NOS who also happens to understand debt law. Not like a content mill.
- Short paragraphs (2-4 sentences max)
- Bold subheadings every 2-3 paragraphs
- Mention PayWatch naturally 1-2 times (never forced, never as an ad)
- No bullet points, use flowing paragraphs
- No em dashes. Use commas or restructure the sentence.

ANTI-AI WRITING (Google and readers can smell AI content):
- NEVER start with "In de wereld van...", "Het is geen geheim dat...", "Stel je voor...", "Heb je je ooit afgevraagd..."
- NEVER use: "Het is belangrijk om...", "Laten we eens kijken naar...", "Het goede nieuws is..."
- NEVER use corporate-speak: "daarnaast", "bovendien", "desalniettemin", "het is essentieel"
- NEVER summarize what you just wrote ("Kortom, we hebben gezien dat...")
- DO start with a specific situation, fact, or number. Example: "Een rekening van 45 euro bij Ziggo. Vergeten. Drie maanden later: 280 euro incassokosten."
- DO use real Dutch colloquial language: "Dat schiet lekker op", "Daar trap je niet in", "Dat is het hem nou net"
- DO vary sentence length dramatically. Mix 5-word punches with longer explanatory sentences.
- DO include at least one concrete example with real euro amounts, real organization names, and real timelines
- DO reference actual Dutch laws by name when relevant (WIK, Wsnp, BW art. 6:96)
- DO use the GNews headlines below for timely context and current relevance

USE GNEWS HEADLINES: When relevant news appears below, weave it into the article naturally. Reference the news source by name (e.g., "zoals RTL Nieuws afgelopen week berichtte"). This makes the article timely and trustworthy.

TOPIC SELECTION:
Pick a specific, searchable topic that Dutch people actually Google. Think about what someone in debt stress would type at 11pm. Examples of GOOD topics:
- "Wat gebeurt er als je je zorgverzekering niet betaalt?"
- "Hoeveel mag een deurwaarder in rekening brengen?"
- "Betalingsregeling CJIB aanvragen, hoe werkt dat?"

Examples of BAD topics (too generic):
- "Tips voor beter budgetteren"
- "Het belang van financieel bewustzijn"

RECENT DUTCH NEWS HEADLINES (use for inspiration):
{NEWS_HEADLINES}

EXISTING POSTS (avoid duplicates, but link to related ones):
{EXISTING_SLUGS}

TODAY'S DATE: {TODAY}

Write a high-quality weekly blog post. Pick a topic you haven't covered yet that real Dutch people search for.`;



// ─── Body Builder (with link support) ─────────────────────────────
function buildPortableTextBody(
  bodyData: { bold: boolean; text: string; links?: { text: string; href: string }[] }[]
) {
  return bodyData.map((block, blockIdx) => {
    const markDefs: { _key: string; _type: string; href: string }[] = [];
    const links = block.links || [];

    if (links.length === 0) {
      // No links — simple block (strip any leftover markdown link syntax)
      return {
        _key: `block_${blockIdx}`,
        _type: 'block' as const,
        style: 'normal' as const,
        markDefs: [] as never[],
        children: [{
          _key: `span_${blockIdx}_0`,
          _type: 'span' as const,
          marks: block.bold ? ['strong'] : ([] as string[]),
          text: block.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
        }],
      };
    }

    // Has links — split text into spans with markDefs
    const linkMap: { text: string; href: string; markKey: string }[] = [];

    links.forEach((link, linkIdx) => {
      const markKey = `link_${blockIdx}_${linkIdx}`;
      markDefs.push({ _key: markKey, _type: 'link', href: link.href });
      linkMap.push({ text: link.text, href: link.href, markKey });
    });

    // Remove markdown syntax from text
    let plainText = block.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Split text by link texts and create spans
    const children: { _key: string; _type: string; marks: string[]; text: string }[] = [];
    let remaining = plainText;
    let spanIdx = 0;

    for (const lm of linkMap) {
      const idx = remaining.indexOf(lm.text);
      if (idx === -1) continue; // link text not found, skip

      // Text before the link
      if (idx > 0) {
        children.push({
          _key: `span_${blockIdx}_${spanIdx++}`,
          _type: 'span',
          marks: block.bold ? ['strong'] : [],
          text: remaining.substring(0, idx),
        });
      }

      // The link itself
      children.push({
        _key: `span_${blockIdx}_${spanIdx++}`,
        _type: 'span',
        marks: block.bold ? ['strong', lm.markKey] : [lm.markKey],
        text: lm.text,
      });

      remaining = remaining.substring(idx + lm.text.length);
    }

    // Remaining text after last link
    if (remaining) {
      children.push({
        _key: `span_${blockIdx}_${spanIdx++}`,
        _type: 'span',
        marks: block.bold ? ['strong'] : [],
        text: remaining,
      });
    }

    // Fallback if no children were created
    if (children.length === 0) {
      children.push({
        _key: `span_${blockIdx}_0`,
        _type: 'span',
        marks: block.bold ? ['strong'] : [],
        text: plainText,
      });
    }

    return {
      _key: `block_${blockIdx}`,
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs,
      children,
    };
  });
}

// ─── Main Handler ─────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing posts to avoid duplicates + for internal linking
    const existingPosts = await sanity.fetch(
      `*[_type == "blogPost"] | order(publishedAt desc) {"slug": slug.current, "title": title.nl, "category": category->slug.current}`
    );
    const existingSlugs = existingPosts
      .map((p: { slug: string; title: string }) => `- ${p.slug} (${p.title})`)
      .join('\n');

    // Build linkable posts list (last 20 posts with URLs for AI to reference)
    const linkablePosts = existingPosts
      .slice(0, 20)
      .map((p: { slug: string; title: string; category: string }) =>
        `- "${p.title}" → https://paywatch.app/blog/${p.slug}`
      )
      .join('\n');

    // Fetch Dutch news
    const newsHeadlines = await fetchDutchNews();

    // Date info
    const today = new Date().toISOString().split('T')[0];

    // Build prompt
    const prompt = SYSTEM_PROMPT
      .replace('{EXISTING_SLUGS}', existingSlugs)
      .replace('{EXISTING_POSTS_FOR_LINKING}', linkablePosts || 'No existing posts yet.')
      .replace('{NEWS_HEADLINES}', newsHeadlines)
      .replace('{TODAY}', today);

    // Call Claude
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{ role: 'user', content: 'Write this week\'s blog post. This is a weekly publication so make it thorough, well-researched, and authoritative. Respond with ONLY the JSON object, nothing else.' }],
        system: prompt,
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return NextResponse.json({ error: 'Anthropic API failed', details: err }, { status: 500 });
    }

    const anthropicData = await anthropicRes.json();
    const rawText = anthropicData.content?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let blogData: {
      title_nl: string;
      title_en: string;
      slug: string;
      excerpt_nl: string;
      excerpt_en: string;
      meta_nl: string;
      meta_en: string;
      keywords: string[];
      readTime: string;
      category: string;
      image_query?: string;
      body: { bold: boolean; text: string; links?: { text: string; href: string }[] }[];
    };

    try {
      blogData = JSON.parse(cleanJson);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: cleanJson.substring(0, 500) }, { status: 500 });
    }

    // Fetch Unsplash image
    let mainImage: {
      _type: string;
      asset: { _type: string; _ref: string };
      attribution: { photographer: string; photographerUrl: string; source: string; sourceUrl: string };
    } | undefined;

    const imageQuery = blogData.image_query || blogData.title_en || 'personal finance';
    const unsplashImage = await fetchUnsplashImage(imageQuery);

    if (unsplashImage) {
      const assetId = await uploadImageToSanity(unsplashImage.url, blogData.slug);
      if (assetId) {
        mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          attribution: {
            photographer: unsplashImage.photographer,
            photographerUrl: unsplashImage.photographerUrl,
            source: 'Unsplash',
            sourceUrl: unsplashImage.unsplashUrl,
          },
        };
      }
    }

    // Build body with link support
    const body = buildPortableTextBody(blogData.body);

    const categoryRef = CATEGORIES[blogData.category] || CATEGORIES['educatie'];

    // Create in Sanity
    const doc = await sanity.create({
      _type: 'blogPost',
      title: { nl: blogData.title_nl, en: blogData.title_en },
      slug: { _type: 'slug', current: blogData.slug },
      excerpt: { nl: blogData.excerpt_nl, en: blogData.excerpt_en },
      metaDescription: { nl: blogData.meta_nl, en: blogData.meta_en },
      keywords: blogData.keywords,
      author: { name: 'Samba' },
      publishedAt: new Date().toISOString(),
      readTime: blogData.readTime,
      category: { _ref: categoryRef, _type: 'reference' },
      body,
      ...(mainImage ? { mainImage } : {}),
    });

    // Publish
    const publishId = doc._id.replace('drafts.', '');
    await sanity.mutate([{ createOrReplace: { ...doc, _id: publishId } }]);
    try { if (doc._id.startsWith('drafts.')) await sanity.delete(doc._id); } catch { /* ok */ }

    // Ping search engines for faster indexing
    const blogUrl = `https://paywatch.app/blog/${blogData.slug}`;
    const sitemapUrl = 'https://paywatch.app/sitemap.xml';
    try {
      // Google sitemap ping
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`).catch(() => {});
      // Bing/IndexNow ping
      await fetch(`https://www.bing.com/indexnow?url=${encodeURIComponent(blogUrl)}&key=paywatch`).catch(() => {});
      console.log(`[Blog] Pinged search engines for ${blogUrl}`);
    } catch { /* non-critical */ }

    // Count links in generated post
    const linkCount = blogData.body.reduce((acc, b) => acc + (b.links?.length || 0), 0);
    const internalLinks = blogData.body.reduce((acc, b) => acc + (b.links?.filter(l => l.href.includes('paywatch.app'))?.length || 0), 0);
    const externalLinks = linkCount - internalLinks;

    return NextResponse.json({
      success: true,
      title: blogData.title_nl,
      slug: blogData.slug,
      category: blogData.category,
      links: { total: linkCount, internal: internalLinks, external: externalLinks },
      newsUsed: newsHeadlines !== 'No news API configured.' && newsHeadlines !== 'No recent Dutch finance news found.',
      image: unsplashImage ? { photographer: unsplashImage.photographer, source: unsplashImage.unsplashUrl } : null,
      url: blogUrl,
      indexed: true,
    });
  } catch (error) {
    console.error('Weekly blog error:', error);
    return NextResponse.json({ error: 'Internal error', details: String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const fakeRequest = new Request(request.url, {
    method: 'POST',
    headers: { authorization: `Bearer ${CRON_SECRET}` },
  });
  return POST(fakeRequest);
}
