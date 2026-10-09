import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

// Private area: keep out of search results (robots.ts also disallows the path).
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Scoped ClerkProvider — see app/layout.tsx for why it isn't in the root layout.
export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
