# CASA SECURITY FIXES — VERIFIED DEPLOYMENT GUIDE
# Based on actual source code reviewed March 26, 2026

---

## STEP 1: Admin API Authentication (CRITICAL — do this first)

The admin API has 10 route files, all unauthenticated.
I've provided exact patched files for: users, stats, debug.
For the other 7, you need to add 2 lines to each.

### 1a. Copy the verified files:

```bash
cd ~/Downloads/paywatch

# New file — the auth helper
mkdir -p apps/admin/src/lib
cp ~/Downloads/verified-fixes/admin/src/lib/admin-auth.ts apps/admin/src/lib/admin-auth.ts

# Patched routes (exact code verified)
cp ~/Downloads/verified-fixes/admin/src/app/api/admin/users/route.ts apps/admin/src/app/api/admin/users/route.ts
cp ~/Downloads/verified-fixes/admin/src/app/api/admin/stats/route.ts apps/admin/src/app/api/admin/stats/route.ts
cp ~/Downloads/verified-fixes/admin/src/app/api/admin/debug/route.ts apps/admin/src/app/api/admin/debug/route.ts
```

### 1b. Patch the remaining 7 routes manually:

For each of these files, add the import and auth check:

- `apps/admin/src/app/api/admin/contacts/route.ts`
- `apps/admin/src/app/api/admin/email/route.ts`
- `apps/admin/src/app/api/admin/email/broadcast/route.ts`
- `apps/admin/src/app/api/admin/applications/route.ts`
- `apps/admin/src/app/api/admin/reply/route.ts`
- `apps/admin/src/app/api/admin/community/route.ts`
- `apps/admin/src/app/api/admin/buddies/route.ts`

**For each file, add this import at the top:**
```typescript
import { verifyAdmin } from "@/lib/admin-auth";
```

**Then add these 2 lines as the FIRST thing inside every GET/POST/PATCH/DELETE handler:**
```typescript
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;
```

Example — if a route currently looks like:
```typescript
export async function GET() {
  try {
    const supabase = getAdmin();
    // ...
```

Change it to:
```typescript
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const supabase = getAdmin();
    // ...
```

**Do this for EVERY export async function in each file.**

### 1c. Alternatively — paste these files and I'll patch them:

If you want me to patch them exactly, run:
```bash
cat apps/admin/src/app/api/admin/contacts/route.ts
cat apps/admin/src/app/api/admin/email/route.ts
cat apps/admin/src/app/api/admin/email/broadcast/route.ts
cat apps/admin/src/app/api/admin/applications/route.ts
cat apps/admin/src/app/api/admin/reply/route.ts
cat apps/admin/src/app/api/admin/community/route.ts
cat apps/admin/src/app/api/admin/buddies/route.ts
```
And paste the output — I'll return exact patched versions.

---

## STEP 2: Admin next.config.ts (security headers)

```bash
cd ~/Downloads/paywatch
cp ~/Downloads/verified-fixes/admin/next.config.ts apps/admin/next.config.ts
```

Note: This replaces the .ts file. If your build expects .ts, this works.
If it expects .mjs or .js, rename accordingly.

---

## STEP 3: Deploy admin fixes

```bash
cd ~/Downloads/paywatch
git add .
git commit -m "SECURITY: Add server-side auth to all admin API routes + security headers"
git push origin main
```

### VERIFY after deploy:

```bash
# All should return 401 now (not 200):
curl -s -o /dev/null -w "%{http_code}" https://admin.paywatch.app/api/admin/users
curl -s -o /dev/null -w "%{http_code}" https://admin.paywatch.app/api/admin/stats
curl -s -o /dev/null -w "%{http_code}" https://admin.paywatch.app/api/admin/debug
curl -s -o /dev/null -w "%{http_code}" https://admin.paywatch.app/api/admin/contacts
curl -s -o /dev/null -w "%{http_code}" https://admin.paywatch.app/api/admin/email
curl -s -X DELETE "https://admin.paywatch.app/api/admin/users?userId=test" -o /dev/null -w "%{http_code}"
echo ""
echo "All should be 401"
```

---

## STEP 4: App next.config.mjs (sambafinance1 repo)

```bash
cd ~/Downloads/sambafinance1
cp ~/Downloads/verified-fixes/app/next.config.mjs next.config.mjs
git add .
git commit -m "SECURITY: Fix CSP (add Microsoft domains), Permissions-Policy syntax, HSTS preload"
git push origin main
```

### VERIFY:
```bash
curl -sI https://app.paywatch.app/auth/login 2>&1 | grep -i -E "content-security|permissions-policy|x-powered-by|strict-transport"
# Should show: graph.microsoft.com in CSP, geolocation=() with equals sign, no x-powered-by
```

---

## STEP 5: Landing next.config.ts (paywatch monorepo)

```bash
cd ~/Downloads/paywatch
cp ~/Downloads/verified-fixes/landing/next.config.ts apps/landing/next.config.ts
git add .
git commit -m "SECURITY: Add security headers to landing page"
git push origin main
```

### VERIFY:
```bash
curl -sI https://www.paywatch.app 2>&1 | grep -i -E "content-security|x-frame|x-content-type|access-control-allow-origin"
# Should show security headers and NO access-control-allow-origin: *
```

---

## WHAT I VERIFIED FROM YOUR ACTUAL CODE

### ✅ GOOD (no fix needed):
- `src/lib/auth.ts` — Proper server-side auth via Supabase cookies
- `src/lib/encryption.ts` — AES-256-GCM, unique IV, versioned keys, proper key validation
- `src/lib/rate-limit.ts` — Rate limiting exists per authenticated user
- `src/middleware.ts` — Proper auth redirect, API routes excluded (they handle own auth)
- `src/app/api/gmail/scan/daily/route.ts` — Protected by CRON_SECRET ✅
- `src/app/api/email/digest/cron/route.ts` — Protected by CRON_SECRET ✅
- `src/app/api/push/notify/route.ts` — Protected by CRON_SECRET ✅
- `src/app/api/account/route.ts` — Account deletion exists (GDPR) ✅
- `src/app/api/landing/route.ts` — Intentionally public, uses anon key ✅
- `.gitignore` — `.env` and `.env*.local` are excluded ✅
- All app API routes return 401 for unauthenticated requests ✅

### ❌ ISSUES FOUND:
1. Admin API: 10 routes with zero server-side auth (CRITICAL)
2. Admin next.config.ts: No security headers at all
3. Landing next.config.ts: No security headers, CORS wildcard
4. App next.config.mjs: CSP missing Microsoft domains, Permissions-Policy syntax error
5. App next.config.mjs: No poweredByHeader: false
6. Landing contact form: No rate limiting (public, can be spammed)
7. Landing newsletter route: No rate limiting
8. Landing apply route: No rate limiting
9. Account deletion incomplete: Missing community_*, outlook_accounts, user_buddies tables

### ⚠️ ITEMS TO ADDRESS LATER:
- Account deletion should use service_role client (currently uses anon via RLS)
- Account deletion missing these tables: community_comments, community_posts,
  community_profiles, community_reactions, community_reports, community_notifications,
  outlook_accounts, user_buddies, mood_analytics, ai_extraction_corrections
- Landing public endpoints should have IP-based rate limiting
- Privacy policy needs to explicitly describe gmail.readonly scope
- npm audit should be run on both repos
