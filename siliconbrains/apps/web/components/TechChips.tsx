import type { ReactNode } from "react";

interface TechChip {
  label: string;
  icon?: ReactNode;
}

export default function TechChips({ items, className = "" }: { items: TechChip[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((t) => (
        <span
          key={t.label}
          className="inline-flex items-center gap-1.5 rounded-lg border border-outline bg-surface px-2.5 py-1 text-[11px] font-medium text-on-surface-variant"
        >
          {t.icon}
          {t.label}
        </span>
      ))}
    </div>
  );
}