import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

const DESCRIPTION =
  "SiliconBrains is a software engineering studio building full-stack web platforms and native Android apps for high-growth ventures — clean architecture, strict testing, 100% client IP ownership.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SiliconBrains — Engineering Software with Sovereign Rigor",
    template: "%s | SiliconBrains",
  },
  description: DESCRIPTION,
  applicationName: "SiliconBrains",
  openGraph: {
    type: "website",
    siteName: "SiliconBrains",
    title: "SiliconBrains — Engineering Software with Sovereign Rigor",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#051F20" };

// No <ClerkProvider> here on purpose (Phase 7): it reads cookies/headers during SSR and forces
// every route under it into dynamic rendering. Public marketing pages don't touch Clerk at all,
// so keeping this root layout provider-free lets them stay static/ISR (fetch-layer `revalidate: 60`
// actually takes effect instead of being moot). ClerkProvider is scoped down into the route groups
// that actually need it: (admin), (portal), sign-in, sign-up — see their own layout.tsx files.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-display">{children}</body>
    </html>
  );
}
