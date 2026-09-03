import { Suspense } from "react";
import type { Metadata } from "next";
import AccountTrackClient from "@/components/account/account-track-client";
import { getCustomerOrders } from "@/features/account/actions";

export const metadata: Metadata = {
  title: "Track Orders",
  description: "Track your active delivery consignments and order status.",
};

export default async function AccountTrackPage() {
  const orders = await getCustomerOrders();

  return (
    <Suspense>
      <AccountTrackClient initialOrders={orders} />
    </Suspense>
  );
}
