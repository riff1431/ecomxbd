"use client";

import { useEffect, useRef } from "react";
import { trackPurchase, PurchaseEventParams } from "@/lib/analytics/datalayer";
import { trackMetaEvent } from "@/components/analytics/meta-pixel";

interface PurchaseTrackerProps {
  orderData: PurchaseEventParams;
}

export function PurchaseTracker({ orderData }: PurchaseTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current || !orderData?.transaction_id) return;

    // Check sessionStorage to prevent duplicate purchase events on page refreshes
    const storageKey = `ecomx_purchase_tracked_${orderData.transaction_id}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(storageKey)) {
      return;
    }

    // Fire unified purchase event to DataLayer & Meta Pixel with deduplication
    trackPurchase(orderData);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "true");
    }

    hasTracked.current = true;
  }, [orderData]);

  return null;
}
