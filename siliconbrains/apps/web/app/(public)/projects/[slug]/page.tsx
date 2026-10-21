import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { Icon, SectionLabel } from "@/components/public/ui";
import { api, ApiError } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import type { Project } from "@/lib/types";

export const revalidate = 60;

async function getProject(slug: string): Promise<Project | null> {
  try {
    return await api.getProject(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug).catch(() => null);
  if (!project) return {};
  return pageMetadata(project.title, project.summary ?? "SiliconBrains case study.", `/projects/${project.slug}`);
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const category = project.tag ?? project.category ?? "Case study";
  const technologies = project.tech_stack.flatMap((item) => item.split(",").map((tech) => tech.trim()).filter(Boolean));
  const technologyColors = [
    "bg-violet-100 text-violet-800 ring-violet-200 hover:bg-violet-200 hover:ring-violet-300",
    "bg-sky-100 text-sky-800 ring-sky-200 hover:bg-sky-200 hover:ring-sky-300",
    "bg-amber-100 text-amber-800 ring-amber-200 hover:bg-amber-200 hover:ring-amber-300",
    "bg-rose-100 text-rose-800 ring-rose-200 hover:bg-rose-200 hover:ring-rose-300",
    "bg-teal-100 text-teal-800 ring-teal-200 hover:bg-teal-200 hover:ring-teal-300",
    "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200 hover:bg-fuchsia-200 hover:ring-fuchsia-300",
    "bg-yellow-100 text-yellow-800 ring-yellow-200 hover:bg-yellow-200 hover:ring-yellow-300",
    "bg-cyan-100 text-cyan-800 ring-cyan-200 hover:bg-cyan-200 hover:ring-cyan-300",
  ];

  return (
    <div className="pb-16 sm:pb-24">
        <Section className="pt-8 sm:pt-12">
          <nav aria-label="Breadcrumb" className="mb-8 flex min-w-0 items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/projects" className="shrink-0 transition-colors hover:text-primary">Projects</Link>
            <span aria-hidden="true" className="text-on-surface-variant/50">/</span>
            <span className="truncate text-on-surface">{project.title}</span>
          </nav>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)] lg:items-end lg:gap-12">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {project.featured && <Badge active>Featured</Badge>}
                <Badge>{category}</Badge>
              </div>
              <h1 className="max-w-4xl break-words text-4xl font-bold leading-[1.08] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              {project.summary && (
                <p className="mt-5 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                  {project.summary}
                </p>
              )}
            </div>

            {project.metrics.length > 0 && (
              <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
                {project.metrics.slice(0, 4).map((metric) => (
                  <Card key={metric.label} className="min-w-0 !p-4 sm:!p-5">
                    <p className="break-words text-2xl font-bold leading-tight text-primary sm:text-3xl">{metric.value}</p>
                    <p className="mt-2 break-words text-[11px] font-medium uppercase leading-snug tracking-[0.12em] text-on-surface-variant sm:text-xs">
                      {metric.label}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-outline bg-surface-container-high sm:mt-12 sm:rounded-3xl">
            <div className="aspect-[4/3] w-full sm:aspect-[16/8] lg:aspect-[16/7]">
              {project.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.cover_image_url} alt={`${project.title} project preview`} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary-container via-surface-container to-primary-container/40 px-6 text-center">
                  <span className="max-w-2xl break-words text-3xl font-semibold tracking-tight text-on-surface/70 sm:text-5xl">{project.title}</span>
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section className="mt-12 sm:mt-16">
          <div className="min-w-0">
            <SectionLabel>Project overview</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface sm:text-3xl">Built to make a difference</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant sm:text-base sm:leading-8">
              {project.summary ?? `Explore how ${project.title} brings together thoughtful design and technology to solve real needs.`}
            </p>
          </div>
        </Section>

        {technologies.length > 0 && (
          <Section className="mt-8 sm:mt-10">
            <Card className="min-w-0 !p-6 sm:!p-10">
              <SectionLabel>Technology</SectionLabel>
              <ul className="flex min-w-0 flex-wrap gap-3" aria-label="Technology stack">
                {technologies.map((tech, index) => (
                  <li
                    key={`${tech}-${index}`}
                    className={`max-w-full break-words rounded-2xl px-5 py-3 text-base font-semibold leading-6 ring-1 ring-inset transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none sm:text-lg ${technologyColors[index % technologyColors.length]}`}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Card>
          </Section>
        )}

        {project.highlights.length > 0 && (
          <Section className="mt-12 sm:mt-16">
            <div className="mb-6 max-w-2xl">
              <SectionLabel>What we delivered</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-tight text-on-surface sm:text-3xl">Engineering highlights</h2>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
              {project.highlights.map((highlight) => (
                <Card key={highlight} className="flex min-w-0 items-start gap-3 !p-4 sm:!p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon name="check" size={16} />
                  </span>
                  <p className="min-w-0 break-words pt-1 text-sm leading-6 text-on-surface-variant">{highlight}</p>
                </Card>
              ))}
            </div>
          </Section>
        )}

        <Section className="mt-14 sm:mt-20">
          <div className="relative overflow-hidden rounded-2xl bg-secondary-container p-6 sm:rounded-3xl sm:px-10 sm:py-10">
            <div aria-hidden="true" className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-primary-container/60" />
            <div className="relative flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <SectionLabel>Have a similar challenge?</SectionLabel>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-on-surface sm:text-3xl">Let’s build what’s next.</h2>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant sm:text-base">Tell us what you’re working on and we’ll help you find the right path forward.</p>
              </div>
              <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row">
                <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">Start a Project <Icon name="arrow" size={15} /></Button>
                <Button href="/projects" variant="secondary" size="lg" className="w-full sm:w-auto">All Projects</Button>
              </div>
            </div>
          </div>
        </Section>
    </div>
  );
}
