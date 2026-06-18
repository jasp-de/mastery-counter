import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
