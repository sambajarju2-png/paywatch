# PayWatch Monorepo

A **Turborepo** monorepo with 3 apps sharing one codebase.

## Apps

| App | URL | Description |
|-----|-----|-------------|
| `apps/landing` | paywatch.app | Sanity CMS landing page |
| `apps/web` | app.paywatch.app | Main PWA (bill tracker) |
| `apps/admin` | admin.paywatch.app | Admin dashboard (Tremor) |

## Shared Packages

| Package | Description |
|---------|-------------|
| `packages/ui` | Shared React components + design tokens |
| `packages/database` | Supabase client + types |
| `packages/config` | Shared Tailwind, TypeScript, ESLint configs |
| `packages/email` | Shared email templates (Resend) |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run a specific app
pnpm dev:landing   # port 3001
pnpm dev:web       # port 3000
pnpm dev:admin     # port 3002

# Build all
pnpm build
```

## Database

ONE Supabase project (eu-west-1) serves all apps. RLS policies protect user data. Admin app uses `service_role` key.

## CMS

Sanity CMS (project: pwf6qbjc) powers landing page content, legal pages, blog, pricing, and editable app text strings.

## Design

- Font: Plus Jakarta Sans
- Design DNA: Stripe × Revolut × Linear
- Design system: see `Design_system.md`
