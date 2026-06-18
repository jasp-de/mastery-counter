"use client";

import { WifiOff } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <BrandLogo size="sm" className="justify-center" />
          </div>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <WifiOff className="size-6 text-muted-foreground" />
          </div>
          <CardTitle>You&apos;re offline</CardTitle>
          <CardDescription>
            No signal — can&apos;t sign in or sync. Your guest hours should still
            be here when the Wi‑Fi stops gaslighting you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
