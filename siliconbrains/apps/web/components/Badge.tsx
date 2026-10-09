import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  active?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function Badge({ children, active = false, icon, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide ${
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-outline bg-surface-container/50 text-on-surface-variant"
      } ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
