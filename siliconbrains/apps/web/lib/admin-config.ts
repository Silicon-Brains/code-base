// Serializable configs for the admin ResourceManager (one per CMS/engagement table).
import type { ColumnDef, FieldDef } from "./admin-form";

export interface ResourceConfig {
  resource: string; // path segment under /api/admin
  title: string;
  noun: string;
  description: string;
  fields: FieldDef[];
  columns: ColumnDef[];
}

const SERVICE_CATEGORIES = ["Full-Stack Web", "Android & Hybrid", "Cloud & DevOps", "AI & Machine Learning"];
const PROJECT_CATEGORIES = ["Full-Stack Web", "Android & Mobile", "AI & Computer Vision", "Enterprise Systems"];

export const SERVICES: ResourceConfig = {
  resource: "services",
  title: "Services",
  noun: "service",
  description: "Shown on the Landing (first two) and Services pages. Changes appear on the public site within ~60 seconds.",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", required: true, help: "Generated from the title; lowercase letters, numbers, and hyphens only. You can edit it." },
    { key: "category", label: "Category", type: "select", options: SERVICE_CATEGORIES },
    { key: "tag", label: "Tag", type: "text", help: 'Small badge, e.g. "Distributed Systems"' },
    { key: "icon", label: "Icon key", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "features", label: "Feature bullets", type: "list", help: "One per line" },
    { key: "deliverables", label: "Production deliverables", type: "list", help: "One per line" },
    { key: "architecture_baseline", label: "Architecture baseline", type: "list", help: "One per line (tech names)" },
    { key: "metric_label", label: "Metric label", type: "text" },
    { key: "metric_value", label: "Metric value", type: "text" },
    { key: "sort_order", label: "Sort order", type: "number", default: "0" },
    { key: "published", label: "Published", type: "boolean", default: true },
  ],
  columns: [
    { key: "sort_order", label: "#" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "published", label: "Published", format: "bool" },
  ],
};

export const PROJECTS: ResourceConfig = {
  resource: "projects",
  title: "Projects",
  noun: "project",
  description: "Portfolio / case studies. The one marked Featured becomes the flagship card on /projects.",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", required: true, help: "Generated from the title; used in /projects/<slug>. You can edit it." },
    { key: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES },
    { key: "tag", label: "Display tag", type: "text", help: 'e.g. "Full-Stack Web & IoT"' },
    { key: "summary", label: "Summary", type: "textarea" },
    { key: "highlights", label: "Highlights", type: "list", help: "One per line (shown for featured projects)" },
    { key: "tech_stack", label: "Tech stack", type: "list", help: "One per line" },
    {
      key: "metrics",
      label: "Metrics (JSON)",
      type: "json",
      help: 'Array of {"value": "+340%", "label": "Retention Gain"} — max 6',
    },
    { key: "cover_image_url", label: "Cover image URL", type: "text" },
    { key: "featured", label: "Featured flagship", type: "boolean" },
    { key: "sort_order", label: "Sort order", type: "number", default: "0" },
    { key: "published", label: "Published", type: "boolean", default: true },
  ],
  columns: [
    { key: "sort_order", label: "#" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "featured", label: "Featured", format: "bool" },
    { key: "published", label: "Published", format: "bool" },
  ],
};

export const TESTIMONIALS: ResourceConfig = {
  resource: "testimonials",
  title: "Testimonials",
  noun: "testimonial",
  description: "The public site has no testimonials section yet — entries are stored and served by the API but not displayed.",
  fields: [
    { key: "author_name", label: "Author name", type: "text", required: true },
    { key: "author_role", label: "Author role", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "quote", label: "Quote", type: "textarea", required: true },
    { key: "published", label: "Published", type: "boolean", default: true },
  ],
  columns: [
    { key: "author_name", label: "Author" },
    { key: "company", label: "Company" },
    { key: "quote", label: "Quote" },
    { key: "published", label: "Published", format: "bool" },
  ],
};

export const FAQS: ResourceConfig = {
  resource: "faqs",
  title: "FAQs",
  noun: "FAQ",
  description: "Currently shown on the Contact page (page = contact). Each (page, order) pair must be unique.",
  fields: [
    { key: "question", label: "Question", type: "text", required: true },
    { key: "answer", label: "Answer", type: "textarea", required: true },
    { key: "page", label: "Page", type: "text", default: "contact", required: true },
    { key: "sort_order", label: "Order", type: "number", required: true },
  ],
  columns: [
    { key: "page", label: "Page" },
    { key: "sort_order", label: "#" },
    { key: "question", label: "Question" },
  ],
};

export const PROCESS_STEPS: ResourceConfig = {
  resource: "process-steps",
  title: "Process steps",
  noun: "process step",
  description: "The delivery phases on /process and the Landing page. Phase numbers must be unique.",
  fields: [
    { key: "phase_number", label: "Phase number", type: "number", required: true },
    { key: "title", label: "Title", type: "text", required: true },
    { key: "subtitle", label: "Timing label", type: "text", help: 'e.g. "Week 1"' },
    { key: "description", label: "Description", type: "textarea" },
    { key: "core_focus", label: "Core engineering focus", type: "list", help: "One per line" },
    { key: "key_deliverables", label: "Key deliverables", type: "list", help: "One per line" },
    { key: "artifact_label", label: "Panel title", type: "text", help: 'Right-hand panel, e.g. "Topology Map"' },
    { key: "artifact_note", label: "Panel caption", type: "text" },
    { key: "quality_gate", label: "Quality gate", type: "text" },
  ],
  columns: [
    { key: "phase_number", label: "#" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Timing" },
    { key: "quality_gate", label: "Quality gate" },
  ],
};

export const ENGAGEMENTS: ResourceConfig = {
  resource: "client-projects",
  title: "Engagements",
  noun: "engagement",
  description:
    "A client's project as seen in their portal. Pick from clients who have signed up. Title, phase, progress and status summary are visible to the client.",
  fields: [
    {
      key: "client_profile_id",
      label: "Client",
      type: "select",
      required: true,
      optionsFrom: { resource: "clients", label: ["full_name", "email"] },
    },
    { key: "title", label: "Project title", type: "text", required: true },
    { key: "current_phase", label: "Current phase (1–5)", type: "number", default: "1" },
    { key: "progress_percent", label: "Progress %", type: "number", default: "0" },
    { key: "status_summary", label: "Status summary", type: "textarea" },
  ],
  columns: [
    { key: "client.email", label: "Client" },
    { key: "title", label: "Project" },
    { key: "current_phase", label: "Phase" },
    { key: "progress_percent", label: "Progress", format: "percent" },
  ],
};

export const MILESTONES: ResourceConfig = {
  resource: "milestones",
  title: "Milestones",
  noun: "milestone",
  description: "Timeline entries shown in the client portal for an engagement. Everything here is client-visible.",
  fields: [
    {
      key: "client_project_id",
      label: "Engagement",
      type: "select",
      required: true,
      optionsFrom: { resource: "client-projects", label: ["title"] },
    },
    { key: "title", label: "Title", type: "text", required: true },
    { key: "due_date", label: "Due date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["pending", "in_progress", "done"], default: "pending" },
    { key: "notes", label: "Notes", type: "textarea", help: "Visible to the client in their portal" },
  ],
  columns: [
    { key: "client_project_id", label: "Engagement", format: "option" },
    { key: "title", label: "Milestone" },
    { key: "due_date", label: "Due", format: "date" },
    { key: "status", label: "Status" },
  ],
};

export const INVOICES: ResourceConfig = {
  resource: "invoices",
  title: "Invoices",
  noun: "invoice",
  description: "Invoice records shown in the client portal (client-visible). This tracks status only — there is no payment processing.",
  fields: [
    {
      key: "client_project_id",
      label: "Engagement",
      type: "select",
      required: true,
      optionsFrom: { resource: "client-projects", label: ["title"] },
    },
    { key: "invoice_number", label: "Invoice number", type: "text", required: true },
    { key: "amount", label: "Amount", type: "number", required: true },
    { key: "currency", label: "Currency (3 letters)", type: "text", default: "USD" },
    { key: "status", label: "Status", type: "select", options: ["pending", "paid", "overdue"], default: "pending" },
    { key: "issued_date", label: "Issued", type: "date" },
    { key: "due_date", label: "Due", type: "date" },
  ],
  columns: [
    { key: "invoice_number", label: "Invoice" },
    { key: "client_project_id", label: "Engagement", format: "option" },
    { key: "amount", label: "Amount", format: "money", currencyKey: "currency" },
    { key: "status", label: "Status" },
    { key: "due_date", label: "Due", format: "date" },
  ],
};
