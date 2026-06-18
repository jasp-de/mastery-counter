"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SaveIndicator } from "@/components/save-indicator";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCountersState } from "@/components/providers/counters-provider";

interface AppHeaderProps {
  variant?: "home" | "page";
  title?: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export function AppHeader({
  variant = "page",
  title,
  subtitle,
  backHref = "/",
  actions,
}: AppHeaderProps) {
  const { saveStatus, isGuest, hydrated } = useCountersState();

  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        {variant === "home" ? (
          <div>
            <BrandLogo size="md" href="/" />
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {backHref && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2 mb-2 h-8 px-2 text-muted-foreground"
                  asChild
                >
                  <Link href={backHref}>
                    <ArrowLeft className="size-4" />
                    Back
                  </Link>
                </Button>
              )}
              {title && (
                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && <div className="shrink-0 pt-1">{actions}</div>}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
        {hydrated && <SaveIndicator status={saveStatus} isGuest={isGuest} />}
        <div className="flex items-center gap-0.5">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
