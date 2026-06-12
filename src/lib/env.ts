import { isGoogleAuthConfigured } from "@/lib/constants";

export function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET;
}

export function requireAuthSecret(): string {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET is required for authenticated sessions.");
  }
  return secret;
}

export { isGoogleAuthConfigured };

export function getAppUrl(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
}
