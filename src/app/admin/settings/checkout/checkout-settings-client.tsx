"use client";

import { useState } from "react";
import { ShoppingCart, Save, CheckCircle2, ShieldCheck, UserCheck, Banknote } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Button } from "@/components/shared/ui/button";
import { saveCheckoutSettings } from "@/features/settings/actions";

interface CheckoutSettingsClientProps {
  initialSettings: Record<string, any>;
}

export function CheckoutSettingsClient({ initialSettings }: CheckoutSettingsClientProps) {
  const [formData, setFormData] = useState({
    guest_checkout_enabled: initialSettings.guest_checkout_enabled ?? true,
    cod_enabled: initialSettings.cod_enabled ?? true,
    cod_max_amount: initialSettings.cod_max_amount ? Number(initialSettings.cod_max_amount) : 20000,
    min_order_amount: initialSettings.min_order_amount ? Number(initialSettings.min_order_amount) : 0,
    require_phone: initialSettings.require_phone ?? true,
    order_notes_enabled: initialSettings.order_notes_enabled ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await saveCheckoutSettings(formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Storefront Checkout & Order Threshold Rules"
        description="Configure guest purchasing privileges, Cash on Delivery spending thresholds, phone requirements, and minimum order rules."
        icon={ShoppingCart}
        isCore
      />

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Checkout rules and payment thresholds updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Guest & Identity Rules */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary-600" />
            Customer Checkout Permissions
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Allow Guest Checkout</span>
                <span className="text-text-muted text-[11px]">
                  Permit customers to place orders without creating a password or registering first.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.guest_checkout_enabled}
                onChange={(e) =>
                  setFormData({ ...formData, guest_checkout_enabled: e.target.checked })
                }
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Require Valid Bangladesh Mobile Number</span>
                <span className="text-text-muted text-[11px]">
                  Enforces 11-digit mobile format (+8801XXXXXXXX) on checkout for courier dispatch.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.require_phone}
                onChange={(e) =>
                  setFormData({ ...formData, require_phone: e.target.checked })
                }
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Allow Order Delivery Notes</span>
                <span className="text-text-muted text-[11px]">
                  Displays optional instructions field on checkout (e.g. &quot;Leave with building security&quot;).
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.order_notes_enabled}
                onChange={(e) =>
                  setFormData({ ...formData, order_notes_enabled: e.target.checked })
                }
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Order Limits & Thresholds */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary-600" />
            Monetary Thresholds & Limits (BDT)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Minimum Cart Total to Checkout (৳)
              </label>
              <input
                type="number"
                min={0}
                value={formData.min_order_amount}
                onChange={(e) =>
                  setFormData({ ...formData, min_order_amount: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Maximum COD Limit per Order (৳)
              </label>
              <input
                type="number"
                min={100}
                value={formData.cod_max_amount}
                onChange={(e) =>
                  setFormData({ ...formData, cod_max_amount: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
              <span className="text-[10px] text-text-muted mt-0.5 block">
                Orders above this amount require online prepayment.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save Checkout Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
