import type { AdminDashboard } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function UpcomingTasks({ items }: { items: AdminDashboard["upcomingTasks"] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-outline bg-surface">
      <div className="border-b border-outline px-5 py-4">
        <h2 className="text-sm font-bold text-on-surface">Upcoming Tasks</h2>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-6 text-center text-xs text-on-surface-variant">Nothing on your list.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-outline">
          {items.map((t) => (
            <li key={t.id} className="flex items-start gap-3 px-5 py-3">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full border border-outline" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-on-surface">{t.title}</p>
                <p className="truncate text-[10px] text-on-surface-variant">
                  {t.project_title ?? "General"} · {t.due_date ? formatDate(t.due_date) : "No due date"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}