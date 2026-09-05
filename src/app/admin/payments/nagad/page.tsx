"use client";

import { useState } from "react";
import { Smartphone, Save, RefreshCw, CheckCircle2, AlertTriangle, KeyRound, Sliders } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { SecretField } from "@/components/admin/module-settings/secret-field";
import { Button } from "@/components/shared/ui/button";
import { savePaymentGatewayConfig, testPaymentGatewayConnection } from "@/features/payments/actions";

export default function AdminNagadPage() {
  const [formData, setFormData] = useState({
    merchant_id: "",
    merchant_number: "",
    public_key: "",
    private_key: "",
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
      await savePaymentGatewayConfig("nagad", {
        merchant_id: { value: formData.merchant_id, valueType: "string" },
        merchant_number: { value: formData.merchant_number, valueType: "string" },
        public_key: { value: formData.public_key, valueType: "string" },
        private_key: { value: formData.private_key, isSecret: true },
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
      const res = await testPaymentGatewayConnection("nagad");
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <ModuleHeader
          title="Nagad Mobile Payment Gateway"
          description="Direct wallet payments via Nagad PGW encryption keys and instant transaction verification."
          icon={Smartphone}
          status={formData.merchant_id ? "connected" : "not_configured"}
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
          <span>Nagad merchant settings saved and encrypted!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary-600" />
            Nagad PGW Credentials & Encryption Keys
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Merchant ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.merchant_id}
                onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
                placeholder="e.g. 683920194829102"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Merchant Account Number (Wallet)
              </label>
              <input
                type="text"
                value={formData.merchant_number}
                onChange={(e) => setFormData({ ...formData, merchant_number: e.target.value })}
                placeholder="017XXXXXXXX"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text mb-1">Nagad Public Key (PGW)</label>
              <textarea
                rows={2}
                value={formData.public_key}
                onChange={(e) => setFormData({ ...formData, public_key: e.target.value })}
                placeholder="-----BEGIN PUBLIC KEY-----..."
                className="w-full rounded-xl border border-border bg-white p-3 text-xs font-mono text-text focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <SecretField
                id="nagad_private_key"
                label="Merchant Private Key (RSA)"
                value={formData.private_key}
                onChange={(val) => setFormData({ ...formData, private_key: val })}
                description="Used for digital signing of payment requests. Stored with AES-256-GCM encryption."
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving Changes..." : "Save Nagad Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
