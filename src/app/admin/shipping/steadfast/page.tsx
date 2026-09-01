"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Save, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export default function SteadfastSettingsPage() {
  const [apiKey, setApiKey] = useState("sf_live_api_key_bangladesh_2026");
  const [secretKey, setSecretKey] = useState("sf_secret_prod_secure_hash");
  const [autoBooking, setAutoBooking] = useState(true);
  const [serviceType, setServiceType] = useState("standard");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Link href="/admin/shipping">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <span>SteadFast Courier Integration</span>
            <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 border border-emerald-200 uppercase font-bold">
              Connected
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Automate parcel booking, generate tracking codes, and sync delivery status across all 64 districts in Bangladesh.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
          <h2 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <Truck className="h-4 w-4 text-primary-600" />
            API & Authentication Settings
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-semibold text-text mb-1">SteadFast API Key</label>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">SteadFast Secret Key</label>
              <input
                type="password"
                required
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Default Delivery Speed</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:border-primary-600 focus:outline-none font-semibold text-text"
              >
                <option value="standard">Standard (24-48h Dhaka / 3-5 days Outside)</option>
                <option value="express">Express Next-Day Delivery</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={autoBooking}
                onChange={(e) => setAutoBooking(e.target.checked)}
                className="h-4 w-4 rounded text-primary-600"
              />
              <span className="text-xs font-semibold text-text">
                Automatically book SteadFast delivery when order status is set to &quot;Confirmed&quot;
              </span>
            </label>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Settings saved!
                </span>
              )}
              <Button type="submit" size="sm" className="ml-auto text-xs">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3 text-xs">
            <h2 className="text-base font-bold text-text border-b border-border pb-2">
              Webhook Callback URL
            </h2>
            <p className="text-text-secondary">
              Paste this URL in your SteadFast merchant portal to automatically sync real-time delivery status (In Transit, Delivered, Returned).
            </p>
            <div className="rounded-xl bg-surface-secondary p-3 font-mono text-[11px] text-text-secondary break-all border border-border">
              http://localhost:3000/api/webhooks/steadfast
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3 text-xs">
            <h3 className="font-bold text-text">Merchant Account Balance</h3>
            <div className="flex justify-between items-center bg-surface-secondary p-3 rounded-xl">
              <span>COD Balance Pending Settlement:</span>
              <strong className="text-emerald-700 font-extrabold text-sm">৳ 45,200</strong>
            </div>
            <p className="text-text-muted text-[11px]">
              Next automatic bank disbursement: Thursday, 12:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
