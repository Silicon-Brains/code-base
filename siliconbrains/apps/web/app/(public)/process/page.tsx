import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { api, loadOr } from "@/lib/api";
import { SectionLabel, IconTile, PageHero, Icon } from "@/components/public/ui";
import type { ProcessStep } from "@/lib/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Our Software Development Process",
  "See how SiliconBrains takes software projects from discovery and architecture through development, launch, and ongoing improvement.",
  "/process",
);

export default async function ProcessPage() {
  const steps = await loadOr<ProcessStep[]>("process steps", () => api.getProcessSteps(), []);

  return (
    <div className="flex flex-col">
      <PageHero
        label="Our Process"
        title="From Idea to Impact."
        subtitle="A simple and transparent process to turn your idea into a successful digital product."
      />

      {/* --------------------------------------------- Stepper ----------- */}
      <Section className="pt-16">
        {steps.length === 0 ? (
          <Card>
            <p className="text-sm text-on-surface-variant">Process steps are being updated — please check back shortly.</p>
          </Card>
        ) : (
          <>
            {/* Horizontal stepper */}
            <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
              {/* connector line (desktop only) */}
              <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-outline md:block" />
              {steps.map((s) => (
                <li key={s.id} className="relative flex flex-col items-start gap-4 md:items-center md:text-center">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {String(s.phase_number).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-base font-bold text-on-surface">{s.title}</p>
                    {s.description && (
                      <p className="mt-1.5 text-sm text-on-surface-variant">{s.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {/* Closer look */}
            <div className="mt-20">
              <SectionLabel>Our Process</SectionLabel>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                A Closer Look at Our Process
              </h2>

              <div className="mt-10 flex flex-col gap-4">
                {steps.map((s) => (
                  <Card key={s.id} className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                    <div className="flex shrink-0 items-center gap-3 md:w-52">
                      <IconTile name={iconForPhase(s.phase_number)} />
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {String(s.phase_number).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-on-surface">{s.title}</h3>
                      {s.description && (
                        <p className="mt-1.5 max-w-3xl text-sm text-on-surface-variant">{s.description}</p>
                      )}
                      {s.core_focus.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {s.core_focus.slice(0, 4).map((f) => (
                            <li
                              key={f}
                              className="rounded-lg border border-outline bg-surface-container-low px-2.5 py-1 text-[11px] text-on-surface-variant"
                            >
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {s.quality_gate && (
                      <div className="shrink-0 md:w-44">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                          Quality Gate
                        </p>
                        <p className="mt-1 text-xs text-on-surface">{s.quality_gate}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </Section>

      {/* --------------------------------------------- CTA --------------- */}
      <Section className="pt-24">
        <div className="relative overflow-hidden rounded-3xl bg-secondary-container px-6 py-12 md:px-12 md:py-16">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-container/70" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <SectionLabel>Let's Build Together</SectionLabel>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-on-surface md:text-4xl">
                Ready to turn your idea into a product?
              </h2>
              <p className="mt-3 text-base text-on-surface-variant">
                Start a project with us and we'll walk you through every phase.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" variant="primary" size="lg">
                Start a Project <Icon name="arrow" size={14} />
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

function iconForPhase(n: number): string {
  switch (n) {
    case 1: return "search";
    case 2: return "doc";
    case 3: return "palette";
    case 4: return "code";
    case 5: return "rocket";
    default: return "target";
  }
}
