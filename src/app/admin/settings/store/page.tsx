import { getStoreSettings, getLocalizationSettings } from "@/features/settings/actions";
import { StoreSettingsClient } from "./store-settings-client";

export const metadata = {
  title: "Store Settings — Admin Dashboard",
};

export default async function AdminStoreSettingsPage() {
  const [settings, localizationSettings] = await Promise.all([
    getStoreSettings(),
    getLocalizationSettings(),
  ]);
  return (
    <StoreSettingsClient
      initialSettings={settings}
      initialLocalizationSettings={localizationSettings}
    />
  );
}
