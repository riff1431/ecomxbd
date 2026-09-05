import { getPaymentLogs, getPaymentVerificationsList } from "@/features/payments/actions";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { PaymentLogsClient } from "./payment-logs-client";

export const metadata = {
  title: "Payment Verification & Transaction Logs — Admin Dashboard",
};

export default async function AdminPaymentLogsPage() {
  const [logs, verifications] = await Promise.all([
    getPaymentLogs(),
    getPaymentVerificationsList(),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <ModuleHeader
        title="Payment Verification & Audit Dashboard"
        description="Verify payments across bKash Tokenized, SSLCommerz, Nagad, and Cash on Delivery. Search by Customer Name, Phone, Email, or TrxID with live PGW API double-check."
        iconName="ShieldCheck"
        backHref="/admin/payments"
      />

      <PaymentLogsClient initialItems={verifications} rawLogs={logs} />
    </div>
  );
}

