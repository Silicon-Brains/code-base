import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_PATHS = ["/", "/services", "/projects", "/about", "/process", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If the API is down (e.g. at build time) we still emit the static routes.
  const projects = await api.getProjects().catch(() => []);

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
