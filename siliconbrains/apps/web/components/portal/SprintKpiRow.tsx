import type { SprintCycle, PortalProject } from "@/lib/types";

interface Props {
  sprint: SprintCycle | null;
  project: PortalProject;
}

function Tile({ label, value, sub, badge, progress }: { label: string; value: string; sub?: string; badge?: string; progress?: number }) {
  return (
    <div className="rounded-lg border border-outline bg-surface-container/60 p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</p>
        {badge && (
          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-on-surface">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-on-surface-variant">{sub}</p>}
      {typeof progress === "number" && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
      )}
    </div>
  );
}

export default function SprintKpiRow({ sprint, project }: Props) {
  const pct = sprint && sprint.deliverables_total > 0
    ? Math.round((sprint.deliverables_done / sprint.deliverables_total) * 100)
    : project.progress_percent;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Tile
        label={sprint?.sprint_label ?? "Sprint"}
        value={sprint?.velocity_label ?? `${pct}%`}
        sub={sprint?.velocity_sub ?? `${project.progress_percent}% complete`}
        badge={sprint?.dates_label ?? undefined}
        progress={pct}
      />
      <Tile
        label="Staging Health RC3"
        value={sprint?.build_label ?? "—"}
        sub={sprint?.build_sub ?? "No active build"}
        badge="Pass"
      />
      <Tile
        label="Sovereign Codebase"
        value={sprint?.code_delta_label ?? "—"}
        sub={sprint?.commits_label ?? "—"}
        badge={sprint?.governance_label ? `${sprint.governance_label} ${sprint.governance_sub ?? ""}`.trim() : undefined}
      />
      <Tile
        label="Milestone Cap Burn-Down"
        value={sprint?.milestone_paid_label ?? "—"}
        sub={sprint?.milestone_total_label ?? undefined}
        badge={sprint?.milestone_status ?? undefined}
      />
    </div>
  );
}