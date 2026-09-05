import { getShippingZones } from "@/features/logistics/actions";
import { ZonesClient } from "./zones-client";

export const metadata = {
  title: "Shipping Zones & Delivery Rates — Admin Dashboard",
  description: "Configure regional delivery charges, free shipping thresholds, and estimated transit times for Bangladesh.",
};

export default async function AdminShippingZonesPage() {
  const zones = await getShippingZones();

  return <ZonesClient initialZones={zones} />;
}
