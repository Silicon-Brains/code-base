import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: "Custom software development studio building web, Android, and backend products.",
    start_url: SITE_URL,
    display: "standalone",
    background_color: "#f5f7f4",
    theme_color: "#051f20",
    lang: "en-IN",
  };
}
