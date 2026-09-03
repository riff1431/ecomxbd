"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Save,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Banknote,
  Lock,
  Mail,
  Phone,
  FileText,
  UserPlus,
} from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Button } from "@/components/shared/ui/button";
import { saveCheckoutSettings } from "@/features/settings/actions";

interface CheckoutSettingsClientProps {
  initialSettings: Record<string, any>;
}

export function CheckoutSettingsClient({ initialSettings }: CheckoutSettingsClientProps) {
  const [formData, setFormData] = useState({
    guest_checkout_enabled: initialSettings.guest_checkout_enabled ?? true,
    allow_customer_registration: initialSettings.allow_customer_registration ?? true,
    cod_enabled: initialSettings.cod_enabled ?? true,
    cod_max_amount: initialSettings.cod_max_amount ? Number(initialSettings.cod_max_amount) : 20000,
    min_order_amount: initialSettings.min_order_amount ? Number(initialSettings.min_order_amount) : 0,
    require_phone: initialSettings.require_phone ?? true,
    require_email: initialSettings.require_email ?? false,
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
        title="Customer Login, Registration & Checkout Rules"
        description="Control customer login requirements, guest purchasing privileges, registration availability, and order placement rules."
        icon={ShoppingCart}
        isCore
      />

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Customer login & checkout rules updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Customer Authentication & Access Permissions */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-[#e91e63]" />
            Customer Account & Login Requirements
          </h2>

          <div className="space-y-3">
            {/* Guest Checkout Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border hover:bg-surface-secondary/40 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-text text-xs sm:text-sm block">
                  Allow Guest Checkout (No Login Required)
                </span>
                <span className="text-text-muted text-[11px]">
                  When ON, customers can place Cash on Delivery orders without signing in. When OFF, customers MUST log in or register before ordering.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.guest_checkout_enabled}
                onChange={(e) =>
                  setFormData({ ...formData, guest_checkout_enabled: e.target.checked })
                }
                className="h-5 w-5 rounded border-border text-[#e91e63] focus:ring-[#e91e63] accent-[#e91e63]"
              />
            </label>

            {/* Public Registration Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border hover:bg-surface-secondary/40 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-text text-xs sm:text-sm block">
                  Allow New Customer Registrations
                </span>
                <span className="text-text-muted text-[11px]">
                  Permit new visitors to create accounts via the Sign Up form.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.allow_customer_registration}
                onChange={(e) =>
                  setFormData({ ...formData, allow_customer_registration: e.target.checked })
                }
                className="h-5 w-5 rounded border-border text-[#e91e63] focus:ring-[#e91e63] accent-[#e91e63]"
              />
            </label>
          </div>
        </div>

        {/* 2. Customer Form Fields on Order Placement */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#e91e63]" />
            Checkout Form Fields & Customer Information Rules
          </h2>

          <div className="space-y-3">
            {/* Mandatory Phone */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border hover:bg-surface-secondary/40 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-text text-xs sm:text-sm block">
                  Require Valid Bangladesh Mobile Number (Mandatory)
                </span>
                <span className="text-text-muted text-[11px]">
                  Enforces valid 11-digit mobile format (01XXXXXXXXX) during checkout for courier dispatch.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.require_phone}
                onChange={(e) =>
                  setFormData({ ...formData, require_phone: e.target.checked })
                }
                className="h-5 w-5 rounded border-border text-[#e91e63] focus:ring-[#e91e63] accent-[#e91e63]"
              />
            </label>

            {/* Mandatory Email */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border hover:bg-surface-secondary/40 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-text text-xs sm:text-sm block">
                  Require Customer Email Address
                </span>
                <span className="text-text-muted text-[11px]">
                  When OFF, email is optional for fast 1-click mobile checkouts. When ON, valid email is required.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.require_email}
                onChange={(e) =>
                  setFormData({ ...formData, require_email: e.target.checked })
                }
                className="h-5 w-5 rounded border-border text-[#e91e63] focus:ring-[#e91e63] accent-[#e91e63]"
              />
            </label>

            {/* Order Notes */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border hover:bg-surface-secondary/40 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-text text-xs sm:text-sm block">
                  Allow Customer Order Delivery Instructions
                </span>
                <span className="text-text-muted text-[11px]">
                  Displays special notes field on checkout (e.g. &quot;Call before arriving&quot;).
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.order_notes_enabled}
                onChange={(e) =>
                  setFormData({ ...formData, order_notes_enabled: e.target.checked })
                }
                className="h-5 w-5 rounded border-border text-[#e91e63] focus:ring-[#e91e63] accent-[#e91e63]"
              />
            </label>
          </div>
        </div>

        {/* 3. Monetary Limits & Thresholds */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Banknote className="h-4 w-4 text-[#e91e63]" />
            Order Spending Limits & Thresholds (BDT)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text mb-1">
                Minimum Cart Subtotal to Place Order (৳)
              </label>
              <input
                type="number"
                min={0}
                value={formData.min_order_amount}
                onChange={(e) =>
                  setFormData({ ...formData, min_order_amount: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text focus:border-[#e91e63] focus:outline-none"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Customers must have at least this amount in their bag to place an order (Set to 0 for no minimum).
              </span>
            </div>

            <div>
              <label className="block font-bold text-text mb-1">
                Maximum Cash on Delivery Limit per Order (৳)
              </label>
              <input
                type="number"
                min={100}
                value={formData.cod_max_amount}
                onChange={(e) =>
                  setFormData({ ...formData, cod_max_amount: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text focus:border-[#e91e63] focus:outline-none"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Orders above this amount require advance online payment.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-[#e91e63] hover:bg-[#d81b60] text-white font-extrabold px-8 py-3 text-xs shadow-lg transition-all active:scale-95"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "Saving Changes..." : "Save Customer & Checkout Rules"}
          </Button>
        </div>
      </form>
    </div>
  );
}
