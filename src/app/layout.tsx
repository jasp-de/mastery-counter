import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CountersProvider } from "@/components/providers/counters-provider";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#1a3d32",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans`}>
        <AuthProvider>
          <CountersProvider>{children}</CountersProvider>
        </AuthProvider>
        <InstallPrompt />
      </body>
    </html>
  );
}
