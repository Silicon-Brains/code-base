# SiliconBrains — Database Schema (Supabase / PostgreSQL)

All tables use `uuid` primary keys (`default gen_random_uuid()`) and `created_at`/`updated_at` timestamps unless noted. RLS is enabled on every table; Express uses the service-role key so it bypasses RLS and enforces access in application code (see architecture.md §2).

## profiles
Synced from Clerk via webhook.
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| clerk_user_id | text unique | |
| email | text | |
| full_name | text | |
| role | text | `admin` \| `client`, default `client` |
| company_name | text | nullable, client's org |

## services
| column | type |
|---|---|
| id | uuid PK |
| title | text |
| slug | text unique |
| icon | text | icon name/key |
| category | text | filter key: `Full-Stack Web` \| `Android & Hybrid` \| `Cloud & DevOps` \| `AI & Machine Learning` |
| tag | text | card badge, e.g. `Distributed Systems` (003) |
| features | text[] | card checklist (003) |
| metric_label / metric_value | text | highlighted metric, e.g. `Throughput Efficiency` / `48.2k req/sec` (003) |
| description | text |
| deliverables | text[] |
| architecture_baseline | text[] |
| sort_order | int |
| published | boolean default true |

## projects  (public portfolio / case studies)
| column | type |
|---|---|
| id | uuid PK |
| title | text |
| slug | text unique |
| summary | text |
| category | text | e.g. `Full-Stack Web`, `Android & Mobile`, `AI & Computer Vision` |
| tech_stack | text[] |
| metrics | jsonb | ordered array, e.g. `[{"value":"+340%","label":"Retention Gain"}]` |
| tag | text | display label, e.g. `Full-Stack Web & IoT` (003) |
| highlights | text[] | flagship bullet points (003) |
| cover_image_url | text |
| featured | boolean default false |
| sort_order | int |
| published | boolean default true |

## testimonials
| column | type |
|---|---|
| id | uuid PK |
| author_name | text |
| author_role | text |
| company | text |
| quote | text |
| published | boolean default true |

## faqs
| column | type |
|---|---|
| id | uuid PK |
| question | text |
| answer | text |
| page | text | which page it belongs to, e.g. `contact` |
| sort_order | int |

## process_steps
| column | type |
|---|---|
| id | uuid PK |
| phase_number | int |
| title | text |
| subtitle | text |
| core_focus | text[] |
| key_deliverables | text[] |
| description | text | paragraph under the title (003) |
| artifact_label / artifact_note | text | right-hand panel, e.g. `Topology Map` / `Terraform v1.5` (003) |
| quality_gate | text |

## leads  (Contact form submissions)
| column | type |
|---|---|
| id | uuid PK |
| full_name | text |
| work_email | text |
| organization | text |
| website | text |
| domain_interest | text[] | which "Core Engineering Domain" checkboxes |
| budget_range | text |
| timeline | text |
| message | text |
| nda_requested | boolean | default false (003) |
| status | text | `new` \| `contacted` \| `converted` \| `archived`, default `new` |

## client_projects  (a client's engagement — drives the Portal)
| column | type |
|---|---|
| id | uuid PK |
| client_profile_id | uuid FK → profiles.id |
| title | text |
| current_phase | int | 1–5, maps to process_steps.phase_number |
| status_summary | text | short free-text status |
| progress_percent | int |

## milestones
| column | type |
|---|---|
| id | uuid PK |
| client_project_id | uuid FK → client_projects.id |
| title | text |
| due_date | date |
| status | text | `pending` \| `in_progress` \| `done` |
| notes | text |

## invoices
| column | type |
|---|---|
| id | uuid PK |
| client_project_id | uuid FK → client_projects.id |
| invoice_number | text |
| amount | numeric |
| currency | text default 'USD' |
| status | text | `pending` \| `paid` \| `overdue` |
| issued_date | date |
| due_date | date |

## RLS policy summary
- `profiles`: user can `select` own row; service role bypasses for everything else.
- `services`, `projects`, `testimonials`, `faqs`, `process_steps`: public `select` where `published = true`; writes blocked (Express service role only).
- `leads`: no public select; `insert` allowed for anon (contact form) via a scoped RPC/policy, not direct table access — actual writes go through Express to keep validation server-side.
- `client_projects`, `milestones`, `invoices`: no direct client access — always via Express `portal.routes.ts`, which filters by the authenticated user's `profile.id`.
