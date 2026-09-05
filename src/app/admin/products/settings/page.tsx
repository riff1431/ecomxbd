import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Package, Save, Star, Warehouse } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Product & Review Settings — Admin Dashboard",
};

export default async function AdminProductSettingsPage() {
  const settings = await getSettingsByGroup("inventory");
  const reviewSettings = await getSettingsByGroup("reviews");

  async function handleSave(formData: FormData) {
    "use server";
    const lowStock = Number(formData.get("low_stock_threshold") || 5);
    const allowBackorder = formData.get("allow_backorder") === "on";
    const trackInventory = formData.get("track_inventory") === "on";
    const verifiedReviewsOnly = formData.get("verified_reviews_only") === "on";
    const requireApproval = formData.get("require_approval") === "on";

    await updateGroupSettings("inventory", {
      low_stock_threshold: lowStock,
      allow_backorder: allowBackorder,
      track_inventory: trackInventory,
    });

    await updateGroupSettings("reviews", {
      verified_reviews_only: verifiedReviewsOnly,
      require_approval: requireApproval,
    });

    revalidatePath("/admin/products/settings");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Product Catalog & Customer Reviews Settings"
        description="Configure low-stock alert thresholds, inventory backorder behavior, verified buyer badges, and review moderation workflows."
        iconName="Package"
        isCore
      />

      <form action={handleSave} className="space-y-6 text-xs">
        {/* Inventory Rules */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-primary-600" />
            Stock & Inventory Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Low Stock Warning Level
              </label>
              <input
                type="number"
                name="low_stock_threshold"
                defaultValue={settings.low_stock_threshold || 5}
                min={1}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-secondary/50 cursor-pointer">
                <input
                  type="checkbox"
                  name="track_inventory"
                  defaultChecked={settings.track_inventory ?? true}
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <span className="font-semibold text-text">Enable Automated Stock Tracking</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-secondary/50 cursor-pointer">
                <input
                  type="checkbox"
                  name="allow_backorder"
                  defaultChecked={settings.allow_backorder ?? false}
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <span className="font-semibold text-text">Allow Backorders on Zero Stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Review Moderation */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary-600" />
            Customer Review & Rating Moderation
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Require Purchase Verification</span>
                <span className="text-text-muted text-[11px]">
                  Only customers with a completed order can submit product ratings and reviews.
                </span>
              </div>
              <input
                type="checkbox"
                name="verified_reviews_only"
                defaultChecked={reviewSettings.verified_reviews_only ?? true}
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Manual Admin Approval</span>
                <span className="text-text-muted text-[11px]">
                  New reviews must be approved in /admin/reviews before appearing publicly on storefront.
                </span>
              </div>
              <input
                type="checkbox"
                name="require_approval"
                defaultChecked={reviewSettings.require_approval ?? false}
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Product Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
