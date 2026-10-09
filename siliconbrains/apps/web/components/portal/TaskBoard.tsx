import type { SprintCycle, ProjectTask } from "@/lib/types";

function TaskIcon({ name }: { name: string | null }) {
  const common = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "gateway":
      return <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></svg>;
    case "billing":
      return <svg {...common}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6" /></svg>;
    case "cache":
      return <svg {...common}><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>;
    case "graph":
      return <svg {...common}><circle cx="6" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="12" cy="12" r="3" /><path d="M8 16l3-3M13 11l3-3" /></svg>;
    default:
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6M9 13h4" /></svg>;
  }
}

export default function TaskBoard({ sprint, tasks }: { sprint: SprintCycle | null; tasks: ProjectTask[] }) {
  const total = sprint?.deliverables_total ?? 0;
  const done = sprint?.deliverables_done ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-outline bg-surface-container/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">
            {sprint?.sprint_label ?? "Sprint Cycle"}
            {sprint?.dates_label ? ` · Ends ${sprint.dates_label}` : ""}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-on-surface">
            {sprint?.build_label ? `${sprint.build_label} Sprint` : "Current Sprint"}
          </h2>
        </div>
        <button className="rounded-md border border-outline px-3 py-1.5 text-[11px] text-on-surface-variant hover:border-primary/30">
          Filter Scope
        </button>
      </div>

      {/* Scope bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="text-on-surface-variant">Sprint Scope Completion</span>
          <span className="text-on-surface">{pct}% ({done}/{total} Stories)</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-on-surface-variant">
          <span>● Verified ({Math.max(0, done - 4)})</span>
          <span>● In Staging / QA ({Math.min(4, done)})</span>
          <span>● Engineering Queue ({Math.max(0, total - done)})</span>
        </div>
      </div>

      {/* Task list */}
      <div className="flex flex-col divide-y divide-outline">
        {tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-on-surface-variant">No tasks on the board right now.</p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="flex items-start gap-3 py-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-outline bg-surface-container-high text-primary">
                <TaskIcon name={t.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-on-surface">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-on-surface-variant">{t.description}</p>}
              </div>
              {t.engineering_status && (
                <span className="shrink-0 rounded-full border border-outline bg-surface-container-high px-2.5 py-1 text-[10px] text-on-surface-variant">
                  {t.engineering_status}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}