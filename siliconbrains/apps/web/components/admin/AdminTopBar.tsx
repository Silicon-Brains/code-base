"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const PAGES = [
  { label: "Dashboard", href: "/admin", group: "Overview" },
  { label: "Enquiries", href: "/admin/leads", group: "Clients" },
  { label: "Messages", href: "/admin/messages", group: "Clients" },
  { label: "Client directory", href: "/admin/clients", group: "Clients" },
  { label: "Engagements", href: "/admin/engagements", group: "Delivery" },
  { label: "Milestones", href: "/admin/milestones", group: "Delivery" },
  { label: "Invoices", href: "/admin/invoices", group: "Delivery" },
  { label: "Case studies", href: "/admin/projects", group: "Content" },
  { label: "Services", href: "/admin/services", group: "Content" },
  { label: "Testimonials", href: "/admin/testimonials", group: "Content" },
  { label: "FAQs", href: "/admin/faqs", group: "Content" },
  { label: "Process steps", href: "/admin/process", group: "Content" },
  { label: "Blog", href: "/admin/blog", group: "Content" },
  { label: "Users", href: "/admin/users", group: "Workspace" },
  { label: "Analytics", href: "/admin/analytics", group: "Workspace" },
  { label: "Settings", href: "/admin/settings", group: "Workspace" },
];

export default function AdminTopBar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const title = PAGES.find(({ href }) => href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`))?.label ?? "Admin";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const isDark = window.localStorage.getItem("siliconbrains-admin-theme") === "dark";
    setDarkTheme(isDark);
    document.querySelector(".theme-admin")?.classList.toggle("theme-admin-dark", isDark);
  }, []);

  function toggleTheme() {
    const nextIsDark = !darkTheme;
    setDarkTheme(nextIsDark);
    document.querySelector(".theme-admin")?.classList.toggle("theme-admin-dark", nextIsDark);
    window.localStorage.setItem("siliconbrains-admin-theme", nextIsDark ? "dark" : "light");
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return PAGES.filter((page) => !normalized || `${page.label} ${page.group}`.toLowerCase().includes(normalized));
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <header className="admin-topbar sticky top-0 z-30 flex items-center gap-4 border-b border-[var(--admin-sidebar-border)] bg-[var(--admin-header-bg)]/95 px-5 py-3.5 backdrop-blur md:px-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-on-surface-variant">Workspace</p>
          <p className="text-sm font-semibold text-on-surface">{title}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch admin to ${darkTheme ? "light" : "dark"} theme`}
            title={`Switch admin to ${darkTheme ? "light" : "dark"} theme`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline bg-surface text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {darkTheme ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex h-9 items-center gap-2 rounded-lg border border-outline bg-surface px-3 text-xs text-on-surface-variant transition hover:border-primary/40 hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Quick jump</span>
            <kbd className="hidden rounded border border-outline bg-surface-container-low px-1.5 py-0.5 font-sans text-[10px] sm:inline">⌘ K</kbd>
          </button>
          <span className="hidden h-8 w-px bg-outline sm:block" aria-hidden="true" />
          <a href="/" target="_blank" rel="noreferrer" className="hidden rounded-lg px-3 py-2 text-xs font-medium text-on-surface-variant transition hover:bg-surface hover:text-on-surface sm:inline-flex">
            View website
          </a>
        </div>
      </header>

      {open && (
        <div className="admin-command-backdrop fixed inset-0 z-[100] flex items-start justify-center bg-[#111915]/45 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="admin-command-title" className="admin-command-panel w-full max-w-xl overflow-hidden rounded-2xl border border-outline bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-3 border-b border-outline px-4 py-3">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-on-surface-variant" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <label id="admin-command-title" htmlFor="admin-command-search" className="sr-only">Find an admin page</label>
              <input id="admin-command-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an admin page…" className="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70" />
              <kbd className="rounded border border-outline px-1.5 py-0.5 text-[10px] text-on-surface-variant">ESC</kbd>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-2" role="listbox" aria-label="Admin pages">
              {results.length ? results.map((page) => (
                <button key={page.href} type="button" role="option" aria-selected={pathname === page.href} onClick={() => navigate(page.href)} className="group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-secondary-container focus-visible:bg-secondary-container focus-visible:outline-none">
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline bg-surface text-primary" aria-hidden="true">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                    <span className="text-sm font-medium text-on-surface">{page.label}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">{page.group}</span>
                </button>
              )) : <p className="px-3 py-8 text-center text-sm text-on-surface-variant">No admin pages match “{query}”.</p>}
            </div>
            <div className="border-t border-outline bg-surface-container-low px-4 py-2.5 text-[10px] text-on-surface-variant">Navigate the admin workspace · Esc to close</div>
          </section>
        </div>
      )}
    </>
  );
}
