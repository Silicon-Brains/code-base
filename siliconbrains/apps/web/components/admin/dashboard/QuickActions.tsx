import Link from "next/link";

const ACTIONS = [
  { label: "New Enquiry",   href: "/admin/leads",       icon: "inbox" },
  { label: "New Project",   href: "/admin/engagements", icon: "folder" },
  { label: "New Blog Post", href: "/admin/blog",        icon: "pencil" },
  { label: "Manage Users",  href: "/admin/users",       icon: "users" },
];

export default function QuickActions() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-outline bg-surface p-5">
      <h2 className="mb-3 text-sm font-bold text-on-surface">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-start gap-2 rounded-lg border border-outline bg-surface-container-low px-3 py-3 text-[11px] font-medium text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {a.icon === "inbox" && <path d="M3 12l3-7h12l3 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7zM3 12h5l1 3h6l1-3h5" />}
              {a.icon === "folder" && <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />}
              {a.icon === "pencil" && <><path d="M4 20h4l11-11-4-4L4 16v4z" /><path d="M14 5l5 5" /></>}
              {a.icon === "users" && <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0112 0M16 5a3.5 3.5 0 010 7M22 20a5 5 0 00-4-4.9" /></>}
            </svg>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}