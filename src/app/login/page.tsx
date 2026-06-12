import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { APP_DESCRIPTION } from "@/lib/constants";
import { isGoogleAuthConfigured } from "@/lib/env";

export default function LoginPage() {
  const googleEnabled = isGoogleAuthConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/40 via-background to-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <BrandLogo size="md" showTagline className="justify-center" />
          <CardDescription className="mt-4">{APP_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {googleEnabled ? (
            <>
              <GoogleSignInButton />
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or
                </span>
              </div>
            </>
          ) : (
            <p className="rounded-lg border bg-muted/50 px-3 py-2 text-center text-sm text-muted-foreground">
              Cloud sign-in is not configured on this server. Use guest mode
              below — your data stays in this browser.
            </p>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Continue without signing in</Link>
          </Button>
          {googleEnabled && (
            <p className="text-center text-xs text-muted-foreground">
              Guest mode saves data in this browser only.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
