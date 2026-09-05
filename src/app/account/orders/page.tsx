import { getCustomerOrders } from "@/features/account/actions";
import { OrdersClient } from "./orders-client";

export const metadata = {
  title: "My Orders — Customer Account",
};

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders();

  return <OrdersClient orders={orders} />;
}
