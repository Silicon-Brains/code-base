import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  onClick?: never;
  type?: never;
  external?: boolean;
}

interface ButtonAsButton extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: never;
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Solid dark green — the "Start a Project" pill in the new design.
  primary:
    "bg-primary text-on-primary shadow-[0_2px_14px_rgba(31,78,61,0.18)] hover:bg-secondary hover:shadow-[0_4px_20px_rgba(31,78,61,0.28)]",
  // White pill with a hairline border — "Explore Our Work".
  secondary:
    "bg-surface text-on-surface border border-outline hover:border-primary/40 hover:text-primary",
  ghost: "bg-transparent text-on-surface-variant hover:text-on-surface",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  href,
  onClick,
  type = "button",
  external = false,
}: ButtonProps) {
  const classes = `${BASE} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
          {icon}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
      {icon}
    </button>
  );
}
