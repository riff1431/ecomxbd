import { getStoreSettings } from "@/features/settings/actions";
import { StoreSettingsClient } from "./store-settings-client";

export const metadata = {
  title: "Store Settings — Admin Dashboard",
};

export default async function AdminStoreSettingsPage() {
  const settings = await getStoreSettings();
  return <StoreSettingsClient initialSettings={settings} />;
}
