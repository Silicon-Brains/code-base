"use client";

import { usePathname } from "next/navigation";

const TITLES: Array<{ match: RegExp; label: string }> = [
  { match: /^\/admin$/,                        label: "Dashboard" },
  { match: /^\/admin\/leads/,                  label: "Enquiries" },
  { match: /^\/admin\/engagements/,            label: "Projects" },
  { match: /^\/admin\/services/,               label: "Services" },
  { match: /^\/admin\/testimonials/,           label: "Testimonials" },
  { match: /^\/admin\/blog/,                   label: "Blog" },
  { match: /^\/admin\/users/,                  label: "Users" },
  { match: /^\/admin\/analytics/,              label: "Analytics" },
  { match: /^\/admin\/messages/,               label: "Messages" },
  { match: /^\/admin\/settings/,               label: "Settings" },
  { match: /^\/admin\/clients/,                label: "Clients" },
  { match: /^\/admin\/milestones/,             label: "Milestones" },
  { match: /^\/admin\/invoices/,               label: "Invoices" },
  { match: /^\/admin\/faqs/,                   label: "FAQs" },
  { match: /^\/admin\/process/,                label: "Process Steps" },
];

export default function AdminTopBar() {
  const pathname = usePathname() ?? "";
  const title = TITLES.find((t) => t.match.test(pathname))?.label ?? "Admin";

  return (
    <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-[var(--admin-sidebar-border)] bg-[var(--admin-header-bg)]/95 px-6 py-3.5 backdrop-blur md:px-8">
      <p className="text-sm font-semibold text-on-surface">{title}</p>

      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div className="hidden w-72 items-center gap-2 rounded-lg border border-outline bg-surface px-3 py-1.5 md:flex">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-on-surface-variant">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search enquiries, projects…"
            className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
          />
          <span className="shrink-0 rounded border border-outline bg-surface-container-low px-1.5 py-0.5 text-[10px] font-medium text-on-surface-variant">
            ⌘ K
          </span>
        </div>

        {/* Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-outline bg-surface text-on-surface-variant hover:text-on-surface"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.7 21a2 2 0 01-3.4 0" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-error" aria-hidden />
        </button>

        {/* Help */}
        <button
          type="button"
          aria-label="Help"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-outline bg-surface text-on-surface-variant hover:text-on-surface"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9a3 3 0 016 0c0 2-3 2-3 4M12 17h.01" />
          </svg>
        </button>
      </div>
    </div>
  );
}