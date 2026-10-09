import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Card from "@/components/Card";
import TechChips from "@/components/TechChips";
import { FilterProvider, FilterChips, FilterItem } from "@/components/CategoryFilter";
import { api, loadOr } from "@/lib/api";
import { SectionLabel, IconTile, Icon, PageHero } from "@/components/public/ui";
import type { Project } from "@/lib/types";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await loadOr<Project[]>("projects", () => api.getProjects(), []);
  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))] as string[];

  return (
    <div className="flex flex-col">
      <PageHero
        label="Our Projects"
        title="Real Products. Real Impact."
        subtitle="A collection of web and Android applications we've built for businesses, organizations and real-world use cases."
      />

      <Section className="pt-12">
        {projects.length === 0 ? (
          <Card>
            <p className="text-sm text-on-surface-variant">Projects are being updated — please check back shortly.</p>
          </Card>
        ) : (
          <FilterProvider>
            {/* Filter chips (top-right in the design) */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <SectionLabel>Portfolio</SectionLabel>
              {categories.length > 1 && (
                <FilterChips allLabel="All" categories={categories} />
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <FilterItem key={p.id} category={p.category}>
                  <Link href={`/projects/${p.slug}`} className="group block h-full">
                    <Card interactive className="flex h-full flex-col gap-4 !p-0 overflow-hidden">
                      {/* Cover */}
                      <div className="aspect-[16/10] w-full overflow-hidden border-b border-outline bg-surface-container-high">
                        {p.cover_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.cover_image_url}
                            alt={p.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                            {p.title}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
                        <h3 className="text-base font-bold text-on-surface">{p.title}</h3>
                        {p.summary && <p className="line-clamp-2 text-sm text-on-surface-variant">{p.summary}</p>}

                        {p.tech_stack.length > 0 && (
                          <TechChips items={p.tech_stack.slice(0, 4).map((t) => ({ label: t }))} />
                        )}

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                            {p.category ?? "Case study"}
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-transform duration-200 group-hover:translate-x-0.5">
                            <Icon name="arrow" size={14} />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </FilterItem>
              ))}
            </div>
          </FilterProvider>
        )}
      </Section>

      {/* ------------------------------------------------ CTA band -------- */}
      <Section className="pt-24">
        <div className="relative overflow-hidden rounded-3xl bg-secondary-container px-6 py-12 md:px-12 md:py-16">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-container/70" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <SectionLabel>Have a Project in Mind?</SectionLabel>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-on-surface md:text-4xl">
                Let's build something great.
              </h2>
              <p className="mt-3 text-base text-on-surface-variant">
                We work with startups, businesses and institutions to ship digital products that solve real problems.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" variant="primary" size="lg">
                Start a Project <Icon name="arrow" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <div className="h-6" />
    </div>
  );
}