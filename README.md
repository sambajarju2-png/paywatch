# PayWatch Outreach Engine — Phase 1
# Overview Dashboard + Contact Manager

## Files included:
```
src/app/outreach/
  layout.tsx          — Tab navigation (Overview, Contacts, Campaigns, Queue, Accounts)
  page.tsx            — Overview dashboard with stats, campaigns, replies, account health
  contacts/page.tsx   — Contact manager with table, filters, CSV import, AI research
  campaigns/page.tsx  — Placeholder (Phase 2)
  queue/page.tsx      — Placeholder (Phase 2)
  accounts/page.tsx   — Placeholder (Phase 2)

src/app/api/admin/outreach/
  stats/route.ts      — GET: aggregated dashboard stats
  contacts/route.ts   — GET: contacts list with filters + POST: create contact
  import/route.ts     — POST: CSV upload → parse → insert contacts
  research/route.ts   — POST: Claude Haiku researches a company website
```

## After unzipping, add the Outreach link to AdminSidebar:

Open `src/components/AdminSidebar.tsx` and add this to the NAV array:

```tsx
{ href: "/outreach", label: "Outreach", icon: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z" },
```

## Install Anthropic SDK (for AI research):

```bash
pnpm add @anthropic-ai/sdk
```

## Deploy commands:

```bash
cd ~/Downloads/paywatch && unzip -o ~/Downloads/outreach-phase1-overview-contacts.zip -d . && pnpm add @anthropic-ai/sdk && pnpm install && git add -A && git commit -m "feat: outreach engine phase 1 — overview + contacts" && git pull origin main --rebase && git push origin main
```
