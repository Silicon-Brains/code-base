"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import type { ReactNode } from "react";

const NAV: { label: string; href: string; icon: string }[] = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Enquiries", href: "/admin/leads", icon: "inbox" },
  { label: "Messages", href: "/admin/messages", icon: "message" },
  { label: "Clients", href: "/admin/clients", icon: "users" },
  { label: "Engagements", href: "/admin/engagements", icon: "folder" },
  { label: "Milestones", href: "/admin/milestones", icon: "check" },
  { label: "Invoices", href: "/admin/invoices", icon: "receipt" },
  { label: "Case studies", href: "/admin/projects", icon: "layers" },
  { label: "Services", href: "/admin/services", icon: "cube" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "star" },
  { label: "FAQs", href: "/admin/faqs", icon: "help" },
  { label: "Process steps", href: "/admin/process", icon: "flow" },
  { label: "Blog", href: "/admin/blog", icon: "pencil" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart" },
  { label: "Settings", href: "/admin/settings", icon: "gear" },
];

const ICONS: Record<string, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  inbox: (
    <path d="M3 12l3-7h12l3 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7zM3 12h5l1 3h6l1-3h5" />
  ),
  folder: (
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  ),
  cube: <path d="M12 3l9 5v8l-9 5-9-5V8l9-5zM3 8l9 5 9-5M12 13v9" />,
  star: (
    <path d="M12 3l2.6 6 6.4.6-4.8 4.4 1.4 6.4L12 17l-5.6 3 1.4-6.4L3 9.2l6.4-.6L12 3z" />
  ),
  pencil: (
    <>
      <path d="M4 20h4l11-11-4-4L4 16v4z" />
      <path d="M14 5l5 5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20a6 6 0 0112 0M16 5a3.5 3.5 0 010 7M22 20a5 5 0 00-4-4.9" />
    </>
  ),
  chart: <path d="M4 20V4M4 20h16M8 16v-4M13 16V8M18 16v-7" />,
  message: <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z" />,
  check: <path d="M5 12l4 4L19 6M4 4h5M4 20h16" />,
  receipt: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 015 0c0 1.7-2.5 2-2.5 4M12 17h.01" /></>,
  flow: <><rect x="3" y="3" width="7" height="6" rx="1" /><rect x="14" y="15" width="7" height="6" rx="1" /><path d="M6.5 9v4a3 3 0 003 3H14M17.5 15v-4a3 3 0 00-3-3H10" /></>,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </>
  ),
};

function Icon({ name }: { name: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {ICONS[name]}
    </svg>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  return (
    <aside className="admin-sidebar flex flex-col border-b border-[var(--admin-sidebar-border)] bg-[var(--admin-sidebar-bg)] md:sticky md:top-0 md:h-screen md:w-[248px] md:shrink-0 md:border-b-0 md:border-r">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary text-on-primary">
          <img
            src="/icon.svg"
            alt="SiliconBrains"
            className="h-full w-full object-cover"
          />
        </span>
        <div>
          <p className="text-sm font-bold leading-none text-on-surface">
            SiliconBrains
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-on-surface-variant">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:gap-0.5 md:overflow-visible md:pb-0">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`admin-nav-link flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-secondary-container text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="hidden items-center gap-3 border-t border-[var(--admin-sidebar-border)] px-4 py-4 md:flex">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container text-xs font-semibold text-primary">
          {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-on-surface">
            {user?.fullName ?? user?.firstName ?? "Admin"}
          </p>
          <p className="truncate text-[10px] text-on-surface-variant">
            {user?.primaryEmailAddress?.emailAddress ?? ""}
          </p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
}
