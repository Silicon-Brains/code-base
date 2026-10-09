import type { MilestoneStatus, InvoiceStatus } from "@/lib/types";

type AnyStatus = MilestoneStatus | InvoiceStatus | string;

// Every status the portal renders (milestones, invoices, and the free-text
// "verification_pending"-style strings that show up in the billing audit panel).
type Tone = "solid-primary" | "solid-error" | "outline-primary" | "outline-error" | "outline-neutral";

interface Variant {
  label: string;
  tone: Tone;
  dot: boolean;
}

const VARIANTS: Record<string, Variant> = {
  // Milestones
  done:          { label: "Done",                 tone: "solid-primary",  dot: false },
  paid:          { label: "Paid",                 tone: "solid-primary",  dot: false },
  in_progress:   { label: "In progress",          tone: "outline-primary", dot: true },
  verification_pending: { label: "Verification pending", tone: "outline-neutral", dot: true },
  pending:       { label: "Pending",              tone: "outline-neutral", dot: true },

  // Invoices
  overdue:       { label: "Overdue",              tone: "solid-error",    dot: false },

  // Pipeline / build markers that appear next to sprint KPIs
  passed:        { label: "Pass",                 tone: "solid-primary",  dot: false },
  pass:          { label: "Pass",                 tone: "solid-primary",  dot: false },
  failed:        { label: "Failed",               tone: "solid-error",    dot: false },
  running:       { label: "Running",              tone: "outline-primary", dot: true },
};

const TONE_CLASS: Record<Tone, string> = {
  "solid-primary":
    "border-primary/50 bg-primary text-on-primary font-semibold shadow-[0_0_12px_rgba(169,210,182,0.25)]",
  "solid-error":
    "border-error/50 bg-error text-background font-semibold",
  "outline-primary":
    "border-primary/40 bg-primary/10 text-primary",
  "outline-error":
    "border-error/40 bg-error/10 text-error",
  "outline-neutral":
    "border-outline bg-surface-container-high text-on-surface-variant",
};

const DOT_CLASS: Record<Tone, string> = {
  "solid-primary": "bg-on-primary/70",
  "solid-error": "bg-background/70",
  "outline-primary": "bg-primary",
  "outline-error": "bg-error",
  "outline-neutral": "bg-on-surface-variant/70",
};

function humanize(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusBadge({
  status,
  size = "md",
  className = "",
}: {
  status: AnyStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  const v = VARIANTS[status] ?? {
    label: humanize(status),
    tone: "outline-neutral" as Tone,
    dot: false,
  };

  const sizeCls =
    size === "sm"
      ? "px-2 py-0.5 text-[9px] gap-1"
      : "px-2.5 py-1 text-[10px] gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium uppercase tracking-wider whitespace-nowrap ${sizeCls} ${TONE_CLASS[v.tone]} ${className}`}
    >
      {v.dot && (
        <span
          aria-hidden
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASS[v.tone]}`}
        />
      )}
      {v.label}
    </span>
  );
}