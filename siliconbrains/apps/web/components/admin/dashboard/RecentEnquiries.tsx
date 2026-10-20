import Link from "next/link";
import type { AdminDashboard } from "@/lib/types";
import { formatDate } from "@/lib/format";

const STATUS_STYLE: Record<string, string> = {
  new:       "bg-secondary-container text-primary",
  contacted: "bg-[#eef2ec] text-on-surface-variant",
  converted: "bg-secondary-container text-primary",
  archived:  "bg-[#eef2ec] text-on-surface-variant opacity-70",
};

const LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Approved",
  archived: "Archived",
};

export default function RecentEnquiries({ items }: { items: AdminDashboard["recentEnquiries"] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-outline bg-surface">
      <div className="flex items-center justify-between border-b border-outline px-5 py-4">
        <h2 className="text-sm font-bold text-on-surface">Recent Enquiries</h2>
        <Link href="/admin/leads" className="text-[11px] font-medium text-primary hover:underline">View All →</Link>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-on-surface-variant">No enquiries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="border-b border-outline text-[10px] uppercase tracking-wider text-on-surface-variant">
                <th className="px-5 py-2.5 font-medium">Name</th>
                <th className="px-3 py-2.5 font-medium">Email</th>
                <th className="px-3 py-2.5 font-medium">Type</th>
                <th className="px-3 py-2.5 font-medium">Budget</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-b border-outline/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-on-surface">{e.full_name}</td>
                  <td className="px-3 py-3 truncate text-on-surface-variant">{e.work_email}</td>
                  <td className="px-3 py-3 truncate text-on-surface-variant">{e.project_type ?? "—"}</td>
                  <td className="px-3 py-3 truncate text-on-surface-variant">{e.budget_range ?? "—"}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[e.status] ?? STATUS_STYLE.new}`}>
                      {LABEL[e.status] ?? e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-on-surface-variant">{formatDate(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
