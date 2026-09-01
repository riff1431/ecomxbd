import { getCouriers, getCourierShipments } from "@/features/logistics/actions";
import { CourierListClient } from "@/features/logistics/courier-list-client";

export const metadata = {
  title: "Delivery Partners — Admin Dashboard",
};

export default async function AdminShippingPage() {
  const couriers = await getCouriers();
  const shipments = await getCourierShipments();

  return <CourierListClient initialCouriers={couriers} initialShipments={shipments} />;
}
