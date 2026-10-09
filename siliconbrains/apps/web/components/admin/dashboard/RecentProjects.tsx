import Link from "next/link";
import type { AdminDashboard } from "@/lib/types";
import { formatDate } from "@/lib/format";

const STATUS_STYLE: Record<string, string> = {
  ongoing:   "bg-secondary-container text-primary",
  completed: "bg-[#e6f0e9] text-[#1f4e3d]",
  planning:  "bg-[#fdf3dd] text-[#8a6b12]",
  on_hold:   "bg-[#eef2ec] text-on-surface-variant",
  cancelled: "bg-error/10 text-error",
};

export default function RecentProjects({ items }: { items: AdminDashboard["recentProjects"] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-outline bg-surface">
      <div className="flex items-center justify-between border-b border-outline px-5 py-4">
        <h2 className="text-sm font-bold text-on-surface">Recent Projects</h2>
        <Link href="/admin/engagements" className="text-[11px] font-medium text-primary hover:underline">View All →</Link>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-on-surface-variant">No projects yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-outline">
          {items.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-xs font-bold text-primary">
                {p.title.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-on-surface">{p.title}</p>
                <p className="truncate text-[11px] text-on-surface-variant">{p.category ?? "—"} · {formatDate(p.updated_at)}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_STYLE[p.status] ?? STATUS_STYLE.ongoing}`}>
                {p.status.replace("_", " ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}