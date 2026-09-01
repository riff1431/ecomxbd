import { getCheckoutSettings } from "@/features/settings/actions";
import { CheckoutSettingsClient } from "./checkout-settings-client";

export const metadata = {
  title: "Checkout Settings — Admin Dashboard",
};

export default async function AdminCheckoutSettingsPage() {
  const settings = await getCheckoutSettings();
  return <CheckoutSettingsClient initialSettings={settings} />;
}
