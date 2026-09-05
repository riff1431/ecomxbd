import { getStoreFeatureSettings } from "@/features/settings/feature-settings-actions";
import { FeatureSettingsClient } from "./feature-settings-client";

export const metadata = {
  title: "Store Feature & UI/UX Controls — Admin Dashboard",
  description: "Configure dynamic frontend toggles, beauty filters, PDP mobile CTAs, and automated SMS notifications.",
};

export default async function FeatureSettingsPage() {
  const settings = await getStoreFeatureSettings();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <FeatureSettingsClient initialSettings={settings} />
    </div>
  );
}
