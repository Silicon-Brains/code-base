import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Card from "@/components/Card";
import TechChips from "@/components/TechChips";
import { api, loadOr } from "@/lib/api";
import { SectionLabel, IconTile, CheckItem, PageHero, Icon } from "@/components/public/ui";
import type { Service } from "@/lib/types";

export const metadata = { title: "Services" };

// Four "how we deliver" steps — hardcoded, matches the design's
// End-to-End Development Services block.
const DELIVERY_STEPS = [
  { num: "01", icon: "code",  title: "Frontend Development",     desc: "Responsive, accessible and modern interfaces for every screen.",           tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { num: "02", icon: "gear",  title: "Backend Development",      desc: "Secure and scalable APIs that power your applications.",                    tech: ["Node.js", "Express.js", "REST APIs"] },
  { num: "03", icon: "db",    title: "Database & Systems",       desc: "Reliable data architecture designed around your application.",              tech: ["Supabase", "PostgreSQL", "MySQL"] },
  { num: "04", icon: "cloud", title: "Deployment & Integration", desc: "Take your product from development to production.",                         tech: ["Vercel", "Render", "Railway", "GitHub"] },
];

export default async function ServicesPage() {
  const services = await loadOr<Service[]>("services", () => api.getServices(), []);

  return (
    <div className="flex flex-col">
      <PageHero
        label="Our Services"
        title={<>Digital Products,<br />Built Around Your Goals.</>}
        subtitle="From frontend experiences to backend systems and Android applications, we handle the complete development journey."
      />

      {/* ------------------------------------------------- What We Do -------- */}
      <Section className="pt-20">
        <SectionLabel>Our Services</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">What We Do</h2>
        <p className="mt-3 max-w-2xl text-base text-on-surface-variant">
          From frontend experiences to backend systems and Android applications, we handle the complete development journey.
        </p>

        {services.length === 0 ? (
          <Card className="mt-10">
            <p className="text-sm text-on-surface-variant">Services are being updated — please check back shortly.</p>
          </Card>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {services.slice(0, 2).map((s) => (
              <Card key={s.id} className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <IconTile name={s.icon ?? "code"} />
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">{s.title}</h3>
                    {s.description && (
                      <p className="mt-1.5 text-sm text-on-surface-variant">{s.description}</p>
                    )}
                  </div>
                </div>

                {s.features.length > 0 && (
                  <ul className="grid grid-cols-1 gap-y-2.5 gap-x-4 sm:grid-cols-2">
                    {s.features.map((f) => <CheckItem key={f}>{f}</CheckItem>)}
                  </ul>
                )}

                {s.architecture_baseline.length > 0 && (
                  <TechChips items={s.architecture_baseline.map((t) => ({ label: t }))} />
                )}

                <div className="mt-auto pt-2">
                  <Button href="/contact" variant="primary" size="lg">
                    Explore {s.title}
                    <Icon name="arrow" size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* --------------------------------- End-to-End Development Services -- */}
      <Section className="pt-24">
        <SectionLabel>Our Development Process</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          End-to-End Development Services.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-on-surface-variant">
          From idea to deployment, we provide complete development services for your product.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DELIVERY_STEPS.map((s) => (
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

      {/* --------------------------------------------- Remaining services -- */}
      {services.length > 2 && (
        <Section className="pt-24">
          <SectionLabel>More Capabilities</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            What else we build.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.slice(2).map((s) => (
              <Card key={s.id} className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <IconTile name={s.icon ?? "cloud"} />
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">{s.title}</h3>
                    {s.description && <p className="mt-1 text-sm text-on-surface-variant">{s.description}</p>}
                  </div>
                </div>
                {s.deliverables.length > 0 && (
                  <ul className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2">
                    {s.deliverables.slice(0, 6).map((d) => <CheckItem key={d}>{d}</CheckItem>)}
                  </ul>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------- CTA band --- */}
      <Section className="pt-24">
        <div className="relative overflow-hidden rounded-3xl bg-secondary-container px-6 py-12 md:px-12 md:py-16">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-container/70" />
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
                <Icon name="arrow" size={14} />
              </Button>
              <Button href="/projects" variant="secondary" size="lg">View Our Projects</Button>
            </div>
          </div>
        </div>
      </Section>

      <div className="h-6" />
    </div>
  );
}