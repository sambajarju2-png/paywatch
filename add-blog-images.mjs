// Run this once: node add-blog-images.mjs
// Requires: UNSPLASH_ACCESS_KEY and SANITY_WRITE_TOKEN in .env or as env vars

import { createClient } from '@sanity/client';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_KEY_HERE';
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN || 'YOUR_SANITY_TOKEN_HERE';

const sanity = createClient({
  projectId: 'pwf6qbjc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Map of post slugs to relevant Unsplash search queries
const IMAGE_QUERIES = {
  'kopen-op-afbetaling-wanneer-slim-wanneer-ruine': 'online shopping credit card',
  'waterschap-gemeentebelasting-niet-betaald-gevolgen': 'dutch government letter',
  'bkr-registratie-wat-het-is-en-wanneer-het-verdwijnt': 'credit score report',
  'verschil-incassobureau-en-deurwaarder': 'official letter envelope',
  'schulden-en-stress-waarom-je-hoofd-vol-zit': 'person stress worried',
  'huurachterstand-wat-nu-rechten-en-opties': 'apartment building netherlands',
  'alimentatie-niet-betaald-gevolgen': 'family finance discussion',
  'sociale-lening-kredietbank-goedkoop-lenen': 'bank loan handshake',
  'verjaring-van-schulden-wanneer-hoef-je-niet-meer-te-betalen': 'hourglass time passing',
  'schuldsanering-wsnp-laatste-vangnet': 'fresh start new beginning',
  'wat-is-een-dwangbevel-wat-moet-je-doen': 'official government document',
  'vaste-lasten-te-hoog-10-manieren-besparen': 'household bills calculator',
  'energierekening-te-hoog-7-dingen-vandaag': 'energy meter electricity',
  'betalingsregeling-treffen-zo-pak-je-het-aan': 'phone call business negotiation',
  'gratis-hulp-schulden-welke-past-bij-jou': 'helping hand support',
  'cjib-boete-ontvangen-dit-moet-je-weten': 'traffic fine parking ticket',
  'administratie-op-orde-in-30-minuten': 'organized desk paperwork',
  'beschermingsbewind-wanneer-iemand-anders-je-geld-beheert': 'financial advisor meeting',
  'vroegsignalering-schulden-gemeente-hulp': 'early warning prevention',
  'toeslagen-2026-waar-heb-je-recht-op': 'government benefits money',
  'belastingschuld-belastingdienst-betalingsregeling': 'tax forms documents',
  'zorgverzekering-niet-betaald-dit-gebeurt-er': 'health insurance card',
  'schulden-erven-wat-als-familielid-overlijdt-met-schulden': 'inheritance family',
  'belastingaangifte-2026-vergeten-aftrekposten': 'tax return filing',
  'schuldhulpverlening-aanvragen-zo-werkt-het': 'counseling support meeting',
  'hoe-los-je-schulden-af-5-strategieen': 'debt free celebration',
  'spaargeld-opbouwen-laag-inkomen': 'piggy bank saving coins',
  'scheiden-en-schulden-wie-betaalt-wat': 'divorce separation',
  'deurwaarder-aan-de-deur-wat-mag-wel-en-niet': 'front door doorbell',
  'dagvaarding-ontvangen-dit-moet-je-doen': 'court justice law',
  'budgetteren-als-je-het-nooit-hebt-geleerd': 'budget planning notebook',
  'wet-kwaliteit-incassodienstverlening-wki-2026': 'dutch law parliament',
  'incasso-aanvechten-dit-zijn-je-rechten': 'dispute letter writing',
  'beslagvrije-voet-2026-hoeveel-mag-je-houden': 'salary paycheck money',
  'telefoonabonnement-schuld-hoe-het-escaleert': 'smartphone contract',
  'duo-studieschuld-aflossen-alles-wat-je-moet-weten': 'university graduation student',
  'bijzondere-bijstand-gratis-geld-gemeente': 'municipality city hall',
  'afgesloten-gas-stroom-rechten-voorkomen': 'electric meter gas',
};

async function searchUnsplash(query) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
  );
  if (!res.ok) { console.error(`Unsplash error: ${res.status}`); return null; }
  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) return null;
  // Trigger download (Unsplash API requirement)
  fetch(photo.links.download_location, { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }).catch(() => {});
  return { url: photo.urls.regular, photographer: photo.user.name, photographerUrl: photo.user.links.html, unsplashUrl: photo.links.html };
}

async function uploadToSanity(imageUrl, filename) {
  const res = await fetch(imageUrl);
  if (!res.ok) return null;
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await sanity.assets.upload('image', buffer, { filename: `${filename}.jpg`, contentType: 'image/jpeg' });
  return asset._id;
}

async function main() {
  // Get all posts without images
  const posts = await sanity.fetch(`*[_type == "blogPost" && !defined(mainImage)]{_id, "slug": slug.current, "title": title.nl}`);
  console.log(`Found ${posts.length} posts without images\n`);

  let success = 0;
  let failed = 0;

  for (const post of posts) {
    const query = IMAGE_QUERIES[post.slug] || 'personal finance netherlands';
    console.log(`[${success + failed + 1}/${posts.length}] ${post.title}`);
    console.log(`  Searching Unsplash: "${query}"`);

    try {
      const image = await searchUnsplash(query);
      if (!image) { console.log('  ⚠ No image found, skipping'); failed++; continue; }

      console.log(`  📸 Found: ${image.photographer}`);
      const assetId = await uploadToSanity(image.url, post.slug);
      if (!assetId) { console.log('  ⚠ Upload failed, skipping'); failed++; continue; }

      // Patch the document
      await sanity.patch(post._id).set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          attribution: {
            photographer: image.photographer,
            photographerUrl: image.photographerUrl,
            source: 'Unsplash',
            sourceUrl: image.unsplashUrl,
          },
        },
      }).commit();

      console.log(`  ✅ Done!\n`);
      success++;

      // Rate limit: wait 1.5s between requests to stay within Unsplash limits
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n=== COMPLETE ===`);
  console.log(`✅ ${success} posts updated with images`);
  console.log(`⚠ ${failed} posts skipped/failed`);
}

main().catch(console.error);
