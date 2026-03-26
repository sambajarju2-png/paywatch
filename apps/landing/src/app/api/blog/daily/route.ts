import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

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

const SYSTEM_PROMPT = `You are the autonomous content engine for PayWatch (paywatch.app), a Dutch household bill tracking app. You write ONE blog post per day in Dutch, targeting SEO keywords around schulden, incasso, deurwaarders, besparen, and personal finance in the Netherlands.

IMPORTANT: You must respond with ONLY a valid JSON object. No markdown, no backticks, no explanation. Just the JSON.

The JSON must have this exact structure:
{
  "title_nl": "Dutch title (max 60 chars, include primary keyword)",
  "title_en": "English title",
  "slug": "url-friendly-slug-no-special-chars",
  "excerpt_nl": "Dutch excerpt 1-2 sentences",
  "excerpt_en": "English excerpt",
  "meta_nl": "SEO meta description Dutch (max 155 chars)",
  "meta_en": "English meta",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "readTime": "X min",
  "category": "one of: schulden-incasso, besparen-budget, overheid-belasting, juridisch, hulp-organisaties, nieuws-trends, persoonlijk-verhalen",
  "image_query": "2-3 English words for Unsplash image search",
  "body": [
    {"bold": true, "text": "Bold heading text"},
    {"bold": false, "text": "Paragraph text here..."}
  ]
}

WRITING RULES:
- Write in Dutch (nl), informal "je/jij" tone
- Write like a knowledgeable friend, not a professor
- Short paragraphs (2-4 sentences)
- Bold subheadings every 2-3 paragraphs
- Include specific amounts, organizations, phone numbers, websites
- Mention PayWatch 1-2 times naturally (not forced)
- 600-1000 words in body
- Start with a hook, not a generic intro
- End with a concrete action step
- No bullet points — use flowing paragraphs
- Don't sound like AI

TOPIC ROTATION (based on day of week):
- Monday: Schulden & Incasso
- Tuesday: Overheid & Belasting
- Wednesday: Besparen & Budget
- Thursday: Juridisch
- Friday: Nieuws & Trends
- Saturday: Hulp & Organisaties
- Sunday: Persoonlijk & Verhalen

EXISTING POSTS (avoid duplicates):
{EXISTING_SLUGS}

TODAY'S DATE: {TODAY}
DAY OF WEEK: {DAY_OF_WEEK}

Write a blog post following the rotation schedule. Pick a specific, searchable topic that Dutch people actually Google.`;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPosts = await sanity.fetch(
      `*[_type == "blogPost"]{"slug": slug.current, "title": title.nl}`
    );
    const existingSlugs = existingPosts
      .map((p: { slug: string; title: string }) => `- ${p.slug} (${p.title})`)
      .join('\n');

    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = now.toISOString().split('T')[0];
    const dayOfWeek = days[now.getUTCDay()];

    const prompt = SYSTEM_PROMPT
      .replace('{EXISTING_SLUGS}', existingSlugs)
      .replace('{TODAY}', today)
      .replace('{DAY_OF_WEEK}', dayOfWeek);

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: 'Write today\'s blog post. Respond with ONLY the JSON object, nothing else.' }],
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
      body: { bold: boolean; text: string }[];
    };

    try {
      blogData = JSON.parse(cleanJson);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: cleanJson.substring(0, 500) }, { status: 500 });
    }

    // Fetch header image from Unsplash
    let mainImage: { _type: string; asset: { _type: string; _ref: string }; attribution: { photographer: string; photographerUrl: string; source: string; sourceUrl: string } } | undefined;
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

    // Build Portable Text body
    const body = blogData.body.map((block, i) => ({
      _key: `block_${i}`,
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [] as never[],
      children: [{
        _key: `span_${i}`,
        _type: 'span' as const,
        marks: block.bold ? ['strong'] : ([] as string[]),
        text: block.text,
      }],
    }));

    const categoryRef = CATEGORIES[blogData.category] || CATEGORIES['educatie'];

    // Create document in Sanity — include mainImage in the initial object
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

    // Publish the document
    const publishId = doc._id.replace('drafts.', '');
    await sanity.mutate([
      { createOrReplace: { ...doc, _id: publishId } },
    ]);

    // Delete draft
    try {
      if (doc._id.startsWith('drafts.')) {
        await sanity.delete(doc._id);
      }
    } catch {
      // not critical
    }

    return NextResponse.json({
      success: true,
      title: blogData.title_nl,
      slug: blogData.slug,
      category: blogData.category,
      image: unsplashImage ? { photographer: unsplashImage.photographer, source: unsplashImage.unsplashUrl } : null,
      url: `https://www.paywatch.app/blog/${blogData.slug}`,
    });
  } catch (error) {
    console.error('Daily blog error:', error);
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
