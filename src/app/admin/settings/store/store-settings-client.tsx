"use client";

import { useState } from "react";
import { Store, Save, CheckCircle2, Building, Mail, Phone, MapPin, Globe, Languages, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Button } from "@/components/shared/ui/button";
import { saveStoreSettings, saveLocalizationSettings, type LocalizationSettings } from "@/features/settings/actions";

interface StoreSettingsClientProps {
  initialSettings: Record<string, any>;
  initialLocalizationSettings?: LocalizationSettings;
}

export function StoreSettingsClient({
  initialSettings,
  initialLocalizationSettings,
}: StoreSettingsClientProps) {
  const [formData, setFormData] = useState({
    store_name: initialSettings.store_name || "ecomXbangladesh",
    store_email: initialSettings.store_email || "support@ecomxbangladesh.com",
    store_phone: initialSettings.store_phone || "+880 1700-000000",
    store_address: initialSettings.store_address || "Gulshan 2, Dhaka 1212, Bangladesh",
    currency: initialSettings.currency || "BDT",
    currency_symbol: initialSettings.currency_symbol || "৳",
    timezone: initialSettings.timezone || "Asia/Dhaka",
  });

  const [localizationData, setLocalizationData] = useState<LocalizationSettings>({
    default_language: initialLocalizationSettings?.default_language || "bn",
    enable_language_switcher: initialLocalizationSettings?.enable_language_switcher !== false,
    show_homepage_language_bar: initialLocalizationSettings?.show_homepage_language_bar !== false,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await Promise.all([
        saveStoreSettings(formData),
        saveLocalizationSettings(localizationData),
      ]);
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
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
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
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Helpline Phone Number</label>
              <input
                type="text"
                required
                value={formData.store_phone}
                onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text mb-1">Official Office / Warehouse Address</label>
              <textarea
                rows={2}
                value={formData.store_address}
                onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                className="w-full rounded-xl border border-border bg-white p-3 text-xs text-text focus:outline-none"
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
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Currency Symbol</label>
              <input
                type="text"
                required
                value={formData.currency_symbol}
                onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Language & Localization Controls */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-[#e91e63]" />
              <h2 className="text-sm font-bold text-text">Language & Storefront Localization</h2>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                localizationData.enable_language_switcher
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {localizationData.enable_language_switcher ? "Switcher Active" : "Switcher Disabled"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Master Toggle: Turn ON/OFF Language Switcher */}
            <div className="rounded-xl border border-border/80 bg-slate-50/50 p-4 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <label className="font-bold text-text text-xs flex items-center gap-1.5">
                    Enable Language Switcher
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setLocalizationData({
                        ...localizationData,
                        enable_language_switcher: !localizationData.enable_language_switcher,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      localizationData.enable_language_switcher ? "bg-[#e91e63]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        localizationData.enable_language_switcher ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                  When turned <strong>OFF</strong>, all language buttons (header, homepage, and mobile drawer) are hidden from visitors, and the site strictly displays in the Default Language.
                </p>
              </div>
            </div>

            {/* Default Language Selector */}
            <div className="rounded-xl border border-border/80 bg-slate-50/50 p-4 space-y-2">
              <label className="block font-bold text-text text-xs mb-1">
                Default Storefront Language
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setLocalizationData({
                      ...localizationData,
                      default_language: "bn",
                    })
                  }
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    localizationData.default_language === "bn"
                      ? "border-[#e91e63] bg-pink-50/60 text-[#e91e63] font-bold shadow-2xs"
                      : "border-border bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xs font-black">বাংলা (Bangla)</span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Hind Siliguri Font</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLocalizationData({
                      ...localizationData,
                      default_language: "en",
                    })
                  }
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    localizationData.default_language === "en"
                      ? "border-[#e91e63] bg-pink-50/60 text-[#e91e63] font-bold shadow-2xs"
                      : "border-border bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xs font-black">English</span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Inter Sans Font</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Initial language loaded for new visitors or when the language switcher is turned off.
              </p>
            </div>

            {/* Homepage Quick Language Bar Sub-toggle */}
            <div className="md:col-span-2 rounded-xl border border-border/80 bg-slate-50/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="font-bold text-text text-xs flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-pink-600" />
                  Homepage Quick Language Bar
                </span>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Display the prominent quick language switcher & authenticity strip directly beneath the homepage hero banner.
                </p>
              </div>
              <button
                type="button"
                disabled={!localizationData.enable_language_switcher}
                onClick={() =>
                  setLocalizationData({
                    ...localizationData,
                    show_homepage_language_bar: !localizationData.show_homepage_language_bar,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  !localizationData.enable_language_switcher
                    ? "opacity-50 cursor-not-allowed bg-gray-200"
                    : localizationData.show_homepage_language_bar
                    ? "bg-[#e91e63]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    localizationData.show_homepage_language_bar && localizationData.enable_language_switcher
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
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
