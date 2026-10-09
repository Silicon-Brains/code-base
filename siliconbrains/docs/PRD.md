# SiliconBrains — Product Requirements Document

## 1. Overview
SiliconBrains is a software engineering agency website ("Be The Premium" / sovereign-engineering brand).
The product has three surfaces:

1. **Public marketing site** — 6 pages (Landing, Services, Projects, About, Process, Contact), content-driven from a CMS instead of hardcoded.
2. **Client Portal** (Clerk-authenticated, role: `client`) — clients log in to see their project(s) status, milestones, and invoices.
3. **Admin Dashboard** (Clerk-authenticated, role: `admin`) — internal team manages all site content and client data.

## 2. Goals
- Public pages match the provided designs/DESIGN.md pixel-for-pixel in spirit (dark green sovereign-engineering system).
- All content shown publicly (services, portfolio projects, testimonials, process steps, FAQs) is editable from the Admin Dashboard — no redeploy needed to change copy.
- Contact form submissions are captured as **Leads** in Supabase, visible to admin.
- Clients can log in and see live status of their engagement (phase, milestones, deliverables, invoices) — mirrors the "5-Phase Sovereign Lifecycle" shown on the Process page.
- Admin can create a client project record, assign phases/milestones, and issue invoices; the client only sees their own data (row-level security).

## 3. Roles
| Role | Access |
|---|---|
| `guest` | Public pages, can submit Contact form |
| `client` | Client Portal: own project(s), milestones, invoices |
| `admin` | Admin Dashboard: full CRUD on all content + all client projects/leads/invoices |

Role is stored in Supabase `profiles` table, keyed by Clerk `user_id`, set via Clerk metadata synced on webhook.

## 4. Public Pages (content sourced from CMS)
- **Landing** — hero, stat bar, philosophy block, 4 engineering principles, comparison table (us vs generic agency), team/capabilities, CTA
- **Services** — service categories (Full-Stack Web, Android, Cloud/DevOps, AI), each with deliverables list + engagement models
- **Projects** — portfolio/case studies grid, each with stack tags, metrics, "View Case Study" detail
- **Process** — 5-phase lifecycle, collaboration cadence, quality gates
- **About** — mission/vision, core principles, "why choose us" comparison, team composition
- **Contact** — lead capture form, discovery-call booking info (static/manual for v1), FAQs

## 5. Client Portal
- Dashboard: current project(s) card — phase, % progress, next milestone, latest update
- Project detail: milestone timeline, uploaded deliverables/links, status log
- Invoices: list, status (paid/pending/overdue), amount — no online payment in v1, just visibility

## 6. Admin Dashboard
- Content CMS: Services, Projects (portfolio), Testimonials, FAQs, Process steps — full CRUD
- Leads: list of Contact form submissions, mark status (new/contacted/converted/archived)
- Clients: create client (invite via Clerk), create/manage their Project(s), milestones, invoices

## 7. Out of scope (v1)
- Online payments / invoice payment processing
- Real-time chat
- Automated discovery-call scheduling (booking widget is a static "email us" link for v1)
- Multi-language

## 8. Non-functional
- Dark theme only, per DESIGN.md tokens
- Mobile responsive (breakpoints per DESIGN.md grid spec)
- Express API is the single source of truth; Next.js never talks to Supabase directly except for Clerk-issued auth checks on protected routes
