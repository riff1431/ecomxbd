import { getPathaoSettings } from "@/features/logistics/courier-settings-actions";
import { PathaoClient } from "./pathao-client";

export const metadata = {
  title: "Pathao Courier Settings — Admin Dashboard",
};

export default async function AdminPathaoPage() {
  const settings = await getPathaoSettings();
  return <PathaoClient initialSettings={settings} />;
}
