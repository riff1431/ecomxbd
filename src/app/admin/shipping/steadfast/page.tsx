import { getSteadfastSettings } from "@/features/logistics/courier-settings-actions";
import { SteadfastClient } from "./steadfast-client";

export const metadata = {
  title: "SteadFast Courier Settings — Admin Dashboard",
};

export default async function AdminSteadfastPage() {
  const settings = await getSteadfastSettings();
  return <SteadfastClient initialSettings={settings} />;
}
