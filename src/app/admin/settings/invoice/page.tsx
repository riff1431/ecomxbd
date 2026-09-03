import { getInvoiceSettings } from "@/features/settings/actions";
import { InvoiceSettingsClient } from "./invoice-settings-client";

export const metadata = {
  title: "Invoice & Thermal Settings — Admin Dashboard",
  description: "Customize company logo, text, colors, signatory, terms, and thermal label templates.",
};

export default async function AdminInvoiceSettingsPage() {
  const settings = await getInvoiceSettings();
  return <InvoiceSettingsClient initialSettings={settings} />;
}
