"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminPageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname} className="admin-page-enter">{children}</div>;
}
