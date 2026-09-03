import { getPostPurchaseConfig } from "@/features/automation/post-purchase-actions";
import { getSteadfastSettings, getPathaoSettings } from "@/features/logistics/courier-settings-actions";
import OrderAutomationSettingsClient from "./settings-client";

export const metadata = {
  title: "Order Automation & Fulfillment Rules — Admin Dashboard",
};

export default async function AdminOrderSettingsPage() {
  const [config, steadfastSettings, pathaoSettings] = await Promise.all([
    getPostPurchaseConfig(),
    getSteadfastSettings(),
    getPathaoSettings(),
  ]);

  return (
    <OrderAutomationSettingsClient
      initialConfig={config}
      initialSteadfast={steadfastSettings}
      initialPathao={pathaoSettings}
    />
  );
}
