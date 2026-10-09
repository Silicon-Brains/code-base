import type { ReactNode } from "react";

/* ---------------------------------------------------------------- Icons ---- */

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "code":     return <svg {...c}><path d="M8 6l-5 6 5 6M16 6l5 6-5 6" /></svg>;
    case "phone":    return <svg {...c}><rect x="6" y="2.5" width="12" height="19" rx="2" /><path d="M11 18.5h2" /></svg>;
    case "gear":     return <svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>;
    case "db":       return <svg {...c}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>;
    case "cloud":    return <svg {...c}><path d="M18 16a4 4 0 000-8 6 6 0 00-11.6 1.7A3.5 3.5 0 006.5 16H18z" /></svg>;
    case "palette":  return <svg {...c}><circle cx="12" cy="12" r="9" /><circle cx="9" cy="9.5" r="1.2" fill="currentColor" /><circle cx="15" cy="9.5" r="1.2" fill="currentColor" /><circle cx="9.5" cy="15" r="1.2" fill="currentColor" /></svg>;
    case "plug":     return <svg {...c}><path d="M9 3v6M15 3v6M6 9h12v3a6 6 0 01-6 6 6 6 0 01-6-6V9zM12 18v3" /></svg>;
    case "rocket":   return <svg {...c}><path d="M5 19l4-1 10-10a3 3 0 00-4-4L5 14l-1 4 1 1zM14 5l5 5" /></svg>;
    case "building": return <svg {...c}><rect x="4" y="4" width="10" height="17" /><path d="M14 9h6v12M7 8h3M7 12h3M7 16h3M17 13h1M17 16h1" /></svg>;
    case "cap":      return <svg {...c}><path d="M2 9l10-5 10 5-10 5L2 9zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>;
    case "doc":      return <svg {...c}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>;
    case "chart":    return <svg {...c}><path d="M4 20V4M4 20h16M8 16v-4M13 16V8M18 16v-7" /></svg>;
    case "search":   return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
    case "eye":      return <svg {...c}><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "handshake":return <svg {...c}><path d="M11 17l2 2 5-5M3 11l4-4 4 3 4-3 4 4M7 7l-4 4 4 4M17 7l4 4-4 4" /></svg>;
    case "target":   return <svg {...c}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>;
    case "check":    return <svg {...c}><path d="M4 12l5 5L20 6" /></svg>;
    case "mail":     return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
    case "pin":      return <svg {...c}><path d="M12 22s7-6.2 7-12A7 7 0 105 10c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case "user":     return <svg {...c}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>;
    case "arrow":    return <svg {...c} strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    default:         return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

/* ------------------------------------------------------------ Small bits --- */

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
      {children}
    </p>
  );
}

export function IconTile({ name, tone = "solid" }: { name: string; tone?: "solid" | "soft" }) {
  const cls =
    tone === "solid"
      ? "bg-primary text-on-primary"
      : "bg-secondary-container text-primary";
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cls}`}>
      <Icon name={name} />
    </span>
  );
}

export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-on-surface-variant">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-1 shrink-0 text-primary" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12l5 5L20 6" />
      </svg>
      {children}
    </li>
  );
}

/* --------------------------------------------------------- Page hero band -- */

export function PageHero({
  label,
  title,
  subtitle,
  actions,
}: {
  label: string;
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-outline">
      <div className="mx-auto w-full max-w-container px-4 py-14 md:px-10 md:py-20">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-on-surface md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base text-on-surface-variant md:text-lg">{subtitle}</p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}