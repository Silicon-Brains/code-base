# SiliconBrains — Architecture

Last updated: Phase 7 (polish & handoff). This document describes the system **as built**. Anything not yet
verified in a real deployment is marked *(untested)*.

## 1. System overview

```
                    ┌──────────────────────────┐
   Browser ────────►│  Next.js 14 (apps/web)   │
                    │  App Router · Tailwind   │
                    │  Clerk (auth UI + JWT)   │
                    └───────────┬──────────────┘
                                │  HTTPS, JSON
                                │  Authorization: Bearer <Clerk JWT>  (portal/admin only)
                                ▼
                    ┌───────────────────────────┐        ┌────────────────┐
                    │  Express API (apps/server)│◄───────│ Clerk webhook  │
                    │  zod · requireAuth/Role   │  POST  │ user.created   │
                    └───────────┬───────────────┘        └────────────────┘
                                │  /webhooks/clerk
                                │  service-role key (server only)
                                ▼
                    ┌──────────────────────────┐
                    │  Supabase (PostgreSQL)   │
                    │  RLS on every table      │
                    └──────────────────────────┘
```

Three surfaces, one API:

| Surface | Routes | Who | Rendering |
|---|---|---|---|
| Public marketing site | `/`, `/services`, `/projects`, `/projects/[slug]`, `/process`, `/about`, `/contact` | anyone | Static / ISR (`revalidate = 60`) |
| Client portal | `/portal`, `/portal/projects/[id]`, `/portal/invoices` | `role = client` | Dynamic, never cached |
| Admin dashboard | `/admin` and `/admin/*` | `role = admin` | Dynamic, never cached |

**RLS:** enabled on every table. Only the CMS tables have policies (`services`/`projects`/`testimonials`: read where
`published = true`; `faqs`/`process_steps`: read all). `profiles`, `leads`, `client_projects`, `milestones` and
`invoices` have **no** policies, so they are reachable only through the service-role key held by Express. The app never
uses the anon key for data access, so RLS is defence-in-depth, not the access-control layer.

Core rules (full list in `rules.md`): Express is the only thing that talks to Supabase; the service-role key never
leaves `apps/server`; every protected API route checks the role server-side; portal queries are always scoped to the
caller's own profile.

## 2. Repo structure (monorepo, npm workspaces)

```
siliconbrains/
├── docs/                              # PRD, architecture, database, design, rules, phases, memory
├── package.json                       # workspaces root; `npm run dev` runs web (:3000) + server (:4000)
├── apps/
│   ├── web/                           # Next.js 14 (App Router, TypeScript strict)
│   │   ├── app/
│   │   │   ├── layout.tsx             # root: font, global metadata (NO ClerkProvider — see §4.3)
│   │   │   ├── icon.svg · robots.ts · sitemap.ts · opengraph-image.tsx
│   │   │   ├── error.tsx · not-found.tsx
│   │   │   ├── (public)/              # page.tsx, services, projects, projects/[slug], process, about, contact
│   │   │   ├── (portal)/portal/       # page.tsx, projects/[id], invoices  (+ layout, loading, error)
│   │   │   ├── (admin)/admin/         # page, services, projects, testimonials, faqs, process,
│   │   │   │                          #   leads, clients, engagements, milestones, invoices
│   │   │   │                          #   (+ layout, loading, error)
│   │   │   └── sign-in/… · sign-up/…  # Clerk catch-all routes, each with its own layout
│   │   ├── components/                # shared UI; admin/ and portal/ subfolders
│   │   ├── lib/                       # api.ts (typed fetch), types.ts, seo.ts, format.ts, nav.ts,
│   │   │                              #   admin-config.ts, admin-form.ts
│   │   ├── styles/tokens.css          # design tokens (from DESIGN.md) → Tailwind theme
│   │   └── middleware.ts              # Clerk: protects /portal/* and /admin/*
│   └── server/                        # Express API (TypeScript strict; tsx in dev, tsc for build)
│       ├── src/
│       │   ├── index.ts               # app setup, CORS, route mounting
│       │   ├── routes/                # public · admin · portal · me · webhooks
│       │   ├── middleware/            # requireAuth · requireRole · rateLimit
│       │   ├── lib/supabase.ts        # service-role client
│       │   └── scripts/               # seed.ts (upserts CMS content) · seed-data.ts (the content)
│       └── migrations/                # 001–010 schema migrations + message.sql
└── (each app has its own env example file)
```

`apps/server/src/controllers/` exists but is unused — route handlers live in the route files.

## 3. API surface (Express)

Mounted in `index.ts`. `express.raw` is applied to `/webhooks` **before** `express.json()` (signature verification
needs the raw body).

| Mount | Auth | Endpoints |
|---|---|---|
| `GET /health` | none | liveness (`{ ok: true }`) |
| `/api` (public) | none | `GET /services`, `/projects`, `/projects/:slug`, `/testimonials`, `/faqs?page=`, `/process-steps` · `POST /leads` |
| `/api/me` | any signed-in user with a profile | `GET /` → `{ id, role, clerk_user_id }` |
| `/api/portal` | `requireAuth` + `requireRole('client')` | `GET /projects`, `/projects/:id`, `/invoices` |
| `/api/admin` | `requireAuth` + `requireRole('admin')` | CRUD on `services`, `projects`, `testimonials`, `faqs`, `process-steps`, `client-projects`, `milestones`, `invoices` · `GET /leads`, `PATCH /leads/:id` (status only) · `GET /clients` (with engagements) · `GET /overview` (dashboard counts) |
| `POST /webhooks/clerk` | svix signature | `user.created` → insert `profiles` row (`role = client`) |

### Conventions
- **Validation at the edge (zod).** Admin write bodies use per-table `.strict()` schemas (unknown keys → 400, so `id` /
  `created_at` can't be mass-assigned); PATCH is partial. Empty strings for nullable text/date columns become `null`.
  Lead submissions are trimmed and length-capped.
- **Error mapping.** Unique violation → 409, FK/check/invalid input → 409/400, no row → 404, bad UUID param → 404.
  Portal routes return a generic 500 and log details server-side — DB error text is never sent to clients.
- **Portal responses use explicit column lists** (no `select *`), so internal columns such as `client_profile_id`
  never leave the server.
- **Rate limiting.** `POST /api/leads`: 5 requests / 10 min / IP, in-memory fixed window (`middleware/rateLimit.ts`),
  `429` + `Retry-After` when exceeded. Single-process only — swap the store for Redis/Supabase counters if the API
  is ever scaled horizontally. Needs `TRUST_PROXY` set correctly behind a reverse proxy (see §7).
- **CORS.** Single allowed origin from `CORS_ORIGIN`.

## 4. Auth & authorization

### 4.1 Flow
1. Clerk renders sign-in / sign-up (`@clerk/nextjs`); the session is a Clerk JWT.
2. `middleware.ts` runs `auth().protect()` on `/portal(.*)` and `/admin(.*)` → signed-out users go to `/sign-in`.
3. Next.js sends the JWT to Express as `Authorization: Bearer <token>`
   (server components: `auth().getToken()`; client components: `useAuth().getToken()`).
4. `requireAuth` verifies the JWT with Clerk (`verifyToken`), then loads the matching `profiles` row by
   `clerk_user_id` and attaches `{ id, role, clerk_user_id }` to the request. **No profile row → 403.**
5. `requireRole('admin' | 'client')` gates each router.
6. Next.js `(admin)` and `(portal)` layouts call `GET /api/me` and redirect on the wrong role. That is a **UX gate
   only** — Express re-checks on every call and is the security boundary.

### 4.2 Roles & profiles
- `profiles` rows are created by the Clerk `user.created` webhook with `role = 'client'`.
- **Admins are promoted manually** (`update profiles set role = 'admin' …` in Supabase). There is intentionally no API
  for this, so nobody can self-assign or escalate.
- The two role gates are exclusive: an `admin` account is redirected away from `/portal` (use a separate client
  account to see the portal).
- `client_projects` can only be linked to profiles that exist and have `role = 'client'`.

### 4.3 Where `<ClerkProvider>` lives
Not in the root layout. It reads cookies/headers during SSR and would force every route dynamic. It is scoped to
`(admin)/layout.tsx`, `(portal)/layout.tsx`, `sign-in/layout.tsx`, `sign-up/layout.tsx`, so the public site stays
static/ISR. Do not import Clerk into any `(public)` page or shared public component.

### 4.4 Webhook caveats
- The profile row exists only if the webhook succeeded. A user who signed up **before** the webhook/tables existed has
  no profile and will be silently redirected to `/` from `/admin` and `/portal`. Fix by inserting the row manually
  or re-creating the Clerk user.
- The handler is a plain `insert` (not an upsert), so a Clerk retry after a partial failure produces a duplicate-key
  error. *(Known gap — see §10.)*
- Local development needs a public tunnel (e.g. ngrok → `http://localhost:4000`) with the Clerk endpoint set to
  `https://<tunnel>/webhooks/clerk`.

## 5. Data flow & caching

- **Public pages** are Server Components that call the Express public routes via `lib/api.ts` (`fetch` with
  `next: { revalidate: 60 }`). CMS edits appear within ~60 s, no redeploy. There is no on-demand revalidation.
- `loadOr(label, fn, fallback)` degrades a section to `<EmptyState/>` if the API is down, so a page (or a `next build`)
  never fails because of the API. `projects/[slug]` is the exception: 404 → `notFound()`, other errors → error boundary.
- **Portal and admin data is never cached** (`cache: 'no-store'`).
  - Portal pages, the admin dashboard (`/admin`) and `/admin/clients` are Server Components that fetch with the
    server-side Clerk token.
  - Admin CRUD screens use one client component, `ResourceManager`, driven by serializable configs in
    `lib/admin-config.ts`; it fetches with `useAuth().getToken()`. Form ↔ payload conversion lives in the pure module
    `lib/admin-form.ts`.
- **Contact form** (`ContactForm`, client component) → `POST /api/leads`; success resets the form.
- **Category filters** on Services / Projects (`CategoryFilter.tsx`) are client-side visibility toggles over
  server-rendered items; chips are derived from the categories present in the CMS data.

## 6. Design system wiring
- `styles/tokens.css` holds the DESIGN.md tokens as CSS variables; `tailwind.config.ts` maps them to theme colors,
  radii, font (Plus Jakarta Sans via `next/font/google`) and the `max-w-container` (1440px) width.
- Components use theme classes (`bg-surface-container`, `text-on-surface-variant`, `border-outline`, …) — no ad-hoc hex
  codes (rules.md #6). The only exceptions are files that cannot read CSS variables: `app/icon.svg` and
  `app/opengraph-image.tsx`.
- Shared UI: `Navbar` (floating pill + mobile menu), `Footer`, `Button`, `Card`, `Badge`, `Section`, `StatBlock`,
  `Accordion`, `ComparisonTable`, `EmptyState`, `Testimonials`, `CategoryFilter`, `ContactForm`; `portal/` and `admin/`
  subfolders for their own chrome.

## 7. Environments

**`apps/web/.env.local`**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `…_SIGN_UP_URL`, `…_AFTER_SIGN_IN_URL`, `…_AFTER_SIGN_UP_URL` | Clerk routing (`/sign-in`, `/sign-up`, `/portal`, `/portal`) |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API (default `http://localhost:4000`) |
| `NEXT_PUBLIC_SITE_URL` | Public site origin — canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph. Set to the production domain |

**`apps/server/.env`**

| Variable | Purpose |
|---|---|
| `PORT` | default 4000 |
| `CORS_ORIGIN` | the web app's origin (exact match, e.g. `https://siliconbrains.com`) |
| `TRUST_PROXY` | leave unset locally; behind a proxy/load balancer set to the hop count (e.g. `1`) so the rate limiter sees real client IPs |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | database (service-role key, **not** the anon key) |
| `CLERK_SECRET_KEY` | JWT verification |
| `CLERK_WEBHOOK_SECRET` | svix signing secret for `/webhooks/clerk` |

### Database setup (in order)
1. Run `migrations/001_init.sql`, `002_seed_constraints.sql`, `003_cms_display_fields.sql`, `004_ops_telemetry.sql`,
   `005_portal_sprint.sql`, `message.sql`, `006_admin_redesign.sql`, `007_admin_runtime_schema.sql`, and
   `008_invoice_documents.sql`, `009_invoice_number_sequence.sql`, and `010_approved_enquiry_clients.sql` in order in the Supabase SQL editor.
2. `npm run db:seed --workspace=apps/server` (idempotent upserts for services, projects, contact FAQs, process steps;
   testimonials are intentionally unseeded).
3. Add the Clerk webhook, then sign up; promote your admin row manually.

Every schema change is a new numbered migration file (rules.md #10). If PostgREST reports
`Could not find the table … in the schema cache`, the migrations haven't been applied (or the cache needs a reload).

## 8. SEO
- Root layout: `metadataBase` (from `NEXT_PUBLIC_SITE_URL`), title template `%s | SiliconBrains`, OG/Twitter defaults,
  `themeColor`. Each public page sets its own title/description/canonical/OG through `lib/seo.ts → pageMetadata()`;
  the project detail page derives them from the project.
- `sitemap.ts` (static routes + project slugs; falls back to static routes if the API is down), `robots.ts`
  (disallows `/admin`, `/portal`, `/sign-in`, `/sign-up`), generated `opengraph-image.tsx`, `icon.svg`.
- `/admin`, `/portal`, `/sign-in`, `/sign-up` also emit `noindex, nofollow`.

## 9. Deployment (recommended, *untested*)
- **Web → Vercel.** Set the web env vars above; `NEXT_PUBLIC_API_URL` must point at the deployed API and
  `NEXT_PUBLIC_SITE_URL` at the production domain.
- **Server → Render / Railway / any Node host.** Build with `tsc`, start with `node dist/index.js`. Set `CORS_ORIGIN`
  to the exact web origin and `TRUST_PROXY` for the host's proxy chain. Point the Clerk webhook at
  `https://<api-host>/webhooks/clerk`.
- **DB / Auth → Supabase + Clerk cloud.** Use Clerk production keys (dev keys only work on dev instances).
- Detailed deploy notes have not been written yet.

## 10. Known limitations & open decisions
- **Hardcoded page copy.** Hero/stat strips, About, Services "Engagement Models" + "Quality Guarantees", Projects
  "Engineering Rigor", Process "Operational Rhythm" + "Risk Mitigation", Contact sidebar and CTA bands are JSX, not
  CMS-editable (conflicts with the PRD goal / rules.md #5). Decision pending: generic `site_blocks` table vs.
  per-section tables vs. leave in code.
- **Webhook robustness.** Insert is not idempotent, and there is no self-heal when a profile is missing (§4.4).
- **Clerk SDK.** `@clerk/clerk-sdk-node` is in its deprecation window; migrating to `@clerk/express` is pending.
- **Portal is read-only** — no messaging, file sharing or online payment; invoices are records only. "Past due" uses
  the UTC date.
- **Admin:** no pagination, no audit log, optional numeric fields can't be cleared once set.
- **Rate limiter** is in-memory (single process).
- **Placeholders:** social links (`lib/nav.ts`), Discovery Call slots + `mailto:` booking (no scheduling backend),
  favicon/logo mark.
- **Not yet verified:** responsive QA at the DESIGN.md breakpoints; PostgREST embedded selects on
  `/admin/clients` and `/admin/engagements` against a real Supabase project; production deployment.
