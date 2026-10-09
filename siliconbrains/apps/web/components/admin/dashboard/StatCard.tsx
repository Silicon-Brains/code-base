import type { ReactNode } from "react";
import type { AdminDashboardKpi } from "@/lib/types";

const TONE: Record<string, { chip: string; icon: string }> = {
  enquiries: { chip: "bg-secondary-container text-primary", icon: "inbox" },
  projects:  { chip: "bg-secondary-container text-primary", icon: "folder" },
  clients:   { chip: "bg-secondary-container text-primary", icon: "users" },
  messages:  { chip: "bg-[#fef3e8] text-[#b06a1e]",         icon: "message" },
};

export default function StatCard({
  label,
  kpi,
  tone,
  sub,
}: {
  label: string;
  kpi: AdminDashboardKpi;
  tone: keyof typeof TONE;
  sub?: string;
}) {
  const { chip, icon } = TONE[tone];
  const positive = kpi.delta >= 0;

  return (
    <div className="rounded-2xl border border-outline bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${chip}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {icon === "inbox" && <path d="M3 12l3-7h12l3 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7zM3 12h5l1 3h6l1-3h5" />}
            {icon === "folder" && <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />}
            {icon === "users" && <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0112 0M16 5a3.5 3.5 0 010 7M22 20a5 5 0 00-4-4.9" /></>}
            {icon === "message" && <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z" />}
          </svg>
        </span>
        {kpi.delta !== 0 && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${positive ? "bg-secondary-container text-primary" : "bg-error/10 text-error"}`}>
            {positive ? "↗" : "↘"} {Math.abs(kpi.delta)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-on-surface">{kpi.value}</p>
      <p className="mt-1 text-xs font-medium text-on-surface-variant">{label}</p>
      {sub && <p className="mt-0.5 text-[10px] text-on-surface-variant/70">{sub}</p>}
    </div>
  );
}