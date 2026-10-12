import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

const links = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-on-surface">
      {/* Ambient glow + faint engineering grid (tokens only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 50% 38%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 70%), linear-gradient(var(--color-outline) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline) 1px, transparent 1px)',
          backgroundSize: 'auto, 56px 56px, 56px 56px',
          maskImage: 'radial-gradient(70% 60% at 50% 40%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 40%, #000 30%, transparent 100%)',
        }}
      />

      <div className="w-full max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-outline bg-surface-container px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
          Error 404
        </span>

        <p
          aria-hidden
          className="mt-6 select-none bg-gradient-to-b from-on-surface via-primary to-transparent bg-clip-text font-display text-[clamp(7rem,24vw,15rem)] font-semibold leading-[0.9] tracking-tight text-transparent"
        >
          404
        </p>

        <h1 className="-mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-on-surface-variant">
          The link may be broken, or the page may have been moved or removed. Head back to a
          known route and you&apos;ll be on your way.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-on-primary transition hover:shadow-[0_0_20px_rgba(142,182,155,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-outline px-7 py-3 text-sm font-medium text-on-surface transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Contact us
          </Link>
        </div>

        <nav aria-label="Popular pages" className="mt-12 border-t border-outline pt-6">
          <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Popular pages</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block rounded-full border border-outline bg-surface-container px-4 py-1.5 text-sm text-on-surface-variant transition hover:-translate-y-0.5 hover:border-primary hover:text-on-surface"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}