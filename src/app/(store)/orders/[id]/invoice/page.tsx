import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/actions";
import { getHomepageConfig } from "@/features/marketing/homepage-actions";
import InvoicePrintClient from "@/app/admin/orders/[id]/invoice/invoice-print-client";

export default async function CustomerOrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, config] = await Promise.all([
    getOrderById(id),
    getHomepageConfig(),
  ]);

  if (!order) notFound();

  return <InvoicePrintClient order={order} config={config} />;
}
