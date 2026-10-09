import Link from "next/link";
import type { AdminDashboard } from "@/lib/types";

export default function RecentMessages({ items }: { items: AdminDashboard["recentMessages"] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-outline bg-surface">
      <div className="flex items-center justify-between border-b border-outline px-5 py-4">
        <h2 className="text-sm font-bold text-on-surface">Recent Messages</h2>
        <Link href="/admin/messages" className="text-[11px] font-medium text-primary hover:underline">View All →</Link>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-on-surface-variant">No messages yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-outline">
          {items.map((m) => (
            <li key={m.id} className="flex items-start gap-3 px-5 py-3">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${m.unread ? "bg-primary" : "bg-transparent"}`} />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm ${m.unread ? "font-semibold text-on-surface" : "font-medium text-on-surface-variant"}`}>
                  {m.from_name}
                </p>
                <p className="truncate text-[11px] text-on-surface-variant">{m.preview || "(no subject)"}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}