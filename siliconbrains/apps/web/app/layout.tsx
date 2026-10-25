import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SiliconBrains | Custom Software Development Studio",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "technology",
  keywords: [
    "SiliconBrains",
    "silicon brains nagpur",
    "silicon brains india",
    "mohit shivankar",
    "mr.slicon",
    "Siliconbrains Softwares",
    "custom software development",
    "web application development",
    "Android app development",
    "full-stack development",
    "software engineering studio",
    "software development company India",
    "custom software development India",
  ],
  alternates: { canonical: "/" },
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "SiliconBrains | Custom Software Development Studio",
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION, images: [DEFAULT_OG_IMAGE] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/icon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#051F20" };

// No <ClerkProvider> here on purpose (Phase 7): it reads cookies/headers during SSR and forces
// every route under it into dynamic rendering. Public marketing pages don't touch Clerk at all,
// so keeping this root layout provider-free lets them stay static/ISR (fetch-layer `revalidate: 60`
// actually takes effect instead of being moot). ClerkProvider is scoped down into the route groups
// that actually need it: (admin), (portal), sign-in, sign-up — see their own layout.tsx files.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "SiliconBrains",
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        email: "engineering@siliconbrains.com",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "SiliconBrains",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-display">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
