import { getSeoSettings } from "@/features/settings/actions";
import { SeoSettingsClient } from "./seo-settings-client";

export const metadata = {
  title: "SEO Settings — Admin Dashboard",
};

export default async function AdminSeoSettingsPage() {
  const settings = await getSeoSettings();
  return <SeoSettingsClient initialSettings={settings} />;
}
