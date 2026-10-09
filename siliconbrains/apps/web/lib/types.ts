// Shapes returned by the Express public API (see docs/database.md + migrations 001–006).

// ---------------------------------------------------------------------------
// Public marketing CMS
// ---------------------------------------------------------------------------

export interface Service {
  id: string;
  slug: string;
  title: string;
  icon: string | null;
  category: string | null;
  tag: string | null;
  description: string | null;
  features: string[];
  deliverables: string[];
  architecture_baseline: string[];
  metric_label: string | null;
  metric_value: string | null;
  sort_order: number;
}

export interface ProjectMetric { value: string; label: string; }

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  tag: string | null;
  highlights: string[];
  tech_stack: string[];
  metrics: ProjectMetric[];
  cover_image_url: string | null;
  featured: boolean;
  sort_order: number;
}

export interface Faq { id: string; question: string; answer: string; page: string | null; sort_order: number; }

export interface ProcessStep {
  id: string;
  phase_number: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  core_focus: string[];
  key_deliverables: string[];
  artifact_label: string | null;
  artifact_note: string | null;
  quality_gate: string | null;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  quote: string;
}

export interface LeadPayload {
  full_name: string;
  work_email: string;
  organization?: string;
  website?: string;
  domain_interest?: string[];
  budget_range?: string;
  timeline?: string;
  message: string;
  nda_requested?: boolean;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export type LeadStatus = "new" | "contacted" | "converted" | "archived";

export interface Lead {
  id: string;
  full_name: string;
  work_email: string;
  organization: string | null;
  website: string | null;
  domain_interest: string[];
  budget_range: string | null;
  timeline: string | null;
  message: string;
  nda_requested: boolean;
  status: LeadStatus;
  created_at: string;
}

export interface AdminClient {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  created_at: string;
  client_projects: {
    id: string;
    title: string;
    current_phase: number;
    progress_percent: number;
    status_summary?: string | null;
  }[];
}

export interface AdminOverview {
  newLeads: number;
  totalLeads: number;
  clients: number;
  activeEngagements: number;
  unpaidInvoices: number;
  services: number;
  projects: number;
}

// ---------------------------------------------------------------------------
// Admin — Command Center (ops telemetry — migration 004)
// ---------------------------------------------------------------------------

export type ClusterStatus = "operational" | "stabilized" | "real-time" | "nominal" | "degraded" | "down";
export type PipelineStatus = "passed" | "running" | "failed" | "queued";

export interface OpsKpi {
  id: string;
  metric: string;
  label: string;
  value_label: string;
  sub_label: string | null;
  detail: string | null;
  sub_detail: string | null;
  trend: string | null;
  sort_order: number;
}

export interface OpsCluster {
  id: string;
  client_profile_id: string | null;
  client_project_id: string | null;
  node_name: string;
  initials: string | null;
  tier: string | null;
  region: string | null;
  node_count: number;
  throughput_label: string | null;
  latency_label: string | null;
  active_sprint: string | null;
  status: ClusterStatus;
  sla_percent: number | null;
  detail_line: string | null;
  sort_order: number;
}

export interface OpsPipelineRun {
  id: string;
  repo_name: string;
  title: string | null;
  commit_sha: string | null;
  branch: string | null;
  tests_summary: string | null;
  status: PipelineStatus;
  progress_percent: number;
  created_at: string;
}

export interface OpsSquad {
  id: string;
  name: string;
  utilization_percent: number;
  headcount: number;
  description: string | null;
  sort_order: number;
}

export interface OpsSecurityItem {
  id: string;
  icon: string | null;
  title: string;
  description: string | null;
  badge: string | null;
  sort_order: number;
}

export interface AdminCommandCenter {
  kpis: OpsKpi[];
  clusters: OpsCluster[];
  pipelines: OpsPipelineRun[];
  squads: OpsSquad[];
  security: OpsSecurityItem[];
  recentLeads: Lead[];
  recentClients: AdminClient[];
}

// ---------------------------------------------------------------------------
// Admin — Dashboard (redesign mockup #1)
// ---------------------------------------------------------------------------

export type ProjectLifecycleStatus = "ongoing" | "completed" | "planning" | "on_hold" | "cancelled";

export interface AdminDashboardKpi {
  value: number;
  delta: number;
  trend: "up" | "down" | "flat";
}

export interface AdminDashboard {
  kpis: {
    totalEnquiries: AdminDashboardKpi;
    activeProjects: AdminDashboardKpi;
    totalClients: AdminDashboardKpi;
    unreadMessages: AdminDashboardKpi;
  };
  enquiryTrend: Array<{ month: string; enquiries: number; converted: number }>;
  projectStatus: Array<{ status: ProjectLifecycleStatus; count: number }>;
  recentEnquiries: Array<{
    id: string;
    full_name: string;
    work_email: string;
    project_type: string | null;
    budget_range: string | null;
    status: LeadStatus;
    created_at: string;
  }>;
  recentProjects: Array<{
    id: string;
    title: string;
    category: string | null;
    status: ProjectLifecycleStatus;
    updated_at: string;
  }>;
  recentMessages: Array<{
    id: string;
    from_name: string;
    preview: string;
    unread: boolean;
    last_message_at: string;
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    due_date: string | null;
    project_title: string | null;
  }>;
}

// ---------------------------------------------------------------------------
// Admin — Blog / Team / Messages (tables exist in migration 006; endpoints later)
// ---------------------------------------------------------------------------

export type TeamRole = "admin" | "project_manager" | "developer" | "designer" | "tester" | "content_writer";
export type TeamStatus = "active" | "invited" | "disabled";
export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  author: string | null;
  excerpt: string | null;
  body: string | null;
  status: BlogStatus;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  last_active_at: string | null;
  created_at: string;
}

export interface MessageThread {
  id: string;
  lead_id: string | null;
  subject: string | null;
  from_name: string;
  from_email: string;
  unread: boolean;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  direction: "inbound" | "outbound";
  from_name: string | null;
  body: string;
  read: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Client Portal
// ---------------------------------------------------------------------------

export interface PortalProject {
  id: string;
  title: string;
  current_phase: number;
  status_summary: string | null;
  progress_percent: number;
  created_at: string;
  updated_at: string;
}

export type MilestoneStatus = "pending" | "in_progress" | "done";
export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface PortalMilestone {
  id: string;
  title: string;
  due_date: string | null;
  status: MilestoneStatus;
  notes: string | null;
  amount: number | null;
  currency: string | null;
  paid_at: string | null;
  paid_via: string | null;
}

export interface PortalInvoice {
  id: string;
  client_project_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued_date: string | null;
  due_date: string | null;
  project_title?: string | null;
}

export interface PortalProjectDetail extends PortalProject {
  milestones: PortalMilestone[];
  invoices: PortalInvoice[];
}

// ---------------------------------------------------------------------------
// Client Portal — Sprint View (migration 005)
// ---------------------------------------------------------------------------

export interface SprintCycle {
  id: string;
  sprint_label: string | null;
  dates_label: string | null;
  deliverables_done: number;
  deliverables_total: number;
  velocity_label: string | null;
  velocity_sub: string | null;
  build_label: string | null;
  build_sub: string | null;
  code_delta_label: string | null;
  commits_label: string | null;
  milestone_paid_label: string | null;
  milestone_total_label: string | null;
  milestone_status: string | null;
  cve_label: string | null;
  vulnerabilities_label: string | null;
  governance_label: string | null;
  governance_sub: string | null;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string | null;
  engineering_status: string | null;
  icon: string | null;
  sort_order: number;
}

export interface CodeRepository {
  id: string;
  name: string;
  description: string | null;
  branch: string | null;
  version_label: string | null;
  build_label: string | null;
  sort_order: number;
}

export interface RepoArtifact { id: string; label: string; sort_order: number; }

export interface PortalTeamMember {
  id: string;
  full_name: string;
  role: string | null;
  handle: string | null;
  status: string | null;
  sort_order: number;
}

export interface StagingDeployment {
  id: string;
  name: string;
  version_label: string | null;
  url: string | null;
  status: string | null;
  sort_order: number;
}

export interface PortalSprintView {
  project: PortalProject;
  sprint: SprintCycle | null;
  tasks: ProjectTask[];
  repositories: CodeRepository[];
  artifacts: RepoArtifact[];
  team: PortalTeamMember[];
  staging: StagingDeployment[];
}