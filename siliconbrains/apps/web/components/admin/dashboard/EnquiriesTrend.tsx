import type { AdminDashboard } from "@/lib/types";

export default function EnquiriesTrend({ data }: { data: AdminDashboard["enquiryTrend"] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.enquiries, d.converted]));
  const W = 720;
  const H = 180;
  const PAD = 24;

  const x = (i: number) => PAD + (i * (W - PAD * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);

  const line = (key: "enquiries" | "converted") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[key])}`).join(" ");

  const area = `${line("enquiries")} L ${x(data.length - 1)} ${H - PAD} L ${x(0)} ${H - PAD} Z`;

  return (
    <div className="rounded-2xl border border-outline bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-on-surface">Enquiries Overview</h2>
        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Last 9 months</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={PAD}
            x2={W - PAD}
            y1={PAD + (i * (H - PAD * 2)) / 4}
            y2={PAD + (i * (H - PAD * 2)) / 4}
            stroke="var(--color-outline)"
            strokeWidth="1"
          />
        ))}

        {/* Area under enquiries */}
        <path d={area} fill="var(--color-primary)" opacity="0.08" />

        {/* Lines */}
        <path d={line("enquiries")} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={line("converted")} fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />

        {/* Points on enquiries */}
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.enquiries)} r="3" fill="var(--color-primary)" />
        ))}
      </svg>

      <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-on-surface-variant">
        {data.map((d) => <span key={d.month}>{d.month}</span>)}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-outline pt-3 text-[11px]">
        <span className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="h-2 w-2 rounded-full bg-primary" /> Enquiries
        </span>
        <span className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="h-2 w-2 rounded-full bg-secondary" /> Converted
        </span>
      </div>
    </div>
  );
}