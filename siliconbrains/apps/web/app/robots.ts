import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";
  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/", disallow: ["/admin/", "/portal/", "/sign-in/", "/sign-up/", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    ...(isProduction ? { sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL } : {}),
  };
}
