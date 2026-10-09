"use client";

import { useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <Card className="flex flex-col items-start gap-4 !border-error/40">
      <div>
        <p className="text-xs uppercase tracking-wide text-error">Something went wrong</p>
        <h1 className="mt-1 text-xl font-semibold text-on-surface">This screen couldn't load</h1>
        <p className="mt-2 max-w-md text-sm text-on-surface-variant">
          The API may be unreachable, or your session may have expired. Try again, or head back to the dashboard.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
        <Button href="/admin" variant="secondary">
          Back to dashboard
        </Button>
      </div>
    </Card>
  );
}
