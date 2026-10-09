import type { ReactNode, HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = "", ...rest }: SectionProps) {
  return (
    <section className={`mx-auto w-full max-w-container px-4 md:px-10 ${className}`} {...rest}>
      {children}
    </section>
  );
}