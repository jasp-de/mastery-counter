import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuestBanner() {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium">Review mode — no sign-in required</p>
          <p className="text-sm text-muted-foreground">
            Your counters are saved in this browser only. Sign in to sync across
            devices.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="shrink-0" asChild>
        <Link href="/login">Sign in with Google</Link>
      </Button>
    </div>
  );
}
