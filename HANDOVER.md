# PayWatch — Dev Session Handover
**Date:** 3 May 2026 | **Context:** End-of-session summary for new chat

---

## Repos & Projects

| App | Repo | Vercel Project ID |
|-----|------|-------------------|
| Consumer PWA (app.paywatch.app) | `sambajarju2-png/sambafinance1` | `prj_pdHP6Qg7WsONTaOg8D3gezJime2R` |
| Admin (admin.paywatch.app) | `sambajarju2-png/paywatch` | `prj_30Av9iEUcwvqdkbotSRulFukiC9E` |
| B2B (*.paywatch.app) | `sambajarju2-png/paywatch` | `prj_2tJhsABoWHRerd6Fk0ALVLtV2oNf` |
| Landing (paywatch.app) | `sambajarju2-png/paywatch` | `prj_UZYlhUm7GL16cWuzQcyRGYwZWXXe` |

- **Vercel team:** `team_Oxrk37sevVZa5pQWfEpqR1lR`
- **Supabase project:** `ectcwerjdpiurubdpxcp`
- **Git email:** `sambajarju2@gmail.com` (required or Vercel rejects)
- **Stack:** Next.js 14/16, Supabase, Tailwind, pnpm monorepo (paywatch), npm (sambafinance1)

---

## Login Credentials

### B2B Admin Portal
```
URL:      https://b2b.paywatch.app/login
Email:    samba@paywatch.nl
Password: @Yankuba2021
```
**Note:** Google OAuth is now fixed. The bug was the middleware was intercepting `/auth/callback` before the session could be established. Fixed by adding `!pathname.startsWith("/auth/")` to all 4 redirect checks in `apps/b2b/src/middleware.ts`.

### SUPER_ADMINS (all accounts that can access b2b.paywatch.app and admin)
```
sambajarju2@gmail.com, reiskenners@gmail.com, ayeitssamba@gmail.com,
samba@paywatch.nl, samba@paywatch.app,
mariama@paywatch.nl, mariama@paywatch.com, mariama@paywatch.app
```

---

## What Was Built This Session

### Bugs Fixed
1. **OAuth callback blocked by middleware** — `/auth/callback` was intercepted and redirected to login before session exchange. Fixed in `apps/b2b/src/middleware.ts`.
2. **Consent "Geen toestemming" wrong scope** — page checked `view_bills` but DB constraint only allows `full_access`, `aggregated`, `payment_plans`, `financial_overview`. Fixed + backfilled all existing org members with `full_access` consent.
3. **Invite activation never created consent** — `src/app/api/invite/activate/route.ts` now auto-grants all 4 scopes when user accepts invite (accepting email = consent).
4. **Coach "Geen" display** — `.single()` → `.maybeSingle()` with `.order().limit(1)` in `apps/b2b/src/app/users/[user_id]/page.tsx`.
5. **Coach messages not arriving in consumer app** — Bridge was using `auth.admin.getUserById` which failed in context. Simplified to lookup via `organization_members.invite_email`.
6. **AI insights formal Dutch (Uw/u)** — Updated `INSIGHT_PROMPT` in `src/lib/ai/pipeline.ts` to use `je/jij`, no em-dashes.

### New Features
1. **Admin `/plans`** — Plan rules dashboard: 5-column layout per plan, feature toggles, voice/chat limit selectors. Saves to `plan_rules` DB table.
2. **Admin `/abonnementen`** — Paying users view with MRR estimate, Pro/Premium breakdown, provider/status tracking. Ready for Stripe/RevenueCat webhooks.
3. **B2B Rights Dashboard** (`/teamleden`) — Role editor (owner/admin/coach/viewer), per-member permission toggles, sections reference table.
4. **B2B Short Invite Codes** — New `PW-XXXXXX` format generated on invite creation, shown in invites list with copy button. Supports both short code and UUID token lookup.
5. **Consumer app Gemeente/Incasso section** — In hulplijn inbox AND in vangnet/buddy settings: connected org cards + "Code invoeren" input. Works via `/api/org-connections`.
6. **Admin Instellingen page** — IBAN, BIC, KVK, BTW all editable in dashboard, stored in `paywatch_settings` DB table. Invoice emails now pull from DB.
7. **B2B Organizations page** (`/admin/organizations`) — Contract management, billing setup, invoice creation, "Verstuur" button sends IBAN invoice email via Resend.
8. **Consumer app plan expansion** — Now 5 plans: `gratis`, `pro_monthly`, `pro_yearly`, `premium_monthly`, `premium_yearly`.

---

## Database Changes This Session

### New Tables
- `plan_rules` — Configurable feature flags per plan (no redeploy needed to change)
- `paywatch_subscriptions` — Stripe/RevenueCat subscription tracking (webhooks not yet wired)
- `b2b_invoices` — Invoice records for B2B org billing

### Schema Changes
- `organizations` — Added `seat_limit`, `price_per_seat`, `monthly_fee`, `billing_period`, `contract_start_at`, `contract_end_at`, `invoice_reference`, `billing_notes`
- `b2b_invites` — Added `short_code TEXT` (unique index)
- `user_settings` — Added `plan TEXT DEFAULT 'gratis'`, `voice_seconds_used INTEGER`, `voice_seconds_reset_at TIMESTAMPTZ`
- `b2b_consents` — Added unique constraint `(user_id, organization_id, scope)`
- `paywatch_settings` — KV table for IBAN, BIC, KVK, BTW etc.

---

## What Needs Doing Next

### High Priority
1. **Stripe webhook** — `POST /api/stripe/webhook` not built. Handle: subscription.created/updated/deleted, invoice.payment_succeeded/failed. Writes to `paywatch_subscriptions` and `user_settings.plan`.
2. **RevenueCat webhook** — `POST /api/revenuecat/webhook` not built. Same target tables.
3. **Vaste lasten toggle** — Was built but lost to container reset in previous session. `user_expenses` table exists, `expense_id` FK on `bills` exists. Needs UI toggle in bill detail: "Vaste last" → auto-creates `user_expenses` row.
4. **GoCardless/PSD2 bank sync** — High priority for investor demo (May 28). Not started.
5. **Onboarding wizard rebuild** — `onboarding_profile` JSONB column exists. 10-step flow not implemented.
6. **Google Search Console indexing** — Service account `paywatch-indexing@careful-ensign-270716.iam.gserviceaccount.com`. Supabase Search Console Owner permission needs to be assigned. API route at `app.paywatch.app/api/indexing` not built.

### Supabase Manual Steps Still Needed
1. **Add to Redirect URLs:** `https://b2b.paywatch.app/auth/callback` (Supabase → Auth → URL Config)
2. **Set in Vercel env when ready to charge:** `ENFORCE_VOICE_LIMITS=true`

### Stripe Setup (Not Started)
See previous session notes. Products, prices, Customer Portal, webhook endpoint at `https://app.paywatch.app/api/stripe/webhook`. Events: subscription.created, subscription.updated, subscription.deleted, invoice.payment_succeeded, invoice.payment_failed.

### RevenueCat Setup (Account exists)
1. Connect iOS app (Bundle ID: `app.paywatch`)
2. Create entitlements: `pro`, `premium`
3. Create products in App Store Connect: `paywatch_pro_monthly`, `paywatch_premium_monthly`
4. Webhook URL: `https://app.paywatch.app/api/revenuecat/webhook`

### Capacitor Pattern for Payments
```typescript
import { Capacitor } from '@capacitor/core';
if (Capacitor.isNativePlatform()) {
  // iOS → RevenueCat
} else {
  // Web → Stripe
}
```
Both write to `user_settings.plan` via their respective webhooks.

---

## Key Architecture Notes

### Consent Flow
- Accepting an invite email = implicit consent (auto-grants `full_access`, `aggregated`, `payment_plans`, `financial_overview`)
- Users can also enter `PW-XXXXXX` codes in vangnet settings to connect manually
- B2B dossier page checks `scope = 'full_access'` in `b2b_consents`

### B2B Multi-Tenant
- `b2b.paywatch.app` = super-admin mode (only SUPER_ADMINS)
- `X.paywatch.app` = org-tenant mode (org members only)
- Middleware at `apps/b2b/src/middleware.ts` handles routing, tenant context via response headers
- All 4 redirect checks in middleware must have `!pathname.startsWith("/auth/")` exclusion

### Plans Architecture
- Plan IDs: `gratis`, `pro_monthly`, `pro_yearly`, `premium_monthly`, `premium_yearly`
- Stored in `user_settings.plan`
- Feature rules in `plan_rules` DB table (admin-editable, no redeploy)
- Voice limits in `user_settings.voice_seconds_used` / `voice_seconds_reset_at`
- `ENFORCE_VOICE_LIMITS=false` currently (flip when Stripe/RevenueCat live)

---

## Commit History This Session (newest first)
```
19a5469 fix: TS any type annotations in org-connections route (sambafinance1)
9b99a8a fix: TS error in paying-users route (paywatch)
1658dc8 feat(b2b): short invite codes PW-XXXXXX (paywatch)
3a96226 chore: remove temp admin@paywatch.nl (paywatch)
accb987 fix: middleware /auth/ exclusion + OAuth fix (paywatch)
6c0a635 feat(admin): plans dashboard, paying users, consent fix (paywatch)
efac0c6 fix: expand SUPER_ADMINS, /api/debug/me (paywatch)
31b08fb fix: coach message bridge, .maybeSingle() for buddy (paywatch)
9735c66 feat(b2b): rights management dashboard (paywatch)
8aaeb27 fix: double comma invoice-email, Google OAuth B2B login (paywatch)
f3dfd83 feat: gemeente/incasso vangnet settings (sambafinance1)
a321c79 fix: auto-grant consent, org-connections API (sambafinance1)
2677695 fix: AI insights je/jij informal tone (sambafinance1)
```
