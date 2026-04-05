# HANDOVER: PayWatch B2B Personalization & Outreach System
**Date:** April 6, 2026
**Session scope:** City SEO pages, B2B personalized landing pages, engagement tracking, email warmup

---

## WHAT WAS BUILT

### 1. Schuldhulp City SEO Pages (LIVE)
- **15 city-specific pages** at `paywatch.app/schuldhulp/[city]`
- Cities: Rotterdam, Amsterdam, Den Haag, Utrecht, Eindhoven, Groningen, Tilburg, Almere, Breda, Nijmegen, Arnhem, Haarlem, Enschede, Zaanstad, Amersfoort
- **Files:**
  - `apps/landing/src/lib/city-pages.ts` — All city data (content, orgs, FAQ, tips, debtPercentage, logoDomain)
  - `apps/landing/src/app/schuldhulp/[city]/page.tsx` — Dynamic route with SSR metadata
  - `apps/landing/src/components/CityPage.tsx` — Client component (tabs, hero, stats, orgs, FAQ, tips)
  - `apps/landing/src/app/schuldhulp/page.tsx` — Index page with Apple-style cards
- **Features per city:** municipality logo (logo.dev), comparison bar chart (city vs national 8.6% CBS), branded diagonal stripes, 4 tabs (Overzicht/Hulp/FAQ/Tips), FAQ accordion, org cards with H3 headings, numbered tip cards with per-tip URLs
- **Structured data:** FAQPage, BreadcrumbList, Article, Organization JSON-LD schemas
- **URL corrections verified:** Amsterdam (Kredietbank, Grip op Geld, Stadspas, zorgverzekering, Juridisch Loket), Rotterdam (Kredietbank, Humanitas, Rotterdampas, energietoeslag, voedselbank, kwijtschelding), Den Haag (Kredietbank, wijkteams, Ooievaarspas, budgetcoaching, kindpakket, belastingaangifte)
- **All other cities:** guessed URLs changed to root domains (e.g., haarlem.nl/ not haarlem.nl/schulden)

### 2. B2B Personalized Landing Pages (LIVE)
**4 routes for different audience segments:**

| Route | Audience | Example URL |
|-------|----------|-------------|
| `/gemeente-contact` | Gemeentes | `paywatch.app/gemeente-contact?company=amsterdam.nl` |
| `/incasso-contact` | Incasso bureaus | `paywatch.app/incasso-contact?company=intrum.nl` |
| `/hulporg-contact` | Hulporganisaties | `paywatch.app/hulporg-contact?company=nvvk.nl` |
| `/zakelijk-contact` | Vendors/bedrijven | `paywatch.app/zakelijk-contact?company=eneco.nl` |

**Architecture:**
```
Browser → POST /api/personalize { company, audience }
                ↓
    1. Fetch logo from Logo.dev CDN
    2. Extract brand colors via Color Thief (getPalette)
    3. colorSaturation() picks most vibrant color (skips grays)
    4. Claude Haiku generates Dutch headline + tagline
                ↓
    Response: { companyName, primaryColor, secondaryColor, greeting, tagline, logo }
```

**Files:**
- `apps/landing/src/app/api/personalize/route.ts` — Personalization API
- `apps/landing/src/components/personalized/PersonalizedBanner.tsx` — Branded banner (company colors as gradient bg, full-page loader, localStorage memory)
- `apps/landing/src/components/personalized/PersonalizedOutreachPage.tsx` — Unified page component (stats, value props, journey, contact form)
- `apps/landing/src/components/personalized/PartnerContactForm.tsx` — Contact form (saves to Supabase, triggers thank-you email)
- `apps/landing/src/components/personalized/useEngagement.ts` — Engagement tracking hook
- `apps/landing/src/app/api/partner-contact/route.ts` — Form submission API (Supabase + Resend emails)
- `apps/landing/src/app/api/track-engagement/route.ts` — Engagement tracking API
- `apps/landing/src/app/gemeente-contact/page.tsx` — Route with SEO metadata
- `apps/landing/src/app/incasso-contact/page.tsx`
- `apps/landing/src/app/hulporg-contact/page.tsx`
- `apps/landing/src/app/zakelijk-contact/page.tsx`

**Key design decisions:**
- Banner: company brand color IS the gradient background (built via `buildGradient()`)
- Smart color selection: `colorSaturation()` ranks colors, skips grays/blacks/whites
- Light colors (yellow): blended with navy for white text readability
- Full-page loading overlay: covers everything at z-100, shows "We bereiden uw pagina voor"
- localStorage memory: company data cached per audience, persists on refresh/URL removal
- Haiku prompt generates punchy 5-10 word headlines, no AI slop

**Engagement system:**
- `useEngagement` hook tracks: time on page, scroll depth (%), CTA clicks
- Uses `sendBeacon` on page unload for reliable delivery
- Visit count per audience in localStorage
- Return visitor detection:
  - First visit → "Plan een kennismaking" CTA
  - Return visit (no form) → "Toch even kennismaken?" + blue nudge bar
  - Already submitted → "Welkom terug, Jan 👋" + green confirmation

### 3. Contact Form System (LIVE)
- **ONE confirmation email only** — no email flows, no drip sequences
- Form POSTs to `/api/partner-contact`
- Saves to Supabase table `b2b_contact_submissions`
- Sends branded thank-you email via Resend (from `noreply@paywatch.app`, reply-to `business@paywatch.nl`)
- Sends team notification to samba@paywatch.nl + mariama@paywatch.nl
- After submission: `markFormSubmitted()` saves visitor name in localStorage

**Thank-you email structure:**
- Header: company brand color background, PayWatch logo × Company logo
- Body: "Bedankt [firstName]" + audience-specific next steps
- Footer: PayWatch branding + link

### 4. Consumer PWA — Register Page (LIVE)
- Terms & privacy checkbox on signup page
- Dutch: "Ik ga akkoord met de algemene voorwaarden en het privacybeleid"
- Blocks registration if unchecked
- File: `sambafinance1/src/app/auth/auth-form.tsx`

### 5. Email Warmup (LIVE)
- DIY warmup cron: `apps/admin/src/app/api/admin/outreach/warmup/cron/route.ts`
- Only warms: samba@, info@, mariama@ on paywatch.nl
- 12 natural Dutch templates, conservative schedule (3→12/day over 5 weeks)
- Vercel cron: 5x daily (07:00, 09:00, 11:00, 13:00, 15:00 UTC)
- **MailFlow** also set up as external warmup tool (free tier)

---

## PENDING / TODO

### HIGH PRIORITY

1. **Admin dashboard page for B2B leads** — No admin UI exists yet to view `b2b_contact_submissions`. Need a page at `admin.paywatch.app/outreach/leads` showing:
   - List of all submissions with filters (audience, status, date)
   - Status updates (new → contacted → meeting → closed)
   - Engagement data from `b2b_page_engagement` alongside each lead
   - Click to view details (company, message, brand color, time on page, scroll depth)

2. **Fix logo URL in thank-you email** — Currently references `https://paywatch.app/icon-192.png` but this file does NOT exist. The actual file is `android-chrome-192x192.png`. Options:
   - Create a copy: `cp public/android-chrome-192x192.png public/icon-192.png`
   - Or update the email template to use the correct filename
   - Or upload a proper email-optimized logo (see logo recommendations below)

3. **Fix admin build** — The `syncFromClickUp` function was never successfully inserted in a prior session. Admin build may be broken. Verify before starting next session with: `cd apps/admin && npx tsc --noEmit`

### MEDIUM PRIORITY

4. **Verify remaining 12 city URLs** — Only Amsterdam/Rotterdam/Den Haag have verified org + tip URLs. The other 12 cities use root domain URLs which are safe but not deep-linked to specific pages.

5. **Google Search Console** — Set up GSC for paywatch.app, submit sitemap, monitor indexation of all new pages (15 schuldhulp + 4 B2B).

6. **Bot spam in Resend contacts** — Random gibberish names (kczmopliShpsLwyf) coming through contact_form source. Honeypot field exists but bots may be bypassing it. Add rate limiting or server-side validation.

7. **CASA Tier 2 security audit** — Remaining items: landing rate limiting/CORS fix, consumer app complete account deletion across 26 tables.

### NICE TO HAVE

8. **Scale to 335 gemeenten** — Programmatic city pages using CBS data per gemeente.
9. **Social proof sections** — "Vergelijkbare organisaties die PayWatch gebruiken" (only when real customers exist).
10. **B2B personalized email follow-up** — Day 3 case study, Day 7 gentle nudge (only if requested later).

---

## SUPABASE TABLES CREATED THIS SESSION

### b2b_contact_submissions
```sql
-- Form submissions from B2B landing pages
id UUID PRIMARY KEY
first_name TEXT NOT NULL
last_name TEXT NOT NULL
email TEXT NOT NULL
message TEXT
company_name TEXT
company_domain TEXT
audience TEXT NOT NULL CHECK (IN 'gemeente','incasso','hulporg','zakelijk')
brand_color TEXT
logo_url TEXT
status TEXT DEFAULT 'new' CHECK (IN 'new','contacted','meeting','closed')
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### b2b_page_engagement
```sql
-- Engagement tracking from B2B pages
id UUID PRIMARY KEY
session_id TEXT NOT NULL (UNIQUE for upsert)
company_domain TEXT
company_name TEXT
audience TEXT NOT NULL
time_on_page_seconds INTEGER DEFAULT 0
max_scroll_depth INTEGER DEFAULT 0
clicked_cta BOOLEAN DEFAULT false
submitted_form BOOLEAN DEFAULT false
visit_count INTEGER DEFAULT 1
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

## ENVIRONMENT VARIABLES

### Landing site (paywatch.app) — Vercel project prj_UZYlhUm7GL16cWuzQcyRGYwZWXXe
| Variable | Status | Used by |
|----------|--------|---------|
| ANTHROPIC_API_KEY | SET | /api/personalize (Claude Haiku) |
| LOGO_DEV_TOKEN | SET | /api/personalize (Logo.dev) |
| RESEND_API_KEY | Already existed | /api/partner-contact (thank-you email) |
| NEXT_PUBLIC_SUPABASE_URL | Already existed | /api/partner-contact, /api/track-engagement |
| SUPABASE_SERVICE_ROLE_KEY | Already existed | /api/partner-contact, /api/track-engagement |

---

## LOGO RECOMMENDATIONS

### What's needed:

1. **Email logo** (for Resend thank-you emails)
   - **Dimensions:** 200×50px (horizontal wordmark) or 56×56px (icon only)
   - **Format:** PNG with transparent background
   - **Upload to:** `apps/landing/public/email-logo.png`
   - **Then reference in email as:** `https://paywatch.app/email-logo.png`
   - Current email uses `icon-192.png` which doesn't exist (actual file is `android-chrome-192x192.png`)

2. **Website logo/wordmark** (for header, footer, og-image)
   - **Header logo:** Already text-based ("PayWatch" in code), no image needed unless you want one
   - If image: SVG preferred, or PNG at 200×40px for retina
   - **Upload to:** `apps/landing/public/logo.svg` or `logo.png`

3. **Social/OG logo** (for link previews)
   - **og-image.png:** 1200×630px — already exists
   - Update if you want a fresher design

### What already exists in `apps/landing/public/`:
- `favicon.ico` — browser tab icon
- `favicon.svg` — SVG favicon
- `favicon-16x16.png` — 16px
- `favicon-32x32.png` — 32px
- `apple-touch-icon.png` — 180×180px
- `android-chrome-192x192.png` — 192px (PWA icon)
- `android-chrome-512x512.png` — 512px (PWA icon)
- `og-image.png` — 1200×630px (social sharing)

### Quick fix for email logo:
In the next session, either:
- Copy: `cp public/android-chrome-192x192.png public/icon-192.png`
- Or upload your own email logo and update the path in `src/app/api/partner-contact/route.ts` line with `paywatch.app/icon-192.png`

---

## API ENDPOINTS CREATED

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/personalize` | POST | Logo + colors + AI greeting |
| `/api/partner-contact` | POST | Save form + send thank-you email |
| `/api/track-engagement` | POST | Save page engagement data |
| `/api/admin/outreach/warmup/cron` | GET | Warmup email automation |

---

## KEY FILES REFERENCE

### Landing site (apps/landing)
```
src/lib/city-pages.ts          — All 15 city data
src/components/CityPage.tsx     — City page component
src/app/schuldhulp/[city]/page.tsx — City route
src/app/schuldhulp/page.tsx     — City index

src/components/personalized/
  PersonalizedBanner.tsx         — Brand gradient banner + loading overlay
  PersonalizedOutreachPage.tsx   — Unified page (stats, journey, form)
  PartnerContactForm.tsx         — Contact form
  useEngagement.ts               — Tracking hook + localStorage helpers

src/app/api/personalize/route.ts      — Color Thief + Haiku
src/app/api/partner-contact/route.ts  — Form submit + email
src/app/api/track-engagement/route.ts — Engagement tracking

src/app/gemeente-contact/page.tsx     — Route wrapper
src/app/incasso-contact/page.tsx
src/app/hulporg-contact/page.tsx
src/app/zakelijk-contact/page.tsx

src/app/sitemap.ts              — Dynamic sitemap (includes all pages)
src/components/Footer.tsx       — Steden column + social icons
```

### Admin (apps/admin)
```
src/app/api/admin/outreach/warmup/cron/route.ts  — Warmup automation
vercel.json                                        — Cron schedules
```

### Consumer PWA (sambafinance1)
```
src/app/auth/auth-form.tsx      — Terms checkbox
src/messages/nl.json            — NL translations (agreeTerms, etc.)
src/messages/en.json            — EN translations
```

---

## COMMITS THIS SESSION (chronological)

1. `f6fb1f6` — Initial 5 city pages
2. `3748f8a` — Dark mode fix + Apple cards + 10 cities
3. `a25e04c` — Municipality logos + footer steden + socials
4. `3838e7a` — Gemeente URL fixes + hero stats cards
5. `d88a7ba` — Warmup automation cron
6. `c197e36` — LOKAAL GEGEVEN → Data over [city], warmup 3 accounts only
7. `b8908c6` — Comparison chart, branded stripes, actionable tips
8. `4cbc352` — Verified URLs Amsterdam/Rotterdam/Den Haag + national bar fix
9. `186be45` (sambafinance1) — Terms checkbox register page
10. `33f81c2` — B2B personalized landing pages (initial)
11. `ad6b265` — Personalization rewrite + zakelijk + contact form
12. `ba6db42` — v3: brand color tint, full-page loader, journey
13. `8068358` — v4: company colors ARE the background
14. `edccbe9` — Smart color selection for Amsterdam
15. `86c59f0` — SEO + form to Supabase + branded thank-you email
16. `e8b3368` — Engagement tracking + welkom terug + retargeting

---

## NEXT SESSION PRIORITIES

1. Build admin page for B2B leads at `admin.paywatch.app/outreach/leads`
2. Fix email logo (icon-192.png missing)
3. Upload proper PayWatch logo files
4. Verify admin build compiles
5. Google Search Console setup
