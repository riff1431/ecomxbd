import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "ecomXbangladesh",
    template: "%s | ecomXbangladesh",
  },
  description: "Premium e-commerce platform for Bangladesh — Shop the best products with fast delivery.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
