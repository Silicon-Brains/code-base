import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://www.github.com/mr-d-luffy/",
    icon: (
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.6-4.6 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohit-shivankar-a87964340/",
    icon: (
      <>
        <path d="M6.94 6.5a1.94 1.94 0 100-3.88 1.94 1.94 0 000 3.88zM5 8.5h3.88v10.5H5zM10.5 8.5h3.72v1.43h.05c.52-.95 1.79-1.95 3.68-1.95 3.93 0 4.65 2.4 4.65 5.53V19h-3.88v-4.9c0-1.17-.02-2.67-1.75-2.67-1.76 0-2.02 1.27-2.02 2.58V19H10.5z" />
      </>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/siliconbrains.in/",
    icon: (
      <>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-container px-4 pb-10 md:px-10">
      <div className="grid grid-cols-1 gap-10 border-t border-outline pt-10 md:grid-cols-[2fr_auto_auto]">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
              <img
                src="/icon.svg"
                alt="SiliconBrains icon"
                width={36}
                height={36}
              />
            </span>
            <span className="text-sm font-bold tracking-tight text-on-surface">
              SiliconBrains
            </span>
          </div>
          <p className="max-w-xs text-sm text-on-surface-variant">
            Building modern digital products for ambitious ideas.
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
            Quick Links
          </p>
          <ul className="flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <div className="mb-6 flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-outline bg-surface text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant">
            © 2026 SiliconBrains. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
