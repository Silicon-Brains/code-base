import Section from "@/components/Section";
import Card from "@/components/Card";
import Accordion from "@/components/Accordion";
import ContactForm from "@/components/ContactForm";
import { api, loadOr } from "@/lib/api";
import { SectionLabel, Icon, PageHero } from "@/components/public/ui";
import type { Faq } from "@/lib/types";

export const metadata = { title: "Contact" };

const CHANNELS = [
  { icon: "mail", label: "Email", value: "team@siliconbrains.in", href: "mailto:team@siliconbrains.in", note: "We usually respond within 24 hours" },
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
      <Section className="pt-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
          {/* Left: channels */}
          <div className="flex flex-col gap-4">
            {CHANNELS.map((c) => (
              <Card key={c.label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-primary">
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
          <Card>
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