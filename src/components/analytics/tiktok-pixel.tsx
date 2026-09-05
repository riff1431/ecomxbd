"use client";

import Script from "next/script";

declare global {
  interface Window {
    ttq: any;
    TiktokAnalyticsObject: string;
  }
}

// Helper to extract cookie value
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

// In-memory sliding window deduplication for TikTok Pixel events
const recentTikTokEventTimestamps = new Map<string, number>();
const TIKTOK_DEDUP_WINDOW_MS = 1200;

export function TikTokPixel() {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "CXXXXXXXXXXXXXXXXXX";

  return (
    <>
      <Script
        id="tiktok-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
              ttq.load('${pixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `,
        }}
      />
    </>
  );
}

/**
 * Dispatches both Browser-Side TikTok Pixel (`ttq`) and Server-Side TikTok Events API (`CAPI`)
 * with identical matching `event_id` for 100% deduplication and Advanced Matching.
 */
export function trackTikTokEvent(
  eventName: string,
  params: Record<string, any> = {},
  customerData?: Record<string, any>,
  customEventId?: string
) {
  if (typeof window === "undefined") return;

  // Map event name to TikTok standard if needed
  let mappedEvent = eventName;
  if (eventName === "Purchase") mappedEvent = "CompletePayment";
  if (eventName === "Lead") mappedEvent = "SubmitForm";

  // 1. Deduplication for CompletePayment (Purchase)
  if (mappedEvent === "CompletePayment" && (params.order_id || params.transaction_id)) {
    const orderKey = params.order_id || params.transaction_id;
    const storageKey = `ecomx_dedup_tt_purchase_${orderKey}`;
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
    params.query ||
    params.search_string ||
    params.content_name ||
    "";

  const eventFingerprint = `${mappedEvent}::${contentSignature}::${params.value || 0}`;
  const now = Date.now();
  const lastFired = recentTikTokEventTimestamps.get(eventFingerprint);

  if (lastFired && now - lastFired < TIKTOK_DEDUP_WINDOW_MS) {
    return;
  }

  recentTikTokEventTimestamps.set(eventFingerprint, now);

  // 3. Generate deterministic matching eventID
  const eventId = customEventId || `tt_evt_${now}_${Math.random().toString(36).substring(2, 9)}`;

  // 4. Fire Browser TikTok Pixel (ttq)
  if (window.ttq) {
    if (customerData) {
      window.ttq.identify({
        email: customerData.email,
        phone_number: customerData.phone,
        external_id: customerData.external_id || customerData.user_id || customerData.id,
      });
    }

    window.ttq.track(mappedEvent, params, { event_id: eventId });
  }

  // 5. Fire Server-Side TikTok Events API (CAPI) in background
  try {
    const ttp = getCookie("_ttp");
    const ttclid = getCookie("ttclid");

    const userData = customerData
      ? {
          email: customerData.email,
          phone: customerData.phone,
          externalId: customerData.external_id || customerData.user_id || customerData.id,
          clientUserAgent: navigator.userAgent,
          ttp,
          ttclid,
        }
      : {
          clientUserAgent: navigator.userAgent,
          ttp,
          ttclid,
        };

    fetch("/api/analytics/tiktok", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName: mappedEvent,
        eventId,
        eventSourceUrl: window.location.href,
        userData,
        properties: params,
      }),
      keepalive: true,
    }).catch(() => {
      // Non-blocking background catch
    });
  } catch {
    // Non-blocking catch
  }
}
