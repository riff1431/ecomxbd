import { getCustomPaymentMethods } from "@/features/payments/actions";
import { CustomPaymentsClient } from "./custom-payments-client";

export const metadata = {
  title: "Custom & Manual Payment Methods — Admin Dashboard",
  description: "Configure manual payment options like Bank Wire Transfers, manual bKash/Nagad transfers, and QR payments.",
};

export default async function AdminCustomPaymentsPage() {
  const methods = await getCustomPaymentMethods();

  return <CustomPaymentsClient initialMethods={methods} />;
}
