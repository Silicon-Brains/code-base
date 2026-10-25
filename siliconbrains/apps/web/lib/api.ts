import type {
  Service,
  Project,
  Faq,
  ProcessStep,
  Testimonial,
  LeadPayload,
  PortalProject,
  PortalProjectDetail,
  PortalInvoice,
  PortalSprintView,
  AdminCommandCenter,
  AdminDashboard,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const { token, ...rest } = init ?? {};
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers ?? {}),
    },
    // Public GETs are ISR-cached; authed calls and mutations bypass the cache.
    ...(!token && (rest.method ?? "GET") === "GET"
      ? { next: { revalidate: 60 } }
      : { cache: "no-store" as const }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Request failed: ${res.status}`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // --- Public (no auth) ---
  getServices: () => request<Service[]>("/api/services"),
  getProjects: () => request<Project[]>("/api/projects"),
  getProject: (slug: string) => request<Project>(`/api/projects/${encodeURIComponent(slug)}`),
  getTestimonials: () => request<Testimonial[]>("/api/testimonials"),
  getFaqs: (page?: string) =>
    request<Faq[]>(`/api/faqs${page ? `?page=${encodeURIComponent(page)}` : ""}`),
  getProcessSteps: () => request<ProcessStep[]>("/api/process-steps"),
  submitLead: (payload: LeadPayload) =>
    request<{ ok: true }>("/api/leads", { method: "POST", body: JSON.stringify(payload) }),

  // --- Portal (client, auth required) ---
  portal: {
    getProjects: (token: string) =>
      request<PortalProject[]>("/api/portal/projects", { token }),
    getProject: (token: string, id: string) =>
      request<PortalProjectDetail>(`/api/portal/projects/${encodeURIComponent(id)}`, { token }),
    getInvoices: (token: string) =>
      request<PortalInvoice[]>("/api/portal/invoices", { token }),
    getSprint: (token: string, id: string) =>
      request<PortalSprintView>(`/api/portal/projects/${encodeURIComponent(id)}/sprint`, { token }),
  },

  // --- Admin (admin, auth required) ---
  admin: {
    // Generic CRUD used by the ResourceManager.
    list: <T = Record<string, unknown>[]>(token: string, resource: string) =>
      request<T>(`/api/admin/${resource}`, { token }),
    create: <T = Record<string, unknown>>(token: string, resource: string, body: unknown) =>
      request<T>(`/api/admin/${resource}`, { method: "POST", token, body: JSON.stringify(body) }),
    update: <T = Record<string, unknown>>(
      token: string,
      resource: string,
      id: string,
      body: unknown
    ) =>
      request<T>(`/api/admin/${resource}/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(body),
      }),
    remove: (token: string, resource: string, id: string) =>
      request<void>(`/api/admin/${resource}/${id}`, { method: "DELETE", token }),

    // Named aggregations.
    overview: (token: string) => request("/api/admin/overview", { token }),
    commandCenter: <T = AdminCommandCenter>(token: string) =>
      request<T>("/api/admin/command-center", { token }),
    dashboard: <T = AdminDashboard>(token: string) =>
      request<T>("/api/admin/dashboard", { token }),
  },
};

/**
 * For public Server Components: a CMS outage should degrade a section to its
 * empty state, not fail the whole page (or a `next build`). Failures are logged.
 */
export async function loadOr<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[cms] failed to load ${label}:`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

