"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[public]", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] w-full max-w-container flex-col items-center justify-center gap-4 px-4 py-24 text-center md:px-10">
        <p className="text-xs uppercase tracking-wide text-error">Something went wrong</p>
        <h1 className="text-3xl font-semibold text-on-surface md:text-4xl">This page hit a snag</h1>
        <p className="max-w-md text-sm text-on-surface-variant">
          Please try again — if the problem continues, let us know.
        </p>
        <div className="mt-2 flex gap-2">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
