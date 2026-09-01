"use client";

import { useState } from "react";
import { Truck, Save, RefreshCw, CheckCircle2, AlertTriangle, KeyRound, Sliders, Store } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { ModuleTabs } from "@/components/admin/module-settings/module-tabs";
import { SecretField } from "@/components/admin/module-settings/secret-field";
import { Button } from "@/components/shared/ui/button";
import { savePathaoSettings, testPathaoConnection } from "@/features/logistics/courier-settings-actions";

interface PathaoClientProps {
  initialSettings: any;
}

export function PathaoClient({ initialSettings }: PathaoClientProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const tabs = [
    { id: "general", label: "General & Store" },
    { id: "credentials", label: "API Credentials (OAuth2)" },
    { id: "automation", label: "Automation Rules" },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await savePathaoSettings(formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await testPathaoConnection();
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Pathao Courier Integration"
        description="Connect Pathao Hermes merchant API for on-demand express parcels and Cash on Delivery delivery fulfillment."
        icon={Truck}
        status={formData.client_id ? "connected" : "not_configured"}
        backHref="/admin/shipping"
      />

      <div className="flex items-center justify-between">
        <ModuleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <Button
          type="button"
          onClick={handleTestConnection}
          disabled={testing}
          variant="outline"
          size="sm"
          className="text-xs shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${testing ? "animate-spin" : ""}`} />
          {testing ? "Testing..." : "Test Connection"}
        </Button>
      </div>

      {testResult && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs font-semibold ${
            testResult.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Pathao settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {activeTab === "general" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Store className="h-4 w-4 text-primary-600" />
              Pathao Store & Environment
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-text mb-1">Environment</label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
                >
                  <option value="live">Live / Production</option>
                  <option value="sandbox">Sandbox / Staging</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Pathao Store ID</label>
                <input
                  type="text"
                  value={formData.store_id}
                  onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                  placeholder="e.g. store_gulshan_hq"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:border-primary-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "credentials" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary-600" />
              Pathao Hermes OAuth2 API Credentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Client ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  placeholder="e.g. pathao_client_id_..."
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:border-primary-600 focus:outline-none"
                />
              </div>

              <SecretField
                id="pathao_client_secret"
                label="Client Secret"
                value={formData.client_secret}
                onChange={(val) => setFormData({ ...formData, client_secret: val })}
                isConfigured={!!formData.client_secret && formData.client_secret.startsWith("••••")}
                description="OAuth2 secret token from Pathao Developer portal."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text mb-1">Username / Email</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <SecretField
                  id="pathao_password"
                  label="Password"
                  value={formData.password}
                  onChange={(val) => setFormData({ ...formData, password: val })}
                  isConfigured={!!formData.password && formData.password.startsWith("••••")}
                  description="Merchant login password for bearer token grants."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "automation" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary-600" />
              Automated Dispatch Settings
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
                <div>
                  <span className="font-semibold text-text block">Auto-Book Pathao Consignment</span>
                  <span className="text-text-muted text-[11px]">
                    Creates parcel on Pathao system automatically when order confirmation is finalized.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.auto_booking}
                  onChange={(e) => setFormData({ ...formData, auto_booking: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save Pathao Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
