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
    <header className="sticky top-4 z-50 mx-auto w-full max-w-container px-4 md:px-10">
      <div className="flex items-center justify-between rounded-full border border-outline bg-surface-container/70 px-4 py-2.5 backdrop-blur-xl md:px-6">
        <Link href="/portal" className="text-sm font-semibold text-on-surface">
          SiliconBrains <span className="text-primary">Client Portal</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
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
