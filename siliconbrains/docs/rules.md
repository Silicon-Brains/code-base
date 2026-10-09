# SiliconBrains — Engineering Rules

1. **Express owns Supabase.** Next.js never imports the Supabase client directly. All data goes through the Express API.
2. **Server role key never leaves `apps/server`.** Only `SUPABASE_SERVICE_ROLE_KEY` on the server; the web app never sees it.
3. **Every protected route checks role server-side** (`requireRole('admin' | 'client')`) — Next.js middleware is a UX gate, not the security boundary.
4. **Client Portal queries are always scoped** to `req.profile.id` — never trust a client-supplied `client_project_id` without verifying ownership first.
5. **All public content is CMS-driven** by Phase 4 — no page in `(public)/` should have hardcoded copy once Phase 4 lands, except legal/footer boilerplate.
6. **One design system.** All colors/spacing/type pull from `styles/tokens.css` (generated from DESIGN.md) — no ad-hoc hex codes in components.
7. **Full file rewrites over diffs** when iterating on generated code, per Aditya's preference.
8. **TypeScript everywhere** (`apps/web` and `apps/server`), strict mode on.
9. **Validation at the edge** — Express validates request bodies (zod) before touching Supabase; Next.js forms don't trust their own client-side validation alone.
10. **Migrations are files, not manual dashboard edits** — every schema change is a numbered `.sql` file in `apps/server/migrations/`.
