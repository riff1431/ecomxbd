import { getSmsTemplates, getSmsLogs } from "@/features/sms/actions";
import { SmsManagerClient } from "@/features/sms/sms-manager-client";

export const metadata = {
  title: "SMS Gateway — Admin Dashboard",
};

export default async function AdminSmsPage() {
  const templates = await getSmsTemplates();
  const logs = await getSmsLogs();

  return <SmsManagerClient initialTemplates={templates} initialLogs={logs} />;
}
