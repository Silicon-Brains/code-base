import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { api, ApiError } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import type { Project } from "@/lib/types";

export const revalidate = 60;

async function getProject(slug: string): Promise<Project | null> {
  try {
    return await api.getProject(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err; // real outage → error boundary, not a misleading 404
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

  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-12 pb-24 pt-10">
        <Section className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {project.featured && <Badge active>Featured Flagship</Badge>}
            <Badge>{project.tag ?? project.category}</Badge>
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-on-surface md:text-5xl">{project.title}</h1>
          <p className="max-w-2xl text-on-surface-variant">{project.summary}</p>
        </Section>

        {project.metrics.length > 0 && (
          <Section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <Card key={m.label} className="text-center">
                <p className="text-2xl font-semibold text-primary">{m.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-on-surface-variant">{m.label}</p>
              </Card>
            ))}
          </Section>
        )}

        {project.highlights.length > 0 && (
          <Section>
            <Card>
              <p className="mb-4 text-xs uppercase tracking-wide text-on-surface-variant">Engineering Highlights</p>
              <ul className="flex flex-col gap-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className="mt-0.5 text-primary">&#10003;</span>
                    {h}
                  </li>
                ))}
              </ul>
            </Card>
          </Section>
        )}

        <Section className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wide text-on-surface-variant">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </Section>

        <Section className="flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">Start a Project →</Button>
          <Button href="/projects" variant="secondary">← All Projects</Button>
        </Section>
      </main>
      <Footer />
    </>
  );
}
