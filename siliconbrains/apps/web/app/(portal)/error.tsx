"use client";

import { useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[portal]", error);
  }, [error]);

  return (
    <Card className="flex flex-col items-start gap-4 !border-error/40">
      <div>
        <p className="text-xs uppercase tracking-wide text-error">Something went wrong</p>
        <h1 className="mt-1 text-xl font-semibold text-on-surface">We couldn't load this page</h1>
        <p className="mt-2 max-w-md text-sm text-on-surface-variant">
          This is usually temporary. Try again, or reach out if it keeps happening.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
        <Button href="/portal" variant="secondary">
          Back to dashboard
        </Button>
        <Button href="/contact" variant="ghost">
          Contact us
        </Button>
      </div>
    </Card>
  );
}
