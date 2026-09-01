import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Building, Plus, CheckCircle2, Edit2, ShieldCheck, QrCode } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export const metadata = {
  title: "Custom & Manual Payment Methods — Admin Dashboard",
};

export default function AdminCustomPaymentsPage() {
  const manualMethods = [
    {
      id: "pm-1",
      name: "Direct Bank Wire Transfer (EFTN / BEFTN)",
      accountName: "ecomXbangladesh Ltd.",
      accountNumber: "2050 1829 0192 0001",
      bankName: "City Bank PLC (Gulshan Branch)",
      routingNumber: "225272341",
      instructions: "Transfer total order amount and input Order ID as transaction memo.",
      requiresProof: true,
      enabled: true,
    },
    {
      id: "pm-2",
      name: "Manual bKash Send Money / Merchant QR",
      accountName: "ecomXbangladesh Official",
      accountNumber: "01700-000000",
      bankName: "bKash Personal / Agent",
      instructions: "Send money to our official number and input the TrxID during confirmation.",
      requiresProof: true,
      enabled: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <ModuleHeader
          title="Custom & Manual Payment Methods"
          description="Configure offline manual payment options like Bank Wire Transfers, Manual bKash/Nagad transfers, and QR Code payments."
          iconName="Building"
          backHref="/admin/payments"
        />

        <Button size="sm" className="text-xs shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Custom Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {manualMethods.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text">{m.name}</h3>
                  {m.enabled ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active on Storefront
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-text-muted bg-surface-secondary px-2 py-0.5 rounded">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{m.instructions}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                  <Edit2 className="h-3 w-3 mr-1 text-primary-600" />
                  Edit Details
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-surface-secondary/60 p-3 rounded-xl border border-border">
                <span className="text-text-muted text-[11px] block">Bank / Institution</span>
                <span className="text-xs font-bold text-text mt-0.5 block">{m.bankName}</span>
              </div>

              <div className="bg-surface-secondary/60 p-3 rounded-xl border border-border">
                <span className="text-text-muted text-[11px] block">Account / Number</span>
                <span className="text-xs font-mono font-bold text-primary-600 mt-0.5 block">
                  {m.accountNumber}
                </span>
              </div>

              <div className="bg-surface-secondary/60 p-3 rounded-xl border border-border">
                <span className="text-text-muted text-[11px] block">Customer Proof</span>
                <span className="text-xs font-semibold text-text mt-0.5 block">
                  {m.requiresProof ? "Proof Upload Required" : "Optional"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
