"use client";

import { useUser } from "@clerk/nextjs";

export default function WelcomeBanner() {
  const { user } = useUser();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-wrap items-start justify-between gap-6 rounded-2xl border border-outline bg-surface px-6 py-6 md:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Welcome back, {user?.firstName ?? "Admin"} <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Here's what's happening in your workspace today.
        </p>
      </div>
      <div className="flex items-center gap-3 text-right">
        <div>
          <p className="text-xs font-medium text-on-surface">{today}</p>
          <p className="mt-0.5 text-[10px] text-on-surface-variant">Have a productive day!</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2L2 8l10 6 10-6-10-6z" strokeLinejoin="round" />
            <path d="M2 16l10 6 10-6" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}