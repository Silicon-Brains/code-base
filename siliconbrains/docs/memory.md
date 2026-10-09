# SiliconBrains — Build Memory

## Phase 0 — Docs
Done (delivered with scaffold).

## Phase 1 — Scaffolding
Done (delivered with scaffold): npm workspaces, Next.js 14 App Router + Tailwind wired to `tokens.css`,
Express skeleton, Supabase migration file, Clerk provider + sign-in/sign-up routes + webhook stub.

## Phase 2 — Public marketing pages (static-shell) — COMPLETE

Built pixel-matched (desktop-reference) versions of all 6 public pages using hardcoded placeholder
content transcribed from the provided screenshots. All content in `(public)/` is intentionally
hardcoded per the Phase 2 spec — Phase 4 replaces it with CMS fetches.

**Shared components added** (`apps/web/components/`):
- `Navbar.tsx` — floating glass shell, active-pill nav (client component, `usePathname`)
- `Footer.tsx` — logo/tagline, Quick Links, Connect columns
- `Button.tsx` — primary / secondary / ghost variants, works as `<Link>` or `<button>`
- `Card.tsx` — base + `interactive` hover variant (translateY + border brighten)
- `Badge.tsx` — default + `active` variant (chip/pill)
- `StatBlock.tsx` — bordered stat number + label block
- `Accordion.tsx` — FAQ accordion (client component, single-open state)
- `ComparisonTable.tsx` — 3-column "Generic vs SiliconBrains" table
- `Section.tsx` — max-w-container page-section wrapper
- `ContactForm.tsx` — full technical-scoping intake form (client component, local state only —
  no POST yet, that's Phase 4 wiring to `/leads`)

**Pages built** (`apps/web/app/(public)/`):
- `page.tsx` — Landing
- `services/page.tsx` — Services
- `projects/page.tsx` — Projects (list + flagship case study; `[slug]/page.tsx` still a stub, is Phase 4/6 territory since it needs CMS-driven case study detail data)
- `about/page.tsx` — About
- `process/page.tsx` — Process
- `contact/page.tsx` — Contact (form + discovery-call panel + FAQ accordion + trust footer band)

**Verification done:**
- `npx tsc --noEmit` — clean, no type errors
- `npx next build` — full production build succeeds (17/17 static pages generated); verified with a
  temporary local-font swap + dummy Clerk test key since this sandbox has no network access to
  `fonts.googleapis.com` — reverted both before packaging, real build will fetch the font normally
  once deployed with real Clerk keys.
- All colors/spacing pulled from `tokens.css`-backed Tailwind theme tokens (`bg-surface-container`,
  `text-on-surface-variant`, `border-outline`, etc.) — no ad-hoc hex codes, per rules.md #6.

**Not done in this phase (by design, deferred to later phases):**
- `projects/[slug]/page.tsx` case-study detail route — still the Phase-1 stub
- Admin (`(admin)/`) and Portal (`(portal)/`) UIs — still Phase-1 stubs, untouched
- Any Express/Supabase wiring — Phase 3
- Contact form submission — currently local-only `preventDefault`, no `/leads` POST yet — Phase 4

## Phase 3 — Backend CMS API — COMPLETE

Most of this phase's infrastructure already existed from the Phase 1 scaffold delivery
(`public.routes.ts`, `admin.routes.ts`, `portal.routes.ts`, `lib/supabase.ts`, and
`migrations/001_init.sql` were already fully implemented against database.md/architecture.md).
What Phase 3 actually added:

- **`apps/server/migrations/002_seed_constraints.sql`** — adds `unique (phase_number)` on
  `process_steps` and `unique (page, sort_order)` on `faqs`. Needed so the seed script can
  upsert idempotently (`services`/`projects` already had this via their `slug unique` column).
- **`apps/server/src/scripts/seed.ts`** — populates `services`, `projects`, `faqs`
  (`page='contact'`), and `process_steps` with the exact copy transcribed from the Phase 2 pages
  (`services/page.tsx` → `SERVICES`, `projects/page.tsx` → `PROJECTS`/`GRID_PROJECTS`,
  `contact/page.tsx` → `FAQS`, `process/page.tsx` → `PHASES`). Run via `npm run db:seed
  --workspace=apps/server`. Upserts on each table's natural key, so it's safe to re-run.
  Dry-run verified against a mocked Supabase client (real migrations/DB aren't reachable from
  this sandbox) — row shapes, onConflict keys, and console output all confirmed correct.
- **`testimonials` intentionally left unseeded** — no testimonial content exists anywhere in the
  Phase 2 screenshots/pages to transcribe. Table and admin CRUD (`/api/admin/testimonials`)
  are ready whenever real client testimonials are supplied.
- **Bug fix (pre-existing, from Phase 1 scaffold):** `me.routes.ts` and `portal.routes.ts` were
  typing their route handlers' `req` as a plain Express `Request` while reading `req.profile`
  off it — a type error `tsc --noEmit` would have caught the moment someone tried to build
  the server. Retyped those handlers' `req` as `AuthedRequest` (already exported from
  `middleware/requireAuth.ts`) to fix it. `npx tsc --noEmit` on `apps/server` is now clean.

**Verification done:**
- `npx tsc --noEmit -p apps/server/tsconfig.json` — clean.
- Seed script dry-run against a temporarily mocked `lib/supabase.ts` (swapped out, run, restored,
  diffed byte-identical against the original — confirmed no residual changes) — all 4 tables
  upsert the expected row counts on the expected conflict keys.

**Not done in this phase (by design, deferred to later phases):**
- Public pages still read hardcoded content, not these new endpoints — that's Phase 4.
- No live Supabase project was migrated/seeded from this sandbox (no network access to a real
  Supabase instance) — `002_seed_constraints.sql` needs to be run before `npm run db:seed`
  against your actual project.

## Phase 4 — Wire public pages to CMS — COMPLETE

**Schema gap found & fixed (`migrations/003_cms_display_fields.sql`).** The Phase 3 seed only carried
columns that existed in the original schema, so wiring pages to it would have silently dropped visible
content (service tags/feature bullets/metric, project tags + flagship bullets, process descriptions +
right-hand panel labels) and the NDA checkbox had nowhere to land. Added:
- `services`: `tag`, `features[]`, `metric_label`, `metric_value`
- `projects`: `tag` (display label, separate from filter `category`), `highlights[]`
- `process_steps`: `description`, `artifact_label`, `artifact_note`
- `leads`: `nda_requested boolean`

**Convention change:** `projects.metrics` is now an ordered array of `{ value, label }` (rendered as
"<value> <label>"), not a keyed object. GymPro's `category` is now `Full-Stack Web` (matches the filter
chip); its display label `Full-Stack Web & IoT` lives in `tag`.

**Seed:** content moved to `apps/server/src/scripts/seed-data.ts` (no Supabase import, so it's reusable in
tests); `seed.ts` just upserts it. Re-run after applying migration 003.

**Web:**
- `lib/types.ts` (API shapes), `lib/api.ts` now typed + `ApiError` + `loadOr()` helper. Public GETs use
  `revalidate: 60`; POSTs/auth'd calls use `no-store`.
- `loadOr()` degrades a section to `<EmptyState/>` if the API is down instead of failing the page or a
  `next build`. `projects/[slug]` is the exception: 404 → `notFound()`, any other error → error boundary.
- CMS-driven now: Landing (services preview, projects, process steps, tech strip derived from service
  baselines), Services, Projects (featured vs grid split on `featured`), `projects/[slug]` detail (new),
  Process, Contact FAQs.
- `ContactForm` POSTs to `/api/leads` (loading/success/error states; success resets the form).
- `leadSchema` (zod) tightened with trims and max lengths; accepts `nda_requested`.

**Phase 2 bug fixed:** `(public)/page.tsx` (Landing) was a copy of the About page. The real Landing design
(hero "We Build Digital Products That Move Businesses Forward", What We Do, Our Work, From Idea to Launch,
Technologies, "Have an idea?") had never been built. Now built from Landing_Page.png. Hero dashboard mock
image from the screenshot is not reproduced (decorative telemetry card) — add in Phase 7 polish if wanted.

**Still hardcoded (deliberate — no CMS table exists for it; violates rules.md #5 until decided):**
hero/heading copy, stat strips, About page, Services "Engagement Models" + "Quality Guarantees",
Projects "Engineering Rigor", Process "Operational Rhythm" + "Risk Mitigation", Contact sidebar,
CTA bands. Filter chips are visual only (not interactive). Recommended: add a generic `site_blocks` table
(or per-section tables) if the admin should edit these — decide before Phase 5.

**Verification (real code, mocked data layer):**
- Real `public.routes.ts` run under Express against an in-memory Supabase stand-in (swapped in, then
  restored and diffed byte-identical): all GETs 200, unknown slug 404, valid lead 201 (incl.
  `nda_requested`), invalid lead 400 with field errors.
- `next build` + `next start` against that API: all pages 200; grepped rendered HTML for CMS-only strings
  on every page (service metrics, project metrics/highlights, process artifact labels, FAQs, landing
  sections) — all present. Unknown project slug → 404.
- Build with the API down succeeded and logged `[cms] failed to load …` (graceful-degradation path).
- `tsc --noEmit` clean for both apps.

**Not verified:** a real Supabase project (migrations 002+003 and `db:seed` must be run by you), the
contact form in a real browser (submit path exercised only via curl against the API), Clerk with real keys.

**Observations for later phases:**
- All routes build as dynamic (ƒ), not static — `ClerkProvider` in the root layout opts the tree into
  dynamic rendering. Content is still cached 60s at the fetch layer, so the API isn't hit per request, but
  it's not true ISR. Fix in Phase 7 by scoping `ClerkProvider` to portal/admin/auth route groups.
- `POST /api/leads` has no rate limiting/spam protection — add before launch (Phase 7).

## Phase 5 — Admin Dashboard — COMPLETE

**Server (`admin.routes.ts`, full rewrite).** The Phase 1 version passed `req.body` straight into Supabase
(violating rules.md #9 and allowing mass-assignment of `id`/`created_at`). Now:
- Per-table zod schemas, all `.strict()` (unknown keys → 400); PATCH = partial. Empty-string form values
  are normalised to `null` for nullable text/date columns. Slugs must be kebab-case; engagement phase 1–5,
  progress 0–100; milestone/invoice statuses are enums; currency upper-cased.
- DB errors mapped: unique → 409, FK/check/invalid input → 409/400, no row → 404 (was blanket 400/500).
  `:id` params validated as UUIDs. `updated_at` only touched on tables that have it.
- Lead PATCH only accepts `{status}` with the 4 valid values.
- `GET /clients` embeds each client's engagements. `POST/PATCH /client-projects` verify the linked profile
  exists and has `role='client'` (this is the "client creation flow"; admins are never linkable).
- `GET /overview` returns dashboard counts.
- Admin role is still promoted manually in Supabase — there is deliberately no API for it.

**Web.**
- `(admin)/layout.tsx`: sidebar nav (`AdminNav`, mobile = top bar) + the existing role gate.
- `ResourceManager` (client component, driven by serializable configs in `lib/admin-config.ts`) provides
  list / create / edit / delete for Services, Projects, Testimonials, FAQs, Process steps, Engagements,
  Milestones, Invoices. Handles list fields (one per line), JSON (project metrics), relational selects
  (client, engagement), dates, booleans. Conversion logic is in the pure module `lib/admin-form.ts`.
- `LeadsInbox`: status filter with counts, full lead detail (domains/budget/timeline/NDA/message), status buttons.
- Dashboard (`/admin`) tiles; `/admin/clients` table with engagements.
- Milestones and Invoices admin pages are beyond the phases.md list but Phase 6 (portal) needs data to show.

**Verification (real routes/logic, faked auth + DB):**
- 29 route assertions against the real `admin.routes.ts` (Clerk verify and Supabase swapped for in-memory
  fakes, then restored byte-identical): 401/403 auth gating, CRUD, 409 duplicate slug, mass-assignment
  rejection, partial PATCH, bad-UUID 404, engagement→profile role check, date/currency normalisation,
  overview counts.
- 15 unit assertions on `admin-form.ts` (row↔form↔payload, validation errors, cell formatting).
- `tsc` clean (both apps); `next build` compiles all 11 admin routes.

**Not verified:** the admin UI in a real browser with real Clerk sign-in (never rendered); PostgREST
embedded selects (`client_projects(...)`, `client:profiles(...)`) — the fake ignores embeds, so confirm
`/admin/clients` and `/admin/engagements` show names on your Supabase; real Postgres error codes for
unique/FK cases.

**Known limitations / for later:**
- Public pages cache API data 60s, so edits appear on the site within ~a minute (no on-demand revalidation).
- Testimonials are manageable here but no public page renders them yet.
- Optional number fields can't be cleared once set (empty = omit). Hardcoded page copy is still not editable
  (the `site_blocks` question is still open).
- No pagination on admin lists (fine at current scale).
- Admin actions aren't audit-logged.

## Phase 6 — Client Portal — COMPLETE

**Server (`portal.routes.ts`, rewrite).** Same design (requireAuth + `requireRole('client')`, everything scoped
to `req.profile.id`) but hardened:
- Explicit column lists — only client-safe fields are returned (no `client_profile_id`, no internals).
- `GET /projects/:id`: UUID-validated, ownership-checked (`id` AND `client_profile_id`), then milestones and
  invoices are fetched by the *verified* `project.id` and returned together. Previously milestone errors were
  silently ignored and invoices weren't included.
- `GET /invoices` still resolves the client's projects first, now also returns `project_title`.
- DB error text is no longer leaked to clients (generic 500, logged server-side).

**Web (`(portal)/`).** Layout with `PortalNav` (floating pill, Clerk `UserButton`) + role gate (client only —
admins are redirected to `/`, so preview the portal with a separate client account).
- `/portal`: greeting, tiles (project count, outstanding balance per currency with overdue count, invoice
  count), project cards (phase x/5, progress bar, status summary), empty state for clients with no engagement.
- `/portal/projects/[id]`: status card (phase name from the public process steps), 5-phase stepper
  (done/current/upcoming), milestone timeline (status, due date, "past due" flag, notes), project invoices.
  Unknown/other-client id → 404 page.
- `/portal/invoices`: table across all the client's projects with status badges and links to the project.
- `lib/format.ts` (date/money/isPast; bad currency code can't crash a page), `ProgressBar`, `StatusBadge`.
- Admin screens now warn that milestone notes, invoices and engagement title/phase/progress/summary are client-visible.

**Verification (real routes, faked Clerk/Supabase, then restored byte-identical):** 12 assertions —
401 without token, 403 for admin role, client A sees only A's projects/invoices, A→B's project id = 404 and
B→A's = 404, bad UUID = 404, internal columns absent, project detail includes only that project's
milestones/invoices, client with no projects gets `[]`. 6 assertions on formatters. `tsc` clean; `next build`
compiles all 3 portal routes.

**Not verified:** the portal in a real browser with real Clerk (never rendered); PostgREST behaviour on real
Supabase (routes use only plain selects, no embeds, so lower risk than Phase 5).

**Known limitations:** read-only portal (no messaging, file sharing, or online payment — invoices are records
only); "past due" uses UTC date; no pagination; portal data is never cached (per architecture.md).

## Phase 7 — Polish & handoff — IN PROGRESS

Also includes a pre-Phase-7 pass on the admin dashboard (`/admin`) and portal overview (`/portal`), whose
layouts had never been redesigned past the Phase 1 stub tiles: both now use the real data already returned
by `overview`/`clients`/`leads`/`projects`/`invoices`/milestones, laid out as a header + KPI row + two-column
detail (live client engagements/inbound leads for admin; projects/milestones/next invoice for portal) —
same design tokens and shared components (`Card`/`Badge`/`Button`/`ProgressBar`/`StatusBadge`) as everywhere
else, no new components needed. The decorative fictional telemetry (CI/CD feeds, node clusters, latency
graphs) from the original reference mockups was intentionally not reproduced — there's no backing data model
for it in this app, and inventing fake metrics on a real client/financial dashboard would be misleading.

**Carry-over items closed this pass:**
- **`ClerkProvider` scoped down** from the root layout into `(admin)/layout.tsx`, `(portal)/layout.tsx`,
  and new `sign-in/layout.tsx` / `sign-up/layout.tsx`. Root `app/layout.tsx` no longer touches Clerk at all
  (confirmed no public page/component imports it), so `(public)/*` is free to be static/ISR again — the
  `revalidate: 60` on public fetches now actually does something instead of being moot under forced dynamic
  rendering.
- **Rate limiting on `POST /api/leads`**: new `apps/server/src/middleware/rateLimit.ts`, a small in-memory
  fixed-window limiter (5 requests / 10 min / IP) — no new dependency, single-process app per architecture.md.
  Added `TRUST_PROXY` to `apps/server/.env.example` (unset by default) since `req.ip` needs it set correctly
  behind a real reverse proxy in production, or the limiter either double-counts everyone behind it or can't
  see the real client IP at all.
- **`loading.tsx` + `error.tsx`** added for `(admin)` and `(portal)` (skeleton placeholders sized to each
  page's actual layout; error boundaries with "Try again" + a way back). Also added root `app/error.tsx` and
  `app/not-found.tsx` for the public site, which had neither.
- **Dead buttons wired**: Contact page's "Book Discovery Call" → `mailto:engineering@siliconbrains.com`
  (no real scheduling backend exists — see below), "Start Consultation" → scrolls to the intake form
  (`#intake`), GitHub/LinkedIn quick-contact buttons → same URLs as the footer's Connect column (added
  `external` prop to `Button` for these so they open in a new tab like the footer's `<a>` links do).
  Grepped both `app/` and `components/` for bare `<button>`/`<Button>` with no `onClick`/`href`/`type="submit"`
  — everything else was already wired.

**Deliberately not done / needs a real decision, not a guess:**
- **Social links are still placeholder domains** (`github.com`, `linkedin.com`, not SiliconBrains' actual
  profiles) — `lib/nav.ts` → `FOOTER_CONNECT`. Same for the contact page's Discovery Call slots (`SLOTS`
  in `contact/page.tsx`) — there's no Calendly/Cal.com (or similar) integration, so "Book Discovery Call"
  degrades to a `mailto:`. Wire a real scheduling embed once one is chosen.
- **`site_blocks` decision** (Phase 4 carry-over, still open): About/Services "Engagement Models"+"Quality
  Guarantees"/Projects "Engineering Rigor"/Process "Operational Rhythm"+"Risk Mitigation"/Contact
  sidebar/CTA bands remain hardcoded JSX, not CMS-editable. Needs a decision (generic `site_blocks` table vs.
  per-section tables vs. leave as code) before anyone builds it.
- **Responsive QA at design.md breakpoints** — not done; this sandbox has no browser to visually verify
  against real viewports. The two dashboards above were built mobile-first with the same grid/stack patterns
  already used elsewhere in the app (`grid-cols-1` → `sm:`/`md:`/`lg:`), but that's inference from the
  existing responsive components, not a verified pass.
- **Deploy notes** — not written yet (target host still undecided).

**Verification done:** re-read every touched file for import/type correctness against `lib/types.ts` and
the existing component prop shapes (`Button`'s discriminated union now includes `external?: boolean` on the
link branch, `never` on the button branch, so the two variants don't collide).

**Build actually verified this pass** (deps installed fresh in the sandbox):
- `npx tsc --noEmit` clean on both `apps/web` and `apps/server`.
- `npx next build` succeeds. Had to temporarily swap the Google-fonts `Plus_Jakarta_Sans` import for a
  fontless layout to work around this sandbox's lack of network access to `fonts.googleapis.com` (same
  workaround Phase 2 used) — reverted immediately after, `app/layout.tsx` is back to the real Google Font.
  **This confirms the `ClerkProvider` scoping actually worked**: `/`, `/about`, `/services`, `/process`,
  `/projects` now build as `○ (Static)`; `/admin/*`, `/portal/*`, `/sign-in`, `/sign-up` correctly stay
  `ƒ (Dynamic)`. Before this phase every route built dynamic (see Phase 4 notes) — that regression is fixed.
- `apps/server` compiles clean with `tsc` (no `dist/` shipped, build is a build step) and **boots for real**:
  started with dummy env vars, `GET /health` → `200 {"ok":true}`.
- **Rate limiter verified live**: fired 6 rapid `POST /api/leads` at a running instance (dummy Supabase, so
  each individually 500s past the limiter) — requests 1–5 reached the (failing) DB call, request 6 got
  `429` with a `Retry-After` header, exactly as designed.
- Not verified: real Supabase/Clerk credentials (still can't reach either from this sandbox), so the actual
  data paths (lead insert, `/api/me` role check, admin/portal auth flows) are unexercised end-to-end.

## Phase 7 — pass 2 (mobile nav, SEO, favicon, filters) — DONE

- **Mobile navigation** (`components/Navbar.tsx`): hamburger button (`md:hidden`) toggles a dropdown panel with all
  `NAV_LINKS` + "Start a Project". Closes on route change and on Escape; `aria-expanded`/`aria-controls`/`aria-current`.
- **Working category filters** (`components/CategoryFilter.tsx`: `FilterProvider` / `FilterChips` / `FilterItem`) on
  `/services` and `/projects`. Items stay server-rendered (pages remain static/ISR); filtering only toggles visibility
  client-side. **Chips are derived from the categories present in the CMS data**, not hardcoded, so a chip can never
  produce an empty page and admin edits to `category` flow through. Consequence: the Services chip reads
  "Android & Hybrid" (the `services.category` value in database.md) where the original mockup said "Android & Mobile".
  Chips are hidden if there is only one category.
- **SEO**: `lib/seo.ts` (`pageMetadata()` + `SITE_URL`); root layout has `metadataBase`, title template
  `%s | SiliconBrains`, OG/Twitter defaults, `themeColor`; every public page has its own title/description/canonical/OG
  (project detail included — its old hand-rolled " — SiliconBrains" suffix was removed to avoid a doubled suffix).
  `app/sitemap.ts` (static routes + project slugs; falls back to static routes if the API is down), `app/robots.ts`
  (disallows /admin, /portal, /sign-in, /sign-up), `app/opengraph-image.tsx` (generated 1200x630 share card),
  `noindex` metadata on the admin/portal/sign-in/sign-up layouts.
- **Favicon**: `app/icon.svg` (same layered-diamond mark as the navbar). Still a placeholder mark, not the real eagle logo.
- **New env var**: `NEXT_PUBLIC_SITE_URL` (in `.env.local.example`) — set to the production origin or canonical URLs,
  sitemap and OG URLs will point at localhost.

**Verification:** `tsc --noEmit` clean; `next build` OK (same font/Clerk-dummy workaround as before, in a scratch copy) —
public pages still `○ Static`, plus `/robots.txt`, `/sitemap.xml`, `/icon.svg`, `/opengraph-image` static. Against a mock
API with the real seed data, `next start` served: correct chips on both pages, per-page `<title>`/canonical/og:title,
project-detail title, robots.txt, sitemap with all 4 project slugs, OG image `200 image/png`, `noindex` on /sign-in.
Filter component behaviour (click → show/hide → back to All) exercised in jsdom.
**Not verified:** a real browser (visual look of the mobile menu and chips, tap targets, menu overlap with page content).

## Phase 7 — pass 3 (Next.js patch bump, public testimonials) — DONE

- **`next` 14.2.5 → 14.2.35** (`apps/web/package.json` + `package-lock.json`). 14.2.35 is the latest 14.x release and the
  only one of the versions checked (14.2.5, 14.2.34, 14.2.35) that npm does *not* flag as vulnerable (the flag points at
  nextjs.org/blog/security-update-2025-12-11). Stayed on the 14 line on purpose — a 15/16 upgrade is a separate migration.
  `@clerk/nextjs@5.x` peer range covers 14.x. `tsc` clean on both apps and `next build` succeeds on 14.2.35; no code changes
  were needed.
- **Testimonials on the landing page**: `components/Testimonials.tsx` (server component, up to 3 cards: quote, name,
  "role · company"), placed above the final CTA. It **renders nothing when there are no testimonials** — none are seeded, so
  the site looks unchanged until you add real ones in Admin → Testimonials (only `published = true` rows are public).
- `GET /api/testimonials` now orders newest-first (`created_at desc`); previously unordered, so which 3 were shown was arbitrary.

**Verification:** against the mock API — empty list → no "Client Voices" section in the HTML, all 6 public pages 200;
2 testimonials → section renders with names, "CTO · Apex Protocols Ltd", and a name-only byline when role/company are null.
(Gotcha found while testing: `next build` reuses `.next/cache` fetch data for up to 60s, so rebuild from a clean `.next`
when changing the API data you're verifying against.) **Not verified:** real browser look of the testimonial cards.

## Next up: rest of Phase 7
Real browser QA of `/admin` and `/portal` against live Clerk + Supabase (never rendered in a browser so far), incl. empty
states; responsive QA (mobile menu, chips, testimonial cards); real social URLs (`lib/nav.ts`); a scheduling integration
(Calendly/Cal.com) to replace the `mailto:`; the `site_blocks` decision; deploy notes; real logo/favicon; landing hero
mock card (optional); tests/CI.
