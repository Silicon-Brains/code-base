import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import PortalNav from "@/components/portal/PortalNav";

// Private area: keep out of search results (robots.ts also disallows the path).
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Middleware already blocks signed-out users from /portal/*.
// This layout adds the role check: only role=client may proceed
// (admins manage clients from /admin). UX gate only — Express enforces role + ownership on every call.
// <ClerkProvider> lives here (not in the root layout) so public pages stay outside Clerk's SSR
// cookie read and can remain static — see app/layout.tsx for the full rationale.
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { userId, getToken } = auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const profile = res.ok ? await res.json() : null;

  if (!profile || profile.role !== "client") redirect("/");

  return (
    <ClerkProvider>
      <div className="min-h-screen bg-background">
        <div className="pt-4">
          <PortalNav />
        </div>
        <main className="mx-auto w-full max-w-container px-4 py-10 md:px-10">{children}</main>
      </div>
    </ClerkProvider>
  );
}
