"use client";

import { useState } from "react";
import { Smartphone, Save, RefreshCw, CheckCircle2, AlertTriangle, KeyRound, Sliders, Webhook } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { ModuleTabs } from "@/components/admin/module-settings/module-tabs";
import { SecretField } from "@/components/admin/module-settings/secret-field";
import { Button } from "@/components/shared/ui/button";
import { savePaymentGatewayConfig, testPaymentGatewayConnection } from "@/features/payments/actions";

export default function AdminBkashPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    app_key: "",
    app_secret: "",
    username: "",
    password: "",
    environment: "sandbox",
    tokenized: true,
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const tabs = [
    { id: "general", label: "General & Mode" },
    { id: "credentials", label: "Merchant Credentials" },
    { id: "callbacks", label: "Webhook & Callback URLs" },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await savePaymentGatewayConfig("bkash", {
        app_key: { value: formData.app_key, valueType: "string" },
        app_secret: { value: formData.app_secret, isSecret: true },
        username: { value: formData.username, valueType: "string" },
        password: { value: formData.password, isSecret: true },
        environment: { value: formData.environment, valueType: "string" },
        tokenized: { value: formData.tokenized, valueType: "boolean" },
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testPaymentGatewayConnection("bkash");
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="bKash Payment Gateway (Direct API & Tokenized Checkout)"
        description="Accept instantaneous bKash payments from customer wallets with tokenized 1-click checkout and automated refund handling."
        icon={Smartphone}
        status={formData.app_key ? "connected" : "not_configured"}
        backHref="/admin/payments"
      />

      <div className="flex items-center justify-between">
        <ModuleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <Button
          type="button"
          onClick={handleTest}
          disabled={testing}
          variant="outline"
          size="sm"
          className="text-xs shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${testing ? "animate-spin" : ""}`} />
          {testing ? "Testing..." : "Test Credentials"}
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
          <span>bKash merchant settings saved and encrypted in database!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {activeTab === "general" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary-600" />
              Environment & Checkout Behavior
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-text mb-1">Environment Mode</label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
                >
                  <option value="sandbox">Sandbox (bKash PGW Simulator)</option>
                  <option value="live">Live / Production Merchant</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Checkout Flow</label>
                <select
                  value={formData.tokenized ? "tokenized" : "standard"}
                  onChange={(e) =>
                    setFormData({ ...formData, tokenized: e.target.value === "tokenized" })
                  }
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
                >
                  <option value="tokenized">Tokenized Agreement & Checkout (Fastest)</option>
                  <option value="standard">Standard PGW Webview Redirect</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "credentials" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary-600" />
              bKash Merchant Portal API Keys
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-text mb-1">
                  App Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.app_key}
                  onChange={(e) => setFormData({ ...formData, app_key: e.target.value })}
                  placeholder="e.g. bkash_app_key_..."
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:outline-none"
                />
              </div>

              <SecretField
                id="bkash_app_secret"
                label="App Secret"
                value={formData.app_secret}
                onChange={(val) => setFormData({ ...formData, app_secret: val })}
                description="Issued by bKash PGW onboarding team. Stored encrypted."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text mb-1">Merchant Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
                  />
                </div>

                <SecretField
                  id="bkash_password"
                  label="Merchant Password"
                  value={formData.password}
                  onChange={(val) => setFormData({ ...formData, password: val })}
                  description="Password for token grant endpoint."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "callbacks" && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Webhook className="h-4 w-4 text-primary-600" />
              bKash Callback & IPN Webhook URLs
            </h2>

            <div className="space-y-3">
              <p className="text-xs text-text-secondary">
                Configure these endpoints in your bKash merchant dashboard to receive asynchronous payment verifications:
              </p>

              <div>
                <label className="block font-semibold text-text mb-1">Callback URL</label>
                <div className="rounded-xl border border-border bg-surface-secondary p-3 font-mono text-xs text-primary-700 select-all">
                  https://ecomxbangladesh.com/api/payments/bkash/callback
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save bKash Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
