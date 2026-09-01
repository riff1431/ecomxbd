"use client";

import { useState } from "react";
import { MessageSquare, Save, Send, CheckCircle2, AlertTriangle, KeyRound, Server, Sliders } from "lucide-react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { SecretField } from "@/components/admin/module-settings/secret-field";
import { Button } from "@/components/shared/ui/button";
import { saveSmsProviderConfig, sendTestSms } from "@/features/communication/actions";

interface SmsClientProps {
  initialSettings: any;
}

export function SmsClient({ initialSettings }: SmsClientProps) {
  const [formData, setFormData] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState("01712345678");
  const [testMessage, setTestMessage] = useState("Test SMS alert from ecomXbangladesh admin gateway.");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await saveSmsProviderConfig(formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await sendTestSms(testPhone, testMessage);
      setTestResult(res);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="SMS Gateway & Bulk Dispatch Providers"
        description="Configure dynamic HTTP SMS providers (BulkSMSBD, MIM SMS, Twilio, Onnorokom) for instant OTP, order confirmations, and dispatch alerts."
        icon={MessageSquare}
        status={formData.api_key ? "connected" : "not_configured"}
        backHref="/admin/settings/modules"
      />

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>SMS Gateway credentials saved and encrypted!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Provider Configuration (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Server className="h-4 w-4 text-primary-600" />
              Primary SMS Gateway Gateway
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-text mb-1">Provider Name</label>
                <select
                  value={formData.provider_name}
                  onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
                >
                  <option value="BulkSMSBD">BulkSMSBD (Recommended Bangladesh)</option>
                  <option value="MIMSMS">MIM SMS (Greenweb)</option>
                  <option value="Twilio">Twilio Global</option>
                  <option value="Custom">Custom HTTP Gateway</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">API Endpoint URL</label>
                <input
                  type="url"
                  required
                  value={formData.api_url}
                  onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Approved Sender ID / Masking
                </label>
                <input
                  type="text"
                  required
                  value={formData.sender_id}
                  onChange={(e) => setFormData({ ...formData, sender_id: e.target.value })}
                  placeholder="e.g. 8809612000000 or ecomX"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:border-primary-600 focus:outline-none"
                />
              </div>

              <SecretField
                id="sms_api_key"
                label="SMS API Key"
                value={formData.api_key}
                onChange={(val) => setFormData({ ...formData, api_key: val })}
                description="Secret API authorization key from your SMS portal."
                required
              />

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={saving} size="sm" className="text-xs">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {saving ? "Saving..." : "Save Provider Settings"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Live Test SMS Sender (5 cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSendTestSms} className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <Send className="h-4 w-4 text-primary-600" />
              Live Test SMS Dispatch
            </h2>

            {testResult && (
              <div
                className={`flex items-start gap-2 rounded-xl border p-3 text-[11px] font-semibold ${
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

            <div>
              <label className="block font-semibold text-text mb-1">
                Recipient Mobile (BD)
              </label>
              <input
                type="text"
                required
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Sample SMS Message
              </label>
              <textarea
                rows={3}
                required
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full rounded-xl border border-border bg-white p-3 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                {testMessage.length} characters (1 SMS credit)
              </span>
            </div>

            <Button
              type="submit"
              disabled={sendingTest}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {sendingTest ? "Sending Test SMS..." : "Send Test SMS Now"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
