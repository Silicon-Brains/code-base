"use client";

import { useState } from "react";

interface AccordionItem { question: string; answer: string; }

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-outline bg-surface">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className={i > 0 ? "border-t border-outline" : ""}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-6 py-5 text-left text-sm font-semibold text-on-surface transition-colors hover:text-primary md:text-base"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
              <span className="flex-1">{item.question}</span>
            </button>
            {isOpen && (
              <div className="px-6 pb-5 pl-16 text-sm leading-relaxed text-on-surface-variant">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}