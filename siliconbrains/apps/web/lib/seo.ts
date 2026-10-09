import type { Metadata } from "next";

/** Per-page metadata helper: title (root layout adds the " | SiliconBrains" suffix), description, canonical, OG/Twitter. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | SiliconBrains`, description, url: path, type: "website", siteName: "SiliconBrains" },
    twitter: { card: "summary_large_image", title: `${title} | SiliconBrains`, description },
  };
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
