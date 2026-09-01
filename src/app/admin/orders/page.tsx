import { getAdminOrders } from "@/features/orders/actions";
import { OrderListClient } from "@/features/orders/order-list-client";

export const metadata = {
  title: "Orders — Admin Dashboard",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return <OrderListClient initialOrders={orders} />;
}
