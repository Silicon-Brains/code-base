import type { ReactNode } from "react";

interface TechChip {
  label: string;
  icon?: ReactNode;
}

const COLORFUL_CHIP_CLASSES = [
  "border-violet-200 bg-violet-100 text-violet-800",
  "border-sky-200 bg-sky-100 text-sky-800",
  "border-amber-200 bg-amber-100 text-amber-800",
  "border-rose-200 bg-rose-100 text-rose-800",
  "border-teal-200 bg-teal-100 text-teal-800",
  "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-800",
  "border-yellow-200 bg-yellow-100 text-yellow-800",
  "border-cyan-200 bg-cyan-100 text-cyan-800",
];

export default function TechChips({
  items,
  className = "",
  variant = "default",
}: {
  items: TechChip[];
  className?: string;
  variant?: "default" | "colorful";
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((t, index) => (
        <span
          key={t.label}
          className={`inline-flex max-w-full items-center gap-1.5 border transition duration-200 ${
            variant === "colorful"
              ? `rounded-2xl px-3.5 py-2 text-xs font-semibold leading-5 group-hover:-translate-y-0.5 sm:px-4 sm:text-sm ${COLORFUL_CHIP_CLASSES[index % COLORFUL_CHIP_CLASSES.length]}`
              : "rounded-lg border-outline bg-surface px-2.5 py-1 text-[11px] font-medium text-on-surface-variant"
          }`}
        >
          {t.icon}
          {t.label}
        </span>
      ))}
    </div>
  );
}
