import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { ShoppingBag, Save, Hash } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Order Settings — Admin Dashboard",
};

export default async function AdminOrderSettingsPage() {
  const settings = await getSettingsByGroup("orders");

  async function handleSave(formData: FormData) {
    "use server";
    const prefix = String(formData.get("order_prefix") || "ORD");
    const autoConfirm = formData.get("auto_confirm") === "on";

    await updateGroupSettings("orders", {
      order_prefix: prefix,
      auto_confirm: autoConfirm,
    });
    revalidatePath("/admin/orders/settings");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Order Processing & Numbering Format"
        description="Configure order sequence prefixes, auto-confirmation rules, and cancellation timeframes."
        iconName="ShoppingBag"
        isCore
      />

      <form action={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary-600" />
            Order Number Prefix & Sequences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Order Prefix Identifier
              </label>
              <input
                type="text"
                name="order_prefix"
                defaultValue={settings.order_prefix || "ORD"}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:border-primary-600 focus:outline-none"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Generated orders will follow: <strong>{settings.order_prefix || "ORD"}-2026-XXXXXX</strong>
              </span>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer w-full mt-2 sm:mt-0">
                <input
                  type="checkbox"
                  name="auto_confirm"
                  defaultChecked={settings.auto_confirm ?? true}
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-semibold text-text block">Auto-Confirm Prepaid Orders</span>
                  <span className="text-text-muted text-[11px]">
                    Moves verified bKash/Card orders directly to Processing.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Order Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
