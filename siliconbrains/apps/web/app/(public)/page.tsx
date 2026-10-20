import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Card from "@/components/Card";
import TechChips from "@/components/TechChips";
import { LaptopFrame, PhoneFrame } from "@/components/DeviceFrame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Web & Android App Development",
  description:
    "SiliconBrains designs and builds custom web applications, backend platforms, and Android apps for startups and businesses. From product strategy to launch, build with an experienced engineering team.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Custom Web & Android App Development | SiliconBrains",
    description:
      "Build reliable digital products with SiliconBrains. Custom web platforms, backend systems, and Android applications designed around your goals.",
    url: "/",
    type: "website",
    siteName: "SiliconBrains",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Web & Android App Development | SiliconBrains",
    description:
      "Custom web platforms, backend systems, and Android applications designed around your goals.",
  },
};

// ---------------------------------------------------------------------------
// Local content — every block below is *intentionally* hardcoded JSX for the
// new marketing landing. It matches the light redesign mock and does not yet
// come from the CMS (site_blocks decision is still open — see memory.md
// Phase 7 notes). When the CMS decision lands, these blocks move to
// `site_blocks` / per-section tables without touching the layout.
// ---------------------------------------------------------------------------

const HERO_STATS = [
  { value: "10+", label: "Projects Delivered" },
  { value: "20+", label: "Happy Clients" },
  { value: "2+", label: "Years Experience" },
  { value: "100%", label: "Client Focused" },
];

const WHAT_WE_DO = [
  {
    icon: "code",
    title: "Full-Stack Web Development",
    description: "Scalable and high-performance web applications built around your business requirements.",
    features: [
      "Business Websites", "Backend Development",
      "Full-Stack Web Applications", "Database Integration",
      "Admin Dashboards", "Authentication Systems",
      "Management Systems", "Third-Party API Integration",
      "REST APIs", "Deployment & Maintenance",
    ],
    tech: ["Next.js", "React", "Node.js", "Express.js", "Supabase", "MySQL"],
    cta: { label: "Explore Web Development", href: "/services" },
  },
  {
    icon: "phone",
    title: "Android Application Development",
    description: "Custom Android applications designed for real-world use cases with reliable backend integration.",
    features: [
      "Custom Android Apps", "Database Integration",
      "Business Applications", "Push Notifications",
      "Modern UI Development", "Real-Time Data",
      "REST API Integration", "Backend Integration",
      "Authentication", "App Deployment",
    ],
    tech: ["Android", "Flutter/Dart", "FastApi", "Express.js", "Supabase", "MySQL"],
    cta: { label: "Explore Android Development", href: "/services" },
  },
];

const WEB_STEPS = [
  { num: "01", icon: "code", title: "Frontend Development", desc: "Responsive, accessible and modern interfaces for every screen.", tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { num: "02", icon: "gear", title: "Backend Development", desc: "Secure and scalable APIs that power your applications.", tech: ["Node.js", "Express.js", "REST APIs"] },
  { num: "03", icon: "db", title: "Database & Systems", desc: "Reliable data architecture designed around your application.", tech: ["Supabase", "PostgreSQL", "MySQL"] },
  { num: "04", icon: "cloud", title: "Deployment & Integration", desc: "Take your product from development to production.", tech: ["Vercel", "Render", "Railway", "GitHub"] },
];

const ANDROID_STEPS = [
  { num: "01", icon: "phone", title: "App Development", desc: "Custom Android applications built around your requirements." },
  { num: "02", icon: "palette", title: "UI & UX", desc: "Clean mobile interfaces focused on usability." },
  { num: "03", icon: "plug", title: "Backend Integration", desc: "Connect applications with secure APIs and databases." },
  { num: "04", icon: "cloud", title: "Deployment & Maintenance", desc: "Testing, deployment and ongoing improvements." },
];

const SOLUTIONS = [
  {
    icon: "rocket",
    title: "Startups",
    subtitle: "Turn your idea into a working MVP.",
    items: ["MVP Development", "Web Apps", "Android Apps", "Backend Systems"],
  },
  {
    icon: "building",
    title: "Businesses",
    subtitle: "Build digital systems that improve everyday operations.",
    items: ["Business Applications", "Management Systems", "Dashboards", "Automation"],
  },
  {
    icon: "cap",
    title: "Institutions",
    subtitle: "Create reliable digital platforms for organizations and institutions.",
    items: ["Portals", "Management Systems", "Custom Applications", "Data Systems"],
  },
];

const STACK = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js",
  "Android", "Flutter/Dart", "Supabase", "PostgreSQL", "MySQL", "Python/FastAPI",
];

const TECH_COLORS: Record<string, [string, string]> = {
  "Next.js": ["#4b5563", "#09090b"], React: ["#61dafb", "#087ea4"], TypeScript: ["#3178c6", "#174c83"],
  "Tailwind CSS": ["#38bdf8", "#087ea4"], "Node.js": ["#83cd29", "#3b7b22"], "Express.js": ["#64748b", "#1e293b"],
  Android: ["#a4c639", "#477a24"], "Flutter/Dart": ["#54c5f8", "#1769aa"], Supabase: ["#5ee2a0", "#16875b"],
  PostgreSQL: ["#6aa5d9", "#28577d"], MySQL: ["#62a7c9", "#145374"], "Python/FastAPI": ["#ffd343", "#3476a8"],
};

function TechnologyLogo({ name }: { name: string }) {
  const logo = { width: 27, height: 27, viewBox: "0 0 40 40", "aria-hidden": true as const };
  switch (name) {
    case "Next.js": return <svg {...logo}><circle cx="20" cy="20" r="17" fill="white" /><path d="M12 28V12h3l10 12V12h3v16h-3L15 16v12z" fill="#111" /></svg>;
    case "React": return <svg {...logo} fill="none" stroke="white" strokeWidth="1.8"><ellipse cx="20" cy="20" rx="17" ry="6.6" /><ellipse cx="20" cy="20" rx="17" ry="6.6" transform="rotate(60 20 20)" /><ellipse cx="20" cy="20" rx="17" ry="6.6" transform="rotate(120 20 20)" /><circle cx="20" cy="20" r="2.7" fill="white" stroke="none" /></svg>;
    case "TypeScript": return <svg {...logo}><path fill="white" d="M5 7h30v26H5z" /><path fill="#2468b4" d="M19 19h7v2h-2.4v9h-2.2v-9H19zm8 8.5c.8.7 1.6 1 2.5 1 .8 0 1.2-.3 1.2-.8 0-.4-.3-.7-1.4-1.1-1.9-.7-2.8-1.5-2.8-3 0-1.8 1.4-2.9 3.5-2.9 1.2 0 2.2.3 3 .8l-.7 1.8c-.7-.4-1.4-.7-2.2-.7-.7 0-1.1.3-1.1.8s.4.7 1.6 1.1c1.8.7 2.6 1.5 2.6 3 0 1.8-1.4 3-3.7 3-1.4 0-2.6-.4-3.4-1z" /></svg>;
    case "Tailwind CSS": return <svg {...logo} viewBox="0 0 24 24"><path fill="white" d="M12 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.1 1.1 2.3 2.3 4.5 2.3 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6-1.1-1.1-2.3-2.3-4.5-2.3ZM6 12.3c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.1 1.1 2.3 2.3 4.5 2.3 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6-1.1-1.1-2.3-2.3-4.5-2.3Z" /></svg>;
    case "Node.js": return <svg {...logo} fill="none" stroke="white" strokeWidth="1.7"><path d="m20 3 14 8v17l-14 8-14-8V11z" /><text x="20" y="24" textAnchor="middle" fill="white" stroke="none" fontSize="8" fontWeight="700">node</text><text x="20" y="29" textAnchor="middle" fill="white" stroke="none" fontSize="4.5">.js</text></svg>;
    case "Express.js": return <svg {...logo} viewBox="0 0 80 40"><text x="40" y="25" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial,sans-serif" letterSpacing="-1.3">express</text></svg>;
    case "Android": return <svg {...logo} fill="white"><path d="m12 8-2-3 .9-.5 2.1 3.2a14 14 0 0 1 14 0L29 4.5l.9.5-2 3A12 12 0 0 1 33 18H7a12 12 0 0 1 5-10ZM13 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm14 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM8 20h24v8a3 3 0 0 1-3 3h-2v4h-3v-4h-8v4h-3v-4h-2a3 3 0 0 1-3-3z" /></svg>;
    case "Flutter/Dart": return <svg {...logo}><path fill="white" d="M23 3 6 20l7 7L37 3zM23 22l-8 8 7 7 8-8z" /><path fill="#cceeff" d="m15 30 4-4 11 3-8 8z" /></svg>;
    case "Supabase": return <svg {...logo} viewBox="0 0 24 24"><path fill="white" d="M13.5 2.8a.8.8 0 0 0-1.4-.5L2.3 14.1a.8.8 0 0 0 .6 1.3h7.6v5.8a.8.8 0 0 0 1.4.5l9.8-11.8a.8.8 0 0 0-.6-1.3h-7.6z" /></svg>;
    case "PostgreSQL": return <svg {...logo} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 32c-3-1-4-4-4-8V13c0-5 4-8 11-8s12 3 12 9v7c0 3-2 5-5 5h-3v7c0 2-1 3-3 3s-3-1-3-3v-6" /><path d="M13 13h.1M25 13h.1M30 17c4-2 6 0 5 3l-3 5-4 1M13 5 9 2M26 5l4-3" /></svg>;
    case "MySQL": return <svg {...logo} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 29c5-1 7-5 9-10 2-4 5-7 9-7 3 0 5 2 6 5 1 3 2 5 5 6-3 1-6 0-8-2-2-2-3-4-5-4-2 0-3 2-4 5-2 5-5 8-12 7Z" /><path d="M24 12c2-4 5-5 9-4M31 22l4 2" /></svg>;
    case "Python/FastAPI": return <svg {...logo}><path fill="#ffe873" d="M19 3h7c4 0 6 2 6 6v7h-9c-4 0-6 2-6 6v3h-5c-4 0-6-2-6-6v-5c0-4 2-6 6-6h7z" /><path fill="#4b8bbe" d="M21 37h-7c-4 0-6-2-6-6v-7h9c4 0 6-2 6-6v-3h5c4 0 6 2 6 6v5c0 4-2 6-6 6h-7z" /><circle cx="22" cy="8" r="1.4" fill="#356a95" /><circle cx="18" cy="32" r="1.4" fill="#ffe873" /></svg>;
    default: return <svg {...logo}><circle cx="20" cy="20" r="16" fill="white" /></svg>;
  }
}

function TechnologyIcon({ name }: { name: string }) {
  const [light, dark] = TECH_COLORS[name] ?? ["#718078", "#254e3c"];
  return (
    <span
      aria-hidden="true"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/40 shadow-[0_5px_10px_rgba(15,35,25,0.2),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_3px_rgba(0,0,0,0.16)] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-3deg]"
      style={{ background: `linear-gradient(145deg, ${light}, ${dark})` }}
    >
      <span className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/15" />
      <span className="relative drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]"><TechnologyLogo name={name} /></span>
    </span>
  );
}

const APPROACH = [
  { num: "01", icon: "doc", title: "Understand", desc: "We learn about your goals, users and requirements." },
  { num: "02", icon: "code", title: "Build", desc: "We design and develop the product using the right technology." },
  { num: "03", icon: "chart", title: "Improve", desc: "We test, deploy and continuously improve the product." },
];

// ---------------------------------------------------------------------------

function Icon({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "code": return <svg {...common}><path d="M8 6l-5 6 5 6M16 6l5 6-5 6" /></svg>;
    case "phone": return <svg {...common}><rect x="6" y="2.5" width="12" height="19" rx="2" /><path d="M11 18.5h2" /></svg>;
    case "gear": return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>;
    case "db": return <svg {...common}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>;
    case "cloud": return <svg {...common}><path d="M18 16a4 4 0 000-8 6 6 0 00-11.6 1.7A3.5 3.5 0 006.5 16H18z" /></svg>;
    case "palette": return <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="9" cy="9.5" r="1.2" fill="currentColor" /><circle cx="15" cy="9.5" r="1.2" fill="currentColor" /><circle cx="9.5" cy="15" r="1.2" fill="currentColor" /></svg>;
    case "plug": return <svg {...common}><path d="M9 3v6M15 3v6M6 9h12v3a6 6 0 01-6 6 6 6 0 01-6-6V9zM12 18v3" /></svg>;
    case "rocket": return <svg {...common}><path d="M5 19l4-1 10-10a3 3 0 00-4-4L5 14l-1 4 1 1zM14 5l5 5" /></svg>;
    case "building": return <svg {...common}><rect x="4" y="4" width="10" height="17" /><path d="M14 9h6v12M7 8h3M7 12h3M7 16h3M17 13h1M17 16h1" /></svg>;
    case "cap": return <svg {...common}><path d="M2 9l10-5 10 5-10 5L2 9zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>;
    case "doc": return <svg {...common}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>;
    case "chart": return <svg {...common}><path d="M4 20V4M4 20h16M8 16v-4M13 16V8M18 16v-7" /></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function IconTile({ name }: { name: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
      <Icon name={name} />
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-on-surface-variant">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-1 shrink-0 text-primary" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12l5 5L20 6" />
      </svg>
      {children}
    </li>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
      {children}
    </p>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <Section className="landing-hero mt-7 pt-12 md:mt-10 md:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="hero-copy-enter">
            <SectionLabel>Software Engineering Studio</SectionLabel>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-on-surface md:text-5xl lg:text-[4.25rem]">
              Software that moves
              <br />
              your business <span className="text-primary">forward.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-on-surface-variant md:text-lg md:leading-8">
              We partner with ambitious teams to design and build dependable web platforms, mobile apps, and software systems—from the first technical decision to launch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary" size="lg" className="!bg-white !text-[#123c2e] hover:!bg-[#e8f0e5]">
                Start a Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Button>
              <Button href="/projects" variant="secondary" size="lg">
                Explore Our Work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-on-surface-variant">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-secondary" /> Product-minded engineering</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-secondary" /> Clear delivery process</span>
            </div>
          </div>

          {/* Hero device mockups */}
          <div className="relative hero-visual-enter">
            {/* Decorative background circle */}
            <div
              aria-hidden
              className="hero-orbit absolute -right-6 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary-container/60 md:block"
            />
            <div className="relative">
              <div className="mr-20 md:mr-32">
                <LaptopFrame />
              </div>
              <div className="hero-phone absolute -bottom-6 right-0 md:right-4">
                <PhoneFrame />
              </div>
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div className="landing-stats mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-outline pt-7 md:mt-16 md:grid-cols-4 md:gap-10 md:pt-8">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <p className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant md:text-[11px]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ================= WHAT WE DO ================= */}
      <Section className="pt-24">
        <SectionLabel>Our Services</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">What We Do</h2>
        <p className="mt-3 max-w-xl text-base text-on-surface-variant">
          From frontend experiences to backend systems and Android applications, we handle the complete development journey.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {WHAT_WE_DO.map((s) => (
            <Card key={s.title} interactive className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <IconTile name={s.icon} />
                <div>
                  <h3 className="text-xl font-bold text-on-surface">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-on-surface-variant">{s.description}</p>
                </div>
              </div>

              <ul className="grid grid-cols-1 gap-y-2.5 gap-x-4 sm:grid-cols-2">
                {s.features.map((f) => <CheckItem key={f}>{f}</CheckItem>)}
              </ul>

              <TechChips items={s.tech.map((t) => ({ label: t }))} />

              <div className="mt-auto pt-2">
                <Button href={s.cta.href} variant="primary" size="lg">
                  {s.cta.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ================= FROM INTERFACE TO INFRASTRUCTURE ================= */}
      <Section className="pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>Web Development</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              From Interface to Infrastructure.
            </h2>
            <p className="mt-3 max-w-xl text-base text-on-surface-variant">
              We build complete web experiences that are modern, scalable and reliable.
            </p>
          </div>
          <Button href="/projects" variant="secondary">View Web Projects →</Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WEB_STEPS.map((s) => (
            <Card key={s.num} interactive className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <IconTile name={s.icon} />
                <span className="text-xs font-medium text-on-surface-variant">{s.num}</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">{s.title}</h3>
              <p className="text-sm text-on-surface-variant">{s.desc}</p>
              <TechChips className="mt-auto" items={s.tech.map((t) => ({ label: t }))} />
            </Card>
          ))}
        </div>
      </Section>

      {/* ================= MOBILE EXPERIENCES ================= */}
      <Section className="pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>Android Development</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              Mobile Experiences That Deliver.
            </h2>
            <p className="mt-3 max-w-xl text-base text-on-surface-variant">
              Custom Android applications built for performance, usability and real-world impact.
            </p>
          </div>
          <Button href="/projects" variant="secondary">View Android Projects →</Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          {/* Phone previews */}
          <div className="relative flex items-end justify-center gap-3 md:gap-4">
            <div
              aria-hidden
              className="absolute -left-10 top-1/3 hidden h-[280px] w-[280px] rounded-full bg-primary-container/50 md:block"
            />
            <div className="relative hidden md:block">
              <PhoneFrame />
            </div>
            <div className="relative -mt-4">
              <PhoneFrame />
            </div>
            <div className="relative hidden md:block">
              <PhoneFrame />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ANDROID_STEPS.map((s) => (
              <Card key={s.num} interactive className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <IconTile name={s.icon} />
                  <span className="text-xs font-medium text-on-surface-variant">{s.num}</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">{s.title}</h3>
                <p className="text-sm text-on-surface-variant">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* ================= SOLUTIONS FOR EVERY VISION ================= */}
      <Section className="pt-24">
        <SectionLabel>Built Around Your Needs</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          Solutions for Every Vision.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-on-surface-variant">
          We work with startups, businesses, institutions and individuals to build digital products that solve real problems.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Card key={s.title} interactive className="flex flex-col gap-4">
              <IconTile name={s.icon} />
              <div>
                <h3 className="text-lg font-bold text-on-surface">{s.title}</h3>
                <p className="mt-1 text-sm text-on-surface-variant">{s.subtitle}</p>
              </div>
              <ul className="mt-2 flex flex-col gap-2">
                {s.items.map((i) => <CheckItem key={i}>{i}</CheckItem>)}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* ================= MODERN TOOLS ================= */}
      <Section className="pt-24">
        <SectionLabel>Technologies We Work With</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          Modern Tools for Modern Products.
        </h2>
        <p className="mt-3 max-w-xl text-base text-on-surface-variant">
          We use the latest and most reliable technologies to build high-quality digital solutions.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {STACK.map((t) => (
            <div
              key={t}
              className="group flex min-h-[68px] items-center gap-3 rounded-2xl border border-outline/80 bg-surface px-3 py-3 text-left text-sm font-semibold text-on-surface shadow-[0_5px_18px_rgba(20,38,30,0.035)] transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_14px_30px_rgba(20,38,30,0.11)] sm:px-4"
            >
              <TechnologyIcon name={t} />
              <span className="leading-tight">{t}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ================= APPROACH ================= */}
      <Section className="pt-24">
        <SectionLabel>Our Approach</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          More Than Development.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-on-surface-variant">
          We focus on understanding the problem first, then building the right digital solution around it.
        </p>

        <div className="mt-10 grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {APPROACH.map((s, i) => (
            <div key={s.num} className="contents">
              <Card interactive className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <IconTile name={s.icon} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{s.num}</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">{s.title}</h3>
                <p className="text-sm text-on-surface-variant">{s.desc}</p>
              </Card>
              {i < APPROACH.length - 1 && (
                <div className="hidden items-center justify-center self-center text-on-surface-variant/50 md:flex">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ================= FINAL CTA ================= */}
      <Section className="pt-24">
        <div className="landing-cta relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-16">
          <div
            aria-hidden
            className="cta-glow absolute -right-24 -top-24 h-72 w-72 rounded-full"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b8d9c0]">Let's Build Together</p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                Have a Product in Mind?
              </h2>
              <p className="mt-3 text-base leading-7 text-white/75">
                Tell us what you want to build. We'll help turn the idea into a digital product.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" variant="primary" size="lg" className="!bg-white !text-[#123c2e] hover:!bg-[#e8f0e5]">
                Start a Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Button>
              <Button href="/projects" variant="secondary" size="lg" className="border-white/20 !bg-white/10 !text-white hover:!bg-white/15 hover:!text-white">
                View Our Projects
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <div className="h-6" />
    </div>
  );
}
