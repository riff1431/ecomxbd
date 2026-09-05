import { getThemeSettings } from "@/features/settings/actions";
import { ThemeClient } from "./theme-client";

export const metadata = {
  title: "Theme & Branding — Admin Dashboard",
  description: "Customize storefront brand palette, top announcement banner, and free shipping delivery rules.",
};

export default async function AdminThemeSettingsPage() {
  const settings = await getThemeSettings();

  return <ThemeClient initialSettings={settings} />;
}
