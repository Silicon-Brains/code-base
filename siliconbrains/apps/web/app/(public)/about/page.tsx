import Section from "@/components/Section";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { SectionLabel, IconTile, PageHero, Icon } from "@/components/public/ui";
import teamPhoto from "@/components/public/images/teamTwo.png";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About SiliconBrains",
  "Meet SiliconBrains, a software engineering studio building dependable digital products for startups, businesses, and institutions.",
  "/about",
);

const STATS = [
  { value: "10+", label: "Projects Delivered" },
  { value: "20+", label: "Happy Clients" },
  { value: "2+", label: "Years Experience" },
  { value: "100%", label: "Client Focused" },
];

const WHY = [
  {
    icon: "rocket",
    title: "Real-World Solutions",
    desc: "We build practical, scalable and reliable products.",
  },
  {
    icon: "gear",
    title: "Full-Stack Expertise",
    desc: "From frontend to backend, we handle the complete tech stack.",
  },
  {
    icon: "target",
    title: "Client-Focused",
    desc: "Your goals and requirements always come first.",
  },
  {
    icon: "handshake",
    title: "Long-Term Support",
    desc: "We don't just build. We support and grow with you.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        label="About Us"
        title="Building Modern Digital Products for Ambitious Ideas."
        subtitle="SiliconBrains is a software development company focused on creating modern web applications and Android solutions for businesses, startups, institutions and individuals."
        actions={
          <Button href="/contact" variant="primary" size="lg">
            Start a Project <Icon name="arrow" size={14} />
          </Button>
        }
      />

      {/* --------------------------------------------- Image band -------- */}
      <Section className="pt-16">
        <div className="relative overflow-hidden rounded-3xl border border-outline bg-surface-container-high">
          <div className="aspect-[21/9] w-full">
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-on-surface-variant/50">
                <img
                  src={teamPhoto.src}
                  alt="Project screenshot"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------- Stats ------------ */}
      <Section className="pt-12">
        <div className="grid grid-cols-2 gap-6 border-y border-outline py-8 md:grid-cols-4 md:gap-10">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-on-surface md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------- Mission / Vision -- */}
      <Section className="pt-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex flex-col gap-5">
            <IconTile name="target" />
            <div>
              <h2 className="text-xl font-bold text-on-surface">Our Mission</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                To deliver reliable, high-quality digital products that help
                businesses and individuals turn their ideas into real-world
                solutions.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-5">
            <IconTile name="eye" tone="soft" />
            <div>
              <h2 className="text-xl font-bold text-on-surface">Our Vision</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                To be a trusted technology partner known for innovative
                solutions and long-term impact.
              </p>
            </div>
          </Card>
        </div>
      </Section>

      {/* --------------------------------------------- Why Choose Us ----- */}
      <Section className="pt-20">
        <SectionLabel>Our Advantages</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          Why Choose SiliconBrains?
        </h2>
        <p className="mt-3 max-w-2xl text-base text-on-surface-variant">
          Four things we consistently deliver on every engagement.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <Card key={w.title} className="flex flex-col gap-4">
              <IconTile name={w.icon} />
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  {w.title}
                </h3>
                <p className="mt-1.5 text-sm text-on-surface-variant">
                  {w.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------- CTA -------------- */}
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
                Ready to start your project?
              </h2>
              <p className="mt-3 text-base text-on-surface-variant">
                Tell us about your idea and we'll help you turn it into a
                digital product.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" variant="primary" size="lg">
                Start a Project <Icon name="arrow" size={14} />
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
