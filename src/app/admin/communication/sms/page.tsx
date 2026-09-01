import { getSmsProviderConfig } from "@/features/communication/actions";
import { SmsClient } from "./sms-client";

export const metadata = {
  title: "SMS Providers & Gateway — Admin Dashboard",
};

export default async function AdminSmsProvidersPage() {
  const settings = await getSmsProviderConfig();
  return <SmsClient initialSettings={settings} />;
}
