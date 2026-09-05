"use client";

import { useEffect, useRef } from "react";
import { trackViewItemList, GA4Item } from "@/lib/analytics/datalayer";

interface ItemListTrackerProps {
  items: GA4Item[];
  listName?: string;
  listId?: string;
}

export function ItemListTracker({ items, listName, listId }: ItemListTrackerProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;

    if (items && items.length > 0) {
      trackViewItemList(items, listName, listId);
      hasFired.current = true;
    }
  }, [items, listName, listId]);

  return null;
}
