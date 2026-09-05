"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Helper to extract cookie value
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

// In-memory sliding window deduplication for Meta Pixel events
const recentMetaEventTimestamps = new Map<string, number>();
const META_DEDUP_WINDOW_MS = 1200;

export function MetaPixel() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "123456789012345";

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
          `,
        }}
      />
    </>
  );
}

/**
 * Dispatches both Browser-Side Meta Pixel (`fbq`) and Server-Side Meta Conversions API (`CAPI`)
 * with identical matching `eventID` for 100% deduplication and Advanced Matching.
 */
export function trackMetaEvent(
  eventName: string,
  params: Record<string, any> = {},
  customerData?: Record<string, any>,
  customEventId?: string
) {
  if (typeof window === "undefined") return;
  if (typeof window.location !== "undefined" && window.location.pathname.startsWith("/admin")) return;

  // 1. Strict persistent deduplication for Purchase event
  if (eventName === "Purchase" && (params.order_id || params.transaction_id)) {
    const orderKey = params.order_id || params.transaction_id;
    const storageKey = `ecomx_dedup_meta_purchase_${orderKey}`;
    try {
      if (sessionStorage.getItem(storageKey)) {
        return;
      }
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Ignore storage errors
    }
  }

  // 2. Sliding window fingerprint deduplication for other events
  const contentSignature =
    params.order_id ||
    params.transaction_id ||
    params.content_id ||
    (Array.isArray(params.content_ids) ? params.content_ids.join(",") : "") ||
    params.search_string ||
    params.content_name ||
    "";

  const eventFingerprint = `${eventName}::${contentSignature}::${params.value || 0}`;
  const now = Date.now();
  const lastFired = recentMetaEventTimestamps.get(eventFingerprint);

  if (lastFired && now - lastFired < META_DEDUP_WINDOW_MS) {
    return;
  }

  recentMetaEventTimestamps.set(eventFingerprint, now);

  // 3. Generate deterministic matching eventID for Browser Pixel & Server CAPI deduplication
  const eventId = customEventId || `evt_${now}_${Math.random().toString(36).substring(2, 9)}`;

  // 4. Fire Browser Meta Pixel (if fbq loaded)
  if (window.fbq) {
    if (Object.keys(params).length > 0) {
      window.fbq("track", eventName, params, { eventID: eventId });
    } else {
      window.fbq("track", eventName, {}, { eventID: eventId });
    }
  }

  // 5. Fire Server-Side Meta Conversions API (CAPI) in background
  try {
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    const userData = customerData
      ? {
          email: customerData.email,
          phone: customerData.phone,
          firstName: customerData.first_name || customerData.firstName || (customerData.name ? customerData.name.split(" ")[0] : undefined),
          lastName: customerData.last_name || customerData.lastName || (customerData.name ? customerData.name.split(" ").slice(1).join(" ") : undefined),
          city: customerData.city || customerData.district,
          state: customerData.state || customerData.division,
          country: customerData.country || "BD",
          zip: customerData.zip || customerData.postal_code,
          externalId: customerData.external_id || customerData.user_id || customerData.id,
          clientUserAgent: navigator.userAgent,
          fbp,
          fbc,
        }
      : {
          country: "BD",
          clientUserAgent: navigator.userAgent,
          fbp,
          fbc,
        };

    fetch("/api/analytics/capi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        userData,
        customData: params,
      }),
      keepalive: true,
    }).catch(() => {
      // Non-blocking CAPI background catch
    });
  } catch {
    // Non-blocking catch
  }
}

