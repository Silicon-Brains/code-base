import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Card from "@/components/Card";
import TechChips from "@/components/TechChips";
import { LaptopFrame, PhoneFrame } from "@/components/DeviceFrame";

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
      <Section className="pt-12 md:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <SectionLabel>Our Services</SectionLabel>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-on-surface md:text-5xl lg:text-6xl">
              Digital Products,
              <br />
              Built Around <span className="text-primary">Your Goals.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-on-surface-variant md:text-lg">
              We design and develop modern web applications and Android solutions that help businesses turn ideas into reliable digital products.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary" size="lg">
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
          </div>

          {/* Hero device mockups */}
          <div className="relative">
            {/* Decorative background circle */}
            <div
              aria-hidden
              className="absolute -right-6 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary-container/60 md:block"
            />
            <div className="relative">
              <div className="mr-20 md:mr-32">
                <LaptopFrame />
              </div>
              <div className="absolute -bottom-6 right-0 md:right-4">
                <PhoneFrame />
              </div>
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-outline pt-8 md:grid-cols-4 md:gap-10">
          {HERO_STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-on-surface md:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
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
            <Card key={s.title} className="flex flex-col gap-6">
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
            <Card key={s.num} className="flex flex-col gap-4">
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
              <Card key={s.num} className="flex flex-col gap-3">
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
            <Card key={s.title} className="flex flex-col gap-4">
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
              className="flex items-center justify-center rounded-xl border border-outline bg-surface px-3 py-4 text-sm font-medium text-on-surface"
            >
              {t}
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
              <Card className="flex flex-col gap-3">
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
        <div className="relative overflow-hidden rounded-3xl bg-secondary-container px-6 py-12 md:px-12 md:py-16">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-container/70"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <SectionLabel>Let's Build Together</SectionLabel>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-on-surface md:text-4xl">
                Have a Product in Mind?
              </h2>
              <p className="mt-3 text-base text-on-surface-variant">
                Tell us what you want to build. We'll help turn the idea into a digital product.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" variant="primary" size="lg">
                Start a Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Button>
              <Button href="/projects" variant="secondary" size="lg">
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