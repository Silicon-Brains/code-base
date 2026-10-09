import type { AdminDashboard } from "@/lib/types";

const COLORS: Record<string, string> = {
  ongoing:   "#2a6a4d",
  completed: "#1f4e3d",
  planning:  "#d9b869",
  on_hold:   "#b8bcb5",
  cancelled: "#c5383a",
};

const LABELS: Record<string, string> = {
  ongoing:   "Ongoing",
  completed: "Completed",
  planning:  "Planning",
  on_hold:   "On Hold",
  cancelled: "Cancelled",
};

export default function ProjectStatusDonut({ data }: { data: AdminDashboard["projectStatus"] }) {
  const total = data.reduce((n, d) => n + d.count, 0);

  // Build SVG arcs.
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = data.map((d) => {
    const fraction = total > 0 ? d.count / total : 0;
    const dash = fraction * C;
    const arc = { ...d, dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="rounded-2xl border border-outline bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-on-surface">Project Status</h2>
        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">All Projects</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-surface-container-high)" strokeWidth="14" />
            {arcs.map((a, i) => (
              <circle
                key={i}
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke={COLORS[a.status] ?? "#999"}
                strokeWidth="14"
                strokeDasharray={`${a.dash} ${C - a.dash}`}
                strokeDashoffset={-a.offset}
                transform="rotate(-90 60 60)"
              />
            ))}
            <text x="60" y="56" textAnchor="middle" className="fill-on-surface text-[18px] font-bold">{total}</text>
            <text x="60" y="70" textAnchor="middle" className="fill-on-surface-variant text-[9px] uppercase tracking-wider">Projects</text>
          </svg>
        </div>

        <ul className="min-w-0 flex-1 space-y-2 text-xs">
          {data.length === 0 ? (
            <li className="text-on-surface-variant">No projects yet.</li>
          ) : (
            data.map((d) => (
              <li key={d.status} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[d.status] }} />
                  {LABELS[d.status] ?? d.status}
                </span>
                <span className="font-semibold text-on-surface">{d.count}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}