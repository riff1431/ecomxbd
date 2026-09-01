import { getLiveShipments } from "@/features/orders/tracking-actions";
import { TrackingClient } from "./tracking-client";

export const metadata = {
  title: "Order Tracking & Logistics — Admin Dashboard",
  description: "Monitor courier consignments, live shipment milestones, and delivery performance.",
};

export default async function AdminTrackingPage() {
  const shipments = await getLiveShipments();

  return <TrackingClient initialShipments={shipments} />;
}
