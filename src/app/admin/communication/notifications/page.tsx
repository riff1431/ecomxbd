"use client";

import { useState } from "react";
import { Bell, Save, CheckCircle2, Mail, MessageSquare, Smartphone } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Button } from "@/components/shared/ui/button";
import { saveNotificationMatrix } from "@/features/communication/actions";

export default function AdminNotificationMatrixPage() {
  const [matrix, setMatrix] = useState<Record<string, boolean>>({
    order_placed_sms: true,
    order_placed_email: true,
    order_placed_inapp: true,
    order_shipped_sms: true,
    order_shipped_email: true,
    order_shipped_inapp: true,
    order_delivered_sms: true,
    order_delivered_email: true,
    order_delivered_inapp: true,
    order_cancelled_sms: true,
    order_cancelled_email: true,
    order_cancelled_inapp: true,
    refund_approved_sms: true,
    refund_approved_email: true,
    refund_approved_inapp: true,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const events = [
    { key: "order_placed", label: "Order Placed & Confirmed", desc: "Triggered immediately upon customer order submission" },
    { key: "order_shipped", label: "Consignment Shipped / In Transit", desc: "Triggered when courier tracking consignment ID is generated" },
    { key: "order_delivered", label: "Order Delivered Successfully", desc: "Triggered when courier updates status to Delivered" },
    { key: "order_cancelled", label: "Order Cancelled", desc: "Triggered if buyer or admin cancels order" },
    { key: "refund_approved", label: "Return & Refund Approved", desc: "Triggered when returned items are verified and payout is issued" },
  ];

  const handleToggle = (key: string) => {
    setMatrix((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await saveNotificationMatrix(matrix);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <ModuleHeader
        title="Event Notification Matrix"
        description="Selectively toggle automated Email, SMS, and in-app notifications for each order lifecycle transition."
        icon={Bell}
        backHref="/admin/settings/modules"
      />

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Notification dispatch rules updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/70 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-5 py-4">Lifecycle Event</th>
                <th className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 text-primary-700">
                    <MessageSquare className="h-3.5 w-3.5" />
                    SMS
                  </span>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 text-blue-700">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </span>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <Bell className="h-3.5 w-3.5" />
                    In-App
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((evt) => (
                <tr key={evt.key} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-text">{evt.label}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{evt.desc}</p>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={!!matrix[`${evt.key}_sms`]}
                      onChange={() => handleToggle(`${evt.key}_sms`)}
                      className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={!!matrix[`${evt.key}_email`]}
                      onChange={() => handleToggle(`${evt.key}_email`)}
                      className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={!!matrix[`${evt.key}_inapp`]}
                      onChange={() => handleToggle(`${evt.key}_inapp`)}
                      className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-surface-secondary/30 border-t border-border flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save Notification Matrix"}
          </Button>
        </div>
      </form>
    </div>
  );
}
