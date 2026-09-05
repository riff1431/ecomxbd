"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics/datalayer";

function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const queryString = searchParams?.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    // Strict single-fire per unique URL
    if (lastTrackedUrl.current === url) return;
    lastTrackedUrl.current = url;

    const pageTitle = typeof document !== "undefined" ? document.title : "";
    trackPageView(url, pageTitle);
  }, [pathname, searchParams]);

  return null;
}

export function NavigationEvents() {
  return (
    <Suspense fallback={null}>
      <NavigationTracker />
    </Suspense>
  );
}
