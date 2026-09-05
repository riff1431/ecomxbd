"use client";

import { useState } from "react";
import { CreditCard, Save, RefreshCw, CheckCircle2, AlertTriangle, KeyRound, Sliders, Webhook } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { SecretField } from "@/components/admin/module-settings/secret-field";
import { Button } from "@/components/shared/ui/button";
import { savePaymentGatewayConfig, testPaymentGatewayConnection } from "@/features/payments/actions";

export default function AdminSslcommerzPage() {
  const [formData, setFormData] = useState({
    store_id: "",
    store_password: "",
    environment: "sandbox",
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await savePaymentGatewayConfig("sslcommerz", {
        store_id: { value: formData.store_id, valueType: "string" },
        store_password: { value: formData.store_password, isSecret: true },
        environment: { value: formData.environment, valueType: "string" },
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
      const res = await testPaymentGatewayConnection("sslcommerz");
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <ModuleHeader
          title="SSLCommerz Gateway (Cards, Net Banking & Wallets)"
          description="Bangladesh's leading payment aggregator supporting Visa, MasterCard, Amex, bKash, Nagad, Rocket, and Internet Banking."
          icon={CreditCard}
          status={formData.store_id ? "connected" : "not_configured"}
          backHref="/admin/payments"
        />

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
          <span>SSLCommerz merchant configuration saved and cached!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary-600" />
            Store Identification & Security Passwords
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Store ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.store_id}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                placeholder="e.g. ecomxbangladesh_live"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Environment Mode</label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              >
                <option value="sandbox">Sandbox (SSLCommerz Test PGW)</option>
                <option value="live">Live / Production Merchant</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <SecretField
                id="sslcommerz_password"
                label="Store Password"
                value={formData.store_password}
                onChange={(val) => setFormData({ ...formData, store_password: val })}
                description="Secret store password from SSLCommerz onboarding team."
                required
              />
            </div>
          </div>
        </div>

        {/* Webhooks & Return URLs */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Webhook className="h-4 w-4 text-primary-600" />
            IPN Instant Payment Notification Endpoints
          </h2>

          <div className="space-y-3">
            <p className="text-xs text-text-secondary">
              Configure this IPN URL in your SSLCommerz Merchant Panel to receive automatic server-to-server transaction validation:
            </p>

            <div className="rounded-xl border border-border bg-surface-secondary p-3 font-mono text-xs text-primary-700 select-all">
              https://ecomxbangladesh.com/api/payments/sslcommerz/ipn
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save SSLCommerz Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
