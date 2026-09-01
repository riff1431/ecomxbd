import { getCloudinaryModuleSettings } from "@/features/media/cloudinary-settings-actions";
import { CloudinarySettingsClient } from "./cloudinary-settings-client";

export const metadata = {
  title: "Cloudinary Settings — Admin Dashboard",
};

export default async function AdminCloudinarySettingsPage() {
  const settings = await getCloudinaryModuleSettings();
  return <CloudinarySettingsClient initialSettings={settings} />;
}
