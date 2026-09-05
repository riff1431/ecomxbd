"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GoogleTagManager } from "./google-tag-manager";
import { NavigationEvents } from "./navigation-events";
import { MetaPixel } from "./meta-pixel";
import { TikTokPixel } from "./tiktok-pixel";

export function StorefrontAnalytics() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Safeguard: revoke tracking consent if transitioning into admin
  useEffect(() => {
    if (isAdmin && typeof window !== "undefined") {
      if (typeof window.fbq === "function") {
        try {
          window.fbq("consent", "revoke");
        } catch {}
      }
      if (window.ttq && typeof window.ttq.revokeConsent === "function") {
        try {
          window.ttq.revokeConsent();
        } catch {}
      }
    } else if (!isAdmin && typeof window !== "undefined") {
      if (typeof window.fbq === "function") {
        try {
          window.fbq("consent", "grant");
        } catch {}
      }
      if (window.ttq && typeof window.ttq.grantConsent === "function") {
        try {
          window.ttq.grantConsent();
        } catch {}
      }
    }
  }, [isAdmin]);

  // NEVER render any pixel scripts on admin routes
  if (isAdmin) {
    return null;
  }

  return (
    <>
      <GoogleTagManager />
      <NavigationEvents />
      <MetaPixel />
      <TikTokPixel />
    </>
  );
}
