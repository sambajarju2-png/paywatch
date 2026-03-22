# Phase 3: Admin Email Tab — Layout Update

## Add Email to Sidebar Navigation

In `apps/admin/src/app/layout.tsx`, add the Email nav link to the sidebar navigation array.

### Find this section (the nav links array):

```tsx
{ href: "/", icon: "📊", label: "Dashboard" },
{ href: "/bills", icon: "📄", label: "Bills" },
{ href: "/users", icon: "👥", label: "Users" },
{ href: "/contacts", icon: "💬", label: "Contacts" },
{ href: "/applications", icon: "📋", label: "Applications" },
```

### Add this line after Applications:

```tsx
{ href: "/email", icon: "📧", label: "Email" },
```

### Final result:

```tsx
{ href: "/", icon: "📊", label: "Dashboard" },
{ href: "/bills", icon: "📄", label: "Bills" },
{ href: "/users", icon: "👥", label: "Users" },
{ href: "/contacts", icon: "💬", label: "Contacts" },
{ href: "/applications", icon: "📋", label: "Applications" },
{ href: "/email", icon: "📧", label: "Email" },
```

That's it — the page component and API routes handle the rest.

---

## Environment Variable Required

Make sure `RESEND_API_KEY` is set in the admin app's Vercel environment variables:
```
RESEND_API_KEY=re_BKZskZkF_3v7YGPpxrk64NwYkZMFb7r1m
```

(This should already be set from the earlier admin work.)

---

## What This Adds

### New files:
- `apps/admin/src/app/email/page.tsx` — Full email management page
- `apps/admin/src/app/api/admin/email/route.ts` — Subscriber stats + newsletter data API
- `apps/admin/src/app/api/admin/email/broadcast/route.ts` — Broadcast history + send API

### Features:
1. **Overview tab**: 4 stat cards, growth chart, audience donut, digest overview, feedback quotes, Resend sync
2. **Subscribers tab**: Searchable table, audience filter, CSV export
3. **Broadcasts tab**: History from Resend API with status/date filters
4. **Compose tab**: Send broadcasts to any audience directly from admin (audience selector, from, subject, HTML body, live preview, save as draft or send now)

### Data sources:
- `newsletter_subscribers` table (Supabase)
- `user_settings.notify_email_digest` (Supabase)
- `user_feedback` table (Supabase)
- Resend Audiences API (contact counts)
- Resend Broadcasts API (history + send)

### Resend Audience IDs (hardcoded):
- Consumers: `065fa004-bc05-4d75-abaf-67ed1e41872d`
- B2B Partners: `113aa5e0-31d8-4db4-bffd-1ddc42dd675e`
- General: `ee9f4b20-bbd5-4f6f-b98e-ddb1327cbc91`
