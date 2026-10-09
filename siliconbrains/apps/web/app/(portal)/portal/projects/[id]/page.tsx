import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/portal/ProgressBar";
import StatusBadge from "@/components/portal/StatusBadge";
import { api, ApiError, loadOr } from "@/lib/api";
import { formatDate, formatMoney, isPast } from "@/lib/format";
import type { PortalProjectDetail } from "@/lib/types";

export default async function PortalProjectPage({ params }: { params: { id: string } }) {
  const token = (await auth().getToken()) ?? "";

  let project: PortalProjectDetail;
  try {
    project = await api.portal.getProject(token, params.id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    return (
      <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
        {e instanceof Error ? e.message : "Failed to load this project"}
      </div>
    );
  }

  // Phase names come from the public CMS (same steps shown on /process).
  const phases = await loadOr("process steps", () => api.getProcessSteps(), []);
  const currentPhase = phases.find((s) => s.phase_number === project.current_phase);

  return (
    <div className="flex flex-col gap-8">
      <Link href="/portal" className="text-xs text-on-surface-variant hover:text-on-surface">
        ← All projects
      </Link>

      {/* Status card */}
      <Card className="flex flex-col gap-5 !bg-surface-container-high">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-on-surface md:text-3xl">{project.title}</h1>
          <Badge active>
            Phase {project.current_phase}
            {currentPhase ? ` · ${currentPhase.title}` : ""}
          </Badge>
        </div>
        {project.status_summary && <p className="max-w-2xl text-sm text-on-surface-variant">{project.status_summary}</p>}
        <ProgressBar percent={project.progress_percent} />
        <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Last updated {formatDate(project.updated_at)}</p>
      </Card>

      {/* Phase stepper */}
      {phases.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-on-surface">Delivery phase</h2>
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
            {phases.map((s) => {
              const state = s.phase_number < project.current_phase ? "done" : s.phase_number === project.current_phase ? "current" : "upcoming";
              return (
                <li
                  key={s.id}
                  aria-current={state === "current" ? "step" : undefined}
                  className={`rounded-lg border p-4 ${
                    state === "current"
                      ? "border-primary/40 bg-primary/10"
                      : state === "done"
                        ? "border-outline bg-surface-container/60"
                        : "border-outline/60 bg-transparent opacity-60"
                  }`}
                >
                  <p className={`mb-1 text-xs ${state === "upcoming" ? "text-on-surface-variant" : "text-primary"}`}>
                    {state === "done" ? "✓ " : ""}
                    {String(s.phase_number).padStart(2, "0")}
                  </p>
                  <p className="text-xs font-medium text-on-surface">{s.title}</p>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Milestones */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-on-surface">Milestones</h2>
        {project.milestones.length === 0 ? (
          <Card>
            <p className="text-sm text-on-surface-variant">No milestones have been added yet.</p>
          </Card>
        ) : (
          <ol className="flex flex-col">
            {project.milestones.map((m, i) => {
              const late = m.status !== "done" && isPast(m.due_date);
              return (
                <li key={m.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1.5 h-3 w-3 shrink-0 rounded-full border ${
                        m.status === "done"
                          ? "border-primary bg-primary"
                          : m.status === "in_progress"
                            ? "border-primary bg-primary/30"
                            : "border-outline bg-transparent"
                      }`}
                    />
                    {i < project.milestones.length - 1 && <span className="w-px flex-1 bg-outline" />}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-medium text-on-surface">{m.title}</p>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className={`mt-1 text-xs ${late ? "text-error" : "text-on-surface-variant"}`}>
                      {m.due_date ? `Due ${formatDate(m.due_date)}${late ? " · past due" : ""}` : "No due date"}
                    </p>
                    {m.notes && <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm text-on-surface-variant">{m.notes}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* Invoices for this project */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface">Invoices</h2>
          <Link href="/portal/invoices" className="text-xs text-primary hover:underline">
            All invoices →
          </Link>
        </div>
        {project.invoices.length === 0 ? (
          <Card>
            <p className="text-sm text-on-surface-variant">No invoices for this project yet.</p>
          </Card>
        ) : (
          <Card className="overflow-x-auto !p-0">
            <table className="w-full min-w-[520px] text-left text-sm">
              <tbody>
                {project.invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-outline/60 last:border-0">
                    <td className="px-4 py-3 text-on-surface">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatMoney(Number(inv.amount), inv.currency)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">Due {formatDate(inv.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </div>
  );
}
