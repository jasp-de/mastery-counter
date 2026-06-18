import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GuestBanner() {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Guest mode — hours live on this device only. Sign in to lock them in everywhere.
      </p>
      <Button variant="outline" size="sm" className="shrink-0" asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    </div>
  );
}
