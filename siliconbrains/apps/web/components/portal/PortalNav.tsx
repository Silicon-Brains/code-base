"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const LINKS = [
  { label: "Dashboard", href: "/portal" },
  { label: "Invoices", href: "/portal/invoices" },
];

export default function PortalNav() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/portal" ? pathname === "/portal" || pathname?.startsWith("/portal/projects") : pathname?.startsWith(href));

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-container px-2 sm:px-4 md:px-10">
      <div className="flex min-w-0 items-center justify-between gap-2 rounded-full border border-outline bg-surface-container/70 px-3 py-2.5 backdrop-blur-xl sm:px-4 md:px-6">
        <Link href="/portal" className="min-w-0 truncate text-xs font-semibold text-on-surface sm:text-sm">
          SiliconBrains <span className="hidden text-primary sm:inline">Client Portal</span>
        </Link>
        <nav aria-label="Client portal" className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full px-2 py-1.5 text-xs transition-colors sm:px-4 sm:text-sm ${
                isActive(l.href) ? "bg-primary/15 text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="ml-2 hidden text-xs text-on-surface-variant hover:text-on-surface sm:inline">
            Contact us
          </Link>
          <span className="ml-3 flex items-center">
            <UserButton afterSignOutUrl="/" />
          </span>
        </nav>
      </div>
    </header>
  );
}
