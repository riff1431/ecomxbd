"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export default function PathaoSettingsPage() {
  const [clientId, setClientId] = useState("pathao_client_id_live_2026");
  const [clientSecret, setClientSecret] = useState("pathao_secret_key_prod");
  const [storeId, setStoreId] = useState("store_gulshan_hq_101");
  const [autoBooking, setAutoBooking] = useState(false);
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
            <span>Pathao Courier Integration</span>
            <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 border border-emerald-200 uppercase font-bold">
              Active
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Configure Pathao Merchant API for automated parcel pickup and doorstep delivery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
          <h2 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <Truck className="h-4 w-4 text-primary-600" />
            Pathao Merchant Credentials
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-semibold text-text mb-1">Pathao Client ID</label>
              <input
                type="text"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Pathao Client Secret</label>
              <input
                type="password"
                required
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Default Pickup Store ID</label>
              <input
                type="text"
                required
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={autoBooking}
                onChange={(e) => setAutoBooking(e.target.checked)}
                className="h-4 w-4 rounded text-primary-600"
              />
              <span className="text-xs font-semibold text-text">
                Auto-create Pathao pickup request when order is packed
              </span>
            </label>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Pathao settings saved!
                </span>
              )}
              <Button type="submit" size="sm" className="ml-auto text-xs">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save Settings
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3 text-xs">
            <h2 className="text-base font-bold text-text border-b border-border pb-2">
              Pathao Webhook URL
            </h2>
            <p className="text-text-secondary">
              Add this callback URL in your Pathao Developer Console to receive instant parcel status updates.
            </p>
            <div className="rounded-xl bg-surface-secondary p-3 font-mono text-[11px] text-text-secondary break-all border border-border">
              http://localhost:3000/api/webhooks/pathao
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
