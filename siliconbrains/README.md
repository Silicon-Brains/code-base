# SiliconBrains

Full-stack agency website: Next.js (apps/web) + Express (apps/server) + Supabase + Clerk.

See `docs/` for PRD, architecture, database schema, phases, and rules.

## Setup

1. `npm install` (root — installs both workspaces)
2. Copy `apps/web/.env.local.example` → `apps/web/.env.local`, fill in Clerk keys + `NEXT_PUBLIC_API_URL` (+ `NEXT_PUBLIC_SITE_URL` = your production origin, for canonical URLs/sitemap/OG)
3. Copy `apps/server/.env.example` → `apps/server/.env`, fill in Supabase + Clerk keys
4. Create a Supabase project, run `apps/server/migrations/001_init.sql`, `002_seed_constraints.sql`, then `003_cms_display_fields.sql` in the SQL editor (in order), then seed the CMS: `npm run db:seed --workspace=apps/server`
5. In Clerk dashboard, add a webhook → `POST {API_URL}/webhooks/clerk`, event `user.created`, copy signing secret into `CLERK_WEBHOOK_SECRET`
6. `npm run dev` from root — runs web (:3000) and server (:4000) together

## Roles

New users default to `client` role (via Clerk webhook → profiles table).
To make someone an admin, update their `profiles.role` to `'admin'` directly in Supabase.
