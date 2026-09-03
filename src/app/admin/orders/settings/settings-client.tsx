"use client";

import { useState } from "react";
import {
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Save,
  CheckCircle2,
  Clock,
  Package,
  Loader2,
  MessageSquare,
  Gift,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { savePostPurchaseConfig, type PostPurchaseConfig } from "@/features/automation/post-purchase-actions";

export default function OrderAutomationSettingsClient({
  initialConfig,
}: {
  initialConfig: PostPurchaseConfig;
}) {
  const [form, setForm] = useState<PostPurchaseConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await savePostPurchaseConfig(form);
    if (res.success) {
      setMsg("Order automation rules & post-purchase sequences saved successfully!");
      setTimeout(() => setMsg(null), 3500);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#e91e63]" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Order Automation & Workflow Control
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure automatic courier dispatching, post-purchase replenishment reminders, and return auto-restock triggers.
          </p>
        </div>
      </div>

      {msg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Courier Automation Rules */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Truck className="h-4 w-4 text-emerald-600" /> 1-Click & Auto Courier Dispatch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoDispatchOnConfirm}
                  onChange={(e) => setForm({ ...form, autoDispatchOnConfirm: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                />
                <div>
                  <span className="font-bold text-gray-900 block">Auto-Book on Status 'Confirmed'</span>
                  <span className="text-[11px] text-gray-500">
                    Generates courier consignment & tracking ID immediately upon confirmation.
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">Default Courier Partner</label>
              <select
                value={form.defaultCourier}
                onChange={(e) => setForm({ ...form, defaultCourier: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-[#e91e63] focus:bg-white focus:outline-none"
              >
                <option value="steadfast">SteadFast Courier (Recommended)</option>
                <option value="pathao">Pathao Express</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Warehouse & Returns Restock Automation */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <RotateCcw className="h-4 w-4 text-indigo-600" /> Returns (RTO) & Inventory Synchronization
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2 sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoRestockOnReturn}
                  onChange={(e) => setForm({ ...form, autoRestockOnReturn: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                />
                <div>
                  <span className="font-bold text-gray-900 block">Auto-Restock Products on Parcel Return</span>
                  <span className="text-[11px] text-gray-500">
                    When courier webhook returns status 'returned' / 'cancelled', automatically restores inventory on-hand count.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Post-Purchase Engagement & Skincare Replenishment */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="h-4 w-4 text-[#e91e63]" /> Post-Purchase & Replenishment Automation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Product Review Request Delay
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={form.reviewRequestDays}
                  onChange={(e) => setForm({ ...form, reviewRequestDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 font-bold font-mono text-gray-900 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
                <span className="text-xs font-bold text-gray-500 shrink-0">Days after Delivery</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Skincare Restock Reminder
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={form.replenishmentDays}
                  onChange={(e) => setForm({ ...form, replenishmentDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 font-bold font-mono text-gray-900 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
                <span className="text-xs font-bold text-gray-500 shrink-0">Days</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5 block">e.g. 45 days for 50ml serums</span>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Auto Loyalty Cashback Points
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={form.autoLoyaltyPoints}
                  onChange={(e) => setForm({ ...form, autoLoyaltyPoints: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 font-bold font-mono text-gray-900 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
                <span className="text-xs font-bold text-gray-500 shrink-0">Points</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5 block">Credited on status 'delivered'</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#e91e63] hover:bg-[#d81b60] text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
            Save Automation Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
