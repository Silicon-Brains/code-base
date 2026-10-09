import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  className?: string;
}

export default function Card({
  children,
  interactive = false,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-outline bg-surface p-6 transition-all duration-200 ${
        interactive
          ? "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_8px_30px_rgba(20,38,30,0.06)]"
          : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}