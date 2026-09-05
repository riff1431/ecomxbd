import { getCheckoutSettings } from "@/features/settings/actions";
import { getCheckoutAndFraudSettings } from "@/features/settings/checkout-settings-actions";
import { CheckoutSettingsClient } from "./checkout-settings-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout & Delivery Rules — Admin Dashboard",
};

export default async function AdminCheckoutSettingsPage() {
  const [basicSettings, fraudSettings] = await Promise.all([
    getCheckoutSettings(),
    getCheckoutAndFraudSettings(),
  ]);

  const combined = {
    ...basicSettings,
    ...fraudSettings,
  };

  return <CheckoutSettingsClient initialSettings={combined} />;
}
