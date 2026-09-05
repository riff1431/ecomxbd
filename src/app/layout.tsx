import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: {
    default: "ecomXbangladesh",
    template: "%s | ecomXbangladesh",
  },
  description: "Premium e-commerce platform for Bangladesh — Shop the best products with fast delivery.",
  metadataBase: (() => {
    const url = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
    return url ? new URL(url) : undefined;
  })(),
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "ecomXbangladesh",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { MetaPixel } from "@/components/analytics/meta-pixel";
import { TikTokPixel } from "@/components/analytics/tiktok-pixel";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { NavigationEvents } from "@/components/analytics/navigation-events";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable} lang-bn`}>
      <body className="min-h-screen bg-white antialiased">
        <GoogleTagManager />
        <NavigationEvents />
        <MetaPixel />
        <TikTokPixel />
        {children}
      </body>
    </html>
  );
}
