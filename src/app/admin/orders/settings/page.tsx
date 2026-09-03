import { getPostPurchaseConfig } from "@/features/automation/post-purchase-actions";
import OrderAutomationSettingsClient from "./settings-client";

export const metadata = {
  title: "Order Automation & Fulfillment Rules — Admin Dashboard",
};

export default async function AdminOrderSettingsPage() {
  const config = await getPostPurchaseConfig();

  return <OrderAutomationSettingsClient initialConfig={config} />;
}
