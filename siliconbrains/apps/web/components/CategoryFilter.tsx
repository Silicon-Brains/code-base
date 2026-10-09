"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterCtx {
  active: string | null;
  setActive: (value: string | null) => void;
}

const Ctx = createContext<FilterCtx>({ active: null, setActive: () => {} });

export function FilterProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  return <Ctx.Provider value={{ active, setActive }}>{children}</Ctx.Provider>;
}

const CHIP_BASE =
  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const CHIP_ACTIVE = "border-primary bg-primary text-on-primary";
const CHIP_IDLE = "border-outline bg-surface text-on-surface-variant hover:border-primary/40 hover:text-primary";

export function FilterChips({
  allLabel,
  categories,
  className = "",
}: {
  allLabel: string;
  categories: string[];
  className?: string;
}) {
  const { active, setActive } = useContext(Ctx);
  const chips: { label: string; value: string | null }[] = [
    { label: allLabel, value: null },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div role="group" aria-label="Filter by category" className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => {
        const isActive = active === chip.value;
        return (
          <button
            key={chip.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActive(chip.value)}
            className={`${CHIP_BASE} ${isActive ? CHIP_ACTIVE : CHIP_IDLE}`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterItem({
  category,
  children,
}: {
  category: string | null | (string | null)[];
  children: ReactNode;
}) {
  const { active } = useContext(Ctx);
  const cats = Array.isArray(category) ? category : [category];
  const visible = active === null || cats.includes(active);
  return (
    <div className={visible ? "contents" : "hidden"} aria-hidden={!visible}>
      {children}
    </div>
  );
}