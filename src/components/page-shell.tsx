import type { ReactNode } from "react";
import { AppNav } from "@/components/app-nav";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  /** Extra bottom padding when nav is shown (default true) */
  withNav?: boolean;
}

export function PageShell({
  children,
  className,
  withNav = true,
}: PageShellProps) {
  return (
    <div className="page-shell min-h-screen">
      <div
        className={cn(
          "mx-auto max-w-2xl px-4 py-10 sm:px-6",
          withNav && "pb-28",
          className,
        )}
      >
        {children}
      </div>
      {withNav && <AppNav />}
    </div>
  );
}
