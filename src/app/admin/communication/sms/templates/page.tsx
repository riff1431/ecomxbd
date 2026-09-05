import { getSmsTemplates } from "@/features/sms/actions";
import { TemplatesClient } from "./templates-client";

export const metadata = {
  title: "SMS Templates Manager — Admin Dashboard",
  description: "Manage automated message content for OTP verification, order placements, courier dispatches, and delivery confirmations.",
};

export default async function AdminSmsTemplatesPage() {
  const templates = await getSmsTemplates();

  return <TemplatesClient initialTemplates={templates} />;
}
