"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SaveIndicator } from "@/components/save-indicator";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCountersState } from "@/components/providers/counters-provider";
import { APP_TAGLINE } from "@/lib/constants";

interface AppHeaderProps {
  variant?: "home" | "page";
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export function AppHeader({
  variant = "page",
  title,
  subtitle,
  backHref = "/",
}: AppHeaderProps) {
  const { saveStatus, isGuest, hydrated } = useCountersState();

  return (
    <header className="mb-10 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        {variant === "home" ? (
          <div>
            <BrandLogo size="lg" showTagline href="/" />
            {subtitle && (
              <p className="mt-4 max-w-md text-muted-foreground">{subtitle}</p>
            )}
          </div>
        ) : (
          <>
            {backHref && (
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 mb-3 h-8 px-2 text-muted-foreground"
                asChild
              >
                <Link href={backHref}>
                  <ArrowLeft className="size-4" />
                  All counters
                </Link>
              </Button>
            )}
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-primary">
              {APP_TAGLINE}
            </p>
            {title && (
              <h1
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 max-w-md text-muted-foreground">{subtitle}</p>
            )}
          </>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
        {hydrated && (
          <SaveIndicator status={saveStatus} isGuest={isGuest} />
        )}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
