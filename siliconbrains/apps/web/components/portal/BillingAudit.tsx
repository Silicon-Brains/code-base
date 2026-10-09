import type { PortalMilestone } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";
import StatusBadge from "./StatusBadge";

export default function BillingAudit({ milestones }: { milestones: PortalMilestone[] }) {
  const billable = milestones.filter((m) => m.amount != null).slice(0, 2);
  if (billable.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-outline bg-surface-container/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Financial Retainer &amp; Ledger</p>
          <h2 className="mt-1 text-lg font-semibold text-on-surface">Milestone Billing Audit</h2>
        </div>
        <button className="rounded-md border border-outline px-3 py-1.5 text-[11px] text-on-surface-variant hover:border-primary/30">
          Download Summary PDF
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {billable.map((m) => (
          <div key={m.id} className="flex flex-col gap-2 rounded-lg border border-outline bg-surface-container/60 p-4">
            <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Milestone</p>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-on-surface">{m.title}</p>
              <StatusBadge status={m.status} />
            </div>
            <p className="text-xl font-semibold text-on-surface">
              {m.amount != null ? formatMoney(Number(m.amount), m.currency ?? "USD") : "—"}
            </p>
            <p className="text-[11px] text-on-surface-variant">
              {m.paid_at ? `Cleared via ${m.paid_via ?? "ACH"} on ${formatDate(m.paid_at)}` : m.due_date ? `Due ${formatDate(m.due_date)}` : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}