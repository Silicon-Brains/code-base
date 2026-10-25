import type { Metadata } from "next";

export const SITE_NAME = "SiliconBrains";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.siliconbrains.in").replace(/\/$/, "");
export const SITE_DESCRIPTION =
  "SiliconBrains designs and builds custom web applications, backend platforms, and Android apps for startups and businesses. From product strategy to launch, build with an experienced engineering team.";
export const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Shared metadata for indexable public pages. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE] },
  };
}
