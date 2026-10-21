import Section from "@/components/Section";
import Card from "@/components/Card";
import Accordion from "@/components/Accordion";
import ContactForm from "@/components/ContactForm";
import { api, loadOr } from "@/lib/api";
import { SectionLabel, Icon, PageHero } from "@/components/public/ui";
import type { Faq } from "@/lib/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact SiliconBrains",
  "Discuss your web application, Android app, or software engineering project with SiliconBrains. Tell us what you are building and get a clear next step.",
  "/contact",
);

const CHANNELS = [
  { icon: "mail", label: "Email", value: "contact@siliconbrains.in", href: "mailto:contact@siliconbrains.in", note: "We usually respond within 24 hours" },
  { icon: "pin",  label: "Location", value: "Nagpur, Maharashtra, India", note: "Available for remote projects worldwide" },
  { icon: "user", label: "Follow Us", value: "GitHub · LinkedIn · Instagram", note: "See what we're building" },
];

export default async function ContactPage() {
  const faqs = await loadOr<Faq[]>("faqs", () => api.getFaqs("contact"), []);

  return (
    <div className="flex flex-col">
      <PageHero
        label="Get In Touch"
        title="Have a Project in Mind?"
        subtitle="Tell us what you want to build. We'll help turn your idea into a digital product."
      />

      {/* -------------------------------------------- Contact + Form ----- */}
      <Section className="pt-8 sm:pt-12">
        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10 xl:gap-14">
          {/* Left: channels */}
          <div className="flex flex-col gap-4">
            <div className="mb-1">
              <SectionLabel>Ways to connect</SectionLabel>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">We’re here to help.</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-on-surface-variant">
                Whether you have a clear brief or an early idea, we’ll help you work out the next step.
              </p>
            </div>
            {CHANNELS.map((c) => (
              <Card key={c.label} interactive className="group flex min-w-0 items-start gap-4 !p-5 sm:!p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-container text-primary transition-transform duration-200 group-hover:scale-105">
                  <Icon name={c.icon} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a href={c.href} className="mt-1 block text-sm font-semibold text-primary hover:underline">
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-on-surface">{c.value}</p>
                  )}
                  <p className="mt-0.5 text-xs text-on-surface-variant">{c.note}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: form */}
            <Card className="min-w-0 !p-6 sm:!p-8 lg:!p-10">
              <ContactForm />
            </Card>
        </div>
      </Section>

      {/* -------------------------------------------- FAQ ---------------- */}
      {faqs.length > 0 && (
        <Section className="pt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Pre-Engagement Clarity</SectionLabel>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 max-w-2xl text-base text-on-surface-variant">
                Quick answers to common questions.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Accordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </Section>
      )}

      <div className="h-6" />
    </div>
  );
}
