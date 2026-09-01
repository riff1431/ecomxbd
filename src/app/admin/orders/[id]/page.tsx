import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/actions";
import { OrderDetailClient } from "./order-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return { title: "Order Not Found" };
  return { title: `Order ${order.order_number} — Admin Dashboard` };
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return <OrderDetailClient order={order} />;
}
