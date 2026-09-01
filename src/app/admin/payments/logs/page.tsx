import { getPaymentLogs } from "@/features/payments/actions";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { CreditCard, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "Payment Transaction Logs — Admin Dashboard",
};

export default async function AdminPaymentLogsPage() {
  const logs = await getPaymentLogs();

  return (
    <div className="space-y-6 max-w-6xl">
      <ModuleHeader
        title="Payment Gateway Transaction Logs & Audit Trail"
        description="Comprehensive immutable ledger of all checkout payment attempts, webhook callbacks, IPN events, and verification payloads."
        iconName="CreditCard"
        backHref="/admin/payments"
      />

      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-secondary/40 flex items-center justify-between">
          <span className="text-xs font-bold text-text">Recent Events ({logs.length})</span>
          <span className="text-[11px] text-text-muted">Filtered: Sanitized Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/70 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-surface-secondary/40 transition-colors font-sans">
                  <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-text">
                    {log.provider}
                  </td>
                  <td className="px-4 py-3 font-mono text-primary-600">
                    {log.event}
                  </td>
                  <td className="px-4 py-3 font-mono text-text-muted">
                    {log.request_id || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {log.status === "success" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        SUCCESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <XCircle className="h-3 w-3" />
                        ERROR
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary max-w-md truncate">
                    {log.message || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
