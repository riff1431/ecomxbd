import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/actions";
import { getHomepageConfig } from "@/features/marketing/homepage-actions";
import { getInvoiceSettings } from "@/features/settings/actions";
import InvoicePrintClient from "./invoice-print-client";

export default async function OrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, config, invoiceSettings] = await Promise.all([
    getOrderById(id),
    getHomepageConfig(),
    getInvoiceSettings(),
  ]);

  if (!order) notFound();

  return <InvoicePrintClient order={order} config={config} invoiceSettings={invoiceSettings} />;
}
