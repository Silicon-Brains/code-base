
import type { PortalTeamMember } from "@/lib/types";

export default function TeamRoster({ team }: { team: PortalTeamMember[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-outline bg-surface-container/60 p-5">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Dedicated Engineering Squad Response</p>
        <h2 className="mt-1 text-base font-semibold text-on-surface">Assigned Alpha Core</h2>
      </div>

      {team.length === 0 ? (
        <p className="py-4 text-center text-xs text-on-surface-variant">No team members assigned yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-outline">
          {team.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline bg-surface-container-high text-[11px] font-semibold text-primary">
                {m.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-on-surface">{m.full_name}</p>
                <p className="truncate text-[11px] text-on-surface-variant">
                  {m.role}
                  {m.handle ? ` · ${m.handle}` : ""}
                </p>
              </div>
              {m.status && (
                <span className="shrink-0 rounded-full border border-outline bg-surface-container-high px-2 py-0.5 text-[9px] uppercase tracking-wide text-on-surface-variant">
                  {m.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <a
        href="#"
        className="mt-1 inline-flex items-center justify-center rounded-md border border-outline px-3 py-2 text-[11px] text-on-surface-variant hover:border-primary/30 hover:text-on-surface"
      >
        Open #squad-core in Slack ↗
      </a>
    </section>
  );
}