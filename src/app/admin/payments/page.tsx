import { getPaymentMethodsList } from "@/features/payments/actions";
import { PaymentsClient } from "./payments-client";

export const metadata = {
  title: "Payment Methods & Gateways — Admin Dashboard",
};

export default async function AdminPaymentsPage() {
  const methods = await getPaymentMethodsList();
  return <PaymentsClient initialMethods={methods} />;
}
