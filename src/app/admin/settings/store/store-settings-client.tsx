"use client";

import { useState } from "react";
import { Store, Save, CheckCircle2, Building, Mail, Phone, MapPin, Globe } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Button } from "@/components/shared/ui/button";
import { saveStoreSettings } from "@/features/settings/actions";

interface StoreSettingsClientProps {
  initialSettings: Record<string, any>;
}

export function StoreSettingsClient({ initialSettings }: StoreSettingsClientProps) {
  const [formData, setFormData] = useState({
    store_name: initialSettings.store_name || "ecomXbangladesh",
    store_email: initialSettings.store_email || "support@ecomxbangladesh.com",
    store_phone: initialSettings.store_phone || "+880 1700-000000",
    store_address: initialSettings.store_address || "Gulshan 2, Dhaka 1212, Bangladesh",
    currency: initialSettings.currency || "BDT",
    currency_symbol: initialSettings.currency_symbol || "৳",
    timezone: initialSettings.timezone || "Asia/Dhaka",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await saveStoreSettings(formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Store Identity & Contact Details"
        description="Configure your official storefront branding, customer support contact channels, operating currency, and timezones."
        icon={Store}
        isCore
      />

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Store settings have been updated and cached successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Building className="h-4 w-4 text-primary-600" />
            Store Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-text mb-1">Store Name</label>
              <input
                type="text"
                required
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary-600" />
            Customer Support & Invoicing Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-text mb-1">Support Email</label>
              <input
                type="email"
                required
                value={formData.store_email}
                onChange={(e) => setFormData({ ...formData, store_email: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Helpline Phone Number</label>
              <input
                type="text"
                required
                value={formData.store_phone}
                onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text mb-1">Official Office / Warehouse Address</label>
              <textarea
                rows={2}
                value={formData.store_address}
                onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                className="w-full rounded-xl border border-border bg-white p-3 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Units */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary-600" />
            Currency & Display
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-text mb-1">Currency Code</label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Currency Symbol</label>
              <input
                type="text"
                required
                value={formData.currency_symbol}
                onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save Store Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
