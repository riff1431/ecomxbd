"use client";

import { useState } from "react";
import { Truck, Save, RefreshCw, CheckCircle2, AlertTriangle, KeyRound, Sliders, Webhook, Activity } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { ModuleTabs } from "@/components/admin/module-settings/module-tabs";
import { SecretField } from "@/components/admin/module-settings/secret-field";
import { Button } from "@/components/shared/ui/button";
import { saveSteadfastSettings, testSteadfastConnection } from "@/features/logistics/courier-settings-actions";

interface SteadfastClientProps {
  initialSettings: any;
}

export function SteadfastClient({ initialSettings }: SteadfastClientProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const tabs = [
    { id: "general", label: "General & Service" },
    { id: "credentials", label: "API Credentials" },
    { id: "automation", label: "Automation Rules" },
    { id: "webhook", label: "Status Webhook" },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await saveSteadfastSettings(formData);
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
      const res = await testSteadfastConnection();
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="SteadFast Courier Integration"
        description="Automated consignment dispatch, Cash on Delivery remittance reconciliation, and tracking barcode generation across Bangladesh."
        icon={Truck}
        status={formData.api_key ? "connected" : "not_configured"}
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
          <span>SteadFast settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {activeTab === "general" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary-600" />
              General Environment & Service Settings
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
                <label className="block font-semibold text-text mb-1">API Base URL</label>
                <input
                  type="url"
                  required
                  value={formData.api_base_url}
                  onChange={(e) => setFormData({ ...formData, api_base_url: e.target.value })}
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
              SteadFast Merchant API Credentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-text mb-1">
                  API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder="e.g. sf_live_key_..."
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:border-primary-600 focus:outline-none"
                />
              </div>

              <SecretField
                id="steadfast_secret_key"
                label="Secret Key"
                value={formData.secret_key}
                onChange={(val) => setFormData({ ...formData, secret_key: val })}
                isConfigured={!!formData.secret_key && formData.secret_key.startsWith("••••")}
                description="Secret authorization token obtained from your SteadFast merchant dashboard."
                required
              />
            </div>
          </div>
        )}

        {activeTab === "automation" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary-600" />
              Automated Dispatch & Sync
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
                <div>
                  <span className="font-semibold text-text block">Auto-Book Consignment on &quot;Shipped&quot; Status</span>
                  <span className="text-text-muted text-[11px]">
                    Automatically posts parcel data to SteadFast and fetches tracking ID when order moves to Shipped.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.auto_booking}
                  onChange={(e) => setFormData({ ...formData, auto_booking: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
                <div>
                  <span className="font-semibold text-text block">Auto-Sync Delivery Status via Webhooks</span>
                  <span className="text-text-muted text-[11px]">
                    Automatically updates store orders to &quot;Delivered&quot; or &quot;Returned&quot; when SteadFast updates rider status.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.auto_sync_status}
                  onChange={(e) => setFormData({ ...formData, auto_sync_status: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "webhook" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Webhook className="h-4 w-4 text-primary-600" />
              SteadFast Inbound Webhook Endpoint
            </h2>

            <div className="space-y-3">
              <p className="text-xs text-text-secondary">
                Paste this URL into your SteadFast Merchant portal under <strong>Webhook Settings</strong> to receive real-time parcel delivery status callbacks.
              </p>

              <div className="rounded-xl border border-border bg-surface-secondary p-3 font-mono text-xs text-primary-700 select-all">
                https://ecomxbangladesh.com/api/webhooks/courier/steadfast
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save SteadFast Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
